<template>
  <button class="back-top-btn" :class="{ show }" @click="scrollToTop" aria-label="回到顶部">
    <IconChevronUp />
  </button>
</template>

<script setup lang="ts">
import IconChevronUp from '@/components/icons/IconChevronUp.vue'

defineProps<{ show: boolean }>()

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
