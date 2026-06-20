const CONFIG = Object.freeze({
  demoMode: window.RTAFNC_ADMIN_CONFIG?.demoMode ?? true,
  supabaseUrl: window.RTAFNC_ADMIN_CONFIG?.supabaseUrl ?? "",
  supabasePublishableKey: window.RTAFNC_ADMIN_CONFIG?.supabasePublishableKey ?? "",
});

const KEYS = Object.freeze({
  deeds: "rtafnc_demo_good_deeds",
  hospitals: "rtafnc_demo_hospital_visits",
  news: "rtafnc_demo_announcements",
  students: "rtafnc_demo_students",
  activations: "rtafnc_demo_activation_codes",
  audit: "rtafnc_demo_audit_logs",
  notifications: "rtafnc_demo_notification_events",
  role: "rtafnc_demo_admin_role",
  initialized: "rtafnc_admin_initialized_v2",
});

const ROLE_LABELS = Object.freeze({
  reviewer: "ผู้ตรวจความดี",
  medical: "เจ้าหน้าที่แพทย์",
  registrar: "นายทะเบียน",
  admin: "ผู้ดูแลระบบ",
});

const state = {
  page: "overview",
  role: localStorage.getItem(KEYS.role) || "reviewer",
  supabase: null,
  session: null,
  deeds: [],
  hospitals: [],
  news: [],
  students: [],
  activations: [],
  audit: [],
  notifications: [],
  filters: {
    goodStatus: "all",
    goodSearch: "",
    medicalStatus: "all",
    medicalSearch: "",
    studentSearch: "",
  },
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
  roleSelect: document.querySelector("#roleSelect"),
  connectionButton: document.querySelector("#connectionButton"),
  resetDemo: document.querySelector("#resetDemo"),
  openStudentDemo: document.querySelector("#openStudentDemo"),
};

