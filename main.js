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
      'nav.skills': '技术栈',
      'hero.title': '永远相信美好的事情即将发生',
      'about.title': '关于我',
      'about.name': '李亚泽',
      'about.degree': '学士学位 · 合肥工业大学 · 智能科学与技术',
      'skills.title': '技术栈',
      'nav.projects': '项目',
      'projects.title': '项目',
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
      'about.title': 'About Me',
      'about.name': 'Yaze Li',
      'about.degree': "Bachelor's Degree in Intelligent Science and Technology @ Hefei University of Technology",
      'skills.title': 'Tech Stack',
      'nav.projects': 'Projects',
      'projects.title': 'Projects',
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

    // 同步开关状态
    const switchInput = document.getElementById('themeSwitch');
    if (switchInput) {
      switchInput.checked = theme === 'dark';
    }
  }

  function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    updateTheme(newTheme);
  }

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

  // ---------- 5. Canvas 纯净炫彩流体光效背景 ----------
  function initLightCanvas() {
    if (!heroCanvas) return;
    const ctx = heroCanvas.getContext('2d');
    let W, H;
    let time = 0;
    let ribbons = [];
    let blobs = [];
    let beams = [];
    let animationId = null;

    // 粉彩配色（稍增饱和度）
    const palette = [
      { r: 255, g: 190, b: 210 }, // 粉
      { r: 175, g: 215, b: 255 }, // 浅青
      { r: 170, g: 240, b: 210 }, // 薄荷
      { r: 205, g: 190, b: 255 }, // 淡紫
    ];

    function rgba(c, a) { return `rgba(${c.r|0},${c.g|0},${c.b|0},${a})`; }

    // ===== 飘逸光带 =====
    class LightRibbon {
      constructor() {
        this.reset();
      }
      reset() {
        this.yBase = Math.random() * H * 0.9 + H * 0.05;
        this.amplitude = Math.random() * 100 + 60;
        this.freq = Math.random() * 0.002 + 0.0008;
        this.speed = Math.random() * 0.15 + 0.05;
        this.phase = Math.random() * Math.PI * 2;
        this.width = Math.random() * 50 + 30;
        this.opacity = Math.random() * 0.10 + 0.08;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        this.wobbleFreq = Math.random() * 0.004 + 0.002;
        this.wobbleAmp = Math.random() * 15 + 5;
        this.dir = Math.random() > 0.5 ? 1 : -1;
      }
      draw(t) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = this.width;
        ctx.shadowColor = rgba(this.color, this.opacity * 2);
        ctx.shadowBlur = 40;

        // 主路径
        ctx.beginPath();
        const startY = this.yBase + Math.sin(t * this.freq * 0.5 + this.phase) * this.amplitude * 0.3;
        ctx.moveTo(-20, startY);
        for (let x = -10; x <= W + 20; x += 3) {
          const envelope = Math.sin(x * 0.003 + t * this.speed * 0.3) * 0.5 + 0.5;
          const y = this.yBase
            + Math.sin(x * this.freq + t * this.speed + this.phase) * this.amplitude * envelope
            + Math.sin(x * this.wobbleFreq + t * 0.08) * this.wobbleAmp;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = rgba(this.color, 1);
        ctx.stroke();

        // 第二层更宽更淡的光晕
        ctx.shadowBlur = 80;
        ctx.lineWidth = this.width * 2;
        ctx.globalAlpha = this.opacity * 0.5;
        ctx.strokeStyle = rgba(this.color, 0.5);
        ctx.stroke();

        ctx.restore();
      }
    }

    // ===== 弥散光晕 =====
    class GlowBlob {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H * 0.9 + H * 0.05;
        this.radius = Math.random() * 250 + 120;
        this.opacity = Math.random() * 0.08 + 0.06;
        this.phase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.002 + 0.001;
        this.dx = (Math.random() - 0.5) * 0.12;
        this.dy = (Math.random() - 0.5) * 0.08;
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }
      update() {
        this.x += Math.sin(time * 0.0002 + this.phase) * this.dx;
        this.y += Math.cos(time * 0.0003 + this.phase) * this.dy;
        if (this.x < -this.radius) this.x = W + this.radius;
        if (this.x > W + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = H + this.radius;
        if (this.y > H + this.radius) this.y = -this.radius;
      }
      draw() {
        const pulse = Math.sin(time * this.pulseSpeed + this.phase) * 0.15 + 0.85;
        const r = this.radius * pulse;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
        grad.addColorStop(0, rgba(this.color, this.opacity * 2));
        grad.addColorStop(0.3, rgba(this.color, this.opacity));
        grad.addColorStop(0.7, rgba(this.color, this.opacity * 0.3));
        grad.addColorStop(1, rgba(this.color, 0));
        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // ===== 柔和光束 =====
    class LightBeam {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W * 1.5 - W * 0.25;
        this.angle = (Math.random() - 0.5) * 0.5;
        this.length = Math.random() * H * 0.6 + H * 0.2;
        this.width = Math.random() * 100 + 50;
        this.opacity = Math.random() * 0.04 + 0.03;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        this.speed = Math.random() * 0.1 + 0.03;
      }
      draw(t) {
        const grad = ctx.createLinearGradient(
          this.x, -10,
          this.x + Math.sin(this.angle) * this.length,
          this.length
        );
        grad.addColorStop(0, rgba(this.color, this.opacity));
        grad.addColorStop(0.5, rgba(this.color, this.opacity * 0.5));
        grad.addColorStop(1, rgba(this.color, 0));
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = grad;
        ctx.transform(1, Math.sin(t * 0.0003) * 0.08, 0, 1, 0, 0);
        ctx.fillRect(this.x - this.width / 2, 0, this.width, this.length);
        ctx.restore();
      }
    }

    function resizeCanvas() {
      const rect = heroCanvas.parentElement.getBoundingClientRect();
      W = heroCanvas.width = rect.width;
      H = heroCanvas.height = rect.height;
    }

    function initScene() {
      resizeCanvas();
      ribbons = [];
      blobs = [];
      beams = [];
      const ribbonCount = Math.min(Math.floor(W / 120), 10);
      for (let i = 0; i < ribbonCount; i++) ribbons.push(new LightRibbon());
      const blobCount = Math.min(Math.floor(W / 200) + 2, 7);
      for (let i = 0; i < blobCount; i++) blobs.push(new GlowBlob());
      const beamCount = Math.min(Math.floor(W / 150), 6);
      for (let i = 0; i < beamCount; i++) beams.push(new LightBeam());
    }

    function drawBackground() {
      // 纯白基底
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
    }

    function animate() {
      time += 0.2;
      drawBackground();

      // 光束（底层）
      beams.forEach(b => b.draw(time));

      // 弥散光晕
      blobs.forEach(b => { b.update(); b.draw(); });

      // 飘逸光带（上层）
      ribbons.forEach(r => r.draw(time));

      animationId = requestAnimationFrame(animate);
    }

    initScene();
    animate();

    const resizeObserver = new ResizeObserver(() => { initScene(); });
    resizeObserver.observe(heroCanvas.parentElement);

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

  // ---------- 8. 语言切换按钮绑定 ----------
  const langToggles = document.querySelectorAll('.lang-toggle');
  langToggles.forEach(btn => {
    btn.addEventListener('click', toggleLanguage);
  });

  // ---------- 9. 主题切换绑定 ----------
  const themeSwitch = document.getElementById('themeSwitch');
  if (themeSwitch) {
    themeSwitch.addEventListener('change', function () {
      updateTheme(this.checked ? 'dark' : 'light');
    });
  }

  // 监听系统主题变化
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // 只在用户未手动设置过主题时跟随系统
      if (!localStorage.getItem('theme')) {
        updateTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ---------- 10. 统一滚动事件监听 ----------
  function onScroll() {
    handleNavbarScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // 存储 canvas 清理函数
  let cleanupCanvas = null;

  // ---------- 12. 页面加载完成后初始化 ----------
  window.addEventListener('DOMContentLoaded', function () {
    handleNavbarScroll();
    // 初始化 Canvas 光效背景
    cleanupCanvas = initLightCanvas();
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
