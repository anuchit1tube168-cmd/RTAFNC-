const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const LOCAL_ROSTER="./core-agent-roster-v2.json";
const REMOTE_BASE="https://anuchit1tube168-cmd.github.io/agis-pirate-armada1/data/";
let DATA={roster:[],state:[],activity:[],signals:[],candidates:null};

function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function getJSON(url){const r=await fetch(url+"?v="+Date.now(),{cache:"no-store"});if(!r.ok)throw new Error(r.status);return r.json()}
function setView(id){$$(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===id));$$(".view").forEach(v=>v.classList.toggle("active",v.id===id));window.scrollTo({top:0,behavior:"smooth"})}
$$(".nav button").forEach(b=>b.onclick=()=>setView(b.dataset.view));
$$("[data-jump]").forEach(b=>b.onclick=()=>setView(b.dataset.jump));
setInterval(()=>{$("#clock").textContent=new Date().toLocaleTimeString("th-TH")},1000);

function stateFor(id){
  const r=DATA.state.find(x=>x.id===id);
  return r||{id,status:"READY",currentJob:"Awaiting approved work",learningState:"READY"};
}
function mergedAgent(a){return {...a,...stateFor(a.id),visual:{...(a.visual||{}),accent:a.color||a.visual?.accent}}}
function statusClass(s){return "state-"+String(s||"READY").toUpperCase()}
function renderOps(){
  const agents=DATA.roster.map(mergedAgent);
  $("#opsAgents").innerHTML=agents.map(a=>`<button class="ops-agent ${statusClass(a.status)}" style="--agent:${esc(a.color)}" data-agent="${a.id}">
    <div class="agent-top"><span class="agent-icon">${esc(a.glyph)}</span><span class="agent-title"><small>${esc(a.codename)}</small><b>${esc(a.name)}</b></span></div>
    <p>${esc(a.signature)}</p><div class="state-line"><i class="state-dot"></i><span>${esc(a.status)} • ${esc(a.currentJob||"")}</span></div>
  </button>`).join("");
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
 let synced=false;
 try{
   const [state,act,sig,cand]=await Promise.all([
     getJSON(REMOTE_BASE+"agents_core.json"),
     getJSON(REMOTE_BASE+"agent_activity.json"),
     getJSON(REMOTE_BASE+"scout_signals.json"),
     getJSON(REMOTE_BASE+"agent_candidates.json")
   ]);
   DATA.state=state.agents||[];DATA.activity=act.events||[];DATA.signals=sig.items||[];DATA.candidates=cand;synced=true;
 }catch(e){
   DATA.state=DATA.roster.map(a=>({id:a.id,status:a.id==="AG-009"?"REVIEW":a.id==="AG-010"?"BLOCKED":"READY",currentJob:a.id==="AG-010"?"Waiting for verified Cloudflare staging access":"Awaiting approved work"}));
   DATA.activity=[{time:"LOCAL",agent:"AGIS",type:"FALLBACK",text:"Using local Core v2 roster; remote $10M state unavailable."}];
   DATA.signals=[];DATA.candidates={latestDecision:{newAgentNeeded:false,reason:"No local candidate is justified.",route:"Use Core Agents first."}};
 }
 $("#syncPill").classList.add(synced?"synced":"fallback");$("#syncPill b").textContent=synced?"SYNCED":"FALLBACK";
 $("#stateSource").textContent=synced?"SYNCED":"LOCAL";$("#activitySource").textContent=synced?"SYNCED":"LOCAL";
 renderOps();renderAgents();renderActivity();renderSignals();renderCandidate();
 $("#updatedLabel").textContent="Updated "+new Date().toLocaleString("th-TH");
}
boot();