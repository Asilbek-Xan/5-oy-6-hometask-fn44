export function toast(message, type = "success", position = "right") {
  // Eski toastni o‘chirish (ko‘payib ketmasin)
  document.querySelectorAll(".toast").forEach(t => t.remove());

  const elToast = document.createElement("div");
  elToast.classList.add("toast");
  elToast.innerText = message;
  elToast.style.position = "fixed";
  elToast.style.bottom = "20px";
  elToast.style[position] = "20px";
  elToast.style.padding = "14px 20px";
  elToast.style.borderRadius = "10px";
  elToast.style.color = "#fff";
  elToast.style.fontSize = "15px";
  elToast.style.zIndex = "9999";
  elToast.style.minWidth = "240px";
  elToast.style.boxShadow = "0 3px 12px rgba(0,0,0,0.3)";
  elToast.style.cursor = "default";
  elToast.style.transition = "transform 0.3s ease, opacity 0.3s ease";
  elToast.style.opacity = "0";
  elToast.style.transform = "translateY(20px)";
  elToast.style.display = "flex";
  elToast.style.alignItems = "center";
  elToast.style.gap = "8px";

  // Ranglarni aniqlash
  const colors = {
    success: "#22c55e",
    error: "#ef4444",
    info: "#3b82f6",
    warning: "#eab308"
  };
  elToast.style.background = colors[type] || colors.info;

  // Progress chizig‘i
  const progress = document.createElement("div");
  progress.style.position = "absolute";
  progress.style.bottom = "0";
  progress.style.left = "0";
  progress.style.height = "4px";
  progress.style.background = "rgba(255,255,255,0.9)";
  progress.style.width = "100%";
  progress.style.transition = "width linear";
  elToast.appendChild(progress);

  document.body.appendChild(elToast);

  // Animatsiya chiqish
  requestAnimationFrame(() => {
    elToast.style.opacity = "1";
    elToast.style.transform = "translateY(0)";
  });

  // Progress animatsiyasi
  let duration = 3000;
  let start = Date.now();
  let remaining = duration;
  let timer;

  function startAnim(time) {
    progress.style.transition = `width ${time}ms linear`;
    progress.style.width = "0%";
    timer = setTimeout(() => removeToast(), time);
  }

  function pauseAnim() {
    clearTimeout(timer);
    const elapsed = Date.now() - start;
    remaining -= elapsed;
    progress.style.transition = "none";
  }

  function resumeAnim() {
    start = Date.now();
    progress.style.transition = `width ${remaining}ms linear`;
    progress.style.width = "0%";
    timer = setTimeout(() => removeToast(), remaining);
  }

  function removeToast() {
    elToast.style.opacity = "0";
    elToast.style.transform = "translateY(20px)";
    setTimeout(() => elToast.remove(), 300);
  }

  startAnim(duration);
  elToast.addEventListener("mouseenter", pauseAnim);
  elToast.addEventListener("mouseleave", resumeAnim);
}
