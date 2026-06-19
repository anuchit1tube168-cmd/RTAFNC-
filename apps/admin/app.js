const CONFIG = Object.freeze({
  demoMode: window.RTAFNC_ADMIN_CONFIG?.demoMode ?? true,
  supabaseUrl: window.RTAFNC_ADMIN_CONFIG?.supabaseUrl ?? "",
  supabasePublishableKey: window.RTAFNC_ADMIN_CONFIG?.supabasePublishableKey ?? "",
});

const KEYS = Object.freeze({
  deeds: "rtafnc_demo_good_deeds",
  hospitals: "rtafnc_demo_hospital_visits",
});

const state = {
  page: "overview",
  supabase: null,
  session: null,
  deeds: readLocal(KEYS.deeds, []),
  hospitals: readLocal(KEYS.hospitals, []),
};

const el = {
  content: document.querySelector("#content"),
  pageTitle: document.querySelector("#pageTitle"),
  modeBadge: document.querySelector("#modeBadge"),
  modal: document.querySelector("#modal"),
  modalTitle: document.querySelector("#modalTitle"),
  modalSubtitle: document.querySelector("#modalSubtitle"),
  modalBody: document.querySelector("#modalBody"),
  modalClose: document.querySelector("#modalClose"),
  toast: document.querySelector("#toast"),
};

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal() {
  localStorage.setItem(KEYS.deeds, JSON.stringify(state.deeds));
  localStorage.setItem(KEYS.hospitals, JSON.stringify(state.hospitals));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function toast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  setTimeout(() => el.toast.classList.remove("show"), 2200);
}

function openModal(title, subtitle, body) {
  el.modalTitle.textContent = title;
  el.modalSubtitle.textContent = subtitle;
  el.modalBody.innerHTML = body;
  el.modal.classList.add("show");
  el.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  el.modal.classList.remove("show");
  el.modal.setAttribute("aria-hidden", "true");
}

function statusBadge(status) {
  const labels = { pending: "รออนุมัติ", approved: "อนุมัติแล้ว", returned: "ส่งกลับแก้ไข", rejected: "ไม่อนุมัติ" };
  const css = status === "approved" ? "ok" : status === "rejected" ? "danger" : "warning";
  return `<span class="badge ${css}">${escapeHtml(labels[status] ?? status)}</span>`;
}

function overview() {
  const pending = state.deeds.filter((item) => item.status === "pending").length;
  const followUp = state.hospitals.filter((item) => item.status === "follow_up").length;
  const approvedHours = state.deeds.filter((item) => item.status === "approved").reduce((sum, item) => sum + Number(item.approved_hours ?? item.requested_hours ?? 0), 0);

  el.content.innerHTML = `
    <section class="stats">
      <article class="stat"><small>รายการความดี</small><strong>${state.deeds.length}</strong></article>
      <article class="stat"><small>รออนุมัติ</small><strong>${pending}</strong></article>
      <article class="stat"><small>ชั่วโมงอนุมัติ</small><strong>${approvedHours}</strong></article>
      <article class="stat"><small>ติดตามอาการ</small><strong>${followUp}</strong></article>
    </section>
    <section class="grid">
      <article class="panel">
        <div class="panel-head"><div><p>GOOD DEEDS</p><h2>คิวความดีล่าสุด</h2></div><button class="secondary" data-page="good">เปิดคิว</button></div>
        <div class="records">${state.deeds.slice(0, 4).map(deedCard).join("") || '<div class="empty">ยังไม่มีรายการ</div>'}</div>
      </article>
      <article class="panel">
        <div class="panel-head"><div><p>MEDICAL ONLY</p><h2>รายการติดตามอาการ</h2></div><button class="secondary" data-page="medical">เปิด Medical Panel</button></div>
        <div class="notice">ข้อมูลส่วนนี้แยกจากคิวตรวจความดี และควรเปิดให้เฉพาะ Medical Role</div>
        <div class="records" style="margin-top:10px">${state.hospitals.filter((item) => item.status === "follow_up").slice(0, 4).map(hospitalCard).join("") || '<div class="empty">ไม่มีรายการติดตาม</div>'}</div>
      </article>
    </section>`;
}

