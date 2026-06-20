(() => {
  const ACTIVITY_KEY = "rtafnc_demo_activity_registrations";
  const NEWS_KEY = "rtafnc_demo_announcements";
  const NEWS_READ_KEY = "rtafnc_demo_news_reads";

  const ACTIVITIES = [
    {
      id: "activity-blood-2569-01",
      title: "กิจกรรมบริจาคโลหิตประจำเดือน",
      date: "2026-07-10",
      deadline: "2026-07-05",
      location: "โรงพยาบาลภูมิพลอดุลยเดช",
      capacity: 40,
      registered: 23,
      description: "ลงทะเบียนเข้าร่วมบริจาคโลหิต พร้อมรับรายละเอียดการเตรียมตัวก่อนวันกิจกรรม",
    },
    {
      id: "activity-volunteer-2569-02",
      title: "จิตอาสาพัฒนาพื้นที่ส่วนกลาง วพอ.",
      date: "2026-07-18",
      deadline: "2026-07-14",
      location: "วิทยาลัยพยาบาลทหารอากาศ",
      capacity: 80,
      registered: 48,
      description: "กิจกรรมดูแลพื้นที่ส่วนกลาง แบ่งกลุ่มงานและบันทึกชั่วโมงความดีหลังจบกิจกรรม",
    },
    {
      id: "activity-training-2569-03",
      title: "อบรมการปฐมพยาบาลและ AED",
      date: "2026-08-02",
      deadline: "2026-07-25",
      location: "ห้องประชุมใหญ่ วพอ.",
      capacity: 60,
      registered: 51,
      description: "อบรมภาคทฤษฎีและฝึกปฏิบัติ พร้อมแบบทดสอบหลังเรียน",
    },
  ];

  let focusTimer = null;
  let renderTimer = null;

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
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[character]);
  }

  function formatThaiDate(value) {
    if (!value) return "-";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("th-TH", { day: "2-digit", month: "short", year: "numeric" }).format(date);
  }

  function registrations() {
    return readLocal(ACTIVITY_KEY, []);
  }

  function isRegistered(activityId) {
    return registrations().some((item) => item.activity_id === activityId && item.status === "registered");
  }

  function showToast(message, tone = "success") {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.dataset.tone = tone;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function openExtensionModal(title, subtitle, body) {
    const modal = document.querySelector("#modal");
    const modalTitle = document.querySelector("#modalTitle");
    const modalSubtitle = document.querySelector("#modalSubtitle");
    const modalBody = document.querySelector("#modalBody");
    if (!modal || !modalTitle || !modalSubtitle || !modalBody) return;
    modalTitle.textContent = title;
    modalSubtitle.textContent = subtitle;
    modalBody.innerHTML = body;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeExtensionModal() {
    const modal = document.querySelector("#modal");
    const modalBody = document.querySelector("#modalBody");
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (modalBody) modalBody.innerHTML = "";
  }

  function activityCard(activity) {
    const registered = isRegistered(activity.id);
    const remaining = Math.max(0, activity.capacity - activity.registered - (registered ? 1 : 0));
    return `<article class="record-card activity-card">
      <div class="record-title">
        <span class="record-icon blue">🗓️</span>
        <div><h3>${escapeHtml(activity.title)}</h3><p>${escapeHtml(activity.description)}</p></div>
      </div>
      <div class="activity-info">
        <span>📅 ${escapeHtml(formatThaiDate(activity.date))}</span>
        <span>📍 ${escapeHtml(activity.location)}</span>
        <span>👥 เหลือ ${remaining} ที่</span>
      </div>
      <div class="record-footer">
        <span>ปิดรับ ${escapeHtml(formatThaiDate(activity.deadline))}</span>
        <button class="button ${registered ? "red" : "green"} compact" data-extension-action="${registered ? "cancel-activity" : "register-activity"}" data-activity-id="${escapeHtml(activity.id)}" type="button">${registered ? "ยกเลิกลงทะเบียน" : "ลงทะเบียน"}</button>
      </div>
    </article>`;
  }

  function staffNewsCard(item, readIds) {
    const isRead = readIds.includes(String(item.id));
    return `<button class="record-card clickable news-card ${isRead ? "read" : "unread"}" data-extension-action="read-staff-news" data-news-id="${escapeHtml(item.id)}" type="button">
      <div class="record-title"><span class="record-icon gold">📣</span><div><h3>${escapeHtml(item.title)}${isRead ? "" : '<i class="new-dot">ใหม่</i>'}</h3><p>${escapeHtml(item.body)}</p></div></div>
      <div class="record-meta"><span>${item.published_at ? escapeHtml(formatThaiDate(String(item.published_at).slice(0, 10))) : "ฉบับร่าง"}</span><span>${isRead ? "อ่านแล้ว" : "แตะเพื่ออ่าน"}</span></div>
    </button>`;
  }

  function renderExtensions() {
    const main = document.querySelector("#main");
    if (!main) return;

    const newsButton = document.querySelector('.bottom-nav button[data-page="news"]');
    const reads = readLocal(NEWS_READ_KEY, []).map(String);
    const staffNews = readLocal(NEWS_KEY, []).filter((item) => item.is_published);
    const baseIds = new Set(["demo-news-1", "demo-news-2", "demo-news-3"]);
    const extraStaffNews = staffNews.filter((item) => !baseIds.has(String(item.id)) || item.updated_at);
    const unreadExtra = extraStaffNews.filter((item) => !reads.includes(String(item.id))).length;
    const baseUnread = Number(document.querySelector("#newsCount")?.textContent || 0);
    const totalUnread = Math.max(0, baseUnread + unreadExtra);

    if (newsButton) newsButton.classList.toggle("has-new", totalUnread > 0);

    const heading = main.querySelector("h2");
    const isNewsPage = heading?.textContent?.includes("ข่าวประชาสัมพันธ์");
    if (!isNewsPage) return;

    if (!main.querySelector("#activityRegistrationSection")) {
      const activitySection = document.createElement("section");
      activitySection.id = "activityRegistrationSection";
      activitySection.className = "section extension-section";
      activitySection.innerHTML = `<div class="section-head"><div><p>ACTIVITY REGISTRATION</p><h2>กิจกรรมเปิดรับสมัคร</h2></div><span class="extension-count">${registrations().filter((item) => item.status === "registered").length} รายการของฉัน</span></div><div class="records">${ACTIVITIES.map(activityCard).join("")}</div>`;
      main.appendChild(activitySection);
    }

    if (extraStaffNews.length && !main.querySelector("#staffNewsExtension")) {
      const newsSection = document.createElement("section");
      newsSection.id = "staffNewsExtension";
      newsSection.className = "section extension-section";
      newsSection.innerHTML = `<div class="section-head"><div><p>STAFF CONSOLE UPDATE</p><h2>ข่าวที่อัปเดตล่าสุด</h2></div></div><div class="records">${extraStaffNews.map((item) => staffNewsCard(item, reads)).join("")}</div>`;
      main.prepend(newsSection);
    }
  }

  function scheduleExtensions() {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(renderExtensions, 0);
  }

  function openActivityRegistration(activityId) {
    const activity = ACTIVITIES.find((item) => item.id === activityId);
    if (!activity) return;
    openExtensionModal("ลงทะเบียนกิจกรรม", activity.title, `<form id="activityRegistrationForm" class="form">
      <div class="activity-detail-box"><strong>${escapeHtml(formatThaiDate(activity.date))}</strong><span>${escapeHtml(activity.location)}</span><p>${escapeHtml(activity.description)}</p></div>
      <label class="field">เบอร์โทรศัพท์สำหรับติดต่อ<input name="phone" inputmode="tel" maxlength="20" placeholder="เช่น 08x-xxx-xxxx" required></label>
      <label class="field">หมายเหตุ<textarea name="note" rows="3" maxlength="500" placeholder="ข้อจำกัดด้านสุขภาพหรือข้อมูลที่ผู้จัดควรทราบ"></textarea></label>
      <label class="check-field"><input name="confirm" type="checkbox" required><span>ยืนยันการเข้าร่วมและรับทราบวัน เวลา สถานที่</span></label>
      <button class="button green full" type="submit">ยืนยันลงทะเบียน</button>
    </form>`);

    document.querySelector("#activityRegistrationForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const phone = String(form.get("phone") || "").trim();
      if (phone.length < 8) {
        showToast("กรุณาระบุเบอร์โทรศัพท์ให้ครบ", "error");
        return;
      }
      const records = registrations().filter((item) => item.activity_id !== activityId);
      records.unshift({
        id: globalThis.crypto?.randomUUID?.() ?? `registration-${Date.now()}`,
        activity_id: activityId,
        phone,
        note: String(form.get("note") || "").trim(),
        status: "registered",
        registered_at: new Date().toISOString(),
      });
      writeLocal(ACTIVITY_KEY, records);
      closeExtensionModal();
      document.querySelector("#activityRegistrationSection")?.remove();
      renderExtensions();
      showToast("ลงทะเบียนกิจกรรมสำเร็จ");
    });
  }

  function cancelActivity(activityId) {
    if (!window.confirm("ยืนยันยกเลิกการลงทะเบียนกิจกรรมนี้หรือไม่?")) return;
    const records = registrations().map((item) => item.activity_id === activityId ? { ...item, status: "cancelled", cancelled_at: new Date().toISOString() } : item);
    writeLocal(ACTIVITY_KEY, records);
    document.querySelector("#activityRegistrationSection")?.remove();
    renderExtensions();
    showToast("ยกเลิกการลงทะเบียนแล้ว");
  }

  function readStaffNews(newsId) {
    const news = readLocal(NEWS_KEY, []).find((item) => String(item.id) === String(newsId));
    if (!news) return;
    const reads = new Set(readLocal(NEWS_READ_KEY, []).map(String));
    reads.add(String(newsId));
    writeLocal(NEWS_READ_KEY, [...reads]);
    openExtensionModal(news.title, "ข่าวจาก Staff Console", `<article class="news-detail"><div class="news-hero">📣</div><p>${escapeHtml(news.body)}</p><button class="button green full" data-extension-action="close-extension-modal" type="button">รับทราบ</button></article>`);
    document.querySelector("#staffNewsExtension")?.remove();
    renderExtensions();
  }

  // Preserve focus after the main renderer replaces a search input.
  document.addEventListener("input", (event) => {
    const input = event.target.closest?.("input[data-filter]");
    if (!input) return;

    window.clearTimeout(focusTimer);
    const filterName = input.dataset.filter;
    const currentValue = input.value;
    const selectionStart = input.selectionStart ?? currentValue.length;
    const selectionEnd = input.selectionEnd ?? currentValue.length;

    focusTimer = window.setTimeout(() => {
      const replacement = document.querySelector(`input[data-filter="${filterName}"]`);
      if (!replacement) return;
      replacement.value = currentValue;
      replacement.focus({ preventScroll: true });
      replacement.setSelectionRange(selectionStart, selectionEnd);
    }, 0);
  }, true);

  document.addEventListener("click", (event) => {
    const target = event.target.closest?.("[data-extension-action]");
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    const action = target.dataset.extensionAction;
    if (action === "register-activity") openActivityRegistration(target.dataset.activityId);
    else if (action === "cancel-activity") cancelActivity(target.dataset.activityId);
    else if (action === "read-staff-news") readStaffNews(target.dataset.newsId);
    else if (action === "close-extension-modal") closeExtensionModal();
  }, true);

  const main = document.querySelector("#main");
  if (main) new MutationObserver(scheduleExtensions).observe(main, { childList: true, subtree: true });
  window.addEventListener("storage", scheduleExtensions);
  scheduleExtensions();

  window.addEventListener("error", (event) => {
    console.error("RTAFNC client error:", event.error || event.message);
    showToast("หน้าเว็บพบข้อผิดพลาด กรุณารีเฟรชแล้วลองใหม่", "error");
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("RTAFNC unhandled promise rejection:", event.reason);
  });
})();
