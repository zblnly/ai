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
        initReadingProgress();
        initTOC();
        initMetaBar();
        initAffiliateTracking();
        initOutboundLinkTracking();
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

/* ========== Reading Progress Bar ========== */
function initReadingProgress() {
    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    document.body.appendChild(bar);

    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
                bar.style.transform = 'scaleX(' + (progress / 100).toFixed(3) + ')';
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ========== Table of Contents ========== */
function initTOC() {
    var headings = document.querySelectorAll('.content-section h3');
    if (headings.length < 2) return;

    var toc = document.createElement('nav');
    toc.className = 'toc';
    toc.setAttribute('aria-label', '目录');

    var tocTitle = document.createElement('div');
    tocTitle.className = 'toc-title';
    tocTitle.textContent = '📑 目录';
    toc.appendChild(tocTitle);

    var tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    headings.forEach(function (h3, i) {
        var id = 'toc-section-' + i;
        h3.id = id;

        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + id;
        a.textContent = h3.textContent.replace(/^[^一-龥a-zA-Z0-9]+/u, '').trim();
        li.appendChild(a);
        tocList.appendChild(li);
    });

    toc.appendChild(tocList);
    document.body.appendChild(toc);

    // Scrollspy
    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                var links = tocList.querySelectorAll('a');
                var currentId = '';
                headings.forEach(function (h3) {
                    if (h3.getBoundingClientRect().top <= 140) {
                        currentId = h3.id;
                    }
                });
                links.forEach(function (link) {
                    var href = link.getAttribute('href').replace('#', '');
                    link.classList.toggle('active', href === currentId);
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ========== 联盟链接 & 外链跟踪 ========== */
function initAffiliateTracking() {
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a.affiliate-link');
        if (!link) return;

        var affiliate = link.getAttribute('data-affiliate') || 'unknown';
        var url = link.href;

        // 百度统计事件跟踪
        if (typeof _hmt !== 'undefined') {
            _hmt.push(['_trackEvent', 'affiliate', 'click', affiliate]);
        }
    });
}

function initOutboundLinkTracking() {
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a[target="_blank"]');
        if (!link) return;
        if (link.classList.contains('affiliate-link')) return;

        if (typeof _hmt !== 'undefined') {
            _hmt.push(['_trackEvent', 'outbound', 'click', link.href]);
        }
    });
}

/* ========== Meta Bar (更新日期 + 阅读时长) ========== */
function initMetaBar() {
    var pageHeader = document.querySelector('.page-header');
    if (!pageHeader) return;

    // 从 JSON-LD 中读取 dateModified
    var dateStr = '';
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(function (script) {
        try {
            var data = JSON.parse(script.textContent);
            if (data.dateModified) dateStr = data.dateModified;
        } catch (e) {}
    });

    // 计算阅读时长（中文按每分钟400字估算）
    var main = document.querySelector('main');
    var text = main ? main.textContent : '';
    var charCount = text.replace(/\s+/g, '').length;
    var minutes = Math.max(1, Math.round(charCount / 400));

    var meta = document.createElement('div');
    meta.className = 'page-meta';

    if (dateStr) {
        var dateSpan = document.createElement('span');
        dateSpan.className = 'meta-date';
        dateSpan.textContent = '📅 更新于 ' + dateStr;
        meta.appendChild(dateSpan);
    }

    var timeSpan = document.createElement('span');
    timeSpan.className = 'meta-time';
    timeSpan.textContent = '⏱️ 约 ' + minutes + ' 分钟阅读';
    meta.appendChild(timeSpan);

    pageHeader.insertAdjacentElement('afterend', meta);
}
