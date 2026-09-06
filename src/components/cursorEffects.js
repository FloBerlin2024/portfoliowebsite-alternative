// Hero-Tilt — Signature-Effekt für Maus-Nutzer.
// Nur bei echter Maus (pointer: fine) und ohne prefers-reduced-motion.
// Cursor läuft bewusst auf Standard — kein Custom-Cursor.
export function initCursorEffects() {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!hasFinePointer || reducedMotion) return

  initHeroTilt()
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
