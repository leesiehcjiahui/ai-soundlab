import {STAGE_GUIDES,type StageInput,type StageResult} from '../../shared/stage-guidance';
import {MODEL} from './model';
import {MISSION_COPY} from '../../src/lab/questions';
import {FEEDBACK_SCHEMA,TEACHING_INSTRUCTIONS,parseTeachingMark} from './teaching-feedback';
const VERSION='sound-stage-v1' as const;
export function buildStagePrompt(input:StageInput){const guide=STAGE_GUIDES[input.language][input.mission][input.stage],task=MISSION_COPY[input.language][input.mission];return {model:MODEL,store:false,max_output_tokens:450,
 instructions:`Assess one written response in a Year 4 sound-science activity, ${VERSION}. Return the required booleans and a personalised teaching explanation. For criterion A and B, return true only when the pupil's own answer states or clearly paraphrases that idea. Contradictory misconceptions make that criterion false. Judge only the current section. A prediction is a hypothesis: discuss whether it can be tested and whether the reason makes sense, without calling a plausible prediction wrong before the experiment. For Try, distinguish the pupil's reported observation from the science explanation. For Sound Detective, use the pupil's own sound description and listening situation to explain a possible useful or harmful effect and a practical safe action; never claim to classify the recording. ${TEACHING_INSTRUCTIONS} Required output language for the feedback field: ${input.language==='bm'?'Bahasa Melayu only':'English only'}, regardless of the language of examples or the pupil answer.`,
 text:{format:{type:'json_schema',name:'stage_marks',strict:true,schema:FEEDBACK_SCHEMA}},
 input:JSON.stringify({language:input.language,mission:input.mission,stage:input.stage,question:input.stage==='predict'?task.predict:input.stage==='try'?task.observe:task.explain,criterionA:guide.criteria[0],criterionB:guide.criteria[1],scienceReference:guide.answer,studentAnswer:input.answer})};}
export function renderStageMarking(raw:string,input:StageInput):StageResult{
 const v=parseTeachingMark(JSON.parse(raw));
 const met:[boolean,boolean]=[v.partA,v.partB],score=(Number(met[0])+Number(met[1])) as 0|1|2;
 const guide=STAGE_GUIDES[input.language][input.mission][input.stage];
 return {source:'openai',rubricVersion:VERSION,score,met,feedback:v.feedback,correctAnswer:guide.answer};
}
