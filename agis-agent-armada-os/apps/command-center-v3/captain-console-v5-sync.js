(()=>{'use strict';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const crew=window.AGIDeckData?.crew||[];
const crewIndex=name=>Math.max(0,crew.findIndex(c=>c.name===name));
const currentJob=()=>($('#headerJob')?.textContent||'').trim().replace(/^—$/,'');
const currentMission=()=>($('#missionIdView')?.textContent||'').trim().replace(/^—$/,'');
const currentEvidence=()=>($('#missionEvidence')?.value||$('#evidenceUrl')?.value||'').trim();
const currentReceipt=()=>{const text=($('#receiptPreview')?.textContent||'').trim();const m=text.match(/Receipt ID:\s*(\S+)/i);return m?m[1]:''};
const notify=message=>{const el=$('#toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>el.classList.remove('show'),3600)};

function missionPayload(){
  return {
    app:'AGIS Grand Line Command Deck v5',
    exportedAt:new Date().toISOString(),
    jobId:currentJob(),
    missionId:currentMission(),
    receiptId:currentReceipt(),
    command:($('#command')?.value||'').trim(),
    goal:($('#goal')?.value||'').trim(),
    priority:$('#priority')?.value||'',
    risk:$('#risk')?.value||'',
    evidence:currentEvidence(),
    pageUrl:location.href
  };
}

function standaloneHtml(data){
  return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(data.goal||'AGIS Output')}</title><style>body{font-family:system-ui;background:#071521;color:#eef5fb;padding:30px}main{max-width:900px;margin:auto;background:#0c2233;border:1px solid #b8893b;padding:24px;border-radius:14px}h1{color:#e8b44f}a{color:#35cfd0}pre{background:#03101b;padding:12px;border-radius:8px;overflow:auto;white-space:pre-wrap}.ok{color:#43d97b}</style></head><body><main><h1>AGIS Mission Output</h1><p class="ok">QA + Receipt = Done</p><h2>${esc(data.goal)}</h2><p><b>Job:</b> ${esc(data.jobId)}</p><p><b>Mission:</b> ${esc(data.missionId)}</p><p><b>Receipt:</b> ${esc(data.receiptId||'Pending')}</p><p><b>Command:</b> ${esc(data.command)}</p><p><b>Evidence:</b> ${data.evidence?`<a href="${esc(data.evidence)}">${esc(data.evidence)}</a>`:'Not attached'}</p><pre>${esc(JSON.stringify(data,null,2))}</pre></main></body></html>`;
}

async function savePackageToDrive(){
  const data=missionPayload();
  if(!data.jobId){notify('กรุณาส่งคำสั่งให้ Captain ก่อนบันทึก Drive');return}
  const files=[
    {fileName:'index.html',mimeType:'text/html',content:standaloneHtml(data)},
    {fileName:'mission.json',mimeType:'application/json',content:JSON.stringify(data,null,2)},
    {fileName:'README.txt',mimeType:'text/plain',content:`AGIS Grand Line Command Deck v5\nJob: ${data.jobId}\nMission: ${data.missionId}\nOpen index.html to view this output.`}
  ];
  if(data.receiptId)files.push({fileName:'receipt.json',mimeType:'application/json',content:JSON.stringify({receiptId:data.receiptId,jobId:data.jobId,missionId:data.missionId,evidence:data.evidence,createdAt:new Date().toISOString()},null,2)});
  const btn=$('#saveDrive');if(btn){btn.disabled=true;btn.innerHTML='<span>⏳</span>Saving...'}
  try{
    const result=await AGISSProcessor.call('output.save',{jobId:data.jobId,missionId:data.missionId,receiptId:data.receiptId,evidence:data.evidence,status:data.receiptId?'final':'draft',final:Boolean(data.receiptId),files});
    if(!result.ok)throw new Error(result.error||'output.save failed');
    notify(`บันทึก ${result.files?.length||files.length} ไฟล์เข้า Google Drive แล้ว`);
    if(result.folderUrl)window.open(result.folderUrl,'_blank');
  }catch(error){
    notify('Processor ยังไม่เป็น v2 — ต้องอัปเดต Code.gs และ Deploy New Version');
    console.error(error);
  }finally{
    if(btn){btn.disabled=false;btn.innerHTML='<span>△</span>Save to Google Drive'}
  }
}

async function appendSharedChat(author,target,message,type='crew'){
  if(!message)return;
  try{
    await AGISSProcessor.call('chat.append',{jobId:currentJob(),missionId:currentMission(),author,target,message,type});
  }catch(error){console.debug('Shared chat fallback to local',error)}
}

function renderRemoteChat(messages){
  const box=$('#chatLog');if(!box||!messages?.length)return;
  box.innerHTML=messages.slice(-50).map(m=>`<div class="chat-item ${esc(m.type||'crew')}"><span class="avatar" style="--i:${m.author==='System'?0:crewIndex(m.author)}"></span><div><b>${esc(m.author||'System')}</b><p>${esc(m.message||'')}</p><small style="color:#6f8799">ถึง ${esc(m.target||'ALL')}</small></div><time>${esc(new Date(m.createdAt||Date.now()).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'}))}</time></div>`).join('');
  box.scrollTop=box.scrollHeight;
}

async function syncChat(){
  try{
    const result=await AGISSProcessor.call('chat.list',{jobId:currentJob(),limit:100});
    if(result.ok&&result.chat?.length)renderRemoteChat(result.chat);
  }catch(error){console.debug('chat.list unavailable',error)}
}

function bind(){
  const drive=$('#saveDrive');if(drive)drive.onclick=savePackageToDrive;
  const form=$('#chatForm');
  if(form)form.addEventListener('submit',event=>{
    const input=$('#chatInput');const message=(input?.value||'').trim();
    if(message)appendSharedChat('Boss',$('#chatTarget')?.value||'ALL',message,'boss');
  },true);
  setInterval(syncChat,15000);
  setTimeout(syncChat,2500);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
