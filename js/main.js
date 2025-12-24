/**
 * Portfolio - A. Izzat Shafran Ashari
 * Modern JavaScript Architecture
 * ============================================
 */

// ============================================
// Configuration
// ============================================
const CONFIG = {
  profile: {
    email: 'ifran@ashari.tech',
    phone: '082271598281',
    phoneIntl: '6282271598281',
    github: 'https://github.com/AndiIzzat',
    linkedin: 'https://www.linkedin.com/in/andi-izzat-7329b630a/',
    cvUrl: '#',
  },
  typing: {
    words: ['captivate', 'inspire', 'stand out', 'connect'],
    typeSpeed: 100,
    deleteSpeed: 50,
    pauseTime: 2000,
  },
  particles: {
    count: 50,
    colors: ['#6366f1', '#8b5cf6', '#a855f7'],
  },
};

// ============================================
// Utility Functions
// ============================================
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const lerp = (start, end, factor) => start + (end - start) * factor;

// ============================================
// Toast Notification
// ============================================
const Toast = {
  element: null,
  timeout: null,

  init() {
    this.element = $('#toast');
  },

  show(message = 'Done!', duration = 2500) {
    if (!this.element) return;

    const textEl = this.element.querySelector('.toast__text');
    if (textEl) textEl.textContent = message;

    clearTimeout(this.timeout);
    this.element.classList.add('show');

    this.timeout = setTimeout(() => {
      this.element.classList.remove('show');
    }, duration);
  },
};

// ============================================
// Loader
// ============================================
const Loader = {
  element: null,

  init() {
    this.element = $('#loader');
  },

  hide() {
    if (!this.element) return;

    setTimeout(() => {
      this.element.classList.add('hidden');
      document.body.style.overflow = '';
    }, 500);
  },
};

// ============================================
// Theme Manager
// ============================================
const ThemeManager = {
  init() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.dataset.theme = savedTheme;
    }

    $('#themeBtn')?.addEventListener('click', () => this.toggle());
  },

  toggle() {
    const body = document.body;
    const newTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    Toast.show(newTheme === 'dark' ? 'Dark mode' : 'Light mode');
  },
};

// ============================================
// Navigation
// ============================================
const Navigation = {
  nav: null,
  hamburger: null,
  mobileMenu: null,
  lastScrollY: 0,

  init() {
    this.nav = $('#nav');
    this.hamburger = $('#hamburger');
    this.mobileMenu = $('#mobileMenu');

    this.bindEvents();
    this.handleScroll();
  },

  bindEvents() {
    // Scroll handler
    window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));

    // Jump links
    $$('[data-jump]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = $(btn.dataset.jump);
        if (target) {
          const offset = this.nav?.offsetHeight || 80;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });

          // Close mobile menu
          this.closeMobileMenu();
        }
      });
    });

    // Hamburger menu
    this.hamburger?.addEventListener('click', () => this.toggleMobileMenu());

    // Back to top
    $('#backToTop')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      this.nav?.classList.add('scrolled');
    } else {
      this.nav?.classList.remove('scrolled');
    }

    this.lastScrollY = scrollY;
  },

  toggleMobileMenu() {
    this.hamburger?.classList.toggle('active');
    this.mobileMenu?.classList.toggle('active');
  },

  closeMobileMenu() {
    this.hamburger?.classList.remove('active');
    this.mobileMenu?.classList.remove('active');
  },
};

// ============================================
// Typing Animation
// ============================================
const TypingAnimation = {
  element: null,
  words: CONFIG.typing.words,
  wordIndex: 0,
  charIndex: 0,
  isDeleting: false,

  init() {
    this.element = $('#typingText');
    if (this.element) {
      this.type();
    }
  },

  type() {
    const currentWord = this.words[this.wordIndex];
    const { typeSpeed, deleteSpeed, pauseTime } = CONFIG.typing;

    if (this.isDeleting) {
      this.element.textContent = currentWord.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentWord.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let delay = this.isDeleting ? deleteSpeed : typeSpeed;

    if (!this.isDeleting && this.charIndex === currentWord.length) {
      delay = pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      delay = 300;
    }

    setTimeout(() => this.type(), delay);
  },
};

// ============================================
// Counter Animation
// ============================================
const CounterAnimation = {
  init() {
    const counters = $$('[data-count]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  },

  animate(element) {
    const target = parseInt(element.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * easeOut);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(update);
  },
};

// ============================================
// Scroll Reveal
// ============================================
const ScrollReveal = {
  init() {
    const elements = $$('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
  },
};

// ============================================
// Skill Bars Animation
// ============================================
const SkillBars = {
  init() {
    const bars = $$('.skill-bar__fill');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const level = entry.target.dataset.level || 0;
            entry.target.style.width = `${level}%`;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    bars.forEach((bar) => observer.observe(bar));
  },
};

// ============================================
// Particles Background
// ============================================
const Particles = {
  container: null,
  particles: [],

  init() {
    this.container = $('#particles');
    if (!this.container) return;

    this.create();
    this.animate();
  },

  create() {
    const { count, colors } = CONFIG.particles;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];

      Object.assign(particle.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        borderRadius: '50%',
        opacity: Math.random() * 0.5 + 0.1,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        pointerEvents: 'none',
      });

      this.particles.push({
        element: particle,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size,
      });

      this.container.appendChild(particle);
    }
  },

  animate() {
    this.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around screen
      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;

      p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });

    requestAnimationFrame(() => this.animate());
  },
};

