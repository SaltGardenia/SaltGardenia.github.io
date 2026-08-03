<template>
  <div class="nav-actions-pill" id="langPill">
    <button class="lang-toggle" @click="toggleLocale" :aria-label="t('lang.toggleAria')">
      <span :key="locale" class="lang-icon toggle-pop">{{ t('lang.toggle') }}</span>
    </button>
    <button class="theme-toggle" @click="toggleTheme" :aria-label="t('theme.toggleAria')">
      <span :key="theme" class="theme-icon toggle-pop">{{ theme === 'light' ? '☾' : '☀' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18nStore } from '@/stores/i18n'
const i18nStore = useI18nStore()
const { t, toggleLocale, toggleTheme } = i18nStore
const { locale, theme } = storeToRefs(i18nStore)
</script>
