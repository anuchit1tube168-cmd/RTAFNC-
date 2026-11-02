interface Env { LAB: KVNamespace; ASSETS: Fetcher }

type Session = {
  id: string; course: string; lesson: string; mode: 'demo'; createdAt: string; startedAt?: string; completedAt?: string;
  events: Array<{ at: string; type: string; payload: unknown }>;
  rawTotal?: number; clo1?: number; labScores?: Record<string, number>; criticalErrors?: number; durationSec?: number;
  quizScore?: number; worksheet?: unknown; reflection?: unknown; completed?: boolean;
};

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
const QUIZ = [
  ['q1','รหัสรายวิชาการฝึกทหาร 1 คือข้อใด',['พอวท 1201','พอวท 2202','พอวท 4204'],0],
  ['q2','CLO1 ของรายวิชานี้เน้นทักษะใด',['บุคคลท่ามือเปล่า','การเขียนรายงานการลา','การเดินทางไกล'],0],
  ['q3','แบบประเมินบุคคลท่ามือเปล่ามีกี่ท่า',['20 ท่า','7 ท่า','10 ท่า'],0],
  ['q4','คะแนนดิบเต็มของ CLO1 เท่ากับเท่าใด',['60','40','100'],0],
  ['q5','คะแนนถ่วงน้ำหนักของ CLO1 เต็มเท่าใด',['40','60','20'],0],
  ['q6','ระดับ 3 หมายถึงข้อใด',['ปฏิบัติได้ถูกต้องครบถ้วนด้วยตนเอง','ต้องได้รับคำแนะนำทั้งหมด','ไม่สามารถปฏิบัติได้'],0],
  ['q7','ระดับ 2 หมายถึงข้อใด',['ถูกต้องเป็นส่วนใหญ่โดยมีคำแนะนำบางส่วน','ผิดทั้งหมด','ไม่ต้องประเมิน'],0],
  ['q8','ข้อใดอยู่ในชุดฝึกที่ตรวจยืนยันจาก Source',['ท่ากลับหลังหัน','ท่ากระโดดสูง','ท่าว่ายน้ำ'],0],
  ['q9','ท่าวิ่งเปลี่ยนเป็นเดินอยู่ลำดับใด',['18','8','28'],0],
  ['q10','ท่าเปลี่ยนเท้าในเวลาวิ่งอยู่ลำดับใด',['20','12','5'],0]
] as const;

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
const body = async (req: Request) => { if (Number(req.headers.get('content-length') || 0) > 50_000) throw new Error('payload_too_large'); return req.json() as Promise<any>; };
const getSession = (env: Env, id: string | null) => id ? env.LAB.get(`mt1:session:${id}`, { type: 'json' }) as Promise<Session | null> : Promise.resolve(null);
const saveSession = (env: Env, s: Session) => env.LAB.put(`mt1:session:${s.id}`, JSON.stringify(s), { expirationTtl: 60 * 60 * 24 * 30 });

