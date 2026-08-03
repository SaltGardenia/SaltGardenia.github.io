<template>
  <section class="section" id="skills">
    <div class="section-inner reveal">
      <div class="section-head">
        <h2 class="section-title">{{ t('skills.title') }}</h2>
      </div>
      <div class="skills-grid stagger">
        <div v-for="cat in categories" :key="cat.key" class="skill-category">
          <h3 class="skill-category-title">{{ t(cat.key) }}</h3>
          <div class="skill-category-tags">
            <span v-for="tag in cat.tags" :key="tag" class="skill-tag">{{ tag }}</span>
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
  { key: 'skills.devLang', tags: ['C/C++', 'Python', 'LaTeX', 'Markdown'] },
  { key: 'skills.devEnv', tags: ['Windows', 'macOS', 'Linux'] },
  { key: 'skills.mlDl', tags: ['Scikit-learn', 'TensorFlow', 'PyTorch', 'OpenCV'] },
  { key: 'skills.dataProc', tags: ['NumPy', 'Pandas', 'Matplotlib', 'labelImg', 'MySQL'] },
  { key: 'skills.devTools', tags: ['Git', 'GitHub', 'Hugging Face', 'Kaggle', 'pip', 'Conda', 'uv', 'Docker', 'PyQt', 'FastAPI'] },
  { key: 'skills.research', tags: ['Overleaf', 'Zotero', 'TeXstudio', 'Illustrator', 'Photoshop'] },
]
</script>
