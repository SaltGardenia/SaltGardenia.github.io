import { onMounted, onUnmounted, ref, type Ref, watch } from 'vue'
import { useNavLock } from './useNavLock'

export function useScrollSpy(sectionIds: string[], navContainerRef: Ref<HTMLElement | null>) {
  const activeSection = ref('')
  const { navClickLocked } = useNavLock()

  function onScroll() {
    if (navClickLocked.value) return
    let current = ''
    let minDist = Infinity
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) {
      const rect = el.getBoundingClientRect()
      const dist = Math.abs(rect.top)
      if (rect.top <= 120 && dist < minDist) {
          minDist = dist
          current = id
        }
      }
    })
    activeSection.value = current
  }

  // 点击锁释放后，滚动已停止，需要手动重算一次激活项，否则指示器停在旧链接上
  watch(navClickLocked, (locked) => {
    if (!locked) {
      onScroll()
    }
  })

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { activeSection }
}
