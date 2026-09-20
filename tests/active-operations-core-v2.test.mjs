import fs from 'node:fs';

const root='agis-agent-armada-os/apps/command-center-v3/';
const required=[
  root+'active-operations.html',
  root+'active-operations-v2.css',
  root+'active-operations-v2.js',
  root+'core-agent-roster-v2.json'
];
const errors=[];
for(const file of required){
  if(!fs.existsSync(file)) errors.push('missing '+file);
}

const roster=JSON.parse(fs.readFileSync(root+'core-agent-roster-v2.json','utf8'));
const agents=roster.agents||[];
if(agents.length!==12) errors.push('expected 12 agents, got '+agents.length);

const ids=new Set();
const codenames=new Set();
for(const a of agents){
  for(const key of ['id','name','codename','glyph','color','department','mission','persona','thinking','signature','outfit','permission','reviewer']){
    if(a[key]===undefined||a[key]===null||a[key]==='') errors.push((a.id||'unknown')+' missing '+key);
  }
  if(ids.has(a.id)) errors.push('duplicate id '+a.id);
  if(codenames.has(a.codename)) errors.push('duplicate codename '+a.codename);
  ids.add(a.id); codenames.add(a.codename);
  if(!Array.isArray(a.skills)||!a.skills.length) errors.push(a.id+' missing skills');
  if(!Array.isArray(a.equipment)||!a.equipment.length) errors.push(a.id+' missing equipment');
  if(!Array.isArray(a.readContext)||!a.readContext.length) errors.push(a.id+' missing readContext');
  if(!Array.isArray(a.stop)||!a.stop.length) errors.push(a.id+' missing stop rules');
}

const html=fs.readFileSync(root+'active-operations.html','utf8');
for(const token of [
  'active-operations-v2.css','active-operations-v2.js','12 Core Agents','Work Matrix',
  'Scout','Agent Factory','Legacy v6','opsDepartments','activeJobs','handoffList'
]){
  if(!html.includes(token)) errors.push('html missing '+token);
}

const js=fs.readFileSync(root+'active-operations-v2.js','utf8');
for(const token of [
  'core-agent-roster-v2.json','agis-pirate-armada1/data/','jobs.json','schedule.json','training.json',
  'renderOps','renderAgents','renderWork','renderTraining','renderSignals','renderCandidate',
  'Read Context Before Work','Stop / Escalation Rules'
]){
  if(!js.includes(token)) errors.push('js missing '+token);
}

// Runtime selector contract: remove every multi-selector prefix first, then ensure
// known collection bindings are not implemented with the single-element helper.
const withoutMultiSelectors=js.replaceAll('$$(', '__MULTI__(');
if(withoutMultiSelectors.includes('$("[data-agent]").forEach')){
  errors.push('multi-agent selector incorrectly uses single-element helper');
}
if(withoutMultiSelectors.includes('const cards=$(".learning-cards article")')){
  errors.push('learning card collection incorrectly uses single-element helper');
}
if(!js.includes('$$("[data-agent]").forEach')){
  errors.push('agent multi-selector contract missing');
}
if(!js.includes('const cards=$$(".learning-cards article")')){
  errors.push('learning card multi-selector contract missing');
}

if(errors.length){
  console.error('AGIS ACTIVE OPERATIONS CORE V2 FAILED');
  errors.forEach(e=>console.error('-',e));
  process.exit(1);
}
console.log('AGIS ACTIVE OPERATIONS CORE V2 PASS');
console.log(JSON.stringify({agents:agents.length,codenames:[...codenames]},null,2));
