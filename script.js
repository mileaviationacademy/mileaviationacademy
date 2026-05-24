/* ================================================================
   MILE AVIATION ACADEMY — script.js  (Refined v2)
   Premium Interactions · Active Nav · Counters · Slider · Lightbox
================================================================ */

"use strict";

/* ── UTILITY: Run fn after DOM is ready ─────────────────────────── */
function ready(fn) {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn);
}

/* ============================================================
   1. LOADER
   Hides after page load + 1.8s, then triggers hero animations
============================================================ */
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("hidden");
      initHeroAnimations(); // word-by-word reveal after loader
    }
  }, 1800);
});

/* ============================================================
   2. PARTICLES CANVAS
   Drifting gold particles with connecting lines
============================================================ */
function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const ctx  = canvas.getContext("2d");
  const GOLD = "201,168,76";
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const COUNT = 55;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x:     Math.random() * 1000,
      y:     Math.random() * 1000,
      vx:    (Math.random() - 0.5) * 0.28,
      vy:    (Math.random() - 0.5) * 0.28,
      r:     Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.38 + 0.05,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GOLD},${p.alpha})`;
      ctx.fill();

      // Connect close pairs
      for (let j = i + 1; j < particles.length; j++) {
        const q  = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${GOLD},${(1 - d / 120) * 0.07})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}
initParticles();

/* ============================================================
   3. SCROLL PROGRESS BAR
   Thin gold line at very top of viewport
============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = Math.min((scrolled / total) * 100, 100) + "%";
  }, { passive: true });
})();

/* ============================================================
   4. NAVBAR
   - Scrolled glass style after 40px
   - Hamburger mobile menu toggle
   - Active link highlighting via IntersectionObserver
============================================================ */
(function initNavbar() {
  const nav       = document.getElementById("navbar");
  const hamburger = document.getElementById("nav-hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  let menuOpen = false;

  // Scroll: toggle glass style
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  // Hamburger toggle
  hamburger?.addEventListener("click", () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("open", menuOpen);
    hamburger.classList.toggle("open", menuOpen);
    hamburger.setAttribute("aria-expanded", menuOpen);
  });

  // Close mobile menu when a link is clicked
  mobileMenu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuOpen = false;
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  // ── ACTIVE SECTION HIGHLIGHT ──────────────────────────────────
  // Watch each section; update the corresponding nav link
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  const sections = document.querySelectorAll("section[id]");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const match = link.dataset.section === id ||
                      (id === "courses"      && link.dataset.section === "courses") ||
                      (id === "career"       && link.dataset.section === "courses") ||
                      (id === "stats"        && link.dataset.section === "courses") ||
                      (id === "testimonials" && link.dataset.section === "about") ||
                      (id === "gallery"      && link.dataset.section === "about");
        link.classList.toggle("active", link.dataset.section === id || match);
      });
    });
  }, { threshold: 0.35, rootMargin: "-80px 0px -30% 0px" });

  sections.forEach(s => sectionObserver.observe(s));
})();

/* ============================================================
   5. HERO WORD-BY-WORD REVEAL
   Called after loader hides
============================================================ */
function initHeroAnimations() {
  // Word-by-word stagger
  const words = document.querySelectorAll(".word-reveal");
  words.forEach((word, i) => {
    setTimeout(() => word.classList.add("visible"), i * 110);
  });

  // Fade-in elements after words
  const fades = document.querySelectorAll(".reveal-fade");
  fades.forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), 550 + i * 140);
  });

  // Hero image scale-in
  const heroRight = document.querySelector("#hero .reveal-scale");
  if (heroRight) {
    setTimeout(() => heroRight.classList.add("visible"), 350);
  }
}

/* ============================================================
   6. SCROLL-TRIGGERED REVEAL (IntersectionObserver)
   All .reveal-up, .reveal-card, .reveal-scale, .reveal-stat
   outside the hero are animated on scroll entry
============================================================ */
(function initScrollReveal() {
  const options = {
    threshold:  0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || "0");
      setTimeout(() => el.classList.add("visible"), delay);
      observer.unobserve(el);
    });
  }, options);

  // Select all animated elements EXCEPT those in #hero (hero has its own timing)
  const selectors = [
    ".reveal-up",
    ".reveal-card",
    ".reveal-stat",
  ];
  document.querySelectorAll(selectors.join(",")).forEach(el => {
    // Skip hero elements (handled by initHeroAnimations)
    if (!el.closest("#hero")) observer.observe(el);
  });

  // reveal-scale outside hero
  document.querySelectorAll(".reveal-scale").forEach(el => {
    if (!el.closest("#hero")) observer.observe(el);
  });

  // Animate timeline connector line
  const timelineLine = document.getElementById("timeline-line");
  if (timelineLine) {
    const lineObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        timelineLine.classList.add("animated");
        lineObs.disconnect();
      }
    }, { threshold: 0.5 });
    lineObs.observe(timelineLine.closest(".timeline") || timelineLine);
  }
})();

/* ============================================================
   7. ANIMATED COUNTERS
   Numbers count up from 0 to data-target on scroll entry
============================================================ */
(function initCounters() {
  const items = document.querySelectorAll(".stat-item");
  if (!items.length) return;

  function animateCounter(el, target) {
    const duration = 1600;
    const start    = performance.now();
    const ease     = t => 1 - Math.pow(1 - t, 3); // cubic ease-out

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(ease(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const valEl = entry.target.querySelector(".stat-value");
      if (valEl && valEl.dataset.target) {
        animateCounter(valEl, parseInt(valEl.dataset.target));
      }
      // Trigger reveal animation
      setTimeout(() => entry.target.classList.add("visible"),
        parseInt(entry.target.dataset.delay || "0"));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  items.forEach(item => observer.observe(item));
})();

/* ============================================================
   8. TESTIMONIALS SLIDER
   2-up on desktop, 1-up on mobile
   Auto-plays every 5s; stops on manual navigation
============================================================ */
(function initTestimonials() {
  const inner  = document.getElementById("testimonials-inner");
  const dots   = document.getElementById("t-dots");
  const prevBtn = document.getElementById("t-prev");
  const nextBtn = document.getElementById("t-next");

  if (!inner) return;

  const cards = inner.querySelectorAll(".testimonial-card");
  const total  = cards.length;
  let current  = 0;
  let perView  = getPerView();

  function getPerView() {
    return window.innerWidth <= 720 ? 1 : 2;
  }

  // Build dot indicators
  function buildDots() {
    perView = getPerView();
    dots.innerHTML = "";
    const count = Math.ceil(total / perView);
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("div");
      dot.className    = "t-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Go to testimonial group ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dots.appendChild(dot);
    }
  }
  buildDots();

  function updateDots() {
    dots.querySelectorAll(".t-dot").forEach((d, i) => {
      d.classList.toggle("active", i === Math.floor(current / perView));
    });
  }

  function goTo(dotIndex) {
    perView  = getPerView();
    current  = Math.min(dotIndex * perView, total - perView);
    current  = Math.max(0, current);
    // Card width = card flex-basis + gap
    const gap       = 24;
    const cardWidth = cards[0].offsetWidth + gap;
    inner.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  }

  prevBtn?.addEventListener("click", () => {
    stopAuto();
    const prev = Math.floor(current / perView) - 1;
    if (prev >= 0) goTo(prev);
  });

  nextBtn?.addEventListener("click", () => {
    stopAuto();
    const next = Math.floor(current / perView) + 1;
    const max  = Math.ceil(total / perView) - 1;
    if (next <= max) goTo(next);
  });

  // Rebuild on resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(0);
    }, 200);
  }, { passive: true });

  // Auto-play every 5s
  let autoTimer = setInterval(tick, 5000);
  function tick() {
    perView = getPerView();
    const max  = Math.ceil(total / perView) - 1;
    const next = Math.floor(current / perView) + 1;
    goTo(next > max ? 0 : next);
  }
  function stopAuto() { clearInterval(autoTimer); }
})();



/* ============================================================
   10. SMOOTH ANCHOR SCROLLING
   Accounts for fixed navbar height (80px offset)
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href   = this.getAttribute("href");
    const target = document.querySelector(href);
    if (!target || href === "#") return;
    e.preventDefault();
    const navHeight = document.getElementById("navbar")?.offsetHeight || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ============================================================
   11. GALLERY LIGHTBOX
   Click any gallery item to open full-screen zoom
============================================================ */
(function initLightbox() {
  const items = document.querySelectorAll(".gallery-item");
  if (!items.length) return;

  // Build lightbox overlay
  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-label", "Image lightbox");
  lb.style.cssText = [
    "position:fixed;inset:0;z-index:9000;",
    "background:rgba(0,0,0,0.92);",
    "display:flex;align-items:center;justify-content:center;",
    "opacity:0;pointer-events:none;",
    "transition:opacity 0.35s;",
    "cursor:zoom-out;",
    "backdrop-filter:blur(10px);",
  ].join("");

  const lbImg = document.createElement("img");
  lbImg.alt = "Gallery full view";
  lbImg.style.cssText = [
    "max-width:90vw;max-height:88vh;",
    "border-radius:16px;",
    "box-shadow:0 40px 80px rgba(0,0,0,0.8);",
    "transition:transform 0.4s cubic-bezier(0.22,0.61,0.36,1);",
    "transform:scale(0.88);",
  ].join("");

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕";
  closeBtn.setAttribute("aria-label", "Close lightbox");
  closeBtn.style.cssText = [
    "position:absolute;top:1.5rem;right:1.5rem;",
    "width:40px;height:40px;border-radius:50%;",
    "border:1px solid rgba(255,255,255,0.2);",
    "color:#fff;font-size:1rem;",
    "background:rgba(255,255,255,0.1);",
    "cursor:pointer;display:flex;align-items:center;justify-content:center;",
    "transition:background 0.2s;",
  ].join("");
  closeBtn.addEventListener("mouseenter", () => closeBtn.style.background = "rgba(255,255,255,0.2)");
  closeBtn.addEventListener("mouseleave", () => closeBtn.style.background = "rgba(255,255,255,0.1)");

  lb.appendChild(lbImg);
  lb.appendChild(closeBtn);
  document.body.appendChild(lb);

  function openLightbox(src) {
    lbImg.src = src;
    lb.style.opacity       = "1";
    lb.style.pointerEvents = "auto";
    setTimeout(() => { lbImg.style.transform = "scale(1)"; }, 10);
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lb.style.opacity          = "0";
    lb.style.pointerEvents    = "none";
    lbImg.style.transform     = "scale(0.88)";
    document.body.style.overflow = "";
  }

  items.forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (img) openLightbox(img.src);
    });
  });

  lb.addEventListener("click", e => {
    if (e.target === lb || e.target === lbImg) closeLightbox();
  });
  closeBtn.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
  });
})();

/* ============================================================
   12. CURSOR GLOW (desktop only)
   Subtle radial gradient follows mouse
============================================================ */
(function initCursorGlow() {
  if (window.matchMedia("(hover: none)").matches) return;

  const glow = document.createElement("div");
  glow.setAttribute("aria-hidden", "true");
  glow.style.cssText = [
    "position:fixed;width:320px;height:320px;border-radius:50%;",
    "background:radial-gradient(circle,rgba(201,168,76,0.055) 0%,transparent 70%);",
    "pointer-events:none;z-index:1;",
    "transform:translate(-50%,-50%);",
    "transition:left 0.12s,top 0.12s;",
    "will-change:left,top;",
  ].join("");
  document.body.appendChild(glow);

  document.addEventListener("mousemove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top  = e.clientY + "px";
  }, { passive: true });
})();

/* ============================================================
   13. PARALLAX — hero image subtle vertical shift on scroll
============================================================ */
(function initParallax() {
  const heroImg = document.querySelector(".hero-img-frame");
  if (!heroImg || window.matchMedia("(hover:none)").matches) return;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    // Shift slightly upward as user scrolls — subtle depth effect
    heroImg.style.transform = `translateY(${y * 0.05}px)`;
  }, { passive: true });
})();

/* ============================================================
   14. TIMELINE LINE ANIMATION
   Triggered once the #career section scrolls into view
============================================================ */
(function initTimelineAnimation() {
  const line = document.getElementById("timeline-line");
  if (!line) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => line.classList.add("animated"), 300);
      observer.disconnect();
    }
  }, { threshold: 0.4 });

  observer.observe(document.getElementById("career") || line);
})();
