const $ = (id) => document.getElementById(id);

const fields = [
  'year','term','school','agency','classLevel','firstName','lastName','citizenId',
  'familyStatus','livingWith','guardianName','guardianRelation','guardianEdu','guardianJob','guardianPhone','guardianId'
];

const familyStatusOptions = ['พ่อแม่อยู่ด้วยกัน','พ่อแม่แยกกันอยู่','พ่อแม่หย่าร้าง','พ่อเสียชีวิต/สาบสูญ','แม่เสียชีวิต/สาบสูญ','เสียชีวิตทั้งคู่/สาบสูญ','พ่อ/แม่ทอดทิ้ง'];
const livingOptions = ['พ่อ/แม่','ญาติ','อยู่ลำพัง','ผู้ปกครอง/นายจ้าง','ครัวเรือนสถาบัน'];

let members = [
  {name:'นพอ.ตัวอย่าง ระบบทดสอบ', relation:'ตนเอง', id:'1234567890123', edu:'ป.1-ป.6', age:20, disabled:true, chronic:true, stimulus:true, wage:100, farm:110, business:100, welfare:100, stateStimulus:100, other:100},
  {name:'นายทดสอบ ระบบ', relation:'บิดา', id:'3100000000010', edu:'ม.1-ม.3', age:46, disabled:false, chronic:true, stimulus:false, wage:1000, farm:1000, business:1000, welfare:1000, stateStimulus:10000, other:100},
  {name:'นางทดสอบ ระบบ', relation:'มารดา', id:'3100000000004', edu:'ป.1-ป.6', age:44, disabled:true, chronic:false, stimulus:true, wage:100, farm:100, business:100, welfare:100, stateStimulus:100, other:100},
  {name:'เด็กชายตัวอย่าง น้องหนึ่ง', relation:'พี่/น้อง', id:'4444444444444', edu:'ป.1-ป.6', age:12, disabled:false, chronic:true, stimulus:false, wage:0, farm:0, business:0, welfare:0, stateStimulus:0, other:0},
  {name:'เด็กหญิงตัวอย่าง น้องสอง', relation:'พี่/น้อง', id:'5555555555555', edu:'ป.1-ป.6', age:10, disabled:false, chronic:false, stimulus:false, wage:0, farm:0, business:0, welfare:0, stateStimulus:0, other:0}
];

function money(n){ return (Number(n)||0).toLocaleString('th-TH'); }
function total(m){ return ['wage','farm','business','welfare','stateStimulus','other'].reduce((s,k)=>s+(Number(m[k])||0),0); }
function blueCheck(v){ return v ? '<span class="mark">✓</span>' : ''; }

function bindText(){
  fields.forEach((id)=>{
    const el = $(id);
    document.querySelectorAll(`[data-bind="${id}"]`).forEach(node => node.textContent = el ? el.value : '');
  });
}

function renderIdBoxes(){
  const id = ($('citizenId').value || '').replace(/\D/g,'').slice(0,13);
  $('idBoxes').innerHTML = Array.from({length:13}, (_,i)=>`<span class="id-cell">${id[i]||''}</span>`).join('');
}

function renderChoices(){
  const family = $('familyStatus').value;
  const living = $('livingWith').value;
  $('familyStatusChoices').innerHTML = '<span>สถานภาพครอบครัว</span>' + familyStatusOptions.map(x=>`<span class="choice"><span class="radio ${x===family?'checked':''}"></span>${x}</span>`).join('');
  $('livingChoices').innerHTML = '<span>นักเรียนอาศัยอยู่กับ</span>' + livingOptions.map(x=>`<span class="choice"><span class="radio ${x===living?'checked':''}"></span>${x}</span>`).join('');
}

function renderOfficialRows(){
  $('officialRows').innerHTML = members.map((m,i)=>`
    <tr>
      <td>${i+1}</td>
      <td class="text-left blue">${m.name||''}</td>
      <td class="blue">${m.relation||''}</td>
      <td class="blue">${m.id||''}</td>
      <td class="blue">${m.edu||''}</td>
      <td class="blue">${m.age||''}</td>
      <td>${blueCheck(m.disabled)}</td>
      <td>${blueCheck(m.chronic)}</td>
      <td>${blueCheck(m.stimulus)}</td>
      <td class="blue">${money(m.wage)}</td>
      <td class="blue">${money(m.farm)}</td>
      <td class="blue">${money(m.business)}</td>
      <td class="blue">${money(m.welfare)}</td>
      <td class="blue">${money(m.stateStimulus)}</td>
      <td class="blue">${money(m.other)}</td>
      <td class="blue">${money(total(m))}</td>
    </tr>
  `).join('');
  $('memberCountText').textContent = members.length;
  $('memberCountBox').textContent = `${members.length} คน`;
  const avg = members.length ? Math.round(members.reduce((s,m)=>s+total(m),0)/members.length) : 0;
  $('householdAverage').textContent = `${money(avg)} บาท/เดือน`;
}

