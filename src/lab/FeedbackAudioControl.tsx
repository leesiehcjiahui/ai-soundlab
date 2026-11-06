import {useCallback,useEffect,useRef,useState} from 'react';
import type {Language} from '../../shared/contract';
import type {SpeechGrant} from '../../shared/voice';
import {claimVoice,voiceRequest} from './voice-client';
export function FeedbackAudioControl({language,text,grant}:{language:Language;text:string;grant:SpeechGrant}){
 const [state,setState]=useState<'idle'|'loading'|'playing'|'paused'>('idle'),[error,setError]=useState(false);
 const audio=useRef<HTMLAudioElement|null>(null),url=useRef(''),abort=useRef<AbortController|null>(null),release=useRef(()=>{}),busy=useRef(false);
 const stop=useCallback(()=>{abort.current?.abort();abort.current=null;busy.current=false;audio.current?.pause();if(audio.current)audio.current.currentTime=0;setState('idle');release.current();},[]);
 useEffect(()=>{const hidden=()=>stop();document.addEventListener('visibilitychange',hidden);window.addEventListener('pagehide',hidden);return()=>{stop();if(url.current)URL.revokeObjectURL(url.current);url.current='';audio.current=null;document.removeEventListener('visibilitychange',hidden);window.removeEventListener('pagehide',hidden);};},[text,language,grant.signature]);
 async function play(replay=false){
  if(busy.current)return;
  if(state==='playing'&&!replay){audio.current?.pause();setState('paused');return;}
  release.current=claimVoice(stop);setError(false);
  const controller=new AbortController();abort.current=controller;busy.current=true;
  const timer=setTimeout(()=>controller.abort(),25_000);
  try{
   if(grant.text!==text||grant.language!==language)throw Error('feedback_mismatch');
   if(!audio.current){setState('loading');const response=await voiceRequest('speech',grant,controller.signal);const blob=await response.blob();if(controller.signal.aborted)return;if(blob.size>2_000_000||!blob.type.startsWith('audio/'))throw Error('invalid_audio');url.current=URL.createObjectURL(blob);audio.current=new Audio(url.current);audio.current.onended=()=>{setState('idle');release.current();};audio.current.onerror=()=>{setError(true);stop();};}
   if(replay)audio.current.currentTime=0;
   await audio.current.play();if(!controller.signal.aborted)setState('playing');
  }catch{if(!controller.signal.aborted){setError(true);setState('idle');release.current();}else if(abort.current===controller){setError(true);setState('idle');release.current();}}
  finally{clearTimeout(timer);if(abort.current===controller){abort.current=null;busy.current=false;}}
 }
 return <div className="voice-control"><div className="voice-actions"><button type="button" className="button secondary" disabled={state==='loading'} onClick={()=>void play()}>{state==='loading'?(language==='bm'?'Memuatkan…':'Loading…'):state==='playing'?(language==='bm'?'Jeda':'Pause'):(language==='bm'?'Dengar maklum balas':'Play feedback')}</button><button type="button" className="text-button" disabled={!audio.current||state==='loading'} onClick={()=>void play(true)}>{language==='bm'?'Main semula':'Replay'}</button>{state==='loading'?<button type="button" className="text-button" onClick={stop}>{language==='bm'?'Batal':'Cancel'}</button>:null}</div><p className="small">{language==='bm'?'Suara janaan AI membaca teks maklum balas yang sama.':'An AI-generated voice reads the same feedback text.'}</p>{error?<p role="status">{language==='bm'?'Audio tidak tersedia. Baca maklum balas di atas.':'Audio unavailable. Read the feedback above.'}</p>:null}</div>;
}
