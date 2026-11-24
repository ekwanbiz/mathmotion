'use strict';
/* =================== GAMES: pilih game + 3 game kelas =================== */
// Pertandingan Kumpulan, Siapa Nak Jawab? dan Roda Nama. Dikawal cikgu pada satu skrin.
// Boleh dibuka dari tab GAMES (#/games/<mod>) atau sebagai item dalam Mula Mengajar.
// Bergantung pada app.js (gq, gTap, gSvg, playAnim, rotAnim, snd, burst ...).

const GMODES = {
  '60': ['Cabaran 60 Saat', 'MURID MAIN SENDIRI', 'Jawab seberapa banyak soalan dalam 60 saat. 3 nyawa, combo dan rekod terbaik.', 'tr', '60'],
  kumpulan: ['Pertandingan Kumpulan', 'KUMPULAN', '2 hingga 6 kumpulan berlawan. Cikgu beri markah kepada kumpulan yang betul. Ada papan markah dan podium.', 'pa', 'K'],
  siapa: ['Siapa Nak Jawab?', 'SELURUH KELAS', 'Soalan untuk seluruh kelas. Murid angkat tangan, cikgu pilih siapa jawab, kemudian tunjuk jawapan.', 'pu', '?'],
  roda: ['Roda Nama', 'PILIH RAWAK', 'Taip nama murid (atau apa-apa) ke dalam roda. Putar untuk pilih seorang secara rawak.', 'pk', '◎']
};
const gInTayang = mode => typeof ajIsPlay === 'function' && ajIsPlay() && ajCur() && ajCur().t === 'game' && (ajCur().g || '60') === mode;
const gActive = mode => location.hash.startsWith('#/games/' + mode) || gInTayang(mode);
const gBack = () => (typeof ajIsPlay === 'function' && ajIsPlay()) ? '' : `<a class="btn sec gback" href="#/games">${IC.left}<span>Pilih game</span></a>`;

function viewGamePilih() {
  return `<div class="wrap">
    <div><p class="eyebrow">GAMES</p><h1 class="h1">Pilih game</h1><p class="lead">Pilih cara bermain yang sesuai dengan kelas hari ini.</p></div>
    <div class="gpick">${Object.keys(GMODES).map(k => { const [n, tag, d, c, ic] = GMODES[k]; return `<a class="gpcard" href="#/games/${k}" style="--c:var(--${c})">
      <span class="ic">${ic}</span><span class="tag">${tag}</span><b>${n}</b><span class="d">${d}</span><span class="go">Pilih</span></a>`; }).join('')}</div></div>`;
}

function cqView(q, shown, bigOpts) {
  let fig = q.fig;
  if (shown && q.reveal) fig = fig.replace('</svg>', q.reveal + '</svg>');
  const opts = q.opts.map((t, i) => `<div class="kopt${shown ? (i === q.c ? ' right' : ' dim') : ''}"><span class="k">${'ABCD'[i]}</span><span>${t}</span></div>`).join('');
  return `<div class="kq${bigOpts ? ' big' : ''}"><div class="gfig">${fig}${q.legend ? '<p class="kleg"><b style="color:var(--tr)">Biru</b>: objek · <b style="color:var(--pa)">Oren</b>: imej</p>' : ''}</div>
    <div class="kqr"><h1 class="qtext">${q.q}</h1><div class="kopts">${opts}</div></div></div>`;
}
function cqAnim(q) { setTimeout(() => { if (q.rot) rotAnim(q.rot); else if (q.anim) playAnim(q.anim); }, 200); }

