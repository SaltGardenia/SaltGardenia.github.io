<template>
  <section class="section" id="about">
    <div class="section-inner reveal">
      <div class="section-head">
        <h2 class="section-title">{{ t('about.title') }}</h2>
      </div>

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
  </section>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'
const { t } = useI18nStore()

// 交叉研究方向：每行一个方向，由多个关键词组成（术语为领域标准英文，中英文通用）
const researchDirections: string[][] = [
  ['embodied interaction', 'occlusion-aware generative inpainting', 'visual world models'],
  ['language-guided interactive 3D scene graph', 'vision-language models', 'incremental scene understanding'],
  ['generative geometric prior', '3D Gaussian Splatting', 'zero-shot embodied scene reconstruction'],
  ['sparse vision transformers', 'sparse attention', 'multimodal representation learning'],
]
</script>
