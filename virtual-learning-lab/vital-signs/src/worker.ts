interface Env { ASSETS: Fetcher; DB?: D1Database }

const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});

export default {
  async fetch(request:Request,env:Env):Promise<Response>{
    const url=new URL(request.url);
    if(url.pathname==='/healthz') return json({ok:true,system:'RTAFNC Vital Signs Virtual Learning Lab',version:'0.1.0',time:new Date().toISOString(),storage:env.DB?'d1':'demo-local'});

    if(url.pathname==='/api/session'&&request.method==='POST'){
      const body=await request.json().catch(()=>null) as Record<string,unknown>|null;
      if(!body||typeof body!=='object') return json({ok:false,error:'invalid_json'},400);
      const id=crypto.randomUUID(); const createdAt=new Date().toISOString();
      if(env.DB){
        await env.DB.prepare('INSERT INTO sessions (id,user_id,lesson_id,status,total_score,payload_json,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)')
          .bind(id,String(body.userId||'demo-student'),String(body.lessonId||'vital-signs-01'),String(body.status||'completed'),Number(body.totalScore||0),JSON.stringify(body),createdAt,createdAt).run();
      }
      return json({ok:true,id,persisted:Boolean(env.DB),createdAt},201);
    }

    if(url.pathname==='/api/events'&&request.method==='POST'){
      const body=await request.json().catch(()=>null) as {sessionId?:string;events?:unknown[]}|null;
      if(!body?.sessionId||!Array.isArray(body.events)) return json({ok:false,error:'sessionId_and_events_required'},400);
      if(env.DB){
        const stmts=body.events.slice(0,250).map((e)=>env.DB!.prepare('INSERT INTO audit_logs (id,session_id,event_json,created_at) VALUES (?,?,?,?)').bind(crypto.randomUUID(),body.sessionId,JSON.stringify(e),new Date().toISOString()));
        if(stmts.length) await env.DB.batch(stmts);
      }
      return json({ok:true,count:body.events.length,persisted:Boolean(env.DB)});
    }

    if(url.pathname==='/api/sessions'&&request.method==='GET'){
      if(!env.DB) return json({ok:true,items:[],mode:'demo-local'});
      const result=await env.DB.prepare('SELECT id,user_id,lesson_id,status,total_score,created_at,updated_at FROM sessions ORDER BY created_at DESC LIMIT 100').all();
      return json({ok:true,items:result.results});
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
