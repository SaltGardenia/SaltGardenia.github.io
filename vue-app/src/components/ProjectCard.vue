<template>
  <article
    class="project-card"
    :class="[featured ? 'project-card--featured' : '', domainClass]"
    @pointermove="onPointerMove"
  >
    <div class="project-visual" :class="domainClass" aria-hidden="true">
      <span class="project-visual-emoji">{{ emoji }}</span>
    </div>

    <div class="project-body">
      <div class="project-meta">
        <span class="project-folio">{{ exp }}</span>
        <span v-if="featured" class="featured-badge">{{ t('projects.featured') }}</span>
        <span v-if="role" class="role-badge">{{ t('projects.role.' + role) }}</span>
      </div>
      <h3 class="project-card-title">{{ cleanTitle }}</h3>
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
import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n'

const props = defineProps<{
  exp: string
  domain: 'vision' | 'system'
  role?: string
  title: string
  description: string
  tags: string[]
  link: string
  home?: string
  featured?: boolean
}>()

const { t } = useI18nStore()
const btnLabel = t('projects.view')
const homeLabel = t('projects.open')

const domainClass = computed(() => (props.domain === 'system' ? 'domain-sys' : 'domain-vision'))

// 标题开头的 emoji 作为卡片视觉元素
const emojiPattern = /^(\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*)/u

const emoji = computed(() => {
  const m = props.title.match(emojiPattern)
  return m ? m[1] : '🧩'
})

const cleanTitle = computed(() => props.title.replace(emojiPattern, '').trim())

// 光标光斑：跟随指针的径向高光
function onPointerMove(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--mx', (e.clientX - rect.left).toFixed(1) + 'px')
  el.style.setProperty('--my', (e.clientY - rect.top).toFixed(1) + 'px')
}
</script>
