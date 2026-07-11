/* ============================================================
   Liquid Glass Engine — 移植自 winaviation/dylv 项目
   提供：曲面方程 / 折射位移图 / 镜面高光 / 弹簧物理
   ============================================================ */

export const SurfaceEquations = {
  convex_circle: (x: number) => Math.sqrt(1 - Math.pow(1 - x, 2)),
  convex_squircle: (x: number) => Math.pow(1 - Math.pow(1 - x, 4), 1 / 4),
  concave: (x: number) => 1 - Math.sqrt(1 - Math.pow(x, 2)),
  lip: (x: number) => {
    const convex = Math.pow(1 - Math.pow(1 - Math.min(x * 2, 1), 4), 1 / 4)
    const concave = 1 - Math.sqrt(1 - Math.pow(1 - x, 2)) + 0.1
    const smootherstep = 6 * Math.pow(x, 5) - 15 * Math.pow(x, 4) + 10 * Math.pow(x, 3)
    return convex * (1 - smootherstep) + concave * smootherstep
  },
}

// ---------- 弹簧物理 ----------
export class Spring {
  value: number
  target: number
  velocity: number
  stiffness: number
  damping: number

  constructor(value: number, stiffness = 300, damping = 20) {
    this.value = value
    this.target = value
    this.velocity = 0
    this.stiffness = stiffness
    this.damping = damping
  }

  setTarget(target: number) { this.target = target }
  update(dt: number) {
    const force = (this.target - this.value) * this.stiffness
    this.velocity += (force - this.velocity * this.damping) * dt
    this.value += this.velocity * dt
    if (Math.abs(this.target - this.value) < 0.0001 && Math.abs(this.velocity) < 0.001) {
      this.value = this.target
      this.velocity = 0
    }
    return this.value
  }
  isSettled() {
    return Math.abs(this.target - this.value) < 0.0001 && Math.abs(this.velocity) < 0.001
  }
}

// ---------- 核心：Snell 折射位移图计算 ----------
export function calculateDisplacementMap1D(
  glassThickness: number,
  bezelWidth: number,
  surfaceFn: (x: number) => number,
  refractiveIndex: number,
  samples = 128
): number[] {
  const eta = 1 / refractiveIndex
  function refract(normalX: number, normalY: number): [number, number] | null {
    const dot = normalY
    const k = 1 - eta * eta * (1 - dot * dot)
    if (k < 0) return null
    const kSqrt = Math.sqrt(k)
    return [-(eta * dot + kSqrt) * normalX, eta - (eta * dot + kSqrt) * normalY]
  }
  const result: number[] = []
  for (let i = 0; i < samples; i++) {
    const x = i / samples
    const y = surfaceFn(x)
    const dx = x < 1 ? 0.0001 : -0.0001
    const y2 = surfaceFn(Math.max(0, Math.min(1, x + dx)))
    const derivative = (y2 - y) / dx
    const magnitude = Math.sqrt(derivative * derivative + 1)
    const normal = [-derivative / magnitude, -1 / magnitude]
    const refracted = refract(normal[0], normal[1])
    if (!refracted) {
      result.push(0)
    } else {
      const remainingHeight = y * bezelWidth + glassThickness
      result.push(refracted[0] * (remainingHeight / refracted[1]))
    }
  }
  return result
}

