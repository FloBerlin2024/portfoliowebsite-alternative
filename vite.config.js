import { defineConfig } from 'vite'
import fs from 'node:fs'
import { resolve } from 'node:path'
import { writeBlog, rssXml, sitemapXml, CONTENT_DIR } from './scripts/blog.js'

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
              main: resolve(__dirname, 'index.html'),
              impressum: resolve(__dirname, 'impressum.html'),
              datenschutz: resolve(__dirname, 'datenschutz.html'),
              blog: resolve(__dirname, 'blog/index.html'),
              ...Object.fromEntries(posts.map(p => [`blog-${p.slug}`, resolve(__dirname, `blog/${p.slug}/index.html`)]))
            }
          }
        }
      }
    },
    configureServer(server) {
      // Dev-Server: Beiträge bei jeder Änderung neu erzeugen und Seite neu laden
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
      // Warnung, solange Platzhalter (<mark class="todo">) in den Rechtstexten stehen
      for (const name of ['impressum.html', 'datenschutz.html']) {
        if (fs.readFileSync(resolve(__dirname, name), 'utf8').includes('class="todo"')) {
          this.warn(`${name} enthält noch gelbe Platzhalter — vor dem Veröffentlichen ausfüllen!`)
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [blog()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