function deedCard(item) {
  return `<article class="record"><h3>${escapeHtml(item.category_name || item.category_code)}</h3><p>${escapeHtml(item.activity_date)} · ${escapeHtml(item.activity_title)}</p><div class="record-footer"><strong>${Number(item.approved_hours ?? item.requested_hours ?? 0)} ชั่วโมง</strong><div class="record-actions">${statusBadge(item.status)}<button class="secondary" data-action="view-deed" data-id="${item.id}">ดู</button></div></div></article>`;
}

function hospitalCard(item) {
  const label = item.status === "resolved" ? "หายแล้ว" : item.status === "follow_up" ? "ติดตามอาการ" : "บันทึกแล้ว";
  return `<article class="record"><h3>${escapeHtml(item.hospital_name)}</h3><p>${escapeHtml(item.visit_date)} · ${escapeHtml(item.symptoms)}</p><div class="record-footer"><strong>${escapeHtml(item.diagnosis || "รอวินิจฉัย")}</strong><div class="record-actions"><span class="badge ${item.status === "resolved" ? "ok" : "warning"}">${label}</span><button class="secondary" data-action="view-hospital" data-id="${item.id}">ดู</button></div></div></article>`;
}

function goodPage() {
  const pending = state.deeds.filter((item) => item.status === "pending");
  el.content.innerHTML = `<section class="panel"><div class="panel-head"><div><p>APPROVAL QUEUE</p><h2>ตรวจบันทึกความดี</h2></div><span class="badge warning">${pending.length} รายการรอ</span></div><div class="records">${state.deeds.length ? state.deeds.map(deedCard).join("") : '<div class="empty">ยังไม่มีรายการความดี</div>'}</div></section>`;
}

function medicalPage() {
  el.content.innerHTML = `<section class="panel"><div class="panel-head"><div><p>MEDICAL ROLE ONLY</p><h2>ข้อมูลไปโรงพยาบาล</h2></div></div><div class="notice">หน้า Production ต้องตรวจ Medical Role และบันทึก Audit Log ทุกครั้งที่เปิดรายละเอียด</div><div class="records" style="margin-top:12px">${state.hospitals.length ? state.hospitals.map(hospitalCard).join("") : '<div class="empty">ยังไม่มีข้อมูลโรงพยาบาล</div>'}</div></section>`;
}

function simplePage(title, body) {
  el.content.innerHTML = `<section class="panel"><div class="panel-head"><div><p>RTAFNC</p><h2>${escapeHtml(title)}</h2></div></div><div class="notice">${escapeHtml(body)}</div></section>`;
}

function viewDeed(id) {
  const item = state.deeds.find((record) => String(record.id) === String(id));
  if (!item) return;
  openModal("ตรวจบันทึกความดี", item.category_name || item.category_code, `
    <div class="records">
      <article class="record"><h3>${escapeHtml(item.activity_title)}</h3><p>${escapeHtml(item.activity_date)} · ${escapeHtml(item.activity_location || "ไม่ระบุสถานที่")}</p><p>${escapeHtml(item.details || "-")}</p><p>ผู้รับรอง: ${escapeHtml(item.verifier_name || "-")}</p><p>ชั่วโมงที่ขอ: ${Number(item.requested_hours || 0)}</p></article>
    </div>
    <form id="reviewForm" class="form" style="margin-top:12px">
      <label>ชั่วโมงที่อนุมัติ<input name="approved_hours" type="number" min="0" max="24" step="0.5" value="${Number(item.approved_hours ?? item.requested_hours ?? 0)}"></label>
      <label>หมายเหตุ<textarea name="reviewer_note" rows="3">${escapeHtml(item.reviewer_note || "")}</textarea></label>
      <div class="record-actions"><button class="primary" name="decision" value="approved">อนุมัติ</button><button class="secondary" name="decision" value="returned">ส่งกลับแก้ไข</button><button class="danger" name="decision" value="rejected">ไม่อนุมัติ</button></div>
    </form>`);

  document.querySelector("#reviewForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const submitter = event.submitter;
    const data = new FormData(event.currentTarget);
    item.status = submitter.value;
    item.approved_hours = submitter.value === "approved" ? Number(data.get("approved_hours") || 0) : null;
    item.reviewer_note = String(data.get("reviewer_note") || "").trim();
    writeLocal();
    closeModal();
    render();
    toast("บันทึกผลตรวจแล้ว");
  });
}

