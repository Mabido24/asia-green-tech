# Asia Green Tech

Static Jamstack website for **Asia Green Tech** — Laragon local development and Cloudflare Pages deployment.

## What the company does

1. **Business connections (B2B)** — introduce companies to investors, production sites and suppliers  
2. **Digital marketing** — website redesign and online visibility (Google search + AI assistants / AI search), explained in plain language  
3. **Portfolio** — past work (fill with real projects; no invented case studies)

## Stack

- Static HTML
- Tailwind CSS v4 (browser CDN)
- Light / dark theme
- Client-side i18n (9 languages, Arabic RTL)

## Local URL

- **http://asia-green-tech.test/**
- Fallback: **http://localhost/Asia%20Green%20Tech/**

Serve over HTTP (Laragon). Do not open as `file://`.

## i18n

HTML: `data-i18n="home.title"`  
JS: `t('home.title')`  

Locales: `en` `fr` `de` `it` `es` `pt` `ru` `ar` `hi` — update **all** JSON files when adding UI text.

## Cloudflare Pages

| Setting | Value |
|---------|--------|
| Build command | *(none)* |
| Output directory | `/` (root) |
