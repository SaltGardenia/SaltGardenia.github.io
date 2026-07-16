<template>
  <section class="section" id="projects">
    <div class="section-inner reveal">
      <div class="section-head">
        <span class="sec-index">02</span>
        <div class="sec-head-text">
          <span class="sec-kicker">{{ t('projects.kicker') }}</span>
          <h2 class="section-title">{{ t('projects.title') }}</h2>
        </div>
      </div>
      <div class="projects-grid stagger">
        <ProjectCard
          v-for="(project, i) in projects"
          :key="project.key"
          :exp="String(i + 1).padStart(2, '0')"
          :domain="project.domain"
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

// domain: vision → 珊瑚(默认) ; system → 靛蓝
type ProjectEntry = { key: string; domain: 'vision' | 'system'; tags: string[]; link: string }

const projects: ProjectEntry[] = [
  { key: 'proj1', domain: 'system', tags: ['PyQt5', 'YOLOv7', 'OpenCV', 'MySQL'], link: 'https://github.com/SaltGardenia/Intelligent-Cockpit-System' },
  { key: 'proj2', domain: 'system', tags: ['PyQt5', 'OpenCV', 'Huawei Cloud'], link: 'https://github.com/SaltGardenia/Smart-Construction-Site-Video-Surveillance-System' },
  { key: 'proj6', domain: 'vision', tags: ['Python', 'Deep Learning', 'Image Classification'], link: 'https://github.com/SaltGardenia/Fruit-Classifier' },
  { key: 'proj5', domain: 'vision', tags: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'], link: 'https://github.com/SaltGardenia/hfut-paperlist.github.io' },
  { key: 'proj3', domain: 'system', tags: ['PyQt5', 'Python'], link: 'https://github.com/SaltGardenia/Klotski-Puzzle' },
  { key: 'proj4', domain: 'system', tags: ['C', 'Windows API'], link: 'https://github.com/SaltGardenia/Online-Examination-System' },
]
</script>
