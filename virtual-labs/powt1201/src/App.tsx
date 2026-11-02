import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import { drills, officialClo1 } from './data/drills';

const api = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(path, { headers: { 'content-type': 'application/json' }, ...init });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
};

type ModalName = '' | 'worksheet' | 'quiz' | 'reflection' | 'dashboard' | 'debrief';
type DomainScores = { knowledge: number; skill: number; reasoning: number; safety: number; communication: number; time: number; professionalism: number };

const emptyDomains: DomainScores = { knowledge: 0, skill: 0, reasoning: 0, safety: 10, communication: 5, time: 5, professionalism: 10 };

function Cadet({ pose }: { pose: string }) {
  const turn = pose === 'left-turn' ? Math.PI / 2 : pose === 'right-turn' ? -Math.PI / 2 : pose === 'about-turn' ? Math.PI : 0;
  const rest = pose.includes('rest') || pose === 'fall-out';
  const salute = pose === 'salute';
  const run = ['run', 'halt-run', 'run-to-walk', 'walk-to-run', 'change-step-run'].includes(pose);
  const march = ['march', 'halt-march', 'parade-march', 'halt-parade'].includes(pose);
  return (
    <group rotation-y={turn} position={[0, 0, 0]}>
      <mesh position={[0, 2.55, 0]}><sphereGeometry args={[0.28, 24, 24]} /><meshStandardMaterial color="#efc4a5" /></mesh>
      <mesh position={[0, 1.65, 0]}><boxGeometry args={[0.72, 1.28, 0.36]} /><meshStandardMaterial color="#5fa7d1" /></mesh>
      <mesh position={[-0.48, 1.68, 0]} rotation-z={rest ? -0.4 : march || run ? 0.45 : 0}><boxGeometry args={[0.16, 0.96, 0.16]} /><meshStandardMaterial color="#efc4a5" /></mesh>
      <mesh position={[0.48, salute ? 2.05 : 1.68, 0]} rotation-z={salute ? -1.1 : rest ? 0.4 : march || run ? -0.45 : 0}><boxGeometry args={[0.16, 0.96, 0.16]} /><meshStandardMaterial color="#efc4a5" /></mesh>
      <mesh position={[-0.2, 0.62, 0]} rotation-x={march || run ? 0.18 : 0}><boxGeometry args={[0.2, 1.22, 0.22]} /><meshStandardMaterial color="#263d52" /></mesh>
      <mesh position={[0.2, 0.62, 0]} rotation-x={march || run ? -0.18 : 0}><boxGeometry args={[0.2, 1.22, 0.22]} /><meshStandardMaterial color="#263d52" /></mesh>
    </group>
  );
}

