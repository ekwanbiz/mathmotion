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
const TABS = [['nota', 'NOTA'], ['teroka', 'TEROKA'], ['latihan', 'LATIHAN'], ['games', 'GAMES']];
function shell(tab, inner) {
  const light = isLight();
  const fsOk = document.fullscreenEnabled;
  return `<div class="app tabbed">
  <header class="hdr">
    <a class="ib" href="../#/utama" aria-label="Kembali ke MATHMOTION (semua bab)">${IC.mm}</a>
    <a class="wm" href="#/">ISO<span>MOVE</span></a>
    <nav class="tabs" aria-label="Tab utama">${TABS.map(([k, t]) => `<a href="#/${k}"${k === tab ? ' aria-current="page"' : ''}>${IC[k]}<span>${t}</span></a>`).join('')}</nav>
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
    <a class="btn pri big" href="#/nota">Jom Mula! ${IC.arrow}</a>
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

function printSlides(list) {
  const pr = document.getElementById('print');
  pr.innerHTML = list.map(s => `<section class="ps"><div class="pshead"><span>ISOMOVE · ${s.sub} ${subOf(s.sub).name}</span><span>Slaid ${s.n} / ${s.N}</span></div>${slideHTML(s, true)}</section>`).join('');
  const wasDark = !isLight();
  if (wasDark) document.documentElement.classList.add('light');
  const done = () => { if (wasDark) document.documentElement.classList.remove('light'); pr.innerHTML = ''; window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  setTimeout(() => { window.print(); if (!('onafterprint' in window)) setTimeout(done, 500); }, 60);
}

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

/* =================== TEROKA (simulasi) =================== */
const SIMDEF = { translasi: ['Translasi', 'tr', 'am'], pantulan: ['Pantulan', 'tr', 'pa'], putaran: ['Putaran', 'tr', 'pu'] };
const SIM0 = () => ({ pts: [[1, 1], [4, 1], [1, 3]], a: 4, b: 2, ax: 'y', h: 0, k: 0, ang: 90, dir: 'ikut', cx: 0, cy: 0, show: { img: true, line: true, coord: false }, t: 1 });
let SIM = SIM0(), simType = 'translasi', simAnim = 0;
const LAB = ['A', 'B', 'C'];
function simImg(p, t = 1) {
  const [x, y] = p;
  if (simType === 'translasi') return [x + SIM.a * t, y + SIM.b * t];
  if (simType === 'pantulan') {
    let q;
    if (SIM.ax === 'x') q = [x, -y]; else if (SIM.ax === 'y') q = [-x, y];
    else if (SIM.ax === 'v') q = [2 * SIM.h - x, y]; else if (SIM.ax === 'h') q = [x, 2 * SIM.k - y]; else q = [y, x];
    return [x + (q[0] - x) * t, y + (q[1] - y) * t];
  }
  const sign = SIM.ang === 180 ? 1 : (SIM.dir === 'ikut' ? -1 : 1);
  const th = sign * SIM.ang * Math.PI / 180 * t, dx = x - SIM.cx, dy = y - SIM.cy;
  const r = v => Math.round(v * 1e6) / 1e6;
  return [r(SIM.cx + dx * Math.cos(th) - dy * Math.sin(th)), r(SIM.cy + dx * Math.sin(th) + dy * Math.cos(th))];
}
function simRule() {
  if (simType === 'translasi') return `(x, y) → (x ${SIM.a < 0 ? '−' : '+'} ${Math.abs(SIM.a)}, y ${SIM.b < 0 ? '−' : '+'} ${Math.abs(SIM.b)})`;
  if (simType === 'pantulan') return { x: 'Paksi-x: (x, y) → (x, −y)', y: 'Paksi-y: (x, y) → (−x, y)', v: `Garis x = ${fmt(SIM.h)}`, h: `Garis y = ${fmt(SIM.k)}`, yx: 'Garis y = x: (x, y) → (y, x)' }[SIM.ax];
  return `${SIM.ang}°${SIM.ang === 180 ? '' : (SIM.dir === 'ikut' ? ' ikut arah jam' : ' lawan arah jam')} pada ${P(SIM.cx, SIM.cy)}`;
}
function simSVG() {
  const R = 8, Y = y => -y, [, oc, ic] = SIMDEF[simType];
  let s = '';
  for (let i = -R; i <= R; i++) s += `<line x1="${i}" y1="${-R}" x2="${i}" y2="${R}" style="stroke:var(--grid)" stroke-width=".05"/><line x1="${-R}" y1="${i}" x2="${R}" y2="${i}" style="stroke:var(--grid)" stroke-width=".05"/>`;
  s += `<line x1="${-R}" y1="0" x2="${R}" y2="0" style="stroke:var(--mu)" stroke-width=".08"/><line x1="0" y1="${-R}" x2="0" y2="${R}" style="stroke:var(--mu)" stroke-width=".08"/>`;
  for (let i = -R + 2; i < R; i += 2) if (i) s += `<text x="${i}" y=".62" font-size=".42" text-anchor="middle" style="fill:var(--mu)">${fmt(i)}</text><text x="-.22" y="${Y(i) + .15}" font-size=".42" text-anchor="end" style="fill:var(--mu)">${fmt(i)}</text>`;
  s += `<text x="${R - .15}" y="-.25" font-size=".5" font-style="italic" text-anchor="end" style="fill:var(--mu)">x</text><text x=".25" y="${-R + .5}" font-size=".5" font-style="italic" style="fill:var(--mu)">y</text>`;
  // paksi pantulan
  if (simType === 'pantulan') {
    const L = { x: [[-R, 0], [R, 0]], y: [[0, -R], [0, R]], v: [[SIM.h, -R], [SIM.h, R]], h: [[-R, SIM.k], [R, SIM.k]], yx: [[-R, -R], [R, R]] }[SIM.ax];
    s += `<line x1="${L[0][0]}" y1="${Y(L[0][1])}" x2="${L[1][0]}" y2="${Y(L[1][1])}" style="stroke:var(--pa)" stroke-width=".14" stroke-linecap="round"/>`;
  }
  const img = SIM.pts.map(p => simImg(p, SIM.t));
  const fin = SIM.pts.map(p => simImg(p, 1));
  // garis penyambung
  if (SIM.show.line && SIM.show.img) {
    if (simType === 'putaran') SIM.pts.forEach((p, i) => { s += `<line x1="${SIM.cx}" y1="${Y(SIM.cy)}" x2="${p[0]}" y2="${Y(p[1])}" style="stroke:var(--tx)" stroke-width=".05" stroke-dasharray=".2 .16" opacity=".6"/><line x1="${SIM.cx}" y1="${Y(SIM.cy)}" x2="${fin[i][0]}" y2="${Y(fin[i][1])}" style="stroke:var(--tx)" stroke-width=".05" stroke-dasharray=".2 .16" opacity=".6"/>`; });
    else SIM.pts.forEach((p, i) => {
      const q = fin[i]; if (q[0] === p[0] && q[1] === p[1]) return;
      s += `<line x1="${p[0]}" y1="${Y(p[1])}" x2="${q[0]}" y2="${Y(q[1])}" style="stroke:var(--tx)" stroke-width=".06" stroke-dasharray=".22 .16" opacity=".7"${simType === 'translasi' ? ' marker-end="url(#ah)"' : ''}/>`;
    });
  }
  s += `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:var(--tx)"/></marker></defs>`;
  const poly = (pts, c, dash) => `<polygon points="${pts.map(p => p[0] + ',' + Y(p[1])).join(' ')}" style="fill:var(--${c});fill-opacity:.22;stroke:var(--${c})" stroke-width=".12" stroke-linejoin="round"${dash ? ' stroke-dasharray=".35 .22"' : ''}/>`;
  s += poly(SIM.pts, oc, false);
  if (SIM.show.img) s += poly(img, ic, true);
  // label
  const cen = pts => [pts.reduce((a, p) => a + p[0], 0) / 3, pts.reduce((a, p) => a + p[1], 0) / 3];
  const lab = (pts, suf, c, coord) => {
    const g = cen(pts); let o = '';
    pts.forEach((p, i) => {
      let dx = p[0] - g[0], dy = p[1] - g[1]; const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
      const tx = p[0] + dx * .62, ty = p[1] + dy * .62;
      o += `<text x="${tx.toFixed(2)}" y="${(Y(ty) + .2).toFixed(2)}" font-size=".62" font-weight="700" text-anchor="middle" font-family="Space Grotesk, sans-serif" style="fill:var(--${c})">${LAB[i]}${suf}</text>`;
      if (coord && SIM.t === 1) o += `<text x="${tx.toFixed(2)}" y="${(Y(ty) + .75).toFixed(2)}" font-size=".4" font-weight="700" text-anchor="middle" style="fill:var(--${c})">${P(Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100)}</text>`;
    });
    return o;
  };
  s += lab(SIM.pts, '', oc, SIM.show.coord);
  if (SIM.show.img) s += lab(img, '′', ic, SIM.show.coord);
  // pemegang
  SIM.pts.forEach((p, i) => { s += `<circle class="drag" data-v="${i}" cx="${p[0]}" cy="${Y(p[1])}" r=".34" style="fill:var(--${oc});stroke:var(--tx)" stroke-width=".08"/>`; });
  if (simType === 'putaran') s += `<circle class="drag" data-v="c" cx="${SIM.cx}" cy="${Y(SIM.cy)}" r=".36" style="fill:var(--am);stroke:var(--tx)" stroke-width=".08"/><text x="${SIM.cx - .45}" y="${Y(SIM.cy) + .85}" font-size=".5" font-weight="700" text-anchor="end" style="fill:var(--am)">pusat</text>`;
  return `<svg id="simsvg" viewBox="${-R - .7} ${-R - .7} ${2 * R + 1.4} ${2 * R + 1.4}" role="img" aria-label="Satah Cartes: objek ABC dan imej A′B′C′. ${esc(simRule())}" font-family="Inter, sans-serif">${s}</svg>`;
}
function stepper(id, label, val) { return `<div class="step"><span>${label}</span><button type="button" data-st="${id}" data-d="-1" aria-label="Kurangkan ${label}">−</button><b>${fmt(val)}</b><button type="button" data-st="${id}" data-d="1" aria-label="Tambah ${label}">+</button></div>`; }
function viewTeroka(type) {
  simType = SIMDEF[type] ? type : 'translasi';
  const [name, oc, ic] = SIMDEF[simType], c = `var(--${ic})`;
  let ctl = '';
  if (simType === 'translasi') ctl = `<div class="pbox"><h3>VEKTOR TRANSLASI ${vec(SIM.a, SIM.b, 'am')}</h3>${stepper('a', 'Mengufuk (a)', SIM.a)}${stepper('b', 'Mencancang (b)', SIM.b)}</div>`;
  if (simType === 'pantulan') ctl = `<div class="pbox" style="--c:${c}"><h3>PAKSI PANTULAN</h3><div class="opts">${[['x', 'Paksi-x'], ['y', 'Paksi-y'], ['v', 'x = h'], ['h', 'y = k'], ['yx', 'y = x']].map(([k, t]) => `<button type="button" class="opt" data-ax="${k}" aria-pressed="${SIM.ax === k}">${t}</button>`).join('')}</div>${SIM.ax === 'v' ? stepper('h', 'h', SIM.h) : ''}${SIM.ax === 'h' ? stepper('k', 'k', SIM.k) : ''}</div>`;
  if (simType === 'putaran') ctl = `<div class="pbox" style="--c:${c}"><h3>SUDUT</h3><div class="opts" style="grid-template-columns:repeat(3,minmax(0,1fr))">${[90, 180, 270].map(a => `<button type="button" class="opt" data-ang="${a}" aria-pressed="${SIM.ang === a}">${a}°</button>`).join('')}</div>
    <h3>ARAH</h3><div class="opts">${[['ikut', 'Ikut arah jam'], ['lawan', 'Lawan arah jam']].map(([k, t]) => `<button type="button" class="opt" data-dir="${k}" aria-pressed="${SIM.ang !== 180 && SIM.dir === k}"${SIM.ang === 180 ? ' disabled' : ''} style="font-size:14px">${t}</button>`).join('')}</div>
    <h3>PUSAT PUTARAN</h3>${stepper('cx', 'x', SIM.cx)}${stepper('cy', 'y', SIM.cy)}</div>`;
  const fin = SIM.pts.map(p => simImg(p, 1));
  const rows = SIM.pts.map((p, i) => `<tr><td><b style="color:var(--${oc})">${LAB[i]}</b> ${P(p[0], p[1])}</td><td>→</td><td><b style="color:${c}">${LAB[i]}′</b> ${P(fin[i][0], fin[i][1])}</td></tr>`).join('');
  const tips = { translasi: 'sorok imej, kemudian minta murid teka kedudukan A′ jika vektor ialah ' + vec(SIM.a, SIM.b, 'am') + '.', pantulan: 'sorok imej, pilih paksi, kemudian minta murid lukis imej di buku sebelum ditunjukkan.', putaran: 'gerakkan pusat putaran dan tanya: adakah jarak A ke pusat sama dengan A′ ke pusat?' };
  return `<div class="sim">
    <div class="simbox">${simSVG()}</div>
    <aside class="panel">
      <div class="seg" role="group" aria-label="Pilih simulasi">${Object.keys(SIMDEF).map(k => `<button type="button" data-sim="${k}" aria-pressed="${k === simType}" style="--c:var(--${SIMDEF[k][2]})">${SIMDEF[k][0]}</button>`).join('')}</div>
      ${ctl}
      <div class="pbox"><div class="rule" style="color:${c}">${simRule()}</div><table class="ctab"><tbody>${rows}</tbody></table></div>
      <div class="pbox" style="--c:${c};gap:2px">
        <label class="tg">Imej <input type="checkbox" data-show="img"${SIM.show.img ? ' checked' : ''}></label>
        <label class="tg">Garis penyambung <input type="checkbox" data-show="line"${SIM.show.line ? ' checked' : ''}></label>
        <label class="tg">Koordinat pada rajah <input type="checkbox" data-show="coord"${SIM.show.coord ? ' checked' : ''}></label>
      </div>
      <div class="tip"><b>Tanya kelas:</b> ${tips[simType]}</div>
      <div class="prow"><button type="button" class="btn pri" id="simPlay" style="flex:1;background:${c}">${IC.play} Mainkan ${name.toLowerCase()}</button><button type="button" class="ib" id="simReset" aria-label="Set semula" style="width:52px;height:52px">${IC.reset}</button></div>
      <p style="margin:0;font-size:13px;color:var(--mu)">Seret bucu A, B atau C${simType === 'putaran' ? ' dan titik pusat' : ''} pada rajah.</p>
    </aside></div>`;
}
function bindTeroka() {
  const main = document.getElementById('main');
  const rer = () => { render(true); };
  main.querySelectorAll('[data-sim]').forEach(b => b.onclick = () => { location.hash = '#/teroka/' + b.dataset.sim; });
  main.querySelectorAll('[data-st]').forEach(b => b.onclick = () => {
    const k = b.dataset.st, d = +b.dataset.d; SIM[k] = Math.max(-8, Math.min(8, SIM[k] + d)); SIM.t = 1; rer();
  });
  main.querySelectorAll('[data-ax]').forEach(b => b.onclick = () => { SIM.ax = b.dataset.ax; SIM.t = 1; rer(); });
  main.querySelectorAll('[data-ang]').forEach(b => b.onclick = () => { SIM.ang = +b.dataset.ang; SIM.t = 1; rer(); });
  main.querySelectorAll('[data-dir]').forEach(b => b.onclick = () => { SIM.dir = b.dataset.dir; SIM.t = 1; rer(); });
  main.querySelectorAll('[data-show]').forEach(c => c.onchange = () => { SIM.show[c.dataset.show] = c.checked; rer(); });
  document.getElementById('simReset').onclick = () => { cancelAnimationFrame(simAnim); SIM = SIM0(); rer(); };
  document.getElementById('simPlay').onclick = () => {
    cancelAnimationFrame(simAnim); SIM.show.img = true; const t0 = performance.now(), D = 1400;
    const step = now => {
      const k = Math.min(1, (now - t0) / D); SIM.t = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const box = document.querySelector('.simbox'); if (!box) return;
      box.innerHTML = simSVG();
      if (k < 1) simAnim = requestAnimationFrame(step); else { SIM.t = 1; rer(); }
    };
    SIM.t = 0; simAnim = requestAnimationFrame(step);
  };
  bindDrag();
}
let simDrag = null;
function bindDrag() {
  const box = document.querySelector('.simbox'); if (!box || box._b) return; box._b = 1;
  const toW = e => {
    const svg = box.querySelector('svg'); if (!svg) return null;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const m = svg.getScreenCTM(); if (!m) return null;
    const q = pt.matrixTransform(m.inverse()); return [Math.max(-8, Math.min(8, Math.round(q.x))), Math.max(-8, Math.min(8, Math.round(-q.y)))];
  };
  box.addEventListener('pointerdown', e => {
    const t = e.target.closest('[data-v]'); if (!t) return;
    simDrag = t.dataset.v; try { box.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault();
  });
  box.addEventListener('pointermove', e => {
    if (simDrag == null) return; const w = toW(e); if (!w) return;
    if (simDrag === 'c') { if (SIM.cx === w[0] && SIM.cy === w[1]) return; SIM.cx = w[0]; SIM.cy = w[1]; }
    else { const i = +simDrag; if (SIM.pts.some((p, j) => j !== i && p[0] === w[0] && p[1] === w[1])) return; if (SIM.pts[i][0] === w[0] && SIM.pts[i][1] === w[1]) return; SIM.pts[i] = w; }
    SIM.t = 1; box.innerHTML = simSVG();
  });
  const end = () => { if (simDrag != null) { simDrag = null; render(true); } };
  box.addEventListener('pointerup', end); box.addEventListener('pointercancel', end);
}

/* =================== Penjana soalan =================== */
// setiap fungsi: {q, fig?, figAns?, ans, work[]}
const AX = 'paksi';
const GEN = {
  '11.1': {
    m: [() => {
      const asObj = Math.random() < .5;
      return asObj ? { q: 'Bentuk asal sebelum transformasi dipanggil apa?', ans: 'Objek', work: ['Bentuk asal dipanggil <b>objek</b>.', 'Bentuk selepas transformasi dipanggil <b>imej</b>.'] }
        : { q: 'Titik A pada objek dipetakan kepada titik A′. Apakah yang diwakili oleh A′?', ans: 'Titik imej', work: ['A ialah titik pada objek.', 'A′ ialah titik sepadan pada <b>imej</b>.'] };
    }, () => {
      const same = Math.random() < .6, a = ri(2, 3), b = ri(2, 3);
      const o = [[0, 0], [a, 0], [0, b]];
      const im = same ? (Math.random() < .5 ? o.map(([x, y]) => [12 - x - 1, y]) : o.map(([x, y]) => [8 + y, a - x])) : o.map(([x, y]) => [6 + 2 * x, 2 * y]);
      return { q: 'Adakah kedua-dua bentuk ini kongruen?', fig: plot({ x0: 0, x1: 12, y0: 0, y1: 6, axes: false, items: [{ t: 'poly', pts: o, c: 'tr' }, { t: 'poly', pts: im, c: 'pa', dash: true }], label: 'Dua bentuk' }),
        ans: same ? 'Ya, kongruen' : 'Tidak kongruen', work: same ? ['Kedua-dua bentuk mempunyai bentuk yang sama.', 'Saiznya juga sama (panjang sisi sama).', 'Jadi bentuk itu <b>kongruen</b>.'] : ['Bentuknya sama tetapi <b>saiz berbeza</b>.', 'Bentuk kongruen mesti sama bentuk dan sama saiz.', 'Jadi bentuk itu <b>tidak kongruen</b>.'] };
    }],
    s: [() => {
      const iso = Math.random() < .5, o = [[1, 1], [3, 1], [1, 3]];
      const im = iso ? o.map(([x, y]) => [x + 6, y + 2]) : o.map(([x, y]) => [7 + (x - 1) * 2, 1 + (y - 1) * 2]);
      return { q: 'Objek berwarna biru dipetakan kepada imej berwarna oren. Adakah transformasi ini satu isometri?', fig: plot({ x0: 0, x1: 12, y0: 0, y1: 7, axes: false, items: [{ t: 'poly', pts: o, c: 'tr' }, { t: 'poly', pts: im, c: 'pa', dash: true }], label: 'Objek dan imej' }),
        ans: iso ? 'Ya, isometri' : 'Bukan isometri', work: iso ? ['Bandingkan saiz objek dan imej.', 'Bentuk dan saiz imej <b>sama</b> dengan objek.', 'Jadi transformasi ini ialah isometri.'] : ['Bandingkan saiz objek dan imej.', 'Saiz imej <b>lebih besar</b> daripada objek.', 'Isometri mesti mengekalkan saiz, jadi ini bukan isometri.'] };
    }],
    k: [() => {
      const ab = ri(3, 12), ang = pick([35, 40, 48, 55, 62, 70, 75]);
      return { q: `Segi tiga ABC dipetakan kepada segi tiga A′B′C′ oleh satu isometri. Diberi AB = ${ab} cm dan ∠ABC = ${ang}°. Nyatakan panjang A′B′ dan saiz ∠A′B′C′.`,
        ans: `A′B′ = ${ab} cm, ∠A′B′C′ = ${ang}°`, work: ['Isometri mengekalkan bentuk dan saiz.', 'Maka imej kongruen dengan objek.', `Panjang sisi dan saiz sudut tidak berubah: A′B′ = ${ab} cm, ∠A′B′C′ = ${ang}°.`] };
    }]
  },
  '11.2': {
    m: [() => {
      const x = ri(0, 4), y = ri(0, 4), a = nz(-3, 4), b = nz(-3, 4), X = x + a, Y = y + b;
      const box = { x0: Math.min(0, x, X) - 1, x1: Math.max(x, X) + 1, y0: Math.min(0, y, Y) - 1, y1: Math.max(y, Y) + 1 };
      return { q: `Titik P${P(x, y)} ditranslasikan oleh ${vec(a, b)}. Cari koordinat imej P′.`,
        fig: plot({ ...box, items: [{ t: 'pt', x, y, c: 'tr', l: 'P' }], label: 'Titik P' }),
        figAns: plot({ ...box, items: [{ t: 'line', a: [x, y], b: [X, Y], c: 'tx', dash: true, w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: 'P' }, { t: 'pt', x: X, y: Y, c: 'gr', l: 'P′' }], label: 'P dan P′' }),
        ans: `P′${P(X, Y)}`, work: [`Gerak ${Math.abs(a)} unit ke ${a > 0 ? 'kanan' : 'kiri'}: ${fmt(x)} + ${par(a)} = ${fmt(X)}.`, `Gerak ${Math.abs(b)} unit ke ${b > 0 ? 'atas' : 'bawah'}: ${fmt(y)} + ${par(b)} = ${fmt(Y)}.`] };
    }],
    s: [() => {
      const x = ri(-3, 3), y = ri(-3, 3), a = nz(-4, 4), b = nz(-4, 4);
      return { q: `Titik A${P(x, y)} dipetakan kepada A′${P(x + a, y + b)} oleh satu translasi. Tentukan vektor translasi.`,
        ans: `Vektor translasi = ${vec(a, b, 'gr')}`, work: [`Gerakan mengufuk: ${fmt(x + a)} − ${par(x)} = ${fmt(a)}.`, `Gerakan mencancang: ${fmt(y + b)} − ${par(y)} = ${fmt(b)}.`, `Tulis sebagai vektor ${vec(a, b)}.`] };
    }, () => {
      const X = ri(-2, 6), Y = ri(-2, 6), a = nz(-4, 4), b = nz(-4, 4);
      return { q: `Q′${P(X, Y)} ialah imej bagi titik Q di bawah translasi ${vec(a, b)}. Cari koordinat Q.`,
        ans: `Q${P(X - a, Y - b)}`, work: ['Gerak dalam arah <b>songsang</b> dari imej ke objek.', `Koordinat-x: ${fmt(X)} − ${par(a)} = ${fmt(X - a)}.`, `Koordinat-y: ${fmt(Y)} − ${par(b)} = ${fmt(Y - b)}.`] };
    }],
    k: [() => {
      const ax = ri(-3, 3), ay = ri(-3, 3), a = nz(-4, 4), b = nz(-4, 4), bx = ri(-4, 4), by = ri(-4, 4);
      return { q: `Translasi T memetakan A${P(ax, ay)} kepada A′${P(ax + a, ay + b)}. Cari imej bagi B${P(bx, by)} di bawah translasi T.`,
        ans: `B′${P(bx + a, by + b)}`, work: [`Cari vektor T: ${vec(a, b)} (${fmt(ax + a)} − ${par(ax)}, ${fmt(ay + b)} − ${par(ay)}).`, `Tambah vektor pada B: (${fmt(bx)} + ${par(a)}, ${fmt(by)} + ${par(b)}).`, `B′${P(bx + a, by + b)}.`] };
    }]
  },
  '11.3': {
    m: [() => {
      const x = nz(-4, 4), y = nz(-4, 4), onX = Math.random() < .5, X = onX ? x : -x, Y = onX ? -y : y;
      const box = { x0: -5, x1: 5, y0: -5, y1: 5, u: 34 };
      return { q: `Titik P${P(x, y)} dipantulkan pada ${onX ? 'paksi-x' : 'paksi-y'}. Cari koordinat imej P′.`,
        fig: plot({ ...box, items: [{ t: 'pt', x, y, c: 'tr', l: 'P' }], label: 'Titik P' }),
        figAns: plot({ ...box, items: [{ t: 'line', a: [x, y], b: [X, Y], c: 'tx', dash: true, w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: 'P' }, { t: 'pt', x: X, y: Y, c: 'gr', l: 'P′' }], label: 'P dan P′' }),
        ans: `P′${P(X, Y)}`, work: onX ? ['Pantulan pada paksi-x: (x, y) → (x, −y).', `Koordinat-x kekal: ${fmt(x)}.`, `Koordinat-y bertukar tanda: ${fmt(y)} → ${fmt(-y)}.`] : ['Pantulan pada paksi-y: (x, y) → (−x, y).', `Koordinat-x bertukar tanda: ${fmt(x)} → ${fmt(-x)}.`, `Koordinat-y kekal: ${fmt(y)}.`] };
    }],
    s: [() => {
      const vert = Math.random() < .5, h = ri(-2, 4), x = ri(-3, 6), y = ri(-3, 6);
      if (vert) { let px = x; if (px === h) px = h - 2; const d = h - px, X = h + d;
        return { q: `Titik P${P(px, y)} dipantulkan pada garis x = ${fmt(h)}. Cari koordinat imej P′.`, ans: `P′${P(X, y)}`,
          work: [`Jarak P ke garis x = ${fmt(h)} ialah ${Math.abs(d)} unit.`, `Imej berada ${Math.abs(d)} unit di sebelah lain garis: x = ${fmt(X)}.`, `Koordinat-y tidak berubah: ${fmt(y)}.`] }; }
      let py = y; if (py === h) py = h - 2; const d = h - py, Y = h + d;
      return { q: `Titik P${P(x, py)} dipantulkan pada garis y = ${fmt(h)}. Cari koordinat imej P′.`, ans: `P′${P(x, Y)}`,
        work: [`Jarak P ke garis y = ${fmt(h)} ialah ${Math.abs(d)} unit.`, `Imej berada ${Math.abs(d)} unit di sebelah lain garis: y = ${fmt(Y)}.`, `Koordinat-x tidak berubah: ${fmt(x)}.`] };
    }],
    k: [() => {
      const vert = Math.random() < .5, m = ri(-3, 4), d = ri(1, 4), c = ri(-3, 4);
      if (vert) return { q: `Titik A${P(m - d, c)} dipetakan kepada A′${P(m + d, c)} oleh satu pantulan. Nyatakan persamaan paksi pantulan.`, ans: `x = ${fmt(m)}`,
        work: ['A dan A′ mempunyai koordinat-y yang sama, jadi paksi pantulan ialah garis mencancang.', `Titik tengah AA′: (${fmt(m - d)} + ${par(m + d)}) ÷ 2 = ${fmt(m)}.`, `Paksi pantulan: x = ${fmt(m)}.`] };
      return { q: `Titik A${P(c, m - d)} dipetakan kepada A′${P(c, m + d)} oleh satu pantulan. Nyatakan persamaan paksi pantulan.`, ans: `y = ${fmt(m)}`,
        work: ['A dan A′ mempunyai koordinat-x yang sama, jadi paksi pantulan ialah garis mengufuk.', `Titik tengah AA′: (${fmt(m - d)} + ${par(m + d)}) ÷ 2 = ${fmt(m)}.`, `Paksi pantulan: y = ${fmt(m)}.`] };
    }]
  },
  '11.4': {
    m: [() => {
      const x = nz(-4, 4), y = nz(-4, 4);
      const box = { x0: -5, x1: 5, y0: -5, y1: 5, u: 34 };
      return { q: `Titik A${P(x, y)} diputar 180° pada asalan O. Cari koordinat imej A′.`,
        fig: plot({ ...box, items: [{ t: 'pt', x, y, c: 'tr', l: 'A' }, { t: 'pt', x: 0, y: 0, c: 'am' }], label: 'Titik A' }),
        figAns: plot({ ...box, items: [{ t: 'line', a: [x, y], b: [-x, -y], c: 'tx', dash: true, w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: 'A' }, { t: 'pt', x: -x, y: -y, c: 'gr', l: 'A′' }, { t: 'pt', x: 0, y: 0, c: 'am' }], label: 'A dan A′' }),
        ans: `A′${P(-x, -y)}`, work: ['Putaran 180° pada asalan: (x, y) → (−x, −y).', `Kedua-dua koordinat bertukar tanda: ${P(x, y)} → ${P(-x, -y)}.`] };
    }],
    s: [() => {
      const x = nz(-4, 4), y = nz(-4, 4), cw = Math.random() < .5, X = cw ? y : -y, Y = cw ? -x : x;
      const box = { x0: -5, x1: 5, y0: -5, y1: 5, u: 34 };
      return { q: `Titik A${P(x, y)} diputar 90° ${cw ? 'ikut' : 'lawan'} arah jam pada asalan O. Cari koordinat imej A′.`,
        fig: plot({ ...box, items: [{ t: 'pt', x, y, c: 'tr', l: 'A' }, { t: 'pt', x: 0, y: 0, c: 'am' }], label: 'Titik A' }),
        figAns: plot({ ...box, items: [{ t: 'line', a: [0, 0], b: [x, y], c: 'tr', w: 2.5 }, { t: 'line', a: [0, 0], b: [X, Y], c: 'gr', w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: 'A' }, { t: 'pt', x: X, y: Y, c: 'gr', l: 'A′' }, { t: 'pt', x: 0, y: 0, c: 'am' }], label: 'A dan A′' }),
        ans: `A′${P(X, Y)}`, work: ['Surih A dan O pada kertas surih.', `Putar kertas surih 90° ${cw ? 'ikut' : 'lawan'} arah jam dengan pensel di O.`, `Baca kedudukan baharu A: ${P(X, Y)}.`] };
    }],
    k: [() => {
      const h = ri(-2, 2), k = ri(-2, 2), dx = nz(-3, 3), dy = nz(-3, 3), x = h + dx, y = k + dy, cw = Math.random() < .5;
      const X = cw ? h + dy : h - dy, Y = cw ? k - dx : k + dx;
      return { q: `Titik A${P(x, y)} diputar 90° ${cw ? 'ikut' : 'lawan'} arah jam pada pusat ${P(h, k)}. Cari koordinat imej A′.`,
        fig: plot({ x0: -6, x1: 6, y0: -6, y1: 6, u: 30, items: [{ t: 'pt', x, y, c: 'tr', l: 'A' }, { t: 'pt', x: h, y: k, c: 'am', l: 'pusat', dy: 22 }], label: 'Titik A dan pusat' }),
        figAns: plot({ x0: -6, x1: 6, y0: -6, y1: 6, u: 30, items: [{ t: 'line', a: [h, k], b: [x, y], c: 'tr', w: 2.5 }, { t: 'line', a: [h, k], b: [X, Y], c: 'gr', w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: 'A' }, { t: 'pt', x: X, y: Y, c: 'gr', l: 'A′' }, { t: 'pt', x: h, y: k, c: 'am' }], label: 'A dan A′' }),
        ans: `A′${P(X, Y)}`, work: [`Dari pusat ke A: ${Math.abs(dx)} unit ${dx > 0 ? 'kanan' : 'kiri'}, ${Math.abs(dy)} unit ${dy > 0 ? 'atas' : 'bawah'}.`, `Putar arah gerakan itu 90° ${cw ? 'ikut' : 'lawan'} arah jam.`, `Dari pusat ${P(h, k)}, imej berada di ${P(X, Y)}.`] };
    }]
  },
  '11.5': {
    m: [() => {
      const n = ri(3, 15), t = pick(['translasi', 'pantulan', 'putaran']);
      return { q: `Panjang sisi AB pada sebuah objek ialah ${n} cm. Objek itu mengalami ${t}. Berapakah panjang A′B′?`, ans: `${n} cm`, work: [`${t[0].toUpperCase() + t.slice(1)} ialah isometri.`, 'Isometri mengekalkan jarak antara dua titik.', `Maka A′B′ = AB = ${n} cm.`] };
    }],
    s: [() => pick([
      { q: 'Dalam pantulan, titik manakah yang tidak berubah kedudukan?', ans: 'Titik pada paksi pantulan', work: ['Titik pada paksi pantulan berjarak 0 dari paksi.', 'Imejnya berada pada kedudukan yang sama.'] },
      { q: 'Dalam putaran, titik manakah yang tidak berubah kedudukan?', ans: 'Pusat putaran', work: ['Setiap titik diputar pada pusat putaran.', 'Pusat itu sendiri tidak bergerak.'] },
      { q: 'Transformasi isometri manakah yang menghasilkan imej terbalik (songsang sisi)?', ans: 'Pantulan', work: ['Translasi dan putaran tidak menterbalikkan bentuk.', 'Pantulan menghasilkan imej yang terbalik seperti dalam cermin.'] },
      { q: 'Nyatakan tiga maklumat yang diperlukan untuk menghuraikan satu putaran.', ans: 'Pusat, sudut dan arah putaran', work: ['Pusat: titik tetap putaran.', 'Sudut: contohnya 90° atau 180°.', 'Arah: ikut atau lawan arah jam.'] },
      { q: 'Apakah maklumat yang diperlukan untuk menghuraikan satu translasi?', ans: 'Vektor translasi', work: ['Translasi ditentukan oleh jarak dan arah gerakan.', 'Kedua-duanya diwakili oleh vektor translasi.'] }
    ])],
    k: [() => {
      const p = ri(4, 12), l = ri(2, p - 1), t = pick(['diputar 90° pada satu titik', 'dipantulkan pada satu garis', 'ditranslasikan']), area = Math.random() < .5;
      return { q: `Sebuah segi empat tepat berukuran ${p} cm × ${l} cm ${t}. Hitung ${area ? 'luas' : 'perimeter'} imejnya.`,
        ans: area ? `${p * l} cm²` : `${2 * (p + l)} cm`, work: ['Transformasi ini ialah isometri, jadi imej kongruen dengan objek.', `Ukuran imej juga ${p} cm × ${l} cm.`, area ? `Luas = ${p} × ${l} = ${p * l} cm².` : `Perimeter = 2 × (${p} + ${l}) = ${2 * (p + l)} cm.`] };
    }]
  },
  '11.6': {
    m: [() => {
      const o = pick([['poly', 3, 'segi tiga sama sisi', 3], ['poly', 4, 'segi empat sama', 4], ['rect', 0, 'segi empat tepat', 2], ['poly', 5, 'pentagon sekata', 5], ['poly', 6, 'heksagon sekata', 6]]);
      return { q: `Nyatakan peringkat simetri putaran bagi ${o[2]} ini.`, fig: shapeSVG(o[0], o[1]), ans: `${o[3]}`, work: ['Bayangkan bentuk diputar satu putaran lengkap (360°).', `Kira berapa kali bentuk kelihatan sama seperti asal: ${o[3]} kali.`] };
    }],
    s: [() => {
      const o = pick([['H', 2], ['N', 2], ['S', 2], ['Z', 2], ['X', 2], ['A', 1], ['T', 1], ['L', 1], ['F', 1], ['E', 1]]);
      return { q: `Nyatakan peringkat simetri putaran bagi huruf ${o[0]}.`, fig: shapeSVG('letter', o[0]), ans: `${o[1]}`,
        work: o[1] === 2 ? ['Putar huruf 180°.', 'Huruf kelihatan sama seperti asal.', 'Dalam satu putaran lengkap, ia kelihatan sama 2 kali.'] : ['Putar huruf 90° dan 180°: huruf tidak kelihatan sama.', 'Ia hanya kelihatan sama selepas satu putaran lengkap.', 'Maka peringkat simetri putaran ialah 1.'] };
    }],
    k: [() => {
      const n = pick([3, 4, 5, 6, 8, 9, 10, 12]);
      return { q: `Sebuah poligon sekata mempunyai ${n} sisi. Berapakah sudut putaran terkecil supaya poligon itu kelihatan sama seperti asal?`, ans: `${360 / n}°`, work: [`Peringkat simetri putaran poligon sekata ${n} sisi ialah ${n}.`, `Sudut putaran terkecil = 360° ÷ ${n}.`, `= ${360 / n}°.`] };
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
  return `<div class="wrap"><div><h1 class="h1">Latihan Kelas</h1><p class="lead">Tandakan subtopik yang <b style="color:var(--tx)">sudah diajar</b>. Soalan hanya diambil daripada subtopik ini.</p></div>
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
        <div class="work"><h3>JALAN KERJA</h3><ol>${q.work.map(w => `<li>${w}</li>`).join('')}</ol></div>` : `<p style="margin:0;color:var(--mu);font-size:17px">Beri masa kelas berfikir, kemudian tekan <b style="color:var(--tx)">Tunjuk jawapan</b>.</p>`}
      </div>
      ${fig ? `<div class="qfig">${fig}</div>` : ''}
    </div></div>
    <div class="qfoot">
      <button type="button" class="btn sec" id="latShow">${LAT.show ? IC.eyeoff + ' Sorok jawapan' : IC.eye + ' Tunjuk jawapan'}</button>
      <button type="button" class="btn pri big" id="latNext" style="margin-left:auto">${LAT.i === LAT.qs.length - 1 ? 'Selesai' : 'Soalan seterusnya'} ${IC.arrow}</button>
    </div>`;
}
function bindLatMain() {
  const a = document.getElementById('latAgain');
  if (a) { a.onclick = () => { LAT.qs = makeSet(); LAT.i = 0; LAT.show = false; render(true); }; return; }
  document.getElementById('latShow').onclick = () => { LAT.show = !LAT.show; render(true); };
  document.getElementById('latNext').onclick = () => { LAT.i++; LAT.show = false; render(true); document.getElementById('main').scrollTop = 0; };
}

/* =================== GAMES: Cabaran 60 Saat =================== */
const SHAPE = [[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]]; // bentuk L (tidak simetri)
function tfm(kind) {
  for (let t = 0; t < 80; t++) {
    const ox = ri(-6, 1), oy = ri(-6, 1), o = SHAPE.map(([x, y]) => [x + ox, y + oy]);
    let im;
    if (kind === 'Translasi') { const a = nz(-6, 6), b = nz(-6, 6); im = o.map(([x, y]) => [x + a, y + b]); }
    else if (kind === 'Pantulan') { if (Math.random() < .5) { const h = ri(-2, 3); im = o.map(([x, y]) => [2 * h - x, y]); } else { const k = ri(-2, 3); im = o.map(([x, y]) => [x, 2 * k - y]); } }
    else if (kind === 'Putaran') { const cx = ri(-2, 2), cy = ri(-2, 2), r = pick([90, 180, 270]); im = o.map(([x, y]) => { const dx = x - cx, dy = y - cy; return r === 90 ? [cx - dy, cy + dx] : r === 180 ? [cx - dx, cy - dy] : [cx + dy, cy - dx]; }); }
    else { const cx = o[0][0], cy = o[0][1]; im = o.map(([x, y]) => [cx + 2 * (x - cx) + ri(0, 0), cy + 2 * (y - cy)]).map(([x, y]) => [x + 3, y + 1]); }
    const all = o.concat(im);
    if (all.every(([x, y]) => x >= -7 && x <= 7 && y >= -7 && y <= 7)) {
      const bb = p => [Math.min(...p.map(q => q[0])), Math.max(...p.map(q => q[0])), Math.min(...p.map(q => q[1])), Math.max(...p.map(q => q[1]))];
      const A = bb(o), B = bb(im);
      const overlap = !(A[1] < B[0] || B[1] < A[0] || A[3] < B[2] || B[3] < A[2]);
      if (!overlap || t > 60) return { o, im };
    }
  }
  return null;
}
const GOPT4 = ['Translasi', 'Pantulan', 'Putaran', 'Bukan isometri'];
function gq(level) {
  const types = level === 0 ? ['kenal', 'kenal', 'imej', 'simetri'] : level === 1 ? ['kenal', 'imej', 'imej', 'vektor', 'simetri'] : ['kenal', 'imej', 'imej', 'vektor', 'simetri'];
  const ty = pick(types);
  if (ty === 'kenal') {
    const kinds = level === 0 ? ['Translasi', 'Pantulan', 'Putaran'] : GOPT4;
    const k = pick(kinds), r = tfm(k);
    if (!r) return gq(level);
    return { q: 'Transformasi apakah yang memetakan objek kepada imej?', fig: plot({ x0: -7, x1: 7, y0: -7, y1: 7, u: 26, axes: false, items: [{ t: 'poly', pts: r.o, c: 'tr' }, { t: 'poly', pts: r.im, c: 'pa', dash: true }], label: 'Objek biru, imej oren' }), opts: GOPT4, c: GOPT4.indexOf(k), legend: true };
  }
  if (ty === 'imej') {
    const x = nz(-5, 5), y = nz(-5, 5);
    let q, ans;
    const pool = level === 0 ? ['tr', 'px', 'py'] : level === 1 ? ['tr', 'px', 'py', 'r180', 'xh'] : ['r90', 'r270', 'xh', 'yk', 'tr'];
    const t = pick(pool);
    if (t === 'tr') { const a = nz(-4, 4), b = nz(-4, 4); q = `Imej bagi ${P(x, y)} di bawah translasi ${vec(a, b)}?`; ans = [x + a, y + b]; }
    if (t === 'px') { q = `Imej bagi ${P(x, y)} apabila dipantulkan pada paksi-x?`; ans = [x, -y]; }
    if (t === 'py') { q = `Imej bagi ${P(x, y)} apabila dipantulkan pada paksi-y?`; ans = [-x, y]; }
    if (t === 'r180') { q = `Imej bagi ${P(x, y)} apabila diputar 180° pada asalan?`; ans = [-x, -y]; }
    if (t === 'r90') { q = `Imej bagi ${P(x, y)} apabila diputar 90° ikut arah jam pada asalan?`; ans = [y, -x]; }
    if (t === 'r270') { q = `Imej bagi ${P(x, y)} apabila diputar 90° lawan arah jam pada asalan?`; ans = [-y, x]; }
    if (t === 'xh') { const h = nz(-3, 3); q = `Imej bagi ${P(x, y)} apabila dipantulkan pada garis x = ${fmt(h)}?`; ans = [2 * h - x, y]; }
    if (t === 'yk') { const k = nz(-3, 3); q = `Imej bagi ${P(x, y)} apabila dipantulkan pada garis y = ${fmt(k)}?`; ans = [x, 2 * k - y]; }
    const cands = [[-ans[0], ans[1]], [ans[0], -ans[1]], [-ans[0], -ans[1]], [ans[1], ans[0]], [-ans[1], ans[0]], [ans[1], -ans[0]], [ans[0] + 1, ans[1]], [ans[0], ans[1] - 1], [x, y]];
    const key = p => p.join(','), seen = new Set([key(ans)]), wrong = [];
    for (const c of shuffle(cands)) { if (!seen.has(key(c))) { seen.add(key(c)); wrong.push(c); } if (wrong.length === 3) break; }
    const opts = shuffle([ans, ...wrong]);
    return { q, opts: opts.map(p => P(p[0], p[1])), c: opts.indexOf(ans) };
  }
  if (ty === 'vektor') {
    const x = ri(-4, 4), y = ri(-4, 4), a = nz(-5, 5), b = nz(-5, 5);
    let cands = [[-a, -b], [b, a], [a, -b], [-a, b], [a + 1, b]];
    const seen = new Set([a + ',' + b]), wrong = [];
    for (const c of shuffle(cands)) { if (!seen.has(c.join(','))) { seen.add(c.join(',')); wrong.push(c); } if (wrong.length === 3) break; }
    const right = [a, b], opts = shuffle([right, ...wrong]);
    return { q: `Vektor translasi yang memetakan ${P(x, y)} kepada ${P(x + a, y + b)}?`, opts: opts.map(p => vec(p[0], p[1])), c: opts.indexOf(right) };
  }
  const o = pick([['poly', 3, 3], ['poly', 4, 4], ['poly', 5, 5], ['poly', 6, 6], ['rect', 0, 2], ['letter', 'S', 2], ['letter', 'Z', 2], ['letter', 'H', 2], ['letter', 'L', 1], ['letter', 'T', 1]]);
  const nums = shuffle([1, 2, 3, 4, 5, 6].filter(n => n !== o[2])).slice(0, 3).concat(o[2]).sort((p, q) => p - q);
  return { q: 'Apakah peringkat simetri putaran bagi bentuk ini?', fig: shapeSVG(o[0], o[1]), opts: nums.map(String), c: nums.indexOf(o[2]) };
}
const G = { st: 'intro', score: 0, lives: 3, combo: 0, right: 0, q: null, pick: -1, end: 0, timer: 0, newBest: false };
function gLevel() { return G.score < 100 ? 0 : G.score < 250 ? 1 : 2; }
function viewGames() {
  const best = store().best || 0;
  if (G.st === 'intro') return `<div class="wrap" style="max-width:880px">
    <div><p class="eyebrow">GAMES</p><h1 class="h1">Cabaran 60 Saat</h1><p class="lead">Jawab seberapa banyak soalan dalam masa 60 saat.</p></div>
    <div class="pbox" style="padding:22px"><ul class="rules">
      <li>${IC.clock}<span>Masa <b>60 saat</b>. Tekan jawapan yang betul.</span></li>
      <li><span style="color:var(--rd);display:flex">${IC.heart.replace('<svg ', '<svg width="26" height="26" fill="currentColor" ')}</span><span>Ada <b>3 nyawa</b>. Jawapan salah menolak satu nyawa.</span></li>
      <li><span style="color:var(--pa);display:flex">${IC.fire}</span><span>Betul berturut-turut untuk <b>combo</b>: markah berganda sehingga ×5.</span></li>
      <li><span style="color:var(--am);display:flex">${IC.star}</span><span>Soalan makin sukar apabila skor meningkat.</span></li>
    </ul></div>
    <div class="prow" style="align-items:center;flex-wrap:wrap;gap:14px"><span class="chip" style="height:44px;font-size:16px;background:color-mix(in srgb,var(--am) 14%,transparent);color:var(--am)">${IC.star} Rekod: ${best}</span>
    <button type="button" class="btn pri big" id="gStart" style="margin-left:auto">Mula ${IC.arrow}</button></div></div>`;
  if (G.st === 'end') return `<div class="gend"><p class="eyebrow">${G.lives <= 0 ? 'NYAWA HABIS' : 'MASA TAMAT'}</p><div class="score">${G.score}</div><p class="lead" style="margin:0">markah · ${G.right} jawapan betul</p>
    ${G.newBest ? `<span class="chip" style="height:42px;font-size:16px;background:color-mix(in srgb,var(--am) 16%,transparent);color:var(--am)">${IC.star} Rekod baharu!</span>` : `<span class="chip" style="height:42px;font-size:16px;background:var(--surf);border:1px solid var(--bd);color:var(--mu)">Rekod: ${best}</span>`}
    <div class="prow" style="width:100%;flex-direction:column;margin-top:8px"><button type="button" class="btn pri big" id="gStart">Main lagi</button><a class="btn sec big" href="#/nota">Ulang kaji nota</a></div></div>`;
  const q = G.q, left = Math.max(0, G.end - Date.now()), sec = Math.ceil(left / 1000);
  const hearts = [0, 1, 2].map(i => i < G.lives ? IC.heart.replace('<svg ', '<svg style="fill:var(--rd)" ') : IC.heart.replace('<svg ', '<svg style="fill:none;stroke:var(--dim);stroke-width:2" ')).join('');
  const mult = Math.min(G.combo, 5);
  let fb = '';
  if (G.pick >= 0) fb = G.pick === q.c ? `<div class="gfb ok">${IC.check} Betul! +${10 * Math.max(1, mult)}${mult > 1 ? ` (combo ×${mult})` : ''}</div>` : `<div class="gfb no">${IC.x} Salah. Jawapan: <span style="color:var(--tx)">${q.opts[q.c]}</span></div>`;
  return `<div class="wrap" style="gap:16px">
    <div class="ghud"><div class="hearts" role="img" aria-label="${G.lives} nyawa">${hearts}</div>
      <div class="tbar" role="timer" aria-label="${sec} saat lagi"><div class="bar"><i id="tfill" style="width:${left / 600}%;background:${sec <= 10 ? 'var(--rd)' : 'var(--gr)'}"></i></div><b id="tsec">${sec}s</b></div>
      ${G.combo > 1 ? `<span class="chip" style="height:42px;font-size:16px;background:color-mix(in srgb,var(--pa) 15%,transparent);color:var(--pa)">${IC.fire} Combo ×${mult}</span>` : ''}
      <span class="chip" style="height:42px;font-size:16px;background:var(--surf);border:1px solid var(--bd);color:var(--mu)">Skor <b style="font-family:var(--head);font-size:22px;color:var(--tx)">${G.score}</b></span></div>
    <div class="gq${q.fig ? '' : ' nofig'}">
      ${q.fig ? `<div class="gfig">${q.fig}${q.legend ? '<p style="margin:6px 0 0;text-align:center;font-size:14px;color:var(--mu)"><b style="color:var(--tr)">Biru</b>: objek · <b style="color:var(--pa)">Oren</b>: imej</p>' : ''}</div>` : ''}
      <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
        <h1 class="qtext" style="font-size:clamp(22px,2.4vw,32px)">${q.q}</h1>
        <div class="gopts">${q.opts.map((t, i) => `<button type="button" class="gopt${G.pick >= 0 ? (i === q.c ? ' right' : (i === G.pick ? ' wrong' : '')) : ''}" data-o="${i}"${G.pick >= 0 ? ' disabled' : ''}><span class="k">${'ABCD'[i]}</span><span>${t}</span></button>`).join('')}</div>
        ${fb}
      </div></div></div>`;
}
function gStart() { G.st = 'play'; G.score = 0; G.lives = 3; G.combo = 0; G.right = 0; G.pick = -1; G.newBest = false; G.q = gq(0); G.end = Date.now() + 60000; clearInterval(G.timer); G.timer = setInterval(gTick, 200); render(true); }
function gTick() {
  if (!location.hash.startsWith('#/games')) { clearInterval(G.timer); G.st = 'intro'; return; }
  const left = G.end - Date.now();
  if (left <= 0) return gOver();
  const f = document.getElementById('tfill'), s = document.getElementById('tsec');
  if (f) { f.style.width = (left / 600) + '%'; if (left <= 10000) f.style.background = 'var(--rd)'; }
  if (s) s.textContent = Math.ceil(left / 1000) + 's';
}
function gOver() {
  clearInterval(G.timer); G.st = 'end';
  const s = store(), best = s.best || 0;
  G.newBest = G.score > best;
  if (G.newBest) save({ best: G.score, stars: Math.min(5, Math.floor(G.score / 60)) });
  render(true);
}
function bindGames() {
  const st = document.getElementById('gStart'); if (st) st.onclick = gStart;
  document.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
    if (G.pick >= 0 || G.st !== 'play') return;
    G.pick = +b.dataset.o;
    if (G.pick === G.q.c) { G.combo++; G.right++; G.score += 10 * Math.min(Math.max(G.combo, 1), 5); }
    else { G.combo = 0; G.lives--; }
    render(true);
    setTimeout(() => {
      if (G.st !== 'play') return;
      if (G.lives <= 0 || Date.now() >= G.end) return gOver();
      G.pick = -1; G.q = gq(gLevel()); render(true);
    }, G.pick === G.q.c ? 700 : 1500);
  });
}

/* =================== Penghala =================== */
function render(keepScroll) {
  const h = location.hash.replace(/^#\/?/, ''), p = h.split('/').filter(Boolean);
  const sc = keepScroll && document.getElementById('main') ? document.getElementById('main').scrollTop : 0;
  if (!p.length) { app.innerHTML = viewSplash(); document.title = 'ISOMOVE – Transformasi Isometri'; return; }
  const tab = p[0];
  let inner = '', bind = () => {};
  if (tab === 'nota' && p[1]) { inner = viewSlide(p[1], +p[2] || 1); bind = bindSlide; document.title = `${p[1]} Nota · ISOMOVE`; }
  else if (tab === 'nota') { inner = viewNotaList(); bind = bindNotaList; document.title = 'Nota · ISOMOVE'; }
  else if (tab === 'teroka') { inner = viewTeroka(p[1] || simType); bind = bindTeroka; document.title = 'Teroka · ISOMOVE'; }
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
setMeta(); render(false);
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {}));
