<template>
  <div class="nav-actions-pill liquid-glass-nav" id="langPill">
    <span class="glass-warp"></span>
    <button class="lang-toggle" @click="toggleLocale" aria-label="切换语言">
      <span class="lang-icon">{{ t('lang.toggle') }}</span>
    </button>
    <div class="glass-highlight"></div>
    <div class="glass-highlight-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'
const { t, toggleLocale } = useI18nStore()
</script>
