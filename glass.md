# Liquid Glass 液态玻璃视觉效果 — 完整迁移指南

> 移植自 [winaviation/dylv](https://github.com/winaviation/dylv) 项目，基于 **Snell 折射定律 + SVG feDisplacementMap + 弹簧物理** 实现逼真的液态玻璃效果。

---

## 目录

1. [效果概述](#1-效果概述)
2. [架构总览](#2-架构总览)
3. [HTML 结构规范](#3-html-结构规范)
4. [CSS 样式清单](#4-css-样式清单)
5. [lg-engine.js 核心引擎（完整代码）](#5-lg-enginejs-核心引擎完整代码)
6. [main.js 集成调用](#6-mainjs-集成调用)
7. [组件类型速查表](#7-组件类型速查表)
8. [浏览器兼容性说明](#8-浏览器兼容性说明)
9. [常见问题排查](#9-常见问题排查)

---

## 1. 效果概述

本系统实现了以下视觉效果层级：

| 层级 | 效果 | 实现方式 |
|------|------|----------|
| **折射位移** | 玻璃曲面导致背景扭曲 | Snell 定律 → 1D/2D 位移图 → SVG `feDisplacementMap` |
| **镜面高光** | 边缘 Rim Light | 法线点积计算 → SVG `feBlend`（screen 模式） |
| **玻璃边框** | 边缘细白高光线 | CSS `mask-composite: exclude` + 渐变 |
| **基础模糊** | 毛玻璃底层 | CSS `backdrop-filter: blur()` |
| **弹簧动画** | 按钮 hover/press 弹性形变 | `Spring` 物理类驱动实时参数更新 |

### 视觉效果预览

```
┌─────────────────────────────────────────┐
│  ┌─ glass-highlight-overlay (边框线) ─┐ │
│  │  ┌─ glass-warp ──────────────────┐ │ │
│  │  │  backdrop-filter: url(#filter) │ │ │
│  │  │    ├─ feDisplacementMap (折射)  │ │ │
│  │  │    └─ feBlend (高光叠加)       │ │ │
│  │  └───────────────────────────────┘ │ │
│  │         内容层 (z-index:2)          │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 2. 架构总览

```
项目文件结构（液态玻璃相关）：
├── lg-engine.js          ← 核心引擎（必须引入）
├── style.css             ← 玻璃相关 CSS（提取需要的部分）
├── main.js               ← 在 DOMContentLoaded 和 load 事件中调用引擎
└── index.html            ← HTML 结构参考
```

**数据流：**

```
页面加载
  │
  ├─ DOMContentLoaded → initLiquidGlassEngine()
  │     │
  │     ├─ 遍历所有 .glass-warp 元素
  │     ├─ 检测浏览器支持（Chromium + backdrop-filter: url()）
  │     ├─ 对每个 .liquid-glass-card / .liquid-glass-section：
  │     │   ├─ 获取元素尺寸 & border-radius
  │     │   ├─ 构建专属 SVG <filter>
  │     │   ├─ 计算 1D 折射位移图（Snell 定律）
  │     │   ├─ 生成 2D 位移图 ImageData → dataURL
  │     │   ├─ 计算镜面高光图 ImageData → dataURL
  │     │   ├─ 注入 dataURL 到 SVG filter 的 feImage
  │     │   └─ 设置 warp.style.backdropFilter = "url(#filter-id)"
  │     └─ initGlassButtonSprings()（按钮弹簧交互动画）
  │
  └─ window.load → initLiquidGlassEngine(true)
        └─ 强制重新初始化（应对图片加载后的布局偏移）
```

---

## 3. HTML 结构规范

### 3.1 必备基础设施

在 `<body>` 最顶部需要一个 SVG 滤镜容器（如果 JS 未自动创建）：

```html
<svg id="lg-filters" style="position:absolute;width:0;height:0;overflow:hidden;" aria-hidden="true"></svg>
```

> `lg-engine.js` 会在找不到 `#lg-filters` 时自动创建，但建议手动放置。

### 3.2 引入脚本（顺序重要）

```html
<!-- lg-engine.js 必须在 main.js 之前加载 -->
<script src="lg-engine.js"></script>
<script src="main.js"></script>
```

### 3.3 玻璃卡片组件（.liquid-glass-card）

用于项目卡片：

```html
<div class="project-card liquid-glass-card">
  <!-- 玻璃底层（backdrop-filter 载体） -->
  <span class="glass-warp"></span>

  <!-- 内容区（z-index: 2，在最上层） -->
  <div class="card-inner">
    <h3>标题</h3>
    <p>描述文本</p>
  </div>

  <!-- 玻璃边框高光（mask-composite 描边） -->
  <div class="glass-highlight"></div>
  <div class="glass-highlight-overlay"></div>
</div>
```

**关键约束：**
- `.glass-warp` 必须是容器的**直接子元素**（`warp.parentElement` 被 JS 用来获取容器）
- `.glass-warp` 必须位于内容**之前**（z-index:0 背景层）
- `.glass-highlight-overlay` 在内容之后（z-index:1 边框层）
- 内容区需要 `z-index: 2` 确保在滤镜层之上

### 3.4 玻璃面板组件（.liquid-glass-section）

用于关于/技能等大区块：

```html
<div class="about-content section-glass liquid-glass-section">
  <span class="glass-warp"></span>
  <div class="glass-highlight"></div>
  <div class="glass-highlight-overlay"></div>
  <div class="section-glass-inner">
    <!-- 面板内容 -->
  </div>
</div>
```

### 3.5 导航栏组件（.liquid-glass-nav）

```html
<nav id="navbar" class="liquid-glass-nav">
  <span class="glass-warp"></span>
  <div class="nav-links">
    <a href="#about">关于</a>
    <a href="#projects">项目</a>
  </div>
  <div class="glass-highlight"></div>
  <div class="glass-highlight-overlay"></div>
</nav>
```

> 导航栏不应用 SVG filter（仅 `backdrop-filter: blur()`），因为 JS 过滤了非卡片/区块元素。

### 3.6 按钮组件

**矩形按钮（.liquid-glass-btn）：**

```html
<a class="project-card-btn liquid-glass-btn" href="#">
  <span class="glass-warp"></span>
  <span class="btn-text">GitHub →</span>
  <span class="glass-highlight"></span>
  <span class="glass-highlight-overlay"></span>
</a>
```

**圆形按钮（.liquid-glass-btn-pill）：**

```html
<button class="back-top-btn liquid-glass-btn-pill" id="backTopBtn">
  <span class="glass-warp"></span>
  <span class="glass-highlight"></span>
  <span class="glass-highlight-overlay"></span>
  <span class="btn-text">
    <svg><!-- 图标 --></svg>
  </span>
</button>
```

### 3.7 信息条目（.liquid-glass-card 小尺寸）

```html
<div class="info-item liquid-glass-card">
  <span class="glass-warp"></span>
  <div class="info-text">
    <span class="info-label">标签</span>
    <span class="info-value">值</span>
  </div>
  <div class="glass-highlight"></div>
  <div class="glass-highlight-overlay"></div>
</div>
```

---

## 4. CSS 样式清单

以下是从 `style.css` 中提取的所有液态玻璃相关样式。按需复制到目标项目中。

### 4.1 基础玻璃层（.glass-warp）

```css
/* 玻璃 warp 层：backdrop-filter 载体，由 lg-engine.js 动态设置 */
.glass-warp {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: transparent;
  z-index: 0;
  pointer-events: none;
}
```

### 4.2 玻璃边框高光（.glass-highlight-overlay）

```css
/* 边框高光 — 模拟玻璃边缘反光（mask-composite 描边技法） */
.glass-highlight-overlay {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  opacity: 0.6;
  padding: 1.5px;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 30%,
    rgba(255, 255, 255, 0.7) 50%,
    rgba(255, 255, 255, 0.3) 70%,
    rgba(255, 255, 255, 0) 100%
  );
  transition: background 0.2s ease;
  box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.4) inset;
}
```

### 4.3 鼠标高光层（已禁用）

```css
/* 本项目中已禁用，保留占位即可 */
.glass-highlight {
  display: none;
}
```

### 4.4 导航栏玻璃

```css
.liquid-glass-nav {
  position: relative;
}

/* 导航栏基础模糊（非 Chromium 回退 + 导航栏默认 blur） */
#navbar > .glass-warp,
#homePill > .glass-warp,
#langPill > .glass-warp,
.liquid-glass-btn-pill > .glass-warp {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
```

### 4.5 卡片容器

```css
.project-card.liquid-glass-card {
  position: relative;
  border-radius: 60px;
  overflow: hidden;
  background: transparent;
  box-shadow: 0 12px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06);
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
}

.project-card.liquid-glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 56px rgba(0,0,0,0.20), 0 6px 20px rgba(0,0,0,0.09);
}

.project-card .glass-warp {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: transparent;
  z-index: 0;
  pointer-events: none;
}

.project-card > .glass-highlight-overlay {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  opacity: 0.5;
  padding: 1.5px;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.4) 30%,
    rgba(255,255,255,0.6) 50%,
    rgba(255,255,255,0.2) 70%,
    rgba(255,255,255,0) 100%
  );
}

.card-inner {
  position: relative;
  z-index: 2;
  padding: 32px 28px;
}
```

### 4.6 区块面板

```css
.liquid-glass-section {
  position: relative;
  overflow: hidden;
}

.liquid-glass-section .glass-warp {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: transparent;
  z-index: 0;
  pointer-events: none;
}

.liquid-glass-section .glass-highlight-overlay {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  opacity: 0.4;
  padding: 1.5px;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.4) 30%,
    rgba(255,255,255,0.6) 50%,
    rgba(255,255,255,0.2) 70%,
    rgba(255,255,255,0) 100%
  );
}

.section-glass-inner {
  position: relative;
  z-index: 2;
}

/* 覆盖 section-glass 原有背景 */
.section-glass.liquid-glass-section {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border: none;
}
```

### 4.7 按钮样式

```css
/* ===== 矩形玻璃按钮 ===== */
.liquid-glass-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  align-self: flex-end;
  margin-top: auto;
  padding: 12px 28px;
  border-radius: 60px;
  overflow: hidden;
  background: rgba(255,255,255,0.08);
  border: none;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
}

.liquid-glass-btn .glass-warp {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  z-index: 0;
  pointer-events: none;
}

.liquid-glass-btn .glass-highlight-overlay {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  opacity: 0.5;
  padding: 1.5px;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.5) 30%,
    rgba(255,255,255,0.7) 55%,
    rgba(255,255,255,0.25) 75%,
    rgba(255,255,255,0) 100%
  );
}

.liquid-glass-btn .btn-text {
  position: relative;
  z-index: 2;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary, #1a1a1a);
  text-shadow: 0 1px 0 rgba(255,255,255,0.4);
  white-space: nowrap;
  transition: color 0.2s;
}

.liquid-glass-btn:hover {
  transform: scale(1.04);
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
}

.liquid-glass-btn:active {
  transform: scale(0.96);
}

/* ===== 圆形玻璃按钮（回到顶部等） ===== */
.liquid-glass-btn-pill {
  position: fixed;
  right: 32px;
  bottom: 20%;
  width: 48px;
  height: 48px;
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 900;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
}

.liquid-glass-btn-pill .glass-warp {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: transparent;
  z-index: 0;
  pointer-events: none;
}

.liquid-glass-btn-pill .glass-highlight-overlay {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  opacity: 0.45;
  padding: 1.5px;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.5) 30%,
    rgba(255,255,255,0.7) 55%,
    rgba(255,255,255,0.25) 75%,
    rgba(255,255,255,0) 100%
  );
}

.liquid-glass-btn-pill .btn-text {
  position: relative;
  z-index: 2;
  color: #4a4a60;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.liquid-glass-btn-pill:hover {
  transform: scale(1.1);
}
```

### 4.8 小型信息条目（info-item 专用覆盖）

```css
/* info-item 不使用 SVG filter，只保留 blur + 边框 */
.info-item.liquid-glass-card > .glass-warp {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: transparent;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  z-index: 0;
  pointer-events: none;
}

.info-item.liquid-glass-card > .glass-highlight,
.info-item.liquid-glass-card > .glass-highlight-overlay {
  display: none;
}
```

---

## 5. lg-engine.js 核心引擎（完整代码）

将以下完整代码保存为 `lg-engine.js`，放在目标项目的脚本目录中。

```javascript
/* ============================================================
   Liquid Glass Engine — 移植自 winaviation/dylv 项目
   提供：曲面方程 / 折射位移图 / 镜面高光 / 弹簧物理

   依赖：无外部依赖，纯 Vanilla JS
   兼容：Chromium 浏览器（Chrome/Edge/Opera/Brave）
         Firefox/Safari 自动回退到简单 blur 效果
   ============================================================ */

// ==================== 曲面方程 ====================
const SurfaceEquations = {
  convex_circle: (x) => Math.sqrt(1 - Math.pow(1 - x, 2)),
  convex_squircle: (x) => Math.pow(1 - Math.pow(1 - x, 4), 1 / 4),
  concave: (x) => 1 - Math.sqrt(1 - Math.pow(x, 2)),
  lip: (x) => {
    const convex = Math.pow(1 - Math.pow(1 - Math.min(x * 2, 1), 4), 1 / 4);
    const concave = 1 - Math.sqrt(1 - Math.pow(1 - x, 2)) + 0.1;
    const smootherstep = 6 * Math.pow(x, 5) - 15 * Math.pow(x, 4) + 10 * Math.pow(x, 3);
    return convex * (1 - smootherstep) + concave * smootherstep;
  },
};

// ==================== 弹簧物理 ====================
class Spring {
  constructor(value, stiffness = 300, damping = 20) {
    this.value = value;
    this.target = value;
    this.velocity = 0;
    this.stiffness = stiffness;
    this.damping = damping;
  }
  setTarget(target) { this.target = target; }
  update(dt) {
    const force = (this.target - this.value) * this.stiffness;
    this.velocity += (force - this.velocity * this.damping) * dt;
    this.value += this.velocity * dt;
    if (Math.abs(this.target - this.value) < 0.0001 && Math.abs(this.velocity) < 0.001) {
      this.value = this.target;
      this.velocity = 0;
    }
    return this.value;
  }
  isSettled() {
    return Math.abs(this.target - this.value) < 0.0001 && Math.abs(this.velocity) < 0.001;
  }
}

// ==================== Snell 折射位移图（1D） ====================
function calculateDisplacementMap1D(glassThickness, bezelWidth, surfaceFn, refractiveIndex, samples = 128) {
  const eta = 1 / refractiveIndex;
  function refract(normalX, normalY) {
    const dot = normalY;
    const k = 1 - eta * eta * (1 - dot * dot);
    if (k < 0) return null;
    const kSqrt = Math.sqrt(k);
    return [-(eta * dot + kSqrt) * normalX, eta - (eta * dot + kSqrt) * normalY];
  }
  const result = [];
  for (let i = 0; i < samples; i++) {
    const x = i / samples;
    const y = surfaceFn(x);
    const dx = x < 1 ? 0.0001 : -0.0001;
    const y2 = surfaceFn(Math.max(0, Math.min(1, x + dx)));
    const derivative = (y2 - y) / dx;
    const magnitude = Math.sqrt(derivative * derivative + 1);
    const normal = [-derivative / magnitude, -1 / magnitude];
    const refracted = refract(normal[0], normal[1]);
    if (!refracted) {
      result.push(0);
    } else {
      const remainingHeight = y * bezelWidth + glassThickness;
      result.push(refracted[0] * (remainingHeight / refracted[1]));
    }
  }
  return result;
}

// ==================== 折射位移图（2D） ====================
function calculateDisplacementMap2D(canvasWidth, canvasHeight, objectWidth, objectHeight, radius, bezelWidth, maximumDisplacement, precomputedMap) {
  const imageData = new ImageData(canvasWidth, canvasHeight);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = 128; imageData.data[i + 1] = 128;
    imageData.data[i + 2] = 0; imageData.data[i + 3] = 255;
  }
  const r2 = radius * radius;
  const rp1_2 = (radius + 1) * (radius + 1);
  const rb_2 = Math.max(0, (radius - bezelWidth) * (radius - bezelWidth));
  const wb = objectWidth - radius * 2;
  const hb = objectHeight - radius * 2;
  const ox = (canvasWidth - objectWidth) / 2;
  const oy = (canvasHeight - objectHeight) / 2;

  for (let y1 = 0; y1 < objectHeight; y1++) {
    for (let x1 = 0; x1 < objectWidth; x1++) {
      const idx = ((oy + y1) * canvasWidth + ox + x1) * 4;
      const isL = x1 < radius, isR = x1 >= objectWidth - radius;
      const isT = y1 < radius, isB = y1 >= objectHeight - radius;
      const x = isL ? x1 - radius : isR ? x1 - radius - wb : 0;
      const y = isT ? y1 - radius : isB ? y1 - radius - hb : 0;
      const d2 = x * x + y * y;
      if (d2 <= rp1_2 && d2 >= rb_2) {
        const dist = Math.sqrt(d2);
        const opacity = d2 < r2 ? 1 : 1 - (dist - Math.sqrt(r2)) / (Math.sqrt(rp1_2) - Math.sqrt(r2));
        const ds = radius - dist;
        const cos = dist > 0 ? x / dist : 0;
        const sin = dist > 0 ? y / dist : 0;
        const ratio = Math.max(0, Math.min(1, ds / bezelWidth));
        const idx1d = Math.floor(ratio * precomputedMap.length);
        const dist1d = precomputedMap[Math.max(0, Math.min(idx1d, precomputedMap.length - 1))] || 0;
        const dX = maximumDisplacement > 0 ? (-cos * dist1d) / maximumDisplacement : 0;
        const dY = maximumDisplacement > 0 ? (-sin * dist1d) / maximumDisplacement : 0;
        imageData.data[idx] = Math.max(0, Math.min(255, 128 + dX * 127 * opacity));
        imageData.data[idx + 1] = Math.max(0, Math.min(255, 128 + dY * 127 * opacity));
      }
    }
  }
  return imageData;
}

// ==================== 镜面高光（Rim Specular） ====================
function calculateSpecularHighlight(objectWidth, objectHeight, radius, bezelWidth, specularAngle = Math.PI / 3) {
  const imageData = new ImageData(objectWidth, objectHeight);
  const sv = [Math.cos(specularAngle), Math.sin(specularAngle)];
  const thickness = 1.5;
  const r2 = radius * radius;
  const rp1_2 = (radius + 1) * (radius + 1);
  const rs_2 = Math.max(0, (radius - thickness) * (radius - thickness));
  const wb = objectWidth - radius * 2;
  const hb = objectHeight - radius * 2;

  for (let y1 = 0; y1 < objectHeight; y1++) {
    for (let x1 = 0; x1 < objectWidth; x1++) {
      const idx = (y1 * objectWidth + x1) * 4;
      const isL = x1 < radius, isR = x1 >= objectWidth - radius;
      const isT = y1 < radius, isB = y1 >= objectHeight - radius;
      const x = isL ? x1 - radius : isR ? x1 - radius - wb : 0;
      const y = isT ? y1 - radius : isB ? y1 - radius - hb : 0;
      const d2 = x * x + y * y;
      if (d2 <= rp1_2 && d2 >= rs_2) {
        const dist = Math.sqrt(d2);
        const opacity = d2 < r2 ? 1 : 1 - (dist - Math.sqrt(r2)) / (Math.sqrt(rp1_2) - Math.sqrt(r2));
        const ds = radius - dist;
        const cos = dist > 0 ? x / dist : 0;
        const sin = dist > 0 ? -y / dist : 0;
        const dot = Math.abs(cos * sv[0] + sin * sv[1]);
        const er = Math.max(0, Math.min(1, ds / thickness));
        const sf = Math.sqrt(1 - (1 - er) * (1 - er));
        const coeff = dot * sf;
        const color = Math.min(255, 255 * coeff);
        const finalA = Math.min(255, color * coeff * opacity);
        imageData.data[idx] = color;
        imageData.data[idx + 1] = color;
        imageData.data[idx + 2] = color;
        imageData.data[idx + 3] = finalA;
      }
    }
  }
  return imageData;
}

// ==================== ImageData → DataURL ====================
function imageDataToDataURL(imageData) {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

// ==================== SVG Filter 模板 ====================
function buildFilterSVG(id, width, height) {
  return `
    <filter id="${id}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blurred"/>
      <feImage id="${id}-dispImg" href="" x="0" y="0" width="${width}" height="${height}" result="displacement_map" preserveAspectRatio="none"/>
      <feDisplacementMap id="${id}-dispMap" in="blurred" in2="displacement_map" scale="50" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
      <feColorMatrix in="displaced" type="saturate" values="1.0" result="displaced_saturated"/>
      <feImage id="${id}-specImg" href="" x="0" y="0" width="${width}" height="${height}" result="specular_layer" preserveAspectRatio="none"/>
      <feComponentTransfer in="specular_layer" result="specular_faded">
        <feFuncA id="${id}-specAlpha" type="linear" slope="0.5"/>
      </feComponentTransfer>
      <feBlend in="specular_faded" in2="displaced_saturated" mode="screen"/>
    </filter>`;
}

// ==================== 全局实例存储 ====================
const glassInstances = [];

// ==================== 主初始化函数 ====================
function initLiquidGlassEngine(force) {
  // force 模式下：清除所有 lgReady 标记并移除旧 filter 元素
  if (force) {
    document.querySelectorAll('[data-lg-ready]').forEach(el => delete el.dataset.lgReady);
    const svgContainer = document.getElementById('lg-filters');
    if (svgContainer) {
      const defs = svgContainer.querySelector('defs');
      if (defs) defs.innerHTML = '';
    }
    glassInstances.length = 0;
  }

  const glassWarps = document.querySelectorAll('.glass-warp');
  const svgContainer = document.getElementById('lg-filters') || createFilterContainer();

  // 检测浏览器是否支持 backdrop-filter: url()（仅 Chromium 支持）
  const isChromium = !!window.chrome;
  const testEl = document.createElement('div');
  testEl.style.backdropFilter = 'url(#test)';
  const supportsUrlBackdrop = isChromium && testEl.style.backdropFilter.includes('url');

  glassWarps.forEach((warp, index) => {
    const parent = warp.parentElement;
    if (!parent || parent.dataset.lgReady === 'true') return;

    // 只对容器级玻璃元素应用 SVG filter（卡片、区块面板）
    const isContainer = parent.matches('.liquid-glass-card, .liquid-glass-section, .section-glass');
    if (!isContainer) {
      parent.dataset.lgReady = 'true';
      return;
    }

    // 非 Chromium 浏览器回退到简单 blur
    if (!supportsUrlBackdrop) {
      warp.style.backdropFilter = 'blur(8px) saturate(1.2)';
      warp.style.webkitBackdropFilter = 'blur(8px) saturate(1.2)';
      warp.style.boxShadow = 'inset 0 0 0 1px rgba(255, 255, 255, 0.25)';
      parent.dataset.lgReady = 'true';
      return;
    }

    const rect = parent.getBoundingClientRect();
    const style = getComputedStyle(parent);
    const radius = parseFloat(style.borderRadius) || 60;
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (w < 20 || h < 20) return;

    const id = `lg-filter-${index}`;
    const bezelW = Math.round(Math.min(w, h) * 0.06);

    // 构建专属 SVG filter
    const filterSVG = buildFilterSVG(id, w, h);
    const defs = svgContainer.querySelector('defs') || (() => {
      const d = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svgContainer.appendChild(d);
      return d;
    })();
    defs.insertAdjacentHTML('beforeend', filterSVG);

    // 计算位移图
    const surfaceFn = SurfaceEquations.convex_squircle;
    const disp1D = calculateDisplacementMap1D(100, bezelW, surfaceFn, 1.5);
    const maxDisp = Math.max(...disp1D.map(Math.abs));
    const dispData = calculateDisplacementMap2D(w, h, w, h, radius, bezelW, maxDisp || 1, disp1D);
    const specData = calculateSpecularHighlight(w, h, radius, bezelW);

    const dispUrl = imageDataToDataURL(dispData);
    const specUrl = imageDataToDataURL(specData);

    svgContainer.getElementById(`${id}-dispImg`).setAttribute('href', dispUrl);
    svgContainer.getElementById(`${id}-specImg`).setAttribute('href', specUrl);
    svgContainer.getElementById(`${id}-dispMap`).setAttribute('scale', maxDisp * 1.5);
    svgContainer.getElementById(`${id}-specAlpha`).setAttribute('slope', '0.5');

    // 关键：通过 backdrop-filter 引用专属 SVG filter
    warp.style.backdropFilter = `url(#${id})`;
    warp.style.webkitBackdropFilter = `url(#${id})`;
    warp.style.filter = 'none';

    parent.dataset.lgReady = 'true';

    glassInstances.push({ parent, warp, id, w, h, radius, bezelW, maxDisp: maxDisp || 30 });
  });

  // 初始化按钮弹簧动画
  initGlassButtonSprings();
}

// ==================== 创建 SVG 滤镜容器 ====================
function createFilterContainer() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('id', 'lg-filters');
  svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;');
  svg.setAttribute('aria-hidden', 'true');
  document.body.prepend(svg);
  return svg;
}

// ==================== 按钮弹簧交互动画 ====================
function initGlassButtonSprings() {
  const btns = document.querySelectorAll('.liquid-glass-btn, .liquid-glass-btn-pill');

  btns.forEach(btn => {
    if (btn.dataset.lgSpring === 'true') return;
    btn.dataset.lgSpring = 'true';

    const springs = {
      scale: new Spring(1, 150, 6),
      refraction: new Spring(0.8, 100, 5),
      specAngle: new Spring(Math.PI / 3, 300, 30),
    };
    let state = { hovering: false, pressed: false };
    let rafId = null;
    let lastTimestamp = null;
    let lastScale, lastFilterScale, lastSpecAngle;

    const warp = btn.querySelector('.glass-warp');
    const filterId = warp ? warp.style.filter.replace('url(#', '').replace(')', '') : null;

    function loop(ts) {
      if (!lastTimestamp) lastTimestamp = ts;
      const dt = Math.min((ts - lastTimestamp) / 1000, 0.05);
      lastTimestamp = ts;

      if (state.pressed) {
        springs.scale.setTarget(0.98);
        springs.refraction.setTarget(1.5);
        springs.specAngle.setTarget(-4.19);
      } else if (state.hovering) {
        springs.scale.setTarget(1.05);
        springs.refraction.setTarget(1.0);
        springs.specAngle.setTarget(-1.05);
      } else {
        springs.scale.setTarget(1);
        springs.refraction.setTarget(0.8);
        springs.specAngle.setTarget(1.05);
      }

      const maxSubstep = 1 / 120;
      let remaining = dt;
      while (remaining > 0) {
        const step = Math.min(remaining, maxSubstep);
        Object.values(springs).forEach(s => s.update(step));
        remaining -= step;
      }

      const s = springs.scale.value;
      const roundedS = Math.round(s * 10000) / 10000;
      if (roundedS !== lastScale) {
        btn.style.transform = roundedS === 1 ? '' : `scale(${roundedS})`;
        lastScale = roundedS;
      }

      // 动态更新 filter displacement scale
      if (filterId) {
        const newScale = (glassInstances.find(g => g.id === filterId)?.maxDisp || 30) * springs.refraction.value;
        const roundedFS = Math.round(newScale);
        if (Math.abs(roundedFS - (lastFilterScale || -1)) > 0.5) {
          const dispMap = document.getElementById(`${filterId}-dispMap`);
          if (dispMap) dispMap.setAttribute('scale', newScale);
          lastFilterScale = roundedFS;
        }

        const angleDiff = Math.abs(springs.specAngle.value - (lastSpecAngle || 1.05));
        if (angleDiff > 0.08 && warp) {
          const inst = glassInstances.find(g => g.warp === warp);
          if (inst) {
            const specData = calculateSpecularHighlight(inst.w, inst.h, inst.radius, inst.bezelW, springs.specAngle.value);
            const specUrl = imageDataToDataURL(specData);
            const specImg = document.getElementById(`${filterId}-specImg`);
            if (specImg) specImg.setAttribute('href', specUrl);
          }
          lastSpecAngle = springs.specAngle.value;
        }
      }

      if (!Object.values(springs).every(s => s.isSettled())) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    }

    btn.addEventListener('mouseenter', () => { state.hovering = true; if (!rafId) { lastTimestamp = null; rafId = requestAnimationFrame(loop); } });
    btn.addEventListener('mouseleave', () => { state.hovering = false; if (!rafId) { lastTimestamp = null; rafId = requestAnimationFrame(loop); } });
    btn.addEventListener('mousedown', () => { state.pressed = true; if (!rafId) { lastTimestamp = null; rafId = requestAnimationFrame(loop); } });
    window.addEventListener('mouseup', () => { if (state.pressed) { state.pressed = false; if (!rafId) { lastTimestamp = null; rafId = requestAnimationFrame(loop); } } });
  });
}
```

---

## 6. main.js 集成调用

在目标项目的入口 JS 中，添加以下调用：

```javascript
// 页面 DOM 加载完成后初始化
window.addEventListener('DOMContentLoaded', function () {
  // 首次初始化 Liquid Glass 引擎
  initLiquidGlassEngine();
});

// 页面完全加载后（图片等资源就绪）强制重新初始化
window.addEventListener('load', function () {
  // force=true：清除旧数据，重新计算（应对图片加载后的布局偏移）
  initLiquidGlassEngine(true);
});
```

**重要：** `lg-engine.js` 必须在包含上述调用的 JS 文件**之前**加载：

```html
<script src="lg-engine.js"></script>
<script src="main.js"></script>
```

---

## 7. 组件类型速查表

| CSS 类名 | 用途 | 是否应用 SVG Filter | 是否有弹簧动画 |
|----------|------|---------------------|----------------|
| `.liquid-glass-card` | 项目卡片、信息条目 | ✅ 是 | ❌ 否 |
| `.liquid-glass-section` | 关于/技能区块面板 | ✅ 是 | ❌ 否 |
| `.section-glass` | 与 `.liquid-glass-section` 配合使用 | ✅ 是 | ❌ 否 |
| `.liquid-glass-nav` | 导航栏容器 | ❌ 否（仅 blur） | ❌ 否 |
| `.nav-actions-pill` | 导航操作药丸 | ❌ 否（仅 blur） | ❌ 否 |
| `.liquid-glass-btn` | 矩形玻璃按钮 | ❌ 否 | ✅ 是 |
| `.liquid-glass-btn-pill` | 圆形玻璃按钮 | ❌ 否 | ✅ 是 |

### 每个组件的子元素清单

| 组件 | glass-warp | glass-highlight | glass-highlight-overlay | 内容容器 |
|------|-----------|-----------------|------------------------|---------|
| `.liquid-glass-card` | ✅ | ✅ | ✅ | `.card-inner` (z:2) |
| `.liquid-glass-section` | ✅ | ✅ | ✅ | `.section-glass-inner` (z:2) |
| `.liquid-glass-nav` | ✅ | ✅ | ✅ | `.nav-links` (z:2) |
| `.liquid-glass-btn` | ✅ | ✅ | ✅ | `.btn-text` (z:2) |
| `.liquid-glass-btn-pill` | ✅ | ✅ | ✅ | `.btn-text` (z:2) |

---

## 8. 浏览器兼容性说明

| 浏览器 | 折射位移 | 镜面高光 | 弹簧动画 | 基础模糊 |
|--------|---------|---------|---------|---------|
| **Chrome / Edge** | ✅ 完整 | ✅ 完整 | ✅ 完整 | ✅ |
| **Opera / Brave** | ✅ 完整 | ✅ 完整 | ✅ 完整 | ✅ |
| **Firefox** | ❌ 回退 | ❌ 回退 | ✅ 完整 | ✅ |
| **Safari** | ❌ 回退 | ❌ 回退 | ✅ 完整 | ✅ |

**回退行为：** 非 Chromium 浏览器自动降级为 `backdrop-filter: blur(8px) saturate(1.2)` + 白色内边框。视觉效果仍然是好看的毛玻璃，只是没有曲面折射。

**原因：** Firefox/Safari 不支持在 `backdrop-filter` 中使用 `url(#svg-filter)`。这是 CSS 规范的限制，不是 bug。

---

## 9. 常见问题排查

### Q1: 玻璃效果完全不显示
- 确认 `.glass-warp` 是容器的**直接子元素**
- 确认 `lg-engine.js` 在 `main.js` **之前**加载
- 确认在 `DOMContentLoaded` 和 `load` 事件中调用了 `initLiquidGlassEngine()`
- 打开 DevTools 检查 `#lg-filters` SVG 是否存在，`<defs>` 中是否有 `<filter>` 元素

### Q2: 折射效果不跟随背景变化
- 确认使用的是 `backdrop-filter: url(#id)`（过滤背景），而非 `filter: url(#id)`（过滤自身）

### Q3: 按钮弹簧动画不生效
- 确认按钮有 `liquid-glass-btn` 或 `liquid-glass-btn-pill` 类名
- 确认按钮内部有 `.glass-warp` 子元素
- 按钮的 CSS `transform` 不要被其他样式覆盖

### Q4: 页面加载后布局偏移导致效果错位
- 已在 `window.load` 事件中调用 `initLiquidGlassEngine(true)` 强制重新计算
- 如果有动态内容（如 AJAX 加载），加载完成后手动调用 `initLiquidGlassEngine(true)`

### Q5: 性能问题（大量卡片时卡顿）
- 每个玻璃卡片会生成独立的 SVG filter + 2 个 ImageData dataURL
- 建议限制同时可见的玻璃卡片数量在 20 个以内
- 按钮弹簧动画使用 `requestAnimationFrame`，只在交互时激活，闲置时自动停止

### Q6: 自定义 border-radius
- 引擎会自动读取容器的 `getComputedStyle().borderRadius`
- 确保 CSS 中设置了 `border-radius`，否则默认使用 60px
- 支持任何 px 值，但不支持百分比 borderRadius（引擎会 fallback 到 60px）
```

