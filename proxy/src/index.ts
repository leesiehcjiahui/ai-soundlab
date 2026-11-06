/// <reference types="@cloudflare/workers-types" />
import {signFeedback,voiceRoute} from './voice';
import { MAX_BODY_BYTES } from '../../shared/contract';
import {parseAssessmentInput,type AssessmentInput} from '../../shared/assessment';
import {parseStageInput,type StageInput} from '../../shared/stage-guidance';
import {buildAssessmentPrompt,renderAssessmentMarking} from './assessment';
import {buildStagePrompt,renderStageMarking} from './stage-guidance';
import { reserve, type CounterState, type Limits } from './quota';
export interface Env {
  OPENAI_API_KEY?: string; IP_HASH_SECRET?: string;
  VOICE_ENABLED?: string;
  AI_ENABLED: string; ALLOWED_ORIGINS: string;
  PUBLIC_PER_MINUTE: string; IP_PER_MINUTE: string; DAILY_LIMIT: string; MONTHLY_LIMIT: string;
  QUOTA: DurableObjectNamespace;
}
const encoder = new TextEncoder();
function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers } });
}
function limit(value: string, ceiling: number): number {
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 1 || n > ceiling) throw new Error('bad_config');
  return n;
}
function limits(env: Env): Limits {
  return { classMinute: limit(env.PUBLIC_PER_MINUTE, 60), ipMinute: limit(env.IP_PER_MINUTE, 120), day: limit(env.DAILY_LIMIT, 1000), month: limit(env.MONTHLY_LIMIT, 10000) };
}
export async function readCapped(body: ReadableStream<Uint8Array> | null, cap: number): Promise<string> {
  if (!body) throw new Error('invalid_body');
  const reader = body.getReader(); let total = 0; const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      total += value.byteLength;
      if (total > cap) { await reader.cancel(); throw new Error('too_large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const joined = new Uint8Array(total); let offset = 0;
  for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder('utf-8', { fatal: true }).decode(joined);
}
async function ipHash(ip: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(`${new Date().toISOString().slice(0, 10)}:${ip}`));
  return Array.from(new Uint8Array(signed), b => b.toString(16).padStart(2, '0')).join('');
}
export async function handle(request: Request, env: Env, upstream: typeof fetch = fetch): Promise<Response> {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
  if (!origin || origin === 'null' || !allowed.includes(origin)) return json({ error: 'origin_denied' }, 403);
  const cors = { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' };
  const reply = (data: unknown, status = 200, extra = {}) => json(data, status, { ...cors, ...extra });
  const path = new URL(request.url).pathname;
  if (!['/api/health', '/api/stage-guidance', '/api/assessment', '/api/transcribe', '/api/speech'].includes(path)) return reply({ error: 'not_found' }, 404);
  if (request.method === 'OPTIONS' && path !== '/api/health') {
    const method = request.headers.get('Access-Control-Request-Method');
    const headers = (request.headers.get('Access-Control-Request-Headers') ?? '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    if (method !== 'POST' || headers.some(h => h !== 'content-type')) return reply({ error: 'preflight_denied' }, 403);
    return new Response(null, { status: 204, headers: { ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' } });
  }
  if (path === '/api/health') return request.method === 'GET' ? reply({ status: 'ok', aiEnabled: env.AI_ENABLED === 'true' }) : reply({ error: 'method_denied' }, 405);
  if (request.method !== 'POST') return reply({ error: 'method_denied' }, 405);
  if (env.AI_ENABLED !== 'true') return reply({ error: 'ai_disabled' }, 503);
  if (!env.OPENAI_API_KEY || !env.IP_HASH_SECRET || env.IP_HASH_SECRET.length < 32) return reply({ error: 'server_not_configured' }, 503);
  if (path === '/api/transcribe' || path === '/api/speech') return voiceRoute(request, env, cors, upstream);
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reply({ error: 'json_required' }, 415);
  if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES) return reply({ error: 'too_large' }, 413);
  let input:StageInput|AssessmentInput;
  try { const data:unknown=JSON.parse(await readCapped(request.body, MAX_BODY_BYTES));input=path==='/api/assessment'?parseAssessmentInput(data):parseStageInput(data); }
  catch (error) { return reply({ error: error instanceof Error && error.message === 'too_large' ? 'too_large' : 'invalid_schema' }, error instanceof Error && error.message === 'too_large' ? 413 : 400); }
  try {
    const budget = limits(env); const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
    const stub = env.QUOTA.get(env.QUOTA.idFromName('global-v1'));
    const quotaResponse = await stub.fetch('https://quota.internal/reserve', { method: 'POST', body: JSON.stringify({ limits: budget, classId: 'public-v1', ipId: await ipHash(ip, env.IP_HASH_SECRET) }) });
    if (quotaResponse.status === 429) return reply({ error: 'quota_exceeded', reset: 'minute/day/month UTC limits apply' }, 429, { 'Retry-After': '60' });
    if (!quotaResponse.ok) return reply({ error: 'quota_unavailable' }, 503);
  } catch { return reply({ error: 'quota_unavailable' }, 503); }
  const abort = new AbortController(); const timer = setTimeout(() => abort.abort(), 20000);
  try {
    const prompt=path==='/api/assessment'?buildAssessmentPrompt(input as AssessmentInput):buildStagePrompt(input as StageInput);
    const response = await upstream('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(prompt), signal: abort.signal });
    if (!response.ok) { await response.body?.cancel(); return reply({ error: 'ai_unavailable' }, 502); }
    const data = JSON.parse(await readCapped(response.body, 32768)) as { status?: string; output?: { type?: string; content?: { type?: string; text?: string }[] }[] };
    if (data.status !== 'completed' || !Array.isArray(data.output)) return reply({ error: 'ai_response_invalid' }, 502);
    const selection = data.output.filter(o => o.type === 'message').flatMap(o => o.content ?? []).filter(c => c.type === 'output_text').map(c => c.text ?? '').join('\n').trim();
    let rendered;
    try { rendered = path==='/api/assessment'?renderAssessmentMarking(selection,input as AssessmentInput):renderStageMarking(selection,input as StageInput); } catch { return reply({ error: 'ai_response_invalid' }, 502); }
    if (env.VOICE_ENABLED === 'true' && path === '/api/stage-guidance' && (input as StageInput).mission === 'vibration' && (input as StageInput).stage === 'predict') {
      return reply({...rendered, speechGrant: await signFeedback((rendered as import('../../shared/stage-guidance').StageResult).feedback, input.language, origin, env.IP_HASH_SECRET)});
    }
    return reply(rendered);
  } catch { return reply({ error: abort.signal.aborted ? 'ai_timeout' : 'ai_unavailable' }, 502); }
  finally { clearTimeout(timer); }
}
export default { fetch(request: Request, env: Env) { return handle(request, env); } };
export class QuotaCoordinator implements DurableObject {
  constructor(private readonly state: DurableObjectState) {}
  async alarm() {
    const entries = await this.state.storage.list<number>({prefix:'used:'});
    for (const [id,expiry] of entries) if(expiry <= Date.now()) await this.state.storage.delete(id);
    const leases = await this.state.storage.list<{expires:number}>({prefix:'lease:'});
    for (const [id,value] of leases) if(value.expires <= Date.now()) await this.state.storage.delete(id);
    if(entries.size || leases.size) await this.state.storage.setAlarm(Date.now()+300_000);
  }
  async fetch(request: Request): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (request.method === 'POST' && path === '/release') {
      const {lease} = await request.json() as {lease:string};
      await this.state.storage.delete(`lease:${lease}`); return json({released:true});
    }
    if (request.method !== 'POST' || path !== '/reserve') return json({ error: 'not_found' }, 404);
    try {
      const { limits: budget, classId, ipId, nonce, lease } = await request.json() as { limits: Limits; classId: string; ipId: string; nonce?: string; lease?: string };
      const accepted = await this.state.storage.transaction(async transaction => {
        if (lease) {
          const active = await transaction.list<{ipId:string;expires:number}>({prefix:'lease:'});
          const live = [...active.values()].filter(v=>v.expires>Date.now());
          if (live.length>=4 || live.some(v=>v.ipId===ipId)) return false;
        }
        if (nonce && await transaction.get(`used:${nonce}`)) return false;
        const next = reserve(await transaction.get<CounterState>('counters'), budget, classId, ipId);
        if (!next) return false;
        await transaction.put('counters', next);
        if (lease) { await transaction.put(`lease:${lease}`, {ipId,expires:Date.now()+30_000}); await transaction.setAlarm(Date.now()+300_000); }
        if (nonce) { await transaction.put(`used:${nonce}`, Date.now()+300_000); await transaction.setAlarm(Date.now()+300_000); }
        return true;
      });
      return json({ accepted }, accepted ? 200 : 429);
    } catch { return json({ error: 'quota_unavailable' }, 503); }
  }
}
