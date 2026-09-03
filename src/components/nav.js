export function initNav() {
  const hamburger = document.querySelector('.nav-hamburger')
  const mobileMenu = document.getElementById('nav-mobile-menu')
  const backdrop = document.getElementById('nav-backdrop')
  const mobileLinks = document.querySelectorAll('.nav-mobile-link')

  if (!hamburger || !mobileMenu) return

  const nav = document.getElementById('nav')

  function updateMenuTop() {
    if (nav) {
      mobileMenu.style.top = nav.getBoundingClientRect().bottom + 'px'
    }
  }

  function openMenu() {
    updateMenuTop()
    hamburger.classList.add('is-open')
    mobileMenu.classList.add('is-open')
    backdrop?.classList.add('is-active')
    hamburger.setAttribute('aria-expanded', 'true')
    hamburger.setAttribute('aria-label', 'Menü schließen')
  }

  function closeMenu() {
    hamburger.classList.remove('is-open')
    mobileMenu.classList.remove('is-open')
    backdrop?.classList.remove('is-active')
    hamburger.setAttribute('aria-expanded', 'false')
    hamburger.setAttribute('aria-label', 'Menü öffnen')
  }

  // Position beim Start setzen
  updateMenuTop()
  window.addEventListener('resize', updateMenuTop, { passive: true })

  // Pill-Nav beim Runterscrollen (nur Desktop)
  // Schrumpft bei jeder Abwärtsbewegung; expandiert erst wieder ganz oben (scrollY === 0)
  const desktopQuery = window.matchMedia('(min-width: 768px)')
  let lastScrollY = window.scrollY
  let ticking = false

  function updatePillState() {
    ticking = false
    if (!desktopQuery.matches) return

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
  desktopQuery.addEventListener('change', () => {
    if (!desktopQuery.matches) nav?.classList.remove('nav--pill')
  })

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('is-open') ? closeMenu() : openMenu()
  })

  // Close on link click
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu))

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#nav') && !e.target.closest('#nav-mobile-menu')) {
      closeMenu()
    }
  })
}
