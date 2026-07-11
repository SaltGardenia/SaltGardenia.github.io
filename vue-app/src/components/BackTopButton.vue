<template>
  <button class="back-top-btn liquid-glass-btn-pill" :class="{ show }" @click="scrollToTop" aria-label="回到顶部">
    <span class="glass-warp"></span>
    <span class="glass-highlight"></span>
    <span class="glass-highlight-overlay"></span>
    <span class="btn-text">
      <IconChevronUp />
    </span>
  </button>
</template>

<script setup lang="ts">
import IconChevronUp from '@/components/icons/IconChevronUp.vue'

defineProps<{ show: boolean }>()

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
