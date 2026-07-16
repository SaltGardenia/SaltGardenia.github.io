import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { useNavLock } from './useNavLock'

export function useScrollSpy(sectionIds: string[], navContainerRef: Ref<HTMLElement | null>) {
  const activeSection = ref('')
  const { navClickLocked } = useNavLock()

  function onScroll() {
    // 点击锁定期间：保持被点击链接的激活态，不随滚动重算
    if (navClickLocked.value) return
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
