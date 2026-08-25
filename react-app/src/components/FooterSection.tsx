import { useI18n } from '@/i18n'

export default function FooterSection() {
  const { t } = useI18n()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="sig">
          <b>LiYaze</b> — Profile
        </span>
        <span dangerouslySetInnerHTML={{ __html: t('footer.copyright') }} />
      </div>
    </footer>
  )
}
