---
title: Willkommen im Blog
date: 2026-11-03
description: Warum es diesen Blog gibt und was dich hier erwartet.
tags: Allgemein
draft: true
---

Dies ist ein **Beispiel-Beitrag**. Er steht auf `draft: true` und erscheint deshalb nur lokal (`npm run dev`), nicht auf der veröffentlichten Seite. Zum Veröffentlichen die Zeile `draft: true` löschen — oder die Datei einfach durch einen eigenen Beitrag ersetzen.

## So schreibst du einen Beitrag

1. Neue Datei in `content/blog/` anlegen, z. B. `vulkane-im-unterricht.md`. Der Dateiname wird zur Adresse: `/blog/vulkane-im-unterricht/`.
2. Oben den Kopf mit `title`, `date`, `description` und `tags` ausfüllen (siehe diese Datei).
3. Darunter ganz normal schreiben. Überschriften mit `##`, Listen mit `-`, Links mit `[Text](https://…)`.
4. `npm run build` — fertig. Übersicht, RSS-Feed und Sitemap aktualisieren sich automatisch.

## Bilder

Bilder (am besten als `.webp`, max. ca. 1400 px breit) in `public/blog-bilder/` legen und so einbinden:

```
![Beschreibung für Screenreader](/blog-bilder/mein-bild.webp)
```

> Tipp: Die Beschreibung in den eckigen Klammern ist wichtig für Barrierefreiheit — kurz sagen, was auf dem Bild zu sehen ist.
