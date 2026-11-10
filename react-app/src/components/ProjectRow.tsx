import type { PointerEvent } from 'react'
import { useI18n } from '@/i18n'

interface ProjectRowProps {
  exp: string
  title: string
  summary?: string
  tags?: string[]
  link?: string
  home?: string
  homeLabel?: string
}

export default function ProjectRow({
  exp,
  title,
  summary,
  tags,
  link,
  home,
  homeLabel,
}: ProjectRowProps) {
  const { t } = useI18n()
  const btnLabel = t('projects.view')
  const homeLabelText = t(homeLabel ?? 'projects.open')

  // 主体色由序号自动推导：奇数号红（vision）、偶数号蓝（system）
  const accentClass = parseInt(exp, 10) % 2 === 0 ? 'accent-sys' : 'accent-vision'

  // 光标光斑：跟随指针的径向高光
  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', (e.clientX - rect.left).toFixed(1) + 'px')
    el.style.setProperty('--my', (e.clientY - rect.top).toFixed(1) + 'px')
  }

  return (
    <article className={`project-row ${accentClass}`} onPointerMove={onPointerMove}>
      <span className="project-row-index">{exp}</span>
      <div className="project-row-main">
        <h4 className="project-row-name">{title}</h4>
        {summary && <p className="project-row-sum">{summary}</p>}
      </div>
      {tags && tags.length > 0 && (
        <div className="project-row-tags" aria-hidden="true">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag}>{t(tag)}</span>
          ))}
        </div>
      )}
      <div className="project-row-actions">
        {home && (
          <a
            className="project-row-link"
            href={home}
            target="_blank"
            rel="noopener noreferrer"
          >
            {homeLabelText} <span className="arrow">→</span>
          </a>
        )}
        {link && (
          <a
            className="project-row-link"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {btnLabel} <span className="arrow">→</span>
          </a>
        )}
      </div>
    </article>
  )
}
