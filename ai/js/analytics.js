/**
 * 统计分析 - Google Analytics (GA4) + 百度统计
 *
 * 使用前请替换下方的 tracking ID:
 *   GA4: https://analytics.google.com/  → 获取测量ID (格式: G-XXXXXXXXXX)
 *   百度: https://tongji.baidu.com/       → 获取跟踪ID (32位字符串)
 */

// ============================================================
// Google Analytics (GA4)
// ============================================================
(function () {
  var gaId = 'G-XXXXXXXXXX'; // <-- 替换为你的 GA4 测量ID
  if (gaId === 'G-XXXXXXXXXX') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', gaId);

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
  document.head.appendChild(script);
})();

// ============================================================
// 百度统计 (Baidu Tongji)
// ============================================================
(function () {
  var baiduId = 'fa04123a01cf9b4a4a699b956f7c4454';
  if (!baiduId) return;

  var hm = document.createElement('script');
  hm.src = 'https://hm.baidu.com/hm.js?' + baiduId;
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(hm, s);
})();
