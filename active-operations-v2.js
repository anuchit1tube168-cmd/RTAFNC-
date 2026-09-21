const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const LOCAL_ROSTER="./core-agent-roster-v2.json";
const PIXELLAB_MANIFEST="./assets/pixellab/core12/manifest.json";
const REMOTE_BASE="https://anuchit1tube168-cmd.github.io/agis-pirate-armada1/data/";
let DATA={roster:[],state:[],activity:[],signals:[],candidates:null,jobs:[],schedule:[],training:[],pixellab:{agents:[]}};

function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function getJSON(url){const r=await fetch(url+"?v="+Date.now(),{cache:"no-store"});if(!r.ok)throw new Error(r.status);return r.json()}
function setView(id){$$(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===id));$$(".view").forEach(v=>v.classList.toggle("active",v.id===id));window.scrollTo({top:0,behavior:"smooth"})}
$$(".nav button").forEach(b=>b.onclick=()=>setView(b.dataset.view));
$$("[data-jump]").forEach(b=>b.onclick=()=>setView(b.dataset.jump));
setInterval(()=>{$("#clock").textContent=new Date().toLocaleTimeString("th-TH")},1000);


const CORE_PIXEL_SPECS={
 "AG-001":{id:"atlas",name:"ATLAS",primary:"#3B82F6",secondary:"#8ED8FF",skin:"#d7a078",hair:"#101827",ink:"#07111c",accessory:"crown",expression:"focused"},
 "AG-002":{id:"oracle",name:"ORACLE",primary:"#8B5CF6",secondary:"#D8C4FF",skin:"#e0aa80",hair:"#2f204d",ink:"#0d1020",accessory:"target",expression:"focused"},
 "AG-003":{id:"scout",name:"SCOUT",primary:"#14B8A6",secondary:"#99F6E4",skin:"#c98e6a",hair:"#162b32",ink:"#071820",accessory:"compass",expression:"alert"},
 "AG-004":{id:"echo",name:"ECHO",primary:"#EC4899",secondary:"#FBCFE8",skin:"#e2ad82",hair:"#4a2138",ink:"#180912",accessory:"book",expression:"calm"},
 "AG-005":{id:"forge",name:"FORGE",primary:"#F97316",secondary:"#FED7AA",skin:"#d9a17a",hair:"#382317",ink:"#160b06",accessory:"pan",expression:"focused"},
 "AG-006":{id:"aether",name:"AETHER",primary:"#2563EB",secondary:"#BFDBFE",skin:"#d8a47a",hair:"#1f2937",ink:"#07111c",accessory:"crystal",expression:"calm"},
 "AG-007":{id:"maker",name:"MAKER",primary:"#22C55E",secondary:"#BBF7D0",skin:"#c98862",hair:"#2b2421",ink:"#07140d",accessory:"hammer",expression:"happy"},
 "AG-008":{id:"sentinel",name:"SENTINEL",primary:"#EAB308",secondary:"#FEF08A",skin:"#ddb08c",hair:"#424242",ink:"#161205",accessory:"cross",expression:"focused"},
 "AG-009":{id:"aegis",name:"AEGIS",primary:"#EF4444",secondary:"#FECACA",skin:"#c88d69",hair:"#0d1118",ink:"#120506",accessory:"sword",expression:"alert"},
 "AG-010":{id:"nexus",name:"NEXUS",primary:"#06B6D4",secondary:"#A5F3FC",skin:"#d1a17c",hair:"#263244",ink:"#07131a",accessory:"clone",expression:"calm"},
 "AG-011":{id:"vector",name:"VECTOR",primary:"#A855F7",secondary:"#E9D5FF",skin:"#d6a17a",hair:"#24152f",ink:"#100817",accessory:"target",expression:"happy"},
 "AG-012":{id:"mentor",name:"MENTOR",primary:"#6366F1",secondary:"#C7D2FE",skin:"#d9a77e",hair:"#303452",ink:"#0a0d20",accessory:"book",expression:"calm"}
};
const SHIP_STATIONS={
 "AG-001":[50,13],
 "AG-002":[19,25],
 "AG-003":[82,26],
 "AG-004":[28,25],
 "AG-005":[50,31],
 "AG-006":[18,67],
 "AG-007":[29,68],
 "AG-008":[68,68],
 "AG-009":[78,68],
 "AG-010":[24,78],
 "AG-011":[23,35],
 "AG-012":[87,79]
};
const SHIP_STATE_STATIONS={
 quality:[73,69],
 learning:[87,79],
 blocked:[51,84],
 ready:[50,49]
};
const SHIP_ROOM_BOUNDS={
 "AG-001":[43,57,8,19],
 "AG-002":[10,36,20,40],
 "AG-004":[10,36,20,40],
 "AG-011":[10,36,20,40],
 "AG-005":[42,58,24,39],
 "AG-003":[69,91,20,39],
 "AG-006":[10,37,61,84],
 "AG-007":[10,37,61,84],
 "AG-010":[10,37,61,84],
 "AG-008":[62,82,61,78],
 "AG-009":[62,82,61,78],
 "AG-012":[82,94,69,88]
};
let WORLD={actors:new Map(),raf:0,last:0};
function homeStation(a){return SHIP_STATIONS[a.id]||SHIP_STATE_STATIONS.ready}
function clampToRoom(id,x,y){
 const b=SHIP_ROOM_BOUNDS[id]; if(!b)return [x,y];
 return [Math.max(b[0],Math.min(b[1],x)),Math.max(b[2],Math.min(b[3],y))];
}
function stateTarget(a){
 if(a.status==="BLOCKED")return SHIP_STATE_STATIONS.blocked;
 if(a.status==="REVIEW")return SHIP_STATE_STATIONS.quality;
 if(a.status==="LEARNING")return SHIP_STATE_STATIONS.learning;
 return homeStation(a);
}
function seededOffset(id){
 const n=[...id].reduce((sum,c)=>sum+c.charCodeAt(0),0);
 return [((n*17)%7)-3,((n*29)%5)-2];
}
function queueShipRoute(actor,target,forceCorridor=false){
 const [tx,ty]=target;
 const dist=Math.hypot(tx-actor.x,ty-actor.y);
 if(!forceCorridor||dist<18){
   actor.route=[[tx,ty]];
   return;
 }
 const corridorX=50, corridorY=49;
 actor.route=[
   [corridorX,actor.y],
   [corridorX,corridorY],
   [corridorX,ty],
   [tx,ty]
 ];
}
function nextAmbientTarget(a){
 const home=homeStation(a),off=seededOffset(a.id);
 const raw=[home[0]+off[0]+(Math.random()*7-3.5),home[1]+off[1]+(Math.random()*5-2.5)];
 return clampToRoom(a.id,raw[0],raw[1]);
}
function renderWorld(){
 const host=$("#worldCharacters"),world=$("#agentWorld");
 if(!host||!world||!window.AGIS_PIXEL_STUDIO)return;
 const live=DATA.roster.map(mergedAgent);
 const liveIds=new Set(live.map(a=>a.id));
 for(const [id,actor] of WORLD.actors){if(!liveIds.has(id)){actor.el.remove();WORLD.actors.delete(id)}}
 live.forEach((a,index)=>{
   let actor=WORLD.actors.get(a.id);
   if(!actor){
     const el=document.createElement("button");
     el.className="world-character";
     el.dataset.agent=a.id;
     el.innerHTML='<canvas width="64" height="64"></canvas><img class="pixellab-avatar" alt="" hidden><span class="char-name"></span><small class="char-task"></small><i class="char-bubble"></i>';
     host.appendChild(el);
     const start=[12+(index%4)*24,18+Math.floor(index/4)*25];
     const home=SHIP_STATIONS[a.id]||[50,49];
     actor={el,canvas:el.querySelector("canvas"),img:el.querySelector(".pixellab-avatar"),x:home[0],y:home[1],tx:home[0],ty:home[1],route:[],frame:0,nextWander:0,state:"READY",asset:null,lastAssetSrc:"",lastZone:""};
     WORLD.actors.set(a.id,actor);
     el.onclick=()=>openAgent(a.id);
   }
   const desired=stateTarget(a);
   const zone=a.status==="BLOCKED"?"blocked":a.status==="REVIEW"?"quality":a.status==="LEARNING"?"learning":"home";
   if(a.status==="READY"){
     if(!actor.nextWander||performance.now()>actor.nextWander||actor.lastZone!=="ready"){
       queueShipRoute(actor,nextAmbientTarget(a),false);
       actor.nextWander=performance.now()+3600+Math.random()*4200;
       actor.lastZone="ready";
     }
   }else if(actor.lastZone!==zone||!actor.route?.length){
     queueShipRoute(actor,desired,actor.lastZone&&actor.lastZone!==zone);
     actor.lastZone=zone;
   }
   actor.state=a.status;actor.agent=a;actor.asset=pixellabAssetFor(a.id);actor.el.style.setProperty("--agent",a.color);
   actor.el.className="world-character "+statusClass(a.status)+(actor.asset?.preview?" pixellab-character":"");
   if(actor.asset?.preview){
     actor.img.hidden=false;actor.canvas.hidden=true;
     if(!actor.lastAssetSrc){actor.img.src=actor.asset.preview;actor.lastAssetSrc=actor.asset.preview}
   }else{
     actor.img.hidden=true;actor.canvas.hidden=false;
   }
   actor.el.querySelector(".char-name").textContent=a.codename;
   actor.el.querySelector(".char-task").textContent=(a.currentJob||a.status).slice(0,42);
   actor.el.querySelector(".char-bubble").textContent=a.status==="BLOCKED"?"!":a.status==="REVIEW"?"?":a.status==="LEARNING"?"↻":a.status==="WORKING"?"⚡":"";
 });
 startWorldLoop();
}
function startWorldLoop(){
 if(WORLD.raf)return;
 const tick=(t)=>{
   if(t-WORLD.last>110){
     WORLD.last=t;
     for(const actor of WORLD.actors.values()){
       if(actor.route?.length){
         const [nx,ny]=actor.route[0];actor.tx=nx;actor.ty=ny;
       }
       const dx=actor.tx-actor.x,dy=actor.ty-actor.y,dist=Math.hypot(dx,dy);
       const moving=dist>.45;
       if(moving){
         const step=Math.min(1.2,dist);
         actor.x+=dx/dist*step;actor.y+=dy/dist*step;
       }else if(actor.route?.length){
         actor.x=actor.tx;actor.y=actor.ty;actor.route.shift();
         if(actor.route.length){actor.tx=actor.route[0][0];actor.ty=actor.route[0][1]}
       }
       actor.el.style.left=actor.x+"%";actor.el.style.top=actor.y+"%";
       const mode=moving?"walk":["WORKING","REVIEW","LEARNING"].includes(actor.state)?"action":"idle";
       if(actor.asset?.preview){
         const dir=directionFor(dx,dy);
         const src=actor.asset.directions?.[dir]||actor.asset.preview;
         if(src&&src!==actor.lastAssetSrc){actor.img.src=src;actor.lastAssetSrc=src}
         actor.el.classList.toggle("pixel-working",!moving&&["WORKING","REVIEW","LEARNING"].includes(actor.state));
       }else{
         const spec=CORE_PIXEL_SPECS[actor.agent.id]||CORE_PIXEL_SPECS["AG-001"];
         window.AGIS_PIXEL_STUDIO.drawCharacter(actor.canvas,spec,{mode,frame:actor.frame++%4});
       }
       actor.el.classList.toggle("walking",moving);
     }
   }
   WORLD.raf=requestAnimationFrame(tick);
 };
 WORLD.raf=requestAnimationFrame(tick);
}

