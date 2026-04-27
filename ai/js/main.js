// AI Learning Resources - Modern JavaScript v2.0

document.addEventListener('DOMContentLoaded', () => {
    try {
        initThemeToggle();
        initMobileMenu();
        initScrollEffects();
        initBackToTop();
        loadRecentUpdates();
        initSmoothScroll();
        highlightCurrentPage();
        console.log('%c AI Learning Resources %c Ready ',
            'background:#6366f1;color:white;padding:4px 8px;border-radius:4px 0 0 4px;',
            'background:#ec4899;color:white;padding:4px 8px;border-radius:0 4px 4px 0;');
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

/* ========== Theme Toggle ========== */
function initThemeToggle() {
    const header = document.querySelector('header');
    if (!header) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', '切换暗色模式');
    toggleBtn.innerHTML = '🌙';

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleBtn.innerHTML = '☀️';
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggleBtn.innerHTML = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggleBtn.innerHTML = '☀️';
        }
    });

    header.querySelector('.container').appendChild(toggleBtn);
}

/* ========== Mobile Menu ========== */
function initMobileMenu() {
    const header = document.querySelector('header');
    if (!header) return;

    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-toggle';
    menuBtn.setAttribute('aria-label', '切换菜单');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = '☰';

    const nav = document.querySelector('nav');
    if (!nav) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    function closeMenu() {
        nav.classList.remove('open');
        overlay.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '☰';
        document.body.style.overflow = '';
    }

    function openMenu() {
        nav.classList.add('open');
        overlay.classList.add('open');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.innerHTML = '✕';
        document.body.style.overflow = 'hidden';
    }

    menuBtn.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            closeMenu();
            menuBtn.focus();
        }
    });

    // Close on nav link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) closeMenu();
        });
    });

    header.querySelector('.container').appendChild(menuBtn);
}

/* ========== Scroll Effects ========== */
function initScrollEffects() {
    const header = document.querySelector('header');

    // Header shadow on scroll
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                if (header) {
                    header.classList.toggle('scrolled', window.scrollY > 20);
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.scroll-reveal, .content-section, .card, .news-item, .tool-item, .resource-item');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all immediately
        revealElements.forEach(el => el.classList.add('visible'));
    }
}

/* ========== Back to Top ========== */
function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', '返回顶部');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                btn.classList.toggle('visible', window.scrollY > 500);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ========== Smooth Scroll for Anchor Links ========== */
function initSmoothScroll() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Focus target for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        }
    });
}

/* ========== Load Recent Updates ========== */
function loadRecentUpdates() {
    const recentList = document.getElementById('recent-list');
    if (!recentList) return;

    const updates = [
        { title: 'Ollama 本地大模型运行指南', url: 'pages/ollama-guide.html' },
        { title: 'Gemma 4 模型实战指南', url: 'pages/ollama-guide.html' },
        { title: 'VSCode Continue.dev 集成配置', url: 'pages/continue-dev-guide.html' },
        { title: 'AI 编程工具全面对比', url: 'pages/ai-tools-comparison.html' }
    ];

    const fragment = document.createDocumentFragment();
    updates.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.title;
        li.appendChild(a);
        fragment.appendChild(li);
    });

    recentList.innerHTML = '';
    recentList.appendChild(fragment);
}

/* ========== Highlight Current Page in Nav ========== */
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
