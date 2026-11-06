import {VOICE_BYTES,validateWav,type SpeechGrant} from '../../shared/voice';
import type {Env} from './index';
const encoder = new TextEncoder();
const headers = {'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
async function key(secret:string) { return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']); }
function payload(grant:Omit<SpeechGrant,'signature'>, origin:string) { return encoder.encode(JSON.stringify([origin,grant.text,grant.language,grant.expires,grant.nonce])); }
export async function signFeedback(text:string,language:'bm'|'en',origin:string,secret:string):Promise<SpeechGrant> {
 const grant={text,language,expires:Date.now()+5*60_000,nonce:crypto.randomUUID()};
 const signature=await crypto.subtle.sign('HMAC',await key(secret),payload(grant,origin));
 return {...grant,signature:Array.from(new Uint8Array(signature),b=>b.toString(16).padStart(2,'0')).join('')};
}
async function verify(value:unknown,origin:string,secret:string):Promise<SpeechGrant> {
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('invalid_grant');
 const g=value as SpeechGrant;
 if(Object.keys(g).sort().join(',')!=='expires,language,nonce,signature,text'||typeof g.text!=='string'||!g.text.trim()||g.text.length>600||!['bm','en'].includes(g.language)||!Number.isSafeInteger(g.expires)||g.expires<Date.now()||g.expires>Date.now()+300_000||typeof g.nonce!=='string'||!/^[a-f0-9-]{36}$/.test(g.nonce)||typeof g.signature!=='string'||!/^[a-f0-9]{64}$/.test(g.signature))throw Error('invalid_grant');
 const sig=Uint8Array.from(g.signature.match(/../g)!,x=>parseInt(x,16));
 if(!await crypto.subtle.verify('HMAC',await key(secret),sig,payload(g,origin)))throw Error('invalid_grant');
 return g;
}
export async function readBytes(body:ReadableStream<Uint8Array>|null,cap:number,signal?:AbortSignal):Promise<Uint8Array> {
 if(signal?.aborted)throw Error('timeout');
 if(!body)throw Error('invalid_body');
 const reader=body.getReader(),chunks:Uint8Array[]=[];let size=0;
 const cancel=()=>{void reader.cancel().catch(()=>{});};signal?.addEventListener('abort',cancel,{once:true});
 try {while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>cap){await reader.cancel();throw Error('too_large');}chunks.push(value);}}
 finally {signal?.removeEventListener('abort',cancel);reader.releaseLock();}
 if(signal?.aborted)throw Error('timeout');
 const result=new Uint8Array(size);let offset=0;for(const c of chunks){result.set(c,offset);offset+=c.length;}return result;
}
export async function voiceRoute(request:Request,env:Env,cors:Record<string,string>,upstream:typeof fetch):Promise<Response> {
 const reply=(error:string,status:number)=>new Response(JSON.stringify({error}),{status,headers:{...headers,...cors,'Content-Type':'application/json'}});
 if(env.VOICE_ENABLED!=='true')return reply('voice_disabled',503);
 // Temporary Speech API POC expires before its published retirement. Never silently migrate workflow.
 if(Date.now()>=Date.UTC(2027,0,6))return reply('voice_model_retired',503);
 const speech=new URL(request.url).pathname==='/api/speech';
 const cap=speech?4096:VOICE_BYTES;
 if(Number(request.headers.get('Content-Length'))>cap)return reply('too_large',413);
 if(request.headers.get('Content-Type')!== (speech?'application/json':'audio/wav'))return reply('unsupported_type',415);
 const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),20_000);
 const disconnect=()=>abort.abort();request.signal.addEventListener('abort',disconnect,{once:true});
 let grant:SpeechGrant|undefined,bytes:Uint8Array;
 try {
  // Include slow upload in timeout; cancel the read as well as the upstream request.
  bytes=await readBytes(request.body,cap,abort.signal);
  if(speech)grant=await verify(JSON.parse(new TextDecoder().decode(bytes)),request.headers.get('Origin')!,env.IP_HASH_SECRET!);
  else validateWav(bytes);
 } catch(error) {clearTimeout(timer);request.signal.removeEventListener('abort',disconnect);return reply(abort.signal.aborted?'voice_timeout':error instanceof Error&&error.message==='too_large'?'too_large':'invalid_audio_or_grant',abort.signal.aborted?504:error instanceof Error&&error.message==='too_large'?413:400);}
 let quota:DurableObjectStub|undefined;const lease=crypto.randomUUID();let reservedLease=false;
 try {
  const ip=request.headers.get('CF-Connecting-IP')??'local';
  const ipDigest=await crypto.subtle.sign('HMAC',await key(env.IP_HASH_SECRET!),encoder.encode(`${new Date().toISOString().slice(0,10)}:${ip}`));
  const ipId=Array.from(new Uint8Array(ipDigest),b=>b.toString(16).padStart(2,'0')).join('');
  const stub=env.QUOTA.get(env.QUOTA.idFromName(speech?'voice-tts-v1':'voice-stt-v1'));
  quota=stub;
  // Fixed conservative POC ceilings cannot be raised via a public request.
  const reserved=await stub.fetch('https://quota.internal/reserve',{method:'POST',body:JSON.stringify({limits:{classMinute:4,ipMinute:2,day:20,month:100},classId:'voice',ipId,nonce:grant?.nonce,lease})});
  if(!reserved.ok)return reply(reserved.status===429?'quota_exceeded':'quota_unavailable',reserved.status===429?429:503);
  reservedLease=true;
  let body:BodyInit;
  if(speech)body=JSON.stringify({model:'gpt-4o-mini-tts',voice:'coral',input:grant!.text,response_format:'mp3',instructions:grant!.language==='bm'?'Read the input verbatim in Malay.':'Read the input verbatim in English.'});
  else {const form=new FormData();form.set('file',new Blob([bytes.slice().buffer],{type:'audio/wav'}),'answer.wav');form.set('model','gpt-transcribe');form.append('languages[]','ms');form.append('languages[]','en');body=form;}
  const response=await upstream(`https://api.openai.com/v1/audio/${speech?'speech':'transcriptions'}`,{method:'POST',headers:{Authorization:`Bearer ${env.OPENAI_API_KEY}`,...(speech?{'Content-Type':'application/json'}:{})},body,signal:abort.signal});
  if(!response.ok){await response.body?.cancel();return reply('voice_unavailable',502);}
  const output=await readBytes(response.body,speech?2_000_000:8192,abort.signal);
  if(speech){if(!output.length||!response.headers.get('Content-Type')?.startsWith('audio/'))return reply('voice_response_invalid',502);return new Response(output.slice().buffer,{headers:{...headers,...cors,'Content-Type':'audio/mpeg'}});}
  const data=JSON.parse(new TextDecoder().decode(output)) as {text?:unknown};
  if(typeof data.text!=='string'||!data.text.trim()||data.text.length>400||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(data.text))return reply('voice_response_invalid',502);
  return new Response(JSON.stringify({text:data.text.trim()}),{headers:{...headers,...cors,'Content-Type':'application/json'}});
 } catch {return reply(abort.signal.aborted?'voice_timeout':'voice_unavailable',abort.signal.aborted?504:502);}
 finally {clearTimeout(timer);request.signal.removeEventListener('abort',disconnect);if(reservedLease)await quota?.fetch('https://quota.internal/release',{method:'POST',body:JSON.stringify({lease})}).catch(()=>{});}
}
