// Einstieg für Unterseiten (Blog, Impressum, Datenschutz) — nur das, was dort gebraucht wird
import { initNav } from './components/nav.js'
import { initReveal } from './components/reveal.js'
import { initBackToTop } from './components/backToTop.js'

document.documentElement.classList.add('js')

function init() {
  initNav()
  initReveal()
  initBackToTop()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
