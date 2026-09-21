#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const API="https://api.pixellab.ai/v2";
const ROOT=process.cwd();
const SPEC_PATH=path.join(ROOT,"integrations/pixellab/core12-character-specs.json");
const OUT=path.join(ROOT,"agis-agent-armada-os/apps/command-center-v3/assets/pixellab/core12");
const token=process.env.PIXELLAB_API_KEY;
const command=process.argv[2]||"plan";
const scope=(process.argv.find(x=>x.startsWith("--scope="))||"--scope=all").split("=")[1];
const specs=JSON.parse(fs.readFileSync(SPEC_PATH,"utf8"));

function die(msg){console.error(msg);process.exit(1)}
function safeJson(v){return JSON.stringify(v,null,2).replaceAll(token||"__NO_TOKEN__","[REDACTED]")}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function ensure(){fs.mkdirSync(OUT,{recursive:true})}
async function api(endpoint,{method="GET",body,accept}={}){
  if(!token) die("PIXELLAB_API_KEY is required.");
  const r=await fetch(API+endpoint,{
    method,
    headers:{
      "Authorization":"Bearer "+token,
      ...(body?{"Content-Type":"application/json"}:{}),
      ...(accept?{"Accept":accept}:{})
    },
    body:body?JSON.stringify(body):undefined
  });
  if(!r.ok){
    const txt=(await r.text()).slice(0,1200);
    throw new Error(method+" "+endpoint+" → HTTP "+r.status+" "+txt.replaceAll(token,"[REDACTED]"));
  }
  return r;
}
async function json(endpoint,opt){return (await api(endpoint,opt)).json()}
function findKey(obj,key){
  if(!obj||typeof obj!=="object")return null;
  if(Object.prototype.hasOwnProperty.call(obj,key)&&obj[key])return obj[key];
  for(const v of Object.values(obj)){const hit=findKey(v,key);if(hit)return hit}
  return null;
}
async function poll(jobId){
  const started=Date.now();
  for(;;){
    if(Date.now()-started>12*60*1000)throw new Error("Timed out waiting for PixelLab job "+jobId);
    const j=await json("/background-jobs/"+encodeURIComponent(jobId));
    if(j.status==="completed")return j;
    if(j.status==="failed")throw new Error("PixelLab job failed: "+safeJson(j.last_response||j));
    await sleep(3000);
  }
}
async function download(endpoint,file){
  const r=await api(endpoint,{accept:"application/zip,application/octet-stream,application/json,image/png"});
  const ct=r.headers.get("content-type")||"";
  if(ct.includes("application/json")){
    const data=await r.json();
    const url=findKey(data,"download_url")||findKey(data,"url");
    if(url&&/^https:\/\//.test(url)){
      const rr=await fetch(url); if(!rr.ok)throw new Error("download URL failed "+rr.status);
      fs.writeFileSync(file,Buffer.from(await rr.arrayBuffer())); return;
    }
    fs.writeFileSync(file.replace(/\.(zip|png)$/,".json"),safeJson(data)); return;
  }
  fs.writeFileSync(file,Buffer.from(await r.arrayBuffer()));
}
function selected(){
  if(scope==="all")return specs.agents;
  const q=scope.toLowerCase();
  return specs.agents.filter(a=>a.id.toLowerCase()===q||a.codename.toLowerCase()===q);
}
async function balance(){
  try{return await json("/balance")}catch(e){return {status:"unavailable",detail:String(e.message).slice(0,220)}}
}
async function generateOne(agent){
  const dir=path.join(OUT,agent.id);fs.mkdirSync(dir,{recursive:true});
  const description=[
    specs.style,
    agent.description,
    "same visual universe as the other AGIS Core agents; distinctive accent color and role tool; readable at 64x64"
  ].join(". ");
  const request={
    name:"AGIS-"+agent.codename,
    description,
    image_size:specs.imageSize,
    view:specs.view,
    no_background:true,
    seed:agent.seed
  };
  fs.writeFileSync(path.join(dir,"request.json"),JSON.stringify({...request,agentId:agent.id},null,2));
  console.log("Creating",agent.id,agent.codename);
  const first=await json("/create-character-v3",{method:"POST",body:request});
  const jobId=findKey(first,"background_job_id");
  const final=jobId?await poll(jobId):first;
  const characterId=findKey(final,"character_id")||findKey(first,"character_id");
  const result={agentId:agent.id,codename:agent.codename,jobId:jobId||null,characterId:characterId||null,status:final.status||first.status||"completed",generatedAt:new Date().toISOString()};
  fs.writeFileSync(path.join(dir,"result.json"),JSON.stringify(result,null,2));
  fs.writeFileSync(path.join(dir,"response.redacted.json"),safeJson(final));
  if(!characterId)throw new Error(agent.id+" completed but no character_id was found.");
  await download("/characters/"+encodeURIComponent(characterId)+"/spritesheet",path.join(dir,"spritesheet.zip"));
  await download("/characters/"+encodeURIComponent(characterId)+"/zip",path.join(dir,"character.zip"));
  try{
    const detail=await json("/characters/"+encodeURIComponent(characterId));
    fs.writeFileSync(path.join(dir,"character.json"),safeJson(detail));
  }catch(e){console.warn("character detail unavailable for",agent.id,String(e.message).slice(0,180))}
  return result;
}
async function main(){
  ensure();
  const list=selected();
  if(!list.length)die("No Core Agent matched --scope="+scope);
  if(command==="plan"){
    console.log(JSON.stringify({endpoint:API+"/create-character-v3",scope,list:list.map(x=>({id:x.id,codename:x.codename,seed:x.seed})),secret:"PIXELLAB_API_KEY (environment only)"},null,2));
    return;
  }
  if(command==="balance"){console.log(safeJson(await balance()));return}
  if(command!=="generate")die("Usage: node scripts/pixellab-core12.mjs plan|balance|generate --scope=all|ATLAS|AG-001");
  console.log("PixelLab balance preflight:",safeJson(await balance()));
  const results=[];
  for(const agent of list){
    try{results.push(await generateOne(agent))}
    catch(e){console.error("FAILED",agent.id,agent.codename,String(e.message).replaceAll(token,"[REDACTED]"));process.exitCode=1;break}
  }
  fs.writeFileSync(path.join(OUT,"generation-results.json"),JSON.stringify(results,null,2));
}
main().catch(e=>die(String(e.stack||e).replaceAll(token||"__NO_TOKEN__","[REDACTED]")));
