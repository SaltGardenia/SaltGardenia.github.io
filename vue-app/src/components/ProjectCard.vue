<template>
  <div class="project-card liquid-glass-card">
    <span class="glass-warp"></span>
    <div class="card-inner">
      <h3 class="project-card-title">{{ title }}</h3>
      <p class="project-card-desc">{{ description }}</p>
      <div class="project-card-tags">
        <span v-for="tag in tags" :key="tag">{{ tag }}</span>
      </div>
      <a v-if="link" class="project-card-btn liquid-glass-btn" :href="link" target="_blank" rel="noopener noreferrer">
        <span class="glass-warp"></span>
        <span class="btn-text">GitHub →</span>
        <span class="glass-highlight"></span>
        <span class="glass-highlight-overlay"></span>
      </a>
    </div>
    <div class="glass-highlight"></div>
    <div class="glass-highlight-overlay"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  tags: string[]
  link: string
}>()
</script>