function DrillScene({ pose, onObject }: { pose: string; onObject: () => void }) {
  return (
    <Canvas camera={{ position: [7, 5, 8], fov: 45 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#071521']} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 8, 5]} intensity={1.7} castShadow />
      <gridHelper args={[18, 18, '#557990', '#38546a']} />
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}><planeGeometry args={[18, 14]} /><meshStandardMaterial color="#294354" /></mesh>
      <mesh position={[0, 2, -5]}><boxGeometry args={[11, 4, 0.25]} /><meshStandardMaterial color="#173149" /></mesh>
      <Cadet pose={pose} />
      <mesh position={[-2.8, 0.4, 2.7]} onClick={onObject}><coneGeometry args={[0.42, 0.8, 20]} /><meshStandardMaterial color="#f4bd58" /></mesh>
      <Text position={[-2.8, 1.1, 2.7]} fontSize={0.22} color="#f4e5b1">จุดฝึก</Text>
      <OrbitControls makeDefault enablePan enableZoom minDistance={4} maxDistance={13} maxPolarAngle={Math.PI / 2.05} />
    </Canvas>
  );
}

function Modal({ title, children, close }: { title: string; children: React.ReactNode; close: () => void }) {
  return <div className="modalBack"><div className="modal"><h2>{title}</h2>{children}<button className="btn" onClick={close}>ปิด</button></div></div>;
}

function FormModal({ sessionId, type, close }: { sessionId: string; type: 'worksheet' | 'reflection'; close: () => void }) {
  const labels = type === 'reflection'
    ? ['สิ่งที่ทำได้ดี', 'สิ่งที่ผิดพลาด', 'สิ่งที่ได้เรียนรู้', 'หากทำใหม่จะปรับอะไร', 'สิ่งที่ยังไม่มั่นใจ']
    : ['Objective', 'Assessment', 'Observation', 'Intervention', 'Result', 'Analysis', 'Reflection', 'Conclusion'];
  const [fields, setFields] = useState<Record<string, string>>({});
  const save = async () => {
    await api(`/api/${type}`, { method: 'POST', body: JSON.stringify({ sessionId, fields }) });
    close();
  };
  return <Modal title={type === 'worksheet' ? 'Digital Worksheet' : 'Reflection'} close={close}>{labels.map((label, i) => <label className="fieldWrap" key={label}>{label}<textarea value={fields[i] ?? ''} onChange={e => setFields(v => ({ ...v, [i]: e.target.value }))} /></label>)}<button className="btn primary" onClick={save}>บันทึก</button>{type === 'worksheet' && <button className="btn" onClick={() => window.print()}>พิมพ์ / Export PDF</button>}</Modal>;
}

function QuizModal({ sessionId, close, onKnowledge }: { sessionId: string; close: () => void; onKnowledge: (n: number) => void }) {
  const [questions, setQuestions] = useState<any[]>([]); const [answers, setAnswers] = useState<Record<string, number>>({}); const [result, setResult] = useState<any>(null);
  useEffect(() => { api<any>('/api/quiz').then(x => setQuestions(x.questions)); }, []);
  const submit = async () => { const r = await api<any>('/api/quiz', { method: 'POST', body: JSON.stringify({ sessionId, answers }) }); setResult(r); onKnowledge(Math.round(r.score * 0.15)); };
  return <Modal title="Quiz" close={close}>{questions.map((q, i) => <section className="card" key={q.id}><b>{i + 1}. {q.text}</b>{q.options.map((o: string, n: number) => <button key={o} className={'btn choice ' + (answers[q.id] === n ? 'primary' : '')} onClick={() => setAnswers(v => ({ ...v, [q.id]: n }))}>{o}</button>)}</section>)}{result && <p className="result">คะแนน {result.score}% ({result.correct}/{result.total})</p>}<button className="btn primary" onClick={submit}>ตรวจคะแนน</button></Modal>;
}

export function App() {
  const [inside, setInside] = useState(false); const [sessionId, setSessionId] = useState(localStorage.getItem('mt1-session') ?? '');
  const [index, setIndex] = useState(0); const [started, setStarted] = useState(false); const [paused, setPaused] = useState(false); const [attempts, setAttempts] = useState(0);
  const [pose, setPose] = useState('attention'); const [levels, setLevels] = useState<number[]>([]); const [message, setMessage] = useState(''); const [modal, setModal] = useState<ModalName>('');
  const [domains, setDomains] = useState<DomainScores>(emptyDomains); const [criticalErrors, setCriticalErrors] = useState(0); const [startedAt, setStartedAt] = useState(0); const [dashboard, setDashboard] = useState<any>(null);
  const current = drills[index]; const raw = levels.reduce((a, b) => a + b, 0); const weighted = officialClo1.convert(raw); const progress = Math.round((levels.length / drills.length) * 100);
  const labTotal = useMemo(() => Math.min(100, Object.values(domains).reduce((a, b) => a + b, 0)), [domains]);

  const log = (type: string, payload: unknown = {}) => sessionId && api('/api/event', { method: 'POST', body: JSON.stringify({ sessionId, type, payload }) }).catch(() => undefined);
  const enter = async () => { let sid = sessionId; if (!sid) { const r = await api<any>('/api/session', { method: 'POST', body: JSON.stringify({ mode: 'demo' }) }); sid = r.sessionId; localStorage.setItem('mt1-session', sid); setSessionId(sid); } setInside(true); };
  const start = () => { setStarted(true); setPaused(false); setStartedAt(Date.now()); setMessage('เริ่มฝึกแล้ว — เลือกท่าให้ตรงคำสั่ง'); log('start_simulation'); };
  const reset = () => { setIndex(0); setStarted(false); setPaused(false); setAttempts(0); setPose('attention'); setLevels([]); setCriticalErrors(0); setDomains(emptyDomains); setMessage('รีเซ็ตแล้ว'); log('reset'); };
  const complete = async (next: number[]) => {
    const rawTotal = next.reduce((a, b) => a + b, 0); const clo1 = officialClo1.convert(rawTotal); const skill = Math.round((rawTotal / 60) * 45);
    const nextDomains = { ...domains, skill }; setDomains(nextDomains); setPaused(true); setModal('debrief');
    await api('/api/complete', { method: 'POST', body: JSON.stringify({ sessionId, rawTotal, clo1, labScores: nextDomains, criticalErrors, durationSec: Math.round((Date.now() - startedAt) / 1000) }) });
    log('completion', { rawTotal, clo1 });
  };
  const choose = (id: string) => {
    if (!started || paused) return; setPose(id); log('action', { selected: id, expected: current.id });
    if (id === current.id) { const level = attempts === 0 ? 3 : 2; const next = [...levels, level]; setLevels(next); setAttempts(0); setMessage(`ถูกต้อง — ระดับ ${level}`); log('feedback', { result: 'correct', level }); if (index === drills.length - 1) setTimeout(() => complete(next), 250); else setTimeout(() => setIndex(v => v + 1), 250); }
    else { const n = attempts + 1; setAttempts(n); setMessage(n >= 2 ? 'ยังไม่ตรงคำสั่ง — ระบบบันทึกระดับ 1 และเดินหน้าต่อ' : 'ไม่ตรงคำสั่ง ลองแก้ไขได้'); log('feedback', { result: 'incorrect', attempt: n }); if (n >= 2) { const next = [...levels, 1]; setLevels(next); setAttempts(0); if (index === drills.length - 1) setTimeout(() => complete(next), 300); else setTimeout(() => setIndex(v => v + 1), 300); } }
  };
  const decision = (choice: 'safe' | 'rush' | 'ignore') => {
    if (choice === 'safe') { setDomains(v => ({ ...v, reasoning: Math.min(10, v.reasoning + 2), safety: Math.min(10, v.safety + 1) })); setMessage('Decision: รักษาความพร้อมก่อนปฏิบัติ'); }
    if (choice === 'rush') { setDomains(v => ({ ...v, reasoning: Math.max(0, v.reasoning - 1) })); setMessage('Decision: รีบปฏิบัติ — ได้รับ Warning'); }
    if (choice === 'ignore') { setCriticalErrors(v => v + 1); setDomains(v => ({ ...v, safety: Math.max(0, v.safety - 3) })); setMessage('Safety event: ฝืนปฏิบัติต่อหลังคำเตือน'); }
    log('decision', { choice });
  };
  const openDashboard = async () => { setDashboard(await api(`/api/dashboard/student?session=${sessionId}`)); setModal('dashboard'); };

  if (!inside) return <main className="landing"><section className="hero"><p className="eyebrow">3D VIRTUAL LEARNING LAB</p><h1>การฝึกทหาร 1<br /><span>Virtual Learning Lab</span></h1><p>พอวท 1201 • นักเรียนพยาบาลทหารอากาศ ชั้นปีที่ 1 • Demo/UAT</p><button className="btn primary" onClick={enter}>เข้าสู่ห้องฝึก 3D</button><div className="featureGrid">{['20 ท่าตาม Source','3D 360°','Action → State Change','Quiz / Worksheet','Event Logging','Dashboard'].map(x => <div key={x}>{x}</div>)}</div><small>Simulation simplification — ไม่แทนการประเมินภาคสนามโดยครูผู้ฝึก</small></section></main>;

  return <main className="app"><header><div><b>พอวท 1201 — การฝึกทหาร 1</b><small>บุคคลท่ามือเปล่า (CLO1) • ปีการศึกษา 2569</small></div><span className="badge">UAT / Demo</span></header>
    <div className="layout"><aside className="left"><h3>ภารกิจ {progress}%</h3>{drills.map((d, i) => <div key={d.id} className={'task ' + (i === index ? 'active' : '') + (i < index ? ' done' : '')}>{i < index ? '✓' : i === index ? '▶' : '•'} {d.order}. {d.label}</div>)}</aside>
      <section className="stage"><div className="command">{started ? <>คำสั่ง: <b>{current.label}</b></> : <b>กด Start เพื่อเริ่ม</b>}</div><DrillScene pose={pose} onObject={() => { setMessage('Interactive Object: จุดฝึก'); log('object_selected', { id: 'training-marker' }); }} /></section>
      <aside className="right"><section className="card"><h3>คะแนน CLO1</h3><div className="big">{weighted.toFixed(2)} / 40</div><small>raw {raw} / 60 • Simulation evidence</small></section><section className="card"><h3>Lab Analytics</h3><div className="big">{labTotal} / 100</div><small>ไม่ใช่คะแนนสอบทางการ</small></section><section className="card"><h3>Decision Point</h3><button className="btn" onClick={() => decision('safe')}>รักษาความพร้อมก่อนปฏิบัติ</button><button className="btn" onClick={() => decision('rush')}>รีบปฏิบัติ</button><button className="btn danger" onClick={() => decision('ignore')}>ฝืนทำต่อหลังคำเตือน</button><small>Critical errors: {criticalErrors}</small></section><button className="btn" onClick={openDashboard}>Student Dashboard</button></aside></div>
    <nav className="bottom"><button className="btn primary" onClick={start}>Start</button><button className="btn" onClick={() => { setPaused(v => !v); log(paused ? 'resume' : 'pause'); }}>{paused ? 'Resume' : 'Pause'}</button><button className="btn danger" onClick={reset}>Reset</button>{drills.map(d => <button key={d.id} className="btn" onClick={() => choose(d.id)}>{d.label}</button>)}</nav>
    <div className="tools"><button className="btn" onClick={() => setModal('worksheet')}>Worksheet</button><button className="btn" onClick={() => setModal('quiz')}>Quiz</button><button className="btn" onClick={() => setModal('reflection')}>Reflection</button></div>{message && <div className="toast" onClick={() => setMessage('')}>{message}</div>}
    {modal === 'worksheet' && <FormModal sessionId={sessionId} type="worksheet" close={() => setModal('')} />}{modal === 'reflection' && <FormModal sessionId={sessionId} type="reflection" close={() => setModal('')} />}{modal === 'quiz' && <QuizModal sessionId={sessionId} close={() => setModal('')} onKnowledge={n => setDomains(v => ({ ...v, knowledge: n }))} />}{modal === 'dashboard' && <Modal title="Student Dashboard" close={() => setModal('')}><pre>{JSON.stringify(dashboard, null, 2)}</pre></Modal>}{modal === 'debrief' && <Modal title="Debriefing" close={() => setModal('')}><p>คะแนนดิบ {levels.reduce((a,b)=>a+b,0)} / 60 → CLO1 {officialClo1.convert(levels.reduce((a,b)=>a+b,0)).toFixed(2)} / 40</p><p>Critical errors: {criticalErrors}</p><p>ระบบนี้ใช้เพื่อฝึกซ้ำและสะท้อนผล ไม่แทนการประเมินภาคสนามจริง</p></Modal>}
  </main>;
}
