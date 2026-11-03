// Pause-Schalter für die Hero-Wortanimation (WCAG 2.2.2: Bewegung, die länger
// als 5 s läuft, muss sich anhalten lassen). Bei prefers-reduced-motion steht
// die Animation per CSS ohnehin still — dann wird der Button ausgeblendet.
export function initHeroAnimation() {
  const btn = document.querySelector('.hero-pause')
  const hero = document.querySelector('#hero')
  if (!btn || !hero) return

  const text = btn.querySelector('.hero-pause-text')

  btn.addEventListener('click', () => {
    const paused = hero.classList.toggle('is-paused')
    btn.setAttribute('aria-pressed', String(paused))
    text.textContent = paused ? 'Animation fortsetzen' : 'Animation anhalten'
  })
}
