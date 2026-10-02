import { useI18n } from '@/i18n'

// 亮暗切换图标与 luliangsi.github.io 同款（Feather 风格描边 SVG）：
// 亮色显示月牙（点击进入暗色），暗色显示太阳（点击回到亮色）
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block' }}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block' }}
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

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
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </span>
      </button>
    </div>
  )
}
