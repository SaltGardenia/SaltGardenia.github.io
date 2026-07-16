<template>
  <svg id="lg-filters" style="position:absolute;width:0;height:0;overflow:hidden;" aria-hidden="true"></svg>
  <div class="bg-aura" aria-hidden="true"></div>
  <div class="nav-group">
    <NavBar />
  </div>
  <LangToggle />
  <HamburgerButton @open="mobileOpen = true" />
  <MobileMenu :is-open="mobileOpen" @close="mobileOpen = false" />
  <router-view />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import NavBar from '@/components/NavBar.vue'
import LangToggle from '@/components/LangToggle.vue'
import HamburgerButton from '@/components/HamburgerButton.vue'
import MobileMenu from '@/components/MobileMenu.vue'

const { setLocale, locale, applyTheme } = useI18nStore()
const mobileOpen = ref(false)

onMounted(() => {
  setLocale(locale)
  applyTheme()
})
</script>
