'use strict';
/* =================== TerokaMath · BANK SOALAN (Fasa 1, v135) ===================
   Guru tapis & pilih soalan (T1–T3), susun dalam "Kertas saya", edit salinan, tambah soalan sendiri,
   cetak kertas + skema. Disimpan dalam pelayar (localStorage).
   Kertas: st = 'ABC' | 'A' | 'kuiz' · dw = dwibahasa · kepala = kulit (semua medan bebas, on{} = papar/sembunyi).
   Nombor soalan bermula semula setiap bahagian (A 1–20, B 1–5, C 1–6); mod kuiz 1 hingga akhir.
   Suntingan soalan bank disimpan sebagai laluan: ed = {'parts.0.items.1.t': '…'}.
   Penanda teks: FR(a|b) pecahan · VC(a|b) vektor · RT(x) punca · CH(a|b|c) pilihan bulat/garis. */
const app = document.getElementById('app');
const KEY = 'terokamath-bank';
const BAB = {
  1: ['Nombor Nyata', 'Faktor dan Gandaan', 'Nisbah, Kadar dan Kadaran', 'Ungkapan Algebra', 'Persamaan Linear', 'Garis dan Sudut', 'Segi Tiga', 'Pengendalian Data'],
  2: ['Pola dan Jujukan', 'Pemfaktoran dan Pecahan Algebra', 'Rumus Algebra', 'Poligon', 'Bulatan', 'Bentuk Geometri Tiga Dimensi', 'Koordinat', 'Graf Fungsi', 'Laju dan Pecutan', 'Kecerunan Garis Lurus', 'Transformasi Isometri', 'Sukatan Kecenderungan Memusat', 'Kebarangkalian Mudah'],
  3: ['Indeks', 'Bentuk Piawai', 'Matematik Pengguna: Simpanan dan Pelaburan, Kredit dan Hutang', 'Lukisan Berskala', 'Nisbah Trigonometri', 'Sudut dan Tangen bagi Bulatan', 'Pelan dan Dongakan', 'Lokus dalam Dua Dimensi', 'Garis Lurus']
};
const DATA = { 1: typeof BS_T1 !== 'undefined' ? BS_T1 : [], 2: typeof BS_T2 !== 'undefined' ? BS_T2 : [], 3: typeof BS_T3 !== 'undefined' ? BS_T3 : [] };
const BYID = {}; [1, 2, 3].forEach(t => DATA[t].forEach(q => { q.t = t; BYID[q.id] = q; }));
const FIG = Object.assign({}, typeof BS_FIG !== 'undefined' ? BS_FIG : {});
const BHG = { A: ['A', 'Objektif', 'var(--A)'], B: ['B', 'Pelbagai bentuk', 'var(--B)'], C: ['C', 'Subjektif', 'var(--C)'] };
const ARAS = { R: ['Rendah', 'var(--R)'], S: ['Sederhana', 'var(--S)'], T: ['Tinggi', 'var(--T)'] };
const JENIS = { bp: 'Benar/Palsu', tanda: 'Tandakan', bulat: 'Bulatkan', garis: 'Gariskan', isi: 'Isi tempat kosong', pad: 'Padanan', label: 'Label', jadual: 'Lengkapkan jadual' };
const STR = { ABC: 'Bahagian A, B, C', A: 'Bahagian A sahaja', kuiz: 'Tanpa bahagian (Kuiz)' };
const ON = { kotak: 'Kotak mata pelajaran', jangan: '“Jangan buka…”', nama: 'Nama & kelas', arahan: 'Arahan', pem: 'Jadual pemeriksa', nota: 'Nota halaman', kulit: 'Kulit satu halaman', tamat: '“Kertas soalan tamat”' };
const DEFON = {
  ABC: { kotak: 1, jangan: 1, nama: 1, arahan: 1, pem: 1, nota: 1, kulit: 1, tamat: 1 },
  A: { kotak: 1, jangan: 0, nama: 1, arahan: 1, pem: 1, nota: 0, kulit: 0, tamat: 1 },
  kuiz: { kotak: 1, jangan: 0, nama: 1, arahan: 1, pem: 0, nota: 0, kulit: 0, tamat: 0 }
};
const ROM = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const bi = (dw, bm, en) => dw ? `${bm} / <i>${en}</i>` : bm;

