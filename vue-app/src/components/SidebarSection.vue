<template>
  <aside class="sidebar" aria-label="Profile">
    <div class="sidebar-inner">
      <div class="sidebar-top">
        <a href="#about" class="sidebar-avatar" @click.prevent="scrollTo('about')" :aria-label="t('about.name')">
          <picture>
            <source srcset="/img/tou.webp" type="image/webp" />
            <img src="/img/tou.jpg" :alt="t('about.name')" loading="eager" />
          </picture>
        </a>
        <h1 class="sidebar-name">{{ t('about.name') }}</h1>
        <p class="sidebar-role">{{ t('about.role') }}</p>
        <p class="sidebar-tagline">{{ t('sidebar.tagline') }}</p>
      </div>

      <nav ref="navRef" class="sidebar-nav" :aria-label="t('sidebar.navAria')">
        <span ref="indicatorRef" class="nav-indicator" aria-hidden="true"></span>
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="'#' + item.id"
          :class="{ active: activeSection === item.id }"
          @click.prevent="scrollTo(item.id)"
        >
          {{ t(item.label) }}
        </a>
      </nav>

      <div class="sidebar-social">
        <SocialLinks />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18nStore } from '@/stores/i18n'
import SocialLinks from '@/components/SocialLinks.vue'

const i18nStore = useI18nStore()
const { t } = i18nStore
const { locale } = storeToRefs(i18nStore)

const navItems = [
  { id: 'about', label: 'nav.about' },
  { id: 'projects', label: 'nav.projects' },
  { id: 'skills', label: 'nav.skills' },
]

const activeSection = ref('')
const navRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLElement | null>(null)

function onScroll() {
  let current = ''
  let minDist = Infinity
  for (const item of navItems) {
    const el = document.getElementById(item.id)
    if (!el) continue
    const top = el.getBoundingClientRect().top
    if (top <= 160 && Math.abs(top) < minDist) {
      minDist = Math.abs(top)
      current = item.id
    }
  }
  // 无匹配时默认高亮 About（移动端顶部区块尚未进入视口的情况）
  activeSection.value = current || navItems[0].id
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', '#' + id)
}

// 激活指示器：在链接间平滑滑动（桌面纵向 / 移动端横向）
function updateIndicator() {
  const nav = navRef.value
  const indicator = indicatorRef.value
  if (!nav || !indicator) return
  const active = nav.querySelector<HTMLElement>('a.active')
  if (!active) {
    indicator.style.opacity = '0'
    return
  }
  const navRect = nav.getBoundingClientRect()
  const rect = active.getBoundingClientRect()
  const vertical = window.innerWidth > 1024
  if (vertical) {
    indicator.style.width = nav.clientWidth + 'px'
    indicator.style.height = rect.height + 'px'
    indicator.style.transform = `translateY(${rect.top - navRect.top}px)`
  } else {
    indicator.style.width = rect.width + 'px'
    indicator.style.height = nav.clientHeight + 'px'
    indicator.style.transform = `translateX(${rect.left - navRect.left}px)`
  }
  indicator.style.opacity = '1'
}

watch(activeSection, () => nextTick(updateIndicator))
watch(locale, () => nextTick(updateIndicator))

function onResize() {
  updateIndicator()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  onScroll()
  nextTick(updateIndicator)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
})
</script>
