import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Phase = 'briefing'|'assessment'|'decision'|'intervention'|'response'|'evaluation'|'debriefing';
export type Domain = 'knowledge'|'skill'|'reasoning'|'safety'|'communication'|'time'|'professionalism';
export type ObjectId = 'handrub'|'patient-id'|'thermometer'|'bp-cuff'|'oximeter'|'stethoscope'|'chart';

export type EventLog = { id:string; at:string; action:string; target?:string; result:string; scoreDelta?:number };
export type Scores = Record<Domain, number>;

const clamp=(n:number)=>Math.max(0,Math.min(100,n));
const now=()=>new Date().toISOString();

interface LabState {
  phase: Phase;
  started: boolean;
  paused: boolean;
  selected?: ObjectId;
  completed: ObjectId[];
  criticalErrors: string[];
  feedback: string;
  patient: { name:string; state:'normal'|'anxious'|'dizzy'; temp:number; bp:string; pulse:number; spo2:number; rr:number };
  scores: Scores;
  logs: EventLog[];
  worksheet: { assessment:string; observation:string; intervention:string; result:string; analysis:string; reflection:string; conclusion:string };
  quizAnswers: Record<number,string>;
  instructorFeedback: string;
  tutorialSeen: boolean;
  start:()=>void;
  pause:()=>void;
  resume:()=>void;
  reset:()=>void;
  select:(id:ObjectId)=>void;
  perform:(id:ObjectId)=>void;
  setWorksheet:(key:keyof LabState['worksheet'], value:string)=>void;
  answerQuiz:(q:number,value:string)=>void;
  setInstructorFeedback:(value:string)=>void;
  setTutorialSeen:(value:boolean)=>void;
  nextPhase:()=>void;
}

const initialScores:Scores={knowledge:50,skill:50,reasoning:50,safety:50,communication:50,time:50,professionalism:50};
const initialWorksheet={assessment:'',observation:'',intervention:'',result:'',analysis:'',reflection:'',conclusion:''};
const phases:Phase[]=['briefing','assessment','decision','intervention','response','evaluation','debriefing'];

export const useLabStore=create<LabState>()(persist((set,get)=>({
  phase:'briefing',started:false,paused:false,selected:undefined,completed:[],criticalErrors:[],feedback:'พร้อมเริ่มการฝึก',
  patient:{name:'ผู้ป่วยจำลอง A',state:'anxious',temp:37.8,bp:'148/92',pulse:104,spo2:94,rr:22},
  scores:initialScores,logs:[],worksheet:initialWorksheet,quizAnswers:{},instructorFeedback:'',tutorialSeen:false,
  start:()=>set(s=>({started:true,paused:false,phase:'assessment',logs:[...s.logs,{id:crypto.randomUUID(),at:now(),action:'start simulation',result:'เริ่มการฝึก'}]})),
  pause:()=>set({paused:true,feedback:'หยุดชั่วคราว'}), resume:()=>set({paused:false,feedback:'ฝึกต่อได้'}),
  reset:()=>set({phase:'briefing',started:false,paused:false,selected:undefined,completed:[],criticalErrors:[],feedback:'รีเซ็ตสถานการณ์แล้ว',scores:initialScores,logs:[],worksheet:initialWorksheet,quizAnswers:{}}),
  select:(id)=>set(s=>({selected:id,logs:[...s.logs,{id:crypto.randomUUID(),at:now(),action:'equipment selected',target:id,result:'เลือกอุปกรณ์'}]})),
  perform:(id)=>{
    const s=get(); if(s.paused||!s.started)return;
    const done=new Set(s.completed); let feedback=''; const delta:Partial<Scores>={}; const errors=[...s.criticalErrors];
    if(id==='handrub'){done.add(id);feedback='ทำความสะอาดมือแล้ว';delta.safety=8;delta.professionalism=5;}
    else if(id==='patient-id'){
      if(!done.has('handrub')){errors.push('ประเมินผู้ป่วยก่อนทำ Hand hygiene');delta.safety=-12;feedback='ควรทำ Hand hygiene ก่อนสัมผัสผู้ป่วย';}
      else{feedback='ยืนยันตัวผู้ป่วยด้วยชื่อและรหัสจำลองแล้ว';delta.safety=8;delta.communication=6;} done.add(id);
    } else {
      if(!done.has('patient-id')){errors.push(`ใช้ ${id} ก่อนยืนยันตัวผู้ป่วย`);delta.safety=-15;feedback='Critical safety warning: ต้องยืนยันตัวผู้ป่วยก่อน';}
      else if(id==='thermometer'){feedback='อุณหภูมิ 37.8 °C';delta.skill=7;delta.knowledge=4;done.add(id);}
      else if(id==='bp-cuff'){feedback='BP 148/92 mmHg';delta.skill=8;delta.reasoning=5;done.add(id);}
      else if(id==='oximeter'){feedback='SpO₂ 94% และชีพจร 104/min';delta.skill=7;delta.reasoning=6;done.add(id);}
      else if(id==='stethoscope'){feedback='RR 22/min เสียงหายใจชัดเจน ไม่มีเสียงผิดปกติเด่น';delta.skill=7;delta.reasoning=5;done.add(id);}
      else if(id==='chart'){feedback='บันทึกผลลง Digital Worksheet แล้ว';delta.professionalism=6;done.add(id);}
    }
    const scores={...s.scores}; (Object.keys(delta) as Domain[]).forEach(k=>scores[k]=clamp(scores[k]+(delta[k]||0)));
    const completeVitals=['thermometer','bp-cuff','oximeter','stethoscope'].every(x=>done.has(x as ObjectId));
    const next=completeVitals&&s.phase==='assessment'?'decision':s.phase;
    set({completed:[...done],criticalErrors:[...new Set(errors)],feedback,scores,phase:next,logs:[...s.logs,{id:crypto.randomUUID(),at:now(),action:'intervention',target:id,result:feedback,scoreDelta:Object.values(delta).reduce((a,b)=>a+(b||0),0)}]});
  },
  setWorksheet:(key,value)=>set(s=>({worksheet:{...s.worksheet,[key]:value}})),
  answerQuiz:(q,value)=>set(s=>({quizAnswers:{...s.quizAnswers,[q]:value},logs:[...s.logs,{id:crypto.randomUUID(),at:now(),action:'quiz answer',target:String(q),result:value}]})),
  setInstructorFeedback:(instructorFeedback)=>set({instructorFeedback}),setTutorialSeen:(tutorialSeen)=>set({tutorialSeen}),
  nextPhase:()=>set(s=>({phase:phases[Math.min(phases.length-1,phases.indexOf(s.phase)+1)]}))
}),{name:'rtafnc-vital-signs-lab-v1'}));

export const phaseLabels:Record<Phase,string>={briefing:'Briefing',assessment:'Assessment',decision:'Decision',intervention:'Intervention',response:'Response',evaluation:'Evaluation',debriefing:'Debriefing'};
