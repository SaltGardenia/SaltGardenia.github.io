import { useI18n } from '@/i18n'

// 交叉研究方向：每行一个方向，由多个关键词组成（术语为领域标准英文，中英文通用）
const researchDirections: string[][] = [
  ['3D Gaussian Splatting', '3D scene reconstruction'],
  ['sparse vision transformers', 'sparse attention', 'multimodal representation learning'],
]

export default function AboutSection() {
  const { t } = useI18n()

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
        </div>
      </div>
    </section>
  )
}
