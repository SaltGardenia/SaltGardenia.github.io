import IconChevronUp from '@/components/IconChevronUp'

export default function BackTopButton({ show }: { show: boolean }) {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      className={`back-top-btn ${show ? 'show' : ''}`}
      onClick={scrollToTop}
      aria-label="回到顶部"
    >
      <IconChevronUp />
    </button>
  )
}
