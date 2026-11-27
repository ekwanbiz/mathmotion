/* =================== TEMA ANGKASA · Bab 1 T1 Nombor Nyata (eksperimen) ===================
   Menambah latar galaksi, gambar hiasan beranimasi dan gaya kotak pada NOTA bab ini sahaja.
   Tidak aktif jika cikgu memilih tema slaid lain atau mod cerah. Isi slides.js tidak disentuh. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';

  // ---------- gambar hiasan (SVG dilukis sendiri) ----------
  const PLANET = `<svg viewBox="0 0 260 200" aria-hidden="true"><defs>
    <radialGradient id="gxP" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#F0ABFC"/><stop offset=".55" stop-color="#8B5CF6"/><stop offset="1" stop-color="#2E1065"/></radialGradient>
    <linearGradient id="gxR" x1="0" x2="1"><stop offset="0" stop-color="#67E8F9" stop-opacity=".1"/><stop offset=".5" stop-color="#A5F3FC"/><stop offset="1" stop-color="#67E8F9" stop-opacity=".1"/></linearGradient></defs>
    <ellipse cx="130" cy="104" rx="122" ry="26" fill="none" stroke="url(#gxR)" stroke-width="7" transform="rotate(-16 130 104)" opacity=".75"/>
    <circle cx="130" cy="100" r="62" fill="url(#gxP)"/>
    <path d="M78 84c30 10 70 6 104-6M74 106c34 12 76 8 112-6" stroke="#F5D0FE" stroke-opacity=".35" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M8 120c40 22 200 8 244-50" stroke="url(#gxR)" stroke-width="7" fill="none" opacity=".9"/></svg>`;
  const MOON = `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><radialGradient id="gxM" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#E2E8F0"/><stop offset="1" stop-color="#475569"/></radialGradient></defs>
    <circle cx="60" cy="60" r="50" fill="url(#gxM)"/><circle cx="42" cy="48" r="9" fill="#64748B" opacity=".6"/><circle cx="74" cy="72" r="13" fill="#64748B" opacity=".5"/><circle cx="70" cy="36" r="5" fill="#64748B" opacity=".6"/></svg>`;
  const ROCK = `<svg viewBox="0 0 30 30" aria-hidden="true"><path d="M8 4l12-1 8 9-3 12-11 4-11-8z" fill="#7C6F99"/><circle cx="12" cy="11" r="2.5" fill="#5B4F78"/><circle cx="19" cy="19" r="3" fill="#5B4F78"/></svg>`;
  // 1.1: angkasawan memegang garis nombor
  const HERO11 = `<svg viewBox="0 0 160 170" aria-hidden="true">
    <g class="gxorbit" style="transform-box:fill-box"><circle cx="80" cy="80" r="70" fill="none" stroke="#67E8F9" stroke-opacity=".35" stroke-dasharray="4 8" stroke-width="2"/></g>
    <rect x="52" y="70" width="56" height="58" rx="20" fill="#E2E8F0"/><rect x="62" y="84" width="36" height="22" rx="6" fill="#CBD5E1"/>
    <circle cx="80" cy="50" r="30" fill="#F1F5F9"/><ellipse cx="80" cy="52" rx="21" ry="17" fill="#1E1B4B"/><ellipse cx="72" cy="46" rx="7" ry="4" fill="#A5F3FC" opacity=".8"/>
    <rect x="40" y="78" width="14" height="34" rx="7" fill="#E2E8F0"/><rect x="106" y="78" width="14" height="34" rx="7" fill="#E2E8F0"/>
    <rect x="60" y="124" width="16" height="28" rx="7" fill="#E2E8F0"/><rect x="84" y="124" width="16" height="28" rx="7" fill="#E2E8F0"/>
    <line x1="8" y1="160" x2="152" y2="160" stroke="#22D3EE" stroke-width="3" stroke-linecap="round"/>
    <g fill="#22D3EE"><circle cx="20" cy="160" r="3"/><circle cx="50" cy="160" r="3"/><circle cx="80" cy="160" r="4"/><circle cx="110" cy="160" r="3"/><circle cx="140" cy="160" r="3"/></g>
    <g font-family="Inter,sans-serif" font-size="11" font-weight="700" fill="#A5F3FC" text-anchor="middle"><text x="20" y="150">−2</text><text x="50" y="150">−1</text><text x="110" y="150">1</text><text x="140" y="150">2</text></g>
    <circle cx="80" cy="74" r="3" fill="#F472B6" class="gxblink"/></svg>`;
  // 1.2: roket dengan simbol operasi
  const HERO12 = `<svg viewBox="0 0 160 190" aria-hidden="true">
    <g transform="translate(80 150)"><path class="gxflame" d="M-14 0q14 46 28 0z" fill="#FBBF24"/><path class="gxflame" d="M-7 0q7 28 14 0z" fill="#FEF3C7"/></g>
    <path d="M80 10c26 22 34 58 28 140H52C46 68 54 32 80 10z" fill="#E2E8F0"/>
    <path d="M80 10c12 10 20 24 24 40H56c4-16 12-30 24-40z" fill="#F472B6"/>
    <circle cx="80" cy="78" r="15" fill="#1E1B4B" stroke="#A78BFA" stroke-width="5"/><circle cx="75" cy="73" r="4" fill="#A5F3FC"/>
    <path d="M52 112L28 146l26-4z" fill="#8B5CF6"/><path d="M108 112l24 34-26-4z" fill="#8B5CF6"/>
    <g font-family="Inter,sans-serif" font-weight="800" font-size="20" text-anchor="middle"><text x="22" y="40" fill="#22D3EE" class="gxblink">+</text><text x="140" y="56" fill="#F472B6" class="gxblink" style="animation-delay:.6s">×</text>
    <text x="18" y="104" fill="#FBBF24" class="gxblink" style="animation-delay:1.2s">−</text><text x="144" y="112" fill="#34D399" class="gxblink" style="animation-delay:1.8s">÷</text></g></svg>`;
  // 1.3: stesen angkasa kubus dan segi empat sama
  const HERO13 = `<svg viewBox="0 0 170 170" aria-hidden="true">
    <rect x="4" y="66" width="44" height="26" rx="3" fill="#1D4ED8" stroke="#67E8F9" stroke-width="2"/><path d="M15 66v26M26 66v26M37 66v26" stroke="#67E8F9" stroke-width="1.5"/>
    <rect x="122" y="66" width="44" height="26" rx="3" fill="#1D4ED8" stroke="#67E8F9" stroke-width="2"/><path d="M133 66v26M144 66v26M155 66v26" stroke="#67E8F9" stroke-width="1.5"/>
    <path d="M48 79h18M104 79h18" stroke="#CBD5E1" stroke-width="4"/>
    <path d="M66 58l24-14 24 14v32l-24 14-24-14z" fill="#A78BFA"/><path d="M66 58l24 14 24-14-24-14z" fill="#DDD6FE"/><path d="M90 72v32l24-14V58z" fill="#7C3AED"/>
    <text x="90" y="135" font-family="Inter,sans-serif" font-size="18" font-weight="800" fill="#FBBF24" text-anchor="middle">a² · a³</text>
    <circle cx="90" cy="30" r="4" fill="#F472B6" class="gxblink"/><line x1="90" y1="34" x2="90" y2="44" stroke="#CBD5E1" stroke-width="2"/></svg>`;
  const HERO = { '1.1': HERO11, '1.2': HERO12, '1.3': HERO13 };

  function on() {
    const h = location.hash || '';
    const mode = document.documentElement.classList.contains('light');
    const tema = document.documentElement.dataset.tema;
    return /^#\/nota/.test(h) && !mode && !tema;
  }

  function deco(sub) {
    const d = document.createElement('div');
    d.className = 'gxdeco'; d.dataset.sub = sub || '';
    d.innerHTML = '<div class="gxst s1"></div><div class="gxst s2"></div><div class="gxst s3"></div><i class="gxshoot"></i><i class="gxshoot b"></i>'
      + `<span class="gxart planet">${PLANET}</span><span class="gxart moon">${MOON}</span><span class="gxart rock1">${ROCK}</span><span class="gxart rock2">${ROCK}</span>`
      + (HERO[sub] ? `<span class="gxart hero">${HERO[sub]}</span>` : '');
    return d;
  }

  function curSub() {
    const m = (location.hash || '').match(/^#\/nota\/([\d.]+)\//);
    return m ? m[1] : '';
  }

  function apply() {
    const root = document.documentElement, act = on();
    root.classList.toggle('gx-on', act);
    const main = document.getElementById('ajpMain');
    const old = main && main.querySelector(':scope>.gxdeco');
    if (!act || !main) { if (old) old.remove(); return; }
    const sub = curSub();
    if (old && old.dataset.sub === sub) return;
    if (old) old.remove();
    main.insertBefore(deco(sub), main.firstChild);
  }

  // dengar perubahan paparan (enjin melukis semula #app) dan pertukaran mod/tema
  let q = 0;
  const kick = () => { if (q) return; q = requestAnimationFrame(() => { q = 0; apply(); }); };
  new MutationObserver(kick).observe(document.getElementById('app'), { childList: true, subtree: true });
  new MutationObserver(kick).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-tema'] });
  addEventListener('hashchange', kick);
  kick();
})();
