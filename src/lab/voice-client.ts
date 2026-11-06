import {proxyUrl} from '../poc/client';
import type {SpeechGrant} from '../../shared/voice';
export const voiceEnabled = import.meta.env.VITE_VOICE_POC === 'true';
export async function voiceRequest(path:'transcribe'|'speech',body:Blob|SpeechGrant,signal:AbortSignal):Promise<Response>{
 const response=await fetch(`${proxyUrl()}/api/${path}`,{method:'POST',headers:{'Content-Type':path==='speech'?'application/json':'audio/wav'},body:body instanceof Blob?body:JSON.stringify(body),signal});
 if(!response.ok)throw Error('voice_unavailable');return response;
}
// One owner at a time, including permission-pending and paused playback.
let stopOwner:(()=>void)|undefined;
export function claimVoice(stop:()=>void){if(stopOwner!==stop)stopOwner?.();stopOwner=stop;return()=>{if(stopOwner===stop)stopOwner=undefined;};}
