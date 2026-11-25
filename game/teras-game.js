'use strict';
/* =================== GAME TEROKAMATH · TERAS BERSAMA ===================
   Muat soalan bab yang dipilih (aras mudah sahaja), urus nyawa, markah, jeda dan tamat.
   Setiap game (lari.js, tembak.js …) daftar GAMEDEF dan guna objek TMG. */
const TMG = {
  MAX: 10, NYAWA: 3, SELANG: 15000,
  P: new URLSearchParams(location.search),
  qn: 0, betulN: 0, skor: 0, combo: 0, nyawa: 3, over: false, Q: null, recent: [],
  $: id => document.getElementById(id),
  touch: !!(window.matchMedia && matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window
};
TMG.bab = SENARAI.find(s => s.id === TMG.P.get('b'));
TMG.gid = TMG.P.get('g');

/* ---------- teks soalan → teks biasa untuk dilukis dalam game ---------- */
const TMG_SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '−': '⁻', '+': '⁺', 'n': 'ⁿ', 'x': 'ˣ', '(': '⁽', ')': '⁾' };
const TMG_SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', 'n': 'ₙ', 'x': 'ₓ', 'a': 'ₐ', 'e': 'ₑ' };
TMG.plain = html => {
  let s = typeof mathPlain === 'function' ? mathPlain(html) : String(html);
  s = s.replace(/<sup>(.*?)<\/sup>/g, (m, t) => [...t].every(c => TMG_SUP[c]) ? [...t].map(c => TMG_SUP[c]).join('') : '^' + t);
  s = s.replace(/<sub>(.*?)<\/sub>/g, (m, t) => [...t].every(c => TMG_SUB[c]) ? [...t].map(c => TMG_SUB[c]).join('') : '_' + t);
  s = s.replace(/<span[^>]*overline[^>]*>(.*?)<\/span>/g, (m, t) => [...t].map(c => c + '̅').join(''));
  s = s.replace(/<[^>]+>/g, '');
  const d = document.createElement('textarea'); d.innerHTML = s; return d.value.replace(/\s+/g, ' ').trim();
};

/* ---------- soalan: aras mudah, pendek, jawapan ringkas ---------- */
TMG.ambil = (maxOpt, maxQ) => {
  for (let i = 0; i < 80; i++) {
    let q; try { q = gq(0); } catch (e) { continue; }
    if (!q || q.type !== 'mcq' || !Array.isArray(q.opts) || q.opts.length < 2 || q.opts.length > 4 || !(q.c >= 0 && q.c < q.opts.length)) continue;
    if (q.opts.some(o => /<svg/i.test(String(o)))) continue;
    const opts = q.opts.map(TMG.plain);
    if (opts.some(o => !o || [...o].length > maxOpt) || TMG.plain(q.q).length > maxQ) continue;
    if (new Set(opts).size !== opts.length) continue;
    const key = TMG.plain(q.q) + '|' + opts[q.c] + '|' + (q.fig || '').length;
    if (TMG.recent.includes(key) && i < 60) continue;
    TMG.recent.push(key); if (TMG.recent.length > 6) TMG.recent.shift();
    return { html: q.q, fig: q.fig || '', opts, c: q.c };
  }
  return null;
};
TMG.nextQ = () => {
  const q = TMG.ambil(18, 140) || TMG.ambil(26, 220);
  if (!q) { TMG.ralat('Bab ini belum ada soalan yang sesuai untuk game.'); return null; }
  TMG.qn++; TMG.Q = q;
  TMG.$('qno').textContent = 'SOALAN ' + TMG.qn + '/' + TMG.MAX;
  TMG.$('qtx').innerHTML = q.html;
  TMG.$('qfig').innerHTML = q.fig;
  TMG.$('qbox').classList.remove('ok', 'no', 'amar');
  return q;
};

