# Portfolio Website — Claude Context

## Projekt-Überblick

Persönliches Portfolio von **Florian Matthias**, Lehrer für Geografie & Ethik.
Stack: **Vite + Vanilla JS (ES Modules)** — kein Framework, kein Build-Step nötig für Dev.

Design: **Swiss Style** (wie der Kurswahlrechner) — Weiß, Tinte, ein Indigo-Akzent, schmale Archivo-Versalien, harte Rahmen ohne Radius/Schatten.

---

## Tech Stack

| Tool | Zweck |
|------|-------|
| Vite | Dev Server + Build |
| Vanilla JS (ES Modules) | Keine Framework-Abhängigkeit |
| CSS Custom Properties | Design Tokens in `variables.css` |
| Playwright MCP | Visuelle Tests / Screenshots |

**Dev starten:** `npm run dev` → http://localhost:3000 (Port + Auto-Öffnen in `vite.config.js`)
**Nie `index.html` direkt öffnen** (Doppelklick / `file://`): Der Browser blockiert dann `main.js` (ES-Module) → keine Projektkarten/-bilder, kein Menü. Immer über Vite (`dev` oder `preview`) ansehen
**Build:** `npm run build`

---

## Dateistruktur

```
index.html                  # Startseite, alle Sections (<title>: nur „Florian“)
impressum.html              # Impressum (§ 5 DDG, § 18 MStV) — eigener Vite-Einstiegspunkt
datenschutz.html            # Datenschutzerklärung (keine Cookies, Hosting, Formspree, Rechte)
content/blog/*.md           # Blogbeiträge als Markdown — Dateiname = URL /blog/<name>/
blog/                       # AUTOMATISCH erzeugt aus content/blog (gitignored, nie von Hand bearbeiten)
public/blog-bilder/         # Bilder für Blogbeiträge (Link: /blog-bilder/x.webp)
scripts/blog.js             # Markdown → HTML-Seiten (Swiss-Markup), RSS-Feed, Sitemap
vite.config.js              # Plugin `blog` + rollupOptions.input (alle Seiten inkl. Blog; neue Seiten hier eintragen!)
src/
  main.js                   # App-Init, setzt html.js-Klasse, importiert alle Komponenten
  components/
    nav.js                  # Chevron-Menü (mobil), .nav--scrolled beim Scrollen, Escape schließt
    projects.js             # Projekt-Daten + Panel-Karten + Inline-SVG-Fallback-Visuals
    contact.js              # Kontaktformular + Formspree
    reveal.js               # Scroll-Reveal via IntersectionObserver ([data-reveal])
    heroAnimation.js        # Pause-Schalter der Hero-Wortanimation (WCAG 2.2.2)
    backToTop.js            # Back-to-top Button
  styles/
    main.css                # Importiert alle CSS-Dateien
    fonts.css               # @font-face für Archivo (woff2 aus assets/fonts/)
    variables.css           # Design Tokens (Farben, Rahmen, Spacing)
    base.css                # Reset, Typography, .container
    layout.css              # Sections (Hero, 01 Schwerpunkte, 02 Projekte, 03 Kontakt, Footer), Reveal
    components.css          # Bausteine (Nav, Buttons, .panel, .section-head, .square-link, Formular, Back-to-top)
    blog.css                # Blog-Übersicht (Panels) + Beitrag (.prose für Markdown)
  assets/
    fonts/                  # Archivo-woff2 (latin + latin-ext, variabel) + OFL-Lizenz
    images/                 # Projektbilder + Porträt (sketch*.webp)
```

---

## Design System — Swiss Style

Alle Tokens in `src/styles/variables.css`.

