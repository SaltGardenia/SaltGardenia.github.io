<template>
  <Teleport to="body">
    <div class="menu-overlay" :class="{ show: isOpen }" @click="$emit('close')"></div>
    <div class="mobile-menu" :class="{ open: isOpen }">
      <button class="close-btn" @click="$emit('close')" aria-label="关闭菜单">&times;</button>
      <nav class="mobile-nav-links">
        <a href="#home" @click.prevent="navTo('home')">
          <IconHome />
        </a>
        <a href="#about" @click.prevent="navTo('about')">{{ t('nav.about') }}</a>
        <a href="#projects" @click.prevent="navTo('projects')">{{ t('nav.projects') }}</a>
        <a href="#skills" @click.prevent="navTo('skills')">{{ t('nav.skills') }}</a>
      </nav>
      <div class="mobile-actions">
        <button class="lang-toggle" @click="toggleLocale">
          <span class="lang-icon">{{ t('lang.toggle') }}</span>
        </button>
        <button class="theme-toggle" @click="toggleTheme">
          <span class="theme-icon">{{ theme === 'light' ? '☾' : '☀' }}</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'
import IconHome from '@/components/icons/IconHome.vue'

const { t, theme, toggleLocale, toggleTheme } = useI18nStore()

defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

function navTo(id: string) {
  emit('close')
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>
