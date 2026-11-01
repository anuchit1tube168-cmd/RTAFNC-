import { useEffect, useMemo, useState } from 'react';
import SimulationScene from './SimulationScene';
import { phaseLabels, useLabStore, type Domain, type ObjectId } from './store';

type View='lab'|'worksheet'|'quiz'|'student'|'teacher'|'debrief';
type Role='student'|'instructor'|'admin';
type TeacherSummary={learners:number;sessions:number;completed:number;averageScore:number;criticalErrors:number};

const domainLabels:Record<Domain,string>={knowledge:'Knowledge',skill:'Skill',reasoning:'Clinical Reasoning',safety:'Safety',communication:'Communication',time:'Time Management',professionalism:'Professionalism'};
const objectLabels:Record<ObjectId,string>={'handrub':'Hand hygiene','patient-id':'ยืนยันตัวผู้ป่วย',thermometer:'วัดอุณหภูมิ','bp-cuff':'วัดความดัน',oximeter:'วัด SpO₂ / Pulse',stethoscope:'ประเมินการหายใจ',chart:'บันทึกผล'};
const quiz=[
  {q:'ก่อนสัมผัสผู้ป่วยเพื่อวัดสัญญาณชีพ ควรทำสิ่งใดก่อน?',choices:['ใส่ BP cuff','Hand hygiene','เปิด Chart','วัด SpO₂'],a:'Hand hygiene'},
  {q:'ค่าความดัน 148/92 mmHg ในสถานการณ์นี้ควรทำอย่างไรต่อ?',choices:['ไม่ต้องสนใจ','ประเมินซ้ำและรายงานตามบริบท','ให้ยาเองทันที','จบการฝึก'],a:'ประเมินซ้ำและรายงานตามบริบท'},
  {q:'SpO₂ 94% ควรแปลผลอย่างไรใน Simulation นี้?',choices:['ปกติแน่นอน','ต้องดูร่วมกับอาการและค่าประเมินอื่น','Cardiac arrest','ไม่เกี่ยวกับการหายใจ'],a:'ต้องดูร่วมกับอาการและค่าประเมินอื่น'},
  {q:'ข้อใดเป็น Critical Safety Step?',choices:['เปลี่ยนสี UI','ยืนยันตัวผู้ป่วยก่อนหัตถการ','หมุนกล้อง','เปิด Dashboard'],a:'ยืนยันตัวผู้ป่วยก่อนหัตถการ'},
  {q:'หลังวัดสัญญาณชีพครบควรทำอะไร?',choices:['บันทึกและประเมินความผิดปกติ','ลบผลทั้งหมด','เดาค่าที่ขาด','ออกจากระบบทันที'],a:'บันทึกและประเมินความผิดปกติ'},
];

function avg(values:number[]){return Math.round(values.reduce((a,b)=>a+b,0)/Math.max(values.length,1));}

