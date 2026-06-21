const state = {
  status: 'ร่าง',
  housePhotos: [],
  log: []
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function toast(message) {
  const box = $('#toast');
  box.textContent = message;
  box.classList.add('show');
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => box.classList.remove('show'), 2200);
}

function switchPage(page) {
  $$('.page').forEach((el) => el.classList.toggle('active', el.dataset.view === page));
  $$('.bottom-nav button').forEach((btn) => btn.classList.toggle('active', btn.dataset.page === page));
  if (page === 'pdf') syncPdf();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setStatus(status) {
  state.status = status;
  $('#memberStatus').textContent = status;
  $('#metricStatus').textContent = status.length > 8 ? status.slice(0, 8) : status;
  $('#approvalSummary').textContent = `สถานะปัจจุบัน: ${status}`;
}

function addLog(text) {
  const now = new Date().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
  state.log.unshift(`${now} — ${text}`);
  $('#activityLog').innerHTML = '<strong>ประวัติ</strong>' + state.log.map((item) => `<p>${item}</p>`).join('');
}

function calculateIncome() {
  const income = Number($('#familyIncome').value.replace(/,/g, '')) || 0;
  const members = Number($('#familyMembers').value) || 1;
  const perHead = Math.round(income / members);
  $('#incomePerHead').value = perHead.toLocaleString('th-TH');
  $('#metricIncome').textContent = perHead.toLocaleString('th-TH');
}

function syncMemberName() {
  const form = new FormData($('#scholarshipForm'));
  $('#memberName').textContent = form.get('studentName') || 'นพอ.ไม่ระบุชื่อ';
  $('#memberMeta').textContent = `${form.get('studentId') || '-'} · ${form.get('classYear') || '-'} · เปิดผ่าน LINE Official Account`;
}

function syncPdf() {
  const form = new FormData($('#scholarshipForm'));
  const moneyFields = ['familyIncome', 'incomePerHead'];
  document.querySelectorAll('[data-pdf]').forEach((cell) => {
    const key = cell.dataset.pdf;
    let value = form.get(key) || $(`#${key}`)?.value || '-';
    if (moneyFields.includes(key) && value !== '-') value = `${value.toString().replace(/บาท\/เดือน/g, '')} บาท/เดือน`;
    cell.textContent = value;
  });
  $('#pdfAdvisorComment').textContent = $('#advisorComment').value || '-';
}

function previewStudentPhoto(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    $('#studentPhotoPreview').src = reader.result;
    $('#studentPhotoPreview').hidden = false;
    $('#avatarText').hidden = true;
  };
  reader.readAsDataURL(file);
}

function previewHousePhotos(files) {
  state.housePhotos = Array.from(files || []);
  const grid = $('#housePhotoGrid');
  grid.innerHTML = '';
  if (!state.housePhotos.length) {
    grid.classList.add('empty');
    grid.innerHTML = '<span>ยังไม่มีรูปบ้าน</span>';
  } else {
    grid.classList.remove('empty');
    state.housePhotos.forEach((file) => {
      const img = document.createElement('img');
      img.alt = file.name;
      const reader = new FileReader();
      reader.onload = () => { img.src = reader.result; };
      reader.readAsDataURL(file);
      grid.appendChild(img);
    });
  }
  $('#metricPhotos').textContent = state.housePhotos.length.toString();
  $('#evidenceCount').textContent = `${state.housePhotos.length} รูป`;
}

function initLineDemo() {
  const status = $('#lineStatus');
  const hasLiff = typeof liff !== 'undefined';
  status.textContent = hasLiff ? 'LIFF READY' : 'LINE DEMO';
  status.addEventListener('click', () => {
    toast(hasLiff ? 'มี LIFF SDK แล้ว เหลือใส่ LIFF ID จริงในขั้นเชื่อม LINE OA' : 'โหมดตัวอย่าง ใช้ดูหน้าตาเว็บก่อน');
  });
}

$$('.bottom-nav button').forEach((btn) => btn.addEventListener('click', () => switchPage(btn.dataset.page)));
$$('[data-jump]').forEach((btn) => btn.addEventListener('click', () => switchPage(btn.dataset.jump)));
$('#studentPhoto').addEventListener('change', (event) => previewStudentPhoto(event.target.files[0]));
$('#housePhotos').addEventListener('change', (event) => previewHousePhotos(event.target.files));
$('#familyIncome').addEventListener('input', calculateIncome);
$('#familyMembers').addEventListener('input', calculateIncome);
$('#scholarshipForm').addEventListener('input', () => { syncMemberName(); calculateIncome(); });

$('#saveDraft').addEventListener('click', () => {
  setStatus('ร่าง');
  addLog('นักเรียนบันทึกร่างคำขอทุน');
  toast('บันทึกร่างแล้ว');
});

$('#submitAdvisor').addEventListener('click', () => {
  syncMemberName();
  calculateIncome();
  setStatus('รอ อ.ที่ปรึกษา');
  addLog('นักเรียนส่งคำขอให้อาจารย์ที่ปรึกษาตรวจผ่าน LINE OA');
  toast('ส่งให้อาจารย์ที่ปรึกษาแล้ว');
  switchPage('approve');
});

$('#returnEdit').addEventListener('click', () => {
  setStatus('ส่งกลับแก้ไข');
  addLog('อาจารย์ที่ปรึกษาส่งกลับให้นักเรียนแก้ไข');
  toast('ส่งกลับแก้ไขแล้ว');
});

$('#advisorApprove').addEventListener('click', () => {
  setStatus('ผ่าน อ.ที่ปรึกษา');
  $('#metricScore').textContent = 'รอคณะฯ';
  addLog('อาจารย์ที่ปรึกษาอนุมัติและเสนอคณะกรรมการ');
  toast('อนุมัติขั้นอาจารย์ที่ปรึกษาแล้ว');
});

$('#printPdf').addEventListener('click', () => {
  syncPdf();
  window.print();
});

calculateIncome();
syncMemberName();
initLineDemo();
addLog('เปิดระบบตัวอย่างสำหรับโปรเจกต์ขอทุน นพอ.');
