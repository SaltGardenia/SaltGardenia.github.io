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
    '.section, .about-content, .projects-grid, .skills-cloud, .footer-inner'
  );

  // ---------- 国际化（i18n）翻译字典 ----------
  const i18n = {
    'zh-CN': {
      'nav.home': '首页',
      'nav.about': '关于我',
      'nav.projects': '项目作品',
      'nav.skills': '技能',
      'nav.contact': '联系我',
      'hero.title': "Hi, I'm LiYaze",
      'hero.subtitle': '前端 / AI 开发爱好者 · 热衷于构建优雅的数字体验',
      'about.title': '关于我',
      'about.p1': '我是一名热爱前端技术与人工智能的开发爱好者，专注于构建美观、流畅、具有苹果级体验的 Web 应用。',
      'about.p2': '目前深入学习 <strong>React、TypeScript</strong> 及 <strong>AI 工程化</strong>方向，持续探索如何将前沿技术落地为优雅的产品。',
      'about.avatarAlt': 'LiYaze 头像',
      'projects.title': '项目作品',
      'projects.card1.title': '智能简历解析器',
      'projects.card1.desc': '基于自然语言处理，自动提取简历关键信息并生成可视化报告，提升招聘筛选效率。',
      'projects.card2.title': '苹果风格设计系统',
      'projects.card2.desc': '复刻 Apple 设计语言的组件库，包含磨砂玻璃、平滑动效、响应式布局等核心模块。',
      'projects.card3.title': 'AI 对话助手',
      'projects.card3.desc': '接入大语言模型的智能聊天工具，支持上下文记忆与多轮对话，界面极简流畅。',
      'skills.title': '技能',
      'footer.copyright': '© 2025 LiYaze. All Rights Reserved.',
      'lang.toggle': 'EN',
    },
    'en': {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.projects': 'Projects',
      'nav.skills': 'Skills',
      'nav.contact': 'Contact',
      'hero.title': "Hi, I'm LiYaze",
      'hero.subtitle': 'Frontend / AI Enthusiast · Building elegant digital experiences',
      'about.title': 'About Me',
      'about.p1': 'I am a developer passionate about frontend technology and artificial intelligence, focused on building beautiful, smooth, Apple-quality web applications.',
      'about.p2': 'Currently diving deep into <strong>React, TypeScript</strong> and <strong>AI Engineering</strong>, continuously exploring how to turn cutting-edge technology into elegant products.',
      'about.avatarAlt': "LiYaze's avatar",
      'projects.title': 'Projects',
      'projects.card1.title': 'Smart Resume Parser',
      'projects.card1.desc': 'NLP-based tool that automatically extracts key resume information and generates visual reports, improving recruitment efficiency.',
      'projects.card2.title': 'Apple-Style Design System',
      'projects.card2.desc': 'A component library recreating Apple\'s design language, featuring frosted glass, smooth animations, and responsive layouts.',
      'projects.card3.title': 'AI Chat Assistant',
      'projects.card3.desc': 'An intelligent chat tool powered by large language models, supporting context memory and multi-turn conversations with a minimal interface.',
      'skills.title': 'Skills',
      'footer.copyright': '© 2025 LiYaze. All Rights Reserved.',
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

  // ---------- 4. 导航栏滚动透明 -> 白色磨砂玻璃 ----------
  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
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
            // 动画只触发一次，之后取消观察
            observer.unobserve(entry.target);
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

  // ---------- 10. 统一滚动事件监听（使用 passive 提高性能）----------
  function onScroll() {
    handleNavbarScroll();
    handleParallax();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- 11. 页面加载完成后初始化 ----------
  window.addEventListener('DOMContentLoaded', function () {
    // 先执行一次，确认初始导航栏状态
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
