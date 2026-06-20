(() => {
  let focusTimer = null;

  // The main renderer replaces filter inputs after each keystroke.
  // Allow the original input event to update application state, then restore
  // focus and caret position on the replacement element.
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

  window.addEventListener("error", (event) => {
    console.error("RTAFNC client error:", event.error || event.message);
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = "หน้าเว็บพบข้อผิดพลาด กรุณารีเฟรชแล้วลองใหม่";
    toast.dataset.tone = "error";
    toast.classList.add("show");
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("RTAFNC unhandled promise rejection:", event.reason);
  });
})();
