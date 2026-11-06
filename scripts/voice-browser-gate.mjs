import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const evidence=process.env.VOICE_EVIDENCE_DIR || 'work/voice-evidence';
await fs.mkdir(evidence,{recursive:true});
const base=process.env.VOICE_TEST_URL || 'http://127.0.0.1:5174/ai-soundlab/';
const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{}),args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
const context=await browser.newContext({viewport:{width:1366,height:900}});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.addInitScript(()=>{const original=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);window.stopped=0;navigator.mediaDevices.getUserMedia=async c=>{const stream=await original(c);for(const track of stream.getTracks()){const stop=track.stop.bind(track);track.stop=()=>{window.stopped++;stop();};}return stream;};});
let sttCalls=0,aiCalls=0,ttsCalls=0;let transcript='Pembaris bergetar.',fail=false,delay=0;
const feedback='The ruler vibrates and produces sound.';
await page.route('**/api/transcribe',async route=>{sttCalls++;const data=route.request().postDataBuffer();assert.equal(data.toString('ascii',0,4),'RIFF');assert.ok(data.length<=960044);if(delay)await new Promise(r=>setTimeout(r,delay));await route.fulfill({status:fail?502:200,contentType:'application/json',body:JSON.stringify(fail?{error:'voice_unavailable'}:{text:transcript})});});
await page.route('**/api/stage-guidance',async route=>{aiCalls++;const data=route.request().postDataJSON();assert.ok(data.answer.includes('edited science'));await route.fulfill({json:{source:'openai',rubricVersion:'sound-stage-v1',score:2,met:[true,true],correctAnswer:'Prediction',feedback,speechGrant:{text:feedback,language:data.language,expires:Date.now()+300000,nonce:'test',signature:'test'}}});});
const wav=Buffer.alloc(44+16000*2*3);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(16000,24);wav.writeUInt32LE(32000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(wav.length-44,40);for(let i=0;i<48000;i++)wav.writeInt16LE(Math.sin(i/16000*440*Math.PI*2)*1000,44+i*2);
await page.route('**/api/speech',async route=>{ttsCalls++;assert.equal(route.request().postDataJSON().text,feedback);await route.fulfill({body:wav,contentType:'audio/wav'});});
await page.goto(base);await page.screenshot({path:path.join(evidence,'p1-poc-desktop.png'),fullPage:true});assert.match(await page.title(),/AI SoundLab/);assert.ok((await page.locator('body').innerText()).includes('Kenali Getaran'));assert.equal(await page.locator('vite-error-overlay').count(),0);
await page.getByRole('button',{name:'EN',exact:true}).click();
const answer=page.locator('textarea[data-field="predictionReason"]');
const voice=()=>page.getByRole('button',{name:'Answer by voice',exact:true});
async function record(){await voice().click();await page.getByRole('button',{name:/Stop \(/}).waitFor();await page.waitForTimeout(350);await page.getByRole('button',{name:/Stop \(/}).click();}
for(const text of ['Pembaris bergetar.','The ruler vibrates.','Bunyi travel dalam air.']){transcript=text;await record();await page.waitForFunction(t=>document.querySelector('textarea').value===t,text);assert.equal(aiCalls,0);}
await answer.fill('edited science');await page.getByRole('radio',{name:'Yes',exact:true}).check();await page.getByRole('button',{name:'Check answer',exact:true}).click();await page.getByText(feedback,{exact:true}).waitFor();assert.equal(aiCalls,1);assert.equal(ttsCalls,0);
await page.getByRole('button',{name:'Play feedback',exact:true}).click();await page.getByRole('button',{name:'Pause',exact:true}).waitFor();await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Play feedback',exact:true}).click();await page.getByRole('button',{name:'Replay',exact:true}).click();assert.equal(ttsCalls,1);
await page.screenshot({path:path.join(evidence,'p1-feedback-desktop.png'),fullPage:true});
await page.getByRole('button',{name:'BM',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Pause',exact:true}).count(),0);
await page.getByRole('button',{name:'EN',exact:true}).click();
// Network failure retains typing.
fail=true;await answer.fill('Keep this');await record();await page.getByText('Audio unavailable. Type your answer or try again.',{exact:true}).waitFor();assert.equal(await answer.inputValue(),'Keep this');fail=false;
// Typing while transcription is pending cannot be overwritten.
delay=1000;transcript='Must not replace edits';await record();await answer.fill('New typing during upload');await page.getByText('Your answer changed. Recording discarded to keep your edits.',{exact:true}).waitFor();assert.equal(await answer.inputValue(),'New typing during upload');delay=0;
// Auto-stop timer with the browser clock advanced; server tests independently enforce actual sample duration.
await page.clock.install();transcript='Timer stopped this answer';await voice().click();await page.getByRole('button',{name:/Stop \(/}).waitFor();await page.waitForTimeout(350);await page.clock.fastForward(30_001);await page.waitForFunction(t=>document.querySelector('textarea').value===t,transcript);
// Cancel recording, navigate while recording, and language change release tracks without upload.
const before=sttCalls;await voice().click();await page.getByRole('button',{name:/Stop \(/}).waitFor();await page.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(sttCalls,before);
await voice().click();await page.getByRole('button',{name:/Stop \(/}).waitFor();await page.getByRole('button',{name:'Assessment',exact:true}).click();await page.getByRole('heading',{name:/assessment/i}).first().waitFor();assert.equal(sttCalls,before);assert.ok(await page.evaluate(()=>window.stopped)>=7);
// Assessment is accessible in fresh session and BM/EN remain usable at 390px.
await page.goto(base);await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'EN',exact:true}).click();await page.screenshot({path:path.join(evidence,'p1-poc-mobile.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
await page.locator('.mobile-menu-toggle').click();await page.getByRole('button',{name:'Assessment',exact:true}).click();assert.equal(await page.locator('textarea').count(),5);
assert.deepEqual(errors,['Failed to load resource: the server responded with a status of 502 (Bad Gateway)']);
await browser.close();
// Permission-denied browser context, with real rejection from getUserMedia shim.
const deniedBrowser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})}),denied=await deniedBrowser.newPage();await denied.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('denied','NotAllowedError');};});await denied.goto(base);await denied.getByRole('button',{name:'EN',exact:true}).click();await denied.getByRole('button',{name:'Answer by voice',exact:true}).click();await denied.getByText('Microphone unavailable or permission denied. Type your answer.',{exact:true}).waitFor();await denied.locator('textarea').fill('Typed fallback works');assert.equal(await denied.locator('textarea').inputValue(),'Typed fallback works');await deniedBrowser.close();
console.log('PASS: Edge/Chromium desktop + 390px; synthetic capture BM/EN/mixed transcripts, explicit submit, edits, network error, 30-second auto-stop timer, cancel/navigation cleanup, exact TTS text, no autoplay, pause/resume/replay, language stop, assessment access, denied permission, no page errors; one expected console 502 from injected network failure. Provider and microphone input are mocked; no real speech-quality claim.');
