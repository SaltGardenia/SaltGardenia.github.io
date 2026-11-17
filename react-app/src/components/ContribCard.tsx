import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n'
import ProjectRow from '@/components/ProjectRow'

type ContribProject = {
  key: string
  link: string
  page?: string
  // 需要在按钮前展示 GitHub star 数的仓库（full name）
  starsRepo?: string
}

const contribProjects: ContribProject[] = [
  { key: 'contrib9', link: 'https://github.com/OpenHands/OpenHands', page: 'https://openhands.dev/', starsRepo: 'OpenHands/OpenHands' },
  { key: 'contrib5', link: 'https://github.com/hfut-paperlist/hfut-paperlist.github.io', page: 'https://hfut-paperlist.github.io/' },
  { key: 'contrib7', link: 'https://github.com/Yuan1z0825/nature-skills', page: 'https://yuan1z0825.github.io/nature-skills/' },
]

export default function ContribCard() {
  const { t } = useI18n()
  const [stars, setStars] = useState<number | null>(null)

  // 运行时拉取 star 数，自动跟随实际数值；失败时保持隐藏
  useEffect(() => {
    const repo = contribProjects.find((p) => p.starsRepo)?.starsRepo
    if (!repo) return
    fetch(`https://api.github.com/repos/${repo}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { stargazers_count?: number }) => {
        if (typeof d.stargazers_count === 'number') setStars(d.stargazers_count)
      })
      .catch(() => {})
  }, [])

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
            stars={p.starsRepo && stars !== null ? stars : undefined}
          />
        ))}
      </div>
    </div>
  )
}
