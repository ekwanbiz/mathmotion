'use strict';
/* =================== TEORI GRAF · SOALAN BAB 5 RANGKAIAN DALAM TEORI GRAF (Tingkatan 4) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "tg5" / "TG5" supaya tidak bertembung dengan teras.

/* =================== pembantu rawak & teks =================== */
// tg5RG untuk Latihan Kelas / games, tg5RW (berbenih) untuk Lembaran Kerja
const tg5RG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const tg5RW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const tg5Shuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const tg5Dan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);
const tg5Sum = a => a.reduce((s, x) => s + x, 0);

/* =================== struktur graf =================== */
// g = { nm:[nama bucu], pos:[[x,y]], E:[{a, b, w?}], dir:bool }  (a, b = indeks bucu; a === b ialah gelung)
const TG5NAMA = [['A', 'B', 'C', 'D', 'E', 'F'], ['P', 'Q', 'R', 'S', 'T', 'U'], ['J', 'K', 'L', 'M', 'N', 'P'], ['K', 'L', 'M', 'N', 'P', 'Q'], ['S', 'T', 'U', 'V', 'W', 'X']];
const TG5LAY = {
  3: [[70, 62], [250, 62], [160, 190]],
  4: [[72, 58], [248, 58], [248, 184], [72, 184]],
  5: [[160, 36], [252, 102], [216, 202], [104, 202], [68, 102]],
  6: [[62, 66], [160, 30], [258, 66], [258, 178], [160, 212], [62, 178]]
};
const tg5Key = (a, b) => (a < b ? a + ',' + b : b + ',' + a);
function tg5Deg(g) { const d = g.nm.map(() => 0); g.E.forEach(e => { if (e.a === e.b) d[e.a] += 2; else { d[e.a]++; d[e.b]++; } }); return d; }
const tg5Out = (g, v) => g.E.filter(e => e.a === v).length;
const tg5In = (g, v) => g.E.filter(e => e.b === v).length;
function tg5Conn(g) {
  const n = g.nm.length, seen = new Set([0]), st = [0];
  while (st.length) { const u = st.pop(); g.E.forEach(e => { [[e.a, e.b], [e.b, e.a]].forEach(([x, y]) => { if (x === u && !seen.has(y)) { seen.add(y); st.push(y); } }); }); }
  return seen.size === n;
}
function tg5Simple(g) { const s = new Set(); for (const e of g.E) { if (e.a === e.b) return false; const k = tg5Key(e.a, e.b); if (s.has(k)) return false; s.add(k); } return true; }
const tg5Tree = g => tg5Simple(g) && tg5Conn(g) && g.E.length === g.nm.length - 1;
// tepi sebagai teks: (A, B)
const tg5Ed = (g, e) => `(${g.nm[e.a]}, ${g.nm[e.b]})`;
const tg5Vset = g => `{${g.nm.join(', ')}}`;
const tg5Eset = g => `{${g.E.map(e => tg5Ed(g, e)).join(', ')}}`;
function tg5Sort(g) { if (!g.dir) g.E.forEach(e => { if (e.a > e.b) [e.a, e.b] = [e.b, e.a]; }); g.E.sort((x, y) => x.a - y.a || x.b - y.b); return g; }

// graf rawak: n bucu, m tepi biasa (tanpa gelung/berbilang), terkait jika conn
function tg5Make(r, n, m, o = {}) {
  const nm = (o.nm || r.p(TG5NAMA)).slice(0, n), pos = TG5LAY[n].map(p => p.slice());
  const all = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) all.push([i, j]);
  m = Math.min(m, all.length);
  let E;
  for (let t = 0; t < 200; t++) {
    const used = new Set(); E = [];
    if (o.conn !== false) { const ord = tg5Shuf(r, [...Array(n).keys()]); for (let i = 1; i < n; i++) { const a = ord[i], b = ord[r.i(0, i - 1)]; used.add(tg5Key(a, b)); E.push({ a: Math.min(a, b), b: Math.max(a, b) }); } }
    for (const [a, b] of tg5Shuf(r, all)) { if (E.length >= m) break; if (!used.has(tg5Key(a, b))) { used.add(tg5Key(a, b)); E.push({ a, b }); } }
    if (E.length === m) break;
  }
  return tg5Sort({ nm, pos, E, dir: false });
}
// tambah gelung pada bucu v dan/atau satu tepi berganda
function tg5AddLoop(g, v) { g.E.push({ a: v, b: v }); return tg5Sort(g); }
function tg5AddMulti(r, g) { const ok = g.E.filter(e => e.a !== e.b); const e = r.p(ok); g.E.push({ a: e.a, b: e.b }); return tg5Sort(g); }

/* =================== rajah graf (var(--…)) =================== */
const tg5T = (x, y, t, c = 'tx', sz = 16, a = 'middle', halo = true) => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})${halo ? ';stroke:var(--diag);stroke-width:5px;paint-order:stroke;stroke-linejoin:round' : ''}" font-size="${sz}" font-weight="700" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const tg5Head = (tip, ux, uy, c) => { const k = 12, nx = -uy, ny = ux; return `<polygon points="${+tip[0].toFixed(1)},${+tip[1].toFixed(1)} ${+(tip[0] - ux * k + nx * k * .55).toFixed(1)},${+(tip[1] - uy * k + ny * k * .55).toFixed(1)} ${+(tip[0] - ux * k - nx * k * .55).toFixed(1)},${+(tip[1] - uy * k - ny * k * .55).toFixed(1)}" style="fill:var(--${c});stroke:var(--${c})" stroke-width="1.5" stroke-linejoin="round"/>`; };
function tg5W(x, y, t, c = 'am') {
  const w = String(t).length * 8.6 + 12;
  return `<rect x="${+(x - w / 2).toFixed(1)}" y="${+(y - 12).toFixed(1)}" width="${+w.toFixed(1)}" height="24" rx="8" style="fill:var(--diag);stroke:var(--${c})" stroke-width="2"/>` + tg5T(x, y + 1, t, c, 14, 'middle', false);
}
// o: { col, vc, hl:Set(indeks tepi), hlc, dim:Set, vr, sub:{indeks bucu: label bawah}, cx, cy }
function tg5G(g, o = {}) {
  const col = o.col || 'tr', vr = o.vr || 15, cx = o.cx ?? 160, cy = o.cy ?? 120;
  const cnt = {}, idx = {};
  g.E.forEach(e => { if (e.a !== e.b) { const k = tg5Key(e.a, e.b); cnt[k] = (cnt[k] || 0) + 1; } });
  let s = '', w = '';
  g.E.forEach((e, i) => {
    const c = o.hl && o.hl.has(i) ? (o.hlc || 'gr') : o.dim && o.dim.has(i) ? 'dim' : col, sw = o.hl && o.hl.has(i) ? 5 : 3.5;
    const dash = o.dim && o.dim.has(i) ? ' stroke-dasharray="6 6"' : '';
    const p = g.pos[e.a], q = g.pos[e.b];
    if (e.a === e.b) {
      let ux = p[0] - cx, uy = p[1] - cy; const L = Math.hypot(ux, uy) || 1; ux /= L; uy /= L;
      const R = 12, lx = p[0] + ux * (vr + R - 3), ly = p[1] + uy * (vr + R - 3);
      s += `<circle cx="${+lx.toFixed(1)}" cy="${+ly.toFixed(1)}" r="${R}" style="fill:none;stroke:var(--${c})" stroke-width="${sw}"${dash}/>`;
      if (e.w != null) w += tg5W(p[0] + ux * (vr + 2 * R + 12), p[1] + uy * (vr + 2 * R + 12), e.w);
      return;
    }
    const k = tg5Key(e.a, e.b), n = cnt[k], j = idx[k] = (idx[k] ?? -1) + 1;
    const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const bend = n > 1 ? (j - (n - 1) / 2) * 30 : 0;
    const mx = (p[0] + q[0]) / 2 + nx * bend, my = (p[1] + q[1]) / 2 + ny * bend;
    const kx = (p[0] + q[0]) / 2 + nx * bend * 2, ky = (p[1] + q[1]) / 2 + ny * bend * 2;
    s += bend ? `<path d="M${p[0]} ${p[1]} Q${+kx.toFixed(1)} ${+ky.toFixed(1)} ${q[0]} ${q[1]}" style="fill:none;stroke:var(--${c})" stroke-width="${sw}" stroke-linecap="round"${dash}/>`
      : `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" style="stroke:var(--${c})" stroke-width="${sw}" stroke-linecap="round"${dash}/>`;
    if (g.dir) {
      let tx = ux, ty = uy;
      if (bend) { tx = q[0] - kx; ty = q[1] - ky; const tl = Math.hypot(tx, ty); tx /= tl; ty /= tl; }
      s += tg5Head([q[0] - tx * (vr + 2), q[1] - ty * (vr + 2)], tx, ty, c);
    }
    if (e.w != null) w += tg5W(mx, my, e.w, o.wc || 'am');
  });
  g.nm.forEach((nm, i) => {
    const [x, y] = g.pos[i], vc = (o.vcol && o.vcol[i]) || o.vc || 'am';
    s += `<circle cx="${x}" cy="${y}" r="${vr}" style="fill:var(--surf);stroke:var(--${vc})" stroke-width="3.5"/>` + tg5T(x, y + 1, nm, 'tx', vr > 13 ? 16 : 13, 'middle', false);
    if (o.sub && o.sub[i]) s += tg5T(x, y + (y > cy ? vr + 13 : -vr - 13), o.sub[i], 'mu', 13);
  });
  return s + w;
}
const tg5Svg = (g, o = {}, label) => `<svg viewBox="${o.sub ? '0 -18 320 276' : '0 0 320 240'}" role="img" aria-label="${esc(label || 'Graf')}" font-family="Inter, sans-serif">${tg5G(g, o)}</svg>`;
// dua graf bersebelahan (G dan H)
function tg5Svg2(g1, g2, l1, l2, label) {
  const sc = .72;
  return `<svg viewBox="0 0 480 214" role="img" aria-label="${esc(label || 'Dua graf')}" font-family="Inter, sans-serif">`
    + `<rect x="4" y="4" width="232" height="206" rx="16" style="fill:none;stroke:var(--bd)" stroke-width="2"/><rect x="244" y="4" width="232" height="206" rx="16" style="fill:none;stroke:var(--bd)" stroke-width="2"/>`
    + `<g transform="translate(4 18) scale(${sc})">${tg5G(g1, { col: 'tr' })}</g><g transform="translate(244 18) scale(${sc})">${tg5G(g2, { col: 'pa' })}</g>`
    + tg5T(22, 22, l1, 'tr', 18, 'start') + tg5T(262, 22, l2, 'pa', 18, 'start') + '</svg>';
}

