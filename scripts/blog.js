// Blog-Generator: liest content/blog/*.md und schreibt daraus echte HTML-Seiten
// nach blog/ (wird nicht committet, siehe .gitignore). Vite behandelt sie dann
// wie jede andere Seite (CSS gebündelt, Pfade gehasht).
//
// Beitrag anlegen: neue Datei content/blog/mein-thema.md — der Dateiname wird
// zur URL (/blog/mein-thema/). Kopf der Datei (Frontmatter):
//   ---
//   title: Mein Titel
//   date: 2026-11-03
//   description: Ein Satz für Übersicht, Google und Link-Vorschau.
//   tags: Geografie, Unterricht
//   draft: true          ← optional: nur lokal sichtbar, nicht im Build
//   ---

import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'

export const SITE_URL = 'https://flomat.uber.space'
export const CONTENT_DIR = path.resolve('content/blog')
export const OUT_DIR = path.resolve('blog')

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const dateFmt = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })

function parseFrontmatter(raw, file) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) throw new Error(`${file}: Frontmatter (--- … ---) fehlt am Dateianfang`)
  const data = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (kv) data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return { data, body: m[2] }
}

export function loadPosts({ includeDrafts = false } = {}) {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .map(file => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8')
      const { data, body } = parseFrontmatter(raw, file)
      if (!data.title || !data.date) throw new Error(`${file}: "title" und "date" sind Pflicht`)
      const date = new Date(data.date + 'T12:00:00')
      if (isNaN(date)) throw new Error(`${file}: Datum bitte als JJJJ-MM-TT angeben`)
      const words = body.split(/\s+/).filter(Boolean).length
      return {
        slug: file.replace(/\.md$/, ''),
        title: data.title,
        description: data.description || '',
        tags: (data.tags || '').replace(/^\[|\]$/g, '').split(',').map(t => t.trim()).filter(Boolean),
        draft: data.draft === 'true',
        date,
        isoDate: data.date,
        readingMinutes: Math.max(1, Math.round(words / 200)),
        // tabindex: breite Code-Blöcke per Tastatur scrollbar (Barrierefreiheit)
        html: marked.parse(body).replace(/<pre>/g, '<pre tabindex="0">')
      }
    })
    .filter(p => includeDrafts || !p.draft)
    .sort((a, b) => b.date - a.date)
}

// ── Bausteine im Swiss Style (gleiches Markup wie impressum.html) ─────────

const ICON = `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%234F46E5'/%3E%3Ctext x='16' y='23' text-anchor='middle' font-family='Arial,sans-serif' font-size='19' font-weight='800' fill='%23FFFFFF'%3EF.%3C/text%3E%3C/svg%3E">`

