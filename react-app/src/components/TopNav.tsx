import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n'
import LangToggle from '@/components/LangToggle'

const navItems = [
  { id: 'about', label: 'nav.about' },
  { id: 'publications', label: 'nav.publications' },
  { id: 'projects', label: 'nav.projects' },
]

export default function TopNav() {
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
    // offsetLeft/offsetTop 相对胶囊内边距盒，与指示器的 absolute 定位原点一致
    indicator.style.width = active.offsetWidth + 'px'
    indicator.style.height = active.offsetHeight + 'px'
    indicator.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`
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
    <header className="top-nav" aria-label={t('sidebar.navAria')}>
      <a
        className="nav-brand"
        href="#about"
        onClick={(e) => {
          e.preventDefault()
          scrollTo('about')
        }}
      >
        Yaze Li
      </a>
      <nav ref={navRef} className="top-nav-inner">
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
      <LangToggle />
    </header>
  )
}
