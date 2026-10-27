/* ==========================================================
   GAJAHMADA TECHNOLOGY — Shared JavaScript
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- DOM Elements ----- */
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const scrollTopBtn = document.querySelector('.scroll-top');

  /* ===========================
     1. NAVBAR SCROLL EFFECT
     =========================== */
  const handleScroll = () => {
    /* Navbar shrink on scroll */
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    /* Scroll-to-top button visibility */
    if (window.scrollY > 300) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  /* ===========================
     2. MOBILE MENU TOGGLE
     =========================== */
  menuToggle?.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  /* Close mobile menu on nav link click */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('active');
      menuToggle?.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* Close mobile menu on escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
      navMenu.classList.remove('active');
      menuToggle?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /* ===========================
     3. SCROLL TO TOP
     =========================== */
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===========================
     4. ACTIVE NAV LINK
     =========================== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ===========================
     5. SCROLL ANIMATIONS
     =========================== */
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        /* Don't unobserve — allow re-trigger is optional, but for perf we unobserve */
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .stagger-children').forEach(el => {
    observer.observe(el);
  });

  /* ===========================
     6. SMOOTH SCROLL (anchor links)
     =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const navbarHeight = navbar?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ===========================
     7. COUNTER ANIMATION
     =========================== */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-counter'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const duration = 2000;
          const start = performance.now();

          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.floor(eased * target);
            el.textContent = prefix + current + suffix;
            if (progress < 1) requestAnimationFrame(animate);
            else el.textContent = prefix + target + suffix;
          };

          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  /* ===========================
     8. FORM VALIDATION
     =========================== */
  const contactForm = document.querySelector('#contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    /* Clear previous errors */
    contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    contactForm.querySelectorAll('.form-error-msg').forEach(el => el.remove());

    /* Validate required fields */
    contactForm.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        showFieldError(field, 'This field is required');
        isValid = false;
      }
    });

    /* Email validation */
    const emailField = contactForm.querySelector('[type="email"]');
    if (emailField && emailField.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error');
      showFieldError(emailField, 'Please enter a valid email address');
      isValid = false;
    }

    if (isValid) {
      /* Simpan ke CMS LocalStorage */
      if (window.CMS && typeof window.CMS.saveInquiry === 'function') {
        const nameVal = contactForm.querySelector('#name')?.value.trim() || '';
        const emailVal = contactForm.querySelector('#email')?.value.trim() || '';
        const phoneVal = contactForm.querySelector('#phone')?.value.trim() || '';
        const companyVal = contactForm.querySelector('#company')?.value.trim() || '';
        const serviceSelect = contactForm.querySelector('#service');
        const serviceVal = serviceSelect?.value || '';
        const serviceText = serviceSelect?.options[serviceSelect.selectedIndex]?.text || '';
        const budgetSelect = contactForm.querySelector('#budget');
        const budgetText = budgetSelect?.options[budgetSelect.selectedIndex]?.text || '';
        const messageVal = contactForm.querySelector('#message')?.value.trim() || '';

        window.CMS.saveInquiry({
          name: nameVal,
          email: emailVal,
          phone: phoneVal,
          company: companyVal,
          service: serviceVal,
          serviceName: serviceText,
          budget: budgetText,
          message: messageVal
        });
      }

      /* Remove existing success messages */
      document.querySelectorAll('.form-success').forEach(el => el.remove());

      /* Show success message */
      const successMsg = document.createElement('div');
      successMsg.className = 'form-success';
      successMsg.innerHTML = '<strong>Terima kasih!</strong> Pesan dan kebutuhan proyek Anda telah berhasil kami terima. Tim kami akan menghubungi Anda dalam kurun waktu 1x24 jam.';
      contactForm.parentNode.insertBefore(successMsg, contactForm.nextSibling);
      contactForm.reset();

      /* Auto remove after 8 seconds */
      setTimeout(() => {
        successMsg.style.opacity = '0';
        successMsg.style.transform = 'translateY(-10px)';
        successMsg.style.transition = 'all 0.4s ease';
        setTimeout(() => successMsg.remove(), 400);
      }, 8000);
    }
  });

  function showFieldError(field, message) {
    const error = document.createElement('div');
    error.className = 'form-error-msg';
    error.textContent = message;
    field.parentNode.appendChild(error);
  }

  /* Remove error state on input */
  document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errorMsg = field.parentNode.querySelector('.form-error-msg');
      if (errorMsg) errorMsg.remove();
    });
  });

  /* ===========================
     9. PROJECT FILTER TABS
     =========================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        /* Update active tab */
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');
        const projects = document.querySelectorAll('.project-card');

        projects.forEach((project, index) => {
          const category = project.getAttribute('data-category');
          const shouldShow = filter === 'all' || category === filter;

          if (shouldShow) {
            project.style.display = '';
            project.style.animation = `fadeInUp 0.4s ease ${index * 0.05}s both`;
          } else {
            project.style.display = 'none';
          }
        });
      });
    });
  }

  /* ===========================
     10. TYPING EFFECT (optional hero)
     =========================== */
  const typingEl = document.querySelector('[data-typing]');
  if (typingEl) {
    const words = typingEl.getAttribute('data-typing').split(',');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 500;
      }

      setTimeout(typeEffect, delay);
    }

    typeEffect();
  }

  /* ===========================
     9. AUTO-SELECT SERVICE FROM URL
     =========================== */
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  const serviceSelect = document.getElementById('service');

  if (serviceParam && serviceSelect) {
    serviceSelect.value = serviceParam;

    // Show contextual banner about the selected service
    const serviceNames = {
      web: 'Pengembangan Web',
      mobile: 'Aplikasi Mobile',
      saas: 'Pengembangan SaaS',
      api: 'API & Backend',
      cloud: 'Cloud & DevOps'
    };

    const serviceDescriptions = {
      web: 'Anda tertarik dengan layanan Pengembangan Web kami. Kami membangun aplikasi web modern, responsif, dan scalable menggunakan Next.js, React, dan teknologi terdepan lainnya.',
      mobile: 'Anda tertarik dengan layanan Aplikasi Mobile kami. Kami mengembangkan aplikasi iOS & Android menggunakan Flutter dan React Native untuk performa terbaik.',
      saas: 'Anda tertarik dengan layanan Pengembangan SaaS kami. Kami membantu Anda membangun produk SaaS multi-tenant dari ide hingga peluncuran.',
      api: 'Anda tertarik dengan layanan API & Backend kami. Kami merancang RESTful/GraphQL API, microservices, dan arsitektur backend yang handal.',
      cloud: 'Anda tertarik dengan layanan Cloud & DevOps kami. Kami mengelola infrastruktur cloud dengan CI/CD, monitoring, dan auto-scaling.'
    };

    const serviceName = serviceNames[serviceParam];
    if (serviceName) {
      const formContainer = document.querySelector('.form-container');
      if (formContainer) {
        const banner = document.createElement('div');
        banner.className = 'service-banner';
        banner.style.cssText = 'background:linear-gradient(135deg,rgba(22,133,235,0.08),rgba(240,68,46,0.08));border:1px solid rgba(22,133,235,0.2);border-radius:12px;padding:16px 20px;margin-bottom:24px;';
        banner.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1685EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
            <strong style="color:#1685EB;font-size:0.95rem;">Layanan: ${serviceName}</strong>
          </div>
          <p style="color:#6B7280;font-size:0.875rem;margin:0;line-height:1.5;">${serviceDescriptions[serviceParam]}</p>
        `;
        const formTitle = formContainer.querySelector('h3');
        if (formTitle && formTitle.nextElementSibling) {
          formTitle.nextElementSibling.insertAdjacentElement('afterend', banner);
        }
      }
    }
  }

  /* ===========================
     11. DYNAMIC CMS CONTENT RENDERER
     =========================== */
  if (window.CMS) {
    // 1. Sinkronkan Pengaturan Situs (WhatsApp, Banner, Kontak)
    const settings = CMS.getSettings();
    if (settings) {
      if (settings.whatsapp) {
        document.querySelectorAll('.whatsapp-float').forEach(el => {
          el.href = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`;
        });
      }
      if (settings.announcementActive && settings.announcementText) {
        if (!document.querySelector('.cms-announcement-bar')) {
          const banner = document.createElement('div');
          banner.className = 'cms-announcement-bar';
          banner.style.cssText = 'background:linear-gradient(90deg, #F0442E, #F57C25);color:#fff;text-align:center;padding:8px 16px;font-size:13px;font-weight:500;position:relative;z-index:1001;';
          banner.innerHTML = `<span>📢 ${settings.announcementText}</span> <a href="contact.html" style="color:#fff;text-decoration:underline;margin-left:8px;font-weight:600;">Hubungi Kami →</a>`;
          document.body.insertBefore(banner, document.body.firstChild);
        }
      }
    }

    // 2. Render Dinamis pada Halaman projects.html
    const projectsGrid = document.querySelector('.filter-tabs + .grid') || document.querySelector('#projectsGrid');
    if (projectsGrid && (window.location.pathname.includes('projects.html') || document.querySelector('.filter-tabs'))) {
      const allProjects = CMS.getProjects();
      if (Array.isArray(allProjects) && allProjects.length > 0) {
        projectsGrid.innerHTML = allProjects.map(p => {
          const tagsHtml = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
          const detailLink = p.detailUrl && p.detailUrl !== '#' ? p.detailUrl : `contact.html?service=${p.category || 'web'}`;
          const isSaas = p.category === 'saas';
          return `
            <div class="project-card" data-category="${p.category || 'web'}">
              <div class="project-card-image">
                <img src="${p.image || 'assets/images/saas.png'}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">
              </div>
              <div class="project-card-body">
                <div class="project-card-category">${p.categoryLabel || (p.category ? p.category.toUpperCase() : 'PROYEK')}</div>
                <h4>${p.title}</h4>
                <p>${p.description}</p>
                <div class="project-card-tags">
                  ${tagsHtml}
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-4);margin-top:var(--space-4);">
                  <a href="${detailLink}" class="btn-link">Lihat Detail <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
                  ${isSaas ? '<a href="dashboard.html" class="btn btn-secondary btn-sm" style="padding:4px 10px;font-size:11px;">Buka Dashboard</a>' : ''}
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 3. Render Dinamis pada Proyek Unggulan di index.html
    const featuredContainer = document.querySelector('#homeProjectsGrid');
    if (featuredContainer) {
      const featuredProjects = CMS.getProjects().slice(0, 3);
      featuredContainer.innerHTML = featuredProjects.map(p => {
        const tagsHtml = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
        const detailLink = p.detailUrl && p.detailUrl !== '#' ? p.detailUrl : `contact.html?service=${p.category || 'web'}`;
        const isSaas = p.category === 'saas';
        return `
          <div class="project-card">
            <div class="project-card-image">
              <img src="${p.image || 'assets/images/ecommerce.png'}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div class="project-card-body">
              <div class="project-card-category">${p.categoryLabel || (p.category ? p.category.toUpperCase() : 'WEB')}</div>
              <h4>${p.title}</h4>
              <p>${p.description}</p>
              <div class="project-card-tags">
                ${tagsHtml}
              </div>
              <div style="display:flex;align-items:center;gap:var(--space-4);margin-top:var(--space-4);">
                <a href="${detailLink}" class="btn-link">Lihat Proyek <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
                ${isSaas ? '<a href="dashboard.html" class="btn btn-secondary btn-sm" style="padding:4px 10px;font-size:11px;">Buka Dashboard</a>' : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // 4. Adaptasi Navbar Sesuai Sesi Login (Admin vs Klien vs Belum Login)
    const authLinks = document.querySelectorAll('.nav-auth-link');
    const footerAuthLinks = document.querySelectorAll('.footer-auth-link');
    const currentUser = CMS.getCurrentUser();

    authLinks.forEach(link => {
      if (!currentUser) {
        link.textContent = 'Masuk';
        link.href = 'login.html';
        link.title = 'Masuk ke Portal Klien atau Admin';
        link.removeAttribute('style');
      } else if (currentUser.role === 'admin') {
        link.innerHTML = '<span style="display:inline-flex;align-items:center;gap:4px;">🛡️ Admin</span>';
        link.href = 'admin.html';
        link.title = `Admin Aktif: ${currentUser.name} (Buka CMS)`;
        link.style.color = '#dc2626';
        link.style.fontWeight = '700';
      } else if (currentUser.role === 'customer') {
        link.innerHTML = '<span style="display:inline-flex;align-items:center;gap:4px;">👤 Portal Klien</span>';
        link.href = 'customer.html';
        link.title = `Klien: ${currentUser.name} (Buka Portal)`;
        link.style.color = '#1685EB';
        link.style.fontWeight = '700';
      }
    });

    footerAuthLinks.forEach(link => {
      if (!currentUser) {
        link.textContent = 'Portal Masuk';
        link.href = 'login.html';
      } else if (currentUser.role === 'admin') {
        link.textContent = 'Panel Admin (CMS)';
        link.href = 'admin.html';
      } else if (currentUser.role === 'customer') {
        link.textContent = 'Portal Klien (Proyek Anda)';
        link.href = 'customer.html';
      }
    });
  }

});
