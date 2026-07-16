<template>
  <section class="section" id="about">
    <div class="section-inner reveal">
      <div class="section-head">
        <span class="sec-index">01</span>
        <h2 class="section-title">{{ t('about.title') }}</h2>
      </div>

      <div class="about-grid">
        <aside class="about-aside">
          <div class="about-avatar">
            <img src="/img/tou.jpg" alt="LiYaze 头像" />
          </div>
          <div class="about-id-text">
            <div class="about-name">{{ t('about.name') }}</div>
            <div class="about-role">{{ t('about.role') }}</div>
          </div>
        </aside>

        <div class="about-connect">
          <span class="connect-label">{{ t('about.connect') }}</span>
          <SocialLinks />
        </div>

        <div class="about-info stagger">
          <div class="info-item">
            <span class="info-label">{{ t('about.label.research') }}</span>
            <span class="info-value"><span class="info-tags"><span class="chip">CV</span><span class="chip">Deep Learning</span></span></span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('about.cert') }}</span>
            <span class="info-value"><span class="info-tags"><span class="chip">CET-4</span></span></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'
import SocialLinks from '@/components/SocialLinks.vue'
const { t } = useI18nStore()
</script>