/* =================== PERTANDINGAN KUMPULAN =================== */
const KNAMES = [['Merah', 'rd'], ['Biru', 'tr'], ['Hijau', 'gr'], ['Kuning', 'am'], ['Ungu', 'pu'], ['Oren', 'pa']];
const K = { st: 'setup', n: 4, total: 10, time: 30, types: Object.keys(CQT), names: KNAMES.map(k => 'Kumpulan ' + k[0]), teams: [], qi: 0, q: null, shown: false, got: [], bonus: false, end: 0, timer: 0, lastBonus: -9 };
try { const s0 = store().kumpulan; if (s0) Object.assign(K, { n: s0.n || 4, total: s0.total || 10, time: s0.time == null ? 30 : s0.time, types: s0.types && s0.types.length ? s0.types : K.types, names: s0.names || K.names }); } catch (e) {}
const kSave = () => save({ kumpulan: { n: K.n, total: K.total, time: K.time, types: K.types, names: K.names } });
function kNewQ() {
  K.q = cq(K.qi < K.total * .35 ? 0 : K.qi < K.total * .7 ? 1 : 2, K.types);
  K.shown = false; K.got = [];
  K.bonus = K.qi >= 2 && K.qi - K.lastBonus > 2 && Math.random() < .22; if (K.bonus) K.lastBonus = K.qi;
  clearInterval(K.timer);
  if (K.time) { K.end = Date.now() + K.time * 1000; K.timer = setInterval(kTick, 200); }
}
function kTick() {
  if (!gActive('kumpulan') || K.st !== 'play') { clearInterval(K.timer); return; }
  if (K.shown) { clearInterval(K.timer); return; }
  const left = K.end - Date.now(), f = document.getElementById('kfill'), s = document.getElementById('ksec');
  if (left <= 0) { kReveal(); return; }
  if (f) { f.style.width = (left / (K.time * 10)) + '%'; f.style.background = left <= 5000 ? 'var(--rd)' : 'var(--gr)'; }
  if (s) s.textContent = Math.ceil(left / 1000) + 's';
}
function kReveal() { if (K.shown) return; K.shown = true; clearInterval(K.timer); snd('end'); render(true); cqAnim(K.q); }
const kPts = () => K.bonus ? 20 : 10;
function viewKumpulan() {
  if (K.st === 'setup') {
    const opt = (key, v, t, c = 'pa') => `<button type="button" class="opt" data-k="${key}" data-v="${v}" aria-pressed="${K[key] === v}" style="--c:var(--${c})">${t}</button>`;
    return `<div class="wrap" style="max-width:1000px">
      ${gBack() ? `<div>${gBack()}</div>` : ''}<div><p class="eyebrow" style="color:var(--pa)">KUMPULAN</p><h1 class="h1">Pertandingan Kumpulan</h1></div>
      <div class="ksetup">
        <section class="pbox"><h3>BILANGAN KUMPULAN</h3><div class="opts" style="grid-template-columns:repeat(5,minmax(0,1fr))">${[2, 3, 4, 5, 6].map(v => opt('n', v, v)).join('')}</div>
          <h3 style="margin-top:6px">NAMA KUMPULAN</h3><div class="knames">${Array.from({ length: K.n }, (_, i) => `<label class="kname" style="--c:var(--${KNAMES[i][1]})"><i></i><input type="text" data-kn="${i}" value="${esc(K.names[i] || 'Kumpulan ' + KNAMES[i][0])}" aria-label="Nama kumpulan ${i + 1}" maxlength="24"></label>`).join('')}</div></section>
        <section class="pbox"><h3>BILANGAN SOALAN</h3><div class="opts" style="grid-template-columns:repeat(4,minmax(0,1fr))">${[5, 10, 15, 20].map(v => opt('total', v, v)).join('')}</div>
          <h3 style="margin-top:6px">MASA SETIAP SOALAN</h3><div class="opts" style="grid-template-columns:repeat(4,minmax(0,1fr))">${[[15, '15 s'], [30, '30 s'], [60, '60 s'], [0, 'Tanpa']].map(([v, t]) => opt('time', v, t)).join('')}</div>
          <h3 style="margin-top:6px">JENIS SOALAN</h3><div class="ktypes">${Object.keys(CQT).map(k => `<label class="ajchk"><input type="checkbox" data-kt="${k}"${K.types.includes(k) ? ' checked' : ''}>${CQT[k]}</label>`).join('')}</div></section>
      </div>
      <button type="button" class="btn pri big" id="kGo" style="--tr:var(--pa);align-self:flex-end"${K.types.length ? '' : ' disabled'}>Mula ${IC.arrow}</button></div>`;
  }
  if (K.st === 'end') {
    const sorted = K.teams.map((t, i) => Object.assign({ i }, t)).sort((a, b) => b.score - a.score);
    let rank = 0, prev = null; sorted.forEach((t, k) => { if (t.score !== prev) { rank = k + 1; prev = t.score; } t.rank = rank; });
    const pod = sorted.filter(t => t.rank <= 3);
    const order = pod.length >= 3 ? [pod[1], pod[0], pod[2]] : pod;
    const title = ['', 'JOHAN', 'NAIB JOHAN', 'KETIGA'];
    return `<div class="wrap kend">
      <p class="eyebrow" style="color:var(--pa);text-align:center">KEPUTUSAN</p><h1 class="h1" style="text-align:center">Tahniah semua kumpulan!</h1>
      <div class="podium">${order.map(t => `<div class="pod r${t.rank}" style="--c:var(--${KNAMES[t.i][1]})"><b class="nm">${esc(t.name)}</b><span class="sc">${t.score}</span><div class="blk"><span>${title[t.rank]}</span></div></div>`).join('')}</div>
      ${sorted.length > 3 ? `<ol class="krest">${sorted.filter(t => t.rank > 3).map(t => `<li><span>${t.rank}.</span> ${esc(t.name)} <b>${t.score}</b></li>`).join('')}</ol>` : ''}
      <div class="prow" style="justify-content:center;gap:12px;flex-wrap:wrap"><button type="button" class="btn pri big" id="kAgain" style="--tr:var(--pa)">Main lagi</button><button type="button" class="btn sec big" id="kSet">Tukar tetapan</button>${gBack().replace('gback', 'gback big')}</div></div>`;
  }
  const q = K.q, left = K.time ? Math.max(0, K.end - Date.now()) : 0;
  const teams = K.teams.map((t, i) => { const on = K.got.includes(i); return `<button type="button" class="kteam${on ? ' on' : ''}" data-team="${i}" style="--c:var(--${KNAMES[i][1]})"${K.shown ? '' : ' disabled'} aria-pressed="${on}">
      <i></i><span class="nm"><b>${esc(t.name)}</b><small>${K.shown ? (on ? `✓ +${kPts()}${K.bonus ? ' (bonus)' : ''}` : 'Klik jika betul') : 'Tunggu jawapan'}</small></span><b class="sc">${t.score + (on ? kPts() : 0)}</b></button>`; }).join('');
  return `<div class="kplay">
    <div class="khead"><button type="button" class="btn sec" id="kStop" style="min-height:44px;padding:0 14px">${IC.x} Tamat</button>
      <b class="kn">Soalan ${K.qi + 1} <span>/ ${K.total}</span></b>${K.bonus ? '<span class="chip kbonus">BONUS ×2</span>' : ''}
      ${K.time ? `<div class="tbar"><div class="bar"><i id="kfill" style="width:${K.shown ? 0 : left / (K.time * 10)}%;background:${left <= 5000 ? 'var(--rd)' : 'var(--gr)'}"></i></div><b id="ksec">${K.shown ? 0 : Math.ceil(left / 1000)}s</b></div>` : '<span class="kn2">Tanpa had masa</span>'}</div>
    <div class="kbody"><section class="kmain">${cqView(q, K.shown)}</section>
      <aside class="kside"><h3>${K.shown ? 'SIAPA BETUL? KLIK KUMPULAN' : 'PAPAN MARKAH'}</h3>${teams}
        ${K.shown ? `<button type="button" class="btn pri big" id="kNext" style="--tr:var(--pa);margin-top:auto">${K.qi + 1 < K.total ? 'Soalan seterusnya' : 'Lihat keputusan'} ${IC.arrow}</button>`
          : `<button type="button" class="btn pri big" id="kShow" style="--tr:var(--pa);margin-top:auto">Tunjuk jawapan</button><button type="button" class="btn sec" id="kSkip" style="min-height:48px">Langkau soalan ${IC.right}</button>`}</aside></div></div>`;
}
function bindKumpulan() {
  const m = document.getElementById('main');
  if (K.st === 'setup') {
    m.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { K[b.dataset.k] = +b.dataset.v; kSave(); render(true); });
    m.querySelectorAll('[data-kn]').forEach(inp => inp.oninput = () => { K.names[+inp.dataset.kn] = inp.value; kSave(); });
    m.querySelectorAll('[data-kt]').forEach(c => c.onchange = () => { const t = c.dataset.kt; K.types = c.checked ? [...new Set(K.types.concat(t))] : K.types.filter(x => x !== t); kSave(); render(true); });
    document.getElementById('kGo').onclick = () => {
      K.teams = Array.from({ length: K.n }, (_, i) => ({ name: (K.names[i] || '').trim() || 'Kumpulan ' + KNAMES[i][0], score: 0 }));
      K.qi = 0; K.lastBonus = -9; K.st = 'play'; snd('tap'); kNewQ(); render(true);
    };
    return;
  }
  if (K.st === 'end') {
    setTimeout(() => burst(document.querySelector('.pod.r1 .sc'), 'var(--am)'), 200);
    document.getElementById('kAgain').onclick = () => { K.teams.forEach(t => { t.score = 0; }); K.qi = 0; K.lastBonus = -9; K.st = 'play'; kNewQ(); render(true); };
    document.getElementById('kSet').onclick = () => { K.st = 'setup'; render(true); };
    return;
  }
  document.getElementById('kStop').onclick = () => { if (confirm('Tamatkan pertandingan dan lihat keputusan?')) { clearInterval(K.timer); K.teams.forEach((t, i) => { if (K.got.includes(i)) t.score += kPts(); }); K.got = []; K.st = 'end'; snd('end'); render(true); } };
  const sh = document.getElementById('kShow'); if (sh) sh.onclick = kReveal;
  const sk = document.getElementById('kSkip'); if (sk) sk.onclick = () => { clearInterval(K.timer); K.got = []; K.qi++; if (K.qi >= K.total) { K.st = 'end'; snd('end'); render(true); return; } snd('tap'); kNewQ(); render(true); };
  m.querySelectorAll('[data-team]').forEach(b => b.onclick = () => {
    const i = +b.dataset.team; if (!K.shown) return;
    if (K.got.includes(i)) K.got = K.got.filter(x => x !== i); else { K.got.push(i); snd('ok'); }
    render(true);
    if (K.got.includes(i)) burst(document.querySelector(`[data-team="${i}"] .sc`), 'var(--am)');
  });
  const nx = document.getElementById('kNext');
  if (nx) nx.onclick = () => {
    K.teams.forEach((t, i) => { if (K.got.includes(i)) t.score += kPts(); });
    K.qi++;
    if (K.qi >= K.total) { K.st = 'end'; snd('end'); render(true); return; }
    kNewQ(); render(true);
  };
}