function uuid() {
  return globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowISO() {
  return new Date().toISOString();
}

function todayISO() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function addDaysISO(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function saveAll() {
  writeLocal(KEYS.deeds, state.deeds);
  writeLocal(KEYS.hospitals, state.hospitals);
  writeLocal(KEYS.news, state.news);
  writeLocal(KEYS.students, state.students);
  writeLocal(KEYS.activations, state.activations);
  writeLocal(KEYS.audit, state.audit);
  writeLocal(KEYS.notifications, state.notifications);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function normalizeText(value) {
  return String(value ?? "").trim().toLocaleLowerCase("th-TH");
}

function formatThaiDate(value, withTime = false) {
  if (!value) return "-";
  const raw = String(value);
  const date = new Date(raw.length === 10 ? `${raw}T00:00:00` : raw);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat("th-TH", withTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formatNumber(value) {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 1 }).format(Number(value || 0));
}

function toast(message, tone = "success") {
  el.toast.textContent = message;
  el.toast.dataset.tone = tone;
  el.toast.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => el.toast.classList.remove("show"), 2800);
}

function openModal(title, subtitle, body) {
  el.modalTitle.textContent = title;
  el.modalSubtitle.textContent = subtitle;
  el.modalBody.innerHTML = body;
  el.modal.classList.add("show");
  el.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  el.modal.classList.remove("show");
  el.modal.setAttribute("aria-hidden", "true");
  el.modalBody.innerHTML = "";
  document.body.classList.remove("modal-open");
}

function generateActivationCode(studentCode) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const random = Array.from({ length: 8 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `RTAFNC-${studentCode}-${random}`;
}

function seedData() {
  const deeds = readLocal(KEYS.deeds, []);
  const hospitals = readLocal(KEYS.hospitals, []);

  if (!deeds.length) {
    deeds.push(
      {
        id: "demo-deed-approved",
        student_id: "student-demo-1",
        student_code: "6700000",
        student_name: "นพอ.ตัวอย่าง ระบบทดสอบ",
        category_code: "GD01",
        category_name: "บริจาคโลหิต / เกล็ดเลือด / พลาสมา",
        activity_date: addDaysISO(-14),
        activity_title: "บริจาคโลหิต ณ โรงพยาบาลภูมิพลอดุลยเดช",
        activity_location: "โรงพยาบาลภูมิพลอดุลยเดช",
        details: "ร่วมบริจาคโลหิตตามกิจกรรมจิตอาสาของวิทยาลัย",
        verifier_name: "เจ้าหน้าที่ธนาคารเลือด",
        requested_hours: 8,
        approved_hours: 8,
        status: "approved",
        reviewer_note: "หลักฐานครบถ้วน",
        reviewed_at: addDaysISO(-12),
        created_at: nowISO(),
      },
      {
        id: "demo-deed-pending",
        student_id: "student-demo-1",
        student_code: "6700000",
        student_name: "นพอ.ตัวอย่าง ระบบทดสอบ",
        category_code: "GD03",
        category_name: "ช่วยเหลืองานภายใน วพอ.",
        activity_date: addDaysISO(-3),
        activity_title: "ช่วยจัดเตรียมห้องประชุมวิทยาลัย",
        activity_location: "อาคารเรียน วพอ.",
        details: "จัดโต๊ะ เก้าอี้ ระบบเสียง และตรวจความเรียบร้อยก่อนการประชุม",
        verifier_name: "อาจารย์ประจำชั้น",
        requested_hours: 6,
        status: "pending",
        created_at: nowISO(),
      },
    );
  }

  if (!hospitals.length) {
    hospitals.push({
      id: "demo-hospital-follow-up",
      student_id: "student-demo-1",
      student_code: "6700000",
      student_name: "นพอ.ตัวอย่าง ระบบทดสอบ",
      visit_date: addDaysISO(-2),
      hospital_name: "โรงพยาบาลภูมิพลอดุลยเดช",
      symptoms: "มีไข้ เจ็บคอ และอ่อนเพลีย",
      diagnosis: "ติดเชื้อทางเดินหายใจส่วนบน",
      treatment_note: "พักผ่อน ดื่มน้ำ และติดตามอาการ",
      medication_note: "ยาลดไข้และยาแก้แพ้ตามแพทย์สั่ง",
      medical_leave_days: 1,
      follow_up_date: addDaysISO(3),
      status: "follow_up",
      created_at: nowISO(),
    });
  }

  const students = [
    { id: "student-demo-1", student_code: "6700000", display_name: "นพอ.ตัวอย่าง ระบบทดสอบ", cohort: 67, current_year: 2, academic_year: 2569, active_status: "active", line_status: "linked", created_at: nowISO() },
    { id: "student-demo-2", student_code: "6800001", display_name: "นพอ.หญิง กานต์พิชชา ใจดี", cohort: 68, current_year: 1, academic_year: 2569, active_status: "active", line_status: "unlinked", created_at: nowISO() },
    { id: "student-demo-3", student_code: "6600002", display_name: "นพอ.ณัฐพล รักษ์วินัย", cohort: 66, current_year: 3, academic_year: 2569, active_status: "active", line_status: "linked", created_at: nowISO() },
  ];

  const news = [
    { id: "demo-news-1", title: "เปิดรับสมัครบริจาคโลหิต", body: "ลงทะเบียนผ่านหน้า LIFF และติดตามสถานะได้ในระบบ", target_type: "all", target_value: null, is_published: true, priority: "high", published_at: nowISO(), created_at: nowISO() },
    { id: "demo-news-2", title: "กิจกรรมจิตอาสาประจำเดือน", body: "นักเรียนสามารถบันทึกกิจกรรมและแนบหลักฐานได้จากเมนูความดี", target_type: "year", target_value: "2", is_published: true, priority: "normal", published_at: nowISO(), created_at: nowISO() },
    { id: "demo-news-3", title: "กำหนดส่งเอกสารประจำชั้นปี", body: "ตรวจสอบเอกสารที่ต้องส่งเพิ่มเติมและกดยืนยันรับทราบ", target_type: "cohort", target_value: "67", is_published: false, priority: "normal", published_at: null, created_at: nowISO() },
  ];

  writeLocal(KEYS.deeds, deeds);
  writeLocal(KEYS.hospitals, hospitals);
  if (!localStorage.getItem(KEYS.students)) writeLocal(KEYS.students, students);
  if (!localStorage.getItem(KEYS.news)) writeLocal(KEYS.news, news);
  if (!localStorage.getItem(KEYS.activations)) writeLocal(KEYS.activations, []);
  if (!localStorage.getItem(KEYS.audit)) writeLocal(KEYS.audit, []);
  if (!localStorage.getItem(KEYS.notifications)) writeLocal(KEYS.notifications, []);
  localStorage.setItem(KEYS.initialized, "true");
}

function loadState() {
  state.deeds = readLocal(KEYS.deeds, []);
  state.hospitals = readLocal(KEYS.hospitals, []);
  state.news = readLocal(KEYS.news, []);
  state.students = readLocal(KEYS.students, []);
  state.activations = readLocal(KEYS.activations, []);
  state.audit = readLocal(KEYS.audit, []);
  state.notifications = readLocal(KEYS.notifications, []);
}

function logAudit(action, entityType, entityId = null, studentId = null, metadata = {}) {
  state.audit.unshift({
    id: uuid(),
    actor_role: state.role,
    actor_name: ROLE_LABELS[state.role],
    action,
    entity_type: entityType,
    entity_id: entityId,
    student_id: studentId,
    metadata,
    created_at: nowISO(),
  });
  state.audit = state.audit.slice(0, 500);
  writeLocal(KEYS.audit, state.audit);
}

function queueNotification(channel, eventType, studentId, payload) {
  state.notifications.unshift({
    id: uuid(),
    channel,
    event_type: eventType,
    student_id: studentId,
    payload,
    status: CONFIG.demoMode ? "demo_queued" : "pending",
    attempts: 0,
    created_at: nowISO(),
  });
  state.notifications = state.notifications.slice(0, 300);
  writeLocal(KEYS.notifications, state.notifications);
}

function roleAllows(...roles) {
  return roles.includes(state.role) || state.role === "admin";
}

function requireRole(roles, label) {
  if (roleAllows(...roles)) return true;
  toast(`บทบาท ${ROLE_LABELS[state.role]} ไม่มีสิทธิ์${label}`, "error");
  logAudit("permission_denied", "system", label, null, { required_roles: roles });
  return false;
}

function statusBadge(status) {
  const labels = {
    draft: "ฉบับร่าง",
    pending: "รออนุมัติ",
    approved: "อนุมัติแล้ว",
    returned: "ส่งกลับแก้ไข",
    rejected: "ไม่อนุมัติ",
    recorded: "บันทึกแล้ว",
    follow_up: "ติดตามอาการ",
    resolved: "สิ้นสุดการรักษา",
    cancelled: "ยกเลิก",
    active: "ใช้งาน",
    inactive: "ระงับ",
    linked: "เชื่อม LINE แล้ว",
    unlinked: "ยังไม่เชื่อม LINE",
    demo_queued: "คิวสาธิต",
    pending_delivery: "รอส่ง",
  };
  const ok = ["approved", "resolved", "active", "linked"].includes(status);
  const danger = ["rejected", "cancelled", "inactive"].includes(status);
  const neutral = ["draft", "recorded", "unlinked"].includes(status);
  return `<span class="badge ${ok ? "ok" : danger ? "danger" : neutral ? "neutral" : "warning"}">${escapeHtml(labels[status] ?? status)}</span>`;
}

function overview() {
  const pending = state.deeds.filter((item) => item.status === "pending").length;
  const returned = state.deeds.filter((item) => item.status === "returned").length;
  const followUp = state.hospitals.filter((item) => item.status === "follow_up").length;
  const approvedHours = state.deeds.filter((item) => item.status === "approved").reduce((sum, item) => sum + Number(item.approved_hours ?? 0), 0);
  const activeStudents = state.students.filter((item) => item.active_status === "active").length;
  const unreadQueue = state.notifications.filter((item) => item.status !== "sent").length;

  el.content.innerHTML = `
    <div class="demo-banner"><strong>DEMO CONTROL CENTER</strong><span>ข้อมูลทั้งหมดเก็บใน localStorage ของเบราว์เซอร์นี้ ไม่ใช่ข้อมูลนักเรียนจริง</span></div>
    <section class="stats six">
      <article class="stat"><small>รายการความดี</small><strong>${state.deeds.length}</strong><span>${pending} รออนุมัติ</span></article>
      <article class="stat"><small>ชั่วโมงอนุมัติ</small><strong>${formatNumber(approvedHours)}</strong><span>รวมทุกรายการ</span></article>
      <article class="stat"><small>ส่งกลับแก้ไข</small><strong>${returned}</strong><span>รอนักเรียนแก้ไข</span></article>
      <article class="stat"><small>ติดตามอาการ</small><strong>${followUp}</strong><span>Medical Role</span></article>
      <article class="stat"><small>นักเรียนใช้งาน</small><strong>${activeStudents}</strong><span>จาก ${state.students.length} ราย</span></article>
      <article class="stat"><small>คิวแจ้งเตือน</small><strong>${unreadQueue}</strong><span>LINE / Telegram</span></article>
    </section>
    <section class="dashboard-grid">
      <article class="panel">
        <div class="panel-head"><div><p>GOOD DEEDS</p><h2>คิวตรวจล่าสุด</h2></div><button class="secondary" data-page="good" type="button">เปิดคิว</button></div>
        <div class="records">${state.deeds.filter((item) => item.status === "pending").slice(0, 5).map(deedCard).join("") || '<div class="empty">ไม่มีรายการรออนุมัติ</div>'}</div>
      </article>
      <article class="panel">
        <div class="panel-head"><div><p>MEDICAL ROLE ONLY</p><h2>นัดติดตามอาการ</h2></div><button class="secondary" data-page="medical" type="button">เปิด Medical Panel</button></div>
        <div class="notice medical">ข้อมูลสุขภาพต้องแยกสิทธิ์จากผู้ตรวจความดี และทุกการเปิดดูต้องสร้าง Audit Log</div>
        <div class="records compact-list">${state.hospitals.filter((item) => item.status === "follow_up").slice(0, 5).map(hospitalCard).join("") || '<div class="empty">ไม่มีรายการติดตาม</div>'}</div>
      </article>
      <article class="panel">
        <div class="panel-head"><div><p>NEWS</p><h2>ข่าวและประกาศ</h2></div><button class="secondary" data-page="news" type="button">จัดการข่าว</button></div>
        <div class="records compact-list">${state.news.slice(0, 4).map(newsCard).join("") || '<div class="empty">ยังไม่มีข่าว</div>'}</div>
      </article>
      <article class="panel">
        <div class="panel-head"><div><p>REGISTRY</p><h2>สมาชิกและรหัสเปิดใช้งาน</h2></div><button class="secondary" data-page="students" type="button">เปิดทะเบียน</button></div>
        <div class="mini-stats"><div><strong>${state.students.filter((item) => item.line_status === "linked").length}</strong><span>เชื่อม LINE</span></div><div><strong>${state.students.filter((item) => item.line_status !== "linked").length}</strong><span>รอเชื่อม</span></div><div><strong>${state.activations.filter((item) => item.active && !item.used_at).length}</strong><span>รหัสพร้อมใช้</span></div></div>
      </article>
    </section>`;
}

function deedCard(item) {
  return `<article class="record"><div class="record-title"><div><h3>${escapeHtml(item.activity_title || item.category_name || item.category_code)}</h3><p>${escapeHtml(item.student_code || "-")} · ${escapeHtml(item.student_name || "นักเรียน")}</p></div>${statusBadge(item.status)}</div><p>${escapeHtml(formatThaiDate(item.activity_date))} · ${escapeHtml(item.category_name || item.category_code)}</p><div class="record-footer"><strong>${formatNumber(item.approved_hours ?? item.requested_hours)} ชั่วโมง</strong><button class="secondary compact" data-action="view-deed" data-id="${escapeHtml(item.id)}" type="button">ตรวจรายการ</button></div></article>`;
}

function hospitalCard(item) {
  return `<article class="record"><div class="record-title"><div><h3>${escapeHtml(item.hospital_name)}</h3><p>${escapeHtml(item.student_code || "-")} · ${escapeHtml(item.student_name || "นักเรียน")}</p></div>${statusBadge(item.status)}</div><p>${escapeHtml(formatThaiDate(item.visit_date))} · ${escapeHtml(item.symptoms)}</p><div class="record-footer"><strong>${item.follow_up_date ? `นัด ${escapeHtml(formatThaiDate(item.follow_up_date))}` : escapeHtml(item.diagnosis || "ไม่ระบุวินิจฉัย")}</strong><button class="secondary compact" data-action="view-hospital" data-id="${escapeHtml(item.id)}" type="button">เปิดข้อมูล</button></div></article>`;
}

function newsCard(item) {
  const target = item.target_type === "all" ? "ทุกคน" : item.target_type === "cohort" ? `รุ่น ${item.target_value}` : item.target_type === "year" ? `ชั้นปี ${item.target_value}` : `รายบุคคล ${item.target_value}`;
  return `<article class="record"><div class="record-title"><div><h3>${escapeHtml(item.title)}</h3><p>เป้าหมาย: ${escapeHtml(target)}</p></div>${item.is_published ? '<span class="badge ok">เผยแพร่</span>' : '<span class="badge neutral">ฉบับร่าง</span>'}</div><p>${escapeHtml(item.body)}</p><div class="record-footer"><strong>${item.published_at ? escapeHtml(formatThaiDate(item.published_at)) : "ยังไม่เผยแพร่"}</strong><button class="secondary compact" data-action="edit-news" data-id="${escapeHtml(item.id)}" type="button">แก้ไข</button></div></article>`;
}

function studentCard(item) {
  return `<article class="record"><div class="record-title"><div><h3>${escapeHtml(item.student_code)} · ${escapeHtml(item.display_name)}</h3><p>รุ่น ${escapeHtml(item.cohort)} · ชั้นปี ${escapeHtml(item.current_year)} · ปีการศึกษา ${escapeHtml(item.academic_year)}</p></div>${statusBadge(item.active_status)}</div><div class="record-footer">${statusBadge(item.line_status)}<div class="record-actions"><button class="secondary compact" data-action="student-detail" data-id="${escapeHtml(item.id)}" type="button">รายละเอียด</button><button class="primary compact" data-action="generate-code" data-id="${escapeHtml(item.id)}" type="button">สร้างรหัส</button></div></div></article>`;
}

function filteredDeeds() {
  const search = normalizeText(state.filters.goodSearch);
  return state.deeds.filter((item) => {
    const statusMatch = state.filters.goodStatus === "all" || item.status === state.filters.goodStatus;
    const text = normalizeText(`${item.student_code} ${item.student_name} ${item.activity_title} ${item.category_name} ${item.activity_location}`);
    return statusMatch && (!search || text.includes(search));
  });
}

function goodPage() {
  const records = filteredDeeds();
  const pending = state.deeds.filter((item) => item.status === "pending").length;
  el.content.innerHTML = `<section class="panel"><div class="panel-head"><div><p>APPROVAL QUEUE</p><h2>ตรวจบันทึกความดี</h2></div><span class="badge warning">${pending} รายการรอ</span></div><div class="toolbar"><label class="search"><span>⌕</span><input data-filter="goodSearch" value="${escapeHtml(state.filters.goodSearch)}" placeholder="ค้นหารหัส ชื่อ หรือกิจกรรม"></label><select data-filter="goodStatus"><option value="all">ทุกสถานะ</option>${["draft","pending","approved","returned","rejected"].map((status) => `<option value="${status}" ${state.filters.goodStatus === status ? "selected" : ""}>${statusBadge(status).replace(/<[^>]*>/g, "")}</option>`).join("")}</select></div><div class="records">${records.length ? records.map(deedCard).join("") : '<div class="empty">ไม่พบรายการตามตัวกรอง</div>'}</div></section>`;
}

function viewDeed(id) {
  if (!requireRole(["reviewer"], "ตรวจบันทึกความดี")) return;
  const item = state.deeds.find((record) => String(record.id) === String(id));
  if (!item) return;
  logAudit("view_good_deed", "good_deed_record", item.id, item.student_id, { status: item.status });
  openModal("ตรวจบันทึกความดี", `${item.student_code || "-"} · ${item.student_name || "นักเรียน"}`, `
    <div class="detail-grid">
      ${detailRow("ประเภท", item.category_name || item.category_code)}
      ${detailRow("วันที่", formatThaiDate(item.activity_date))}
      ${detailRow("กิจกรรม", item.activity_title)}
      ${detailRow("สถานที่", item.activity_location)}
      ${detailRow("รายละเอียด", item.details)}
      ${detailRow("ผู้รับรอง", item.verifier_name)}
      ${detailRow("ชั่วโมงที่ขอ", `${formatNumber(item.requested_hours)} ชั่วโมง`)}
      ${detailRow("สถานะ", statusBadge(item.status), true)}
      ${item.reviewer_note ? detailRow("หมายเหตุเดิม", item.reviewer_note) : ""}
    </div>
    <form id="reviewForm" class="form review-form">
      <label>ชั่วโมงที่อนุมัติ<input name="approved_hours" type="number" min="0.5" max="24" step="0.5" value="${Number(item.approved_hours ?? item.requested_hours ?? 0)}"></label>
      <label>หมายเหตุผู้ตรวจ<textarea name="reviewer_note" rows="4" maxlength="1000" placeholder="ระบุเหตุผลกรณีส่งกลับหรือไม่อนุมัติ">${escapeHtml(item.reviewer_note || "")}</textarea></label>
      <div class="decision-grid"><button class="primary" name="decision" value="approved" type="submit">อนุมัติ</button><button class="secondary" name="decision" value="returned" type="submit">ส่งกลับแก้ไข</button><button class="danger" name="decision" value="rejected" type="submit">ไม่อนุมัติ</button></div>
    </form>`);

  document.querySelector("#reviewForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const decision = event.submitter?.value;
    const data = new FormData(event.currentTarget);
    const note = String(data.get("reviewer_note") || "").trim();
    const approvedHours = Number(data.get("approved_hours"));
    if (!["approved", "returned", "rejected"].includes(decision)) return;
    if (decision === "approved" && (!Number.isFinite(approvedHours) || approvedHours < 0.5 || approvedHours > 24)) {
      toast("ชั่วโมงอนุมัติต้องอยู่ระหว่าง 0.5–24 ชั่วโมง", "error");
      return;
    }
    if (["returned", "rejected"].includes(decision) && note.length < 5) {
      toast("กรุณาระบุเหตุผลอย่างน้อย 5 ตัวอักษร", "error");
      return;
    }
    item.status = decision;
    item.approved_hours = decision === "approved" ? approvedHours : null;
    item.reviewer_note = note;
    item.reviewed_at = nowISO();
    item.reviewer_role = state.role;
    writeLocal(KEYS.deeds, state.deeds);
    logAudit(`good_deed_${decision}`, "good_deed_record", item.id, item.student_id, { approved_hours: item.approved_hours, note });
    queueNotification("line", `good_deed_${decision}`, item.student_id, { record_id: item.id, title: item.activity_title, note, approved_hours: item.approved_hours });
    closeModal();
    render();
    toast("บันทึกผลตรวจและเข้าคิวแจ้งเตือนแล้ว");
  });
}

function filteredHospitals() {
  const search = normalizeText(state.filters.medicalSearch);
  return state.hospitals.filter((item) => {
    const statusMatch = state.filters.medicalStatus === "all" || item.status === state.filters.medicalStatus;
    const text = normalizeText(`${item.student_code} ${item.student_name} ${item.hospital_name} ${item.symptoms} ${item.diagnosis}`);
    return statusMatch && (!search || text.includes(search));
  });
}

function medicalPage() {
  if (!roleAllows("medical")) {
    el.content.innerHTML = permissionPanel("MEDICAL ROLE ONLY", "ข้อมูลสุขภาพถูกแยกจากคิวตรวจความดี กรุณาเปลี่ยนบทบาทจำลองเป็น “เจ้าหน้าที่แพทย์” หรือ “ผู้ดูแลระบบ”");
    return;
  }
  const records = filteredHospitals();
  el.content.innerHTML = `<section class="panel"><div class="panel-head"><div><p>MEDICAL ROLE ONLY</p><h2>ข้อมูลไปโรงพยาบาล</h2></div><span class="badge warning">${state.hospitals.filter((item) => item.status === "follow_up").length} นัดติดตาม</span></div><div class="notice medical">ทุกครั้งที่เปิดข้อมูลสุขภาพ ระบบสาธิตจะบันทึก Audit Log พร้อมบทบาท เวลา และรายการที่เปิด</div><div class="toolbar"><label class="search"><span>⌕</span><input data-filter="medicalSearch" value="${escapeHtml(state.filters.medicalSearch)}" placeholder="ค้นหานักเรียน โรงพยาบาล หรืออาการ"></label><select data-filter="medicalStatus"><option value="all">ทุกสถานะ</option>${["recorded","follow_up","resolved","cancelled"].map((status) => `<option value="${status}" ${state.filters.medicalStatus === status ? "selected" : ""}>${statusBadge(status).replace(/<[^>]*>/g, "")}</option>`).join("")}</select></div><div class="records">${records.length ? records.map(hospitalCard).join("") : '<div class="empty">ไม่พบข้อมูลสุขภาพตามตัวกรอง</div>'}</div></section>`;
}

function viewHospital(id) {
  if (!requireRole(["medical"], "เปิดข้อมูลสุขภาพ")) return;
  const item = state.hospitals.find((record) => String(record.id) === String(id));
  if (!item) return;
  logAudit("view_hospital_record", "hospital_visit", item.id, item.student_id, { purpose: "medical_review" });
  openModal("ข้อมูลโรงพยาบาล", `${item.student_code || "-"} · ${item.student_name || "นักเรียน"}`, `
    <div class="medical-warning">🔒 ข้อมูลสุขภาพส่วนบุคคล — ห้ามบันทึกภาพหรือส่งต่อโดยไม่มีอำนาจหน้าที่</div>
    <div class="detail-grid">
      ${detailRow("วันที่", formatThaiDate(item.visit_date))}
      ${detailRow("สถานพยาบาล", item.hospital_name)}
      ${detailRow("อาการ", item.symptoms)}
      ${detailRow("การวินิจฉัย", item.diagnosis)}
      ${detailRow("การรักษา", item.treatment_note)}
      ${detailRow("ยา", item.medication_note)}
      ${detailRow("วันลาป่วย", `${formatNumber(item.medical_leave_days)} วัน`)}
      ${detailRow("นัดติดตาม", formatThaiDate(item.follow_up_date))}
      ${detailRow("สถานะ", statusBadge(item.status), true)}
    </div>
    <form id="medicalReviewForm" class="form review-form">
      <label>วันติดตามอาการ<input name="follow_up_date" type="date" min="${todayISO()}" value="${escapeHtml(item.follow_up_date || "")}"></label>
      <label>บันทึกเจ้าหน้าที่แพทย์<textarea name="medical_note" rows="4" maxlength="1000" placeholder="บันทึกการติดตามหรือคำแนะนำ">${escapeHtml(item.medical_staff_note || "")}</textarea></label>
      <div class="decision-grid"><button class="primary blue" name="decision" value="follow_up" type="submit">ต้องติดตาม</button><button class="primary" name="decision" value="resolved" type="submit">สิ้นสุดการรักษา</button><button class="danger" name="decision" value="cancelled" type="submit">ยกเลิกรายการ</button></div>
    </form>`);

  document.querySelector("#medicalReviewForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const decision = event.submitter?.value;
    const data = new FormData(event.currentTarget);
    const note = String(data.get("medical_note") || "").trim();
    const followUpDate = String(data.get("follow_up_date") || "");
    if (decision === "follow_up" && !followUpDate) {
      toast("กรุณากำหนดวันติดตามอาการ", "error");
      return;
    }
    item.status = decision;
    item.follow_up_date = decision === "follow_up" ? followUpDate : null;
    item.medical_staff_note = note;
    item.medical_reviewed_at = nowISO();
    writeLocal(KEYS.hospitals, state.hospitals);
    logAudit(`hospital_${decision}`, "hospital_visit", item.id, item.student_id, { follow_up_date: item.follow_up_date, note });
    queueNotification("line", `hospital_${decision}`, item.student_id, { visit_id: item.id, hospital_name: item.hospital_name, follow_up_date: item.follow_up_date });
    closeModal();
    render();
    toast("อัปเดตสถานะสุขภาพและเข้าคิวแจ้งเตือนแล้ว");
  });
}

function newsPage() {
  if (!roleAllows("reviewer", "registrar")) {
    el.content.innerHTML = permissionPanel("NEWS MANAGEMENT", "บทบาทนี้ไม่มีสิทธิ์จัดการข่าวสาร");
    return;
  }
  el.content.innerHTML = `<section class="panel"><div class="panel-head"><div><p>ANNOUNCEMENTS</p><h2>จัดการข่าวสาร</h2></div><button class="primary" data-action="new-news" type="button">+ สร้างข่าว</button></div><div class="notice">กำหนดกลุ่มเป้าหมายได้ทั้งทุกคน รุ่น ชั้นปี หรือรายบุคคล การเผยแพร่จริงต้องผ่านฐานข้อมูลและ RLS</div><div class="records" style="margin-top:12px">${state.news.length ? state.news.map(newsCard).join("") : '<div class="empty">ยังไม่มีข่าวสาร</div>'}</div></section>`;
}

function openNewsForm(id = null) {
  if (!requireRole(["reviewer", "registrar"], "จัดการข่าวสาร")) return;
  const item = id ? state.news.find((record) => record.id === id) : null;
  openModal(item ? "แก้ไขข่าวสาร" : "สร้างข่าวสาร", "กำหนดข้อความ กลุ่มเป้าหมาย และสถานะเผยแพร่", `
    <form id="newsForm" class="form" data-id="${escapeHtml(id || "")}">
      <label>หัวข้อข่าว<input name="title" maxlength="200" value="${escapeHtml(item?.title || "")}" required></label>
      <label>รายละเอียด<textarea name="body" rows="6" maxlength="3000" required>${escapeHtml(item?.body || "")}</textarea></label>
      <div class="form-grid two"><label>กลุ่มเป้าหมาย<select name="target_type"><option value="all" ${item?.target_type === "all" ? "selected" : ""}>ทุกคน</option><option value="cohort" ${item?.target_type === "cohort" ? "selected" : ""}>รุ่น</option><option value="year" ${item?.target_type === "year" ? "selected" : ""}>ชั้นปี</option><option value="individual" ${item?.target_type === "individual" ? "selected" : ""}>รายบุคคล</option></select></label><label>ค่ากลุ่มเป้าหมาย<input name="target_value" value="${escapeHtml(item?.target_value || "")}" placeholder="เช่น 67, 2 หรือรหัสนักเรียน"></label></div>
      <div class="form-grid two"><label>ความสำคัญ<select name="priority"><option value="normal" ${item?.priority !== "high" ? "selected" : ""}>ปกติ</option><option value="high" ${item?.priority === "high" ? "selected" : ""}>สำคัญ</option></select></label><label>สถานะ<select name="publish"><option value="draft" ${!item?.is_published ? "selected" : ""}>บันทึกร่าง</option><option value="published" ${item?.is_published ? "selected" : ""}>เผยแพร่ทันที</option></select></label></div>
      <div class="decision-grid"><button class="secondary" data-action="close-modal" type="button">ยกเลิก</button><button class="primary" type="submit">บันทึกข่าว</button>${item ? '<button class="danger" data-action="delete-news" data-id="'+escapeHtml(item.id)+'" type="button">ลบข่าว</button>' : ""}</div>
    </form>`);

  document.querySelector("#newsForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const targetType = String(form.get("target_type"));
    const targetValue = String(form.get("target_value") || "").trim();
    if (targetType !== "all" && !targetValue) {
      toast("กรุณาระบุค่ากลุ่มเป้าหมาย", "error");
      return;
    }
    const record = {
      ...item,
      id: item?.id || uuid(),
      title: String(form.get("title") || "").trim(),
      body: String(form.get("body") || "").trim(),
      target_type: targetType,
      target_value: targetType === "all" ? null : targetValue,
      priority: String(form.get("priority")),
      is_published: form.get("publish") === "published",
      published_at: form.get("publish") === "published" ? (item?.published_at || nowISO()) : null,
      updated_at: nowISO(),
      created_at: item?.created_at || nowISO(),
    };
    state.news = [record, ...state.news.filter((news) => news.id !== record.id)];
    writeLocal(KEYS.news, state.news);
    logAudit(item ? "update_announcement" : "create_announcement", "announcement", record.id, null, { target_type: record.target_type, is_published: record.is_published });
    if (record.is_published) queueNotification("line", "announcement_published", null, { announcement_id: record.id, target_type: record.target_type, target_value: record.target_value, title: record.title });
    closeModal();
    render();
    toast(record.is_published ? "เผยแพร่ข่าวและเข้าคิวแจ้งเตือนแล้ว" : "บันทึกข่าวฉบับร่างแล้ว");
  });
}

