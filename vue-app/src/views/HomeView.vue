<template>
  <div class="page-layout">
    <SidebarSection />
    <main class="content">
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <FooterSection />
      <BackTopButton :show="showBackTop" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SidebarSection from '@/components/SidebarSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import FooterSection from '@/components/FooterSection.vue'
import BackTopButton from '@/components/BackTopButton.vue'

const showBackTop = ref(false)

function onScroll() {
  showBackTop.value = window.scrollY > window.innerHeight * 0.5
}

// 滚动进入视口动画（reveal）
function setupReveal() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const els = document.querySelectorAll('.reveal, .stagger')
  if (reduce) {
    els.forEach(el => el.classList.add('visible'))
    return null
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        } else {
          entry.target.classList.remove('visible')
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  )
  els.forEach(el => observer.observe(el))
  return observer
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  const observer = setupReveal()

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    observer?.disconnect()
  })
})
</script>