function memberInput(index, key, label, type='text'){
  const value = members[index][key] ?? '';
  return `<label>${label}<input data-member="${index}" data-key="${key}" type="${type}" value="${value}"></label>`;
}

function memberCheck(index, key, label){
  return `<label>${label}<input data-member="${index}" data-key="${key}" type="checkbox" ${members[index][key]?'checked':''}></label>`;
}

function renderMemberEditor(){
  $('memberEditor').innerHTML = members.map((m,i)=>`
    <article class="member-card">
      <div class="member-card-head"><span class="member-card-title">สมาชิกคนที่ ${i+1}</span><button class="delete-member" data-delete="${i}">ลบ</button></div>
      <div class="member-grid">
        ${memberInput(i,'name','ชื่อ-นามสกุล','text')}
        ${memberInput(i,'relation','ความสัมพันธ์','text')}
        ${memberInput(i,'id','เลขประจำตัว','text')}
        ${memberInput(i,'edu','การศึกษาสูงสุด','text')}
        ${memberInput(i,'age','อายุ','number')}
        ${memberInput(i,'wage','ค่าจ้าง/เงินเดือน','number')}
        ${memberInput(i,'farm','เกษตรกรรม','number')}
        ${memberInput(i,'business','ธุรกิจส่วนตัว','number')}
        ${memberInput(i,'welfare','สวัสดิการรัฐ','number')}
        ${memberInput(i,'stateStimulus','โครงการ 10,000','number')}
        ${memberInput(i,'other','รายได้อื่น','number')}
        <div class="wide grid2">${memberCheck(i,'disabled','พิการ')}${memberCheck(i,'chronic','โรคเรื้อรัง')}${memberCheck(i,'stimulus','ได้รับกระตุ้นเศรษฐกิจ')}</div>
      </div>
    </article>
  `).join('');
  document.querySelectorAll('[data-member]').forEach(el => {
    el.addEventListener('input', onMemberChange);
    el.addEventListener('change', onMemberChange);
  });
  document.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => {
    members.splice(Number(btn.dataset.delete),1);
    renderAll();
  }));
}

function onMemberChange(e){
  const i = Number(e.target.dataset.member);
  const key = e.target.dataset.key;
  if(e.target.type === 'checkbox') members[i][key] = e.target.checked;
  else if(e.target.type === 'number') members[i][key] = Number(e.target.value)||0;
  else members[i][key] = e.target.value;
  renderOfficialRows();
}

function renderAll(){
  bindText();
  renderIdBoxes();
  renderChoices();
  renderMemberEditor();
  renderOfficialRows();
}

fields.forEach(id => $(id)?.addEventListener('input', renderAll));
fields.forEach(id => $(id)?.addEventListener('change', renderAll));

$('addMember').addEventListener('click', () => {
  members.push({name:'', relation:'', id:'', edu:'', age:'', disabled:false, chronic:false, stimulus:false, wage:0, farm:0, business:0, welfare:0, stateStimulus:0, other:0});
  renderAll();
});

$('portraitInput').addEventListener('change', (e)=>{
  const file = e.target.files?.[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    $('portraitPreview').src = reader.result;
    $('portraitPreview').parentElement.classList.add('has-image');
  };
  reader.readAsDataURL(file);
});

$('homePhotos').addEventListener('change', (e)=>{
  const files = Array.from(e.target.files||[]);
  const gallery = $('homeGallery');
  gallery.innerHTML = '';
  if(!files.length){ gallery.innerHTML = '<span>ยังไม่มีรูปบ้าน</span>'; return; }
  files.forEach(file => {
    const img = document.createElement('img');
    const reader = new FileReader();
    reader.onload = () => img.src = reader.result;
    reader.readAsDataURL(file);
    gallery.appendChild(img);
  });
});

$('draftBtn').addEventListener('click', () => $('statusText').textContent = 'สถานะ: ร่าง');
$('submitBtn').addEventListener('click', () => $('statusText').textContent = 'สถานะ: รออาจารย์ที่ปรึกษาอนุมัติ');
$('printBtn').addEventListener('click', () => window.print());

renderAll();