function deleteNews(id) {
  if (!requireRole(["reviewer", "registrar"], "ลบข่าวสาร")) return;
  if (!window.confirm("ยืนยันลบข่าวนี้หรือไม่?")) return;
  state.news = state.news.filter((item) => item.id !== id);
  writeLocal(KEYS.news, state.news);
  logAudit("delete_announcement", "announcement", id);
  closeModal();
  render();
  toast("ลบข่าวแล้ว");
}

function studentsPage() {
  if (!roleAllows("registrar")) {
    el.content.innerHTML = permissionPanel("STUDENT REGISTRY", "กรุณาเปลี่ยนบทบาทเป็น “นายทะเบียน” หรือ “ผู้ดูแลระบบ” เพื่อจัดการทะเบียนนักเรียน");
    return;
  }
  const search = normalizeText(state.filters.studentSearch);
  const records = state.students.filter((item) => !search || normalizeText(`${item.student_code} ${item.display_name} ${item.cohort} ${item.current_year}`).includes(search));
  el.content.innerHTML = `<section class="panel"><div class="panel-head"><div><p>STUDENT REGISTRY</p><h2>ทะเบียนนักเรียน</h2></div><div class="record-actions"><button class="secondary" data-action="import-students" type="button">นำเข้า CSV</button><button class="primary" data-action="new-student" type="button">+ เพิ่มนักเรียน</button></div></div><div class="toolbar single"><label class="search"><span>⌕</span><input data-filter="studentSearch" value="${escapeHtml(state.filters.studentSearch)}" placeholder="ค้นหารหัส ชื่อ รุ่น หรือชั้นปี"></label></div><div class="records">${records.length ? records.map(studentCard).join("") : '<div class="empty">ไม่พบนักเรียน</div>'}</div></section>`;
}

