'use strict';
const TITLE0 = document.title; /* tajuk SEO asal halaman bab (dari index.html) */
/* =================== TerokaMath · TERAS: kerangka, NOTA, TEROKA, LATIHAN, Cabaran 60 Saat, penghala =================== */
/* =================== Kerangka =================== */
const app = document.getElementById('app');
const TABS = [['ajar', 'MULA MENGAJAR', 'MENGAJAR'], ['nota', 'NOTA'], ['teroka', 'TEROKA'], ['latihan', 'LATIHAN'], ['games', 'GAMES']];
function shell(tab, inner) {
  const light = isLight();
  const fsOk = document.fullscreenEnabled;
  return `<div class="app tabbed">
  <header class="hdr">
    <a class="ib lgo" href="../#/utama" aria-label="Kembali ke TerokaMath (semua bab)">${IC.mm}</a>
    <a class="wm2" href="../#/utama" aria-label="Kembali ke TerokaMath (semua bab)"><b class="tm">Teroka<span>Math</span></b><small><b class="mv">Bab ${BAB.no}</b> : ${BAB.tajuk}</small></a>
    <nav class="tabs" aria-label="Tab utama">${TABS.filter(t => t[0] !== 'ajar').map(([k, t, sh]) => `<a href="#/${k}"${k === 'ajar' ? ' class="hl"' : ''}${k === tab ? ' aria-current="page"' : ''}>${IC[k]}${sh ? `<span class="tl">${t}</span><span class="ts">${sh}</span>` : `<span>${t}</span>`}</a>`).join('')}</nav>
    <div class="end">
      <a class="pelbtn" href="#/ajar"${tab === 'ajar' ? ' aria-current="page"' : ''}>${IC.play}<span class="tl">Pelan Mengajar</span><span class="ts">Pelan</span></a>
      ${typeof tmLangBtn === 'function' ? tmLangBtn() : ''}
      <button type="button" class="ib" id="themeBtn" aria-label="${light ? 'Tukar ke mod gelap' : 'Tukar ke mod cerah'}">${light ? IC.moon : IC.sun}</button>
      ${fsOk ? `<button type="button" class="ib fsbtn" id="fsBtn" aria-label="Skrin penuh">${IC.fs}</button>` : ''}
    </div>
  </header>
  <main class="main" id="main">${inner}</main></div>`;
}
function bindShell() {
  if (typeof tmBindLang === 'function') tmBindLang();
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
    <img src="${BAB.logo}" alt="Logo ${APPNAME}" width="150" height="150">
    <h1>${BAB.tajuk}</h1>
    <p class="slogan">${BAB.slogan.map(([t, c]) => `<span style="color:var(--${c})">${t}</span>`).join(' ')}</p>
    <p class="sub">Bab ${BAB.no} · Tingkatan ${BAB.ting}</p>
    <a class="btn pri big" href="#/nota">Jom Mula! ${IC.arrow}</a>
  </main>`;
}

/* =================== NOTA =================== */
function viewNotaList() {
  const cards = SUBS.map(s => {
    const n = SLIDES.filter(x => x.sub === s.no && !x.cover).length;
    return `<a class="subcard" href="#/nota/${s.no}/${firstN(s.no)}" style="--c:${subCol(s.no)}">
      <span class="top"><span class="no">${s.no}</span><span class="cnt">${n} slaid</span></span>
      <h2>${s.name}</h2><p>${SUBDESC[s.no]}</p></a>`;
  }).join('');
  return `<div class="wrap">
    <div class="headrow"><div><p class="eyebrow">BAB ${BAB.no} · TINGKATAN ${BAB.ting}</p><h1 class="h1">${BAB.tajuk}</h1><p class="lead">${typeof tmRole === 'function' && tmRole() === 'murid' ? 'Pilih subtopik untuk mula belajar.' : 'Pilih subtopik untuk mula mengajar.'}</p></div>
    <button type="button" class="btn sec" id="printAll">${IC.print} Cetak semua nota (PDF)</button></div>
    <div class="subgrid">${cards}</div></div>`;
}
function bindNotaList() { document.getElementById('printAll').onclick = () => printSlides(SLIDES); }

const firstN = sub => { const f = SLIDES.find(x => x.sub === sub); return f ? f.n : 1; };
function slideHTML(s, light) {
  if (s.cover && typeof coverHTML === 'function') return coverHTML(s, light);
  const col = themed(subOf(s.sub).col, light);
  const head = `<p class="sl-kick">${s.kicker}</p><h1 class="sl-title">${s.title}</h1>`;
  if (s.full) return `<div class="slide full" style="--c:${col}"><div>${head}</div>${themed(s.full, light)}</div>`;
  return `<div class="slide" style="--c:${col}"><div class="sl-text">${head}${themed(s.body, light)}</div><div class="sl-fig">${themed(s.fig, light)}</div></div>`;
}
const NOTA = { i: 0, r: 0 };
let pendingReveal = 0;
function viewSlide(sub, n) {
  const i = SLIDES.findIndex(x => x.sub === sub && x.n === n);
  if (i < 0) { location.replace('#/nota/senarai'); return ''; }
  NOTA.i = i; NOTA.r = pendingReveal; pendingReveal = 0;
  const s = SLIDES[i], so = subOf(sub), col = subCol(sub);
  const dots = Array.from({ length: s.N }, (_, k) => `<i${k + 1 === n ? ' class="on"' : ''}></i>`).join('');
  const sim = SUBSIM[sub];
  return `<div class="slbar">
      <a class="btn sec bk" href="#/nota/senarai" style="min-height:44px;padding:0 14px" aria-label="Kembali ke senarai subtopik">${IC.left}<span>Subtopik</span></a>
      <span class="chip" style="background:${col};color:var(--on)">${sub}</span><span class="nm">${so.name}</span>
      <span class="pg">${s.cover ? 'Tajuk' : `Slaid ${n} / ${s.N}`}</span>
      <button type="button" class="ib" id="printSub" aria-label="Cetak nota subtopik ini">${IC.print}</button>
      <a class="ib" id="laporBtn" target="_blank" rel="noopener" aria-label="Lapor kesilapan" title="Lapor kesilapan" href="https://docs.google.com/forms/d/e/1FAIpQLSdgxNeB9wg-rd7DI483IefrdaoQHgAqb5-bFadoP-Ey0L5asQ/viewform?usp=pp_url&entry.1811725042=${encodeURIComponent(`T${BAB.ting} Bab ${BAB.no} ${BAB.tajuk}`)}&entry.1194010615=${encodeURIComponent(`${sub} ${so.name}, ${s.cover ? 'Tajuk' : 'Slaid ' + n}`)}">${sv('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', 20)}</a>
    </div>
    <div class="ajp-main nink" id="ajpMain"><div class="stage" id="stage" style="--c:${col}">${slideHTML(s, slPal())}</div><canvas id="ink" class="ink${AJ.tool ? ' on' : ''}" aria-hidden="true"></canvas>${penTools(true)}</div>
    <div class="slfoot" style="--c:${col}">
      ${sim ? `<a class="btn sec tk" href="#/teroka/${sim}" style="min-height:48px" aria-label="Cuba di TEROKA">${IC.teroka}<span>Cuba di TEROKA</span></a>` : '<span class="hint">Anak panah papan kekunci untuk tukar slaid</span>'}
      <div class="dots" role="img" aria-label="Slaid ${n} daripada ${s.N}">${dots}</div>
      <button type="button" class="ib" id="prevBtn" aria-label="Slaid sebelum" style="width:56px;height:52px">${IC.left}</button>
      <button type="button" class="btn pri" id="nextBtn" style="min-height:52px"><span id="nextLbl">Seterusnya</span>${IC.right}</button>
    </div>`;
}
function rvOrder(a) { return a.map((e, k) => [e, e.dataset.o !== undefined ? +e.dataset.o : k]).sort((x, y) => x[1] - y[1]).map(x => x[0]); }
function revealEls() { const st = document.getElementById('stage'); return st ? rvOrder([...st.querySelectorAll('.rv')]) : []; }
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
  if (NOTA.i < SLIDES.length - 1) goSlide(NOTA.i + 1, 0); else { toast('Tamat nota Bab ' + BAB.no); location.hash = '#/nota/senarai'; }
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
    if (x0 == null || AJ.tool) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) nextStep(); else prevStep(); }
  }, { passive: true });
  bindPen();
}
document.addEventListener('keydown', e => {
  if (!/^#\/nota\/\d/.test(location.hash)) return;
  if (e.target.closest && e.target.closest('input,textarea,select')) return;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
    if (e.key === 'Enter' && e.target.closest && e.target.closest('a,button')) return;
    e.preventDefault(); nextStep();
  } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); prevStep(); }
  else if (e.key === 'Escape' && AJ.tool) { e.preventDefault(); AJ.tool = null; inkTools(); }
});

let printing = false;
const slidesDoc = list => list.filter(s => !s.cover).map(s => `<section class="ps"><div class="pshead"><span>${APPNAME} · ${s.sub} ${subOf(s.sub).name}</span><span>Slaid ${s.n} / ${s.N}</span></div>${slideHTML(s, true)}</section>`).join('');
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

/* =================== TEROKA: simulasi bab (SIMLIST dalam bab.js) =================== */
let simLast = SIMLIST[0][0];
function viewTeroka(type) {
  if (!SIMLIST.some(x => x[0] === type)) type = simLast;
  simLast = type;
  const name = SIMLIST.find(x => x[0] === type)[1];
  return `<div class="tero">
    <nav class="seg terseg" aria-label="Pilih simulasi">${SIMLIST.map(([k, t, c]) => `<a href="#/teroka/${k}"${k === type ? ' aria-current="page"' : ''} style="--c:var(--${c})">${t}</a>`).join('')}</nav>
    <iframe class="simframe" src="simulasi/${type}${BAB.en?'_en':''}.html" title="Simulasi ${name}"></iframe>
  </div>`;
}
function bindTeroka() {}

/* =================== LATIHAN =================== */
const LAT = { on: Object.fromEntries(SUBS.map((s, i) => [s.no, i < 3])), n: 10, qs: [], i: 0, show: false };
try { const sv0 = store().latihan; if (sv0) { Object.assign(LAT.on, sv0.on || {}); LAT.n = sv0.n || 10; } } catch (e) {}
const mix = N => { let m = Math.round(N * .6), s = Math.round(N * .3), k = N - m - s; if (k < 1 && N >= 5) { s--; k = 1; } return { m, s, k }; };
const LVL = { m: ['MUDAH', 'gr'], s: ['SEDERHANA', 'am'], k: ['SUKAR', 'rd'] };
function viewLatihan() {
  const mx = mix(LAT.n);
  const items = SUBS.map(s => `<label class="tcheck${LAT.on[s.no] ? ' on' : ''}" style="--c:${subCol(s.no)}"><input type="checkbox" data-sub="${s.no}"${LAT.on[s.no] ? ' checked' : ''}><span class="no">${s.no}</span><span>${s.name}</span></label>`).join('');
  return `<div class="wrap">${latSeg('kelas')}<div>${(typeof tmRole === 'function' && tmRole() === 'murid') ? '<h1 class="h1">Latihan</h1><p class="lead">Pilih subtopik yang <b style="color:var(--tx)">kamu sudah belajar</b>. Soalan hanya diambil daripada subtopik ini.</p>' : '<h1 class="h1">Latihan Kelas</h1><p class="lead">Tandakan subtopik yang <b style="color:var(--tx)">sudah diajar</b>. Soalan hanya diambil daripada subtopik ini.</p>'}</div>
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

/* ---------- pilihan topik untuk game (Cabaran 60 Saat, Siapa Nak Jawab?, Roda Nama) ---------- */
const GTOPIK = typeof BAB !== 'undefined' && BAB.gtopik !== false && typeof CQT !== 'undefined' && typeof cq === 'function';
const gtAll = () => Object.keys(CQT);
const gtSel = key => store()[key] === undefined ? gtAll() : store()[key].filter(k => k in CQT);   // jenis yang dipilih (lalai: semua)
const gtSub = types => types.length && types.length < gtAll().length;                                 // pilih sebahagian sahaja
const gtHTML = (types, attr, c) => `<div class="ktypes"${c ? ` style="--pa:var(--${c})"` : ''}>${gtAll().map(k => `<label class="ajchk"><input type="checkbox" ${attr}="${k}"${types.includes(k) ? ' checked' : ''}>${CQT[k]}</label>`).join('')}</div>`;
const gtBind = (attr, key, after) => document.querySelectorAll(`[${attr}]`).forEach(c => c.onchange = () => {
  const t = c.getAttribute(attr), cur = gtSel(key), nx = c.checked ? [...new Set(cur.concat(t))] : cur.filter(x => x !== t);
  save({ [key]: nx }); after(nx);
});

/* ---------- keadaan & paparan ---------- */
const G = { st: 'intro', score: 0, lives: 3, combo: 0, right: 0, q: null, pick: -1, tap: null, ok: null, end: 0, pausedAt: 0, timer: 0, newBest: false, gain: 0 };
function gLevel() { return G.score < 100 ? 0 : G.score < 250 ? 1 : 2; }
const g60Q = L => { if (GTOPIK) { const t = gtSel('g60types'); if (gtSub(t)) return cq(L, t); } return gq(L); };
const answered = () => G.ok !== null;
function viewGames() {
  const best = store().best || 0, mute = !!store().mute;
  const muteBtn = `<button type="button" class="ib" id="gMute" aria-label="${mute ? 'Hidupkan bunyi' : 'Senyapkan bunyi'}" aria-pressed="${mute}">${mute ? sv('<path d="M11 5L6 9H2v6h4l5 4zM23 9l-6 6M17 9l6 6"/>', 20) : sv('<path d="M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>', 20)}</button>`;
  if (G.st === 'intro') return `<div class="wrap" style="max-width:880px">
    <div class="headrow"><div><p class="eyebrow">GAMES</p><h1 class="h1">Cabaran 60 Saat</h1><p class="lead">Jawab seberapa banyak soalan dalam masa 60 saat.</p></div>${muteBtn}</div>
    <div class="pbox" style="padding:22px"><ul class="rules">
      <li>${IC.clock}<span>Masa <b>60 saat</b>. ${BAB.g60.soalan}</span></li>
      <li><span style="color:var(--rd);display:flex">${IC.heart.replace('<svg ', '<svg width="26" height="26" fill="currentColor" ')}</span><span>Ada <b>3 nyawa</b>. Jawapan salah menolak satu nyawa.</span></li>
      <li><span style="color:var(--pa);display:flex">${IC.fire}</span><span>Betul berturut-turut untuk <b>combo</b>: markah berganda sehingga ×5.</span></li>
      <li><span style="color:var(--am);display:flex">${IC.star}</span><span>${BAB.g60.lepas}</span></li>
    </ul></div>
    ${GTOPIK ? `<div class="pbox" style="padding:18px 22px"><h3>JENIS SOALAN</h3>${gtHTML(gtSel('g60types'), 'data-gt', 'tr').replace('class="ktypes"', 'class="ktypes two"')}</div>` : ''}
    <div class="prow" style="align-items:center;flex-wrap:wrap;gap:14px"><span class="chip" style="height:44px;font-size:16px;background:color-mix(in srgb,var(--am) 14%,transparent);color:var(--am)">${IC.star} Rekod: ${best}</span>
    <button type="button" class="btn pri big" id="gStart" style="margin-left:auto"${GTOPIK && !gtSel('g60types').length ? ' disabled' : ''}>Mula ${IC.arrow}</button></div></div>`;
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
        ${answered() ? '' : `<button type="button" class="btn sec gskip" id="gSkip">Langkau soalan ${IC.right}</button>`}
        ${fb}
      </div></div></div>`;
}
function gStart() {
  G.st = 'play'; G.score = 0; G.lives = 3; G.combo = 0; G.right = 0; G.pick = -1; G.tap = null; G.ok = null; G.newBest = false; G.pausedAt = 0;
  G.q = g60Q(0); G.end = Date.now() + 60000; clearInterval(G.timer); G.timer = setInterval(gTick, 200); render(true);
}
function gTick() {
  if (!gActive('60')) { clearInterval(G.timer); G.st = 'intro'; return; }
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
    G.pick = -1; G.tap = null; G.ok = null; G.q = g60Q(gLevel()); render(true);
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
  if (GTOPIK && G.st === 'intro') gtBind('data-gt', 'g60types', () => render(true));
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
  const sk = document.getElementById('gSkip'); if (sk) sk.onclick = () => { if (answered()) return; G.combo = 0; G.pick = -1; G.tap = null; G.q = g60Q(gLevel()); snd('tap'); render(true); };
  const ck = document.getElementById('gCheck');
  if (ck) ck.onclick = () => { if (!G.tap || answered()) return; gAnswer(G.tap[0] === G.q.target[0] && G.tap[1] === G.q.target[1]); };
}

/* =================== Penghala =================== */
function render(keepScroll) {
  const h = location.hash.replace(/^#\/?/, ''), p = h.split('/').filter(Boolean);
  const sc = keepScroll && document.getElementById('main') ? document.getElementById('main').scrollTop : 0;
  const rr = typeof tmMuridRoute === 'function' ? tmMuridRoute(p) : ''; if (rr) { location.replace(rr); return; }
  if (!p.length) { location.replace('#/nota'); return; }  // skrin Jom Mula dibuang (26 Nov)
  if (!p.length) { app.innerHTML = viewSplash(); document.title = TITLE0; return; }
  const tab = p[0];
  let inner = '', bind = () => {};
  if (tab === 'k' && p[1] && p[2] === 'tayang') { viewKongsi(p[1]); if (!AJK.plan) { if (AJK.err) location.replace('#/k/' + p[1]); return; } const v = viewTayang(); if (!v) return; app.innerHTML = v; document.title = 'Mengajar · ' + APPNAME; bindTayang(); return; }
  if (tab === 'k' && p[1]) { app.innerHTML = viewKongsi(p[1]); document.title = 'Pelan dikongsi · ' + APPNAME; bindKongsi(); return; }
  if (tab === 'ajar' && p[1] === 'tayang') { const v = viewTayang(); if (!v) return; app.innerHTML = v; document.title = 'Mengajar · ' + APPNAME; bindTayang(); return; }
  if (tab === 'ajar') { inner = viewSusun(); bind = bindSusun; document.title = 'Mula Mengajar · ' + APPNAME; }
  else if (tab === 'nota' && p[1] === 'senarai') { inner = viewNotaList(); bind = bindNotaList; document.title = 'Nota · ' + APPNAME; }
  else if (tab === 'nota' && p[1]) { inner = viewSlide(p[1], p[2] === undefined ? firstN(p[1]) : +p[2]); bind = bindSlide; document.title = `${p[1]} Nota · ${APPNAME}`; }
  else if (tab === 'nota') { inner = viewNotaList(); bind = bindNotaList; document.title = TITLE0; }
  else if (tab === 'teroka') { inner = viewTeroka(p[1]); bind = bindTeroka; document.title = 'Teroka · ' + APPNAME; }
  else if (tab === 'latihan' && p[1] === 'lembaran') { inner = viewLembaran(); bind = bindLembaran; document.title = 'Lembaran Kerja · ' + APPNAME; }
  else if (tab === 'latihan' && p[1] === 'main') { inner = viewLatMain(); bind = bindLatMain; document.title = 'Latihan · ' + APPNAME; }
  else if (tab === 'latihan') { inner = viewLatihan(); bind = bindLatihan; document.title = 'Latihan · ' + APPNAME; }
  else if (tab === 'games' && GMODES[p[1]]) { const md = p[1]; inner = viewGameMode(md); bind = () => bindGameMode(md); document.title = GMODES[md][0] + ' · ' + APPNAME; }
  else if (tab === 'games') { inner = viewGamePilih(); document.title = 'Games · ' + APPNAME; }
  else { location.replace('#/nota'); return; }
  if (!inner) return;
  app.innerHTML = shell(tab, inner);
  bindShell(); bind();
  if (keepScroll) { const m = document.getElementById('main'); if (m) m.scrollTop = sc; }
}
window.addEventListener('hashchange', () => { render(false); });
document.documentElement.classList.add('t2');  // tema 2 untuk semua bab (26 Nov)
window.addEventListener('DOMContentLoaded', () => { setMeta(); render(false); });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {}));
