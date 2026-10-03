import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n'
import SocialLinks from '@/components/SocialLinks'
import skillsLight from '@/assets/skills-light.svg'
import skillsDark from '@/assets/skills-dark.svg'

// 交叉研究方向：每行一个方向，由多个关键词组成，随界面语言切换
const researchDirections: Record<'zh-CN' | 'en', string[][]> = {
  'zh-CN': [
    ['3D 视觉'],
    ['稀疏视觉Transformer'],
  ],
  en: [
    ['3D Vision'],
    ['Sparse Vision Transformers'],
  ],
}

// Contribution Stats 数据由远程仓库 SaltGardenia/SaltGardenia 的 GitHub Action
// 每日生成并提交到 output/stats/，此处直接读取静态文件，避免调用受限的公共服务。
const STATS_BASE = 'https://raw.githubusercontent.com/SaltGardenia/SaltGardenia/contribution-stats/stats'

// 远程静态文件原则上稳定；此处仅兜底处理瞬时加载失败：自动重试，
// 若最终仍失败则隐藏（避免出现破图/报错图标），旧数据仍保留在远程，刷新后即可恢复。
function StatsImage({ src, alt }: { src: string; alt: string }) {
  const [attempt, setAttempt] = useState(0)
  const [hidden, setHidden] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleError = () => {
    if (attempt >= 5) {
      setHidden(true)
      return
    }
    timer.current = window.setTimeout(() => setAttempt((a) => a + 1), 3000)
  }

  if (hidden) return null

  const url = attempt === 0 ? src : `${src}${src.includes('?') ? '&' : '?'}_t=${attempt}`

  return <img src={url} alt={alt} loading="lazy" onError={handleError} />
}

export default function AboutSection() {
  const { t, theme, locale } = useI18n()
  const dark = theme === 'dark'
  const statsFile = (name: string) => `${STATS_BASE}/${name}${dark ? '-dark' : ''}.svg`
  const skillsSrc = dark ? skillsDark : skillsLight
  const directions = researchDirections[locale]

  return (
    <section className="section" id="about">
      <div className="about-cols">
        <aside className="about-profile" aria-label="Profile">
          <div className="about-avatar">
            <picture>
              <source srcSet="/img/tou_new.webp" type="image/webp" />
              <img src="/img/tou_new.jpg" alt={t('about.name')} loading="eager" />
            </picture>
          </div>
          <h1 className="about-name">{t('about.name')}</h1>
          <p className="about-role">{t('about.role')}</p>
          <p className="about-tagline">{t('sidebar.tagline')}</p>
          <div className="about-social">
            <SocialLinks />
          </div>
        </aside>

        <div className="section-inner reveal">
          <div className="about-info stagger">
          <div className="info-item info-item--research">
            <span className="info-label">{t('about.label.research')}</span>
            <div className="info-value">
              {directions.map((dir, i) => (
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
                  src={skillsSrc}
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
                  <StatsImage src={statsFile('stats')} alt="stats" />
                  <StatsImage
                    src={statsFile('repos-per-language')}
                    alt="repos per language"
                  />
                  <StatsImage
                    src={statsFile('most-commit-language')}
                    alt="most commit language"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
