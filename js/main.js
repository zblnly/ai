// AI Learning Resources - JavaScript

document.addEventListener('DOMContentLoaded', () => {
    console.log('AI Learning Resources Loaded');
    
    loadRecentUpdates();
    highlightCurrentPage();
    initThemeToggle();
    initMobileMenu();
});

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

// Load recent updates
function loadRecentUpdates() {
    const recentList = document.getElementById('recent-list');
    if (!recentList) return;
    
    const updates = [
        { title: 'Ollama本地大模型运行指南', url: 'pages/ollama-guide.html' },
        { title: 'Gemma4模型实战指南', url: 'pages/ollama-guide.html' },
        { title: 'VSCode Continue.dev集成', url: '#' },
        { title: 'RTX 3060 Ti性能优化', url: '#' }
    ];
    
    recentList.innerHTML = updates.map(item => 
        `<li><a href="${item.url}">${item.title}</a></li>`
    ).join('');
}

// Highlight current page
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });
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