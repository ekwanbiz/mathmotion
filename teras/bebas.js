'use strict';
/* =================== SLAID BEBAS & IMPORT PPTX/PDF (Pelan Mengajar) ===================
   Dimuat selepas ajar.js. Menggantikan 5 templat "Slaid baharu" dengan:
   1) Slaid bebas – kotak teks (font, saiz, warna, tebal), gambar dan link/video di mana-mana,
      latar pilihan. Koordinat dalam % slaid 16:9; saiz font dalam px pada lebar 1280.
   2) Import PPTX / PDF – setiap muka surat jadi gambar latar slaid bebas (boleh tulis di atasnya).
   Gambar disimpan dalam IndexedDB (bukan localStorage); item hanya simpan rujukan "idb:<id>".
   Gambar TIDAK ikut dalam link kongsi. Pustaka import (lib/) dimuat hanya semasa import. */

const BB = {
  BG: { putih: ['Putih', '#ffffff', '#1f2937'], gelap: ['Gelap', '#0f172a', '#f1f5f9'], krim: ['Krim', '#FEF3C7', '#422006'], hijau: ['Hijau', '#DCFCE7', '#14532d'], ungu: ['Ungu', '#EDE9FE', '#3b0764'], grid: ['Grid', '#ffffff', '#1f2937'] },
  FONT: { inter: ['Biasa', "Inter,system-ui,sans-serif"], sg: ['Tajuk', "'Space Grotesk',Inter,sans-serif"], serif: ['Serif', "Georgia,'Times New Roman',serif"], tangan: ['Tulisan tangan', "'Comic Sans MS','Comic Neue','Chalkboard SE',cursive"], taip: ['Mesin taip', "'Courier New',Courier,monospace"] },
  FS: [16, 20, 24, 32, 40, 48, 64, 80],
  LIB: new URL('../lib/', document.currentScript.src).href,
  MAXPG: 80
};
const bbN = (v, d, lo, hi) => { v = Number(v); return Number.isFinite(v) ? Math.max(lo, Math.min(hi, Math.round(v * 10) / 10)) : d; };
const bbCol = c => /^#[0-9a-fA-F]{6}$/.test(c || '') ? c : '';

