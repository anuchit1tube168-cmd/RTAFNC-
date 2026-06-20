const CONFIG = Object.freeze({
  supabaseUrl: window.RTAFNC_CONFIG?.supabaseUrl ?? "",
  supabasePublishableKey: window.RTAFNC_CONFIG?.supabasePublishableKey ?? "",
  liffId: window.RTAFNC_CONFIG?.liffId ?? "",
  lineOaId: window.RTAFNC_CONFIG?.lineOaId ?? "",
  demoMode: window.RTAFNC_CONFIG?.demoMode ?? true,
  defaultSemester: Number(window.RTAFNC_CONFIG?.defaultSemester ?? 1),
});

const GOOD_DEED_CATEGORIES = Object.freeze([
  { code: "GD01", icon: "🩸", name: "บริจาคโลหิต / เกล็ดเลือด / พลาสมา", description: "กิจกรรมบริจาคโลหิตและส่วนประกอบของโลหิต" },
  { code: "GD02", icon: "📜", name: "โครงการภายนอกที่ออกคำสั่งจาก วพอ.", description: "ปฏิบัติงานภายนอกตามคำสั่งของวิทยาลัย" },
  { code: "GD03", icon: "🏫", name: "ช่วยเหลืองานภายใน วพอ.", description: "สนับสนุนงานและกิจกรรมภายในวิทยาลัย" },
  { code: "GD04", icon: "🎓", name: "เข้ารับการอบรมต่าง ๆ ที่ วพอ. จัด", description: "อบรมหรือพัฒนาความรู้ตามที่วิทยาลัยจัด" },
  { code: "GD05", icon: "🤝", name: "ช่วยงานหน่วยงาน ชุมชน หรือมูลนิธิ", description: "กิจกรรมช่วยเหลือสังคมและหน่วยงานภายนอก" },
  { code: "GD06", icon: "🛕", name: "ทำนุบำรุงศาสนสถาน", description: "กิจกรรมดูแลหรือพัฒนาศาสนสถาน" },
  { code: "GD07", icon: "🧹", name: "งานฟรีทั่วไป", description: "งานอาสาทั่วไปที่ไม่รับค่าตอบแทน" },
  { code: "GD08", icon: "🇹🇭", name: "กิจกรรมแสดงความจงรักภักดีต่อสถาบันพระมหากษัตริย์", description: "กิจกรรมถวายความเคารพและแสดงความจงรักภักดี" },
]);

const DEMO_NEWS = Object.freeze([
  { id: "demo-news-1", title: "เปิดรับสมัครบริจาคโลหิต", body: "ลงทะเบียนผ่านหน้า LIFF และติดตามสถานะได้ในระบบ", published_at: new Date().toISOString(), priority: "high" },
  { id: "demo-news-2", title: "กิจกรรมจิตอาสาประจำเดือน", body: "นักเรียนสามารถบันทึกกิจกรรมและแนบหลักฐานได้จากเมนูความดี", published_at: new Date().toISOString(), priority: "normal" },
  { id: "demo-news-3", title: "กำหนดส่งเอกสารประจำชั้นปี", body: "ตรวจสอบเอกสารที่ต้องส่งเพิ่มเติมและกดยืนยันรับทราบ", published_at: new Date().toISOString(), priority: "normal" },
]);

const STORAGE_KEYS = Object.freeze({
  deeds: "rtafnc_demo_good_deeds",
  hospitals: "rtafnc_demo_hospital_visits",
  newsReads: "rtafnc_demo_news_reads",
  initialized: "rtafnc_demo_initialized_v2",
});

const GOOD_STATUS = Object.freeze({
  draft: "ฉบับร่าง",
  pending: "รออนุมัติ",
  approved: "อนุมัติแล้ว",
  returned: "ส่งกลับแก้ไข",
  rejected: "ไม่อนุมัติ",
});

const HOSPITAL_STATUS = Object.freeze({
  recorded: "บันทึกแล้ว",
  follow_up: "ติดตามอาการ",
  resolved: "สิ้นสุดการรักษา",
  cancelled: "ยกเลิก",
});

const state = {
  page: "home",
  supabase: null,
  session: null,
  lineProfile: null,
  lineIdToken: null,
  member: null,
  announcements: [...DEMO_NEWS],
  deeds: [],
  hospitals: [],
  readiness: { supabase: false, line: false, member: false },
  filters: {
    goodStatus: "all",
    goodCategory: "all",
    goodSearch: "",
    hospitalStatus: "all",
    hospitalSearch: "",
  },
};

const elements = {
  main: document.querySelector("#main"),
  memberName: document.querySelector("#memberName"),
  memberMeta: document.querySelector("#memberMeta"),
  memberStatus: document.querySelector("#memberStatus"),
  avatar: document.querySelector("#avatar"),
  goodHours: document.querySelector("#goodHours"),
  pendingCount: document.querySelector("#pendingCount"),
  hospitalCount: document.querySelector("#hospitalCount"),
  newsCount: document.querySelector("#newsCount"),
  connectionButton: document.querySelector("#connectionButton"),
  modal: document.querySelector("#modal"),
  modalTitle: document.querySelector("#modalTitle"),
  modalSubtitle: document.querySelector("#modalSubtitle"),
  modalBody: document.querySelector("#modalBody"),
  modalClose: document.querySelector("#modalClose"),
  toast: document.querySelector("#toast"),
};

