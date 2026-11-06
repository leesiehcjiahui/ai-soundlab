import {describe,it,expect,vi,afterEach} from 'vitest';
import {handle,type Env} from '../proxy/src/index';
import {encodeWav,validateWav,VOICE_RATE,VOICE_BYTES} from '../shared/voice';
import {signFeedback} from '../proxy/src/voice';
const origin='http://127.0.0.1:5173';
const secret='test-only-secret-at-least-32-characters';
function env(status=200):Env{return {AI_ENABLED:'true',VOICE_ENABLED:'true',OPENAI_API_KEY:'fake',IP_HASH_SECRET:secret,ALLOWED_ORIGINS:origin,PUBLIC_PER_MINUTE:'12',IP_PER_MINUTE:'20',DAILY_LIMIT:'200',MONTHLY_LIMIT:'2000',QUOTA:{idFromName:(name:string)=>name,get:()=>({fetch:vi.fn(async()=>new Response('{}',{status}))})} as unknown as Env['QUOTA']};}
function request(body:BodyInit,path='transcribe',type='audio/wav',from=origin){return new Request(`https://proxy.test/api/${path}`,{method:'POST',headers:{Origin:from,'Content-Type':type},body});}
const wav=()=>encodeWav(new Float32Array(VOICE_RATE)).buffer as ArrayBuffer;
afterEach(()=>vi.useRealTimers());
describe('voice boundary',()=>{
 it('accepts canonical PCM and enforces actual 30-second duration and headers',()=>{
  expect(()=>validateWav(encodeWav(new Float32Array(VOICE_RATE*30)))).not.toThrow();
  for(const bytes of [new Uint8Array(),encodeWav(new Float32Array(VOICE_RATE*31)),new Uint8Array(100)])expect(()=>validateWav(bytes)).toThrow();
  const bytes=encodeWav(new Float32Array(20));bytes[24]=0;expect(()=>validateWav(bytes)).toThrow();
 });
 it('fails closed when disabled, wrong origin, method, MIME, oversize or invalid bytes',async()=>{
  const provider=vi.fn();
  expect((await handle(request(wav()),{...env(),VOICE_ENABLED:'false'},provider)).status).toBe(503);
  expect((await handle(request(wav(),'transcribe','audio/wav','https://evil.test'),env(),provider)).status).toBe(403);
  expect((await handle(request(wav(),'transcribe','audio/webm'),env(),provider)).status).toBe(415);
  expect((await handle(request(new Uint8Array(VOICE_BYTES+1)),env(),provider)).status).toBe(413);
  expect((await handle(request(new Uint8Array(100)),env(),provider)).status).toBe(400);
  expect(provider).not.toHaveBeenCalled();
 });
 it.each(['Pembaris bergetar.','The ruler vibrates.','Bunyi travel dalam air.'])('returns editable transcript unchanged: %s',async text=>{
  const provider=vi.fn(async(_url:RequestInfo|URL,init?:RequestInit)=>{const form=init!.body as FormData;expect(form.get('model')).toBe('gpt-transcribe');expect(form.getAll('languages[]')).toEqual(['ms','en']);expect((form.get('file') as File).size).toBe(32044);return Response.json({text});});
  const response=await handle(request(wav()),env(),provider);expect(response.status).toBe(200);expect(await response.json()).toEqual({text});
 });
 it.each(['','x'.repeat(401),'<script>plain text</script>'])('validates transcript bounds and keeps markup as text %#',async text=>{
  const response=await handle(request(wav()),env(),async()=>Response.json({text}));expect(response.status).toBe(text.startsWith('<')?200:502);
 });
 it.each([429,503])('does not call provider after quota failure %i',async status=>{const provider=vi.fn();expect((await handle(request(wav()),env(status),provider)).status).toBe(status);expect(provider).not.toHaveBeenCalled();});
 it('speech requires a recent unmodified origin-bound feedback grant',async()=>{
  const grant=await signFeedback('Getaran menghasilkan bunyi.','bm',origin,secret);
  const provider=vi.fn(async(_url:RequestInfo|URL,init?:RequestInit)=>{expect(JSON.parse(init!.body as string).input).toBe(grant.text);return new Response(new Uint8Array([1,2]),{headers:{'Content-Type':'audio/mpeg'}});});
  const response=await handle(request(JSON.stringify(grant),'speech','application/json'),env(),provider);expect(response.status).toBe(200);expect(response.headers.get('Cache-Control')).toBe('no-store');
  for(const invalid of [{...grant,text:'Different answer'}, {...grant,language:'en'}, {...grant,expires:Date.now()-1}, {...grant,url:'https://evil.test'}, {text:'arbitrary'}])expect((await handle(request(JSON.stringify(invalid),'speech','application/json'),env(),provider)).status).toBe(400);
  expect(provider).toHaveBeenCalledOnce();
 });
 it('returns redacted provider failures and timeout without retry',async()=>{
  expect(await (await handle(request(wav()),env(),async()=>new Response('secret',{status:401}))).text()).not.toContain('secret');
  vi.useFakeTimers();const provider=vi.fn(async(_url:RequestInfo|URL,init?:RequestInit)=>new Promise<Response>((_,reject)=>init!.signal!.addEventListener('abort',()=>reject(Error('abort')))));
  const pending=handle(request(wav()),env(),provider);await vi.waitFor(()=>expect(provider).toHaveBeenCalledOnce());await vi.advanceTimersByTimeAsync(20_001);expect((await pending).status).toBe(504);
 });
 it('aborts slow response streams within the same deadline',async()=>{
  vi.useFakeTimers();const provider=vi.fn(async()=>new Response(new ReadableStream({start(){}})));
  const pending=handle(request(wav()),env(),provider);await vi.waitFor(()=>expect(provider).toHaveBeenCalledOnce());await vi.advanceTimersByTimeAsync(20_001);expect((await pending).status).toBe(504);
 });
 it('issues speech grants only for validated POC feedback without changing marking',async()=>{
  const result=await handle(request(JSON.stringify({language:'bm',mission:'vibration',stage:'predict',answer:'Ya, kerana getaran.'}),'stage-guidance','application/json'),env(),async()=>Response.json({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({partA:true,partB:true,feedback:'Ramalan kamu boleh diuji.'})}]}]}));
  expect(result.status).toBe(200);const data=await result.json() as {feedback:string;speechGrant:{text:string};score:number};expect(data.speechGrant.text).toBe(data.feedback);expect(data.score).toBe(2);
 });
});
