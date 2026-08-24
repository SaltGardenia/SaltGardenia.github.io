import { useI18n } from '@/i18n'

// 交叉研究方向：每行一个方向，由多个关键词组成（术语为领域标准英文，中英文通用）
const researchDirections: string[][] = [
  ['3D Gaussian Splatting', '3D scene reconstruction'],
  ['sparse vision transformers', 'sparse attention', 'multimodal representation learning'],
]

export default function AboutSection() {
  const { t, theme } = useI18n()
  const skillsTheme = theme
  const statsTheme = theme === 'dark' ? 'github_dark' : 'default'
  const streakTheme = theme === 'dark' ? 'github-dark' : 'default'

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
                  <img
                    src={`https://github-readme-stats.vercel.app/api?username=SaltGardenia&theme=${statsTheme}&include_all_commits=true&count_private=true`}
                    alt="github stats"
                    loading="lazy"
                  />
                  <img
                    src={`https://github-readme-stats.vercel.app/api/top-langs/?username=SaltGardenia&theme=${statsTheme}&layout=compact`}
                    alt="top languages"
                    loading="lazy"
                  />
                  <img
                    src={`https://streak-stats.demolab.com/?user=SaltGardenia&theme=${streakTheme}`}
                    alt="streak stats"
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
