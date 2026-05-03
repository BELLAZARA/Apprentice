/* ═══════════════════════════════════════════════════════════
   KOMU RABBIT DIS — index.js
   Zero event listeners. All interactivity via polling,
   inline handlers set via JS, and RAF loops.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Shared state ─────────────────────────────────────────── */
  var state = {
    scrollY:        0,
    mouseX:         -999,
    mouseY:         -999,
    mobileOpen:     false,
    countDone:      false,
    prevMobileOpen: null,
  };


  /* ════════════════════════════════════════════════════════════
     INLINE HANDLERS  (set once; not addEventListener)
  ════════════════════════════════════════════════════════════ */

  /* Navbar scroll — driven by window.onscroll */
  var nav = document.getElementById('navbar');
  window.onscroll = function () {
    state.scrollY = window.scrollY;
  };

  /* Mouse tracking — driven by document.onmousemove / onmouseleave */
  document.onmousemove = function (e) {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
  };
  document.onmouseleave = function () {
    state.mouseX = -999;
    state.mouseY = -999;
  };

  /* Mobile toggle — onclick set directly on the element */
  var toggleBtn  = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  if (toggleBtn) {
    toggleBtn.onclick = function () {
      state.mobileOpen = !state.mobileOpen;
    };
  }

  /* Close mobile menu when any mobile link is clicked */
  if (mobileMenu) {
    var mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    for (var ml = 0; ml < mobileLinks.length; ml++) {
      mobileLinks[ml].onclick = function () {
        state.mobileOpen = false;
      };
    }
  }

  /* Escape key — driven by document.onkeydown */
  document.onkeydown = function (e) {
    if ((e.key === 'Escape' || e.keyCode === 27) && state.mobileOpen) {
      state.mobileOpen = false;
    }
  };

  /* Smooth scroll for every anchor link — onclick on each */
  var anchors = document.querySelectorAll('a[href^="#"]');
  for (var ai = 0; ai < anchors.length; ai++) {
    (function (anchor) {
      anchor.onclick = function (e) {
        var id     = anchor.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        var navH = nav ? nav.offsetHeight : 0;
        var top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      };
    })(anchors[ai]);
  }

  /* Report card keyboard — onkeydown on each */
  var repCards = document.querySelectorAll('.rep-card[tabindex]');
  for (var ri = 0; ri < repCards.length; ri++) {
    (function (card) {
      card.onkeydown = function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('rep-active');
        }
      };
    })(repCards[ri]);
  }


  /* ════════════════════════════════════════════════════════════
     DASHBOARD BAR ENTRANCE  (double-RAF forces layout flush)
  ════════════════════════════════════════════════════════════ */
  var bars = document.querySelectorAll('.dash-bar');
  for (var bi = 0; bi < bars.length; bi++) {
    bars[bi].style.transform       = 'scaleY(0)';
    bars[bi].style.transformOrigin = 'bottom';
    bars[bi].style.transition      = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    bars[bi].style.transitionDelay = (0.8 + bi * 0.07) + 's';
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      for (var i = 0; i < bars.length; i++) {
        bars[i].style.transform = 'scaleY(1)';
      }
    });
  });


  /* ════════════════════════════════════════════════════════════
     CURSOR DOT  (desktop only — position updated in main RAF loop)
  ════════════════════════════════════════════════════════════ */
  var cursor = null;

  if (window.matchMedia('(pointer: fine)').matches) {
    cursor = document.createElement('div');
    cursor.style.cssText = [
      'position:fixed',
      'width:6px',
      'height:6px',
      'border-radius:50%',
      'background:rgba(200,146,42,0.85)',
      'pointer-events:none',
      'z-index:9999',
      'transform:translate(-50%,-50%)',
      'transition:transform 0.15s,opacity 0.3s',
      'opacity:0'
    ].join(';');
    document.body.appendChild(cursor);

    /* Cursor scale — onmouseenter/onmouseleave (not addEventListener) */
    var hoverEls = document.querySelectorAll('a,button,.feat-card,.rep-card,.role-card');
    for (var hi = 0; hi < hoverEls.length; hi++) {
      (function (el) {
        el.onmouseenter = function () {
          cursor.style.transform  = 'translate(-50%,-50%) scale(3)';
          cursor.style.background = 'rgba(200,146,42,0.4)';
        };
        el.onmouseleave = function () {
          cursor.style.transform  = 'translate(-50%,-50%) scale(1)';
          cursor.style.background = 'rgba(200,146,42,0.85)';
        };
      })(hoverEls[hi]);
    }
  }


  /* ════════════════════════════════════════════════════════════
     SCROLL REVEAL  (IntersectionObserver — not addEventListener)
  ════════════════════════════════════════════════════════════ */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      for (var ei = 0; ei < entries.length; ei++) {
        var entry = entries[ei];
        if (!entry.isIntersecting) continue;

        var siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
        var delay = 0;
        for (var si = 0; si < siblings.length; si++) {
          if (siblings[si] === entry.target) { delay = si; break; }
        }
        entry.target.style.transitionDelay = (delay * 0.07) + 's';
        entry.target.classList.add('visible');
        revealIO.unobserve(entry.target);
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    for (var rvi = 0; rvi < reveals.length; rvi++) {
      revealIO.observe(reveals[rvi]);
    }
  } else {
    for (var rvi2 = 0; rvi2 < reveals.length; rvi2++) {
      reveals[rvi2].classList.add('visible');
    }
  }


  /* ════════════════════════════════════════════════════════════
     COUNT-UP  (triggered by IntersectionObserver, driven by RAF)
  ════════════════════════════════════════════════════════════ */
  var counters = document.querySelectorAll('.strip-num[data-target]');

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function runCounters() {
    if (state.countDone) return;
    state.countDone = true;

    for (var ci = 0; ci < counters.length; ci++) {
      (function (el) {
        var target   = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;
        var duration  = 1600;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          el.textContent = Math.round(easeOutCubic(progress) * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }

        requestAnimationFrame(step);
      })(counters[ci]);
    }
  }

  if (counters.length) {
    var strip = document.querySelector('.strip');
    if (strip && 'IntersectionObserver' in window) {
      var stripIO = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          runCounters();
          stripIO.disconnect();
        }
      }, { threshold: 0.3 });
      stripIO.observe(strip);
    } else {
      runCounters();
    }
  }


  /* ════════════════════════════════════════════════════════════
     MAIN RAF LOOP
     Drives: navbar class, active links, parallax, cursor,
     mobile menu sync — all polled every animation frame.
     No scroll / mouse / resize listeners anywhere.
  ════════════════════════════════════════════════════════════ */
  var bgWord   = document.querySelector('.hero-bg-word');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function loop() {
    var sy = state.scrollY;

    /* Navbar scrolled class */
    if (nav) {
      if (sy > 40) nav.classList.add('scrolled');
      else         nav.classList.remove('scrolled');
    }

    /* Active nav link */
    var scrollPos = sy + 110;
    for (var si2 = 0; si2 < sections.length; si2++) {
      var sec = sections[si2];
      if (sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
        for (var ni = 0; ni < navLinks.length; ni++) {
          navLinks[ni].classList.remove('active');
        }
        var match = document.querySelector('.nav-links a[href="#' + sec.id + '"]');
        if (match) match.classList.add('active');
        break;
      }
    }

    /* Hero background word parallax */
    if (bgWord) {
      bgWord.style.transform = 'translateY(' + sy * 0.25 + 'px)';
    }

    /* Cursor dot position */
    if (cursor) {
      if (state.mouseX === -999) {
        cursor.style.opacity = '0';
      } else {
        cursor.style.left    = state.mouseX + 'px';
        cursor.style.top     = state.mouseY + 'px';
        cursor.style.opacity = '1';
      }
    }

    /* Mobile menu state sync (only update DOM when state changes) */
    if (state.mobileOpen !== state.prevMobileOpen) {
      state.prevMobileOpen = state.mobileOpen;

      if (mobileMenu) {
        if (state.mobileOpen) mobileMenu.classList.add('open');
        else                  mobileMenu.classList.remove('open');
      }
      if (toggleBtn) {
        toggleBtn.classList.toggle('active', state.mobileOpen);
        toggleBtn.setAttribute('aria-expanded', String(state.mobileOpen));
      }
      document.body.style.overflow = state.mobileOpen ? 'hidden' : '';
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

})();