function uuid() {
  return globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function demoSeed() {
  return {
    deeds: [
      {
        id: "demo-deed-approved",
        category_code: "GD01",
        category_name: GOOD_DEED_CATEGORIES[0].name,
        activity_date: addDaysISO(-14),
        activity_title: "บริจาคโลหิต ณ โรงพยาบาลภูมิพลอดุลยเดช",
        activity_location: "โรงพยาบาลภูมิพลอดุลยเดช",
        details: "ร่วมบริจาคโลหิตตามกิจกรรมจิตอาสาของวิทยาลัย",
        verifier_name: "เจ้าหน้าที่ธนาคารเลือด",
        requested_hours: 8,
        approved_hours: 8,
        status: "approved",
        attachment_names: ["blood-donation-demo.jpg"],
        created_at: new Date().toISOString(),
      },
      {
        id: "demo-deed-pending",
        category_code: "GD03",
        category_name: GOOD_DEED_CATEGORIES[2].name,
        activity_date: addDaysISO(-3),
        activity_title: "ช่วยจัดเตรียมห้องประชุมวิทยาลัย",
        activity_location: "อาคารเรียน วพอ.",
        details: "จัดโต๊ะ เก้าอี้ ระบบเสียง และตรวจความเรียบร้อยก่อนการประชุม",
        verifier_name: "อาจารย์ประจำชั้น",
        requested_hours: 6,
        status: "pending",
        attachment_names: ["meeting-room-demo.jpg"],
        created_at: new Date().toISOString(),
      },
    ],
    hospitals: [
      {
        id: "demo-hospital-follow-up",
        visit_date: addDaysISO(-2),
        hospital_name: "โรงพยาบาลภูมิพลอดุลยเดช",
        symptoms: "มีไข้ เจ็บคอ และอ่อนเพลีย",
        diagnosis: "ติดเชื้อทางเดินหายใจส่วนบน",
        treatment_note: "พักผ่อน ดื่มน้ำ และติดตามอาการ",
        medication_note: "ยาลดไข้และยาแก้แพ้ตามแพทย์สั่ง",
        medical_leave_days: 1,
        follow_up_date: addDaysISO(3),
        status: "follow_up",
        attachment_names: ["medical-certificate-demo.pdf"],
        created_at: new Date().toISOString(),
      },
    ],
  };
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

function initializeDemoData() {
  if (!CONFIG.demoMode) return;
  if (!localStorage.getItem(STORAGE_KEYS.initialized)) {
    const seed = demoSeed();
    writeLocal(STORAGE_KEYS.deeds, seed.deeds);
    writeLocal(STORAGE_KEYS.hospitals, seed.hospitals);
    writeLocal(STORAGE_KEYS.newsReads, []);
    localStorage.setItem(STORAGE_KEYS.initialized, "true");
  }
  state.deeds = readLocal(STORAGE_KEYS.deeds, []);
  state.hospitals = readLocal(STORAGE_KEYS.hospitals, []);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function normalizeText(value) {
  return String(value ?? "").trim().toLocaleLowerCase("th-TH");
}

function showToast(message, tone = "success") {
  elements.toast.textContent = message;
  elements.toast.dataset.tone = tone;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("show"), 3000);
}

function openModal(title, subtitle, body) {
  elements.modalTitle.textContent = title;
  elements.modalSubtitle.textContent = subtitle;
  elements.modalBody.innerHTML = body;
  elements.modal.classList.add("show");
  elements.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => elements.modalBody.querySelector("input,select,textarea,button")?.focus({ preventScroll: true }));
}

function closeModal() {
  elements.modal.classList.remove("show");
  elements.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  elements.modalBody.innerHTML = "";
}

function formatThaiDate(value) {
  if (!value) return "-";
  const raw = String(value);
  const date = new Date(raw.length === 10 ? `${raw}T00:00:00` : raw);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat("th-TH", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formatNumber(value) {
  return new Intl.NumberFormat("th-TH", { maximumFractionDigits: 1 }).format(Number(value || 0));
}

function safeFileName(name) {
  return String(name || "file").normalize("NFKC").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 120) || "file";
}

function goodStatusBadge(status) {
  const css = status === "approved" ? "approved" : status === "rejected" ? "rejected" : status === "returned" ? "returned" : status === "draft" ? "draft" : "pending";
  return `<span class="badge ${css}">${escapeHtml(GOOD_STATUS[status] ?? status)}</span>`;
}

function hospitalStatusBadge(status) {
  const css = status === "resolved" ? "approved" : status === "cancelled" ? "rejected" : status === "follow_up" ? "pending" : "draft";
  return `<span class="badge ${css}">${escapeHtml(HOSPITAL_STATUS[status] ?? status)}</span>`;
}

function calculateGoodHours() {
  return state.deeds
    .filter((item) => item.status === "approved")
    .reduce((sum, item) => sum + Number(item.approved_hours ?? 0), 0);
}

function updateSummary() {
  elements.goodHours.textContent = formatNumber(calculateGoodHours());
  elements.pendingCount.textContent = String(state.deeds.filter((item) => ["pending", "returned"].includes(item.status)).length);
  elements.hospitalCount.textContent = String(state.hospitals.filter((item) => item.status !== "cancelled").length);
  const reads = readLocal(STORAGE_KEYS.newsReads, []);
  elements.newsCount.textContent = String(state.announcements.filter((item) => !reads.includes(String(item.id))).length);
}

function setMemberDisplay() {
  elements.avatar.innerHTML = "67";
  if (state.member) {
    elements.memberName.textContent = state.member.display_name;
    elements.memberMeta.textContent = `${state.member.student_code} · รุ่น ${state.member.cohort ?? "-"} · ชั้นปี ${state.member.current_year ?? "-"}`;
    elements.memberStatus.textContent = "MEMBER";
    return;
  }
  if (state.lineProfile) {
    elements.memberName.textContent = state.lineProfile.displayName;
    elements.memberMeta.textContent = "LINE เชื่อมแล้ว · รอผูกทะเบียนนักเรียน";
    elements.memberStatus.textContent = "UNLINKED";
    if (state.lineProfile.pictureUrl) elements.avatar.innerHTML = `<img src="${escapeHtml(state.lineProfile.pictureUrl)}" alt="LINE profile">`;
    return;
  }
  elements.memberName.textContent = "นพอ.ตัวอย่าง ระบบทดสอบ";
  elements.memberMeta.textContent = "6700000 · รุ่น 67 · ชั้นปี 2 · ปีการศึกษา 2569";
  elements.memberStatus.textContent = "DEMO";
}

function followUpAlerts() {
  const today = todayISO();
  return state.hospitals
    .filter((item) => item.status === "follow_up" && item.follow_up_date && item.follow_up_date >= today)
    .sort((a, b) => String(a.follow_up_date).localeCompare(String(b.follow_up_date)))
    .slice(0, 3);
}

function renderHome() {
  const alerts = followUpAlerts();
  const returned = state.deeds.filter((item) => item.status === "returned");
  elements.main.innerHTML = `
    ${CONFIG.demoMode ? '<div class="demo-banner"><span>DEMO MODE</span> ข้อมูลที่กรอกเก็บในเครื่องนี้เท่านั้น ยังไม่ใช่ฐานข้อมูลจริง</div>' : ''}
    <section class="section">
      <div class="section-head"><div><p>บริการนักเรียน</p><h2>เลือกทำรายการ</h2></div></div>
      <div class="module-grid">
        <button class="module-card good" data-action="new-good" type="button"><span>⭐</span><strong>บันทึกความดี</strong><small>กรอกข้อมูล แนบไฟล์ บันทึกร่าง และส่งตรวจสอบ</small></button>
        <button class="module-card hospital" data-action="new-hospital" type="button"><span>🏥</span><strong>ไปโรงพยาบาล</strong><small>บันทึกอาการ การรักษา ยา ใบรับรอง และนัดติดตาม</small></button>
      </div>
    </section>
    ${(alerts.length || returned.length) ? `<section class="section"><div class="section-head"><div><p>ต้องดำเนินการ</p><h2>แจ้งเตือนของฉัน</h2></div></div><div class="alerts">${returned.map((item) => `<button class="alert-card warning" data-action="view-good" data-id="${item.id}" type="button"><strong>รายการถูกส่งกลับแก้ไข</strong><span>${escapeHtml(item.activity_title)}</span></button>`).join("")}${alerts.map((item) => `<button class="alert-card info" data-action="view-hospital" data-id="${item.id}" type="button"><strong>นัดติดตามอาการ ${escapeHtml(formatThaiDate(item.follow_up_date))}</strong><span>${escapeHtml(item.hospital_name)}</span></button>`).join("")}</div></section>` : ""}
    <section class="section">
      <div class="section-head"><div><p>ประชาสัมพันธ์</p><h2>ข่าวล่าสุด</h2></div><button class="button soft compact" data-action="page" data-page="news" type="button">ดูทั้งหมด</button></div>
      <div class="records">${state.announcements.slice(0, 3).map(newsCard).join("")}</div>
    </section>`;
}

function filteredDeeds() {
  const search = normalizeText(state.filters.goodSearch);
  return state.deeds.filter((item) => {
    const matchStatus = state.filters.goodStatus === "all" || item.status === state.filters.goodStatus;
    const matchCategory = state.filters.goodCategory === "all" || item.category_code === state.filters.goodCategory;
    const haystack = normalizeText(`${item.activity_title} ${item.activity_location} ${item.details} ${item.category_name}`);
    return matchStatus && matchCategory && (!search || haystack.includes(search));
  });
}

function renderGood() {
  const records = filteredDeeds();
  elements.main.innerHTML = `
    <section class="section">
      <div class="section-head"><div><p>GOOD DEEDS</p><h2>8 ประเภทความดี</h2></div><button class="button green" data-action="new-good" type="button">+ เพิ่มรายการ</button></div>
      <div class="category-grid">${GOOD_DEED_CATEGORIES.map((category, index) => `<button class="category-card" data-action="new-good" data-category="${category.code}" type="button"><i class="category-number">${index + 1}</i><span>${category.icon}</span><strong>${escapeHtml(category.name)}</strong><small>${escapeHtml(category.description)}</small></button>`).join("")}</div>
    </section>
    <section class="section">
      <div class="section-head"><div><p>ประวัติของฉัน</p><h2>รายการความดี</h2></div><strong class="result-count">${records.length} รายการ</strong></div>
      <div class="filters">
        <label class="search-box"><span>⌕</span><input data-filter="goodSearch" value="${escapeHtml(state.filters.goodSearch)}" placeholder="ค้นหาชื่อกิจกรรมหรือสถานที่"></label>
        <select data-filter="goodStatus"><option value="all">ทุกสถานะ</option>${Object.entries(GOOD_STATUS).map(([value, label]) => `<option value="${value}" ${state.filters.goodStatus === value ? "selected" : ""}>${label}</option>`).join("")}</select>
        <select data-filter="goodCategory"><option value="all">ทุกประเภท</option>${GOOD_DEED_CATEGORIES.map((item) => `<option value="${item.code}" ${state.filters.goodCategory === item.code ? "selected" : ""}>${item.code}</option>`).join("")}</select>
      </div>
      <div class="records">${records.length ? records.map(goodRecordCard).join("") : '<div class="empty-state"><strong>ไม่พบรายการ</strong><span>ลองเปลี่ยนตัวกรองหรือเพิ่มรายการใหม่</span></div>'}</div>
    </section>`;
}

function filteredHospitals() {
  const search = normalizeText(state.filters.hospitalSearch);
  return state.hospitals.filter((item) => {
    const matchStatus = state.filters.hospitalStatus === "all" || item.status === state.filters.hospitalStatus;
    const haystack = normalizeText(`${item.hospital_name} ${item.symptoms} ${item.diagnosis} ${item.treatment_note}`);
    return matchStatus && (!search || haystack.includes(search));
  });
}

function renderHospital() {
  const records = filteredHospitals();
  elements.main.innerHTML = `
    <section class="section">
      <div class="section-head"><div><p>HOSPITAL & HEALTH</p><h2>ข้อมูลไปโรงพยาบาล</h2></div><button class="button blue" data-action="new-hospital" type="button">+ บันทึก</button></div>
      <div class="notice privacy"><strong>🔒 ข้อมูลส่วนบุคคลด้านสุขภาพ</strong><span>แยกจากระบบความดี และระบบจริงเปิดให้เฉพาะเจ้าของข้อมูลกับเจ้าหน้าที่ทางการแพทย์ที่ได้รับสิทธิ์</span></div>
      <div class="filters two" style="margin-top:12px">
        <label class="search-box"><span>⌕</span><input data-filter="hospitalSearch" value="${escapeHtml(state.filters.hospitalSearch)}" placeholder="ค้นหาสถานพยาบาลหรืออาการ"></label>
        <select data-filter="hospitalStatus"><option value="all">ทุกสถานะ</option>${Object.entries(HOSPITAL_STATUS).map(([value, label]) => `<option value="${value}" ${state.filters.hospitalStatus === value ? "selected" : ""}>${label}</option>`).join("")}</select>
      </div>
      <div class="records">${records.length ? records.map(hospitalRecordCard).join("") : '<div class="empty-state"><strong>ยังไม่มีข้อมูลโรงพยาบาล</strong><span>กด “บันทึก” เพื่อเพิ่มรายการแรก</span></div>'}</div>
    </section>`;
}

function renderNews() {
  const reads = new Set(readLocal(STORAGE_KEYS.newsReads, []).map(String));
  elements.main.innerHTML = `<section class="section"><div class="section-head"><div><p>NEWS CENTER</p><h2>ข่าวประชาสัมพันธ์</h2></div><button class="button soft compact" data-action="mark-all-news" type="button">อ่านทั้งหมด</button></div><div class="records">${state.announcements.map((item) => newsCard(item, reads.has(String(item.id)))).join("")}</div></section>`;
}

function renderProfile() {
  const supabaseStatus = state.readiness.supabase ? "เชื่อมและมี Session แล้ว" : "ยังไม่เชื่อม";
  const lineStatus = state.readiness.line ? `เชื่อมแล้ว: ${escapeHtml(state.lineProfile?.displayName ?? "LINE")}` : "ยังไม่เชื่อม";
  const memberStatus = state.readiness.member ? "ยืนยันสมาชิกแล้ว" : "ยังไม่ยืนยันสมาชิก";
  elements.main.innerHTML = `
    <section class="section">
      <div class="section-head"><div><p>ACCOUNT & READINESS</p><h2>บัญชีของฉัน</h2></div></div>
      <div class="readiness-grid">
        ${readinessCard("LINE LIFF", state.readiness.line, lineStatus)}
        ${readinessCard("Supabase", state.readiness.supabase, supabaseStatus)}
        ${readinessCard("ทะเบียนนักเรียน", state.readiness.member, memberStatus)}
        ${readinessCard("Private Storage", state.readiness.member && !CONFIG.demoMode, CONFIG.demoMode ? "ปิดไว้ใน Demo Mode" : "ใช้ Bucket แบบ Private")}
        ${readinessCard("Production Security", !CONFIG.demoMode && state.readiness.member, CONFIG.demoMode ? "ยังไม่เปิดระบบจริง" : "กำลังใช้ RLS และ Server verification")}
      </div>
      <div class="notice" style="margin-top:12px">LINE Profile ใช้แสดงผลเท่านั้น การยืนยันตัวจริงต้องตรวจ ID Token ผ่าน Edge Function ฝั่ง Server</div>
      <div class="profile-actions">
        ${!CONFIG.demoMode && !state.readiness.member ? '<button class="button green" data-action="activation" type="button">ผูกทะเบียนนักเรียน</button>' : ''}
        <button class="button soft" data-action="export-demo" type="button">ส่งออกข้อมูล JSON</button>
        <button class="button soft" data-action="print-summary" type="button">พิมพ์สรุป</button>
        ${CONFIG.demoMode ? '<button class="button red" data-action="reset-demo" type="button">คืนค่าข้อมูลสาธิต</button>' : ''}
      </div>
    </section>`;
}

function readinessCard(title, ok, detail) {
  return `<article class="readiness-card ${ok ? "ready" : "waiting"}"><span>${ok ? "✓" : "…"}</span><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(detail)}</p></div></article>`;
}

function goodRecordCard(item) {
  const category = GOOD_DEED_CATEGORIES.find((entry) => entry.code === item.category_code);
  return `<button class="record-card clickable" data-action="view-good" data-id="${escapeHtml(item.id)}" type="button"><div class="record-title"><span class="record-icon">${category?.icon ?? "⭐"}</span><div><h3>${escapeHtml(item.activity_title)}</h3><p>${escapeHtml(item.category_name ?? category?.name ?? item.category_code)}</p></div></div><div class="record-meta"><span>${escapeHtml(formatThaiDate(item.activity_date))}</span><span>${formatNumber(item.approved_hours ?? item.requested_hours)} ชม.</span></div><div class="record-footer"><span>${escapeHtml(item.activity_location || "ไม่ระบุสถานที่")}</span>${goodStatusBadge(item.status)}</div></button>`;
}

function hospitalRecordCard(item) {
  return `<button class="record-card clickable" data-action="view-hospital" data-id="${escapeHtml(item.id)}" type="button"><div class="record-title"><span class="record-icon blue">🏥</span><div><h3>${escapeHtml(item.hospital_name)}</h3><p>${escapeHtml(item.symptoms)}</p></div></div><div class="record-meta"><span>${escapeHtml(formatThaiDate(item.visit_date))}</span>${item.follow_up_date ? `<span>นัด ${escapeHtml(formatThaiDate(item.follow_up_date))}</span>` : ""}</div><div class="record-footer"><span>${escapeHtml(item.diagnosis || "ยังไม่ระบุการวินิจฉัย")}</span>${hospitalStatusBadge(item.status)}</div></button>`;
}

function newsCard(item, forcedRead = null) {
  const reads = readLocal(STORAGE_KEYS.newsReads, []).map(String);
  const isRead = forcedRead ?? reads.includes(String(item.id));
  return `<button class="record-card clickable news-card ${isRead ? "read" : "unread"}" data-action="read-news" data-news-id="${escapeHtml(item.id)}" type="button"><div class="record-title"><span class="record-icon gold">📣</span><div><h3>${escapeHtml(item.title)}${!isRead ? '<i class="new-dot">ใหม่</i>' : ""}</h3><p>${escapeHtml(item.body)}</p></div></div><div class="record-meta"><span>${escapeHtml(formatThaiDate(item.published_at))}</span><span>${isRead ? "อ่านแล้ว" : "แตะเพื่ออ่าน"}</span></div></button>`;
}

function fieldError(name) {
  return `<small class="field-error" data-error-for="${name}"></small>`;
}

function openGoodForm(categoryCode = "GD01", existingId = null) {
  const existing = existingId ? state.deeds.find((item) => item.id === existingId) : null;
  const selected = GOOD_DEED_CATEGORIES.find((item) => item.code === (existing?.category_code ?? categoryCode)) ?? GOOD_DEED_CATEGORIES[0];
  const attachmentNames = existing?.attachment_names ?? [];
  openModal(existing ? "แก้ไขบันทึกความดี" : "บันทึกความดี", "กรอกข้อมูลให้ครบ สามารถบันทึกร่างก่อนส่งตรวจสอบ", `
    <form id="goodForm" class="form" novalidate data-record-id="${escapeHtml(existingId || "")}">
      <div class="form-progress"><span class="active">1</span><i></i><span>2</span><i></i><span>3</span></div>
      <label class="field">ประเภทความดี <b>*</b><select name="category_code">${GOOD_DEED_CATEGORIES.map((item) => `<option value="${item.code}" ${item.code === selected.code ? "selected" : ""}>${item.code} — ${escapeHtml(item.name)}</option>`).join("")}</select>${fieldError("category_code")}</label>
      <div class="form-grid two">
        <label class="field">วันที่ทำกิจกรรม <b>*</b><input name="activity_date" type="date" max="${todayISO()}" value="${escapeHtml(existing?.activity_date ?? todayISO())}">${fieldError("activity_date")}</label>
        <label class="field">จำนวนชั่วโมง <b>*</b><input name="requested_hours" type="number" inputmode="decimal" min="0.5" max="24" step="0.5" value="${escapeHtml(existing?.requested_hours ?? "")}" placeholder="เช่น 2.5">${fieldError("requested_hours")}</label>
      </div>
      <div class="hour-chips">${[1,2,3,4,6,8].map((hour) => `<button type="button" data-hour="${hour}">${hour} ชม.</button>`).join("")}</div>
      <label class="field">ชื่อกิจกรรม <b>*</b><input name="activity_title" maxlength="200" value="${escapeHtml(existing?.activity_title ?? "")}" placeholder="ระบุชื่อกิจกรรมให้ชัดเจน">${fieldError("activity_title")}</label>
      <label class="field">สถานที่<input name="activity_location" maxlength="200" value="${escapeHtml(existing?.activity_location ?? "")}" placeholder="เช่น โรงพยาบาลภูมิพลอดุลยเดช"></label>
      <label class="field">รายละเอียด <b>*</b><textarea name="details" rows="4" maxlength="2000" placeholder="อธิบายหน้าที่ สิ่งที่ทำ และผลลัพธ์">${escapeHtml(existing?.details ?? "")}</textarea><span class="counter"><i data-counter="details">0</i>/2000</span>${fieldError("details")}</label>
      <div class="form-grid two">
        <label class="field">ผู้รับรอง<input name="verifier_name" maxlength="200" value="${escapeHtml(existing?.verifier_name ?? "")}" placeholder="ชื่ออาจารย์หรือเจ้าหน้าที่"></label>
        <label class="field">หน่วยงาน<input name="verifier_organization" maxlength="200" value="${escapeHtml(existing?.verifier_organization ?? "")}" placeholder="ชื่อหน่วยงาน"></label>
      </div>
      <label class="field file-field">หลักฐานรูปภาพหรือ PDF<input name="attachments" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple><span>รองรับ JPG, PNG, WebP, PDF ไม่เกิน 10 MB/ไฟล์</span>${fieldError("attachments")}</label>
      <div id="filePreview" class="file-preview">${attachmentNames.map((name) => `<span>📎 ${escapeHtml(name)}</span>`).join("")}</div>
      <label class="check-field"><input name="confirm" type="checkbox" ${existing ? "checked" : ""}><span>ข้าพเจ้ารับรองว่าข้อมูลถูกต้องและยินยอมให้เจ้าหน้าที่ตรวจสอบ</span></label>${fieldError("confirm")}
      <div class="form-actions sticky-actions"><button class="button soft" type="submit" value="draft">บันทึกร่าง</button><button class="button green" type="submit" value="submit">ส่งตรวจสอบ</button></div>
    </form>`);
  bindGoodForm();
}

function bindGoodForm() {
  const form = document.querySelector("#goodForm");
  form.addEventListener("submit", submitGoodForm);
  form.querySelectorAll("[data-hour]").forEach((button) => button.addEventListener("click", () => {
    form.elements.requested_hours.value = button.dataset.hour;
    form.elements.requested_hours.dispatchEvent(new Event("input", { bubbles: true }));
  }));
  form.elements.attachments.addEventListener("change", () => previewFiles(form.elements.attachments.files));
  form.elements.details.addEventListener("input", updateCounters);
  form.querySelectorAll("input,select,textarea").forEach((field) => field.addEventListener("input", () => clearFieldError(field.name)));
  updateCounters();
}

function openHospitalForm(existingId = null) {
  const existing = existingId ? state.hospitals.find((item) => item.id === existingId) : null;
  const attachmentNames = existing?.attachment_names ?? [];
  openModal(existing ? "แก้ไขข้อมูลโรงพยาบาล" : "บันทึกการไปโรงพยาบาล", "ข้อมูลสุขภาพแยกจากระบบความดีและจำกัดสิทธิ์การเข้าถึง", `
    <form id="hospitalForm" class="form" novalidate data-record-id="${escapeHtml(existingId || "")}">
      <div class="privacy-strip">🔒 ข้อมูลนี้เป็นข้อมูลสุขภาพส่วนบุคคล</div>
      <div class="form-grid two">
        <label class="field">วันที่ไปโรงพยาบาล <b>*</b><input name="visit_date" type="date" max="${todayISO()}" value="${escapeHtml(existing?.visit_date ?? todayISO())}">${fieldError("visit_date")}</label>
        <label class="field">สถานพยาบาล <b>*</b><input name="hospital_name" maxlength="200" value="${escapeHtml(existing?.hospital_name ?? "")}" placeholder="ชื่อโรงพยาบาลหรือคลินิก">${fieldError("hospital_name")}</label>
      </div>
      <label class="field">อาการสำคัญ <b>*</b><textarea name="symptoms" rows="3" maxlength="2000" placeholder="ระบุอาการ ระยะเวลา และความรุนแรง">${escapeHtml(existing?.symptoms ?? "")}</textarea><span class="counter"><i data-counter="symptoms">0</i>/2000</span>${fieldError("symptoms")}</label>
      <label class="field">การวินิจฉัย<input name="diagnosis" maxlength="500" value="${escapeHtml(existing?.diagnosis ?? "")}" placeholder="ตามใบรับรองแพทย์หรือคำแนะนำแพทย์"></label>
      <label class="field">การรักษา<textarea name="treatment_note" rows="3" maxlength="2000" placeholder="การรักษา หัตถการ หรือคำแนะนำ">${escapeHtml(existing?.treatment_note ?? "")}</textarea><span class="counter"><i data-counter="treatment_note">0</i>/2000</span></label>
      <label class="field">ยา<textarea name="medication_note" rows="3" maxlength="2000" placeholder="ชื่อยา วิธีใช้ หรือข้อควรระวัง">${escapeHtml(existing?.medication_note ?? "")}</textarea><span class="counter"><i data-counter="medication_note">0</i>/2000</span></label>
      <div class="form-grid two">
        <label class="field">จำนวนวันลาป่วย<input name="medical_leave_days" type="number" inputmode="decimal" min="0" max="365" step="0.5" value="${escapeHtml(existing?.medical_leave_days ?? 0)}"></label>
        <label class="field">วันติดตามอาการ<input name="follow_up_date" type="date" min="${escapeHtml(existing?.visit_date ?? todayISO())}" value="${escapeHtml(existing?.follow_up_date ?? "")}"></label>
      </div>
      <label class="field">สถานะ<select name="status">${Object.entries(HOSPITAL_STATUS).filter(([value]) => value !== "cancelled").map(([value, label]) => `<option value="${value}" ${(existing?.status ?? "recorded") === value ? "selected" : ""}>${label}</option>`).join("")}</select></label>
      <label class="field file-field">ใบรับรองแพทย์หรือเอกสาร<input name="attachments" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple><span>รองรับ JPG, PNG, WebP, PDF ไม่เกิน 10 MB/ไฟล์</span>${fieldError("attachments")}</label>
      <div id="filePreview" class="file-preview">${attachmentNames.map((name) => `<span>📎 ${escapeHtml(name)}</span>`).join("")}</div>
      <label class="check-field"><input name="privacy_confirm" type="checkbox" ${existing ? "checked" : ""}><span>ยืนยันว่าข้อมูลเป็นของข้าพเจ้าและอนุญาตให้เจ้าหน้าที่ทางการแพทย์ตรวจสอบ</span></label>${fieldError("privacy_confirm")}
      <div class="form-actions sticky-actions"><button class="button soft" type="button" data-action="close-modal">ยกเลิก</button><button class="button blue" type="submit">บันทึกข้อมูลสุขภาพ</button></div>
    </form>`);
  bindHospitalForm();
}

function bindHospitalForm() {
  const form = document.querySelector("#hospitalForm");
  form.addEventListener("submit", submitHospitalForm);
  form.elements.attachments.addEventListener("change", () => previewFiles(form.elements.attachments.files));
  form.elements.visit_date.addEventListener("change", () => { form.elements.follow_up_date.min = form.elements.visit_date.value || todayISO(); });
  form.querySelectorAll("textarea").forEach((field) => field.addEventListener("input", updateCounters));
  form.querySelectorAll("input,select,textarea").forEach((field) => field.addEventListener("input", () => clearFieldError(field.name)));
  updateCounters();
}

function updateCounters() {
  document.querySelectorAll("[data-counter]").forEach((counter) => {
    const field = document.querySelector(`[name="${counter.dataset.counter}"]`);
    if (field) counter.textContent = String(field.value.length);
  });
}

function previewFiles(fileList) {
  const preview = document.querySelector("#filePreview");
  if (!preview) return;
  const files = [...fileList];
  try {
    validateFiles(files);
    preview.innerHTML = files.length ? files.map((file) => `<span>📎 ${escapeHtml(file.name)} <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small></span>`).join("") : "";
    clearFieldError("attachments");
  } catch (error) {
    setFieldError("attachments", error.message);
    preview.innerHTML = "";
  }
}

function setFieldError(name, message) {
  const target = document.querySelector(`[data-error-for="${name}"]`);
  const field = document.querySelector(`[name="${name}"]`);
  if (target) target.textContent = message;
  if (field) field.classList.add("invalid");
}

function clearFieldError(name) {
  const target = document.querySelector(`[data-error-for="${name}"]`);
  const field = document.querySelector(`[name="${name}"]`);
  if (target) target.textContent = "";
  if (field) field.classList.remove("invalid");
}

function clearAllErrors(form) {
  form.querySelectorAll(".field-error").forEach((item) => { item.textContent = ""; });
  form.querySelectorAll(".invalid").forEach((item) => item.classList.remove("invalid"));
}

function validateGoodForm(form, intent) {
  clearAllErrors(form);
  const data = new FormData(form);
  const errors = {};
  const hours = Number(data.get("requested_hours"));
  if (!data.get("category_code")) errors.category_code = "กรุณาเลือกประเภทความดี";
  if (!data.get("activity_date")) errors.activity_date = "กรุณาระบุวันที่";
  if (!String(data.get("activity_title") || "").trim()) errors.activity_title = "กรุณาระบุชื่อกิจกรรม";
  if (intent === "submit") {
    if (!Number.isFinite(hours) || hours < 0.5 || hours > 24) errors.requested_hours = "จำนวนชั่วโมงต้องอยู่ระหว่าง 0.5–24 ชั่วโมง";
    if (String(data.get("details") || "").trim().length < 10) errors.details = "กรุณาระบุรายละเอียดอย่างน้อย 10 ตัวอักษร";
    if (!form.elements.confirm.checked) errors.confirm = "กรุณายืนยันความถูกต้องของข้อมูล";
  }
  Object.entries(errors).forEach(([name, message]) => setFieldError(name, message));
  if (Object.keys(errors).length) form.querySelector(".invalid")?.focus();
  return { valid: !Object.keys(errors).length, data };
}

function validateHospitalForm(form) {
  clearAllErrors(form);
  const data = new FormData(form);
  const errors = {};
  if (!data.get("visit_date")) errors.visit_date = "กรุณาระบุวันที่ไปโรงพยาบาล";
  if (!String(data.get("hospital_name") || "").trim()) errors.hospital_name = "กรุณาระบุสถานพยาบาล";
  if (String(data.get("symptoms") || "").trim().length < 3) errors.symptoms = "กรุณาระบุอาการ";
  if (!form.elements.privacy_confirm.checked) errors.privacy_confirm = "กรุณายืนยันการบันทึกข้อมูลสุขภาพ";
  if (data.get("follow_up_date") && data.get("follow_up_date") < data.get("visit_date")) errors.follow_up_date = "วันติดตามต้องไม่ก่อนวันที่ไปโรงพยาบาล";
  Object.entries(errors).forEach(([name, message]) => setFieldError(name, message));
  if (Object.keys(errors).length) form.querySelector(".invalid")?.focus();
  return { valid: !Object.keys(errors).length, data };
}

function validateFiles(files) {
  const allowed = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
  const maxBytes = 10 * 1024 * 1024;
  if (files.length > 8) throw new Error("แนบไฟล์ได้ไม่เกิน 8 ไฟล์ต่อรายการ");
  for (const file of files) {
    if (!allowed.has(file.type)) throw new Error(`ชนิดไฟล์ ${file.name} ไม่ได้รับอนุญาต`);
    if (file.size > maxBytes) throw new Error(`${file.name} มีขนาดเกิน 10 MB`);
  }
}

function setSubmitting(form, isSubmitting, text = "กำลังบันทึก…") {
  form.querySelectorAll("button").forEach((button) => { button.disabled = isSubmitting; });
  const primary = form.querySelector("button[type='submit']:last-child");
  if (!primary) return;
  if (isSubmitting) {
    primary.dataset.originalText = primary.textContent;
    primary.textContent = text;
  } else if (primary.dataset.originalText) {
    primary.textContent = primary.dataset.originalText;
  }
}

async function uploadAttachments({ bucket, referenceId, moduleType, documentType, files }) {
  if (!files.length) return [];
  if (!state.supabase || !state.member || !state.session) throw new Error("ยังไม่มี Session สำหรับอัปโหลดไฟล์");
  const uploaded = [];
  for (const file of files) {
    const objectPath = `${state.member.id}/${referenceId}/${uuid()}-${safeFileName(file.name)}`;
    const { error: uploadError } = await state.supabase.storage.from(bucket).upload(objectPath, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (uploadError) throw uploadError;
    const metadata = { owner_student_id: state.member.id, module_type: moduleType, reference_id: referenceId, document_type: documentType, title: file.name, storage_bucket: bucket, storage_path: objectPath, file_name: file.name, mime_type: file.type, file_size: file.size, status: "pending", created_by: state.session.user.id };
    const { error: documentError } = await state.supabase.from("documents").insert(metadata);
    if (documentError) throw documentError;
    uploaded.push(objectPath);
  }
  return uploaded;
}

async function submitGoodForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const intent = event.submitter?.value === "draft" ? "draft" : "submit";
  const validation = validateGoodForm(form, intent);
  if (!validation.valid) { showToast("กรุณาตรวจข้อมูลที่กรอก", "error"); return; }
  const data = validation.data;
  const files = data.getAll("attachments").filter((item) => item instanceof File && item.size > 0);
  const recordId = form.dataset.recordId || uuid();
  try {
    validateFiles(files);
    setSubmitting(form, true, intent === "draft" ? "กำลังบันทึกร่าง…" : "กำลังส่ง…");
    const category = GOOD_DEED_CATEGORIES.find((item) => item.code === data.get("category_code"));
    if (!category) throw new Error("ไม่พบประเภทความดี");
    const existing = state.deeds.find((item) => item.id === recordId);
    const attachmentNames = files.length ? files.map((file) => file.name) : (existing?.attachment_names ?? []);
    const localRecord = {
      ...existing,
      id: recordId,
      category_code: category.code,
      category_name: category.name,
      activity_date: data.get("activity_date"),
      activity_title: String(data.get("activity_title") || "").trim(),
      activity_location: String(data.get("activity_location") || "").trim(),
      details: String(data.get("details") || "").trim(),
      verifier_name: String(data.get("verifier_name") || "").trim(),
      verifier_organization: String(data.get("verifier_organization") || "").trim(),
      requested_hours: Number(data.get("requested_hours") || 0),
      status: intent === "draft" ? "draft" : "pending",
      attachment_names: attachmentNames,
      updated_at: new Date().toISOString(),
      created_at: existing?.created_at ?? new Date().toISOString(),
    };
    if (CONFIG.demoMode) {
      state.deeds = [localRecord, ...state.deeds.filter((item) => item.id !== recordId)];
      writeLocal(STORAGE_KEYS.deeds, state.deeds);
    } else {
      requireProductionMember();
      const payload = {
        id: recordId,
        student_id: state.member.id,
        category_code: category.code,
        activity_date: localRecord.activity_date,
        activity_title: localRecord.activity_title,
        activity_location: localRecord.activity_location || null,
        details: localRecord.details || null,
        verifier_name: [localRecord.verifier_name, localRecord.verifier_organization].filter(Boolean).join(" · ") || null,
        requested_hours: localRecord.requested_hours,
        academic_year: state.member.academic_year,
        semester: CONFIG.defaultSemester,
        status: localRecord.status,
      };
      const { error } = existing
        ? await state.supabase.from("good_deed_records").update(payload).eq("id", recordId)
        : await state.supabase.from("good_deed_records").insert(payload);
      if (error) throw error;
      await uploadAttachments({ bucket: "good-deed-files", referenceId: recordId, moduleType: "good_deed", documentType: "good_deed_evidence", files });
      await loadPrivateData();
    }
    closeModal();
    state.page = "good";
    render();
    showToast(intent === "draft" ? "บันทึกร่างแล้ว" : "ส่งบันทึกความดีเพื่อตรวจสอบแล้ว");
  } catch (error) {
    console.error(error);
    showToast(error.message || "ส่งข้อมูลไม่สำเร็จ", "error");
    setSubmitting(form, false);
  }
}

async function submitHospitalForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const validation = validateHospitalForm(form);
  if (!validation.valid) { showToast("กรุณาตรวจข้อมูลสุขภาพที่กรอก", "error"); return; }
  const data = validation.data;
  const files = data.getAll("attachments").filter((item) => item instanceof File && item.size > 0);
  const recordId = form.dataset.recordId || uuid();
  try {
    validateFiles(files);
    setSubmitting(form, true);
    const existing = state.hospitals.find((item) => item.id === recordId);
    const attachmentNames = files.length ? files.map((file) => file.name) : (existing?.attachment_names ?? []);
    const localRecord = {
      ...existing,
      id: recordId,
      visit_date: data.get("visit_date"),
      hospital_name: String(data.get("hospital_name") || "").trim(),
      symptoms: String(data.get("symptoms") || "").trim(),
      diagnosis: String(data.get("diagnosis") || "").trim(),
      treatment_note: String(data.get("treatment_note") || "").trim(),
      medication_note: String(data.get("medication_note") || "").trim(),
      medical_leave_days: Number(data.get("medical_leave_days") || 0),
      follow_up_date: data.get("follow_up_date") || null,
      status: data.get("follow_up_date") && data.get("status") === "recorded" ? "follow_up" : data.get("status"),
      attachment_names: attachmentNames,
      updated_at: new Date().toISOString(),
      created_at: existing?.created_at ?? new Date().toISOString(),
    };
    if (CONFIG.demoMode) {
      state.hospitals = [localRecord, ...state.hospitals.filter((item) => item.id !== recordId)];
      writeLocal(STORAGE_KEYS.hospitals, state.hospitals);
    } else {
      requireProductionMember();
      const payload = {
        id: recordId,
        student_id: state.member.id,
        visit_date: localRecord.visit_date,
        hospital_name: localRecord.hospital_name,
        symptoms: localRecord.symptoms,
        diagnosis: localRecord.diagnosis || null,
        treatment_note: localRecord.treatment_note || null,
        medication_note: localRecord.medication_note || null,
        medical_leave_days: localRecord.medical_leave_days,
        follow_up_date: localRecord.follow_up_date,
        status: localRecord.status,
        academic_year: state.member.academic_year,
        semester: CONFIG.defaultSemester,
        created_by: state.session.user.id,
      };
      const { error } = existing
        ? await state.supabase.from("hospital_visits").update(payload).eq("id", recordId)
        : await state.supabase.from("hospital_visits").insert(payload);
      if (error) throw error;
      await uploadAttachments({ bucket: "hospital-files", referenceId: recordId, moduleType: "hospital", documentType: "medical_document", files });
      await loadPrivateData();
    }
    closeModal();
    state.page = "hospital";
    render();
    showToast("บันทึกข้อมูลโรงพยาบาลแล้ว");
  } catch (error) {
    console.error(error);
    showToast(error.message || "บันทึกข้อมูลไม่สำเร็จ", "error");
    setSubmitting(form, false);
  }
}

function detailRow(label, value) {
  return `<div class="detail-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "-")}</strong></div>`;
}

function viewGood(id) {
  const item = state.deeds.find((record) => record.id === id);
  if (!item) return;
  const editable = CONFIG.demoMode || ["draft", "returned"].includes(item.status);
  openModal("รายละเอียดความดี", item.category_name || item.category_code, `
    <div class="detail-status">${goodStatusBadge(item.status)}</div>
    <div class="detail-grid">
      ${detailRow("วันที่", formatThaiDate(item.activity_date))}
      ${detailRow("ชั่วโมงที่ขอ", `${formatNumber(item.requested_hours)} ชั่วโมง`)}
      ${detailRow("ชั่วโมงอนุมัติ", item.approved_hours != null ? `${formatNumber(item.approved_hours)} ชั่วโมง` : "รอตรวจสอบ")}
      ${detailRow("กิจกรรม", item.activity_title)}
      ${detailRow("สถานที่", item.activity_location)}
      ${detailRow("รายละเอียด", item.details)}
      ${detailRow("ผู้รับรอง", [item.verifier_name, item.verifier_organization].filter(Boolean).join(" · "))}
      ${detailRow("หลักฐาน", (item.attachment_names || []).join(", ") || "ไม่มีไฟล์")}
      ${item.reviewer_note ? detailRow("หมายเหตุผู้ตรวจ", item.reviewer_note) : ""}
    </div>
    <div class="form-actions">${editable ? `<button class="button soft" data-action="edit-good" data-id="${item.id}" type="button">แก้ไข</button><button class="button red" data-action="delete-good" data-id="${item.id}" type="button">ลบ</button>` : ""}<button class="button green" data-action="duplicate-good" data-id="${item.id}" type="button">คัดลอกรายการ</button></div>`);
}

function viewHospital(id) {
  const item = state.hospitals.find((record) => record.id === id);
  if (!item) return;
  openModal("รายละเอียดการไปโรงพยาบาล", "ข้อมูลสุขภาพส่วนบุคคล", `
    <div class="detail-status">${hospitalStatusBadge(item.status)}</div>
    <div class="detail-grid">
      ${detailRow("วันที่", formatThaiDate(item.visit_date))}
      ${detailRow("สถานพยาบาล", item.hospital_name)}
      ${detailRow("อาการ", item.symptoms)}
      ${detailRow("การวินิจฉัย", item.diagnosis)}
      ${detailRow("การรักษา", item.treatment_note)}
      ${detailRow("ยา", item.medication_note)}
      ${detailRow("วันลาป่วย", `${formatNumber(item.medical_leave_days)} วัน`)}
      ${detailRow("นัดติดตาม", formatThaiDate(item.follow_up_date))}
      ${detailRow("เอกสาร", (item.attachment_names || []).join(", ") || "ไม่มีไฟล์")}
    </div>
    <div class="form-actions"><button class="button soft" data-action="edit-hospital" data-id="${item.id}" type="button">แก้ไข</button>${item.status !== "resolved" ? `<button class="button green" data-action="resolve-hospital" data-id="${item.id}" type="button">สิ้นสุดการรักษา</button>` : ""}<button class="button red" data-action="delete-hospital" data-id="${item.id}" type="button">ลบ</button></div>`);
}

async function deleteGood(id) {
  if (!window.confirm("ยืนยันลบรายการความดีนี้หรือไม่?")) return;
  try {
    if (CONFIG.demoMode) {
      state.deeds = state.deeds.filter((item) => item.id !== id);
      writeLocal(STORAGE_KEYS.deeds, state.deeds);
    } else {
      requireProductionMember();
      const { error } = await state.supabase.from("good_deed_records").delete().eq("id", id).in("status", ["draft", "returned"]);
      if (error) throw error;
      await loadPrivateData();
    }
    closeModal(); render(); showToast("ลบรายการแล้ว");
  } catch (error) { showToast(error.message || "ลบรายการไม่สำเร็จ", "error"); }
}

async function deleteHospital(id) {
  if (!window.confirm("ยืนยันลบข้อมูลโรงพยาบาลนี้หรือไม่?")) return;
  try {
    if (CONFIG.demoMode) {
      state.hospitals = state.hospitals.filter((item) => item.id !== id);
      writeLocal(STORAGE_KEYS.hospitals, state.hospitals);
    } else {
      requireProductionMember();
      const { error } = await state.supabase.from("hospital_visits").delete().eq("id", id);
      if (error) throw error;
      await loadPrivateData();
    }
    closeModal(); render(); showToast("ลบข้อมูลโรงพยาบาลแล้ว");
  } catch (error) { showToast(error.message || "ลบข้อมูลไม่สำเร็จ", "error"); }
}

function duplicateGood(id) {
  const source = state.deeds.find((item) => item.id === id);
  if (!source) return;
  const copy = { ...source, id: uuid(), status: "draft", approved_hours: null, reviewer_note: null, activity_title: `${source.activity_title} (สำเนา)`, created_at: new Date().toISOString() };
  state.deeds.unshift(copy);
  if (CONFIG.demoMode) writeLocal(STORAGE_KEYS.deeds, state.deeds);
  closeModal(); render(); showToast("สร้างสำเนาเป็นฉบับร่างแล้ว");
}

async function resolveHospital(id) {
  try {
    if (CONFIG.demoMode) {
      state.hospitals = state.hospitals.map((item) => item.id === id ? { ...item, status: "resolved", follow_up_date: null, updated_at: new Date().toISOString() } : item);
      writeLocal(STORAGE_KEYS.hospitals, state.hospitals);
    } else {
      requireProductionMember();
      const { error } = await state.supabase.from("hospital_visits").update({ status: "resolved", follow_up_date: null }).eq("id", id);
      if (error) throw error;
      await loadPrivateData();
    }
    closeModal(); render(); showToast("อัปเดตเป็นสิ้นสุดการรักษาแล้ว");
  } catch (error) { showToast(error.message || "อัปเดตไม่สำเร็จ", "error"); }
}

function requireProductionMember() {
  if (!state.supabase || !state.session) throw new Error("ยังไม่ได้เชื่อม Supabase Session");
  if (!state.member) throw new Error("ยังไม่ได้ยืนยันสมาชิกนักเรียน");
}

function markNewsRead(newsId) {
  const reads = new Set(readLocal(STORAGE_KEYS.newsReads, []).map(String));
  reads.add(String(newsId));
  writeLocal(STORAGE_KEYS.newsReads, [...reads]);
  const news = state.announcements.find((item) => String(item.id) === String(newsId));
  if (news) {
    openModal(news.title, formatThaiDate(news.published_at), `<article class="news-detail"><div class="news-hero">📣</div><p>${escapeHtml(news.body)}</p><button class="button green full" data-action="close-modal" type="button">รับทราบ</button></article>`);
  }
  updateSummary();
  if (state.page === "news") renderNews();
}

function markAllNewsRead() {
  writeLocal(STORAGE_KEYS.newsReads, state.announcements.map((item) => String(item.id)));
  render(); updateSummary(); showToast("ทำเครื่องหมายอ่านข่าวทั้งหมดแล้ว");
}

async function initializeSupabase() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabasePublishableKey || !window.supabase) return;
  state.supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabasePublishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  let { data: sessionData } = await state.supabase.auth.getSession();
  if (!sessionData.session) {
    const { data, error } = await state.supabase.auth.signInAnonymously();
    if (error) throw error;
    sessionData = data;
  }
  state.session = sessionData.session;
  state.readiness.supabase = Boolean(state.session);
  const { data, error } = await state.supabase.from("announcements").select("id,title,body,published_at").eq("is_published", true).eq("target_type", "all").order("published_at", { ascending: false }).limit(20);
  if (!error && data?.length) state.announcements = data;
}

