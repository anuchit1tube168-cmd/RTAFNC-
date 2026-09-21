#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";

const root=path.resolve("agis-agent-armada-os/apps/command-center-v3/assets/pixellab/core12");
const publicRoot="./assets/pixellab/core12";
const directions=["south","south-west","west","north-west","north","north-east","east","south-east"];

function walk(dir){
  if(!fs.existsSync(dir))return[];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
}
function unzipIf(file,dir){
  if(!fs.existsSync(file))return;
  fs.mkdirSync(dir,{recursive:true});
  try{execFileSync("unzip",["-o","-q",file,"-d",dir])}catch{}
}
function choosePreview(files){
  const png=files.filter(f=>/\.png$/i.test(f));
  return png.find(f=>/south(?![-_]?west|[-_]?east)/i.test(path.basename(f)))||png.find(f=>/front/i.test(f))||png[0]||null;
}
const agents=[];
for(const entry of fs.existsSync(root)?fs.readdirSync(root,{withFileTypes:true}):[]){
  if(!entry.isDirectory()||!/^AG-\d{3}$/.test(entry.name))continue;
  const dir=path.join(root,entry.name);
  unzipIf(path.join(dir,"spritesheet.zip"),path.join(dir,"spritesheet"));
  unzipIf(path.join(dir,"character.zip"),path.join(dir,"character"));
  const files=walk(dir).filter(f=>!f.endsWith("preview.png"));
  const preview=choosePreview(files);
  if(preview)fs.copyFileSync(preview,path.join(dir,"preview.png"));
  const resultPath=path.join(dir,"result.json");
  const result=fs.existsSync(resultPath)?JSON.parse(fs.readFileSync(resultPath,"utf8")):{agentId:entry.name};
  const frames={};
  for(const d of directions){
    const f=files.find(x=>new RegExp(d.replace("-","[-_ ]?"),"i").test(path.basename(x))&&/\.png$/i.test(x));
    if(f)frames[d]=publicRoot+"/"+entry.name+"/"+path.relative(dir,f).replaceAll("\\","/");
  }
  agents.push({
    agentId:entry.name,
    codename:result.codename||entry.name,
    characterId:result.characterId||null,
    jobId:result.jobId||null,
    status:result.status||"unknown",
    preview:fs.existsSync(path.join(dir,"preview.png"))?publicRoot+"/"+entry.name+"/preview.png":null,
    directions:frames,
    generatedAt:result.generatedAt||null
  });
}
agents.sort((a,b)=>a.agentId.localeCompare(b.agentId));
const manifest={version:"PIXELLAB-CORE12-1.0",generatedAt:new Date().toISOString(),provider:"PixelLab",fallback:"AGIS_PIXEL_STUDIO",agents};
fs.writeFileSync(path.join(root,"manifest.json"),JSON.stringify(manifest,null,2));
console.log("Indexed PixelLab Core 12 assets:",agents.length,"agents,",agents.filter(a=>a.preview).length,"previews");
