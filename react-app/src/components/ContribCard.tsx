import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n'
import ProjectRow from '@/components/ProjectRow'

type ContribProject = {
  key: string
  link: string
  page?: string
}

const contribProjects: ContribProject[] = [
  { key: 'contrib9', link: 'https://github.com/OpenHands/OpenHands', page: 'https://openhands.dev/' },
  { key: 'contrib10', link: 'https://github.com/ray-project/ray', page: 'https://ray.io' },
  { key: 'contrib8', link: 'https://github.com/OneDragon-Anything/ZenlessZoneZero-OneDragon', page: 'https://one-dragon.com/zzz/zh/home.html' },
  { key: 'contrib5', link: 'https://github.com/hfut-paperlist/hfut-paperlist.github.io', page: 'https://hfut-paperlist.github.io/' },
  { key: 'contrib7', link: 'https://github.com/Yuan1z0825/nature-skills', page: 'https://yuan1z0825.github.io/nature-skills/' },
]

type RepoStats = { stars: number; forks: number }

// 从 GitHub 仓库链接提取 "owner/repo"
function repoName(link: string): string | null {
  return link.match(/github\.com\/([^/]+\/[^/]+)/)?.[1] ?? null
}

export default function ContribCard() {
  const { t } = useI18n()
  const [stats, setStats] = useState<Record<string, RepoStats>>({})

  // 运行时拉取各仓库的 star / fork 数，自动跟随实际数值；失败时保持隐藏
  useEffect(() => {
    const names = contribProjects
      .map((p) => repoName(p.link))
      .filter((n): n is string => n !== null)
    Promise.all(
      names.map((name) =>
        fetch(`https://api.github.com/repos/${name}`)
          .then((r) => (r.ok ? r.json() : null))
          .then(
            (d: { stargazers_count?: number; forks_count?: number } | null) =>
              d && typeof d.stargazers_count === 'number'
                ? ([name, { stars: d.stargazers_count, forks: d.forks_count ?? 0 }] as const)
                : null,
          )
          .catch(() => null),
      ),
    ).then((results) => {
      const map: Record<string, RepoStats> = {}
      for (const r of results) {
        if (r) map[r[0]] = r[1]
      }
      setStats(map)
    })
  }, [])

  return (
    <div className="project-rows-block">
      <div className="project-rows-head">
        <span className="project-rows-title">{t('projects.contribTitle')}</span>
        <span className="project-rows-line" aria-hidden="true" />
      </div>
      <div className="project-rows">
        {contribProjects.map((p, i) => {
          const s = stats[repoName(p.link) ?? '']
          return (
            <ProjectRow
              key={p.key}
              exp={String(i + 1).padStart(2, '0')}
              title={t(p.key + '.name')}
              summary={t(p.key + '.sum')}
              home={p.page}
              homeLabel="projects.page"
              link={p.link}
              stars={s?.stars}
              forks={s?.forks}
            />
          )
        })}
      </div>
    </div>
  )
}
