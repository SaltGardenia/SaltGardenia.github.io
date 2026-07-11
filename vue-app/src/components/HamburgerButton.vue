<template>
  <div class="nav-actions-pill liquid-glass-nav" id="hamburgerPill">
    <span class="glass-warp"></span>
    <button class="hamburger-btn" @click="$emit('open')" aria-label="打开菜单">
      <span class="hamburger-icon">
        <span></span><span></span><span></span>
      </span>
    </button>
    <div class="glass-highlight"></div>
    <div class="glass-highlight-overlay"></div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ open: [] }>()
</script>
