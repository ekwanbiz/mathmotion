'use strict';
/* =================== ISOMOVE (dalam MATHMOTION) =================== */
const KEY = 'isomove-v2';
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
const store = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
const save = o => LS.set(KEY, JSON.stringify(Object.assign(store(), o)));
const isLight = () => document.documentElement.classList.contains('light');
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const nz = (a, b) => { let v; do v = ri(a, b); while (v === 0); return v; };
const fmt = n => (n < 0 ? '−' + (-n) : '' + n);
const par = n => (n < 0 ? '(' + fmt(n) + ')' : fmt(n));
const P = (x, y) => `(${fmt(x)}, ${fmt(y)})`;
const vec = (a, b, c) => `<span class="vec"${c ? ` style="--c:var(--${c})"` : ''}>${fmt(a)}<br>${fmt(b)}</span>`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- warna slaid (gelap → cerah) ---------- */
const DARK = { bg: '#0B1220', surf: '#131C2E', nav: '#0E1626', bd: '#22304A', tx: '#E6EDF7', mu: '#94A3B8', grid: '#1E2A40', dim: '#334155', mu2: '#64748B', mu3: '#B6C2D3', tr: '#38BDF8', pa: '#FB923C', pu: '#A78BFA', am: '#FBBF24', gr: '#34D399', pk: '#F472B6', rd: '#F87171' };
const LIGHT = { bg: '#F4F6FB', surf: '#FFFFFF', nav: '#FAFBFE', bd: '#D5DCE8', tx: '#14152B', mu: '#55607A', grid: '#E3E8F1', dim: '#C3CBDA', mu2: '#6B7590', mu3: '#4A5568', tr: '#0284C7', pa: '#EA580C', pu: '#7C3AED', am: '#B45309', gr: '#059669', pk: '#DB2777', rd: '#DC2626' };
const D2L = {}; Object.keys(DARK).forEach(k => { D2L[DARK[k].toLowerCase()] = LIGHT[k]; });
const themed = (s, light) => (light ? s.replace(/#[0-9a-fA-F]{6}/g, h => D2L[h.toLowerCase()] || h) : s);

/* ---------- ikon ---------- */
const sv = (d, w = 22, extra = '') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const IC = {
  nota: sv('<path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z"/>'),
  teroka: sv('<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>'),
  latihan: sv('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
  games: sv('<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>'),
  sun: sv('<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>', 20, ' style="color:#FBBF24"'),
  moon: sv('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>', 20, ' style="color:#4B4BD6"'),
  fs: sv('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>', 20),
  print: sv('<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/>', 20),
  left: sv('<path d="M15 18l-6-6 6-6"/>', 24),
  right: sv('<path d="M9 18l6-6-6-6"/>', 24),
  arrow: sv('<path d="M5 12h14M13 6l6 6-6 6"/>', 24),
  x: sv('<path d="M18 6L6 18M6 6l12 12"/>', 20),
  check: sv('<path d="M5 12l5 5 9-10"/>', 24, ' stroke-width="3"'),
  eye: sv('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', 22),
  eyeoff: sv('<path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-2.6 3.3M6.6 6.6C4.3 8.2 3 12 3 12s4 6 9 6a9 9 0 0 0 4.4-1.1"/>', 22),
  play: sv('<path d="M7 4l13 8-13 8z"/>', 22),
  reset: sv('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>', 22),
  clock: sv('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>', 26),
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z"/></svg>',
  fire: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2.5 1.2-4 2.5-5.2C9.7 10 11 11 11 11s-1-4 1-9z"/></svg>',
  star: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3 6.5 7 .9-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.9z"/></svg>',
  mm: '<svg width="24" height="24" viewBox="0 0 96 96" fill="none" stroke-linecap="round" stroke-width="12" aria-hidden="true"><path d="M14 74 L26 26" stroke="#2EE6A6"/><path d="M26 26 L48 58" stroke="#FF8A3D"/><path d="M48 58 L70 26" stroke="#B57BFF"/><path d="M70 26 L82 74" stroke="#FFC93C"/></svg>'
};

/* ---------- data subtopik ---------- */
const SUBDESC = {
  '11.1': 'Objek & imej, kekongruenan, maksud isometri',
  '11.2': 'Vektor translasi, mencari imej dan objek',
  '11.3': 'Paksi pantulan, sifat, pantulan pada paksi',
  '11.4': 'Pusat, sudut & arah putaran, mencari pusat',
  '11.5': 'Membanding sifat ketiga-tiga transformasi',
  '11.6': 'Peringkat simetri putaran bagi bentuk'
};
const SHORT = { '11.1': 'Transformasi', '11.2': 'Translasi', '11.3': 'Pantulan', '11.4': 'Putaran', '11.5': 'Isometri', '11.6': 'Simetri Putaran' };
const SUBSIM = { '11.2': 'translasi', '11.3': 'pantulan', '11.4': 'putaran' };
const subOf = no => SUBS.find(s => s.no === no);
const subCol = no => themed(subOf(no).col, isLight());

/* =================== Kerangka =================== */
const app = document.getElementById('app');
const TABS = [['ajar', 'MULA MENGAJAR', 'MENGAJAR'], ['nota', 'NOTA'], ['teroka', 'TEROKA'], ['latihan', 'LATIHAN'], ['games', 'GAMES']];
function shell(tab, inner) {
  const light = isLight();
  const fsOk = document.fullscreenEnabled;
  return `<div class="app tabbed">
  <header class="hdr">
    <a class="ib" href="../#/utama" aria-label="Kembali ke MATHMOTION (semua bab)">${IC.mm}</a>
    <a class="wm" href="#/">ISO<span>MOVE</span></a>
    <nav class="tabs" aria-label="Tab utama">${TABS.map(([k, t, sh]) => `<a href="#/${k}"${k === tab ? ' aria-current="page"' : ''}>${IC[k]}${sh ? `<span class="tl">${t}</span><span class="ts">${sh}</span>` : `<span>${t}</span>`}</a>`).join('')}</nav>
    <div class="end">
      <button type="button" class="ib" id="themeBtn" aria-label="${light ? 'Tukar ke mod gelap' : 'Tukar ke mod cerah'}">${light ? IC.moon : IC.sun}</button>
      ${fsOk ? `<button type="button" class="ib fsbtn" id="fsBtn" aria-label="Skrin penuh">${IC.fs}</button>` : ''}
    </div>
  </header>
  <main class="main" id="main">${inner}</main></div>`;
}
function bindShell() {
  const t = document.getElementById('themeBtn');
  if (t) t.onclick = () => {
    const l = !isLight();
    document.documentElement.classList.toggle('light', l);
    LS.set('mathmotion-mode', l ? 'cerah' : 'gelap');
    setMeta(); render(true);
  };
  const f = document.getElementById('fsBtn');
  if (f) f.onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); };
}
function setMeta() { const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = isLight() ? '#FFFFFF' : '#0B1220'; }
let tt; function toast(m) { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 1900); }

/* =================== Muka depan =================== */
function viewSplash() {
  return `<main class="splash">
    <img src="logo.svg" alt="Logo ISOMOVE" width="150" height="150">
    <h1>ISO<span>MOVE</span></h1>
    <p class="slogan"><span style="color:var(--tr)">Gerak.</span> <span style="color:var(--pa)">Pantul.</span> <span style="color:var(--pu)">Putar!</span></p>
    <p class="sub">Bab 11 : Transformasi Isometri</p>
    <a class="btn pri big" href="#/ajar">Jom Mula! ${IC.arrow}</a>
  </main>`;
}

/* =================== NOTA =================== */
function viewNotaList() {
  const cards = SUBS.map(s => {
    const n = SLIDES.filter(x => x.sub === s.no).length;
    return `<a class="subcard" href="#/nota/${s.no}/1" style="--c:${subCol(s.no)}">
      <span class="top"><span class="no">${s.no}</span><span class="cnt">${n} slaid</span></span>
      <h2>${s.name}</h2><p>${SUBDESC[s.no]}</p></a>`;
  }).join('');
  return `<div class="wrap">
    <div class="headrow"><div><p class="eyebrow">BAB 11 · TINGKATAN 2</p><h1 class="h1">Transformasi Isometri</h1><p class="lead">Pilih subtopik untuk mula mengajar.</p></div>
    <button type="button" class="btn sec" id="printAll">${IC.print} Cetak semua nota (PDF)</button></div>
    <div class="subgrid">${cards}</div></div>`;
}
function bindNotaList() { document.getElementById('printAll').onclick = () => printSlides(SLIDES); }

