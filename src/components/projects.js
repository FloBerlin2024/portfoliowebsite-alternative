// Projektdaten + Rendering der Projekt-Rows.
// `image` (responsive Quelle via responsiveImage()) überschreibt `visual` (Inline-SVG).
// `link` leer lassen, solange es keine öffentliche URL gibt: der Button wird dann nicht gerendert.

// Statische Imports, damit Vite die Mockups bündelt (hashed URLs, korrekt in dev + build).
import rechner640 from '../assets/images/rechner-640.webp'
import rechner1280 from '../assets/images/rechner-1280.webp'
import rechner1920 from '../assets/images/rechner-1920.webp'
import generator640 from '../assets/images/generator-640.webp'
import generator1280 from '../assets/images/generator-1280.webp'
import generator1920 from '../assets/images/generator-1920.webp'
import dock640 from '../assets/images/dock-640.webp'
import dock1280 from '../assets/images/dock-1280.webp'
import dock1920 from '../assets/images/dock-1920.webp'
import lernapp440 from '../assets/images/lernapp-440.webp'
import lernapp600 from '../assets/images/lernapp-600.webp'
import lernapp732 from '../assets/images/lernapp-732.webp'

// Baut srcset/sizes aus vorgenerierten Bildern in aufsteigender Breite.
function responsiveImage(sources, alt, width, height) {
  const [small, mid, large] = sources.map(s => s.src)
  const widths = sources.map(s => s.w)
  return {
    src: mid,
    srcset: `${small} ${widths[0]}w, ${mid} ${widths[1]}w, ${large} ${widths[2]}w`,
    sizes: '(min-width: 1100px) 620px, 100vw',
    alt,
    width,
    height
  }
}

// Swiss-Style-Palette (gleich wie variables.css)
const COLORS = {
  ink: '#0F172A',
  muted: '#475569',
  paper: '#FFFFFF',
  subtle: '#F1F5F9',
  accent: '#4F46E5'
}

const projects = [
  {
    title: 'TGS Rechner',
    tags: ['Web-App', 'Schulalltag'],
    description: 'Noten- und Punkterechner für den Schulalltag: Punkte eintippen, Note sofort sehen — ohne Anmeldung, ohne Umwege, auf jedem Gerät.',
    link: '',
    image: responsiveImage([{ src: rechner640, w: 640 }, { src: rechner1280, w: 1280 }, { src: rechner1920, w: 1920 }], 'Bildschirm eines Laptops zeigt den TGS Abschlussrechner mit Punkte- und Notenübersicht', 1280, 853),
    visual: rechnerVisual()
  },
  {
    title: 'Generatorenwebsite',
    tags: ['Unterrichtstools', 'JavaScript'],
    description: 'Zufallsgeneratoren für den Unterricht: Gruppen einteilen, Namen ziehen, Themen auslosen — ein Klick, ein faires Los, keine Diskussion.',
    link: '',
    image: responsiveImage([{ src: generator640, w: 640 }, { src: generator1280, w: 1280 }, { src: generator1920, w: 1920 }], 'Laptop-Mockup zeigt den Kreuzworträtsel-Generator mit generiertem Rätsel zum Thema Die Erde', 1280, 853),
    visual: generatorVisual()
  },
  {
    title: 'Widgetdock',
    tags: ['Electron', 'Klassenzimmer'],
    description: 'Schwebende Widgets fürs Klassenzimmer: Fokus-Timer, Lärmampel und Schülerliste als Overlay über dem Desktop — läuft ohne Installation direkt vom USB-Stick.',
    link: '',
    image: responsiveImage([{ src: dock640, w: 640 }, { src: dock1280, w: 1280 }, { src: dock1920, w: 1920 }], 'Nahaufnahme des Widgetdock-Overlays mit Icons für Timer, Lautstärke, Schülerliste und Notizen', 1280, 652),
    visual: widgetdockVisual()
  },
  {
    title: 'Lernapp',
    tags: ['Web-App', 'Selbstlernen'],
    description: 'Interaktive Lern-App für meine Fächer: Erdkunde und Ethik in kurzen Quiz-Runden. Schülerinnen und Schüler üben selbstständig im eigenen Tempo — mit sofortigem Feedback und Dark Mode.',
    link: '',
    fit: 'contain',
    image: responsiveImage([{ src: lernapp440, w: 440 }, { src: lernapp600, w: 600 }, { src: lernapp732, w: 732 }], 'Smartphone mit der Lernapp: LERNAPP-Kopfzeile, Begrüßungskarte und Fach Erdkunde im gelben Neobrutalism-Stil', 732, 1052),
    visual: designVisual()
  }
]

export function initProjects() {
  const container = document.querySelector('#projects-container')
  if (!container) return

  const fragment = document.createDocumentFragment()
  projects.forEach((project, i) => fragment.appendChild(createProjectRow(project, i)))
  container.appendChild(fragment)
}

