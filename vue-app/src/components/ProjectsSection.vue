<template>
  <section class="section" id="projects">
    <div class="section-inner">
      <h2 class="section-title left">{{ t('projects.title') }}</h2>
      <div class="projects-grid">
        <ProjectCard
          v-for="project in projects"
          :key="project.key"
          :title="t(project.key + '.title')"
          :description="t(project.key + '.desc')"
          :tags="project.tags"
          :link="project.link"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'
import ProjectCard from '@/components/ProjectCard.vue'

const { t } = useI18nStore()

const projects = [
  { key: 'proj5', tags: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'], link: 'https://github.com/SaltGardenia/hfut-paperlist.github.io' },
  { key: 'proj6', tags: ['Python', 'Deep Learning', 'Image Classification'], link: 'https://github.com/SaltGardenia/Fruit-Classifier' },
  { key: 'proj1', tags: ['PyQt5', 'YOLOv7', 'OpenCV', 'MySQL'], link: 'https://github.com/SaltGardenia/Intelligent-Cockpit-System' },
  { key: 'proj2', tags: ['PyQt5', 'OpenCV', 'Huawei Cloud'], link: 'https://github.com/SaltGardenia/Smart-Construction-Site-Video-Surveillance-System' },
  { key: 'proj3', tags: ['PyQt5', 'Python'], link: 'https://github.com/SaltGardenia/Klotski-Puzzle' },
  { key: 'proj4', tags: ['C', 'Windows API'], link: 'https://github.com/SaltGardenia/Online-Examination-System' },
]
</script>