function openStudentForm(id = null) {
  if (!requireRole(["registrar"], "จัดการทะเบียนนักเรียน")) return;
  const item = id ? state.students.find((record) => record.id === id) : null;
  openModal(item ? "แก้ไขข้อมูลนักเรียน" : "เพิ่มนักเรียน", "ตรวจรหัสซ้ำก่อนบันทึก", `
    <form id="studentForm" class="form" data-id="${escapeHtml(id || "")}">
      <div class="form-grid two"><label>รหัสนักเรียน 7 หลัก<input name="student_code" inputmode="numeric" pattern="[0-9]{7}" maxlength="7" value="${escapeHtml(item?.student_code || "")}" required></label><label>ชื่อแสดงผล<input name="display_name" maxlength="200" value="${escapeHtml(item?.display_name || "")}" required></label></div>
      <div class="form-grid three"><label>รุ่น<input name="cohort" type="number" min="1" max="99" value="${escapeHtml(item?.cohort || "")}" required></label><label>ชั้นปี<input name="current_year" type="number" min="1" max="4" value="${escapeHtml(item?.current_year || 1)}" required></label><label>ปีการศึกษา<input name="academic_year" type="number" min="2500" max="2700" value="${escapeHtml(item?.academic_year || 2569)}" required></label></div>
      <label>สถานะ<select name="active_status"><option value="active" ${item?.active_status !== "inactive" ? "selected" : ""}>ใช้งาน</option><option value="inactive" ${item?.active_status === "inactive" ? "selected" : ""}>ระงับ</option></select></label>
      <div class="decision-grid"><button class="secondary" data-action="close-modal" type="button">ยกเลิก</button><button class="primary" type="submit">บันทึกทะเบียน</button></div>
    </form>`);

  document.querySelector("#studentForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const code = String(form.get("student_code") || "").trim();
    if (!/^\d{7}$/.test(code)) {
      toast("รหัสนักเรียนต้องเป็นตัวเลข 7 หลัก", "error");
      return;
    }
    const duplicate = state.students.some((student) => student.student_code === code && student.id !== item?.id);
    if (duplicate) {
      toast("พบรหัสนักเรียนซ้ำในระบบ", "error");
      return;
    }
    const record = {
      ...item,
      id: item?.id || uuid(),
      student_code: code,
      display_name: String(form.get("display_name") || "").trim(),
      cohort: Number(form.get("cohort")),
      current_year: Number(form.get("current_year")),
      academic_year: Number(form.get("academic_year")),
      active_status: String(form.get("active_status")),
      line_status: item?.line_status || "unlinked",
      updated_at: nowISO(),
      created_at: item?.created_at || nowISO(),
    };
    state.students = [record, ...state.students.filter((student) => student.id !== record.id)];
    writeLocal(KEYS.students, state.students);
    logAudit(item ? "update_student" : "create_student", "student", record.id, record.id, { student_code: record.student_code });
    closeModal();
    render();
    toast("บันทึกทะเบียนนักเรียนแล้ว");
  });
}

