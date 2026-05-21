/* ══════════════════════════════════════════════════════════
   ANGKATAN 25 — EKONOMI PEMBANGUNAN FEB UNISBA
   script.js — Interactions & Animations
   ══════════════════════════════════════════════════════════ */

"use strict";

/* ──────────────────────────────────────────
   LOADER
────────────────────────────────────────── */
(function initLoader() {
  const loader   = document.getElementById("loader");
  const bar      = document.getElementById("loaderBar");
  if (!loader || !bar) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add("hidden");
        document.body.style.overflow = "";
        // Try autoplay after loader
        tryAutoplay();
      }, 400);
    }
    bar.style.width = progress + "%";
  }, 80);

  // Prevent scroll during load
  document.body.style.overflow = "hidden";

  // Fallback: hide loader after 4s no matter what
  setTimeout(() => {
    loader.classList.add("hidden");
    document.body.style.overflow = "";
    tryAutoplay();
  }, 4000);
})();

/* ──────────────────────────────────────────
   CUSTOM CURSOR
────────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  // Smooth follower
  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + "px";
    follower.style.top  = followerY + "px";
    requestAnimationFrame(animateFollower);
  })();

  // Hover effect on interactive elements
  const interactiveEls = "a, button, .gallery-item, .member-card, .contact-card, .filter-btn";
  document.querySelectorAll(interactiveEls).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hovering");
      follower.classList.add("hovering");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hovering");
      follower.classList.remove("hovering");
    });
  });
})();

/* ──────────────────────────────────────────
   NAVBAR
────────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById("navbar");
  const navMenu  = document.getElementById("navMenu");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  if (!navbar) return;

  // Scroll effect
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });

  // Mobile menu toggle
  if (navMenu && mobileMenu) {
    navMenu.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
    });

    // Close on link click
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }
})();

/* ──────────────────────────────────────────
   SMOOTH SCROLL
────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ──────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
────────────────────────────────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Stagger children if grid
          const children = entry.target.querySelectorAll(".member-card, .contact-card, .gallery-item");
          children.forEach((child, i) => {
            child.style.transitionDelay = i * 0.07 + "s";
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ──────────────────────────────────────────
   COUNTER ANIMATION
────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll(".stat-num");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start  = performance.now();

        function update(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutExpo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
})();

/* ──────────────────────────────────────────
   MUSIC PLAYER
────────────────────────────────────────── */
function tryAutoplay() {
  const audio    = document.getElementById("bgMusic");
  const musicBtn = document.getElementById("musicBtn");
  const iconPlay = document.getElementById("iconPlay");
  const iconMute = document.getElementById("iconMute");
  const wave     = document.getElementById("musicWave");
  if (!audio) return;

  audio.volume = 0.35;

  function setPlaying(isPlaying) {
    if (isPlaying) {
      iconPlay.style.display = "none";
      iconMute.style.display = "block";
      wave && wave.classList.add("playing");
    } else {
      iconPlay.style.display = "block";
      iconMute.style.display = "none";
      wave && wave.classList.remove("playing");
    }
  }

  // Try autoplay
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => setPlaying(true))
      .catch(() => {
        // Autoplay blocked — wait for user interaction
        setPlaying(false);
        const unlock = () => {
          audio.play().then(() => setPlaying(true)).catch(() => {});
          document.removeEventListener("click", unlock);
          document.removeEventListener("keydown", unlock);
        };
        document.addEventListener("click", unlock);
        document.addEventListener("keydown", unlock);
      });
  }

  // Toggle button
  if (musicBtn) {
    musicBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (audio.paused) {
        audio.play().then(() => setPlaying(true)).catch(() => {});
      } else {
        audio.pause();
        setPlaying(false);
      }
    });
  }
}

/* ──────────────────────────────────────────
   MEMBER FILTER
────────────────────────────────────────── */
(function initFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards      = document.querySelectorAll(".member-card");
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Active state
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const role = card.dataset.role;
        const show = filter === "all" || role === filter;

        if (show) {
          card.classList.remove("hidden");
          card.style.animation = "none";
          card.offsetHeight; // reflow
          card.style.animation = "";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
})();

/* ──────────────────────────────────────────
   PARALLAX on Hero image (subtle)
────────────────────────────────────────── */
(function initParallax() {
  const hero = document.querySelector(".hero-img");
  if (!hero) return;

  // Only on desktop to save mobile battery
  if (window.innerWidth < 768) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      hero.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
    }
  }, { passive: true });
})();

/* ──────────────────────────────────────────
   ACTIVE NAV LINK on scroll
────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sTop = section.offsetTop - 120;
      if (window.scrollY >= sTop) current = section.getAttribute("id");
    });

    navLinks.forEach((link) => {
      link.classList.remove("active-nav");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active-nav");
      }
    });
  }, { passive: true });
})();

/* ──────────────────────────────────────────
   GALLERY LIGHTBOX (simple)
────────────────────────────────────────── */
(function initLightbox() {
  // Create lightbox elements
  const lb = document.createElement("div");
  lb.id = "lightbox";
  lb.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9990;
    display:none;align-items:center;justify-content:center;cursor:zoom-out;
    backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  `;

  const lbImg = document.createElement("img");
  lbImg.style.cssText = `
    max-width:90vw;max-height:88vh;object-fit:contain;
    border:1px solid rgba(201,168,76,0.2);animation:lbFade .3s ease;
  `;

  const lbClose = document.createElement("button");
  lbClose.innerHTML = "×";
  lbClose.style.cssText = `
    position:absolute;top:20px;right:30px;font-size:2.5rem;
    color:rgba(201,168,76,0.7);background:none;border:none;cursor:pointer;
    font-family:'Cormorant Garamond',serif;line-height:1;transition:color .3s;
  `;
  lbClose.addEventListener("mouseenter", () => lbClose.style.color = "#e8c97a");
  lbClose.addEventListener("mouseleave", () => lbClose.style.color = "rgba(201,168,76,0.7)");

  const style = document.createElement("style");
  style.textContent = `@keyframes lbFade{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}`;
  document.head.appendChild(style);

  lb.appendChild(lbImg);
  lb.appendChild(lbClose);
  document.body.appendChild(lb);

  function openLb(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || "";
    lb.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeLb() {
    lb.style.display = "none";
    document.body.style.overflow = "";
  }

  lb.addEventListener("click", (e) => { if (e.target === lb || e.target === lbClose) closeLb(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

  // Attach to gallery images
  document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLb(img.src, img.alt));
  });
})();

/* ──────────────────────────────────────────
   UTILITY: Add active-nav style dynamically
────────────────────────────────────────── */
(function addActiveNavStyle() {
  const style = document.createElement("style");
  style.textContent = `.nav-links a.active-nav { color: var(--gold); }
  .nav-links a.active-nav::after { width: 100%; }`;
  document.head.appendChild(style);
})();