export default function App(){
  const s=useLabStore();
  const [view,setView]=useState<View>('lab');
  const [role,setRole]=useState<Role>('student');
  const [cloudStatus,setCloudStatus]=useState<'checking'|'d1'|'local'|'error'>('checking');
  const [syncStatus,setSyncStatus]=useState('ยังไม่ได้ส่งผลการฝึก');
  const [serverSessionId,setServerSessionId]=useState('');
  const [teacherSummary,setTeacherSummary]=useState<TeacherSummary|null>(null);
  const score=avg(Object.values(s.scores));
  const quizScore=useMemo(()=>Math.round(quiz.filter((x,i)=>s.quizAnswers[i]===x.a).length/quiz.length*100),[s.quizAnswers]);
  const recommended=['Hand hygiene','ยืนยันตัวผู้ป่วย','Temperature','Blood pressure','SpO₂/Pulse','Respiratory assessment','Documentation'];
  const selectedLabel=s.selected?objectLabels[s.selected]:'ยังไม่ได้เลือกอุปกรณ์';

  useEffect(()=>{
    let active=true;
    fetch('/healthz').then(r=>r.json()).then((data:{ok?:boolean;storage?:string})=>{
      if(!active)return;
      if(data.ok&&String(data.storage).startsWith('d1'))setCloudStatus('d1');
      else if(data.ok)setCloudStatus('local');
      else setCloudStatus('error');
    }).catch(()=>active&&setCloudStatus('local'));
    return()=>{active=false};
  },[]);

  useEffect(()=>{
    if(view!=='teacher'||role==='student')return;
    let active=true;
    fetch('/api/teacher/summary').then(r=>r.json()).then((data:{ok?:boolean;summary?:TeacherSummary})=>{
      if(active&&data.ok&&data.summary)setTeacherSummary(data.summary);
    }).catch(()=>{});
    return()=>{active=false};
  },[view,role,syncStatus]);

  const decision=(choice:'recheck'|'ignore'|'treat')=>{
    const now=new Date().toISOString();
    if(choice==='recheck'){
      useLabStore.setState(st=>({phase:'intervention',feedback:'ตัดสินใจเหมาะสม: ประเมินซ้ำ เชื่อมโยงข้อมูล และเตรียมรายงาน',scores:{...st.scores,reasoning:Math.min(100,st.scores.reasoning+12),safety:Math.min(100,st.scores.safety+5)},logs:[...st.logs,{id:crypto.randomUUID(),at:now,action:'decision',target:'abnormal-vitals',result:'reassess-and-report',scoreDelta:17}]}));
    }else if(choice==='ignore'){
      useLabStore.setState(st=>({phase:'response',feedback:'ผลกระทบ: ความผิดปกติไม่ได้รับการติดตาม ผู้ป่วยยังเวียนศีรษะ',criticalErrors:[...new Set([...st.criticalErrors,'ละเลยค่าชีพจร/ความดันที่ผิดปกติ'])],scores:{...st.scores,reasoning:Math.max(0,st.scores.reasoning-18),safety:Math.max(0,st.scores.safety-12)},logs:[...st.logs,{id:crypto.randomUUID(),at:now,action:'decision',target:'abnormal-vitals',result:'ignored abnormal findings',scoreDelta:-30}]}));
    }else{
      useLabStore.setState(st=>({phase:'response',feedback:'Safety event: ผู้เรียนสั่งการรักษาเกินขอบเขต Simulation โดยไม่ผ่านการประเมิน/คำสั่ง',criticalErrors:[...new Set([...st.criticalErrors,'เริ่มการรักษาโดยไม่มีข้อมูล/คำสั่งที่เหมาะสม'])],scores:{...st.scores,reasoning:Math.max(0,st.scores.reasoning-15),professionalism:Math.max(0,st.scores.professionalism-10)},logs:[...st.logs,{id:crypto.randomUUID(),at:now,action:'decision',target:'abnormal-vitals',result:'unsafe independent treatment',scoreDelta:-25}]}));
    }
  };

  const completeSession=async()=>{
    const completedAt=new Date().toISOString();
    const completionEvent={id:crypto.randomUUID(),at:completedAt,action:'completion',result:'session completed'};
    const allLogs=[...s.logs,completionEvent];
    useLabStore.setState(st=>({phase:'debriefing',feedback:'จบกิจกรรมและสร้าง Debriefing Timeline แล้ว',logs:[...st.logs,completionEvent]}));
    setView('debrief');
    setSyncStatus('กำลังบันทึกผล...');
    try{
      const startedAt=allLogs[0]?.at||completedAt;
      const durationSec=Math.max(0,Math.round((Date.parse(completedAt)-Date.parse(startedAt))/1000));
      const response=await fetch('/api/session',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
        userId:null,lessonId:'vital-signs-01',status:'completed',totalScore:score,durationSec,startedAt,completedAt,
        scores:s.scores,criticalErrors:s.criticalErrors,logs:allLogs,quizScore,quizTotal:100,quizAnswers:s.quizAnswers,
        worksheet:s.worksheet,reflection:s.worksheet.reflection,instructorFeedback:s.instructorFeedback,
      })});
      const data=await response.json() as {ok?:boolean;id?:string;persisted?:boolean;error?:string};
      if(!response.ok||!data.ok)throw new Error(data.error||'save_failed');
      setServerSessionId(data.id||'');
      setSyncStatus(data.persisted?'บันทึก D1 สำเร็จ':'บันทึกเฉพาะ Demo/Local');
    }catch{
      setSyncStatus('บันทึก Local สำเร็จ · Cloud sync ยังไม่สำเร็จ');
    }
  };

  const healthLabel=cloudStatus==='d1'?'● D1 CONNECTED':cloudStatus==='checking'?'● CHECKING':cloudStatus==='error'?'● API ERROR':'● DEMO LOCAL';

  return <div className="app-shell">
    {!s.tutorialSeen&&<div className="tutorial"><div className="tutorial-card"><span className="eyebrow">INTERACTIVE TUTORIAL</span><h2>วิธีใช้ห้องปฏิบัติการ 3D</h2><p>ลากเพื่อหมุนกล้อง 360° · Scroll/Pinch เพื่อ Zoom · คลิกอุปกรณ์เพื่อเลือก · กด “ใช้” หรือ Double click เพื่อปฏิบัติ · ระบบจะบันทึกทุก Action อัตโนมัติ</p><button className="primary" onClick={()=>s.setTutorialSeen(true)}>เริ่มใช้งาน</button><button className="ghost" onClick={()=>s.setTutorialSeen(true)}>Skip</button></div></div>}
    <header className="topbar"><div><span className="eyebrow">RTAFNC VIRTUAL LEARNING LAB</span><h1>Vital Signs Virtual Learning Lab</h1><p>บทเรียน: การวัดและประเมินสัญญาณชีพ · Demo Mode</p></div><div className="top-actions"><select value={role} onChange={e=>setRole(e.target.value as Role)} aria-label="บทบาท"><option value="student">Student</option><option value="instructor">Instructor</option><option value="admin">Admin</option></select><span className="health">{healthLabel}</span></div></header>

    <nav className="tabs"><button className={view==='lab'?'active':''} onClick={()=>setView('lab')}>3D Lab</button><button className={view==='worksheet'?'active':''} onClick={()=>setView('worksheet')}>Worksheet</button><button className={view==='quiz'?'active':''} onClick={()=>setView('quiz')}>Quiz</button><button className={view==='student'?'active':''} onClick={()=>setView('student')}>Student Dashboard</button>{role!=='student'&&<button className={view==='teacher'?'active':''} onClick={()=>setView('teacher')}>Teacher Dashboard</button>}<button className={view==='debrief'?'active':''} onClick={()=>setView('debrief')}>Debrief</button></nav>

    {view==='lab'&&<main className="lab-layout">
      <aside className="panel tasks"><span className="eyebrow">TASK / OBJECTIVE</span><h3>{phaseLabels[s.phase]}</h3><ol><li>ทำ Hand hygiene</li><li>ยืนยันตัวผู้ป่วย</li><li>วัดสัญญาณชีพครบ</li><li>แปลผลความผิดปกติ</li><li>บันทึกและสื่อสาร</li></ol><div className="phase-list">{Object.values(phaseLabels).map((p,i)=><span key={p} className={i<=Object.keys(phaseLabels).indexOf(s.phase)?'done':''}>{i+1}. {p}</span>)}</div><div className="controls"><button className="primary" onClick={s.start} disabled={s.started&&!s.paused}>Start</button><button className="ghost" onClick={s.paused?s.resume:s.pause} disabled={!s.started}>{s.paused?'Resume':'Pause'}</button><button className="danger" onClick={s.reset}>Reset</button></div></aside>
      <section className="simulation"><SimulationScene/><div className="bottom-action"><div><small>Selected object</small><b>{selectedLabel}</b></div><button className="primary" disabled={!s.selected||!s.started||s.paused} onClick={()=>s.selected&&s.perform(s.selected)}>ใช้ / Perform</button><button className="ghost" onClick={()=>setView('worksheet')}>บันทึกผล</button></div></section>
      <aside className="panel info"><span className="eyebrow">PATIENT / RESULT</span><h3>{s.patient.name}</h3><div className="patient-state">State: <b>{s.patient.state}</b></div><div className="feedback">{s.feedback}</div><div className="mini-scores">{Object.entries(s.scores).map(([k,v])=><div key={k}><span>{domainLabels[k as Domain]}</span><progress value={v} max={100}/><b>{v}</b></div>)}</div>{s.criticalErrors.length>0&&<div className="critical"><b>Critical Errors</b>{s.criticalErrors.map(x=><span key={x}>⚠ {x}</span>)}</div>}</aside>
      {s.phase==='decision'&&<div className="decision-sheet"><div className="decision-card"><span className="eyebrow">DECISION POINT</span><h2>พบ BP 148/92, Pulse 104, SpO₂ 94% และผู้ป่วยเวียนศีรษะ คุณจะทำอะไรต่อ?</h2><button onClick={()=>decision('recheck')}>A · ประเมินซ้ำ เชื่อมโยงอาการ และรายงานตามบทบาท</button><button onClick={()=>decision('ignore')}>B · ถือว่าไม่สำคัญและทำขั้นตอนต่อไป</button><button onClick={()=>decision('treat')}>C · เริ่มการรักษาเองทันทีโดยไม่ประเมินเพิ่ม</button></div></div>}
    </main>}

    {view==='worksheet'&&<section className="page panel worksheet"><div className="page-head"><div><span className="eyebrow">DIGITAL WORKSHEET · AUTO SAVE</span><h2>ใบงานการประเมินสัญญาณชีพ</h2></div><button className="ghost" onClick={()=>window.print()}>Export PDF</button></div>{(['assessment','observation','intervention','result','analysis','reflection','conclusion'] as const).map(k=><label key={k}><span>{k.toUpperCase()}</span><textarea value={s.worksheet[k]} onChange={e=>s.setWorksheet(k,e.target.value)} placeholder={`บันทึก ${k}...`}/></label>)}</section>}

    {view==='quiz'&&<section className="page panel"><div className="page-head"><div><span className="eyebrow">ASSESSMENT</span><h2>Quiz · {Object.keys(s.quizAnswers).length}/{quiz.length} ข้อ</h2></div><b className="score-pill">{quizScore}%</b></div><div className="quiz-list">{quiz.map((x,i)=><fieldset key={x.q}><legend>{i+1}. {x.q}</legend>{x.choices.map(c=><label key={c}><input type="radio" name={`q${i}`} checked={s.quizAnswers[i]===c} onChange={()=>s.answerQuiz(i,c)}/>{c}</label>)}</fieldset>)}</div>{Object.keys(s.quizAnswers).length===quiz.length&&<div className="result-card">คะแนน Quiz {quizScore}% · ระบบจะไม่เปลี่ยนคำตอบ แต่ใช้ผลในการ Debriefing</div>}</section>}

    {view==='student'&&<section className="page"><div className="dashboard-grid"><div className="panel hero-card"><span className="eyebrow">STUDENT DASHBOARD</span><h2>ความก้าวหน้าการฝึก</h2><div className="big-score">{score}</div><p>Overall simulation score</p><small>{syncStatus}{serverSessionId?` · Session ${serverSessionId.slice(0,8)}`:''}</small></div>{Object.entries(s.scores).map(([k,v])=><div className="panel stat" key={k}><span>{domainLabels[k as Domain]}</span><b>{v}</b><progress value={v} max={100}/></div>)}<div className="panel stat"><span>Quiz</span><b>{quizScore}%</b></div><div className="panel stat"><span>Practice actions</span><b>{s.logs.length}</b></div></div></section>}

    {view==='teacher'&&role!=='student'&&<section className="page"><div className="dashboard-grid"><div className="panel hero-card"><span className="eyebrow">TEACHER DASHBOARD · SERVER SUMMARY WHEN AVAILABLE</span><h2>ภาพรวมผู้เรียน</h2><div className="big-score">{teacherSummary?.learners??1}</div><p>Learners with recorded sessions</p></div><div className="panel stat"><span>Completed sessions</span><b>{teacherSummary?.completed??(s.phase==='debriefing'?1:0)}</b></div><div className="panel stat"><span>Average score</span><b>{teacherSummary?.averageScore??score}</b></div><div className="panel stat"><span>Critical errors</span><b>{teacherSummary?.criticalErrors??s.criticalErrors.length}</b></div><div className="panel stat"><span>Total sessions</span><b>{teacherSummary?.sessions??1}</b></div><div className="panel full"><h3>Instructor Feedback</h3><textarea value={s.instructorFeedback} onChange={e=>s.setInstructorFeedback(e.target.value)} placeholder="เพิ่มความคิดเห็นสำหรับผู้เรียน"/></div><div className="panel full"><h3>Event Log</h3><div className="log-list">{s.logs.slice().reverse().map(x=><div key={x.id}><time>{new Date(x.at).toLocaleTimeString('th-TH')}</time><b>{x.action}</b><span>{x.target||'-'}</span><em>{x.result}</em></div>)}</div></div></div></section>}

    {view==='debrief'&&<section className="page"><div className="panel debrief"><div className="page-head"><div><span className="eyebrow">DEBRIEFING ENGINE</span><h2>Timeline เทียบ Recommended Path</h2><p className="muted">{syncStatus}</p></div><button className="primary" onClick={completeSession}>Complete & Save Session</button></div><div className="debrief-grid"><div><h3>Timeline ของผู้เรียน</h3>{s.logs.length?s.logs.map((x,i)=><div className="timeline" key={x.id}><b>{String(i+1).padStart(2,'0')}</b><span>{new Date(x.at).toLocaleTimeString('th-TH')} · {x.action}<small>{x.result}</small></span></div>):<p>ยังไม่มีข้อมูลการฝึก</p>}</div><div><h3>Recommended Path</h3>{recommended.map((x,i)=><div className="timeline" key={x}><b>{i+1}</b><span>{x}</span></div>)}<div className="result-card"><b>Reflection</b><p>{s.worksheet.reflection||'ยังไม่ได้บันทึก Reflection'}</p><b>Instructor Feedback</b><p>{s.instructorFeedback||'ยังไม่มีความคิดเห็นผู้สอน'}</p></div></div></div></div></section>}
  </div>
}
