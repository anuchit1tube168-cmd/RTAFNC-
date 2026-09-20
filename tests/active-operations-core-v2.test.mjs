import fs from 'node:fs';

const root='agis-agent-armada-os/apps/command-center-v3/';
const required=[
  root+'active-operations.html',
  root+'active-operations-v2.css',
  root+'active-operations-v2.js',
  root+'core-agent-roster-v2.json'
];
const errors=[];
for(const f of required) if(!fs.existsSync(f)) errors.push('missing '+f);

const roster=JSON.parse(fs.readFileSync(root+'core-agent-roster-v2.json','utf8'));
const agents=roster.agents||[];
if(agents.length!==12) errors.push('expected 12 agents, got '+agents.length);
const ids=new Set(),codenames=new Set();
for(const a of agents){
  for(const k of ['id','name','codename','glyph','color','department','mission','persona','thinking','signature','outfit','permission','reviewer']){
    if(a[k]===undefined||a[k]===null||a[k]==='') errors.push(a.id+' missing '+k);
  }
  if(ids.has(a.id)) errors.push('duplicate id '+a.id); ids.add(a.id);
  if(codenames.has(a.codename)) errors.push('duplicate codename '+a.codename); codenames.add(a.codename);
  if(!Array.isArray(a.skills)||!a.skills.length) errors.push(a.id+' missing skills');
  if(!Array.isArray(a.equipment)||!a.equipment.length) errors.push(a.id+' missing equipment');
}
const html=fs.readFileSync(root+'active-operations.html','utf8');
for(const token of ['active-operations-v2.css','active-operations-v2.js','12 Core Agents','Work Matrix','Scout','Agent Factory','Legacy v6','opsDepartments','activeJobs','handoffList']){
  if(!html.includes(token)) errors.push('html missing '+token);
}
const js=fs.readFileSync(root+'active-operations-v2.js','utf8');
for(const token of ['core-agent-roster-v2.json','agis-pirate-armada1/data/','jobs.json','schedule.json','training.json','renderOps','renderAgents','renderWork','renderTraining','renderSignals','renderCandidate']){
  if(!js.includes(token)) errors.push('js missing '+token);
}
/* runtime-selector-contract */
if(js.includes('$("[data-agent]").forEach')) errors.push('multi-agent selector incorrectly uses single-element helper');
if(js.includes('const cards=$(".learning-cards article")')) errors.push('learning card collection incorrectly uses single-element helper');
if(!js.includes('$("[data-agent]").forEach')) errors.push('agent multi-selector contract missing');
if(!js.includes('const cards=$(".learning-cards article")')) errors.push('learning card multi-selector contract missing');
for(const token of ['Read Context Before Work','Stop / Escalation Rules']){
  if(!js.includes(token)) errors.push('agent profile missing '+token);
}

if(errors.length){
  console.error('AGIS ACTIVE OPERATIONS CORE V2 FAILED');
  errors.forEach(e=>console.error('-',e));
  process.exit(1);
}
console.log('AGIS ACTIVE OPERATIONS CORE V2 PASS');
console.log(JSON.stringify({agents:agents.length,codenames:[...codenames]},null,2));
