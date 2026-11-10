import type { PointerEvent } from 'react'
import { useI18n } from '@/i18n'

interface ProjectCardProps {
  exp: string
  role?: string
  title: string
  description: string
  tags: string[]
  link: string
  home?: string
  homeLabel?: string
}

export default function ProjectCard({
  exp,
  role,
  title,
  description,
  tags,
  link,
  home,
  homeLabel,
}: ProjectCardProps) {
  const { t } = useI18n()
  const btnLabel = t('projects.view')
  const homeLabelText = t(homeLabel ?? 'projects.open')

  // 主体色由序号自动推导：奇数号红（vision）、偶数号蓝（system）
  const domainClass = parseInt(exp, 10) % 2 === 0 ? 'domain-sys' : 'domain-vision'

  // 光标光斑：跟随指针的径向高光
  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', (e.clientX - rect.left).toFixed(1) + 'px')
    el.style.setProperty('--my', (e.clientY - rect.top).toFixed(1) + 'px')
  }

  return (
    <article className={`project-card ${domainClass}`} onPointerMove={onPointerMove}>
      <span className="card-ghost" aria-hidden="true">
        {exp}
      </span>

      <div className="project-body">
        <div className="project-meta">
          <span className="project-folio">{exp}</span>
          {role && <span className="role-badge">{t('projects.role.' + role)}</span>}
        </div>
        <h3 className="project-card-title">{title}</h3>
        <p className="project-card-desc">{description}</p>
        <div className="project-card-tags">
          {tags.map((tag) => (
            <span key={tag}>{t(tag)}</span>
          ))}
        </div>
        <div className="project-card-actions">
          {home && (
            <a
              className="project-card-btn"
              href={home}
              target="_blank"
              rel="noopener noreferrer"
            >
              {homeLabelText} <span className="arrow">→</span>
            </a>
          )}
          {link && (
            <a
              className="project-card-btn"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {btnLabel} <span className="arrow">→</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
