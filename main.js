/* ============================================================
   苹果风格个人主页 - main.js
   导航栏磨砂玻璃过渡 / 滚动视差 / 淡入上浮动效 / 汉堡菜单
   中英文切换 / 亮暗色切换
   ============================================================ */

(function () {
  'use strict';

  // ---------- 1. DOM 引用 ----------
  const navbar = document.getElementById('navbar');
  const navPills = document.querySelectorAll('.nav-actions-pill');
  const heroCanvas = document.getElementById('heroCanvas');
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
      'nav.about': '关于',
      'nav.skills': '技术栈',
      'hero.title': '永远相信美好的事情即将发生',
      'about.title': '关于',
      'about.name': '李亚泽',
      'about.degree': '学士学位 · 合肥工业大学 · 智能科学与技术',
      'skills.title': '技术栈',
      'nav.projects': '项目',
      'projects.title': '项目',
      'proj1.title': '🚗 智慧座舱系统',
      'proj1.desc': '基于 PyQt5 + YOLOv7 的智能座舱桌面应用，集成座舱目标检测、百度地图导航、音乐播放、电话拨号及用户登录注册模块。',
      'proj2.title': '🏗️ 智慧工地监控系统',
      'proj2.desc': '基于 PyQt5 + 华为云 AI 的工地视频监控桌面应用，支持本地视频播放、摄像头实时监控及云端安全帽佩戴检测。',
      'proj3.title': '🧩 Klotski 拼图游戏',
      'proj3.desc': '基于 PyQt5 的经典 3×3 滑块拼图游戏，包含用户登录/注册/验证码系统和核心拼图机制，支持操作计数与胜利检测。',
      'proj4.title': '📝 在线考试系统',
      'proj4.desc': '基于 C 语言的 Windows 控制台考试管理系统，支持管理员/学生双角色，提供在线考试计时、成绩查询及用户管理功能。',
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
      'nav.skills': 'Tech Stack',
      'hero.title': 'Always believe that something wonderful is about to happen',
      'about.title': 'About',
      'about.name': 'Yaze Li',
      'about.degree': "Bachelor's Degree in Intelligent Science and Technology @ Hefei University of Technology",
      'skills.title': 'Tech Stack',
      'nav.projects': 'Projects',
      'projects.title': 'Projects',
      'proj1.title': '🚗 Intelligent Cockpit System',
      'proj1.desc': 'A PyQt5 + YOLOv7 based intelligent cockpit desktop app featuring real-time object detection, Baidu Maps navigation, music player, phone dialer, and user authentication.',
      'proj2.title': '🏗️ Smart Construction Site Surveillance',
      'proj2.desc': 'A PyQt5 + Huawei Cloud AI based surveillance desktop app supporting local video playback, camera monitoring, and cloud-based hard hat detection.',
      'proj3.title': '🧩 Klotski Puzzle Game',
      'proj3.desc': 'A classic 3×3 sliding puzzle game built with PyQt5, featuring user login/register/captcha system and core puzzle mechanics with move counting.',
      'proj4.title': '📝 Online Examination System',
      'proj4.desc': 'A C-based Windows console exam management system supporting admin/student roles, timed exams, score queries, and user management.',
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
  let currentLang = localStorage.getItem('lang') || 'en';

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

  // ---------- 3. 固定为亮色主题 ----------
  document.documentElement.setAttribute('data-theme', 'light');

  // ---------- 4. 导航栏滚动效果 + 激活链接高亮 ----------
  function handleNavbarScroll() {
    const scrolled = window.scrollY > 20;
    // 导航栏无透明度变化，保持初始样式

    // 找到最靠近视口顶部的 section 来高亮导航
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';
    let minDist = Infinity;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const dist = Math.abs(rect.top);
      if (rect.top < window.innerHeight && dist < minDist) {
        minDist = dist;
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ---------- 5. Canvas 多色彩融合流动背景 ----------
  function initLightCanvas() {
    if (!heroCanvas) return;
    const ctx = heroCanvas.getContext('2d');
    let W, H;
    let time = 0;
    let blobs = [];
    let orbs = [];
    let animationId = null;

    // 均衡饱和度配色
    const palette = [
      { r: 230, g: 140, b: 175 }, // 粉
      { r: 120, g: 180, b: 240 }, // 天蓝
      { r: 130, g: 220, b: 160 }, // 薄荷
      { r: 200, g: 145, b: 240 }, // 紫
      { r: 240, g: 190, b: 130 }, // 杏
      { r: 120, g: 195, b: 240 }, // 雾蓝
      { r: 235, g: 140, b: 170 }, // 玫瑰
      { r: 170, g: 145, b: 240 }, // 薰衣草
    ];

    function rgba(c, a) { return `rgba(${c.r|0},${c.g|0},${c.b|0},${a})`; }

    // ===== 大光晕 — 随机布朗运动，每个颜色独立游走 =====
    class GlowBlob {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.radius = Math.random() * 400 + 300;
        this.opacity = Math.random() * 0.25 + 0.25;
        this.pulseSpeed = Math.random() * 0.0008 + 0.0003;
        this.phase = Math.random() * Math.PI * 2;
        this.vx = (Math.random() - 0.5) * 6.0;
        this.vy = (Math.random() - 0.5) * 5.0;
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }
      update() {
        // 布朗运动：每帧叠加随机扰动（速度翻倍）
        this.vx += (Math.random() - 0.5) * 0.8;
        this.vy += (Math.random() - 0.5) * 0.8;
        // 阻尼
        this.vx *= 0.98;
        this.vy *= 0.98;
        // 限速
        const maxSpeed = 7.0;
        const spd = Math.hypot(this.vx, this.vy);
        if (spd > maxSpeed) { this.vx *= maxSpeed / spd; this.vy *= maxSpeed / spd; }
        this.x += this.vx;
        this.y += this.vy;
        // 环绕边界
        if (this.x < -this.radius) this.x = W + this.radius;
        if (this.x > W + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = H + this.radius;
        if (this.y > H + this.radius) this.y = -this.radius;
      }
      draw() {
        const pulse = Math.sin(time * this.pulseSpeed + this.phase) * 0.12 + 0.88;
        const r = this.radius * pulse;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
        grad.addColorStop(0, rgba(this.color, this.opacity * 1.8));
        grad.addColorStop(0.2, rgba(this.color, this.opacity));
        grad.addColorStop(0.5, rgba(this.color, this.opacity * 0.4));
        grad.addColorStop(0.75, rgba(this.color, this.opacity * 0.1));
        grad.addColorStop(1, rgba(this.color, 0));
        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ===== 中型浮游光团 — 随机布朗运动，独立游走 =====
    class FloatingOrb {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.radius = Math.random() * 160 + 100;
        this.opacity = Math.random() * 0.2 + 0.2;
        this.pulseSpeed = Math.random() * 0.003 + 0.0015;
        this.phase = Math.random() * Math.PI * 2;
        this.vx = (Math.random() - 0.5) * 12.0;
        this.vy = (Math.random() - 0.5) * 10.0;
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }
      update() {
        // 布朗运动（速度翻倍）
        this.vx += (Math.random() - 0.5) * 1.5;
        this.vy += (Math.random() - 0.5) * 1.5;
        this.vx *= 0.97;
        this.vy *= 0.97;
        const maxSpeed = 14.0;
        const spd = Math.hypot(this.vx, this.vy);
        if (spd > maxSpeed) { this.vx *= maxSpeed / spd; this.vy *= maxSpeed / spd; }
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -120) this.x = W + 120;
        if (this.x > W + 120) this.x = -120;
        if (this.y < -120) this.y = H + 120;
        if (this.y > H + 120) this.y = -120;
      }
      draw() {
        const pulse = Math.sin(time * this.pulseSpeed + this.phase) * 0.25 + 0.75;
        const r = this.radius * pulse;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
        grad.addColorStop(0, rgba(this.color, this.opacity));
        grad.addColorStop(0.35, rgba(this.color, this.opacity * 0.5));
        grad.addColorStop(0.7, rgba(this.color, this.opacity * 0.12));
        grad.addColorStop(1, rgba(this.color, 0));
        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function resizeCanvas() {
      W = heroCanvas.width = window.innerWidth;
      H = heroCanvas.height = window.innerHeight;
    }

    function initScene() {
      resizeCanvas();
      blobs = [];
      orbs = [];
      const blobCount = Math.min(Math.floor(W / 120) + 4, 14);
      for (let i = 0; i < blobCount; i++) blobs.push(new GlowBlob());
      const orbCount = Math.min(Math.floor(W / 80) + 4, 18);
      for (let i = 0; i < orbCount; i++) orbs.push(new FloatingOrb());
    }

    function drawBackground() {
      ctx.fillStyle = '#e8e4e6';
      ctx.fillRect(0, 0, W, H);
    }

    function animate() {
      time += 0.15;
      drawBackground();

      // 大光晕底层 — 互相融合
      blobs.forEach(b => { b.update(); b.draw(); });

      // 浮游光团 — 流动层次
      orbs.forEach(b => { b.update(); b.draw(); });

      animationId = requestAnimationFrame(animate);
    }

    initScene();
    animate();

    const resizeObserver = new ResizeObserver(() => { initScene(); });
    resizeObserver.observe(document.body);

    return function cleanup() {
      if (animationId) cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
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

  // ---------- 8. 移动端汉堡菜单：滑入/滑出 ----------
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

  // 点击桌面导航链接立即激活高亮（不等滚动事件）
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function (e) {
      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 窗口尺寸变化时，如果回到桌面视图且菜单开着，自动关闭
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ---------- 9. 语言切换按钮绑定 ----------
  const langToggles = document.querySelectorAll('.lang-toggle');
  langToggles.forEach(btn => {
    btn.addEventListener('click', toggleLanguage);
  });

  // ---------- 10. 回到顶部按钮显隐 ----------
  const backTopBtn = document.getElementById('backTopBtn');
  if (backTopBtn) {
    backTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function handleBackTopVisibility() {
    if (!backTopBtn) return;
    backTopBtn.classList.toggle('show', window.scrollY > window.innerHeight * 0.5);
  }

  // ---------- 11. 统一滚动事件监听 ----------
  function onScroll() {
    handleNavbarScroll();
    handleBackTopVisibility();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // 存储 hero canvas 清理函数
  let cleanupCanvas = null;

  // ---------- 12. 页面加载完成后初始化 ----------
  window.addEventListener('DOMContentLoaded', function () {
    handleNavbarScroll();
    // 初始化 Hero Canvas 光效背景（固定，作为全站背景）
    cleanupCanvas = initLightCanvas();

    // 设置滚动淡入动画观察器
    setupRevealAnimation();
    // 初始化语言
    updateLanguage(currentLang);

    // 初始化 Liquid Glass 鼠标追踪
    initLiquidGlass();
  });

  // 页面完全加载后再检查一次（应对字体/图片加载后布局偏移）
  window.addEventListener('load', function () {
    handleNavbarScroll();
  });

  // ---------- 13. Liquid Glass 鼠标追踪弹性效果 ----------
  function initLiquidGlass() {
    // 所有需要玻璃鼠标追踪效果的元素
    const glassSelectors = [
      '.liquid-glass-nav',
      '.liquid-glass-card',
      '.liquid-glass-btn',
      '.liquid-glass-btn-pill',
      '.liquid-glass-section'
    ];

    glassSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Skip if already initialized
        if (el.dataset.lgInitialized === 'true') return;
        el.dataset.lgInitialized = 'true';

        const highlight = el.querySelector(':scope > .glass-highlight');
        const overlay = el.querySelector(':scope > .glass-highlight-overlay');
        if (!highlight && !overlay) return;

        let mouseX = 0.5;
        let mouseY = 0.5;
        let currentX = 0.5;
        let currentY = 0.5;
        let rafId = null;
        let isHovered = false;

        function updateHighlight() {
          if (!isHovered) return;
          // 平滑插值（弹性跟随）
          currentX += (mouseX - currentX) * 0.12;
          currentY += (mouseY - currentY) * 0.12;

          const cx = currentX * 100;
          const cy = currentY * 100;

          if (highlight) {
            highlight.style.background = `radial-gradient(
              circle at ${cx}% ${cy}%,
              rgba(255, 255, 255, 0.45) 0%,
              rgba(255, 255, 255, 0.15) 25%,
              rgba(255, 255, 255, 0) 60%
            )`;
          }

          // 更新边框高光渐变角度
          if (overlay) {
            const angle = 135 + (mouseX - 0.5) * 30;
            overlay.style.background = `linear-gradient(
              ${angle}deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, ${0.35 + Math.abs(mouseX - 0.5) * 0.3}) ${Math.max(20, 30 + (mouseY - 0.5) * 20)}%,
              rgba(255, 255, 255, ${0.6 + Math.abs(mouseX - 0.5) * 0.2}) ${Math.min(80, 60 + (mouseY - 0.5) * 15)}%,
              rgba(255, 255, 255, 0) 100%
            )`;
          }

          rafId = requestAnimationFrame(updateHighlight);
        }

        el.addEventListener('mouseenter', () => {
          isHovered = true;
          rafId = requestAnimationFrame(updateHighlight);
        });

        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          mouseX = (e.clientX - rect.left) / rect.width;
          mouseY = (e.clientY - rect.top) / rect.height;
        });

        el.addEventListener('mouseleave', () => {
          isHovered = false;
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          // 重置
          currentX = 0.5;
          currentY = 0.5;
          if (highlight) {
            highlight.style.background = `radial-gradient(
              circle at 50% 50%,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0) 100%
            )`;
          }
          if (overlay) {
            overlay.style.background = `linear-gradient(
              135deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.5) 30%,
              rgba(255, 255, 255, 0.7) 50%,
              rgba(255, 255, 255, 0.3) 70%,
              rgba(255, 255, 255, 0) 100%
            )`;
          }
        });
      });
    });
  }

})();
