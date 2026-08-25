import { useEffect, useState } from 'react'
import SidebarSection from '@/components/SidebarSection'
import AboutSection from '@/components/AboutSection'
import ProjectsSection from '@/components/ProjectsSection'
import FooterSection from '@/components/FooterSection'
import BackTopButton from '@/components/BackTopButton'

export default function HomeView() {
  const [showBackTop, setShowBackTop] = useState(false)

  useEffect(() => {
    function onScroll() {
      setShowBackTop(window.scrollY > window.innerHeight * 0.5)
    }

    // 滚动进入视口动画（reveal）
    function setupReveal() {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const els = document.querySelectorAll('.reveal, .stagger')
      if (reduce) {
        els.forEach((el) => el.classList.add('visible'))
        return null
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
            } else {
              entry.target.classList.remove('visible')
            }
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
      )
      els.forEach((el) => observer.observe(el))
      return observer
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    const observer = setupReveal()

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [])

  return (
    <div className="page-layout">
      <SidebarSection />
      <main className="content">
        <AboutSection />
        <ProjectsSection />
        <FooterSection />
        <BackTopButton show={showBackTop} />
      </main>
    </div>
  )
}