// Panel-Karte: Kopfbalken (Nummer | Tags) → Bild → Titel + Beschreibung
function createProjectRow(project, index) {
  const card = document.createElement('article')
  card.className = 'panel project-card'
  card.setAttribute('data-reveal', '')

  const number = String(index + 1).padStart(2, '0')

  const media = project.image
    ? `<img src="${project.image.src}" srcset="${project.image.srcset}" sizes="${project.image.sizes}" alt="${project.image.alt}" width="${project.image.width}" height="${project.image.height}" loading="lazy" decoding="async">`
    : project.visual

  const mediaClass = project.fit === 'contain'
    ? 'project-media project-media--stage'
    : 'project-media'

  const cta = project.link
    ? `<a href="${project.link}" class="square-link label" target="_blank" rel="noopener noreferrer">Projekt ansehen<span class="sr-only"> (öffnet in neuem Tab)</span></a>`
    : ''

  card.innerHTML = `
    <div class="panel-bar label">
      <span>Projekt ${number}</span>
      <span class="panel-bar-tags">${project.tags.join(' · ')}</span>
    </div>
    <div class="${mediaClass}">${media}</div>
    <div class="panel-body">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      ${cta}
    </div>
  `

  return card
}

/* ── Inline-SVG-Visuals im Swiss Style ───────────────────────────
   Nur als Fallback, falls ein Projekt kein `image` hat.
   Flächen eckig (kein rx), Rahmen in Ink, keine Offset-Schatten. */

function box(x, y, w, h, fill, stroke = COLORS.ink) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="4"/>`
}

function bar(x, y, w, label) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="30" fill="${COLORS.ink}"/>
    <text x="${x + 14}" y="${y + 20}" font-size="13" font-weight="700" letter-spacing="2" fill="${COLORS.paper}" font-family="inherit">${label}</text>`
}

function svgWrap(label, content) {
  return `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" class="project-visual">
    <rect width="800" height="450" fill="${COLORS.subtle}"/>
    ${content}
  </svg>`
}

function rechnerVisual() {
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3']
  let buttons = ''
  keys.forEach((key, i) => {
    const bx = 286 + (i % 3) * 80
    const by = 196 + Math.floor(i / 3) * 62
    const active = key === '5'
    buttons += `
      ${box(bx, by, 64, 46, active ? COLORS.accent : COLORS.paper)}
      <text x="${bx + 32}" y="${by + 31}" text-anchor="middle" font-size="20" font-weight="800" fill="${active ? COLORS.paper : COLORS.ink}" font-family="inherit">${key}</text>`
  })
  return svgWrap('TGS Rechner – Bedienoberfläche', `
    ${box(258, 52, 284, 346, COLORS.paper)}
    ${bar(258, 52, 284, 'RECHNER')}
    ${box(282, 100, 236, 76, COLORS.paper)}
    <text x="298" y="130" font-size="13" font-weight="700" letter-spacing="2" fill="${COLORS.muted}" font-family="inherit">13 PUNKTE</text>
    <text x="502" y="164" text-anchor="end" font-size="38" font-weight="800" fill="${COLORS.ink}" font-family="inherit">= 1,7</text>
    ${buttons}
  `)
}

function generatorVisual() {
  const rows = ['GRUPPE', 'LOTTE', 'VULKANE']
  let slots = ''
  rows.forEach((word, i) => {
    const y = 108 + i * 84
    const active = i === 2
    slots += `
      ${box(190, y, 300, 62, active ? COLORS.accent : COLORS.paper)}
      <text x="218" y="${y + 40}" font-size="24" font-weight="800" letter-spacing="3" fill="${active ? COLORS.paper : COLORS.ink}" font-family="inherit">${word}</text>`
  })
  return svgWrap('Generatorenwebsite – Zufallsgenerator', `
    ${slots}
    ${box(534, 158, 120, 120, COLORS.ink)}
    <path d="M594 190a28 28 0 1 1-24 14" fill="none" stroke="${COLORS.paper}" stroke-width="7" stroke-linecap="square"/>
    <path d="M562 192l8 16 14-8z" fill="${COLORS.paper}"/>
  `)
}

function widgetdockVisual() {
  let dock = ''
  ;[COLORS.accent, COLORS.ink, COLORS.paper, COLORS.paper].forEach((fill, i) => {
    dock += box(316 + i * 48, 352, 36, 36, fill)
  })
  return svgWrap('Widgetdock – Klassenzimmer-Widgets als Desktop-Overlay', `
    ${box(146, 84, 210, 150, COLORS.paper)}
    ${bar(146, 84, 210, 'FOKUS')}
    <text x="170" y="204" font-size="52" font-weight="800" fill="${COLORS.ink}" font-family="inherit">05:00</text>
    ${box(432, 64, 110, 230, COLORS.paper)}
    ${box(462, 92, 50, 50, COLORS.ink)}
    ${box(462, 154, 50, 50, COLORS.accent)}
    ${box(462, 216, 50, 50, COLORS.subtle)}
    ${box(300, 338, 226, 64, COLORS.paper)}
    ${dock}
  `)
}

function designVisual() {
  let row = ''
  ;[COLORS.ink, COLORS.accent, COLORS.muted, COLORS.subtle].forEach((fill, i) => {
    row += box(444 + i * 62, 268, 50, 50, fill)
  })
  return svgWrap('Eigenes Design – Farb- und Typografie-System', `
    ${box(120, 90, 250, 270, COLORS.paper)}
    <text x="245" y="270" text-anchor="middle" font-size="130" font-weight="800" fill="${COLORS.ink}" font-family="inherit">Aa</text>
    <rect x="156" y="304" width="178" height="10" fill="${COLORS.accent}"/>
    ${box(444, 96, 236, 118, COLORS.paper)}
    <text x="468" y="146" font-size="22" font-weight="800" fill="${COLORS.ink}" font-family="inherit">DESIGN-</text>
    <text x="468" y="180" font-size="22" font-weight="800" fill="${COLORS.accent}" font-family="inherit">SYSTEM</text>
    ${row}
  `)
}