function studentDetail(id) {
  if (!requireRole(["registrar"], "เปิดทะเบียนนักเรียน")) return;
  const student = state.students.find((item) => item.id === id);
  if (!student) return;
  const codes = state.activations.filter((item) => item.student_id === id);
  logAudit("view_student", "student", id, id);
  openModal("ข้อมูลนักเรียน", `${student.student_code} · ${student.display_name}`, `
    <div class="detail-grid">${detailRow("รุ่น", student.cohort)}${detailRow("ชั้นปี", student.current_year)}${detailRow("ปีการศึกษา", student.academic_year)}${detailRow("สถานะสมาชิก", statusBadge(student.active_status), true)}${detailRow("LINE", statusBadge(student.line_status), true)}</div>
    <h3 class="subheading">รหัสเปิดใช้งาน</h3>
    <div class="records">${codes.length ? codes.map((code) => `<article class="record"><div class="record-title"><div><h3>${escapeHtml(code.code)}</h3><p>หมดอายุ ${escapeHtml(formatThaiDate(code.expires_at))}</p></div>${code.used_at ? '<span class="badge neutral">ใช้แล้ว</span>' : code.active ? '<span class="badge ok">พร้อมใช้</span>' : '<span class="badge danger">ยกเลิก</span>'}</div></article>`).join("") : '<div class="empty">ยังไม่มีรหัสเปิดใช้งาน</div>'}</div>
    <div class="decision-grid"><button class="secondary" data-action="edit-student" data-id="${student.id}" type="button">แก้ไขข้อมูล</button><button class="primary" data-action="generate-code" data-id="${student.id}" type="button">สร้างรหัสใหม่</button><button class="danger" data-action="toggle-student" data-id="${student.id}" type="button">${student.active_status === "active" ? "ระงับบัญชี" : "เปิดใช้งาน"}</button></div>`);
}

