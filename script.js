/* ─────────────────────────────────────────
     HAMBURGER MENU
     No inline onclick attrs — all wired here
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
   Wired here — no inline onclick in HTML
───────────────────────────────────────── */
function expandCol(col) {
  document.querySelectorAll('.svc-col').forEach(c => c.classList.remove('active'));
  col.classList.add('active');
}
document.querySelectorAll('.svc-col').forEach(col => {
  col.addEventListener('click', () => expandCol(col));
});

/* ─────────────────────────────────────────
   CONTACT FORM — hardened
   Protections:
     1. Honeypot field check (bot detection)
     2. Rate-limit: 1 submission per 60 s
     3. Input length + pattern validation
     4. textContent used for feedback (never innerHTML)
───────────────────────────────────────── */
const RATE_LIMIT_MS = 60_000; // 60 seconds between submissions
let lastSubmit = 0;

// Allowed service values — reject anything else
const VALID_SERVICES = new Set([
  'food-safety', 'hygiene', 'pest', 'supply', 'tech', 'other'
]);

function sanitizeText(str, maxLen) {
  // Strip all HTML tags and limit length
  return str.replace(/<[^>]*>/g, '').trim().slice(0, maxLen);
}

function showFormError(btn, msg) {
  btn.textContent = msg;
  btn.style.background = '#c0392b';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
  }, 3500);
}

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const btn = document.getElementById('fsubmit');
  const honey = this.elements['website'];
  const name = sanitizeText(document.getElementById('fname').value, 100);
  const email = sanitizeText(document.getElementById('femail').value, 254);
  const service = document.getElementById('fservice').value;
  const message = sanitizeText(document.getElementById('fmessage').value, 2000);

  // 1. Honeypot: a real user leaves this blank
  if (honey && honey.value.trim() !== '') return; // silent drop — don't tell bots

  // 2. Rate limit
  const now = Date.now();
  if (now - lastSubmit < RATE_LIMIT_MS) {
    showFormError(btn, 'Please wait before submitting again.');
    return;
  }

  // 3. Basic validation
  if (name.length < 2) {
    showFormError(btn, 'Please enter your name.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormError(btn, 'Please enter a valid email.');
    return;
  }
  if (!VALID_SERVICES.has(service)) {
    showFormError(btn, 'Please select a service.');
    return;
  }
  if (message.length < 10) {
    showFormError(btn, 'Please add a short message.');
    return;
  }

  // All checks passed — submit to Netlify Forms via fetch
  lastSubmit = now;
  btn.textContent = 'Sending…';
  btn.disabled = true;

  const formData = new URLSearchParams({
    'form-name': 'contact',
    name, email, service, message
  });

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString()
  })
    .then(() => {
      btn.textContent = '✓ Message sent!';
      btn.style.background = '#27ae60';
      this.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    })
    .catch(() => {
      showFormError(btn, 'Something went wrong — try again.');
      btn.disabled = false;
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