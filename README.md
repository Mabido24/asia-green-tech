# Asia Green Tech

Static Jamstack website for **Asia Green Technology** — built for Laragon local development and Cloudflare Pages deployment.

## Stack

- Static HTML (AI/LLM scraper friendly)
- Tailwind CSS v4 (browser CDN)
- Custom light / dark theme
- Client-side i18n (9 languages, Arabic RTL)

## Project structure

```text
/
├── index.html          # Homepage
├── css/styles.css      # Brand theme & motion
├── js/
│   ├── i18n.js         # Translation engine (t / data-i18n)
│   ├── theme.js        # Light / dark mode
│   └── main.js         # Bootstrap
├── locales/            # en fr de it es pt ru ar hi
├── _headers            # Cloudflare security headers
└── README.md
```

## Local development (Laragon)

1. Ensure this folder is under Laragon’s `www` directory.
2. Start Laragon (Apache / Nginx).
3. Open: `http://asia-green-tech.test/`  
   or the equivalent virtual host / path for your machine.

Because locales load via `fetch()`, serve the site over HTTP (Laragon) — do not open `index.html` as a `file://` URL.

## i18n usage

**In HTML** (preferred for static markup):

```html
<h1 data-i18n="home.title"></h1>
```

**In JavaScript**:

```js
t("home.title");
// or
window.AGT_I18N.t("home.title");
```

Supported locales: `en` (default), `fr`, `de`, `it`, `es`, `pt`, `ru`, `ar` (RTL), `hi`.

Whenever you add UI text, update **all** JSON files in `locales/`.

## Theme

- Toggle button in the header
- Preference stored in `localStorage` (`agt-theme`)
- Respects `prefers-color-scheme` until the user chooses manually

## Cloudflare Pages

| Setting        | Value        |
|----------------|--------------|
| Build command  | *(none)*     |
| Output directory | `/` (root) |
| Framework preset | None      |

Deploy from the GitHub repository root. No build step is required.

## License

Proprietary — Asia Green Technology.
