// ============================================================
//  TOUGH TRIBES FITNESS MADURAI — MAIN JAVASCRIPT
// ============================================================

(function () {
  'use strict';

  // ---- STORAGE HELPER ----
  const DB = {
    get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
    set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  };

  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    toggleBackToTop();
  }, { passive: true });

  // ---- HAMBURGER MENU ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  // ---- SCROLL REVEAL ANIMATION ----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  // ---- COUNTER ANIMATION ----
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimal = parseInt(el.dataset.decimal) || 0;
    const duration = 1800;
    const start = performance.now();

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      el.textContent = decimal > 0 ? val.toFixed(decimal) + suffix : Math.floor(val) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

  // ---- TESTIMONIAL CAROUSEL ----
  const track = document.getElementById('testimonialTrack');
  const slides = track ? track.querySelectorAll('.testimonial-slide') : [];
  const dotsContainer = document.getElementById('carouselDots');
  let currentSlide = 0;
  let autoSlideInterval;

  if (slides.length && dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    function goToSlide(n) {
      currentSlide = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    document.getElementById('nextBtn')?.addEventListener('click', () => { nextSlide(); resetAuto(); });
    document.getElementById('prevBtn')?.addEventListener('click', () => { prevSlide(); resetAuto(); });

    function startAuto() { autoSlideInterval = setInterval(nextSlide, 5000); }
    function resetAuto() { clearInterval(autoSlideInterval); startAuto(); }
    startAuto();

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); resetAuto(); }
    });
  }

  // ---- TRIAL FORM ----
  const form = document.getElementById('trialForm');
  const formSuccess = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('trialName').value.trim();
      const phone = document.getElementById('trialPhone').value.trim();
      const goal = document.getElementById('trialGoal').value;
      if (!name || !phone || !goal) { alert('Please fill in all fields.'); return; }

      // Save lead to localStorage
      const leads = DB.get('tt_leads') || [];
      leads.push({
        id: Date.now(),
        name,
        phone,
        goal,
        date: new Date().toISOString(),
        source: 'Free Trial Form'
      });
      DB.set('tt_leads', leads);

      form.style.display = 'none';
      formSuccess.style.display = 'block';

      // Auto WhatsApp after 2s (optional — commented out to avoid auto-open)
      // setTimeout(() => window.open(`https://wa.me/918015203005?text=Hi! ${name} here. I just signed up for a free trial!`, '_blank'), 2000);
    });
  }

  // ---- BACK TO TOP ----
  const backToTopBtn = document.getElementById('backToTop');
  function toggleBackToTop() {
    if (window.scrollY > 400) backToTopBtn?.classList.add('visible');
    else backToTopBtn?.classList.remove('visible');
  }
  backToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- ACTIVE NAV LINK ON SCROLL ----
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
    });
    navLinksAll.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current ? 'white' : '';
    });
  }, { passive: true });

  // ---- PROGRAM CARD HOVER PARTICLES ----
  document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--glow', '1');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--glow', '0');
    });
  });

})();
