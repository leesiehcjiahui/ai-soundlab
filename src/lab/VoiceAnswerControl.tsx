import {useEffect,useRef,useState} from 'react';
import type {Language} from '../../shared/contract';
import {encodeWav,VOICE_RATE,VOICE_SECONDS} from '../../shared/voice';
import {claimVoice,voiceRequest} from './voice-client';
export function VoiceAnswerControl({language,value,onTranscript,fieldId}:{language:Language;value:string;onTranscript:(text:string)=>void;fieldId:string}){
 const [state,setState]=useState<'idle'|'permission'|'recording'|'loading'>('idle'),[message,setMessage]=useState(''),[seconds,setSeconds]=useState(0);
 const cancelRef=useRef<()=>void>(()=>{}),stopRef=useRef<()=>void>(()=>{}),current=useRef(value);
 current.current=value;
 useEffect(()=>{const cancel=()=>cancelRef.current();document.addEventListener('visibilitychange',cancel);window.addEventListener('pagehide',cancel);return()=>{cancel();document.removeEventListener('visibilitychange',cancel);window.removeEventListener('pagehide',cancel);};},[language]);
 async function start(){
  cancelRef.current();let cancelled=false,finished=false,stream:MediaStream|undefined,context:AudioContext|undefined,node:ScriptProcessorNode|undefined,source:MediaStreamAudioSourceNode|undefined;
  let timer:ReturnType<typeof setInterval>|undefined,timeout:ReturnType<typeof setTimeout>|undefined;const controller=new AbortController();
  const chunks:Float32Array[]=[];let size=0;const original=current.current;
  const cleanup=()=>{clearInterval(timer);clearTimeout(timeout);stream?.getTracks().forEach(t=>t.stop());if(node){node.onaudioprocess=null;node.disconnect();}source?.disconnect();void context?.close().catch(()=>{});};
  let release=()=>{};
  const cancel=()=>{cancelled=true;controller.abort();cleanup();chunks.length=0;release();setState('idle');};
  release=claimVoice(cancel);cancelRef.current=cancel;setState('permission');setMessage('');
  try{
   if(!navigator.mediaDevices?.getUserMedia)throw Error('unsupported');
   // Create/resume in the user gesture, before permission resolves (mobile audio policy).
   context=new AudioContext({sampleRate:VOICE_RATE});await context.resume();
   timeout=setTimeout(cancel,15_000);
   stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true},video:false});
   clearTimeout(timeout);if(cancelled){cleanup();return;}
   if(context.sampleRate!==VOICE_RATE)throw Error('unsupported_rate');
   source=context.createMediaStreamSource(stream);node=context.createScriptProcessor(4096,1,1);
   const finish=async()=>{
    if(cancelled||finished)return;finished=true;cleanup();setState('loading');
    try{
     if(!size)throw Error('empty');const samples=new Float32Array(size);let offset=0;for(const chunk of chunks){samples.set(chunk,offset);offset+=chunk.length;}chunks.length=0;
     timeout=setTimeout(()=>controller.abort(),25_000);
     const response=await voiceRequest('transcribe',new Blob([encodeWav(samples).buffer as ArrayBuffer],{type:'audio/wav'}),controller.signal);
     const data=await response.json() as {text?:unknown};
     if(typeof data.text!=='string'||!data.text.trim()||data.text.length>400)throw Error('invalid');
     if(cancelled)return;
     if(current.current!==original){setMessage(language==='bm'?'Jawapan telah diubah. Rakaman dibuang supaya tulisan kamu kekal.':'Your answer changed. Recording discarded to keep your edits.');return;}
     onTranscript(data.text);document.getElementById(fieldId)?.focus();setMessage(language==='bm'?'Semak dan sunting perkataan, kemudian tekan Semak jawapan.':'Review and edit the words, then press Check answer.');
    }catch{if(!cancelled)setMessage(language==='bm'?'Audio tidak tersedia. Taip jawapan kamu atau cuba lagi.':'Audio unavailable. Type your answer or try again.');}
    finally{clearTimeout(timeout);release();if(!cancelled)setState('idle');}
   };
   stopRef.current=()=>void finish();
   node.onaudioprocess=e=>{if(cancelled)return;const input=e.inputBuffer.getChannelData(0),remaining=VOICE_SECONDS*VOICE_RATE-size;const chunk=input.slice(0,remaining);chunks.push(chunk);size+=chunk.length;if(size>=VOICE_SECONDS*VOICE_RATE)void finish();};
   source.connect(node);node.connect(context.destination);setState('recording');setSeconds(0);
   const began=Date.now();timer=setInterval(()=>setSeconds(Math.min(30,Math.floor((Date.now()-began)/1000))),250);timeout=setTimeout(()=>void finish(),30_000);
  }catch{cleanup();release();if(!cancelled){setState('idle');setMessage(language==='bm'?'Mikrofon tidak tersedia atau kebenaran ditolak. Taip jawapan kamu.':'Microphone unavailable or permission denied. Type your answer.');}}
 }
 return <div className="voice-control"><p className="small">{language==='bm'?'Pilihan: rakam jawapan hingga 30 saat. Audio dihantar melalui pelayan kepada OpenAI untuk transkripsi. Jangan sebut nama. Semak teks sebelum menghantar.':'Optional: dictate for up to 30 seconds. Audio is sent through the server to OpenAI for transcription. Leave out names. Review the text before submitting.'}</p><div className="voice-actions">{state==='idle'?<button type="button" className="button secondary" onClick={()=>void start()}>{language==='bm'?'Jawab dengan suara':'Answer by voice'}</button>:<>{state==='recording'?<button type="button" className="button secondary" onClick={()=>stopRef.current()}>{language==='bm'?'Henti':'Stop'} ({seconds}/30s)</button>:null}<button type="button" className="text-button" onClick={()=>cancelRef.current()}>{language==='bm'?'Batal':'Cancel'}</button></>}</div><p role="status" aria-live="polite">{state==='permission'?(language==='bm'?'Menunggu kebenaran mikrofon…':'Waiting for microphone permission…'):state==='recording'?(language==='bm'?'Merakam jawapan…':'Recording answer…'):state==='loading'?(language==='bm'?'Menukar suara kepada teks…':'Transcribing…'):message}</p></div>;
}