/* =================== templat rangkaian berpemberat =================== */
// T6: A kiri, F kanan; T5: A kiri, D/E kanan. diag = pilihan tepi pepenjuru
const TG5T6 = { pos: [[36, 120], [120, 44], [120, 196], [214, 44], [214, 196], [288, 120]], base: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5]], diag: [[1, 4], [2, 3]], s: 0, t: 5 };
const TG5T5 = { pos: [[40, 120], [146, 44], [146, 196], [276, 44], [276, 196]], base: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4]], diag: [[1, 4], [2, 3]], s: 0, t: 4 };
function tg5Paths(g, s, t) {
  const out = [], adj = g.nm.map(() => []);
  g.E.forEach((e, i) => { adj[e.a].push([e.b, i]); if (!g.dir) adj[e.b].push([e.a, i]); });
  const go = (u, path, es) => { if (u === t) { out.push({ v: path.slice(), e: es.slice(), w: tg5Sum(es.map(i => g.E[i].w || 0)) }); return; } for (const [v, i] of adj[u]) if (!path.includes(v)) { path.push(v); es.push(i); go(v, path, es); path.pop(); es.pop(); } };
  go(s, [s], []);
  return out;
}
const tg5PStr = (g, p) => p.v.map(i => g.nm[i]).join(' → ');
const tg5PSum = (g, p) => `${p.e.map(i => g.E[i].w).join(' + ')} = ${p.w}`;
// rangkaian berpemberat dengan laluan terpendek unik dari s ke t
function tg5Wnet(r, o = {}) {
  const T = o.five ? TG5T5 : TG5T6, nm = o.nm || r.p(TG5NAMA);
  for (let tries = 0; tries < 400; tries++) {
    const pairs = T.base.concat(r.f() < .6 ? [r.p(T.diag)] : []);
    const E = pairs.map(([a, b]) => {
      let A = a, B = b;
      if (o.dir) { const pa = T.pos[a], pb = T.pos[b]; if (pa[0] > pb[0] || (pa[0] === pb[0] && r.f() < .5)) { A = b; B = a; } }
      return { a: A, b: B, w: r.i(o.lo || 1, o.hi || 9) };
    });
    const g = { nm: nm.slice(0, T.pos.length), pos: T.pos.map(p => p.slice()), E, dir: !!o.dir };
    const P = tg5Paths(g, T.s, T.t); if (P.length < 3) continue;
    const mn = Math.min(...P.map(p => p.w)), best = P.filter(p => p.w === mn);
    if (best.length !== 1) continue;
    const minE = Math.min(...P.map(p => p.e.length));
    if (o.tricky && best[0].e.length === minE) continue;     // laluan terpendek bukan laluan paling sedikit tepi
    return { g, P, best: best[0], s: T.s, t: T.t };
  }
  return null;
}

