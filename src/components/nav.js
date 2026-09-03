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

  // Pill-Nav beim Runterscrollen (Desktop + Mobile, jeweils eigenes CSS)
  // Schrumpft bei jeder Abwärtsbewegung; expandiert erst wieder ganz oben (scrollY === 0)
  let lastScrollY = window.scrollY
  let ticking = false

  function updatePillState() {
    ticking = false

    const currentScrollY = window.scrollY

    if (currentScrollY <= 0) {
      nav?.classList.remove('nav--pill')
    } else if (currentScrollY > lastScrollY) {
      nav?.classList.add('nav--pill')
    }

    lastScrollY = currentScrollY
  }

  function handleScroll() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(updatePillState)
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('is-open') ? closeMenu() : openMenu()
  })

  // Close on link click
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu))

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#nav')) {
      closeMenu()
    }
  })
}
