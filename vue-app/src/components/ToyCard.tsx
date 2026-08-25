import { useI18n } from '@/i18n'

type ToyProject = {
  name: string
  link: string
}

const toyProjects: ToyProject[] = [
  { name: 'Klotski Puzzle', link: 'https://github.com/SaltGardenia/Klotski-Puzzle' },
  { name: 'Online Examination System', link: 'https://github.com/SaltGardenia/Online-Examination-System' },
  { name: 'Smart Construction Site Video Surveillance System', link: 'https://github.com/SaltGardenia/Smart-Construction-Site-Video-Surveillance-System' },
  { name: 'Intelligent Cockpit System', link: 'https://github.com/SaltGardenia/Intelligent-Cockpit-System' },
  { name: 'Fruit Classifier', link: 'https://github.com/SaltGardenia/Fruit-Classifier' },
]

export default function ToyCard() {
  const { t } = useI18n()

  return (
    <article className="project-card contrib-card">
      <div className="project-body">
        <h3 className="project-card-title">{t('projects.toyTitle')}</h3>
        <div className="contrib-stack">
          {toyProjects.map((p, i) => (
            <div className="contrib-chip" key={p.link}>
              <span className={`contrib-visual ${i % 2 === 0 ? 'contrib-vision' : 'contrib-sys'}`}>
                <span className="contrib-index">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <span className="contrib-name">{p.name}</span>
              <span className="contrib-actions">
                <a
                  className="project-card-btn contrib-btn"
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('projects.view')} <span className="arrow">→</span>
                </a>
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