function head({ title, description, url, type = 'website', extra = '' }) {
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#0F172A">
  ${ICON}
  <link rel="canonical" href="${SITE_URL}${url}">
  <link rel="alternate" type="application/rss+xml" title="Blog von Florian Matthias" href="/feed.xml">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="Florian Matthias">
  <meta property="og:url" content="${SITE_URL}${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${SITE_URL}/og-image.jpg">
  <meta property="og:locale" content="de_DE">
  <meta name="twitter:card" content="summary_large_image">${extra}
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="/src/styles/main.css">`
}

const ARROW_LEFT = '<svg class="btn-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M17 10H4M9 4.5L3.5 10 9 15.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"/></svg>'

function header({ backHref, backLabel }) {
  return `<nav id="nav" aria-label="Hauptnavigation">
    <div class="nav-inner">
      <a href="/" class="nav-logo">
        <span class="logo-mark" aria-hidden="true">F.</span>
        <span class="nav-logo-text label">Florian</span>
      </a>
      <a href="${backHref}" class="nav-back label">
        ${ARROW_LEFT}
        ${backLabel}
      </a>
    </div>
  </nav>`
}

function footer(current) {
  const aria = key => key === current ? ' aria-current="page"' : ''
  return `<footer>
    <div class="container footer-inner">
      <a href="/" class="footer-logo">
        <span class="logo-mark" aria-hidden="true">F.</span>
        <span class="label">Florian Matthias · Geografie &amp; Ethik</span>
      </a>
      <nav class="footer-links label" aria-label="Weitere Seiten">
        <a href="/blog/"${aria('blog')}>Blog</a>
        <a href="/impressum.html">Impressum</a>
        <a href="/datenschutz.html">Datenschutz</a>
      </nav>
      <span class="footer-right label">&copy; ${new Date().getFullYear()} · Brandenburg</span>
    </div>
  </footer>`
}

function page({ headHtml, nav, body, current }) {
  return `<!DOCTYPE html>
<!-- AUTOMATISCH ERZEUGT aus content/blog/ — Änderungen hier gehen verloren. -->
<html lang="de">
<head>
  ${headHtml}
</head>
<body>

  <a href="#main" class="skip-link">Zum Inhalt springen</a>

  ${nav}

  <main id="main" class="section">
${body}
  </main>

  ${footer(current)}

</body>
</html>
`
}

function meta(post) {
  const draft = post.draft ? ' · <span class="blog-draft">Entwurf</span>' : ''
  return `<time datetime="${post.isoDate}">${dateFmt.format(post.date)}</time> · ${post.readingMinutes} Min. Lesezeit${draft}`
}

function indexPage(posts) {
  const list = posts.length
    ? `<ol class="blog-list" role="list">
${posts.map(p => `        <li class="panel blog-card">
          <div class="panel-bar label">
            <span>${meta(p)}</span>
            ${p.tags.length ? `<span class="panel-bar-tags">${p.tags.map(esc).join(' · ')}</span>` : ''}
          </div>
          <div class="panel-body">
            <h2><a href="/blog/${p.slug}/">${esc(p.title)}</a></h2>
            ${p.description ? `<p>${esc(p.description)}</p>` : ''}
            <span class="square-link label" aria-hidden="true">Weiterlesen</span>
          </div>
        </li>`).join('\n')}
      </ol>`
    : `<p class="blog-empty">Hier erscheinen bald die ersten Beiträge — unregelmäßig, aber mit Herz.</p>`

  return page({
    current: 'blog',
    headHtml: head({
      title: 'Blog · Florian',
      description: 'Gedanken aus dem Schulalltag: Geografie, Ethik, digitale Bildung und eigene Web-Projekte.',
      url: '/blog/'
    }),
    nav: header({ backHref: '/', backLabel: 'Startseite' }),
    body: `    <div class="container blog">
      <header class="section-head">
        <h1>Blog</h1>
      </header>
      <p class="section-intro">Unregelmäßige Notizen aus dem Klassenzimmer — Geografie, Ethik, digitale Bildung und die Tools, die ich nebenbei baue. <a href="/feed.xml" class="blog-feed">RSS-Feed abonnieren</a></p>
      ${list}
    </div>`
  })
}

function postPage(post) {
  return page({
    current: 'blog',
    headHtml: head({
      title: `${post.title} · Florian`,
      description: post.description || post.title,
      url: `/blog/${post.slug}/`,
      type: 'article',
      extra: `\n  <meta property="article:published_time" content="${post.isoDate}">`
    }),
    nav: header({ backHref: '/blog/', backLabel: 'Alle Beiträge' }),
    body: `    <article class="container legal blog-post">
      <header class="section-head blog-post-head">
        <p class="label blog-meta">${meta(post)}</p>
        <h1>${esc(post.title)}</h1>
        ${post.description ? `<p class="legal-lead">${esc(post.description)}</p>` : ''}
        ${post.tags.length ? `<p class="label blog-tags">${post.tags.map(esc).join(' · ')}</p>` : ''}
      </header>
      <div class="prose">
${post.html}
      </div>
      <p class="blog-back"><a href="/blog/" class="square-link label">Alle Beiträge</a></p>
    </article>`
  })
}

// Schreibt blog/index.html + blog/<slug>/index.html, gibt die Beiträge zurück
export function writeBlog({ includeDrafts = false } = {}) {
  const posts = loadPosts({ includeDrafts })
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), indexPage(posts))
  for (const post of posts) {
    fs.mkdirSync(path.join(OUT_DIR, post.slug), { recursive: true })
    fs.writeFileSync(path.join(OUT_DIR, post.slug, 'index.html'), postPage(post))
  }
  return posts
}

export function rssXml(posts) {
  const items = posts.slice(0, 20).map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}/</link>
      <guid>${SITE_URL}/blog/${p.slug}/</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog von Florian Matthias</title>
    <link>${SITE_URL}/blog/</link>
    <description>Gedanken aus dem Schulalltag: Geografie, Ethik, digitale Bildung.</description>
    <language>de-DE</language>
${items}
  </channel>
</rss>
`
}

export function sitemapXml(posts) {
  const urls = ['/', '/blog/', ...posts.map(p => `/blog/${p.slug}/`)]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}
</urlset>
`
}
