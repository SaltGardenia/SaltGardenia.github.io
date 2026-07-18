<template>
  <article class="project-card" :class="domain === 'system' ? 'domain-sys' : ''">
    <div class="project-folio">{{ exp }}</div>
    <div class="project-body">
      <div class="project-meta">
        <span v-if="role" class="role-badge">{{ t('projects.role.' + role) }}</span>
      </div>
      <h3 class="project-card-title">{{ title }}</h3>
      <p class="project-card-desc">{{ description }}</p>
      <div class="project-card-tags">
        <span v-for="tag in tags" :key="tag">{{ tag }}</span>
      </div>
      <div class="project-card-actions">
        <a v-if="home" class="project-card-btn" :href="home" target="_blank" rel="noopener noreferrer">
          {{ homeLabel }} <span class="arrow">→</span>
        </a>
        <a v-if="link" class="project-card-btn" :href="link" target="_blank" rel="noopener noreferrer">
          {{ btnLabel }} <span class="arrow">→</span>
        </a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'

defineProps<{
  exp: string
  domain: 'vision' | 'system'
  role?: string
  title: string
  description: string
  tags: string[]
  link: string
  home?: string
}>()

const { t } = useI18nStore()
const btnLabel = t('projects.view')
const homeLabel = t('projects.open')
</script>
