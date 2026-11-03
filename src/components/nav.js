export function initNav() {
  const hamburger = document.querySelector('.nav-hamburger')
  const mobileMenu = document.getElementById('nav-mobile-menu')
  const backdrop = document.getElementById('nav-backdrop')
  const mobileLinks = document.querySelectorAll('.nav-mobile-link')

  if (!hamburger || !mobileMenu) return

  const nav = document.getElementById('nav')

  function openMenu() {
    hamburger.classList.add('is-open')
    nav?.classList.add('nav-mobile-open')
    backdrop?.classList.add('is-active')
    hamburger.setAttribute('aria-expanded', 'true')
    hamburger.setAttribute('aria-label', 'Menü schließen')
  }

  function closeMenu() {
    hamburger.classList.remove('is-open')
    nav?.classList.remove('nav-mobile-open')
    backdrop?.classList.remove('is-active')
    hamburger.setAttribute('aria-expanded', 'false')
    hamburger.setAttribute('aria-label', 'Menü öffnen')
  }

  // Beim Scrollen wird der Header nur flacher (.nav--scrolled), ganz oben wieder voll.
  // Hysterese (an ab 40px, aus erst bei 0): Der Header ist im Layoutfluss, sein
  // Höhenwechsel verschiebt den Inhalt — ohne Abstand würde das am Seitenanfang
  // per Scroll-Anchoring hin- und herspringen.
  let ticking = false

  function updateScrolledState() {
    ticking = false
    const y = window.scrollY
    if (y > 40) nav?.classList.add('nav--scrolled')
    else if (y <= 0) nav?.classList.remove('nav--scrolled')
  }

  function handleScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(updateScrolledState)
  }

  updateScrolledState()
  window.addEventListener('scroll', handleScroll, { passive: true })

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('is-open') ? closeMenu() : openMenu()
  })

  // Close on link click
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu))

  // Escape schließt das Menü und gibt den Fokus an den Button zurück
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('is-open')) {
      closeMenu()
      hamburger.focus()
    }
  })

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#nav')) {
      closeMenu()
    }
  })
}