async function initializeLiff() {
  if (!CONFIG.liffId || !window.liff) return;
  await window.liff.init({ liffId: CONFIG.liffId });
  if (!window.liff.isLoggedIn()) { window.liff.login({ redirectUri: window.location.href }); return; }
  state.lineProfile = await window.liff.getProfile();
  state.lineIdToken = window.liff.getIDToken();
  state.readiness.line = Boolean(state.lineIdToken);
}

async function authenticateMember(activationCode = null) {
  if (CONFIG.demoMode || !state.supabase || !state.session || !state.lineIdToken) return;
  const { data, error } = await state.supabase.functions.invoke("line-auth", { body: { idToken: state.lineIdToken, activationCode } });
  if (error) {
    let code = "line_auth_failed";
    try { code = (await error.context?.json?.())?.error ?? code; } catch {}
    if (code === "activation_required") { openActivationForm(); return; }
    throw new Error(code);
  }
  if (!data?.member) throw new Error("member_not_returned");
  state.member = data.member;
  state.readiness.member = true;
  await loadPrivateData();
}

function openActivationForm() {
  openModal("เปิดใช้งานสมาชิก", "กรอกรหัสเปิดใช้งานครั้งเดียวที่ได้รับจากเจ้าหน้าที่", `<form id="activationForm" class="form"><label class="field">Activation Code<input name="activation_code" autocomplete="one-time-code" maxlength="32" placeholder="RTAFNC-XXXX-XXXX" required></label><button class="button green full" type="submit">ยืนยันและผูกบัญชี LINE</button></form>`);
  document.querySelector("#activationForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try { await authenticateMember(String(form.get("activation_code") || "").trim()); closeModal(); render(); showToast("ผูกบัญชีสมาชิกสำเร็จ"); }
    catch (error) { showToast(error.message || "ผูกบัญชีไม่สำเร็จ", "error"); }
  });
}

