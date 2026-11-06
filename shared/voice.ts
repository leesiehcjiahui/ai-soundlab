export const VOICE_SECONDS = 30;
export const VOICE_RATE = 16000;
export const VOICE_BYTES = 44 + VOICE_SECONDS * VOICE_RATE * 2;
export interface SpeechGrant { text: string; language: 'bm'|'en'; expires: number; nonce: string; signature: string; }

// Canonical mono PCM16 WAV only: duration is derived from samples, never client metadata.
export function validateWav(bytes: Uint8Array): void {
  if (bytes.length < 46 || bytes.length > VOICE_BYTES) throw new Error('invalid_audio');
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tag = (at: number, value: string) => [...value].every((c, i) => bytes[at+i] === c.charCodeAt(0));
  if (!tag(0,'RIFF') || !tag(8,'WAVE') || !tag(12,'fmt ') || !tag(36,'data') ||
    v.getUint32(4,true)!==bytes.length-8 || v.getUint32(16,true)!==16 || v.getUint16(20,true)!==1 ||
    v.getUint16(22,true)!==1 || v.getUint32(24,true)!==VOICE_RATE || v.getUint32(28,true)!==VOICE_RATE*2 ||
    v.getUint16(32,true)!==2 || v.getUint16(34,true)!==16 || v.getUint32(40,true)!==bytes.length-44 || (bytes.length-44)%2) throw new Error('invalid_audio');
}

export function encodeWav(samples: Float32Array): Uint8Array {
  const out = new Uint8Array(44 + samples.length*2), v = new DataView(out.buffer);
  const tag = (at: number, text: string) => [...text].forEach((c,i)=>out[at+i]=c.charCodeAt(0));
  tag(0,'RIFF'); v.setUint32(4,out.length-8,true); tag(8,'WAVE'); tag(12,'fmt '); v.setUint32(16,16,true);
  v.setUint16(20,1,true); v.setUint16(22,1,true); v.setUint32(24,VOICE_RATE,true); v.setUint32(28,VOICE_RATE*2,true);
  v.setUint16(32,2,true); v.setUint16(34,16,true); tag(36,'data'); v.setUint32(40,samples.length*2,true);
  samples.forEach((s,i)=>v.setInt16(44+i*2,Math.max(-1,Math.min(1,s))*32767,true));
  return out;
}
