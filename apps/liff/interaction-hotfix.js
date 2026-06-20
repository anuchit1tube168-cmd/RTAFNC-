(() => {
  let searchTimer = null;

  document.addEventListener("input", (event) => {
    const input = event.target.closest?.("input[data-filter]");
    if (!input) return;

    event.stopImmediatePropagation();
    window.clearTimeout(searchTimer);
    const filterName = input.dataset.filter;
    const currentValue = input.value;

    searchTimer = window.setTimeout(() => {
      input.dispatchEvent(new Event("change", { bubbles: true }));
      window.setTimeout(() => {
        const replacement = document.querySelector(`input[data-filter="${filterName}"]`);
        if (!replacement) return;
        replacement.value = currentValue;
        replacement.focus({ preventScroll: true });
        replacement.setSelectionRange(currentValue.length, currentValue.length);
      }, 0);
    }, 350);
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
