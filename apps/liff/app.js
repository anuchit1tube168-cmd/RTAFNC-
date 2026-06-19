const CONFIG = Object.freeze({
  supabaseUrl: window.RTAFNC_CONFIG?.supabaseUrl ?? "",
  supabasePublishableKey: window.RTAFNC_CONFIG?.supabasePublishableKey ?? "",
  liffId: window.RTAFNC_CONFIG?.liffId ?? "",
  lineOaId: window.RTAFNC_CONFIG?.lineOaId ?? "",
  demoMode: window.RTAFNC_CONFIG?.demoMode ?? true,
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
  { id: "demo-news-1", title: "เปิดรับสมัครบริจาคโลหิต", body: "ลงทะเบียนผ่านหน้า LIFF และติดตามสถานะได้ในระบบ", published_at: new Date().toISOString() },
  { id: "demo-news-2", title: "กิจกรรมจิตอาสาประจำเดือน", body: "นักเรียนสามารถบันทึกกิจกรรมและแนบหลักฐานได้จากเมนูทุกความดี", published_at: new Date().toISOString() },
  { id: "demo-news-3", title: "กำหนดส่งเอกสารประจำชั้นปี", body: "ตรวจสอบเอกสารที่ต้องส่งเพิ่มเติมในเมนูเอกสาร", published_at: new Date().toISOString() },
]);

const STORAGE_KEYS = Object.freeze({
  deeds: "rtafnc_demo_good_deeds",
  hospitals: "rtafnc_demo_hospital_visits",
  newsReads: "rtafnc_demo_news_reads",
});

const state = {
  page: "home",
  supabase: null,
  lineProfile: null,
  member: null,
  announcements: [...DEMO_NEWS],
  deeds: readLocal(STORAGE_KEYS.deeds, [
    {
      id: "demo-deed-1",
      category_code: "GD01",
      category_name: GOOD_DEED_CATEGORIES[0].name,
      activity_date: "18/06/2569",
      activity_title: "บริจาคโลหิต ณ รพ.ภูมิพลอดุลยเดช",
      requested_hours: 8,
      status: "approved",
      details: "รายการตัวอย่าง",
    },
    {
      id: "demo-deed-2",
      category_code: "GD03",
      category_name: GOOD_DEED_CATEGORIES[2].name,
      activity_date: "12/06/2569",
      activity_title: "ช่วยงานกิจกรรมภายใน วพอ.",
      requested_hours: 6,
      status: "pending",
      details: "รายการตัวอย่าง",
    },
  ]),
  hospitals: readLocal(STORAGE_KEYS.hospitals, [
    {
      id: "demo-hospital-1",
      visit_date: "10/06/2569",
      hospital_name: "รพ.ภูมิพลอดุลยเดช",
      symptoms: "ไข้ ไอ เจ็บคอ",
      diagnosis: "URI",
      status: "follow_up",
    },
    {
      id: "demo-hospital-2",
      visit_date: "21/05/2569",
      hospital_name: "ห้องพยาบาล วพอ.",
      symptoms: "ปวดศีรษะ",
      diagnosis: "Tension headache",
      status: "resolved",
    },
  ]),
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.setTimeout(() => elements.toast.classList.remove("show"), 2200);
}

function openModal(title, subtitle, body) {
  elements.modalTitle.textContent = title;
  elements.modalSubtitle.textContent = subtitle;
  elements.modalBody.innerHTML = body;
  elements.modal.classList.add("show");
  elements.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  elements.modal.classList.remove("show");
  elements.modal.setAttribute("aria-hidden", "true");
}

function statusBadge(status) {
  const labels = {
    pending: "รออนุมัติ",
    approved: "อนุมัติแล้ว",
    rejected: "ไม่อนุมัติ",
    returned: "ส่งกลับแก้ไข",
  };
  const css = ["approved", "rejected"].includes(status) ? status : "pending";
  return `<span class="badge ${css}">${escapeHtml(labels[status] ?? status)}</span>`;
}

function thaiDate(value) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function calculateGoodHours() {
  return state.deeds
    .filter((item) => item.status === "approved")
    .reduce((sum, item) => sum + Number(item.approved_hours ?? item.requested_hours ?? 0), 0);
}

