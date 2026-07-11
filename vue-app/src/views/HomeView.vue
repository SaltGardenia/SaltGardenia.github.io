<template>
  <div>
    <HeroSection />
    <AboutSection />
    <ProjectsSection />
    <SkillsSection />
    <FooterSection />
    <BackTopButton :show="showBackTop" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLiquidGlass } from '@/composables/useLiquidGlass'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import FooterSection from '@/components/FooterSection.vue'
import BackTopButton from '@/components/BackTopButton.vue'

const { initEngine } = useLiquidGlass()
const showBackTop = ref(false)

function onScroll() {
  showBackTop.value = window.scrollY > window.innerHeight * 0.5
}

// Reveal animation via Intersection Observer
function setupRevealAnimation() {
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
  const revealElements = document.querySelectorAll('.section, .about-content, .skills-categories')
  revealElements.forEach(el => observer.observe(el))
  return observer
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  const observer = setupRevealAnimation()

  initEngine()
  window.addEventListener('load', () => initEngine(true))

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    observer.disconnect()
  })
})
</script>
