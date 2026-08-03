<template>
  <div class="bg-aura" aria-hidden="true"></div>
  <LangToggle />
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import LangToggle from '@/components/LangToggle.vue'

const { setLocale, locale, applyTheme } = useI18nStore()

onMounted(() => {
  setLocale(locale)
  applyTheme()
})
</script>
