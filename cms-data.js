/* ==========================================================
   GAJAHMADA TECHNOLOGY — CMS & Dynamic Data Layer
   Memungkinkan penambahan konten (Proyek, Layanan, Solusi, Pesan Kontak)
   langsung dari Halaman Admin tanpa coding.
   ========================================================== */

const CMS = (() => {
  const STORAGE_KEYS = {
    PROJECTS: 'gmt_projects_data',
    SERVICES: 'gmt_services_data',
    SOLUTIONS: 'gmt_solutions_data',
    INQUIRIES: 'gmt_inquiries_data',
    SETTINGS: 'gmt_settings_data',
    INITIALIZED: 'gmt_initialized_v1',
    AUTH_USER: 'gmt_auth_user'
  };

  // Data Bawaan (Default Seed Data)
  const DEFAULT_PROJECTS = [
    {
      id: 'proj-1',
      title: 'Platform E-Commerce Marketplace',
      category: 'web',
      categoryLabel: 'Web',
      client: 'PT. Digital Commerce Indonesia',
      description: 'Marketplace online lengkap dengan manajemen produk, pembayaran terintegrasi, dan analitik penjualan real-time untuk ribuan merchant.',
      tags: ['Next.js', 'Node.js', 'PostgreSQL'],
      image: 'assets/images/ecommerce.png',
      detailUrl: 'project-ecommerce.html',
      featured: true,
      createdAt: '2026-01-15'
    },
    {
      id: 'proj-2',
      title: 'Aplikasi Kesehatan & Kebugaran',
      category: 'mobile',
      categoryLabel: 'Mobile',
      client: 'RS. Sehat Sejahtera',
      description: 'Aplikasi mobile untuk monitoring kesehatan harian, jadwal konsultasi dokter, pengingat obat, dan tracking aktivitas fisik.',
      tags: ['Flutter', 'Firebase', 'REST API'],
      image: 'assets/images/healthcare.png',
      detailUrl: 'project-healthcare.html',
      featured: true,
      createdAt: '2026-02-10'
    },
    {
      id: 'proj-3',
      title: 'Platform Analitik SaaS',
      category: 'saas',
      categoryLabel: 'SaaS',
      client: 'PT. Data Insight Indonesia',
      description: 'Dashboard analitik data multi-tenant dengan visualisasi real-time, KPI tracking, dan laporan otomatis untuk enterprise.',
      tags: ['React', 'Python', 'AWS'],
      image: 'assets/images/saas.png',
      detailUrl: 'project-saas.html',
      featured: true,
      createdAt: '2026-03-05'
    },
    {
      id: 'proj-4',
      title: 'Gateway API Perbankan',
      category: 'api',
      categoryLabel: 'API',
      client: 'Bank Digital Nusantara',
      description: 'API gateway terpusat untuk layanan perbankan digital dengan autentikasi multi-faktor, rate limiting, dan monitoring real-time.',
      tags: ['Node.js', 'GraphQL', 'Docker'],
      image: 'assets/images/banking.png',
      detailUrl: 'project-banking.html',
      featured: false,
      createdAt: '2026-04-12'
    },
    {
      id: 'proj-5',
      title: 'Platform Properti Online',
      category: 'web',
      categoryLabel: 'Web',
      client: 'PropertyHub Indonesia',
      description: 'Situs listing properti dengan pencarian canggih, peta interaktif, virtual tour 360°, dan integrasi pembayaran Stripe.',
      tags: ['Next.js', 'MongoDB', 'Stripe'],
      image: 'assets/images/realestate.png',
      detailUrl: 'project-realestate.html',
      featured: false,
      createdAt: '2026-05-18'
    },
    {
      id: 'proj-6',
      title: 'Aplikasi Manajemen Armada',
      category: 'mobile',
      categoryLabel: 'Mobile',
      client: 'PT. Logistik Cepat Nusantara',
      description: 'Aplikasi tracking armada real-time dengan optimasi rute, status pengiriman, dan dashboard fleet analytics terintegrasi.',
      tags: ['React Native', 'AWS', 'IoT'],
      image: 'assets/images/fleet.png',
      detailUrl: 'project-fleet.html',
      featured: false,
      createdAt: '2026-06-20'
    }
  ];

  const DEFAULT_SERVICES = [
    {
      id: 'serv-1',
      title: 'Pengembangan Web',
      category: 'web',
      accentColor: 'blue',
      description: 'Bangun aplikasi web yang robust, scalable, dan aman dengan Next.js, React, dan stack modern.',
      linkUrl: 'services.html#web-development',
      features: ['Aplikasi Web Responsif', 'Arsitektur Jamstack & SSR', 'SEO & Performa Optimal', 'Integrasi API & Database'],
      createdAt: '2026-01-01'
    },
    {
      id: 'serv-2',
      title: 'Aplikasi Mobile',
      category: 'mobile',
      accentColor: 'orange',
      description: 'Aplikasi iOS & Android dengan Flutter dan React Native untuk performa dan pengalaman pengguna terbaik.',
      linkUrl: 'services.html#mobile-apps',
      features: ['Cross-platform iOS & Android', 'UI/UX Mobile-First', 'Offline Support & Push Notifications', 'Deploy ke App Store & Play Store'],
      createdAt: '2026-01-01'
    },
    {
      id: 'serv-3',
      title: 'Produk SaaS',
      category: 'saas',
      accentColor: 'yellow',
      description: 'Bangun dan skalakan produk SaaS Anda dari ide hingga produksi dengan arsitektur multi-tenant.',
      linkUrl: 'services.html#saas',
      features: ['Arsitektur Multi-Tenant', 'Sistem Billing & Subscription', 'Dashboard Analitik Lengkap', 'Role-Based Access Control'],
      createdAt: '2026-01-01'
    },
    {
      id: 'serv-4',
      title: 'API & Backend',
      category: 'api',
      accentColor: 'blue-gray',
      description: 'Desain dan implementasi REST/GraphQL API, microservices, dan arsitektur backend yang handal.',
      linkUrl: 'services.html#api-backend',
      features: ['RESTful & GraphQL API', 'Microservices Architecture', 'Database Optimization', 'High Security & Rate Limiting'],
      createdAt: '2026-01-01'
    },
    {
      id: 'serv-5',
      title: 'Cloud & DevOps',
      category: 'cloud',
      accentColor: 'gradient',
      description: 'Deploy, monitor, dan skalakan infrastruktur Anda dengan solusi cloud AWS, GCP, dan CI/CD pipeline.',
      linkUrl: 'services.html#cloud-devops',
      features: ['CI/CD Pipeline Otomatis', 'Docker & Kubernetes', 'Cloud Infrastructure (AWS/GCP)', '24/7 Monitoring & Alerting'],
      createdAt: '2026-01-01'
    },
    {
      id: 'serv-6',
      title: 'Software Engineering',
      category: 'engineering',
      accentColor: 'red',
      description: 'Rekayasa perangkat lunak dengan arsitektur bersih, kode terstruktur, dan standar industri terbaik.',
      linkUrl: 'about.html#standar-engineering',
      features: ['Clean Code & TDD', 'Code Review Berkala', 'Security Compliance', 'Automated QA Testing'],
      createdAt: '2026-01-01'
    }
  ];

  const DEFAULT_SOLUTIONS = [
    {
      id: 'sol-1',
      title: 'Perbankan & Fintech',
      category: 'Finansial',
      description: 'Solusi pembayaran digital, API gateway berkeamanan tinggi, dan platform transaksi real-time sesuai regulasi OJK.',
      icon: '🏦',
      createdAt: '2026-01-01'
    },
    {
      id: 'sol-2',
      title: 'E-Commerce & Retail',
      category: 'Retail',
      description: 'Platform marketplace lengkap dengan manajemen multi-merchant, gateway pembayaran lokal, dan optimasi konversi.',
      icon: '🛍️',
      createdAt: '2026-01-01'
    },
    {
      id: 'sol-3',
      title: 'Kesehatan & Medis',
      category: 'Healthcare',
      description: 'Sistem rekam medis terpadu, telemedicine, dan aplikasi pemantauan kesehatan pasien dengan integrasi IoT.',
      icon: '🏥',
      createdAt: '2026-01-01'
    },
    {
      id: 'sol-4',
      title: 'Logistik & Supply Chain',
      category: 'Logistik',
      description: 'Tracking armada GPS real-time, optimasi rute cerdas berbasis AI, dan digital proof of delivery tanpa kertas.',
      icon: '🚚',
      createdAt: '2026-01-01'
    },
    {
      id: 'sol-5',
      title: 'Properti & Real Estate',
      category: 'Properti',
      description: 'Platform listing properti dengan virtual tour 360°, pemetaan interaktif, dan simulasi pembiayaan KPR terintegrasi.',
      icon: '🏢',
      createdAt: '2026-01-01'
    },
    {
      id: 'sol-6',
      title: 'Edukasi & EdTech',
      category: 'Edukasi',
      description: 'Learning Management System (LMS) interaktif dengan video streaming, ujian online, dan sertifikasi digital otomatis.',
      icon: '🎓',
      createdAt: '2026-01-01'
    }
  ];

  const DEFAULT_SETTINGS = {
    companyName: 'Gajahmada Technology',
    phone: '+62 812 3156 7890',
    whatsapp: '6281231567890',
    email: 'hello@gajahmada.tech',
    address: 'Pasuruan, Indonesia',
    announcementText: 'Konsultasi gratis proyek software engineering baru bersama tim ahli kami!',
    announcementActive: false
  };

  const DEFAULT_INQUIRIES = [
    {
      id: 'inq-101',
      name: 'Raden Mas Arya',
      email: 'arya@example.com',
      phone: '081234567890',
      service: 'web',
      serviceName: 'Pengembangan Web',
      budget: 'Rp 50jt - 100jt',
      message: 'Halo Gajahmada Tech, kami ingin membangun marketplace B2B untuk produk manufaktur kami di Jawa Timur.',
      status: 'Baru',
      date: '2026-10-25 10:14'
    },
    {
      id: 'inq-102',
      name: 'dr. Siti Rahmawati',
      email: 'siti@kliniksehat.com',
      phone: '085712345678',
      service: 'mobile',
      serviceName: 'Aplikasi Mobile',
      budget: 'Rp 25jt - 50jt',
      message: 'Perlu aplikasi reservasi klinik dan rekam medis dokter dengan Flutter.',
      status: 'Dihubungi',
      date: '2026-10-26 14:30'
    }
  ];

  // Inisialisasi awal ke localStorage jika belum ada
  function init() {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
      localStorage.setItem(STORAGE_KEYS.SOLUTIONS, JSON.stringify(DEFAULT_SOLUTIONS));
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(DEFAULT_INQUIRIES));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  // --- PROJECTS API ---
  function getProjects() {
    init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : DEFAULT_PROJECTS;
    } catch (e) {
      return DEFAULT_PROJECTS;
    }
  }

  function saveProject(project) {
    const projects = getProjects();
    if (project.id) {
      // Update
      const index = projects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        projects[index] = { ...projects[index], ...project };
      } else {
        projects.unshift(project);
      }
    } else {
      // Create new
      project.id = 'proj-' + Date.now();
      project.createdAt = new Date().toISOString().split('T')[0];
      projects.unshift(project);
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return project;
  }

  function deleteProject(id) {
    let projects = getProjects();
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return true;
  }

  // --- SERVICES API ---
  function getServices() {
    init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return data ? JSON.parse(data) : DEFAULT_SERVICES;
    } catch (e) {
      return DEFAULT_SERVICES;
    }
  }

  function saveService(service) {
    const services = getServices();
    if (service.id) {
      const index = services.findIndex(s => s.id === service.id);
      if (index !== -1) {
        services[index] = { ...services[index], ...service };
      } else {
        services.unshift(service);
      }
    } else {
      service.id = 'serv-' + Date.now();
      service.createdAt = new Date().toISOString().split('T')[0];
      services.unshift(service);
    }
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    return service;
  }

  function deleteService(id) {
    let services = getServices();
    services = services.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    return true;
  }

  // --- SOLUTIONS API ---
  function getSolutions() {
    init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SOLUTIONS);
      return data ? JSON.parse(data) : DEFAULT_SOLUTIONS;
    } catch (e) {
      return DEFAULT_SOLUTIONS;
    }
  }

  function saveSolution(solution) {
    const solutions = getSolutions();
    if (solution.id) {
      const index = solutions.findIndex(s => s.id === solution.id);
      if (index !== -1) {
        solutions[index] = { ...solutions[index], ...solution };
      } else {
        solutions.unshift(solution);
      }
    } else {
      solution.id = 'sol-' + Date.now();
      solution.createdAt = new Date().toISOString().split('T')[0];
      solutions.unshift(solution);
    }
    localStorage.setItem(STORAGE_KEYS.SOLUTIONS, JSON.stringify(solutions));
    return solution;
  }

  function deleteSolution(id) {
    let solutions = getSolutions();
    solutions = solutions.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SOLUTIONS, JSON.stringify(solutions));
    return true;
  }

  // --- INQUIRIES / LEADS CRM API ---
  function getInquiries() {
    init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return data ? JSON.parse(data) : DEFAULT_INQUIRIES;
    } catch (e) {
      return DEFAULT_INQUIRIES;
    }
  }

  function saveInquiry(inquiry) {
    const inquiries = getInquiries();
    inquiry.id = 'inq-' + Date.now();
    inquiry.status = inquiry.status || 'Baru';
    const now = new Date();
    inquiry.date = now.toISOString().replace('T', ' ').substring(0, 16);
    inquiries.unshift(inquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    return inquiry;
  }

  function updateInquiryStatus(id, newStatus) {
    const inquiries = getInquiries();
    const target = inquiries.find(i => i.id === id);
    if (target) {
      target.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
      return true;
    }
    return false;
  }

  function deleteInquiry(id) {
    let inquiries = getInquiries();
    inquiries = inquiries.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    return true;
  }

  // --- SETTINGS API ---
  function getSettings() {
    init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  function saveSettings(settings) {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }

  // --- AUTHENTICATION & ROLE SEPARATION (Admin vs Customer) ---
  function login(usernameOrEmail, password, forcedRole = null) {
    const input = (usernameOrEmail || '').trim().toLowerCase();
    const pass = (password || '').trim();

    // 1. Check Admin Credentials
    if (forcedRole === 'admin' || input === 'admin@gajahmada.tech' || input === 'admin') {
      if (pass === 'admin123' || pass === 'admin') {
        const user = {
          name: 'Administrator Gajahmada',
          email: 'admin@gajahmada.tech',
          role: 'admin',
          avatar: 'GM',
          loginAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
        return { success: true, user, redirect: 'admin.html' };
      }
      return { success: false, message: 'Password admin salah! (Gunakan: admin123)' };
    }

    // 2. Check Customer / Client Credentials
    if (forcedRole === 'customer' || input === 'klien@perusahaan.com' || input === 'klien' || input === 'customer' || input.includes('@')) {
      if (pass === 'klien123' || pass === 'klien' || pass.length >= 4) {
        const user = {
          name: input === 'klien' ? 'PT. Digital Commerce (Klien)' : input.split('@')[0].toUpperCase(),
          email: input.includes('@') ? input : 'klien@perusahaan.com',
          role: 'customer',
          avatar: 'KL',
          company: 'PT. Digital Commerce Indonesia',
          loginAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
        return { success: true, user, redirect: 'customer.html' };
      }
      return { success: false, message: 'Password klien salah! (Gunakan: klien123)' };
    }

    return { success: false, message: 'Akun tidak ditemukan. Pilih peran Admin atau Klien.' };
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    return true;
  }

  function getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function isAdmin() {
    const u = getCurrentUser();
    return u && u.role === 'admin';
  }

  function isCustomer() {
    const u = getCurrentUser();
    return u && u.role === 'customer';
  }

  // --- RESET TO FACTORY DEFAULTS ---
  function resetAll() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
    localStorage.setItem(STORAGE_KEYS.SOLUTIONS, JSON.stringify(DEFAULT_SOLUTIONS));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(DEFAULT_INQUIRIES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    return true;
  }

  // Auto-init immediately
  init();

  return {
    getProjects,
    saveProject,
    deleteProject,
    getServices,
    saveService,
    deleteService,
    getSolutions,
    saveSolution,
    deleteSolution,
    getInquiries,
    saveInquiry,
    updateInquiryStatus,
    deleteInquiry,
    getSettings,
    saveSettings,
    resetAll,
    login,
    logout,
    getCurrentUser,
    isAdmin,
    isCustomer
  };
})();

// Export globally for browser
window.CMS = CMS;