/* =================== SIAPA NAK JAWAB? =================== */
const S = { q: null, shown: false, right: 0, done: 0, end: false };
function sNewQ() { S.q = cq(S.done < 4 ? 0 : S.done < 9 ? 1 : 2); S.shown = false; }
function viewSiapa() {
  if (S.end) {
    const pc = S.done ? Math.round(S.right / S.done * 100) : 0;
    return `<div class="gend"><p class="eyebrow" style="color:var(--pu)">SIAPA NAK JAWAB? · SELESAI</p><div class="score" style="color:var(--pu)">${S.right}<span style="font-size:.45em;color:var(--mu)"> / ${S.done}</span></div>
      <p class="lead" style="margin:0">soalan dijawab betul oleh kelas (${pc}%)</p>
      <div class="prow" style="width:100%;flex-direction:column;margin-top:8px"><button type="button" class="btn pri big" id="sAgain" style="--tr:var(--pu)">Main lagi</button>${gBack().replace('gback', 'gback big')}</div></div>`;
  }
  if (!S.q) sNewQ();
  return `<div class="kplay">
    <div class="khead">${gBack()}<b class="kn" style="color:var(--pu)">Siapa Nak Jawab?</b><span class="kn2">Soalan ${S.done + 1}</span>
      <span class="chip" style="margin-left:auto;height:40px;font-size:16px;background:color-mix(in srgb,var(--gr) 15%,transparent);color:var(--gr)">Kelas betul: ${S.right} / ${S.done}</span></div>
    <div class="kbody one"><section class="kmain">
      ${S.shown ? '' : `<div class="hand">${sv('<path d="M8 11V5a2 2 0 0 1 4 0v5M12 10V4a2 2 0 0 1 4 0v7M16 9a2 2 0 0 1 4 0v5a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.5L3.5 13a2 2 0 0 1 3.2-2.4L8 12"/>', 26)} Angkat tangan jika tahu jawapan!</div>`}
      ${cqView(S.q, S.shown, true)}</section></div>
    <div class="kfoot">
      <button type="button" class="btn sec" id="sEnd">${IC.x}<span>Tamat</span></button>
      <button type="button" class="btn sec" id="sSkip">Langkau ${IC.right}</button>
      ${S.shown ? `<span class="kn2" style="margin-left:auto">Kelas jawab betul?</span><button type="button" class="btn sec big sno" id="sNo">✗ Salah</button><button type="button" class="btn pri big" id="sYes" style="--tr:var(--gr)">✓ Betul</button>`
        : `<span class="kn2 kfh">Tiada had masa. Tunjuk jawapan bila sudah sedia.</span><button type="button" class="btn pri big" id="sShow" style="--tr:var(--pu);margin-left:auto">Tunjuk jawapan</button>`}
    </div></div>`;
}
function bindSiapa() {
  const ag = document.getElementById('sAgain'); if (ag) { ag.onclick = () => { Object.assign(S, { q: null, shown: false, right: 0, done: 0, end: false }); render(true); }; return; }
  document.getElementById('sEnd').onclick = () => { S.end = true; render(true); if (S.done) snd('end'); };
  const sh = document.getElementById('sShow'); if (sh) sh.onclick = () => { S.shown = true; render(true); cqAnim(S.q); };
  document.getElementById('sSkip').onclick = () => { snd('tap'); sNewQ(); render(true); };
  const mark = ok => { S.done++; if (ok) S.right++; snd(ok ? 'ok' : 'no'); sNewQ(); render(true); };
  const y = document.getElementById('sYes'); if (y) y.onclick = () => mark(true);
  const n = document.getElementById('sNo'); if (n) n.onclick = () => mark(false);
}

