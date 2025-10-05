  export function toast(message, type = "success") {
    const elToast = document.createElement("div")
    elToast.classList.add("toast")
    elToast.innerText = message
    elToast.style.position = "fixed"
    elToast.style.bottom = "20px"
    elToast.style.right = "20px"
    elToast.style.padding = "12px 18px"
    elToast.style.borderRadius = "8px"
    elToast.style.color = "#fff"
    elToast.style.fontSize = "14px"
    elToast.style.zIndex = "9999"
    elToast.style.minWidth = "220px"
    elToast.style.overflow = "hidden"
    elToast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)"
    elToast.style.cursor = "default"
    if (type === "success") {
      elToast.style.background = "green"
    } else if (type === "error") {
      elToast.style.background = "red"
    } else {
      elToast.style.background = "gray"
    }
    const progress = document.createElement("div")
    progress.style.position = "absolute"
    progress.style.bottom = "0"
    progress.style.left = "0"
    progress.style.height = "4px"
    progress.style.background = "rgba(255,255,255,0.8)"
    progress.style.width = "100%"
    progress.style.transition = "width linear"
    elToast.appendChild(progress)
    document.body.appendChild(elToast)
    let duration = 3000
    let start = Date.now()
    let remaining = duration
    let timer
    function startAnim(time) {
      progress.style.transition = `width ${time}ms linear`
      progress.style.width = "0%"
      timer = setTimeout(() => {
        elToast.remove()
      }, time)
    }
    function pauseAnim() {
      clearTimeout(timer)
      let elapsed = Date.now() - start
      remaining = remaining - elapsed
      progress.style.transition = "none"
      progress.style.width = getComputedStyle(progress).width
    }
    function resumeAnim() {
      start = Date.now()
      progress.style.transition = `width ${remaining}ms linear`
      progress.style.width = "0%"
      timer = setTimeout(() => {
        elToast.remove()
      }, remaining)
    }
    startAnim(duration)
    elToast.addEventListener("mouseenter", pauseAnim)
    elToast.addEventListener("mouseleave", resumeAnim)
  }
