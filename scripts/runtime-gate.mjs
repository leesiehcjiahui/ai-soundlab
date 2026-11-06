import assert from 'node:assert/strict';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
const mf=new Miniflare(convertV4MiniflareOptions({workers:[{name:'poc',modules:true,scriptPath:'proxy/work/worker/index.js',compatibilityDate:'2026-10-25',bindings:{AI_ENABLED:'false',ALLOWED_ORIGINS:'http://127.0.0.1:5173'},durableObjects:{QUOTA:{className:'QuotaCoordinator',useSQLite:true}}}]}));
try{const health=await mf.dispatchFetch('https://proxy.test/api/health',{headers:{Origin:'http://127.0.0.1:5173'}});assert.equal(health.status,200);assert.deepEqual(await health.json(),{status:'ok',aiEnabled:false});assert.equal((await mf.dispatchFetch('https://proxy.test/api/health')).status,403);assert.equal((await mf.dispatchFetch('https://proxy.test/api/stage-guidance',{method:'POST',headers:{Origin:'http://127.0.0.1:5173'}})).status,503);assert.equal((await mf.dispatchFetch('https://proxy.test/api/class-code',{method:'POST',headers:{Origin:'http://127.0.0.1:5173'}})).status,404);
 const {QUOTA}=await mf.getBindings('poc'),stub=QUOTA.get(QUOTA.idFromName('test-public-atomic'));const statuses=await Promise.all(Array.from({length:50},(_,i)=>stub.fetch('https://quota.internal/reserve',{method:'POST',body:JSON.stringify({limits:{classMinute:60,ipMinute:120,day:7,month:10},classId:'public',ipId:`ip-${i}`})}).then(r=>r.status)));assert.equal(statuses.filter(s=>s===200).length,7);assert.equal(statuses.filter(s=>s===429).length,43);const fresh=QUOTA.get(QUOTA.idFromName('test-public-atomic'));assert.equal((await fresh.fetch('https://quota.internal/reserve',{method:'POST',body:JSON.stringify({limits:{classMinute:60,ipMinute:120,day:7,month:10},classId:'public',ipId:'another'})})).status,429);
 const voice=QUOTA.get(QUOTA.idFromName('voice-atomic-test'));
 const voiceReserve=(lease,ipId,nonce)=>voice.fetch('https://quota.internal/reserve',{method:'POST',body:JSON.stringify({limits:{classMinute:60,ipMinute:120,day:100,month:100},classId:'voice',ipId,lease,nonce})});
 const simultaneous=await Promise.all(Array.from({length:10},(_,i)=>voiceReserve(`lease-${i}`,'same-ip',`nonce-${i}`)));
 assert.equal(simultaneous.filter(r=>r.status===200).length,1);
 const accepted=simultaneous.findIndex(r=>r.status===200);
 await voice.fetch('https://quota.internal/release',{method:'POST',body:JSON.stringify({lease:`lease-${accepted}`})});
 assert.equal((await voiceReserve('retry','same-ip',`nonce-${accepted}`)).status,429);
 assert.equal((await voiceReserve('new-lease','same-ip','new-nonce')).status,200);
 for(let i=0;i<3;i++)assert.equal((await voiceReserve(`other-${i}`,`other-ip-${i}`,`other-nonce-${i}`)).status,200);
 assert.equal((await voiceReserve('over-global','fifth-ip','fifth-nonce')).status,429);
 assert.equal((await mf.dispatchFetch('https://proxy.test/api/transcribe',{method:'POST',headers:{Origin:'http://127.0.0.1:5173'}})).status,503);
 console.log('PASS: voice atomic concurrency (1/IP, 4/global), lease release, single-use speech nonce, disabled voice route.');
 console.log('PASS: public routes, retired class-code route and atomic 50-way quota reservation (7 accepted, 43 rejected). No provider request/key used.');}
finally{await mf.dispose();}