/* =================== RODA NAMA =================== */
const RKEY = 'terokamath-roda'; // dikongsi semua bab (senarai nama kelas)
const RCOL = ['tr', 'pa', 'pu', 'gr', 'am', 'pk', 'rd'];
function rLoad() {
  let d = null; try { d = JSON.parse(localStorage.getItem(RKEY) || localStorage.getItem('isomove-roda')); } catch (e) {}
  if (!d || !Array.isArray(d.lists) || !d.lists.length) d = { cur: 'r1', rm: true, autoQ: false, lists: [{ id: 'r1', name: 'Senarai 1', text: '' }] };
  if (!d.lists.some(l => l.id === d.cur)) d.cur = d.lists[0].id;
  return d;
}
const R = { d: null, picked: {}, drawn: null, angle: 0, spinning: false, pick: null, q: null, qShown: false };
const rData = () => R.d || (R.d = rLoad());
const rList = () => { const d = rData(); return d.lists.find(l => l.id === d.cur); };
const rSave = () => { try { localStorage.setItem(RKEY, JSON.stringify(rData())); } catch (e) { toast('Storan penuh'); } };
const rNames = () => String(rList().text || '').split('\n').map(s => s.trim()).filter(Boolean).slice(0, 60);
function rRemaining() {
  const names = rNames(); if (!rData().rm) return names;
  const used = (R.picked[rData().cur] || []).slice(), out = [];
  names.forEach(n => { const k = used.indexOf(n); if (k >= 0) used.splice(k, 1); else out.push(n); });
  return out;
}
function rWheel(names) {
  const n = names.length, C = 250, Rr = 236;
  if (!n) return `<svg class="rwheel" viewBox="0 0 500 540" role="img" aria-label="Roda kosong"><circle cx="250" cy="290" r="236" style="fill:var(--surf);stroke:var(--bd)" stroke-width="3" stroke-dasharray="10 8"/><text x="250" y="296" text-anchor="middle" font-size="22" style="fill:var(--mu)">Taip nama dalam kotak nama</text></svg>`;
  const fs = n > 30 ? 12 : n > 20 ? 15 : n > 12 ? 18 : 22, seg = 360 / n;
  let s = '';
  names.forEach((nm, i) => {
    const a0 = (i * seg - 90) * Math.PI / 180, a1 = ((i + 1) * seg - 90) * Math.PI / 180, am = ((i + .5) * seg - 90);
    const x0 = C + Rr * Math.cos(a0), y0 = C + Rr * Math.sin(a0), x1 = C + Rr * Math.cos(a1), y1 = C + Rr * Math.sin(a1);
    let ci = i % RCOL.length; if (n > 1 && i === n - 1 && ci === 0) ci = 2;
    const col = `var(--${RCOL[ci]})`;
    s += n === 1 ? `<circle cx="${C}" cy="${C}" r="${Rr}" style="fill:${col}"/>` : `<path d="M${C} ${C}L${x0.toFixed(1)} ${y0.toFixed(1)}A${Rr} ${Rr} 0 ${seg > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z" style="fill:${col};stroke:var(--bg)" stroke-width="2.5"/>`;
    const tr = n === 1 ? 0 : 140, ar = am * Math.PI / 180, tx = C + tr * Math.cos(ar), ty = C + tr * Math.sin(ar);
    const lab = nm.length > 14 ? nm.slice(0, 13) + '…' : nm;
    s += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" transform="rotate(${n === 1 ? 0 : am.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)})" text-anchor="middle" dominant-baseline="middle" font-size="${fs}" font-weight="800" style="fill:#0B1220">${esc(lab)}</text>`;
  });
  return `<svg class="rwheel" viewBox="0 0 500 540" role="img" aria-label="Roda dengan ${n} nama" font-family="Inter, sans-serif">
    <g transform="translate(0 40)"><g id="rodaG" transform="rotate(${R.angle} ${C} ${C})">${s}</g>
    <circle cx="${C}" cy="${C}" r="46" style="fill:var(--nav);stroke:var(--tx)" stroke-width="4"/><text x="${C}" y="${C + 8}" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="21" style="fill:var(--tx)">PUTAR</text></g>
    <polygon points="230,4 270,4 250,48" style="fill:var(--tx);stroke:var(--bg)" stroke-width="3"/></svg>`;
}
function viewRoda() {
  const d = rData(), L = rList(), names = rNames(), rem = rRemaining();
  if (!R.drawn || (!R.pick && !R.spinning)) R.drawn = rem;
  const picked = (R.picked[d.cur] || []);
  const opts = d.lists.map(l => `<option value="${l.id}"${l.id === d.cur ? ' selected' : ''}>${esc(l.name)}</option>`).join('');
  const qBox = R.q ? `<div class="rq-bg"><section class="rq" role="dialog" aria-modal="true" aria-label="Soalan">
      <div class="khead"><b class="kn">Soalan untuk <span style="color:var(--pk)">${esc(R.pick || '')}</span></b><button type="button" class="ib" id="rqX" aria-label="Tutup soalan" style="margin-left:auto">${IC.x}</button></div>
      <div class="rqb">${cqView(R.q, R.qShown, true)}</div>
      <div class="kfoot"><button type="button" class="btn sec" id="rqNext">Soalan lain ${IC.right}</button>${R.qShown ? `<button type="button" class="btn pri big" id="rqDone" style="--tr:var(--pk);margin-left:auto">Selesai</button>` : `<button type="button" class="btn pri big" id="rqShow" style="--tr:var(--pk);margin-left:auto">Tunjuk jawapan</button>`}</div>
    </section></div>` : '';
  return `<div class="kplay">
    <div class="khead">${gBack()}<b class="kn" style="color:var(--pk)">Roda Nama</b>
      <label class="rsel"><span>SENARAI</span><select id="rList" aria-label="Pilih senarai nama">${opts}</select></label>
      <button type="button" class="ib" id="rNewL" aria-label="Senarai baharu">${ajIcon.plus}</button><button type="button" class="ib" id="rRenL" aria-label="Namakan semula senarai">${ajIcon.edit}</button><button type="button" class="ib" id="rDelL" aria-label="Padam senarai">${ajIcon.trash}</button></div>
    <div class="rbody">
      <section class="pbox rleft"><label class="ajf"><span>TAIP NAMA (satu baris satu nama)</span><textarea id="rText" rows="10" placeholder="Contoh:&#10;Aisyah&#10;Daniel&#10;Mei Ling"${R.spinning ? ' disabled' : ''}>${esc(L.text || '')}</textarea></label>
        <span class="rcount" id="rCount">${names.length} nama${d.rm ? ` · ${rem.length} lagi dalam roda` : ''}</span>
        <label class="ajchk rchk"><input type="checkbox" id="rRm"${d.rm ? ' checked' : ''}>Buang nama selepas dipilih</label>
        <label class="ajchk rchk"><input type="checkbox" id="rAuto"${d.autoQ ? ' checked' : ''}>Beri soalan selepas roda berhenti</label>
        ${d.rm && picked.length ? `<button type="button" class="btn sec" id="rReset" style="min-height:44px">Masukkan semula semua nama</button>` : ''}</section>
      <div class="rmid"><button type="button" class="rspin" id="rSpin" aria-label="Putar roda"${R.drawn.length && !R.spinning ? '' : ' disabled'}>${rWheel(R.drawn)}</button></div>
      <aside class="rright">
        <div class="rpick${R.pick ? ' on' : ''}"><span>TERPILIH</span><b id="rPickName">${R.pick ? esc(R.pick) : '–'}</b></div>
        <button type="button" class="btn pri big" id="rGo" style="--tr:var(--pk)"${rem.length || names.length ? '' : ' disabled'}${R.spinning ? ' disabled' : ''}>${R.pick ? 'Putar lagi' : 'Putar'}</button>
        ${R.pick ? `<button type="button" class="btn sec" id="rQ" style="min-height:54px">Soalan untuk ${esc(R.pick)}</button>` : ''}
        ${d.rm && picked.length ? `<p class="ajhint" style="text-align:center">Sudah dipilih: ${picked.map(esc).join(', ')}</p>` : ''}
      </aside>
    </div>${qBox}</div>`;
}
function rSpin() {
  if (R.spinning) return;
  const d = rData();
  let rem = rRemaining();
  if (!rem.length && rNames().length) { R.picked[d.cur] = []; rem = rRemaining(); toast('Semua nama sudah dipilih. Roda diisi semula.'); }
  if (!rem.length) return;
  R.pick = null; R.q = null; R.drawn = rem; R.angle = R.angle % 360; R.spinning = true;
  render(true);
  const n = rem.length, seg = 360 / n, w = Math.floor(Math.random() * n);
  const centre = (w + .5) * seg, jitter = (Math.random() - .5) * seg * .7;
  const start = R.angle, target = start + 360 * 6 + ((360 - ((centre + start) % 360)) % 360) + jitter;
  const D = REDUCE ? 600 : 4300, t0 = performance.now(), g = document.getElementById('rodaG');
  let lastSeg = Math.floor(((start % 360) + 360) % 360 / seg);
  const frame = now => {
    const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3), a = start + (target - start) * e;
    R.angle = a; if (g) g.setAttribute('transform', `rotate(${a.toFixed(2)} 250 250)`);
    const sNow = Math.floor((((a % 360) + 360) % 360) / seg); if (sNow !== lastSeg) { lastSeg = sNow; snd('tap'); }
    if (k < 1) return requestAnimationFrame(frame);
    R.spinning = false; R.pick = rem[w];
    if (d.rm) (R.picked[d.cur] = R.picked[d.cur] || []).push(rem[w]);
    snd('end'); render(true);
    burst(document.getElementById('rPickName'), 'var(--pk)');
    if (d.autoQ) setTimeout(() => { R.q = cq(1); R.qShown = false; render(true); }, 700);
  };
  requestAnimationFrame(frame);
}
function bindRoda() {
  const d = rData();
  document.getElementById('rList').onchange = e => { d.cur = e.target.value; R.pick = null; R.drawn = null; rSave(); render(true); };
  document.getElementById('rNewL').onclick = () => { const n = prompt('Nama senarai baharu (contoh: 2 Amanah):', 'Senarai ' + (d.lists.length + 1)); if (!n) return; const l = { id: 'r' + Date.now(), name: n.trim().slice(0, 40) || 'Senarai', text: '' }; d.lists.push(l); d.cur = l.id; R.pick = null; R.drawn = null; rSave(); render(true); };
  document.getElementById('rRenL').onclick = () => { const n = prompt('Nama senarai:', rList().name); if (n && n.trim()) { rList().name = n.trim().slice(0, 40); rSave(); render(true); } };
  document.getElementById('rDelL').onclick = () => {
    if (!confirm(`Padam senarai "${rList().name}"?`)) return;
    d.lists = d.lists.filter(l => l.id !== d.cur); if (!d.lists.length) d.lists.push({ id: 'r' + Date.now(), name: 'Senarai 1', text: '' });
    d.cur = d.lists[0].id; R.pick = null; R.drawn = null; rSave(); render(true);
  };
  const ta = document.getElementById('rText');
  ta.oninput = () => {
    rList().text = ta.value; rSave();
    if (!R.spinning) { R.pick = null; R.drawn = rRemaining(); const mid = document.querySelector('.rspin'); if (mid) { mid.innerHTML = rWheel(R.drawn); mid.disabled = !R.drawn.length; } }
    const c = document.getElementById('rCount'); if (c) c.textContent = `${rNames().length} nama${d.rm ? ` · ${rRemaining().length} lagi dalam roda` : ''}`;
    const go = document.getElementById('rGo'); if (go) go.disabled = !rNames().length;
  };
  document.getElementById('rRm').onchange = e => { d.rm = e.target.checked; R.picked[d.cur] = []; R.pick = null; R.drawn = null; rSave(); render(true); };
  document.getElementById('rAuto').onchange = e => { d.autoQ = e.target.checked; rSave(); };
  const rs = document.getElementById('rReset'); if (rs) rs.onclick = () => { R.picked[d.cur] = []; R.pick = null; R.drawn = null; render(true); };
  document.getElementById('rSpin').onclick = rSpin;
  document.getElementById('rGo').onclick = rSpin;
  const rq = document.getElementById('rQ'); if (rq) rq.onclick = () => { R.q = cq(1); R.qShown = false; render(true); };
  const qx = document.getElementById('rqX'); if (qx) qx.onclick = () => { R.q = null; render(true); };
  const qs = document.getElementById('rqShow'); if (qs) qs.onclick = () => { R.qShown = true; render(true); cqAnim(R.q); };
  const qn = document.getElementById('rqNext'); if (qn) qn.onclick = () => { R.q = cq(1); R.qShown = false; render(true); };
  const qd = document.getElementById('rqDone'); if (qd) qd.onclick = () => { R.q = null; render(true); };
}
document.addEventListener('keydown', e => {
  if (!location.hash.startsWith('#/games/roda') || e.key !== ' ' || R.q) return;
  if (e.target.closest && e.target.closest('input,textarea,select,button,a')) return;
  e.preventDefault(); rSpin();
});

/* ---------- penghala mod game ---------- */
function viewGameMode(mode) {
  if (mode === 'kumpulan') return viewKumpulan();
  if (mode === 'siapa') return viewSiapa();
  if (mode === 'roda') return viewRoda();
  const v = viewGames();
  return G.st === 'intro' && gBack() ? v.replace('<div class="headrow">', `<div>${gBack()}</div><div class="headrow">`) : v;
}
function bindGameMode(mode) {
  if (mode === 'kumpulan') return bindKumpulan();
  if (mode === 'siapa') return bindSiapa();
  if (mode === 'roda') return bindRoda();
  return bindGames();
}
