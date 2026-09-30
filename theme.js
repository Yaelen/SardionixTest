/* ─────────────────────────────────────────
   THEME (loaded in <head>, not deferred)
   Sets data-theme on <html> before first paint so dark mode never flashes white.
   Saved choice wins; otherwise follow the device setting (and keep following it live).
───────────────────────────────────────── */
(function () {
  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function savedTheme() {
    try {
      var t = localStorage.getItem('theme');
      return t === 'dark' || t === 'light' ? t : null;
    } catch (e) { return null; }
  }

  root.setAttribute('data-theme', savedTheme() || (mq.matches ? 'dark' : 'light'));

  mq.addEventListener('change', function (e) {
    if (!savedTheme()) root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  });
})();
