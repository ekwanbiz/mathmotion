'use strict';
/* =================== TerokaMath · BANK SOALAN (Fasa 1) ===================
   Guru tapis & pilih soalan (T1–T3, format UASA), edit salinan dalam "Kertas saya",
   tambah soalan sendiri, susun dan cetak kertas soalan + skema. Disimpan dalam pelayar.
   Data: bank/t1.js, t2.js, t3.js (BS_T1/BS_T2/BS_T3). Penanda dalam teks soalan:
   FR(a|b) pecahan bertingkat · VC(a|b) vektor lajur · RT(x) punca kuasa dua. */
const app = document.getElementById('app');
const KEY = 'terokamath-bank';
const BAB = {
  1: ['Nombor Nyata', 'Faktor dan Gandaan', 'Nisbah, Kadar dan Kadaran', 'Ungkapan Algebra', 'Persamaan Linear', 'Garis dan Sudut', 'Segi Tiga', 'Pengendalian Data'],
  2: ['Pola dan Jujukan', 'Pemfaktoran dan Pecahan Algebra', 'Rumus Algebra', 'Poligon', 'Bulatan', 'Bentuk Geometri Tiga Dimensi', 'Koordinat', 'Graf Fungsi', 'Laju dan Pecutan', 'Kecerunan Garis Lurus', 'Transformasi Isometri', 'Sukatan Kecenderungan Memusat', 'Kebarangkalian Mudah'],
  3: ['Indeks', 'Bentuk Piawai', 'Matematik Pengguna: Simpanan dan Pelaburan, Kredit dan Hutang', 'Lukisan Berskala', 'Nisbah Trigonometri', 'Sudut dan Tangen bagi Bulatan', 'Pelan dan Dongakan', 'Lokus dalam Dua Dimensi', 'Garis Lurus']
};
const DATA = { 1: typeof BS_T1 !== 'undefined' ? BS_T1 : [], 2: typeof BS_T2 !== 'undefined' ? BS_T2 : [], 3: typeof BS_T3 !== 'undefined' ? BS_T3 : [] };
const BYID = {}; [1, 2, 3].forEach(t => DATA[t].forEach(q => { q.t = t; BYID[q.id] = q; }));
const BHG = { A: ['A', 'Objektif', 'var(--A)'], B: ['B', 'Pelbagai bentuk', 'var(--B)'], C: ['C', 'Berstruktur', 'var(--C)'] };
const ARAS = { R: ['Rendah', 'var(--R)'], S: ['Sederhana', 'var(--S)'], T: ['Tinggi', 'var(--T)'] };
const JENIS = { bp: 'Benar/Palsu', pad: 'Padanan', isi: 'Isi tempat kosong', label: 'Label rajah' };
const DEF_AR = 'Jawab semua soalan.\nTunjukkan langkah-langkah penting dalam kerja mengira anda.';
const tingOf = p => { const r = p.items.find(e => e.ref && BYID[e.ref]); return r ? BYID[r.ref].t : ST.t; };
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- penanda matematik ---------- */
function mk(s) {
  s = String(s == null ? '' : s);
  const tags = { FR: 2, VC: 2, RT: 1 };
  let out = '', i = 0;
  while (i < s.length) {
    const m = /^(FR|VC|RT)\(/.exec(s.slice(i, i + 3));
    if (!m) { out += s[i++]; continue; }
    let d = 0, j = i + 2, parts = [''], ok = false;
    for (; j < s.length; j++) {
      const c = s[j];
      if (c === '(') { d++; if (d === 1) continue; }
      if (c === ')') { d--; if (d === 0) { ok = true; break; } }
      if (c === '|' && d === 1 && tags[m[1]] === 2) { parts.push(''); continue; }
      parts[parts.length - 1] += c;
    }
    if (!ok) { out += s[i++]; continue; }
    const [a, b] = parts.map(mk);
    if (m[1] === 'FR') out += `<span class="fr"><span>${a}</span><span>${b || ''}</span></span>`;
    else if (m[1] === 'VC') out += `<span class="vc"><i>(</i><span class="fr"><span>${a}</span><span>${b || ''}</span></span><i>)</i></span>`;
    else out += `<span class="rt">√<span>${a}</span></span>`;
    i = j + 1;
  }
  return out;
}

/* ---------- rajah ---------- */
const FIG = {
  B04: `<svg viewBox="0 0 220 200" width="220" role="img" aria-label="Bulatan dengan pusat P, diameter Q, perentas R dan tembereng S"><g fill="none" stroke="currentColor" stroke-width="2">
    <path d="M60.5 149.5 A70 70 0 0 0 159.5 149.5 Z" fill="currentColor" fill-opacity=".18" stroke="none"/>
    <circle cx="110" cy="100" r="70"/><line x1="40" y1="100" x2="180" y2="100"/><line x1="60.5" y1="149.5" x2="159.5" y2="149.5"/></g>
    <circle cx="110" cy="100" r="3.5" fill="currentColor"/>
    <g font-family="Inter,sans-serif" font-style="italic" font-size="15" fill="currentColor">
    <text x="104" y="92">P</text><text x="150" y="93">Q</text><text x="186" y="152">R</text><text x="104" y="166">S</text></g>
    <line x1="164" y1="149.5" x2="182" y2="149.5" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/></svg>`
};

/* ---------- simpanan kertas ---------- */
let D;
function load() {
  try { D = JSON.parse(localStorage.getItem(KEY)); } catch (e) { D = null; }
  if (!D || !Array.isArray(D.papers) || !D.papers.length) D = { cur: 'k1', papers: [{ id: 'k1', nama: 'Kertas 1', kepala: {}, items: [] }] };
  if (!D.papers.some(p => p.id === D.cur)) D.cur = D.papers[0].id;
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { toast('Storan penuh'); } };
const P = () => D.papers.find(p => p.id === D.cur);
const ST = { t: 2, bab: 0, bhg: { A: true, B: true, C: true }, aras: { R: true, S: true, T: true }, open: {} };

/* item kertas → soalan lengkap (bank + suntingan) */
function resolve(e) {
  if (e.custom) return Object.assign({ own: true }, e.custom);
  const b = BYID[e.ref]; if (!b) return null;
  const q = JSON.parse(JSON.stringify(b)), ed = e.ed || {};
  if (ed.q != null) q.q = ed.q;
  if (ed.pil) q.pil = ed.pil.map((v, i) => v != null ? v : q.pil[i]);
  if (ed.items && q.items) q.items = q.items.map((it, i) => ed.items[i] != null ? Object.assign(it, { t: ed.items[i] }) : it);
  if (ed.parts && q.parts) q.parts = q.parts.map((p, i) => Object.assign(p, ed.parts[i] || {}));
  return q;
}
const marksOf = q => q.parts ? q.parts.reduce((a, p) => a + (+p.m || 0), 0) : q.items && q.bhg === 'B' ? q.items.length : (+q.m || 0);
function arasMarks(q) {
  const o = { R: 0, S: 0, T: 0 };
  if (q.parts) q.parts.forEach(p => { if (o[p.aras] != null) o[p.aras] += +p.m || 0; });
  else if (q.items && q.bhg === 'B') q.items.forEach(it => { if (o[it.aras] != null) o[it.aras] += 1; });
  else if (o[q.aras] != null) o[q.aras] += +q.m || 0;
  return o;
}
const arasSet = q => { const a = arasMarks(q); return Object.keys(a).filter(k => a[k] > 0); };

/* ---------- papar soalan ---------- */
function body(q, print) {
  let h = `<div class="qt">${mk(q.q)}</div>`;
  if (q.fig && FIG[q.fig]) h += `<div class="fig">${FIG[q.fig]}</div>`;
  if (q.bhg === 'A' && q.pil) h += `<div class="op qt">${q.pil.map((p, i) => `<div><b>${'ABCD'[i]}</b><span>${mk(p)}</span></div>`).join('')}</div>`;
  if (q.bhg === 'B') {
    if (q.jenis === 'isi' && q.jadual) h += `<table class="tb qt"><tr><th><i>x</i></th>${q.jadual.x.map(v => `<td>${mk(v)}</td>`).join('')}</tr><tr><th><i>y</i></th>${q.jadual.y.map(v => `<td>${v === '?' ? '&nbsp;&nbsp;&nbsp;&nbsp;' : mk(v)}</td>`).join('')}</tr></table>`;
    else if (q.jenis === 'pad') h += `<div class="pad qt">${q.items.map((it, i) => `<div>${mk(it.t)}</div><div>•&nbsp;&nbsp;&nbsp;•</div><div class="r">${mk((q.kanan || [])[i] || '')}</div>`).join('')}</div>`;
    else if (q.jenis === 'label') h += `<table class="tb qt">${q.items.map(it => `<tr><td>${mk(it.t)}</td><td style="min-width:160px">&nbsp;</td></tr>`).join('')}</table>`;
    else h += `<table class="tb qt">${(q.items || []).map(it => `<tr><td>${mk(it.t)}</td><td style="width:54px">(&nbsp;&nbsp;&nbsp;&nbsp;)</td></tr>`).join('')}</table>`;
  }
  if (q.parts) h += `<div class="pt qt">${q.parts.map(p => `<span class="l">${esc(p.l)}</span><span>${mk(p.q)}${print ? '<div class="sp" style="min-height:' + (8 + 6 * (+p.m || 1)) + 'mm"></div>' : ''}</span><span class="m">[${+p.m || 0} markah]</span>`).join('')}</div>`;
  return h;
}
function skema(q) {
  if (q.bhg === 'A') return `<b>Jawapan: ${esc(q.jaw || '?')}</b>${q.sk ? `<br>${mk(q.sk)}` : ''}`;
  if (q.bhg === 'B') return (q.items || []).map((it, i) => `${q.jenis === 'pad' || q.jenis === 'label' || q.jenis === 'isi' ? mk(it.t) + ' → ' : (i + 1) + '. '}<b>${mk(it.a)}</b>`).join('<br>');
  return (q.parts || []).map(p => `<b>${esc(p.l)}</b> ${mk(p.sk || '')}`).join('<br>');
}
function tags(q) {
  const b = BHG[q.bhg], ar = arasSet(q);
  return `<div class="tg"><span class="b${q.bhg}">${b[0]} · ${q.jenis ? JENIS[q.jenis] : b[1]}</span>
    ${q.bab ? `<span>Bab ${q.bab} ${esc(BAB[q.t || ST.t][q.bab - 1] || '')}</span>` : ''}
    <span>${ar.map(a => `<b class="a${a}">${ARAS[a][0]}</b>`).join(' → ')}</span>${q.kbat ? '<span>KBAT</span>' : ''}<span>${marksOf(q)} markah</span></div>`;
}
function why(q) {
  if (q.why) return q.why;
  if (q.parts) return q.parts.map(p => `${p.l} ${ARAS[p.aras] ? ARAS[p.aras][0] : ''} · ${p.kon || ''}`).join(' · ');
  return '';
}

/* ---------- halaman utama bank ---------- */
const inPaper = id => P().items.some(e => e.ref === id);
function filtered() {
  return DATA[ST.t].filter(q => ST.bhg[q.bhg] && (!ST.bab || q.bab === ST.bab) && arasSet(q).some(a => ST.aras[a]));
}
function paperStats(p) {
  const s = { A: 0, B: 0, C: 0, m: 0, R: 0, S: 0, T: 0 };
  p.items.map(resolve).filter(Boolean).forEach(q => { s[q.bhg]++; s.m += marksOf(q); const a = arasMarks(q); s.R += a.R; s.S += a.S; s.T += a.T; });
  return s;
}
function viewKP() {
  const p = P(), s = paperStats(p), tot = s.R + s.S + s.T || 1;
  const pc = k => Math.round(s[k] / tot * 100);
  return `<aside class="kp" aria-label="Kertas saya"><h2>KERTAS SAYA</h2>
    <select id="kSel" aria-label="Pilih kertas">${D.papers.map(x => `<option value="${x.id}"${x.id === D.cur ? ' selected' : ''}>${esc(x.nama)}</option>`).join('')}</select>
    <div class="row"><button class="ck sm" id="kNew">+ Kertas baharu</button><button class="ck sm" id="kRen" aria-label="Namakan semula">✎</button><button class="ck sm" id="kDel" aria-label="Padam kertas">🗑</button></div>
    ${['A', 'B', 'C'].map(k => `<div class="sec"><span>${k} · ${BHG[k][1]}</span><b>${s[k]}</b></div>`).join('')}
    <div class="sec"><span>Jumlah markah</span><b>${s.m}</b></div>
    <p class="hint" style="margin-top:10px">Aras ikut markah (sasaran 5 : 3 : 2)</p>
    <div class="bar">${['R', 'S', 'T'].map(k => `<i style="width:${s.m ? pc(k) : 0}%;background:${ARAS[k][1]}"></i>`).join('')}</div>
    <div class="lg"><span style="color:var(--R)">R ${s.m ? pc('R') : 0}%</span><span style="color:var(--S)">S ${s.m ? pc('S') : 0}%</span><span style="color:var(--T)">T ${s.m ? pc('T') : 0}%</span></div>
    <a class="ck pri btn" href="#/kertas">Susun, edit &amp; cetak</a>
    <p class="hint">Disimpan dalam pelayar komputer ini.</p></aside>`;
}
function viewBank() {
  const list = filtered(), babs = BAB[ST.t];
  const cards = list.map(q => `<article class="q${inPaper(q.id) ? ' on' : ''}" data-id="${q.id}">${tags(q)}${body(q)}
      <div class="an${ST.open[q.id] ? ' on' : ''}">${skema(q)}${why(q) ? `<span class="why">Aras: ${esc(why(q))}${q.kon ? ' · ' + esc(q.kon) : ''}</span>` : ''}</div>
      <div class="rw"><button class="ck sm" data-ans="${q.id}">Jawapan</button><button class="ck sm${inPaper(q.id) ? ' in' : ''}" data-add="${q.id}">${inPaper(q.id) ? '✓ Dalam kertas' : '+ Kertas'}</button></div></article>`).join('');
  return `<div class="tabs" role="tablist">${[1, 2, 3].map(t => `<button role="tab" data-t="${t}" aria-selected="${ST.t === t}"><b>${t}</b><small>TINGKATAN</small></button>`).join('')}</div>
    <div class="fl"><select id="fBab" aria-label="Bab"><option value="0">Semua bab</option>${babs.map((b, i) => `<option value="${i + 1}"${ST.bab === i + 1 ? ' selected' : ''}>Bab ${i + 1} · ${esc(b)}</option>`).join('')}</select>
      ${['A', 'B', 'C'].map(k => `<button class="chip" data-bhg="${k}" aria-pressed="${ST.bhg[k]}" style="--c:${BHG[k][2]}">${k} · ${BHG[k][1]}</button>`).join('')}<span class="sep"></span>
      ${['R', 'S', 'T'].map(k => `<button class="chip" data-aras="${k}" aria-pressed="${ST.aras[k]}" style="--c:${ARAS[k][1]}">${ARAS[k][0]}</button>`).join('')}
      <span class="cnt">${list.length} soalan</span></div>
    <div class="g"><section aria-label="Senarai soalan">${cards || `<div class="empty">${DATA[ST.t].length ? 'Tiada soalan bagi tapisan ini.' : `Belum ada soalan untuk Tingkatan ${ST.t}.<br>Akan ditambah tidak lama lagi.`}</div>`}</section>${viewKP()}</div>`;
}

/* ---------- editor kertas ---------- */
function blank(bhg) {
  if (bhg === 'A') return { bhg: 'A', q: 'Tulis soalan di sini.', pil: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'], jaw: 'A', m: 1, aras: 'R' };
  if (bhg === 'B') return { bhg: 'B', jenis: 'bp', q: 'Tandakan (✓) bagi pernyataan yang benar dan (✗) bagi pernyataan yang palsu.', items: [1, 2, 3, 4].map(i => ({ t: 'Pernyataan ' + i, a: '✓', aras: 'R' })) };
  return { bhg: 'C', q: 'Tulis maklumat soalan di sini.', parts: ['(a)', '(b)', '(c)'].map((l, i) => ({ l, q: 'Tulis soalan.', m: [4, 3, 3][i], aras: 'RST'[i], sk: 'Skema jawapan' })) };
}
function viewEdit() {
  const p = P(), k = p.kepala || {};
  let no = 0;
  const sec = b => {
    const rows = p.items.map((e, idx) => ({ e, idx, q: resolve(e) })).filter(x => x.q && x.q.bhg === b);
    return `<h2><span class="tg"><span class="b${b}">Bahagian ${b}</span></span>${BHG[b][1]} <small>${rows.length} soalan · ${rows.reduce((a, x) => a + marksOf(x.q), 0)} markah</small></h2>
      ${rows.map(({ e, idx, q }) => { no++; return `<div class="ei" data-i="${idx}"><div class="eh"><span class="n">${no}</span>${q.own ? '<span class="own">SOALAN SENDIRI</span>' : `<span class="tg" style="margin:0">${tags(q).replace(/^<div class="tg">|<\/div>$/g, '')}</span>`}
        <span class="sp"><button class="ck sm" data-mv="${idx},-1" aria-label="Naik">↑</button><button class="ck sm" data-mv="${idx},1" aria-label="Turun">↓</button><button class="ck sm" data-rm="${idx}" aria-label="Buang">×</button></span></div>
        <div class="qt" contenteditable="true" data-f="q">${mk(q.q)}</div>
        ${q.fig && FIG[q.fig] ? `<div class="fig">${FIG[q.fig]}</div>` : ''}
        ${q.bhg === 'A' ? `<div class="opE qt">${q.pil.map((o, i) => `<div><b>${'ABCD'[i]}</b><span contenteditable="true" data-f="pil" data-k="${i}">${mk(o)}</span></div>`).join('')}</div>
          ${q.own ? `<div class="sk">Jawapan: <select data-f="jaw">${'ABCD'.split('').map(x => `<option${q.jaw === x ? ' selected' : ''}>${x}</option>`).join('')}</select></div>` : `<div class="sk">Jawapan: ${esc(q.jaw)}</div>`}` : ''}
        ${q.bhg === 'B' ? `<div class="ptE qt">${q.items.map((it, i) => `<span>${i + 1}.</span><span contenteditable="true" data-f="item" data-k="${i}">${mk(it.t)}</span>${q.own ? `<span contenteditable="true" data-f="itemA" data-k="${i}">${mk(it.a)}</span>` : `<span class="sk">${mk(it.a)}</span>`}`).join('')}</div>` : ''}
        ${q.bhg === 'C' ? `<div class="ptE qt">${q.parts.map((pt, i) => `<span contenteditable="true" data-f="pl" data-k="${i}">${esc(pt.l)}</span><span contenteditable="true" data-f="pq" data-k="${i}">${mk(pt.q)}</span><span><input type="number" min="0" max="20" value="${+pt.m || 0}" data-f="pm" data-k="${i}" aria-label="Markah"> m</span>
            ${q.own ? `<span></span><span class="sk" contenteditable="true" data-f="psk" data-k="${i}">${mk(pt.sk)}</span><span></span>` : ''}`).join('')}</div>${q.own ? `<button class="ck sm" data-addpart="${idx}" style="margin-top:6px">+ Bahagian</button>` : ''}` : ''}
      </div>`; }).join('') || '<p class="hint" style="color:var(--p);font-weight:700">Tiada soalan dalam bahagian ini.</p>'}
      <div class="addq"><button class="ck sm" data-own="${b}">+ Soalan sendiri (Bahagian ${b})</button></div>`;
  };
  return `<div class="ed"><div class="edtop"><a class="ck sm" href="#/">← Bank soalan</a><span class="sp"><button class="ck pri" id="pSoal">🖨 Cetak kertas soalan</button><button class="ck" id="pSkema">🖨 Cetak skema</button></span></div>
    <h1 contenteditable="true" id="eNama">${esc(p.nama)}</h1>
    <div class="hdr"><label class="full">NAMA SEKOLAH<input data-h="sekolah" value="${esc(k.sekolah || '')}" placeholder="SMK …"></label>
      <label>TAJUK KERTAS<input data-h="tajuk" value="${esc(k.tajuk || '')}" placeholder="Ujian Bulanan 1"></label>
      <label>MATA PELAJARAN<input data-h="mp" value="${esc(k.mp || 'Matematik Tingkatan ' + tingOf(p))}"></label>
      <label>MASA<input data-h="masa" value="${esc(k.masa || '')}" placeholder="1 jam"></label>
      <label>TARIKH<input data-h="tarikh" value="${esc(k.tarikh || '')}" placeholder=""></label>
      <label class="full">ARAHAN (satu baris satu arahan)<textarea data-h="arahan" rows="3">${esc(k.arahan != null ? k.arahan : DEF_AR)}</textarea></label></div>
    ${['A', 'B', 'C'].map(sec).join('')}</div>`;
}

/* ---------- cetak ---------- */
function printPaper(withSk) {
  const p = P(), k = p.kepala || {};
  const all = p.items.map(resolve).filter(Boolean);
  if (!all.length) { toast('Kertas masih kosong'); return; }
  let no = 0, h = `<div class="ph"><b>${esc(k.sekolah || '')}</b><div>${esc(k.tajuk || p.nama)}${withSk ? ' · SKEMA JAWAPAN' : ''}</div><div>${esc(k.mp || 'Matematik Tingkatan ' + tingOf(p))}${k.masa ? ' · ' + esc(k.masa) : ''}${k.tarikh ? ' · ' + esc(k.tarikh) : ''}</div></div>`;
  if (!withSk) {
    h += `<div class="nm"><span>Nama:</span><span style="flex:.5">Tingkatan:</span></div>`;
    const ar = String(k.arahan != null ? k.arahan : DEF_AR).split('\n').filter(x => x.trim());
    if (ar.length) h += `<div class="ar"><b>Arahan:</b><ol>${ar.map(a => `<li>${esc(a)}</li>`).join('')}</ol></div>`;
  }
  ['A', 'B', 'C'].forEach(b => {
    const qs = all.filter(q => q.bhg === b); if (!qs.length) return;
    h += `<h3>Bahagian ${b} <small>[${qs.reduce((a, q) => a + marksOf(q), 0)} markah]</small></h3>`;
    if (withSk && b === 'A') { h += `<div class="skA">${qs.map(q => `<span>${++no}. <b>${esc(q.jaw)}</b></span>`).join('')}</div>`; return; }
    qs.forEach(q => {
      no++;
      h += withSk ? `<div class="pq"><span class="no">${no}.</span><div>${skema(q)}</div></div>`
        : `<div class="pq"><span class="no">${no}.</span><div>${body(q, true)}${b === 'B' ? `<div class="mk">[${marksOf(q)} markah]</div>` : ''}</div></div>`;
    });
  });
  h += `<div class="ft">Dijana dengan TerokaMath · terokamath.com</div>`;
  const el = document.getElementById('print'); el.innerHTML = h;
  document.body.classList.add('printing');
  setTimeout(() => window.print(), 60);
}

/* ---------- render & ikatan ---------- */
let tt; function toast(m) { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 1800); }
const isLight = () => document.documentElement.classList.contains('light');
function head() {
  return `<header class="top"><a class="brand" href="../"><svg width="34" height="34" viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" rx="112" fill="#15162A"/><circle cx="256" cy="256" r="178" fill="none" stroke="#2B2C4A" stroke-width="14"/><polygon points="256,62 290,222 256,256 222,222" fill="#2EE6A6"/><polygon points="450,256 290,290 256,256 290,222" fill="#FF8A3D"/><polygon points="256,450 222,290 256,256 290,290" fill="#B57BFF"/><polygon points="62,256 222,222 256,256 222,290" fill="#FFC93C"/><circle cx="256" cy="256" r="24" fill="#FFFFFF"/></svg><b>Teroka<span>Math</span></b><small>Bank Soalan</small></a>
    <button class="ck sq" id="mode" aria-label="${isLight() ? 'Tukar ke mod gelap' : 'Tukar ke mod cerah'}">${isLight() ? '☾' : '☀'}</button></header>`;
}
function render(keep) {
  const y = keep ? window.scrollY : 0;
  const ed = location.hash.startsWith('#/kertas');
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
  app.querySelectorAll('[data-bhg]').forEach(b => b.onclick = () => { ST.bhg[b.dataset.bhg] = !ST.bhg[b.dataset.bhg]; render(true); });
  app.querySelectorAll('[data-aras]').forEach(b => b.onclick = () => { ST.aras[b.dataset.aras] = !ST.aras[b.dataset.aras]; render(true); });
  app.querySelectorAll('[data-ans]').forEach(b => b.onclick = () => { const id = b.dataset.ans; ST.open[id] = !ST.open[id]; b.closest('.q').querySelector('.an').classList.toggle('on', ST.open[id]); });
  app.querySelectorAll('[data-add]').forEach(b => b.onclick = () => {
    const id = b.dataset.add, p = P(), i = p.items.findIndex(e => e.ref === id);
    if (i >= 0) p.items.splice(i, 1); else p.items.push({ ref: id });
    save(); render(true);
  });
  bindKP();
}
function bindKP() {
  document.getElementById('kSel').onchange = e => { D.cur = e.target.value; save(); render(true); };
  document.getElementById('kNew').onclick = () => { const id = 'k' + Date.now(); D.papers.push({ id, nama: 'Kertas ' + (D.papers.length + 1), kepala: {}, items: [] }); D.cur = id; save(); render(true); };
  document.getElementById('kRen').onclick = () => { const n = prompt('Nama kertas:', P().nama); if (n && n.trim()) { P().nama = n.trim().slice(0, 60); save(); render(true); } };
  document.getElementById('kDel').onclick = () => {
    if (!confirm(`Padam "${P().nama}"? Tindakan ini tidak boleh dibatalkan.`)) return;
    D.papers = D.papers.filter(p => p.id !== D.cur); if (!D.papers.length) D.papers.push({ id: 'k' + Date.now(), nama: 'Kertas 1', kepala: {}, items: [] });
    D.cur = D.papers[0].id; save(); render(true);
  };
}
// teks bersih daripada kotak sunting → kekalkan pecahan sebagai penanda FR(a|b)
function plain(el) {
  const c = el.cloneNode(true);
  c.querySelectorAll('.vc').forEach(v => { const s = v.querySelectorAll('.fr>span'); v.replaceWith(`VC(${s[0] ? s[0].innerHTML : ''}|${s[1] ? s[1].innerHTML : ''})`); });
  c.querySelectorAll('.fr').forEach(f => { const s = f.children; f.replaceWith(`FR(${s[0] ? s[0].innerHTML : ''}|${s[1] ? s[1].innerHTML : ''})`); });
  c.querySelectorAll('.rt').forEach(r => { const s = r.querySelector('span'); r.replaceWith(`RT(${s ? s.innerHTML : ''})`); });
  return c.innerHTML.replace(/<div>/g, '<br>').replace(/<\/div>/g, '').replace(/&nbsp;/g, ' ').replace(/<(?!\/?(i|b|sub|sup|br)\b)[^>]*>/g, '').trim();
}
function bindEdit() {
  const p = P();
  p.kepala = p.kepala || {};
  document.getElementById('eNama').onblur = e => { const n = e.target.textContent.trim(); if (n) { p.nama = n.slice(0, 60); save(); } };
  app.querySelectorAll('[data-h]').forEach(inp => inp.oninput = () => { p.kepala[inp.dataset.h] = inp.value; save(); });
  app.querySelectorAll('.ei').forEach(box => {
    const idx = +box.dataset.i, e = p.items[idx];
    const tgt = () => { if (e.custom) return e.custom; e.ed = e.ed || {}; return e.ed; };
    box.querySelectorAll('[data-f]').forEach(f => {
      const k = +f.dataset.k, fld = f.dataset.f;
      const ev = f.tagName === 'INPUT' || f.tagName === 'SELECT' ? 'onchange' : 'onblur';
      f[ev] = () => {
        const t = tgt(), base = resolve(e), v = f.tagName === 'INPUT' ? +f.value : f.tagName === 'SELECT' ? f.value : plain(f);
        if (fld === 'q') t.q = v;
        else if (fld === 'jaw') t.jaw = v;
        else if (fld === 'pil') { t.pil = e.custom ? t.pil : (t.pil || [null, null, null, null]); t.pil[k] = v; }
        else if (fld === 'item' || fld === 'itemA') {
          if (e.custom) t.items[k][fld === 'item' ? 't' : 'a'] = v;
          else { t.items = t.items || []; t.items[k] = v; }
        } else if (['pl', 'pq', 'pm', 'psk'].includes(fld)) {
          const key = { pl: 'l', pq: 'q', pm: 'm', psk: 'sk' }[fld];
          if (e.custom) t.parts[k][key] = v;
          else { t.parts = t.parts || base.parts.map(() => ({})); t.parts[k] = Object.assign(t.parts[k] || {}, { [key]: v }); }
        }
        save(); if (fld === 'pm') render(true);
      };
    });
  });
  app.querySelectorAll('[data-mv]').forEach(b => b.onclick = () => {
    const [i, d] = b.dataset.mv.split(',').map(Number), bh = resolve(p.items[i]).bhg;
    let j = i + d; while (j >= 0 && j < p.items.length && resolve(p.items[j]).bhg !== bh) j += d;
    if (j < 0 || j >= p.items.length) return;
    [p.items[i], p.items[j]] = [p.items[j], p.items[i]]; save(); render(true);
  });
  app.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { p.items.splice(+b.dataset.rm, 1); save(); render(true); });
  app.querySelectorAll('[data-own]').forEach(b => b.onclick = () => { p.items.push({ custom: blank(b.dataset.own) }); save(); render(true); });
  app.querySelectorAll('[data-addpart]').forEach(b => b.onclick = () => { const c = p.items[+b.dataset.addpart].custom; c.parts.push({ l: '(' + 'abcdefgh'[c.parts.length] + ')', q: 'Tulis soalan.', m: 2, aras: 'S', sk: 'Skema jawapan' }); save(); render(true); });
  document.getElementById('pSoal').onclick = () => printPaper(false);
  document.getElementById('pSkema').onclick = () => printPaper(true);
}
window.addEventListener('hashchange', () => render());
window.addEventListener('afterprint', () => document.body.classList.remove('printing'));
load(); render();
