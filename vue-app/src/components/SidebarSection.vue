<template>
  <aside class="sidebar" aria-label="Profile">
    <div class="sidebar-inner">
      <div class="sidebar-top">
        <a href="#about" class="sidebar-avatar" @click.prevent="scrollTo('about')" :aria-label="t('about.name')">
          <img src="/img/tou.jpg" :alt="t('about.name')" />
        </a>
        <h1 class="sidebar-name">{{ t('about.name') }}</h1>
        <p class="sidebar-role">{{ t('about.role') }}</p>
        <p class="sidebar-tagline">{{ t('sidebar.tagline') }}</p>
      </div>

      <nav class="sidebar-nav" :aria-label="t('sidebar.navAria')">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import SocialLinks from '@/components/SocialLinks.vue'

const { t } = useI18nStore()

const navItems = [
  { id: 'about', label: 'nav.about' },
  { id: 'projects', label: 'nav.projects' },
  { id: 'skills', label: 'nav.skills' },
]

const activeSection = ref('')

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
  activeSection.value = current
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', '#' + id)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
