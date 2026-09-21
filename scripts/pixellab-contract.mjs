#!/usr/bin/env node
import fs from "node:fs";
const errors=[];
const spec=JSON.parse(fs.readFileSync("integrations/pixellab/core12-character-specs.json","utf8"));
if(spec.agents?.length!==12)errors.push("expected 12 PixelLab Core Agent specs");
const ids=new Set(),names=new Set(),seeds=new Set();
for(const a of spec.agents||[]){
  if(ids.has(a.id))errors.push("duplicate id "+a.id); ids.add(a.id);
  if(names.has(a.codename))errors.push("duplicate codename "+a.codename); names.add(a.codename);
  if(seeds.has(a.seed))errors.push("duplicate seed "+a.seed); seeds.add(a.seed);
  const prompt=[spec.style,a.description,"same visual universe as the other AGIS Core agents; distinctive accent color and role tool; readable at 64x64"].join(". ");
  if(prompt.length>2000)errors.push(a.id+" prompt exceeds documented character description limit");
}
for(const file of ["scripts/pixellab-core12.mjs","scripts/pixellab-index-assets.mjs","scripts/pixellab-verify-assets.mjs"]){
  if(!fs.existsSync(file))errors.push("missing "+file);
}
const generator=fs.readFileSync("scripts/pixellab-core12.mjs","utf8");
for(const token of ["PIXELLAB_API_KEY","/create-character-v3","/background-jobs/","/spritesheet","/characters/"]){
  if(!generator.includes(token))errors.push("generator missing "+token);
}
if(/Bearer\s+[A-Za-z0-9-]{20,}/.test(generator))errors.push("possible literal bearer token in generator");
const app=fs.readFileSync("agis-agent-armada-os/apps/command-center-v3/active-operations-v2.js","utf8");
for(const token of ["PIXELLAB_MANIFEST","pixellabAssetFor","pixellab-avatar","AGIS_PIXEL_STUDIO"]){
  if(!app.includes(token))errors.push("Active Operations missing PixelLab/fallback contract "+token);
}
if(errors.length){console.error("PIXELLAB CORE12 CONTRACT FAILED");errors.forEach(e=>console.error("-",e));process.exit(1)}
console.log("PIXELLAB CORE12 CONTRACT PASS");
