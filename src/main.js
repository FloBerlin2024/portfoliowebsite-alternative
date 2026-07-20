import { initNav } from './components/nav.js'
import { initProjects } from './components/projects.js'
import { initContact } from './components/contact.js'
import { initReveal } from './components/reveal.js'
import { initBackToTop } from './components/backToTop.js'
import { initCursorEffects } from './components/cursorEffects.js'

// Signal für CSS: JS läuft — erst dann werden [data-reveal]-Elemente initial versteckt
document.documentElement.classList.add('js')

function init() {
  initNav()
  initProjects()
  initContact()
  initReveal()
  initBackToTop()
  initCursorEffects()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