### Farben
```css
--color-ink:          #0F172A  /* Text, Rahmen, Kopfbalken, Footer */
--color-muted:        #475569  /* Sekundärtext, Labels (7.6:1 auf Weiß) */
--color-paper:        #FFFFFF  /* Seitengrund — alles liegt auf Weiß */
--color-subtle:       #F1F5F9  /* nur Bild-Bühne (Lernapp, SVG-Fallbacks) */
--color-accent:       #4F46E5  /* Indigo — Fläche mit weißem Text ODER Text auf Weiß (6.3:1) */
--color-accent-dark:  #4338CA  /* Hover (7.9:1 mit Weiß) */
--color-footer-muted: #CBD5E1  /* Sekundärtext auf Ink (12:1) */
```
- **Ein** Akzent. Indigo auf Ink schafft nur 2.8:1 → auf dunklem Grund (Footer) Fokus/Text in Weiß, Indigo dort nur als Fläche (Logo-Quadrat)

### Rahmen & Form
```css
--radius: 0;
--border:      3px solid var(--color-ink);  /* Karten, Buttons, Formular-Panel */
--border-thin: 2px solid var(--color-ink);  /* Inputs, Unterlinien, Menü-Trenner */
--rule-thick:  6px solid var(--color-ink);  /* Header-Unterkante, Abschnittsanfang */
```
- **Keine** Schatten, keine Rundungen, keine translate-/Lift-Effekte. Hover = Farbwechsel (Fläche oder Unterstreichung)
- Trennung über dicke Linien (`--rule-thick`), nicht über Flächenfarben

### Typografie
- Schrift: **Archivo Variable**, self-hosted als woff2 in `src/assets/fonts/` (`fonts.css`, relative Pfade → lädt auch ohne Vite). Breite 62–125 %, Gewicht 100–900. **Kein** Google-Fonts-CDN (DSGVO)
- Fließtext 17px (18px ab 1024px), `line-height: 1.5`, Ziffern `tabular-nums`
- Display (H1–H3): 800, uppercase, `line-height` 0.86–0.95
  - H1 `clamp(64px, 10vw, 148px)`, `font-stretch: 62.5%` — **Hero-H1 ist bewusst kleiner**: `clamp(36px, 11cqi, 88px)`, `.hero-text` ist `container-type: inline-size`. „KI-ENTHUSIAST." ist ~5.65em breit → füllt so nur ~62 % der Spalte, bei jeder Viewport-Breite. Größere Werte liefen über das Porträt. Harte Grenze: `#hero h1 { max-width: 100%; overflow-x: clip }` + `.hero-animate { max-width: 100% }`. Bei neuen/längeren Animationswörtern nachrechnen (cqi-Faktor × Wortbreite in em deutlich < 100 %)
  - H2 `clamp(36px, 5vw, 56px)`, 62.5 % · H3 30–34px, 75 %
- **Label-Stil** `.label`: 13px, 700, `letter-spacing: 0.12em`, uppercase — für Nav, Kopfbalken, Eyebrows, Formular-Labels

### Bausteine (`components.css`)
- **`.panel`** — Karte mit `--border`; darin **`.panel-bar`** (Ink-Balken, weißer Label-Text, links Nummer, rechts `.panel-bar-tags` in footer-muted) und `.panel-body`
- **`.section-head`** — `border-top: --rule-thick`, große Akzent-Ziffer `.section-num` (72px, 62.5 %, `aria-hidden`) + H2. Optional `.section-intro` darunter (max 560px, muted)
- **Buttons** `.btn` — eckig, `min-height: 52px`, `--border`, 15px/800 Label-Stil. `.btn-primary` = Indigo + weißer Text (+ Pfeil-SVG `.btn-arrow`, `stroke-linecap: square`), Hover `--color-accent-dark`. `.btn-outline` = Weiß/Ink, Hover Ink-Fläche
- **`.square-link`** — Link mit 10×10px-Akzent-Quadrat statt Pfeil/Icon (auch `.square-list` für Aufzählungen)
- **`.logo-mark`** — Indigo-Quadrat „F." (Header + Footer)
- **Formular** — sichtbare Labels (`.label`), Inputs `--border-thin`, `min-height: 48px`, 17px Schrift (≥16px gegen iOS-Zoom)
- **Fokus** global `outline: 3px solid var(--color-accent); outline-offset: 2px`; im Footer weiß; Back-to-top färbt sich beim Fokus zusätzlich Indigo (liegt mal auf Weiß, mal auf Ink)