function viewHospital(id) {
  const item = state.hospitals.find((record) => String(record.id) === String(id));
  if (!item) return;
  openModal("ข้อมูลโรงพยาบาล", "Medical Role Demo", `
    <div class="notice">การเปิดรายการนี้ใน Production ต้องสร้าง Audit Log</div>
    <div class="records" style="margin-top:12px"><article class="record"><h3>${escapeHtml(item.hospital_name)}</h3><p>วันที่: ${escapeHtml(item.visit_date)}</p><p>อาการ: ${escapeHtml(item.symptoms)}</p><p>วินิจฉัย: ${escapeHtml(item.diagnosis || "-")}</p><p>การรักษา: ${escapeHtml(item.treatment_note || "-")}</p><p>ยา: ${escapeHtml(item.medication_note || "-")}</p><p>วันติดตาม: ${escapeHtml(item.follow_up_date || "-")}</p></article></div>
    <div class="record-actions" style="margin-top:12px"><button id="followUpButton" class="primary blue">ต้องติดตาม</button><button id="resolvedButton" class="primary">หายแล้ว</button></div>`);
  document.querySelector("#followUpButton").onclick = () => updateHospital(item, "follow_up");
  document.querySelector("#resolvedButton").onclick = () => updateHospital(item, "resolved");
}

function updateHospital(item, status) {
  item.status = status;
  writeLocal();
  closeModal();
  render();
  toast("อัปเดตสถานะสุขภาพแล้ว");
}

function render() {
  const titles = { overview: "ภาพรวมระบบ", good: "ตรวจบันทึกความดี", medical: "เจ้าหน้าที่แพทย์", news: "ข่าวสาร", students: "ทะเบียนนักเรียน", system: "สถานะระบบ" };
  el.pageTitle.textContent = titles[state.page] || "RTAFNC Staff";
  document.querySelectorAll("nav button").forEach((button) => button.classList.toggle("active", button.dataset.page === state.page));

  if (state.page === "overview") overview();
  else if (state.page === "good") goodPage();
  else if (state.page === "medical") medicalPage();
  else if (state.page === "news") simplePage("ข่าวสาร", "โมดูลสร้างข่าว กำหนดกลุ่มเป้าหมาย และติดตามการรับทราบจะเชื่อม Supabase ในขั้น Production");
  else if (state.page === "students") simplePage("ทะเบียนนักเรียน", "นำเข้ารายชื่อ ตรวจรายการซ้ำ และสร้างรหัสเปิดใช้งานรายบุคคล");
  else simplePage("สถานะระบบ", `Supabase: ${state.supabase ? "เชื่อมแล้ว" : "ยังไม่เชื่อม"} · โหมด: ${CONFIG.demoMode ? "Demo" : "Production"}`);
}

function bind() {
  document.addEventListener("click", (event) => {
    const pageTarget = event.target.closest("[data-page]");
    if (pageTarget) { state.page = pageTarget.dataset.page; render(); }
    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) return;
    if (actionTarget.dataset.action === "view-deed") viewDeed(actionTarget.dataset.id);
    if (actionTarget.dataset.action === "view-hospital") viewHospital(actionTarget.dataset.id);
  });
  el.modalClose.onclick = closeModal;
  el.modal.onclick = (event) => { if (event.target === el.modal) closeModal(); };
  document.querySelector("#resetDemo").onclick = () => { localStorage.removeItem(KEYS.deeds); localStorage.removeItem(KEYS.hospitals); state.deeds = []; state.hospitals = []; render(); toast("รีเซ็ตแล้ว"); };
  document.querySelector("#connectionButton").onclick = () => { state.page = "system"; render(); };
}

bind();
render();
