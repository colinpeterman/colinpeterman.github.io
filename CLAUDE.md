# Phantom Photos — Claude Context

Photography portfolio for Colin Peterman. Static site hosted on GitHub Pages at www.colinpeterman.com.

## Key facts

- No build step, no framework — plain HTML/CSS/JS
- Three galleries: home (masonry hero), sports, licensing (password-gated)
- Contact form uses Formspree
- Images are WebP only — JPEGs are converted and deleted by generate-photos.py
- Licensing page has SHA-256 client-side password gate (hash in licensing.html)
- style.css uses CSS custom properties (--font-disp, --font-cond, --nav-h, --bg-dark, etc.)
- contact-modal.js is shared across all pages — injects modal HTML at runtime

## Adding photos workflow

```bash
# Drop images into images/sports/, images/licensing/, or images/main/
python3 generate-photos.py   # converts to WebP, updates JSON manifests
git add . && git commit -m "add photos" && git push
```

## Style conventions

- Font variables: `--font-disp` (display/headers), `--font-cond` (Barlow Condensed, UI)
- Dark background: `--bg-dark`
- Nav height: `--nav-h`
- Gallery pages use class `gallery-page` on body; home uses `hero-page`
- All pages share the same nav structure and contact-modal.js

## DNS / hosting

- Hosted: GitHub Pages, public repo required (free plan)
- Custom domain: www.colinpeterman.com (set in GitHub Pages settings + CNAME file)
- DNS managed in Squarespace