### Seitenaufbau (von oben nach unten)
```
Header       → weiß, sticky, border-bottom --rule-thick
Hero         → 2 Spalten ab 768px: Text | Porträt-Panel (Nº 00)
01 Schwerpunkte (#about)   → 5 Panels (Geografie, Ethik, Digitale Bildung & KI, Digitale Tools, Webapps für Schule & Verwaltung); auto-fit minmax(300px), ab 1024px 6er-Raster → 3 + 2 Karten
02 Projekte (#projects)    → Panels, auto-fit minmax(480px)
03 Kontakt (#contact)      → Text + E-Mail | Formular-Panel
Footer       → volle Breite, Ink
```
- Container: `max-width: 1280px; padding-inline: clamp(16px, 4vw, 56px)` (`.container`, `--gutter`)
- Grid-Abstand überall `--grid-gap: 10px`
- `section[id]` hat `scroll-margin-top`, damit Anker nicht unter dem Sticky-Header landen

---

## Komponenten

### Header / Navigation (`nav.js` + CSS)
- Links Logo (`.logo-mark` + „Florian“), rechts „01 Über mich / 02 Projekte / 03 Kontakt" — Nummern passen zu den Abschnitten, der letzte Link ist eine Ink-Fläche
- `position: sticky; top: 0`. `nav.js` setzt `.nav--scrolled` → nur `padding-block` wird kleiner. **Hysterese** (an ab 40px, aus erst bei `scrollY === 0`), sonst springt der Header am Seitenanfang per Scroll-Anchoring hin und her
- **Fallstrick sticky:** `html`/`body` brauchen `overflow-x: clip` statt `hidden` — `hidden` macht `body` zum Scroll-Container, dann klebt nichts mehr am Viewport
- Mobil (<768px): Chevron-Button (`.nav-hamburger`, ohne Rahmen, 44×44px Klickfläche) togglet `.nav-mobile-open`. Das Menü ist eine weiße Liste in voller Breite direkt unter der dicken Unterkante (`position: absolute; top: calc(100% + 6px)` in `#nav`), Einträge mit 2px-Trennern, `min-height: 56px`. Dahinter einfacher dunkler Backdrop (kein Blur). Escape schließt und fokussiert den Button

### Hero
- Eyebrow (Label, muted) → H1 „Ich bin" + `.hero-animate` (Indigo) → Beschreibung (max 560px) → Buttons „Kontakt aufnehmen →" (primary) + „Projekte ansehen" (outline) → Rollenzeile `.hero-roles` unten mit `--border-thin`-Oberlinie
- Wortanimation: Wörter LEHRER. / BEGLEITER. / BERATER. / ORGANISATOR. / KI-ENTHUSIAST. / DESIGNER. (+ Duplikat für den Loop), 14s, ~0.6s `cubic-bezier(0.76, 0, 0.24, 1)` pro Wechsel, Schritte à 2em (Wort `height: 1em` + `margin-bottom: 1em`). `prefers-reduced-motion` stoppt sie
- Porträt `sketch.png` in `<figure class="panel">` mit Balken nur „Porträt“, `aspect-ratio: 1; object-fit: contain`, `<figcaption>` „Florian Matthias“ mit 3px-Oberlinie
- **Volle Viewport-Höhe:** `#hero { min-height: calc(100svh - var(--nav-h)) }` → Header + Hero füllen immer mindestens einen Viewport (Inhalt vertikal zentriert). `--nav-h` (78px mobil / 86px ab 768px, in `variables.css`) muss zur echten Header-Höhe passen — bei Änderungen an Nav-Padding/Logo-Größe mit anpassen
- Rollenzeile + Pause-Button (`.hero-pause`, `aria-pressed`) — ohne JS oder bei `prefers-reduced-motion` ausgeblendet. Für Screenreader steht in der H1 ein `sr-only`-Satz, die animierte Wortliste ist `aria-hidden`
- **Statisch:** Der Hero-Tilt aus `cursorEffects.js` ist deaktiviert (wird in `main.js` nicht mehr aufgerufen, Datei bleibt liegen)

