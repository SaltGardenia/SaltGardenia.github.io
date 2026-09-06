import { useI18n } from '@/i18n'
import PublicationCard from '@/components/PublicationCard'

type PublicationEntry = {
  key: string
  domain: 'vision' | 'system'
  authors: string[]
  title: string
  venue: string
  year: number
  link?: string
  codeLink?: string
  projectLink?: string
  tags?: string[]
}

const publications: PublicationEntry[] = [
  {
    key: 'pub1',
    domain: 'vision',
    authors: ['Yaze Li', 'Xinyu Xie', 'Jiawei Ma', 'Siying Song', 'Jianan Zou', 'Haihong Xiao', 'Wei Jia'],
    title: 'From Geometric Reconstruction to Actionable Scene Understanding for Embodied Manipulation: A Survey',
    venue: 'arXiv preprint (arXiv:0000.00000)',
    year: 2026,
    projectLink: 'https://saltgardenia.github.io/Actionable-Scene-Understanding/',
    codeLink: 'https://github.com/SaltGardenia/Actionable-Scene-Understanding',
    tags: ['Survey', '3D Reconstruction', 'Scene Understanding', 'Embodied Intelligence', 'Manipulation'],
  },
]

export default function PublicationsSection() {
  const { t } = useI18n()

  return (
    <section className="section" id="publications">
      <div className="section-inner reveal">
        <div className="section-head">
          <h2 className="section-title">{t('publications.title')}</h2>
        </div>
        <div className="projects-grid stagger">
          {publications.map((pub, i) => (
            <PublicationCard
              key={pub.key}
              exp={String(i + 1).padStart(2, '0')}
              domain={i % 2 === 0 ? 'vision' : 'system'}
              authors={pub.authors}
              title={pub.title}
              venue={pub.venue}
              year={pub.year}
              link={pub.link}
              codeLink={pub.codeLink}
              projectLink={pub.projectLink}
              tags={pub.tags}
            />
          ))}
        </div>
      </div>
    </section>
  )
}