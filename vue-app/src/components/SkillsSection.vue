<template>
  <section class="section" id="skills">
    <div class="section-inner">
      <h2 class="section-title left">{{ t('skills.title') }}</h2>
      <div class="skills-categories section-glass liquid-glass-section">
        <span class="glass-warp"></span>
        <div class="glass-highlight"></div>
        <div class="glass-highlight-overlay"></div>
        <div class="section-glass-inner">
          <div v-for="cat in categories" :key="cat.key" class="skill-category">
            <h3 class="skill-category-title">{{ t(cat.key) }}</h3>
            <div class="skill-category-tags">
              <span v-for="tag in cat.tags" :key="tag" class="skill-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'

const { t } = useI18nStore()

const categories = [
  { key: 'skills.devLang', tags: ['C/C++', 'Python', 'LaTex', 'MarkDown'] },
  { key: 'skills.devEnv', tags: ['Windows', 'Mac', 'Linux'] },
  { key: 'skills.mlDl', tags: ['Scikit-learn', 'TensorFlow', 'PyTorch', 'OpenCV'] },
  { key: 'skills.dataProc', tags: ['NumPy', 'Pandas', 'Matplotlib', 'labelImg', 'MySQL'] },
  { key: 'skills.devTools', tags: ['Git', 'Github', 'Hugging Face', 'Kaggle', 'Pip', 'Conda', 'uv', 'Docker', 'PyQt', 'Fast API'] },
  { key: 'skills.research', tags: ['Overleaf', 'Zotero', 'TexStudio', 'Illustrator', 'Photoshop'] },
]
</script>
