import { ref } from 'vue'

// 导航点击锁：点击导航后在平滑滚动期间保持激活态/指示器不动，
// 避免 scroll-spy 在滚动经过中间 section 时把粉色文字与指示器来回抽动。
// 用模块级 ref 共享，使 NavBar 与 useScrollSpy 看到同一份状态。
const navClickLocked = ref(false)
let settleTimer: number | undefined

export function useNavLock() {
  function lockUntilScrollSettles() {
    navClickLocked.value = true
    if (settleTimer) clearTimeout(settleTimer)
    // 监听滚动平息：scroll 停止 140ms 后视为跳转结束，再释放锁定
    const onSettle = () => {
      if (settleTimer) clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => {
        navClickLocked.value = false
        window.removeEventListener('scroll', onSettle)
      }, 140)
    }
    window.addEventListener('scroll', onSettle, { passive: true })
    // 立即安排一次（无滚动时也能释放）
    onSettle()
    // 兜底：3s 强制释放，避免极端情况永久锁死
    window.setTimeout(() => {
      navClickLocked.value = false
      window.removeEventListener('scroll', onSettle)
    }, 3000)
  }

  return { navClickLocked, lockUntilScrollSettles }
}
