'use strict';
/* =================== MULA MENGAJAR =================== */
// Guru susun satu pelan (slaid, simulasi, latihan, game, slaid sendiri) dan tayang
// terus dengan satu butang ▶. Pelan disimpan dalam pelayar dan boleh disimpan
// sebagai fail. Bergantung pada app.js, ws.js dan slides.js (dipanggil semasa guna sahaja).

const AJKEY = BAB.ajarKey;
const AJT = {
  slaid: ['SLAID', 'tr'],
  sim: ['SIMULASI', 'gr'],
  lat: ['LATIHAN', 'am'],
  game: ['GAME', 'pk'],
  cikgu: ['SLAID CIKGU', 'pu']
};
const TPL = {
  isi: ['Tajuk + isi', 'Poin keluar satu demi satu'],
  soalan: ['Soalan cepat', 'Soalan, kemudian tunjuk jawapan'],
  gambar: ['Gambar', 'Tajuk + gambar sendiri'],
  papan: ['Papan kosong / grid', 'Ruang tulis & lukis dengan pen'],
  pautan: ['Pautan / video', 'Link YouTube atau laman web'],
  bebas: ['Slaid bebas', 'Teks, gambar & video di mana-mana']
};
// Slaid bebas & import PPTX/PDF ada dalam bebas.js (dimuat selepas fail ini jika bab menggunakannya)
const ajBB = () => typeof bbHTML === 'function';
// pautan: hanya https; YouTube dimainkan dalam slaid
const ajUrl = u => { try { const x = new URL(String(u || '').trim()); return x.protocol === 'https:' ? x.href : ''; } catch (e) { return ''; } };
function ajYt(u) {
  const h = ajUrl(u); if (!h) return null;
  const x = new URL(h), host = x.hostname.replace(/^(www|m|music)\./, '');
  let id = '';
  if (host === 'youtu.be') id = x.pathname.slice(1).split('/')[0];
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (x.pathname === '/watch') id = x.searchParams.get('v') || '';
    else { const m = x.pathname.match(/^\/(embed|shorts|live|v)\/([^/?#]+)/); if (m) id = m[2]; }
  }
  if (!/^[\w-]{11}$/.test(id)) return null;
  const t = x.searchParams.get('t') || x.searchParams.get('start') || '';
  let st = 0; const tm = String(t).match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/); if (t && tm) st = (+tm[1] || 0) * 3600 + (+tm[2] || 0) * 60 + (+tm[3] || 0);
  return { id, st };
}
const SIMNAME = Object.fromEntries(SIMLIST.map(s => [s[0], s[1]]));
const strip = s => mathPlain(String(s || '')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const ajIcon = {
  ajar: sv('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M10 8.5v5l4-2.5zM8 21h8M12 17v4"/>'),
  up: sv('<path d="M12 19V5M6 11l6-6 6 6"/>', 18),
  down: sv('<path d="M12 5v14M6 13l6 6 6-6"/>', 18),
  drag: sv('<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"/>', 20, ' stroke-width="3.4"'),
  plus: sv('<path d="M12 5v14M5 12h14"/>', 18),
  doc: sv('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>', 18),
  print: sv('<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>', 18),
  share: sv('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>', 18),
  copy: sv('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>', 18),
  edit: sv('<path d="M4 20h4L19 9l-4-4L4 16z"/>', 18),
  trash: sv('<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>', 18),
  list: sv('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', 20),
  pen: sv('<path d="M4 20l4-1 11-11-3-3L5 16z"/>', 20),
  hl: sv('<path d="M9 15l-4 5h6l2-2M9 15l7-11 4 3-7 11z"/>', 20),
  eraser: sv('<path d="M8 20h12M4 14l8-8 6 6-6 6H8z"/>', 20),
  img: sv('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>', 20)
};

/* ---------- simpanan ---------- */
function ajLoad() {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(AJKEY)); } catch (e) {}
  if (!d || !Array.isArray(d.plans)) {
    d = { cur: null, plans: SUBS.map(s => ({ id: 'sedia-' + s.no, name: `Siap sedia · ${s.no} ${s.name}`, items: readyItems(s.no) })) };
    d.cur = d.plans[0].id;
  }
  if (!d.plans.length) d.plans.push({ id: 'p' + Date.now(), name: 'Pelan baharu', items: [] });
  if (!d.plans.some(p => p.id === d.cur)) d.cur = d.plans[0].id;
  return d;
}
const AJD = { d: null };
const ajData = () => AJD.d || (AJD.d = ajLoad());
const ajShared = () => /^#\/k\//.test(location.hash) && AJK.plan;
const ajPlan = () => { if (ajShared()) return AJK.plan; const d = ajData(); return d.plans.find(p => p.id === d.cur); };
const ajIsPlay = () => /^#\/(ajar|k\/[^/]+)\/tayang/.test(location.hash);
function ajSave() {
  try { localStorage.setItem(AJKEY, JSON.stringify(ajData())); return true; }
  catch (e) { toast('Storan penuh. Buang gambar yang besar atau pelan lama.'); return false; }
}
function readyItems(sub) {
  const items = SLIDES.filter(s => s.sub === sub).map(s => ({ t: 'slaid', sub, n: s.n }));
  if (SUBSIM[sub]) items.push({ t: 'sim', k: SUBSIM[sub] });
  const b = wsBank().filter(q => q.sub === sub), m = b.filter(q => q.lvl === 'm'), s = b.filter(q => q.lvl === 's'), k = b.filter(q => q.lvl === 'k');
  const ids = [m[0], m[Math.floor(m.length / 2)], m[m.length - 1], s[0], k[0]].filter(Boolean).map(q => q.id);
  items.push({ t: 'lat', ids, work: true });
  items.push({ t: 'game' });
  return items;
}

/* ---------- maklumat item ---------- */
const slideOf = it => SLIDES.find(s => s.sub === it.sub && s.n === it.n);
const bankById = () => { const o = {}; wsBank().forEach(q => { o[q.id] = q; }); return o; };
function itemName(it) {
  if (it.t === 'slaid') { const s = slideOf(it); return s ? `${s.sub} · ${strip(s.title)}` : 'Slaid'; }
  if (it.t === 'sim') return 'Simulasi ' + (SIMNAME[it.k] || '');
  if (it.t === 'lat') { const subs = [...new Set(it.ids.map(id => id.split('-')[0]))].join(', '); return `Latihan ${subs} · ${it.ids.length} soalan`; }
  if (it.t === 'game') return GMODES[it.g || '60'][0];
  if (it.t === 'cikgu') return it.tpl === 'bebas' ? (ajBB() ? bbName(it) : 'Slaid bebas') : `${TPL[it.tpl][0]}: ${strip(it.title || it.q || it.link) || 'Tanpa tajuk'}`;
  return '';
}
const typeChip = (t, extra = '') => `<span class="ajtype" style="--c:var(--${AJT[t][1]})${extra}">${AJT[t][0]}</span>`;

/* ---------- slaid cikgu ---------- */
/* ---------- format slaid cikgu (BAB.fmt): warna, saiz, tebal setiap kotak + latar slaid ---------- */
const FMT_C = [['', 'Asal'], ['tr', 'Biru'], ['rd', 'Merah'], ['gr', 'Hijau'], ['pa', 'Oren'], ['pu', 'Ungu']];
const FMT_S = [['k', 'Kecil', .75], ['', 'Biasa', 1], ['b', 'Besar', 1.3], ['sb', 'Sangat besar', 1.65]];
const FMT_L = [['', 'Asal', ''], ['am', 'Kuning', 'am'], ['tr', 'Biru', 'tr'], ['gr', 'Hijau', 'gr'], ['pk', 'Merah jambu', 'pk']];
const FMT_BASE = { title: 1.6, q: 2.1, text: 1.25, ans: 1.25 };
function fmtSt(it, key) {
  const f = (it.fmt && it.fmt[key]) || {}, out = [];
  if (FMT_C.some(c => c[0] && c[0] === f.c)) out.push(`color:var(--${f.c})`);
  const sz = FMT_S.find(x => x[0] && x[0] === f.s); if (sz) out.push(`font-size:calc(var(--fs) * ${(FMT_BASE[key] * sz[2]).toFixed(3)})`);
  if (f.b) out.push('font-weight:800');
  return out.length ? ` style="${out.join(';')}"` : '';
}
function fmtLat(it) { const l = FMT_L.find(x => x[0] && x[0] === it.lat); return l ? `;background:var(--lat-${l[0]});border-radius:22px` : ''; }
function cikguHTML(it, pv) {
  if (it.tpl === 'bebas') return ajBB() ? bbHTML(it, pv ? 'pv' : 'play') : '';
  const kick = esc(it.kick || '');
  const title = esc(it.title || '');
  if (it.tpl === 'isi') {
    const lines = String(it.text || '').split('\n').map(l => l.trim()).filter(Boolean);
    return `<div class="slide full cs" style="--c:var(--pu)${fmtLat(it)}"><div>${kick ? `<p class="sl-kick">${kick}</p>` : ''}<h1 class="sl-title"${fmtSt(it, 'title')}>${title || 'Tajuk'}</h1></div>
      <ul class="sl-bul cs-bul"${fmtSt(it, 'text')}>${lines.map(l => `<li class="rv">${esc(l)}</li>`).join('')}</ul></div>`;
  }
  if (it.tpl === 'soalan') {
    return `<div class="slide full cs" style="--c:var(--pu)${fmtLat(it)}"><div><p class="sl-kick">${kick || 'SOALAN CEPAT'}</p><h1 class="sl-title cs-q"${fmtSt(it, 'q')}>${esc(it.q || 'Soalan')}</h1></div>
      ${it.ans ? `<div class="sl-ans cs-ans rv"${fmtSt(it, 'ans')}><span>JAWAPAN</span>${esc(it.ans)}</div>` : ''}</div>`;
  }
  if (it.tpl === 'gambar') {
    const x = it.x != null ? it.x : 50, y = it.y != null ? it.y : 50, w = it.w || 60;
    return `<div class="slide full cs cs-pic" style="--c:var(--pu)${fmtLat(it)}"><h1 class="sl-title"${fmtSt(it, 'title')}>${title || 'Tajuk'}</h1>
      <div class="cs-imgbox">${it.img ? `<img class="cs-img" src="${it.img}" alt="${title || 'Gambar'}" draggable="false" style="left:${x}%;top:${y}%;width:${w}%">` : '<div class="cs-noimg">Tiada gambar</div>'}</div></div>`;
  }
  if (it.tpl === 'pautan') {
    const url = ajUrl(it.link), yt = ajYt(url), btn = esc(it.btn || (yt ? 'Buka di YouTube' : 'Buka pautan'));
    let host = ''; try { host = url ? new URL(url).hostname.replace(/^www\./, '') : ''; } catch (e) { }
    if (yt) return `<div class="slide full cs cs-link" style="--c:var(--pu)${fmtLat(it)}"><h1 class="sl-title"${fmtSt(it, 'title')}>${title || 'Video'}</h1>
      <div class="cs-vid">${pv ? `<img src="https://i.ytimg.com/vi/${yt.id}/hqdefault.jpg" alt="" class="cs-thumb"><span class="cs-play" aria-hidden="true"></span>` : `<iframe src="https://www.youtube-nocookie.com/embed/${yt.id}?rel=0${yt.st ? '&start=' + yt.st : ''}" title="${title || 'Video YouTube'}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`}</div>
      <a class="cs-linkbtn sm" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${btn} ↗</a></div>`;
    return `<div class="slide full cs cs-link" style="--c:var(--pu)${fmtLat(it)}"><h1 class="sl-title"${fmtSt(it, 'title')}>${title || 'Pautan'}</h1>
      <div class="cs-linkbox">${url ? `<a class="cs-linkbtn" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${btn} ↗</a><span class="cs-host">${esc(host)}</span>` : '<div class="cs-noimg">Tiada pautan</div>'}</div></div>`;
  }
  // papan
  const bg = it.bg || 'grid';
  return `<div class="slide full cs" style="--c:var(--pu)${fmtLat(it)}">${title ? `<div><h1 class="sl-title"${fmtSt(it, 'title')}>${title}</h1></div>` : ''}
    <div class="cs-board ${bg}">${bg === 'cartes' ? '<span class="cx"></span><span class="cy"></span>' : ''}</div></div>`;
}
function itemSlideHTML(it, pv) {
  if (it.t === 'slaid') { const s = slideOf(it); return s ? slideHTML(s, isLight()) : ''; }
  if (it.t === 'cikgu') return cikguHTML(it, pv);
  return '';
}
const subColVar = it => it.t === 'slaid' ? subCol(it.sub) : 'var(--pu)';

/* =================== MOD SUSUN =================== */
const AJS = { cat: 'slaid', sub: SUBS[0].no, sel: 0, modal: null, drag: -1 };
function viewSusun() {
  if (ajBB()) bbEnsureImgs();
  const d = ajData(), pl = ajPlan();
  if (AJS.sel >= pl.items.length) AJS.sel = pl.items.length - 1;
  const opts = d.plans.map(p => `<option value="${p.id}"${p.id === d.cur ? ' selected' : ''}>${esc(p.name)}</option>`).join('');
  const cats = [['slaid', 'Slaid nota', `${SLIDES.filter(s => !s.cover).length} slaid · ${SUBS.length} subtopik`], ['sim', 'Simulasi', SIMLIST.map(s => s[1]).join(' · ')], ['lat', 'Latihan', 'Pilih soalan dari bank'], ['game', 'Game', '4 pilihan game'], ['cikgu', 'Slaid baharu', ajBB() ? '2 pilihan' : '5 templat']];
  const catBtns = cats.map(([k, t, s]) => `<button type="button" class="ajcat${AJS.cat === k ? ' on' : ''}" data-cat="${k}" style="--c:var(--${AJT[k][1]})"><span class="ab">${k === 'cikgu' ? '+' : AJT[k][0].slice(0, 2)}</span><span><b>${t}</b><small>${s}</small></span></button>`).join('');
  let lib = '';
  if (AJS.cat === 'slaid') {
    lib = `<div class="ajsubs">${SUBS.map(s => `<button type="button" class="opt" data-asub="${s.no}" aria-pressed="${AJS.sub === s.no}" style="--c:${subCol(s.no)}">${s.no}</button>`).join('')}</div>
      <button type="button" class="ajadd all" data-addall="${AJS.sub}">${ajIcon.plus} Semua slaid ${AJS.sub}</button>
      ${SLIDES.filter(s => s.sub === AJS.sub).map(s => `<button type="button" class="ajadd" data-addslide="${s.n}"><span>${s.cover ? 'Tajuk subtopik' : `${s.n}. ${strip(s.title)}`}</span>${ajIcon.plus}</button>`).join('')}`;
  } else if (AJS.cat === 'sim') {
    lib = Object.keys(SIMNAME).map(k => `<button type="button" class="ajadd" data-addsim="${k}"><span>Simulasi ${SIMNAME[k]}</span>${ajIcon.plus}</button>`).join('');
  } else if (AJS.cat === 'lat') {
    lib = `<p class="ajhint">Pilih soalan tetap daripada bank 180 soalan. Soalan keluar ikut susunan anda.</p><button type="button" class="btn sec" data-newlat="1" style="min-height:48px">${ajIcon.plus} Pilih soalan</button>`;
  } else if (AJS.cat === 'game') {
    lib = Object.keys(GMODES).map(g => `<button type="button" class="ajadd tpl" data-addgame="${g}"><span><b>${GMODES[g][0]}</b><small>${GMODES[g][1][0] + GMODES[g][1].slice(1).toLowerCase()}</small></span>${ajIcon.plus}</button>`).join('');
  } else if (ajBB()) lib = bbLibHTML();
  else {
    lib = Object.keys(TPL).filter(k => k !== 'bebas').map(k => `<button type="button" class="ajadd tpl" data-newcikgu="${k}"><span><b>${TPL[k][0]}</b><small>${TPL[k][1]}</small></span>${ajIcon.plus}</button>`).join('');
  }
  const rows = pl.items.map((it, i) => `<div class="ajrow${i === AJS.sel ? ' on' : ''}" draggable="true" data-row="${i}" style="--c:var(--${AJT[it.t][1]})">
      <span class="dg" aria-hidden="true">${ajIcon.drag}</span><span class="n">${i + 1}</span>${typeChip(it.t)}
      <button type="button" class="nm" data-pick="${i}">${esc(itemName(it))}</button>
      <span class="ajbtns"><button type="button" class="mini" data-mv="${i},-1" aria-label="Naikkan item ${i + 1}"${i ? '' : ' disabled'}>↑</button>
      <button type="button" class="mini" data-mv="${i},1" aria-label="Turunkan item ${i + 1}"${i < pl.items.length - 1 ? '' : ' disabled'}>↓</button>
      <button type="button" class="mini del" data-del="${i}" aria-label="Buang item ${i + 1}">×</button></span></div>`).join('');
  return `<div class="ajwrap">
    <div class="ajtop">
      <label class="ajplan"><span>PELAN</span><select id="ajPlanSel" aria-label="Pilih pelan">${opts}</select></label>
      <div class="ajtools">
        <button type="button" class="btn sec" id="ajNew">${ajIcon.plus}<span>Pelan baharu</span></button>
        <button type="button" class="ib" id="ajRen" aria-label="Namakan semula pelan">${ajIcon.edit}</button>
        <button type="button" class="ib" id="ajDelPlan" aria-label="Padam pelan ini">${ajIcon.trash}</button>
        <button type="button" class="btn sec" id="ajShare"${pl.items.length ? '' : ' disabled'}>${ajIcon.share}<span>Kongsi link</span></button>
        ${BAB.rph !== false ? `<button type="button" class="btn sec" id="ajRph"${pl.items.length ? '' : ' disabled'}>${ajIcon.doc}<span>Jana RPH</span></button>` : ''}
      </div>
      <button type="button" class="btn pri big ajgo" id="ajGo"${pl.items.length ? '' : ' disabled'}>${IC.play} Mula Mengajar</button>
    </div>
    <div class="ajgrid">
      <section class="ajcol" aria-label="Bahan"><h2 class="ajh">BAHAN</h2><div class="ajcats">${catBtns}</div><div class="ajlib">${lib}</div></section>
      <section class="ajcol" aria-label="Pelan pengajaran"><div class="ajh2"><h2 class="ajh">PELAN PENGAJARAN · ${pl.items.length} ITEM</h2><span>Seret ${ajIcon.drag} untuk susun</span></div>
        <div class="ajrows" id="ajRows">${rows || '<p class="ajhint" style="margin:20px 0">Pelan kosong. Tambah bahan dari senarai di sebelah kiri.</p>'}</div></section>
      <aside class="ajcol" aria-label="Pratonton">${viewPratonton(pl)}</aside>
    </div></div>${AJS.modal ? viewModal() : ''}`;
}
function viewPratonton(pl) {
  const it = pl.items[AJS.sel];
  if (!it) return '<h2 class="ajh">PRATONTON</h2><p class="ajhint">Pilih satu item dalam pelan untuk lihat pratonton.</p>';
  let body = '';
  if (it.t === 'slaid' || it.t === 'cikgu') body = `<div class="ajpv" style="--c:${subColVar(it)}"><div class="ajpv-in"><div class="stage">${itemSlideHTML(it, true)}</div></div></div>`;
  else if (it.t === 'sim') body = `<div class="ajinfo"><b>Simulasi ${SIMNAME[it.k]}</b><span>Simulasi ${APPNAME} dipaparkan skrin penuh. Guna tetikus untuk gerakkan objek, kemudian tekan ▶ untuk item seterusnya.</span></div>`;
  else if (it.t === 'game') body = `<div class="ajinfo"><b>${GMODES[it.g || '60'][0]}</b><span>${GMODES[it.g || '60'][2]}</span></div>`;
  else if (it.t === 'lat') {
    const B = bankById();
    body = `<div class="ajinfo"><b>${esc(itemName(it))}</b><span>${it.work ? 'Jawapan dan jalan kerja' : 'Jawapan sahaja'} ditunjuk apabila tekan ▶.</span>
      <ol class="ajql">${it.ids.map(id => B[id] ? `<li><b style="color:var(--${LVLN[B[id].lvl][1]})">${id}</b> ${esc(strip(B[id].q).slice(0, 70))}${strip(B[id].q).length > 70 ? '…' : ''}</li>` : '').join('')}</ol></div>`;
  }
  const edit = it.t === 'lat' ? `<button type="button" class="btn sec" id="ajEdit" style="min-height:46px;--c:var(--am)">${ajIcon.edit} Ubah soalan</button>`
    : it.t === 'cikgu' ? `<button type="button" class="btn sec" id="ajEdit" style="min-height:46px">${ajIcon.edit} Ubah slaid</button>` : '';
  return `<h2 class="ajh">ITEM ${AJS.sel + 1} · ${AJT[it.t][0]}</h2>${body}${edit}
    <button type="button" class="btn sec" id="ajFrom" style="min-height:46px">${IC.play} Tayang dari sini</button>
    <p class="ajhint" style="margin-top:auto">Pelan disimpan dalam pelayar komputer ini. Guna <b>Kongsi link</b> untuk beri pelan kepada guru lain.</p>`;
}

/* ---------- modal: latihan & slaid baharu ---------- */
function viewModal() {
  const M = AJS.modal;
  if (M.type === 'share') return viewShareModal(M);
  if (M.type === 'rph') return viewRphModal(M);
  if (M.type === 'bebas') return bbModalHTML(M);
  if (M.type === 'lat') {
    const bank = wsBank(), B = bankById();
    const list = bank.filter(q => q.sub === M.sub && (M.lvl === 'all' || q.lvl === M.lvl));
    const subs = SUBS.map(s => { const c = M.ids.filter(id => id.startsWith(s.no + '-')).length; return `<button type="button" class="opt" data-msub="${s.no}" aria-pressed="${M.sub === s.no}" style="--c:${subCol(s.no)}">${s.no}${c ? ` <span class="wcnt">${c}</span>` : ''}</button>`; }).join('');
    const lv = [['all', 'Semua'], ['m', 'Mudah'], ['s', 'Sederhana'], ['k', 'Sukar']].map(([k, t]) => `<button type="button" class="opt" data-mlvl="${k}" aria-pressed="${M.lvl === k}" style="--c:var(--tr)">${t}</button>`).join('');
    const cards = list.map(q => { const on = M.ids.includes(q.id), [ln, lc] = LVLN[q.lvl]; return `<label class="wq${on ? ' on' : ''}" style="--tr:var(--am)"><input type="checkbox" data-mq="${q.id}"${on ? ' checked' : ''}>
      <span class="wqb"><span class="wqh"><b>${q.id}</b><span class="chip" style="height:26px;font-size:12px;background:color-mix(in srgb,var(--${lc}) 15%,transparent);color:var(--${lc})">${ln}</span></span><span class="wqt">${q.q}</span></span>${q.fig ? `<span class="wqf">${q.fig}</span>` : ''}</label>`; }).join('');
    const sel = M.ids.map((id, i) => `<li><span class="n">${i + 1}</span><span class="t">${id} · ${B[id] ? LVLN[B[id].lvl][0] : ''}</span>
      <button type="button" class="mini" data-mup="${i}" aria-label="Naikkan soalan ${i + 1}"${i ? '' : ' disabled'}>↑</button><button type="button" class="mini" data-mrm="${i}" aria-label="Buang soalan ${i + 1}">×</button></li>`).join('');
    return `<div class="ajm-bg"><section class="ajm" role="dialog" aria-modal="true" aria-label="Pilih soalan latihan">
      <div class="ajm-h">${typeChip('lat')}<h2>Pilih soalan untuk pelan</h2><button type="button" class="ib" id="ajmX" aria-label="Tutup">${IC.x}</button></div>
      <div class="ajm-b lat">
        <div class="ajm-l"><div class="opts ajmsubs">${subs}</div><div class="opts ajmlv">${lv}</div><div class="wqs">${cards}</div></div>
        <aside class="pbox ajm-r"><h3>DIPILIH: ${M.ids.length} SOALAN</h3><ol class="wsel">${sel || '<li class="ajhint">Tandakan soalan di sebelah kiri.</li>'}</ol>
          <label class="ajchk"><input type="checkbox" id="ajmWork"${M.work ? ' checked' : ''}>Tunjuk jalan kerja bersama jawapan</label>
          <button type="button" class="btn pri" id="ajmOk" style="--tr:var(--am)"${M.ids.length ? '' : ' disabled'}>${M.edit != null ? 'Simpan perubahan' : 'Tambah ke pelan'}</button></aside>
      </div></section></div>`;
  }
  // slaid cikgu
  const it = M.it, tp = Object.keys(TPL).map(k => `<button type="button" class="ajtpl${it.tpl === k ? ' on' : ''}" data-tpl="${k}" aria-pressed="${it.tpl === k}"><b>${TPL[k][0]}</b><small>${TPL[k][1]}</small></button>`).join('');
  const FK = { fTitle: 'title', fText: 'text', fQ: 'q', fAns: 'ans' };
  const fr = id => { const k = FK[id]; if (BAB.fmt === false || !k) return ''; const cf = (it.fmt && it.fmt[k]) || {};
    return `<div class="fmtrow" role="group" aria-label="Format ${k}">${FMT_C.map(([c, n]) => `<button type="button" class="fmc" data-fk="${k}" data-fc="${c}" aria-label="Warna ${n}" aria-pressed="${(cf.c || '') === c}" style="--dot:${c ? `var(--${c})` : 'var(--tx)'}"></button>`).join('')}<span class="fmsep"></span>${FMT_S.map(([z, n]) => `<button type="button" class="fms" data-fk="${k}" data-fs="${z}" aria-pressed="${(cf.s || '') === z}" title="${n}">${n === 'Sangat besar' ? 'XL' : n === 'Besar' ? 'L' : n === 'Kecil' ? 'S' : 'M'}</button>`).join('')}<span class="fmsep"></span><button type="button" class="fms fmb" data-fk="${k}" data-fb="1" aria-pressed="${!!cf.b}" aria-label="Tebal">B</button></div>`; };
  const f = (id, label, val, rows) => (rows ? `<label class="ajf"><span>${label}</span><textarea id="${id}" rows="${rows}">${esc(val || '')}</textarea></label>` : `<label class="ajf"><span>${label}</span><input type="text" id="${id}" value="${esc(val || '')}"></label>`) + fr(id);
  let fields = '';
  if (it.tpl === 'isi') fields = f('fKick', 'TAJUK KECIL (pilihan)', it.kick) + f('fTitle', 'TAJUK', it.title) + f('fText', 'ISI (satu baris = satu poin, keluar satu demi satu)', it.text, 6);
  if (it.tpl === 'soalan') fields = f('fKick', 'TAJUK KECIL', it.kick || 'SOALAN CEPAT') + f('fQ', 'SOALAN', it.q, 3) + f('fAns', 'JAWAPAN (keluar bila tekan ▶)', it.ans, 3);
  if (it.tpl === 'gambar') fields = f('fTitle', 'TAJUK', it.title)
    + `<label class="btn sec ajimg">${ajIcon.img}<span>${it.img ? 'Tukar gambar' : 'Muat naik gambar'}</span><input type="file" id="fImg" accept="image/*" hidden></label>`
    + (it.img ? `<label class="ajf"><span>SAIZ GAMBAR</span><input type="range" id="fSz" min="15" max="100" value="${it.w || 60}"></label><p class="ajhint" style="margin:0">Seret gambar dalam pratonton untuk ubah kedudukan.</p><button type="button" class="btn sec" id="fImgX" style="min-height:44px">Buang gambar</button>` : '');
  if (it.tpl === 'pautan') fields = f('fTitle', 'TAJUK', it.title) + f('fLink', 'PAUTAN (cth. https://youtu.be/…)', it.link) + f('fBtn', 'TEKS BUTANG (pilihan)', it.btn)
    + `<p class="ajhint" style="margin:0" id="fLinkMsg">${it.link && !ajUrl(it.link) ? 'Pautan mesti bermula dengan https://' : ajYt(it.link) ? 'Video YouTube akan dimainkan dalam slaid (perlu internet).' : 'Laman web dibuka dalam tab baharu.'}</p>`;
  if (it.tpl === 'papan') fields = f('fTitle', 'TAJUK (pilihan)', it.title) + `<div class="ajf"><span>LATAR</span><div class="opts" style="grid-template-columns:repeat(3,minmax(0,1fr))">${[['kosong', 'Kosong'], ['grid', 'Grid'], ['cartes', 'Satah Cartes']].map(([k, t]) => `<button type="button" class="opt" data-bg="${k}" aria-pressed="${(it.bg || 'grid') === k}" style="--c:var(--pu)">${t}</button>`).join('')}</div></div>`;
  if (BAB.fmt !== false) fields += `<div class="ajf"><span>LATAR SLAID</span><div class="fmtrow">${FMT_L.map(([l, n, v]) => `<button type="button" class="fml" data-fl="${l}" aria-pressed="${(it.lat || '') === l}" aria-label="Latar ${n}" title="${n}" style="--sw:${v ? `var(--lat-${l})` : 'var(--bg)'}"></button>`).join('')}</div></div>`;
  return `<div class="ajm-bg"><section class="ajm" role="dialog" aria-modal="true" aria-label="Slaid baharu">
    <div class="ajm-h">${typeChip('cikgu')}<h2>${M.edit != null ? 'Ubah slaid' : 'Slaid baharu'}</h2><button type="button" class="ib" id="ajmX" aria-label="Tutup">${IC.x}</button></div>
    <div class="ajtpls" role="group" aria-label="Templat">${tp}</div>
    <div class="ajm-b cikgu">
      <div class="ajform">${fields}<button type="button" class="btn pri" id="ajmOk" style="--tr:var(--pu);margin-top:auto">${M.edit != null ? 'Simpan perubahan' : 'Tambah ke pelan'}</button></div>
      <div class="ajform"><span class="ajh">PRATONTON</span><div class="ajpv" id="ajmPv" style="--c:var(--pu)"><div class="ajpv-in"><div class="stage">${cikguHTML(it, true)}</div></div></div></div>
    </div></section></div>`;
}

/* ---------- tindakan susun ---------- */
function ajAdd(item) {
  const pl = ajPlan(), at = pl.items.length ? AJS.sel + 1 : 0;
  pl.items.splice(at, 0, item); AJS.sel = at; ajSave(); render(true);
  toast('Ditambah ke pelan');
}
function fitPreviews() {
  document.querySelectorAll('.ajpv').forEach(b => {
    const k = b.clientWidth / 1024, inn = b.firstElementChild;
    if (inn) inn.style.transform = `scale(${k})`;
  });
}
function readImage(file, cb) {
  const fr = new FileReader();
  fr.onload = () => {
    const im = new Image();
    im.onload = () => {
      const mx = 1400, k = Math.min(1, mx / Math.max(im.width, im.height));
      const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      cb(c.toDataURL('image/jpeg', 0.82));
    };
    im.onerror = () => toast('Gambar tidak dapat dibaca');
    im.src = fr.result;
  };
  fr.readAsDataURL(file);
}
function validItem(it) {
  if (!it || !AJT[it.t]) return false;
  if (it.t === 'slaid') return !!slideOf(it);
  if (it.t === 'sim') return !!SIMNAME[it.k];
  if (it.t === 'lat') return Array.isArray(it.ids);
  if (it.t === 'cikgu') return !!TPL[it.tpl] && (it.tpl !== 'pautan' || !!ajUrl(it.link));
  if (it.t === 'game') return !it.g || !!GMODES[it.g];
  return true;
}
function bindSusun() {
  const d = ajData(), pl = ajPlan(), main = document.getElementById('main');
  fitPreviews();
  document.getElementById('ajPlanSel').onchange = e => { d.cur = e.target.value; AJS.sel = 0; ajSave(); render(true); };
  document.getElementById('ajNew').onclick = () => {
    const name = prompt('Nama pelan baharu:', 'Pelan ' + (d.plans.length + 1));
    if (!name) return;
    const p = { id: 'p' + Date.now(), name: name.trim().slice(0, 60) || 'Pelan baharu', items: [] };
    d.plans.push(p); d.cur = p.id; AJS.sel = 0; ajSave(); render(true);
  };
  document.getElementById('ajRen').onclick = () => { const n = prompt('Nama pelan:', pl.name); if (n && n.trim()) { pl.name = n.trim().slice(0, 60); ajSave(); render(true); } };
  document.getElementById('ajDelPlan').onclick = () => {
    if (!confirm(`Padam pelan "${pl.name}"? Tindakan ini tidak boleh dibatalkan.`)) return;
    d.plans = d.plans.filter(p => p.id !== pl.id);
    if (!d.plans.length) d.plans.push({ id: 'p' + Date.now(), name: 'Pelan baharu', items: [] });
    d.cur = d.plans[0].id; AJS.sel = 0; ajSave(); render(true);
  };
  document.getElementById('ajShare').onclick = () => ajShareOpen(pl);
  const rb = document.getElementById('ajRph'); if (rb) rb.onclick = () => { AJS.modal = { type: 'rph', pl }; render(true); };
  document.getElementById('ajGo').onclick = () => ajStart(0);
  const from = document.getElementById('ajFrom'); if (from) from.onclick = () => ajStart(AJS.sel);
  const ed = document.getElementById('ajEdit');
  if (ed) ed.onclick = () => {
    const it = pl.items[AJS.sel];
    if (it.t === 'lat') AJS.modal = { type: 'lat', ids: it.ids.slice(), work: it.work !== false, sub: (it.ids[0] || SUBS[0].no).split('-')[0], lvl: 'all', edit: AJS.sel };
    else if (ajBB()) bbOpen(it, AJS.sel);
    else AJS.modal = { type: 'cikgu', it: JSON.parse(JSON.stringify(it)), edit: AJS.sel };
    render(true);
  };
  main.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { AJS.cat = b.dataset.cat; render(true); });
  main.querySelectorAll('[data-asub]').forEach(b => b.onclick = () => { AJS.sub = b.dataset.asub; render(true); });
  main.querySelectorAll('[data-addslide]').forEach(b => b.onclick = () => ajAdd({ t: 'slaid', sub: AJS.sub, n: +b.dataset.addslide }));
  main.querySelectorAll('[data-addall]').forEach(b => b.onclick = () => {
    const add = SLIDES.filter(s => s.sub === AJS.sub).map(s => ({ t: 'slaid', sub: s.sub, n: s.n }));
    const at = pl.items.length ? AJS.sel + 1 : 0; pl.items.splice(at, 0, ...add); AJS.sel = at + add.length - 1; ajSave(); render(true); toast(`${add.length} slaid ditambah`);
  });
  main.querySelectorAll('[data-addsim]').forEach(b => b.onclick = () => ajAdd({ t: 'sim', k: b.dataset.addsim }));
  main.querySelectorAll('[data-addgame]').forEach(b => b.onclick = () => ajAdd(b.dataset.addgame === '60' ? { t: 'game' } : { t: 'game', g: b.dataset.addgame }));
  main.querySelectorAll('[data-newlat]').forEach(b => b.onclick = () => { AJS.modal = { type: 'lat', ids: [], work: true, sub: AJS.sub, lvl: 'all', edit: null }; render(true); });
  if (ajBB()) bbBindLib(pl);
  main.querySelectorAll('[data-newcikgu]').forEach(b => b.onclick = () => { AJS.modal = { type: 'cikgu', it: { t: 'cikgu', tpl: b.dataset.newcikgu, bg: 'grid' }, edit: null }; render(true); });
  main.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => { AJS.sel = +b.dataset.pick; render(true); });
  main.querySelectorAll('[data-mv]').forEach(b => b.onclick = () => {
    const [i, dlt] = b.dataset.mv.split(',').map(Number), j = i + dlt;
    if (j < 0 || j >= pl.items.length) return;
    [pl.items[i], pl.items[j]] = [pl.items[j], pl.items[i]]; AJS.sel = j; ajSave(); render(true);
  });
  main.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    const i = +b.dataset.del; pl.items.splice(i, 1); if (AJS.sel >= pl.items.length) AJS.sel = pl.items.length - 1; ajSave(); render(true);
  });
  // seret & lepas
  main.querySelectorAll('.ajrow').forEach(r => {
    r.addEventListener('dragstart', e => { AJS.drag = +r.dataset.row; r.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', r.dataset.row); } catch (x) {} });
    r.addEventListener('dragend', () => { r.classList.remove('dragging'); main.querySelectorAll('.ajrow').forEach(o => o.classList.remove('over')); });
    r.addEventListener('dragover', e => { if (AJS.drag < 0) return; e.preventDefault(); main.querySelectorAll('.ajrow').forEach(o => o.classList.toggle('over', o === r)); });
    r.addEventListener('drop', e => {
      e.preventDefault(); const from = AJS.drag, to = +r.dataset.row; AJS.drag = -1;
      if (from < 0 || from === to) return render(true);
      const [m] = pl.items.splice(from, 1); pl.items.splice(to, 0, m); AJS.sel = to; ajSave(); render(true);
    });
  });
  if (AJS.modal && AJS.modal.type === 'share') bindShareModal();
  else if (AJS.modal && AJS.modal.type === 'rph') bindRphModal();
  else if (AJS.modal && AJS.modal.type === 'bebas') bbBind(pl);
  else if (AJS.modal) bindModal(pl);
}
function bindModal(pl) {
  const M = AJS.modal, root = document.querySelector('.ajm');
  const close = () => { AJS.modal = null; render(true); };
  document.getElementById('ajmX').onclick = close;
  document.querySelector('.ajm-bg').addEventListener('click', e => { if (e.target.classList.contains('ajm-bg')) close(); });
  const keepScroll = fn => { const l = root.querySelector('.ajm-l'), s = l ? l.scrollTop : 0; fn(); const l2 = document.querySelector('.ajm-l'); if (l2) l2.scrollTop = s; };
  if (M.type === 'lat') {
    root.querySelectorAll('[data-msub]').forEach(b => b.onclick = () => { M.sub = b.dataset.msub; render(true); });
    root.querySelectorAll('[data-mlvl]').forEach(b => b.onclick = () => { M.lvl = b.dataset.mlvl; render(true); });
    root.querySelectorAll('[data-mq]').forEach(c => c.onchange = () => {
      const id = c.dataset.mq;
      if (c.checked) { if (!M.ids.includes(id)) M.ids.push(id); } else M.ids = M.ids.filter(x => x !== id);
      keepScroll(() => render(true));
    });
    root.querySelectorAll('[data-mup]').forEach(b => b.onclick = () => { const i = +b.dataset.mup; if (i > 0) { [M.ids[i - 1], M.ids[i]] = [M.ids[i], M.ids[i - 1]]; keepScroll(() => render(true)); } });
    root.querySelectorAll('[data-mrm]').forEach(b => b.onclick = () => { M.ids.splice(+b.dataset.mrm, 1); keepScroll(() => render(true)); });
    document.getElementById('ajmWork').onchange = e => { M.work = e.target.checked; };
    document.getElementById('ajmOk').onclick = () => {
      const item = { t: 'lat', ids: M.ids.slice(), work: M.work };
      AJS.modal = null;
      if (M.edit != null) { pl.items[M.edit] = item; ajSave(); render(true); toast('Latihan dikemas kini'); }
      else ajAdd(item);
    };
    return;
  }
  const it = M.it;
  const pv = () => { const b = document.getElementById('ajmPv'); b.firstElementChild.innerHTML = `<div class="stage">${cikguHTML(it, true)}</div>`; fitPreviews(); };
  const bindF = (id, key) => { const el = document.getElementById(id); if (el) el.oninput = () => { it[key] = el.value; pv(); }; };
  bindF('fKick', 'kick'); bindF('fTitle', 'title'); bindF('fBtn', 'btn');
  const fl = document.getElementById('fLink'); if (fl) fl.oninput = () => { it.link = fl.value.trim(); const m = document.getElementById('fLinkMsg'); if (m) m.textContent = it.link && !ajUrl(it.link) ? 'Pautan mesti bermula dengan https://' : ajYt(it.link) ? 'Video YouTube akan dimainkan dalam slaid (perlu internet).' : 'Laman web dibuka dalam tab baharu.'; pv(); }; bindF('fText', 'text'); bindF('fQ', 'q'); bindF('fAns', 'ans');
  if (it.tpl === 'soalan' && it.kick == null) it.kick = 'SOALAN CEPAT';
  root.querySelectorAll('[data-tpl]').forEach(b => b.onclick = () => { it.tpl = b.dataset.tpl; if (it.tpl === 'soalan' && !it.kick) it.kick = 'SOALAN CEPAT'; render(true); });
  root.querySelectorAll('[data-bg]').forEach(b => b.onclick = () => { it.bg = b.dataset.bg; render(true); });
  const fset = (k, key, v) => { it.fmt = it.fmt || {}; const o = it.fmt[k] = it.fmt[k] || {}; if (v === '' || v === false) delete o[key]; else o[key] = v; if (!Object.keys(o).length) delete it.fmt[k]; if (!Object.keys(it.fmt).length) delete it.fmt; };
  root.querySelectorAll('[data-fc]').forEach(b => b.onclick = () => { fset(b.dataset.fk, 'c', b.dataset.fc); render(true); });
  root.querySelectorAll('[data-fs]').forEach(b => b.onclick = () => { fset(b.dataset.fk, 's', b.dataset.fs); render(true); });
  root.querySelectorAll('[data-fb]').forEach(b => b.onclick = () => { const k = b.dataset.fk; fset(k, 'b', !((it.fmt && it.fmt[k] && it.fmt[k].b))); render(true); });
  root.querySelectorAll('[data-fl]').forEach(b => b.onclick = () => { if (b.dataset.fl) it.lat = b.dataset.fl; else delete it.lat; render(true); });
  const fi = document.getElementById('fImg'); if (fi) fi.onchange = e => { const f = e.target.files[0]; if (f) readImage(f, url => { it.img = url; render(true); }); };
  const fx = document.getElementById('fImgX'); if (fx) fx.onclick = () => { delete it.img; delete it.x; delete it.y; delete it.w; render(true); };
  const sz = document.getElementById('fSz'); if (sz) sz.oninput = () => { it.w = +sz.value; const im = document.querySelector('#ajmPv .cs-img'); if (im) im.style.width = it.w + '%'; };
  const pvBox = document.getElementById('ajmPv');
  if (pvBox && it.tpl === 'gambar') pvBox.addEventListener('pointerdown', e => {
    const im = e.target.closest('.cs-img'); if (!im) return;
    const box = im.parentElement.getBoundingClientRect(), r0 = im.getBoundingClientRect();
    const ox = e.clientX - (r0.left + r0.width / 2), oy = e.clientY - (r0.top + r0.height / 2);
    e.preventDefault(); pvBox.setPointerCapture(e.pointerId);
    const mv = ev => { const cl = v => Math.max(0, Math.min(100, Math.round(v * 10) / 10));
      it.x = cl((ev.clientX - ox - box.left) / box.width * 100); it.y = cl((ev.clientY - oy - box.top) / box.height * 100);
      im.style.left = it.x + '%'; im.style.top = it.y + '%'; };
    const up = () => { pvBox.removeEventListener('pointermove', mv); pvBox.removeEventListener('pointerup', up); pvBox.removeEventListener('pointercancel', up); };
    pvBox.addEventListener('pointermove', mv); pvBox.addEventListener('pointerup', up); pvBox.addEventListener('pointercancel', up);
  });
  document.getElementById('ajmOk').onclick = () => {
    const keep = { isi: ['kick', 'title', 'text'], soalan: ['kick', 'q', 'ans'], gambar: ['title', 'img', 'x', 'y', 'w'], papan: ['title', 'bg'], pautan: ['title', 'link', 'btn'] }[it.tpl].concat(['fmt', 'lat']);
    if (it.tpl === 'pautan' && !ajUrl(it.link)) { toast('Masukkan pautan yang bermula dengan https://'); return; }
    const item = { t: 'cikgu', tpl: it.tpl }; keep.forEach(k => { if (it[k] != null && it[k] !== '') item[k] = it[k]; });
    AJS.modal = null;
    if (M.edit != null) { pl.items[M.edit] = item; if (ajSave()) toast('Slaid dikemas kini'); render(true); }
    else ajAdd(item);
  };
}
window.addEventListener('resize', () => { if (/^#\/(ajar|k\/)/.test(location.hash)) { fitPreviews(); inkResize(); } });

/* =================== MOD TAYANG =================== */
const AJ = { i: 0, r: 0, qi: 0, show: false, ink: {}, tool: null, col: 'rd', back: false };
const ajCur = () => { const pl = ajPlan(); return pl && pl.items[AJ.i]; };
function ajStart(i) {
  AJ.i = i; AJ.r = 0; AJ.qi = 0; AJ.show = false; AJ.ink = {}; AJ.tool = null; AJ.back = false;
  if (document.fullscreenEnabled && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
  location.hash = ajShared() ? `#/k/${AJK.code}/tayang` : '#/ajar/tayang';
}
function ajExit() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  if (typeof G !== 'undefined') { clearInterval(G.timer); G.st = 'intro'; }
  if (ajShared()) { location.hash = `#/k/${AJK.code}`; return; }
  AJS.sel = AJ.i; location.hash = '#/ajar';
}
function ajGo(i, back) {
  const pl = ajPlan();
  if (i < 0) return;
  if (i >= pl.items.length) { toast('Tamat pelan pengajaran'); return; }
  AJ.i = i; AJ.back = !!back;
  const it = pl.items[i];
  AJ.r = back ? 999 : 0;
  AJ.qi = back && it.t === 'lat' ? Math.max(0, it.ids.length - 1) : 0;
  AJ.show = !!(back && it.t === 'lat');
  if (it.t === 'game' && typeof G !== 'undefined') { clearInterval(G.timer); G.st = 'intro'; }
  if (it.t === 'game' && it.g === 'kumpulan') { clearInterval(K.timer); K.st = 'setup'; }
  if (it.t === 'game' && it.g === 'siapa') Object.assign(S, { q: null, shown: false, right: 0, done: 0, end: false });
  render(false);
}
function ajSteps() { const st = document.getElementById('stage'); return st ? (typeof rvOrder === 'function' ? rvOrder : x => x)([...st.querySelectorAll('.rv')]) : []; }
function ajApplyReveal() {
  const els = ajSteps(); if (AJ.r > els.length) AJ.r = els.length;
  els.forEach((e, k) => e.classList.toggle('hid', k >= AJ.r));
  ajLabel();
}
function ajNext() {
  const it = ajCur(); if (!it) return;
  if (it.t === 'slaid' || it.t === 'cikgu') { const n = ajSteps().length; if (AJ.r < n) { AJ.r++; ajApplyReveal(); return; } }
  if (it.t === 'lat') {
    if (!AJ.show) { AJ.show = true; render(false); return; }
    if (AJ.qi < it.ids.length - 1) { AJ.qi++; AJ.show = false; render(false); return; }
  }
  ajGo(AJ.i + 1);
}
function ajPrev() {
  const it = ajCur(); if (!it) return;
  if (it.t === 'lat') {
    if (AJ.show) { AJ.show = false; render(false); return; }
    if (AJ.qi > 0) { AJ.qi--; AJ.show = true; render(false); return; }
  }
  ajGo(AJ.i - 1, true);
}
function viewLatItem(it) {
  const B = bankById(), ids = it.ids.filter(id => B[id]);
  if (!ids.length) return '<div class="wrap"><p class="lead">Tiada soalan dalam latihan ini.</p></div>';
  if (AJ.qi >= ids.length) AJ.qi = ids.length - 1;
  const q = B[ids[AJ.qi]], [lv, lc] = LVLN[q.lvl];
  const fig = AJ.show && q.figAns ? q.figAns : q.fig;
  const prog = ids.map((id, k) => `<i style="background:${k <= AJ.qi ? `var(--${LVLN[B[id].lvl][1]})` : 'var(--dim)'}${k === AJ.qi ? `;box-shadow:0 0 0 2px var(--bg),0 0 0 4px var(--${lc})` : ''}"></i>`).join('');
  return `<div class="qbody"><div class="ajqh"><span class="ajqn">Soalan ${AJ.qi + 1} <span>/ ${ids.length}</span></span><div class="qprog" aria-hidden="true">${prog}</div>
      <span class="chip" style="background:color-mix(in srgb,var(--${lc}) 15%,transparent);color:var(--${lc})">${lv.toUpperCase()}</span><span class="chip" style="background:color-mix(in srgb,${subCol(q.sub)} 15%,transparent);color:${subCol(q.sub)}">${q.sub} ${SHORT[q.sub]}</span></div>
    <div class="qwrap${fig ? '' : ' nofig'}">
      <div style="display:flex;flex-direction:column;gap:18px">
        <h1 class="qtext">${q.q}</h1>
        ${AJ.show ? `<div class="ansbox"><span class="ok">${IC.check}</span><div><small>JAWAPAN</small><b>${q.ans}</b></div></div>
        ${it.work !== false && q.work && q.work.length ? `<div class="work"><h3>JALAN KERJA</h3><ol>${q.work.map(w => `<li>${w}</li>`).join('')}</ol></div>` : ''}` : ''}
      </div>
      ${fig ? `<div class="qfig">${fig}</div>` : ''}
    </div></div>`;
}
function viewTayang() {
  if (ajBB()) bbEnsureImgs();
  const pl = ajPlan(), it = ajCur();
  if (!it) { location.replace(ajShared() ? `#/k/${AJK.code}` : '#/ajar'); return ''; }
  let content = '';
  if (it.t === 'slaid' || it.t === 'cikgu') content = `<div class="stage" id="stage" style="--c:${subColVar(it)}">${itemSlideHTML(it)}</div>`;
  else if (it.t === 'sim') content = `<div class="tero"><iframe class="simframe" src="simulasi/${it.k}.html" title="Simulasi ${SIMNAME[it.k]}"></iframe></div>`;
  else if (it.t === 'lat') content = viewLatItem(it);
  else if (it.t === 'game') { let g = viewGameMode(it.g || '60'); g = g.replace(/<a [^>]*href="#\/games[^"]*"[^>]*>[\s\S]*?<\/a>/g, ''); if (ajShared()) g = g.replace(/<a [^>]*href="#\/[^"]*"[^>]*>[^<]*<\/a>/g, ''); content = `<div class="main" id="main">${g}</div>`; }
  const dots = pl.items.map((x, k) => `<button type="button" class="ajdot${k === AJ.i ? ' on' : ''}" data-jump="${k}" style="--c:var(--${AJT[x.t][1]});opacity:${k <= AJ.i ? 1 : .4}" aria-label="Item ${k + 1}: ${esc(itemName(x))}"></button>`).join('');
  const cols = [['rd', 'Merah'], ['am', 'Kuning'], ['tx', isLight() ? 'Hitam' : 'Putih']];
  const tools = `<div class="ajpen" role="toolbar" aria-label="Pen conteng">
      <button type="button" class="ajpb" data-tool="pen" aria-pressed="${AJ.tool === 'pen'}" aria-label="Pen">${ajIcon.pen}</button>
      <button type="button" class="ajpb" data-tool="hl" aria-pressed="${AJ.tool === 'hl'}" aria-label="Penyerlah">${ajIcon.hl}</button>
      ${cols.map(([c, n]) => `<button type="button" class="ajcol-b" data-col="${c}" aria-pressed="${AJ.col === c}" aria-label="Warna ${n}" style="background:var(--${c})"></button>`).join('')}
      <button type="button" class="ajpb" data-tool="er" aria-pressed="${AJ.tool === 'er'}" aria-label="Pemadam">${ajIcon.eraser}</button>
      <button type="button" class="ajpb" id="ajClr" aria-label="Padam semua conteng">${ajIcon.trash}</button>
    </div>`;
  const list = `<div class="ajlist" id="ajList" hidden><h3>PELAN · ${esc(pl.name)}</h3>${pl.items.map((x, k) => `<button type="button" class="ajli${k === AJ.i ? ' on' : ''}" data-jump="${k}"><span class="n">${k + 1}</span>${typeChip(x.t)}<span>${esc(itemName(x))}</span></button>`).join('')}</div>`;
  return `<div class="app ajp">
    <div class="ajp-main" id="ajpMain">${content}<canvas id="ink" class="ink${AJ.tool ? ' on' : ''}" aria-hidden="true"></canvas>${tools}</div>
    ${list}
    <nav class="ajbar" aria-label="Kawalan tayangan">
      <button type="button" class="btn sec ajx" id="ajExit">${IC.x}<span>Keluar</span></button>
      <button type="button" class="ib ajnav" id="ajPrev" aria-label="Sebelumnya">${IC.left}</button>
      <div class="ajdots">${dots}</div>
      <div class="ajlbl"><b id="ajL1"></b><span id="ajL2"></span></div>
      <button type="button" class="btn sec ajlb" id="ajListB" aria-expanded="false">${ajIcon.list}<span>Senarai</span></button>
      <button type="button" class="btn pri ajnext" id="ajNext" aria-label="Seterusnya">${IC.right}</button>
    </nav></div>`;
}
function ajLabel() {
  const pl = ajPlan(), it = ajCur(); if (!it) return;
  const l1 = document.getElementById('ajL1'), l2 = document.getElementById('ajL2'); if (!l1) return;
  l1.textContent = `${AJ.i + 1} / ${pl.items.length} · ${it.t === 'slaid' ? 'Slaid ' : ''}${itemName(it)}`;
  const nx = pl.items[AJ.i + 1];
  let st = '';
  if (it.t === 'slaid' || it.t === 'cikgu') { const n = ajSteps().length; if (n) st = AJ.r < n ? `Langkah ${AJ.r} daripada ${n}` : 'Semua langkah dipaparkan'; }
  if (it.t === 'lat') st = `Soalan ${AJ.qi + 1} daripada ${it.ids.length}${AJ.show ? ' · jawapan ditunjuk' : ''}`;
  l2.textContent = [st, nx ? 'Seterusnya: ' + itemName(nx) : 'Item terakhir'].filter(Boolean).join(' · ');
}
function bindTayang() {
  const it = ajCur(); if (!it) return;
  ajApplyReveal();
  document.getElementById('ajExit').onclick = ajExit;
  document.getElementById('ajNext').onclick = ajNext;
  document.getElementById('ajPrev').onclick = ajPrev;
  const lst = document.getElementById('ajList'), lb = document.getElementById('ajListB');
  lb.onclick = () => { lst.hidden = !lst.hidden; lb.setAttribute('aria-expanded', String(!lst.hidden)); };
  document.querySelectorAll('[data-jump]').forEach(b => b.onclick = () => ajGo(+b.dataset.jump));
  document.querySelectorAll('[data-tool]').forEach(b => b.onclick = () => { AJ.tool = AJ.tool === b.dataset.tool ? null : b.dataset.tool; inkTools(); });
  document.querySelectorAll('[data-col]').forEach(b => b.onclick = () => { AJ.col = b.dataset.col; if (!AJ.tool || AJ.tool === 'er') AJ.tool = 'pen'; inkTools(); });
  document.getElementById('ajClr').onclick = () => { AJ.ink[AJ.i] = []; inkDraw(); };
  if (it.t === 'game') bindGameMode(it.g || '60');
  const st = document.getElementById('stage');
  if (st) {
    let x0 = null, y0 = 0;
    st.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    st.addEventListener('touchend', e => { if (x0 == null || AJ.tool) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null; if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0) ajNext(); else ajPrev(); } }, { passive: true });
  }
  inkBind();
}
document.addEventListener('keydown', e => {
  if (!ajIsPlay()) return;
  if (e.target.closest && e.target.closest('input,textarea,select')) return;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('a,button,label')) return;
    e.preventDefault(); ajNext();
  } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); ajPrev(); }
});