/* ---------- markah & nyawa ---------- */
const TMG_HEART = c => `<svg viewBox="0 0 24 24" fill="${c}" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>`;
TMG.lukisHud = () => {
  TMG.$('nyawa').innerHTML = Array.from({ length: TMG.NYAWA }, (_, i) => TMG_HEART(i < TMG.nyawa ? '#F87171' : '#475569')).join('');
  TMG.$('nyawa').setAttribute('aria-label', TMG.nyawa + ' nyawa');
  TMG.$('skor').textContent = TMG.skor.toLocaleString('ms-MY').replace(/,/g, ' ');
};
TMG.bunyi = k => { try { snd(k); } catch (e) {} };
TMG.ding = () => { try { const C = SND.ctx || (SND.ctx = new (window.AudioContext || window.webkitAudioContext)()); const o = C.createOscillator(), v = C.createGain(), t = C.currentTime; o.type = 'triangle'; o.frequency.setValueAtTime(1320, t); o.frequency.setValueAtTime(1760, t + .05); v.gain.setValueAtTime(.08, t); v.gain.exponentialRampToValueAtTime(.001, t + .16); o.connect(v); v.connect(C.destination); o.start(t); o.stop(t + .2); } catch (e) {} };
TMG.kutip = n => { TMG.skor += n; TMG.ding(); TMG.lukisHud(); };
// jalur atas semasa tiada soalan
TMG.rehat = () => { TMG.Q = null; TMG.$('qno').textContent = ''; TMG.$('qtx').innerHTML = GAMEDEF.rehat; TMG.$('qfig').innerHTML = ''; TMG.$('qbox').classList.remove('ok', 'no', 'amar'); };
TMG.amaran = () => { TMG.$('qno').textContent = 'SOALAN ' + (TMG.qn + 1) + '/' + TMG.MAX; TMG.$('qtx').innerHTML = 'Soalan datang!'; TMG.$('qbox').classList.add('amar'); TMG.bunyi('tap'); };
TMG.tanda = ok => { const b = TMG.$('qbox'); b.classList.remove('ok', 'no'); void b.offsetWidth; b.classList.add(ok ? 'ok' : 'no'); };
TMG.betul = () => { TMG.combo++; TMG.betulN++; TMG.skor += 100 + 20 * (TMG.combo - 1); TMG.bunyi(TMG.combo >= 3 ? 'combo' : 'ok'); TMG.tanda(true); TMG.lukisHud(); return TMG.semak(); };
TMG.salah = () => { TMG.combo = 0; TMG.nyawa--; TMG.bunyi('no'); TMG.tanda(false); TMG.lukisHud(); return TMG.semak(); };
TMG.cedera = () => { TMG.combo = 0; TMG.nyawa--; TMG.bunyi('no'); TMG.lukisHud(); if (TMG.nyawa <= 0) { TMG.tamat(); return true; } return false; };
// true = game tamat
TMG.semak = () => { if (TMG.nyawa <= 0 || TMG.qn >= TMG.MAX) { TMG.tamat(); return true; } return false; };

