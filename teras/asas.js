'use strict';
/* =================== TerokaMath · TERAS: asas (dikongsi semua bab) =================== */
// Perlu dimuat SELEPAS bab.js dan slides.js bagi bab itu.
const KEY = BAB.key;
const APPNAME = BAB.nama.join('');
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
  mm: '<svg width="26" height="26" viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="34" fill="none" style="stroke:var(--mu)" stroke-opacity=".5" stroke-width="3"/><polygon points="48,10 54.5,41.5 48,48 41.5,41.5" fill="#2EE6A6"/><polygon points="86,48 54.5,54.5 48,48 54.5,41.5" fill="#FF8A3D"/><polygon points="48,86 41.5,54.5 48,48 54.5,54.5" fill="#B57BFF"/><polygon points="10,48 41.5,41.5 48,48 41.5,54.5" fill="#FFC93C"/><circle cx="48" cy="48" r="4.5" style="fill:var(--tx)"/></svg>'
};

/* ---------- data subtopik ---------- */

const subOf = no => SUBS.find(s => s.no === no);
const subCol = no => themed(subOf(no).col, isLight());

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


/* ---------- pembantu soalan ---------- */
const GEN_LQ = (key, d, extra) => { const v = vq(key, d), e = Object.assign({}, extra || {}); if (v.rev) delete e.fig; delete v.rev; return Object.assign(e, v); };
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let WR = Math.random;
const wri = (a, b) => a + Math.floor(WR() * (b - a + 1));
const wpick = a => a[Math.floor(WR() * a.length)];
const wnz = (a, b) => { let v; do v = wri(a, b); while (v === 0); return v; };
const wcap = s => s[0].toUpperCase() + s.slice(1);
const LVLN = { m: ['Mudah', 'gr'], s: ['Sederhana', 'am'], k: ['Sukar', 'rd'] };

let VR = Math.random;
let VUSE = {};
function vreset(rnd) { VUSE = {}; VR = rnd || Math.random; }
const vr = a => a[Math.floor(VR() * a.length)];
function vq(key, d) {
  const list = QV[key], u = VUSE[key] || (VUSE[key] = list.map(() => 0));
  const min = Math.min(...u), idx = [];
  u.forEach((c, i) => { if (c === min) idx.push(i); });
  const k = idx[Math.floor(VR() * idx.length)];
  u[k]++;
  const v = list[k](d);
  return { q: v.q, ans: v.ans || d.ans, work: v.work || (v.pre || []).concat(d.work || []), rev: !!v.rev };
}
const pr = s => s.split('').map(c => c + '′').join('');
const vcap = s => s[0].toUpperCase() + s.slice(1);
const HUR = ['A', 'B', 'D', 'E', 'G', 'H', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'W'];
const vlet = () => vr(HUR);
const NAMA = ['Amir', 'Siti', 'Mei Ling', 'Ravi', 'Aisyah', 'Daniel'];
const vnama = () => vr(NAMA);
const arahX = a => `${Math.abs(a)} unit ke ${a > 0 ? 'kanan' : 'kiri'}`;
const arahY = b => `${Math.abs(b)} unit ke ${b > 0 ? 'atas' : 'bawah'}`;
const PK = onX => (onX ? 'paksi-x' : 'paksi-y');
const ARAH = cw => (cw ? 'ikut arah jam' : 'lawan arah jam');
const KATAKERJA = { translasi: 'ditranslasikan', pantulan: 'dipantulkan pada satu garis', putaran: 'diputar pada satu titik' };
const salah = (N, betul, sebab) => ({ ans: `Tidak betul. Jawapan yang betul: ${betul}`, pre: [sebab] });