function updateSummary() {
  elements.goodHours.textContent = String(calculateGoodHours() || 206);
  elements.pendingCount.textContent = String(state.deeds.filter((item) => item.status === "pending").length);
  elements.hospitalCount.textContent = String(state.hospitals.length);

  const reads = readLocal(STORAGE_KEYS.newsReads, []);
  const unread = state.announcements.filter((item) => !reads.includes(item.id)).length;
  elements.newsCount.textContent = String(unread);
}

function setMemberDisplay() {
  if (state.member) {
    elements.memberName.textContent = state.member.display_name;
    elements.memberMeta.textContent = `${state.member.student_code} · รุ่น ${state.member.cohort} · ชั้นปี ${state.member.current_year}`;
    elements.memberStatus.textContent = "MEMBER";
    return;
  }

  if (state.lineProfile) {
    elements.memberName.textContent = state.lineProfile.displayName;
    elements.memberMeta.textContent = "LINE เชื่อมแล้ว · ยังไม่ผูกทะเบียนนักเรียน";
    elements.memberStatus.textContent = "UNLINKED";
    if (state.lineProfile.pictureUrl) {
      elements.avatar.innerHTML = `<img src="${escapeHtml(state.lineProfile.pictureUrl)}" alt="LINE profile">`;
    }
    return;
  }

  elements.memberName.textContent = "นพอ.ตัวอย่าง ระบบสาธิต";
  elements.memberMeta.textContent = "6700000 · รุ่น 67 · ชั้นปี 2";
  elements.memberStatus.textContent = "DEMO";
}

function renderHome() {
  elements.main.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div><p>แยกข้อมูลชัดเจน</p><h2>เลือกบริการ</h2></div>
      </div>
      <div class="module-grid">
        <button class="module-card good" data-action="page" data-page="good" type="button">
          <span>⭐</span><strong>บันทึกความดี</strong>
          <small>8 หัวข้อครบ พร้อมหลักฐาน ชั่วโมง และสถานะอนุมัติ</small>
        </button>
        <button class="module-card hospital" data-action="page" data-page="hospital" type="button">
          <span>🏥</span><strong>ไปโรงพยาบาล</strong>
          <small>อาการ การรักษา ยา ใบรับรอง และการติดตามอาการ</small>
        </button>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div><p>ประชาสัมพันธ์</p><h2>ข่าวล่าสุด</h2></div>
        <button class="button soft" data-action="page" data-page="news" type="button">ดูทั้งหมด</button>
      </div>
      <div class="records">
        ${state.announcements.slice(0, 3).map(newsCard).join("")}
      </div>
    </section>
  `;
}

function renderGood() {
  elements.main.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div><p>GOOD DEEDS</p><h2>8 ประเภทความดี</h2></div>
        <button class="button green" data-action="new-good" type="button">+ เพิ่มรายการ</button>
      </div>
      <div class="category-grid">
        ${GOOD_DEED_CATEGORIES.map((category, index) => `
          <button class="category-card" data-action="new-good" data-category="${category.code}" type="button">
            <i class="category-number">${index + 1}</i>
            <span>${category.icon}</span>
            <strong>${escapeHtml(category.name)}</strong>
            <small>${escapeHtml(category.description)}</small>
          </button>
        `).join("")}
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div><p>ประวัติของฉัน</p><h2>รายการความดี</h2></div></div>
      <div class="records">
        ${state.deeds.length ? state.deeds.map(goodRecordCard).join("") : '<div class="empty-state">ยังไม่มีรายการความดี</div>'}
      </div>
    </section>
  `;
}

function renderHospital() {
  elements.main.innerHTML = `
    <section class="section">
      <div class="section-head">
        <div><p>HOSPITAL & HEALTH</p><h2>ข้อมูลไปโรงพยาบาล</h2></div>
        <button class="button blue" data-action="new-hospital" type="button">+ บันทึก</button>
      </div>
      <div class="notice">ข้อมูลโรงพยาบาลแยกจากระบบความดีโดยสมบูรณ์ ระบบจริงจะเปิดให้เฉพาะนักเรียนเจ้าของข้อมูลและเจ้าหน้าที่ทางการแพทย์ที่ได้รับสิทธิ์</div>
      <div class="records" style="margin-top:10px">
        ${state.hospitals.length ? state.hospitals.map(hospitalRecordCard).join("") : '<div class="empty-state">ยังไม่มีข้อมูลโรงพยาบาล</div>'}
      </div>
    </section>
  `;
}

