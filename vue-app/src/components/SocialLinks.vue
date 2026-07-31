<template>
  <nav class="social-links" :aria-label="t('social.aria')">
    <a
      v-for="item in links"
      :key="item.id"
      class="social-link"
      :href="item.url"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="social-icon" v-html="item.icon"></span>
      <span class="social-name">{{ item.name }}</span>
      <span class="social-arrow">↗</span>
    </a>
  </nav>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'

const { t } = useI18nStore()

// 平台个人主页跳转模块：后续新增平台只需在此加一项
const links = [
  {
    id: 'email',
    name: t('social.email'),
    url: 'mailto:saltgardenia@gmail.com',
    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.4-8 5-8-5V6l8 5 8-5z"/></svg>',
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/SaltGardenia',
    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.4-1.27.73-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>',
  },
  {
    id: 'scholar',
    name: 'Google Scholar',
    url: 'https://scholar.google.com/citations?hl=zh-CN&user=Pv-VkisAAAAJ',
    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2 1 8l11 6 9-4.91V17h2V8L12 2zM5 13.18v3.5L12 20l7-3.32v-3.5L12 16.5 5 13.18z"/></svg>',
  },
  {
    id: 'orcid',
    name: 'ORCiD',
    url: 'https://orcid.org/0009-0005-3281-2104',
    icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8.2 6.4c.5 0 .9.4.9.9 0 .5-.4.9-.9.9s-.9-.4-.9-.9.4-.9.9-.9zm-.2 2.3h1.8v8.3H8V8.7zm4 0h1.7v1.1h.1c.5-.9 1.6-1.2 2.4-.9.9.3 1.3 1.2 1.3 2.6v5.5h-1.8v-4.9c0-.7-.2-1.1-.8-1.1-.5 0-.8.3-.9 1-.1.5 0 1 0 1v4.9h-1.8V8.7z"/></svg>',
  },
]
</script>
