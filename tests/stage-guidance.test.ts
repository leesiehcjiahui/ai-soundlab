import {describe,it,expect} from 'vitest';
import {STAGE_GUIDES,STAGE_MISSIONS,STAGES,parseStageInput} from '../shared/stage-guidance';
import {buildStagePrompt,renderStageMarking} from '../proxy/src/stage-guidance';
const input=parseStageInput({language:'bm',mission:'travel',stage:'try',answer:'Bunyi sampai kepada semua pendengar. Yang jauh mendapat bunyi kemudian.'});
describe('fixed section guidance',()=>{
 it('covers all three sections of all four challenges in BM/EN',()=>{for(const language of ['bm','en'] as const)for(const mission of STAGE_MISSIONS)for(const stage of STAGES){const guide=STAGE_GUIDES[language][mission][stage];expect(guide.criteria).toHaveLength(2);expect(guide.criteria.every(Boolean)).toBe(true);expect(guide.answer.length).toBeGreaterThan(25);}});
 it('preserves specific model feedback and keeps score calculation on the server',()=>{const prompt=buildStagePrompt(input);expect(prompt.store).toBe(false);expect(prompt.text.format.strict).toBe(true);expect(JSON.parse(prompt.input).question).toContain('dahulu');expect(prompt.instructions).toContain('never penalise');const feedback='Kamu betul bahawa semua pendengar menerima bunyi kerana bunyi bergerak ke semua arah. Pendengar yang jauh menerima bunyi kemudian kerana laluannya lebih panjang.';const result=renderStageMarking(JSON.stringify({partA:true,partB:false,feedback}),input);expect(result.score).toBe(1);expect(result.feedback).toBe(feedback);expect(result.correctAnswer).toContain('semua arah');});
 it('rejects malformed booleans and injected properties',()=>{for(const raw of ['{}','{"partA":1,"partB":true}','{"partA":true,"partB":false,"score":2}'])expect(()=>renderStageMarking(raw,input)).toThrow();});
 it('rejects missing, empty, oversized or control-character feedback',()=>{for(const feedback of [undefined,'','x'.repeat(601),'Correct\u0000 answer'])expect(()=>renderStageMarking(JSON.stringify({partA:true,partB:false,feedback}),input)).toThrow();});
});
