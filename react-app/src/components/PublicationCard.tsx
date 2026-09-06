import type { PointerEvent } from 'react'
import { useI18n } from '@/i18n'

interface PublicationCardProps {
  exp: string
  domain: 'vision' | 'system'
  authors: string[]
  title: string
  venue: string
  year: number
  link?: string
  codeLink?: string
  projectLink?: string
  tags?: string[]
}

export default function PublicationCard({
  exp,
  domain,
  authors,
  title,
  venue,
  year,
  link,
  codeLink,
  projectLink,
  tags,
}: PublicationCardProps) {
  const { t } = useI18n()
  const btnLabel = t('publications.view')
  const codeLabel = t('publications.code')
  const projectLabel = t('publications.project')

  const domainClass = domain === 'system' ? 'domain-sys' : 'domain-vision'

  // 标题开头的 emoji 作为卡片视觉元素
  const emojiPattern =
    /^(\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*)/u

  const emojiMatch = title.match(emojiPattern)
  const emoji = emojiMatch ? emojiMatch[1] : '📄'
  const cleanTitle = title.replace(emojiPattern, '').trim()

  // 光标光斑：跟随指针的径向高光
  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', (e.clientX - rect.left).toFixed(1) + 'px')
    el.style.setProperty('--my', (e.clientY - rect.top).toFixed(1) + 'px')
  }

  return (
    <article className={`project-card ${domainClass}`} onPointerMove={onPointerMove}>
      <div className={`project-visual ${domainClass}`} aria-hidden="true">
        <span className="project-visual-emoji">{emoji}</span>
      </div>

      <div className="project-body">
        <div className="project-meta">
          <span className="project-folio">{exp}</span>
          <span className="venue-badge">{venue.split(' ')[0]}</span>
        </div>
        <h3 className="project-card-title">{cleanTitle}</h3>
        <div className="authors-list">
          {authors.map((author, idx) => (
            <span key={idx} className={idx === 0 ? 'first-author' : ''}>
              {author === 'Yaze Li' ? (
                <strong className="first-author-name">{author}</strong>
              ) : author}
              {idx < authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
        <div className="venue-info">
          <span className="venue-name">{venue}</span>
        </div>
        {tags && tags.length > 0 && (
          <div className="project-card-tags">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
        <div className="project-card-actions">
          {projectLink && (
            <a
              className="project-card-btn"
              href={projectLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {projectLabel} <span className="arrow">→</span>
            </a>
          )}
          {codeLink && (
            <a
              className="project-card-btn"
              href={codeLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {codeLabel} <span className="arrow">→</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}