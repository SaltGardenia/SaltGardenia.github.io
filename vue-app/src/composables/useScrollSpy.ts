import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useScrollSpy(sectionIds: string[], navContainerRef: Ref<HTMLElement | null>) {
  const activeSection = ref('')

  function onScroll() {
    let current = ''
    let minDist = Infinity
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) {
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(rect.top)
        if (rect.top < window.innerHeight && dist < minDist) {
          minDist = dist
          current = id
        }
      }
    })
    activeSection.value = current
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { activeSection }
}
