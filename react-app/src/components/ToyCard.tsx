import { useI18n } from '@/i18n'
import ProjectRow from '@/components/ProjectRow'

type ToyProject = {
  key: string
  name: string
  link: string
}

const toyProjects: ToyProject[] = [
  { key: 'klotski', name: 'Klotski Puzzle', link: 'https://github.com/SaltGardenia/Klotski-Puzzle' },
  { key: 'exam', name: 'Online Examination System', link: 'https://github.com/SaltGardenia/Online-Examination-System' },
  { key: 'site', name: 'Smart Construction Site Video Surveillance System', link: 'https://github.com/SaltGardenia/Smart-Construction-Site-Video-Surveillance-System' },
  { key: 'cockpit', name: 'Intelligent Cockpit System', link: 'https://github.com/SaltGardenia/Intelligent-Cockpit-System' },
  { key: 'fruit', name: 'Fruit Classifier', link: 'https://github.com/SaltGardenia/Fruit-Classifier' },
]

export default function ToyCard() {
  const { t } = useI18n()

  return (
    <div className="project-rows-block">
      <div className="project-rows-head">
        <span className="project-rows-title">{t('projects.toyTitle')}</span>
        <span className="project-rows-line" aria-hidden="true" />
      </div>
      <div className="project-rows">
        {toyProjects.map((p, i) => (
          <ProjectRow
            key={p.link}
            exp={String(i + 1).padStart(2, '0')}
            title={p.name}
            summary={t('toy.' + p.key + '.sum')}
            link={p.link}
          />
        ))}
      </div>
    </div>
  )
}
