<template>
  <div class="info-item liquid-glass-card">
    <span class="glass-warp"></span>
    <div class="info-text">
      <span class="info-label">{{ label }}</span>
      <slot />
    </div>
    <div class="glass-highlight"></div>
    <div class="glass-highlight-overlay"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>()
</script>
