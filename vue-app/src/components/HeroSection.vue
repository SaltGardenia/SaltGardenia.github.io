<template>
  <section class="hero" id="home">
    <div class="hero-inner">
      <p class="hero-kicker">{{ t('hero.kicker') }}</p>
      <h1 class="hero-headline">{{ t('hero.headline') }}</h1>
      <p class="hero-standfirst">{{ t('hero.standfirst') }}</p>
      <div class="hero-byline">
        <span class="hero-byline-name">{{ t('hero.name') }}</span>
        <span class="hero-byline-sep">·</span>
        <span>{{ t('hero.role') }}</span>
        <span class="hero-byline-sep">·</span>
        <span>{{ t('hero.location') }}</span>
      </div>

      <a class="hero-scroll-hint" href="#about" @click.prevent="scrollTo('about')">
        <span class="dot"></span>{{ t('hero.scroll') }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n'

const { t } = useI18nStore()

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
