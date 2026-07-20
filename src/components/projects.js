// Projektdaten + Rendering der Projekt-Rows.
// `image` (responsive Quelle via responsiveImage()) überschreibt `visual` (Inline-SVG).
// `link` leer lassen, solange es keine öffentliche URL gibt: der Button wird dann nicht gerendert.

// Statische Imports, damit Vite die Mockups bündelt (hashed URLs, korrekt in dev + build).
import rechner640 from '../assets/images/rechner-640.jpg'
import rechner1280 from '../assets/images/rechner-1280.jpg'
import rechner1920 from '../assets/images/rechner-1920.jpg'
import generator640 from '../assets/images/generator-640.jpg'
import generator1280 from '../assets/images/generator-1280.jpg'
import generator1920 from '../assets/images/generator-1920.jpg'
import dock640 from '../assets/images/dock-640.jpg'
import dock1280 from '../assets/images/dock-1280.jpg'
import dock1920 from '../assets/images/dock-1920.jpg'

// Baut srcset/sizes aus den drei bei 640/1280/1920px vorgenerierten JPEGs.
function responsiveImage([src640, src1280, src1920], alt, width, height) {
  return {
    src: src1280,
    srcset: `${src640} 640w, ${src1280} 1280w, ${src1920} 1920w`,
    sizes: '(min-width: 768px) 50vw, 100vw',
    alt,
    width,
    height
  }
}

const COLORS = {
  ink: '#2A2A2A',
  paper: '#FFFFFF',
  cream: '#F5F1EB',
  yellow: '#F0E040',
  green: '#4DDC7A',
  lavender: '#D8C8F0',
  orange: '#FF9019',
  blue: '#003D82'
}

const projects = [
  {
    title: 'TGS Rechner',
    tags: ['Web-App', 'Schulalltag'],
    description: 'Noten- und Punkterechner für den Schulalltag: Punkte eintippen, Note sofort sehen — ohne Anmeldung, ohne Umwege, auf jedem Gerät.',
    link: '',
    image: responsiveImage([rechner640, rechner1280, rechner1920], 'Bildschirm eines Laptops zeigt den TGS Abschlussrechner mit Punkte- und Notenübersicht', 1280, 853),
    visual: rechnerVisual()
  },
  {
    title: 'Generatorenwebsite',
    tags: ['Unterrichtstools', 'JavaScript'],
    description: 'Zufallsgeneratoren für den Unterricht: Gruppen einteilen, Namen ziehen, Themen auslosen — ein Klick, ein faires Los, keine Diskussion.',
    link: '',
    image: responsiveImage([generator640, generator1280, generator1920], 'Laptop-Mockup zeigt den Kreuzworträtsel-Generator mit generiertem Rätsel zum Thema Die Erde', 1280, 853),
    visual: generatorVisual()
  },
  {
    title: 'Widgetdock',
    tags: ['Electron', 'Klassenzimmer'],
    description: 'Schwebende Widgets fürs Klassenzimmer: Fokus-Timer, Lärmampel und Schülerliste als Overlay über dem Desktop — läuft ohne Installation direkt vom USB-Stick.',
    link: '',
    image: responsiveImage([dock640, dock1280, dock1920], 'Nahaufnahme des Widgetdock-Overlays mit Icons für Timer, Lautstärke, Schülerliste und Notizen', 1280, 652),
    visual: widgetdockVisual()
  },
  {
    title: 'Eigenes Design',
    tags: ['Design-System', 'CSS'],
    description: 'Diese Website als Designprojekt: ein Neobrutalism-System mit harten Schatten, klaren Kanten und mutiger Farbe — von der Palette bis zur Animation selbst gebaut.',
    link: '',
    image: '',
    visual: designVisual()
  }
]

export function initProjects() {
  const container = document.querySelector('#projects-container')
  if (!container) return

  const fragment = document.createDocumentFragment()
  projects.forEach(project => fragment.appendChild(createProjectRow(project)))
  container.appendChild(fragment)
}

function createProjectRow(project) {
  const row = document.createElement('article')
  row.className = 'featured-project'
  row.setAttribute('data-reveal', '')

  const tags = project.tags
    .map(tag => `<span class="project-tag">${tag}</span>`)
    .join('')

  const media = project.image
    ? `<img src="${project.image.src}" srcset="${project.image.srcset}" sizes="${project.image.sizes}" alt="${project.image.alt}" width="${project.image.width}" height="${project.image.height}" loading="lazy" decoding="async">`
    : project.visual

  const cta = project.link
    ? `<a href="${project.link}" class="btn btn-outline" target="_blank" rel="noopener noreferrer">Projekt ansehen →</a>`
    : ''

  row.innerHTML = `
    <div class="featured-project-image">${media}</div>
    <div class="featured-project-text">
      <div class="project-tags">${tags}</div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      ${cta}
    </div>
  `

  return row
}

/* ── Inline-SVG-Visuals im Neobrutalism-Stil ─────────────────── */

// Karte mit hartem Offset-Schatten
function card(x, y, w, h, fill, r = 14) {
  return `
    <rect x="${x + 7}" y="${y + 7}" width="${w}" height="${h}" rx="${r}" fill="${COLORS.ink}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${COLORS.ink}" stroke-width="3"/>`
}

function svgWrap(label, bg, content) {
  return `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" class="project-visual">
    <rect width="800" height="450" fill="${bg}"/>
    <circle cx="60" cy="390" r="26" fill="none" stroke="${COLORS.ink}" stroke-width="3" opacity="0.25"/>
    <circle cx="748" cy="56" r="14" fill="${COLORS.ink}" opacity="0.15"/>
    ${content}
  </svg>`
}