function generateCode(id) {
  if (!requireRole(["registrar"], "สร้างรหัสเปิดใช้งาน")) return;
  const student = state.students.find((item) => item.id === id);
  if (!student) return;
  state.activations.forEach((code) => {
    if (code.student_id === id && code.active && !code.used_at) code.active = false;
  });
  const activation = {
    id: uuid(),
    student_id: id,
    code: generateActivationCode(student.student_code),
    active: true,
    used_at: null,
    expires_at: addDaysISO(7),
    created_at: nowISO(),
  };
  state.activations.unshift(activation);
  writeLocal(KEYS.activations, state.activations);
  logAudit("generate_activation_code", "activation_code", activation.id, id, { expires_at: activation.expires_at });
  queueNotification("line", "activation_code_created", id, { activation_code: activation.code, expires_at: activation.expires_at });
  openModal("รหัสเปิดใช้งานใหม่", `${student.student_code} · ${student.display_name}`, `<div class="activation-code">${escapeHtml(activation.code)}</div><p class="helper">ใช้ได้ถึง ${escapeHtml(formatThaiDate(activation.expires_at))} และใช้ได้ครั้งเดียว</p><button class="primary full" data-action="copy-code" data-code="${escapeHtml(activation.code)}" type="button">คัดลอกรหัส</button>`);
}