async function loadPrivateData() {
  if (!state.supabase || !state.member) return;
  const [deedsResult, hospitalsResult] = await Promise.all([
    state.supabase.from("good_deed_records").select("id,category_code,activity_date,activity_title,activity_location,details,verifier_name,requested_hours,approved_hours,status,reviewer_note,created_at,good_deed_categories(name_th)").order("activity_date", { ascending: false }),
    state.supabase.from("hospital_visits").select("id,visit_date,hospital_name,symptoms,diagnosis,treatment_note,medication_note,medical_leave_days,status,follow_up_date,created_at").order("visit_date", { ascending: false }),
  ]);
  if (deedsResult.error) throw deedsResult.error;
  if (hospitalsResult.error) throw hospitalsResult.error;
  state.deeds = (deedsResult.data ?? []).map((item) => ({ ...item, category_name: item.good_deed_categories?.name_th ?? item.category_code }));
  state.hospitals = hospitalsResult.data ?? [];
}

function resetDemo() {
  if (!window.confirm("คืนค่าข้อมูลสาธิตเริ่มต้นหรือไม่? ข้อมูลที่กรอกในเครื่องนี้จะถูกแทนที่")) return;
  const seed = demoSeed();
  state.deeds = seed.deeds;
  state.hospitals = seed.hospitals;
  writeLocal(STORAGE_KEYS.deeds, state.deeds);
  writeLocal(STORAGE_KEYS.hospitals, state.hospitals);
  writeLocal(STORAGE_KEYS.newsReads, []);
  state.page = "home";
  render();
  showToast("คืนค่าข้อมูลสาธิตแล้ว");
}

