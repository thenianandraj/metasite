/**
 * Metasite Software Solutions – Main interactions
 * Nav, GSAP motion, timeline, contact validation
 *
 * CONTACT FORM: static placeholder — see handleFormSubmit().
 */

(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var navMobile = document.querySelector(".nav-mobile");
  var contactForm = document.getElementById("contact-form");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  function closeMobileNav() {
    if (!navToggle || !navMobile) return;
    navToggle.classList.remove("is-open");
    navMobile.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function toggleMobileNav() {
    if (!navToggle || !navMobile) return;
    var open = !navMobile.classList.contains("is-open");
    navToggle.classList.toggle("is-open", open);
    navMobile.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }

  if (navToggle) navToggle.addEventListener("click", toggleMobileNav);
  if (navMobile) {
    navMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth > 991) closeMobileNav();
  });

  function setActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    if (path === "" || path === "/") path = "index.html";
    document.querySelectorAll(".nav-links a, .nav-mobile a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;
      link.classList.toggle("active", href.split("/").pop() === path);
    });
  }

  setActiveNav();

  /* Hero text line animation */
  function initTextLines() {
    var lines = document.querySelectorAll(".anim-line");
    if (!lines.length) return;

    if (reducedMotion) {
      lines.forEach(function (line) {
        line.classList.add("is-in");
      });
      return;
    }

    lines.forEach(function (line, i) {
      setTimeout(function () {
        line.classList.add("is-in");
      }, 180 + i * 160);
    });
  }

  /* Who We Are circle reveal */
  function initWhoSection() {
    var visual = document.querySelector(".who-visual");
    var copy = document.querySelector(".who-section .who-copy");
    if (!visual && !copy) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      if (visual) visual.classList.add("is-in");
      if (copy) copy.classList.add("is-in");
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.28, rootMargin: "0px 0px -8% 0px" }
    );

    if (visual) obs.observe(visual);
    if (copy) obs.observe(copy);
  }

  /* Timeline / process-step active on scroll */
  function initTimeline() {
    var items = document.querySelectorAll(".timeline-item, .process-step");
    if (!items.length || !("IntersectionObserver" in window)) return;

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible", "is-active");
          } else if (entry.target.classList.contains("process-step")) {
            entry.target.classList.remove("is-active");
          }
        });
      },
      { threshold: 0.4, rootMargin: "0px 0px -12% 0px" }
    );

    items.forEach(function (item) {
      obs.observe(item);
    });
  }

  function revealFallback() {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  function initGsap() {
    if (typeof gsap === "undefined") {
      if (reducedMotion || !("IntersectionObserver" in window)) {
        revealFallback();
        return;
      }
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      document.querySelectorAll(".reveal").forEach(function (el) {
        obs.observe(el);
      });
      return;
    }

    if (reducedMotion) {
      gsap.set(".reveal, .hero-copy > *:not(.display), .hero-visual, .page-hero-glass", {
        clearProps: "all",
        opacity: 1,
        y: 0,
      });
      revealFallback();
      return;
    }

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    gsap.from(".hero-copy .eyebrow, .hero-copy .lead, .hero-copy .btn-group", {
      y: 18,
      opacity: 0,
      duration: 0.55,
      stagger: 0.08,
      delay: 0.35,
      ease: "power3.out",
    });

    if (document.querySelector(".hero-media")) {
      gsap.from(".hero-media", {
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: "power2.out",
      });
    }

    if (document.querySelector(".hero-panel, .hero-trust")) {
      gsap.from(".hero-panel, .hero-trust", {
        opacity: 0,
        y: 14,
        duration: 0.45,
        delay: 0.55,
        ease: "power2.out",
      });
    }

    if (document.querySelector(".page-hero-glass .lead, .page-hero-glass .eyebrow")) {
      gsap.from(".page-hero-glass .eyebrow, .page-hero-glass .lead", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        delay: 0.35,
        ease: "power3.out",
      });
    }

    if (document.querySelector(".page-hero-aside")) {
      gsap.from(".page-hero-aside", {
        opacity: 0,
        x: 28,
        duration: 0.9,
        delay: 0.35,
        ease: "power3.out",
      });
    }

    if (document.querySelector(".solutions-modern")) {
      // handled in scroll section below
    }

    if (typeof ScrollTrigger !== "undefined") {
      gsap.utils.toArray(".reveal").forEach(function (el) {
        gsap.fromTo(
          el,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            onComplete: function () {
              el.classList.add("is-visible");
            },
          }
        );
      });

      /* Unified card enter – Home / Services / Solutions */
      document.querySelectorAll(".ms-grid").forEach(function (grid) {
        gsap.from(grid.querySelectorAll(".ms-card"), {
          y: 12,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: grid, start: "top 88%" },
        });
      });

      if (document.querySelector(".why-showcase-grid")) {
        gsap.fromTo(
          ".why-showcase-center, .why-pillar-left li, .why-pillar-right li",
          { y: 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: { trigger: ".why-showcase-grid", start: "top 85%" },
          }
        );
      }

      if (document.querySelector(".manifesto-list")) {
        gsap.from(".manifesto-list li", {
          y: 12,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: ".manifesto-list", start: "top 90%" },
        });
      }

      if (document.querySelector(".method-rail")) {
        gsap.from(".method-rail-item", {
          y: 12,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: ".method-rail", start: "top 90%" },
        });
      }

      if (document.querySelector(".about-meta")) {
        gsap.from(".about-meta li", {
          y: 12,
          opacity: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: ".about-meta", start: "top 90%" },
        });
      }

      if (document.querySelector(".vision-mission")) {
        gsap.from(".vision-mission .vm-rail", {
          y: 12,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".vision-mission",
            start: "top 88%",
            onEnter: function () {
              document.querySelectorAll(".vm-rail").forEach(function (el) {
                el.classList.add("is-inview");
              });
            },
          },
        });
      }

      if (document.querySelector(".about-steps")) {
        gsap.from(".about-steps li", {
          y: 12,
          opacity: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: ".about-steps", start: "top 90%" },
        });
      }
    } else {
      revealFallback();
    }
  }

  function initPageTransitions() {
    if (reducedMotion || typeof gsap === "undefined") return;

    document.querySelectorAll('a[href$=".html"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (!href || href.startsWith("http") || link.target === "_blank") return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (href.indexOf("#") === 0) return;

        e.preventDefault();
        var overlay = document.createElement("div");
        overlay.className = "page-transition-overlay";
        document.body.appendChild(overlay);
        gsap.fromTo(
          overlay,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.32,
            ease: "power2.inOut",
            onComplete: function () {
              window.location.href = href;
            },
          }
        );
      });
    });
  }

  function boot() {
    initTextLines();
    initWhoSection();
    initTimeline();
    initGsap();
    initPageTransitions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  /* Contact form */
  function showFieldError(group, message) {
    group.classList.add("has-error");
    var msg = group.querySelector(".error-msg");
    if (msg) msg.textContent = message;
  }

  function clearFieldError(group) {
    group.classList.remove("has-error");
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePhone(value) {
    if (!value.trim()) return true;
    return /^[+]?[\d\s()-]{7,20}$/.test(value.trim());
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (!contactForm) return;

    var valid = true;
    var fields = {
      fullName: contactForm.querySelector("#fullName"),
      email: contactForm.querySelector("#email"),
      phone: contactForm.querySelector("#phone"),
      company: contactForm.querySelector("#company"),
      service: contactForm.querySelector("#service"),
      description: contactForm.querySelector("#description"),
    };

    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      if (!field) return;
      var group = field.closest(".form-group");
      if (group) clearFieldError(group);
    });

    if (!fields.fullName.value.trim()) {
      showFieldError(fields.fullName.closest(".form-group"), "Please enter your full name.");
      valid = false;
    }

    if (!fields.email.value.trim()) {
      showFieldError(fields.email.closest(".form-group"), "Please enter your business email.");
      valid = false;
    } else if (!validateEmail(fields.email.value.trim())) {
      showFieldError(fields.email.closest(".form-group"), "Please enter a valid email address.");
      valid = false;
    }

    if (!validatePhone(fields.phone.value)) {
      showFieldError(fields.phone.closest(".form-group"), "Please enter a valid phone number.");
      valid = false;
    }

    if (!fields.service.value) {
      showFieldError(fields.service.closest(".form-group"), "Please select a service.");
      valid = false;
    }

    if (!fields.description.value.trim() || fields.description.value.trim().length < 20) {
      showFieldError(
        fields.description.closest(".form-group"),
        "Please describe your project (at least 20 characters)."
      );
      valid = false;
    }

    if (!valid) {
      var firstError = contactForm.querySelector(".form-group.has-error");
      if (firstError) firstError.querySelector("input, select, textarea").focus();
      return;
    }

    var success = document.getElementById("form-success");
    if (success) {
      success.classList.add("is-visible");
      success.focus();
    }

    contactForm.reset();
    console.info(
      "[Metasite] Form validated successfully. Connect a form service or backend to deliver enquiries."
    );
  }

  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
    contactForm.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        var group = field.closest(".form-group");
        if (group) clearFieldError(group);
      });
    });
  }

  /* Technology circles carousel */
  (function initTechCircles() {
    document.querySelectorAll("[data-tech-circles]").forEach(function (wrap) {
      var track = wrap.querySelector(".tech-circles-track");
      var prev = wrap.querySelector("[data-tech-prev]");
      var next = wrap.querySelector("[data-tech-next]");
      if (!track || !prev || !next) return;

      function step() {
        var item = track.querySelector(".tech-circle");
        return item ? item.offsetWidth + 20 : 160;
      }

      function updateNav() {
        var max = track.scrollWidth - track.clientWidth - 2;
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= max;
      }

      prev.addEventListener("click", function () {
        track.scrollBy({ left: -step() * 2, behavior: reducedMotion ? "auto" : "smooth" });
      });
      next.addEventListener("click", function () {
        track.scrollBy({ left: step() * 2, behavior: reducedMotion ? "auto" : "smooth" });
      });

      track.addEventListener("scroll", updateNav, { passive: true });
      window.addEventListener("resize", updateNav);
      updateNav();
    });
  })();
})();