### Projekte (`projects.js`)
- Fünf Projekte: **TGS Rechner**, **Generatorenwebsite**, **Widgetdock** (Electron-App „cmt" aus `WORKSPACE/Widgetdock`), **Lernapp**, **Website Haartraum** (Friseursalon, Link https://haartraum-pankow.de/, Bild = Desktop-Screenshot 1440×960 @2x → `haartraum-640/1280/1920.webp`)
- `createProjectRow()` erzeugt `.panel.project-card`: Balken „Projekt 0N" | `tags.join(' · ')` → `.project-media` (`aspect-ratio: 3/2`, `object-fit: cover`, `border-bottom: --border`) → H3 + Beschreibung (+ optional `.square-link` „Projekt ansehen", wenn `link` gesetzt)
- **Lernapp = Hochformat-Handy** → `fit: 'contain'` → `.project-media--stage`: `object-fit: contain` auf `--color-subtle`. Quelle: `Mockups/Lernapp.png`, per PIL aufs Gerät zugeschnitten → `lernapp-440/600/732.png`
- `image`-Feld überschreibt das Inline-SVG-Visual (`visual`). Die SVGs sind nur noch Fallback, gezeichnet in der Swiss-Palette (`COLORS` = ink/muted/paper/subtle/accent, eckig, ohne Schatten)
- `sizes: '(min-width: 1100px) 620px, 100vw'`
- `link` leer = kein Link; URL eintragen, sobald vorhanden

### Scroll-Reveal (`reveal.js`)
- Elemente mit `[data-reveal]` faden beim ersten Sichtbarwerden ein (IntersectionObserver)
- Versteckt wird nur bei laufendem JS (`html.js`-Klasse aus `main.js`) — ohne JS bleibt alles sichtbar
- Respektiert `prefers-reduced-motion`; Stagger via `--reveal-delay` (Service-Cards)

### Kontaktformular (`contact.js`)
- Formspree-Integration → **`YOUR_FORM_ID` ersetzen**. Solange der Platzhalter drinsteht, sendet das Formular nicht, sondern verweist auf die E-Mail
- Honeypot-Feld `_gotcha` (unsichtbar, `sr-only` + `aria-hidden`) gegen Spam-Bots — Formspree verwirft Einsendungen, bei denen es ausgefüllt ist
- E-Mail in `index.html` → **`florian@example.com` ersetzen**

### Blog (`content/blog/` → `scripts/blog.js`)
- Ein Beitrag = eine Markdown-Datei mit Frontmatter: `title`, `date` (JJJJ-MM-TT), `description`, `tags` (kommagetrennt), optional `draft: true`
- `draft: true` erscheint nur im Dev-Server (gelbes „Entwurf“), nie im Build. Dateien mit `_` am Anfang werden ignoriert
- Der Generator schreibt bei jedem Start/Build `blog/index.html` + `blog/<slug>/index.html` neu (Markup wie `impressum.html`: Header mit „← Startseite“/„← Alle Beiträge“, `.section-head`, `.legal`, gleicher Footer). Dev-Server lädt bei Änderungen an `.md`-Dateien automatisch neu
- Übersicht: jeder Beitrag ein `.panel` (Balken: Datum · Lesezeit | Tags), ganze Karte klickbar über `h2 a::after`. Beitrag: `.legal.blog-post` + `.prose` (Markdown-Styles in `blog.css`)
- Build erzeugt zusätzlich `dist/feed.xml` (RSS, letzte 20) und `dist/sitemap.xml`; `robots.txt` verweist auf die Sitemap. `npm run build` warnt, solange in Impressum/Datenschutz gelbe Platzhalter stehen
- Nav: „Blog“ ohne Nummer vor „03 Kontakt“ (keine Startseiten-Sektion). Footer-Links „Blog · Impressum · Datenschutz“ auf allen Seiten — Footer steht in jeder HTML-Datei **und** in `scripts/blog.js`, Änderungen an beiden Stellen nachziehen
- Markdown-Parser: `marked` (devDependency, nur beim Build). `<pre>` bekommt `tabindex="0"` (axe: scrollbare Bereiche per Tastatur)
- Beispiel-Entwurf `content/blog/willkommen.md` enthält die Schreibanleitung — vor dem ersten echten Beitrag löschen oder überschreiben

