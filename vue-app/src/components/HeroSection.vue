<template>
  <section class="hero" id="home">
    <div class="hero-inner">
      <p class="hero-kicker" ref="kickerRef">{{ t('hero.kicker') }}</p>
      <h1 class="hero-headline" ref="headlineRef" :aria-label="t('hero.headline')">
        <span
          v-for="(ch, i) in headlineChars"
          :key="i"
          class="hero-char"
          aria-hidden="true"
        >{{ ch === ' ' ? ' ' : ch }}</span>
      </h1>

      <a class="hero-scroll-hint" ref="scrollRef" href="#about" @click.prevent="scrollTo('about')">
        <span class="dot"></span>{{ t('hero.scroll') }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import { gsap } from 'gsap'

const i18nStore = useI18nStore()
const { t } = i18nStore

document.documentElement.classList.add('js')

const kickerRef = ref<HTMLElement | null>(null)
const headlineRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)

const headlineChars = computed(() => Array.from(t('hero.headline')))

let mm: gsap.MatchMedia | null = null

function playIntro() {
  mm?.revert()
  mm = gsap.matchMedia()

  mm.add(
    {
      reduce: '(prefers-reduced-motion: reduce)',
      normal: '(prefers-reduced-motion: no-preference)',
    },
    (ctx) => {
      const { reduce } = ctx.conditions as { reduce: boolean; normal: boolean }
      const chars = headlineRef.value?.querySelectorAll('.hero-char') ?? []
      const targets = [kickerRef.value, ...Array.from(chars), scrollRef.value].filter(
        Boolean
      ) as HTMLElement[]

      if (reduce) {
        gsap.set(targets, { autoAlpha: 1, y: 0, rotationX: 0 })
        return
      }

      gsap.set(kickerRef.value, { autoAlpha: 0, y: 20 })
      gsap.set(chars, { autoAlpha: 0, y: 30, rotationX: -40, transformOrigin: '50% 100%' })
      gsap.set(scrollRef.value, { autoAlpha: 0, y: 16 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(kickerRef.value, { autoAlpha: 1, y: 0, duration: 0.5 })
        .to(
          chars,
          {
            autoAlpha: 1,
            y: 0,
            rotationX: 0,
            duration: 0.6,
            stagger: 0.045,
            ease: 'back.out(1.6)',
          },
          '-=0.15'
        )
        .to(scrollRef.value, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.2')
    }
  )
}

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  nextTick(playIntro)
})

watch(
  () => i18nStore.locale,
  () => {
    nextTick(playIntro)
  }
)

onUnmounted(() => {
  mm?.revert()
})
</script>
