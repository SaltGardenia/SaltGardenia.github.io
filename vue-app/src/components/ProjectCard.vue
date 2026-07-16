<template>
  <article class="project-card" :class="domain === 'system' ? 'domain-sys' : ''">
    <div class="project-folio">{{ exp }}</div>
    <div class="project-body">
      <div class="project-meta">
        <span class="domain">{{ domain === 'system' ? t('projects.cat.system') : t('projects.cat.vision') }}</span>
        <span v-if="role" class="role-badge">{{ t('projects.role.' + role) }}</span>
      </div>
      <h3 class="project-card-title">{{ title }}</h3>
      <p class="project-card-desc">{{ description }}</p>
      <div class="project-card-tags">
        <span v-for="tag in tags" :key="tag">{{ tag }}</span>
      </div>
      <a v-if="link" class="project-card-btn" :href="link" target="_blank" rel="noopener noreferrer">
        {{ btnLabel }} <span class="arrow">→</span>
      </a>
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
}>()

const { t } = useI18nStore()
const btnLabel = t('projects.view')
</script>