function updatePixellabStatus(){
  const el=$("#pixellabStatus"); if(!el)return;
  const count=(DATA.pixellab?.agents||[]).filter(x=>x.preview).length;
  el.textContent="PIXELLAB "+count+"/12 • "+(count?"GENERATED":"FALLBACK");
  el.classList.toggle("ready",count>0);el.classList.toggle("fallback",count===0);
}
function pixellabAssetFor(id){
  return (DATA.pixellab?.agents||[]).find(x=>x.agentId===id&&x.preview)||null;
}
function directionFor(dx,dy){
  if(Math.abs(dx)<.2&&Math.abs(dy)<.2)return "south";
  const vertical=dy<-.2?"north":dy>.2?"south":"";
  const horizontal=dx<-.2?"west":dx>.2?"east":"";
  return vertical&&horizontal?vertical+"-"+horizontal:vertical||horizontal||"south";
}

function stateFor(id){
  const r=DATA.state.find(x=>x.id===id);
  return r||{id,status:"READY",currentJob:"Awaiting approved work",learningState:"READY"};
}
function mergedAgent(a){return {...a,...stateFor(a.id),visual:{...(a.visual||{}),accent:a.color||a.visual?.accent}}}
function statusClass(s){return "state-"+String(s||"READY").toUpperCase()}
function renderOps(){
  const agents=DATA.roster.map(mergedAgent);
  const order=["Command","Business","Product","Intelligence","Engineering","Quality","Learning"];
  const groups=order.map(dept=>[dept,agents.filter(a=>a.department===dept)]).filter(([,list])=>list.length);
  $("#opsDepartments").innerHTML=groups.map(([dept,list])=>`
    <section class="dept-room">
      <div class="dept-room-head"><span>${esc(dept)}</span><b>${list.length} AGENT${list.length>1?"S":""}</b></div>
      <div class="dept-desks">${list.map(a=>`
        <button class="ops-agent ${statusClass(a.status)}" style="--agent:${esc(a.color)}" data-agent="${a.id}">
          <div class="agent-top"><span class="agent-icon">${esc(a.glyph)}</span><span class="agent-title"><small>${esc(a.codename)}</small><b>${esc(a.name)}</b></span></div>
          <p>${esc(a.signature)}</p>
          <div class="skill-mini">${(a.skills||[]).slice(0,2).map(s=>`<span>${esc(s)}</span>`).join("")}</div>
          <div class="state-line"><i class="state-dot"></i><span>${esc(a.status)} • ${esc(a.currentJob||"")}</span></div>
        </button>`).join("")}</div>
    </section>`).join("");
  $$("[data-agent]").forEach(x=>x.onclick=()=>openAgent(x.dataset.agent));
  const count=s=>agents.filter(a=>a.status===s).length;
  $("#kpiAgents").textContent=agents.length;$("#kpiWorking").textContent=count("WORKING");$("#kpiReview").textContent=count("REVIEW");$("#kpiBlocked").textContent=count("BLOCKED");
}
function renderAgents(filter=""){
  const q=filter.trim().toLowerCase();
  const list=DATA.roster.map(mergedAgent).filter(a=>!q||[a.name,a.codename,a.department,a.signature,a.persona,...(a.skills||[])].join(" ").toLowerCase().includes(q));
  $("#agentGrid").innerHTML=list.map(a=>`<article class="agent-card" data-agent="${a.id}" style="--agent:${esc(a.color)}">
    <div class="agent-card-head"><span class="portrait">${esc(a.glyph)}</span><div><small>${esc(a.codename)} • ${esc(a.id)}</small><h3>${esc(a.name)}</h3><div class="dept">${esc(a.department)} • L${esc(a.level)}</div></div></div>
    <p class="persona">${esc(a.persona)}</p>
    <div class="agent-facts"><div><small>THINKING STYLE</small><b>${esc(a.thinking)}</b></div><div><small>SIGNATURE SKILL</small><b>${esc(a.signature)}</b></div><div><small>OUTFIT</small><b>${esc(a.outfit)}</b></div></div>
  </article>`).join("");
  $$("#agentGrid [data-agent]").forEach(x=>x.onclick=()=>openAgent(x.dataset.agent));
}
$("#agentSearch").addEventListener("input",e=>renderAgents(e.target.value));

