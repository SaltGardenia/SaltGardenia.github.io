/* ============================================================
   Liquid Glass Engine — 移植自 winaviation/dylv 项目
   提供：曲面方程 / 折射位移图 / 镜面高光 / 弹簧物理
   ============================================================ */

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

// ---------- 弹簧物理 ----------
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

// ---------- 核心：Snell 折射位移图计算 ----------
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

// ---------- 镜面高光（rim specular）----------
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

function imageDataToDataURL(imageData) {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

// ---------- SVG Filter 模板 ----------
function buildFilterSVG(id, width, height) {
  return `
    <filter id="${id}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
      <feImage id="${id}-dispImg" href="" x="0" y="0" width="${width}" height="${height}" result="displacement_map" preserveAspectRatio="none"/>
      <feDisplacementMap id="${id}-dispMap" in="SourceGraphic" in2="displacement_map" scale="30" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
      <feGaussianBlur in="displaced" stdDeviation="5" result="blurred"/>
      <feColorMatrix in="blurred" type="saturate" values="1.0" result="displaced_saturated"/>
      <feImage id="${id}-specImg" href="" x="0" y="0" width="${width}" height="${height}" result="specular_layer" preserveAspectRatio="none"/>
      <feComponentTransfer in="specular_layer" result="specular_faded">
        <feFuncA id="${id}-specAlpha" type="linear" slope="0.4"/>
      </feComponentTransfer>
      <feBlend in="specular_faded" in2="displaced_saturated" mode="screen"/>
    </filter>`;
}

// ---------- Liquid Glass 元素管理器 ----------
const glassInstances = [];

function initLiquidGlassEngine() {
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

    // 非 Chromium 浏览器回退到简单 blur，不应用 SVG filter
    if (!supportsUrlBackdrop) {
      warp.style.backdropFilter = 'saturate(1.2) blur(12px)';
      warp.style.webkitBackdropFilter = 'saturate(1.2) blur(12px)';
      parent.dataset.lgReady = 'true';
      return;
    }

    const rect = parent.getBoundingClientRect();
    const style = getComputedStyle(parent);
    const radius = parseFloat(style.borderRadius) || 60;
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (w < 20 || h < 20) return; // too small

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

    // 让 glass-warp 通过 backdrop-filter 引用专属 SVG filter
    // 重要：必须是 backdrop-filter（过滤背后背景），不是 filter（过滤自身）
    warp.style.backdropFilter = `url(#${id})`;
    warp.style.webkitBackdropFilter = `url(#${id})`;
    // 移除 inline filter，由 CSS 的 backdrop-filter 统一处理
    warp.style.filter = 'none';

    parent.dataset.lgReady = 'true';

    glassInstances.push({ parent, warp, id, w, h, radius, bezelW, maxDisp: maxDisp || 30 });
  });

  // ---------- 按钮弹簧动画 ----------
  initGlassButtonSprings();
}

function createFilterContainer() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('id', 'lg-filters');
  svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;');
  svg.setAttribute('aria-hidden', 'true');
  document.body.prepend(svg);
  return svg;
}

// ---------- 按钮弹簧交互动画 ----------
function initGlassButtonSprings() {
  const btns = document.querySelectorAll('.liquid-glass-btn, .liquid-glass-btn-pill');

  btns.forEach(btn => {
    if (btn.dataset.lgSpring === 'true') return;
    btn.dataset.lgSpring = 'true';

    const isPill = btn.classList.contains('liquid-glass-btn-pill');

    const springs = {
      scale: new Spring(1, 150, 6),
      refraction: new Spring(0.8, 100, 5),
      specAngle: new Spring(Math.PI / 3, 300, 30),
    };
    if (isPill) {
      springs.shadowY = new Spring(4, 500, 40);
      springs.shadowBlur = new Spring(12, 500, 40);
      springs.shadowAlpha = new Spring(0.15, 500, 40);
    }

    let state = { hovering: false, pressed: false };
    let rafId = null;
    let lastTimestamp = null;
    let lastScale, lastShadow, lastFilterScale, lastSpecAngle;

    const warp = btn.querySelector('.glass-warp');
    const filterId = warp ? warp.style.filter.replace('url(#', '').replace(')', '') : null;

    function loop(ts) {
      if (!lastTimestamp) lastTimestamp = ts;
      const dt = Math.min((ts - lastTimestamp) / 1000, 0.05);
      lastTimestamp = ts;

      if (state.pressed) {
        springs.scale.setTarget(0.98);
        if (isPill) {
          springs.shadowY.setTarget(8);
          springs.shadowBlur.setTarget(16);
          springs.shadowAlpha.setTarget(0.25);
        }
        springs.refraction.setTarget(1.5);
        springs.specAngle.setTarget(-4.19);
      } else if (state.hovering) {
        springs.scale.setTarget(1.05);
        if (isPill) {
          springs.shadowY.setTarget(16);
          springs.shadowBlur.setTarget(24);
          springs.shadowAlpha.setTarget(0.22);
        }
        springs.refraction.setTarget(1.0);
        springs.specAngle.setTarget(-1.05);
      } else {
        springs.scale.setTarget(1);
        if (isPill) {
          springs.shadowY.setTarget(4);
          springs.shadowBlur.setTarget(12);
          springs.shadowAlpha.setTarget(0.15);
        }
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

      if (isPill) {
        const shadow = `${Math.round(springs.shadowY.value)}px ${Math.round(springs.shadowBlur.value)}px rgba(0,0,0,${Math.round(springs.shadowAlpha.value * 1000) / 1000})`;
        if (shadow !== lastShadow) {
          btn.style.boxShadow = shadow;
          lastShadow = shadow;
        }
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
