import { useI18n } from '@/i18n'

export default function LangToggle() {
  const { t, toggleLocale, toggleTheme, locale, theme } = useI18n()

  return (
    <div className="nav-actions-pill" id="langPill">
      <button className="lang-toggle" onClick={toggleLocale} aria-label={t('lang.toggleAria')}>
        <span key={locale} className="lang-icon toggle-pop">
          {t('lang.toggle')}
        </span>
      </button>
      <button className="theme-toggle" onClick={toggleTheme} aria-label={t('theme.toggleAria')}>
        <span key={theme} className="theme-icon toggle-pop">
          {theme === 'light' ? '☾' : '☀'}
        </span>
      </button>
    </div>
  )
}
