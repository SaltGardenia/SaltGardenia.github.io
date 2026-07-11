<template>
  <section class="section" id="about">
    <div class="section-inner">
      <h2 class="section-title left">{{ t('about.title') }}</h2>
      <div class="about-content section-glass liquid-glass-section">
        <span class="glass-warp"></span>
        <div class="glass-highlight"></div>
        <div class="glass-highlight-overlay"></div>
        <div class="section-glass-inner">
          <div class="about-left">
            <div class="about-name">{{ t('about.name') }}</div>
            <div class="about-avatar">
              <img src="/img/tou.jpg" alt="LiYaze 头像" />
            </div>
          </div>
          <div class="about-info">
            <div class="about-btns">
              <a class="github-btn" href="https://github.com/SaltGardenia" target="_blank" rel="noopener noreferrer">
                <span class="glass-warp"></span>
                <span class="glass-highlight"></span>
                <span class="glass-highlight-overlay"></span>
                <span class="btn-text">{{ t('about.label.github') }}</span>
              </a>
              <a class="github-btn" href="https://scholar.google.com/citations?hl=zh-CN&amp;user=Pv-VkisAAAAJ" target="_blank" rel="noopener noreferrer">
                <span class="glass-warp"></span>
                <span class="glass-highlight"></span>
                <span class="glass-highlight-overlay"></span>
                <span class="btn-text">{{ t('about.label.scholar') }}</span>
              </a>
              <a class="github-btn" href="https://orcid.org/0009-0005-3281-2104" target="_blank" rel="noopener noreferrer">
                <span class="glass-warp"></span>
                <span class="glass-highlight"></span>
                <span class="glass-highlight-overlay"></span>
                <span class="btn-text">{{ t('about.label.orcid') }}</span>
              </a>
            </div>
            <InfoItem :label="t('about.label.email')">
              <a href="mailto:icepaper135@gmail.com" class="info-value link">icepaper135@gmail.com</a>
            </InfoItem>
            <InfoItem :label="t('about.label.degree')">
              <span class="info-value" v-html="t('about.degree')"></span>
            </InfoItem>
            <InfoItem :label="t('about.label.research')">
              <div class="info-tags">
                <span class="skill-tag">DL</span>
                <span class="skill-tag">CV</span>
              </div>
            </InfoItem>
            <InfoItem :label="t('about.cert')">
              <div class="info-tags">
                <span class="skill-tag">CET-4</span>
              </div>
            </InfoItem>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'
import InfoItem from '@/components/InfoItem.vue'

const { t } = useI18nStore()
</script>