/* ---------- pen conteng ---------- */
const INK = { draw: null };
function inkTools() {
  const c = document.getElementById('ink'); if (c) c.classList.toggle('on', !!AJ.tool);
  document.querySelectorAll('[data-tool]').forEach(b => b.setAttribute('aria-pressed', String(AJ.tool === b.dataset.tool)));
  document.querySelectorAll('[data-col]').forEach(b => b.setAttribute('aria-pressed', String(AJ.col === b.dataset.col)));
}
function inkResize() {
  const c = document.getElementById('ink'); if (!c) return;
  const r = c.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  c.width = Math.max(1, Math.round(r.width * dpr)); c.height = Math.max(1, Math.round(r.height * dpr));
  inkDraw();
}
function inkDraw() {
  const c = document.getElementById('ink'); if (!c) return;
  const g = c.getContext('2d'), W = c.width, H = c.height, cs = getComputedStyle(document.documentElement);
  g.clearRect(0, 0, W, H);
  (AJ.ink[AJ.i] || []).forEach(s => {
    if (s.pts.length < 1) return;
    g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
    g.strokeStyle = cs.getPropertyValue('--' + s.col).trim() || '#F87171';
    g.globalAlpha = s.tool === 'hl' ? 0.35 : 1;
    g.lineWidth = (s.tool === 'hl' ? 0.024 : 0.0045) * Math.min(W, H) + (s.tool === 'hl' ? 0 : 1.5);
    g.beginPath();
    const p = s.pts.map(([x, y]) => [x * W, y * H]);
    g.moveTo(p[0][0], p[0][1]);
    if (p.length === 1) g.lineTo(p[0][0] + 0.1, p[0][1]);
    for (let k = 1; k < p.length - 1; k++) { const mx = (p[k][0] + p[k + 1][0]) / 2, my = (p[k][1] + p[k + 1][1]) / 2; g.quadraticCurveTo(p[k][0], p[k][1], mx, my); }
    if (p.length > 1) g.lineTo(p[p.length - 1][0], p[p.length - 1][1]);
    g.stroke(); g.restore();
  });
}
function inkBind() {
  const c = document.getElementById('ink'); if (!c) return;
  inkResize();
  const pos = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  const erase = p => {
    const r = c.getBoundingClientRect(), rad = 18;
    const list = AJ.ink[AJ.i] || [];
    AJ.ink[AJ.i] = list.filter(s => !s.pts.some(([x, y]) => Math.hypot((x - p[0]) * r.width, (y - p[1]) * r.height) < rad));
    if (AJ.ink[AJ.i].length !== list.length) inkDraw();
  };
  c.addEventListener('pointerdown', e => {
    if (!AJ.tool) return;
    e.preventDefault(); c.setPointerCapture(e.pointerId);
    const p = pos(e);
    if (AJ.tool === 'er') { INK.draw = 'er'; erase(p); return; }
    const s = { tool: AJ.tool, col: AJ.col, pts: [p] };
    (AJ.ink[AJ.i] = AJ.ink[AJ.i] || []).push(s); INK.draw = s; inkDraw();
  });
  c.addEventListener('pointermove', e => {
    if (!INK.draw) return;
    const p = pos(e);
    if (INK.draw === 'er') return erase(p);
    INK.draw.pts.push(p); inkDraw();
  });
  const end = () => { INK.draw = null; };
  c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
}

