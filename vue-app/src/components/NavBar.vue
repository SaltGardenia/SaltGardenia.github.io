<template>
  <nav ref="navRef" class="liquid-glass-nav" id="navbar">
    <span class="glass-warp"></span>
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
    <div class="glass-highlight"></div>
    <div class="glass-highlight-overlay"></div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import { useScrollSpy } from '@/composables/useScrollSpy'
import IconInfo from '@/components/icons/IconInfo.vue'
import IconFolder from '@/components/icons/IconFolder.vue'
import IconCode from '@/components/icons/IconCode.vue'

const { t } = useI18nStore()

const navItems = [
  { id: 'about', label: 'nav.about', icon: IconInfo },
  { id: 'projects', label: 'nav.projects', icon: IconFolder },
  { id: 'skills', label: 'nav.skills', icon: IconCode },
]

const navRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)
const { activeSection } = useScrollSpy(['about', 'projects', 'skills'], navRef)

let navHovering = false
let navClickLocked = false

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
  navClickLocked = true
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  setTimeout(() => { navClickLocked = false }, 800)
}

onMounted(() => {
  navRef.value?.addEventListener('mousemove', onNavMouseMove)
  navRef.value?.addEventListener('mouseleave', onNavMouseLeave)
})

onUnmounted(() => {
  navRef.value?.removeEventListener('mousemove', onNavMouseMove)
  navRef.value?.removeEventListener('mouseleave', onNavMouseLeave)
})
</script>