### Back-to-top Button
- Erscheint nach 400px Scroll, 48×48px, eckig, Ink-Fläche, weißer Pfeil, `border: 3px solid #fff` (Kontrast auf dem dunklen Footer), Hover Indigo

### SEO & Social Sharing
- Open-Graph- + Twitter-Meta-Tags in `index.html` (`og:title`, `og:image`, …) — `og:image` zeigt auf `/og-image.jpg` (liegt in `public/`, **nicht** in `src/assets/` — Vite verarbeitet `<meta content>`-Pfade nicht, nur `public/` wird 1:1 in den Build kopiert)
- Domain `https://flomat.uber.space/` steht in `og:url`, `og:image`, `<link rel="canonical">`, JSON-LD `url` und `SITE_URL` in `scripts/blog.js` — bei Domainwechsel alle anpassen
- JSON-LD (`Person`-Schema) im `<head>` für Rich-Snippets
- `public/robots.txt` erlaubt vollständiges Crawling und verweist auf `/sitemap.xml` (wird beim Build erzeugt)

### Barrierefreiheit
- Geprüft (Okt. 2026) mit **axe-core 4.10** (WCAG 2.0/2.1/2.2 A+AA + Best Practices) auf allen drei Seiten bei 375 und 1440px: **0 Verstöße**
- Skip-Link (`.skip-link`) springt zu `<main id="main">` (auf allen Seiten)
- Fokusring Indigo (6.3:1 auf Weiß); im Footer weiß (Indigo auf Ink nur 2.8:1)
- `html { scroll-padding-top }` = Header-Höhe → per Tab fokussierte Elemente und Anker-Ziele landen nie unter dem Sticky-Header (WCAG 2.4.11)
- Hero-Wortanimation: Pause-Schalter (WCAG 2.2.2), `prefers-reduced-motion` stoppt sie, Screenreader lesen einen ganzen Satz statt der Wortliste
- Abschnitts-H2 sichtbar (01/02/03), die großen Ziffern sind `aria-hidden`
- Formular: sichtbare `<label>`s, Hinweis „Alle Felder sind Pflichtfelder“, `autocomplete`, Statusmeldungen per `aria-live`, Datenschutz-Hinweis unter dem Button
- Touch-Ziele ≥ 44px (Nav-Links, Chevron, `.square-link`, Logo, Footer-Links, Pause-Button); Buttons 52px, Menüzeilen 56px
- Kontraste: muted/Weiß 7.6, Weiß/Indigo 6.3, Weiß/Indigo-dark 7.9, footer-muted/Ink 12.0, muted/subtle 6.9
- Escape schließt das mobile Menü; geschlossenes Menü ist per `visibility: hidden` nicht fokussierbar

### Rechtliches (Impressum / Datenschutz)
- Eigene Seiten im gleichen Stil, Header mit „← Startseite“, Footer-Links auf allen Seiten (`.footer-links`, `aria-current="page"` auf der aktiven Seite), `noindex`
- **Kein Cookie-Banner nötig:** keine Cookies, kein Local Storage, kein Tracking, keine Drittanbieter beim Seitenaufruf (Schrift self-hosted). Das steht so in der Datenschutzerklärung — **wenn sich das ändert (Analytics, Embeds, YouTube, Google Fonts, Local Storage …), Datenschutzerklärung anpassen und ggf. Consent-Banner einbauen**
- Gelb markierte Platzhalter `<mark class="todo">` müssen vor Go-Live ersetzt werden (siehe TODOs)
- Texte sind ein sorgfältiger Entwurf, **keine Rechtsberatung**

