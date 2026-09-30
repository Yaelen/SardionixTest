# Sardionix Supply & Services Ltd: Website

Static marketing website for Sardionix S&S Ltd, a multidisciplinary industrial hygiene,
food safety, pest control, and branded product supply company operating in Suriname and Curaçao
(owned by my dad). The site is informational only: no billing, no logins, no scheduling for now.

---

## Hard Constraints

- Zero hosting cost, no subscriptions. The only accepted cost is the domain (~€10/year).
- No React or other SPA framework. Static output only.
- Fast on slow mobile connections: small images (WebP/AVIF), minimal JS, no heavy libraries.
- Code rules: make only the requested change, never restructure or restyle existing code unasked,
  return complete files rather than diffs. No em dashes in any output.

---

## File Structure

```
Sardionix/
├── index.html     English page. HTML structure only (no inline styles or scripts)
├── nl/index.html  Dutch page. Same structure, paths prefixed with ../
├── styles.css     All CSS (design tokens, layout, components, responsive)
├── script.js      All JS (hamburger, scroll reveal, services expand, night mode toggle,
│                  language slider, nav active state)
├── theme.js       Tiny script loaded in <head> (not deferred): sets the theme before first paint
├── Content/       Logos: RealLogo.svg (light bg), RealLogo-light.svg (dark bg), PNG/JPG variants
└── CLAUDE.md      This file
```

**Rule: never put `<style>` blocks, `style="..."` attributes or inline `onclick` attributes in the HTML.**
The CSP blocks them silently (the element renders unstyled). All styles go in `styles.css`,
all behaviour goes in `script.js`.

**Bilingual rule:** every content change must be made in both `index.html` (EN) and
`nl/index.html` (NL). The two files must keep the same structure. The nav has an
EN/NL slider (`.lang-switch`, `data-active="en|nl"`): two plain links, the orange thumb
slides before navigating, and the current `#section` is kept.

**Night mode:** `theme.js` sets `data-theme="light|dark"` on `<html>` from the saved choice
(localStorage `theme`), else the device setting. The nav button `#themeToggle` flips it and
saves it (`aria-pressed` kept in sync). Dark colours come from the theme tokens in
`styles.css` (`:root[data-theme="dark"]`, plus a `prefers-color-scheme` fallback when JS is off).
New light-background colours must use a theme token (`--bg`, `--surface`, `--heading`, ...)
so they switch too. Logos come in pairs: `.logo-on-light` / `.logo-on-dark`.

Local preview (no Node/Python on this machine): `.claude/serve.ps1` serves the folder on
http://localhost:8080 (gitignored).

---

## Tech Stack

Pure vanilla HTML5 / CSS3 / JS: no framework, no build step, no npm.
(Astro was considered; decision is to continue with the existing vanilla site.)
Open `index.html` directly in a browser to preview, or use a local server:

```bash
npx serve .          # Node
python -m http.server # Python
```

A local server is required to avoid CSP issues with `file://` URLs.

---

## Hosting & Services Setup

| Part | Service | Cost |
|---|---|---|
| Domain | Cloudflare Registrar (.com preferred, serves both SR and CW) | ~€10/yr |
| Hosting | Cloudflare Pages, deployed from GitHub | Free |
| Receiving email | Cloudflare Email Routing: info@domain → business Gmail | Free |
| Sending as info@ | Gmail "Send mail as" via Brevo free SMTP (verify domain in Brevo, add its SPF/DKIM records in Cloudflare DNS) | Free |
| Code | GitHub repo `Yaelen/SardionixTest` | Free |

Cloudflare Pages settings for this repo: no build command, output directory `/`.

### Status
- Site code exists in this repo (one-page version, see sections below).
- No domain registered yet, no business email created yet.
- Old setup (WordPress on Bluehost, Titan Email) is fully stopped. Nothing to migrate or preserve.

### Roadmap
1. Create a dedicated business Gmail (e.g. sardionix.info@gmail.com); use it for all accounts below.
2. Create Cloudflare account, register domain via Cloudflare Registrar.
3. Enable Email Routing: info@ → business Gmail.
4. Brevo account, verify domain, add DNS records, set up Gmail "Send mail as" info@.
5. Connect `Yaelen/SardionixTest` to Cloudflare Pages, attach custom domain.

---

## Open Decisions / To Do

Decided: one-page layout stays, bilingual NL + EN, no booking, no contact form.

Still open:
- **Images:** Unsplash URLs (external, heavy); brief wants small self-hosted WebP/AVIF.
- **Logo files:** large PNG/JPG in `Content/` are published with the site; only `RealLogo.svg` is used.
- **Security headers:** on Cloudflare Pages these can be set with a `_headers` file.
- **SEO basics:** meta description, favicon, hreflang tags (need the final domain).
- **Privacy Policy** footer link points nowhere.
- **Map/locations:** no street addresses yet, only city names.
- **Content still needed:** service descriptions, company history/about text, photos,
  real client logos, check of the Dutch translation. Quote card descriptions are placeholders.

