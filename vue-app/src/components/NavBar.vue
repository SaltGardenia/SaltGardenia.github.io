<template>
  <nav ref="navRef" class="liquid-glass-nav" id="navbar">
    <div class="nav-links">
      <div ref="indicatorRef" class="nav-indicator"></div>
      <a
        v-for="item in navItems"
        :key="item.id"
        :href="'#' + item.id"
        :class="{ active: activeSection === item.id }"
        @click.prevent="scrollTo(item.id)"
      >
        <component :is="item.icon" />
        {{ t(item.label) }}
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import { useScrollSpy } from '@/composables/useScrollSpy'
import { useNavLock } from '@/composables/useNavLock'
import IconInfo from '@/components/icons/IconInfo.vue'
import IconFolder from '@/components/icons/IconFolder.vue'
import IconCode from '@/components/icons/IconCode.vue'

const i18nStore = useI18nStore()
const { t } = i18nStore

const navItems = [
  { id: 'about', label: 'nav.about', icon: IconInfo },
  { id: 'projects', label: 'nav.projects', icon: IconFolder },
  { id: 'skills', label: 'nav.skills', icon: IconCode },
]

const navRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const { activeSection } = useScrollSpy(['about', 'projects', 'skills'], navRef)
const { navClickLocked, lockUntilScrollSettles } = useNavLock()

let navHovering = false

function updateIndicator() {
  const indicator = indicatorRef.value
  const activeLink = navRef.value?.querySelector<HTMLElement>('.nav-links a.active')
  if (indicator && activeLink) {
    indicator.style.width = activeLink.offsetWidth + 'px'
    indicator.style.left = activeLink.offsetLeft + 'px'
    indicator.style.opacity = '1'
  }
}

function onNavMouseMove(e: MouseEvent) {
  navHovering = true
  const links = navRef.value?.querySelectorAll<HTMLElement>('.nav-links a')
  if (!links) return
  const indicator = indicatorRef.value
  if (!indicator) return

  const mouseX = e.clientX
  let closestLink: HTMLElement | null = null
  let closestDist = Infinity
  for (const link of links) {
    const rect = link.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const dist = Math.abs(mouseX - cx)
    if (dist < closestDist) { closestDist = dist; closestLink = link }
  }
  if (closestLink) {
    indicator.style.width = closestLink.offsetWidth + 'px'
    indicator.style.left = closestLink.offsetLeft + 'px'
    indicator.style.opacity = '1'
    links.forEach(l => { l.classList.remove('active', 'hovered') })
    closestLink.classList.add('hovered')
  }
}

function onNavMouseLeave() {
  navHovering = false
  const links = navRef.value?.querySelectorAll('.nav-links a')
  links?.forEach(l => l.classList.remove('hovered'))
  updateIndicator()
}

function scrollTo(id: string) {
  navHovering = false
  navClickLocked.value = true
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', '#' + id)
  lockUntilScrollSettles()
}

// 激活项变化时同步指示器（包括 scroll-spy 正常更新时）
watch(activeSection, () => {
  if (!navHovering) nextTick(updateIndicator)
})

// 语言切换后链接文案/宽度变化，必须重新计算指示器位置
watch(() => i18nStore.locale, () => {
  nextTick(updateIndicator)
})

onMounted(() => {
  navRef.value?.addEventListener('mousemove', onNavMouseMove)
  navRef.value?.addEventListener('mouseleave', onNavMouseLeave)
  nextTick(updateIndicator)
  window.addEventListener('resize', updateIndicator)
})

onUnmounted(() => {
  navRef.value?.removeEventListener('mousemove', onNavMouseMove)
  navRef.value?.removeEventListener('mouseleave', onNavMouseLeave)
  window.removeEventListener('resize', updateIndicator)
})
</script>
