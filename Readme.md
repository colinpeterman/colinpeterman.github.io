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
├── index.html              ← Home page (masonry hero)
├── sports.html             ← Sports gallery
├── licensing.html          ← Password-gated licensing gallery
├── contact.html            ← Redirects to index (modal handles contact)
├── 404.html                ← Custom 404 page
├── style.css               ← All global styles
├── contact-modal.js        ← Shared contact modal + Formspree submission
├── generate-photos.py      ← Run after adding photos — converts to WebP, updates JSON
├── CNAME                   ← Custom domain config for GitHub Pages
├── robots.txt              ← Blocks AI crawlers, protects licensing images
├── sitemap.xml             ← SEO sitemap
├── data/
│   ├── main.json           ← Home hero photo list (auto-generated)
│   ├── sports.json         ← Sports gallery photo list (auto-generated)
│   └── licensing.json      ← Licensing gallery photo list (auto-generated)
└── images/
    ├── favicon/            ← Favicon image
    ├── main/               ← Home page hero photos
    ├── sports/             ← Sports gallery photos
    ├── licensing/          ← Licensing gallery photos (blocked in robots.txt)
    └── licensing_lock/     ← Lock icon for licensing gate
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

## DNS (Squarespace)

| Type  | Name | Value                    |
|-------|------|--------------------------|
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |
| CNAME | www  | colinpeterman.github.io  |

GitHub Pages custom domain is set to `www.colinpeterman.com` with Enforce HTTPS enabled.
