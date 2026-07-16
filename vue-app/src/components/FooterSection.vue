<template>
  <footer class="footer">
    <div class="footer-inner">
      <span class="sig"><b>LiYaze</b> — Profile & Selected Work</span>
      <span v-html="t('footer.copyright')"></span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'
const { t } = useI18nStore()
</script>
