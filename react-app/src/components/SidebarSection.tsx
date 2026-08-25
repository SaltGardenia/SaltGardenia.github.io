import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n'
import SocialLinks from '@/components/SocialLinks'

const navItems = [
  { id: 'about', label: 'nav.about' },
  { id: 'projects', label: 'nav.projects' },
]

export default function SidebarSection() {
  const { t, locale } = useI18n()
  const [activeSection, setActiveSection] = useState('')
  const navRef = useRef<HTMLElement | null>(null)
  const indicatorRef = useRef<HTMLSpanElement | null>(null)

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', '#' + id)
  }

  function onScroll() {
    let current = ''
    let minDist = Infinity
    for (const item of navItems) {
      const el = document.getElementById(item.id)
      if (!el) continue
      const top = el.getBoundingClientRect().top
      if (top <= 160 && Math.abs(top) < minDist) {
        minDist = Math.abs(top)
        current = item.id
      }
    }
    setActiveSection(current || navItems[0].id)
  }

  function updateIndicator() {
    const nav = navRef.current
    const indicator = indicatorRef.current
    if (!nav || !indicator) return
    const active = nav.querySelector<HTMLElement>('a.active')
    if (!active) {
      indicator.style.opacity = '0'
      return
    }
    const navRect = nav.getBoundingClientRect()
    const rect = active.getBoundingClientRect()
    const vertical = window.innerWidth > 1024
    if (vertical) {
      indicator.style.width = nav.clientWidth + 'px'
      indicator.style.height = rect.height + 'px'
      indicator.style.transform = `translateY(${rect.top - navRect.top}px)`
    } else {
      indicator.style.width = rect.width + 'px'
      indicator.style.height = nav.clientHeight + 'px'
      indicator.style.transform = `translateX(${rect.left - navRect.left}px)`
    }
    indicator.style.opacity = '1'
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateIndicator)
    onScroll()
    const raf = requestAnimationFrame(updateIndicator)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateIndicator)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    updateIndicator()
  }, [activeSection, locale])

  return (
    <aside className="sidebar" aria-label="Profile">
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <a
            href="#about"
            className="sidebar-avatar"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('about')
            }}
            aria-label={t('about.name')}
          >
            <picture>
              <source srcSet="/img/tou_new.webp" type="image/webp" />
              <img src="/img/tou_new.jpg" alt={t('about.name')} loading="eager" />
            </picture>
          </a>
          <h1 className="sidebar-name">{t('about.name')}</h1>
          <p className="sidebar-role">{t('about.role')}</p>
          <p className="sidebar-tagline">{t('sidebar.tagline')}</p>
        </div>

        <nav ref={navRef} className="sidebar-nav" aria-label={t('sidebar.navAria')}>
          <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
          {navItems.map((item) => (
            <a
              key={item.id}
              href={'#' + item.id}
              className={activeSection === item.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                scrollTo(item.id)
              }}
            >
              {t(item.label)}
            </a>
          ))}
        </nav>

        <div className="sidebar-social">
          <SocialLinks />
        </div>
      </div>
    </aside>
  )
}
