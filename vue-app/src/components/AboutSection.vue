<template>
  <section class="section" id="about">
    <div class="section-inner reveal">
      <div class="section-head">
        <span class="sec-index">01</span>
        <div class="sec-head-text">
          <span class="sec-kicker">{{ t('about.kicker') }}</span>
          <h2 class="section-title">{{ t('about.title') }}</h2>
        </div>
      </div>

      <div class="about-grid">
        <aside class="about-card">
          <div class="about-avatar">
            <img src="/img/tou.jpg" alt="LiYaze 头像" />
          </div>
          <div class="about-name">{{ t('about.name') }}</div>
          <div class="about-role">{{ t('about.role') }}</div>
          <SocialLinks />
        </aside>

        <div class="about-info stagger">
          <div class="info-item">
            <span class="info-label">{{ t('about.label.email') }}</span>
            <span class="info-value"><a href="mailto:icepaper135@gmail.com">icepaper135@gmail.com</a></span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('about.label.degree') }}</span>
            <span class="info-value" v-html="t('about.degree')"></span>
          </div>
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
