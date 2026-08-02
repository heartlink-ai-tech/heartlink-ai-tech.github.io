/* =========================================================
   HEARTLINK AI — Main JavaScript
   File: js/main.js
   Version: 2.0
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) =>
    Array.from(context.querySelectorAll(selector));

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     Header scroll state
     --------------------------------------------------------- */
  const header = $("#header");

  const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------- */
  const mobileButton = $("#mobileButton");
  const mobileMenu = $("#mobileMenu");

  const setMenuState = (open) => {
    if (!mobileButton || !mobileMenu) return;

    mobileButton.setAttribute("aria-expanded", String(open));
    mobileButton.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );

    mobileMenu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  };

  if (mobileButton && mobileMenu) {
    mobileButton.addEventListener("click", () => {
      const isOpen =
        mobileButton.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    $$("a", mobileMenu).forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });

    document.addEventListener("click", (event) => {
      const isOpen =
        mobileButton.getAttribute("aria-expanded") === "true";

      if (
        isOpen &&
        !mobileMenu.contains(event.target) &&
        !mobileButton.contains(event.target)
      ) {
        setMenuState(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        setMenuState(false);
      }
    });
  }

  /* ---------------------------------------------------------
     Smooth internal navigation
     --------------------------------------------------------- */
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = $(href);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      if (history.pushState) {
        history.pushState(null, "", href);
      }
    });
  });

  /* ---------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------- */
  const faqButtons = $$(".faq-question");

  const closeFaq = (button) => {
    const item = button.closest(".faq-item");
    const answer = item ? $(".faq-answer", item) : null;

    button.setAttribute("aria-expanded", "false");

    if (answer) {
      answer.hidden = true;
    }
  };

  const openFaq = (button) => {
    const item = button.closest(".faq-item");
    const answer = item ? $(".faq-answer", item) : null;

    button.setAttribute("aria-expanded", "true");

    if (answer) {
      answer.hidden = false;
    }
  };

  faqButtons.forEach((button, index) => {
    const item = button.closest(".faq-item");
    const answer = item ? $(".faq-answer", item) : null;

    if (answer) {
      const buttonId = button.id || `faq-question-${index + 1}`;
      const answerId = answer.id || `faq-answer-${index + 1}`;

      button.id = buttonId;
      answer.id = answerId;

      button.setAttribute("aria-controls", answerId);
      answer.setAttribute("role", "region");
      answer.setAttribute("aria-labelledby", buttonId);
      answer.hidden = true;
    }

    button.addEventListener("click", () => {
      const expanded =
        button.getAttribute("aria-expanded") === "true";

      faqButtons.forEach((otherButton) => {
        if (otherButton !== button) {
          closeFaq(otherButton);
        }
      });

      if (expanded) {
        closeFaq(button);
      } else {
        openFaq(button);
      }
    });
  });

  /* ---------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------- */
  const revealGroups = [
    {
      selector: ".section-title",
      className: "reveal-ready",
    },
    {
      selector: ".feature-card",
      className: "reveal-ready",
      stagger: true,
    },
    {
      selector: ".step-card",
      className: "reveal-ready",
      stagger: true,
    },
    {
      selector: ".statistics-card",
      className: "reveal-ready",
      stagger: true,
    },
    {
      selector: ".language-card",
      className: "reveal-ready",
      stagger: true,
    },
    {
      selector: ".preview-left",
      className: "reveal-left reveal-ready",
    },
    {
      selector: ".preview-right",
      className: "reveal-right reveal-ready",
    },
    {
      selector: ".secret-image",
      className: "reveal-left reveal-ready",
    },
    {
      selector: ".secret-content",
      className: "reveal-right reveal-ready",
    },
    {
      selector: ".faq-item",
      className: "reveal-ready",
      stagger: true,
    },
    {
      selector: ".cta-box",
      className: "reveal-scale reveal-ready",
    },
  ];

  const revealElements = [];

  revealGroups.forEach((group) => {
    $$(group.selector).forEach((element, index) => {
      group.className
        .split(" ")
        .filter(Boolean)
        .forEach((className) => element.classList.add(className));

      if (group.stagger) {
        const staggerIndex = (index % 6) + 1;
        element.classList.add(`stagger-${staggerIndex}`);
      }

      revealElements.push(element);
    });
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px",
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* ---------------------------------------------------------
     Scroll-to-top button
     --------------------------------------------------------- */
  const scrollTopButton = $("#scrollTop");

  const updateScrollTop = () => {
    if (!scrollTopButton) return;

    scrollTopButton.hidden = window.scrollY < 650;
  };

  if (scrollTopButton) {
    updateScrollTop();

    window.addEventListener("scroll", updateScrollTop, {
      passive: true,
    });

    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  /* ---------------------------------------------------------
     Cookie / local-storage notice
     --------------------------------------------------------- */
  const cookieNotice = $("#cookieNotice");
  const acceptCookies = $("#acceptCookies");
  const storageKey = "heartlink_notice_acknowledged";

  const safeStorageGet = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  };

  const safeStorageSet = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (_) {
      /* Storage may be disabled. The website still works. */
    }
  };

  if (cookieNotice) {
    const acknowledged = safeStorageGet(storageKey) === "1";

    if (!acknowledged) {
      window.setTimeout(() => {
        cookieNotice.hidden = false;
      }, prefersReducedMotion ? 0 : 700);
    }
  }

  if (acceptCookies && cookieNotice) {
    acceptCookies.addEventListener("click", () => {
      safeStorageSet(storageKey, "1");
      cookieNotice.hidden = true;
    });
  }

  /* ---------------------------------------------------------
     External links safety
     --------------------------------------------------------- */
  $$('a[target="_blank"]').forEach((link) => {
    const rel = new Set(
      (link.getAttribute("rel") || "")
        .split(/\s+/)
        .filter(Boolean)
    );

    rel.add("noopener");
    rel.add("noreferrer");

    link.setAttribute("rel", Array.from(rel).join(" "));
  });

  /* ---------------------------------------------------------
     Current year
     Keeps copyright current if a year element is later added.
     --------------------------------------------------------- */
  $$("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  /* ---------------------------------------------------------
     Image error protection
     Avoid broken-image icons for optional decorative assets.
     --------------------------------------------------------- */
  $$("img").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        image.classList.add("image-load-error");
      },
      { once: true }
    );
  });

  /* ---------------------------------------------------------
     Keyboard usability for mobile menu
     --------------------------------------------------------- */
  if (mobileButton && mobileMenu) {
    mobileMenu.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;

      const focusable = $$(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        mobileMenu
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        mobileButton.focus();
      }

      if (!event.shiftKey && document.activeElement === last) {
        setMenuState(false);
      }
    });
  }

  /* ---------------------------------------------------------
     Initial page state
     --------------------------------------------------------- */
  document.documentElement.classList.add("js-ready");
})();