function slideHTML(s, light) {
  const col = themed(subOf(s.sub).col, light);
  const head = `<p class="sl-kick">${s.kicker}</p><h1 class="sl-title">${s.title}</h1>`;
  if (s.full) return `<div class="slide full" style="--c:${col}"><div>${head}</div>${themed(s.full, light)}</div>`;
  return `<div class="slide" style="--c:${col}"><div class="sl-text">${head}${themed(s.body, light)}</div><div class="sl-fig">${themed(s.fig, light)}</div></div>`;
}
const NOTA = { i: 0, r: 0 };
let pendingReveal = 0;
function viewSlide(sub, n) {
  const i = SLIDES.findIndex(x => x.sub === sub && x.n === n);
  if (i < 0) { location.replace('#/nota'); return ''; }
  NOTA.i = i; NOTA.r = pendingReveal; pendingReveal = 0;
  const s = SLIDES[i], so = subOf(sub), col = subCol(sub);
  const dots = Array.from({ length: s.N }, (_, k) => `<i${k + 1 === n ? ' class="on"' : ''}></i>`).join('');
  const sim = SUBSIM[sub];
  return `<div class="slbar">
      <a class="btn sec bk" href="#/nota" style="min-height:44px;padding:0 14px" aria-label="Kembali ke senarai subtopik">${IC.left}<span>Subtopik</span></a>
      <span class="chip" style="background:${col};color:var(--on)">${sub}</span><span class="nm">${so.name}</span>
      <span class="pg">Slaid ${n} / ${s.N}</span>
      <button type="button" class="ib" id="printSub" aria-label="Cetak nota subtopik ini">${IC.print}</button>
    </div>
    <div class="stage" id="stage" style="--c:${col}">${slideHTML(s, isLight())}</div>
    <div class="slfoot" style="--c:${col}">
      ${sim ? `<a class="btn sec tk" href="#/teroka/${sim}" style="min-height:48px" aria-label="Cuba di TEROKA">${IC.teroka}<span>Cuba di TEROKA</span></a>` : '<span class="hint">Anak panah papan kekunci untuk tukar slaid</span>'}
      <div class="dots" role="img" aria-label="Slaid ${n} daripada ${s.N}">${dots}</div>
      <button type="button" class="ib" id="prevBtn" aria-label="Slaid sebelum" style="width:56px;height:52px">${IC.left}</button>
      <button type="button" class="btn pri" id="nextBtn" style="min-height:52px"><span id="nextLbl">Seterusnya</span>${IC.right}</button>
    </div>`;
}
function revealEls() { const st = document.getElementById('stage'); return st ? [...st.querySelectorAll('.rv')] : []; }
function applyReveal() {
  const els = revealEls();
  if (NOTA.r > els.length) NOTA.r = els.length;
  els.forEach((e, k) => e.classList.toggle('hid', k >= NOTA.r));
  const lbl = document.getElementById('nextLbl');
  if (lbl) lbl.textContent = NOTA.r < els.length ? 'Langkah seterusnya' : (NOTA.i < SLIDES.length - 1 ? 'Slaid seterusnya' : 'Tamat');
}
function goSlide(i, reveal) { const s = SLIDES[i]; pendingReveal = reveal; location.hash = `#/nota/${s.sub}/${s.n}`; }
function nextStep() {
  const els = revealEls();
  if (NOTA.r < els.length) { NOTA.r++; applyReveal(); return; }
  if (NOTA.i < SLIDES.length - 1) goSlide(NOTA.i + 1, 0); else { toast('Tamat nota Bab 11'); location.hash = '#/nota'; }
}
function prevStep() { if (NOTA.i > 0) goSlide(NOTA.i - 1, 999); }
function bindSlide() {
  applyReveal();
  document.getElementById('nextBtn').onclick = nextStep;
  document.getElementById('prevBtn').onclick = prevStep;
  const s = SLIDES[NOTA.i];
  document.getElementById('printSub').onclick = () => printSlides(SLIDES.filter(x => x.sub === s.sub));
  const st = document.getElementById('stage');
  let x0 = null, y0 = 0;
  st.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  st.addEventListener('touchend', e => {
    if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) nextStep(); else prevStep(); }
  }, { passive: true });
}
document.addEventListener('keydown', e => {
  if (!/^#\/nota\/\d/.test(location.hash)) return;
  if (e.target.closest && e.target.closest('input,textarea,select')) return;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
    if (e.key === 'Enter' && e.target.closest && e.target.closest('a,button')) return;
    e.preventDefault(); nextStep();
  } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); prevStep(); }
});