function toggleStudent(id) {
  if (!requireRole(["registrar"], "เปลี่ยนสถานะนักเรียน")) return;
  const student = state.students.find((item) => item.id === id);
  if (!student) return;
  student.active_status = student.active_status === "active" ? "inactive" : "active";
  writeLocal(KEYS.students, state.students);
  logAudit("toggle_student_status", "student", id, id, { active_status: student.active_status });
  closeModal();
  render();
  toast(`เปลี่ยนสถานะเป็น ${student.active_status === "active" ? "ใช้งาน" : "ระงับ"} แล้ว`);
}

function openImportStudents() {
  if (!requireRole(["registrar"], "นำเข้าทะเบียนนักเรียน")) return;
  openModal("นำเข้านักเรียนจาก CSV", "รูปแบบ: student_code,display_name,cohort,current_year,academic_year", `
    <form id="importForm" class="form">
      <label>วางข้อมูล CSV<textarea name="csv" rows="10" placeholder="6700001,นพอ.ตัวอย่าง คนที่หนึ่ง,67,2,2569\n6700002,นพอ.ตัวอย่าง คนที่สอง,67,2,2569"></textarea></label>
      <div id="importPreview" class="notice">ระบบจะตรวจรหัส 7 หลักและรายการซ้ำก่อนบันทึก</div>
      <button class="primary" type="submit">ตรวจสอบและนำเข้า</button>
    </form>`);
  document.querySelector("#importForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const csv = String(new FormData(event.currentTarget).get("csv") || "").trim();
    const lines = csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const parsed = [];
    const errors = [];
    const seen = new Set(state.students.map((item) => item.student_code));
    lines.forEach((line, index) => {
      const [studentCode, displayName, cohort, currentYear, academicYear] = line.split(",").map((value) => value.trim());
      if (!/^\d{7}$/.test(studentCode || "")) errors.push(`บรรทัด ${index + 1}: รหัสต้องเป็นตัวเลข 7 หลัก`);
      else if (seen.has(studentCode)) errors.push(`บรรทัด ${index + 1}: รหัส ${studentCode} ซ้ำ`);
      else if (!displayName) errors.push(`บรรทัด ${index + 1}: ไม่มีชื่อ`);
      else {
        seen.add(studentCode);
        parsed.push({ id: uuid(), student_code: studentCode, display_name: displayName, cohort: Number(cohort), current_year: Number(currentYear), academic_year: Number(academicYear), active_status: "active", line_status: "unlinked", created_at: nowISO() });
      }
    });
    if (errors.length) {
      document.querySelector("#importPreview").innerHTML = `<strong>พบข้อผิดพลาด ${errors.length} รายการ</strong><br>${errors.map(escapeHtml).join("<br>")}`;
      return;
    }
    state.students = [...parsed, ...state.students];
    writeLocal(KEYS.students, state.students);
    logAudit("import_students", "student_batch", null, null, { count: parsed.length });
    closeModal();
    render();
    toast(`นำเข้านักเรียน ${parsed.length} รายสำเร็จ`);
  });
}

function auditPage() {
  if (!roleAllows("admin")) {
    el.content.innerHTML = permissionPanel("AUDIT LOG", "Audit Log เปิดให้เฉพาะผู้ดูแลระบบในหน้าสาธิตนี้");
    return;
  }
  el.content.innerHTML = `<section class="panel"><div class="panel-head"><div><p>AUDIT & TRACEABILITY</p><h2>ประวัติการใช้งาน</h2></div><button class="secondary" data-action="export-audit" type="button">ส่งออก JSON</button></div><div class="audit-table"><div class="audit-head"><span>เวลา</span><span>ผู้กระทำ</span><span>การกระทำ</span><span>รายการ</span></div>${state.audit.length ? state.audit.map((item) => `<div class="audit-row"><span>${escapeHtml(formatThaiDate(item.created_at, true))}</span><span>${escapeHtml(item.actor_name || item.actor_role)}</span><span>${escapeHtml(item.action)}</span><span>${escapeHtml(item.entity_type)} ${escapeHtml(item.entity_id || "")}</span></div>`).join("") : '<div class="empty">ยังไม่มี Audit Log</div>'}</div></section>`;
}

function systemPage() {
  const checks = [
    ["UI และแบบฟอร์ม", true, "Student LIFF และ Staff Demo ทำงานได้ใน localStorage"],
    ["GitHub Pages", false, "ต้องเปิด Source = GitHub Actions และรอ Workflow สำเร็จ"],
    ["Supabase Project", Boolean(state.supabase), state.supabase ? "เชื่อม Client แล้ว" : "ยังไม่ใส่ Project URL / Publishable Key"],
    ["LINE LIFF ID", false, "ยังไม่ใส่ LIFF ID ใน config.js"],
    ["RLS", false, "ต้องรัน migration และทดสอบสิทธิ์ทุกบทบาท"],
    ["Private Storage", false, "ต้องสร้าง Bucket และ Storage Policies"],
    ["LINE Auth Edge Function", false, "มีโค้ดแล้ว แต่ยังต้อง Deploy และตั้ง Secret"],
    ["Notification Delivery", false, `${state.notifications.length} รายการอยู่ในคิวสาธิต`],
  ];
  el.content.innerHTML = `<section class="panel"><div class="panel-head"><div><p>SYSTEM READINESS</p><h2>สถานะระบบ</h2></div><button class="secondary" data-action="export-system" type="button">ส่งออกรายงาน</button></div><div class="readiness-list">${checks.map(([label, ok, detail]) => `<article class="readiness ${ok ? "ready" : "waiting"}"><span>${ok ? "✓" : "!"}</span><div><h3>${escapeHtml(label)}</h3><p>${escapeHtml(detail)}</p></div></article>`).join("")}</div><h3 class="subheading">คิวแจ้งเตือนสาธิต</h3><div class="records">${state.notifications.slice(0, 20).map((item) => `<article class="record"><div class="record-title"><div><h3>${escapeHtml(item.event_type)}</h3><p>${escapeHtml(item.channel.toUpperCase())} · ${escapeHtml(formatThaiDate(item.created_at, true))}</p></div>${statusBadge(item.status)}</div></article>`).join("") || '<div class="empty">ยังไม่มีคิวแจ้งเตือน</div>'}</div></section>`;
}

