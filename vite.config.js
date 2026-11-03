import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { navHtml, footerHtml, backToTopHtml } from './scripts/partials.js'
import { writeBlog, rssXml, sitemapXml, CONTENT_DIR } from './scripts/blog.js'

// Setzt Nav/Footer/Back-to-top in jede HTML-Seite ein (eine Quelle für alle Seiten)
function partials() {
  return {
    name: 'partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace(/<!-- @nav(?::(\w+))? -->/, (_, current) => navHtml(current))
          .replace('<!-- @footer -->', footerHtml())
          .replace('<!-- @backtotop -->', backToTopHtml())
      }
    }
  }
}

// Erzeugt die Blog-Seiten aus content/blog/*.md, dazu feed.xml + sitemap.xml
function blog() {
  let posts = []
  return {
    name: 'blog',
    config(_, { command }) {
      // Entwürfe (draft: true) nur lokal im Dev-Server zeigen, nie im Build
      posts = writeBlog({ includeDrafts: command === 'serve' })
      return {
        build: {
          rollupOptions: {
            input: {
              main: path.resolve('index.html'),
              impressum: path.resolve('impressum.html'),
              datenschutz: path.resolve('datenschutz.html'),
              blog: path.resolve('blog/index.html'),
              ...Object.fromEntries(posts.map(p => [`blog-${p.slug}`, path.resolve(`blog/${p.slug}/index.html`)]))
            }
          }
        }
      }
    },
    configureServer(server) {
      server.watcher.add(CONTENT_DIR)
      const rebuild = file => {
        if (!file.startsWith(CONTENT_DIR)) return
        try {
          writeBlog({ includeDrafts: true })
          server.ws.send({ type: 'full-reload' })
        } catch (err) {
          server.config.logger.error(`[blog] ${err.message}`)
        }
      }
      server.watcher.on('add', rebuild).on('change', rebuild).on('unlink', rebuild)
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'feed.xml', source: rssXml(posts) })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(posts) })
      // Warnung, solange Platzhalter (<mark class="todo">) in Impressum/Datenschutz stehen
      for (const name of ['impressum.html', 'datenschutz.html']) {
        if (fs.readFileSync(name, 'utf8').includes('class="todo"')) {
          this.warn(`${name} enthält noch Platzhalter [ … ] — vor dem Veröffentlichen ausfüllen!`)
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [partials(), blog()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
