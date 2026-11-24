'use strict';
/* =================== TerokaMath · TERAS: Lembaran Kerja (bank tetap, pilih & cetak) =================== */
// Bab perlu sediakan WG (penjana) dan WSPLAN (susunan bank).

/* =================== Gabung subtopik ikut buku teks (BAB.gabung) ===================
   Contoh dalam bab.js: gabung: { '2.1.1': '2.1', '2.2.1': '2.2', '2.2.3': '2.2' },
   gabungNama: { '2.1': 'Matriks', '2.2': 'Operasi Asas Matriks' }
   Slaid, soalan (GEN, WSPLAN) dan senarai subtopik disatukan supaya nombor ikut buku teks. */
(function gabungSub() {
  const M = BAB.gabung; if (!M) return;
  const to = k => M[k] || k, nama = BAB.gabungNama || {};
  const subs = []; SUBS.forEach(s => { const n = to(s.no); if (!subs.some(x => x.no === n)) subs.push(Object.assign({}, s, { no: n, name: nama[n] || s.name })); });
  window.SUBS = subs;
  const cnt = {}, idx = {};
  SLIDES.forEach(sl => { sl.sub = to(sl.sub); cnt[sl.sub] = (cnt[sl.sub] || 0) + 1; });
  SLIDES.forEach(sl => { idx[sl.sub] = (idx[sl.sub] || 0) + 1; sl.n = idx[sl.sub]; sl.N = cnt[sl.sub]; });
  const merge = (obj, join) => { const out = {}; Object.keys(obj).forEach(k => { const n = to(k); out[n] = out[n] ? join(out[n], obj[k]) : obj[k]; }); Object.keys(obj).forEach(k => delete obj[k]); Object.assign(obj, out); };
  merge(WSPLAN, (a, b) => a.concat(b));
  merge(GEN, (a, b) => { const o = {}; ['m', 's', 'k'].forEach(l => { o[l] = (a[l] || []).concat(b[l] || []); }); return o; });
})();

let WSBANK = null;
function wsBank() {
  if (WSBANK) return WSBANK;
  WSBANK = [];
  Object.keys(WSPLAN).forEach((sub, si) => {
    WR = mulberry32(20261124 + si * 1009);
    vreset(() => WR());
    const seen = new Set(); let n = 0;
    for (const [lvl, g, cnt] of WSPLAN[sub]) {
      for (let i = 0; i < cnt; i++) {
        let q, tries = 0;
        do { q = WG[g](i); tries++; } while (tries < 40 && seen.has(q.q + (q.fig || '')));
        seen.add(q.q + (q.fig || ''));
        n++;
        WSBANK.push(Object.assign({ kind: 'jawab', fig: '', figAns: '', work: [] }, q, { id: `${sub}-${String(n).padStart(2, '0')}`, sub, lvl }));
      }
    }
  });
  WR = Math.random;
  vreset();
  return WSBANK;
}

