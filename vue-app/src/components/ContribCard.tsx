import { useI18n } from '@/i18n'

type ContribProject = {
  key: string
  link: string
}

const contribProjects: ContribProject[] = [
  { key: 'contrib5', link: 'https://github.com/SaltGardenia/hfut-paperlist.github.io' },
  { key: 'contrib7', link: 'https://github.com/Yuan1z0825/nature-skills' },
]

const CONTRIB_EMOJI = ['🌿', '✨', '🔗', '💡']

export default function ContribCard() {
  const { t } = useI18n()

  return (
    <article className="project-card contrib-card">
      <div className="project-body">
        <div className="project-meta">
          <span className="role-badge">{t('projects.role.contributor')}</span>
        </div>
        <h3 className="project-card-title">{t('projects.contribTitle')}</h3>
        <div className="contrib-stack">
          {contribProjects.map((p, i) => (
            <div className="contrib-chip" key={p.key}>
              <span className="contrib-chip-emoji" aria-hidden="true">
                {CONTRIB_EMOJI[i % CONTRIB_EMOJI.length]}
              </span>
              <span className="contrib-name">{t(p.key + '.name')}</span>
              <a
                className="project-card-btn contrib-btn"
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('projects.view')} <span className="arrow">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