function renderNews() {
  elements.main.innerHTML = `
    <section class="section">
      <div class="section-head"><div><p>NEWS CENTER</p><h2>ข่าวประชาสัมพันธ์</h2></div></div>
      <div class="records">${state.announcements.map(newsCard).join("")}</div>
    </section>
  `;
}

function renderProfile() {
  const supabaseStatus = state.supabase ? "เชื่อมไคลเอนต์แล้ว" : "ยังไม่ตั้งค่า";
  const lineStatus = state.lineProfile ? `เชื่อมแล้ว: ${escapeHtml(state.lineProfile.displayName)}` : "ยังไม่เชื่อม";

  elements.main.innerHTML = `
    <section class="section">
      <div class="section-head"><div><p>ACCOUNT</p><h2>บัญชีของฉัน</h2></div></div>
      <div class="records">
        <article class="record-card"><h3>LINE LIFF</h3><p>${lineStatus}</p></article>
        <article class="record-card"><h3>Supabase</h3><p>${supabaseStatus}</p></article>
        <article class="record-card"><h3>สถานะสมาชิก</h3><p>${state.member ? "ผูกทะเบียนนักเรียนแล้ว" : "โหมดสาธิตหรือยังไม่ได้ผูกบัญชี"}</p></article>
      </div>
      <div class="notice" style="margin-top:10px">การผูกบัญชีจริงจะตรวจ LINE ID Token ที่ Edge Function ก่อนจับคู่กับ student_id ห้ามเชื่อข้อมูลโปรไฟล์จาก Browser โดยตรง</div>
    </section>
  `;
}

function goodRecordCard(item) {
  return `
    <article class="record-card">
      <h3>⭐ ${escapeHtml(item.category_name)}</h3>
      <p>${escapeHtml(item.activity_date)} · ${escapeHtml(item.activity_title)}</p>
      <div class="record-footer">
        <strong>${Number(item.approved_hours ?? item.requested_hours ?? 0)} ชั่วโมง</strong>
        ${statusBadge(item.status)}
      </div>
    </article>
  `;
}

function hospitalRecordCard(item) {
  const label = item.status === "resolved" ? "หายแล้ว" : item.status === "follow_up" ? "ติดตามอาการ" : "บันทึกแล้ว";
  return `
    <article class="record-card">
      <h3>🏥 ${escapeHtml(item.hospital_name)}</h3>
      <p>${escapeHtml(item.visit_date)} · ${escapeHtml(item.symptoms)}</p>
      <div class="record-footer">
        <strong>${escapeHtml(item.diagnosis || "รอวินิจฉัย")}</strong>
        <span class="badge ${item.status === "resolved" ? "approved" : "pending"}">${label}</span>
      </div>
    </article>
  `;
}

function newsCard(item) {
  return `
    <button class="record-card" style="width:100%;text-align:left" data-action="read-news" data-news-id="${escapeHtml(item.id)}" type="button">
      <h3>📣 ${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.body)}</p>
    </button>
  `;
}

function openGoodForm(categoryCode = "GD01") {
  const selected = GOOD_DEED_CATEGORIES.find((item) => item.code === categoryCode) ?? GOOD_DEED_CATEGORIES[0];
  openModal("บันทึกความดี", "เลือก 1 ใน 8 ประเภทและกรอกหลักฐานให้ครบ", `
    <form id="goodForm" class="form">
      <label>ประเภทความดี
        <select name="category_code" required>
          ${GOOD_DEED_CATEGORIES.map((item) => `<option value="${item.code}" ${item.code === selected.code ? "selected" : ""}>${item.code} — ${escapeHtml(item.name)}</option>`).join("")}
        </select>
      </label>
      <label>วันที่ทำกิจกรรม<input name="activity_date" type="date" required></label>
      <label>จำนวนชั่วโมง<input name="requested_hours" type="number" min="0.5" max="24" step="0.5" required></label>
      <label>ชื่อกิจกรรม<input name="activity_title" maxlength="200" required></label>
      <label>สถานที่<input name="activity_location" maxlength="200"></label>
      <label>รายละเอียด<textarea name="details" rows="4" maxlength="2000" required></textarea></label>
      <label>หน่วยงานหรือผู้รับรอง<input name="verifier_name" maxlength="200"></label>
      <label>หลักฐานรูปภาพหรือ PDF<input name="attachments" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple></label>
      <label><input name="confirm" type="checkbox" required> ข้าพเจ้ารับรองว่าข้อมูลถูกต้อง</label>
      <button class="button green" type="submit">ส่งตรวจสอบ</button>
    </form>
  `);

  document.querySelector("#goodForm").addEventListener("submit", submitGoodForm);
}

