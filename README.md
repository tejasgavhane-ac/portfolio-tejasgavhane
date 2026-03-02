# Tejas Gavhane — Portfolio Website
**Account & Finance Executive | SAP S/4HANA FICO Consultant**

> "Bridging Financial Intelligence with SAP S/4HANA Excellence"

🌐 **Live URL:** https://tejasgavhane-ac.github.io/portfoliotejasgavhane/

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion v11 |
| Icons | Lucide React |
| Contact Form | Formspree |
| Deployment | GitHub Pages + GitHub Actions CI/CD |
| Fonts | Cormorant Garamond + DM Sans |

---

## Local Development

```bash
# 1. Clone the repository
git clone https://github.com/tejasgavhane-ac/portfoliotejasgavhane.git
cd portfoliotejasgavhane

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173/portfoliotejasgavhane/
```

---

## Production Build

```bash
npm run build
```

The build output will be in `/dist`. The site is optimised with:
- Code splitting (vendor chunk isolated)
- Asset hashing for cache-busting
- Tree-shaking for minimal bundle size

---

## GitHub Pages Deployment (Step-by-Step)

### Step 1 — Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in as `tejasgavhane-ac`
2. Click **New Repository**
3. Repository name: `portfoliotejasgavhane`
4. Set to **Public**
5. Do **NOT** initialise with README (you'll push your own files)
6. Click **Create Repository**

### Step 2 — Push Your Code

```bash
cd portfoliotejasgavhane

# Initialise git (if not already done)
git init
git add .
git commit -m "feat: initial portfolio deployment"

# Add remote and push
git remote add origin https://github.com/tejasgavhane-ac/portfoliotejasgavhane.git
git branch -M main
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### Step 4 — GitHub Actions Will Auto-Deploy

The workflow at `.github/workflows/deploy.yml` will automatically:
- Trigger on every push to `main`
- Install Node.js 20 and project dependencies
- Run `npm run build`
- Upload the `/dist` folder
- Deploy to GitHub Pages

Your site will be live at:
```
https://tejasgavhane-ac.github.io/portfoliotejasgavhane/
```

### Step 5 — Monitor Deployments

1. Go to your repository → **Actions** tab
2. Watch the **Deploy Portfolio to GitHub Pages** workflow
3. Green checkmark = successful deployment 🎉

---

## Contact Form Setup (Formspree)

The contact form uses Formspree for email delivery.

1. Go to [formspree.io](https://formspree.io) and sign up
2. Create a new form (use your email: tejas.gavhane0107@gmail.com)
3. Copy your form endpoint ID (e.g., `xqaqrpob`)
4. Update in `src/App.jsx`:
   ```js
   const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', ...)
   ```
5. Push to `main` and the CI/CD pipeline will auto-deploy

---

## Custom Domain Configuration (portfolio.tejasgavhane.io)

To use `portfolio.tejasgavhane.io`:

### Step 1 — Add CNAME to Repository

Create a file `public/CNAME` with content:
```
portfolio.tejasgavhane.io
```

### Step 2 — Configure DNS at Your Domain Registrar

Add these DNS records to your domain provider:

| Type | Name | Value |
|------|------|-------|
| CNAME | portfolio | tejasgavhane-ac.github.io |

Or using A records (recommended for apex domains):
| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | tejasgavhane-ac.github.io |

### Step 3 — Update Vite Base Config

In `vite.config.js`, change:
```js
base: '/'  // Change from '/portfoliotejasgavhane/' to '/'
```

### Step 4 — Enable Custom Domain in GitHub

1. Go to **Settings → Pages**
2. Under **Custom domain**, enter `portfolio.tejasgavhane.io`
3. Tick **Enforce HTTPS** (after DNS propagates, usually 24–48 hours)

---

## Project Structure

```
portfoliotejasgavhane/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── public/
│   ├── favicon.svg
│   └── resume.pdf              # Tejas Gavhane's CV
├── src/
│   ├── App.jsx                 # Main portfolio component (all sections)
│   ├── index.css               # Global styles + Tailwind
│   └── main.jsx                # React entry point
├── index.html                  # HTML template with SEO meta tags
├── vite.config.js              # Vite + base path configuration
├── tailwind.config.js          # Tailwind theme (navy + gold palette)
├── postcss.config.js
├── package.json
└── README.md
```

---

## Sections

| Section | Description |
|---------|-------------|
| Hero | Full-screen landing with animated profile card and tagline |
| About | Biography, values, and contact information |
| Skills | Animated progress bars for SAP FICO, Accounting, and Tools |
| Experience | Icom Industries — detailed work history with highlights |
| Projects | SAP FICO S/4HANA and Financial Process Optimization projects |
| Certifications | B.Com, MBA, SAP FICO, Tally ERP credentials |
| Resume | Embedded PDF viewer with download capability |
| Contact | Working Formspree contact form + social links |

---

## Lighthouse Performance Targets

| Metric | Target |
|--------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |

---

## License

© 2025 Tejas Gavhane. All rights reserved.
