// Gemeinsame HTML-Bausteine für alle Seiten (Startseite, Blog, Impressum, Datenschutz).
// Werden per Vite-Plugin (vite.config.js) an den Platzhaltern <!-- @nav -->,
// <!-- @footer --> und <!-- @backtotop --> eingesetzt — Änderungen also nur hier.

const LINKS = [
  { href: '/#projects', label: 'Projekte', key: 'projects' },
  { href: '/#about', label: 'Über mich', key: 'about' },
  { href: '/blog/', label: 'Blog', key: 'blog' },
  { href: '/#contact', label: 'Kontakt', key: 'contact' }
]

function link(l, current, className = '') {
  const cls = className ? ` class="${className}"` : ''
  const aria = l.key === current ? ' aria-current="page"' : ''
  return `<a href="${l.href}"${cls}${aria}>${l.label}</a>`
}

export function navHtml(current = '') {
  return `<nav id="nav" aria-label="Hauptnavigation">
    <div class="nav-inner">
      <a href="/" class="nav-logo" aria-label="Florian — zur Startseite">
        <span class="nav-logo-full">Florian</span><span class="nav-logo-short">F</span><span class="nav-logo-dot">.</span>
      </a>
      <div class="nav-links">
        ${LINKS.map(l => link(l, current)).join('\n        ')}
      </div>
      <button class="nav-hamburger" aria-label="Menü öffnen" aria-expanded="false" aria-controls="nav-mobile-menu">
        <span class="nav-hamburger-chevron"></span>
      </button>
    </div>

    <!-- Mobiles Menü — position: fixed, schiebt nichts nach unten -->
    <div class="nav-mobile-menu" id="nav-mobile-menu">
      ${LINKS.map(l => link(l, current, 'nav-mobile-link')).join('\n      ')}
    </div>
  </nav>

  <div class="nav-backdrop" id="nav-backdrop"></div>`
}

export function footerHtml() {
  return `<div class="section-card-wrap">
  <footer>
    <div class="footer-inner">
      <a href="/" class="footer-logo">Florian<span>.</span></a>
      <nav class="footer-links" aria-label="Weitere Seiten">
        <a href="/blog/">Blog</a>
        <a href="/impressum.html">Impressum</a>
        <a href="/datenschutz.html">Datenschutz</a>
      </nav>
      <span class="footer-right">&copy; ${new Date().getFullYear()} Florian Matthias</span>
    </div>
  </footer>
  </div>`
}

export function backToTopHtml() {
  return `<button class="back-to-top" id="back-to-top" aria-label="Nach oben scrollen">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 13V3M3 8l5-5 5 5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>`
}