function openHospitalForm() {
  openModal("บันทึกการไปโรงพยาบาล", "ข้อมูลสุขภาพแยกจากระบบความดี", `
    <form id="hospitalForm" class="form">
      <label>วันที่ไปโรงพยาบาล<input name="visit_date" type="date" required></label>
      <label>สถานพยาบาล<input name="hospital_name" maxlength="200" required></label>
      <label>อาการสำคัญ<textarea name="symptoms" rows="3" maxlength="2000" required></textarea></label>
      <label>การวินิจฉัย<input name="diagnosis" maxlength="500"></label>
      <label>การรักษา<textarea name="treatment_note" rows="3" maxlength="2000"></textarea></label>
      <label>ยา<textarea name="medication_note" rows="3" maxlength="2000"></textarea></label>
      <label>จำนวนวันลาป่วย<input name="medical_leave_days" type="number" min="0" max="365" step="0.5"></label>
      <label>วันติดตามอาการ<input name="follow_up_date" type="date"></label>
      <label>ใบรับรองแพทย์หรือ PDF<input name="attachments" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple></label>
      <button class="button blue" type="submit">บันทึกข้อมูลสุขภาพ</button>
    </form>
  `);

  document.querySelector("#hospitalForm").addEventListener("submit", submitHospitalForm);
}

function validateFiles(files) {
  const allowed = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
  const maxBytes = 10 * 1024 * 1024;
  for (const file of files) {
    if (!allowed.has(file.type)) throw new Error(`ชนิดไฟล์ ${file.name} ไม่ได้รับอนุญาต`);
    if (file.size > maxBytes) throw new Error(`${file.name} มีขนาดเกิน 10 MB`);
  }
}

async function submitGoodForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const files = data.getAll("attachments").filter((item) => item instanceof File && item.size > 0);

  try {
    validateFiles(files);
    const category = GOOD_DEED_CATEGORIES.find((item) => item.code === data.get("category_code"));
    const payload = {
      id: crypto.randomUUID(),
      category_code: category.code,
      category_name: category.name,
      activity_date: thaiDate(data.get("activity_date")),
      activity_title: data.get("activity_title").trim(),
      activity_location: data.get("activity_location").trim(),
      details: data.get("details").trim(),
      verifier_name: data.get("verifier_name").trim(),
      requested_hours: Number(data.get("requested_hours")),
      status: "pending",
      attachment_names: files.map((file) => file.name),
      created_at: new Date().toISOString(),
    };

    if (!CONFIG.demoMode && !state.member) {
      throw new Error("ยังไม่ได้ผูกบัญชีสมาชิก จึงยังส่งข้อมูลจริงไม่ได้");
    }

    // Phase 1: demo-safe persistence. Production inserts are enabled only after
    // LINE token verification, Supabase Auth session, RLS and private storage are installed.
    state.deeds.unshift(payload);
    writeLocal(STORAGE_KEYS.deeds, state.deeds);
    closeModal();
    state.page = "good";
    render();
    showToast("ส่งบันทึกความดีแล้ว");
  } catch (error) {
    showToast(error.message || "ส่งข้อมูลไม่สำเร็จ");
  }
}

async function submitHospitalForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const files = data.getAll("attachments").filter((item) => item instanceof File && item.size > 0);

  try {
    validateFiles(files);
    if (!CONFIG.demoMode && !state.member) {
      throw new Error("ยังไม่ได้ผูกบัญชีสมาชิก จึงยังส่งข้อมูลสุขภาพจริงไม่ได้");
    }

    const payload = {
      id: crypto.randomUUID(),
      visit_date: thaiDate(data.get("visit_date")),
      hospital_name: data.get("hospital_name").trim(),
      symptoms: data.get("symptoms").trim(),
      diagnosis: data.get("diagnosis").trim(),
      treatment_note: data.get("treatment_note").trim(),
      medication_note: data.get("medication_note").trim(),
      medical_leave_days: Number(data.get("medical_leave_days") || 0),
      follow_up_date: data.get("follow_up_date") || null,
      status: data.get("follow_up_date") ? "follow_up" : "recorded",
      attachment_names: files.map((file) => file.name),
      created_at: new Date().toISOString(),
    };

    state.hospitals.unshift(payload);
    writeLocal(STORAGE_KEYS.hospitals, state.hospitals);
    closeModal();
    state.page = "hospital";
    render();
    showToast("บันทึกข้อมูลโรงพยาบาลแล้ว");
  } catch (error) {
    showToast(error.message || "บันทึกข้อมูลไม่สำเร็จ");
  }
}

