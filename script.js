/* ─────────────────────────────────────────
     HAMBURGER MENU
     No inline onclick attrs, all wired here
  ───────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}
hamburger.addEventListener('click', e => {
  e.stopPropagation();
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', closeMobileMenu)
);
document.addEventListener('click', e => {
  if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    closeMobileMenu();
  }
});

/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────
   SERVICES EXPAND
   Wired here, no inline onclick in HTML
───────────────────────────────────────── */
function expandCol(col) {
  document.querySelectorAll('.svc-col').forEach(c => c.classList.remove('active'));
  col.classList.add('active');
}
document.querySelectorAll('.svc-col').forEach(col => {
  col.addEventListener('click', () => expandCol(col));
});

/* ─────────────────────────────────────────
   NIGHT MODE TOGGLE
   Initial theme is set by theme.js in <head>
───────────────────────────────────────── */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function syncThemeToggle() {
  themeToggle.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));
}
themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: still works for this visit */ }
});
new MutationObserver(syncThemeToggle).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
syncThemeToggle();

/* ─────────────────────────────────────────
   LANGUAGE SLIDER
   Slide the thumb first, then go to the other language (same section)
───────────────────────────────────────── */
document.querySelectorAll('.lang-switch .lang-opt:not([aria-current])').forEach(a => {
  a.addEventListener('click', e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    a.closest('.lang-switch').dataset.active = a.lang;
    const target = a.href.split('#')[0] + location.hash;
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 220;
    setTimeout(() => { location.href = target; }, delay);
  });
});

/* ─────────────────────────────────────────
   NAV ACTIVE STATE
───────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--orange)' : '';
  });
}, { passive: true });
