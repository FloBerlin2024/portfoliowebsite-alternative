// Blog-Generator: liest content/blog/*.md und schreibt daraus echte HTML-Seiten
// nach blog/ (wird nicht committet, siehe .gitignore). Vite behandelt sie dann
// wie jede andere Seite (CSS/JS werden gebündelt, Pfade gehasht).
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

function head({ title, description, url, type = 'website' }) {
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#2A2A2A">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23FF9019'/%3E%3Ctext x='16' y='23' text-anchor='middle' font-family='sans-serif' font-size='19' font-weight='900' fill='%232A2A2A'%3EF.%3C/text%3E%3C/svg%3E">
  <link rel="canonical" href="${SITE_URL}${url}">
  <link rel="alternate" type="application/rss+xml" title="Blog von Florian Matthias" href="/feed.xml">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="Florian Matthias">
  <meta property="og:url" content="${SITE_URL}${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${SITE_URL}/og-image.jpg">
  <meta property="og:locale" content="de_DE">
  <meta name="twitter:card" content="summary_large_image">
  <title>${esc(title)}</title>
  <link rel="stylesheet" href="/src/styles/main.css">`
}

function page({ headHtml, body }) {
  return `<!DOCTYPE html>
<!-- AUTOMATISCH ERZEUGT aus content/blog/ — Änderungen hier gehen verloren. -->
<html lang="de">
<head>
  ${headHtml}
</head>
<body>
  <a href="#main" class="skip-link">Zum Inhalt springen</a>
  <!-- @nav:blog -->
  <main class="page-cards" id="main">
${body}
  <!-- @footer -->
  </main>
  <!-- @backtotop -->
  <script type="module" src="/src/page.js"></script>
</body>
</html>
`
}

function meta(post) {
  const draft = post.draft ? '<span class="blog-draft">Entwurf</span>' : ''
  return `<time datetime="${post.isoDate}">${dateFmt.format(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>${post.readingMinutes} Min. Lesezeit</span>${draft}`
}

const tagList = tags => tags.length
  ? `<div class="project-tags">${tags.map(t => `<span class="project-tag">${esc(t)}</span>`).join('')}</div>`
  : ''

function indexPage(posts) {
  const list = posts.length
    ? `<ol class="blog-list" role="list">
${posts.map(p => `      <li class="blog-card" data-reveal>
        <p class="blog-meta">${meta(p)}</p>
        <h2><a href="/blog/${p.slug}/">${esc(p.title)}</a></h2>
        ${p.description ? `<p class="blog-card-desc">${esc(p.description)}</p>` : ''}
        ${tagList(p.tags)}
      </li>`).join('\n')}
    </ol>`
    : `<p class="blog-empty">Hier erscheinen bald die ersten Beiträge — unregelmäßig, aber mit Herz.</p>`

  return page({
    headHtml: head({
      title: 'Blog — Florian Matthias',
      description: 'Gedanken aus dem Schulalltag: Geografie, Ethik, digitale Bildung und eigene Web-Projekte.',
      url: '/blog/'
    }),
    body: `  <div class="section-card-wrap">
    <header class="page-header">
      <p class="section-eyebrow">Blog</p>
      <h1>Notizen aus dem Klassenzimmer.</h1>
      <p class="page-header-desc">Unregelmäßige Gedanken zu Geografie, Ethik, digitaler Bildung und den Tools, die ich nebenbei baue.
        <a href="/feed.xml" class="page-header-feed">RSS-Feed abonnieren</a></p>
    </header>
  </div>
  <div class="section-card-wrap">
    <div class="page-body">
    ${list}
    </div>
  </div>`
  })
}

function postPage(post) {
  return page({
    headHtml: head({
      title: `${post.title} — Florian Matthias`,
      description: post.description || post.title,
      url: `/blog/${post.slug}/`,
      type: 'article'
    }) + `
  <meta property="article:published_time" content="${post.isoDate}">`,
    body: `  <div class="section-card-wrap">
    <header class="page-header">
      <a href="/blog/" class="page-back">← Alle Beiträge</a>
      <p class="blog-meta">${meta(post)}</p>
      <h1>${esc(post.title)}</h1>
      ${post.description ? `<p class="page-header-desc">${esc(post.description)}</p>` : ''}
      ${tagList(post.tags)}
    </header>
  </div>
  <div class="section-card-wrap">
    <article class="page-body prose">
${post.html}
      <p class="prose-end"><a href="/blog/" class="btn btn-outline">← Alle Beiträge</a></p>
    </article>
  </div>`
  })
}

// Schreibt blog/index.html + blog/<slug>/index.html, gibt die Liste der Seiten zurück
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
  const urls = ['/', '/blog/', ...posts.map(p => `/blog/${p.slug}/`), '/impressum.html', '/datenschutz.html']
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}
</urlset>
`
}