/* =================== data bersama =================== */
const TG5BS1 = [
  ['Darjah sesuatu bucu ialah bilangan tepi yang bersambung dengan bucu itu.', true, 'Ini ialah takrif darjah bucu.'],
  ['Satu gelung pada bucu A menambah 1 kepada darjah A.', false, 'Gelung menyentuh bucu A pada dua hujung, jadi ia menambah 2 kepada darjah A.'],
  ['Jumlah darjah semua bucu dalam sebuah graf ialah dua kali bilangan tepi.', true, 'Setiap tepi mempunyai dua hujung, jadi setiap tepi menyumbang 2 kepada jumlah darjah.'],
  ['Graf mudah boleh mempunyai gelung.', false, 'Graf mudah tiada gelung dan tiada berbilang tepi.'],
  ['Jumlah darjah sebuah graf boleh menjadi nombor ganjil.', false, 'Jumlah darjah = 2 × bilangan tepi, maka sentiasa nombor genap.'],
  ['Berbilang tepi ialah dua atau lebih tepi yang menyambungkan pasangan bucu yang sama.', true, 'Ini ialah takrif berbilang tepi.'],
  ['Titik persilangan dua tepi dalam lukisan graf ialah satu bucu.', false, 'Bucu hanya titik yang ditanda. Dua tepi boleh bersilang tanpa bertemu di bucu.'],
  ['Rangkaian ialah graf yang mempunyai sekurang-kurangnya sepasang bucu yang disambungkan.', true, 'Ini ialah takrif rangkaian.']
];
const TG5BS2 = [
  ['Dalam graf terarah, tepi (A, B) sama dengan tepi (B, A).', false, 'Dalam graf terarah, (A, B) bermaksud dari A ke B, manakala (B, A) bermaksud dari B ke A.'],
  ['Graf berpemberat mempunyai nilai pada setiap tepinya.', true, 'Nilai itu dipanggil pemberat, contohnya jarak, masa atau kos.'],
  ['Tepi yang dilukis lebih panjang sentiasa mempunyai pemberat yang lebih besar.', false, 'Panjang lukisan tidak penting. Pemberat dibaca daripada nilai yang ditulis pada tepi.'],
  ['Arah setiap tepi dalam graf terarah ditunjukkan dengan anak panah.', true, 'Anak panah menunjukkan arah dari bucu permulaan ke bucu akhir.'],
  ['Sebuah graf boleh menjadi terarah dan berpemberat pada masa yang sama.', true, 'Contohnya peta jalan sehala yang menunjukkan jarak.'],
  ['Rangkaian rakan yang saling berkawan paling sesuai diwakili oleh graf terarah.', false, 'Hubungan berkawan adalah dua hala, maka graf tidak terarah lebih sesuai.'],
  ['Pemberat boleh mewakili jarak, masa atau kos.', true, 'Pemberat ialah nilai pada tepi yang mewakili kuantiti seperti jarak, masa atau kos.'],
  ['Graf tidak terarah tidak boleh mempunyai pemberat.', false, 'Graf tidak terarah boleh berpemberat, contohnya peta jalan dua hala dengan jarak.']
];
const TG5BS3 = [
  ['Pokok tidak mempunyai sebarang litar.', true, 'Pokok ialah graf terkait yang tiada litar.'],
  ['Sebuah pokok dengan 8 bucu mempunyai 8 tepi.', false, 'Bilangan tepi pokok = bilangan bucu − 1 = 8 − 1 = 7.'],
  ['Subgraf boleh mempunyai tepi yang tiada dalam graf asal.', false, 'Semua bucu dan tepi subgraf mesti datang daripada graf asal.'],
  ['Setiap graf ialah subgraf bagi dirinya sendiri.', true, 'Semua bucu dan tepinya ialah bucu dan tepi graf itu sendiri.'],
  ['Sebarang graf dengan bilangan tepi = bilangan bucu − 1 ialah pokok.', false, 'Graf itu juga mesti terkait dan tiada litar. Contohnya segi tiga dengan satu bucu terasing bukan pokok.'],
  ['Dalam pokok, hanya ada satu laluan antara mana-mana dua bucu.', true, 'Jika ada dua laluan, kedua-duanya akan membentuk litar.'],
  ['Pokok boleh mempunyai gelung.', false, 'Gelung ialah litar, dan pokok tiada litar.'],
  ['Jika satu bucu dibuang daripada graf, semua tepi yang bersambung dengannya juga dibuang.', true, 'Tepi tidak boleh wujud tanpa bucu di kedua-dua hujungnya.']
];
const TG5SIT = [
  ['rangkaian rakan di media sosial, dengan kedua-dua pihak mesti bersetuju untuk menjadi rakan', false, false, 'Hubungan rakan adalah dua hala dan tiada nilai pada tepi.'],
  ['pengikut di aplikasi media sosial, dengan A boleh mengikut B tanpa B mengikut A', true, false, 'Hubungan mengikut adalah sehala dan tiada nilai pada tepi.'],
  ['peta jalan dua hala yang menunjukkan jarak antara bandar', false, true, 'Jalan dua hala tiada arah, dan jarak ialah pemberat.'],
  ['jalan sehala di pusat bandar yang menunjukkan masa perjalanan', true, true, 'Jalan sehala ada arah, dan masa ialah pemberat.'],
  ['salasilah keluarga yang menunjukkan ibu bapa kepada anak', true, false, 'Hubungan ibu bapa kepada anak adalah sehala dan tiada nilai pada tepi.'],
  ['laluan LRT dua hala yang menunjukkan masa perjalanan antara stesen', false, true, 'Tren bergerak dua hala, dan masa ialah pemberat.'],
  ['penghantaran e-mel yang menunjukkan siapa menghantar e-mel kepada siapa', true, false, 'Penghantaran e-mel adalah sehala dan tiada nilai pada tepi.'],
  ['rangkaian kabel elektrik antara rumah yang menunjukkan kos pemasangan setiap kabel', false, true, 'Kabel menyambung dua hala, dan kos ialah pemberat.'],
  ['penerbangan sehala syarikat penerbangan yang menunjukkan harga tiket', true, true, 'Penerbangan sehala ada arah, dan harga tiket ialah pemberat.']
];
const tg5JenisTxt = (d, w) => `Graf ${d ? 'terarah' : 'tidak terarah'} dan ${w ? 'berpemberat' : 'tidak berpemberat'}`;
const TG5ORANG = ['Aina', 'Ben', 'Chong', 'Devi', 'Emir', 'Farah', 'Gopal', 'Hana', 'Iqbal', 'Jia Hui', 'Kumar', 'Lina', 'Mei', 'Nabil', 'Puteri', 'Rizal', 'Sofia', 'Tan', 'Umar', 'Wani'];
const TG5BANDAR = [['Alor Setar', 'Kangar', 'Sungai Petani', 'George Town', 'Ipoh', 'Taiping'], ['Kuala Lumpur', 'Seremban', 'Melaka', 'Muar', 'Batu Pahat', 'Johor Bahru'], ['Kota Bharu', 'Kuala Terengganu', 'Kuantan', 'Temerloh', 'Jerantut', 'Gua Musang'], ['Kuching', 'Sibu', 'Bintulu', 'Miri', 'Sri Aman', 'Kapit'], ['Kota Kinabalu', 'Sandakan', 'Tawau', 'Lahad Datu', 'Keningau', 'Kudat']];
const TG5UNIT = [['km', 'jarak', 'jarak'], ['minit', 'masa', 'masa perjalanan'], ['RM', 'kos', 'tambang']];
const tg5U = (u, v) => (u[0] === 'RM' ? `RM${v}` : `${v} ${u[0]}`);

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 5.1.1 Graf & Darjah ---------- */
  darjah: [
    ({ v }) => ({ q: `Rajah di bawah menunjukkan sebuah graf. Nyatakan darjah bucu ${v}.` }),
    ({ v }) => ({ q: `Berdasarkan graf di bawah, cari d(${v}).` }),
    ({ v }) => ({ q: `Graf di bawah mewakili jalan yang menghubungkan beberapa kampung. Apakah darjah bucu ${v}?` }),
    ({ v, wrong, why, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata darjah bucu ${v} dalam graf di bawah ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, why)); },
    ({ v }) => ({ q: `Lengkapkan: Dalam graf di bawah, d(${v}) = ___` })
  ],
  bilVE: [
    () => ({ q: 'Rajah di bawah menunjukkan sebuah graf. Nyatakan bilangan bucu dan bilangan tepi graf itu.' }),
    () => ({ q: 'Berdasarkan graf di bawah, cari n(V) dan n(E).' }),
    () => ({ q: 'Graf di bawah mewakili beberapa stesen bas dan jalan yang menghubungkannya. Berapakah bilangan bucu dan bilangan tepi?' }),
    () => ({ q: 'Kira bilangan bucu dan bilangan tepi dalam graf di bawah. Ingat: gelung dan berbilang tepi juga dikira sebagai tepi.' })
  ],
  jumDarjah: [
    ({ V, E }) => ({ q: `Diberi V = ${V} dan E = ${E}. Cari jumlah darjah semua bucu graf itu.` }),
    ({ V, E }) => ({ q: `Sebuah graf G mempunyai V = ${V} dan E = ${E}. Hitung jumlah darjah bucu-bucu G.` }),
    ({ E }) => ({ q: `Set tepi sebuah graf ialah E = ${E}. Tanpa melukis graf, tentukan jumlah darjah semua bucunya.` }),
    ({ E, m }) => ({ q: `Lengkapkan: Graf dengan E = ${E} mempunyai ${m} tepi, maka jumlah darjah = 2 × ${m} = ___` })
  ],
  mudah: [
    () => ({ q: 'Adakah graf di bawah ialah graf mudah? Beri sebab.' }),
    () => ({ q: 'Nyatakan sama ada graf di bawah ialah graf mudah atau bukan. Terangkan.' }),
    ({ ans }) => { const N = vnama(); return { q: `${N} berkata graf di bawah ialah graf mudah. Adakah ${N} betul? Terangkan.`, ans: ans.startsWith('Ya') ? `Ya, ${N} betul, ${ans.slice(4)}` : `Tidak, ${N} tidak betul, ${ans.slice(7)}` }; },
    () => ({ q: 'Perhatikan graf di bawah. Adakah ia mempunyai gelung atau berbilang tepi? Seterusnya nyatakan sama ada ia graf mudah.' })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  tepiDarjah: [
    ({ n, ds }) => ({ q: `Sebuah graf mempunyai ${n} bucu dengan darjah ${tg5Dan(ds)}. Berapakah bilangan tepi graf itu?` }),
    ({ n, ds }) => ({ q: `Sebuah rangkaian jalan raya menghubungkan ${n} bandar. Darjah setiap bandar ialah ${tg5Dan(ds)}. Berapakah bilangan jalan raya dalam rangkaian itu?` }),
    ({ ds, ans }) => { const N = vnama(); return Object.assign({ q: `Darjah bucu-bucu sebuah graf ialah ${tg5Dan(ds)}. ${N} berkata bilangan tepinya ialah ${tg5Sum(ds)}. Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa bahawa jumlah darjah ialah 2 × bilangan tepi.`)); },
    ({ ds }) => ({ q: `Lengkapkan: Jumlah darjah = ${ds.join(' + ')} = ${tg5Sum(ds)}, maka bilangan tepi = ___` })
  ],
  darjahHilang: [
    ({ m, nm, ds }) => ({ q: `Sebuah graf mempunyai ${m} tepi. Darjah bucu ${tg5Dan(nm.slice(0, -1))} masing-masing ialah ${tg5Dan(ds.slice(0, -1))}. Cari darjah bucu ${nm[nm.length - 1]}.` }),
    ({ m, nm, ds }) => ({ q: `Graf G mempunyai ${nm.length} bucu dan ${m} tepi. Diberi ${nm.slice(0, -1).map((v, i) => `d(${v}) = ${ds[i]}`).join(', ')}. Cari d(${nm[nm.length - 1]}).` }),
    ({ m, nm, ds }) => ({ q: `Sebuah rangkaian mempunyai ${m} tepi. ${nm.length - 1} bucu mempunyai darjah ${tg5Dan(ds.slice(0, -1))}. Bucu terakhir, ${nm[nm.length - 1]}, mempunyai darjah x. Cari nilai x.` })
  ],
  senaraiVE: [
    () => ({ q: 'Berdasarkan graf di bawah, senaraikan set bucu, V dan set tepi, E.' }),
    () => ({ q: 'Tuliskan graf di bawah dalam bentuk G = (V, E).' }),
    () => ({ q: 'Rajah di bawah menunjukkan sebuah graf G. Nyatakan V(G) dan E(G).' })
  ],
  k511: [
    ({ L }) => ({ q: `Dalam satu kejohanan, ${L.n} pasukan bermain. Setiap pasukan bermain tepat sekali dengan setiap pasukan lain. Kejohanan ini diwakili oleh graf: pasukan sebagai bucu dan perlawanan sebagai tepi. (a) Nyatakan darjah setiap bucu. (b) Hitung bilangan perlawanan.`, ans: `(a) ${L.n - 1} (b) ${L.n * (L.n - 1) / 2} perlawanan`, work: [`(a) Setiap pasukan menentang ${L.n} − 1 = ${L.n - 1} pasukan lain, maka darjah setiap bucu = ${L.n - 1}.`, `(b) Jumlah darjah = ${L.n} × ${L.n - 1} = ${L.n * (L.n - 1)}`, `Bilangan tepi = ${L.n * (L.n - 1)} ÷ 2 = ${L.n * (L.n - 1) / 2}`] }),
    ({ O }) => ({ q: `Adakah wujud sebuah graf dengan ${O.ds.length} bucu yang mempunyai darjah ${tg5Dan(O.ds)}? Terangkan.`, ans: `Tidak wujud, kerana jumlah darjah = ${tg5Sum(O.ds)} ialah nombor ganjil`, work: [`Jumlah darjah = ${O.ds.join(' + ')} = ${tg5Sum(O.ds)}`, 'Jumlah darjah mesti sama dengan 2 × bilangan tepi, iaitu nombor genap.', `${tg5Sum(O.ds)} ialah nombor ganjil, maka graf itu tidak wujud.`] }),
    ({ Mx }) => ({ q: `Sebuah graf mempunyai V = ${Mx.V} dan E = ${Mx.E}. (a) Nyatakan darjah setiap bucu. (b) Tunjukkan bahawa jumlah darjah = 2 × bilangan tepi. (c) Adakah graf ini graf mudah? Terangkan.`, ans: `(a) ${Mx.dtxt} (b) ${Mx.sum} = 2 × ${Mx.m} (c) Bukan, kerana ada gelung dan berbilang tepi`, work: [`(a) ${Mx.dtxt} (gelung dikira 2)`, `(b) Jumlah darjah = ${Mx.ds.join(' + ')} = ${Mx.sum}; bilangan tepi = ${Mx.m}; 2 × ${Mx.m} = ${Mx.sum}`, `(c) ${Mx.loop} ialah gelung dan ${Mx.multi} muncul dua kali (berbilang tepi), maka bukan graf mudah.`] }),
    ({ Rg }) => ({ q: `Sebuah graf mudah mempunyai ${Rg.n} bucu dan setiap bucu berdarjah ${Rg.d}. (a) Hitung bilangan tepi. (b) Jika satu tepi baharu ditambah, berapakah jumlah darjah yang baharu?`, ans: `(a) ${Rg.n * Rg.d / 2} (b) ${Rg.n * Rg.d + 2}`, work: [`(a) Jumlah darjah = ${Rg.n} × ${Rg.d} = ${Rg.n * Rg.d}`, `Bilangan tepi = ${Rg.n * Rg.d} ÷ 2 = ${Rg.n * Rg.d / 2}`, `(b) Satu tepi menambah 2 kepada jumlah darjah: ${Rg.n * Rg.d} + 2 = ${Rg.n * Rg.d + 2}`] })
  ],

  /* ---------- 5.1.2 Terarah & Pemberat ---------- */
  jenisG: [
    () => ({ q: 'Nyatakan sama ada graf di bawah terarah atau tidak terarah, dan berpemberat atau tidak berpemberat.' }),
    () => ({ q: 'Kelaskan graf di bawah mengikut arah dan pemberat tepinya.' }),
    () => ({ q: 'Rajah di bawah menunjukkan sebuah rangkaian. Apakah jenis graf ini?' }),
    ({ ans, wrong }) => { const N = vnama(); return Object.assign({ q: `${N} berkata graf di bawah ialah ${wrong.toLowerCase()}. Adakah ${N} betul?` }, salah(N, ans, 'Semak sama ada tepi mempunyai anak panah (terarah) dan nilai (berpemberat).')); }
  ],
  situasi: [
    ({ s }) => ({ q: `Situasi: ${s}. Adakah graf yang mewakili situasi ini terarah atau tidak terarah, dan berpemberat atau tidak berpemberat?` }),
    ({ s }) => ({ q: `Nyatakan jenis graf yang paling sesuai untuk mewakili ${s}.` }),
    ({ s }) => ({ q: `Sebuah rangkaian dilukis untuk mewakili ${s}. Kelaskan graf itu.` })
  ],
  keluarMasuk: [
    ({ v, io }) => ({ q: `Rajah di bawah menunjukkan sebuah graf terarah. Berapakah bilangan tepi yang ${io} bucu ${v}?` }),
    ({ v, io }) => ({ q: `Graf terarah di bawah mewakili jalan sehala. Berapakah bilangan jalan yang ${io} persimpangan ${v}?` }),
    ({ v, io }) => ({ q: `Berdasarkan graf terarah di bawah, kira tepi yang ${io} bucu ${v}.` }),
    ({ v, io }) => ({ q: `Graf terarah di bawah menunjukkan siapa menghantar mesej kepada siapa. Berapakah bilangan anak panah yang ${io} ${v}?` })
  ],
  jumPemberat: [
    ({ path, u }) => ({ q: `Graf berpemberat di bawah menunjukkan ${u[2]} (${u[0]}). Hitung jumlah pemberat bagi laluan ${path}.` }),
    ({ path, u }) => ({ q: `Berdasarkan graf di bawah, pemberat setiap tepi ialah ${u[1]} dalam ${u[0]}. Berapakah jumlah ${u[1]} bagi laluan ${path}?` }),
    ({ path }) => ({ q: `Cari jumlah pemberat laluan ${path} dalam graf di bawah.` }),
    ({ path, u, ans }) => { const N = vnama(); return { q: `${N} melalui laluan ${path} dalam rangkaian di bawah. Pemberat ialah ${u[2]} (${u[0]}). Berapakah jumlah ${u[1]} perjalanan ${N}?`, ans }; }
  ],
  laluanCepat: [
    ({ s, t, u }) => ({ q: `Graf terarah di bawah menunjukkan jalan sehala dan ${u[2]} (${u[0]}). Cari laluan dari ${s} ke ${t} yang mempunyai jumlah ${u[1]} paling kecil.` }),
    ({ s, t }) => ({ q: `Dengan mengikut arah anak panah, tentukan laluan dari ${s} ke ${t} yang jumlah pemberatnya minimum. Nyatakan jumlah pemberat itu.` }),
    ({ s, t }) => ({ q: `Senaraikan semua laluan dari ${s} ke ${t} dalam graf terarah di bawah. Seterusnya, kenal pasti laluan dengan jumlah pemberat terkecil.` }),
    ({ s, t, u }) => ({ q: `Sebuah van penghantaran bergerak dari ${s} ke ${t} melalui jalan sehala dalam rajah di bawah. Pemberat ialah ${u[2]} (${u[0]}). Laluan manakah paling jimat?` })
  ],
  tertib: [
    () => ({ q: 'Senaraikan semua tepi graf terarah di bawah sebagai pasangan bertertib.' }),
    () => ({ q: 'Tuliskan set tepi, E bagi graf terarah di bawah. Ingat: tertib bucu dalam setiap pasangan penting.' }),
    () => ({ q: 'Graf terarah di bawah mewakili laluan sehala. Nyatakan set E.' })
  ],
  k512: [
    ({ D }) => ({ q: `Rajah di bawah menunjukkan jalan sehala dan masa perjalanan (minit) antara beberapa lokasi. (a) Senaraikan semua laluan dari ${D.s} ke ${D.t}. (b) Laluan manakah paling cepat? Berapakah masanya?`, ans: `(a) ${D.list} (b) ${D.best}, ${D.bw} minit`, work: D.work }),
    ({ D }) => ({ q: `Rajah di bawah menunjukkan rangkaian terarah berpemberat. Pemberat ialah kos (RM). (a) Berapakah bilangan laluan dari ${D.s} ke ${D.t}? (b) Cari laluan dengan kos minimum dan nyatakan kosnya.`, ans: `(a) ${D.n} laluan (b) ${D.best}, RM${D.bw}`, work: D.work }),
    ({ D }) => ({ q: `Graf terarah berpemberat di bawah mewakili laluan penghantaran (km). (a) Nyatakan laluan terpendek dari ${D.s} ke ${D.t}. (b) Berapakah perbezaan jarak antara laluan terpanjang dengan laluan terpendek?`, ans: `(a) ${D.best}, ${D.bw} km (b) ${D.mx} − ${D.bw} = ${D.mx - D.bw} km`, work: D.work.concat([`Laluan terpanjang: ${D.mx} km, maka perbezaan = ${D.mx} − ${D.bw} = ${D.mx - D.bw} km`]) })
  ],

  /* ---------- 5.1.3 Subgraf & Pokok ---------- */
  subYa: [
    () => ({ q: 'Rajah di bawah menunjukkan graf G dan graf H. Adakah H subgraf bagi G? Beri sebab.' }),
    () => ({ q: 'Tentukan sama ada graf H ialah subgraf bagi graf G. Terangkan.' }),
    ({ ans }) => { const N = vnama(); return { q: `${N} berkata graf H ialah subgraf bagi graf G dalam rajah di bawah. Adakah ${N} betul?`, ans: ans.startsWith('Ya') ? `Ya, ${N} betul, ${ans.slice(4)}` : `Tidak, ${N} tidak betul, ${ans.slice(7)}` }; },
    () => ({ q: 'Bandingkan bucu dan tepi graf H dengan graf G. Adakah H subgraf bagi G?' })
  ],
  pokokYa: [
    () => ({ q: 'Adakah graf di bawah ialah pokok? Beri sebab.' }),
    () => ({ q: 'Nyatakan sama ada graf di bawah ialah pokok atau bukan. Terangkan.' }),
    ({ ans }) => { const N = vnama(); return { q: `${N} berkata graf di bawah ialah pokok. Adakah ${N} betul? Terangkan.`, ans: ans.startsWith('Ya') ? `Ya, ${N} betul, ${ans.slice(4)}` : `Tidak, ${N} tidak betul, ${ans.slice(7)}` }; },
    () => ({ q: 'Semak sama ada graf di bawah terkait dan tiada litar. Seterusnya tentukan sama ada graf itu pokok.' })
  ],
  tepiPokok: [
    ({ n, find }) => ({ q: find === 'e' ? `Sebuah pokok mempunyai ${n} bucu. Berapakah bilangan tepinya?` : `Sebuah pokok mempunyai ${n - 1} tepi. Berapakah bilangan bucunya?` }),
    ({ n, find }) => ({ q: find === 'e' ? `Sebanyak ${n} buah rumah perlu disambung dengan kabel supaya semua rumah bersambung dan tiada litar (sebuah pokok). Berapakah bilangan kabel yang diperlukan?` : `Sebuah rangkaian kabel berbentuk pokok menggunakan ${n - 1} kabel. Berapakah bilangan rumah yang disambungkan?`, ans: find === 'e' ? `${n - 1} kabel` : `${n} buah rumah` }),
    ({ n, find }) => ({ q: find === 'e' ? `Lengkapkan: Pokok dengan ${n} bucu mempunyai ${n} − 1 = ___ tepi.` : `Lengkapkan: Pokok dengan ${n - 1} tepi mempunyai ${n - 1} + 1 = ___ bucu.` }),
    ({ n, find, ans }) => { const N = vnama(); const w = find === 'e' ? n : n - 2; return Object.assign({ q: find === 'e' ? `${N} berkata sebuah pokok dengan ${n} bucu mempunyai ${w} tepi. Adakah ${N} betul?` : `${N} berkata sebuah pokok dengan ${n - 1} tepi mempunyai ${w} bucu. Adakah ${N} betul?` }, salah(N, ans, find === 'e' ? `${N} menyamakan bilangan tepi dengan bilangan bucu.` : `${N} menolak 1 daripada bilangan tepi, sedangkan sepatutnya menambah 1.`)); }
  ],
  buangTepi: [
    ({ n, m }) => ({ q: `Graf terkait di bawah mempunyai ${n} bucu dan ${m} tepi. Berapakah bilangan tepi yang perlu dibuang supaya graf itu menjadi pokok yang merangkumi semua bucu?` }),
    () => ({ q: 'Berapakah bilangan minimum tepi yang perlu dibuang daripada graf di bawah untuk mendapatkan sebuah pokok yang masih menyambungkan semua bucu?' }),
    () => ({ q: 'Sebuah syarikat ingin mengurangkan kabel dalam rangkaian di bawah tetapi semua bucu mesti kekal bersambung tanpa litar. Berapakah bilangan kabel yang boleh dibuang?' }),
    ({ n, m }) => ({ q: `Lengkapkan: Graf di bawah ada ${n} bucu dan ${m} tepi. Pokok perlu ${n} − 1 = ${n - 1} tepi, maka bilangan tepi dibuang = ___` })
  ],
  buangBucu: [
    ({ v }) => ({ q: `Bucu ${v} dan semua tepi yang bersambung dengannya dibuang daripada graf di bawah. Berapakah bilangan tepi dalam subgraf yang tinggal?` }),
    ({ v }) => ({ q: `Satu subgraf dibina dengan membuang bucu ${v} daripada graf di bawah. Berapakah bilangan bucu dan bilangan tepi subgraf itu?`, ans: null }),
    ({ v }) => ({ q: `Stesen ${v} dalam rangkaian di bawah ditutup, jadi semua laluan ke stesen itu juga ditutup. Berapakah bilangan laluan yang masih ada?` })
  ],
  k513: [
    ({ A }) => ({ q: `Rajah di bawah menunjukkan graf G dengan ${A.n} bucu dan ${A.m} tepi. (a) Berapakah bilangan tepi bagi pokok yang merangkumi semua bucu G? (b) Berapakah bilangan tepi yang perlu dibuang? (c) Lukis satu pokok bagi G.`, ans: `(a) ${A.n - 1} (b) ${A.m - A.n + 1} (c) Contoh: ${A.tree} (rajah jawapan)`, work: [`(a) Tepi pokok = ${A.n} − 1 = ${A.n - 1}`, `(b) Tepi dibuang = ${A.m} − ${A.n - 1} = ${A.m - A.n + 1}`, `(c) Pilih ${A.n - 1} tepi yang menyambungkan semua bucu tanpa litar, contohnya ${A.tree}. Jawapan lain yang memenuhi syarat juga diterima.`] }),
    ({ Bp }) => ({ q: `Sebuah pokok mempunyai ${Bp.n} bucu. Darjah ${Bp.n - 1} daripada bucunya ialah ${tg5Dan(Bp.ds.slice(0, -1))}. (a) Berapakah bilangan tepi pokok itu? (b) Cari darjah bucu yang terakhir.`, ans: `(a) ${Bp.n - 1} (b) ${Bp.ds[Bp.ds.length - 1]}`, work: [`(a) Tepi = ${Bp.n} − 1 = ${Bp.n - 1}`, `(b) Jumlah darjah = 2 × ${Bp.n - 1} = ${2 * (Bp.n - 1)}`, `Darjah bucu terakhir = ${2 * (Bp.n - 1)} − (${Bp.ds.slice(0, -1).join(' + ')}) = ${2 * (Bp.n - 1)} − ${tg5Sum(Bp.ds.slice(0, -1))} = ${Bp.ds[Bp.ds.length - 1]}`] }),
    ({ Cd }) => ({ q: `Rajah di bawah menunjukkan sebuah pokok. (a) Senaraikan bucu yang boleh dibuang supaya graf yang tinggal masih pokok. (b) Jika bucu ${Cd.x} dibuang, adakah graf yang tinggal masih pokok? Terangkan.`, ans: `(a) ${Cd.leaves} (b) Tidak, kerana graf yang tinggal tidak terkait`, work: [`(a) Hanya bucu berdarjah 1 boleh dibuang tanpa memutuskan pokok: ${Cd.leaves}.`, `(b) d(${Cd.x}) = ${Cd.dx}. Apabila ${Cd.x} dibuang, ${Cd.dx} tepi turut dibuang dan pokok terpisah kepada ${Cd.dx} bahagian.`, 'Graf yang tidak terkait bukan pokok.'] })
  ],

  /* ---------- 5.1.4 Rangkaian & Masalah ---------- */
  sosial: [
    ({ v }) => ({ q: `Rajah di bawah menunjukkan rangkaian kawan dalam satu kumpulan murid. Berapakah bilangan kawan ${v}?` }),
    ({ v }) => ({ q: `Dalam rangkaian sosial di bawah, setiap tepi bermaksud dua murid berkawan. Nyatakan darjah bucu ${v} dan terangkan maksudnya.` }),
    ({ top }) => ({ q: 'Rangkaian di bawah menunjukkan hubungan kawan. Siapakah murid yang mempunyai paling ramai kawan?', ans: top }),
    ({ v, non }) => ({ q: `Berdasarkan rangkaian kawan di bawah, siapakah yang <b>tidak</b> berkawan dengan ${v}?`, ans: non })
  ],
  jadual: [
    ({ list }) => ({ q: `Laluan bas terus yang disediakan ialah: ${list}. Wakilkan maklumat ini sebagai graf. Berapakah bilangan bucu dan bilangan tepi?` }),
    ({ list, top }) => ({ q: `Sebuah syarikat bas menyediakan laluan terus berikut: ${list}. Bandar manakah mempunyai paling banyak laluan terus? Gunakan konsep darjah.`, ans: top }),
    ({ list, v }) => ({ q: `Laluan penerbangan dua hala: ${list}. Jika maklumat ini diwakili sebagai graf, apakah darjah bucu ${v}?` })
  ],
  terpendek: [
    ({ s, t, u }) => ({ q: `Graf di bawah menunjukkan ${u[2]} (${u[0]}) antara beberapa tempat. Cari laluan dari ${s} ke ${t} dengan jumlah ${u[1]} paling kecil.` }),
    ({ s, t }) => ({ q: `Tentukan laluan terpendek dari ${s} ke ${t} dalam graf berpemberat di bawah dan nyatakan jumlah pemberatnya.` }),
    ({ s, t, u }) => { const N = vnama(); return { q: `${N} ingin bergerak dari ${s} ke ${t}. Pemberat dalam rangkaian di bawah ialah ${u[2]} (${u[0]}). Laluan manakah patut dipilih oleh ${N} untuk meminimumkan ${u[1]}?` }; },
    ({ s, t, few, fw }) => { const N = vnama(); return { q: `${N} memilih laluan ${few} dari ${s} ke ${t} kerana laluan itu melalui paling sedikit tepi. Jumlah pemberatnya ialah ${fw}. Adakah laluan itu paling pendek? Jika tidak, nyatakan laluan terpendek.` }; }
  ],
  kosOpt: [
    ({ T }) => ({ q: `Rajah di bawah menunjukkan masa (minit) dan bayaran tol (RM) bagi jalan dari rumah (R) ke pejabat (L). Encik Hadi mesti tiba dalam masa ${T} minit dengan bayaran tol paling rendah. Laluan manakah patut dipilih?` }),
    ({ T }) => ({ q: `Puan Siti memandu dari R ke L dalam rangkaian di bawah. Dia mempunyai paling lama ${T} minit. Cari laluan dengan kos tol minimum yang memenuhi syarat masa itu.` }),
    ({ T }) => ({ q: `Berdasarkan rangkaian di bawah, senaraikan semua laluan dari R ke L yang mengambil masa tidak lebih daripada ${T} minit. Seterusnya, pilih laluan paling murah.` })
  ],
  pengikut: [
    () => ({ q: 'Graf terarah di bawah menunjukkan siapa mengikut siapa di media sosial (anak panah dari pengikut kepada orang yang diikut). Siapakah mempunyai paling ramai pengikut?' }),
    () => ({ q: 'Dalam rangkaian di bawah, X → Y bermaksud X mengikut Y. Siapakah yang paling ramai diikuti?' }),
    () => ({ q: 'Rajah di bawah menunjukkan rangkaian mengikut di media sosial. Kenal pasti individu yang menerima paling banyak anak panah dan nyatakan bilangannya.' })
  ],
  k514: [
    ({ R }) => ({ q: `Rajah di bawah menunjukkan jarak (km) jalan antara beberapa tempat. (a) Cari laluan terpendek dari ${R.s} ke ${R.t} dan jaraknya. (b) Jalan ${R.cl} ditutup untuk kerja pembaikan. Cari laluan terpendek yang baharu dan pertambahan jarak.`, ans: `(a) ${R.b1}, ${R.w1} km (b) ${R.b2}, ${R.w2} km; bertambah ${R.w2 - R.w1} km`, work: R.work }),
    ({ R }) => ({ q: `Sebuah ambulans bergerak dari ${R.s} ke ${R.t} dalam rangkaian di bawah (masa dalam minit). (a) Nyatakan laluan paling cepat. (b) Jika jalan ${R.cl} sesak dan tidak boleh digunakan, berapakah masa tambahan yang diperlukan?`, ans: `(a) ${R.b1}, ${R.w1} minit (b) ${R.w2 - R.w1} minit (laluan baharu ${R.b2}, ${R.w2} minit)`, work: R.work }),
    ({ R }) => ({ q: `Rangkaian di bawah menunjukkan kos (RM) penghantaran antara gudang. (a) Cari kos minimum dari ${R.s} ke ${R.t}. (b) Laluan ${R.cl} tidak lagi digunakan. Berapakah kos minimum yang baharu?`, ans: `(a) RM${R.w1} melalui ${R.b1} (b) RM${R.w2} melalui ${R.b2}`, work: R.work })
  ]
};

