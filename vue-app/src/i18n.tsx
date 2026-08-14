import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import zhCN from '@/locales/zh-CN'
import en from '@/locales/en'

type Locale = 'zh-CN' | 'en'
type Theme = 'light' | 'dark'
type Messages = Record<string, string>

const messages: Record<Locale, Messages> = { 'zh-CN': zhCN, en }

interface I18nContextValue {
  locale: Locale
  theme: Theme
  t: (key: string) => string
  setLocale: (lang: Locale) => void
  toggleLocale: () => void
  toggleTheme: () => void
  applyTheme: () => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(
    (localStorage.getItem('lang') as Locale) || 'en',
  )
  const [theme, setThemeState] = useState<Theme>(
    (localStorage.getItem('theme') as Theme) || 'light',
  )

  const t = useCallback(
    (key: string): string => messages[locale]?.[key] ?? key,
    [locale],
  )

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  function setLocale(lang: Locale) {
    setLocaleState(lang)
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang === 'zh-CN' ? 'zh-CN' : 'en'
  }

  function toggleLocale() {
    setLocale(locale === 'zh-CN' ? 'en' : 'zh-CN')
  }

  function toggleTheme() {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
    applyTheme()
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = locale === 'zh-CN' ? 'zh-CN' : 'en'
  }, [locale])

  const value: I18nContextValue = {
    locale,
    theme,
    t,
    setLocale,
    toggleLocale,
    toggleTheme,
    applyTheme,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