function rechnerVisual() {
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3']
  let buttons = ''
  keys.forEach((key, i) => {
    const bx = 286 + (i % 3) * 80
    const by = 190 + Math.floor(i / 3) * 62
    const fill = key === '5' ? COLORS.orange : COLORS.cream
    buttons += `
      <rect x="${bx + 4}" y="${by + 4}" width="64" height="46" rx="8" fill="${COLORS.ink}"/>
      <rect x="${bx}" y="${by}" width="64" height="46" rx="8" fill="${fill}" stroke="${COLORS.ink}" stroke-width="3"/>
      <text x="${bx + 32}" y="${by + 31}" text-anchor="middle" font-size="20" font-weight="800" fill="${COLORS.ink}" font-family="inherit">${key}</text>`
  })
  return svgWrap('TGS Rechner – Bedienoberfläche', COLORS.yellow, `
    ${card(258, 52, 284, 340, COLORS.paper, 18)}
    <rect x="282" y="78" width="236" height="76" rx="10" fill="${COLORS.cream}" stroke="${COLORS.ink}" stroke-width="3"/>
    <text x="298" y="112" font-size="14" font-weight="700" fill="${COLORS.ink}" opacity="0.5" font-family="inherit">13 PUNKTE</text>
    <text x="502" y="140" text-anchor="end" font-size="38" font-weight="900" fill="${COLORS.ink}" font-family="inherit">= 1,7</text>
    ${buttons}
    ${card(560, 96, 130, 54, COLORS.orange, 27)}
    <text x="625" y="130" text-anchor="middle" font-size="20" font-weight="900" fill="${COLORS.ink}" font-family="inherit">NOTE</text>
  `)
}

function generatorVisual() {
  const rows = [
    ['GRUPPE', COLORS.paper],
    ['LOTTE', COLORS.paper],
    ['VULKANE', COLORS.yellow]
  ]
  let slots = ''
  rows.forEach(([word, fill], i) => {
    const y = 108 + i * 84
    slots += `
      ${card(190, y, 300, 62, fill, 10)}
      <text x="218" y="${y + 40}" font-size="24" font-weight="900" letter-spacing="3" fill="${COLORS.ink}" font-family="inherit">${word}</text>`
  })
  return svgWrap('Generatorenwebsite – Zufallsgenerator', COLORS.green, `
    ${slots}
    ${card(534, 158, 120, 120, COLORS.orange, 60)}
    <path d="M594 186a32 32 0 1 1-27 15" fill="none" stroke="${COLORS.ink}" stroke-width="7" stroke-linecap="round"/>
    <path d="M560 188l6 16 16-6z" fill="${COLORS.ink}"/>
  `)
}

function widgetdockVisual() {
  const dockIcons = [COLORS.orange, COLORS.yellow, COLORS.green, COLORS.lavender]
  let dock = ''
  dockIcons.forEach((fill, i) => {
    dock += `<rect x="${316 + i * 48}" y="352" width="36" height="36" rx="9" fill="${fill}" stroke="${COLORS.ink}" stroke-width="3"/>`
  })
  return svgWrap('Widgetdock – Klassenzimmer-Widgets als Desktop-Overlay', COLORS.blue, `
    ${card(146, 84, 210, 150, COLORS.paper, 16)}
    <text x="180" y="130" font-size="15" font-weight="800" fill="${COLORS.ink}" opacity="0.45" font-family="inherit">FOKUS</text>
    <text x="180" y="196" font-size="52" font-weight="900" fill="${COLORS.ink}" font-family="inherit">05:00</text>
    ${card(432, 64, 110, 230, COLORS.cream, 16)}
    <circle cx="487" cy="118" r="26" fill="${COLORS.orange}" stroke="${COLORS.ink}" stroke-width="3"/>
    <circle cx="487" cy="180" r="26" fill="${COLORS.yellow}" stroke="${COLORS.ink}" stroke-width="3"/>
    <circle cx="487" cy="242" r="26" fill="${COLORS.green}" stroke="${COLORS.ink}" stroke-width="3" opacity="0.35"/>
    ${card(300, 338, 226, 64, COLORS.paper, 20)}
    ${dock}
  `)
}

function designVisual() {
  const swatches = [COLORS.orange, COLORS.yellow, COLORS.green, COLORS.blue]
  let row = ''
  swatches.forEach((fill, i) => {
    row += `
      <rect x="${449 + i * 62}" y="273" width="50" height="50" rx="8" fill="${COLORS.ink}"/>
      <rect x="${444 + i * 62}" y="268" width="50" height="50" rx="8" fill="${fill}" stroke="${COLORS.ink}" stroke-width="3"/>`
  })
  return svgWrap('Eigenes Design – Farb- und Typografie-System', COLORS.lavender, `
    ${card(120, 90, 250, 270, COLORS.paper, 18)}
    <text x="245" y="270" text-anchor="middle" font-size="130" font-weight="900" fill="${COLORS.ink}" font-family="inherit">Aa</text>
    <rect x="156" y="304" width="178" height="12" rx="6" fill="${COLORS.orange}"/>
    ${card(444, 96, 236, 118, COLORS.cream, 14)}
    <text x="468" y="146" font-size="22" font-weight="900" fill="${COLORS.ink}" font-family="inherit">DESIGN-</text>
    <text x="468" y="180" font-size="22" font-weight="900" fill="${COLORS.orange}" font-family="inherit">SYSTEM</text>
    ${row}
    <path d="M568 340l14 44 10-17 19 6z" fill="${COLORS.ink}" stroke="${COLORS.paper}" stroke-width="2"/>
  `)
}