### Cursor (`cursorEffects.js`)
- Bewusst **Standard-Systemcursor**, kein Custom-Cursor — mehrere Varianten wurden ausprobiert und verworfen. `cursorEffects.js` enthält nur noch den Hero-Tilt und ist seit dem Swiss-Redesign **deaktiviert** (nicht in `main.js` eingebunden)
- Falls ein Custom-Cursor zurückkommen soll: Positions-Tracking über ein äußeres `position:fixed`-Element (`transform: translate(x,y)` bei `mousemove`, kein CSS-Transition darauf — sonst hinkt es der Maus hinterher) + Form/Farbe/Animation in einem Kind-Element, das frei transitionieren darf. Für animierte Formen (z. B. Rotation) geht das nur so, **nicht** über natives `cursor: url()` (Cursor-Bilder sind statisch)

### Responsive Bilder
- Hero-Porträt (`sketch*.webp`) und alle Projekt-Mockups (`rechner-*.webp`, `generator-*.webp`, `dock-*.webp`, `lernapp-*.webp`, `haartraum-*.webp`) haben `srcset`/`sizes`
- **Alle ausgelieferten Bilder sind WebP** (mit PIL erzeugt): Porträt verlustfrei (Strichzeichnung + Transparenz), Mockups `quality=80–85` — ca. ⅔ weniger Bild-Gewicht als die alten JPG/PNG. Neue Bilder ebenfalls als WebP einbinden
- Bilder in JS-Dateien (z. B. `projects.js`) **müssen** als ES-Modul-Imports eingebunden werden (`import x from '../assets/images/x.jpg'`), nicht als reine String-Pfade — sonst kopiert Vite sie beim Build nicht mit und sie 404en in Produktion
- Service-Icons (`Erde.png`, `Philo.png`, `Digital.png`) sind seit dem Swiss-Redesign nicht mehr im Markup, die Dateien liegen aber noch in `assets/images/`
- Letzter Lighthouse-Mobile-Audit (Production-Build via `vite preview`): Performance 92, Accessibility 100, Best Practices 100, SEO 100

---

## Offene TODOs (vor Go-Live)

1. **E-Mail** ersetzen: `florian@example.com` → echte Adresse (in `index.html`, `impressum.html`, `datenschutz.html`)
2. **Anschrift** im Impressum + Datenschutz eintragen (gelbe `<mark class="todo">`-Platzhalter) — Pflichtangabe nach § 5 DDG
3. **Hoster** in `datenschutz.html` (Abschnitt 3) eintragen: Name + Anschrift (Uberspace?) und Speicherdauer der Logfiles, AV-Vertrag abschließen
4. **Formspree** einrichten: `src/components/contact.js` → `YOUR_FORM_ID` ersetzen; in `datenschutz.html` (Abschnitt 4) die Grundlage der US-Übermittlung prüfen und eintragen (DPF-Zertifizierung bzw. Standardvertragsklauseln)
5. **Projekt-Links** in `src/components/projects.js` eintragen (`link`-Feld), sobald die Projekte online sind
6. **`og-image.jpg`** (`public/`) zeigt noch den alten Neobrutalism-Look → neu im Swiss Style erstellen
7. **Blog**: Beispiel-Entwurf `content/blog/willkommen.md` durch ersten echten Beitrag ersetzen
8. Nach dem Ersetzen: `grep -rn 'class="todo"\|example.com\|YOUR_FORM_ID' *.html src` muss leer sein

---

## Wichtige Entscheidungen

- **Kein Cookie-Banner nötig** — kein Analytics, keine Ads, keine externen Fonts via CDN (Archivo ist self-hosted). Sobald Analytics eingebunden wird → Klaro (Open Source) empfohlen oder Matomo (DSGVO-konform ohne Banner)
- **Archivo self-hosted** als woff2 in `src/assets/fonts/` (bewusst kein npm-Paket: ein Bare-Import in CSS funktioniert nur über Vite, auf anderen Servern fiel die Schrift sonst still auf die breitere Ersatzschrift zurück). Niemals per Google-Fonts-Link einbinden
- **Kein Framework**: Bewusste Entscheidung für Vanilla JS — einfacher zu warten, kein Dependency-Risiko
- **Mobile-first CSS**: Alle Styles beginnen mit Mobile, Desktop via `min-width` Media Queries

---

## Playwright-Logs

`.playwright-mcp/` ist in `.gitignore` — Screenshots und Logs werden nicht committed.
