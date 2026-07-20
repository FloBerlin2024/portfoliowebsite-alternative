// Scroll-Reveal: Elemente mit [data-reveal] blenden beim ersten Sichtbarwerden ein.
export function initReveal() {
  const targets = document.querySelectorAll('[data-reveal]')
  if (!targets.length) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-revealed'))
    return
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      }
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

  targets.forEach(el => observer.observe(el))
}