function openAgent(id){
  const a=mergedAgent(DATA.roster.find(x=>x.id===id));if(!a)return;
  $("#drawerContent").innerHTML=`
    <section class="profile-hero" style="--agent:${esc(a.color)}"><div class="profile-mark">${esc(a.glyph)}</div><small>${esc(a.codename)} • ${esc(a.id)} • L${esc(a.level)}</small><h2>${esc(a.name)}</h2><p>${esc(a.persona)}</p></section>
    <div class="profile-grid">
      <div><small>MISSION</small><b>${esc(a.mission)}</b></div><div><small>THINKING STYLE</small><b>${esc(a.thinking)}</b></div>
      <div><small>SIGNATURE</small><b>${esc(a.signature)}</b></div><div><small>CURRENT STATE</small><b>${esc(a.status)} — ${esc(a.currentJob||"")}</b></div>
      <div><small>KPI</small><b>${esc((a.kpi||[]).join(" • "))}</b></div><div><small>PERMISSION</small><b>${esc(a.permission)}</b></div>
      <div><small>TRIGGER</small><b>${esc(a.trigger)}</b></div><div><small>REVIEWER</small><b>${esc(a.reviewer)}</b></div>
    </div>
    <div class="equip"><h3>Core Skills</h3><div class="equip-list">${(a.skills||[]).map(x=>`<span>${esc(x)}</span>`).join("")}</div></div>
    <div class="equip"><h3>Outfit</h3><p class="persona">${esc(a.outfit)}</p></div>
    <div class="equip"><h3>Equipment</h3><div class="equip-list">${(a.equipment||[]).map(x=>`<span>${esc(x)}</span>`).join("")}</div></div>
    <div class="equip"><h3>Read Context Before Work</h3><div class="context-list">${(a.readContext||[]).map(x=>`<div><span>READ</span><b>${esc(x)}</b></div>`).join("")}</div></div>
    <div class="equip"><h3>Stop / Escalation Rules</h3><div class="context-list stop-list">${(a.stop||[]).map(x=>`<div><span>STOP</span><b>${esc(x)}</b></div>`).join("")}</div></div>
    <div class="equip"><h3>Non-goals</h3><div class="equip-list">${(a.nonGoals||[]).map(x=>`<span>${esc(x)}</span>`).join("")}</div></div>
  `;
  $("#drawer").classList.add("open");$("#drawer").setAttribute("aria-hidden","false");
}
$("[data-close]").onclick=()=>closeDrawer();$$("[data-close]").forEach(x=>x.onclick=closeDrawer);
function closeDrawer(){$("#drawer").classList.remove("open");$("#drawer").setAttribute("aria-hidden","true")}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeDrawer()});

