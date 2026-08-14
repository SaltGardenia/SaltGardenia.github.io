<template>
  <section class="section" id="projects">
    <div class="section-inner reveal">
      <div class="section-head">
        <h2 class="section-title">{{ t('projects.title') }}</h2>
      </div>
      <div class="projects-grid stagger">
        <ProjectCard
          v-for="(project, i) in projects"
          :key="project.key"
          :exp="String(i + 1).padStart(2, '0')"
          :domain="i % 2 === 0 ? 'vision' : 'system'"
          :role="project.role"
          :title="t(project.key + '.title')"
          :description="t(project.key + '.desc')"
          :tags="project.tags"
          :link="project.link"
          :home="project.home"
          :home-label="project.homeLabel"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'
import ProjectCard from '@/components/ProjectCard.vue'

const { t } = useI18nStore()

type ProjectEntry = { key: string; domain: 'vision' | 'system'; tags: string[]; link: string; role?: string; home?: string; homeLabel?: string }

const projects: ProjectEntry[] = [
  { key: 'proj9', domain: 'vision', tags: ['Next.js', 'Dashboard', 'Data Viz', 'OpenAlex'], link: 'https://github.com/SaltGardenia/AI-ApexTrace', home: 'https://saltgardenia.github.io/AI-ApexTrace/', homeLabel: 'projects.page' },
  { key: 'proj8', domain: 'vision', tags: ['Skills', 'Agents', 'Code', 'Prompt'], link: 'https://github.com/SaltGardenia/research-code-skill', home: 'https://saltgardenia.github.io/research-code-skill/', homeLabel: 'projects.page' },
  { key: 'proj5', domain: 'vision', role: 'contributor', tags: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'], link: 'https://github.com/SaltGardenia/hfut-paperlist.github.io' },
  { key: 'proj7', domain: 'vision', role: 'contributor', tags: ['Skills', 'Agents', 'Prompt'], link: 'https://github.com/Yuan1z0825/nature-skills' },
]
</script>