/* =================== Paparan Lembaran Kerja =================== */
const WS = { sub: SUBS[0].no, lvl: 'all', sel: [] , key: true };
try { const s0 = store().ws; if (s0) { WS.sel = (s0.sel || []).filter(Boolean); WS.key = s0.key !== false; } } catch (e) {}
const wsSave = () => save({ ws: { sel: WS.sel, key: WS.key } });
function latSeg(cur) {
  return `<nav class="seg latseg" aria-label="Jenis latihan"><a href="#/latihan"${cur === 'kelas' ? ' aria-current="page"' : ''}>Latihan Kelas</a><a href="#/latihan/lembaran"${cur === 'ws' ? ' aria-current="page"' : ''}>Lembaran Kerja</a></nav>`;
}
function viewLembaran() {
  const bank = wsBank();
  const list = bank.filter(q => q.sub === WS.sub && (WS.lvl === 'all' || (WS.lvl === 'lukis' ? q.kind === 'lukis' : q.lvl === WS.lvl)));
  const subs = SUBS.map(s => { const c = WS.sel.filter(id => id.startsWith(s.no + '-')).length; return `<button type="button" class="opt" data-wsub="${s.no}" aria-pressed="${WS.sub === s.no}" style="--c:${subCol(s.no)}">${s.no}${c ? ` <span class="wcnt">${c}</span>` : ''}</button>`; }).join('');
  const lv = [['all', 'Semua'], ['m', 'Mudah'], ['s', 'Sederhana'], ['k', 'Sukar'], ['lukis', 'Melukis']].map(([k, t]) => `<button type="button" class="opt" data-wlvl="${k}" aria-pressed="${WS.lvl === k}" style="--c:var(--tr)">${t}</button>`).join('');
  const cards = list.map(q => {
    const on = WS.sel.includes(q.id), [ln, lc] = LVLN[q.lvl];
    return `<label class="wq${on ? ' on' : ''}"><input type="checkbox" data-wq="${q.id}"${on ? ' checked' : ''}>
      <span class="wqb"><span class="wqh"><b>${q.id}</b><span class="chip" style="height:26px;font-size:12px;background:color-mix(in srgb,var(--${lc}) 15%,transparent);color:var(--${lc})">${ln}</span>${q.kind === 'lukis' ? '<span class="chip" style="height:26px;font-size:12px;background:color-mix(in srgb,var(--pu) 15%,transparent);color:var(--pu)">Melukis</span>' : ''}</span>
      <span class="wqt">${q.q}</span></span>${q.fig ? `<span class="wqf">${q.fig}</span>` : ''}</label>`;
  }).join('');
  const byId = Object.fromEntries(bank.map(q => [q.id, q]));
  const selList = WS.sel.map((id, i) => byId[id] ? `<li><span class="n">${i + 1}</span><span class="t">${byId[id].id} · ${LVLN[byId[id].lvl][0]}${byId[id].kind === 'lukis' ? ' · Melukis' : ''}</span>
      <button type="button" class="mini" data-up="${i}" aria-label="Naikkan soalan ${i + 1}"${i ? '' : ' disabled'}>↑</button><button type="button" class="mini" data-dn="${i}" aria-label="Turunkan soalan ${i + 1}"${i < WS.sel.length - 1 ? '' : ' disabled'}>↓</button><button type="button" class="mini" data-rm="${i}" aria-label="Buang soalan ${i + 1}">×</button></li>` : '').join('');
  return `<div class="wrap wswrap">
    ${latSeg('ws')}
    <div><h1 class="h1">Lembaran Kerja</h1><p class="lead">Pilih soalan yang dikehendaki, kemudian cetak untuk diberi kepada murid.</p></div>
    <div class="wsgrid">
      <section class="wslist">
        <div class="opts wsubs" role="group" aria-label="Subtopik">${subs}</div>
        <p class="wsname">${WS.sub} ${subOf(WS.sub).name}</p>
        <div class="opts wlvls" role="group" aria-label="Tapis aras">${lv}</div>
        <div class="wqs">${cards || '<p class="lead">Tiada soalan.</p>'}</div>
      </section>
      <aside class="wsside">
        <div class="pbox" style="gap:12px">
          <h3>DIPILIH: ${WS.sel.length} SOALAN</h3>
          ${WS.sel.length ? `<ol class="wsel">${selList}</ol><button type="button" class="btn sec" id="wsClear" style="min-height:42px;font-size:15px">Kosongkan pilihan</button>` : '<p style="margin:0;color:var(--mu);font-size:15px">Tandakan soalan di sebelah untuk dimasukkan ke dalam lembaran kerja.</p>'}
          <label class="tg" style="--c:var(--tr)">Sertakan skema jawapan <input type="checkbox" id="wsKey"${WS.key ? ' checked' : ''}></label>
        </div>
        <button type="button" class="btn pri big" id="wsPrint"${WS.sel.length ? '' : ' disabled'}>${IC.print} Cetak / PDF</button>
      </aside>
    </div></div>`;
}
function bindLembaran() {
  const main = document.getElementById('main');
  main.querySelectorAll('[data-wsub]').forEach(b => b.onclick = () => { WS.sub = b.dataset.wsub; render(true); main.querySelector('.wqs') && (document.getElementById('main').scrollTop = 0); });
  main.querySelectorAll('[data-wlvl]').forEach(b => b.onclick = () => { WS.lvl = b.dataset.wlvl; render(true); });
  main.querySelectorAll('[data-wq]').forEach(c => c.onchange = () => { const id = c.dataset.wq; WS.sel = WS.sel.filter(x => x !== id); if (c.checked) WS.sel.push(id); wsSave(); render(true); });
  main.querySelectorAll('[data-up]').forEach(b => b.onclick = () => { const i = +b.dataset.up; [WS.sel[i - 1], WS.sel[i]] = [WS.sel[i], WS.sel[i - 1]]; wsSave(); render(true); });
  main.querySelectorAll('[data-dn]').forEach(b => b.onclick = () => { const i = +b.dataset.dn; [WS.sel[i + 1], WS.sel[i]] = [WS.sel[i], WS.sel[i + 1]]; wsSave(); render(true); });
  main.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { WS.sel.splice(+b.dataset.rm, 1); wsSave(); render(true); });
  const cl = document.getElementById('wsClear'); if (cl) cl.onclick = () => { WS.sel = []; wsSave(); render(true); };
  document.getElementById('wsKey').onchange = e => { WS.key = e.target.checked; wsSave(); };
  document.getElementById('wsPrint').onclick = () => printDoc(wsDocHTML(), WS_PAGE);
}
function wsDocHTML() {
  const byId = Object.fromEntries(wsBank().map(q => [q.id, q]));
  const qs = WS.sel.map(id => byId[id]).filter(Boolean);
  const head = `<header class="wshead"><h1>Lembaran Kerja · Bab ${BAB.no}: ${BAB.tajuk}</h1>
    <div class="wsfields"><span>Nama: <i></i></span><span>Kelas: <i></i></span><span>Tarikh: <i></i></span></div></header>`;
  const body = qs.map((q, i) => {
    const sp = q.kind === 'lukis' ? '' : `<div class="wspace sp-${q.lvl}"></div>`;
    return `<section class="wsq"><div class="wsqh"><b>${i + 1}.</b><span class="wsqt">${q.q}</span><span class="wslv">[${LVLN[q.lvl][0]}]</span></div>
      ${q.fig ? `<div class="wsfig${q.kind === 'lukis' ? ' big' : ''}">${q.fig}</div>` : ''}
      ${sp}${q.kind === 'lukis' ? '' : '<div class="wsans">Jawapan: <i></i></div>'}</section>`;
  }).join('');
  let key = '';
  if (WS.key) key = `<div class="wskey"><header class="wshead"><h1>Skema Jawapan · Bab ${BAB.no}: ${BAB.tajuk}</h1><p>Untuk kegunaan guru</p></header>
    ${qs.map((q, i) => `<section class="wskq"><b>${i + 1}.</b><div><div class="ka">${q.ans}</div>${q.work.length ? `<div class="kw">${q.work.join(' · ')}</div>` : ''}${q.figAns ? `<div class="wsfig small">${q.figAns}</div>` : ''}</div></section>`).join('')}</div>`;
  return `<div class="wsdoc">${head}${body}</div>${key ? `<div class="wsdoc">${key}</div>` : ''}`;
}