function renderActivity(){
  const items=DATA.activity.slice(0,14);
  $("#activityFeed").innerHTML=items.length?items.map(x=>`<div class="activity-item"><time>${esc(x.time||"—")}</time><div><b>${esc(x.agent||"AGIS")}</b><span>${esc(x.type||"EVENT")}</span><p>${esc(x.text||"")}</p></div></div>`).join(""):'<p class="persona">ยังไม่มี activity evidence</p>';
}
function jobCard(j){
  const owner=j.owner||"UNASSIGNED";
  const ownerAgents=DATA.roster.filter(a=>owner.toLowerCase().includes(a.name.toLowerCase())||owner.toLowerCase().includes(a.codename.toLowerCase()));
  const marks=ownerAgents.map(a=>`<span class="owner-mark" style="--agent:${esc(a.color)}">${esc(a.glyph)} ${esc(a.codename)}</span>`).join("");
  return `<article class="job-card job-${esc((j.status||"QUEUED").toLowerCase())}">
    <div class="job-top"><span>${esc(j.id||"JOB")}</span><b>${esc(j.status||"QUEUED")}</b></div>
    <h3>${esc(j.title||"Untitled job")}</h3>
    <p>${esc(j.objective||"")}</p>
    <div class="owners">${marks||`<span class="owner-mark">${esc(owner)}</span>`}</div>
    <div class="job-meta"><small>METRIC</small><strong>${esc(j.metric||"—")}</strong></div>
    ${j.blocker?`<div class="blocker-note"><small>BLOCKER</small><b>${esc(j.blocker)}</b></div>`:""}
    ${j.next?`<div class="next-note"><small>NEXT</small><b>${esc(j.next)}</b></div>`:""}
  </article>`;
}
function renderWork(){
  const jobs=DATA.jobs||[];
  const active=jobs.filter(j=>j.status==="ACTIVE"),queued=jobs.filter(j=>j.status==="QUEUED"),blocked=jobs.filter(j=>j.status==="BLOCKED");
  $("#activeJobs").innerHTML=active.map(jobCard).join("")||'<div class="empty">No active jobs</div>';
  $("#queuedJobs").innerHTML=queued.map(jobCard).join("")||'<div class="empty">No queued jobs</div>';
  $("#blockedJobs").innerHTML=blocked.map(jobCard).join("")||'<div class="empty">No blocked jobs</div>';
  $("#activeJobCount").textContent=active.length;$("#queuedJobCount").textContent=queued.length;$("#blockedJobCount").textContent=blocked.length;
  $("#workCount").textContent=jobs.length+" JOBS";
  const handoffs=jobs.filter(j=>j.reviewer||String(j.owner||"").includes("+")).slice(0,8);
  $("#handoffList").innerHTML=handoffs.map(j=>`<div class="handoff-item"><span>${esc(j.id)}</span><div><b>${esc(j.owner||"")}</b><i>→</i><strong>${esc(j.reviewer||"QA / EVAL")}</strong><small>${esc(j.acceptance||j.metric||"Evidence required")}</small></div></div>`).join("")||'<div class="empty">No explicit handoff recorded</div>';
  $("#scheduleList").innerHTML=(DATA.schedule||[]).map(s=>`<div class="schedule-item"><b>${esc(s.time)}</b><span>${esc(s.name)}</span><small>${esc(s.status)}</small></div>`).join("");
}
function renderTraining(){
  const latest=(DATA.training||[]).slice(-2).reverse();
  if(latest.length){
    const cards=$$(".learning-cards article");
    latest.forEach((x,i)=>{if(cards[i]){cards[i].querySelector("h3").textContent=x.lesson;cards[i].querySelector("p").textContent=x.evidence}})
  }
}
function renderSignals(){
  const items=DATA.signals;
  $("#signalGrid").innerHTML=items.length?items.map(s=>`<article class="signal-card glass"><div class="row"><span class="tag">${esc(s.signalId)}</span><span class="tag">${esc(s.status)}</span></div><h3>${esc(s.title)}</h3><p>${esc(s.outcome||"Pending outcome")}</p><div class="tags">${(s.relevance||[]).slice(0,5).map(x=>`<span>${esc(x)}</span>`).join("")}</div></article>`).join(""):'<article class="signal-card glass"><h3>No signals loaded</h3></article>';
  const unresolved=items.find(s=>!["VALIDATED","NO_ACTION"].includes(s.status))||items[0];
  if(unresolved){$("#topSignal").textContent=unresolved.title;$("#topSignalMeta").textContent=(unresolved.claimType||"")+" • "+(unresolved.route||"")+" • "+(unresolved.status||"")}
}
function renderCandidate(){
 const d=DATA.candidates?.latestDecision;
 if(!d)return;
 const label=d.newAgentNeeded?"NEW AGENT TEST JUSTIFIED":"NO NEW AGENT NEEDED";
 $("#candidateState").textContent=label;$("#candidateReason").textContent=d.reason||"";
 $("#factoryDecision").textContent=label;$("#factoryReason").textContent=(d.reason||"")+" "+(d.route||"");
}
async function boot(){
 try{
   const local=await getJSON(LOCAL_ROSTER);DATA.roster=local.agents||[];
 }catch(e){console.error("Local roster failed",e)}
 try{DATA.pixellab=await getJSON(PIXELLAB_MANIFEST)}catch{DATA.pixellab={agents:[]}}
 updatePixellabStatus();
 let synced=false;
 try{
   const [state,act,sig,cand,jobs,schedule,training]=await Promise.all([
     getJSON(REMOTE_BASE+"agents_core.json"),
     getJSON(REMOTE_BASE+"agent_activity.json"),
     getJSON(REMOTE_BASE+"scout_signals.json"),
     getJSON(REMOTE_BASE+"agent_candidates.json"),
     getJSON(REMOTE_BASE+"jobs.json"),
     getJSON(REMOTE_BASE+"schedule.json"),
     getJSON(REMOTE_BASE+"training.json")
   ]);
   DATA.state=state.agents||[];DATA.activity=act.events||[];DATA.signals=sig.items||[];DATA.candidates=cand;DATA.jobs=jobs||[];DATA.schedule=schedule||[];DATA.training=training||[];synced=true;
 }catch(e){
   DATA.state=DATA.roster.map(a=>({id:a.id,status:a.id==="AG-009"?"REVIEW":a.id==="AG-010"?"BLOCKED":"READY",currentJob:a.id==="AG-010"?"Waiting for verified Cloudflare staging access":"Awaiting approved work"}));
   DATA.activity=[{time:"LOCAL",agent:"AGIS",type:"FALLBACK",text:"Using local Core v2 roster; remote $10M state unavailable."}];
   DATA.signals=[];DATA.jobs=[];DATA.schedule=[];DATA.training=[];DATA.candidates={latestDecision:{newAgentNeeded:false,reason:"No local candidate is justified.",route:"Use Core Agents first."}};
 }
 $("#syncPill").classList.add(synced?"synced":"fallback");$("#syncPill b").textContent=synced?"SYNCED":"FALLBACK";
 $("#stateSource").textContent=synced?"SYNCED":"LOCAL";$("#activitySource").textContent=synced?"SYNCED":"LOCAL"; const ship=$("#shipStateLabel"); if(ship)ship.textContent=synced?"STATE-SYNCED":"LOCAL-FALLBACK";
 renderWorld();renderOps();renderAgents();renderActivity();renderWork();renderTraining();renderSignals();renderCandidate();
 $("#updatedLabel").textContent="Updated "+new Date().toLocaleString("th-TH");
}
boot();