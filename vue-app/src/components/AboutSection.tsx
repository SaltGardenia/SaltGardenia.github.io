import { useI18n } from '@/i18n'

// 交叉研究方向：每行一个方向，由多个关键词组成（术语为领域标准英文，中英文通用）
const researchDirections: string[][] = [
  ['3D Gaussian Splatting', '3D scene reconstruction'],
  ['sparse vision transformers', 'sparse attention', 'multimodal representation learning'],
]

// Contribution Stats 数据由远程仓库 SaltGardenia/SaltGardenia 的 GitHub Action
// 每日生成并提交到 output/stats/，此处直接读取静态文件，避免调用受限的公共服务。
const STATS_BASE = 'https://raw.githubusercontent.com/SaltGardenia/SaltGardenia/output/stats'

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
                  <img src={statsFile('stats')} alt="stats" loading="lazy" />
                  <img
                    src={statsFile('repos-per-language')}
                    alt="repos per language"
                    loading="lazy"
                  />
                  <img
                    src={statsFile('most-commit-language')}
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