function exportDemo() {
  const payload = {
    exported_at: new Date().toISOString(),
    mode: CONFIG.demoMode ? "demo" : "production-client-export",
    member: state.member ?? { student_code: "6700000", display_name: "นพอ.ตัวอย่าง ระบบทดสอบ", cohort: 67, current_year: 2 },
    good_deeds: state.deeds,
    hospital_visits: state.hospitals,
    news_reads: readLocal(STORAGE_KEYS.newsReads, []),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `rtafnc-export-${todayISO()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("ส่งออกข้อมูลแล้ว");
}

function showConnectionStatus() {
  const item = (label, ok, detail) => `<article class="record-card"><div class="record-title"><span class="record-icon ${ok ? "" : "gold"}">${ok ? "✅" : "⏳"}</span><div><h3>${label}</h3><p>${escapeHtml(detail)}</p></div></div></article>`;
  openModal("สถานะความพร้อมใช้งาน", "ตรวจสอบทุกชั้นของระบบ LIFF", `<div class="records">${item("UI และแบบฟอร์ม", true, "ใช้งานได้: เพิ่ม แก้ไข ลบ ค้นหา กรอง บันทึกร่าง และแนบไฟล์")}${item("Supabase Session", state.readiness.supabase, state.readiness.supabase ? "เชื่อมแล้ว" : "ยังไม่ได้ใส่ Project URL / Publishable Key")}${item("LINE LIFF", state.readiness.line, state.readiness.line ? "ได้รับ LINE ID Token แล้ว" : "ยังไม่ได้ใส่ LIFF ID หรือไม่ได้เปิดผ่าน LINE")}${item("ทะเบียนสมาชิก", state.readiness.member, state.readiness.member ? "ผูก student_id แล้ว" : "ยังไม่ผูก Activation Code")}${item("Private Storage", state.readiness.member && !CONFIG.demoMode, CONFIG.demoMode ? "ปิดไว้ใน Demo Mode" : "พร้อมตาม RLS")}${item("Production Mode", !CONFIG.demoMode, CONFIG.demoMode ? "กำลังใช้ข้อมูลทดสอบใน localStorage" : "เปิดใช้งานจริง")}</div>`);
}

function render() {
  updateSummary();
  setMemberDisplay();
  if (state.page === "good") renderGood();
  else if (state.page === "hospital") renderHospital();
  else if (state.page === "news") renderNews();
  else if (state.page === "profile") renderProfile();
  else renderHome();
  document.querySelectorAll(".bottom-nav button").forEach((button) => button.classList.toggle("active", button.dataset.page === state.page));
}

function handleFilterChange(target) {
  const key = target.dataset.filter;
  if (!key) return;
  state.filters[key] = target.value;
  if (state.page === "good") renderGood();
  if (state.page === "hospital") renderHospital();
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    if (action === "page") { state.page = target.dataset.page; render(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else if (action === "new-good") openGoodForm(target.dataset.category || "GD01");
    else if (action === "new-hospital") openHospitalForm();
    else if (action === "view-good") viewGood(target.dataset.id);
    else if (action === "view-hospital") viewHospital(target.dataset.id);
    else if (action === "edit-good") { const id = target.dataset.id; closeModal(); openGoodForm("GD01", id); }
    else if (action === "edit-hospital") { const id = target.dataset.id; closeModal(); openHospitalForm(id); }
    else if (action === "delete-good") deleteGood(target.dataset.id);
    else if (action === "delete-hospital") deleteHospital(target.dataset.id);
    else if (action === "duplicate-good") duplicateGood(target.dataset.id);
    else if (action === "resolve-hospital") resolveHospital(target.dataset.id);
    else if (action === "read-news") markNewsRead(target.dataset.newsId);
    else if (action === "mark-all-news") markAllNewsRead();
    else if (action === "reset-demo") resetDemo();
    else if (action === "export-demo") exportDemo();
    else if (action === "print-summary") window.print();
    else if (action === "activation") openActivationForm();
    else if (action === "close-modal") closeModal();
  });
  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-filter]")) handleFilterChange(event.target);
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches("select[data-filter]")) handleFilterChange(event.target);
  });
  document.querySelectorAll(".bottom-nav button").forEach((button) => button.addEventListener("click", () => {
    state.page = button.dataset.page;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }));
  elements.modalClose.addEventListener("click", closeModal);
  elements.modal.addEventListener("click", (event) => { if (event.target === elements.modal) closeModal(); });
  elements.connectionButton.addEventListener("click", showConnectionStatus);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && elements.modal.classList.contains("show")) closeModal(); });
}

async function bootstrap() {
  initializeDemoData();
  bindEvents();
  render();
  try {
    await initializeSupabase();
    await initializeLiff();
    await authenticateMember();
  } catch (error) {
    console.warn("Integration initialization failed:", error);
    showToast("ระบบบางส่วนยังไม่เชื่อม กรุณาดูสถานะระบบ", "error");
  }
  render();
}

bootstrap();
