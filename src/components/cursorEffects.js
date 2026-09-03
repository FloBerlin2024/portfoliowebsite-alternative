// Custom Cursor (rotierende Wellen-Scheibe → Stern) + Hero-Tilt — Signature-Effekte.
// Nur bei echter Maus (pointer: fine) und ohne prefers-reduced-motion.
export function initCursorEffects() {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!hasFinePointer || reducedMotion) return

  initCustomCursor()
  initHeroTilt()
}

// Äußeres Element ist reine Positions-Verfolgung; Form/Rotation/Farbe leben im
// Kind-Element (cursor-shape-inner), damit sie frei animieren können.
function initCustomCursor() {
  const cursor = document.createElement('div')
  cursor.className = 'cursor-shape'
  cursor.setAttribute('aria-hidden', 'true')

  const inner = document.createElement('div')
  inner.className = 'cursor-shape-inner'
  cursor.appendChild(inner)

  document.body.appendChild(cursor)
  document.body.classList.add('custom-cursor-active')

  window.addEventListener('mousemove', (e) => {
    cursor.classList.add('is-visible')
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
  }, { passive: true })

  window.addEventListener('mousedown', () => document.body.classList.add('cursor-is-down'))
  window.addEventListener('mouseup', () => document.body.classList.remove('cursor-is-down'))

  const interactiveSelector = 'a, button, input, textarea, [role="button"]'

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-is-active')
    }
  })

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector) && !e.relatedTarget?.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-is-active')
    }
  })

  document.addEventListener('mouseleave', () => document.body.classList.add('cursor-is-hidden'))
  document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-is-hidden'))
}

// Portrait neigt sich leicht zur Maus — Reaktionsfläche ist die ganze Hero-Section,
// damit der Effekt schon greift, bevor der Cursor exakt aufs Bild trifft.
function initHeroTilt() {
  const section = document.querySelector('#hero')
  const image = document.querySelector('.hero-photo-img')
  if (!section || !image) return

  const maxTilt = 10 // Grad

  section.addEventListener('mousemove', (e) => {
    const rect = image.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = (e.clientX - centerX) / (window.innerWidth / 2)
    const dy = (e.clientY - centerY) / (window.innerHeight / 2)

    image.style.setProperty('--tilt-x', `${(-dy * maxTilt).toFixed(2)}deg`)
    image.style.setProperty('--tilt-y', `${(dx * maxTilt).toFixed(2)}deg`)
  })

  section.addEventListener('mouseleave', () => {
    image.style.setProperty('--tilt-x', '0deg')
    image.style.setProperty('--tilt-y', '0deg')
  })
}
