import {ASSESSMENT,ASSESSMENT_IDS,type AssessmentInput,type AssessmentResult} from '../../shared/assessment';
import {MODEL} from './model';
import {FEEDBACK_SCHEMA,TEACHING_INSTRUCTIONS,parseTeachingMark} from './teaching-feedback';

const VERSION='sound-6.1-assessment-v1' as const;
const markSchema={type:'object',properties:Object.fromEntries(ASSESSMENT_IDS.map(id=>[id,FEEDBACK_SCHEMA])),required:[...ASSESSMENT_IDS],additionalProperties:false};
export function buildAssessmentPrompt(input:AssessmentInput){
 const questions=ASSESSMENT[input.language].map(q=>({id:q.id,question:q.question,pointA:q.criteria[0],pointB:q.criteria[1],scienceReference:q.answer,studentAnswer:input.answers[q.id]}));
 return {model:MODEL,store:false,max_output_tokens:1600,
  instructions:`Mark five written Year 4 Malaysian sound-science answers, ${VERSION}. For each question independently decide whether the pupil's answer demonstrates criterion A and B, and provide a short explanation of why that answer is correct or needs improvement. Award each boolean only when the idea is stated or clearly paraphrased; do not infer missing information from another answer. A misconception contradicting a criterion makes that criterion false. Return only the required JSON. ${TEACHING_INSTRUCTIONS} Required output language for ALL five feedback fields: ${input.language==='bm'?'Bahasa Melayu only':'English only'}, regardless of the language of examples or the pupil answers.`,
  text:{format:{type:'json_schema',name:'sound_assessment_marks',strict:true,schema:markSchema}},
  input:JSON.stringify({language:input.language,questions})};
}
export function renderAssessmentMarking(raw:string,input:AssessmentInput):AssessmentResult{
 const value:unknown=JSON.parse(raw);
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('ai_response_invalid');
 const marks=value as Record<string,unknown>;
 if(Object.keys(marks).sort().join(',')!==[...ASSESSMENT_IDS].sort().join(','))throw new Error('ai_response_invalid');
 const localized=ASSESSMENT[input.language];
 const results=localized.map(q=>{
  const p=parseTeachingMark(marks[q.id]);
  const met:[boolean,boolean]=[p.partA,p.partB],score=(Number(met[0])+Number(met[1])) as 0|1|2;
  return {id:q.id,score,met,feedback:p.feedback,correctAnswer:q.answer};
 });
 return {source:'openai',rubricVersion:VERSION,total:results.reduce((sum,item)=>sum+item.score,0),marks:results};
}
