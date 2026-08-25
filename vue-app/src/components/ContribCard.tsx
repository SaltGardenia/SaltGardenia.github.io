import { useI18n } from '@/i18n'

type ContribProject = {
  key: string
  link: string
  page: string
}

const contribProjects: ContribProject[] = [
  { key: 'contrib5', link: 'https://github.com/SaltGardenia/hfut-paperlist.github.io', page: 'https://hfut-paperlist.github.io/' },
  { key: 'contrib7', link: 'https://github.com/Yuan1z0825/nature-skills', page: 'https://yuan1z0825.github.io/nature-skills/' },
]

export default function ContribCard() {
  const { t } = useI18n()

  return (
    <article className="project-card contrib-card">
      <div className="project-body">
        <h3 className="project-card-title">{t('projects.contribTitle')}</h3>
        <div className="contrib-stack">
          {contribProjects.map((p, i) => (
            <div className="contrib-chip" key={p.key}>
              <span className={`contrib-visual ${i % 2 === 0 ? 'contrib-vision' : 'contrib-sys'}`}>
                <span className="contrib-index">{String(i + 1).padStart(2, '0')}</span>
              </span>
              <span className="contrib-name">{t(p.key + '.name')}</span>
              <span className="contrib-actions">
                <a
                  className="project-card-btn contrib-btn"
                  href={p.page}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('projects.page')} <span className="arrow">→</span>
                </a>
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