export function calculateDisplacementMap2D(
  canvasWidth: number, canvasHeight: number,
  objectWidth: number, objectHeight: number,
  radius: number, bezelWidth: number,
  maximumDisplacement: number, precomputedMap: number[]
): ImageData {
  const imageData = new ImageData(canvasWidth, canvasHeight)
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = 128; imageData.data[i + 1] = 128
    imageData.data[i + 2] = 0; imageData.data[i + 3] = 255
  }
  const r2 = radius * radius
  const rp1_2 = (radius + 1) * (radius + 1)
  const rb_2 = Math.max(0, (radius - bezelWidth) * (radius - bezelWidth))
  const wb = objectWidth - radius * 2
  const hb = objectHeight - radius * 2
  const ox = (canvasWidth - objectWidth) / 2
  const oy = (canvasHeight - objectHeight) / 2

  for (let y1 = 0; y1 < objectHeight; y1++) {
    for (let x1 = 0; x1 < objectWidth; x1++) {
      const idx = ((oy + y1) * canvasWidth + ox + x1) * 4
      const isL = x1 < radius, isR = x1 >= objectWidth - radius
      const isT = y1 < radius, isB = y1 >= objectHeight - radius
      const x = isL ? x1 - radius : isR ? x1 - radius - wb : 0
      const y = isT ? y1 - radius : isB ? y1 - radius - hb : 0
      const d2 = x * x + y * y
      if (d2 <= rp1_2 && d2 >= rb_2) {
        const dist = Math.sqrt(d2)
        const opacity = d2 < r2 ? 1 : 1 - (dist - Math.sqrt(r2)) / (Math.sqrt(rp1_2) - Math.sqrt(r2))
        const ds = radius - dist
        const cos = dist > 0 ? x / dist : 0
        const sin = dist > 0 ? y / dist : 0
        const ratio = Math.max(0, Math.min(1, ds / bezelWidth))
        const idx1d = Math.floor(ratio * precomputedMap.length)
        const dist1d = precomputedMap[Math.max(0, Math.min(idx1d, precomputedMap.length - 1))] || 0
        const dX = maximumDisplacement > 0 ? (-cos * dist1d) / maximumDisplacement : 0
        const dY = maximumDisplacement > 0 ? (-sin * dist1d) / maximumDisplacement : 0
        imageData.data[idx] = Math.max(0, Math.min(255, 128 + dX * 127 * opacity))
        imageData.data[idx + 1] = Math.max(0, Math.min(255, 128 + dY * 127 * opacity))
      }
    }
  }
  return imageData
}

// ---------- 镜面高光（rim specular）----------
export function calculateSpecularHighlight(
  objectWidth: number, objectHeight: number,
  radius: number, bezelWidth: number,
  specularAngle = Math.PI / 3
): ImageData {
  const imageData = new ImageData(objectWidth, objectHeight)
  const sv = [Math.cos(specularAngle), Math.sin(specularAngle)]
  const thickness = 1.5
  const r2 = radius * radius
  const rp1_2 = (radius + 1) * (radius + 1)
  const rs_2 = Math.max(0, (radius - thickness) * (radius - thickness))
  const wb = objectWidth - radius * 2
  const hb = objectHeight - radius * 2

  for (let y1 = 0; y1 < objectHeight; y1++) {
    for (let x1 = 0; x1 < objectWidth; x1++) {
      const idx = (y1 * objectWidth + x1) * 4
      const isL = x1 < radius, isR = x1 >= objectWidth - radius
      const isT = y1 < radius, isB = y1 >= objectHeight - radius
      const x = isL ? x1 - radius : isR ? x1 - radius - wb : 0
      const y = isT ? y1 - radius : isB ? y1 - radius - hb : 0
      const d2 = x * x + y * y
      if (d2 <= rp1_2 && d2 >= rs_2) {
        const dist = Math.sqrt(d2)
        const opacity = d2 < r2 ? 1 : 1 - (dist - Math.sqrt(r2)) / (Math.sqrt(rp1_2) - Math.sqrt(r2))
        const ds = radius - dist
        const cos = dist > 0 ? x / dist : 0
        const sin = dist > 0 ? -y / dist : 0
        const dot = Math.abs(cos * sv[0] + sin * sv[1])
        const er = Math.max(0, Math.min(1, ds / thickness))
        const sf = Math.sqrt(1 - (1 - er) * (1 - er))
        const coeff = dot * sf
        const color = Math.min(255, 255 * coeff)
        const finalA = Math.min(255, color * coeff * opacity)
        imageData.data[idx] = color
        imageData.data[idx + 1] = color
        imageData.data[idx + 2] = color
        imageData.data[idx + 3] = finalA
      }
    }
  }
  return imageData
}

export function imageDataToDataURL(imageData: ImageData): string {
  const canvas = document.createElement('canvas')
  canvas.width = imageData.width
  canvas.height = imageData.height
  const ctx = canvas.getContext('2d')!
  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL()
}

// ---------- SVG Filter 模板 ----------
export function buildFilterSVG(id: string, width: number, height: number): string {
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
    </filter>`
}

export interface GlassInstance {
  parent: HTMLElement
  warp: HTMLElement
  id: string
  w: number
  h: number
  radius: number
  bezelW: number
  maxDisp: number
}

export const glassInstances: GlassInstance[] = []
