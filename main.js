/* ============================================================
   苹果风格个人主页 - main.js
   导航栏磨砂玻璃过渡 / 滚动视差 / 淡入上浮动效 / 汉堡菜单
   中英文切换 / 亮暗色切换
   ============================================================ */

(function () {
  'use strict';

  // ---------- 1. DOM 引用 ----------
  const navbar = document.getElementById('navbar');
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
      'nav.skills': '技能',
      'hero.title': '永远相信美好的事情即将发生',
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
      'hero.title': 'Always believe that something wonderful is about to happen',
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

  // ---------- 4. 导航栏滚动效果 + 激活链接高亮 ----------
  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // 根据滚动位置高亮对应的导航链接
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
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

  // ---------- 5. Canvas 光的美学背景动画 ----------
  function initLightCanvas() {
    if (!heroCanvas) return;
    const ctx = heroCanvas.getContext('2d');
    let W, H;
    let time = 0;
    let particles = [];
    let lightRays = [];
    let glowOrbs = [];
    let animationId = null;

    // === 粒子类 ===
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3 - 0.1;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        // 暖色光粒子
        this.hue = Math.random() * 60 + 30; // 30-90 暖色范围
        this.saturation = Math.random() * 40 + 60;
        this.lightness = Math.random() * 30 + 60;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
          this.reset();
          if (this.y < 0) this.y = H;
          if (this.y > H) this.y = 0;
          if (this.x < 0) this.x = W;
          if (this.x > W) this.x = 0;
        }
      }
      draw() {
        const pulseOpacity = this.opacity + Math.sin(this.pulse) * 0.15;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${pulseOpacity})`;
        ctx.fill();
        // 发光效果
        ctx.shadowColor = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0.5)`;
        ctx.shadowBlur = this.size * 8;
        ctx.fill();
        ctx.restore();
      }
    }

    // === 光线类 ===
    class LightRay {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * W;
        this.width = Math.random() * 60 + 10;
        this.height = Math.random() * H * 0.6 + H * 0.2;
        this.opacity = Math.random() * 0.04 + 0.01;
        this.angle = (Math.random() - 0.5) * 0.3;
        this.speed = Math.random() * 0.002 + 0.001;
        this.hue = Math.random() * 40 + 35; // 暖色光
      }
      update() {
        this.x += Math.sin(time * this.speed) * 0.3;
        this.opacity = Math.abs(Math.sin(time * this.speed)) * 0.04 + 0.01;
      }
      draw() {
        const grad = ctx.createLinearGradient(this.x, 0, this.x + this.width * 0.3, this.height);
        grad.addColorStop(0, `hsla(${this.hue}, 80%, 85%, ${this.opacity})`);
        grad.addColorStop(0.5, `hsla(${this.hue + 10}, 70%, 75%, ${this.opacity * 0.6})`);
        grad.addColorStop(1, `hsla(${this.hue + 20}, 60%, 65%, 0)`);
        ctx.save();
        ctx.transform(1, Math.sin(time * 0.0005) * 0.1, 0, 1, 0, 0);
        ctx.fillStyle = grad;
        ctx.fillRect(this.x - this.width / 2, 0, this.width, this.height);
        ctx.restore();
      }
    }

    // === 发光球体类 ===
    class GlowOrb {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H * 0.6;
        this.radius = Math.random() * 120 + 60;
        this.opacity = Math.random() * 0.06 + 0.02;
        this.hue = Math.random() * 60 + 30;
        this.pulseSpeed = Math.random() * 0.005 + 0.002;
        this.phase = Math.random() * Math.PI * 2;
        this.moveSpeed = Math.random() * 0.1 + 0.05;
        this.dirX = (Math.random() - 0.5) * 2;
        this.dirY = (Math.random() - 0.5) * 2;
      }
      update() {
        this.x += Math.sin(time * 0.0003 + this.phase) * this.moveSpeed;
        this.y += Math.cos(time * 0.0004 + this.phase) * this.moveSpeed * 0.5;
        if (this.x < -this.radius) this.x = W + this.radius;
        if (this.x > W + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = H * 0.6 + this.radius;
        if (this.y > H * 0.6 + this.radius) this.y = -this.radius;
      }
      draw() {
        const pulse = Math.sin(time * this.pulseSpeed + this.phase) * 0.3 + 0.7;
        const r = this.radius * pulse;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
        grad.addColorStop(0, `hsla(${this.hue + 10}, 80%, 90%, ${this.opacity * 1.5})`);
        grad.addColorStop(0.3, `hsla(${this.hue}, 70%, 80%, ${this.opacity})`);
        grad.addColorStop(0.6, `hsla(${this.hue - 10}, 60%, 70%, ${this.opacity * 0.5})`);
        grad.addColorStop(1, `hsla(${this.hue - 20}, 50%, 60%, 0)`);
        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fill();
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
      particles = [];
      lightRays = [];
      glowOrbs = [];
      const particleCount = Math.min(Math.floor(W * H / 8000), 200);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
      const rayCount = Math.min(Math.floor(W / 80), 15);
      for (let i = 0; i < rayCount; i++) {
        lightRays.push(new LightRay());
      }
      const orbCount = Math.min(Math.floor(W / 300) + 2, 6);
      for (let i = 0; i < orbCount; i++) {
        glowOrbs.push(new GlowOrb());
      }
    }

    function drawBackground() {
      // 基础渐变背景 - 从暖色到冷色过渡
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#1a1a2e');
      bgGrad.addColorStop(0.3, '#16213e');
      bgGrad.addColorStop(0.6, '#0f3460');
      bgGrad.addColorStop(0.8, '#1a1a3e');
      bgGrad.addColorStop(1, '#0d0d1a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // 底部柔和光晕
      const bottomGlow = ctx.createRadialGradient(W / 2, H * 1.1, 0, W / 2, H * 0.9, H * 0.7);
      bottomGlow.addColorStop(0, 'hsla(210, 60%, 40%, 0.15)');
      bottomGlow.addColorStop(0.5, 'hsla(240, 40%, 30%, 0.08)');
      bottomGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, 0, W, H);
    }

    function animate() {
      time++;
      drawBackground();

      // 绘制光线
      lightRays.forEach(ray => { ray.update(); ray.draw(); });

      // 绘制发光球体
      glowOrbs.forEach(orb => { orb.update(); orb.draw(); });

      // 绘制粒子
      particles.forEach(p => { p.update(); p.draw(); });

      animationId = requestAnimationFrame(animate);
    }

    // 初始化
    initScene();
    animate();

    // 窗口大小变化重置
    const resizeObserver = new ResizeObserver(() => {
      initScene();
    });
    resizeObserver.observe(heroCanvas.parentElement);

    // 返回清理函数
    return function cleanup() {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
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
