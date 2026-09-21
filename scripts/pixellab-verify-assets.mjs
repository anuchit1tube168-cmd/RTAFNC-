#!/usr/bin/env node
import fs from "node:fs";

const scope=(process.argv.find(x=>x.startsWith("--scope="))||"--scope=all").split("=")[1].toLowerCase();
const manifestPath="agis-agent-armada-os/apps/command-center-v3/assets/pixellab/core12/manifest.json";
if(!fs.existsSync(manifestPath))throw new Error("PixelLab manifest missing");
const m=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
const wanted=scope==="all"?12:1;
const selected=scope==="all"?m.agents:m.agents.filter(a=>a.agentId.toLowerCase()===scope||a.codename.toLowerCase()===scope);
if(selected.length!==wanted)throw new Error("Expected "+wanted+" generated manifest entries, got "+selected.length);
for(const a of selected){
  if(!a.characterId)throw new Error(a.agentId+" missing characterId");
  if(!a.preview)throw new Error(a.agentId+" missing preview");
  const local=a.preview.replace("./assets/pixellab/core12/","agis-agent-armada-os/apps/command-center-v3/assets/pixellab/core12/");
  if(!fs.existsSync(local))throw new Error(a.agentId+" preview file missing: "+local);
}
console.log("PixelLab asset verification PASS:",selected.map(a=>a.agentId+" "+a.codename).join(", "));
