/* ============================================================
   MasterMind — "follow the PC to any Wi-Fi" hostname redirect
   ------------------------------------------------------------
   iOS home-screen icons store the exact URL you add them from.
   If that URL is a raw IPv4 (http://192.168.x.x/), the icon
   breaks the moment this PC joins a different Wi-Fi and gets a
   new IP — the saved address no longer exists, so the icon
   cannot even load.

   This script bounces every IPv4-based visit to the name
   http://mastermind.local/, which mDNS re-resolves to the PC's
   CURRENT IP on whichever network it is on. Anything added to
   the Home Screen therefore saves the NAME, and the same icon
   keeps working on every Wi-Fi the PC joins.

   Safety: we only redirect after confirming mastermind.local
   actually answers. If it can't be reached (e.g. the router
   blocks mDNS, or the PC is on another network), we stay on the
   IP link, which still works as a fallback on the same network.
   ============================================================ */
(function () {
  // Only IPv4 literals — never touch localhost, mastermind.local,
  // mastermind.ly, or any other name the user might type.
  var host = window.location.hostname;
  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) return;

  var nameHost = 'mastermind.local';
  var port = window.location.port ? ':' + window.location.port : '';
  var base = window.location.protocol + '//' + nameHost + port;
  var target = base + window.location.pathname + window.location.search + window.location.hash;

  // Probe the name with a short timeout. mode:'no-cors' gives us an opaque
  // response (we don't need to read it) — the promise resolves whenever the
  // server answers at all, and rejects when the name can't be reached.
  var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  var timedOut = false;
  var timer = controller ? setTimeout(function () {
    timedOut = true;
    controller.abort();
  }, 2500) : null;

  fetch(base + '/assist/manifest.json', {
    method: 'HEAD',
    mode: 'no-cors',
    cache: 'no-store',
    signal: controller ? controller.signal : undefined
  }).then(function () {
    if (timedOut) return; // aborted just as it resolved — leave the page alone
    window.location.replace(target);
  }).catch(function () {
    // Name unreachable — keep the working IP link. No redirect, no loop.
  }).then(function () {
    if (timer) clearTimeout(timer);
  });
})();
