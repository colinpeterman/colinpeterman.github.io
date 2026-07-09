# Phantom Photos — Claude Context

Photography portfolio for Colin Peterman. Static site hosted on GitHub Pages at www.colinpeterman.com.

## Key facts

- No build step, no framework — plain HTML/CSS/JS
- Three galleries: home (masonry hero), sports, licensing (password-gated)
- Contact form uses Formspree
- Images are WebP only — JPEGs are converted and deleted by generate-photos.py
- Licensing page has SHA-256 client-side password gate (hash in licensing.html)
- style.css uses CSS custom properties (--font-disp, --font-cond, --nav-h, --bg-dark, etc.)
- Shared JS injected at runtime: site-chrome.js (nav + footer, owns toggleNav/closeNav),
  contact-modal.js (contact modal + Formspree, includes _gotcha honeypot),
  gallery.js (row-based lazy loader used by sports + licensing)
- Pages place `<div data-site-nav></div>` / `<div data-site-footer></div>` placeholders
- Sports gallery is intentionally view-only (no lightbox); licensing has the lightbox + inquiry cart
- When editing style.css, bump the `?v=NN` cache-buster on every page's stylesheet link

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
- All pages share nav/footer via site-chrome.js and the modal via contact-modal.js

## DNS / hosting

- Hosted: GitHub Pages, public repo required (free plan)
- Custom domain: www.colinpeterman.com (set in GitHub Pages settings + CNAME file)
- DNS managed in Squarespace

