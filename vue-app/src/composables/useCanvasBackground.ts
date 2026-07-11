import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useCanvasBackground(canvasRef: Ref<HTMLCanvasElement | null>) {
  let animationId: number | null = null
  let time = 0
  const palette = [
    { r: 255, g: 140, b: 125 },
    { r: 255, g: 195, b: 85 },
    { r: 255, g: 230, b: 85 },
    { r: 85, g: 225, b: 175 },
    { r: 85, g: 200, b: 255 },
    { r: 220, g: 140, b: 255 },
    { r: 255, g: 145, b: 195 },
    { r: 255, g: 195, b: 145 },
  ]

  interface BlobData {
    x: number; y: number; radius: number; opacity: number
    pulseSpeed: number; phase: number
    vx: number; vy: number
    color: typeof palette[number]
  }

  let blobs: BlobData[] = []
  let orbs: BlobData[] = []
  let W = 0, H = 0

  function rgba(c: BlobData['color'], a: number) {
    return `rgba(${c.r | 0},${c.g | 0},${c.b | 0},${a})`
  }

  function createBlob(): BlobData {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      radius: Math.random() * 600 + 400,
      opacity: Math.random() * 0.22 + 0.20,
      pulseSpeed: Math.random() * 0.0008 + 0.0003,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 6.0,
      vy: (Math.random() - 0.5) * 5.0,
      color: palette[Math.floor(Math.random() * palette.length)],
    }
  }

  function createOrb(): BlobData {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      radius: Math.random() * 220 + 130,
      opacity: Math.random() * 0.18 + 0.15,
      pulseSpeed: Math.random() * 0.003 + 0.0015,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 12.0,
      vy: (Math.random() - 0.5) * 10.0,
      color: palette[Math.floor(Math.random() * palette.length)],
    }
  }

  function updateBlob(b: BlobData) {
    b.vx += (Math.random() - 0.5) * 0.8
    b.vy += (Math.random() - 0.5) * 0.8
    b.vx *= 0.98; b.vy *= 0.98
    const maxSpeed = 7.0
    const spd = Math.hypot(b.vx, b.vy)
    if (spd > maxSpeed) { b.vx *= maxSpeed / spd; b.vy *= maxSpeed / spd }
    b.x += b.vx; b.y += b.vy
    if (b.x < -b.radius) b.x = W + b.radius
    if (b.x > W + b.radius) b.x = -b.radius
    if (b.y < -b.radius) b.y = H + b.radius
    if (b.y > H + b.radius) b.y = -b.radius
  }

  function updateOrb(b: BlobData) {
    b.vx += (Math.random() - 0.5) * 1.5
    b.vy += (Math.random() - 0.5) * 1.5
    b.vx *= 0.97; b.vy *= 0.97
    const maxSpeed = 14.0
    const spd = Math.hypot(b.vx, b.vy)
    if (spd > maxSpeed) { b.vx *= maxSpeed / spd; b.vy *= maxSpeed / spd }
    b.x += b.vx; b.y += b.vy
    if (b.x < -120) b.x = W + 120
    if (b.x > W + 120) b.x = -120
    if (b.y < -120) b.y = H + 120
    if (b.y > H + 120) b.y = -120
  }

  function drawBlob(ctx: CanvasRenderingContext2D, b: BlobData) {
    const pulse = Math.sin(time * b.pulseSpeed + b.phase) * 0.12 + 0.88
    const r = b.radius * pulse
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r)
    grad.addColorStop(0, rgba(b.color, b.opacity * 1.8))
    grad.addColorStop(0.2, rgba(b.color, b.opacity))
    grad.addColorStop(0.5, rgba(b.color, b.opacity * 0.4))
    grad.addColorStop(0.75, rgba(b.color, b.opacity * 0.1))
    grad.addColorStop(1, rgba(b.color, 0))
    ctx.save()
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  function drawOrb(ctx: CanvasRenderingContext2D, b: BlobData) {
    const pulse = Math.sin(time * b.pulseSpeed + b.phase) * 0.25 + 0.75
    const r = b.radius * pulse
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r)
    grad.addColorStop(0, rgba(b.color, b.opacity))
    grad.addColorStop(0.35, rgba(b.color, b.opacity * 0.5))
    grad.addColorStop(0.7, rgba(b.color, b.opacity * 0.12))
    grad.addColorStop(1, rgba(b.color, 0))
    ctx.save()
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  function resize() {
    if (!canvasRef.value) return
    W = canvasRef.value.width = window.innerWidth
    H = canvasRef.value.height = window.innerHeight
  }

  function initScene() {
    resize()
    const blobCount = Math.min(Math.floor(W / 140) + 3, 10)
    blobs = Array.from({ length: blobCount }, () => createBlob())
    const orbCount = Math.min(Math.floor(W / 100) + 3, 14)
    orbs = Array.from({ length: orbCount }, () => createOrb())
  }

  function animate() {
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    time += 0.15

    ctx.fillStyle = '#ffece5'
    ctx.fillRect(0, 0, W, H)

    blobs.forEach(b => { updateBlob(b); drawBlob(ctx, b) })
    orbs.forEach(b => { updateOrb(b); drawOrb(ctx, b) })

    animationId = requestAnimationFrame(animate)
  }

  const showBackTop = ref(false)

  function onScroll() {
    showBackTop.value = window.scrollY > window.innerHeight * 0.5
  }

  onMounted(() => {
    initScene()
    animate()
    window.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(() => { initScene() })
    ro.observe(document.body)
  })

  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('scroll', onScroll)
  })

  return { showBackTop }
}
