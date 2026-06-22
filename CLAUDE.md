# Sardionix Supply & Services Ltd — Website

Static marketing website for Sardionix S&S Ltd, a multidisciplinary industrial hygiene,
food safety, pest control, and branded product supply company operating in Suriname and Curaçao.

---

## File Structure

```
Sardionix/
├── index.html   — HTML structure only (no inline styles or scripts)
├── styles.css   — All CSS (design tokens, layout, components, responsive)
├── script.js    — All JS (hamburger menu, scroll reveal, services expand, form)
└── CLAUDE.md    — This file
```

**Rule: never put `<style>` blocks or inline `onclick` attributes back into index.html.**
All styles go in `styles.css`, all behaviour goes in `script.js`.

---

## Tech Stack

Pure vanilla HTML5 / CSS3 / JS — no framework, no build step, no npm.
Open `index.html` directly in a browser to preview, or use a local server:

```bash
npx serve .          # Node
python -m http.server # Python
```

A local server is required to avoid CSP issues with `file://` URLs.

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
| `--max`        | `1100px`  | Max content width            |

Always use these variables — never hardcode colours.

---

## Page Sections (in order)

1. **Nav** — fixed, scrolls with active state highlight
2. **Hero** — 2×2 industrial image grid background, centered text, inline client carousel, stats bar
3. **Services** — three expanding columns (click to expand with CSS flex animation)
4. **About** — two-column grid with story text and team image
5. **Certifications** — dark navy section with cert cards (HACCP, EHEDG, etc.)
6. **Booking** — three bookable service cards with pricing
7. **Contact** — two-column: location info + hardened contact form
8. **Footer** — brand column + nav links + legal links

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
Uses `IntersectionObserver` — no library needed.

### Client logo carousel
Infinite CSS scroll via `@keyframes scroll-left` on `.hero-clients-track`.
Logos are SVG placeholders — replace with real client logo SVGs/PNGs when available.
The track contains two identical sets of logos so the loop is seamless.

---

## Responsive Breakpoints

| Breakpoint  | Behaviour                                                    |
|-------------|--------------------------------------------------------------|
| ≤ 900px     | Services stack vertically, grids go 1–2 col, tablet layout  |
| ≤ 640px     | Hamburger menu, hero buttons stack, stats bar goes 2×2 grid |
| ≤ 400px     | Stats bar goes single column                                 |

---

## Contact Form Security (script.js)

The form has four layers of protection:
1. **Honeypot** — hidden `name="website"` field; bots fill it, humans don't
2. **Rate limit** — 60 s cooldown between submissions (`RATE_LIMIT_MS`)
3. **Input validation** — length caps, email regex, service allowlist
4. **Sanitisation** — `sanitizeText()` strips HTML tags from all fields before use

The form currently only shows a success state (no real backend). To wire up a backend,
replace the success block in the `submit` event listener with a `fetch()` POST.

---

## Content

All real company content is in the HTML. Key facts:
- **Email:** info@sardionix.com
- **Suriname:** +597 8968010
- **Curaçao:** +599 966 72745
- **Tagline:** Supply Simplified. Service Amplified.
- **Founded on:** precision, reliability, strategic foresight

Certifications: HACCP, CODEX ALIMENTARIUS, 3-A Sanitary Standard, EHEDG, Food Safety
Management Systems, UV Drinking Water Installation Professional.

---

## Security Notes

- CSP is set via `<meta http-equiv="Content-Security-Policy">` in `index.html`
- No `'unsafe-inline'` — external CSS/JS files are used instead
- When deploying to a real server, also set these HTTP response headers:
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
