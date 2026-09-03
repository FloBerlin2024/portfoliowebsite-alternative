# Portfolio Website — Claude Context

## Projekt-Überblick

Persönliches Portfolio von **Florian Matthias**, Lehrer für Geografie & Ethik.
Stack: **Vite + Vanilla JS (ES Modules)** — kein Framework, kein Build-Step nötig für Dev.

Design-Referenz: [kristi.digital](https://kristi.digital) — Neobrutalism-Stil.

---

## Tech Stack

| Tool | Zweck |
|------|-------|
| Vite | Dev Server + Build |
| Vanilla JS (ES Modules) | Keine Framework-Abhängigkeit |
| CSS Custom Properties | Design Tokens in `variables.css` |
| Playwright MCP | Visuelle Tests / Screenshots |

**Dev starten:** `npm run dev`
**Build:** `npm run build`

---

## Dateistruktur

```
index.html                  # Haupt-HTML, alle Sections
src/
  main.js                   # App-Init, setzt html.js-Klasse, importiert alle Komponenten
  components/
    nav.js                  # Hamburger-Menü, mobiles Overlay, dynamische Top-Position
    projects.js             # Projekt-Daten + DOM-Rendering + Inline-SVG-Visuals
    contact.js              # Kontaktformular + Formspree
    reveal.js               # Scroll-Reveal via IntersectionObserver ([data-reveal])
    backToTop.js            # Back-to-top Button
  styles/
    main.css                # Importiert alle CSS-Dateien
    variables.css           # Design Tokens (Farben, Spacing, Shadows)
    base.css                # Reset, Typography, .container
    layout.css              # Section-Layouts (Hero, About, Projects, Contact, Footer)
    components.css          # UI-Komponenten (Nav, Buttons, Cards, Forms, Back-to-top)
  assets/
    images/                 # Projektbilder + Profilfoto (florian.png)
```

---

## Design System — Neobrutalism

Alle Tokens in `src/styles/variables.css`.

### Farben
```css
--color-royal-blue:   #003D82   /* Akzent (Projekt-Tags, Back-to-top Button) */
--color-warm-orange:  #D97834   /* Primär-Akzent (Ticker, Primary-Button, Hover) */
--color-anthrazite:   #2A2A2A   /* Text, Borders, Shadows */
--color-cream:        #F5F1EB   /* Hero-Bg, Featured-Projects-Bg, Nav-Mobile-Menu */
--color-white:        #FFFFFF   /* About, Projects-Header, Contact */
--color-light-border: #E0DDD8   /* Trennlinien innerhalb Mobile-Menu */
```

### Neobrutalism-Regeln
- **Border:** `2px solid var(--color-anthrazite)` auf allen interaktiven Elementen
- **Shadows:** Hart, offset (kein blur) — `3px 3px 0`, `5px 5px 0`, `7px 7px 0` + `var(--color-anthrazite)`
- **Hover:** `translateY(-3px)` + Shadow wächst → Lift-Effekt
- **Active/Click:** `translate(3px, 3px)` + Shadow verschwindet → Press-Effekt
- **Border-Radius:** `--radius: 6px` (Buttons, Tags), `--radius-input: 12px` (Inputs, Karten)
- **Font-Weight:** Headings + Nav = `900`

### Section-Backgrounds (von oben nach unten)
```
Nav             → cream (sticky, floating Card)
Hero            → hero-gradient (cream → lavender)
Services        → card-yellow / card-green / card-pink
Projects-Intro  → white
Proj. Rows      → cream (.featured-projects)
Contact         → white
Footer          → anthrazite (dunkel)
```
→ **Keine Trennlinien** zwischen Sections — Farbwechsel erzeugt Trennung.

---

## Komponenten

### Hero-Animation (CSS-only)
- H1-Struktur: `ICH BIN` (statisch, Zeile 1) + `.hero-animate` (Zeile 2, scrollende Wortliste)
- Wörter: LEHRER. / BEGLEITER. / BERATER. / ORGANISATOR. / KI ENTHUSIAST. / DESIGNER. (+ Duplikat für nahtlosen Loop)
- Kein Rahmen, kein Hintergrund — nur `var(--color-warm-orange)` Textfarbe
- Timing: 14s `linear`, `cubic-bezier(0.76, 0, 0.24, 1)` pro Übergang (~0.6s), ~2s Hold je Wort
- CSS-Klassen: `.hero-animate`, `.hero-animate-track`, `.hero-animate-word` in `layout.css`

### Hero-Typografie & Responsive-Logik
- **H1 Mobile** (gestapelt, <768px): `clamp(2.8rem, 7vw, 3.8rem)` — groß, nutzt volle Breite
- **H1 Desktop** (≥768px): `clamp(2rem, 5.5vw, 3.8rem)` — schrumpft flüssig mit Viewport
- **Beschreibung Mobile**: kein `max-width`, volle Container-Breite
- **Beschreibung Desktop**: `clamp(0.85rem, 1.4vw, 1rem)`, `max-width: 38ch`
- **Bild-Spalte** (≥768px): `clamp(300px, 44vw, 520px)` — schrumpft langsamer als Textspalte → Bild bleibt proportional groß
- **Bild-Container**: `aspect-ratio: 1`, `object-fit: contain` — collage.png ist 1040×1040 (auf Web-Größe optimiert), füllt Box vollständig ohne Crop

### Navigation (`nav.js` + CSS)
- Desktop (≥768px): Logo links, Links rechts — Hover = Orange-Fill von rechts nach links, Schrift weiß + letter-spacing größer
- Mobile (<768px): Hamburger-Button (3 Striche → X-Animation mit CSS), Mobile-Overlay-Panel
- Overlay: `position: fixed`, Top-Position wird **dynamisch per JS** gesetzt (`nav.getBoundingClientRect().bottom`)
- **Pill-Nav beim Scrollen (Desktop, ≥768px)**: `nav.js` togglet die Klasse `.nav--pill` auf `#nav` — bei jeder Abwärtsbewegung wird sie gesetzt, sie bleibt beim Hochscrollen bestehen und wird erst entfernt, wenn `scrollY === 0` (nicht schon bei „fast oben"). CSS animiert dabei nur `width` (fest `calc(100% - 20px)` ↔ `460px`, **kein** `fit-content`/`auto` — diese Keywords transitionieren nicht sauber, sondern springen), dazu `border-radius`, `background-color`, `box-shadow`. Pill-Zustand: zentriert (`margin-inline: auto`), Logo ausgeblendet, Links zentriert, `backdrop-filter: blur()` + halbtransparentes Cream
- **Wichtiger Fallstrick, falls `position: sticky` wieder "kaputt" wirkt** (Element scrollt komplett weg statt zu kleben): `html`/`body` müssen `overflow-x: clip` statt `overflow-x: hidden` verwenden. Mit `hidden` erzwingt die Spec `overflow-y: auto` auf demselben Element (man kann eine Achse nicht `hidden` und die andere `visible` haben) — dadurch wird `body` zum eigenen Scroll-Container und Sticky-Kinder kleben nur noch relativ zu diesem kaputten Container, nicht zum echten Viewport. `clip` verhindert horizontales Scrollen genauso, ohne einen Scroll-Container zu erzeugen.

### Projekte (`projects.js`)
- Vier echte Projekte: **TGS Rechner**, **Generatorenwebsite**, **Widgetdock** (Electron-App „cmt" aus `WORKSPACE/Widgetdock`), **Lernapp**
- Alle Projektzeilen sind exakt gleich hoch: Bildhälfte hat auf Desktop festes `aspect-ratio: 3/2` (`.featured-project-image`), Querformat-Mockups füllen sie formatfüllend (`object-fit: cover`)
- **Lernapp = Hochformat-Handy** → Sonderfall über `fit: 'contain'` (projects.js) + Modifier `.featured-project-image--stage`: `object-fit: contain` auf Creme-Bühne (= Kartenfarbe). So ist fast das ganze Handy sichtbar und füllt die Höhe (oben/unten bündig, **kein unterer Rand**), Creme nur seitlich. Mobil bekommt die Bühne `aspect-ratio: 7/10` (nahe Handy-Verhältnis ~0.7), damit das Gerät formatfüllend erscheint statt im flachen 16/9-Feld zu schrumpfen
- Quelle: `Mockups/Lernapp.png` (Handy auf Weiß) → mit PIL eng aufs Gerät zugeschnitten, unten sauber nach der ERDKUNDE-Karte abgeschnitten, obere Rundungs-Ecken per Flood-Fill auf Creme gesetzt; Ausgabe `lernapp-440/600/732.png`
- Jedes Projekt hat ein Inline-SVG-Visual im Neobrutalism-Stil; `image`-Feld (Pfad) überschreibt das SVG — dort echte Screenshots eintragen
- `link` leer = kein "Projekt ansehen"-Button; URL eintragen, sobald vorhanden
- Alternierend links/rechts auf Desktop (`nth-child(even)` → Bild rechts)

### Scroll-Reveal (`reveal.js`)
- Elemente mit `[data-reveal]` faden beim ersten Sichtbarwerden ein (IntersectionObserver)
- Versteckt wird nur bei laufendem JS (`html.js`-Klasse aus `main.js`) — ohne JS bleibt alles sichtbar
- Respektiert `prefers-reduced-motion`; Stagger via `--reveal-delay` (Service-Cards)

### Kontaktformular (`contact.js`)
- Formspree-Integration → **`YOUR_FORM_ID` ersetzen**
- E-Mail in `index.html` → **`florian@example.com` ersetzen**

### Back-to-top Button
- Erscheint nach 400px Scroll
- Royal Blue, Neobrutalism-Stil, 42px × 42px (Mobile) / 48px × 48px (Desktop)
- Sanftes Ein-/Ausblenden via CSS opacity + transform

### SEO & Social Sharing
- Open-Graph- + Twitter-Meta-Tags in `index.html` (`og:title`, `og:image`, …) — `og:image` zeigt auf `/og-image.jpg` (liegt in `public/`, **nicht** in `src/assets/` — Vite verarbeitet `<meta content>`-Pfade nicht, nur `public/` wird 1:1 in den Build kopiert)
- `og:url` ist bewusst leer — sobald die Seite eine feste Domain hat, hier + als `<link rel="canonical">` eintragen
- JSON-LD (`Person`-Schema) im `<head>` für Rich-Snippets
- `public/robots.txt` erlaubt vollständiges Crawling; kein `sitemap.xml`, solange keine Domain feststeht

### Barrierefreiheit
- Skip-Link (`.skip-link` in `base.css`) springt zu `id="main"` auf dem `<main class="page-cards">`-Wrapper
- Globaler `:focus-visible`-Ring (Warm-Orange-Outline) auf allen interaktiven Elementen, `.nav-links a` hat einen eigenen Border+Shadow-Fokus statt des globalen Rings
- `<h2 class="sr-only">` vor dem Services-Grid, damit die Heading-Hierarchie nicht von h1 direkt zu h3 springt
- Geprüft mit axe-core (0 Violations) und Lighthouse (Accessibility 100)

### Signature-Effekt: Custom Cursor (`cursorEffects.js`)
- Nur bei `pointer: fine` (echte Maus) und ohne `prefers-reduced-motion` — auf Touch/Mobile inaktiv, kein Overhead; Systemcursor wird komplett per `body.custom-cursor-active` ausgeblendet (auch bei Texteingaben)
- Zwei-Element-Aufbau: `.cursor-shape` (äußeres Element, reine Positions-Verfolgung — JS setzt hier nur `transform: translate(x,y)` bei `mousemove`) + `.cursor-shape-inner` (Kind-Element, trägt Form/Farbe/Rotation, damit die per CSS frei transitionieren/animieren können, ohne der Maus hinterherzuhinken)
- Form kommt über `mask-image` (SVG-Data-URI, Formen als schwarze Fläche) + `background-color` fürs Einfärben — dadurch lässt sich die Füllfarbe frei ändern, ohne die SVG anzufassen
- Default: wellenförmige „Sticker"-Scheibe (Orange), rotiert endlos (`@keyframes cursor-spin`, 7s linear) — die Drehung ist der Grund, warum das kein natives `cursor: url()` sein kann (Cursor-Bilder sind statisch, kein Transition/Animation möglich)
- Hover über Interaktivem (`a, button, input, textarea, [role="button"]`, Klasse `body.cursor-is-active`): wird zum schwarzen 4-Zacken-Stern, etwas kleiner
- Klick (`body.cursor-is-down`): kurzer Press-Effekt, Form schrumpft
- Beide Formen sind SVG-Polygone (keine Bézier-Kurven) mit fest berechneten Punktkoordinaten direkt im CSS — bei Formänderung: neue Punkte berechnen (Zentrum 12/12, viewBox 0 0 24 24) statt die bestehenden Pfade zu verbiegen

### Responsive Bilder
- Hero-Foto (`collage.png`) und alle Projekt-Mockups (`rechner-*.jpg`, `generator-*.jpg`, `dock-*.jpg`, `lernapp-*.png`) haben `srcset`/`sizes` (Lernapp bis 670px, da das Quell-Mockup nur 1078px breit ist)
- Bilder in JS-Dateien (z. B. `projects.js`) **müssen** als ES-Modul-Imports eingebunden werden (`import x from '../assets/images/x.jpg'`), nicht als reine String-Pfade — sonst kopiert Vite sie beim Build nicht mit und sie 404en in Produktion
- Service-Icons (`Erde.png`, `Philo.png`, `Digital.png`) sind auf 160px begrenzt (werden bei 56px angezeigt) — beim Ersetzen nicht wieder auf 1000px+ Rohgröße hochladen
- Letzter Lighthouse-Mobile-Audit (Production-Build via `vite preview`): Performance 92, Accessibility 100, Best Practices 100, SEO 100

---

## Offene TODOs (vor Go-Live)

1. **E-Mail** in `index.html` ersetzen: `florian@example.com` → echte Adresse
2. **Formspree** einrichten: `src/components/contact.js` → `YOUR_FORM_ID` ersetzen
3. **Projekt-Links** in `src/components/projects.js` eintragen (`link`-Feld), sobald die Projekte online sind
4. **Optional:** echte Screenshots statt SVG-Visuals (`image`-Feld in `projects.js`)

---

## Wichtige Entscheidungen

- **Kein Cookie-Banner nötig** — kein Analytics, keine Ads, keine externen Fonts via CDN. Sobald Analytics eingebunden wird → Klaro (Open Source) empfohlen oder Matomo (DSGVO-konform ohne Banner)
- **Keine Google Fonts geladen**: `--font-family` nennt 'Inter' nur als Wunsch-Font in der Stack-Liste, es gibt aber keinen CDN-Link im HTML — die Seite läuft auf System-Fonts. Kein DSGVO-Risiko hier, aber falls 'Inter' doch geladen werden soll: self-hosten, nicht per CDN-Link
- **Kein Framework**: Bewusste Entscheidung für Vanilla JS — einfacher zu warten, kein Dependency-Risiko
- **Mobile-first CSS**: Alle Styles beginnen mit Mobile, Desktop via `min-width` Media Queries

---

## Playwright-Logs

`.playwright-mcp/` ist in `.gitignore` — Screenshots und Logs werden nicht committed.