/* =================== KONGSI LINK =================== */
// Pelan dibungkus terus ke dalam link (#/k/<kod>): tiada pangkalan data.
// Gambar tidak disertakan supaya link tidak terlalu panjang.
const AJK = { code: '', plan: null, err: false, busy: false };
const b64u = bytes => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const unb64u = str => { str = str.replace(/-/g, '+').replace(/_/g, '/'); while (str.length % 4) str += '='; const bin = atob(str), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
async function packPlan(pl) {
  const str = JSON.stringify({ v: 1, n: pl.name, i: pl.items.map(it => { let c = Object.assign({}, it); delete c.img; if (ajBB()) c = bbShare(c); return c; }).filter(Boolean) });
  if (!window.CompressionStream) return '0' + b64u(new TextEncoder().encode(str));
  const st = new Blob([str]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  return '1' + b64u(new Uint8Array(await new Response(st).arrayBuffer()));
}
async function unpackPlan(code) {
  const t = code[0], u = unb64u(code.slice(1));
  let str;
  if (t === '0') str = new TextDecoder().decode(u);
  else if (t === '1') str = await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).text();
  else throw new Error('kod');
  const j = JSON.parse(str);
  if (!j || !Array.isArray(j.i)) throw new Error('pelan');
  return { id: 'kongsi', name: String(j.n || 'Pelan dikongsi').slice(0, 60), items: j.i.filter(validItem) };
}
async function ajShareOpen(pl) {
  try {
    const code = await packPlan(pl);
    const link = location.origin + location.pathname + '#/k/' + code;
    AJS.modal = { type: 'share', link, name: pl.name, img: pl.items.some(it => ajBB() ? bbHasImg(it) : it.img) };
  } catch (e) { toast('Link tidak dapat dicipta'); return; }
  render(true);
}
function viewShareModal(M) {
  return `<div class="ajm-bg"><section class="ajm ajshare" role="dialog" aria-modal="true" aria-label="Kongsi link pelan">
    <div class="ajm-h"><h2>Kongsi link</h2><button type="button" class="ib" id="ajmX" aria-label="Tutup">${IC.x}</button></div>
    <p class="ajhint" style="font-size:16px">Guru yang buka link ini akan nampak pelan <b style="color:var(--tx)">${esc(M.name)}</b> sahaja. Mereka hanya boleh tayang pelan ini. Mereka tidak dapat membuka bahagian lain ${APPNAME} atau mengubah pelan.</p>
    <label class="ajf"><span>LINK</span><textarea id="ajLink" rows="3" readonly>${esc(M.link)}</textarea></label>
    ${M.img ? `<p class="ajwarn">${ajBB() ? 'Pelan ini ada gambar atau slaid import. Gambar dan slaid import tidak disertakan dalam link. Penerima hanya nampak slaid yang lain.' : 'Gambar yang dimuat naik tidak disertakan dalam link. Slaid Gambar akan dipaparkan tanpa gambar.'}</p>` : ''}
    <p class="ajhint">Link ini menyimpan pelan seperti sekarang. Jika pelan diubah, cipta link baharu.</p>
    <div class="prow ajsharebtns"><button type="button" class="btn pri" id="ajCopy">${ajIcon.copy} Salin link</button>${navigator.share ? `<button type="button" class="btn sec" id="ajNative">${ajIcon.share} Kongsi…</button>` : ''}</div>
  </section></div>`;
}
function bindShareModal() {
  const M = AJS.modal, close = () => { AJS.modal = null; render(true); };
  document.getElementById('ajmX').onclick = close;
  document.querySelector('.ajm-bg').addEventListener('click', e => { if (e.target.classList.contains('ajm-bg')) close(); });
  const ta = document.getElementById('ajLink');
  ta.onfocus = () => ta.select();
  document.getElementById('ajCopy').onclick = () => {
    const done = () => toast('Link disalin');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(M.link).then(done, () => { ta.select(); document.execCommand('copy'); done(); });
    else { ta.select(); document.execCommand('copy'); done(); }
  };
  const nb = document.getElementById('ajNative');
  if (nb) nb.onclick = () => navigator.share({ title: 'Pelan ' + APPNAME + ': ' + M.name, text: 'Pelan mengajar ' + APPNAME + ': ' + M.name, url: M.link }).catch(() => {});
}
/* =================== JANA RPH (BAB.rph) =================== */
const rphLine = '<span class="rphb">&nbsp;</span>';
function rphAct(it, induksi) {
  const t = x => `<i>${esc(strip(x))}</i>`;
  if (it.t === 'sim') return `Murid meneroka Simulasi ${t(SIMNAME[it.k] || '')} dan menerangkan dapatan mereka.`;
  if (it.t === 'lat') {
    const bk = bankById(), qs = it.ids.map(id => bk[id]).filter(Boolean), c = l => qs.filter(q => q.lvl === l).length;
    const subs = [...new Set(it.ids.map(id => (BAB.gabung || {})[id.split('-')[0]] || id.split('-')[0]))].join(', ');
    const lv = [[c('m'), 'mudah'], [c('s'), 'sederhana'], [c('k'), 'sukar']].filter(x => x[0]).map(x => x.join(' ')).join(', ');
    return `Murid menjawab Latihan ${subs} (${it.ids.length} soalan${lv ? ': ' + lv : ''})${it.work ? ' dan menyemak jalan kerja' : ''}.`;
  }
  if (it.t === 'game') return `Murid bermain game ${t(GMODES[it.g || '60'][0])}.`;
  if (it.t === 'cikgu') {
    if (it.tpl === 'bebas') return ajBB() ? bbRph(it) : '';
    if (it.tpl === 'isi') return `Guru menerangkan ${t(it.title || 'isi pelajaran')}.`;
    if (it.tpl === 'soalan') return `Murid menjawab soalan cepat: ${t(it.q || '')}`;
    if (it.tpl === 'gambar') return `Murid memerhati gambar ${t(it.title || '')} dan berbincang.`;
    if (it.tpl === 'papan') return `Guru dan murid menyelesaikan contoh di papan${it.title ? ' ' + t(it.title) : ''}.`;
    if (it.tpl === 'pautan') return ajYt(it.link) ? `Murid menonton video ${t(it.title || 'YouTube')}.` : `Murid meneroka laman ${t(it.title || it.link)}.`;
  }
  return '';
}
function rphSteps(items, induksi) {
  const out = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.t === 'slaid') {
      const run = [it]; while (items[i + 1] && items[i + 1].t === 'slaid') run.push(items[++i]);
      const names = run.map(x => { const sl = slideOf(x); return `<i>${esc(sl ? strip(sl.title) : '')}</i>`; });
      const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' dan ' + names[names.length - 1] : names[0];
      out.push(induksi && run.length === 1 ? `Guru menayangkan slaid ${list} dan bersoal jawab dengan murid.` : `Guru menerangkan ${list} menggunakan slaid nota.`);
    } else { const a = rphAct(it, induksi); if (a) out.push(a); }
  }
  return out;
}
function rphHTML(pl) {
  const items = pl.items.filter(validItem);
  let a = 1; while (items[a] && items[a].t === 'cikgu') a++;
  const ind = items.slice(0, Math.min(a, items.length));
  let end = items.length > ind.length + 1 ? items.length - 1 : items.length;
  const dev = items.slice(ind.length, end), pen = items.slice(end);
  const G = BAB.gabung || {}, to = k => G[k] || k;
  const subs = [...new Set(items.flatMap(it => it.t === 'slaid' ? [to(it.sub)] : it.t === 'lat' ? it.ids.map(id => to(id.split('-')[0])) : []))].filter(n => SUBS.some(x => x.no === n)).sort((x, y) => parseFloat(x.split('.')[1]) - parseFloat(y.split('.')[1]));
  const subName = n => { const o = SUBS.find(x => x.no === n); return o ? o.name : ''; };
  const sk = subs.length ? subs.map(n => `${n} ${esc(subName(n))}`).join('<br>') : rphLine;
  const KEEP = /^(Cartes|Malaysia|Pascal|Fibonacci|Pythagoras|Euler|Venn|KWSP|SST|LHDN)$/;
  const lc = t => String(t || '').split(' ').map(w => /^[A-Z][a-zà-ÿ]+[,:;]?$/.test(w) && !KEEP.test(w.replace(/[,:;]$/, '')) ? w.charAt(0).toLowerCase() + w.slice(1) : w).join(' ');
  const descOf = n => { const ks = Object.keys(typeof SUBDESC === 'object' ? SUBDESC : {}).filter(k => to(k) === n); return ks.map(k => SUBDESC[k]).filter(Boolean).join('; '); };
  const obj = subs.length ? `Pada akhir PdP, murid dapat:<ol>${subs.map(n => { const d = descOf(n); return `<li>memahami ${esc(lc(subName(n)))}${d ? ': ' + esc(lc(d)) : ''};</li>`; }).join('')}</ol>` : `Pada akhir PdP, murid dapat: ${rphLine}`;
  const ol = arr => `<ol>${arr.map(x => `<li>${x}</li>`).join('')}</ol>`;
  const penS = rphSteps(pen, false).concat(['Guru merumus isi penting pelajaran.']);
  const akt = `<b>Set induksi</b>${ol(rphSteps(ind, true))}${dev.length ? `<b>Perkembangan</b>${ol(rphSteps(dev, false))}` : ''}<b>Penutup</b>${ol(penS)}`;
  const sims = [...new Set(items.filter(i => i.t === 'sim').map(i => 'Simulasi ' + SIMNAME[i.k]))];
  const parts = [items.some(i => i.t === 'slaid') ? 'slaid nota' : ''].concat(sims, items.some(i => i.t === 'lat') ? ['latihan'] : [], [...new Set(items.filter(i => i.t === 'game').map(i => GMODES[i.g || '60'][0]))]).filter(Boolean);
  const lk = items.flatMap(i => i.t !== 'cikgu' ? [] : i.tpl === 'pautan' ? [i.link] : i.tpl === 'bebas' ? (i.els || []).filter(e => e.k === 'l').map(e => e.url) : []).filter(u => ajUrl(u));
  const vid = lk.some(u => ajYt(u)), web = lk.some(u => !ajYt(u));
  const bbm = `TerokaMath${parts.length ? ' (' + esc(parts.join(', ')) + ')' : ''}${vid ? ', video YouTube' : ''}${web ? ', laman web' : ''}, LCD / telefon pintar`;
  const rows = [['Mata pelajaran', 'Matematik'], ['Tingkatan / Kelas', `Tingkatan ${BAB.ting} · ${rphLine}`], ['Tarikh / Masa', `${rphLine} · ${rphLine}`], ['Bilangan murid', rphLine],
    ['Bab / Tajuk', `Bab ${BAB.no} · ${esc(BAB.tajuk)}`], ['Standard Kandungan', sk], ['Objektif', obj], ['Aktiviti', akt], ['BBM', bbm],
    ['Refleksi', `${rphLine} / ${rphLine} murid mencapai objektif.<br>Catatan: ${rphLine}${rphLine}`]];
  return `<table class="rphtab"><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>`;
}
function viewRphModal(M) {
  const pl = M.pl, ed = !!M.ed, saved = typeof pl.rph === 'string' && pl.rph;
  const body = saved ? pl.rph : rphHTML(pl);
  return `<div class="ajm-bg"><section class="ajm ajrph" role="dialog" aria-modal="true" aria-label="Rancangan Pengajaran Harian">
    <div class="ajm-h"><span class="ajtype" style="--c:var(--pu)">RPH</span><h2>Rancangan Pengajaran Harian</h2>
      <button type="button" class="btn ${ed ? 'pri rphdone' : 'sec rphed'}" id="rphEdit">${ed ? IC.check || '✓' : ajIcon.edit}<span>${ed ? 'Siap' : 'Ubah'}</span></button>
      ${ed ? '' : `<button type="button" class="btn sec" id="rphCopy">${ajIcon.copy}<span>Salin</span></button>
      <button type="button" class="btn pri" id="rphPrint">${ajIcon.print}<span>Cetak / PDF</span></button>`}
      <button type="button" class="ib" id="ajmX" aria-label="Tutup">${IC.x}</button></div>
    <p class="rphnote">${ed ? 'Taip terus dalam kotak bergaris ungu. Tekan <b>Siap</b> untuk simpan.' : saved ? `RPH ini telah diubah oleh cikgu dan disimpan untuk pelan <b>${esc(pl.name)}</b>.` : `Dijana daripada pelan <b>${esc(pl.name)}</b> (${pl.items.length} item). Tekan <b>Ubah</b> untuk edit.`}</p>
    <div class="rphwrap"><div class="rphdoc${ed ? ' ed' : ''}" id="rphDoc">${body}</div>
      ${saved && !ed ? `<button type="button" class="rphreset" id="rphReset">Jana semula dari pelan</button>` : ''}</div></section></div>`;
}
function bindRphModal() {
  const M = AJS.modal, doc = document.getElementById('rphDoc');
  const save = () => { M.pl.rph = doc.innerHTML; ajSave(); };
  const close = () => { if (M.ed) save(); AJS.modal = null; render(true); };
  document.getElementById('ajmX').onclick = close;
  document.querySelector('.ajm-bg').addEventListener('click', e => { if (e.target.classList.contains('ajm-bg')) close(); });
  if (M.ed) {
    doc.querySelectorAll('td').forEach(td => { td.contentEditable = 'true'; td.spellcheck = false; });
    const first = doc.querySelector('td'); if (first) first.focus();
  }
  document.getElementById('rphEdit').onclick = () => {
    if (M.ed) { doc.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable')); save(); M.ed = false; render(true); toast('RPH disimpan'); }
    else { M.ed = true; render(true); }
  };
  const rs = document.getElementById('rphReset');
  if (rs) rs.onclick = () => { if (confirm('Buang semua perubahan dan jana semula RPH dari pelan ini?')) { delete M.pl.rph; ajSave(); render(true); toast('RPH dijana semula'); } };
  const cp = document.getElementById('rphCopy');
  if (cp) cp.onclick = () => {
    const html = `<table border="1" cellpadding="6" style="border-collapse:collapse">${doc.querySelector('table').innerHTML}</table>`;
    const text = [...doc.querySelectorAll('tr')].map(r => r.cells[0].innerText.trim() + ': ' + r.cells[1].innerText.replace(/ /g, '____').trim()).join('\n\n');
    const done = () => toast('RPH disalin. Tampal ke Word atau e-RPH.');
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([text], { type: 'text/plain' }) })]).then(done, () => { navigator.clipboard.writeText(text).then(done); });
    else { const r = document.createRange(); r.selectNodeContents(doc); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); document.execCommand('copy'); sel.removeAllRanges(); done(); }
  };
  const pr = document.getElementById('rphPrint');
  if (pr) pr.onclick = () => printDoc(`<div class="rphprint"><h1>Rancangan Pengajaran Harian</h1>${doc.innerHTML}</div>`, WS_PAGE);
}
function viewKongsi(code) {
  if (AJK.code !== code) {
    AJK.code = code; AJK.plan = null; AJK.err = false;
    unpackPlan(code).then(p => { AJK.plan = p; }).catch(() => { AJK.err = true; }).then(() => { if (location.hash.indexOf('#/k/' + code) === 0) render(false); });
  }
  const light = isLight();
  const head = `<header class="hdr"><span class="wm2"><b class="tm">Teroka<span>Math</span></b><small><b class="mv">Bab ${BAB.no}</b> : ${BAB.tajuk}</small></span><div class="end" style="margin-left:auto"><button type="button" class="ib" id="themeBtn" aria-label="${light ? 'Tukar ke mod gelap' : 'Tukar ke mod cerah'}">${light ? IC.moon : IC.sun}</button></div></header>`;
  let body;
  if (AJK.err) body = `<div class="kgcard"><p class="eyebrow">PELAN DIKONGSI</p><h1 class="h1">Link tidak sah</h1><p class="lead">Link ini rosak atau tidak lengkap. Minta guru yang berkongsi menghantar semula link.</p></div>`;
  else if (!AJK.plan) body = `<div class="kgcard"><p class="lead">Membuka pelan…</p></div>`;
  else {
    const pl = AJK.plan;
    body = `<div class="kgcard"><p class="eyebrow">PELAN DIKONGSI · BAB ${BAB.no} ${BAB.tajuk.toUpperCase()}</p><h1 class="h1">${esc(pl.name)}</h1><p class="lead">${pl.items.length} item. Tekan Tayang untuk mula mengajar dengan pelan ini.</p>
      <ol class="kglist">${pl.items.map((it, k) => `<li><span class="n">${k + 1}</span>${typeChip(it.t)}<span>${esc(itemName(it))}</span></li>`).join('')}</ol>
      <div class="kgbtns"><button type="button" class="btn pri big" id="kgPlay"${pl.items.length ? '' : ' disabled'}>${IC.play} Tayang</button></div></div>`;
  }
  return `<div class="app kgpage">${head}<main class="main" id="main"><div class="wrap kgwrap">${body}</div></main></div>`;
}
function bindKongsi() {
  const t = document.getElementById('themeBtn');
  if (t) t.onclick = () => { const l = !isLight(); document.documentElement.classList.toggle('light', l); LS.set('mathmotion-mode', l ? 'cerah' : 'gelap'); setMeta(); render(true); };
  const pl = AJK.plan; if (!pl) return;
  document.getElementById('kgPlay').onclick = () => ajStart(0);
}
IC.ajar = ajIcon.ajar;
