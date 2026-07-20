// Custom Cursor + Magnetic Button — Signature-Effekt für Maus-Nutzer.
// Nur bei echter Maus (pointer: fine) und ohne prefers-reduced-motion.
export function initCursorEffects() {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!hasFinePointer || reducedMotion) return

  initCustomCursor()
  initMagneticButton()
}

function initCustomCursor() {
  const cursor = document.createElement('div')
  cursor.className = 'custom-cursor'
  cursor.setAttribute('aria-hidden', 'true')
  document.body.appendChild(cursor)
  document.body.classList.add('custom-cursor-active')

  // Nur Positionierung hier — Form/Drehung übernimmt ::before per CSS-Transition
  window.addEventListener('mousemove', (e) => {
    cursor.classList.add('is-visible')
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
  }, { passive: true })

  window.addEventListener('mousedown', () => cursor.classList.add('is-down'))
  window.addEventListener('mouseup', () => cursor.classList.remove('is-down'))

  const interactiveSelector = 'a, button, input, textarea, [role="button"]'

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.add('is-active')
    }
  })

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector) && !e.relatedTarget?.closest(interactiveSelector)) {
      cursor.classList.remove('is-active')
    }
  })

  document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'))
  document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'))
}

function initMagneticButton() {
  const btn = document.querySelector('.btn-hero-contact')
  if (!btn) return

  const radius = 70
  const maxPull = 14

  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = e.clientX - centerX
    const dy = e.clientY - centerY
    const distance = Math.hypot(dx, dy)
    const pull = Math.min(distance, radius) / radius * maxPull
    const angle = Math.atan2(dy, dx)

    btn.style.setProperty('--magnetic-x', `${Math.cos(angle) * pull}px`)
    btn.style.setProperty('--magnetic-y', `${Math.sin(angle) * pull}px`)
  })

  btn.addEventListener('mouseleave', () => {
    btn.style.setProperty('--magnetic-x', '0px')
    btn.style.setProperty('--magnetic-y', '0px')
  })
}
