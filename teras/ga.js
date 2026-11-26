'use strict';
/* =================== TerokaMath · Google Analytics (GA4) ===================
   Dimuat oleh halaman utama, setiap bab dan game. Hanya aktif di terokamath.com (bukan ujian tempatan).
   Rekod halaman/tab sahaja – tiada nama atau data murid. Link kongsi (#/k/…) dan kod kuiz (#/q/…)
   TIDAK dihantar: hanya segmen pertama hash direkod sebagai laluan maya, cth. /isomove/nota/.
   Game: /game/<id-game>/<id-bab>/ */
(function () {
  var ID = 'G-CDH0P91G0V';
  if (location.hostname !== 'terokamath.com') return;
  var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
  var last = '';
  function path() {
    var p = location.pathname.replace(/index\.html$/, '');
    if (/\/game\/main\.html$/.test(p)) {
      var q = new URLSearchParams(location.search), g = (q.get('g') || '').replace(/[^a-z]/g, ''), b = (q.get('b') || '').replace(/[^\w-]/g, '');
      return '/game/' + (g || 'main') + '/' + (b ? b + '/' : '');
    }
    var seg = (location.hash.match(/^#\/([a-z]+)/) || [])[1];
    if (seg === 'utama') seg = '';
    return p + (seg ? seg + '/' : '');
  }
  function pv() {
    var p = path(); if (p === last) return; last = p;
    gtag('event', 'page_view', { page_location: location.origin + p, page_path: p, page_title: document.title });
  }
  window.addEventListener('hashchange', function () { setTimeout(pv, 50); });
  if (document.readyState === 'complete') setTimeout(pv, 50); else window.addEventListener('load', function () { setTimeout(pv, 50); });
})();
