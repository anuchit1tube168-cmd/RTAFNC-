interface Env { ASSETS: Fetcher; DB?: D1Database }

type EventItem={at?:string;action?:string;target?:string;result?:string;scoreDelta?:number};
type SessionPayload={
  userId?:string; lessonId?:string; status?:string; totalScore?:number; durationSec?:number;
  startedAt?:string; completedAt?:string; scores?:Record<string,number>; criticalErrors?:string[];
  logs?:EventItem[]; quizScore?:number; quizTotal?:number; quizAnswers?:Record<string,string>;
  worksheet?:Record<string,string>; reflection?:string; instructorFeedback?:string;
};

const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const safeText=(value:unknown,fallback='')=>typeof value==='string'?value:fallback;
const safeNum=(value:unknown,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;

export default {
  async fetch(request:Request,env:Env):Promise<Response>{
    const url=new URL(request.url);

    if(url.pathname==='/healthz'){
      let database='demo-local';
      if(env.DB){
        try{await env.DB.prepare('SELECT 1 AS ok').first();database='d1:ok';}catch{database='d1:error';}
      }
      return json({ok:database!=='d1:error',system:'RTAFNC Vital Signs Virtual Learning Lab',version:'0.2.0',time:new Date().toISOString(),storage:database});
    }

    if(url.pathname==='/api/session'&&request.method==='POST'){
      const body=await request.json().catch(()=>null) as SessionPayload|null;
      if(!body||typeof body!=='object') return json({ok:false,error:'invalid_json'},400);
      const id=crypto.randomUUID();
      const startedAt=safeText(body.startedAt,new Date().toISOString());
      const completedAt=safeText(body.completedAt,new Date().toISOString());
      const lessonId=safeText(body.lessonId,'vital-signs-01').slice(0,120);
      const status=safeText(body.status,'completed').slice(0,40);
      const scores=body.scores&&typeof body.scores==='object'?body.scores:{};
      const criticalErrors=Array.isArray(body.criticalErrors)?body.criticalErrors.slice(0,50):[];
      const logs=Array.isArray(body.logs)?body.logs.slice(0,250):[];

      if(env.DB){
        const statements:D1PreparedStatement[]=[];
        statements.push(env.DB.prepare(`INSERT INTO vlab_sessions
          (id,user_id,lesson_id,status,started_at,completed_at,total_score,duration_sec,scores_json,critical_errors,created_at,updated_at)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
          .bind(id,body.userId?String(body.userId).slice(0,120):null,lessonId,status,startedAt,completedAt,Math.round(safeNum(body.totalScore)),Math.max(0,Math.round(safeNum(body.durationSec))),JSON.stringify(scores),criticalErrors.length,startedAt,completedAt));

        for(const [domain,score] of Object.entries(scores).slice(0,20)){
          statements.push(env.DB.prepare('INSERT INTO vlab_skill_scores (session_id,domain,score,created_at) VALUES (?,?,?,?)')
            .bind(id,domain.slice(0,80),Math.round(safeNum(score)),completedAt));
        }

        if(typeof body.quizScore==='number'){
          statements.push(env.DB.prepare('INSERT INTO vlab_quiz_results (session_id,score,total,answers_json,created_at) VALUES (?,?,?,?,?)')
            .bind(id,Math.round(body.quizScore),Math.max(1,Math.round(safeNum(body.quizTotal,100))),JSON.stringify(body.quizAnswers||{}),completedAt));
        }

        if(body.worksheet&&typeof body.worksheet==='object'){
          statements.push(env.DB.prepare('INSERT INTO vlab_worksheets (session_id,worksheet_json,updated_at) VALUES (?,?,?)')
            .bind(id,JSON.stringify(body.worksheet),completedAt));
        }

        if(body.reflection){
          statements.push(env.DB.prepare('INSERT INTO vlab_reflections (session_id,reflection_json,created_at) VALUES (?,?,?)')
            .bind(id,JSON.stringify({reflection:String(body.reflection).slice(0,10000)}),completedAt));
        }

        if(body.instructorFeedback){
          statements.push(env.DB.prepare('INSERT INTO vlab_feedback (session_id,source,message,created_at) VALUES (?,?,?,?)')
            .bind(id,'instructor',String(body.instructorFeedback).slice(0,10000),completedAt));
        }

        for(const event of logs){
          statements.push(env.DB.prepare(`INSERT INTO vlab_actions
            (session_id,action_type,object_id,phase,result,score_delta,state_json,client_ts,created_at)
            VALUES (?,?,?,?,?,?,?,?,?)`)
            .bind(id,safeText(event.action,'event').slice(0,100),event.target?String(event.target).slice(0,120):null,null,safeText(event.result).slice(0,2000),Math.round(safeNum(event.scoreDelta)),JSON.stringify({}),safeText(event.at,completedAt),completedAt));
        }

        statements.push(env.DB.prepare('INSERT INTO vlab_audit_logs (session_id,event_type,detail_json,created_at) VALUES (?,?,?,?)')
          .bind(id,'session.completed',JSON.stringify({lessonId,status,totalScore:safeNum(body.totalScore),criticalErrors:criticalErrors.length}),completedAt));

        await env.DB.batch(statements);
      }
      return json({ok:true,id,persisted:Boolean(env.DB),createdAt:completedAt},201);
    }

    if(url.pathname==='/api/events'&&request.method==='POST'){
      const body=await request.json().catch(()=>null) as {sessionId?:string;events?:EventItem[]}|null;
      if(!body?.sessionId||!Array.isArray(body.events)) return json({ok:false,error:'sessionId_and_events_required'},400);
      if(env.DB){
        const now=new Date().toISOString();
        const stmts=body.events.slice(0,250).map(event=>env.DB!.prepare(`INSERT INTO vlab_actions
          (session_id,action_type,object_id,phase,result,score_delta,state_json,client_ts,created_at)
          VALUES (?,?,?,?,?,?,?,?,?)`)
          .bind(String(body.sessionId).slice(0,120),safeText(event.action,'event').slice(0,100),event.target?String(event.target).slice(0,120):null,null,safeText(event.result).slice(0,2000),Math.round(safeNum(event.scoreDelta)),JSON.stringify({}),safeText(event.at,now),now));
        if(stmts.length) await env.DB.batch(stmts);
      }
      return json({ok:true,count:body.events.length,persisted:Boolean(env.DB)});
    }

    if(url.pathname==='/api/sessions'&&request.method==='GET'){
      if(!env.DB) return json({ok:true,items:[],mode:'demo-local'});
      const result=await env.DB.prepare(`SELECT id,user_id,lesson_id,status,total_score,duration_sec,scores_json,critical_errors,started_at,completed_at,created_at,updated_at
        FROM vlab_sessions ORDER BY created_at DESC LIMIT 100`).all();
      return json({ok:true,items:result.results});
    }

    if(url.pathname==='/api/teacher/summary'&&request.method==='GET'){
      if(!env.DB) return json({ok:true,mode:'demo-local',summary:{learners:0,sessions:0,completed:0,averageScore:0,criticalErrors:0}});
      const row=await env.DB.prepare(`SELECT COUNT(*) AS sessions, COUNT(DISTINCT COALESCE(user_id,id)) AS learners,
        SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) AS completed,
        ROUND(AVG(total_score),1) AS averageScore, SUM(critical_errors) AS criticalErrors FROM vlab_sessions`).first();
      return json({ok:true,summary:row});
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
