<template>
  <footer class="footer">
    <div class="footer-inner">
      <p class="copyright" v-html="t('footer.copyright')"></p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'
const { t } = useI18nStore()
</script>