/* =================== pembina soalan (r = tg5RG atau tg5RW) =================== */
const TG5 = {};
/* ---------- 5.1.1 ---------- */
TG5.darjah = (r, k) => {
  const n = r.i(4, 6), g = tg5Make(r, n, r.i(n, Math.min(n + 2, n * (n - 1) / 2)));
  const loop = k == null ? r.f() < .5 : k % 2 === 0, v = r.i(0, n - 1);
  if (loop) tg5AddLoop(g, v);
  if (r.f() < .4) tg5AddMulti(r, g);
  const d = tg5Deg(g)[v], V = g.nm[v], es = g.E.filter(e => e.a === v || e.b === v);
  const nLoop = es.filter(e => e.a === e.b).length;
  const wrong = nLoop ? d - 1 : d + 1, why = nLoop ? `Gelung pada ${V} mesti dikira 2, bukan 1.` : `Kira semula tepi yang bersambung dengan ${V}.`;
  const work = [`Tepi pada ${V}: ${es.map(e => tg5Ed(g, e)).join(', ')}`].concat(nLoop ? [`Gelung (${V}, ${V}) dikira 2.`, `d(${V}) = ${es.length - nLoop} + ${2 * nLoop} = ${d}`] : [`d(${V}) = ${d}`]);
  return GEN_LQ('darjah', { v: V, ans: String(d), wrong, why, work }, { fig: tg5Svg(g, {}, 'Graf') });
};
TG5.bilVE = r => {
  const n = r.i(4, 6), g = tg5Make(r, n, r.i(n - 1, n + 2));
  if (r.f() < .6) tg5AddLoop(g, r.i(0, n - 1));
  if (r.f() < .5) tg5AddMulti(r, g);
  const loops = g.E.filter(e => e.a === e.b).length;
  return GEN_LQ('bilVE', { ans: `${n} bucu, ${g.E.length} tepi`, work: [`Bucu: ${g.nm.join(', ')} → ${n} bucu`, `Tepi: ${tg5Eset(g)} → ${g.E.length} tepi` + (loops ? ` (termasuk ${loops} gelung)` : '')] }, { fig: tg5Svg(g, {}, 'Graf') });
};
TG5.jumDarjah = r => {
  const n = r.i(4, 6), g = tg5Make(r, n, r.i(n - 1, n + 2), { conn: r.f() < .8 });
  if (r.f() < .4) tg5AddLoop(g, r.i(0, n - 1));
  const d = tg5Deg(g), m = g.E.length;
  return GEN_LQ('jumDarjah', { V: tg5Vset(g), E: tg5Eset(g), m, ans: String(2 * m), work: [`Bilangan tepi = ${m}`, `Jumlah darjah = 2 × ${m} = ${2 * m}`, `Semakan: ${g.nm.map((v, i) => `d(${v}) = ${d[i]}`).join(', ')}; jumlah = ${tg5Sum(d)}`] }, { figAns: tg5Svg(g, {}, 'Graf') });
};
TG5.mudah = (r, k) => {
  const n = r.i(3, 5), g = tg5Make(r, n, r.i(n - 1, Math.min(n + 1, n * (n - 1) / 2)));
  const kind = k == null ? r.p(['ya', 'gelung', 'multi']) : ['ya', 'gelung', 'multi'][k % 3];
  let ans;
  if (kind === 'gelung') { const v = r.i(0, n - 1); tg5AddLoop(g, v); ans = `Tidak, kerana ada gelung pada bucu ${g.nm[v]}`; }
  else if (kind === 'multi') { tg5AddMulti(r, g); const c = {}; let e2; g.E.forEach(e => { const kk = tg5Key(e.a, e.b); if (c[kk]) e2 = e; c[kk] = 1; }); ans = `Tidak, kerana ada berbilang tepi antara ${g.nm[e2.a]} dan ${g.nm[e2.b]}`; }
  else ans = 'Ya, kerana graf tidak terarah, tiada gelung dan tiada berbilang tepi';
  return GEN_LQ('mudah', { ans, work: ['Graf mudah: tidak terarah, tiada gelung dan tiada berbilang tepi.', ans + '.'] }, { fig: tg5Svg(g, {}, 'Graf') });
};
TG5.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
TG5.tepiDarjah = r => {
  const n = r.i(4, 7), g = tg5Make(r, Math.min(n, 6), r.i(n, n + 3));
  if (r.f() < .4) tg5AddLoop(g, r.i(0, g.nm.length - 1));
  const ds = tg5Deg(g), S = tg5Sum(ds);
  return GEN_LQ('tepiDarjah', { n: ds.length, ds, ans: String(S / 2), work: [`Jumlah darjah = ${ds.join(' + ')} = ${S}`, 'Jumlah darjah = 2 × bilangan tepi', `Bilangan tepi = ${S} ÷ 2 = ${S / 2}`] });
};
TG5.darjahHilang = r => {
  let g, ds; do { const n = r.i(4, 6); g = tg5Make(r, n, r.i(n, n + 3)); if (r.f() < .3) tg5AddLoop(g, r.i(0, n - 1)); ds = tg5Deg(g); } while (ds[ds.length - 1] < 1);
  const m = g.E.length, rest = tg5Sum(ds.slice(0, -1)), x = ds[ds.length - 1];
  return GEN_LQ('darjahHilang', { m, nm: g.nm, ds, ans: String(x), work: [`Jumlah darjah = 2 × ${m} = ${2 * m}`, `Jumlah darjah yang diberi = ${ds.slice(0, -1).join(' + ')} = ${rest}`, `Darjah ${g.nm[g.nm.length - 1]} = ${2 * m} − ${rest} = ${x}`] });
};
TG5.senaraiVE = r => {
  const n = r.i(4, 5), g = tg5Make(r, n, r.i(n - 1, n + 1));
  if (r.f() < .5) tg5AddLoop(g, r.i(0, n - 1));
  return GEN_LQ('senaraiVE', { ans: `V = ${tg5Vset(g)}, E = ${tg5Eset(g)}`, work: ['Senaraikan semua bucu dalam V.', 'Tulis setiap tepi sebagai pasangan bucu di hujungnya. Gelung pada X ditulis (X, X).'] }, { fig: tg5Svg(g, {}, 'Graf') });
};
TG5.k511 = r => {
  const L = { n: r.i(5, 9) };
  let O; do { const n = r.i(4, 6); O = { ds: Array.from({ length: n }, () => r.i(1, 5)) }; } while (tg5Sum(O.ds) % 2 === 0);
  // graf dengan gelung & berbilang tepi
  const n = r.i(4, 5), g = tg5Make(r, n, n, {}); const lv = r.i(0, n - 1); tg5AddLoop(g, lv); tg5AddMulti(r, g);
  const cnt = {}; let mul; g.E.forEach(e => { const kk = tg5Key(e.a, e.b); if (cnt[kk] && e.a !== e.b) mul = e; cnt[kk] = 1; });
  const dsM = tg5Deg(g);
  const Mx = { V: tg5Vset(g), E: tg5Eset(g), ds: dsM, sum: tg5Sum(dsM), m: g.E.length, dtxt: g.nm.map((v, i) => `d(${v}) = ${dsM[i]}`).join(', '), loop: `(${g.nm[lv]}, ${g.nm[lv]})`, multi: tg5Ed(g, mul) };
  let Rg; do { Rg = { n: r.i(4, 8), d: r.i(2, 4) }; } while ((Rg.n * Rg.d) % 2 || Rg.d > Rg.n - 1);
  return vq('k511', { L, O, Mx, Rg });
};

