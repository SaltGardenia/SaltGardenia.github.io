import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n'

// 交叉研究方向：每行一个方向，由多个关键词组成（术语为领域标准英文，中英文通用）
const researchDirections: string[][] = [
  ['3D Gaussian Splatting', '3D scene reconstruction'],
  ['sparse vision transformers', 'sparse attention', 'multimodal representation learning'],
]

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
  const { t, theme } = useI18n()
  const skillsTheme = theme
  const dark = theme === 'dark'
  const statsFile = (name: string) => `${STATS_BASE}/${name}${dark ? '-dark' : ''}.svg`

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
                  src={`https://skillicons.dev/icons?i=python,c,cpp,r,html,css,javascript,linux,ubuntu,windows,qt,react,nodejs,npm,clion,pycharm,vscode,visualstudio,markdown,latex,pytorch,opencv,anaconda,scikitlearn,cmake,docker,githubactions,git,github,bash&perline=10&theme=${skillsTheme}`}
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
    </section>
  )
}