/* ---------- lapisan: mula, jeda, tamat ---------- */
TMG.kad = html => { const l = TMG.$('lapis'); l.innerHTML = `<div class="kad">${html}</div>`; l.hidden = false; return l; };
TMG.tutupKad = () => { TMG.$('lapis').hidden = true; };
TMG.tagHTML = () => `<span class="tg">${GAMEDEF.nama.toUpperCase()} · BAB ${TMG.bab.n}</span>`;
TMG.mulaKad = () => {
  const l = TMG.kad(`${TMG.tagHTML()}<h1>${GAMEDEF.nama}</h1><p>${tgEsc(TMG.bab.tajuk)} · Tingkatan ${TMG.bab.t}</p><p>${TMG.touch ? GAMEDEF.caraSentuh : GAMEDEF.cara}</p><p>${TMG.NYAWA} nyawa · ${TMG.MAX} soalan sepanjang permainan</p><button class="pri" id="kMula">Mula</button>`);
  l.querySelector('#kMula').onclick = () => { TMG.tutupKad(); TMG.bunyi('tap'); TMG.mula(); };
};
TMG.jeda = () => {
  if (TMG.over || !TMG.scene || TMG.$('lapis').hidden === false) return;
  TMG.scene.scene.pause();
  const l = TMG.kad(`${TMG.tagHTML()}<h1>Jeda</h1><button class="pri" id="kSam">Sambung</button><div class="row"><button class="sec" id="kSem">Main semula</button><a class="sec" href="index.html?b=${TMG.bab.id}">Keluar</a></div>`);
  l.querySelector('#kSam').onclick = () => { TMG.tutupKad(); TMG.scene.scene.resume(); };
  l.querySelector('#kSem').onclick = () => { TMG.tutupKad(); TMG.mula(); };
};
TMG.tamat = () => {
  if (TMG.over) return; TMG.over = true;
  setTimeout(() => {
    if (TMG.scene) TMG.scene.scene.pause();
    try { snd(TMG.nyawa > 0 ? 'combo' : 'no'); } catch (e) {}
    const l = TMG.kad(`${TMG.tagHTML()}<h1>Tamat!</h1><div class="big">${TMG.$('skor').textContent}</div><p>Betul <b>${TMG.betulN}</b> daripada ${TMG.qn} soalan</p><button class="pri" id="kSem">Main semula</button><div class="row"><a class="sec" href="index.html?b=${TMG.bab.id}">Tukar game</a><a class="sec" href="index.html?t=${TMG.bab.t}">Tukar bab</a></div>`);
    l.querySelector('#kSem').onclick = () => { TMG.tutupKad(); TMG.mula(); };
  }, 700);
};
TMG.ralat = m => { TMG.over = true; TMG.kad(`<h1>Maaf</h1><p>${m}</p><a class="sec" style="width:100%" href="index.html">Kembali</a>`); };
const tgEsc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- mula / ulang ---------- */
TMG.mula = () => {
  Object.assign(TMG, { qn: 0, betulN: 0, skor: 0, combo: 0, nyawa: TMG.NYAWA, over: false, recent: [] });
  TMG.lukisHud(); TMG.$('hud').hidden = false; TMG.rehat();
  if (!TMG.game) {
    TMG.game = new Phaser.Game({ type: Phaser.AUTO, parent: 'stage', width: 1280, height: 720, backgroundColor: '#0B1220', scale: { mode: Phaser.Scale.NONE }, scene: [GAMEDEF.scene], audio: { noAudio: true }, banner: false, input: { activePointers: 3 } });
  } else TMG.scene.scene.restart();
};

/* ---------- muat skrip bab + enjin + game ---------- */
function tgMuat(src) { return new Promise((ok, no) => { const e = document.createElement('script'); e.src = src; e.onload = ok; e.onerror = () => no(src); document.body.appendChild(e); }); }
TMG.pusing = () => { TMG.$('pusing').hidden = !(TMG.touch && innerHeight > innerWidth); };
(async () => {
  addEventListener('resize', TMG.pusing); TMG.pusing();
  if (!TMG.bab || !/^[a-z]+$/.test(TMG.gid || '')) { TMG.ralat('Bab atau game tidak dijumpai.'); return; }
  document.title = 'Game · Bab ' + TMG.bab.n + ' ' + TMG.bab.tajuk + ' · TerokaMath';
  try {
    await tgMuat('../' + TMG.bab.id + '/bab.js'); await tgMuat('../teras/asas.js'); await tgMuat('../' + TMG.bab.id + '/soalan.js');
    await tgMuat('lib/phaser.min.js'); await tgMuat(TMG.gid + '.js');
    await Promise.all([document.fonts.load('700 30px "Space Grotesk"'), document.fonts.load('800 20px Inter')]).catch(() => {});
  } catch (e) { TMG.ralat('Gagal memuatkan game. Semak sambungan internet dan cuba lagi.'); return; }
  if (typeof gq !== 'function') { TMG.ralat('Bab ini belum ada soalan untuk game.'); return; }
  document.documentElement.style.setProperty('--ac', GAMEDEF.warna);
  TMG.$('cara').innerHTML = GAMEDEF.cara; TMG.$('cara').hidden = TMG.touch;
  if (TMG.touch && GAMEDEF.sentuh) { GAMEDEF.sentuh(TMG.$('sentuh')); TMG.$('sentuh').hidden = false; }
  TMG.$('jeda').onclick = TMG.jeda;
  addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') TMG.jeda(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) TMG.jeda(); });
  TMG.lukisHud(); TMG.mulaKad();
})();