/* ---------- 5.1.2 ---------- */
TG5.jenisG = (r, k) => {
  const kind = k == null ? r.i(0, 3) : k % 4, dir = kind % 2 === 1, wt = kind >= 2;
  const n = r.i(4, 5), g = tg5Make(r, n, r.i(n, n + 1));
  if (dir) { g.dir = true; g.E.forEach(e => { if (r.f() < .5) [e.a, e.b] = [e.b, e.a]; }); }
  if (wt) g.E.forEach(e => { e.w = r.i(2, 15); });
  const ans = tg5JenisTxt(dir, wt), wrong = tg5JenisTxt(!dir, r.f() < .5 ? wt : !wt);
  return GEN_LQ('jenisG', { ans, wrong, work: [dir ? 'Tepi mempunyai anak panah, maka graf terarah.' : 'Tepi tiada anak panah, maka graf tidak terarah.', wt ? 'Setiap tepi ada nilai, maka graf berpemberat.' : 'Tepi tiada nilai, maka graf tidak berpemberat.'] }, { fig: tg5Svg(g, {}, 'Graf') });
};
TG5.situasi = (r, k) => {
  const [s, dir, wt, why] = k == null ? r.p(TG5SIT) : TG5SIT[k % TG5SIT.length];
  return GEN_LQ('situasi', { s, ans: tg5JenisTxt(dir, wt), work: [why] });
};
TG5.keluarMasuk = (r, k) => {
  let g, v, c; const out = k == null ? r.f() < .5 : k % 2 === 0;
  do {
    const n = r.i(4, 5); g = tg5Make(r, n, r.i(n + 1, n + 3)); g.dir = true; g.E.forEach(e => { if (r.f() < .5) [e.a, e.b] = [e.b, e.a]; });
    v = r.i(0, n - 1); c = out ? tg5Out(g, v) : tg5In(g, v);
  } while (c < 1 || tg5Out(g, v) === tg5In(g, v) && r.f() < .7);
  const V = g.nm[v], es = g.E.filter(e => (out ? e.a : e.b) === v).map(e => tg5Ed(g, e));
  return GEN_LQ('keluarMasuk', { v: V, io: out ? 'keluar dari' : 'masuk ke', ans: String(c), work: [`Tepi yang ${out ? 'keluar dari' : 'masuk ke'} ${V}: ${es.join(', ')}`, `Bilangan = ${c}`] }, { fig: tg5Svg(g, {}, 'Graf terarah') });
};
TG5.jumPemberat = r => {
  const D = tg5Wnet(r, { five: r.f() < .5 }), u = r.p(TG5UNIT), p = r.p(D.P.filter(x => x.e.length >= 2)), g = D.g;
  return GEN_LQ('jumPemberat', { path: tg5PStr(g, p), u, ans: tg5U(u, p.w), work: [`Pemberat: ${p.e.map(i => `${tg5Ed(g, g.E[i])} = ${g.E[i].w}`).join(', ')}`, `Jumlah = ${tg5PSum(g, p)}`] }, { fig: tg5Svg(g, {}, 'Graf berpemberat') });
};
TG5.laluanCepat = r => {
  const D = tg5Wnet(r, { dir: true, five: r.f() < .4 }), g = D.g, u = r.p(TG5UNIT);
  const work = D.P.map(p => `${tg5PStr(g, p)}: ${tg5PSum(g, p)}`).concat([`Paling kecil: ${tg5PStr(g, D.best)} (${tg5U(u, D.best.w)})`]);
  return GEN_LQ('laluanCepat', { s: g.nm[D.s], t: g.nm[D.t], u, ans: `${tg5PStr(g, D.best)}, ${tg5U(u, D.best.w)}`, work }, { fig: tg5Svg(g, {}, 'Graf terarah berpemberat'), figAns: tg5Svg(g, { hl: new Set(D.best.e) }, 'Laluan terbaik diserlahkan') });
};
TG5.tertib = r => {
  const n = r.i(3, 5), g = tg5Make(r, n, r.i(n, Math.min(n + 2, n * (n - 1) / 2))); g.dir = true;
  g.E.forEach(e => { if (r.f() < .5) [e.a, e.b] = [e.b, e.a]; });
  if (r.f() < .5) { const e = r.p(g.E); g.E.push({ a: e.b, b: e.a }); }
  tg5Sort(g);
  return GEN_LQ('tertib', { ans: `E = ${tg5Eset(g)}`, work: ['Setiap tepi ditulis sebagai (bucu permulaan, bucu akhir) mengikut arah anak panah.', `E = ${tg5Eset(g)}`] }, { fig: tg5Svg(g, {}, 'Graf terarah') });
};
TG5.k512 = r => {
  const Dn = tg5Wnet(r, { dir: true, tricky: true }), g = Dn.g;
  const D = { s: g.nm[Dn.s], t: g.nm[Dn.t], n: Dn.P.length, list: Dn.P.map(p => tg5PStr(g, p)).join('; '), best: tg5PStr(g, Dn.best), bw: Dn.best.w, mx: Math.max(...Dn.P.map(p => p.w)) };
  D.work = Dn.P.map(p => `${tg5PStr(g, p)}: ${tg5PSum(g, p)}`).concat([`Laluan minimum: ${D.best} = ${D.bw}`]);
  const v = vq('k512', { D });
  return { q: v.q, ans: v.ans, work: v.work, fig: tg5Svg(g, {}, 'Graf terarah berpemberat'), figAns: tg5Svg(g, { hl: new Set(Dn.best.e) }, 'Laluan minimum diserlahkan') };
};

