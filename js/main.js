// AI 学习资源站 - JavaScript

document.addEventListener('DOMContentLoaded', () => {
    console.log('AI 学习资源站已加载');
    
    // 动态加载最近更新
    loadRecentUpdates();
    
    // 页面切换高亮
    highlightCurrentPage();
});

// 加载最近更新
function loadRecentUpdates() {
    const recentList = document.getElementById('recent-list');
    if (!recentList) return;
    
    const updates = [
        { title: '本地大模型运行指南 - Ollama 配置', url: 'pages/ollama-guide.html' },
        { title: 'VSCode Continue.dev 集成', url: '#' },
        { title: 'RTX 3060 Ti 性能优化', url: '#' }
    ];
    
    recentList.innerHTML = updates.map(item => 
        `<li><a href="${item.url}">${item.title}</a></li>`
    ).join('');
}

// 当前页面高亮
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('active');
        }
    });
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});