let printing = false;
const slidesDoc = list => list.map(s => `<section class="ps"><div class="pshead"><span>ISOMOVE · ${s.sub} ${subOf(s.sub).name}</span><span>Slaid ${s.n} / ${s.N}</span></div>${slideHTML(s, true)}</section>`).join('');
window.addEventListener('beforeprint', () => {
  if (printing) return;
  const pr = document.getElementById('print');
  if (/^#\/latihan\/lembaran/.test(location.hash) && typeof WS !== 'undefined' && WS.sel.length) { pr.innerHTML = wsDocHTML(); setPage(WS_PAGE); }
  else { const m = location.hash.match(/^#\/nota\/([\d.]+)/); pr.innerHTML = slidesDoc(m ? SLIDES.filter(x => x.sub === m[1]) : SLIDES); }
  window.addEventListener('afterprint', () => { if (!printing) { pr.innerHTML = ''; setPage(''); } }, { once: true });
});
function setPage(css) { let st = document.getElementById('pagesz'); if (!css) { if (st) st.remove(); return; } if (!st) { st = document.createElement('style'); st.id = 'pagesz'; document.head.appendChild(st); } st.textContent = `@page{${css}}`; }
const WS_PAGE = 'size:A4 portrait;margin:13mm 14mm 15mm';
function printDoc(html, page) {
  printing = true;
  const pr = document.getElementById('print');
  pr.innerHTML = html; setPage(page);
  const wasDark = !isLight();
  if (wasDark) document.documentElement.classList.add('light');
  const done = () => { if (wasDark) document.documentElement.classList.remove('light'); pr.innerHTML = ''; setPage(''); printing = false; window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  setTimeout(() => { window.print(); if (!('onafterprint' in window)) setTimeout(done, 500); }, 80);
}
const printSlides = list => printDoc(slidesDoc(list));

/* =================== Plot (rajah latihan & games) =================== */
function plot(o) {
  let { x0, x1, y0, y1 } = o; const u = o.u || 40, pad = 30;
  while (x1 - x0 < 8) { x0--; if (x1 - x0 < 8) x1++; }
  while (y1 - y0 < 6) { y0--; if (y1 - y0 < 6) y1++; }
  const W = (x1 - x0) * u + pad * 2, H = (y1 - y0) * u + pad * 2;
  const X = x => +(pad + (x - x0) * u).toFixed(1), Y = y => +(pad + (y1 - y) * u).toFixed(1);
  let s = '';
  for (let x = x0; x <= x1; x++) s += `<line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}" style="stroke:var(--grid)" stroke-width="1.5"/>`;
  for (let y = y0; y <= y1; y++) s += `<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" style="stroke:var(--grid)" stroke-width="1.5"/>`;
  if (o.axes !== false) {
    const ax = x0 <= 0 && 0 <= x1 ? 0 : x0, ay = y0 <= 0 && 0 <= y1 ? 0 : y0;
    s += `<line x1="${X(x0)}" y1="${Y(ay)}" x2="${X(x1)}" y2="${Y(ay)}" style="stroke:var(--mu)" stroke-width="2.5"/>`;
    s += `<line x1="${X(ax)}" y1="${Y(y0)}" x2="${X(ax)}" y2="${Y(y1)}" style="stroke:var(--mu)" stroke-width="2.5"/>`;
    const st = (x1 - x0) > 12 ? 2 : 1;
    for (let x = x0; x <= x1; x++) if (x !== ax && x % st === 0) s += `<text x="${X(x)}" y="${Y(ay) + 19}" style="fill:var(--mu)" font-size="13" font-weight="600" text-anchor="middle">${fmt(x)}</text>`;
    for (let y = y0; y <= y1; y++) if (y !== ay && y % st === 0) s += `<text x="${X(ax) - 8}" y="${Y(y) + 5}" style="fill:var(--mu)" font-size="13" font-weight="600" text-anchor="end">${fmt(y)}</text>`;
    if (x0 < 0 && y0 < 0) s += `<text x="${X(0) - 8}" y="${Y(0) + 19}" style="fill:var(--mu)" font-size="13" font-weight="600" text-anchor="end">0</text>`;
  }
  for (const it of o.items || []) {
    const c = `var(--${it.c || 'tx'})`;
    if (it.t === 'poly') s += `<polygon points="${it.pts.map(p => X(p[0]) + ',' + Y(p[1])).join(' ')}" style="fill:${c};fill-opacity:.2;stroke:${c}" stroke-width="3.5" stroke-linejoin="round"${it.dash ? ' stroke-dasharray="9 6"' : ''}/>`;
    if (it.t === 'line') s += `<line x1="${X(it.a[0])}" y1="${Y(it.a[1])}" x2="${X(it.b[0])}" y2="${Y(it.b[1])}" style="stroke:${c}" stroke-width="${it.w || 3}"${it.dash ? ' stroke-dasharray="7 6"' : ''}/>`;
    if (it.t === 'pt') {
      s += `<circle cx="${X(it.x)}" cy="${Y(it.y)}" r="7" style="fill:${c}"/>`;
      if (it.l) s += `<text x="${X(it.x) + (it.dx ?? 10)}" y="${Y(it.y) + (it.dy ?? -10)}" style="fill:${c}" font-family="Space Grotesk, sans-serif" font-size="19" font-weight="700"${it.anchor ? ` text-anchor="${it.anchor}"` : ''}>${it.l}</text>`;
    }
    if (it.t === 'text') s += `<text x="${X(it.x)}" y="${Y(it.y)}" style="fill:${c}" font-size="${it.size || 15}" font-weight="700" text-anchor="${it.anchor || 'middle'}">${it.s}</text>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || 'Rajah')}" font-family="Inter, sans-serif">${s}</svg>`;
}
function shapeSVG(kind, n) {
  // bentuk untuk simetri putaran
  const c = 'var(--pk)'; let s = '';
  const W = 300, cx = 150, cy = 150;
  if (kind === 'poly') {
    const pts = []; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / n; pts.push((cx + 100 * Math.cos(a)).toFixed(1) + ',' + (cy + 100 * Math.sin(a)).toFixed(1)); }
    s = `<polygon points="${pts.join(' ')}" style="fill:${c};fill-opacity:.2;stroke:${c}" stroke-width="5" stroke-linejoin="round"/>`;
  } else if (kind === 'rect') s = `<rect x="45" y="95" width="210" height="110" style="fill:${c};fill-opacity:.2;stroke:${c}" stroke-width="5"/>`;
  else if (kind === 'letter') s = `<text x="150" y="215" text-anchor="middle" font-family="Inter, sans-serif" font-size="200" font-weight="800" style="fill:${c};fill-opacity:.2;stroke:${c}" stroke-width="4">${n}</text>`;
  return `<svg viewBox="0 0 ${W} 300" role="img" aria-label="Bentuk">${s}</svg>`;
}

/* =================== TEROKA: simulasi asal ISOMOVE =================== */
const SIMLIST = [['translasi', 'Translasi', 'tr'], ['pantulan', 'Pantulan', 'pa'], ['putaran', 'Putaran', 'pu']];
let simLast = 'translasi';
function viewTeroka(type) {
  if (!SIMLIST.some(x => x[0] === type)) type = simLast;
  simLast = type;
  const name = SIMLIST.find(x => x[0] === type)[1];
  return `<div class="tero">
    <nav class="seg terseg" aria-label="Pilih simulasi">${SIMLIST.map(([k, t, c]) => `<a href="#/teroka/${k}"${k === type ? ' aria-current="page"' : ''} style="--c:var(--${c})">${t}</a>`).join('')}</nav>
    <iframe class="simframe" src="simulasi/${type}.html" title="Simulasi ${name}"></iframe>
  </div>`;
}
function bindTeroka() {}

/* =================== Penjana soalan =================== */
// setiap fungsi: {q, fig?, figAns?, ans, work[]}
const AX = 'paksi';
const GEN_LQ = (key, d, extra) => { const v = vq(key, d), e = Object.assign({}, extra || {}); if (v.rev) delete e.fig; delete v.rev; return Object.assign(e, v); };
const GEN = {
  '11.1': {
    m: [() => vq('istilah', {}), () => {
      const [o, m] = pick([['P', 'Q'], ['M', 'N'], ['X', 'Y'], ['F', 'G'], ['S', 'T']]), sh = pick(['segi tiga', 'segi empat', 'pentagon']);
      return GEN_LQ('objImej', { sh, o, m, ans: `Objek: ${sh} ${o}; Imej: ${sh} ${m}`, work: ['Bentuk asal sebelum transformasi ialah <b>objek</b>.', 'Bentuk selepas transformasi ialah <b>imej</b>.'] });
    }, () => {
      const same = Math.random() < .6, a = ri(2, 3), b = ri(2, 3);
      const o = [[0, 0], [a, 0], [0, b]];
      const im = same ? (Math.random() < .5 ? o.map(([x, y]) => [12 - x - 1, y]) : o.map(([x, y]) => [8 + y, a - x])) : o.map(([x, y]) => [6 + 2 * x, 2 * y]);
      return GEN_LQ('kongruen', { same, ans: same ? 'Ya, kongruen' : 'Tidak kongruen', work: same ? ['Kedua-dua bentuk mempunyai bentuk yang sama.', 'Saiznya juga sama (panjang sisi sama).', 'Jadi bentuk itu <b>kongruen</b>.'] : ['Bentuknya sama tetapi <b>saiz berbeza</b>.', 'Bentuk kongruen mesti sama bentuk dan sama saiz.', 'Jadi bentuk itu <b>tidak kongruen</b>.'] },
        { fig: plot({ x0: 0, x1: 12, y0: 0, y1: 6, axes: false, items: [{ t: 'poly', pts: o, c: 'tr' }, { t: 'poly', pts: im, c: 'pa', dash: true }], label: 'Dua bentuk' }) });
    }],
    s: [() => {
      const iso = Math.random() < .5, o = [[1, 1], [3, 1], [1, 3]];
      const im = iso ? o.map(([x, y]) => [x + 6, y + 2]) : o.map(([x, y]) => [7 + (x - 1) * 2, 1 + (y - 1) * 2]);
      return GEN_LQ('isoFig', { iso, ans: iso ? 'Ya, isometri' : 'Bukan isometri', work: iso ? ['Bandingkan saiz objek dan imej.', 'Bentuk dan saiz imej <b>sama</b> dengan objek.', 'Jadi transformasi ini ialah isometri.'] : ['Bandingkan saiz objek dan imej.', 'Saiz imej <b>lebih besar</b> daripada objek.', 'Isometri mesti mengekalkan saiz, jadi ini bukan isometri.'] },
        { fig: plot({ x0: 0, x1: 12, y0: 0, y1: 7, axes: false, items: [{ t: 'poly', pts: o, c: 'tr' }, { t: 'poly', pts: im, c: 'pa', dash: true }], label: 'Objek dan imej' }) });
    }],
    k: [() => {
      const n = pick(['ABC', 'PQR', 'KLM', 'DEF', 'XYZ']), ab = ri(3, 12), ang = pick([35, 40, 48, 55, 62, 70, 75]);
      return GEN_LQ('panjangSudut', { n, ab, ang, ans: `${pr(n[0] + n[1])} = ${ab} cm, ∠${pr(n)} = ${ang}°`, work: ['Isometri mengekalkan bentuk dan saiz.', 'Maka imej kongruen dengan objek.', `Panjang sisi dan saiz sudut tidak berubah: ${pr(n[0] + n[1])} = ${ab} cm, ∠${pr(n)} = ${ang}°.`] });
    }]
  },
  '11.2': {
    m: [() => {
      const L = vlet(), x = ri(0, 4), y = ri(0, 4), a = nz(-3, 4), b = nz(-3, 4), X = x + a, Y = y + b;
      const box = { x0: Math.min(0, x, X) - 1, x1: Math.max(x, X) + 1, y0: Math.min(0, y, Y) - 1, y1: Math.max(y, Y) + 1 };
      return GEN_LQ('trImej', { L, x, y, a, b, X, Y, ans: `${L}′${P(X, Y)}`, work: [`Gerak ${Math.abs(a)} unit ke ${a > 0 ? 'kanan' : 'kiri'}: ${fmt(x)} + ${par(a)} = ${fmt(X)}.`, `Gerak ${Math.abs(b)} unit ke ${b > 0 ? 'atas' : 'bawah'}: ${fmt(y)} + ${par(b)} = ${fmt(Y)}.`] }, {
        fig: plot({ ...box, items: [{ t: 'pt', x, y, c: 'tr', l: L }], label: `Titik ${L}` }),
        figAns: plot({ ...box, items: [{ t: 'line', a: [x, y], b: [X, Y], c: 'tx', dash: true, w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: X, y: Y, c: 'gr', l: L + '′' }], label: `${L} dan ${L}′` }) });
    }, () => {
      const a = nz(-5, 5), b = nz(-5, 5);
      return GEN_LQ('trKata', { a, b, ans: `Vektor translasi = ${vec(a, b, 'gr')}`, work: [`${a > 0 ? 'Ke kanan: positif' : 'Ke kiri: negatif'}, ${fmt(a)}.`, `${b > 0 ? 'Ke atas: positif' : 'Ke bawah: negatif'}, ${fmt(b)}.`, `Tulis sebagai vektor ${vec(a, b)}.`] });
    }],
    s: [() => {
      const L = vlet(), x = ri(-3, 3), y = ri(-3, 3), a = nz(-4, 4), b = nz(-4, 4), X = x + a, Y = y + b;
      return GEN_LQ('trVektor', { L, x, y, X, Y, ans: `Vektor translasi = ${vec(a, b, 'gr')}`, work: [`Gerakan mengufuk: ${fmt(X)} − ${par(x)} = ${fmt(a)}.`, `Gerakan mencancang: ${fmt(Y)} − ${par(y)} = ${fmt(b)}.`, `Tulis sebagai vektor ${vec(a, b)}.`] });
    }, () => {
      const L = vlet(), X = ri(-2, 6), Y = ri(-2, 6), a = nz(-4, 4), b = nz(-4, 4);
      return GEN_LQ('trObjek', { L, X, Y, a, b, x: X - a, y: Y - b, ans: `${L}${P(X - a, Y - b)}`, work: ['Gerak dalam arah <b>songsang</b> dari imej ke objek.', `Koordinat-x: ${fmt(X)} − ${par(a)} = ${fmt(X - a)}.`, `Koordinat-y: ${fmt(Y)} − ${par(b)} = ${fmt(Y - b)}.`] });
    }],
    k: [() => {
      const A = vlet(); let B; do B = vlet(); while (B === A);
      const ax = ri(-3, 3), ay = ri(-3, 3), a = nz(-4, 4), b = nz(-4, 4), bx = ri(-4, 4), by = ri(-4, 4);
      return GEN_LQ('trB', { A, B, ax, ay, a, b, bx, by, ans: `${B}′${P(bx + a, by + b)}`, work: [`Cari vektor translasi: ${vec(a, b)} (${fmt(ax + a)} − ${par(ax)}, ${fmt(ay + b)} − ${par(ay)}).`, `Tambah vektor pada ${B}: (${fmt(bx)} + ${par(a)}, ${fmt(by)} + ${par(b)}).`, `${B}′${P(bx + a, by + b)}.`] });
    }, () => {
      const L = vlet(), x = ri(-3, 3), y = ri(-3, 3), a = nz(-3, 3), b = nz(-3, 3), c = nz(-3, 3), e = nz(-3, 3);
      return GEN_LQ('trDua', { L, x, y, a, b, c, e, ans: P(x + a + c, y + b + e), work: [`Selepas translasi pertama: ${P(x + a, y + b)}.`, `Selepas translasi kedua: ${P(x + a + c, y + b + e)}.`] });
    }]
  },
  '11.3': {
    m: [() => {
      const L = vlet(), x = nz(-4, 4), y = nz(-4, 4), onX = Math.random() < .5, X = onX ? x : -x, Y = onX ? -y : y;
      const box = { x0: -5, x1: 5, y0: -5, y1: 5, u: 34 };
      return GEN_LQ('paImej', { L, x, y, onX, X, Y, ans: `${L}′${P(X, Y)}`, work: onX ? ['Pantulan pada paksi-x: (x, y) → (x, −y).', `Koordinat-x kekal: ${fmt(x)}.`, `Koordinat-y bertukar tanda: ${fmt(y)} → ${fmt(-y)}.`] : ['Pantulan pada paksi-y: (x, y) → (−x, y).', `Koordinat-x bertukar tanda: ${fmt(x)} → ${fmt(-x)}.`, `Koordinat-y kekal: ${fmt(y)}.`] }, {
        fig: plot({ ...box, items: [{ t: 'pt', x, y, c: 'tr', l: L }], label: `Titik ${L}` }),
        figAns: plot({ ...box, items: [{ t: 'line', a: [x, y], b: [X, Y], c: 'tx', dash: true, w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: X, y: Y, c: 'gr', l: L + '′' }], label: `${L} dan ${L}′` }) });
    }, () => {
      const L = vlet(), v = nz(-5, 5), onX = Math.random() < .5, pt = onX ? P(v, 0) : P(0, v);
      return GEN_LQ('paPaksi', { L, pt, onX, ans: `${L}′${pt}`, work: [`Titik ${L} terletak pada ${PK(onX)}, iaitu paksi pantulan.`, 'Titik pada paksi pantulan tidak berubah kedudukan.', `Maka imejnya ialah titik yang sama: ${pt}.`] });
    }],
    s: [() => {
      const L = vlet(), vert = Math.random() < .5, h = ri(-2, 4), x = ri(-3, 6), y = ri(-3, 6);
      if (vert) { let px = x; if (px === h) px = h - 2; const d = h - px, X = h + d;
        return GEN_LQ('paGaris', { L, x: px, y, X, Y: y, ln: `x = ${fmt(h)}`, ans: `${L}′${P(X, y)}`, work: [`Jarak ${L} ke garis x = ${fmt(h)} ialah ${Math.abs(d)} unit.`, `Imej berada ${Math.abs(d)} unit di sebelah lain garis: x = ${fmt(X)}.`, `Koordinat-y tidak berubah: ${fmt(y)}.`] }); }
      let py = y; if (py === h) py = h - 2; const d = h - py, Y = h + d;
      return GEN_LQ('paGaris', { L, x, y: py, X: x, Y, ln: `y = ${fmt(h)}`, ans: `${L}′${P(x, Y)}`, work: [`Jarak ${L} ke garis y = ${fmt(h)} ialah ${Math.abs(d)} unit.`, `Imej berada ${Math.abs(d)} unit di sebelah lain garis: y = ${fmt(Y)}.`, `Koordinat-x tidak berubah: ${fmt(x)}.`] });
    }],
    k: [() => {
      const L = vlet(), vert = Math.random() < .5, m = ri(-3, 4), d = ri(1, 4), c = ri(-3, 4);
      if (vert) return GEN_LQ('paCari', { L, p1: P(m - d, c), p2: P(m + d, c), ans: `x = ${fmt(m)}`, work: ['Kedua-dua titik mempunyai koordinat-y yang sama, jadi paksi pantulan ialah garis mencancang.', `Titik tengah: (${fmt(m - d)} + ${par(m + d)}) ÷ 2 = ${fmt(m)}.`, `Paksi pantulan: x = ${fmt(m)}.`] });
      return GEN_LQ('paCari', { L, p1: P(c, m - d), p2: P(c, m + d), ans: `y = ${fmt(m)}`, work: ['Kedua-dua titik mempunyai koordinat-x yang sama, jadi paksi pantulan ialah garis mengufuk.', `Titik tengah: (${fmt(m - d)} + ${par(m + d)}) ÷ 2 = ${fmt(m)}.`, `Paksi pantulan: y = ${fmt(m)}.`] });
    }]
  },
  '11.4': {
    m: [() => {
      const L = vlet(), x = nz(-4, 4), y = nz(-4, 4);
      const box = { x0: -5, x1: 5, y0: -5, y1: 5, u: 34 };
      return GEN_LQ('r180', { L, x, y, ans: `${L}′${P(-x, -y)}`, work: ['Putaran 180° pada asalan: (x, y) → (−x, −y).', `Kedua-dua koordinat bertukar tanda: ${P(x, y)} → ${P(-x, -y)}.`] }, {
        fig: plot({ ...box, items: [{ t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: 0, y: 0, c: 'am' }], label: `Titik ${L}` }),
        figAns: plot({ ...box, items: [{ t: 'line', a: [x, y], b: [-x, -y], c: 'tx', dash: true, w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: -x, y: -y, c: 'gr', l: L + '′' }, { t: 'pt', x: 0, y: 0, c: 'am' }], label: `${L} dan ${L}′` }) });
    }, () => vq('putarInfo', {})],
    s: [() => {
      const L = vlet(), x = nz(-4, 4), y = nz(-4, 4), cw = Math.random() < .5, X = cw ? y : -y, Y = cw ? -x : x;
      const box = { x0: -5, x1: 5, y0: -5, y1: 5, u: 34 };
      return GEN_LQ('r90', { L, x, y, cw, X, Y, ans: `${L}′${P(X, Y)}`, work: [`Surih ${L} dan O pada kertas surih.`, `Putar kertas surih 90° ${ARAH(cw)} dengan pensel di O.`, `Baca kedudukan baharu ${L}: ${P(X, Y)}.`] }, {
        fig: plot({ ...box, items: [{ t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: 0, y: 0, c: 'am' }], label: `Titik ${L}` }),
        figAns: plot({ ...box, items: [{ t: 'line', a: [0, 0], b: [x, y], c: 'tr', w: 2.5 }, { t: 'line', a: [0, 0], b: [X, Y], c: 'gr', w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: X, y: Y, c: 'gr', l: L + '′' }, { t: 'pt', x: 0, y: 0, c: 'am' }], label: `${L} dan ${L}′` }) });
    }],
    k: [() => {
      const L = vlet(), h = ri(-2, 2), k = ri(-2, 2), dx = nz(-3, 3), dy = nz(-3, 3), x = h + dx, y = k + dy, cw = Math.random() < .5;
      const X = cw ? h + dy : h - dy, Y = cw ? k - dx : k + dx;
      return GEN_LQ('r90p', { L, x, y, h, k, cw, ans: `${L}′${P(X, Y)}`, work: [`Dari pusat ke ${L}: ${Math.abs(dx)} unit ${dx > 0 ? 'kanan' : 'kiri'}, ${Math.abs(dy)} unit ${dy > 0 ? 'atas' : 'bawah'}.`, `Putar arah gerakan itu 90° ${ARAH(cw)}.`, `Dari pusat ${P(h, k)}, imej berada di ${P(X, Y)}.`] }, {
        fig: plot({ x0: -6, x1: 6, y0: -6, y1: 6, u: 30, items: [{ t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: h, y: k, c: 'am', l: 'pusat', dy: 22 }], label: `Titik ${L} dan pusat` }),
        figAns: plot({ x0: -6, x1: 6, y0: -6, y1: 6, u: 30, items: [{ t: 'line', a: [h, k], b: [x, y], c: 'tr', w: 2.5 }, { t: 'line', a: [h, k], b: [X, Y], c: 'gr', w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: X, y: Y, c: 'gr', l: L + '′' }, { t: 'pt', x: h, y: k, c: 'am' }], label: `${L} dan ${L}′` }) });
    }]
  },
  '11.5': {
    m: [() => {
      const n = ri(3, 15), t = pick(['translasi', 'pantulan', 'putaran']), nm = pick(['ABC', 'PQR', 'KLM', 'DEF', 'XYZ']);
      return GEN_LQ('panjang', { nm, n, t, ans: `${n} cm`, work: [`${vcap(t)} ialah isometri.`, 'Isometri mengekalkan jarak antara dua titik.', `Maka panjang sisi sepadan = ${n} cm.`] });
    }, () => {
      const d = pick([30, 35, 42, 50, 58, 64, 72, 85, 96, 105, 118, 125]), t = pick(['translasi', 'pantulan', 'putaran']), nm = pick(['ABC', 'PQR', 'KLM', 'DEF', 'XYZ']);
      return GEN_LQ('sudut', { nm, d, t, ans: `${d}°`, work: [`${vcap(t)} ialah isometri.`, 'Isometri mengekalkan saiz sudut.', `Maka saiz sudut sepadan = ${d}°.`] });
    }],
    s: [() => pick([
      { q: 'Dalam pantulan, titik manakah yang tidak berubah kedudukan?', ans: 'Titik pada paksi pantulan', work: ['Titik pada paksi pantulan berjarak 0 dari paksi.', 'Imejnya berada pada kedudukan yang sama.'] },
      { q: 'Dalam putaran, titik manakah yang tidak berubah kedudukan?', ans: 'Pusat putaran', work: ['Setiap titik diputar pada pusat putaran.', 'Pusat itu sendiri tidak bergerak.'] },
      { q: 'Transformasi isometri manakah yang menghasilkan imej terbalik (songsang sisi)?', ans: 'Pantulan', work: ['Translasi dan putaran tidak menterbalikkan bentuk.', 'Pantulan menghasilkan imej yang terbalik seperti dalam cermin.'] },
      { q: 'Nyatakan tiga maklumat yang diperlukan untuk menghuraikan satu putaran.', ans: 'Pusat, sudut dan arah putaran', work: ['Pusat: titik tetap putaran.', 'Sudut: contohnya 90° atau 180°.', 'Arah: ikut atau lawan arah jam.'] },
      { q: 'Apakah maklumat yang diperlukan untuk menghuraikan satu translasi?', ans: 'Vektor translasi', work: ['Translasi ditentukan oleh jarak dan arah gerakan.', 'Kedua-duanya diwakili oleh vektor translasi.'] },
      { q: 'Apakah maklumat yang diperlukan untuk menghuraikan satu pantulan?', ans: 'Paksi pantulan', work: ['Pantulan ditentukan oleh garis cermin.', 'Garis itu dipanggil paksi pantulan.'] },
      { q: 'Dalam translasi, adakah orientasi imej sama dengan orientasi objek?', ans: 'Ya, sama', work: ['Translasi hanya menggelongsor bentuk.', 'Bentuk tidak berputar atau terbalik.'] },
      { q: 'Dalam putaran, adakah jarak setiap titik dari pusat putaran berubah?', ans: 'Tidak berubah', work: ['Setiap titik bergerak pada bulatan berpusat di pusat putaran.', 'Jaraknya dari pusat kekal sama.'] }
    ])],
    k: [() => {
      const p = ri(4, 12), l = ri(2, p - 1), t = pick(['diputar 90° pada satu titik', 'dipantulkan pada satu garis', 'ditranslasikan']), area = Math.random() < .5;
      return GEN_LQ('luas', { p, l, t, area, ans: area ? `${p * l} cm²` : `${2 * (p + l)} cm`, work: ['Transformasi ini ialah isometri, jadi imej kongruen dengan objek.', `Ukuran imej juga ${p} cm × ${l} cm.`, area ? `Luas = ${p} × ${l} = ${p * l} cm².` : `Perimeter = 2 × (${p} + ${l}) = ${2 * (p + l)} cm.`] });
    }]
  },
  '11.6': {
    m: [() => {
      const o = pick([['poly', 3, 'segi tiga sama sisi', 3], ['poly', 4, 'segi empat sama', 4], ['rect', 0, 'segi empat tepat', 2], ['poly', 5, 'pentagon sekata', 5], ['poly', 6, 'heksagon sekata', 6], ['poly', 8, 'oktagon sekata', 8], ['rhombus', 0, 'rombus', 2], ['para', 0, 'segi empat selari', 2]]);
      return GEN_LQ('bentuk', { name: o[2], ord: o[3], ans: `${o[3]}`, work: ['Bayangkan bentuk diputar satu putaran lengkap (360°).', `Kira berapa kali bentuk kelihatan sama seperti asal: ${o[3]} kali.`] }, { fig: o[0] === 'poly' || o[0] === 'rect' ? shapeSVG(o[0], o[1]) : wsShape(o[0], o[1]).replace(' class="shp"', '') });
    }, () => {
      const [h, ord] = pick([['H', 2], ['N', 2], ['S', 2], ['Z', 2], ['X', 2], ['A', 1], ['T', 1], ['L', 1], ['F', 1], ['E', 1]]);
      return GEN_LQ('huruf', { h, ord, ans: `${ord}`, work: ord === 2 ? ['Putar huruf 180°.', 'Huruf kelihatan sama seperti asal.', 'Dalam satu putaran lengkap, ia kelihatan sama 2 kali.'] : ['Putar huruf 90° dan 180°: huruf tidak kelihatan sama.', 'Ia hanya kelihatan sama selepas satu putaran lengkap.', 'Maka peringkat simetri putaran ialah 1.'] }, { fig: shapeSVG('letter', h) });
    }],
    s: [() => {
      const [h, ord] = pick([['H', 2], ['N', 2], ['S', 2], ['Z', 2], ['X', 2], ['A', 1], ['T', 1], ['L', 1], ['F', 1], ['E', 1]]);
      return GEN_LQ('huruf', { h, ord, ans: `${ord}`, work: ord === 2 ? ['Putar huruf 180°.', 'Huruf kelihatan sama seperti asal.', 'Dalam satu putaran lengkap, ia kelihatan sama 2 kali.'] : ['Putar huruf 90° dan 180°: huruf tidak kelihatan sama.', 'Ia hanya kelihatan sama selepas satu putaran lengkap.', 'Maka peringkat simetri putaran ialah 1.'] }, { fig: shapeSVG('letter', h) });
    }, () => {
      const two = shuffle(['H', 'N', 'S', 'Z', 'X', 'I']).slice(0, 2), one = shuffle(['A', 'T', 'L', 'F', 'E', 'K', 'M', 'W', 'V', 'U', 'Y']).slice(0, 2);
      const dan2 = a => a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1];
      const list = dan2(shuffle(two.concat(one))), dua = dan2(two.slice().sort()), satu = dan2(one.slice().sort());
      return GEN_LQ('pilihHuruf', { list, dua, satu, ans: dua, work: ['Bayangkan setiap huruf diputar 180°.', `${dua} kelihatan sama: peringkat 2.`, `${satu} tidak kelihatan sama: peringkat 1.`] });
    }],
    k: [() => {
      const n = pick([3, 4, 5, 6, 8, 9, 10, 12]);
      return GEN_LQ('poligon', { n, ans: `${360 / n}°`, work: [`Peringkat simetri putaran poligon sekata ${n} sisi ialah ${n}.`, `Sudut putaran terkecil = 360° ÷ ${n}.`, `= ${360 / n}°.`] });
    }]
  }
};

/* =================== LATIHAN =================== */
const LAT = { on: { '11.1': true, '11.2': true, '11.3': true, '11.4': false, '11.5': false, '11.6': false }, n: 10, qs: [], i: 0, show: false };
try { const sv0 = store().latihan; if (sv0) { Object.assign(LAT.on, sv0.on || {}); LAT.n = sv0.n || 10; } } catch (e) {}
const mix = N => { let m = Math.round(N * .6), s = Math.round(N * .3), k = N - m - s; if (k < 1 && N >= 5) { s--; k = 1; } return { m, s, k }; };
const LVL = { m: ['MUDAH', 'gr'], s: ['SEDERHANA', 'am'], k: ['SUKAR', 'rd'] };
function viewLatihan() {
  const mx = mix(LAT.n);
  const items = SUBS.map(s => `<label class="tcheck${LAT.on[s.no] ? ' on' : ''}" style="--c:${subCol(s.no)}"><input type="checkbox" data-sub="${s.no}"${LAT.on[s.no] ? ' checked' : ''}><span class="no">${s.no}</span><span>${s.name}</span></label>`).join('');
  return `<div class="wrap">${latSeg('kelas')}<div><h1 class="h1">Latihan Kelas</h1><p class="lead">Tandakan subtopik yang <b style="color:var(--tx)">sudah diajar</b>. Soalan hanya diambil daripada subtopik ini.</p></div>
    <div class="lgrid"><div class="topicl">${items}</div>
    <aside style="display:flex;flex-direction:column;gap:16px">
      <div class="pbox" style="padding:20px;gap:14px"><h3>BILANGAN SOALAN</h3>
        <div class="opts" style="grid-template-columns:repeat(3,minmax(0,1fr));--c:var(--tr)">${[5, 10, 20].map(n => `<button type="button" class="opt" data-n="${n}" aria-pressed="${LAT.n === n}" style="font-size:19px">${n}</button>`).join('')}</div>
        <h3 style="margin-top:4px">ARAS SOALAN</h3>
        <div class="mixbar" aria-hidden="true"><span style="flex:${mx.m};background:var(--gr)"></span><span style="flex:${mx.s};background:var(--am)"></span><span style="flex:${mx.k};background:var(--rd)"></span></div>
        <div class="mixrow"><i style="background:var(--gr)"></i>Mudah<b>${mx.m} soalan</b></div>
        <div class="mixrow"><i style="background:var(--am)"></i>Sederhana<b>${mx.s} soalan</b></div>
        <div class="mixrow"><i style="background:var(--rd)"></i>Sukar<b>${mx.k} soalan</b></div>
      </div>
      <p style="margin:0;color:var(--mu);font-size:15px;line-height:1.45">Soalan dijana rawak, disusun dari mudah ke sukar. Setiap set berbeza.</p>
      <button type="button" class="btn pri big" id="latGo" style="margin-top:auto"${Object.values(LAT.on).some(Boolean) ? '' : ' disabled'}>Mula Latihan ${IC.arrow}</button>
    </aside></div></div>`;
}
function makeSet() {
  const subs = SUBS.map(s => s.no).filter(no => LAT.on[no]), mx = mix(LAT.n), qs = [];
  vreset();
  ['m', 's', 'k'].forEach(l => {
    let pool = shuffle(subs);
    for (let i = 0; i < mx[l]; i++) {
      if (!pool.length) pool = shuffle(subs);
      const sub = pool.pop(), fns = GEN[sub][l];
      let q, tries = 0;
      do { q = pick(fns)(); tries++; } while (tries < 8 && qs.some(o => o.q === q.q));
      qs.push(Object.assign(q, { sub, lvl: l }));
    }
  });
  return qs;
}
function bindLatihan() {
  const main = document.getElementById('main');
  main.querySelectorAll('[data-sub]').forEach(c => c.onchange = () => { LAT.on[c.dataset.sub] = c.checked; save({ latihan: { on: LAT.on, n: LAT.n } }); render(true); });
  main.querySelectorAll('[data-n]').forEach(b => b.onclick = () => { LAT.n = +b.dataset.n; save({ latihan: { on: LAT.on, n: LAT.n } }); render(true); });
  document.getElementById('latGo').onclick = () => { LAT.qs = makeSet(); LAT.i = 0; LAT.show = false; location.hash = '#/latihan/main'; };
}
function viewLatMain() {
  if (!LAT.qs.length) { location.replace('#/latihan'); return ''; }
  if (LAT.i >= LAT.qs.length) return `<div class="gend"><p class="eyebrow">LATIHAN SELESAI</p><h1 class="h1">Syabas, kelas!</h1><p class="lead">${LAT.qs.length} soalan telah dibincangkan.</p>
    <div class="prow" style="width:100%;flex-direction:column"><button type="button" class="btn pri big" id="latAgain">Set baharu (subtopik sama)</button><a class="btn sec big" href="#/latihan">Pilih subtopik lain</a></div></div>`;
  const q = LAT.qs[LAT.i], [lv, lc] = LVL[q.lvl], so = subOf(q.sub);
  const prog = LAT.qs.map((o, k) => `<i style="background:${k <= LAT.i ? `var(--${LVL[o.lvl][1]})` : 'var(--dim)'}${k === LAT.i ? `;box-shadow:0 0 0 2px var(--nav),0 0 0 4px var(--${lc})` : ''}"></i>`).join('');
  const fig = LAT.show && q.figAns ? q.figAns : q.fig;
  return `<div class="qhead">
      <a class="btn sec" href="#/latihan" style="min-height:44px;padding:0 14px">${IC.x} Tamat</a>
      <span style="font-family:var(--head);font-weight:700;font-size:21px">Soalan ${LAT.i + 1} <span style="color:var(--mu)">/ ${LAT.qs.length}</span></span>
      <div class="qprog" aria-hidden="true">${prog}</div>
      <span style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap"><span class="chip" style="background:color-mix(in srgb,var(--${lc}) 15%,transparent);color:var(--${lc})">${lv}</span><span class="chip" style="background:color-mix(in srgb,${subCol(q.sub)} 15%,transparent);color:${subCol(q.sub)}">${q.sub} ${SHORT[q.sub]}</span></span>
    </div>
    <div class="qbody"><div class="qwrap${fig ? '' : ' nofig'}">
      <div style="display:flex;flex-direction:column;gap:18px">
        <h1 class="qtext">${q.q}</h1>
        ${LAT.show ? `<div class="ansbox"><span class="ok">${IC.check}</span><div><small>JAWAPAN</small><b>${q.ans}</b></div></div>
        <div class="work"><h3>JALAN KERJA</h3><ol>${q.work.map(w => `<li>${w}</li>`).join('')}</ol></div>` : ''}
      </div>
      ${fig ? `<div class="qfig">${fig}</div>` : ''}
    </div></div>
    <div class="qfoot">
      <button type="button" class="btn sec" id="latPrev" aria-label="Soalan sebelumnya"${LAT.i === 0 ? ' disabled' : ''}>${IC.left}<span class="lpv">Sebelumnya</span></button>
      <button type="button" class="btn sec" id="latShow">${LAT.show ? IC.eyeoff + '<span>Sorok<span class="lpv"> jawapan</span></span>' : IC.eye + '<span>Tunjuk<span class="lpv"> jawapan</span></span>'}</button>
      <button type="button" class="btn pri big" id="latNext" style="margin-left:auto">${LAT.i === LAT.qs.length - 1 ? 'Selesai' : '<span class="lpv">Soalan seterusnya</span><span class="lsh">Seterusnya</span>'} ${IC.arrow}</button>
    </div>`;
}
function bindLatMain() {
  const a = document.getElementById('latAgain');
  if (a) { a.onclick = () => { LAT.qs = makeSet(); LAT.i = 0; LAT.show = false; render(true); }; return; }
  document.getElementById('latShow').onclick = () => { LAT.show = !LAT.show; render(true); };
  document.getElementById('latPrev').onclick = () => { if (LAT.i > 0) { LAT.i--; LAT.show = false; render(true); document.getElementById('main').scrollTop = 0; } };
  document.getElementById('latNext').onclick = () => { LAT.i++; LAT.show = false; render(true); document.getElementById('main').scrollTop = 0; };
}

/* =================== GAMES: Cabaran 60 Saat =================== */
const REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ---------- bunyi (dijana, tiada fail) ---------- */
const SND = { ctx: null };
function snd(kind) {
  if (store().mute) return;
  try {
    const C = SND.ctx || (SND.ctx = new (window.AudioContext || window.webkitAudioContext)());
    if (C.state === 'suspended') C.resume();
    const t = C.currentTime;
    const tone = (f, st, d, type = 'sine', g = .16, f2) => {
      const o = C.createOscillator(), v = C.createGain(); o.type = type;
      o.frequency.setValueAtTime(f, t + st); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + st + d);
      v.gain.setValueAtTime(0, t + st); v.gain.linearRampToValueAtTime(g, t + st + .01); v.gain.exponentialRampToValueAtTime(.001, t + st + d);
      o.connect(v); v.connect(C.destination); o.start(t + st); o.stop(t + st + d + .05);
    };
    if (kind === 'ok') { tone(880, 0, .12); tone(1320, .09, .24); }
    else if (kind === 'combo') { tone(660, 0, .1); tone(990, .08, .1); tone(1320, .16, .28); }
    else if (kind === 'no') tone(220, 0, .3, 'square', .07, 140);
    else if (kind === 'tap') tone(620, 0, .05, 'triangle', .07);
    else if (kind === 'end') { tone(523, 0, .16); tone(659, .15, .16); tone(784, .3, .34); }
  } catch (e) {}
}
/* ---------- kesan ---------- */
function burst(el, col) {
  if (REDUCE || !el || !el.getBoundingClientRect) return;
  const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span'); s.className = 'spark';
    s.style.left = cx + 'px'; s.style.top = cy + 'px'; s.style.background = col || 'var(--am)';
    document.body.appendChild(s);
    const a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 110;
    const an = s.animate([{ transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 1 }, { transform: `translate(calc(-50% + ${(Math.cos(a) * d).toFixed(0)}px), calc(-50% + ${(Math.sin(a) * d).toFixed(0)}px)) scale(.2) rotate(200deg)`, opacity: 0 }], { duration: 700 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' });
    an.onfinish = () => s.remove();
  }
}
function shake(el) { if (!REDUCE && el && el.animate) el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-12px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 440 }); }

/* ---------- rajah games (unit dunia, y ke atas) ---------- */
const NS = 'http://www.w3.org/2000/svg';
const pstr = p => p.map(([x, y]) => `${+x.toFixed(3)},${+(-y).toFixed(3)}`).join(' ');
function gSvg(R, inner, label, axes = true) {
  let s = '';
  for (let i = -R; i <= R; i++) s += `<line x1="${i}" y1="${-R}" x2="${i}" y2="${R}" style="stroke:var(--grid)" stroke-width=".05"/><line x1="${-R}" y1="${i}" x2="${R}" y2="${i}" style="stroke:var(--grid)" stroke-width=".05"/>`;
  if (axes) {
    s += `<line x1="${-R}" y1="0" x2="${R}" y2="0" style="stroke:var(--mu)" stroke-width=".08"/><line x1="0" y1="${-R}" x2="0" y2="${R}" style="stroke:var(--mu)" stroke-width=".08"/>`;
    for (let i = -R + 1; i < R; i++) if (i && i % 2 === 0) s += `<text x="${i}" y=".62" font-size=".42" text-anchor="middle" style="fill:var(--mu)">${fmt(i)}</text><text x="-.22" y="${-i + .15}" font-size=".42" text-anchor="end" style="fill:var(--mu)">${fmt(i)}</text>`;
  }
  return `<svg id="gsvg" viewBox="${-R - .6} ${-R - .6} ${2 * R + 1.2} ${2 * R + 1.2}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}${inner}</svg>`;
}
const gPoly = (p, c, dash, id) => `<polygon${id ? ` id="${id}"` : ''} points="${pstr(p)}" style="fill:var(--${c});fill-opacity:.22;stroke:var(--${c})" stroke-width=".12" stroke-linejoin="round"${dash ? ' stroke-dasharray=".35 .22"' : ''}/>`;
const gPt = (x, y, c, lab, dy = -.45) => `<circle cx="${x}" cy="${-y}" r=".3" style="fill:var(--${c})"/>${lab ? `<text x="${x + .4}" y="${-y + dy}" font-size=".6" font-weight="700" font-family="Space Grotesk, sans-serif" style="fill:var(--${c})">${lab}</text>` : ''}`;
const gLine = (a, b, c, w = .1, dash) => `<line x1="${a[0]}" y1="${-a[1]}" x2="${b[0]}" y2="${-b[1]}" style="stroke:var(--${c})" stroke-width="${w}"${dash ? ' stroke-dasharray=".3 .2"' : ''}/>`;

/* animasi: gerakkan salinan objek ke kedudukan imej */
function playAnim(an, done) {
  const svg = document.getElementById('gsvg');
  if (!svg || !an) { if (done) done(); return; }
  const single = an.from.length === 1, col = an.col || 'gr';
  const trail = document.createElementNS(NS, 'polyline');
  trail.setAttribute('fill', 'none'); trail.setAttribute('stroke-width', '.08'); trail.setAttribute('stroke-dasharray', '.25 .18'); trail.setAttribute('style', `stroke:var(--${col})`);
  const el = document.createElementNS(NS, single ? 'circle' : 'polygon');
  if (single) { el.setAttribute('r', '.36'); el.setAttribute('style', `fill:var(--${col});stroke:var(--tx)`); el.setAttribute('stroke-width', '.07'); }
  else { el.setAttribute('style', `fill:var(--${col});fill-opacity:.3;stroke:var(--${col})`); el.setAttribute('stroke-width', '.14'); el.setAttribute('stroke-linejoin', 'round'); }
  svg.appendChild(trail); svg.appendChild(el);
  const at = t => an.from.map((p, i) => {
    const q = an.to[i];
    if (an.kind === 'pu') { const th = an.th * t * Math.PI / 180, dx = p[0] - an.cx, dy = p[1] - an.cy; return [an.cx + dx * Math.cos(th) - dy * Math.sin(th), an.cy + dx * Math.sin(th) + dy * Math.cos(th)]; }
    if (an.kind === 'L') { if (t < .5) { const u = t * 2; return [p[0] + (q[0] - p[0]) * u, p[1]]; } const u = (t - .5) * 2; return [q[0], p[1] + (q[1] - p[1]) * u]; }
    return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  });
  const path = [], D = REDUCE ? 250 : 1100, t0 = performance.now();
  if (an.cx != null) { const c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', an.cx); c.setAttribute('cy', -an.cy); c.setAttribute('r', '.25'); c.setAttribute('style', 'fill:var(--am)'); svg.appendChild(c); }
  const frame = now => {
    const k = Math.min(1, (now - t0) / D), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const p = at(e);
    if (single) { el.setAttribute('cx', p[0][0]); el.setAttribute('cy', -p[0][1]); path.push(p[0]); trail.setAttribute('points', pstr(path)); }
    else { el.setAttribute('points', pstr(p)); path.push(p[0]); trail.setAttribute('points', pstr(path)); }
    if (k < 1) requestAnimationFrame(frame); else if (done) done();
  };
  requestAnimationFrame(frame);
}
function rotAnim(angle, done) {
  const g = document.getElementById('gRot');
  if (!g) { if (done) done(); return; }
  const D = REDUCE ? 250 : 1200, t0 = performance.now();
  const frame = now => { const k = Math.min(1, (now - t0) / D), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; g.setAttribute('transform', `rotate(${(angle * e).toFixed(2)} 150 150)`); if (k < 1) requestAnimationFrame(frame); else if (done) done(); };
  requestAnimationFrame(frame);
}

/* ---------- penjana soalan games ---------- */
const SHAPE = [[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]]; // bentuk L (tidak simetri)
function tfm(kind) {
  for (let t = 0; t < 80; t++) {
    const ox = ri(-6, 1), oy = ri(-6, 1), o = SHAPE.map(([x, y]) => [x + ox, y + oy]);
    let im, an = { kind: 'lin' }, extra = '';
    if (kind === 'Translasi') { const a = nz(-6, 6), b = nz(-6, 6); im = o.map(([x, y]) => [x + a, y + b]); }
    else if (kind === 'Pantulan') {
      if (Math.random() < .5) { const h = ri(-2, 3); im = o.map(([x, y]) => [2 * h - x, y]); extra = gLine([h, -7], [h, 7], 'pa', .1, true); }
      else { const k = ri(-2, 3); im = o.map(([x, y]) => [x, 2 * k - y]); extra = gLine([-7, k], [7, k], 'pa', .1, true); }
    } else if (kind === 'Putaran') {
      const cx = ri(-2, 2), cy = ri(-2, 2), r = pick([90, 180, 270]);
      im = o.map(([x, y]) => { const dx = x - cx, dy = y - cy; return r === 90 ? [cx - dy, cy + dx] : r === 180 ? [cx - dx, cy - dy] : [cx + dy, cy - dx]; });
      an = { kind: 'pu', cx, cy, th: r === 270 ? -90 : r };
    } else { const cx = o[0][0], cy = o[0][1]; im = o.map(([x, y]) => [cx + 2 * (x - cx) + 3, cy + 2 * (y - cy) + 1]); }
    const all = o.concat(im);
    if (all.every(([x, y]) => x >= -7 && x <= 7 && y >= -7 && y <= 7)) {
      const bb = p => [Math.min(...p.map(q => q[0])), Math.max(...p.map(q => q[0])), Math.min(...p.map(q => q[1])), Math.max(...p.map(q => q[1]))];
      const A = bb(o), B = bb(im), overlap = !(A[1] < B[0] || B[1] < A[0] || A[3] < B[2] || B[3] < A[2]);
      if (!overlap || t > 60) return { o, im, an: Object.assign(an, { from: o, to: im, col: 'gr' }), extra };
    }
  }
  return null;
}
const GOPT4 = ['Translasi', 'Pantulan', 'Putaran', 'Bukan isometri'];
function gTap(level) {
  // soalan ketik: cari kedudukan imej titik A
  const pool = level === 0 ? ['tr', 'px', 'py'] : level === 1 ? ['tr', 'px', 'py', 'r180', 'xh', 'yk'] : ['tr', 'xh', 'yk', 'r90', 'r270', 'r180'];
  for (let k = 0; k < 60; k++) {
    const t = pick(pool), x = nz(-5, 5), y = nz(-5, 5);
    let q, T, extra = '', an = { kind: 'lin' };
    if (t === 'tr') { const a = nz(-4, 4), b = nz(-4, 4); T = [x + a, y + b]; q = `A ditranslasikan oleh ${vec(a, b)}. Ketik kedudukan imej A′.`; an = { kind: 'L' }; }
    if (t === 'px') { T = [x, -y]; q = 'A dipantulkan pada <b>paksi-x</b>. Ketik kedudukan imej A′.'; extra = gLine([-6, 0], [6, 0], 'pa', .14); }
    if (t === 'py') { T = [-x, y]; q = 'A dipantulkan pada <b>paksi-y</b>. Ketik kedudukan imej A′.'; extra = gLine([0, -6], [0, 6], 'pa', .14); }
    if (t === 'xh') { const h = nz(-3, 3); T = [2 * h - x, y]; q = `A dipantulkan pada garis <b>x = ${fmt(h)}</b>. Ketik kedudukan imej A′.`; extra = gLine([h, -6], [h, 6], 'pa', .14) + `<text x="${h + .2}" y="-5.4" font-size=".5" font-weight="700" style="fill:var(--pa)">x = ${fmt(h)}</text>`; }
    if (t === 'yk') { const kk = nz(-3, 3); T = [x, 2 * kk - y]; q = `A dipantulkan pada garis <b>y = ${fmt(kk)}</b>. Ketik kedudukan imej A′.`; extra = gLine([-6, kk], [6, kk], 'pa', .14) + `<text x="-5.8" y="${-kk - .25}" font-size=".5" font-weight="700" style="fill:var(--pa)">y = ${fmt(kk)}</text>`; }
    if (t === 'r180') { T = [-x, -y]; q = 'A diputar <b>180°</b> pada asalan O. Ketik kedudukan imej A′.'; an = { kind: 'pu', cx: 0, cy: 0, th: 180 }; }
    if (t === 'r90') { T = [y, -x]; q = 'A diputar <b>90° ikut arah jam</b> pada asalan O. Ketik kedudukan imej A′.'; an = { kind: 'pu', cx: 0, cy: 0, th: -90 }; }
    if (t === 'r270') { T = [-y, x]; q = 'A diputar <b>90° lawan arah jam</b> pada asalan O. Ketik kedudukan imej A′.'; an = { kind: 'pu', cx: 0, cy: 0, th: 90 }; }
    if (Math.abs(T[0]) > 6 || Math.abs(T[1]) > 6 || (T[0] === x && T[1] === y)) continue;
    const fig = gSvg(6, extra + gPt(x, y, 'tr', `A${P(x, y)}`) + `<g id="gTap" visibility="hidden"><circle r=".42" style="fill:none;stroke:var(--am)" stroke-width=".12"/><path d="M-.6 0H.6M0 -.6V.6" style="stroke:var(--am)" stroke-width=".1"/></g>`, 'Satah Cartes dengan titik A. Ketik untuk meletakkan imej.');
    return { type: 'tap', q, fig, target: T, anim: Object.assign(an, { from: [[x, y]], to: [T], col: 'gr' }) };
  }
  return gTap(0);
}
function gq(level) {
  const types = level === 0 ? ['kenal', 'tap', 'tap', 'simetri'] : level === 1 ? ['kenal', 'tap', 'tap', 'vektor', 'simetri'] : ['kenal', 'tap', 'tap', 'vektor', 'simetri'];
  const ty = pick(types);
  if (ty === 'tap') return gTap(level);
  if (ty === 'kenal') {
    const kinds = level === 0 ? ['Translasi', 'Pantulan', 'Putaran'] : GOPT4;
    const k = pick(kinds), r = tfm(k);
    if (!r) return gq(level);
    return { type: 'mcq', q: 'Transformasi apakah yang memetakan objek kepada imej?', fig: gSvg(7, gPoly(r.o, 'tr', false) + gPoly(r.im, 'pa', true), 'Objek biru, imej oren', false), opts: GOPT4, c: GOPT4.indexOf(k), legend: true, anim: r.an, reveal: r.extra };
  }
  if (ty === 'vektor') {
    let x, y, a, b; do { x = ri(-5, 3); y = ri(-5, 3); a = nz(-5, 5); b = nz(-5, 5); } while (Math.abs(x + a) > 6 || Math.abs(y + b) > 6);
    const cands = [[-a, -b], [b, a], [a, -b], [-a, b], [a + 1, b]];
    const seen = new Set([a + ',' + b]), wrong = [];
    for (const c of shuffle(cands)) { if (!seen.has(c.join(','))) { seen.add(c.join(',')); wrong.push(c); } if (wrong.length === 3) break; }
    const right = [a, b], opts = shuffle([right, ...wrong]);
    return { type: 'mcq', q: 'Vektor translasi yang memetakan P kepada P′?', fig: gSvg(6, gPt(x, y, 'tr', `P${P(x, y)}`) + gPt(x + a, y + b, 'pa', `P′${P(x + a, y + b)}`), 'Titik P dan P′'), opts: opts.map(p => vec(p[0], p[1])), c: opts.indexOf(right), anim: { kind: 'L', from: [[x, y]], to: [[x + a, y + b]], col: 'gr' } };
  }
  const o = pick([['poly', 3, 3], ['poly', 4, 4], ['poly', 5, 5], ['poly', 6, 6], ['rect', 0, 2], ['letter', 'S', 2], ['letter', 'Z', 2], ['letter', 'H', 2], ['letter', 'N', 2], ['letter', 'L', 1], ['letter', 'T', 1]]);
  const nums = shuffle([1, 2, 3, 4, 5, 6].filter(n => n !== o[2])).slice(0, 3).concat(o[2]).sort((p, q) => p - q);
  return { type: 'mcq', q: 'Apakah peringkat simetri putaran bagi bentuk ini?', fig: shapeSVG(o[0], o[1]).replace(/(<svg[^>]*>)([\s\S]*)<\/svg>$/, '$1<g id="gRot">$2</g></svg>'), opts: nums.map(String), c: nums.indexOf(o[2]), rot: 360 / o[2] };
}

/* ---------- keadaan & paparan ---------- */
const G = { st: 'intro', score: 0, lives: 3, combo: 0, right: 0, q: null, pick: -1, tap: null, ok: null, end: 0, pausedAt: 0, timer: 0, newBest: false, gain: 0 };
function gLevel() { return G.score < 100 ? 0 : G.score < 250 ? 1 : 2; }
const answered = () => G.ok !== null;
function viewGames() {
  const best = store().best || 0, mute = !!store().mute;
  const muteBtn = `<button type="button" class="ib" id="gMute" aria-label="${mute ? 'Hidupkan bunyi' : 'Senyapkan bunyi'}" aria-pressed="${mute}">${mute ? sv('<path d="M11 5L6 9H2v6h4l5 4zM23 9l-6 6M17 9l6 6"/>', 20) : sv('<path d="M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>', 20)}</button>`;
  if (G.st === 'intro') return `<div class="wrap" style="max-width:880px">
    <div class="headrow"><div><p class="eyebrow">GAMES</p><h1 class="h1">Cabaran 60 Saat</h1><p class="lead">Jawab seberapa banyak soalan dalam masa 60 saat.</p></div>${muteBtn}</div>
    <div class="pbox" style="padding:22px"><ul class="rules">
      <li>${IC.clock}<span>Masa <b>60 saat</b>. Ada soalan <b>pilih jawapan</b> dan soalan <b>ketik pada grid</b>.</span></li>
      <li><span style="color:var(--rd);display:flex">${IC.heart.replace('<svg ', '<svg width="26" height="26" fill="currentColor" ')}</span><span>Ada <b>3 nyawa</b>. Jawapan salah menolak satu nyawa.</span></li>
      <li><span style="color:var(--pa);display:flex">${IC.fire}</span><span>Betul berturut-turut untuk <b>combo</b>: markah berganda sehingga ×5.</span></li>
      <li><span style="color:var(--am);display:flex">${IC.star}</span><span>Selepas menjawab, lihat animasi transformasi yang betul.</span></li>
    </ul></div>
    <div class="prow" style="align-items:center;flex-wrap:wrap;gap:14px"><span class="chip" style="height:44px;font-size:16px;background:color-mix(in srgb,var(--am) 14%,transparent);color:var(--am)">${IC.star} Rekod: ${best}</span>
    <button type="button" class="btn pri big" id="gStart" style="margin-left:auto">Mula ${IC.arrow}</button></div></div>`;
  if (G.st === 'end') return `<div class="gend" id="gEnd"><p class="eyebrow">${G.lives <= 0 ? 'NYAWA HABIS' : 'MASA TAMAT'}</p><div class="score">${G.score}</div><p class="lead" style="margin:0">markah · ${G.right} jawapan betul</p>
    ${G.newBest ? `<span class="chip" style="height:42px;font-size:16px;background:color-mix(in srgb,var(--am) 16%,transparent);color:var(--am)">${IC.star} Rekod baharu!</span>` : `<span class="chip" style="height:42px;font-size:16px;background:var(--surf);border:1px solid var(--bd);color:var(--mu)">Rekod: ${best}</span>`}
    <div class="prow" style="width:100%;flex-direction:column;margin-top:8px"><button type="button" class="btn pri big" id="gStart">Main lagi</button><a class="btn sec big" href="#/nota">Ulang kaji nota</a></div></div>`;
  const q = G.q, left = Math.max(0, G.end - (G.pausedAt || Date.now())), sec = Math.ceil(left / 1000);
  const hearts = [0, 1, 2].map(i => i < G.lives ? IC.heart.replace('<svg ', '<svg style="fill:var(--rd)" ') : IC.heart.replace('<svg ', '<svg style="fill:none;stroke:var(--dim);stroke-width:2" ')).join('');
  const mult = Math.min(G.combo, 5);
  let fb = '';
  if (answered()) fb = G.ok ? `<div class="gfb ok" id="gFb">${IC.check} Betul! +${G.gain}${mult > 1 ? ` (combo ×${mult})` : ''}</div>`
    : `<div class="gfb no" id="gFb">${IC.x} Salah. Jawapan: <span style="color:var(--tx)">${q.type === 'tap' ? 'A′' + P(q.target[0], q.target[1]) : q.opts[q.c]}</span></div>`;
  let side;
  if (q.type === 'tap') side = `<p style="margin:0;font-size:17px;color:var(--mu)">${answered() ? '' : 'Ketik pada titik persilangan grid.'} Pilihan anda: <b id="gTapTxt" style="color:var(--tx)">${G.tap ? 'A′' + P(G.tap[0], G.tap[1]) : '–'}</b></p>
      <button type="button" class="btn pri big" id="gCheck"${G.tap && !answered() ? '' : ' disabled'}>${IC.check} Semak</button>`;
  else side = `<div class="gopts">${q.opts.map((t, i) => `<button type="button" class="gopt${answered() ? (i === q.c ? ' right' : (i === G.pick ? ' wrong' : '')) : ''}" data-o="${i}"${answered() ? ' disabled' : ''}><span class="k">${'ABCD'[i]}</span><span>${t}</span></button>`).join('')}</div>`;
  let fig = q.fig;
  if (q.type === 'tap' && G.tap) fig = fig.replace('<g id="gTap" visibility="hidden">', `<g id="gTap" transform="translate(${G.tap[0]} ${-G.tap[1]})"${answered() && !G.ok ? ' style="--am:var(--rd)"' : ''}>`);
  if (answered() && q.reveal) fig = fig.replace('</svg>', q.reveal + '</svg>');
  return `<div class="wrap" style="gap:14px">
    <div class="ghud"><div class="hearts" role="img" aria-label="${G.lives} nyawa">${hearts}</div>
      <div class="tbar" role="timer" aria-label="${sec} saat lagi"><div class="bar"><i id="tfill" style="width:${left / 600}%;background:${sec <= 10 ? 'var(--rd)' : 'var(--gr)'}"></i></div><b id="tsec">${sec}s</b></div>
      ${G.combo > 1 ? `<span class="chip combo${G.combo >= 3 ? ' hot' : ''}" id="gCombo" style="height:42px;font-size:16px;background:color-mix(in srgb,var(--pa) 15%,transparent);color:var(--pa)">${IC.fire} Combo ×${mult}</span>` : ''}
      <span class="chip" style="height:42px;font-size:16px;background:var(--surf);border:1px solid var(--bd);color:var(--mu)">Skor <b id="gScore" style="font-family:var(--head);font-size:22px;color:var(--tx)">${G.score}</b></span>${muteBtn}</div>
    <div class="gq" id="gq">
      <div class="gfig${q.type === 'tap' ? ' tap' : ''}">${fig}${q.legend ? '<p style="margin:6px 0 0;text-align:center;font-size:14px;color:var(--mu)"><b style="color:var(--tr)">Biru</b>: objek · <b style="color:var(--pa)">Oren</b>: imej</p>' : ''}</div>
      <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
        <h1 class="qtext" style="font-size:clamp(21px,2.3vw,30px)">${q.q}</h1>
        ${side}
        ${fb}
      </div></div></div>`;
}
function gStart() {
  G.st = 'play'; G.score = 0; G.lives = 3; G.combo = 0; G.right = 0; G.pick = -1; G.tap = null; G.ok = null; G.newBest = false; G.pausedAt = 0;
  G.q = gq(0); G.end = Date.now() + 60000; clearInterval(G.timer); G.timer = setInterval(gTick, 200); render(true);
}
function gTick() {
  if (!location.hash.startsWith('#/games') && !(ajIsPlay() && ajCur() && ajCur().t === 'game')) { clearInterval(G.timer); G.st = 'intro'; return; }
  if (G.pausedAt) return;
  const left = G.end - Date.now();
  if (left <= 0) return gOver();
  const f = document.getElementById('tfill'), s = document.getElementById('tsec');
  if (f) { f.style.width = (left / 600) + '%'; if (left <= 10000) f.style.background = 'var(--rd)'; }
  if (s) s.textContent = Math.ceil(left / 1000) + 's';
}
function gOver() {
  clearInterval(G.timer); G.st = 'end';
  const best = store().best || 0;
  G.newBest = G.score > best;
  if (G.newBest) save({ best: G.score, stars: Math.min(5, Math.floor(G.score / 60)) });
  render(true); snd('end');
  if (G.newBest) setTimeout(() => burst(document.querySelector('.gend .score'), 'var(--am)'), 150);
}
function gAnswer(ok) {
  G.ok = ok; G.pausedAt = Date.now();
  if (ok) { G.combo++; G.right++; G.gain = 10 * Math.min(Math.max(G.combo, 1), 5); G.score += G.gain; }
  else { G.combo = 0; G.lives--; G.gain = 0; }
  render(true);
  snd(ok ? (G.combo >= 3 ? 'combo' : 'ok') : 'no');
  if (ok) { burst(G.q.type === 'tap' ? document.getElementById('gCheck') : document.querySelector('.gopt.right'), 'var(--am)'); const sc = document.getElementById('gScore'); if (sc && sc.animate && !REDUCE) sc.animate([{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 400 }); }
  else shake(document.getElementById('gq'));
  const q = G.q, next = () => setTimeout(() => {
    if (G.st !== 'play') return;
    G.end += Date.now() - G.pausedAt; G.pausedAt = 0;
    if (G.lives <= 0 || Date.now() >= G.end) return gOver();
    G.pick = -1; G.tap = null; G.ok = null; G.q = gq(gLevel()); render(true);
  }, ok ? 500 : 1100);
  setTimeout(() => {
    if (q.rot) rotAnim(q.rot, next);
    else playAnim(q.anim, () => {
      if (q.type === 'tap') { const svg = document.getElementById('gsvg'); if (svg) svg.insertAdjacentHTML('beforeend', `<text x="${q.target[0] + .45}" y="${-q.target[1] + .75}" font-size=".6" font-weight="700" font-family="Space Grotesk, sans-serif" style="fill:var(--gr)">A′</text>`); }
      next();
    });
  }, 250);
}
function bindGames() {
  const st = document.getElementById('gStart'); if (st) st.onclick = () => { snd('tap'); gStart(); };
  const mu = document.getElementById('gMute'); if (mu) mu.onclick = () => { save({ mute: !store().mute }); render(true); };
  if (G.st !== 'play') return;
  document.querySelectorAll('[data-o]').forEach(b => b.onclick = () => { if (answered()) return; G.pick = +b.dataset.o; gAnswer(G.pick === G.q.c); });
  const svg = document.getElementById('gsvg');
  if (G.q.type === 'tap' && svg && !answered()) {
    svg.addEventListener('pointerup', e => {
      if (answered()) return;
      const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const m = svg.getScreenCTM(); if (!m) return;
      const w = pt.matrixTransform(m.inverse()), x = Math.max(-6, Math.min(6, Math.round(w.x))), y = Math.max(-6, Math.min(6, Math.round(-w.y)));
      G.tap = [x, y]; snd('tap');
      const g = document.getElementById('gTap'); g.removeAttribute('visibility'); g.setAttribute('transform', `translate(${x} ${-y})`);
      document.getElementById('gTapTxt').textContent = 'A′' + P(x, y);
      document.getElementById('gCheck').disabled = false;
    });
  }
  const ck = document.getElementById('gCheck');
  if (ck) ck.onclick = () => { if (!G.tap || answered()) return; gAnswer(G.tap[0] === G.q.target[0] && G.tap[1] === G.q.target[1]); };
}

/* =================== Penghala =================== */
function render(keepScroll) {
  const h = location.hash.replace(/^#\/?/, ''), p = h.split('/').filter(Boolean);
  const sc = keepScroll && document.getElementById('main') ? document.getElementById('main').scrollTop : 0;
  if (!p.length) { app.innerHTML = viewSplash(); document.title = 'ISOMOVE – Transformasi Isometri'; return; }
  const tab = p[0];
  let inner = '', bind = () => {};
  if (tab === 'k' && p[1] && p[2] === 'tayang') { viewKongsi(p[1]); if (!AJK.plan) { if (AJK.err) location.replace('#/k/' + p[1]); return; } const v = viewTayang(); if (!v) return; app.innerHTML = v; document.title = 'Mengajar · ISOMOVE'; bindTayang(); return; }
  if (tab === 'k' && p[1]) { app.innerHTML = viewKongsi(p[1]); document.title = 'Pelan dikongsi · ISOMOVE'; bindKongsi(); return; }
  if (tab === 'ajar' && p[1] === 'tayang') { const v = viewTayang(); if (!v) return; app.innerHTML = v; document.title = 'Mengajar · ISOMOVE'; bindTayang(); return; }
  if (tab === 'ajar') { inner = viewSusun(); bind = bindSusun; document.title = 'Mula Mengajar · ISOMOVE'; }
  else if (tab === 'nota' && p[1]) { inner = viewSlide(p[1], +p[2] || 1); bind = bindSlide; document.title = `${p[1]} Nota · ISOMOVE`; }
  else if (tab === 'nota') { inner = viewNotaList(); bind = bindNotaList; document.title = 'Nota · ISOMOVE'; }
  else if (tab === 'teroka') { inner = viewTeroka(p[1]); bind = bindTeroka; document.title = 'Teroka · ISOMOVE'; }
  else if (tab === 'latihan' && p[1] === 'lembaran') { inner = viewLembaran(); bind = bindLembaran; document.title = 'Lembaran Kerja · ISOMOVE'; }
  else if (tab === 'latihan' && p[1] === 'main') { inner = viewLatMain(); bind = bindLatMain; document.title = 'Latihan · ISOMOVE'; }
  else if (tab === 'latihan') { inner = viewLatihan(); bind = bindLatihan; document.title = 'Latihan · ISOMOVE'; }
  else if (tab === 'games') { inner = viewGames(); bind = bindGames; document.title = 'Games · ISOMOVE'; }
  else { location.replace('#/nota'); return; }
  if (!inner) return;
  app.innerHTML = shell(tab, inner);
  bindShell(); bind();
  if (keepScroll) { const m = document.getElementById('main'); if (m) m.scrollTop = sc; }
}
window.addEventListener('hashchange', () => { render(false); });
window.addEventListener('DOMContentLoaded', () => { setMeta(); render(false); });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {}));