/* ---------- 5.1.3 ---------- */
TG5.subYa = (r, k) => {
  const n = r.i(4, 5), g = tg5Make(r, n, r.i(n + 1, Math.min(n + 2, n * (n - 1) / 2)));
  const yes = k == null ? r.f() < .5 : k % 2 === 0;
  let keep, HE, ans, extra;
  for (let t = 0; t < 100; t++) {
    keep = tg5Shuf(r, [...Array(n).keys()]).slice(0, r.i(3, n)).sort();
    const ind = g.E.filter(e => keep.includes(e.a) && keep.includes(e.b));
    if (ind.length < 2) continue;
    HE = tg5Shuf(r, ind).slice(0, r.i(Math.max(1, ind.length - 2), ind.length)).map(e => ({ a: e.a, b: e.b }));
    if (yes) break;
    const have = new Set(g.E.map(e => tg5Key(e.a, e.b))), cand = [];
    keep.forEach((a, i) => keep.slice(i + 1).forEach(b => { if (!have.has(tg5Key(a, b))) cand.push([a, b]); }));
    if (!cand.length) continue;
    const [a, b] = r.p(cand); extra = { a, b }; HE.push(extra); break;
  }
  if (!yes && !extra) return TG5.subYa(r, 0);
  const H = tg5Sort({ nm: keep.map(i => g.nm[i]), pos: keep.map(i => g.pos[i].slice()), E: HE.map(e => ({ a: keep.indexOf(e.a), b: keep.indexOf(e.b) })), dir: false });
  ans = yes ? 'Ya, kerana semua bucu dan semua tepi H ialah bucu dan tepi G' : `Tidak, kerana tepi (${g.nm[Math.min(extra.a, extra.b)]}, ${g.nm[Math.max(extra.a, extra.b)]}) tiada dalam G`;
  return GEN_LQ('subYa', { ans, work: [`Bucu H: ${tg5Vset(H)} ⊆ ${tg5Vset(g)}`, `Tepi H: ${tg5Eset(H)}`, ans + '.'] }, { fig: tg5Svg2(g, H, 'G', 'H', 'Graf G dan graf H') });
};
TG5.pokokYa = (r, k) => {
  const kind = k == null ? r.p(['ya', 'litar', 'pisah', 'ya']) : ['ya', 'litar', 'pisah', 'ya2'][k % 4];
  const n = r.i(4, 6); let g, ans;
  if (kind === 'ya' || kind === 'ya2') { g = tg5Make(r, n, n - 1); ans = `Ya, kerana graf terkait, tiada litar dan bilangan tepi = ${n} − 1 = ${n - 1}`; }
  else if (kind === 'litar') { g = tg5Make(r, n, n + r.i(0, 1)); ans = `Tidak, kerana graf mempunyai litar (${g.E.length} tepi, sedangkan pokok dengan ${n} bucu hanya ada ${n - 1} tepi)`; }
  else {
    // tepi = n − 1 tetapi tidak terkait (ada litar segi tiga)
    do { g = tg5Make(r, n, n - 1, { conn: false }); } while (tg5Conn(g));
    ans = `Tidak, kerana graf tidak terkait walaupun bilangan tepi = ${n - 1}`;
  }
  return GEN_LQ('pokokYa', { ans, work: ['Pokok: graf terkait, tiada litar, dan bilangan tepi = bilangan bucu − 1.', `Graf ini: ${n} bucu, ${g.E.length} tepi, ${tg5Conn(g) ? 'terkait' : 'tidak terkait'}.`, ans + '.'] }, { fig: tg5Svg(g, {}, 'Graf') });
};
TG5.tepiPokok = (r, k) => {
  const n = r.i(5, 25), find = k == null ? (r.f() < .6 ? 'e' : 'v') : (k % 3 === 2 ? 'v' : 'e');
  return GEN_LQ('tepiPokok', { n, find, ans: find === 'e' ? `${n - 1} tepi` : `${n} bucu`, work: ['Bagi pokok: bilangan tepi = bilangan bucu − 1.', find === 'e' ? `Bilangan tepi = ${n} − 1 = ${n - 1}` : `Bilangan bucu = ${n - 1} + 1 = ${n}`] });
};
TG5.buangTepi = r => {
  const n = r.i(4, 6), m = r.i(n + 1, Math.min(n + 4, n * (n - 1) / 2)), g = tg5Make(r, n, m);
  // pokok rentang (BFS) untuk rajah jawapan
  const seen = new Set([0]), q = [0], T = new Set();
  while (q.length) { const u = q.shift(); g.E.forEach((e, i) => { const o = e.a === u ? e.b : e.b === u ? e.a : -1; if (o >= 0 && !seen.has(o)) { seen.add(o); q.push(o); T.add(i); } }); }
  const dim = new Set(g.E.map((e, i) => i).filter(i => !T.has(i)));
  return GEN_LQ('buangTepi', { n, m, ans: String(m - n + 1), work: [`Pokok dengan ${n} bucu mempunyai ${n} − 1 = ${n - 1} tepi.`, `Tepi dibuang = ${m} − ${n - 1} = ${m - n + 1}`] }, { fig: tg5Svg(g, { col: 'gr' }, 'Graf terkait'), figAns: tg5Svg(g, { col: 'gr', hl: T, dim }, 'Satu pokok yang mungkin') });
};
TG5.buangBucu = r => {
  const n = r.i(4, 6), g = tg5Make(r, n, r.i(n, n + 3)), v = r.i(0, n - 1), d = tg5Deg(g)[v], m = g.E.length, V = g.nm[v];
  const d0 = { v: V, ans: `${m - d} tepi`, work: [`d(${V}) = ${d}, jadi ${d} tepi turut dibuang.`, `Tepi yang tinggal = ${m} − ${d} = ${m - d}`] };
  const out = GEN_LQ('buangBucu', d0, { fig: tg5Svg(g, { col: 'gr' }, 'Graf'), figAns: tg5Svg(g, { col: 'gr', dim: new Set(g.E.map((e, i) => i).filter(i => g.E[i].a === v || g.E[i].b === v)), vcol: { [v]: 'rd' } }, 'Tepi yang dibuang') });
  if (out.q.includes('bilangan bucu dan')) out.ans = `${n - 1} bucu, ${m - d} tepi`;
  if (out.q.includes('Stesen')) out.ans = `${m - d} laluan`;
  return out;
};
TG5.k513 = r => {
  // (a) lukis pokok
  const n = r.i(5, 6), m = r.i(n + 2, n + 3), g = tg5Make(r, n, m);
  const seen = new Set([0]), q = [0], T = []; while (q.length) { const u = q.shift(); g.E.forEach((e, i) => { const o = e.a === u ? e.b : e.b === u ? e.a : -1; if (o >= 0 && !seen.has(o)) { seen.add(o); q.push(o); T.push(i); } }); }
  const A = { n, m, tree: T.map(i => tg5Ed(g, g.E[i])).join(', ') };
  // (b) darjah dalam pokok
  let Bp; do { const nn = r.i(5, 8), ds = Array.from({ length: nn - 1 }, () => r.i(1, 3)), last = 2 * (nn - 1) - tg5Sum(ds); Bp = { n: nn, ds: ds.concat([last]) }; } while (Bp.ds[Bp.ds.length - 1] < 1 || Bp.ds[Bp.ds.length - 1] > 4);
  // (c) pokok, buang bucu dalaman
  let tg, dg; do { const nt = r.i(5, 6); tg = tg5Make(r, nt, nt - 1); dg = tg5Deg(tg); } while (Math.max(...dg) < 2);
  const xi = dg.findIndex(x => x === Math.max(...dg));
  const Cd = { leaves: tg5Dan(tg.nm.filter((v, i) => dg[i] === 1)), x: tg.nm[xi], dx: dg[xi] };
  const v = vq('k513', { A, Bp, Cd });
  if (v.q.includes('Lukis satu pokok')) return { q: v.q, ans: v.ans, work: v.work, kind: 'lukis', fig: tg5Svg(g, { col: 'gr' }, 'Graf G'), figAns: tg5Svg(g, { col: 'gr', hl: new Set(T), dim: new Set(g.E.map((e, i) => i).filter(i => !T.includes(i))) }, 'Satu pokok bagi G') };
  if (v.q.includes('Rajah di bawah menunjukkan sebuah pokok')) return { q: v.q, ans: v.ans, work: v.work, fig: tg5Svg(tg, { col: 'gr' }, 'Pokok') };
  return { q: v.q, ans: v.ans, work: v.work };
};