---

## Design Tokens (CSS custom properties in `styles.css`)

| Variable       | Value     | Usage                        |
|----------------|-----------|------------------------------|
| `--navy`       | `#0B1D3A` | Primary dark background      |
| `--navy-dark`  | `#071122` | Footer / deepest backgrounds |
| `--navy-mid`   | `#122348` | Card backgrounds             |
| `--orange`     | `#E85A2A` | Brand accent, CTAs           |
| `--teal`       | `#2EBDAA` | Brand accent (secondary)     |
| `--grey-light` | `#F4F6FA` | Section backgrounds          |
| `--grey-text`  | `#6B7E96` | Body copy on light bg        |
| `--text`       | `#1A2A40` | Default text                 |
| `--border`     | `#E2E8F0` | Borders on light surfaces    |
| `--whatsapp`   | `#25D366` | WhatsApp button icon         |
| `--max`        | `1100px`  | Max content width            |

Theme tokens (different value in dark mode): `--bg`, `--surface`, `--heading`, `--nav-bg`,
`--nav-border`, `--nav-link`, `--btn-dark`; dark mode also overrides `--grey-light`,
`--grey-text`, `--text`, `--border`.

Always use these variables; never hardcode colours.

---

## Page Sections (in order)

1. **Nav**: fixed, scrolls with active state highlight
2. **Hero**: 2×2 industrial image grid background, centered text, inline client carousel, stats bar
3. **Trust bar**: "Certified by" label + pill badges with icons (`.trust-list`, `.trust-item`)
4. **Services**: three expanding columns (click to expand with CSS flex animation)
5. **About**: two-column grid with story text and team image
6. **Certifications**: dark navy section with cert cards (HACCP, EHEDG, etc.)
7. **Quote** (`#quote`, reuses `.booking-*` classes): three "Request a Quote" cards, no scheduling
8. **Contact**: two-column: locations with phone links + WhatsApp (SR, CW) and email buttons
9. **Footer**: brand column + nav links + legal links

---

## Key Patterns

### Expanding service columns
```css
.svc-col          { flex: 1; transition: flex 0.55s cubic-bezier(0.4,0,0.2,1); }
.svc-col.active   { flex: 3.2; }
```
Triggered by `expandCol(col)` in `script.js`. On mobile (≤900px) they stack vertically
and use `min-height` instead of flex ratios.

### Scroll reveal
Any element with class `reveal` fades in when it enters the viewport.
Uses `IntersectionObserver`, no library needed.

### Client logo carousel
Infinite CSS scroll via `@keyframes scroll-left` on `.hero-clients-track`.
Logos are SVG placeholders; replace with real client logo SVGs/PNGs when available.
The track contains two identical sets of logos so the loop is seamless.

---

## Responsive Breakpoints

| Breakpoint  | Behaviour                                                    |
|-------------|--------------------------------------------------------------|
| ≤ 900px     | Services stack vertically, grids go 1-2 col, tablet layout  |
| ≤ 640px     | Hamburger menu, hero buttons stack, stats bar goes 2×2 grid |
| ≤ 400px     | Stats bar goes single column                                 |

---

## Contact

No contact form (it had no backend and silently lost messages). Contact is via
`https://wa.me/<number>` links for Suriname and Curaçao, `tel:` links and a `mailto:` link.

---

## Content

All real company content is in the HTML. Key facts:
- **Email:** info@sardionix.com (domain not registered yet, address does not work yet)
- **Suriname:** +597 8968010
- **Curaçao:** +599 966 72745
- **Tagline:** Supply Simplified. Service Amplified.
- **Founded on:** precision, reliability, strategic foresight

Certifications: HACCP, CODEX ALIMENTARIUS, 3-A Sanitary Standard, EHEDG, Food Safety
Management Systems, UV Drinking Water Installation Professional.

---

## Security Notes

- CSP is set via `<meta http-equiv="Content-Security-Policy">` in `index.html`
- No `'unsafe-inline'`: external CSS/JS files are used instead
- When deploying, also set these HTTP response headers (Cloudflare Pages: `_headers` file):
  ```
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  ```

---

## Images

All images are Unsplash URLs. Theme: industrial / food-grade / hygiene.
Hero uses a 2×2 CSS grid of background images with `filter: brightness(0.38) saturate(0.7)`
plus a gradient overlay.

When replacing with real photos, update the `background-image` URLs in `styles.css`
under the `.hero-bg-img:nth-child(n)` selectors and `.svc-col[data-img]::before` selectors.
