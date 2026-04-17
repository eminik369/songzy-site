/* =================================================================
   SONGZY -- Master JavaScript (Global)
   Production-ready vanilla JS for the Songzy landing page.
   No frameworks, no jQuery. ES6+ with graceful fallbacks.

   Module order:
     util -> navbar scroll -> mobile menu -> smooth scroll ->
     counters -> scroll reveal -> scroll progress -> FAQ accordion ->
     genre filter -> audio player -> currency toggle -> tilt ->
     testimonial carousel -> marquee autoplay
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ---------------------------------------------------------------
     UTILITY HELPERS (global-ish, module-scoped)
     --------------------------------------------------------------- */

  /** Safe querySelector that returns null without errors */
  function qs(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  /** Safe querySelectorAll that returns an array */
  function qsa(selector, parent) {
    return Array.from((parent || document).querySelectorAll(selector));
  }

  /** Debounce: collapse rapid calls into one trailing invocation */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /** Throttle: guarantee fn runs at most once per `limit` ms */
  function throttle(fn, limit) {
    let inThrottle = false;
    let lastArgs = null;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
          if (lastArgs) {
            fn.apply(this, lastArgs);
            lastArgs = null;
          }
        }, limit);
      } else {
        lastArgs = args;
      }
    };
  }

  /** Format number with comma separators: 12800 -> "12,800" */
  function formatNumber(n, decimals) {
    const d = decimals || 0;
    const fixed = n.toFixed(d);
    const [whole, frac] = fixed.split('.');
    const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return frac !== undefined ? withCommas + '.' + frac : withCommas;
  }

  /** Check if viewport is mobile-width */
  function isMobile() {
    return window.innerWidth < 768;
  }

  /** Detect touch-capable devices (used to disable hover tilt) */
  function isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );
  }

  /** Ease-out cubic: fast start, gentle stop */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /** Honor user preference for reduced motion */
  const PREFERS_REDUCED_MOTION = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Expose utils on a single namespace for cross-module reuse / debugging
  window.SongzyUtil = {
    qs, qsa, debounce, throttle, formatNumber,
    isMobile, isTouchDevice, easeOutCubic,
    prefersReducedMotion: PREFERS_REDUCED_MOTION,
  };


  /* =================================================================
     1. NAVBAR SCROLL EFFECT
     Add/remove "scrolled" class on .nav when user scrolls past 100px.
     ================================================================= */
  (function navbarScrollModule() {
    const nav = qs('.nav') || qs('#nav');
    if (!nav) return;

    const SCROLL_THRESHOLD = 100;
    let lastY = 0;
    let ticking = false;

    function update() {
      nav.classList.toggle('scrolled', lastY > SCROLL_THRESHOLD);
      ticking = false;
    }

    function onScroll() {
      lastY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();


  /* =================================================================
     2. MOBILE MENU TOGGLE
     Toggle hamburger open/close. Close on link click & outside click.
     ================================================================= */
  (function mobileMenuModule() {
    const hamburger = qs('#nav-hamburger') || qs('.nav__hamburger');
    const mobileMenu = qs('#nav-mobile-menu') || qs('.nav__mobile-menu');
    if (!hamburger || !mobileMenu) return;

    function closeMenu() {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    function openMenu() {
      mobileMenu.classList.add('open');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    function toggleMenu() {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    qsa('a', mobileMenu).forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });
  })();


  /* =================================================================
     3. SMOOTH SCROLLING
     All anchor links (#section-id) scroll smoothly with 80px offset
     for the fixed navbar.
     ================================================================= */
  (function smoothScrollModule() {
    const NAV_OFFSET = 80;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = qs(hash);
      if (!target) return;

      e.preventDefault();
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

      window.scrollTo({
        top: targetTop,
        behavior: PREFERS_REDUCED_MOTION ? 'auto' : 'smooth',
      });

      if (history.pushState) history.pushState(null, null, hash);
    });
  })();


  /* =================================================================
     4. COUNTER ANIMATION
     Elements with class ".counter" and data-target animate from 0 to
     target when scrolled into view. 2-second duration with easing.
     Supports data-prefix, data-suffix, data-decimals.
     ================================================================= */
  (function counterModule() {
    const counters = qsa('.counter');
    if (counters.length === 0) return;

    const DURATION = 2000;

    function animateCounter(el) {
      const target = parseFloat(el.dataset.target);
      if (isNaN(target)) return;

      const decimals = parseInt(el.dataset.decimals, 10) || 0;
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';

      if (PREFERS_REDUCED_MOTION) {
        el.textContent = prefix + formatNumber(target, decimals) + suffix;
        return;
      }

      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / DURATION, 1);
        const eased = easeOutCubic(progress);
        const value = eased * target;
        el.textContent = prefix + formatNumber(value, decimals) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      counters.forEach((c) => observer.observe(c));
    } else {
      counters.forEach(animateCounter);
    }
  })();


  /* =================================================================
     5. SCROLL REVEAL ANIMATIONS
     - Legacy: ".fade-in" -> add ".visible" / ".is-visible".
     - Extended: [data-reveal="fade|slide-up|zoom-in"] with optional
       [data-reveal-delay="150"] (ms) for stagger.
     Respects prefers-reduced-motion (elements appear instantly).
     ================================================================= */
  (function scrollRevealModule() {
    const legacy = qsa('.fade-in');
    const modern = qsa('[data-reveal]');
    const all = [...new Set([...legacy, ...modern])];
    if (all.length === 0) return;

    function revealNow(el) {
      el.classList.add('visible', 'is-visible', 'is-revealed');
      // Stagger any legacy .stagger children
      qsa('.stagger', el).forEach((child, i) => {
        child.style.transitionDelay = i * 100 + 'ms';
        child.classList.add('visible', 'is-visible');
      });
    }

    // Reduced motion: reveal everything immediately
    if (PREFERS_REDUCED_MOTION || !('IntersectionObserver' in window)) {
      all.forEach(revealNow);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.revealDelay, 10) || 0;
          if (delay > 0) el.style.transitionDelay = delay + 'ms';
          revealNow(el);
          observer.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );

    all.forEach((el) => observer.observe(el));
  })();


  /* =================================================================
     6. SCROLL PROGRESS BAR
     Top gradient bar whose width = scrollY / (scrollHeight - innerHeight).
     rAF-throttled. Creates .scroll-progress if missing.
     ================================================================= */
  (function scrollProgressModule() {
    let bar = qs('.scroll-progress') || qs('#scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress';
      bar.setAttribute('aria-hidden', 'true');
      bar.style.cssText =
        'position:fixed;top:0;left:0;height:3px;z-index:10001;' +
        'background:linear-gradient(90deg,#FF6B35,#E91E8C,#7B2FF7);' +
        'width:0%;transition:width 0.1s linear;pointer-events:none;' +
        'border-radius:0 2px 2px 0;';
      document.body.appendChild(bar);
    }

    let ticking = false;

    function update() {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        bar.style.width = '0%';
      } else {
        const percent = Math.min((window.scrollY / docHeight) * 100, 100);
        bar.style.width = percent + '%';
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener('resize', debounce(update, 100), { passive: true });
    update();
  })();


  /* =================================================================
     7. FAQ ACCORDION
     Click ".faq-question" toggles ".active" on parent ".faq-item".
     Only one item open at a time. Keyboard: Enter / Space.
     ================================================================= */
  (function faqAccordionModule() {
    const faqItems = qsa('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach((item) => {
      const question = qs('.faq-question', item);
      const answer = qs('.faq-answer', item);
      if (!question) return;

      if (answer) {
        answer.style.overflow = 'hidden';
        answer.style.transition =
          'max-height 0.35s ease, opacity 0.35s ease';
        if (!item.classList.contains('active')) {
          answer.style.maxHeight = '0';
          answer.style.opacity = '0';
        } else {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.opacity = '1';
        }
      }

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach((other) => {
          if (other !== item && other.classList.contains('active')) {
            other.classList.remove('active');
            const oa = qs('.faq-answer', other);
            if (oa) {
              oa.style.maxHeight = '0';
              oa.style.opacity = '0';
            }
          }
        });

        if (isActive) {
          item.classList.remove('active');
          if (answer) {
            answer.style.maxHeight = '0';
            answer.style.opacity = '0';
          }
        } else {
          item.classList.add('active');
          if (answer) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.opacity = '1';
          }
        }
      });

      // Keyboard accessibility
      question.setAttribute('role', 'button');
      if (!question.hasAttribute('tabindex')) {
        question.setAttribute('tabindex', '0');
      }
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  })();


  /* =================================================================
     8. GENRE FILTER TABS
     Click filter btn filters .song-card / [data-audio-card] by
     data-genre. "all" shows everything. Smooth fade transitions.
     ================================================================= */
  (function genreFilterModule() {
    const filterContainer =
      qs('.audio-examples__filters') || qs('[data-genre-filters]');
    if (!filterContainer) return;

    const buttons = qsa('.audio-examples__filter-btn', filterContainer);
    const cards = qsa('.song-card, [data-audio-card]');
    if (buttons.length === 0 || cards.length === 0) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const filter =
          btn.dataset.filter || btn.getAttribute('data-filter') || 'all';

        cards.forEach((card) => {
          const genre =
            card.dataset.genre || card.getAttribute('data-genre');
          const shouldShow = filter === 'all' || genre === filter;

          if (shouldShow) {
            card.classList.remove('is-hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.transition =
                  'opacity 0.35s ease, transform 0.35s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            });
          } else {
            card.style.transition =
              'opacity 0.2s ease, transform 0.2s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => card.classList.add('is-hidden'), 200);
          }
        });
      });
    });
  })();


  /* =================================================================
     9. AUDIO PLAYER (UI-only)
     Click anywhere on .song-card / [data-audio-card] (or its play
     button) toggles .is-playing + swaps play/pause icon. Only one
     card may be playing at a time -- starting a new one stops the
     others. No real audio is loaded -- purely visual simulation of
     state (waveform class is toggled via .is-playing on the card).
     ================================================================= */
  (function audioPlayerModule() {
    const cards = qsa('.song-card, [data-audio-card]');
    if (cards.length === 0) return;

    const PLAY_SVG =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="6,3 20,12 6,21"/></svg>';
    const PAUSE_SVG =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect x="5" y="3" width="4" height="18"/>' +
      '<rect x="15" y="3" width="4" height="18"/></svg>';

    function stopAll(except) {
      cards.forEach((card) => {
        if (card === except) return;
        if (card.classList.contains('is-playing') || card.classList.contains('playing')) {
          card.classList.remove('is-playing', 'playing');
          const btn = qs('.song-card__play-btn, [data-audio-toggle]', card);
          if (btn) btn.innerHTML = PLAY_SVG;
          btn && btn.setAttribute('aria-pressed', 'false');
        }
      });
    }

    function toggleCard(card) {
      const btn = qs('.song-card__play-btn, [data-audio-toggle]', card);
      const isPlaying =
        card.classList.contains('is-playing') ||
        card.classList.contains('playing');

      if (isPlaying) {
        card.classList.remove('is-playing', 'playing');
        if (btn) {
          btn.innerHTML = PLAY_SVG;
          btn.setAttribute('aria-pressed', 'false');
        }
      } else {
        stopAll(card);
        card.classList.add('is-playing', 'playing');
        if (btn) {
          btn.innerHTML = PAUSE_SVG;
          btn.setAttribute('aria-pressed', 'true');
        }
      }
    }

    cards.forEach((card) => {
      const btn = qs('.song-card__play-btn, [data-audio-toggle]', card);
      if (btn) {
        btn.setAttribute('aria-pressed', 'false');
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleCard(card);
        });
      }
      // Clicks on the card cover (but not on inner interactive children)
      // also trigger play/pause for convenience.
      card.addEventListener('click', (e) => {
        if (e.target.closest('a, button, input, textarea')) return;
        toggleCard(card);
      });
    });
  })();


  /* =================================================================
     10. CURRENCY TOGGLE (EUR / GBP) -- GLOBAL
     Syncs every [data-currency-target] (data-eur, data-gbp),
     every [data-currency-symbol], and every toggle UI
     ([data-currency-toggle] or .currency-toggle).
     Persists choice in localStorage "songzy.currency".
     Listens to `storage` event for cross-tab sync.
     ================================================================= */
  (function currencyModule() {
    const STORAGE_KEY = 'songzy.currency';
    const SYMBOLS = { EUR: '€', GBP: '£' };
    const VALID = ['EUR', 'GBP'];

    function getCurrency() {
      const stored = localStorage.getItem(STORAGE_KEY);
      return VALID.indexOf(stored) !== -1 ? stored : 'EUR';
    }

    function applyCurrency(currency) {
      if (VALID.indexOf(currency) === -1) return;

      // Update every price target
      qsa('[data-currency-target]').forEach((el) => {
        const eur = el.getAttribute('data-eur');
        const gbp = el.getAttribute('data-gbp');
        const val = currency === 'GBP' ? gbp : eur;
        if (val != null) el.textContent = val;
      });

      // Update every standalone symbol element
      qsa('[data-currency-symbol]').forEach((el) => {
        el.textContent = SYMBOLS[currency];
      });

      // Sync toggle UI state (buttons, segmented controls, indicators)
      qsa('[data-currency-toggle], .currency-toggle').forEach((toggle) => {
        toggle.setAttribute('data-currency', currency);
        toggle.classList.toggle('is-eur', currency === 'EUR');
        toggle.classList.toggle('is-gbp', currency === 'GBP');

        qsa('[data-currency-option]', toggle).forEach((opt) => {
          const optCur = opt.getAttribute('data-currency-option');
          const active = optCur === currency;
          opt.classList.toggle('is-active', active);
          opt.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
      });

      // Reflect on <html> for any CSS hooks
      document.documentElement.setAttribute('data-currency', currency);

      // Public event so other modules can react if needed
      document.dispatchEvent(
        new CustomEvent('songzy:currencychange', {
          detail: { currency, symbol: SYMBOLS[currency] },
        })
      );
    }

    function setCurrency(currency, opts) {
      if (VALID.indexOf(currency) === -1) return;
      localStorage.setItem(STORAGE_KEY, currency);
      applyCurrency(currency);
      // `opts.silent` true = don't re-dispatch (future-proofing)
    }

    // Wire up toggles (options + generic click-to-cycle)
    qsa('[data-currency-toggle], .currency-toggle').forEach((toggle) => {
      const options = qsa('[data-currency-option]', toggle);
      if (options.length > 0) {
        options.forEach((opt) => {
          opt.addEventListener('click', (e) => {
            e.preventDefault();
            const cur = opt.getAttribute('data-currency-option');
            setCurrency(cur);
          });
        });
      } else {
        // No explicit options: click the toggle cycles EUR <-> GBP
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          setCurrency(getCurrency() === 'EUR' ? 'GBP' : 'EUR');
        });
      }
    });

    // Cross-tab sync
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && VALID.indexOf(e.newValue) !== -1) {
        applyCurrency(e.newValue);
      }
    });

    // Apply the initial state
    applyCurrency(getCurrency());

    // Public API
    window.SongzyCurrency = {
      get: getCurrency,
      set: setCurrency,
      apply: applyCurrency,
    };
  })();


  /* =================================================================
     11. TILT MODULE
     For any [data-tilt] element: mousemove -> subtle rotateX/rotateY
     (max 6deg) with perspective. Reset on mouseleave. Disabled on
     touch devices and when prefers-reduced-motion is set.
     Backwards-compat: also applies to legacy .pricing-card /
     .pricing__card if no [data-tilt] present on them.
     ================================================================= */
  (function tiltModule() {
    if (isTouchDevice() || PREFERS_REDUCED_MOTION) return;

    const explicit = qsa('[data-tilt]');
    const legacy = qsa('.pricing-card, .pricing__card').filter(
      (el) => !el.hasAttribute('data-tilt')
    );
    const elements = [...explicit, ...legacy];
    if (elements.length === 0) return;

    const MAX_TILT = 6; // degrees
    const PERSPECTIVE = 1000; // px

    elements.forEach((el) => {
      const max = parseFloat(el.getAttribute('data-tilt-max')) || MAX_TILT;
      el.style.transition = 'transform 0.15s ease';
      el.style.transformStyle = 'preserve-3d';
      el.style.willChange = 'transform';

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const nx = (x - rect.width / 2) / (rect.width / 2);
        const ny = (y - rect.height / 2) / (rect.height / 2);

        const tiltX = -ny * max;
        const tiltY = nx * max;

        el.style.transform =
          'perspective(' + PERSPECTIVE + 'px) ' +
          'rotateX(' + tiltX.toFixed(2) + 'deg) ' +
          'rotateY(' + tiltY.toFixed(2) + 'deg) ' +
          'scale3d(1.02,1.02,1.02)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform =
          'perspective(' + PERSPECTIVE + 'px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });
  })();


  /* =================================================================
     12. TESTIMONIAL CAROUSEL
     Horizontal scroll with left/right arrows. Auto-scroll every 5s.
     Pause on hover. Active dot indicator. Touch/swipe for mobile.
     ================================================================= */
  (function testimonialCarouselModule() {
    const track =
      qs('.testimonial-carousel__track') || qs('.testimonials__track');
    const prevBtn =
      qs('.testimonial-carousel__prev') || qs('.testimonials__prev');
    const nextBtn =
      qs('.testimonial-carousel__next') || qs('.testimonials__next');
    const dotsContainer =
      qs('.testimonial-carousel__dots') || qs('.testimonials__dots');

    if (!track) return;

    const cards = qsa('.testimonial-card, .testimonials__card', track);
    const items = cards.length > 0 ? cards : Array.from(track.children);
    if (items.length === 0) return;

    let currentIndex = 0;
    let autoScrollTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    function getVisibleCount() {
      if (!items[0]) return 1;
      const trackWidth = track.offsetWidth;
      const itemWidth = items[0].offsetWidth;
      const gap = parseInt(getComputedStyle(track).gap) || 0;
      return Math.max(1, Math.round(trackWidth / (itemWidth + gap)));
    }

    function getMaxIndex() {
      return Math.max(0, items.length - getVisibleCount());
    }

    function scrollToIndex(index) {
      currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
      if (items[currentIndex]) {
        const scrollLeft =
          items[currentIndex].offsetLeft - track.offsetLeft;
        track.scrollTo({
          left: scrollLeft,
          behavior: PREFERS_REDUCED_MOTION ? 'auto' : 'smooth',
        });
      }
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = qsa(
        '.testimonial-carousel__dot, .testimonials__dot, [data-dot]',
        dotsContainer
      );
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
        dot.classList.toggle('is-active', i === currentIndex);
      });
    }

    function initDots() {
      if (!dotsContainer || dotsContainer.children.length > 0) return;
      const maxIdx = getMaxIndex();
      for (let i = 0; i <= maxIdx; i++) {
        const dot = document.createElement('button');
        dot.className = 'testimonial-carousel__dot';
        dot.setAttribute('data-dot', String(i));
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => scrollToIndex(i));
        dotsContainer.appendChild(dot);
      }
    }

    function startAutoScroll() {
      if (PREFERS_REDUCED_MOTION) return;
      stopAutoScroll();
      autoScrollTimer = setInterval(() => {
        const next =
          currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
        scrollToIndex(next);
      }, 5000);
    }

    function stopAutoScroll() {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    }

    if (prevBtn)
      prevBtn.addEventListener('click', () => {
        scrollToIndex(currentIndex - 1);
        startAutoScroll();
      });
    if (nextBtn)
      nextBtn.addEventListener('click', () => {
        scrollToIndex(currentIndex + 1);
        startAutoScroll();
      });

    track.addEventListener('mouseenter', stopAutoScroll);
    track.addEventListener('mouseleave', startAutoScroll);

    track.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoScroll();
      },
      { passive: true }
    );
    track.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        const SWIPE = 50;
        if (Math.abs(diff) > SWIPE) {
          scrollToIndex(diff > 0 ? currentIndex + 1 : currentIndex - 1);
        }
        startAutoScroll();
      },
      { passive: true }
    );

    let scrollSyncTimer = null;
    track.addEventListener(
      'scroll',
      () => {
        clearTimeout(scrollSyncTimer);
        scrollSyncTimer = setTimeout(() => {
          if (!items[0]) return;
          const itemWidth =
            items[0].offsetWidth +
            (parseInt(getComputedStyle(track).gap) || 0);
          currentIndex = Math.round(track.scrollLeft / itemWidth);
          currentIndex = Math.max(
            0,
            Math.min(currentIndex, getMaxIndex())
          );
          updateDots();
        }, 100);
      },
      { passive: true }
    );

    initDots();
    updateDots();
    startAutoScroll();
  })();


  /* =================================================================
     13. MARQUEE AUTOPLAY (optional)
     For any [data-marquee] strip: duplicates inner children once so
     the translateX animation can loop seamlessly. Animation itself
     is expected to live in CSS (e.g. a keyframe on [data-marquee]).
     Honors prefers-reduced-motion by disabling the animation.
     ================================================================= */
  (function marqueeAutoplayModule() {
    const marquees = qsa('[data-marquee]');
    if (marquees.length === 0) return;

    marquees.forEach((marquee) => {
      if (PREFERS_REDUCED_MOTION) {
        marquee.style.animation = 'none';
        return;
      }

      const inner = qs('[data-marquee-track]', marquee) || marquee;
      // Avoid doubling twice on re-init
      if (inner.dataset.marqueeCloned === 'true') return;

      const children = Array.from(inner.children);
      if (children.length === 0) return;

      children.forEach((child) => {
        const clone = child.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        inner.appendChild(clone);
      });
      inner.dataset.marqueeCloned = 'true';
    });
  })();


  /* =================================================================
     INITIALIZATION COMPLETE
     All modules are self-contained and no-op when their DOM hooks
     are absent, so this file is safe to include on every page.
     ================================================================= */
});
