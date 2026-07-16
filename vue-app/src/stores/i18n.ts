import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import zhCN from '@/locales/zh-CN'
import en from '@/locales/en'

type Locale = 'zh-CN' | 'en'
type Theme = 'light' | 'dark'

const messages: Record<Locale, Record<string, string>> = { 'zh-CN': zhCN, en }

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref<Locale>((localStorage.getItem('lang') as Locale) || 'en')
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'light')

  const t = computed(() => {
    return (key: string): string => {
      return messages[locale.value]?.[key] ?? key
    }
  })

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('theme', theme.value)
  }

  function setLocale(lang: Locale) {
    locale.value = lang
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang === 'zh-CN' ? 'zh-CN' : 'en'
  }

  function toggleLocale() {
    setLocale(locale.value === 'zh-CN' ? 'en' : 'zh-CN')
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme()
  }

  return { locale, theme, t, setLocale, toggleLocale, toggleTheme, applyTheme }
})
