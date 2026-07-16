<template>
  <div class="nav-actions-pill liquid-glass-nav" id="langPill">
    <span class="glass-warp"></span>
    <button class="lang-toggle" @click="toggleLocale" :aria-label="t('lang.toggleAria')">
      <span class="lang-icon">{{ t('lang.toggle') }}</span>
    </button>
    <button class="theme-toggle" @click="toggleTheme" :aria-label="t('theme.toggleAria')">
      <span class="theme-icon">{{ theme === 'light' ? '☾' : '☀' }}</span>
    </button>
    <div class="glass-highlight"></div>
    <div class="glass-highlight-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'
const { t, theme, toggleLocale, toggleTheme } = useI18nStore()
</script>
