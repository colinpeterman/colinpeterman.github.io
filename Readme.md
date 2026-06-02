# Phantom Photos — GitHub Pages Setup Guide

Complete instructions for getting your site live at colinpeterman.com.

---

## File Structure

```
phantom-photos/
├── index.html            ← Home page
├── sports.html           ← Sports gallery
├── licensing.html        ← Licensing gallery (password protected)
├── contact.html          ← Contact form + social links
├── style.css             ← All styling
├── generate-photos.py    ← Run this to update galleries after adding photos
├── data/
│   ├── sports.json       ← List of sports photo filenames (auto-generated)
│   └── licensing.json    ← List of licensing photo filenames (auto-generated)
└── images/
    ├── hero.jpg          ← Home page hero (you add this)
    ├── home-sports.jpg   ← Sports section preview (you add this)
    ├── home-licensing.jpg← Licensing section preview (you add this)
    ├── contact-bg.jpg    ← Contact page background (you add this)
    ├── sports/           ← Dump all sports photos here
    └── licensing/        ← Dump all licensing photos here
```

---

## Step 1 — Set Up GitHub (5 minutes, one-time)

1. Go to **https://github.com** and create a free account (if you don't have one).
2. Click the **+** icon (top right) → **New repository**.
3. Name it exactly: `colinpeterman.github.io`
   - This special name tells GitHub to host it as your website.
4. Set it to **Public**.
5. Click **Create repository**.

---

## Step 2 — Upload Your Files

**Option A — GitHub's web interface (easiest, no coding required):**

1. Open your new repository on GitHub.
2. Click **Add file** → **Upload files**.
3. Drag and drop ALL the files from this folder.
4. For the `images/` and `data/` folders — click inside each folder then upload files into them.
5. Click **Commit changes**.

**Option B — GitHub Desktop app (easier for ongoing updates):**

1. Download GitHub Desktop at **https://desktop.github.com**.
2. Sign in, clone your repository to your computer.
3. Copy all the project files into the cloned folder.
4. In GitHub Desktop, click **Commit to main** then **Push origin**.

---

## Step 3 — Enable GitHub Pages

1. In your repository on GitHub, click **Settings** (top tab).
2. In the left sidebar, click **Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Set branch to **main** and folder to **/ (root)**.
5. Click **Save**.

Your site will be live at `https://colinpeterman.github.io` within 1-2 minutes.

---

## Step 4 — Connect Your Squarespace Domain

Since you're keeping your domain at Squarespace:

1. Log into your **Squarespace account** → **Domains**.
2. Click on **colinpeterman.com** → **DNS Settings**.
3. Delete any existing **CNAME** record for `www`.
4. Add a new **CNAME** record:
   - Host: `www`
   - Points to: `colinpeterman.github.io`
5. For the root domain (`@`), add these **A records** (one for each IP):
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
6. Back in GitHub → Settings → Pages, enter `www.colinpeterman.com` in the **Custom domain** field.
7. Check **Enforce HTTPS** (free SSL, takes ~24 hours to activate).

DNS changes can take up to 48 hours but usually work within a few hours.

---

## Step 5 — Add Your Photos

### Adding photos to galleries:

1. Put your sports photos in the `images/sports/` folder.
2. Put your licensing photos in the `images/licensing/` folder.
3. Open Terminal (Mac) or Command Prompt (Windows), navigate to the project folder, and run:
   ```
   python3 generate-photos.py
   ```
   This updates `data/sports.json` and `data/licensing.json` automatically.
4. Upload the updated files to GitHub.

### If you don't want to use Python:
Manually edit `data/sports.json` — it's just a list of filenames:
```json
[
  "Photo1.jpg",
  "Photo2.jpg",
  "Photo3.jpg"
]
```

---

## Step 6 — Swap in Your Real Images

Replace the placeholder backgrounds with real photos by editing `index.html` and `contact.html`.

In `index.html`, find each `<!-- HERO IMAGE SETUP -->` comment and follow the instructions there.

### Hero image (home page):
```html
<!-- Replace this: -->
<div style="width:100%;height:100%;background:linear-gradient(...)"></div>

<!-- With this: -->
<img src="images/hero.jpg" alt="Colin Peterman Photography" />
```

Same pattern for `home-sports.jpg`, `home-licensing.jpg`, and `contact-bg.jpg`.

---

## Step 7 — Set Up Contact Form (2 minutes)

The contact form uses **Formspree** — free, no backend needed.

1. Go to **https://formspree.io** and sign up with your Gmail.
2. Click **New Form**, give it a name.
3. Copy your form ID (looks like `xabc1234`).
4. In `contact.html`, find this line:
   ```html
   action="https://formspree.io/f/YOUR_FORMSPREE_ID"
   ```
5. Replace `YOUR_FORMSPREE_ID` with your actual ID.
6. Submissions will be emailed to `colinpeterman@gmail.com` automatically.

---

## Step 8 — Change the Licensing Password

In `licensing.html`, find this line near the top of the `<script>`:
```javascript
const CORRECT_PASSWORD = 'phantom2024';
```
Change `phantom2024` to whatever you want.

> **Note:** This is client-side password protection — it's fine for keeping casual visitors out, but a determined person could view source and find the password. For stronger protection you'd need server-side auth (which GitHub Pages doesn't support). For licensing use-cases this level is typically fine.

---

## Ongoing Workflow (Adding New Photos)

1. Copy new photos into `images/sports/` or `images/licensing/`.
2. Run `python3 generate-photos.py` from the project folder.
3. Upload the new photos + updated JSON files to GitHub.
4. Done — galleries update automatically.

---

## Troubleshooting

**Site not showing up:** Wait 5 minutes after enabling Pages, then try a hard refresh (Cmd+Shift+R).

**Domain not working:** DNS changes take time — wait up to 48 hours. Double-check the CNAME points to `colinpeterman.github.io` (not the IP addresses — those go on the `@` A record).

**Photos not appearing:** Make sure `data/sports.json` has the correct filenames matching what's in `images/sports/`. Filenames are case-sensitive.

**Contact form not working:** Make sure you replaced `YOUR_FORMSPREE_ID` with your actual Formspree form ID.

---

Questions? Email colinpeterman@gmail.com or check GitHub Pages docs at https://docs.github.com/pages.