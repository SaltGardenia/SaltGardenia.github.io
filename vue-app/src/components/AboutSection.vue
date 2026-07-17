<template>
  <section class="section" id="about">
    <div class="section-inner reveal">
      <div class="section-head">
        <span class="sec-index">01</span>
        <h2 class="section-title">{{ t('about.title') }}</h2>
      </div>

      <div class="about-grid">
        <aside class="about-aside">
          <div class="about-id">
            <div class="about-avatar">
              <img src="/img/tou.jpg" alt="LiYaze 头像" />
            </div>
            <div class="about-id-text">
              <div class="about-name">{{ t('about.name') }}</div>
              <div class="about-role">{{ t('about.role') }}</div>
            </div>
          </div>

          <div class="about-connect">
            <span class="connect-label">{{ t('about.connect') }}</span>
            <SocialLinks />
          </div>
        </aside>

        <div class="about-info stagger">
          <div class="info-item info-item--research">
            <span class="info-label">{{ t('about.label.research') }}</span>
            <span class="info-value">
              <div class="research-direction" v-for="(dir, i) in researchDirections" :key="i">
                <span class="dir-index">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="chip" v-for="(kw, j) in dir" :key="j">{{ kw }}</span>
              </div>
            </span>
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

// 交叉研究方向：每行一个方向，由多个关键词组成（术语为领域标准英文，中英文通用）
const researchDirections: string[][] = [
  ['embodied interaction', 'occlusion-aware generative inpainting', 'visual world models'],
  ['language-guided interactive 3D scene graph', 'vision-language models', 'incremental scene understanding'],
  ['generative geometric prior', '3D Gaussian Splatting', 'zero-shot embodied scene reconstruction'],
  ['sparse vision transformers', 'sparse attention', 'multimodal representation learning'],
]
</script>
