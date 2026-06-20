(() => {
  let focusTimer = null;

  document.addEventListener("input", (event) => {
    const input = event.target.closest?.("input[data-filter]");
    if (!input) return;

    window.clearTimeout(focusTimer);
    const filterName = input.dataset.filter;
    const value = input.value;
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? value.length;

    focusTimer = window.setTimeout(() => {
      const replacement = document.querySelector(`input[data-filter="${filterName}"]`);
      if (!replacement) return;
      replacement.value = value;
      replacement.focus({ preventScroll: true });
      replacement.setSelectionRange(start, end);
    }, 0);
  }, true);

  window.addEventListener("error", (event) => {
    console.error("RTAFNC Staff client error:", event.error || event.message);
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = "Staff Console พบข้อผิดพลาด กรุณารีเฟรชแล้วลองใหม่";
    toast.dataset.tone = "error";
    toast.classList.add("show");
  });
})();