/* ---------- penanda matematik ---------- */
function mk(s) {
  s = String(s == null ? '' : s);
  const tags = { FR: 2, VC: 2, RT: 1, CH: 99 };
  let out = '', i = 0;
  while (i < s.length) {
    const m = /^(FR|VC|RT|CH)\(/.exec(s.slice(i, i + 3));
    if (!m) { out += s[i++]; continue; }
    let d = 0, j = i + 2, parts = [''], ok = false;
    for (; j < s.length; j++) {
      const c = s[j];
      if (c === '(') { d++; if (d === 1) continue; }
      if (c === ')') { d--; if (d === 0) { ok = true; break; } }
      if (c === '|' && d === 1 && tags[m[1]] > 1) { parts.push(''); continue; }
      parts[parts.length - 1] += c;
    }
    if (!ok) { out += s[i++]; continue; }
    const P = parts.map(mk), [a, b] = P;
    if (m[1] === 'FR') out += `<span class="fr"><span>${a}</span><span>${b || ''}</span></span>`;
    else if (m[1] === 'VC') out += `<span class="vc"><i>(</i><span class="fr"><span>${a}</span><span>${b || ''}</span></span><i>)</i></span>`;
    else if (m[1] === 'CH') out += `<span class="ch">${P.map(x => `<span>${x}</span>`).join('')}</span>`;
    else out += `<span class="rt">√<span>${a}</span></span>`;
    i = j + 1;
  }
  return out;
}
const T = (bm, en, dw) => mk(bm) + (dw && en ? `<div class="en">${mk(en)}</div>` : '');

/* ---------- simpanan kertas ---------- */
let D;
const newPaper = n => ({ id: 'k' + Date.now(), nama: 'Kertas ' + n, st: 'ABC', dw: false, kepala: {}, items: [] });
function load() {
  try { D = JSON.parse(localStorage.getItem(KEY)); } catch (e) { D = null; }
  if (!D || !Array.isArray(D.papers) || !D.papers.length) D = { cur: 'k1', papers: [Object.assign(newPaper(1), { id: 'k1' })] };
  if (!D.papers.some(p => p.id === D.cur)) D.cur = D.papers[0].id;
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { toast('Storan penuh'); } };
const P = () => D.papers.find(p => p.id === D.cur);
const ST = { t: 2, bab: 0, dw: false, bhg: { A: true, B: true, C: true }, aras: { R: true, S: true, T: true }, open: {} };
const stOf = p => STR[p.st] ? p.st : 'ABC';
const tingOf = p => { const r = p.items.find(e => e.ref && BYID[e.ref]); return r ? BYID[r.ref].t : ST.t; };
const onOf = (p, k) => { const o = (p.kepala || {}).on || {}; return k in o ? !!o[k] : !!DEFON[stOf(p)][k]; };

function setPath(o, path, v) {
  const ks = path.split('.'); let c = o;
  for (let i = 0; i < ks.length - 1; i++) { if (c[ks[i]] == null) c[ks[i]] = /^\d+$/.test(ks[i + 1]) ? [] : {}; c = c[ks[i]]; }
  c[ks[ks.length - 1]] = v;
}
// soalan B format lama (items terus) → satu bahagian
function norm(q) {
  if (q.bhg === 'B' && !q.parts && q.items) { q.parts = [{ l: '', jenis: q.jenis || 'bp', q: '', items: q.items, kanan: q.kanan, jadual: q.jadual, m: q.items.length, aras: 'R' }]; delete q.items; }
  return q;
}
/* item kertas → soalan lengkap (bank + suntingan) */
function resolve(e) {
  let q;
  if (e.custom) q = norm(Object.assign({ own: true }, e.custom));
  else {
    const b = BYID[e.ref]; if (!b) return null;
    const ed = e.ed || {}; q = JSON.parse(JSON.stringify(b));
    Object.keys(ed).forEach(k => { if (/^[\w.]+$/.test(k) && (ed[k] == null || typeof ed[k] !== 'object')) setPath(q, k, ed[k]); });
    norm(q);
  }
  // bahagian yang dibuang guru (e.off = indeks asal); _k = indeks asal untuk suntingan
  if (q.parts) {
    const off = e.off || [];
    q.parts = q.parts.map((p, k) => Object.assign({}, p, { _k: k })).filter(p => !off.includes(p._k));
    if (off.length) q.parts.forEach((p, i, a) => { p.l = a.length > 1 ? '(' + 'abcdefghij'[i] + ')' : ''; });
  }
  return q;
}
const marksOf = q => q.parts ? q.parts.reduce((a, p) => a + (+p.m || 0), 0) : (+q.m || 0);
function arasMarks(q) {
  const o = { R: 0, S: 0, T: 0 };
  if (q.parts) q.parts.forEach(p => { if (o[p.aras] != null) o[p.aras] += +p.m || 0; });
  else if (o[q.aras] != null) o[q.aras] += +q.m || 0;
  return o;
}
const arasSet = q => { const a = arasMarks(q); return Object.keys(a).filter(k => a[k] > 0); };
const babsOf = q => q.babs || (q.bab ? [q.bab] : []);

/* ---------- papar soalan ---------- */
const figH = (id, big) => id && FIG[id] ? `<div class="fig${big ? ' big' : ''}">${FIG[id]}</div>` : '';
function tbl(jd, dw) {
  if (!jd || !jd.r) return '';
  return `<table class="tb qt">${jd.r.map((r, i) => `<tr>${r.map((c, j) => j === 0 ? `<th>${mk(c)}${dw && jd.re && jd.re[i] ? `<div class="en">${mk(jd.re[i])}</div>` : ''}</th>`
    : c === '?' ? '<td class="bl"></td>' : `<td>${mk(c)}</td>`).join('')}</tr>`).join('')}</table>`;
}
function partB(pt, o) {
  const dw = o.dw, it = pt.items || [], j = pt.jenis;
  let h = `<div class="bq"><span class="l">${esc(pt.l || '')}</span><div>`;
  if (pt.q) h += `<div class="qt">${T(pt.q, pt.qe, dw)}</div>`;
  h += figH(pt.fig);
  if (j === 'pad') h += `<div class="pad qt">${it.map((x, i) => `<div>${T(x.t, x.te, dw)}</div><div class="dt">•&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;•</div><div class="r">${T((pt.kanan || [])[i] || '', (pt.kanane || [])[i], dw)}</div>`).join('')}</div>`;
  else if (j === 'jadual') h += tbl(pt.jadual, dw);
  else if (j === 'bp' || j === 'tanda' || j === 'label') h += `<table class="tb bt qt">${it.map(x => `<tr><td>${T(x.t, x.te, dw)}</td><td class="bx">${j === 'tanda' ? '<span class="box"></span>' : ''}</td></tr>`).join('')}</table>`;
  else h += `<ol class="li qt${it.length < 2 ? ' one' : ''}">${it.map(x => `<li>${T(x.t, x.te, dw)}</li>`).join('')}</ol>`;
  return h + `<div class="mk">[${+pt.m || 0} ${bi(dw, 'markah', 'marks')}]</div></div></div>`;
}
function partC(pt, o) {
  const dw = o.dw;
  let h = `<div class="cq"><span class="l">${esc(pt.l || '')}</span><div><div class="qt">${T(pt.q, pt.qe, dw)}</div><div class="mk">[${+pt.m || 0} ${bi(dw, 'markah', 'marks')}]</div>${figH(pt.fig, pt.big)}${tbl(pt.jadual, dw)}`;
  if (o.print && !pt.big) h += `<div class="ja">${bi(dw, 'Jawapan', 'Answer')}:</div><div class="sp" style="min-height:${pt.ruang || 12 + 9 * (+pt.m || 1)}mm"></div>`;
  return h + '</div></div>';
}
function body(q, o) {
  o = o || {};
  let h = q.q ? `<div class="qt">${T(q.q, q.qe, o.dw)}</div>` : '';
  h += figH(q.fig);
  if (q.bhg === 'A' && q.pil) h += `<div class="op qt">${q.pil.map((p, i) => `<div><b>${'ABCD'[i]}</b><span>${T(p, (q.pe || [])[i], o.dw)}</span></div>`).join('')}</div>`;
  if (q.parts) h += q.parts.map(pt => q.bhg === 'B' ? partB(pt, o) : partC(pt, o)).join('');
  return h;
}
function skema(q) {
  if (q.bhg === 'A') return `<b>${esc(q.jaw || '?')}</b>${q.sk ? ` &nbsp;·&nbsp; ${mk(q.sk)}` : ''}`;
  if (q.bhg === 'B') return (q.parts || []).map(pt => {
    const it = pt.items || [];
    const a = it.map((x, i) => pt.jenis === 'pad' ? `${mk(x.t)} → <b>${mk(x.a)}</b>`
      : pt.jenis === 'tanda' ? `${it.length > 1 ? '(' + ROM[i] + ') ' : ''}<b>${x.a ? '✓' : '✗'}</b>`
      : `${it.length > 1 ? '(' + ROM[i] + ') ' : ''}<b>${mk(x.a)}</b>`).join(pt.jenis === 'pad' ? '<br>' : ' &nbsp; ');
    return `<div class="skp">${pt.l ? `<b>${esc(pt.l)}</b> ` : ''}${a} <span class="mm">[${+pt.m || 0}]</span>${pt.sk ? `<div class="why">${mk(pt.sk)}</div>` : ''}</div>`;
  }).join('');
  return (q.parts || []).map(p => `<div class="skp"><b>${esc(p.l)}</b> <span class="mm">[${+p.m || 0}]</span><div>${mk(p.sk || '')}</div></div>`).join('');
}
function tags(q) {
  const b = BHG[q.bhg], ar = arasSet(q), bs = babsOf(q), t = q.t || ST.t;
  const jn = q.bhg === 'B' && q.parts ? [...new Set(q.parts.map(p => JENIS[p.jenis] || ''))].join(' + ') : b[1];
  return `<div class="tg"><span class="b${q.bhg}">${b[0]} · ${jn}</span>
    ${bs.length ? `<span>Bab ${bs.join(', ')}${bs.length === 1 ? ' ' + esc(BAB[t][bs[0] - 1] || '') : ''}</span>` : ''}
    <span>${ar.map(a => `<b class="a${a}">${ARAS[a][0]}</b>`).join(' → ')}</span>${q.kbat ? '<span>KBAT</span>' : ''}<span>${marksOf(q)} markah</span></div>`;
}
function why(q) {
  if (q.why) return q.why + (q.kon ? ' · ' + q.kon : '');
  if (q.parts) return q.parts.map(p => `${p.l || ''} ${ARAS[p.aras] ? ARAS[p.aras][0] : ''}${p.kon ? ' · ' + p.kon : ''}`.trim()).join(' | ');
  return '';
}

/* ---------- halaman utama bank ---------- */
const inPaper = id => P().items.some(e => e.ref === id);
const filtered = () => DATA[ST.t].filter(q => ST.bhg[q.bhg] && (!ST.bab || babsOf(q).includes(ST.bab)) && arasSet(q).some(a => ST.aras[a]));
function paperStats(p) {
  const s = { A: 0, B: 0, C: 0, m: 0, R: 0, S: 0, T: 0 };
  printable(p).forEach(({ q }) => { s[q.bhg]++; s.m += marksOf(q); const a = arasMarks(q); s.R += a.R; s.S += a.S; s.T += a.T; });
  return s;
}
function viewKP() {
  const p = P(), s = paperStats(p), tot = s.R + s.S + s.T || 1, pc = k => s.m ? Math.round(s[k] / tot * 100) : 0;
  return `<aside class="kp" aria-label="Kertas saya"><h2>KERTAS SAYA</h2>
    <select id="kSel" aria-label="Pilih kertas">${D.papers.map(x => `<option value="${x.id}"${x.id === D.cur ? ' selected' : ''}>${esc(x.nama)}</option>`).join('')}</select>
    <div class="row"><button class="ck sm" id="kNew">+ Kertas baharu</button><button class="ck sm" id="kRen" aria-label="Namakan semula">✎</button><button class="ck sm" id="kDel" aria-label="Padam kertas">🗑</button></div>
    <div class="sec"><span>Struktur</span><b class="sm">${STR[stOf(p)]}</b></div>
    ${stOf(p) === 'kuiz' ? `<div class="sec"><span>Soalan</span><b>${s.A + s.B + s.C}</b></div>` : (stOf(p) === 'A' ? ['A'] : ['A', 'B', 'C']).map(k => `<div class="sec"><span>${k} · ${BHG[k][1]}</span><b>${s[k]}</b></div>`).join('')}
    <div class="sec"><span>Jumlah markah</span><b>${s.m}</b></div>
    <p class="hint" style="margin-top:10px">Aras ikut markah (sasaran 5 : 3 : 2)</p>
    <div class="bar">${['R', 'S', 'T'].map(k => `<i style="width:${pc(k)}%;background:${ARAS[k][1]}"></i>`).join('')}</div>
    <div class="lg"><span style="color:var(--R)">R ${pc('R')}%</span><span style="color:var(--S)">S ${pc('S')}%</span><span style="color:var(--T)">T ${pc('T')}%</span></div>
    <a class="ck pri btn" href="#/kertas">Susun, edit &amp; cetak</a>
    <p class="hint">Disimpan dalam pelayar komputer ini. <a href="#" id="kAm">Amaran &amp; simpanan</a></p></aside>`;
}
function viewBank() {
  const list = filtered(), babs = BAB[ST.t];
  const cards = list.map(q => `<article class="q${inPaper(q.id) ? ' on' : ''}" data-id="${q.id}">${tags(q)}${body(q, { dw: ST.dw })}
      <div class="an${ST.open[q.id] ? ' on' : ''}">${skema(q)}${why(q) ? `<span class="why">Aras: ${esc(why(q))}</span>` : ''}</div>
      <div class="rw"><button class="ck sm" data-ans="${q.id}">Jawapan</button><button class="ck sm${inPaper(q.id) ? ' in' : ''}" data-add="${q.id}">${inPaper(q.id) ? '✓ Dalam kertas' : '+ Kertas'}</button></div></article>`).join('');
  return `<div class="tabs" role="tablist">${[1, 2, 3].map(t => `<button role="tab" data-t="${t}" aria-selected="${ST.t === t}"><b>${t}</b><small>TINGKATAN</small></button>`).join('')}</div>
    <div class="fl"><select id="fBab" aria-label="Bab"><option value="0">Semua bab</option>${babs.map((b, i) => `<option value="${i + 1}"${ST.bab === i + 1 ? ' selected' : ''}>Bab ${i + 1} · ${esc(b)}</option>`).join('')}</select>
      ${['A', 'B', 'C'].map(k => `<button class="chip" data-bhg="${k}" aria-pressed="${ST.bhg[k]}" style="--c:${BHG[k][2]}">${k} · ${BHG[k][1]}</button>`).join('')}<span class="sep"></span>
      ${['R', 'S', 'T'].map(k => `<button class="chip" data-aras="${k}" aria-pressed="${ST.aras[k]}" style="--c:${ARAS[k][1]}">${ARAS[k][0]}</button>`).join('')}<span class="sep"></span>
      <button class="chip" id="fDw" aria-pressed="${ST.dw}" style="--c:var(--blue)">Dwibahasa</button>
      <span class="cnt">${list.length} soalan</span></div>
    <div class="g"><section aria-label="Senarai soalan">${cards || `<div class="empty">${DATA[ST.t].length ? 'Tiada soalan bagi tapisan ini.' : `Belum ada soalan untuk Tingkatan ${ST.t}.<br>Akan ditambah tidak lama lagi.`}</div>`}</section>${viewKP()}</div>`;
}

/* ---------- susunan kertas ---------- */
function printable(p) {
  const st = stOf(p), all = p.items.map((e, i) => ({ e, i, q: resolve(e) })).filter(x => x.q);
  return st === 'A' ? all.filter(x => x.q.bhg === 'A') : all;
}
function sections(p) {
  const st = stOf(p), all = printable(p);
  if (st === 'kuiz') return [{ b: null, rows: all }];
  return (st === 'A' ? ['A'] : ['A', 'B', 'C']).map(b => ({ b, rows: all.filter(x => x.q.bhg === b) }));
}
function defAr(st) {
  const L = [];
  if (st === 'ABC') L.push(['Kertas soalan ini mengandungi tiga bahagian: Bahagian A, Bahagian B dan Bahagian C.', 'This question paper consists of three sections: Section A, Section B and Section C.']);
  L.push(['Jawab semua soalan.', 'Answer all questions.']);
  if (st === 'ABC') L.push(['Bagi Bahagian A, bulatkan satu jawapan sahaja bagi setiap soalan.', 'For Section A, circle one answer only for each question.']);
  if (st === 'A') L.push(['Bulatkan satu jawapan sahaja bagi setiap soalan.', 'Circle one answer only for each question.']);
  L.push(['Tulis jawapan anda dalam ruang yang disediakan dalam kertas soalan ini.', 'Write your answers in the spaces provided in this question paper.']);
  if (st !== 'A') L.push(['Tunjukkan langkah-langkah penting dalam kerja mengira anda.', 'Show the important steps in your working.']);
  L.push(['Penggunaan kalkulator saintifik dibenarkan.', 'The use of a scientific calculator is permitted.']);
  return L;
}
function kepala(p) {
  const k = p.kepala || {}, st = stOf(p), t = tingOf(p), dw = !!p.dw, d = (x, v) => k[x] != null ? k[x] : v;
  return {
    tajuk: d('tajuk', ''), sekolah: d('sekolah', ''), alamat: d('alamat', ''), mp: d('mp', 'MATEMATIK'), kod: d('kod', ''),
    ting: d('ting', dw ? `Tingkatan ${t} / Form ${t}` : `Tingkatan ${t}`), masa: d('masa', st === 'ABC' ? (dw ? '2 jam / 2 hours' : '2 jam') : ''),
    tarikh: d('tarikh', ''), nota: d('nota', 'Kertas soalan ini mengandungi ___ halaman bercetak.'),
    arahan: k.arahan != null ? String(k.arahan).split('\n').filter(x => x.trim()).map(x => [x, '']) : defAr(st)
  };
}

/* ---------- editor kertas ---------- */
function blank(bhg) {
  if (bhg === 'A') return { bhg: 'A', q: 'Tulis soalan di sini.', pil: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'], jaw: 'A', m: 1, aras: 'R' };
  if (bhg === 'B') return { bhg: 'B', q: '', parts: [
    { l: '(a)', jenis: 'bp', q: 'Tulis Benar atau Palsu bagi setiap pernyataan.', m: 2, aras: 'R', items: [{ t: 'Pernyataan 1', a: 'Benar' }, { t: 'Pernyataan 2', a: 'Palsu' }] },
    { l: '(b)', jenis: 'isi', q: 'Isi tempat kosong.', m: 2, aras: 'S', items: [{ t: 'Soalan … = __________', a: 'Jawapan' }, { t: 'Soalan … = __________', a: 'Jawapan' }] }] };
  return { bhg: 'C', q: '', parts: ['(a)', '(b)', '(c)'].map((l, i) => ({ l, q: 'Tulis soalan.', m: [3, 3, 4][i], aras: 'RST'[i], sk: 'Skema jawapan' })) };
}
const ce = (path, val, cls, ph) => `<div class="${cls || 'qt'}" contenteditable="true" data-p="${path}"${ph ? ` data-ph="${ph}"` : ''}>${mk(val || '')}</div>`;
const cen = (dw, path, val) => dw ? ce(path, val, 'qt en', 'Terjemahan BI (boleh kosong)') : '';
const selA = (path, v) => `<select data-p="${path}" aria-label="Aras">${['R', 'S', 'T'].map(a => `<option value="${a}"${v === a ? ' selected' : ''}>${ARAS[a][0]}</option>`).join('')}</select>`;
function eiHTML(row, n, dw) {
  const { e, i: idx, q } = row, own = !!e.custom;
  let h = `<div class="ei" data-i="${idx}"><div class="eh"><span class="n">${n}</span>${own ? `<span class="own">SOALAN SENDIRI · ${BHG[q.bhg][1].toUpperCase()}</span>` : `<span class="tg" style="margin:0">${tags(q).replace(/^<div class="tg">|<\/div>$/g, '')}</span>`}
    <span class="sp"><button class="ck sm" data-mv="${idx},-1" aria-label="Naik">↑</button><button class="ck sm" data-mv="${idx},1" aria-label="Turun">↓</button><button class="ck sm" data-rm="${idx}" aria-label="Buang">×</button></span></div>`;
  h += ce('q', q.q, 'qt', q.bhg === 'A' ? 'Soalan' : 'Maklumat soalan (boleh kosong)') + cen(dw, 'qe', q.qe) + figH(q.fig);
  if (q.bhg === 'A') {
    h += `<div class="opE qt">${q.pil.map((o, i) => `<div><b>${'ABCD'[i]}</b><span>${ce('pil.' + i, o, 'qt')}${cen(dw, 'pe.' + i, (q.pe || [])[i])}</span></div>`).join('')}</div>
      <div class="sk">Jawapan: <select data-p="jaw" aria-label="Jawapan">${'ABCD'.split('').map(x => `<option${q.jaw === x ? ' selected' : ''}>${x}</option>`).join('')}</select>${own ? ' &nbsp; Aras: ' + selA('aras', q.aras) : ''}</div>`;
  }
  (q.parts || []).forEach(pt => {
    const k = pt._k, P0 = 'parts.' + k + '.';
    h += `<div class="pe"><div class="peh">${ce(P0 + 'l', pt.l, 'pl', '(a)')}
      ${q.bhg === 'B' ? (own ? `<select data-p="${P0}jenis" aria-label="Bentuk">${Object.keys(JENIS).filter(j => j !== 'jadual').map(j => `<option value="${j}"${pt.jenis === j ? ' selected' : ''}>${JENIS[j]}</option>`).join('')}</select>` : `<span class="jn">${JENIS[pt.jenis] || ''}</span>`) : ''}
      <span class="sp">${q.parts.length > 1 ? `<button class="ck sm rp" data-rmp="${idx},${k}" aria-label="Buang bahagian ${esc(pt.l)}" title="Buang bahagian ini daripada kertas">×</button>` : ''}${own ? selA(P0 + 'aras', pt.aras) : `<b class="a${pt.aras}">${ARAS[pt.aras] ? ARAS[pt.aras][0] : ''}</b>`}<input type="number" min="0" max="20" value="${+pt.m || 0}" data-p="${P0}m" aria-label="Markah"> m</span></div>
      ${ce(P0 + 'q', pt.q, 'qt', 'Soalan / arahan')}${cen(dw, P0 + 'qe', pt.qe)}${figH(pt.fig, pt.big)}${tbl(pt.jadual, dw)}`;
    if (q.bhg === 'B') {
      h += `<div class="itE qt${pt.jenis === 'pad' ? ' pd' : ''}">${(pt.items || []).map((x, j) => `<span class="n">${j + 1}</span><div>${ce(P0 + 'items.' + j + '.t', x.t, 'qt')}${cen(dw, P0 + 'items.' + j + '.te', x.te)}</div>
        ${pt.jenis === 'pad' ? `<div>${ce(P0 + 'kanan.' + j, (pt.kanan || [])[j], 'qt', 'Kanan')}${cen(dw, P0 + 'kanane.' + j, (pt.kanane || [])[j])}</div>` : ''}
        ${ce(P0 + 'items.' + j + '.a', x.a, 'qt ans', pt.jenis === 'tanda' ? '✓ atau kosong' : 'Jawapan')}`).join('')}</div>
        ${own ? `<button class="ck sm" data-additem="${idx},${k}">+ Item</button>` : ''}`;
    } else h += `<div class="sk">Skema:</div>${ce(P0 + 'sk', pt.sk, 'qt ans', 'Skema jawapan')}`;
    h += '</div>';
  });
  if ((e.off || []).length) h += `<button class="ck sm" data-rsp="${idx}" style="margin:6px 6px 0 0">↺ Pulihkan bahagian (${e.off.length})</button>`;
  if (own && q.bhg !== 'A') h += `<button class="ck sm" data-addpart="${idx}" style="margin-top:6px">+ Bahagian soalan</button>`;
  return h + '</div>';
}
function viewEdit() {
  const p = P(), st = stOf(p), dw = !!p.dw, K = kepala(p), k = p.kepala || {};
  const owns = bs => `<div class="addq">${bs.map(b => `<button class="ck sm" data-own="${b}">+ Soalan sendiri · ${BHG[b][1]}</button>`).join('')}</div>`;
  let qs = '';
  if (st === 'kuiz') {
    const rows = printable(p);
    qs = `<h2>Soalan <small>${rows.length} soalan · ${rows.reduce((a, x) => a + marksOf(x.q), 0)} markah</small></h2>${rows.map((r, i) => eiHTML(r, i + 1, dw)).join('') || '<p class="hint em">Belum ada soalan.</p>'}${owns(['A', 'B', 'C'])}`;
  } else sections(p).forEach(({ b, rows }) => {
    qs += `<h2><span class="tg"><span class="b${b}">Bahagian ${b}</span></span>${BHG[b][1]} <small>${rows.length} soalan · ${rows.reduce((a, x) => a + marksOf(x.q), 0)} markah</small></h2>
      ${rows.map((r, i) => eiHTML(r, i + 1, dw)).join('') || '<p class="hint em">Tiada soalan dalam bahagian ini.</p>'}${owns([b])}`;
  });
  const hid = st === 'A' ? p.items.map(resolve).filter(q => q && q.bhg !== 'A').length : 0;
  const fld = (key, lab, ph, cls) => `<label${cls ? ` class="${cls}"` : ''}>${lab}<input data-h="${key}" value="${esc(K[key])}" placeholder="${ph || ''}"></label>`;
  return `<div class="ed"><div class="edtop"><a class="ck sm" href="#/">← Bank soalan</a><span class="sp"><button class="ck pri" id="pSoal">🖨 Cetak kertas soalan</button><button class="ck" id="pSkema">🖨 Cetak skema</button><button class="ck" id="wSoal" title="Muat turun kertas soalan sebagai Word (.docx)">⬇ Word soalan</button><button class="ck" id="wSkema" title="Muat turun skema sebagai Word (.docx)">⬇ Word skema</button></span></div>
    <h1 contenteditable="true" id="eNama">${esc(p.nama)}</h1>
    <div class="set"><div><span class="lb">STRUKTUR</span><span class="seg">${Object.keys(STR).map(s => `<button data-st="${s}" aria-pressed="${st === s}">${STR[s]}</button>`).join('')}</span></div>
      <div><span class="lb">BAHASA</span><button class="chip" id="eDw" aria-pressed="${dw}" style="--c:var(--blue)">${dw ? '✓ ' : ''}Dwibahasa (BM + BI)</button></div></div>
    <details class="hdr"${k.buka === false ? '' : ' open'} id="eKul"><summary>Kulit kertas <small>semua boleh diubah ikut format sekolah</small></summary><div class="hg">
      ${fld('tajuk', 'TAJUK UJIAN', 'UJIAN AKHIR SESI AKADEMIK 2026', 'full')}${fld('sekolah', 'NAMA SEKOLAH', 'SMK …', 'full')}${fld('alamat', 'ALAMAT / DAERAH', '', 'full')}
      ${fld('mp', 'MATA PELAJARAN')}${fld('kod', 'KOD', '50')}${fld('ting', 'TINGKATAN')}${fld('masa', 'MASA', '1 jam')}${fld('tarikh', 'TARIKH')}${fld('nota', 'NOTA BAWAH', '', 'full')}
      <label class="full">ARAHAN (satu baris satu arahan)<textarea data-h="arahan" rows="5">${esc(K.arahan.map(a => a[0]).join('\n'))}</textarea>
        <span class="arx">${k.arahan != null ? '<button class="ck sm" id="eArR">↺ Arahan asal</button>' : dw ? 'Arahan asal dicetak dengan terjemahan BI.' : ''}</span></label>
      <div class="full chk"><span class="lb">PAPAR</span>${Object.keys(ON).map(o => `<label><input type="checkbox" data-on="${o}"${onOf(p, o) ? ' checked' : ''}> ${ON[o]}</label>`).join('')}</div></div></details>
    ${hid ? `<p class="hint em">${hid} soalan B/C dalam kertas ini disembunyikan dan tidak dicetak (struktur Bahagian A sahaja).</p>` : ''}
    ${qs}</div>`;
}

/* ---------- cetak ---------- */
function pemHTML(secs, dw) {
  let rows = '', tot = 0;
  secs.forEach(({ b, rows: r }) => {
    if (!r.length) return;
    const ms = r.map(x => marksOf(x.q)), sum = ms.reduce((a, x) => a + x, 0); tot += sum;
    if (!b || b === 'A') rows += `<tr><td>${b || ''}</td><td>1 – ${r.length}</td><td>${sum}</td><td></td></tr>`;
    else rows += ms.map((m, i) => `<tr>${i === 0 ? `<td rowspan="${ms.length}">${b}</td>` : ''}<td>${i + 1}</td><td>${m}</td><td></td></tr>`).join('');
  });
  return `<table class="pem"><tr><th colspan="4">${bi(dw, 'Untuk Kegunaan Pemeriksa', 'For Examiner’s Use')}</th></tr>
    <tr><th>${bi(dw, 'Bahagian', 'Section')}</th><th>${bi(dw, 'Soalan', 'Question')}</th><th>${bi(dw, 'Markah Penuh', 'Full Marks')}</th><th>${bi(dw, 'Markah Diperoleh', 'Marks Obtained')}</th></tr>
    ${rows}<tr><th colspan="2">${bi(dw, 'Jumlah', 'Total')}</th><th>${tot}</th><td></td></tr></table>`;
}
function coverHTML(p, secs, withSk) {
  const K = kepala(p), dw = !!p.dw, on = k => onOf(p, k);
  let h = `<div class="cv${on('kulit') && !withSk ? ' pg' : ''}">`;
  if (K.tajuk) h += `<div class="cvT">${esc(K.tajuk)}</div>`;
  if (K.sekolah) h += `<div class="cvS">${esc(K.sekolah)}</div>`;
  if (K.alamat) h += `<div class="cvA">${esc(K.alamat)}</div>`;
  if (on('kotak')) {
    const c = [`<b>${esc(K.mp)}</b>${K.kod ? ` <span class="kd2">${esc(K.kod)}</span>` : ''}`, esc(K.ting), esc(K.masa)].filter(x => x);
    h += `<table class="cvK"><tr>${c.map(x => `<td>${x}</td>`).join('')}</tr></table>`;
  }
  if (K.tarikh) h += `<div class="cvA">${bi(dw, 'Tarikh', 'Date')}: ${esc(K.tarikh)}</div>`;
  if (withSk) return h + `<div class="cvJ">${bi(dw, 'SKEMA JAWAPAN', 'MARKING SCHEME')}</div></div>`;
  if (on('jangan')) h += `<div class="cvJ">JANGAN BUKA KERTAS SOALAN INI SEHINGGA DIBERITAHU${dw ? '<br><i>DO NOT OPEN THIS QUESTION PAPER UNTIL YOU ARE TOLD TO DO SO</i>' : ''}</div>`;
  if (on('nama')) h += `<div class="nm"><span>${bi(dw, 'Nama', 'Name')}:</span><span style="flex:.45">${bi(dw, 'Kelas', 'Class')}:</span></div>`;
  const ar = on('arahan') && K.arahan.length ? `<div class="ar"><b>${bi(dw, 'Arahan', 'Instructions')}:</b><ol>${K.arahan.map(a => `<li>${esc(a[0])}${dw && a[1] ? `<div class="en">${esc(a[1])}</div>` : ''}</li>`).join('')}</ol></div>` : '';
  const pm = on('pem') ? pemHTML(secs, dw) : '';
  if (ar || pm) h += `<div class="cvG${ar && pm ? '' : ' one'}">${ar}${pm}</div>`;
  if (on('nota') && K.nota) h += `<div class="cvN">${esc(K.nota)}</div>`;
  return h + '</div>';
}
function printPaper(withSk) {
  const p = P(), st = stOf(p), dw = !!p.dw, secs = sections(p).filter(s => s.rows.length);
  if (!secs.length) { toast('Kertas masih kosong'); return; }
  let h = coverHTML(p, secs, withSk), first = true;
  secs.forEach(({ b, rows }) => {
    if (b) h += `<h3${st === 'ABC' && !first && !withSk ? ' class="nb"' : ''}>${bi(dw, 'Bahagian ' + b, 'Section ' + b)} <small>[${rows.reduce((a, x) => a + marksOf(x.q), 0)} ${bi(dw, 'markah', 'marks')}]</small></h3>`;
    first = false;
    if (withSk && b === 'A') { h += `<div class="skA">${rows.map((x, i) => `<span>${i + 1}. <b>${esc(x.q.jaw)}</b></span>`).join('')}</div>`; return; }
    rows.forEach((x, i) => {
      h += withSk ? `<div class="pq"><span class="no">${i + 1}.</span><div>${skema(x.q)}</div></div>`
        : `<div class="pq${x.q.bhg === 'A' ? '' : ' lg'}"><span class="no">${i + 1}.</span><div>${body(x.q, { print: true, dw })}</div></div>`;
    });
  });
  if (!withSk && onOf(p, 'tamat')) h += `<div class="end">KERTAS SOALAN TAMAT${dw ? '<br><i>END OF QUESTION PAPER</i>' : ''}</div>`;
  h += `<div class="ft">Dijana dengan TerokaMath · terokamath.com</div>`;
  document.getElementById('print').innerHTML = h;
  document.body.classList.add('printing');
  setTimeout(() => window.print(), 60);
}

/* ---------- render & ikatan ---------- */
let tt; function toast(m) { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2200); }
const isLight = () => document.documentElement.classList.contains('light');
function head() {
  return `<header class="top"><a class="brand" href="../"><svg width="34" height="34" viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" rx="112" fill="#15162A"/><circle cx="256" cy="256" r="178" fill="none" stroke="#2B2C4A" stroke-width="14"/><polygon points="256,62 290,222 256,256 222,222" fill="#2EE6A6"/><polygon points="450,256 290,290 256,256 290,222" fill="#FF8A3D"/><polygon points="256,450 222,290 256,256 290,290" fill="#B57BFF"/><polygon points="62,256 222,222 256,256 222,290" fill="#FFC93C"/><circle cx="256" cy="256" r="24" fill="#FFFFFF"/></svg><b>Teroka<span>Math</span></b><small>Bank Soalan</small></a>
    <button class="ck sq" id="mode" aria-label="${isLight() ? 'Tukar ke mod gelap' : 'Tukar ke mod cerah'}">${isLight() ? '☾' : '☀'}</button></header>`;
}
function render(keep) {
  const y = keep ? window.scrollY : 0, ed = location.hash.startsWith('#/kertas');
  app.innerHTML = head() + `<main class="wrap">${ed ? viewEdit() : viewBank()}</main>`;
  document.title = (ed ? P().nama + ' · ' : '') + 'Bank Soalan · TerokaMath';
  bind(ed);
  window.scrollTo(0, y);
}
function bind(ed) {
  document.getElementById('mode').onclick = () => { const l = !isLight(); document.documentElement.classList.toggle('light', l); try { localStorage.setItem('mathmotion-mode', l ? 'cerah' : 'gelap'); } catch (e) {} render(true); };
  if (ed) return bindEdit();
  app.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { ST.t = +b.dataset.t; ST.bab = 0; render(); });
  document.getElementById('fBab').onchange = e => { ST.bab = +e.target.value; render(true); };
  document.getElementById('fDw').onclick = () => { ST.dw = !ST.dw; render(true); };
  app.querySelectorAll('[data-bhg]').forEach(b => b.onclick = () => { ST.bhg[b.dataset.bhg] = !ST.bhg[b.dataset.bhg]; render(true); });
  app.querySelectorAll('[data-aras]').forEach(b => b.onclick = () => { ST.aras[b.dataset.aras] = !ST.aras[b.dataset.aras]; render(true); });
  app.querySelectorAll('[data-ans]').forEach(b => b.onclick = () => { const id = b.dataset.ans; ST.open[id] = !ST.open[id]; b.closest('.q').querySelector('.an').classList.toggle('on', ST.open[id]); });
  app.querySelectorAll('[data-add]').forEach(b => b.onclick = () => {
    const id = b.dataset.add, p = P(), i = p.items.findIndex(e => e.ref === id);
    if (i >= 0) p.items.splice(i, 1);
    else { p.items.push({ ref: id }); if (stOf(p) === 'A' && BYID[id].bhg !== 'A') toast('Ditambah, tetapi kertas ini Bahagian A sahaja: soalan ini tidak dicetak'); }
    save(); render(true);
  });
  document.getElementById('kAm').onclick = e => { e.preventDefault(); amaran(true); };
  document.getElementById('kSel').onchange = e => { D.cur = e.target.value; save(); render(true); };
  document.getElementById('kNew').onclick = () => { const np = newPaper(D.papers.length + 1); D.papers.push(np); D.cur = np.id; save(); render(true); };
  document.getElementById('kRen').onclick = () => { const n = prompt('Nama kertas:', P().nama); if (n && n.trim()) { P().nama = n.trim().slice(0, 60); save(); render(true); } };
  document.getElementById('kDel').onclick = () => {
    if (!confirm(`Padam "${P().nama}"? Tindakan ini tidak boleh dibatalkan.`)) return;
    D.papers = D.papers.filter(p => p.id !== D.cur); if (!D.papers.length) D.papers.push(newPaper(1));
    D.cur = D.papers[0].id; save(); render(true);
  };
}
// teks bersih daripada kotak sunting → kekalkan penanda FR/VC/RT/CH
function plain(el) {
  const c = el.cloneNode(true);
  c.querySelectorAll('.vc').forEach(v => { const s = v.querySelectorAll('.fr>span'); v.replaceWith(`VC(${s[0] ? s[0].innerHTML : ''}|${s[1] ? s[1].innerHTML : ''})`); });
  c.querySelectorAll('.fr').forEach(f => { const s = f.children; f.replaceWith(`FR(${s[0] ? s[0].innerHTML : ''}|${s[1] ? s[1].innerHTML : ''})`); });
  c.querySelectorAll('.rt').forEach(r => { const s = r.querySelector('span'); r.replaceWith(`RT(${s ? s.innerHTML : ''})`); });
  c.querySelectorAll('.ch').forEach(h => h.replaceWith(`CH(${[...h.children].map(s => s.innerHTML).join('|')})`));
  return c.innerHTML.replace(/<div>/g, '<br>').replace(/<\/div>/g, '').replace(/&nbsp;/g, ' ').replace(/<(?!\/?(i|b|sub|sup|br)\b)[^>]*>/g, '').replace(/^(<br>)+|(<br>)+$/g, '').trim();
}
function bindEdit() {
  const p = P();
  p.kepala = p.kepala || {};
  document.getElementById('eNama').onblur = e => { const n = e.target.textContent.trim(); if (n) { p.nama = n.slice(0, 60); save(); } };
  app.querySelectorAll('[data-st]').forEach(b => b.onclick = () => { p.st = b.dataset.st; save(); render(true); });
  document.getElementById('eDw').onclick = () => { p.dw = !p.dw; save(); render(true); };
  document.getElementById('eKul').ontoggle = e => { p.kepala.buka = e.target.open; save(); };
  app.querySelectorAll('[data-h]').forEach(inp => inp.oninput = () => { p.kepala[inp.dataset.h] = inp.value; save(); });
  const arR = document.getElementById('eArR'); if (arR) arR.onclick = ev => { ev.preventDefault(); delete p.kepala.arahan; save(); render(true); };
  app.querySelectorAll('[data-on]').forEach(c => c.onchange = () => { p.kepala.on = p.kepala.on || {}; p.kepala.on[c.dataset.on] = c.checked; save(); });
  app.querySelectorAll('.ei').forEach(box => {
    const e = p.items[+box.dataset.i];
    box.querySelectorAll('[data-p]').forEach(f => {
      const path = f.dataset.p, isIn = f.tagName === 'INPUT' || f.tagName === 'SELECT';
      f[isIn ? 'onchange' : 'onblur'] = () => {
        const v = f.tagName === 'INPUT' ? +f.value : f.tagName === 'SELECT' ? f.value : plain(f);
        if (e.custom) setPath(e.custom, path, v); else { e.ed = e.ed || {}; e.ed[path] = v; }
        save(); if (isIn) render(true);
      };
    });
  });
  app.querySelectorAll('[data-mv]').forEach(b => b.onclick = () => {
    const [i, d] = b.dataset.mv.split(',').map(Number), kuiz = stOf(p) === 'kuiz', bh = resolve(p.items[i]).bhg;
    let j = i + d;
    while (j >= 0 && j < p.items.length && (!resolve(p.items[j]) || (!kuiz && resolve(p.items[j]).bhg !== bh))) j += d;
    if (j < 0 || j >= p.items.length) return;
    [p.items[i], p.items[j]] = [p.items[j], p.items[i]]; save(); render(true);
  });
  app.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { p.items.splice(+b.dataset.rm, 1); save(); render(true); });
  app.querySelectorAll('[data-own]').forEach(b => b.onclick = () => { p.items.push({ custom: blank(b.dataset.own) }); save(); render(true); });
  app.querySelectorAll('[data-rmp]').forEach(b => b.onclick = () => {
    const [i, k] = b.dataset.rmp.split(',').map(Number), e = p.items[i];
    e.off = (e.off || []).concat(k); save(); render(true);
  });
  app.querySelectorAll('[data-rsp]').forEach(b => b.onclick = () => { delete p.items[+b.dataset.rsp].off; save(); render(true); });
  app.querySelectorAll('[data-addpart]').forEach(b => b.onclick = () => {
    const c = norm(p.items[+b.dataset.addpart].custom), L = '(' + 'abcdefghij'[c.parts.length] + ')';
    c.parts.push(c.bhg === 'B' ? { l: L, jenis: 'isi', q: 'Arahan', m: 1, aras: 'R', items: [{ t: 'Soalan', a: 'Jawapan' }] } : { l: L, q: 'Tulis soalan.', m: 2, aras: 'S', sk: 'Skema jawapan' });
    save(); render(true);
  });
  app.querySelectorAll('[data-additem]').forEach(b => b.onclick = () => {
    const [i, k] = b.dataset.additem.split(',').map(Number), pt = norm(p.items[i].custom).parts[k];
    pt.items.push({ t: 'Item baharu', a: '' }); if (pt.jenis === 'pad') (pt.kanan = pt.kanan || []).push('');
    save(); render(true);
  });
  document.getElementById('pSoal').onclick = () => printPaper(false);
  document.getElementById('pSkema').onclick = () => printPaper(true);
  document.getElementById('wSoal').onclick = () => wordDownload(false);
  document.getElementById('wSkema').onclick = () => wordDownload(true);
}
/* ---------- muat turun Word: pustaka dimuat hanya bila perlu ---------- */
const loadJS = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
let wBusy = false;
async function wordDownload(withSk) {
  if (wBusy) return; wBusy = true;
  try {
    if (typeof window.wordBuild !== 'function') { toast('Menyediakan fail Word…'); await loadJS('../lib/docx.js'); await loadJS('word.js'); }
    await window.wordBuild(withSk);
  } catch (e) { console.error(e); toast('Gagal menjana fail Word. Semak sambungan internet dan cuba lagi.'); }
  wBusy = false;
}
/* ---------- amaran kali pertama ---------- */
const AKEY = 'terokamath-bank-setuju';
function amaran(lihat) {
  let ok = false; try { ok = localStorage.getItem(AKEY) === '1'; } catch (e) {}
  if (ok && !lihat) return;
  const m = document.createElement('div');
  m.className = 'mdl'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'amT');
  m.innerHTML = `<div class="mbx"><h2 id="amT">Sebelum mula</h2>
    <h3>⚠ Kertas disimpan dalam pelayar ini sahaja</h3>
    <p>Kertas dan soalan yang cikgu susun atau tulis disimpan dalam pelayar komputer ini, bukan dalam akaun. Kerja cikgu boleh <b>hilang</b> jika:</p>
    <ul><li>sejarah atau data pelayar dipadam</li><li>cikgu guna komputer atau pelayar lain</li><li>cikgu guna mod inkognito</li></ul>
    <p>Muat turun fail <b>Word</b> sebagai simpanan selepas siap menyusun.</p>
    <h3>⚠ Soalan bank dikongsi dengan guru lain</h3>
    <p>Soalan dalam bank ini terbuka kepada semua pengguna TerokaMath. Guru lain mungkin guna soalan yang sama, dan murid mungkin pernah melihatnya. Untuk peperiksaan, <b>ubah suai</b> soalan atau gunakan soalan sendiri.</p>
    ${ok ? '<div class="mft"><button class="ck pri" id="amGo">Tutup</button></div>'
      : '<label class="mck"><input type="checkbox" id="amCk"> Saya faham dan bersetuju.</label><div class="mft"><button class="ck pri" id="amGo" disabled>Teruskan</button></div>'}</div>`;
  document.body.appendChild(m);
  const go = m.querySelector('#amGo'), ck = m.querySelector('#amCk');
  if (ck) { ck.onchange = () => { go.disabled = !ck.checked; }; ck.focus(); } else go.focus();
  go.onclick = () => { if (ck) { if (!ck.checked) return; try { localStorage.setItem(AKEY, '1'); } catch (e) {} } m.remove(); };
  if (ok) m.onkeydown = e => { if (e.key === 'Escape') m.remove(); };
}
window.addEventListener('hashchange', () => render());
window.addEventListener('afterprint', () => document.body.classList.remove('printing'));
load(); render(); amaran();
