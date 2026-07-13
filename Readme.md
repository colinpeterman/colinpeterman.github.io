# Phantom Photos — colinpeterman.com

Personal photography portfolio for Colin Peterman. Hosted on GitHub Pages at [colinpeterman.com](https://www.colinpeterman.com).

---

## Stack

- Static HTML/CSS/JS — no framework, no build step
- GitHub Pages for hosting
- Formspree for contact form submissions
- Images served as WebP for performance

---

## File Structure

```
├── index.html              ← Home page (masonry hero, hidden game easter egg)
├── about.html              ← Bio, services, client logos
├── sports.html             ← Sports gallery (view-only, no lightbox)
├── licensing.html          ← Password-gated licensing gallery with inquiry cart
├── pay.html                ← Stripe payment link page (noindex)
├── game.html               ← "Phantom Fly" easter egg (opens from home logo)
├── contact.html            ← Redirects to index (modal handles contact)
├── 404.html                ← Custom 404 page
├── admin.html              ← Owner-only: create client deliveries, upload photos/videos
├── download.html           ← Client-facing: download their delivered photos/videos
├── style.css               ← All global styles
├── site-chrome.js          ← Shared nav + footer, injected at runtime
├── contact-modal.js        ← Shared contact modal + Formspree submission
├── gallery.js              ← Shared row-based lazy loader for gallery pages
├── delivery.js             ← Shared helper for admin.html/download.html (talks to the delivery Worker)
├── generate-photos.py      ← Run after adding photos — converts to WebP, updates JSON
├── CNAME                   ← Custom domain config for GitHub Pages
├── robots.txt              ← Blocks AI crawlers, protects licensing images
├── sitemap.xml             ← SEO sitemap
├── data/
│   ├── main.json           ← Home hero photo list (auto-generated)
│   ├── sports.json         ← Sports gallery photo list (auto-generated)
│   └── licensing.json      ← Licensing gallery photo list (auto-generated)
└── images/
    ├── favicon/            ← Favicons
    ├── og-image.jpg        ← Social share preview (1200×630)
    ├── main/               ← Home page hero photos
    ├── about/              ← About page photo
    ├── checkout/           ← Pay page background
    ├── clients/            ← Client logos for the About page
    ├── sports/             ← Sports gallery photos
    ├── sports_thumbs/      ← Auto-generated sports thumbnails
    ├── licensing/          ← Licensing gallery photos (blocked in robots.txt)
    ├── licensing_thumbs/   ← Auto-generated licensing thumbnails
    └── licensing_lock/     ← Background for the licensing password gate
```

---

## Adding Photos

1. Drop photos into the appropriate `images/` subfolder (`main/`, `sports/`, or `licensing/`)
2. Run from the project root:
   ```
   python3 generate-photos.py
   ```
   This converts all JPEGs to WebP, deletes the originals, and updates the JSON manifests.
3. Commit and push — galleries update automatically.

Requires Pillow: `pip install Pillow`

---

## Ongoing Workflow

```bash
# After adding new photos:
python3 generate-photos.py
git add .
git commit -m "add new photos"
git push
```

---

## Licensing Password

The licensing page uses client-side SHA-256 password hashing. To change the password:

1. Generate a SHA-256 hash of your new password (e.g. at [emn178.github.io/online-tools/sha256.html](https://emn178.github.io/online-tools/sha256.html))
2. In `licensing.html`, replace the `HASH` constant near the top of the `<script>`:
   ```javascript
   const HASH = 'your_new_hash_here';
   ```

Note: This is a soft gate — sufficient for casual protection, not server-side security.

---

## Client Photo Delivery

Self-hosted WeTransfer replacement for delivering full-res client photos/videos:

- `admin.html` — key-gated, creates a delivery and uploads files directly to Cloudflare R2. Also lists all active deliveries with Copy Link / Revoke buttons, so you can see what links are currently out there and kill one early if needed.
- `download.html` — the link you send clients (`download.html?t=<token>`); lets them download files individually or as a zip
- Backend is a separate project, `phantom-delivery-worker` (Cloudflare Worker + R2 + D1), deployed independently via `wrangler deploy` — not part of this repo or GitHub Pages
- Deliveries and their files auto-expire on a schedule (both the link and the underlying storage) so nothing lingers indefinitely, or you can revoke a link manually anytime from the Active Deliveries list

See that project's own README for setup/deploy details.

---

## DNS (Squarespace)

| Type  | Name | Value                    |
|-------|------|--------------------------|
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |
| CNAME | www  | colinpeterman.github.io  |

GitHub Pages custom domain is set to `www.colinpeterman.com` with Enforce HTTPS enabled.