async function updateStats(env: Env, s: Session, event: 'create'|'complete'|'quiz') {
  const key = 'mt1:stats:v2';
  const stats = await env.LAB.get(key, { type: 'json' }) as any || { sessions: 0, completed: 0, totalClo1: 0, quizCount: 0, totalQuiz: 0, criticalErrors: 0 };
  if (event === 'create') stats.sessions += 1;
  if (event === 'complete') { stats.completed += 1; stats.totalClo1 += s.clo1 || 0; stats.criticalErrors += s.criticalErrors || 0; }
  if (event === 'quiz') { stats.quizCount += 1; stats.totalQuiz += s.quizScore || 0; }
  stats.lastUpdated = new Date().toISOString(); await env.LAB.put(key, JSON.stringify(stats)); return stats;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(req.url); const p = url.pathname;
      if (p === '/healthz') return json({ ok: true, status: 'healthy', service: 'rtafnc-mt1-virtual-lab', version: '0.2.0', course: 'พอวท 1201', storage: 'KV', environment: 'UAT', productionWrite: false, time: new Date().toISOString() });
      if (p === '/api/course') return json({ code: 'พอวท 1201', name: 'การฝึกทหาร 1', lesson: 'บุคคลท่ามือเปล่า', clo: 'CLO1', rawMax: 60, weightedMax: 40, drills: 20 });
      if (p === '/api/session' && req.method === 'POST') {
        const x = await body(req); if (x.mode !== 'demo') return json({ ok: false, error: 'demo_only' }, 403);
        const s: Session = { id: crypto.randomUUID(), course: 'พอวท 1201', lesson: 'CLO1 บุคคลท่ามือเปล่า', mode: 'demo', createdAt: new Date().toISOString(), events: [] };
        await saveSession(env, s); await updateStats(env, s, 'create'); return json({ ok: true, sessionId: s.id });
      }
      if (p === '/api/event' && req.method === 'POST') {
        const x = await body(req); const allowed = new Set(['start_simulation','action','decision','feedback','object_selected','pause','resume','reset','completion']);
        if (!allowed.has(x.type)) return json({ ok: false, error: 'invalid_event' }, 400);
        const s = await getSession(env, x.sessionId); if (!s) return json({ ok: false, error: 'session_not_found' }, 404);
        s.events = [...s.events, { at: new Date().toISOString(), type: x.type, payload: x.payload || {} }].slice(-300); await saveSession(env, s); return json({ ok: true });
      }
      if (p === '/api/complete' && req.method === 'POST') {
        const x = await body(req); const s = await getSession(env, x.sessionId); if (!s) return json({ ok: false, error: 'session_not_found' }, 404);
        s.rawTotal = Math.max(0, Math.min(60, Number(x.rawTotal) || 0)); s.clo1 = Math.round((s.rawTotal * 40 / 60) * 100) / 100;
        s.labScores = x.labScores || {}; s.criticalErrors = Math.max(0, Number(x.criticalErrors) || 0); s.durationSec = Math.max(0, Number(x.durationSec) || 0); s.completed = true; s.completedAt = new Date().toISOString();
        await saveSession(env, s); await updateStats(env, s, 'complete'); return json({ ok: true, rawTotal: s.rawTotal, clo1: s.clo1 });
      }
      if (p === '/api/quiz' && req.method === 'GET') return json({ questions: QUIZ.map(([id,text,options]) => ({ id,text,options })) });
      if (p === '/api/quiz' && req.method === 'POST') {
        const x = await body(req); const s = await getSession(env, x.sessionId); if (!s) return json({ ok: false, error: 'session_not_found' }, 404);
        let correct = 0; for (const [id,,,answer] of QUIZ) if (Number(x.answers?.[id]) === answer) correct += 1; s.quizScore = Math.round(correct / QUIZ.length * 100); await saveSession(env, s); await updateStats(env, s, 'quiz'); return json({ ok: true, score: s.quizScore, correct, total: QUIZ.length });
      }
      if ((p === '/api/worksheet' || p === '/api/reflection') && req.method === 'POST') {
        const x = await body(req); const s = await getSession(env, x.sessionId); if (!s) return json({ ok: false, error: 'session_not_found' }, 404);
        const safe: Record<string,string> = {}; for (const [k,v] of Object.entries(x.fields || {})) safe[k] = String(v).slice(0, 3000); (s as any)[p.endsWith('worksheet') ? 'worksheet' : 'reflection'] = { fields: safe, savedAt: new Date().toISOString() }; await saveSession(env, s); return json({ ok: true });
      }
      if (p === '/api/dashboard/student' && req.method === 'GET') {
        const s = await getSession(env, url.searchParams.get('session')); if (!s) return json({ ok: false, error: 'session_not_found' }, 404);
        return json({ mode: 'demo', course: s.course, lesson: s.lesson, completed: !!s.completed, rawTotal: s.rawTotal ?? null, clo1: s.clo1 ?? null, labScores: s.labScores ?? {}, quizScore: s.quizScore ?? null, criticalErrors: s.criticalErrors ?? 0, durationSec: s.durationSec ?? 0, eventCount: s.events.length, worksheet: s.worksheet ? 'saved' : 'not_started', reflection: s.reflection ? 'saved' : 'not_started' });
      }
      if (p === '/api/dashboard/instructor' && req.method === 'GET') {
        const z = await env.LAB.get('mt1:stats:v2', { type: 'json' }) as any || { sessions: 0, completed: 0, totalClo1: 0, quizCount: 0, totalQuiz: 0, criticalErrors: 0 };
        return json({ mode: 'demo-aggregate-only', realStudentData: false, sessions: z.sessions, completionRate: z.sessions ? Math.round(z.completed / z.sessions * 100) : 0, averageClo1: z.completed ? Math.round(z.totalClo1 / z.completed * 100) / 100 : 0, averageQuiz: z.quizCount ? Math.round(z.totalQuiz / z.quizCount) : 0, criticalErrors: z.criticalErrors, lastUpdated: z.lastUpdated || null });
      }
      if (p === '/api/debriefing' && req.method === 'GET') {
        const s = await getSession(env, url.searchParams.get('session')); if (!s) return json({ ok: false, error: 'session_not_found' }, 404);
        return json({ sessionId: s.id, timeline: s.events.map((e, i) => ({ index: i + 1, at: e.at, event: e.type, payload: e.payload })), result: { rawTotal: s.rawTotal ?? null, clo1: s.clo1 ?? null, criticalErrors: s.criticalErrors ?? 0 }, recommendedPath: 'Briefing → Assessment → Decision → Practice 20 drills → Evaluation → Reflection → Debriefing' });
      }
      if (p.startsWith('/api/')) return json({ ok: false, error: 'not_found' }, 404);
      return env.ASSETS.fetch(req);
    } catch (error) {
      return json({ ok: false, error: error instanceof Error && error.message === 'payload_too_large' ? 'payload_too_large' : 'server_error' }, error instanceof Error && error.message === 'payload_too_large' ? 413 : 500);
    }
  }
} satisfies ExportedHandler<Env>;
