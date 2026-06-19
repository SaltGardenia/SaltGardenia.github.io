/* ============================================================
   苹果风格个人主页 - main.js
   导航栏磨砂玻璃过渡 / 滚动视差 / 淡入上浮动效 / 汉堡菜单
   中英文切换 / 亮暗色切换
   ============================================================ */

(function () {
  'use strict';

  // ---------- 1. DOM 引用 ----------
  const navbar = document.getElementById('navbar');
  const heroBg = document.getElementById('heroBg');
  const hamburger = document.getElementById('hamburger');
  const closeMenu = document.getElementById('closeMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  // 所有需要滚动进入视口淡入上浮的元素
  const revealElements = document.querySelectorAll(
    '.section, .about-content, .skills-categories'
  );

  // ---------- 国际化（i18n）翻译字典 ----------
  const i18n = {
    'zh-CN': {
      'nav.home': '首页',
      'nav.about': '关于我',
      'nav.skills': '技能',
      'hero.title': '欢迎来到我的世界',
      'about.title': '关于我',
      'about.name': '李亚泽',
      'about.degree': '学士学位 · 合肥工业大学 · 智能科学与技术',
      'skills.title': '技能',
      'skills.devLang': 'Development language',
      'skills.devEnv': 'Development environment',
      'skills.mlDl': 'ML & DL',
      'skills.dataProc': 'Data processing',
      'skills.devTools': 'Development tools',
      'footer.copyright': '© 2026 LiYaze. All Rights Reserved.',
      'lang.toggle': 'EN',
    },
    'en': {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.skills': 'Skills',
      'hero.title': 'Welcome to My World',
      'about.title': 'About Me',
      'about.name': 'Yaze Li',
      'about.degree': "Bachelor's Degree in Intelligent Science and Technology @ Hefei University of Technology",
      'skills.title': 'Skills',
      'skills.devLang': 'Development language',
      'skills.devEnv': 'Development environment',
      'skills.mlDl': 'ML & DL',
      'skills.dataProc': 'Data processing',
      'skills.devTools': 'Development tools',
      'footer.copyright': '© 2026 LiYaze. All Rights Reserved.',
      'lang.toggle': '中',
    }
  };

  // ---------- 2. 语言切换 ----------
  let currentLang = localStorage.getItem('lang') || 'zh-CN';

  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    // 更新所有 data-i18n 元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang] && i18n[lang][key]) {
        el.innerHTML = i18n[lang][key];
      }
    });

    // 更新所有 data-i18n-alt 元素（图片 alt 属性）
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (i18n[lang] && i18n[lang][key]) {
        el.setAttribute('alt', i18n[lang][key]);
      }
    });

    // 更新所有语言切换按钮的文本
    document.querySelectorAll('.lang-toggle .lang-icon').forEach(el => {
      el.textContent = i18n[lang]['lang.toggle'];
    });

    // 更新 html lang 属性
    document.documentElement.lang = lang;
  }

  function toggleLanguage() {
    const newLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
    updateLanguage(newLang);
  }

  // ---------- 3. 亮/暗色切换 ----------
  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // 跟随系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  let currentTheme = getPreferredTheme();

  function updateTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    // 更新主题按钮图标
    const themeIcons = document.querySelectorAll('.theme-toggle .theme-icon');
    themeIcons.forEach(el => {
      el.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  }

  function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    updateTheme(newTheme);
  }

  // ---------- 4. 导航栏滚动透明 -> 白色磨砂玻璃 + 文字颜色切换 ----------
  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('nav-light');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('nav-light');
    }
  }

  // ---------- 5. 首屏 Banner 视差滚动效果 ----------
  function handleParallax() {
    if (!heroBg) return;
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    // 只在首屏高度范围内位移，视差偏移量约 20%
    if (scrollY <= heroHeight) {
      const offset = scrollY * 0.08; // 轻微视差系数
      heroBg.style.transform = `translateY(${offset}px)`;
    }
  }

  // ---------- 6. 滚动淡入上浮动效（Intersection Observer）----------
  function setupRevealAnimation() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 当元素进入视口，添加 .visible 触发 CSS 过渡动画
            entry.target.classList.add('visible');
          } else {
            // 当元素离开视口，移除 .visible 以便再次进入时重新播放动画
            entry.target.classList.remove('visible');
          }
        });
      },
      {
        threshold: 0.08,        // 元素露出 8% 即触发
        rootMargin: '0px 0px -40px 0px',  // 略微提前触发
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // ---------- 7. 移动端汉堡菜单：滑入/滑出 ----------
  function openMobileMenu() {
    mobileMenu.classList.add('open');
    menuOverlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // 禁止背景滚动
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  // 汉堡按钮打开菜单
  if (hamburger) {
    hamburger.addEventListener('click', openMobileMenu);
  }

  // 关闭按钮关闭菜单
  if (closeMenu) {
    closeMenu.addEventListener('click', closeMobileMenu);
  }

  // 点击遮罩关闭菜单
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMobileMenu);
  }

  // 点击侧边菜单内的链接后自动关闭菜单 + 平滑跳转
  mobileLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      closeMobileMenu();
      // 滚动到对应锚点（浏览器原生 scroll-behavior: smooth 生效）
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 窗口尺寸变化时，如果回到桌面视图且菜单开着，自动关闭
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ---------- 8. 语言切换按钮绑定 ----------
  const langToggles = document.querySelectorAll('.lang-toggle');
  langToggles.forEach(btn => {
    btn.addEventListener('click', toggleLanguage);
  });

  // ---------- 9. 主题切换按钮绑定 ----------
  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // 监听系统主题变化
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // 只在用户未手动设置过主题时跟随系统
      if (!localStorage.getItem('theme')) {
        updateTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ---------- 10. 滚动指示箭头动画重置 ----------
  const scrollArrow = document.querySelector('.scroll-arrow');
  let arrowAnimating = true;

  function restartArrowAnimation() {
    if (!scrollArrow) return;
    // 先移除动画，强制回流后再恢复，实现动画重置
    scrollArrow.style.animation = 'none';
    scrollArrow.offsetHeight; // 强制回流
    scrollArrow.style.animation = '';
    // 同样重置伪元素的动画：通过切换类名实现
    scrollArrow.classList.remove('anim-paused');
    void scrollArrow.offsetWidth;
    scrollArrow.classList.add('anim-paused');
    scrollArrow.classList.remove('anim-paused');
  }

  function handleArrowAnimation() {
    if (!scrollArrow) return;
    const heroHeight = window.innerHeight;
    const visible = window.scrollY < heroHeight * 0.8;
    if (visible && !arrowAnimating) {
      arrowAnimating = true;
      restartArrowAnimation();
    } else if (!visible && arrowAnimating) {
      arrowAnimating = false;
    }
  }

  // ---------- 11. 统一滚动事件监听（使用 passive 提高性能）----------
  function onScroll() {
    handleNavbarScroll();
    handleParallax();
    handleArrowAnimation();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- 12. 页面加载完成后初始化 ----------
  window.addEventListener('DOMContentLoaded', function () {
    // 先执行一次，确认初始导航栏状态（默认在首屏用白色文字）
    navbar.classList.add('nav-light');
    handleNavbarScroll();
    // 设置滚动淡入动画观察器
    setupRevealAnimation();
    // 初始化语言
    updateLanguage(currentLang);
    // 初始化主题
    updateTheme(currentTheme);
  });

  // 页面完全加载后再检查一次（应对字体/图片加载后布局偏移）
  window.addEventListener('load', function () {
    handleNavbarScroll();
  });

})();