function markNewsRead(newsId) {
  const reads = new Set(readLocal(STORAGE_KEYS.newsReads, []));
  reads.add(newsId);
  writeLocal(STORAGE_KEYS.newsReads, [...reads]);
  const news = state.announcements.find((item) => String(item.id) === String(newsId));
  if (news) {
    openModal(news.title, "ข่าวประชาสัมพันธ์", `<p style="line-height:1.7">${escapeHtml(news.body)}</p><button id="ackNews" class="button green" type="button">รับทราบ</button>`);
    document.querySelector("#ackNews").addEventListener("click", closeModal);
  }
  updateSummary();
}

async function initializeSupabase() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabasePublishableKey || !window.supabase) return;

  state.supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabasePublishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });

  const { data, error } = await state.supabase
    .from("announcements")
    .select("id,title,body,published_at")
    .eq("is_published", true)
    .eq("target_type", "all")
    .order("published_at", { ascending: false })
    .limit(20);

  if (!error && data?.length) state.announcements = data;
}

async function initializeLiff() {
  if (!CONFIG.liffId || !window.liff) return;

  await window.liff.init({ liffId: CONFIG.liffId });
  if (!window.liff.isLoggedIn()) {
    if (window.liff.isInClient()) window.liff.login();
    return;
  }

  state.lineProfile = await window.liff.getProfile();
  // Do not use getProfile() as proof of identity. Phase 2 sends the ID token
  // to a Supabase Edge Function for server-side verification and membership linking.
}

function showConnectionStatus() {
  openModal("สถานะระบบ", "ตรวจสอบการเชื่อมต่อปัจจุบัน", `
    <div class="records">
      <article class="record-card"><h3>Repository</h3><p>Private source repository</p></article>
      <article class="record-card"><h3>Supabase</h3><p>${state.supabase ? "เชื่อมไคลเอนต์แล้ว" : "ยังไม่ตั้งค่า"}</p></article>
      <article class="record-card"><h3>LINE LIFF</h3><p>${state.lineProfile ? `เชื่อมแล้ว: ${escapeHtml(state.lineProfile.displayName)}` : "ยังไม่เชื่อม"}</p></article>
      <article class="record-card"><h3>โหมดข้อมูล</h3><p>${CONFIG.demoMode ? "Demo — ยังไม่ส่งข้อมูลส่วนบุคคลขึ้นฐานข้อมูล" : "Production"}</p></article>
    </div>
  `);
}

function render() {
  updateSummary();
  setMemberDisplay();

  if (state.page === "good") renderGood();
  else if (state.page === "hospital") renderHospital();
  else if (state.page === "news") renderNews();
  else if (state.page === "profile") renderProfile();
  else renderHome();

  document.querySelectorAll(".bottom-nav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === state.page);
  });
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;

    if (target.dataset.action === "page") {
      state.page = target.dataset.page;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (target.dataset.action === "new-good") openGoodForm(target.dataset.category || "GD01");
    if (target.dataset.action === "new-hospital") openHospitalForm();
    if (target.dataset.action === "read-news") markNewsRead(target.dataset.newsId);
  });

  document.querySelectorAll(".bottom-nav button").forEach((button) => {
    button.addEventListener("click", () => {
      state.page = button.dataset.page;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  elements.modalClose.addEventListener("click", closeModal);
  elements.modal.addEventListener("click", (event) => {
    if (event.target === elements.modal) closeModal();
  });
  elements.connectionButton.addEventListener("click", showConnectionStatus);
}

async function bootstrap() {
  bindEvents();
  render();

  const results = await Promise.allSettled([initializeSupabase(), initializeLiff()]);
  const rejected = results.find((result) => result.status === "rejected");
  if (rejected) console.warn("Optional integration initialization failed:", rejected.reason);

  setMemberDisplay();
  updateSummary();
  render();
}

bootstrap();
