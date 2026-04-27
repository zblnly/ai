// AI Learning Resources - JavaScript

// Performance monitoring
const performanceMarks = {};

function markPerformance(name) {
    performanceMarks[name] = performance.now();
}

function measurePerformance(name) {
    if (performanceMarks[name]) {
        const duration = performance.now() - performanceMarks[name];
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
        delete performanceMarks[name];
        return duration;
    }
    return null;
}

// Error handling
function handleError(error, context = '') {
    console.error(`[Error] ${context}:`, error);
    // Could send to error reporting service here
    // For now, just log and optionally show user-friendly message
    
    // In production, you might want to show a user-friendly error
    if (!context.includes('Load recent updates')) { // Don't interfere with expected errors
        // Only show alert for unexpected errors in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            alert(`发生错误: ${error.message}\n请查看控制台获取详细信息`);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    markPerformance('totalLoadTime');
    
    try {
        console.log('AI Learning Resources Loaded');
        
        loadRecentUpdates();
        highlightCurrentPage();
        initThemeToggle();
        initMobileMenu();
        initAccessibilityFeatures();
    } catch (error) {
        handleError(error, 'Initialization');
    } finally {
        measurePerformance('totalLoadTime');
    }
});

// Theme toggle
function initThemeToggle() {
    try {
        const header = document.querySelector('header');
        if (!header) return;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
        toggleBtn.innerHTML = '🌙';
        toggleBtn.title = 'Toggle dark mode';
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggleBtn.innerHTML = '☀️';
        }
        
        toggleBtn.addEventListener('click', () => {
            try {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                if (newTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    toggleBtn.innerHTML = '☀️';
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                }
            } catch (error) {
                handleError(error, 'Theme toggle');
            }
        });
        
        header.appendChild(toggleBtn);
    } catch (error) {
        handleError(error, 'Theme toggle initialization');
    }
}

// Mobile menu
function initMobileMenu() {
    try {
        const header = document.querySelector('header');
        if (!header) return;
        
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-toggle';
        menuBtn.setAttribute('aria-label', 'Toggle menu');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '☰';
        
        const nav = document.querySelector('nav');
        if (!nav) return;
        
        menuBtn.addEventListener('click', () => {
            try {
                const isExpanded = nav.classList.toggle('open');
                menuBtn.setAttribute('aria-expanded', isExpanded);
                menuBtn.innerHTML = isExpanded ? '✕' : '☰';
            } catch (error) {
                handleError(error, 'Mobile menu toggle');
            }
        });
        
        header.appendChild(menuBtn);
    } catch (error) {
        handleError(error, 'Mobile menu initialization');
    }
}

// Theme toggle
function initThemeToggle() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
    toggleBtn.innerHTML = '🌙';
    toggleBtn.title = 'Toggle dark mode';
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggleBtn.innerHTML = '☀️';
    }
    
    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggleBtn.innerHTML = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });
    
    header.appendChild(toggleBtn);
}

// Mobile menu
function initMobileMenu() {
    const header = document.querySelector('header');
    if (!header) return;
    
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-toggle';
    menuBtn.setAttribute('aria-label', 'Toggle menu');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.innerHTML = '☰';
    
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    menuBtn.addEventListener('click', () => {
        const isExpanded = nav.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', isExpanded);
        menuBtn.innerHTML = isExpanded ? '✕' : '☰';
    });
    
    header.appendChild(menuBtn);
}

// Load recent updates with performance optimization
function loadRecentUpdates() {
    markPerformance('loadRecentUpdates');
    
    try {
        const recentList = document.getElementById('recent-list');
        if (!recentList) return;
        
        const updates = [
            { title: 'Ollama本地大模型运行指南', url: 'pages/ollama-guide.html' },
            { title: 'Gemma4模型实战指南', url: 'pages/ollama-guide.html' },
            { title: 'VSCode Continue.dev集成', url: '#' },
            { title: 'RTX 3060 Ti性能优化', url: '#' }
        ];
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        updates.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.url;
            a.textContent = item.title;
            li.appendChild(a);
            fragment.appendChild(li);
        });
        
        recentList.innerHTML = ''; // Clear existing content
        recentList.appendChild(fragment);
    } catch (error) {
        handleError(error, 'Load recent updates');
    } finally {
        measurePerformance('loadRecentUpdates');
    }
}

// Highlight current page
function highlightCurrentPage() {
    markPerformance('highlightCurrentPage');
    
    try {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath.split('/').pop()) {
                link.classList.add('active');
            }
        });
    } catch (error) {
        handleError(error, 'Highlight current page');
    } finally {
        measurePerformance('highlightCurrentPage');
    }
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Accessibility enhancements
function initAccessibilityFeatures() {
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            const nav = document.querySelector('nav');
            const menuBtn = document.querySelector('.mobile-menu-toggle');
            if (nav && nav.classList.contains('open')) {
                nav.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.innerHTML = '☰';
                menuBtn.focus();
            }
        }
        
        // ?+ / to focus search (if we had search)
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            // Would focus search input if implemented
        }
    });
    
    // Ensure all interactive elements have proper focus indicators
    const interactiveElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    interactiveElements.forEach(el => {
        if (!el.hasAttribute('tabindex')) {
            el.setAttribute('tabindex', '0');
        }
    });
    
    // Add skip link focus management
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }
    
    // Improve color contrast for users with visual impairments
    // This is handled via CSS prefers-contrast media query
}