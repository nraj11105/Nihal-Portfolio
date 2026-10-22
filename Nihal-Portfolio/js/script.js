// Nihal Raj Portfolio interactions
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Reveal elements on scroll, with a fallback for older browsers.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Keep initials visible if the profile photo has not been uploaded yet.
  const profilePhoto = document.getElementById("profilePhoto");
  const portraitFallback = document.getElementById("portraitFallback");
  if (profilePhoto && portraitFallback) {
    profilePhoto.addEventListener("load", () => { portraitFallback.style.display = "none"; });
    profilePhoto.addEventListener("error", () => { profilePhoto.style.display = "none"; });
    if (profilePhoto.complete && profilePhoto.naturalWidth > 0) {
      portraitFallback.style.display = "none";
    }
  }

  // Scroll progress indicator.
  const progress = document.getElementById("progress");
  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = percent + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Lightweight animated star particles.
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let particles = [];
  let width = 0;
  let height = 0;
  let animationId = null;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(65, Math.floor(width / 20));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.25 + 0.08,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function drawParticles(animate = true) {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(132, 180, 255, 0.55)";
      ctx.fill();
      if (animate) {
        p.y -= p.speed;
        p.x += Math.sin(p.phase) * 0.15;
        p.phase += 0.01;
        if (p.y < -5) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
      }
    });
    if (animate && !reducedMotion) {
      animationId = requestAnimationFrame(() => drawParticles(true));
    }
  }

  function startParticles() {
    if (animationId !== null) cancelAnimationFrame(animationId);
    resizeCanvas();
    drawParticles(!reducedMotion);
  }

  window.addEventListener("resize", startParticles);
  startParticles();
});