function detailRow(label, value, html = false) {
  return `<div class="detail-row"><span>${escapeHtml(label)}</span><strong>${html ? value : escapeHtml(value || "-")}</strong></div>`;
}

function permissionPanel(title, message) {
  return `<section class="panel permission"><div class="lock">🔒</div><p>${escapeHtml(title)}</p><h2>ไม่มีสิทธิ์เข้าถึง</h2><div class="notice">${escapeHtml(message)}</div></section>`;
}

function exportJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function showConnectionStatus() {
  openModal("สถานะการเชื่อมต่อ", "ตรวจสอบสิ่งที่พร้อมและสิ่งที่ยังต้องตั้งค่า", `<div class="readiness-list"><article class="readiness ready"><span>✓</span><div><h3>Staff Demo</h3><p>อนุมัติความดี งานแพทย์ ข่าวสาร ทะเบียน Activation Code และ Audit Log ใช้งานได้</p></div></article><article class="readiness ${state.supabase ? "ready" : "waiting"}"><span>${state.supabase ? "✓" : "!"}</span><div><h3>Supabase</h3><p>${state.supabase ? "เชื่อมแล้ว" : "ยังไม่เชื่อมฐานข้อมูลจริง"}</p></div></article><article class="readiness waiting"><span>!</span><div><h3>Production Authorization</h3><p>ต้องใช้ Supabase Auth + user_roles + RLS ก่อนเปิดให้เจ้าหน้าที่จริง</p></div></article></div>`);
}

function render() {
  loadState();
  const titles = { overview: "ภาพรวมระบบ", good: "ตรวจบันทึกความดี", medical: "เจ้าหน้าที่แพทย์", news: "จัดการข่าวสาร", students: "ทะเบียนนักเรียน", audit: "Audit Log", system: "สถานะระบบ" };
  el.pageTitle.textContent = titles[state.page] || "RTAFNC Staff";
  el.roleSelect.value = state.role;
  document.querySelectorAll("nav button").forEach((button) => button.classList.toggle("active", button.dataset.page === state.page));

  if (state.page === "overview") overview();
  else if (state.page === "good") goodPage();
  else if (state.page === "medical") medicalPage();
  else if (state.page === "news") newsPage();
  else if (state.page === "students") studentsPage();
  else if (state.page === "audit") auditPage();
  else systemPage();
}

function handleFilter(target) {
  const key = target.dataset.filter;
  if (!key) return;
  state.filters[key] = target.value;
  if (state.page === "good") goodPage();
  else if (state.page === "medical") medicalPage();
  else if (state.page === "students") studentsPage();
}

function bind() {
  document.addEventListener("click", async (event) => {
    const pageTarget = event.target.closest("[data-page]");
    if (pageTarget) {
      state.page = pageTarget.dataset.page;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    if (action === "view-deed") viewDeed(target.dataset.id);
    else if (action === "view-hospital") viewHospital(target.dataset.id);
    else if (action === "new-news") openNewsForm();
    else if (action === "edit-news") openNewsForm(target.dataset.id);
    else if (action === "delete-news") deleteNews(target.dataset.id);
    else if (action === "new-student") openStudentForm();
    else if (action === "edit-student") { const id = target.dataset.id; closeModal(); openStudentForm(id); }
    else if (action === "student-detail") studentDetail(target.dataset.id);
    else if (action === "generate-code") generateCode(target.dataset.id);
    else if (action === "toggle-student") toggleStudent(target.dataset.id);
    else if (action === "import-students") openImportStudents();
    else if (action === "copy-code") {
      try { await navigator.clipboard.writeText(target.dataset.code); toast("คัดลอกรหัสแล้ว"); }
      catch { toast("คัดลอกไม่ได้ กรุณากดค้างที่รหัส", "error"); }
    }
    else if (action === "export-audit") { exportJson(`rtafnc-audit-${todayISO()}.json`, state.audit); toast("ส่งออก Audit Log แล้ว"); }
    else if (action === "export-system") { exportJson(`rtafnc-system-${todayISO()}.json`, { exported_at: nowISO(), role: state.role, counts: { deeds: state.deeds.length, hospitals: state.hospitals.length, students: state.students.length, news: state.news.length, audit: state.audit.length, notifications: state.notifications.length } }); toast("ส่งออกรายงานระบบแล้ว"); }
    else if (action === "close-modal") closeModal();
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches("input[data-filter]")) handleFilter(event.target);
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches("select[data-filter]")) handleFilter(event.target);
  });

  el.roleSelect.addEventListener("change", () => {
    const previous = state.role;
    state.role = el.roleSelect.value;
    localStorage.setItem(KEYS.role, state.role);
    logAudit("switch_demo_role", "session", null, null, { from: previous, to: state.role });
    render();
    toast(`เปลี่ยนบทบาทเป็น ${ROLE_LABELS[state.role]}`);
  });

  el.modalClose.addEventListener("click", closeModal);
  el.modal.addEventListener("click", (event) => { if (event.target === el.modal) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && el.modal.classList.contains("show")) closeModal(); });
  el.connectionButton.addEventListener("click", showConnectionStatus);
  el.resetDemo.addEventListener("click", () => {
    if (!window.confirm("คืนค่าข้อมูลสาธิตทั้งหมดหรือไม่?")) return;
    [KEYS.deeds, KEYS.hospitals, KEYS.news, KEYS.students, KEYS.activations, KEYS.audit, KEYS.notifications, KEYS.initialized].forEach((key) => localStorage.removeItem(key));
    seedData();
    loadState();
    state.page = "overview";
    render();
    toast("คืนค่าข้อมูลสาธิตแล้ว");
  });
  el.openStudentDemo.addEventListener("click", () => {
    const target = window.location.pathname.includes("/admin-demo/") ? "../" : "../liff/";
    window.open(target, "_blank", "noopener");
  });
}

async function initializeSupabase() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabasePublishableKey || !window.supabase) return;
  state.supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabasePublishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  const { data } = await state.supabase.auth.getSession();
  state.session = data.session;
}

async function bootstrap() {
  seedData();
  loadState();
  bind();
  render();
  try {
    await initializeSupabase();
    if (!CONFIG.demoMode && !state.session) toast("Production Mode ต้องเข้าสู่ระบบเจ้าหน้าที่ก่อน", "error");
  } catch (error) {
    console.error(error);
    toast("เชื่อม Supabase ไม่สำเร็จ", "error");
  }
  render();
}

bootstrap();
