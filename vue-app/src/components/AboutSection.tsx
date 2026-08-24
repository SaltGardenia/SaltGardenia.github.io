import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useI18n } from '@/i18n'

// 交叉研究方向：每行一个方向，由多个关键词组成（术语为领域标准英文，中英文通用）
const researchDirections: string[][] = [
  ['3D Gaussian Splatting', '3D scene reconstruction'],
  ['sparse vision transformers', 'sparse attention', 'multimodal representation learning'],
]

// 第三方挂件偶发被服务端限流（返回 ERROR svg）。此处自动重试：
// 失败后在延迟后重新请求，并追加 _retry 缓存击穿参数，待限流解除即可正常显示。
function RetryImage({
  src,
  alt,
  className,
  style,
  loading,
  maxRetries = 8,
}: {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  loading?: 'lazy' | 'eager'
  maxRetries?: number
}) {
  const [attempt, setAttempt] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleError = () => {
    if (attempt >= maxRetries) return
    const delay = 2500 + attempt * 2500
    timer.current = window.setTimeout(() => setAttempt((a) => a + 1), delay)
  }

  const url = attempt === 0 ? src : `${src}${src.includes('?') ? '&' : '?'}_retry=${attempt}`

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={handleError}
    />
  )
}

export default function AboutSection() {
  const { t, theme } = useI18n()
  const skillsTheme = theme
  const cardsTheme = theme === 'dark' ? 'github_dark' : 'default'

  return (
    <section className="section" id="about">
      <div className="section-inner reveal">
        <div className="section-head">
          <h2 className="section-title">{t('about.title')}</h2>
        </div>

        <div className="about-info stagger">
          <div className="info-item info-item--research">
            <span className="info-label">{t('about.label.research')}</span>
            <div className="info-value">
              {researchDirections.map((dir, i) => (
                <div className="research-direction" key={i}>
                  <span className="dir-index">{String(i + 1).padStart(2, '0')}</span>
                  {dir.map((kw, j) => (
                    <span className="chip" key={j}>
                      {kw}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="info-item info-item--skills">
            <span className="info-label">{t('about.label.skills')}</span>
            <div className="info-value">
              <div className="about-media">
                <img
                  src={`https://skillicons.dev/icons?i=python,cpp,pytorch,tensorflow,linux,latex,git,docker,vscode,anaconda&perline=10&theme=${skillsTheme}`}
                  alt="skills"
                  loading="lazy"
                />
                <img
                  src={`https://skillicons.dev/icons?i=opencv,matlab,blender,c,rust,bash,vim,cmake,ubuntu,javascript&perline=10&theme=${skillsTheme}`}
                  alt="skills"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="info-item info-item--stats">
            <span className="info-label">{t('about.label.stats')}</span>
            <div className="info-value">
              <div className="about-media">
                <div className="about-media-row">
                  <RetryImage
                    src={`https://github-profile-summary-cards.vercel.app/api/cards/stats?username=SaltGardenia&theme=${cardsTheme}`}
                    alt="stats"
                    loading="lazy"
                  />
                  <RetryImage
                    src={`https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=SaltGardenia&theme=${cardsTheme}`}
                    alt="repos per language"
                    loading="lazy"
                  />
                  <RetryImage
                    src={`https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=SaltGardenia&theme=${cardsTheme}`}
                    alt="most commit language"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
