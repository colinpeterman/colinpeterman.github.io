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

## Client photo delivery (admin.html / download.html)

- Self-hosted WeTransfer replacement: `admin.html` (owner-only, key-gated) uploads a client's
  photos/videos to Cloudflare R2 via presigned URLs and generates a unique `download.html?t=<token>`
  link; `download.html` lets the client download files individually or as a streamed "Download All (.zip)".
- Backend lives in a **separate** sibling project, `../phantom-delivery-worker/` — its own git repo,
  deployed independently via `wrangler deploy` (not part of this GitHub Pages repo/build).
  Stack: Cloudflare Workers + R2 (storage) + D1 (delivery metadata: token, expiry, file list).
  Presigned uploads use `aws4fetch`; zip streaming uses `client-zip`.
- Both R2 objects and their D1 records expire on a time basis — a daily Worker cron sweep deletes
  expired objects from R2 so storage cost doesn't accumulate (not just link deactivation).
- `delivery.js` holds the shared `WORKER_BASE_URL` + fetch helpers for both pages — update the
  production Worker URL there once `wrangler deploy` has run.
- `admin.html`'s "password" gate is not a client-side hash like licensing.html's — the key is sent
  as a Bearer token to the Worker on every admin request and checked server-side, since this gate
  protects destructive actions (uploads), not just view access.
- See `../phantom-delivery-worker/README.md` (or its CLAUDE.md) for Worker setup/deploy details.