// ============================================
// Cursor Glow Effect
// ============================================
const CursorGlow = {
  element: null,
  mouseX: 0,
  mouseY: 0,
  currentX: 0,
  currentY: 0,

  init() {
    this.element = $('#cursorGlow');
    if (!this.element || window.innerWidth < 768) return;

    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.element.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
      this.element.classList.remove('active');
    });

    this.animate();
  },

  animate() {
    this.currentX = lerp(this.currentX, this.mouseX, 0.1);
    this.currentY = lerp(this.currentY, this.mouseY, 0.1);

    if (this.element) {
      this.element.style.left = `${this.currentX}px`;
      this.element.style.top = `${this.currentY}px`;
    }

    requestAnimationFrame(() => this.animate());
  },
};

// ============================================
// Copy to Clipboard
// ============================================
const Clipboard = {
  init() {
    const copyEmail = () => this.copy(CONFIG.profile.email, 'Email copied!');
    const copyPhone = () => this.copy(CONFIG.profile.phone, 'WhatsApp copied!');

    $('#copyEmailBtn')?.addEventListener('click', copyEmail);
    $('#copyEmailBtn2')?.addEventListener('click', copyEmail);
    $('#copyPhoneBtn')?.addEventListener('click', copyPhone);
  },

  async copy(text, message) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    Toast.show(message);
  },
};

// ============================================
// CV Download
// ============================================
const CVDownload = {
  init() {
    $('#downloadCvBtn')?.addEventListener('click', () => {
      const { cvUrl } = CONFIG.profile;
      if (!cvUrl || cvUrl === '#') {
        Toast.show('CV link not available yet');
        return;
      }
      window.open(cvUrl, '_blank', 'noopener,noreferrer');
    });
  },
};

// ============================================
// Social Links
// ============================================
const SocialLinks = {
  init() {
    const { github, linkedin, phoneIntl } = CONFIG.profile;

    const githubLink = $('#openGitHub');
    const linkedinLink = $('#openLinkedIn');
    const whatsappLink = $('#openWhatsApp');

    if (githubLink) githubLink.href = github;
    if (linkedinLink) linkedinLink.href = linkedin;
    if (whatsappLink) {
      const message = encodeURIComponent('Halo Izzat, saya lihat portfoliomu. Boleh tanya-tanya?');
      whatsappLink.href = `https://wa.me/${phoneIntl}?text=${message}`;
    }
  },
};

// ============================================
// Contact Form
// ============================================
const ContactForm = {
  init() {
    const form = $('#contactForm');
    const clearBtn = $('#clearBtn');

    form?.addEventListener('submit', (e) => this.handleSubmit(e));
    clearBtn?.addEventListener('click', () => this.clear());

    // Update displayed contact info
    const emailText = $('#emailText');
    const phoneText = $('#phoneText');
    if (emailText) emailText.textContent = CONFIG.profile.email;
    if (phoneText) phoneText.textContent = CONFIG.profile.phone;
  },

  handleSubmit(e) {
    e.preventDefault();

    const name = $('#name')?.value.trim();
    const email = $('#email')?.value.trim();
    const msg = $('#msg')?.value.trim();

    if (!name || !email) {
      Toast.show('Please fill in required fields');
      return;
    }

    const subject = encodeURIComponent(`Portfolio Contact — ${name}`);
    const body = encodeURIComponent(
      `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${msg}\n\n(Opsional) Kontak cepat via WhatsApp: https://wa.me/${CONFIG.profile.phoneIntl}\n`
    );

    window.location.href = `mailto:${CONFIG.profile.email}?subject=${subject}&body=${body}`;
    Toast.show('Opening email client...');
  },

  clear() {
    const name = $('#name');
    const email = $('#email');
    const msg = $('#msg');

    if (name) name.value = '';
    if (email) email.value = '';
    if (msg) msg.value = '';

    Toast.show('Form cleared');
  },
};

// ============================================
// Year Update
// ============================================
const YearUpdate = {
  init() {
    const yearEl = $('#year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  },
};

// ============================================
// Keyboard Shortcuts
// ============================================
const KeyboardShortcuts = {
  init() {
    document.addEventListener('keydown', (e) => {
      // Escape closes mobile menu
      if (e.key === 'Escape') {
        Navigation.closeMobileMenu();
      }

      // 't' toggles theme (when not in input)
      if (e.key === 't' && !this.isInputFocused()) {
        ThemeManager.toggle();
      }
    });
  },

  isInputFocused() {
    const activeElement = document.activeElement;
    return (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    );
  },
};

// ============================================
// Initialize Application
// ============================================
const App = {
  init() {
    // Core modules
    Toast.init();
    Loader.init();
    ThemeManager.init();
    Navigation.init();
    YearUpdate.init();

    // Visual effects
    TypingAnimation.init();
    CounterAnimation.init();
    ScrollReveal.init();
    SkillBars.init();
    Particles.init();
    CursorGlow.init();

    // Interactive features
    Clipboard.init();
    CVDownload.init();
    SocialLinks.init();
    ContactForm.init();
    KeyboardShortcuts.init();

    // Hide loader after everything is ready
    window.addEventListener('load', () => Loader.hide());
  },
};

// Start the app
document.addEventListener('DOMContentLoaded', () => App.init());
