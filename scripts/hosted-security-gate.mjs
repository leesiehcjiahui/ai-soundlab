import assert from 'node:assert/strict';
const url=process.env.POC_PROXY_URL||'https://ai-soundlab-proxy.ai-soundlab.workers.dev',origin=process.env.POC_ORIGIN||'https://leesiehcjiahui.github.io',input={language:'bm',mission:'vibration',stage:'explain',answer:'Contoh ujian dewasa.'};
async function check(name,path,expected,options){const r=await fetch(url+path,{...options,signal:AbortSignal.timeout(15000)});assert.equal(r.status,expected,name);console.log(`PASS ${name}: HTTP ${r.status}`);return r;}
const health=await check('allowed Pages health','/api/health',200,{headers:{Origin:origin}});assert.equal((await health.json()).aiEnabled,true);
await check('absent Origin','/api/health',403,{});await check('unlisted Origin','/api/health',403,{headers:{Origin:'https://example.invalid'}});
await check('retired class-code route','/api/class-code',404,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'});
await check('retired feedback route','/api/feedback',404,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'});
await check('preflight','/api/stage-guidance',204,{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}});
for(const [name,body,expected] of [['unknown audio property',{...input,audio:'not-accepted'},400],['mission allowlist',{...input,mission:'arbitrary'},400],['body cap','x'.repeat(9000),413]])await check(name,'/api/stage-guidance',expected,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:typeof body==='string'?body:JSON.stringify(body)});
console.log('Hosted boundary checks passed. Invalid requests made no provider call.');