/* ---------- 5.1.4 ---------- */
function tg5Sosial(r, n, dir) {
  const ppl = tg5Shuf(r, TG5ORANG).slice(0, n), ini = ppl.map(p => p[0]);
  if (new Set(ini).size < n) return tg5Sosial(r, n, dir);
  const g = tg5Make(r, n, r.i(n, n + 2), { nm: ini });
  if (dir) { g.dir = true; g.E.forEach(e => { if (r.f() < .5) [e.a, e.b] = [e.b, e.a]; }); }
  return { g, ppl, sub: Object.fromEntries(ppl.map((p, i) => [i, p])) };
}
TG5.sosial = r => {
  let S, d, top; do { S = tg5Sosial(r, r.i(5, 6), false); d = tg5Deg(S.g); top = d.indexOf(Math.max(...d)); } while (d.filter(x => x === d[top]).length > 1);
  const v = r.i(0, S.ppl.length - 1);
  const nbr = new Set(); S.g.E.forEach(e => { if (e.a === v) nbr.add(e.b); if (e.b === v) nbr.add(e.a); });
  const nonL = S.ppl.filter((p, i) => i !== v && !nbr.has(i));
  const V = S.ppl[v];
  const out = GEN_LQ('sosial', { v: V, top: `${S.ppl[top]} (${d[top]} kawan)`, non: nonL.length ? tg5Dan(nonL) : 'Tiada (berkawan dengan semua)', ans: `${d[v]} orang kawan`, work: [`Kawan ${V}: ${tg5Dan(S.ppl.filter((p, i) => nbr.has(i)))}`, `d(${V[0]}) = ${d[v]}`, `Darjah: ${S.ppl.map((p, i) => `${p} ${d[i]}`).join(', ')}`] }, { fig: tg5Svg(S.g, { col: 'pu', sub: S.sub }, 'Rangkaian kawan') });
  if (out.q.includes('Nyatakan darjah')) out.ans = `d(${V[0]}) = ${d[v]}, iaitu ${V} mempunyai ${d[v]} orang kawan`;
  return out;
};
TG5.jadual = r => {
  let g, d, top, B; do { B = r.p(TG5BANDAR); const n = r.i(5, 6); g = tg5Make(r, n, r.i(n, n + 2), { nm: B.map(b => b[0] + b[1]) }); d = tg5Deg(g); top = d.indexOf(Math.max(...d)); } while (d.filter(x => x === d[top]).length > 1);
  const nmL = B.slice(0, g.nm.length), list = g.E.map(e => `${nmL[e.a]} – ${nmL[e.b]}`).join(', ');
  const v = r.i(0, g.nm.length - 1);
  const fig = tg5Svg({ nm: g.nm.map((x, i) => String.fromCharCode(65 + i)), pos: g.pos, E: g.E, dir: false }, { col: 'pu', sub: Object.fromEntries(nmL.map((b, i) => [i, b])) }, 'Rangkaian bandar');
  const out = GEN_LQ('jadual', { list, top: `${nmL[top]} (darjah ${d[top]})`, v: nmL[v], ans: `${g.nm.length} bucu, ${g.E.length} tepi`, work: [`Bucu: ${tg5Dan(nmL)}`, `Setiap laluan ialah satu tepi: ${g.E.length} tepi`, `Darjah: ${nmL.map((b, i) => `${b} ${d[i]}`).join(', ')}`] }, { figAns: fig });
  if (out.q.includes('apakah darjah')) out.ans = String(d[v]);
  return out;
};
TG5.terpendek = r => {
  const D = tg5Wnet(r, { five: r.f() < .35, tricky: r.f() < .7 }), g = D.g, u = r.p(TG5UNIT);
  const minE = Math.min(...D.P.map(p => p.e.length)), fewL = D.P.filter(p => p.e.length === minE).sort((a, b) => a.w - b.w), few = fewL[fewL.length - 1];
  const work = D.P.slice().sort((a, b) => a.w - b.w).slice(0, 5).map(p => `${tg5PStr(g, p)}: ${tg5PSum(g, p)}`).concat([`Terpendek: ${tg5PStr(g, D.best)} = ${tg5U(u, D.best.w)}`]);
  const data = { s: g.nm[D.s], t: g.nm[D.t], u, few: tg5PStr(g, few), fw: tg5U(u, few.w), ans: `${tg5PStr(g, D.best)}, ${tg5U(u, D.best.w)}`, work };
  const out = GEN_LQ('terpendek', data, { fig: tg5Svg(g, { col: 'pu' }, 'Rangkaian berpemberat'), figAns: tg5Svg(g, { col: 'pu', hl: new Set(D.best.e) }, 'Laluan terpendek diserlahkan') });
  if (out.q.includes('paling sedikit tepi')) out.ans = few === D.best ? `Ya, ${data.ans}` : `Tidak. Laluan terpendek ialah ${data.ans}`;
  return out;
};
TG5.kosOpt = r => {
  for (let t = 0; t < 300; t++) {
    const pos = [[30, 120], [160, 30], [160, 210], [290, 120]], ed = [[0, 1], [1, 3], [0, 2], [2, 3], [1, 2]];
    const E = ed.map(([a, b]) => ({ a, b, m: r.i(2, 9) * 5, k: r.p([0, 0, 2, 3, 4, 5, 6]) }));
    E.forEach(e => { e.w = ''; });
    const g = { nm: ['R', 'X', 'Y', 'L'], pos, E, dir: false };
    const P = tg5Paths(g, 0, 3).map(p => ({ p, m: tg5Sum(p.e.map(i => E[i].m)), k: tg5Sum(p.e.map(i => E[i].k)) }));
    const T = r.p([40, 45, 50, 55, 60]), ok = P.filter(x => x.m <= T);
    if (ok.length < 2 || ok.length === P.length) continue;
    const mk = Math.min(...ok.map(x => x.k)), best = ok.filter(x => x.k === mk);
    if (best.length !== 1) continue;
    const cheapAll = Math.min(...P.map(x => x.k)); if (cheapAll === mk) continue;   // laluan termurah mesti melebihi masa
    const g2 = Object.assign({}, g, { E: E.map(e => ({ a: e.a, b: e.b, w: `${e.m} min, RM${e.k}` })) });
    const work = P.map(x => `${tg5PStr(g, x.p)}: ${x.m} min, RM${x.k}${x.m <= T ? '' : ' (melebihi masa)'}`).concat([`Dalam ${T} minit, tol paling rendah: ${tg5PStr(g, best[0].p)}`]);
    return GEN_LQ('kosOpt', { T, ans: `${tg5PStr(g, best[0].p)} (${best[0].m} minit, RM${best[0].k})`, work }, { fig: tg5Svg(g2, { col: 'pu' }, 'Rangkaian masa dan tol'), figAns: tg5Svg(g2, { col: 'pu', hl: new Set(best[0].p.e) }, 'Laluan dipilih') });
  }
  return TG5.kosOpt(r);
};
TG5.pengikut = r => {
  let S, din, top; do { S = tg5Sosial(r, r.i(5, 6), true); din = S.g.nm.map((x, i) => tg5In(S.g, i)); top = din.indexOf(Math.max(...din)); } while (din.filter(x => x === din[top]).length > 1);
  const ans = `${S.ppl[top]} (${din[top]} pengikut)`;
  return GEN_LQ('pengikut', { ans, work: ['Pengikut = anak panah yang masuk ke bucu itu.', S.ppl.map((p, i) => `${p}: ${din[i]}`).join(', '), `Paling ramai: ${ans}`] }, { fig: tg5Svg(S.g, { col: 'pu', sub: S.sub }, 'Rangkaian mengikut') });
};
TG5.k514 = r => {
  for (let t = 0; t < 300; t++) {
    const D = tg5Wnet(r, {}); if (!D) continue;
    const g = D.g, ci = r.p(D.best.e);
    const g2 = Object.assign({}, g, { E: g.E.filter((e, i) => i !== ci) });
    const P2 = tg5Paths(g2, D.s, D.t); if (!P2.length) continue;
    const mn = Math.min(...P2.map(p => p.w)), b2 = P2.filter(p => p.w === mn); if (b2.length !== 1 || mn === D.best.w) continue;
    const ce = g.E[ci], R = { s: g.nm[D.s], t: g.nm[D.t], cl: `${g.nm[ce.a]} – ${g.nm[ce.b]}`, b1: tg5PStr(g, D.best), w1: D.best.w, b2: tg5PStr(g2, b2[0]), w2: mn };
    R.work = [`(a) ${R.b1}: ${tg5PSum(g, D.best)} (paling kecil)`, `(b) Tanpa ${R.cl}: ${R.b2}: ${tg5PSum(g2, b2[0])}`, `Pertambahan = ${mn} − ${D.best.w} = ${mn - D.best.w}`];
    const v = vq('k514', { R });
    return { q: v.q, ans: v.ans, work: v.work, fig: tg5Svg(g, { col: 'pu' }, 'Rangkaian berpemberat'), figAns: tg5Svg(g, { col: 'pu', hl: new Set(D.best.e) }, 'Laluan terpendek asal') };
  }
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '5.1.1': {
    m: [() => TG5.darjah(tg5RG), () => TG5.darjah(tg5RG), () => TG5.bilVE(tg5RG), () => TG5.jumDarjah(tg5RG), () => TG5.mudah(tg5RG), () => TG5.bs(tg5RG, TG5BS1)],
    s: [() => TG5.tepiDarjah(tg5RG), () => TG5.darjahHilang(tg5RG), () => TG5.senaraiVE(tg5RG)],
    k: [() => TG5.k511(tg5RG)]
  },
  '5.1.2': {
    m: [() => TG5.jenisG(tg5RG), () => TG5.situasi(tg5RG), () => TG5.keluarMasuk(tg5RG), () => TG5.jumPemberat(tg5RG), () => TG5.bs(tg5RG, TG5BS2)],
    s: [() => TG5.laluanCepat(tg5RG), () => TG5.laluanCepat(tg5RG), () => TG5.tertib(tg5RG)],
    k: [() => TG5.k512(tg5RG)]
  },
  '5.1.3': {
    m: [() => TG5.subYa(tg5RG), () => TG5.pokokYa(tg5RG), () => TG5.tepiPokok(tg5RG), () => TG5.bs(tg5RG, TG5BS3)],
    s: [() => TG5.buangTepi(tg5RG), () => TG5.buangBucu(tg5RG)],
    k: [() => TG5.k513(tg5RG)]
  },
  '5.1.4': {
    m: [() => TG5.sosial(tg5RG), () => TG5.jadual(tg5RG), () => TG5.jumPemberat(tg5RG)],
    s: [() => TG5.terpendek(tg5RG), () => TG5.terpendek(tg5RG), () => TG5.kosOpt(tg5RG), () => TG5.pengikut(tg5RG)],
    k: [() => TG5.k514(tg5RG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 5.1.1
WG.darjah = i => TG5.darjah(tg5RW, i);
WG.bilVE = () => TG5.bilVE(tg5RW);
WG.jumDarjah = () => TG5.jumDarjah(tg5RW);
WG.mudah = i => TG5.mudah(tg5RW, i);
WG.bs1 = i => TG5.bs(tg5RW, TG5BS1, [0, 4, 2][i % 3] + wri(0, 1) * [1, 3, 5][i % 3]);
WG.tepiDarjah = () => TG5.tepiDarjah(tg5RW);
WG.darjahHilang = () => TG5.darjahHilang(tg5RW);
WG.senaraiVE = () => TG5.senaraiVE(tg5RW);
WG.k511 = () => TG5.k511(tg5RW);
// 5.1.2
WG.jenisG = i => TG5.jenisG(tg5RW, i);
WG.situasi = i => TG5.situasi(tg5RW, i * 2 + wri(0, 1));
WG.keluarMasuk = i => TG5.keluarMasuk(tg5RW, i);
WG.jumPemberat = () => TG5.jumPemberat(tg5RW);
WG.bs2 = i => TG5.bs(tg5RW, TG5BS2, [0, 2, 5][i % 3] + wri(0, 1) * [1, 4, 2][i % 3]);
WG.laluanCepat = () => TG5.laluanCepat(tg5RW);
WG.tertib = () => TG5.tertib(tg5RW);
WG.k512 = () => TG5.k512(tg5RW);
// 5.1.3
WG.subYa = i => TG5.subYa(tg5RW, i);
WG.pokokYa = i => TG5.pokokYa(tg5RW, i);
WG.tepiPokok = i => TG5.tepiPokok(tg5RW, i);
WG.bs3 = i => TG5.bs(tg5RW, TG5BS3, [1, 4, 2][i % 3] + wri(0, 1) * [5, 1, 4][i % 3]);
WG.buangTepi = () => TG5.buangTepi(tg5RW);
WG.buangBucu = () => TG5.buangBucu(tg5RW);
WG.k513 = () => TG5.k513(tg5RW);
// 5.1.4
WG.sosial = () => TG5.sosial(tg5RW);
WG.jadual = () => TG5.jadual(tg5RW);
WG.jumPemberat4 = () => TG5.jumPemberat(tg5RW);
WG.terpendek = () => TG5.terpendek(tg5RW);
WG.kosOpt = () => TG5.kosOpt(tg5RW);
WG.pengikut = () => TG5.pengikut(tg5RW);
WG.k514 = () => TG5.k514(tg5RW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '5.1.1': [['m', 'darjah', 6], ['m', 'bilVE', 4], ['m', 'jumDarjah', 3], ['m', 'mudah', 3], ['m', 'bs1', 2], ['s', 'tepiDarjah', 3], ['s', 'darjahHilang', 3], ['s', 'senaraiVE', 3], ['k', 'k511', 3]],
  '5.1.2': [['m', 'jenisG', 4], ['m', 'situasi', 4], ['m', 'keluarMasuk', 4], ['m', 'jumPemberat', 4], ['m', 'bs2', 2], ['s', 'laluanCepat', 5], ['s', 'tertib', 4], ['k', 'k512', 3]],
  '5.1.3': [['m', 'subYa', 6], ['m', 'pokokYa', 5], ['m', 'tepiPokok', 4], ['m', 'bs3', 3], ['s', 'buangTepi', 5], ['s', 'buangBucu', 4], ['k', 'k513', 3]],
  '5.1.4': [['m', 'sosial', 7], ['m', 'jadual', 6], ['m', 'jumPemberat4', 5], ['s', 'terpendek', 4], ['s', 'kosOpt', 3], ['s', 'pengikut', 2], ['k', 'k514', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function tg5OptsN(ans, cands, f, pos) {
  f = f || (v => String(v));
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!Number.isInteger(c) || (pos && c <= 0)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 60; k++) { const vv = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2); if (pos && vv <= 0) continue; const s = f(vv); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function tg5OptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const tg5Mcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
// empat graf kecil berlabel W, X, Y, Z
function tg5Four(r, gs) {
  const L = ['W', 'X', 'Y', 'Z'];
  let s = '';
  gs.forEach((g, i) => {
    const x0 = (i % 2) * 160, y0 = Math.floor(i / 2) * 120;
    s += `<rect x="${x0 + 4}" y="${y0 + 4}" width="152" height="112" rx="12" style="fill:none;stroke:var(--bd)" stroke-width="2"/>`;
    s += `<g transform="translate(${x0 + 20} ${y0 + 12}) scale(.42)">${tg5G(g, { col: 'gr', vr: 15 })}</g>` + tg5T(x0 + 18, y0 + 20, L[i], 'pa', 17);
  });
  return `<svg viewBox="0 0 320 240" role="img" aria-label="Empat graf W, X, Y dan Z" font-family="Inter, sans-serif">${s}</svg>`;
}
const CQGEN = {
  darjah: [
    () => { const n = ri(4, 5), g = tg5Make(tg5RG, n, ri(n, n + 2)), v = ri(0, n - 1); if (Math.random() < .4) tg5AddLoop(g, v); const d = tg5Deg(g)[v]; return tg5Mcq(`Apakah darjah bucu <b>${g.nm[v]}</b>?`, tg5Svg(g), tg5OptsN(d, [d - 1, d + 1, d + 2, g.E.length], null, true)); },
    () => { const n = ri(4, 5), g = tg5Make(tg5RG, n, ri(n, n + 3)); if (Math.random() < .5) tg5AddLoop(g, ri(0, n - 1)); const ds = tg5Deg(g), S = tg5Sum(ds); return tg5Mcq(`Darjah bucu-bucu: ${ds.join(', ')}. Berapakah bilangan tepi?`, tg5Svg(g), tg5OptsN(S / 2, [S, S / 2 + 1, S / 2 - 1, S - 2], null, true)); },
    () => {
      if (Math.random() < .5) { const n = ri(4, 5), g = tg5Make(tg5RG, n, n); tg5AddLoop(g, ri(0, n - 1)); tg5AddMulti(tg5RG, g); const m = g.E.length; return tg5Mcq('Berapakah <b>jumlah darjah</b> semua bucu?', tg5Svg(g), tg5OptsN(2 * m, [m, 2 * m - 1, 2 * m - 2, 2 * m + 2], null, true)); }
      let ds, m; do { const n = ri(4, 6); m = ri(n, n + 4); ds = Array.from({ length: n - 1 }, () => ri(1, 4)); } while (2 * m - tg5Sum(ds) < 1 || 2 * m - tg5Sum(ds) > 6);
      const x = 2 * m - tg5Sum(ds), g = tg5Make(tg5RG, 4, 5);
      return tg5Mcq(`Graf ada ${m} tepi. Darjah ${ds.length} bucu: ${ds.join(', ')}. Darjah bucu terakhir?`, tg5Svg(g), tg5OptsN(x, [m - tg5Sum(ds), x + 1, x - 1, x + 2], null, true));
    }
  ],
  jenis: [
    () => { const kind = ri(0, 3), dir = kind % 2 === 1, wt = kind >= 2, n = ri(4, 5), g = tg5Make(tg5RG, n, n); if (dir) { g.dir = true; g.E.forEach(e => { if (Math.random() < .5) [e.a, e.b] = [e.b, e.a]; }); } if (wt) g.E.forEach(e => { e.w = ri(2, 12); }); return tg5Mcq('Apakah jenis graf ini?', tg5Svg(g), tg5OptsT(tg5JenisTxt(dir, wt), [0, 1, 2, 3].map(k => tg5JenisTxt(k % 2 === 1, k >= 2)))); },
    () => { let g, v, c; do { const n = ri(4, 5); g = tg5Make(tg5RG, n, n + 1); g.dir = true; g.E.forEach(e => { if (Math.random() < .5) [e.a, e.b] = [e.b, e.a]; }); v = ri(0, n - 1); c = tg5Out(g, v); } while (c < 1); const io = tg5In(g, v); return tg5Mcq(`Berapakah tepi yang <b>keluar</b> dari bucu ${g.nm[v]}?`, tg5Svg(g), tg5OptsN(c, [io, c + io, c + 1, c - 1], null, false)); },
    () => { const D = tg5Wnet(tg5RG, { five: Math.random() < .5 }), p = pick(D.P.filter(x => x.e.length >= 3).concat(D.P.filter(x => x.e.length >= 2))); const ws = p.e.map(i => D.g.E[i].w); return tg5Mcq(`Jumlah pemberat laluan <b>${tg5PStr(D.g, p)}</b>?`, tg5Svg(D.g), tg5OptsN(p.w, [p.w - ws[0], p.w + 1, p.w + ws[ws.length - 1], p.w - 1, p.w + 2], null, true)); }
  ],
  pokok: [
    () => { const n = ri(5, 20), e = Math.random() < .6; return tg5Mcq(e ? `Sebuah pokok mempunyai ${n} bucu. Berapakah bilangan tepinya?` : `Sebuah pokok mempunyai ${n - 1} tepi. Berapakah bilangan bucunya?`, tg5Svg(tg5Make(tg5RG, 6, 5), { col: 'gr' }, 'Contoh pokok'), e ? tg5OptsN(n - 1, [n, n + 1, n - 2, 2 * n], null, true) : tg5OptsN(n, [n - 1, n - 2, n + 1, 2 * (n - 1)], null, true)); },
    () => {
      const n = 4, tree = tg5Make(tg5RG, n, n - 1), cyc = tg5Make(tg5RG, n, n), m5 = tg5Make(tg5RG, n, n + 1);
      let dis; do { dis = tg5Make(tg5RG, n, n - 1, { conn: false }); } while (tg5Conn(dis));
      const gs = shuffle([tree, cyc, m5, dis]), L = ['W', 'X', 'Y', 'Z'], a = L[gs.indexOf(tree)];
      return tg5Mcq('Graf manakah ialah <b>pokok</b>?', tg5Four(tg5RG, gs), { opts: L, c: L.indexOf(a) });
    },
    () => { const n = ri(4, 6), m = ri(n + 1, Math.min(n + 4, n * (n - 1) / 2)), g = tg5Make(tg5RG, n, m), a = m - n + 1; return tg5Mcq('Berapakah tepi yang mesti dibuang supaya graf ini menjadi <b>pokok</b>?', tg5Svg(g, { col: 'gr' }), tg5OptsN(a, [m - n, n - 1, a + 1, m - n + 2], null, true)); }
  ],
  laluan: [
    () => { const D = tg5Wnet(tg5RG, { five: true }), p = pick(D.P.filter(x => x.e.length === 2)); const ws = p.e.map(i => D.g.E[i].w); return tg5Mcq(`Jumlah pemberat laluan <b>${tg5PStr(D.g, p)}</b>?`, tg5Svg(D.g, { col: 'pu' }), tg5OptsN(p.w, [ws[0], ws[1], p.w + 1, p.w - 1, ws[0] * ws[1]], null, true)); },
    () => { const D = tg5Wnet(tg5RG, { five: Math.random() < .5 }), g = D.g, ws = [...new Set(D.P.map(p => p.w))].sort((a, b) => a - b); return tg5Mcq(`Jarak <b>terpendek</b> dari ${g.nm[D.s]} ke ${g.nm[D.t]}?`, tg5Svg(g, { col: 'pu' }), tg5OptsN(D.best.w, ws.slice(1, 4).concat([D.best.w + 1, D.best.w - 1]), null, true)); },
    () => {
      const D = tg5Wnet(tg5RG, { tricky: true, dir: Math.random() < .4 }), g = D.g, others = shuffle(D.P.filter(p => p !== D.best)).slice(0, 3);
      if (others.length < 3) return CQGEN.laluan[1]();
      const A = tg5PStr(g, D.best), opts = shuffle([A, ...others.map(p => tg5PStr(g, p))]);
      return { type: 'mcq', q: `Laluan <b>terpendek</b> dari ${g.nm[D.s]} ke ${g.nm[D.t]}?`, fig: tg5Svg(g, { col: 'pu' }), opts, c: opts.indexOf(A) };
    }
  ]
};
const CQT = { darjah: 'Darjah & tepi', jenis: 'Jenis graf', pokok: 'Subgraf & pokok', laluan: 'Laluan terpendek' };
function tg5CqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.darjah;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['darjah', 'darjah', 'jenis', 'pokok', 'laluan'] : Object.keys(CQT);
  return tg5CqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return tg5CqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
