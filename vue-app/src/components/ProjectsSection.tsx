import { useI18n } from '@/i18n'
import ProjectCard from '@/components/ProjectCard'

type ProjectEntry = {
  key: string
  domain: 'vision' | 'system'
  tags: string[]
  link: string
  role?: string
  home?: string
  homeLabel?: string
}

const projects: ProjectEntry[] = [
  { key: 'proj9', domain: 'vision', tags: ['Next.js', 'Dashboard', 'Data Viz', 'OpenAlex'], link: 'https://github.com/SaltGardenia/AI-ApexTrace', home: 'https://saltgardenia.github.io/AI-ApexTrace/', homeLabel: 'projects.page' },
  { key: 'proj8', domain: 'vision', tags: ['Skills', 'Agents', 'Code', 'Prompt'], link: 'https://github.com/SaltGardenia/research-code-skill', home: 'https://saltgardenia.github.io/research-code-skill/', homeLabel: 'projects.page' },
  { key: 'proj5', domain: 'vision', role: 'contributor', tags: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'], link: 'https://github.com/SaltGardenia/hfut-paperlist.github.io' },
  { key: 'proj7', domain: 'vision', role: 'contributor', tags: ['Skills', 'Agents', 'Prompt'], link: 'https://github.com/Yuan1z0825/nature-skills' },
]

export default function ProjectsSection() {
  const { t } = useI18n()

  return (
    <section className="section" id="projects">
      <div className="section-inner reveal">
        <div className="section-head">
          <h2 className="section-title">{t('projects.title')}</h2>
        </div>
        <div className="projects-grid stagger">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.key}
              exp={String(i + 1).padStart(2, '0')}
              domain={i % 2 === 0 ? 'vision' : 'system'}
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
      </div>
    </section>
  )
}
