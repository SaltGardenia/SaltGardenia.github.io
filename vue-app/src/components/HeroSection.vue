<template>
  <section class="hero" id="home">
    <canvas ref="canvasRef" class="hero-canvas"></canvas>
    <div class="hero-content">
      <h1 class="hero-title" v-html="t('hero.title')"></h1>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import { useCanvasBackground } from '@/composables/useCanvasBackground'

const { t } = useI18nStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
useCanvasBackground(canvasRef)
</script>
