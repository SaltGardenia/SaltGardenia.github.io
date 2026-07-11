import { onMounted } from 'vue'
import {
  SurfaceEquations,
  Spring,
  calculateDisplacementMap1D,
  calculateDisplacementMap2D,
  calculateSpecularHighlight,
  imageDataToDataURL,
  buildFilterSVG,
  glassInstances,
  type GlassInstance,
} from '@/engine/lg-engine'

function createFilterContainer(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('id', 'lg-filters')
  svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden;')
  svg.setAttribute('aria-hidden', 'true')
  document.body.prepend(svg)
  return svg
}

export function useLiquidGlass() {
  function initEngine(force = false) {
    if (force) {
      document.querySelectorAll('[data-lg-ready]').forEach(el => delete (el as HTMLElement).dataset.lgReady)
      const svgContainer = document.getElementById('lg-filters')
      if (svgContainer) {
        const defs = svgContainer.querySelector('defs')
        if (defs) defs.innerHTML = ''
      }
      glassInstances.length = 0
    }

    const glassWarps = document.querySelectorAll<HTMLElement>('.glass-warp')
    const svgContainer = document.getElementById('lg-filters') || createFilterContainer()

    const isChromium = !!(window as any).chrome
    const testEl = document.createElement('div')
    testEl.style.backdropFilter = 'url(#test)'
    const supportsUrlBackdrop = isChromium && testEl.style.backdropFilter.includes('url')

    glassWarps.forEach((warp, index) => {
      const parent = warp.parentElement
      if (!parent || (parent as HTMLElement).dataset.lgReady === 'true') return

      const isContainer = parent.matches('.liquid-glass-card, .liquid-glass-section, .section-glass')
      if (!isContainer) {
        ;(parent as HTMLElement).dataset.lgReady = 'true'
        return
      }

      if (!supportsUrlBackdrop) {
        warp.style.backdropFilter = 'blur(8px) saturate(1.2)'
        ;(warp.style as any).webkitBackdropFilter = 'blur(8px) saturate(1.2)'
        warp.style.boxShadow = 'inset 0 0 0 1px rgba(255, 255, 255, 0.25)'
        ;(parent as HTMLElement).dataset.lgReady = 'true'
        return
      }

      const rect = parent.getBoundingClientRect()
      const style = getComputedStyle(parent)
      const radius = parseFloat(style.borderRadius) || 60
      const w = Math.round(rect.width)
      const h = Math.round(rect.height)
      if (w < 20 || h < 20) return

      const id = `lg-filter-${index}`
      const bezelW = Math.round(Math.min(w, h) * 0.06)

      const filterSVG = buildFilterSVG(id, w, h)
      const defs = svgContainer.querySelector('defs') || (() => {
        const d = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
        svgContainer.appendChild(d)
        return d
      })()
      defs.insertAdjacentHTML('beforeend', filterSVG)

      const surfaceFn = SurfaceEquations.convex_squircle
      const disp1D = calculateDisplacementMap1D(100, bezelW, surfaceFn, 1.5)
      const maxDisp = Math.max(...disp1D.map(Math.abs))
      const dispData = calculateDisplacementMap2D(w, h, w, h, radius, bezelW, maxDisp || 1, disp1D)
      const specData = calculateSpecularHighlight(w, h, radius, bezelW)

      const dispUrl = imageDataToDataURL(dispData)
      const specUrl = imageDataToDataURL(specData)

      const svgEl = svgContainer as SVGSVGElement
      svgEl.getElementById(`${id}-dispImg`)!.setAttribute('href', dispUrl)
      svgEl.getElementById(`${id}-specImg`)!.setAttribute('href', specUrl)
      svgEl.getElementById(`${id}-dispMap`)!.setAttribute('scale', String(maxDisp * 1.5))
      svgEl.getElementById(`${id}-specAlpha`)!.setAttribute('slope', '0.5')

      warp.style.backdropFilter = `url(#${id})`
      ;(warp.style as any).webkitBackdropFilter = `url(#${id})`
      warp.style.filter = 'none'

      ;(parent as HTMLElement).dataset.lgReady = 'true'

      glassInstances.push({ parent, warp, id, w, h, radius, bezelW, maxDisp: maxDisp || 30 })
    })

    initGlassButtonSprings()
  }

  function initGlassButtonSprings() {
    const btns = document.querySelectorAll<HTMLElement>('.liquid-glass-btn, .liquid-glass-btn-pill')

    btns.forEach(btn => {
      if (btn.dataset.lgSpring === 'true') return
      btn.dataset.lgSpring = 'true'

      const springs = {
        scale: new Spring(1, 150, 6),
        refraction: new Spring(0.8, 100, 5),
        specAngle: new Spring(Math.PI / 3, 300, 30),
      }
      const state = { hovering: false, pressed: false }
      let rafId: number | null = null
      let lastTimestamp: number | null = null
      let lastFilterScale: number | undefined
      let lastSpecAngle: number | undefined

      const warp = btn.querySelector<HTMLElement>('.glass-warp')
      const filterId = warp ? warp.style.filter.replace('url(#', '').replace(')', '') : null

      function loop(ts: number) {
        if (!lastTimestamp) lastTimestamp = ts
        const dt = Math.min((ts - lastTimestamp) / 1000, 0.05)
        lastTimestamp = ts

        if (state.pressed) {
          springs.scale.setTarget(1)
          springs.refraction.setTarget(1.5)
          springs.specAngle.setTarget(-4.19)
        } else if (state.hovering) {
          springs.scale.setTarget(1)
          springs.refraction.setTarget(1.0)
          springs.specAngle.setTarget(-1.05)
        } else {
          springs.scale.setTarget(1)
          springs.refraction.setTarget(0.8)
          springs.specAngle.setTarget(1.05)
        }

        const maxSubstep = 1 / 120
        let remaining = dt
        while (remaining > 0) {
          const step = Math.min(remaining, maxSubstep)
          Object.values(springs).forEach(s => s.update(step))
          remaining -= step
        }

        if (filterId) {
          const newScale = (glassInstances.find(g => g.id === filterId)?.maxDisp || 30) * springs.refraction.value
          const roundedFS = Math.round(newScale)
          if (Math.abs(roundedFS - (lastFilterScale || -1)) > 0.5) {
            const dispMap = document.getElementById(`${filterId}-dispMap`)
            if (dispMap) dispMap.setAttribute('scale', String(newScale))
            lastFilterScale = roundedFS
          }

          const angleDiff = Math.abs(springs.specAngle.value - (lastSpecAngle || 1.05))
          if (angleDiff > 0.08 && warp) {
            const inst = glassInstances.find(g => g.warp === warp)
            if (inst) {
              const specData = calculateSpecularHighlight(inst.w, inst.h, inst.radius, inst.bezelW, springs.specAngle.value)
              const specUrl = imageDataToDataURL(specData)
              const specImg = document.getElementById(`${filterId}-specImg`)
              if (specImg) specImg.setAttribute('href', specUrl)
            }
            lastSpecAngle = springs.specAngle.value
          }
        }

        if (!Object.values(springs).every(s => s.isSettled())) {
          rafId = requestAnimationFrame(loop)
        } else {
          rafId = null
        }
      }

      btn.addEventListener('mouseenter', () => { state.hovering = true; if (!rafId) { lastTimestamp = null; rafId = requestAnimationFrame(loop) } })
      btn.addEventListener('mouseleave', () => { state.hovering = false; if (!rafId) { lastTimestamp = null; rafId = requestAnimationFrame(loop) } })
      btn.addEventListener('mousedown', () => { state.pressed = true; if (!rafId) { lastTimestamp = null; rafId = requestAnimationFrame(loop) } })
      window.addEventListener('mouseup', () => { if (state.pressed) { state.pressed = false; if (!rafId) { lastTimestamp = null; rafId = requestAnimationFrame(loop) } } })
    })
  }

  return { initEngine }
}
