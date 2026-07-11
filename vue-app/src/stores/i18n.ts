import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import zhCN from '@/locales/zh-CN'
import en from '@/locales/en'

type Locale = 'zh-CN' | 'en'

const messages: Record<Locale, Record<string, string>> = { 'zh-CN': zhCN, en }

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref<Locale>((localStorage.getItem('lang') as Locale) || 'en')

  const t = computed(() => {
    return (key: string): string => {
      return messages[locale.value]?.[key] ?? key
    }
  })

  function setLocale(lang: Locale) {
    locale.value = lang
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang === 'zh-CN' ? 'zh-CN' : 'en'
  }

  function toggleLocale() {
    setLocale(locale.value === 'zh-CN' ? 'en' : 'zh-CN')
  }

  return { locale, t, setLocale, toggleLocale }
})
