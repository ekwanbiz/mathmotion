'use strict';
/* =================== TerokaMath · TERAS: Kuiz Online (guru bina, murid jawab, Kad Siap) ===================
   Aktif hanya jika BAB.kuiz = true. Tiada pelayan: link membawa resipi kuiz (jenis, aras, benih),
   soalan dijana semula secara tetap di telefon murid. Kad Siap membawa kod semakan. */
(function () {
  if (typeof BAB === 'undefined' || BAB.kuiz === false || typeof cq !== 'function' || typeof CQT === 'undefined') return;

  /* ---------- pembantu ---------- */
  const LVN = ['Mudah', 'Sederhana', 'Sukar'];
  const DKEY = 'kz-draf-' + BAB.id;
  const mul = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const newSeed = () => Math.floor(Math.random() * 1e6); // benih pendek supaya link & kod QR lebih ringkas
  function genQ(t, L, seed) {            // soalan sama setiap kali untuk (jenis, aras, benih)
    const R = Math.random, rnd = mul(seed);
    Math.random = rnd; if (typeof vreset === 'function') vreset(rnd);
    try { return cq(L, [t]); } finally { Math.random = R; if (typeof vreset === 'function') vreset(); }
  }
  const strip = h => String(h || '').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const escH = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const b64e = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const b64d = s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
  const fnv = s => { let h = 0x811c9dc5; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; };
  const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const B32 = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const T0 = Date.UTC(2026, 0, 1) / 60000;
  const lsGet = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  /* ---------- kod semakan: markah, jumlah, cubaan, masa + cap nama ---------- */
  function makeCode(name, kelas, qid, sc, tot, att, when) {
    const mins = Math.max(0, Math.min(2097151, Math.floor(when / 60000 - T0)));
    const a = Math.min(127, att), h = fnv(['TM', norm(name), norm(kelas), sc, tot, a, mins].join('|')) & 0xFFFFF;
    let v = ((((BigInt(sc) << 5n | BigInt(tot)) << 7n | BigInt(a)) << 21n | BigInt(mins)) << 20n) | BigInt(h);
    let out = ''; for (let i = 0; i < 12; i++) { out = B32[Number(v & 31n)] + out; v >>= 5n; }
    return out.slice(0, 4) + '-' + out.slice(4, 8) + '-' + out.slice(8);
  }
  const fmtT = d => d.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('ms-MY', { hour: 'numeric', minute: '2-digit' });

  /* ---------- draf guru ---------- */
  function defDraft() {
    const ts = Object.keys(CQT), q = [];
    for (let i = 0; i < 10; i++) q.push([ts[i % ts.length], i < 4 ? 0 : i < 8 ? 1 : 2, newSeed()]);
    return { t: 'Kuiz ' + BAB.tajuk, p: 8, r: 1, q };
  }
  let DR = lsGet(DKEY); if (!DR || !Array.isArray(DR.q)) DR = defDraft();
  const saveDR = () => lsSet(DKEY, DR);
  const KG = { t: Object.keys(CQT)[0], L: 0, link: '' };
  const quizCode = Q => b64e(JSON.stringify({ v: 1, b: BAB.id, t: Q.t, p: Q.p, r: 1, q: Q.q }));

  /* ---------- gaya ---------- */
  const css = `.kzrow{display:flex;align-items:center;gap:8px;padding:9px 10px;border:1px solid var(--bd);border-radius:14px;background:var(--surf)}
.kzrow .n{font-weight:800;width:22px;color:var(--mu);flex:none}.kzrow .t{flex:1;min-width:0;font-weight:700;font-size:14px}
.kzrow .t small{display:block;font-weight:600;color:var(--mu);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kzrow .ib{width:36px;height:36px;flex:none}.kzlist{display:flex;flex-direction:column;gap:8px}
.kzchips{display:flex;flex-wrap:wrap;gap:8px}.kzchips button{padding:9px 12px;border-radius:12px;border:1.5px solid var(--bd);background:var(--surf);color:var(--tx);font:inherit;font-weight:700;font-size:14px;cursor:pointer}
.kzchips button[aria-pressed="true"]{border-color:var(--gr);background:color-mix(in srgb,var(--gr) 16%,transparent)}
.kzin{padding:11px 13px;border-radius:12px;border:1.5px solid var(--bd);background:var(--surf2);color:var(--tx);font:inherit;font-size:16px;width:100%;box-sizing:border-box}
.kzlbl{font-size:12.5px;font-weight:800;letter-spacing:.08em;color:var(--mu);margin:0 0 6px}
.kzsw{display:flex;align-items:center;justify-content:space-between;gap:12px;font-weight:700}
.kzlink{word-break:break-all;font-size:13px;padding:10px 12px;border-radius:12px;background:var(--surf2);border:1px dashed var(--bd)}
.kzwrap{max-width:720px;margin:0 auto;padding:16px;display:flex;flex-direction:column;gap:14px;box-sizing:border-box;min-height:100dvh}
.kzhd{display:flex;align-items:center;gap:10px}.kzhd img{width:36px;height:36px;border-radius:10px}.kzhd b{font-family:var(--head);font-size:18px}.kzhd small{display:block;color:var(--mu);font-weight:600;font-size:12px}
.kzbar{height:8px;border-radius:4px;background:var(--surf2);overflow:hidden}.kzbar i{display:block;height:100%;background:var(--tr)}
.kzq{font-size:19px;font-weight:800;line-height:1.35}.kzfig{border-radius:16px;border:1px solid var(--bd);background:var(--surf);padding:8px;display:flex;justify-content:center}.kzfig svg{width:100%;height:auto;max-height:46dvh}
.kzbig{font-family:var(--head);font-size:56px;font-weight:800;text-align:center;margin:8px 0 0}
.kzbad{border-radius:16px;padding:14px 16px;background:color-mix(in srgb,var(--rd) 12%,transparent);border:1px solid color-mix(in srgb,var(--rd) 45%,transparent);font-weight:600}
.kzkad{border-radius:22px;padding:20px;background:linear-gradient(135deg,#0EA5E9,#7C3AED);color:#fff;display:flex;flex-direction:column;gap:6px;box-shadow:0 10px 30px rgba(14,165,233,.25)}
.kzkad .k{font-size:12px;letter-spacing:.12em;font-weight:800;opacity:.85}.kzkad .nm{font-size:24px;font-weight:900;line-height:1.2}.kzkad .sc{font-family:var(--head);font-size:46px;font-weight:800}
.kzkad .code{background:rgba(255,255,255,.18);border-radius:12px;padding:10px;font-family:ui-monospace,monospace;font-size:22px;font-weight:800;text-align:center;letter-spacing:.1em}
.kzok{border-radius:14px;padding:12px 14px;font-weight:700}.kzok.y{background:color-mix(in srgb,var(--gr) 14%,transparent);border:1px solid var(--gr)}.kzok.n{background:color-mix(in srgb,var(--rd) 12%,transparent);border:1px solid var(--rd)}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- tab Latihan: tambah "Kuiz Online" ---------- */
  const _latSeg = latSeg;
  latSeg = function (cur) { return _latSeg(cur).replace('>Lembaran Kerja</a>', '>Lembaran</a>').replace('</nav>', `<a href="#/latihan/kuiz"${cur === 'kuiz' ? ' aria-current="page"' : ''}>Kuiz Online</a></nav>`); };

  function viewGuru() {
    const n = DR.q.length;
    const rows = DR.q.map(([t, L, s], i) => {
      const q = genQ(t, L, s);
      return `<div class="kzrow"><span class="n">${i + 1}</span><span class="t">${CQT[t] || t} · ${LVN[L]}<small>${escH(strip(q.q))}</small></span>
        <button type="button" class="ib" data-up="${i}" aria-label="Naik"${i ? '' : ' disabled'}>↑</button><button type="button" class="ib" data-dn="${i}" aria-label="Turun"${i < n - 1 ? '' : ' disabled'}>↓</button>
        <button type="button" class="ib" data-rf="${i}" aria-label="Tukar soalan">⟳</button><button type="button" class="ib" data-rm="${i}" aria-label="Buang">✕</button></div>`;
    }).join('');
    return `<div class="wrap">${latSeg('kuiz')}
      <div><h1 class="h1">Kuiz Online</h1><p class="lead">Bina kuiz, hantar link kepada murid. Murid jawab sehingga lulus dan hantar Kad Siap kepada guru.</p></div>
      <section class="pbox" style="display:flex;flex-direction:column;gap:12px">
        <div><p class="kzlbl">TAJUK KUIZ</p><input class="kzin" id="kzT" maxlength="60" value="${escH(DR.t)}"></div>
        <div class="kzsw"><span>Markah lulus</span><span style="display:flex;align-items:center;gap:8px"><button type="button" class="ib" id="kzPm" aria-label="Kurang">−</button><b style="font-size:20px;min-width:70px;text-align:center">${Math.min(DR.p, n)} / ${n}</b><button type="button" class="ib" id="kzPp" aria-label="Tambah">+</button></span></div>
      </section>
      <section class="pbox" style="display:flex;flex-direction:column;gap:10px"><h3 style="margin:0">SOALAN (${n})</h3>
        <div class="kzlist">${rows || '<p class="lead">Belum ada soalan. Tambah di bawah.</p>'}</div>
        <div style="border-top:1px solid var(--bd);padding-top:12px;display:flex;flex-direction:column;gap:10px"><p class="kzlbl">+ TAMBAH SOALAN</p>
          <div class="kzchips">${Object.keys(CQT).map(t => `<button type="button" data-kt="${t}" aria-pressed="${KG.t === t}">${CQT[t]}</button>`).join('')}</div>
          <div class="kzchips">${LVN.map((l, i) => `<button type="button" data-kl="${i}" aria-pressed="${KG.L === i}">${l}</button>`).join('')}</div>
          <button type="button" class="btn sec" id="kzAdd"${n >= 30 ? ' disabled' : ''}>+ Tambah soalan</button></div>
      </section>
      <section class="pbox" style="display:flex;flex-direction:column;gap:10px">
        <button type="button" class="btn pri big" id="kzGo"${n ? '' : ' disabled'}>Jana link kuiz</button>
        ${KG.link ? `<div class="kzqrrow"><div class="kzqr" id="kzQr" aria-label="Kod QR link kuiz" role="img"></div><button type="button" class="btn sec" id="kzQrBig">Tunjuk QR besar</button></div><div class="kzlink" id="kzLink">${escH(KG.link)}</div><div class="prow"><button type="button" class="btn pri" id="kzCopy">Salin link</button>${navigator.share ? '<button type="button" class="btn sec" id="kzShare">Kongsi</button>' : ''}<a class="btn sec" href="${escH(KG.link)}" target="_blank" rel="noopener">Cuba sebagai murid</a></div>
          <p style="margin:0;color:var(--mu);font-size:14px">Jika guru ubah soalan, jana link baharu dan hantar semula.</p>` : ''}
      </section>
</div>`;
  }
  function bindGuru() {
    const main = document.getElementById('main');
    const re = () => render(true);
    const T = document.getElementById('kzT'); T.oninput = () => { DR.t = T.value; saveDR(); KG.link = ''; };
    T.onchange = re;
    document.getElementById('kzPm').onclick = () => { DR.p = Math.max(1, Math.min(DR.p, DR.q.length) - 1); saveDR(); KG.link = ''; re(); };
    document.getElementById('kzPp').onclick = () => { DR.p = Math.min(DR.q.length, DR.p + 1); saveDR(); KG.link = ''; re(); };
    const mv = (i, j) => { [DR.q[i], DR.q[j]] = [DR.q[j], DR.q[i]]; saveDR(); KG.link = ''; re(); };
    main.querySelectorAll('[data-up]').forEach(b => b.onclick = () => { const i = +b.dataset.up; if (i > 0) mv(i, i - 1); });
    main.querySelectorAll('[data-dn]').forEach(b => b.onclick = () => { const i = +b.dataset.dn; if (i < DR.q.length - 1) mv(i, i + 1); });
    main.querySelectorAll('[data-rf]').forEach(b => b.onclick = () => { DR.q[+b.dataset.rf][2] = newSeed(); saveDR(); KG.link = ''; re(); toast('Soalan ditukar'); });
    main.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { DR.q.splice(+b.dataset.rm, 1); DR.p = Math.min(DR.p, Math.max(1, DR.q.length)); saveDR(); KG.link = ''; re(); });
    main.querySelectorAll('[data-kt]').forEach(b => b.onclick = () => { KG.t = b.dataset.kt; re(); });
    main.querySelectorAll('[data-kl]').forEach(b => b.onclick = () => { KG.L = +b.dataset.kl; re(); });
    document.getElementById('kzAdd').onclick = () => { if (DR.q.length >= 30) return; DR.q.push([KG.t, KG.L, newSeed()]); saveDR(); KG.link = ''; re(); toast('Soalan ditambah'); };
    document.getElementById('kzGo').onclick = () => {
      DR.t = (DR.t || '').trim() || 'Kuiz ' + BAB.tajuk; DR.p = Math.min(DR.p, DR.q.length); saveDR();
      KG.link = location.href.split('#')[0] + '#/q/' + quizCode(DR); re();
    };
    const cp = document.getElementById('kzCopy'); if (cp) cp.onclick = () => { (navigator.clipboard ? navigator.clipboard.writeText(KG.link) : Promise.reject()).then(() => toast('Link disalin'), () => { const r = document.createRange(); r.selectNodeContents(document.getElementById('kzLink')); getSelection().removeAllRanges(); getSelection().addRange(r); toast('Pilih dan salin link'); }); };
    if (KG.link) qrInto(document.getElementById('kzQr'), KG.link);
    const qb = document.getElementById('kzQrBig'); if (qb) qb.onclick = () => qrBig(DR.t, KG.link);
    const sh = document.getElementById('kzShare'); if (sh) sh.onclick = () => navigator.share({ title: DR.t, text: `${DR.t} (lulus ${DR.p}/${DR.q.length})`, url: KG.link }).catch(() => {});
  }

  /* ---------- kod QR (teras/qrcode.js, dimuat bila perlu) ---------- */
  function qrLib(cb) {
    if (window.qrcode) return cb();
    const sc = document.createElement('script'); sc.src = '../teras/qrcode.js'; sc.onload = cb; sc.onerror = () => toast('Kod QR tidak dapat dimuat'); document.head.appendChild(sc);
  }
  function qrSvg(text) { const q = qrcode(0, 'L'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 4, scalable: true }); }
  function qrInto(el, text) { if (el) qrLib(() => { try { el.innerHTML = qrSvg(text); } catch (e) { el.textContent = 'Link terlalu panjang untuk kod QR'; } }); }
  function qrBig(title, text) {
    qrLib(() => {
      const d = document.createElement('div'); d.className = 'kzqrfull'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Kod QR kuiz');
      d.innerHTML = `<h2>${escH(title)}</h2><div class="kzqrbig">${qrSvg(text)}</div><p>Imbas kod QR dengan kamera telefon untuk masuk kuiz</p><button type="button" class="btn sec">Tutup</button>`;
      const close = () => { d.remove(); document.removeEventListener('keydown', esc); };
      const esc = e => { if (e.key === 'Escape') close(); };
      d.onclick = close; document.addEventListener('keydown', esc); document.body.appendChild(d);
    });
  }

  /* ---------- murid ---------- */
  const KM = { code: '', Q: null, qs: [], st: null };
  function loadQuiz(code) {
    if (KM.code === code && KM.Q) return true;
    try { const Q = JSON.parse(b64d(code)); if (!Q || Q.b !== BAB.id || !Array.isArray(Q.q) || !Q.q.length) throw 0; KM.Q = Q; } catch (e) { KM.Q = null; KM.code = code; return false; }
    KM.code = code; KM.qs = KM.Q.q.map(([t, L, s]) => genQ(t, L, s));
    const sk = 'kz-m-' + fnv(code), prev = lsGet(sk) || {}, who = lsGet('kz-nama') || {};
    KM.sk = sk; KM.st = { name: prev.name || who.name || '', kelas: prev.kelas || who.kelas || '', att: prev.att || 0, pass: prev.pass || null, ord: Array.isArray(prev.ord) && prev.ord.length === KM.qs.length ? prev.ord : null, stage: prev.pass ? 'kad' : 'mula', order: [], ans: [], i: 0, last: null };
    return true;
  }
  const saveM = () => { const s = KM.st; lsSet(KM.sk, { name: s.name, kelas: s.kelas, att: s.att, pass: s.pass, ord: s.ord }); };
  function hdr(sub) {
    return `<div class="kzhd"><img src="${BAB.logo}" alt=""><div><b>Teroka<span style="color:var(--pu)">Math</span></b><small>${sub}</small></div>
      <button type="button" class="ib" id="themeBtn" style="margin-left:auto" aria-label="Tukar mod">${isLight() ? IC.moon : IC.sun}</button></div>`;
  }
  function viewMurid(code) {
    if (!loadQuiz(code)) return `<div class="kzwrap">${hdr(`Bab ${BAB.no} : ${BAB.tajuk}`)}<section class="pbox"><h2>Link kuiz tidak sah</h2><p class="lead">Minta guru menghantar semula link kuiz.</p></section></div>`;
    const Q = KM.Q, s = KM.st, n = KM.qs.length, who = s.name ? `${escH(s.name)} · ${escH(s.kelas)}` : `Bab ${BAB.no} : ${BAB.tajuk}`;
    if (s.stage === 'mula') return `<div class="kzwrap">${hdr(`Bab ${BAB.no} : ${BAB.tajuk}`)}<div style="flex:1;display:flex;flex-direction:column;justify-content:center">
      <section class="pbox" style="display:flex;flex-direction:column;gap:12px"><p class="kzlbl" style="color:var(--pu);margin:0">KUIZ ONLINE</p><h2 style="margin:0">${escH(Q.t)}</h2>
        <p style="margin:0;color:var(--mu)">${n} soalan · Lulus <b>${Q.p}/${n}</b> · Boleh cuba berulang kali sehingga lulus${s.att ? ` · Anda sudah mencuba ${s.att} kali` : ''}</p>
        <div><p class="kzlbl">NAMA</p><input class="kzin" id="kzN" maxlength="50" autocomplete="name" value="${escH(s.name)}"></div>
        <div><p class="kzlbl">KELAS</p><input class="kzin" id="kzK" maxlength="20" value="${escH(s.kelas)}"></div>
        <button type="button" class="btn pri big" id="kzStart" style="--tr:var(--pu)">${s.att ? 'Cuba lagi' : 'Mula'}</button></section></div></div>`;
    if (s.stage === 'jawab') {
      const k = s.order[s.i], q = KM.qs[k];
      return `<div class="kzwrap">${hdr(who)}<div style="display:flex;justify-content:space-between;font-weight:700;color:var(--mu)"><span>Soalan ${s.i + 1} / ${n}</span><span>Cubaan ${s.att}</span></div>
        <div class="kzbar"><i style="width:${s.i / n * 100}%"></i></div><div class="kzq">${q.q}</div>${q.fig ? `<div class="kzfig">${q.fig}</div>` : ''}
        <div class="gopts">${q.opts.map((t, i) => `<button type="button" class="gopt${s.fb && s.fb.pick === i ? (s.fb.ok ? ' right' : ' wrong') : ''}" data-o="${i}"${s.fb ? ' disabled' : ''}><span class="k">${'ABCD'[i]}</span><span>${t}</span></button>`).join('')}</div>
        ${s.fb ? `<div class="kzok ${s.fb.ok ? 'y' : 'n'}" style="text-align:center;font-size:18px">${s.fb.ok ? '✓ Betul' : '✗ Salah'}</div><button type="button" class="btn pri big" id="kzNext" style="--tr:var(--pu)">${s.i + 1 < n ? 'Seterusnya' : 'Lihat keputusan'}</button>` : ''}</div>`;
    }
    if (s.stage === 'gagal') {
      const L = s.last, w = L.wrong;
      return `<div class="kzwrap">${hdr(who)}<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:14px">
        <div class="kzbig">${L.sc} / ${n}</div><div style="text-align:center;font-weight:800;color:var(--am)">Belum lulus. Perlu ${Q.p}/${n}.</div>
        <div class="kzbad">Soalan yang salah: <b>${w.length > 1 ? w.slice(0, -1).join(', ') + ' dan ' + w[w.length - 1] : w[0]}</b>.</div>
        <p style="text-align:center;font-weight:700;margin:0">Sikit lagi! Semak soalan yang salah dan cuba sekali lagi.</p>
        <button type="button" class="btn pri big" id="kzAgain" style="--tr:var(--pu)">Cuba lagi (cubaan ${s.att + 1})</button></div></div>`;
    }
    const P = s.pass;
    return `<div class="kzwrap">${hdr(`${escH(P.name)} · ${escH(P.kelas)}`)}<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:12px">
      <div class="kzkad"><span class="k">KAD SIAP · TEROKAMATH</span><span class="nm">${escH(P.name)}</span><span style="font-weight:700">${escH(P.kelas)}</span>
        <span style="font-size:14px;opacity:.92">Bab ${BAB.no} · ${escH(Q.t)}</span><span class="sc">${P.sc} / ${P.tot} ✓</span>
        <span style="font-size:14px">LULUS pada cubaan ke-${P.att} · ${fmtT(new Date(P.when))}</span><span class="code">${P.code}</span></div>
      <p style="text-align:center;color:var(--mu);margin:0">Screenshot kad ini dan hantar kepada guru.</p></div></div>`;
  }
  function startAttempt() {
    const s = KM.st, n = KM.qs.length; s.att++; s.i = 0; s.ans = []; s.fb = null;
    if (!s.ord) s.ord = shuffle([...Array(n).keys()]);
    s.order = s.ord.slice();
    s.stage = 'jawab'; saveM();
  }
  function bindMurid() {
    bindShell();
    const s = KM.st; if (!s) return;
    const st = document.getElementById('kzStart');
    if (st) st.onclick = () => {
      const N = document.getElementById('kzN').value.trim().replace(/\s+/g, ' '), K = document.getElementById('kzK').value.trim().replace(/\s+/g, ' ');
      if (!N || !K) { toast('Isi nama dan kelas dahulu'); return; }
      s.name = N; s.kelas = K; lsSet('kz-nama', { name: N, kelas: K }); startAttempt(); render(); scrollTo(0, 0);
    };
    document.querySelectorAll('.gopt[data-o]').forEach(b => b.onclick = () => {
      if (s.fb) return;
      const pk = +b.dataset.o, ok = pk === KM.qs[s.order[s.i]].c;
      s.ans[s.i] = pk; s.fb = { pick: pk, ok }; try { snd(ok ? 'betul' : 'salah'); } catch (e) {}
      render();
    });
    const nx = document.getElementById('kzNext');
    if (nx) nx.onclick = () => {
      s.fb = null; s.i++;
      if (s.i < KM.qs.length) { render(); scrollTo(0, 0); return; }
      const wrong = []; let sc = 0;
      s.order.forEach((k, pos) => { if (s.ans[pos] === KM.qs[k].c) sc++; else wrong.push(pos + 1); });
      const n = KM.qs.length;
      if (sc >= KM.Q.p) {
        const when = Date.now();
        s.pass = { name: s.name, kelas: s.kelas, sc, tot: n, att: s.att, when, code: makeCode(s.name, s.kelas, '', sc, n, s.att, when) };
        s.stage = 'kad'; saveM(); try { snd('betul'); } catch (e) {}
      } else { s.last = { sc, wrong }; s.stage = 'gagal'; saveM(); }
      render(); scrollTo(0, 0);
    };
    const ag = document.getElementById('kzAgain'); if (ag) ag.onclick = () => { startAttempt(); render(); scrollTo(0, 0); };
  }

  /* ---------- penghala ---------- */
  const _render = render;
  render = function (keepScroll) {
    const p = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (p[0] === 'q' && p[1]) { app.innerHTML = viewMurid(p[1]); document.title = (KM.Q ? KM.Q.t : 'Kuiz') + ' · TerokaMath'; bindMurid(); return; }
    if (p[0] === 'latihan' && p[1] === 'kuiz') {
      const sc = keepScroll && document.getElementById('main') ? document.getElementById('main').scrollTop : 0;
      app.innerHTML = shell('latihan', viewGuru()); document.title = 'Kuiz Online · ' + APPNAME; bindShell(); bindGuru();
      if (keepScroll) { const m = document.getElementById('main'); if (m) m.scrollTop = sc; }
      return;
    }
    return _render(keepScroll);
  };
})();
