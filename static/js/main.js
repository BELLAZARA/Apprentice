/* ============================================================
   KOMU RABBIT DIS — main.js
   Global utilities: navbar scroll, mobile nav, scroll reveal
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll behaviour ──────────────────────────────── */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
  }

  /* ── Mobile nav toggle ────────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      // Animate hamburger to X
      const spans = navToggle.querySelectorAll('span');
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity   = '';
        });
      });
    });
  }

  /* ── Smooth scroll for anchor links ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Active nav link on scroll ────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const observeSections = () => {
    if (!sections.length || !navAnchors.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(s => observer.observe(s));
  };
  observeSections();

  /* ── Scroll-reveal (IntersectionObserver) ─────────────────── */
  const revealElements = document.querySelectorAll(
    '.feature-card, .role-card, .report-card, .card, [data-reveal]'
  );

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-up');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.animationDelay = `${(i % 4) * 0.08}s`;
    revealObserver.observe(el);
  });

  /* ── Counter animation for stats strip ────────────────────── */
  function animateCounter(el, target, suffix = '') {
    const duration  = 1600;
    const start     = performance.now();
    const startVal  = 0;

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current  = Math.round(startVal + (target - startVal) * ease);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsStripObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.strip-stat-num[data-count]').forEach(el => {
          const val    = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, val, suffix);
        });
        statsStripObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) statsStripObserver.observe(statsStrip);

})();