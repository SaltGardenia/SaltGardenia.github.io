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
  stars?: number
  forks?: number
}

// 计数展示格式：千位以上缩写为 k
function formatCount(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return String(n)
}

// Feather 风格描边图标，与站内其他图标一致
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" style={{ display: 'block' }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const ForkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" style={{ display: 'block' }}>
    <circle cx="12" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="6" r="3" />
    <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
    <path d="M12 12v3" />
  </svg>
)

export default function ProjectRow({
  exp,
  title,
  summary,
  tags,
  link,
  home,
  homeLabel,
  stars,
  forks,
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
      {(typeof stars === 'number' || typeof forks === 'number') && (
        <span className="project-row-stats">
          {typeof stars === 'number' && (
            <span className="project-row-stat" title={`${stars} stars`}>
              <StarIcon /> {formatCount(stars)}
            </span>
          )}
          {typeof forks === 'number' && (
            <span className="project-row-stat" title={`${forks} forks`}>
              <ForkIcon /> {formatCount(forks)}
            </span>
          )}
        </span>
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
