#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const API="https://api.pixellab.ai/v2";
const token=process.env.PIXELLAB_API_KEY;
const spec=JSON.parse(fs.readFileSync("integrations/pixellab/command-ship-spec.json","utf8"));
const out="agis-agent-armada-os/apps/command-center-v3/assets/pixellab/ship";
fs.mkdirSync(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function die(m){console.error(String(m).replaceAll(token||"__NO_TOKEN__","[REDACTED]"));process.exit(1)}
async function request(endpoint,{method="GET",body}={}){
 if(!token)die("PIXELLAB_API_KEY is required.");
 const r=await fetch(API+endpoint,{method,headers:{Authorization:"Bearer "+token,...(body?{"Content-Type":"application/json"}:{})},body:body?JSON.stringify(body):undefined});
 if(!r.ok)throw new Error(endpoint+" HTTP "+r.status+" "+(await r.text()).slice(0,900));
 return r.json();
}
function find(obj,key){
 if(!obj||typeof obj!=="object")return null;
 if(Object.prototype.hasOwnProperty.call(obj,key)&&obj[key])return obj[key];
 for(const v of Object.values(obj)){const hit=find(v,key);if(hit)return hit}
 return null;
}
async function poll(id){
 const start=Date.now();
 for(;;){
   if(Date.now()-start>12*60*1000)throw new Error("ship art job timeout");
   const j=await request("/background-jobs/"+encodeURIComponent(id));
   if(j.status==="completed")return j;
   if(j.status==="failed")throw new Error("ship art job failed");
   await sleep(3000);
 }
}
function decodeImage(data){
 const b64=find(data,"base64");
 if(!b64)return null;
 const raw=String(b64).replace(/^data:image\/\w+;base64,/,"");
 return Buffer.from(raw,"base64");
}
async function main(){
 const body={description:spec.description,image_size:spec.image_size,seed:spec.seed};
 console.log("Generating PixelLab AGIS-12 command ship art",spec.image_size);
 const first=await request(spec.endpoint,{method:"POST",body});
 const jobId=find(first,"background_job_id");
 const final=jobId?await poll(jobId):first;
 const img=decodeImage(final)||decodeImage(first);
 if(!img)throw new Error("PixelLab completed but no base64 image was found.");
 fs.writeFileSync(path.join(out,"command-ship.png"),img);
 const manifest={version:spec.version,provider:"PixelLab",generatedAt:new Date().toISOString(),jobId:jobId||null,background:"./assets/pixellab/ship/command-ship.png",endpoint:spec.endpoint};
 fs.writeFileSync(path.join(out,"manifest.json"),JSON.stringify(manifest,null,2));
 console.log("PixelLab command ship art ready.");
}
main().catch(e=>die(e.stack||e));
