import { useI18n } from '@/i18n'
import ProjectRow from '@/components/ProjectRow'

type ContribProject = {
  key: string
  link: string
  page?: string
}

const contribProjects: ContribProject[] = [
  { key: 'contrib5', link: 'https://github.com/hfut-paperlist/hfut-paperlist.github.io', page: 'https://hfut-paperlist.github.io/' },
  { key: 'contrib7', link: 'https://github.com/Yuan1z0825/nature-skills', page: 'https://yuan1z0825.github.io/nature-skills/' },
]

export default function ContribCard() {
  const { t } = useI18n()

  return (
    <div className="project-rows-block">
      <div className="project-rows-head">
        <span className="project-rows-title">{t('projects.contribTitle')}</span>
        <span className="project-rows-line" aria-hidden="true" />
      </div>
      <div className="project-rows">
        {contribProjects.map((p, i) => (
          <ProjectRow
            key={p.key}
            exp={String(i + 1).padStart(2, '0')}
            title={t(p.key + '.name')}
            summary={t(p.key + '.sum')}
            home={p.page}
            homeLabel="projects.page"
            link={p.link}
          />
        ))}
      </div>
    </div>
  )
}