/* ---------- simpanan gambar (IndexedDB) ---------- */
const IMG = { c: {}, db: null, loaded: false };
function imgDB() {
  if (!IMG.db) IMG.db = new Promise((res, rej) => {
    if (!window.indexedDB) return rej(new Error('idb'));
    const r = indexedDB.open('terokamath-img', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('img');
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  return IMG.db;
}
async function imgPut(url) {
  const id = AJKEY + ':' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  IMG.c[id] = url;
  const db = await imgDB();
  await new Promise((res, rej) => { const tx = db.transaction('img', 'readwrite'); tx.objectStore('img').put(url, id); tx.oncomplete = res; tx.onerror = () => rej(tx.error); tx.onabort = () => rej(tx.error); });
  return 'idb:' + id;
}
const imgSrc = s => { s = String(s || ''); if (s.startsWith('idb:')) s = IMG.c[s.slice(4)] || ''; return /^data:image\/(jpeg|png|gif|webp);base64,[\w+/=]+$/.test(s) ? s : ''; };
function bbRefs() {
  const out = new Set();
  ajData().plans.forEach(p => p.items.forEach(it => {
    if (it.bgi) out.add(String(it.bgi).slice(4));
    (it.els || []).forEach(e => { if (e.k === 'g' && String(e.src || '').startsWith('idb:')) out.add(e.src.slice(4)); });
  }));
  return out;
}
// muat semua gambar bab ini sekali; buang gambar yang tidak lagi digunakan
function bbEnsureImgs() {
  if (IMG.loaded) return; IMG.loaded = true;
  imgDB().then(db => new Promise(res => {
    const used = bbRefs(), mine = AJKEY + ':', tx = db.transaction('img', 'readwrite'), rq = tx.objectStore('img').openCursor();
    let n = 0;
    rq.onsuccess = () => { const c = rq.result; if (!c) return; if (String(c.key).startsWith(mine)) { if (used.has(c.key)) { IMG.c[c.key] = c.value; n++; } else c.delete(); } c.continue(); };
    tx.oncomplete = () => res(n); tx.onerror = () => res(n);
  })).then(n => { if (n && /^#\/(ajar|k\/)/.test(location.hash) && !(AJS.modal && AJS.modal.type === 'bebas')) render(true); }).catch(() => {});
}

/* ---------- link: video & laman yang boleh dipapar dalam slaid ---------- */
function bbEmbed(url) {
  const u = ajUrl(url); if (!u) return null;
  const yt = ajYt(u);
  if (yt) return { src: `https://www.youtube-nocookie.com/embed/${yt.id}?rel=0${yt.st ? '&start=' + yt.st : ''}`, thumb: `https://i.ytimg.com/vi/${yt.id}/hqdefault.jpg`, nm: 'Video YouTube' };
  const x = new URL(u), h = x.hostname.replace(/^www\./, '');
  let m;
  if (h === 'docs.google.com' && (m = x.pathname.match(/^\/presentation\/d\/(e\/)?([\w-]+)/))) return { src: `https://docs.google.com/presentation/d/${m[1] || ''}${m[2]}/embed`, nm: 'Google Slides' };
  if (h === 'canva.com' && /^\/design\/[\w-]+\/[\w-]+\/view/.test(x.pathname)) return { src: `https://www.canva.com${x.pathname}?embed`, nm: 'Canva' };
  if (/(^|\.)(geogebra\.org|desmos\.com|wordwall\.net|phet\.colorado\.edu)$/.test(h)) return { src: u, nm: h };
  return null;
}
const bbHost = u => { try { return new URL(ajUrl(u)).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };

/* ---------- papar slaid bebas: mode 'pv' (pratonton), 'ed' (editor), 'play' (tayang) ---------- */
function bbEl(e, i, mode, tc) {
  const x = bbN(e.x, 10, -50, 100), y = bbN(e.y, 10, -50, 100), w = bbN(e.w, 40, 3, 150), h = bbN(e.h, 30, 3, 150);
  const pos = `left:${x}%;top:${y}%;width:${w}%`;
  const ed = mode === 'ed' ? ` data-el="${i}"` : '';
  const rs = mode === 'ed' ? '<span class="bb-rs" data-rs="1" aria-hidden="true"></span>' : '';
  if (e.k === 't') {
    const f = BB.FONT[e.f] ? e.f : 'inter', s = BB.FS.includes(+e.s) ? +e.s : 32, c = bbCol(e.c) || tc;
    return `<div class="bb-el bb-t"${ed} style="${pos};font-family:${BB.FONT[f][1]};--s:${s};color:${c}${e.b ? ';font-weight:700' : ''}"><div class="bb-tx">${esc(e.tx || '')}</div>${rs}</div>`;
  }
  if (e.k === 'g') {
    const src = imgSrc(e.src);
    return `<div class="bb-el bb-g"${ed} style="${pos};height:${h}%">${src ? `<img src="${src}" alt="" draggable="false">` : '<span class="bb-ph">Gambar</span>'}${rs}</div>`;
  }
  if (e.k === 'l') {
    const url = ajUrl(e.url), em = bbEmbed(url), host = bbHost(url);
    let inner;
    if (em && mode === 'play') inner = `<iframe src="${esc(em.src)}" title="${esc(em.nm)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><a class="bb-out" href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="Buka di tab baharu">↗</a>`;
    else if (em && em.thumb) inner = `<img src="${em.thumb}" alt="" draggable="false"><span class="bb-play" aria-hidden="true"></span>`;
    else if (em) inner = `<span class="bb-card"><b>${esc(em.nm)}</b><small>Dipaparkan dalam slaid semasa tayang</small></span>`;
    else inner = `<${mode === 'play' ? `a href="${esc(url)}" target="_blank" rel="noopener noreferrer"` : 'span'} class="bb-card bb-btn"><b>Buka laman ↗</b><small>${esc(host || 'Pautan')}</small></${mode === 'play' ? 'a' : 'span'}>`;
    return `<div class="bb-el bb-l"${ed} style="${pos};height:${h}%">${inner}${rs}</div>`;
  }
  return '';
}
function bbInner(it, mode) {
  const bg = BB.BG[it.bg] ? it.bg : 'putih', tc = BB.BG[bg][2];
  const bgi = it.bgi ? imgSrc(it.bgi) : '';
  const miss = it.bgi && !bgi ? '<span class="bb-miss">Gambar slaid tidak ada pada peranti ini</span>' : '';
  return `${bgi ? `<img class="bb-bgi" src="${bgi}" alt="" draggable="false">` : ''}${miss}${(Array.isArray(it.els) ? it.els : []).map((e, i) => bbEl(e, i, mode, tc)).join('')}`;
}
function bbHTML(it, mode) {
  const bg = BB.BG[it.bg] ? it.bg : 'putih';
  return `<div class="bbw"><div class="bb bg-${bg}${it.bgi ? ' imp' : ''}" style="background-color:${BB.BG[bg][1]}"${mode === 'ed' ? ' id="bbC"' : ''}>${bbInner(it, mode)}</div></div>`;
}
function bbName(it) {
  const t = (it.els || []).filter(e => e.k === 't' && strip(e.tx)).sort((a, b) => (+b.s || 32) - (+a.s || 32))[0];
  if (it.bgi) return it.nm ? `Import: ${it.nm}` : 'Slaid import';
  return t ? strip(t.tx).slice(0, 60) : 'Slaid bebas';
}
function bbRph(it) {
  const t = x => `<i>${esc(strip(x))}</i>`;
  const l = (it.els || []).find(e => e.k === 'l' && ajUrl(e.url)), tx = (it.els || []).filter(e => e.k === 't' && strip(e.tx)).sort((a, b) => (+b.s || 32) - (+a.s || 32))[0];
  if (l && ajYt(l.url)) return `Murid menonton video${tx ? ' ' + t(tx.tx) : ''}.`;
  if (l) return `Murid meneroka ${t(bbEmbed(l.url) ? bbEmbed(l.url).nm : bbHost(l.url))}${tx ? ' tentang ' + t(tx.tx) : ''}.`;
  if (tx && /\?\s*$/.test(strip(tx.tx))) return `Murid menjawab soalan: ${t(tx.tx)}`;
  if (tx) return `Guru menerangkan ${t(tx.tx)}.`;
  if (it.bgi) return `Guru menerangkan isi pelajaran menggunakan slaid${it.nm ? ' ' + t(it.nm) : ''}.`;
  return 'Guru dan murid berbincang menggunakan slaid.';
}

/* ---------- tukar slaid templat lama → slaid bebas ---------- */
function bbFromOld(it) {
  if (it.tpl === 'bebas') return JSON.parse(JSON.stringify(it));
  const lat = { am: 'krim', gr: 'hijau', pk: 'ungu' };
  const COL = { tr: '#0284C7', rd: '#DC2626', gr: '#059669', pa: '#EA580C', pu: '#7C3AED' };
  const SZ = { k: .75, b: 1.3, sb: 1.65 };
  const fz = (key, base) => { const f = (it.fmt && it.fmt[key]) || {}, v = base * (SZ[f.s] || 1); return BB.FS.reduce((a, b) => Math.abs(b - v) < Math.abs(a - v) ? b : a); };
  const fc = key => { const f = (it.fmt && it.fmt[key]) || {}; return COL[f.c] || ''; };
  const fb = (key, d) => { const f = (it.fmt && it.fmt[key]) || {}; return f.b || d; };
  const T = (tx, x, y, w, key, base, b, f) => ({ k: 't', tx: tx || '', x, y, w, f: f || 'inter', s: fz(key, base), c: fc(key), b: fb(key, b) });
  const out = { t: 'cikgu', tpl: 'bebas', bg: it.tpl === 'papan' && (it.bg || 'grid') !== 'kosong' ? 'grid' : (lat[it.lat] || 'putih'), els: [] };
  const E = out.els;
  if (it.kick && it.tpl !== 'soalan') E.push(T(it.kick, 5, 5, 90, 'kick', 20, true));
  if (it.tpl === 'isi') {
    E.push(T(it.title || 'Tajuk', 5, 12, 90, 'title', 48, true, 'sg'));
    if (it.text) E.push(T(String(it.text).split('\n').map(l => l.trim()).filter(Boolean).map(l => '• ' + l).join('\n'), 5, 32, 90, 'text', 32));
  } else if (it.tpl === 'soalan') {
    E.push(T(it.kick || 'SOALAN CEPAT', 5, 5, 90, 'kick', 20, true));
    E.push(T(it.q || 'Soalan', 5, 14, 90, 'q', 48, true, 'sg'));
    if (it.ans) { const a = T('Jawapan: ' + it.ans, 5, 66, 90, 'ans', 32, true); if (!a.c) a.c = '#059669'; E.push(a); }
  } else if (it.tpl === 'gambar') {
    if (it.title) E.push(T(it.title, 5, 5, 90, 'title', 48, true, 'sg'));
    if (it.img) { const w = bbN(it.w, 60, 15, 100) * .9; E.push({ k: 'g', src: it.img, x: bbN((it.x != null ? it.x : 50) - w / 2, 20, 0, 100), y: 22, w, h: 70 }); }
  } else if (it.tpl === 'papan') {
    if (it.title) E.push(T(it.title, 5, 5, 90, 'title', 48, true, 'sg'));
  } else if (it.tpl === 'pautan') {
    E.push(T(it.title || 'Pautan', 5, 5, 90, 'title', 48, true, 'sg'));
    if (ajUrl(it.link)) E.push({ k: 'l', url: ajUrl(it.link), x: 20, y: 22, w: 60, h: 60 * (ajYt(it.link) ? 1 : .5) });
  }
  return out;
}
function bbClean(it) {
  const o = { t: 'cikgu', tpl: 'bebas', bg: BB.BG[it.bg] ? it.bg : 'putih', els: [] };
  if (it.bgi) o.bgi = String(it.bgi);
  if (it.nm) o.nm = String(it.nm).slice(0, 80);
  (Array.isArray(it.els) ? it.els : []).forEach(e => {
    const p = { x: bbN(e.x, 10, -50, 100), y: bbN(e.y, 10, -50, 100), w: bbN(e.w, 40, 3, 150) };
    if (e.k === 't') { if (!String(e.tx || '').trim()) return; Object.assign(p, { k: 't', tx: String(e.tx).slice(0, 2000), f: BB.FONT[e.f] ? e.f : 'inter', s: BB.FS.includes(+e.s) ? +e.s : 32 }); if (bbCol(e.c)) p.c = e.c; if (e.b) p.b = true; }
    else if (e.k === 'g') { if (!e.src) return; Object.assign(p, { k: 'g', src: String(e.src), h: bbN(e.h, 30, 3, 150) }); }
    else if (e.k === 'l') { if (!ajUrl(e.url)) return; Object.assign(p, { k: 'l', url: ajUrl(e.url), h: bbN(e.h, 30, 3, 150) }); }
    else return;
    o.els.push(p);
  });
  return o;
}
// untuk link kongsi: buang gambar & slaid import
function bbShare(it) {
  if (it.tpl !== 'bebas') return it;
  const o = Object.assign({}, it); delete o.bgi;
  o.els = (it.els || []).filter(e => e.k !== 'g');
  return (it.bgi && !o.els.length) ? null : o;
}
const bbHasImg = it => !!(it.img || it.bgi || (it.els || []).some(e => e.k === 'g'));

/* ---------- pustaka "Slaid baharu" ---------- */
function bbLibHTML() {
  return `<button type="button" class="ajadd tpl" data-newbebas="1"><span><b>Slaid bebas</b><small>Teks, gambar &amp; video di mana-mana</small></span>${ajIcon.plus}</button>
    <label class="ajadd tpl" style="cursor:pointer"><span><b>Import PPTX / PDF</b><small>Setiap muka surat jadi satu slaid</small></span>${ajIcon.plus}<input type="file" id="bbImp" accept=".pptx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation" hidden></label>
    <p class="ajhint">PDF paling tepat. Dari PowerPoint atau Canva, simpan sebagai PDF dahulu. PPTX boleh, tetapi rupa mungkin lari sedikit.</p>`;
}
function bbBindLib(pl) {
  document.querySelectorAll('[data-newbebas]').forEach(b => b.onclick = () => bbOpen({ t: 'cikgu', tpl: 'bebas', bg: 'putih', els: [] }, null));
  const fi = document.getElementById('bbImp');
  if (fi) fi.onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) bbImport(f, pl); };
}
function bbOpen(it, edit) { AJS.modal = { type: 'bebas', it: bbFromOld(it), edit, sel: -1 }; render(true); }

/* ---------- editor ---------- */
function bbModalHTML(M) {
  const it = M.it;
  const fonts = Object.keys(BB.FONT).map(k => `<option value="${k}">${BB.FONT[k][0]}</option>`).join('');
  const sizes = BB.FS.map(s => `<option value="${s}">${s}</option>`).join('');
  const bgs = Object.keys(BB.BG).map(k => `<button type="button" class="bbsw sw-${k}" data-bbbg="${k}" aria-pressed="${(it.bg || 'putih') === k}" aria-label="Latar ${BB.BG[k][0]}" title="${BB.BG[k][0]}" style="background-color:${BB.BG[k][1]}"></button>`).join('');
  return `<div class="ajm-bg"><section class="ajm bbm" role="dialog" aria-modal="true" aria-label="Slaid bebas">
    <div class="ajm-h">${typeChip('cikgu')}<h2>${M.edit != null ? 'Ubah slaid' : 'Slaid bebas'}</h2><button type="button" class="ib" id="ajmX" aria-label="Tutup">${IC.x}</button></div>
    <div class="bbtb" role="toolbar" aria-label="Alat slaid">
      <button type="button" class="btn sec" id="bbAddT">${ajIcon.plus}<span>Teks</span></button>
      <label class="btn sec" style="cursor:pointer">${ajIcon.img}<span>Gambar</span><input type="file" id="bbAddG" accept="image/*" hidden></label>
      <button type="button" class="btn sec" id="bbAddL">${ajIcon.share}<span>Link / video</span></button>
      <span class="bbsep"></span>
      <select id="bbF" aria-label="Jenis font">${fonts}</select>
      <select id="bbS" aria-label="Saiz font">${sizes}</select>
      <input type="color" id="bbCo" aria-label="Warna teks" value="#1f2937">
      <button type="button" class="ib" id="bbB" aria-label="Tebal" aria-pressed="false"><b>B</b></button>
      <button type="button" class="ib" id="bbDel" aria-label="Padam yang dipilih">${ajIcon.trash}</button>
    </div>
    <div class="bbed">${bbHTML(it, 'ed')}</div>
    <div class="bbft">
      <div class="bbsws"${it.bgi ? ' hidden' : ''}><span>LATAR</span>${bgs}</div>
      <p class="ajhint" id="bbHint">Klik untuk pilih. Seret untuk alih. Tarik bucu untuk ubah saiz. Klik dua kali pada teks untuk menulis.</p>
      <button type="button" class="btn pri" id="ajmOk" style="--tr:var(--pu)">${M.edit != null ? 'Simpan perubahan' : 'Tambah ke pelan'}</button>
    </div>
  </section></div>`;
}
function bbBind(pl) {
  const M = AJS.modal, it = M.it, close = () => { AJS.modal = null; render(true); };
  const $ = id => document.getElementById(id);
  $('ajmX').onclick = () => { if (!it.els.length || confirm('Tutup tanpa simpan?')) close(); };
  const C = () => $('bbC');
  const tc = () => BB.BG[BB.BG[it.bg] ? it.bg : 'putih'][2];
  const elOf = i => C().querySelector(`[data-el="${i}"]`);
  const tools = () => {
    const e = it.els[M.sel], t = e && e.k === 't';
    ['bbF', 'bbS', 'bbCo', 'bbB'].forEach(id => $(id).classList.toggle('bbdim', !t));
    if (t) { $('bbF').value = BB.FONT[e.f] ? e.f : 'inter'; $('bbS').value = String(BB.FS.includes(+e.s) ? +e.s : 32); $('bbCo').value = bbCol(e.c) || tc(); $('bbB').setAttribute('aria-pressed', String(!!e.b)); }
  };
  const mark = () => { C().querySelectorAll('.bb-el').forEach(n => n.classList.toggle('on', +n.dataset.el === M.sel)); tools(); };
  const redraw = () => { C().innerHTML = bbInner(it, 'ed'); C().className = `bb bg-${BB.BG[it.bg] ? it.bg : 'putih'}${it.bgi ? ' imp' : ''}`; C().style.backgroundColor = BB.BG[BB.BG[it.bg] ? it.bg : 'putih'][1]; mark(); };
  const restyle = i => { const n = elOf(i); if (!n) return; const tmp = document.createElement('div'); tmp.innerHTML = bbEl(it.els[i], i, 'ed', tc()); const nn = tmp.firstElementChild; n.setAttribute('style', nn.getAttribute('style')); };
  const editText = i => {
    const n = elOf(i), tx = n && n.querySelector('.bb-tx'); if (!tx) return;
    try { tx.contentEditable = 'plaintext-only'; } catch (x) {} if (tx.contentEditable !== 'plaintext-only') tx.contentEditable = 'true';
    n.classList.add('editing'); tx.focus();
    const r = document.createRange(); r.selectNodeContents(tx); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    tx.oninput = () => { it.els[i].tx = tx.innerText.replace(/\n$/, ''); };
    tx.onblur = () => { tx.contentEditable = 'false'; n.classList.remove('editing'); it.els[i].tx = tx.innerText.replace(/\n$/, ''); };
  };
  const add = e => { it.els.push(e); M.sel = it.els.length - 1; redraw(); return M.sel; };
  $('bbAddT').onclick = () => { const last = it.els.filter(e => e.k === 't').pop(); const i = add({ k: 't', tx: '', x: 8, y: Math.min(80, 8 + it.els.length * 9), w: 60, f: last ? last.f : 'inter', s: 32, c: '' }); editText(i); };
  $('bbAddG').onchange = e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    readImage(f, url => {
      const im = new Image();
      im.onload = () => imgPut(url).then(ref => { const w = 40, h = Math.min(90, w * (im.height / im.width) * 16 / 9); add({ k: 'g', src: ref, x: 30, y: Math.max(2, (100 - h) / 2), w, h }); })
        .catch(() => toast('Gambar tidak dapat disimpan pada peranti ini'));
      im.src = url;
    });
  };
  $('bbAddL').onclick = () => {
    const u = prompt('Tampal link (bermula dengan https://).\nYouTube, Google Slides, Canva (link "view"), GeoGebra, Desmos, Wordwall & PhET dimainkan dalam slaid. Laman lain dibuka dalam tab baharu.');
    if (u == null) return;
    const url = ajUrl(u); if (!url) { toast('Link mesti bermula dengan https://'); return; }
    const em = bbEmbed(url); add({ k: 'l', url, x: em ? 15 : 30, y: em ? 12 : 40, w: em ? 70 : 40, h: em ? 76 : 20 });
  };
  const setT = (k, v) => { const e = it.els[M.sel]; if (!e || e.k !== 't') return; if (v === '' || v === false) delete e[k]; else e[k] = v; restyle(M.sel); mark(); };
  $('bbF').onchange = e => setT('f', e.target.value);
  $('bbS').onchange = e => setT('s', +e.target.value);
  $('bbCo').oninput = e => setT('c', e.target.value);
  $('bbB').onclick = () => { const e = it.els[M.sel]; if (e && e.k === 't') setT('b', !e.b); };
  const del = () => { if (M.sel < 0 || !it.els[M.sel]) return; it.els.splice(M.sel, 1); M.sel = -1; redraw(); };
  $('bbDel').onclick = del;
  document.querySelectorAll('[data-bbbg]').forEach(b => b.onclick = () => { it.bg = b.dataset.bbbg; document.querySelectorAll('[data-bbbg]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); it.els.forEach((e, i) => { if (e.k === 't' && !e.c) restyle(i); }); redraw(); });
  // pilih, seret, ubah saiz, klik dua kali untuk tulis
  const cv = C().parentElement.parentElement;
  let tapT = 0, tapI = -1;
  cv.addEventListener('pointerdown', ev => {
    const n = ev.target.closest('.bb-el');
    if (!n) { if (ev.target.closest('.bb')) { M.sel = -1; mark(); } return; }
    if (n.classList.contains('editing')) return;
    const i = +n.dataset.el, e = it.els[i]; if (!e) return;
    const now = Date.now();
    if (e.k === 't' && tapI === i && now - tapT < 400) { tapI = -1; ev.preventDefault(); editText(i); return; }
    tapT = now; tapI = i;
    M.sel = i; mark();
    ev.preventDefault();
    const box = C().getBoundingClientRect(), rsz = !!ev.target.closest('[data-rs]');
    const x0 = ev.clientX, y0 = ev.clientY, s = { x: bbN(e.x, 10, -50, 100), y: bbN(e.y, 10, -50, 100), w: bbN(e.w, 40, 3, 150), h: bbN(e.h, 30, 3, 150) };
    let moved = false;
    const mv = m => {
      const dx = (m.clientX - x0) / box.width * 100, dy = (m.clientY - y0) / box.height * 100;
      if (Math.abs(dx) + Math.abs(dy) > .4) moved = true;
      if (rsz) { e.w = bbN(s.w + dx, 40, 3, 150); if (e.k !== 't') e.h = bbN(s.h + dy, 30, 3, 150); }
      else { e.x = bbN(s.x + dx, 10, -50, 100); e.y = bbN(s.y + dy, 10, -50, 100); }
      n.style.left = e.x + '%'; n.style.top = e.y + '%'; n.style.width = e.w + '%'; if (e.k !== 't') n.style.height = e.h + '%';
    };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); if (moved) tapI = -1; };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  });
  cv.addEventListener('dblclick', ev => { const n = ev.target.closest('.bb-t'); if (n && !n.classList.contains('editing')) editText(+n.dataset.el); });
  M.key = ev => {
    if (!AJS.modal || AJS.modal !== M) { document.removeEventListener('keydown', M.key); return; }
    if (ev.target.closest && ev.target.closest('input,textarea,select,[contenteditable="true"],[contenteditable="plaintext-only"]')) return;
    if ((ev.key === 'Delete' || ev.key === 'Backspace') && M.sel >= 0) { ev.preventDefault(); del(); }
  };
  document.addEventListener('keydown', M.key);
  mark();
  $('ajmOk').onclick = () => {
    const a = document.activeElement; if (a && a.blur) a.blur();
    const item = bbClean(it);
    AJS.modal = null;
    if (M.edit != null) { pl.items[M.edit] = item; if (ajSave()) toast('Slaid dikemas kini'); render(true); }
    else ajAdd(item);
  };
}

/* ---------- import PPTX / PDF ---------- */
const bbScripts = {};
const bbLoad = f => bbScripts[f] || (bbScripts[f] = new Promise((res, rej) => { const s = document.createElement('script'); s.src = BB.LIB + f; s.onload = res; s.onerror = () => { delete bbScripts[f]; rej(new Error('lib')); }; document.head.appendChild(s); }));
function bbBusy(msg) {
  let b = document.getElementById('bbBusy');
  if (msg == null) { if (b) b.remove(); return; }
  if (!b) { b = document.createElement('div'); b.id = 'bbBusy'; b.className = 'bbbusy'; b.setAttribute('role', 'status'); document.body.appendChild(b); }
  b.innerHTML = `<div><span class="bbspin" aria-hidden="true"></span><b>${esc(msg)}</b><small>Jangan tutup halaman ini.</small></div>`;
}
async function bbPdf(buf, prog) {
  const pdfjs = await import(BB.LIB + 'pdf.js');
  pdfjs.GlobalWorkerOptions.workerSrc = BB.LIB + 'pdf.worker.js';
  const doc = await pdfjs.getDocument({ data: buf }).promise, n = Math.min(doc.numPages, BB.MAXPG), out = [];
  for (let i = 1; i <= n; i++) {
    prog(i, n);
    const pg = await doc.getPage(i), v0 = pg.getViewport({ scale: 1 }), v = pg.getViewport({ scale: Math.min(1280 / v0.width, 960 / v0.height) });
    const c = document.createElement('canvas'); c.width = Math.round(v.width); c.height = Math.round(v.height);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
    await pg.render({ canvasContext: g, viewport: v }).promise;
    out.push(c.toDataURL('image/jpeg', .85)); pg.cleanup();
  }
  doc.destroy();
  return { pages: out, more: doc.numPages > n };
}
async function bbPptx(buf, prog) {
  await bbLoad('pptx-preview.js'); await bbLoad('html2canvas.js');
  const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:-30000px;top:0;width:1280px;pointer-events:none;font:16px/normal Calibri,Carlito,Arial,sans-serif;color:#000;letter-spacing:normal;text-align:left';
  document.body.appendChild(host);
  try {
    const pv = window.pptxPreview.init(host, { width: 1280, height: 720, mode: 'list' });
    await pv.preview(buf);
    const w = host.querySelector('.pptx-preview-wrapper'); if (w) { w.style.height = 'auto'; w.style.overflow = 'visible'; w.style.background = 'none'; }
    const sl = [...host.querySelectorAll('.pptx-preview-slide-wrapper')].slice(0, BB.MAXPG), out = [];
    for (let i = 0; i < sl.length; i++) {
      prog(i + 1, sl.length); sl[i].style.margin = '0';
      const c = await window.html2canvas(sl[i], { scale: 1, width: 1280, height: Math.round(sl[i].offsetHeight) || 720, backgroundColor: '#ffffff', logging: false, useCORS: true });
      out.push(c.toDataURL('image/jpeg', .85));
    }
    return { pages: out, more: pv.slideCount > sl.length };
  } finally { host.remove(); }
}
async function bbImport(file, pl) {
  const nm = file.name.replace(/\.(pptx|pdf)$/i, '').slice(0, 60), pdf = /\.pdf$/i.test(file.name), pptx = /\.pptx$/i.test(file.name);
  if (!pdf && !pptx) { toast('Pilih fail .pptx atau .pdf'); return; }
  if (file.size > 60 * 1024 * 1024) { toast('Fail terlalu besar (had 60 MB)'); return; }
  bbBusy('Membuka fail…');
  try {
    const buf = await file.arrayBuffer();
    const r = await (pdf ? bbPdf : bbPptx)(buf, (i, n) => bbBusy(`Mengimport slaid ${i} / ${n}…`));
    if (!r.pages.length) throw new Error('kosong');
    bbBusy('Menyimpan…');
    const items = [];
    for (let i = 0; i < r.pages.length; i++) items.push({ t: 'cikgu', tpl: 'bebas', bg: 'putih', bgi: await imgPut(r.pages[i]), nm: `${nm} (${i + 1})`, els: [] });
    const at = pl.items.length ? AJS.sel + 1 : 0;
    pl.items.splice(at, 0, ...items); AJS.sel = at + items.length - 1; ajSave(); bbBusy(null); render(true);
    toast(`${items.length} slaid diimport${r.more ? ` (had ${BB.MAXPG})` : ''}`);
  } catch (e) {
    bbBusy(null);
    toast(!navigator.onLine ? 'Perlu internet untuk import kali pertama' : pptx ? 'PPTX tidak dapat dibaca. Simpan sebagai PDF dan cuba lagi.' : 'Fail tidak dapat dibaca');
  }
}
