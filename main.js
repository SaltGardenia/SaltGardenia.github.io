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
  const hamburgerBtn = document.getElementById('hamburgerBtn');
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
      'about.label.github': 'GitHub',
      'about.label.email': '邮箱',
      'about.label.degree': '学士学位',
      'about.cert': '证书',
      'about.label.orcid': 'ORCiD',
      'about.label.research': '研究方向',
      'about.label.scholar': 'Google Scholar',
      'about.degree': '<a href="https://www.hfut.edu.cn/" target="_blank">合肥工业大学</a> · <a href="https://ci.hfut.edu.cn/index.htm" target="_blank">智能科学与技术</a>',
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
      'skills.devLang': '开发语言',
      'skills.devEnv': '开发环境',
      'skills.mlDl': '机器学习与深度学习',
      'skills.dataProc': '数据处理',
      'skills.devTools': '开发工具',
      'skills.research': '科研',
      'footer.copyright': '© 2026 LiYaze. All Rights Reserved.',
      'lang.toggle': 'EN',
    },
    'en': {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.skills': 'Tech Stack',
      'hero.title': 'Always believe that something<br>wonderful is about to happen',
      'about.title': 'About',
      'about.name': 'Yaze Li',
      'about.label.github': 'GitHub',
      'about.label.email': 'Email',
      'about.label.degree': 'Bachelor\'s',
      'about.cert': 'Certifications',
      'about.label.orcid': 'ORCiD',
      'about.label.research': 'Research',
      'about.label.scholar': 'Google Scholar',
      'about.degree': '<a href="https://ci.hfut.edu.cn/English/Home.htm" target="_blank">Intelligent Science and Technology</a> @ <a href="https://www.hfut.edu.cn/" target="_blank">Hefei University of Technology</a>',
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
      'skills.research': 'Research',
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

    // 更新所有 data-i18n-aria 元素（不覆盖子元素，仅设置 aria-label）
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (i18n[lang] && i18n[lang][key]) {
        el.setAttribute('aria-label', i18n[lang][key]);
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
    const blobCount = 10;
    const orbCount = 14;
    let animationId = null;

    // 原本的多巴胺色系 — 明亮活力
    const palette = [
      { r: 255, g: 140, b: 125 },  // 珊瑚
      { r: 255, g: 195, b: 85 },   // 橙
      { r: 255, g: 230, b: 85 },   // 黄
      { r: 85, g: 225, b: 175 },   // 薄荷
      { r: 85, g: 200, b: 255 },   // 天蓝
      { r: 220, g: 140, b: 255 },  // 紫
      { r: 255, g: 145, b: 195 },  // 粉
      { r: 255, g: 195, b: 145 },  // 蜜桃
    ];

    function rgba(c, a) { return `rgba(${c.r|0},${c.g|0},${c.b|0},${a})`; }

    // ===== 大光晕 — 随机布朗运动，每个颜色独立游走 =====
    class GlowBlob {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.radius = Math.random() * 600 + 400;
        this.opacity = Math.random() * 0.22 + 0.20;
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
        this.radius = Math.random() * 220 + 130;
        this.opacity = Math.random() * 0.18 + 0.15;
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
      const blobCount = Math.min(Math.floor(W / 140) + 3, 10);
      for (let i = 0; i < blobCount; i++) blobs.push(new GlowBlob());
      const orbCount = Math.min(Math.floor(W / 100) + 3, 14);
      for (let i = 0; i < orbCount; i++) orbs.push(new FloatingOrb());
    }

    function drawBackground() {
      ctx.fillStyle = '#ffece5';  /* 多巴胺暖底色 */
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

  // 汉堡按钮打开菜单
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMobileMenu);
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

  // 桌面导航点击交由滚动监听自动更新高亮，不干预 active 类以避免闪烁

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

    // 初始化 Liquid Glass 引擎（Snell 折射 + 镜面高光 + 弹簧动画）
    initLiquidGlassEngine();
  });

  // 页面完全加载后重新初始化 Liquid Glass（应对图片加载后的布局偏移）
  window.addEventListener('load', function () {
    handleNavbarScroll();
    initLiquidGlassEngine(true);
  });

})();
