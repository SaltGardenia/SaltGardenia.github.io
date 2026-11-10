import { useI18n } from '@/i18n'
import ProjectCard from '@/components/ProjectCard'
import ProjectRow from '@/components/ProjectRow'
import ContribCard from '@/components/ContribCard'
import ToyCard from '@/components/ToyCard'

type ProjectEntry = {
  key: string
  tags: string[]
  link: string
  role?: string
  home?: string
  homeLabel?: string
}

// 前 FEATURED_COUNT 个以完整大卡展示，其余收纳进紧凑行列表
const FEATURED_COUNT = 2

const projects: ProjectEntry[] = [
  { key: 'proj11', tags: ['Kotlin', 'Android', 'tag.liquidGlass'], link: 'https://github.com/SaltGardenia/calm-schedule' },
  { key: 'proj12', tags: ['Kotlin', 'Android', 'tag.localFirst'], link: 'https://github.com/SaltGardenia/calm-ledger' },
  { key: 'proj9', tags: ['Next.js', 'Dashboard', 'Data Viz', 'OpenAlex'], link: 'https://github.com/SaltGardenia/AI-ApexTrace', home: 'https://saltgardenia.github.io/AI-ApexTrace/', homeLabel: 'projects.page' },
  { key: 'proj10', tags: ['Skills', 'Papers', 'Agents', 'Writing'], link: 'https://github.com/SaltGardenia/sci-story-skills', home: 'https://saltgardenia.github.io/sci-story-skills/', homeLabel: 'projects.page' },
  { key: 'proj13', tags: ['Skills', 'Paper Writing', 'Methodology', 'Rebuttal'], link: 'https://github.com/SaltGardenia/paper-writing-guide-SKILL' },
]

export default function ProjectsSection() {
  const { t } = useI18n()

  const featured = projects.slice(0, FEATURED_COUNT)
  const rest = projects.slice(FEATURED_COUNT)

  return (
    <section className="section" id="projects">
      <div className="section-inner reveal">
        <div className="section-head">
          <h2 className="section-title">{t('projects.title')}</h2>
        </div>
        <div className="projects-grid stagger">
          {featured.map((project, i) => (
            <ProjectCard
              key={project.key}
              exp={String(i + 1).padStart(2, '0')}
              role={project.role}
              title={t(project.key + '.title')}
              description={t(project.key + '.desc')}
              tags={project.tags}
              link={project.link}
              home={project.home}
              homeLabel={project.homeLabel}
            />
          ))}
        </div>

        {rest.length > 0 && (
          <div className="project-rows-block">
            <div className="project-rows-head">
              <span className="project-rows-title">{t('projects.moreTitle')}</span>
              <span className="project-rows-line" aria-hidden="true" />
            </div>
            <div className="project-rows">
              {rest.map((project, i) => (
                <ProjectRow
                  key={project.key}
                  exp={String(i + 1).padStart(2, '0')}
                  title={t(project.key + '.title')}
                  summary={t(project.key + '.sum')}
                  link={project.link}
                  home={project.home}
                  homeLabel={project.homeLabel}
                />
              ))}
            </div>
          </div>
        )}

        <ContribCard />
        <ToyCard />
      </div>
    </section>
  )
}
