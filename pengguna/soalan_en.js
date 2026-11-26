'use strict';
/* ENGLISH (DLP): dijana daripada soalan.js oleh alat/en/soalan_pengguna_en.py; jangan sunting dengan tangan. */
/* =================== WANGKU · SOALAN BAB 3 MATEMATIK PENGGUNA (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "mp" / "MP" supaya tidak bertembung dengan teras.
// Peraturan kad kredit (dipermudah ikut buku teks): bayaran minimum = 5% baki atau RM50 (yang lebih tinggi);
// caj lewat = 1% baki (min RM10, maks RM100); caj kewangan = kadar setahun ÷ 12 ke atas baki yang tidak dibayar.

/* =================== pembantu nombor & wang =================== */
/* =================== pecahan bertingkat & punca (25 Nov) =================== */
// mpBt: teks soalan → a/b, ½ … menjadi pecahan bertingkat fr(); √x, √(..), ∛x menjadi rt() bergaris atas.
// Unit (km/j, m/s, RM/kg …) dan perkataan (dan/atau) tidak diubah. Rajah (fig) tidak disentuh.
const MPBTG = { '½': [1, 2], '⅓': [1, 3], '⅔': [2, 3], '¼': [1, 4], '¾': [3, 4], '⅕': [1, 5], '⅖': [2, 5], '⅗': [3, 5], '⅘': [4, 5], '⅙': [1, 6], '⅚': [5, 6], '⅛': [1, 8], '⅜': [3, 8], '⅝': [5, 8], '⅞': [7, 8] };
const MPBTAT = String.raw`(?:\d+(?:\.\d+)?|[A-Za-zθαβ]|\((?:[^()]|\([^()]*\))*\)|\u0004[^\u0006]*\u0006|\u0001[^\u0003]*\u0003)[²³]?`;
const MPBTRE = new RegExp(String.raw`(?<![\w.>\u0003\u0006])((?:${MPBTAT})+)( ?)\/\2((?:${MPBTAT})+)(?![\w]|\.\d)`);
const MPBTUN = /^(?:km|m|cm|mm|RM|kg|g|l|ml|sen|kWj|unit|orang|liter)$/, MPBTUD = /^(?:j|jam|s|min|saat|minit|hari|kg|g|m|m²|m³|cm|cm²|cm³|km|l|L|unit|liter|kWj|minggu|bulan|tahun|orang|kotak)$/;
const mpBtP = x => (/^\((?:[^()]|\([^()]*\))*\)$/.test(x) ? x.slice(1, -1) : x);
function mpBtTok(s) {
  s = s.replace(/[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, c => '\u0001' + MPBTG[c][0] + '\u0002' + MPBTG[c][1] + '\u0003');
  s = s.replace(/([√∛∜])(\((?:[^()]|\([^()]*\))*\)|\d+(?:\.\d+)?|[A-Za-zθ](?![A-Za-z]))/g, (m, r, x) => '\u0004' + ({ '∛': 3, '∜': 4 }[r] || '') + '\u0005' + mpBtP(x) + '\u0006');
  let k = 0, m, skip = '';
  while (k++ < 30 && (m = s.match(MPBTRE))) {
    const a = m[1], b = m[3];
    if ((/^[A-Za-z]{3,}$/.test(a) && /^[A-Za-z]{3,}$/.test(b)) || (MPBTUN.test(a) && MPBTUD.test(b)) || (/^[A-Za-z]{2,}$/.test(a) || /^RM/.test(a)) && MPBTUD.test(b)) {
      skip += s.slice(0, m.index + m[0].length).replace(/\//g, '\u0007'); s = s.slice(m.index + m[0].length); continue;
    }
    s = s.slice(0, m.index) + '\u0001' + mpBtP(a) + '\u0002' + mpBtP(b) + '\u0003' + s.slice(m.index + m[0].length);
  }
  return (skip + s).replace(/\u0007/g, '/');
}
function mpBt(s) {
  if (typeof s !== 'string' || !/[\/½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞√∛∜]/.test(s)) return s;
  s = mpBtTok(s);
  for (let k = 0; k < 12 && /[\u0001\u0004]/.test(s); k++)
    s = s.replace(/\u0001([^\u0001-\u0006]*)\u0002([^\u0001-\u0006]*)\u0003/g, (m, a, b) => fr(a, b))
      .replace(/\u0004([^\u0001-\u0006]*)\u0005([^\u0001-\u0006]*)\u0006/g, (m, n, x) => rt(x, n));
  return s;
}
// mpBtSvg: teks rajah SVG dengan pecahan bertingkat & punca; y = garis tengah, st = gaya isi (cth 'style="fill:var(--tx)"')
function mpBtTree(s) {
  let i = 0;
  const run = stop => {
    const out = []; let buf = '';
    const fl = () => { if (buf) out.push({ t: 's', v: buf }); buf = ''; };
    while (i < s.length) {
      const c = s[i];
      if (stop.includes(c)) break;
      if (c === '\u0001') { fl(); i++; const a = run('\u0002'); i++; const b = run('\u0003'); i++; out.push({ t: 'f', a, b }); }
      else if (c === '\u0004') { fl(); i++; const n = run('\u0005'); i++; const k = run('\u0006'); i++; out.push({ t: 'r', n, k }); }
      else { buf += c; i++; }
    }
    fl(); return out;
  };
  return run('');
}
const mpBtCW = ch => (ch === ' ' ? .27 : /[()[\].,:;'|]/.test(ch) ? .34 : ch === '1' ? .5 : /\d/.test(ch) ? .6 : /[mwMW]/.test(ch) ? .86 : /[−+=×÷<>≤≥]/.test(ch) ? .64 : /[ijlrtf]/.test(ch) ? .32 : /[A-Z]/.test(ch) ? .68 : ch === '°' ? .4 : .57);
function mpBtMeas(L, z) {
  let w = 0, up = z * .5, dn = z * .5;
  L.forEach(n => {
    if (n.t === 's') n.w = [...n.v].reduce((a, ch) => a + z * mpBtCW(ch), 0);
    else if (n.t === 'f') { const z2 = z * .8, A = mpBtMeas(n.a, z2), B = mpBtMeas(n.b, z2); n.A = A; n.B = B; n.w = Math.max(A.w, B.w) + z * .24; up = Math.max(up, A.up + A.dn + z * .12); dn = Math.max(dn, B.up + B.dn + z * .12); }
    else { const K = mpBtMeas(n.k, z), N = mpBtMeas(n.n, z * .5); n.K = K; n.ix = n.n.length ? Math.max(0, N.w - z * .25) : 0; n.w = K.w + z * .76 + n.ix; up = Math.max(up, K.up + z * .14); }
    w += n.w;
  });
  return { w, up, dn };
}
function mpBtDraw(L, x, y, z, st, fw) {
  let o = '';
  const r = v => +v.toFixed(1), col = (st.match(/var\(--[\w-]+\)|#[0-9a-fA-F]{3,8}/) || ['currentColor'])[0];
  L.forEach(n => {
    if (n.t === 's') o += `<text x="${r(x)}" y="${r(y)}" ${st} font-size="${r(z)}" font-weight="${fw}" dominant-baseline="central">${n.v.replace(/ /g, ' ')}</text>`;
    else if (n.t === 'f') {
      o += mpBtDraw(n.a, x + (n.w - n.A.w) / 2, y - z * .12 - n.A.dn, z * .8, st, fw) + mpBtDraw(n.b, x + (n.w - n.B.w) / 2, y + z * .12 + n.B.up, z * .8, st, fw);
      o += `<line x1="${r(x + z * .06)}" y1="${r(y)}" x2="${r(x + n.w - z * .06)}" y2="${r(y)}" style="stroke:${col}" stroke-width="${r(Math.max(1.3, z / 14))}"/>`;
    } else {
      const x0 = x + n.ix, rw = z * .62, top = y - n.K.up - z * .1;
      if (n.n.length) o += mpBtDraw(n.n, x, y - z * .38, z * .5, st, fw);
      o += `<path d="M${r(x0)} ${r(y + z * .05)} L${r(x0 + rw * .3)} ${r(y - z * .05)} L${r(x0 + rw * .6)} ${r(y + z * .5)} L${r(x0 + rw)} ${r(top)} L${r(x + n.w)} ${r(top)}" fill="none" style="stroke:${col}" stroke-width="${r(Math.max(1.3, z / 13))}" stroke-linejoin="round"/>`;
      o += mpBtDraw(n.k, x0 + rw + z * .06, y, z, st, fw);
    }
    x += n.w;
  });
  return o;
}
const mpBtW = (t, z) => mpBtMeas(mpBtTree(mpBtTok(String(t))), z).w;
function mpBtSvg(x, y, t, st, z, anchor = 'middle', fw = 700) {
  const L = mpBtTree(mpBtTok(String(t))), m = mpBtMeas(L, z), x0 = anchor === 'start' ? x : anchor === 'end' ? x - m.w : x - m.w / 2;
  return `<g>${mpBtDraw(L, x0, y, z, st, fw)}</g>`;
}
function mpBtO(o) {
  if (typeof o === 'string') return mpBt(o);
  if (Array.isArray(o)) return o.map(mpBtO);
  if (o && typeof o === 'object') for (const k in o) if (!/fig|svg|img|^type$|^id$|^key$/i.test(k)) o[k] = mpBtO(o[k]);
  return o;
}

const mpR2 = x => Math.round((x + (x >= 0 ? 1e-9 : -1e-9)) * 100) / 100;
const mpGrp = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
// nombor: bulat tanpa perpuluhan, jika tidak 2 t.p. (f = paksa 2 t.p.)
const mpN = (x, f) => { x = mpR2(x); const neg = x < 0; x = Math.abs(x); let s; if (Number.isInteger(x) && !f) s = mpGrp(String(x)); else { const [a, b] = x.toFixed(2).split('.'); s = mpGrp(a) + '.' + b; } return (neg ? '−' : '') + s; };
const mpRM = (x, f) => { x = mpR2(x); return (x < 0 ? '−' : '') + 'RM' + mpN(Math.abs(x), f); };
const mpRMf = x => mpRM(x, !Number.isInteger(mpR2(x)));            // 2 t.p. jika ada sen
const mpD = x => String(+(+x).toFixed(6));                          // perpuluhan kemas (0.035)
const mpPc = r => mpD(r) + '%';
const mpRn = (r, n) => { const v = r / 100 / n; return Math.abs(v * 1e5 - Math.round(v * 1e5)) < 1e-6 ? mpD(v) : `${mpD(r / 100)}/${n}`; };  // r/n kemas
const mpSen = c => (c < 100 ? `${c} sen` : mpRM(c / 100, true));     // c dalam sen
// rawak: mpRG untuk Latihan Kelas / games, mpRW (berbenih) untuk Lembaran Kerja
const mpRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const mpRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };

/* =================== peraturan & rumus =================== */
const mpSimple = (P, r, t) => mpR2(P * r / 100 * t);
const mpComp = (P, r, n, t) => mpR2(P * Math.pow(1 + r / 100 / n, n * t));
const mpMin = B => (B <= 50 ? B : Math.max(mpR2(B * 0.05), 50));
const mpLate = B => Math.min(Math.max(mpR2(B * 0.01), 10), 100);
const mpFC = (sisa, r) => mpR2(sisa * r / 100 / 12);
const MPKOMP = [[1, 'once a year', 'annually'], [2, 'every 6 months', 'half-yearly'], [4, 'every 3 months', 'quarterly'], [12, 'monthly', 'monthly']];
const MPBANK = ['Bank Delima', 'Bank Cempaka', 'Bank Teratai', 'Bank Melur', 'Bank Kenanga', 'Bank Seroja'];
const MPSAHAM = ['Maju Jaya Company', 'Sinar Timur Company', 'Bumi Hijau Company', 'Teknologi Cerdas Company', 'Kelapa Emas Company'];
const MPDANA = ['Dana Amanah Wawasan', 'Dana Bestari', 'Dana Mutiara', 'Dana Harapan'];

/* =================== data bersama =================== */
// set purata kos seringgit yang kemas: [jumlah sebulan, [harga dalam sen × 3]]
const MPPKS = (() => {
  const out = [], A = [120, 150, 200, 240, 300, 360, 400, 450, 480, 500, 600];
  for (const a of A) for (let p1 = 50; p1 <= 300; p1 += 5) for (let p2 = 50; p2 <= 300; p2 += 5) for (let p3 = 50; p3 <= 300; p3 += 5) {
    if (p1 === p2 || p2 === p3 || p1 === p3) continue;
    const c = a * 100; if (c % p1 || c % p2 || c % p3) continue;
    const u = [c / p1, c / p2, c / p3], su = u[0] + u[1] + u[2];
    if ((3 * c) % su) continue;
    const avg = 3 * c / su, mean = (p1 + p2 + p3) / 3;
    if (Math.abs(mean - avg) < 2 || Math.max(...u) > 1500) continue;
    out.push([a, [p1, p2, p3]]);
  }
  return out;
})();
const MPBS1 = [
  ['Savings are excess money that is kept for future use.', true, 'Savings are excess money that is deposited in a financial institution for future use.'],
  ['Investment in shares does not have any risk.', false, 'Share prices can fall, so the level of risk in buying shares is high.'],
  ['A savings account has a high liquidity level.', true, 'Money in a savings account can be withdrawn easily and quickly.'],
  ['Real estate has a high liquidity level because it can be sold immediately.', false, 'Real estate takes time to sell, thus its liquidity level is low.'],
  ['Usually, an investment that can potentially give high returns has a high risk.', true, 'High returns usually come with high risk.'],
  ['Simple interest is calculated on the principal and the accumulated interest.', false, 'Simple interest is calculated on the principal only; compound interest is calculated on the principal and the accumulated interest.'],
  ['For interest compounded every 3 months, the value of n is 4.', true, 'A year has 4 quarters, thus n = 4.'],
  ['Dividend is one form of return on investment in shares.', true, 'Returns on shares can be in the form of dividends and capital gains.'],
  ['The ringgit cost averaging strategy means buying the same number of share units every month.', false, 'This strategy invests the same amount of money on a periodic basis, so the number of units changes according to the price.'],
  ['A fixed deposit gives a higher interest rate than an ordinary savings account.', true, 'Fixed deposit money is saved for a certain period, thus its interest rate is usually higher.']
];
const MPBS2 = [
  ['Credit allows the consumer to get goods now and pay for them later.', true, 'That is the meaning of credit.'],
  ['A credit cardholder who pays the full balance before the due date is not charged any finance charge.', true, 'The finance charge is only imposed on the unpaid balance.'],
  ['Making the minimum payment will remove all finance charges.', false, 'The minimum payment only avoids the late payment charge; the unpaid balance is still charged a finance charge.'],
  ['The late payment charge is imposed if the minimum payment is not made before the due date.', true, 'The late payment charge is imposed when the minimum payment is late or not made.'],
  ['A longer loan period gives a lower total interest.', false, 'Interest = Prt. The larger t is, the larger the total interest.'],
  ['A longer loan period gives a lower monthly instalment.', true, 'The total repayment is divided by more months, thus the instalment is lower (although the interest is higher).'],
  ['A wise consumer spends using the credit card up to the credit limit every month.', false, 'A wise consumer spends according to his ability and does not use the card up to the credit limit.'],
  ['Debt is the amount of money that must be repaid to the lender.', true, 'Debt must be repaid, usually together with interest.'],
  ['The down payment reduces the amount of the car loan.', true, 'Loan = price − down payment.'],
  ['The minimum payment of a credit card is 5% of the outstanding balance even if its value is less than RM50.', false, 'The minimum payment is 5% or RM50, whichever is higher.']
];

/* =================== rajah (SVG ikut tema: var(--…)) =================== */
const mpT = (x, y, t, c = 'tx', sz = 16, a = 'middle', w = 700) => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Inter, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const mpRect = (x, y, w, h, c, op = .18, rx = 10, sw = 2) => `<rect x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" width="${+Math.max(1, w).toFixed(1)}" height="${+Math.max(1, h).toFixed(1)}" rx="${rx}" style="fill:var(--${c});fill-opacity:${op};stroke:var(--${c})" stroke-width="${sw}"/>`;
const mpSvg = (w, h, s, label) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
// penyata / kad maklumat: rows = [[label, nilai, warna]]
function mpFigKad(title, rows, c = 'pa') {
  const H = 58 + rows.length * 36;
  let s = `<rect x="2" y="2" width="336" height="${H - 4}" rx="16" style="fill:var(--surf);stroke:var(--${c})" stroke-width="2.5"/>`;
  s += mpT(170, 28, title, c, 16, 'middle', 800) + `<line x1="18" y1="46" x2="322" y2="46" style="stroke:var(--bd)" stroke-width="2"/>`;
  rows.forEach(([l, v, cl], i) => { s += mpT(20, 66 + i * 36, l, 'mu', 15, 'start', 600) + mpT(320, 66 + i * 36, v, cl || 'tx', 16, 'end', 800); });
  return mpSvg(340, H, s, title);
}
// jadual: head[], rows[][]
function mpFigJadual(head, rows, c = 'gr') {
  const n = head.length, cw = 340 / n, H = 42 + rows.length * 34 + 6;
  let s = `<rect x="2" y="2" width="336" height="${H - 4}" rx="14" style="fill:var(--surf);stroke:var(--bd)" stroke-width="2"/>`;
  head.forEach((h, j) => { s += mpT(cw * j + cw / 2, 24, h, c, 14, 'middle', 800); });
  s += `<line x1="10" y1="42" x2="330" y2="42" style="stroke:var(--bd)" stroke-width="2"/>`;
  rows.forEach((r, i) => r.forEach((v, j) => { s += mpT(cw * j + cw / 2, 60 + i * 34, v, i === rows.length - 1 && r[0] === 'Total' ? c : 'tx', 15, 'middle', 700); }));
  return mpSvg(340, H, s, 'Table');
}
// carta bar ringkas: bars = [[label, nilai, warna, teks]]
function mpFigBar(bars, title) {
  const W = 340, H = 230, L = 20, R = 320, Bt = 186, Tp = 40, mx = Math.max(...bars.map(b => b[1])) || 1, bw = (R - L) / bars.length;
  let s = title ? mpT(W / 2, 16, title, 'mu', 14, 'middle', 700) : '';
  bars.forEach(([l, v, c, t], i) => { const h = (Bt - Tp) * v / mx, x = L + i * bw + bw * .18; s += mpRect(x, Bt - h, bw * .64, h, c, .3, 6, 2.5) + mpT(x + bw * .32, Bt - h - 12, t, c, 14, 'middle', 800) + mpT(x + bw * .32, Bt + 18, l, 'mu', 13, 'middle', 700); });
  s += `<line x1="${L}" y1="${Bt}" x2="${R}" y2="${Bt}" style="stroke:var(--mu)" stroke-width="2"/>`;
  return mpSvg(W, H, s, title || 'Bar chart');
}
// ikon tema (untuk games)
function mpIkon(kind, big) {
  let s = '';
  if (kind === 'tabung') {
    s = `<ellipse cx="150" cy="150" rx="92" ry="66" style="fill:var(--gr);fill-opacity:.2;stroke:var(--gr)" stroke-width="5"/><rect x="122" y="80" width="56" height="10" rx="4" style="fill:var(--gr)"/><line x1="92" y1="208" x2="92" y2="232" style="stroke:var(--gr)" stroke-width="12" stroke-linecap="round"/><line x1="208" y1="208" x2="208" y2="232" style="stroke:var(--gr)" stroke-width="12" stroke-linecap="round"/><circle cx="200" cy="138" r="7" style="fill:var(--gr)"/><circle cx="150" cy="46" r="24" style="fill:var(--am);fill-opacity:.25;stroke:var(--am)" stroke-width="4"/>` + mpT(150, 47, 'RM', 'am', 17, 'middle', 800);
  } else if (kind === 'saham') {
    s = [60, 95, 75, 130].map((h, i) => mpRect(50 + i * 52, 230 - h, 36, h, 'am', .3, 6, 3)).join('') + `<polyline points="60,170 112,130 164,150 236,70" style="fill:none;stroke:var(--pk)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><polyline points="214,66 238,68 236,92" style="fill:none;stroke:var(--pk)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><line x1="36" y1="232" x2="264" y2="232" style="stroke:var(--mu)" stroke-width="3"/>`;
  } else if (kind === 'kad') {
    s = `<rect x="30" y="70" width="240" height="152" rx="18" style="fill:var(--pa);fill-opacity:.2;stroke:var(--pa)" stroke-width="5"/>` + mpRect(56, 104, 46, 34, 'am', .35, 6, 3) + mpT(56, 172, '•••• •••• •••• 2026', 'tx', 19, 'start', 800) + `<circle cx="218" cy="198" r="15" style="fill:var(--rd);fill-opacity:.6"/><circle cx="236" cy="198" r="15" style="fill:var(--am);fill-opacity:.6"/>`;
  } else if (kind === 'kereta') {
    s = `<path d="M24 190 L44 150 L96 140 L124 100 L196 100 L228 140 L270 150 L278 190 Z" style="fill:var(--tr);fill-opacity:.2;stroke:var(--tr)" stroke-width="5" stroke-linejoin="round"/><path d="M130 108 L104 140 L158 140 L158 108 Z M168 108 L168 140 L216 140 L192 108 Z" style="fill:var(--tr);fill-opacity:.4"/><circle cx="84" cy="192" r="24" style="fill:var(--surf);stroke:var(--mu)" stroke-width="6"/><circle cx="220" cy="192" r="24" style="fill:var(--surf);stroke:var(--mu)" stroke-width="6"/>`;
  } else {
    s = `<path d="M40 140 L150 56 L260 140" style="fill:none;stroke:var(--pu)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` + mpRect(66, 136, 168, 100, 'pu', .2, 6, 5) + mpRect(132, 170, 38, 66, 'pu', .45, 4, 3);
  }
  return mpSvg(300, 260, s, 'Icon ' + kind);
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 3.1 Simpanan & Pelaburan ---------- */
  faedahMudah: [
    ({ P, r, t }) => ({ q: `Calculate the simple interest for a principal of RM${mpN(P)} at a rate of ${mpPc(r)} per annum for ${t} years.` }),
    ({ P, r, t, B }) => ({ q: `${vnama()} deposits RM${mpN(P)} in a fixed deposit account at ${B} that offers simple interest of ${mpPc(r)} per annum. How much is the interest earned after ${t} years?` }),
    ({ P, r, t }) => ({ q: `A school cooperative deposits RM${mpN(P)} with a simple interest rate of ${mpPc(r)} per annum. Find the total interest after ${t} years.` }),
    ({ P, r, t, ans }) => { const N = vnama(); return Object.assign({ q: `${N} calculates the simple interest for RM${mpN(P)} at a rate of ${mpPc(r)} per annum for ${t} years as RM${mpN(P * r * t)}. Is ${N} correct?` }, salah(N, ans, `${N} did not change ${mpPc(r)} to ${mpD(r / 100)}.`)); },
    ({ P, r, t }) => ({ q: `Complete: I = Prt = ${mpN(P)} × ${mpD(r / 100)} × ${t} = ___` })
  ],
  nilaiMatang: [
    ({ P, r, t }) => ({ q: `RM${mpN(P)} is deposited with a simple interest rate of ${mpPc(r)} per annum for ${t} years. Calculate the matured value of the savings.` }),
    ({ P, r, t, B }) => ({ q: `${vnama()} puts RM${mpN(P)} in a fixed deposit at ${B} at a simple interest rate of ${mpPc(r)} per annum. What is the total amount of money after ${t} years?` }),
    ({ P, r, t }) => ({ q: `Find the matured value of savings of RM${mpN(P)} that earns simple interest of ${mpPc(r)} per annum for ${t} years.` }),
    ({ P, r, t, I, ans }) => { const N = vnama(); return Object.assign({ q: `Savings of RM${mpN(P)} earn simple interest of ${mpPc(r)} per annum for ${t} years. ${N} says its matured value is ${mpRMf(I)}. Is ${N} correct?` }, salah(N, ans, `${mpRMf(I)} is the interest only. Matured value = principal + interest.`)); }
  ],
  tempohBulan: [
    ({ P, r, m }) => ({ q: `Calculate the simple interest for RM${mpN(P)} at a rate of ${mpPc(r)} per annum for ${m} months.` }),
    ({ P, r, m }) => ({ q: `${vnama()} deposits RM${mpN(P)} in a ${m}-month fixed deposit with a simple interest rate of ${mpPc(r)} per annum. How much interest is received?` }),
    ({ P, r, m }) => ({ q: `RM${mpN(P)} is deposited for ${m} months at a simple interest rate of ${mpPc(r)} per annum. Find the interest.` }),
    ({ P, r, m, ans }) => { const N = vnama(); return Object.assign({ q: `For savings of RM${mpN(P)} at ${mpPc(r)} per annum for ${m} months, ${N} writes I = ${mpN(P)} × ${mpD(r / 100)} × ${m}. Is ${N} correct?` }, salah(N, ans, `The time must be in years: ${m} months = ${m}/12 year.`)); }
  ],
  nKompaun: [
    ({ r, kl, t }) => ({ q: `Interest of ${mpPc(r)} per annum is compounded ${kl} for ${t} years. State the value of n and the value of nt in the formula MV = P(1 + r/n)<sup>nt</sup>.` }),
    ({ r, kl, t }) => ({ q: `A bank offers interest of ${mpPc(r)} per annum compounded ${kl}. For savings over ${t} years, what are the values of n and nt?` }),
    ({ r, kl, t, n }) => ({ q: `Interest of ${mpPc(r)} per annum is compounded ${kl} for ${t} years. State the values of r/n and nt.`, ans: `r/n = ${mpRn(r, n)}, nt = ${n * t}` }),
    ({ r, kl, t, n }) => ({ q: `Complete for interest of ${mpPc(r)} per annum compounded ${kl} for ${t} years: MV = P(1 + ___)<sup>___</sup>`, ans: `MV = P(1 + ${mpD(r / 100)}/${n})<sup>${n * t}</sup>` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `State whether the following statement is true or false: "${s}"`, ans: ok ? 'True' : 'False' }),
    ({ s, ok }) => ({ q: `True or false? ${s}`, ans: ok ? 'True' : 'False' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} says, "${s}" Is ${N} correct?`, ans: ok ? `Yes, ${N} is correct` : `No, ${N} is not correct` }; }
  ],
  kompaun: [
    ({ P, r, kl, t }) => ({ q: `RM${mpN(P)} is deposited with an interest rate of ${mpPc(r)} per annum compounded ${kl}. Calculate the matured value after ${t} years.` }),
    ({ P, r, kl, t, B }) => ({ q: `${vnama()} saves RM${mpN(P)} at ${B} that offers interest of ${mpPc(r)} per annum compounded ${kl}. What is the value of the savings after ${t} years?` }),
    ({ P, r, kl, t }) => ({ q: `Find the matured value of an investment of RM${mpN(P)} for ${t} years at a rate of ${mpPc(r)} per annum compounded ${kl}. Give the answer correct to the nearest sen.` }),
    ({ P, r, n, t }) => ({ q: `Complete: MV = ${mpN(P)}(1 + ${mpD(r / 100)}/${n})<sup>${n * t}</sup> = ___` })
  ],
  faedahKompaun: [
    ({ P, r, kl, t }) => ({ q: `Calculate the compound interest earned from savings of RM${mpN(P)} at a rate of ${mpPc(r)} per annum compounded ${kl} for ${t} years.` }),
    ({ P, r, kl, t }) => ({ q: `${vnama()} saves RM${mpN(P)} for ${t} years. Interest of ${mpPc(r)} per annum is compounded ${kl}. What is the total interest received?` }),
    ({ P, r, kl, t, MV, ans }) => { const N = vnama(); return Object.assign({ q: `Savings of RM${mpN(P)} earn interest of ${mpPc(r)} per annum compounded ${kl} for ${t} years. ${N} says the interest is ${mpRM(MV, true)}. Is ${N} correct?` }, salah(N, ans, `${mpRM(MV, true)} is the matured value. Interest = MV − P.`)); }
  ],
  roi: [
    ({ u, b, d, j, Sy }) => ({ q: `${vnama()} bought ${mpN(u)} units of ${Sy} shares at ${mpSen(b)} per unit. A dividend of ${mpSen(d)} per unit was received and then all the shares were sold at ${mpSen(j)} per unit. Calculate the return on investment in percentage.` }),
    ({ u, b, d, j }) => ({ q: `A total of ${mpN(u)} share units were bought at ${mpSen(b)} per unit. After a year, a dividend of ${mpSen(d)} per unit was paid and the shares were sold at ${mpSen(j)} per unit. What is the return on investment (ROI)?` }),
    ({ u, b, d, j }) => ({ q: `An investor bought ${mpN(u)} share units at ${mpSen(b)} per unit, received a dividend of ${mpSen(d)} per unit, and then sold them at ${mpSen(j)} per unit. Determine the return on investment.` }),
    ({ u, b, d, j, Sy }) => ({ q: `The table below shows an investment in ${Sy} shares. Calculate the return on investment.`, rev: false })
  ],
  purataKos: [
    ({ a, Dn }) => ({ q: `${vnama()} invests RM${mpN(a)} every month in ${Dn} using the ringgit cost averaging strategy. The unit price for three months is shown in the table. Calculate the average cost per unit.` }),
    ({ a }) => ({ q: `An investor buys unit trusts worth RM${mpN(a)} every month for three months at the prices shown in the table. What is the average cost per unit?` }),
    ({ a }) => ({ q: `Based on the table, RM${mpN(a)} is invested every month. Find the total number of units bought and the average cost per unit.` }),
    ({ a, mean, ans }) => { const N = vnama(); return Object.assign({ q: `RM${mpN(a)} is invested every month at the prices shown in the table. ${N} says the average cost per unit is ${mpRM(mean / 100, true)}, that is the mean of the three prices. Is ${N} correct?` }, salah(N, ans, 'Average cost per unit = total money invested ÷ total number of units, not the mean of the prices.')); }
  ],
  cariPrt: [
    ({ P, r, t, I, find }) => find === 't' ? { q: `Savings of RM${mpN(P)} at a simple interest rate of ${mpPc(r)} per annum earn interest of ${mpRMf(I)}. How many years is the savings period?` }
      : find === 'r' ? { q: `Savings of RM${mpN(P)} earn simple interest of ${mpRMf(I)} after ${t} years. Find the interest rate per annum.` } : { q: `Find the principal that earns simple interest of ${mpRMf(I)} at a rate of ${mpPc(r)} per annum for ${t} years.` },
    ({ P, r, t, I, find }) => find === 't' ? { q: `How long must RM${mpN(P)} be saved at a simple interest rate of ${mpPc(r)} per annum to earn interest of ${mpRMf(I)}?` }
      : find === 'r' ? { q: `RM${mpN(P)} is saved for ${t} years and earns simple interest of ${mpRMf(I)}. Calculate the interest rate per annum.` } : { q: `How much money must be saved for ${t} years at a simple interest rate of ${mpPc(r)} per annum to earn interest of ${mpRMf(I)}?` },
    ({ P, r, t, I, find }) => find === 't' ? { q: `${vnama()} saves RM${mpN(P)} with simple interest of ${mpPc(r)} per annum and receives interest of ${mpRMf(I)}. Find the savings period.` }
      : find === 'r' ? { q: `The simple interest for RM${mpN(P)} for ${t} years is ${mpRMf(I)}. What is the interest rate per annum?` } : { q: `${vnama()} receives simple interest of ${mpRMf(I)} after saving for ${t} years at ${mpPc(r)} per annum. How much money was saved?` }
  ],
  k31: [
    ({ bk }) => ({ q: `${bk.N} has RM${mpN(bk.P)} to save for ${bk.t} years. ${bk.A} offers simple interest of ${mpPc(bk.r1)} per annum, while ${bk.Bn} offers interest of ${mpPc(bk.r2)} per annum compounded ${bk.kl}. (a) Calculate the matured value for each offer. (b) Which offer is more profitable and what is the difference?`, ans: `(a) ${bk.A}: ${mpRMf(bk.m1)}; ${bk.Bn}: ${mpRM(bk.m2, true)} (b) ${bk.best}, difference ${mpRM(Math.abs(bk.m2 - bk.m1), true)}`, work: [`${bk.A}: MV = ${mpN(bk.P)} + ${mpN(bk.P)} × ${mpD(bk.r1 / 100)} × ${bk.t} = ${mpRMf(bk.m1)}`, `${bk.Bn}: MV = ${mpN(bk.P)}(1 + ${mpD(bk.r2 / 100)}/${bk.n})<sup>${bk.n * bk.t}</sup> = ${mpRM(bk.m2, true)}`, `Difference = ${mpRM(Math.abs(bk.m2 - bk.m1), true)}, thus ${bk.best} is more profitable.`] }),
    ({ hr }) => ({ q: `${hr.N} bought a house at RM${mpN(hr.H)} and rented it out at RM${mpN(hr.sw)} per month for ${hr.y} years. Throughout the period, maintenance costs and taxes totalled RM${mpN(hr.kos)}. The house was then sold at a price of RM${mpN(hr.J)}. Calculate the return on investment.`, ans: `${mpD(hr.roi)}%`, work: [`Rental = ${mpN(hr.sw)} × ${12 * hr.y} = ${mpRM(hr.sw * 12 * hr.y)}`, `Capital gain = ${mpN(hr.J)} − ${mpN(hr.H)} = ${mpRM(hr.J - hr.H)}`, `Total return = ${mpN(hr.sw * 12 * hr.y)} + ${mpN(hr.J - hr.H)} − ${mpN(hr.kos)} = ${mpRM(hr.ret)}`, `ROI = ${mpN(hr.ret)} ÷ ${mpN(hr.H)} × 100% = ${mpD(hr.roi)}%`] }),
    ({ pk }) => ({ q: `${pk.N} invests RM${mpN(pk.a)} every month in ${pk.Dn} for three months. The unit prices are ${pk.p.map(c => mpRM(c / 100, true)).join(', ')}. (a) Calculate the average cost per unit. (b) If the whole RM${mpN(3 * pk.a)} is invested in the first month, how many units are obtained? (c) Which strategy gives more units?`, ans: `(a) ${mpRM(pk.avg / 100, true)} (b) ${mpN(pk.lump)} units (c) ${pk.lump > pk.su ? 'Investing a lump sum in the first month' : 'Ringgit cost averaging'}`, work: [`Units = ${pk.u.map(x => mpN(x)).join(' + ')} = ${mpN(pk.su)}`, `(a) Average cost per unit = ${mpN(3 * pk.a)} ÷ ${mpN(pk.su)} = ${mpRM(pk.avg / 100, true)}`, `(b) ${mpN(3 * pk.a)} ÷ ${mpRM(pk.p[0] / 100, true)} = ${mpN(pk.lump)} units`, `(c) ${mpN(pk.su)} units compared to ${mpN(pk.lump)} units.`] }),
    ({ sg }) => ({ q: `${sg.N} saves RM${mpN(sg.P)} at an interest rate of ${mpPc(sg.r)} per annum compounded once a year. After how many full years will the savings first exceed RM${mpN(sg.X)}?`, ans: `${sg.t} years`, work: sg.rows.map(([k, v]) => `Year ${k}: ${mpN(sg.P)}(1 + ${mpD(sg.r / 100)})<sup>${k}</sup> = ${mpRM(v, true)}`).concat([`Thus after ${sg.t} years, the savings exceed RM${mpN(sg.X)}.`]) })
  ],

  /* ---------- 3.2 Kredit & Hutang ---------- */
  bayarMin: [
    ({ B }) => ({ q: `The outstanding balance of ${vnama()}'s credit card is RM${mpN(B)}. The minimum payment is 5% of the outstanding balance or RM50, whichever is higher. Calculate the minimum payment.` }),
    ({ B }) => ({ q: `A credit card statement shows an outstanding balance of RM${mpN(B)}. What is the minimum payment? (5% or RM50, whichever is higher)` }),
    () => ({ q: 'Based on the credit card statement below, calculate the minimum payment to be paid. (5% or RM50, whichever is higher)' }),
    ({ B, ans }) => { const N = vnama(); return Object.assign({ q: `The outstanding balance of a credit card is RM${mpN(B)}. ${N} says the minimum payment is ${mpRMf(B * 0.05)}. Is ${N} correct? (5% or RM50, whichever is higher)` }, salah(N, ans, `5% × ${mpN(B)} = ${mpRMf(B * 0.05)}, which is less than RM50. Take the higher value.`)); }
  ],
  cajLewat: [
    ({ B }) => ({ q: `The outstanding balance of a credit card is RM${mpN(B)}. The minimum payment is not made before the due date. Calculate the late payment charge if the rate is 1% of the outstanding balance (minimum RM10, maximum RM100).` }),
    ({ B }) => ({ q: `${vnama()} forgot to make the credit card payment before the due date. The outstanding balance is RM${mpN(B)}. The late payment charge is 1% of the outstanding balance, minimum RM10 and maximum RM100. How much is the late payment charge imposed?` }),
    () => ({ q: 'The cardholder in the statement below did not make any payment before the due date. Calculate the late payment charge. (1%, minimum RM10, maximum RM100)' }),
    ({ B }) => ({ q: `Complete: Late payment charge = 1% × RM${mpN(B)} = ${mpRMf(B * 0.01)} → late payment charge imposed = ___ (minimum RM10, maximum RM100)` })
  ],
  faedahPinjam: [
    ({ P, r, t }) => ({ q: `Calculate the total interest for a loan of RM${mpN(P)} at an interest rate of ${mpPc(r)} per annum for ${t} years.` }),
    ({ P, r, t, B }) => ({ q: `${vnama()} borrows RM${mpN(P)} from ${B} at a rate of ${mpPc(r)} per annum for a period of ${t} years. How much interest must be paid?` }),
    ({ P, r, t }) => ({ q: `A personal loan of RM${mpN(P)} is charged a flat interest rate of ${mpPc(r)} per annum. Find the total interest for a period of ${t} years.` }),
    ({ P, r, t }) => ({ q: `Complete: Interest = Prt = ${mpN(P)} × ${mpD(r / 100)} × ${t} = ___` })
  ],
  jumlahBayar: [
    ({ P, r, t }) => ({ q: `Calculate the total repayment for a loan of RM${mpN(P)} at an interest rate of ${mpPc(r)} per annum for ${t} years.` }),
    ({ P, r, t, B }) => ({ q: `${vnama()} obtained a personal loan of RM${mpN(P)} from ${B}. The interest rate is ${mpPc(r)} per annum for ${t} years. What is the total amount to be repaid?` }),
    ({ P, r, t }) => ({ q: `Find the total repayment, A, for a loan of RM${mpN(P)} at a rate of ${mpPc(r)} per annum for ${t} years.` }),
    ({ P, r, t, I, ans }) => { const N = vnama(); return Object.assign({ q: `For a loan of RM${mpN(P)} at ${mpPc(r)} per annum for ${t} years, ${N} says the total repayment is ${mpRMf(I)}. Is ${N} correct?` }, salah(N, ans, `${mpRMf(I)} is the interest only. A = P + Prt.`)); }
  ],
  ansuran: [
    ({ P, r, t }) => ({ q: `A loan of RM${mpN(P)} is charged interest of ${mpPc(r)} per annum for ${t} years. Calculate the monthly instalment.` }),
    ({ P, r, t, B }) => ({ q: `${vnama()} borrows RM${mpN(P)} from ${B} to buy a laptop. The interest rate is ${mpPc(r)} per annum and the loan period is ${t} years. What is the monthly instalment?` }),
    ({ P, r, t }) => ({ q: `Find the monthly instalment for a personal loan of RM${mpN(P)} at an interest rate of ${mpPc(r)} per annum repaid over ${t} years.` }),
    ({ P, r, t, ans }) => { const N = vnama(); return Object.assign({ q: `For a loan of RM${mpN(P)} at ${mpPc(r)} per annum for ${t} years, ${N} calculates the monthly instalment as ${mpRMf(P / (12 * t))}. Is ${N} correct?` }, salah(N, ans, `${N} forgot to add the interest. Instalment = (P + Prt) ÷ number of months.`)); }
  ],
  cajKewangan: [
    ({ B, pay, r }) => ({ q: `The outstanding balance of a credit card is RM${mpN(B)}. The cardholder pays RM${mpN(pay)} before the due date. A finance charge of ${mpPc(r)} per annum is imposed on the unpaid balance. Calculate (a) the finance charge for that month, (b) the balance for the following month.` }),
    ({ B, pay, r }) => ({ q: `${vnama()} has a credit card balance of RM${mpN(B)} and only pays RM${mpN(pay)}. If the finance charge is ${mpPc(r)} per annum, what is the finance charge for a month and the new balance?` }),
    ({ r }) => ({ q: `Based on the statement below, a finance charge of ${mpPc(r)} per annum is imposed on the unpaid balance. Calculate the finance charge for a month and the balance for the following month.` })
  ],
  pinjamKereta: [
    ({ H, d, r, t }) => ({ q: `The price of a car is RM${mpN(H)}. ${vnama()} pays ${d}% down payment and takes a loan for the balance at a rate of ${mpPc(r)} per annum for ${t} years. Calculate the monthly instalment.` }),
    ({ H, d, r, t }) => ({ q: `A used car priced at RM${mpN(H)} is bought with a ${d}% down payment. The balance is financed by a loan at ${mpPc(r)} per annum for ${t} years. What is the monthly payment?` }),
    ({ H, d, r, t }) => ({ q: `A teacher buys a car at RM${mpN(H)}. The down payment is ${d}% of the price of the car. The loan interest rate is ${mpPc(r)} per annum for ${t} years. Find (a) the loan amount, (b) the monthly instalment.` })
  ],
  cariKadar: [
    ({ P, t, m }) => ({ q: `A loan of RM${mpN(P)} is repaid with an instalment of ${mpRMf(m)} per month for ${t} years. Calculate the interest rate per annum.` }),
    ({ P, t, m }) => ({ q: `${vnama()} borrows RM${mpN(P)} and pays ${mpRMf(m)} per month for ${t} years. What is the interest rate per annum for the loan?` }),
    ({ P, t, m }) => ({ q: `A finance company offers a loan of RM${mpN(P)} with an instalment of ${mpRMf(m)} per month for ${12 * t} months. Find the interest rate per annum.` })
  ],
  k32: [
    ({ kk }) => ({ q: `The outstanding balance of ${kk.N}'s credit card in March is RM${mpN(kk.B)}. The minimum payment is made before the due date and the card is not used again. In April, no payment is made before the due date. The finance charge is 18% per annum. Calculate (a) the minimum payment for March, (b) the balance for April, (c) the balance for May.`, ans: `(a) ${mpRMf(kk.m)} (b) ${mpRM(kk.B2, true)} (c) ${mpRM(kk.B3, true)}`, work: [`(a) 5% × ${mpN(kk.B)} = ${mpRMf(kk.B * 0.05)} → minimum payment = ${mpRMf(kk.m)}`, `(b) Finance charge = (${mpN(kk.B)} − ${mpN(kk.m)}) × 1.5% = ${mpRM(kk.f1, true)}; balance for April = ${mpRM(kk.B2, true)}`, `(c) Late payment charge = 1% × ${mpN(kk.B2, true)} → ${mpRM(kk.late, true)}; finance charge = ${mpN(kk.B2, true)} × 1.5% = ${mpRM(kk.f2, true)}`, `Balance for May = ${mpN(kk.B2, true)} + ${mpN(kk.late, true)} + ${mpN(kk.f2, true)} = ${mpRM(kk.B3, true)}`] }),
    ({ dt }) => ({ q: `${dt.N} wants to borrow RM${mpN(dt.P)}. ${dt.A} offers a rate of ${mpPc(dt.r1)} per annum for ${dt.t1} years, while ${dt.Bn} offers a rate of ${mpPc(dt.r2)} per annum for ${dt.t2} years. (a) Calculate the monthly instalment for each offer. (b) Which offer has a lower total interest? What is the difference?`, ans: `(a) ${dt.A}: ${mpRMf(dt.m1)}; ${dt.Bn}: ${mpRMf(dt.m2)} (b) ${dt.low}, difference ${mpRMf(Math.abs(dt.I1 - dt.I2))}`, work: [`${dt.A}: interest = ${mpN(dt.P)} × ${mpD(dt.r1 / 100)} × ${dt.t1} = ${mpRMf(dt.I1)}; instalment = ${mpN(dt.P + dt.I1)} ÷ ${12 * dt.t1} = ${mpRMf(dt.m1)}`, `${dt.Bn}: interest = ${mpN(dt.P)} × ${mpD(dt.r2 / 100)} × ${dt.t2} = ${mpRMf(dt.I2)}; instalment = ${mpN(dt.P + dt.I2)} ÷ ${12 * dt.t2} = ${mpRMf(dt.m2)}`, `Difference in interest = ${mpRMf(Math.abs(dt.I1 - dt.I2))}, thus ${dt.low} is lower.`] }),
    ({ bj }) => ({ q: `${bj.N} wants to buy a car priced at RM${mpN(bj.H)} with a ${bj.d}% down payment. The loan interest rate is ${mpPc(bj.r)} per annum. The monthly instalment that can be afforded is not more than RM${mpN(bj.max)}. Find the shortest suitable loan period (in full years).`, ans: `${bj.t} years (instalment ${mpRMf(bj.m)})`, work: [`Loan = ${mpN(bj.H)} − ${bj.d}% × ${mpN(bj.H)} = ${mpRM(bj.P)}`].concat(bj.rows.map(([t, m]) => `${t} years: (${mpN(bj.P)} + ${mpN(bj.P)} × ${mpD(bj.r / 100)} × ${t}) ÷ ${12 * t} = ${mpRMf(m)}`), [`A period of ${bj.t} years is the shortest with an instalment ≤ RM${mpN(bj.max)}.`]) }),
    ({ ch }) => ({ q: `${ch.N} pays an instalment of ${mpRMf(ch.m)} per month for ${ch.t} years for a car loan at an interest rate of ${mpPc(ch.r)} per annum. A ${ch.d}% down payment has been paid. Find (a) the loan amount, (b) the price of the car.`, ans: `(a) ${mpRM(ch.P)} (b) ${mpRM(ch.H)}`, work: [`A = ${mpN(ch.m, !Number.isInteger(ch.m))} × ${12 * ch.t} = ${mpRM(ch.A)}`, `A = P(1 + rt) → P = ${mpN(ch.A)} ÷ (1 + ${mpD(ch.r / 100)} × ${ch.t}) = ${mpRM(ch.P)}`, `Loan = ${100 - ch.d}% of the price → price = ${mpN(ch.P)} ÷ ${mpD((100 - ch.d) / 100)} = ${mpRM(ch.H)}`] })
  ]
};

/* =================== pembina soalan (r = mpRG atau mpRW) =================== */
const MP = {};
const mpPRT = (r, Ps, rs, ts) => [r.p(Ps), r.p(rs), r.p(ts)];
/* ---------- 3.1 ---------- */
MP.faedahMudah = r => {
  const [P, rr, t] = mpPRT(r, [1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000], [2, 2.5, 3, 3.5, 4, 4.5, 5, 6], [2, 3, 4, 5, 6, 8, 10]);
  const I = mpSimple(P, rr, t), ans = mpRMf(I);
  return GEN_LQ('faedahMudah', { P, r: rr, t, B: r.p(MPBANK), ans, work: ['I = Prt', `= ${mpN(P)} × ${mpD(rr / 100)} × ${t}`, `= ${ans}`] });
};
MP.nilaiMatang = r => {
  const [P, rr, t] = mpPRT(r, [1000, 2000, 2500, 3000, 4000, 5000, 6000, 7500, 8000, 10000, 12000, 16000], [2, 3, 3.5, 4, 4.5, 5, 5.5, 6], [2, 3, 4, 5, 6]);
  const I = mpSimple(P, rr, t), ans = mpRMf(P + I);
  return GEN_LQ('nilaiMatang', { P, r: rr, t, I, B: r.p(MPBANK), ans, work: [`I = ${mpN(P)} × ${mpD(rr / 100)} × ${t} = ${mpRMf(I)}`, `MV = P + I = ${mpN(P)} + ${mpN(I)}`, `= ${ans}`] },
    { fig: mpFigBar([['Principal', P, 'tr', mpRM(P)], ['Interest', I, 'gr', '?'], ['Matured value', P + I, 'am', '?']], `${mpPc(rr)} per annum, ${t} years`) });
};
MP.tempohBulan = r => {
  let P, rr, m, I; do { P = r.p([1200, 2000, 2400, 3000, 3600, 4000, 4800, 6000, 8000, 9000, 10000, 12000]); rr = r.p([2, 2.5, 3, 3.5, 4, 4.5, 5, 6]); m = r.p([3, 4, 6, 8, 9, 15, 18, 30]); I = P * rr / 100 * m / 12; } while (Math.abs(I * 100 - Math.round(I * 100)) > 1e-6);
  const ans = mpRMf(I);
  return GEN_LQ('tempohBulan', { P, r: rr, m, ans, work: [`t = ${m} months = ${m}/12 year`, `I = ${mpN(P)} × ${mpD(rr / 100)} × ${m}/12`, `= ${ans}`] });
};
MP.nKompaun = (r, k) => {
  const [n, kl] = k == null ? r.p(MPKOMP) : MPKOMP[k % 4], rr = r.p([3, 4, 5, 6, 8, 12]), t = r.p([2, 3, 4, 5, 6, 10]);
  return GEN_LQ('nKompaun', { r: rr, kl, t, n, ans: `n = ${n}, nt = ${n * t}`, work: [`Compounded ${kl} → ${n} times a year, thus n = ${n}.`, `nt = ${n} × ${t} = ${n * t}`, `r/n = ${mpD(rr / 100)} ÷ ${n}${mpRn(rr, n).includes('/') ? '' : ' = ' + mpRn(rr, n)}`] });
};
MP.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
function mpKompData(r) {
  const P = r.p([1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000]), kk = r.p(MPKOMP.slice(0, 3).concat([MPKOMP[0], MPKOMP[1]])), rr = r.p([3, 4, 5, 6, 8]), t = r.p([2, 3, 4, 5]);
  return { P, r: rr, n: kk[0], kl: kk[1], t, MV: mpComp(P, rr, kk[0], t) };
}
MP.kompaun = r => {
  const d = mpKompData(r), ans = mpRM(d.MV, true);
  return GEN_LQ('kompaun', Object.assign(d, { B: r.p(MPBANK), ans, work: ['MV = P(1 + r/n)<sup>nt</sup>', `= ${mpN(d.P)}(1 + ${mpD(d.r / 100)}/${d.n})<sup>${d.n} × ${d.t}</sup>`, `= ${mpN(d.P)}(${mpD(1 + d.r / 100 / d.n)})<sup>${d.n * d.t}</sup>`, `= ${ans}`] }));
};
MP.faedahKompaun = r => {
  const d = mpKompData(r), I = mpR2(d.MV - d.P), ans = mpRM(I, true);
  return GEN_LQ('faedahKompaun', Object.assign(d, { ans, work: [`MV = ${mpN(d.P)}(1 + ${mpD(d.r / 100)}/${d.n})<sup>${d.n * d.t}</sup> = ${mpRM(d.MV, true)}`, `Compound interest = MV − P = ${mpN(d.MV, true)} − ${mpN(d.P)}`, `= ${ans}`] }));
};
function mpRoiData(r) {
  let u, b, d, j, roi, k = 0;
  do { u = r.p([500, 1000, 1500, 2000, 2500, 3000, 4000, 5000]); b = r.i(16, 100) * 5; d = r.i(2, 20); j = b + r.i(-6, 16) * 5; roi = (d + j - b) * 100 / b; k++; }
  while ((j <= 0 || roi <= 0 || Math.abs(roi * 100 - Math.round(roi * 100)) > 1e-6 || j === b) && k < 400);
  if (k >= 400) { u = 2000; b = 150; d = 9; j = 180; roi = 26; }
  const modal = u * b / 100, dv = u * d / 100, um = u * (j - b) / 100;
  return { u, b, d, j, roi: mpR2(roi), modal, dv, um, tot: dv + um };
}
MP.roi = r => {
  const D_ = mpRoiData(r), Sy = r.p(MPSAHAM);
  const fig = mpFigJadual(['Item', 'Value per unit'], [['Purchase price', mpSen(D_.b)], ['Dividend', mpSen(D_.d)], ['Selling price', mpSen(D_.j)]], 'am');
  const rsign = D_.um < 0 ? `capital loss = ${mpN(D_.u)} × (${mpN(D_.j / 100, true)} − ${mpN(D_.b / 100, true)}) = ${mpRMf(D_.um)}` : `capital gain = ${mpN(D_.u)} × (${mpN(D_.j / 100, true)} − ${mpN(D_.b / 100, true)}) = ${mpRMf(D_.um)}`;
  return GEN_LQ('roi', Object.assign({ Sy, ans: `${mpD(D_.roi)}%`, work: [`Capital = ${mpN(D_.u)} × RM${mpN(D_.b / 100, true)} = ${mpRMf(D_.modal)}`, `Dividend = ${mpN(D_.u)} × RM${mpN(D_.d / 100, true)} = ${mpRMf(D_.dv)}; ${rsign}`, `Total return = ${mpRMf(D_.tot)}`, `ROI = ${mpN(D_.tot)} ÷ ${mpN(D_.modal)} × 100% = ${mpD(D_.roi)}%`] }, D_), { fig });
};
function mpPksData(r) {
  const [a, p] = r.p(MPPKS), u = p.map(c => a * 100 / c), su = u[0] + u[1] + u[2];
  return { a, p, u, su, avg: 3 * a * 100 / su, mean: mpR2((p[0] + p[1] + p[2]) / 3), lump: 3 * a * 100 / p[0] };
}
MP.purataKos = r => {
  const d = mpPksData(r), ans = mpRM(d.avg / 100, true);
  const fig = mpFigJadual(['Month', 'Investment', 'Unit price'], ['January', 'February', 'March'].map((b, i) => [b, mpRM(d.a), mpRM(d.p[i] / 100, true)]), 'pu');
  const figAns = mpFigJadual(['Month', 'Investment', 'Units'], ['January', 'February', 'March'].map((b, i) => [b, mpRM(d.a), mpN(d.u[i])]).concat([['Total', mpRM(3 * d.a), mpN(d.su)]]), 'pu');
  return GEN_LQ('purataKos', Object.assign(d, { Dn: r.p(MPDANA), ans: `${ans} (total units ${mpN(d.su)})`, work: [`Units = ${d.u.map((x, i) => `${mpN(d.a)} ÷ ${mpN(d.p[i] / 100, true)}`).join(', ')} = ${d.u.map(x => mpN(x)).join(', ')}`, `Total units = ${mpN(d.su)}; total investment = ${mpRM(3 * d.a)}`, `Average cost per unit = ${mpN(3 * d.a)} ÷ ${mpN(d.su)} = ${ans}`] }), { fig, figAns });
};
MP.cariPrt = (r, find) => {
  find = find || r.p(['t', 'r', 'P']);
  const P = r.p([1000, 2000, 2500, 4000, 5000, 6000, 8000, 10000, 12000]), rr = r.p([2, 2.5, 3, 4, 5, 6]), t = r.p([2, 3, 4, 5, 6, 8]), I = mpSimple(P, rr, t);
  const ans = find === 't' ? `${t} years` : find === 'r' ? `${mpD(rr)}% per annum` : mpRM(P);
  const work = find === 't' ? ['I = Prt → t = I ÷ (P × r)', `t = ${mpN(I)} ÷ (${mpN(P)} × ${mpD(rr / 100)})`, `= ${t} years`]
    : find === 'r' ? ['I = Prt → r = I ÷ (P × t)', `r = ${mpN(I)} ÷ (${mpN(P)} × ${t}) = ${mpD(rr / 100)}`, `= ${mpD(rr)}% per annum`]
    : ['I = Prt → P = I ÷ (r × t)', `P = ${mpN(I)} ÷ (${mpD(rr / 100)} × ${t})`, `= ${mpRM(P)}`];
  return GEN_LQ('cariPrt', { P, r: rr, t, I, find, ans, work });
};
MP.k31 = r => {
  const N = vnama();
  // (1) mudah vs kompaun
  let bk; do {
    const P = r.p([5000, 8000, 10000, 12000, 20000]), t = r.p([3, 4, 5]), r1 = r.p([3.5, 4, 4.5, 5]), r2 = r1 - r.p([0, 0.5]), kk = r.p(MPKOMP.slice(1, 4)), [A, Bn] = gdShufMP(r, MPBANK).slice(0, 2);
    const m1 = mpR2(P + mpSimple(P, r1, t)), m2 = mpComp(P, r2, kk[0], t);
    bk = { N, P, t, r1, r2, n: kk[0], kl: kk[1], A, Bn, m1, m2, best: m2 > m1 ? Bn : A };
  } while (Math.abs(bk.m2 - bk.m1) < 1);
  // (2) hartanah
  let hr; do { const H = r.p([200, 250, 300, 350, 400, 450, 500]) * 1000, sw = r.p([800, 1000, 1200, 1500, 1800]), y = r.p([2, 3, 4, 5]), J = H + r.p([10, 20, 25, 30, 40, 50]) * 1000, kos = r.p([3, 4, 5, 6, 8, 10]) * 1000, ret = sw * 12 * y + J - H - kos; hr = { N, H, sw, y, J, kos, ret, roi: mpR2(ret * 100 / H) }; } while (Math.abs(hr.roi * 100 - Math.round(hr.roi * 100)) > 1e-6 || hr.ret <= 0 || (hr.ret * 10000) % hr.H);
  // (3) purata kos vs sekali gus
  const pd = mpPksData(r), pk = Object.assign({ N, Dn: r.p(MPDANA) }, pd);
  // (4) sasaran simpanan
  const P4 = r.p([1000, 2000, 5000, 10000]), r4 = r.p([4, 5, 6, 8]), t4 = r.p([3, 4, 5]), lo = P4 * Math.pow(1 + r4 / 100, t4 - 1), hi = P4 * Math.pow(1 + r4 / 100, t4);
  const X = Math.ceil((lo + (hi - lo) * 0.4) / 100) * 100, tt = (() => { let k = 0; while (mpComp(P4, r4, 1, k) <= X) k++; return k; })();
  const rows = []; for (let k = 1; k <= tt; k++) rows.push([k, mpComp(P4, r4, 1, k)]);
  const sg = { N, P: P4, r: r4, X, t: tt, rows };
  const v = vq('k31', { bk, hr, pk, sg });
  return { q: v.q, ans: v.ans, work: v.work };
};
function gdShufMP(r, a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
/* ---------- 3.2 ---------- */
MP.bayarMin = (r, k) => {
  const low = k == null ? r.f() < .4 : k % 3 === 2, B = low ? r.i(8, 19) * 50 : r.i(11, 120) * 50, m = mpMin(B), ans = mpRMf(m);
  const fig = mpFigKad('CREDIT CARD STATEMENT', [['Outstanding balance', mpRM(B, true)], ['Payment due date', `${r.i(10, 28)} ${r.p(['January', 'March', 'May', 'July', 'October'])}`, 'mu'], ['Minimum payment', '?', 'pa']]);
  return GEN_LQ('bayarMin', { B, ans, work: [`5% × ${mpN(B)} = ${mpRMf(B * 0.05)}`, `Compare with RM50: ${mpRMf(B * 0.05)} ${B * 0.05 >= 50 ? '≥' : '<'} RM50`, `Minimum payment = ${ans}`] }, { fig });
};
MP.cajLewat = (r, k) => {
  const z = k == null ? r.i(0, 2) : k % 3, B = z === 0 ? r.i(3, 9) * 100 : z === 1 ? r.i(11, 98) * 100 + r.p([0, 50]) : r.i(105, 300) * 100, c = mpLate(B), ans = mpRMf(c);
  const fig = mpFigKad('CREDIT CARD STATEMENT', [['Outstanding balance', mpRM(B, true)], ['Payment received', 'RM0.00', 'rd'], ['Late payment charge', '?', 'pa']]);
  return GEN_LQ('cajLewat', { B, ans, work: [`1% × ${mpN(B)} = ${mpRMf(B * 0.01)}`, B * 0.01 < 10 ? 'Less than the minimum RM10, thus the late payment charge = RM10.' : B * 0.01 > 100 ? 'More than the maximum RM100, thus the late payment charge = RM100.' : 'This value is between RM10 and RM100.', `Late payment charge = ${ans}`] }, { fig });
};
function mpLoanData(r, clean) {
  let P, rr, t, I, A, m, k = 0;
  do { P = r.p([3000, 5000, 6000, 8000, 10000, 12000, 15000, 18000, 20000, 24000, 30000, 36000, 40000, 50000]); rr = r.p([3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8]); t = r.p([2, 3, 4, 5, 6, 7]); I = mpSimple(P, rr, t); A = P + I; m = A / (12 * t); k++; }
  while (clean && Math.abs(m * 100 - Math.round(m * 100)) > 1e-6 && k < 300);
  return { P, r: rr, t, I, A: mpR2(A), m: mpR2(m) };
}
MP.faedahPinjam = r => { const d = mpLoanData(r), ans = mpRMf(d.I); return GEN_LQ('faedahPinjam', Object.assign(d, { B: r.p(MPBANK), ans, work: ['Interest = Prt', `= ${mpN(d.P)} × ${mpD(d.r / 100)} × ${d.t}`, `= ${ans}`] })); };
MP.jumlahBayar = r => { const d = mpLoanData(r), ans = mpRMf(d.A); return GEN_LQ('jumlahBayar', Object.assign(d, { B: r.p(MPBANK), ans, work: [`Interest = ${mpN(d.P)} × ${mpD(d.r / 100)} × ${d.t} = ${mpRMf(d.I)}`, `A = P + Prt = ${mpN(d.P)} + ${mpN(d.I)}`, `= ${ans}`] })); };
MP.ansuran = r => {
  const d = mpLoanData(r, true), ans = mpRMf(d.m);
  return GEN_LQ('ansuran', Object.assign(d, { B: r.p(MPBANK), ans, work: [`Interest = ${mpN(d.P)} × ${mpD(d.r / 100)} × ${d.t} = ${mpRMf(d.I)}`, `A = ${mpN(d.P)} + ${mpN(d.I)} = ${mpRMf(d.A)}`, `Instalment = ${mpN(d.A)} ÷ ${12 * d.t} = ${ans}`] }));
};
MP.cajKewangan = r => {
  const B = r.i(10, 80) * 100, rr = r.p([15, 18]), pay = Math.max(mpMin(B), r.p([1, 2, 3, 4, 5]) * 100), sisa = B - pay, f = mpFC(sisa, rr), nb = mpR2(sisa + f);
  const fig = mpFigKad('CREDIT CARD STATEMENT', [['Outstanding balance', mpRM(B, true)], ['Payment (before due date)', mpRM(pay, true), 'gr'], ['Finance charge per annum', mpPc(rr), 'rd']]);
  return GEN_LQ('cajKewangan', { B, pay, r: rr, ans: `(a) ${mpRM(f, true)} (b) ${mpRM(nb, true)}`, work: [`Unpaid balance = ${mpN(B)} − ${mpN(pay)} = ${mpRM(sisa)}`, `(a) Finance charge = ${mpN(sisa)} × ${mpPc(rr)} ÷ 12 = ${mpRM(f, true)}`, `(b) New balance = ${mpN(sisa)} + ${mpN(f, true)} = ${mpRM(nb, true)}`] }, { fig });
};
MP.pinjamKereta = r => {
  let H, d, rr, t, P, I, m, k = 0;
  do { H = r.p([20, 24, 30, 36, 40, 45, 48, 50, 54, 60, 72, 80, 90, 96, 100, 120]) * 1000; d = r.p([10, 15, 20]); rr = r.p([2.5, 3, 3.5, 4, 4.5, 5]); t = r.p([3, 4, 5, 6, 7, 9]); P = H * (100 - d) / 100; I = mpSimple(P, rr, t); m = (P + I) / (12 * t); k++; }
  while ((Math.abs(m * 100 - Math.round(m * 100)) > 1e-6 || H < 5000) && k < 400);
  const ans = mpRMf(m);
  return GEN_LQ('pinjamKereta', { H, d, r: rr, t, ans: `Loan ${mpRM(P)}, instalment ${ans}`, work: [`Down payment = ${d}% × ${mpN(H)} = ${mpRM(H * d / 100)}`, `Loan = ${mpN(H)} − ${mpN(H * d / 100)} = ${mpRM(P)}`, `Interest = ${mpN(P)} × ${mpD(rr / 100)} × ${t} = ${mpRMf(I)}`, `Instalment = (${mpN(P)} + ${mpN(I)}) ÷ ${12 * t} = ${ans}`] });
};
MP.cariKadar = r => {
  let d, k = 0; do { d = mpLoanData(r, true); k++; } while (k < 50 && Math.abs(d.m * 100 - Math.round(d.m * 100)) > 1e-6);
  const A = mpR2(d.m * 12 * d.t);
  return GEN_LQ('cariKadar', { P: d.P, t: d.t, m: d.m, ans: `${mpD(d.r)}% per annum`, work: [`A = ${mpN(d.m, !Number.isInteger(d.m))} × ${12 * d.t} = ${mpRMf(A)}`, `Interest = ${mpN(A)} − ${mpN(d.P)} = ${mpRMf(A - d.P)}`, `r = ${mpN(A - d.P)} ÷ (${mpN(d.P)} × ${d.t}) = ${mpD(d.r / 100)} = ${mpD(d.r)}% per annum`] });
};
MP.k32 = r => {
  const N = vnama();
  // (1) kad kredit dua bulan
  const B = r.i(15, 80) * 100, m = mpMin(B), f1 = mpFC(B - m, 18), B2 = mpR2(B - m + f1), late = mpLate(B2), f2 = mpFC(B2, 18), kk = { N, B, m, f1, B2, late, f2, B3: mpR2(B2 + late + f2) };
  // (2) dua tawaran pinjaman
  let dt, c = 0; do {
    const P = r.p([10000, 12000, 15000, 18000, 20000, 24000, 30000]), [A, Bn] = gdShufMP(r, MPBANK).slice(0, 2), r1 = r.p([4, 4.5, 5, 5.5, 6]), r2 = r1 - r.p([0.5, 1]), t1 = r.p([2, 3, 4]), t2 = t1 + r.p([1, 2]);
    const I1 = mpSimple(P, r1, t1), I2 = mpSimple(P, r2, t2); dt = { N, P, A, Bn, r1, r2, t1, t2, I1, I2, m1: mpR2((P + I1) / (12 * t1)), m2: mpR2((P + I2) / (12 * t2)), low: I1 < I2 ? A : Bn }; c++;
  } while ((dt.I1 === dt.I2 || [dt.m1, dt.m2].some((m, i) => Math.abs(m * 12 * [dt.t1, dt.t2][i] - (dt.P + [dt.I1, dt.I2][i])) > 1e-6)) && c < 300);
  // (3) tempoh paling singkat
  let bj; c = 0; do {
    const H = r.p([40, 45, 50, 60, 72, 80, 90]) * 1000, d = r.p([10, 20]), rr = r.p([3, 3.5, 4]), P = H * (100 - d) / 100, tt = r.i(4, 7);
    const mm = t => mpR2((P + P * rr / 100 * t) / (12 * t)), max = Math.ceil(mm(tt) / 50) * 50;
    let t = 1; while (t < 9 && mm(t) > max) t++;
    const rows = []; for (let k = Math.max(1, t - 2); k <= t; k++) rows.push([k, mm(k)]);
    bj = { N, H, d, r: rr, P, max, t, m: mm(t), rows }; c++;
  } while ((bj.t < 2 || bj.m > bj.max) && c < 100);
  // (4) cari harga kereta
  let ch; c = 0; do {
    const H = r.p([36, 40, 45, 48, 50, 54, 60, 72, 80]) * 1000, d = r.p([10, 20]), rr = r.p([2.5, 3, 4, 5]), t = r.p([4, 5, 6, 8, 9]), P = H * (100 - d) / 100, A = P + P * rr / 100 * t, m = A / (12 * t);
    ch = { N, H, d, r: rr, t, P, A, m: mpR2(m) }; c++;
  } while (Math.abs(ch.m * 100 - Math.round(ch.m * 100)) > 1e-6 && c < 300);
  const v = vq('k32', { kk, dt, bj, ch });
  return { q: v.q, ans: v.ans, work: v.work };
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '3.1': {
    m: [() => MP.faedahMudah(mpRG), () => MP.nilaiMatang(mpRG), () => MP.tempohBulan(mpRG), () => MP.nKompaun(mpRG), () => MP.bs(mpRG, MPBS1)],
    s: [() => MP.kompaun(mpRG), () => MP.faedahKompaun(mpRG), () => MP.roi(mpRG), () => MP.purataKos(mpRG), () => MP.cariPrt(mpRG)],
    k: [() => MP.k31(mpRG)]
  },
  '3.2': {
    m: [() => MP.bayarMin(mpRG), () => MP.cajLewat(mpRG), () => MP.faedahPinjam(mpRG), () => MP.jumlahBayar(mpRG), () => MP.bs(mpRG, MPBS2)],
    s: [() => MP.ansuran(mpRG), () => MP.cajKewangan(mpRG), () => MP.pinjamKereta(mpRG), () => MP.cariKadar(mpRG)],
    k: [() => MP.k32(mpRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 3.1
WG.faedahMudah = () => MP.faedahMudah(mpRW);
WG.nilaiMatang = () => MP.nilaiMatang(mpRW);
WG.tempohBulan = () => MP.tempohBulan(mpRW);
WG.nKompaun = i => MP.nKompaun(mpRW, i + 1);
WG.bs1 = i => MP.bs(mpRW, MPBS1, [1, 3][i % 2] + wri(0, 2) * 2);
WG.kompaun = () => MP.kompaun(mpRW);
WG.faedahKompaun = () => MP.faedahKompaun(mpRW);
WG.roi = () => MP.roi(mpRW);
WG.purataKos = () => MP.purataKos(mpRW);
WG.cariPrt = i => MP.cariPrt(mpRW, ['t', 'r', 'P'][i % 3]);
WG.k31 = () => MP.k31(mpRW);
// 3.2
WG.bayarMin = i => MP.bayarMin(mpRW, i);
WG.cajLewat = i => MP.cajLewat(mpRW, i);
WG.faedahPinjam = () => MP.faedahPinjam(mpRW);
WG.jumlahBayar = () => MP.jumlahBayar(mpRW);
WG.bs2 = i => MP.bs(mpRW, MPBS2, [2, 4][i % 2] + wri(0, 2) * 2);
WG.ansuran = () => MP.ansuran(mpRW);
WG.cajKewangan = () => MP.cajKewangan(mpRW);
WG.pinjamKereta = () => MP.pinjamKereta(mpRW);
WG.cariKadar = () => MP.cariKadar(mpRW);
WG.k32 = () => MP.k32(mpRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '3.1': [['m', 'faedahMudah', 5], ['m', 'nilaiMatang', 5], ['m', 'tempohBulan', 3], ['m', 'nKompaun', 3], ['m', 'bs1', 2],
    ['s', 'kompaun', 2], ['s', 'faedahKompaun', 2], ['s', 'roi', 2], ['s', 'purataKos', 2], ['s', 'cariPrt', 1], ['k', 'k31', 3]],
  '3.2': [['m', 'bayarMin', 5], ['m', 'cajLewat', 4], ['m', 'faedahPinjam', 3], ['m', 'jumlahBayar', 4], ['m', 'bs2', 2],
    ['s', 'ansuran', 3], ['s', 'cajKewangan', 2], ['s', 'pinjamKereta', 2], ['s', 'cariKadar', 2], ['k', 'k32', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan unik: jawapan + calon kesilapan biasa, dipaparkan dengan fungsi f
function mpOpts(ans, cands, f, step) {
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!(c > 0) || !isFinite(c)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const v = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (step || 1); if (v <= 0) continue; const s = f(v); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function mpOptsT(ans, cands) { const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]); return { opts, c: opts.indexOf(ans) }; }
const mpMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const mpStep = v => (v >= 1000 ? 100 : v >= 100 ? 10 : 1);
const CQGEN = {
  faedah: [
    () => { const P = pick([1000, 2000, 4000, 5000, 8000, 10000]), r = pick([2, 3, 4, 5, 6]), t = pick([2, 3, 4, 5]), I = mpSimple(P, r, t);
      return mpMcq(`The simple interest for RM${mpN(P)} at ${r}% per annum for ${t} years is`, mpIkon('tabung'), mpOpts(I, [P * r * t, mpSimple(P, r, 1), P + I, I * 2, mpSimple(P, r, t + 1)], mpRMf, mpStep(I))); },
    () => { if (Math.random() < .5) { const P = pick([2000, 4000, 5000, 6000, 10000]), r = pick([3, 4, 5, 6]), t = pick([2, 3, 4]), I = mpSimple(P, r, t);
        return mpMcq(`The matured value of RM${mpN(P)} with simple interest of ${r}% per annum for ${t} years is`, mpIkon('tabung'), mpOpts(P + I, [I, P + mpSimple(P, r, 1), P + 2 * I, mpComp(P, r, 1, t)], mpRMf, mpStep(P))); }
      const [n, kl] = pick(MPKOMP), t = pick([2, 3, 5]); return mpMcq(`Interest is compounded ${kl} for ${t} years. The value of nt is`, mpIkon('tabung'), mpOpts(n * t, [t, n, n + t, 2 * n * t, 12 * t], v => String(v))); },
    () => { const d = mpKompData(mpRG); return mpMcq(`RM${mpN(d.P)} is deposited at ${d.r}% per annum compounded ${d.kl} for ${d.t} years. The matured value is`, mpIkon('tabung'), mpOpts(d.MV, [mpR2(d.P + mpSimple(d.P, d.r, d.t)), mpComp(d.P, d.r * d.n, d.n, d.t), mpR2(d.MV - d.P), mpComp(d.P, d.r, 1, d.t * d.n)], v => mpRM(v, true), mpStep(d.MV))); }
  ],
  labur: [
    () => { if (Math.random() < .5) { const d = pick([['Savings account', 'High'], ['Real estate', 'Low']]); return mpMcq(`The liquidity level of <b>${d[0].toLowerCase()}</b> is`, mpIkon(d[0] === 'Real estate' ? 'rumah' : 'tabung'), mpOptsT(d[1], ['High', 'Low', 'Moderate', 'None'])); }
      const it = pick([['Shares', 'Investment'], ['Unit trust', 'Investment'], ['Real estate', 'Investment'], ['Fixed deposit', 'Savings'], ['Current account', 'Savings'], ['Savings account', 'Savings']]);
      return mpMcq(`<b>${it[0]}</b> is a type of`, mpIkon(it[1] === 'Savings' ? 'tabung' : 'saham'), mpOptsT(it[1], ['Savings', 'Investment', 'Credit', 'Debt'])); },
    () => { const d = mpRoiData(mpRG); return mpMcq(`${mpN(d.u)} share units were bought at ${mpSen(d.b)}, dividend ${mpSen(d.d)} per unit, sold at ${mpSen(d.j)}. The return on investment is`, mpIkon('saham'), mpOpts(d.roi, [mpR2((d.j - d.b) * 100 / d.b), mpR2(d.d * 100 / d.b), mpR2((d.d + d.j - d.b) * 100 / d.j), mpR2(d.roi * 2)], v => `${mpD(mpR2(v))}%`)); },
    () => { const d = mpPksData(mpRG); return mpMcq(`RM${mpN(d.a)} is invested every month at prices of ${d.p.map(c => mpRM(c / 100, true)).join(', ')}. The average cost per unit is`, mpIkon('saham'), mpOpts(d.avg / 100, [d.mean / 100, d.p[0] / 100, d.p[2] / 100, mpR2(d.avg / 100 + 0.05)], v => mpRM(v, true), 0.01)); }
  ],
  kad: [
    () => { const B = Math.random() < .4 ? ri(8, 19) * 50 : ri(11, 120) * 50, m = mpMin(B); return mpMcq(`Credit card outstanding balance ${mpRM(B)}. The minimum payment (5% or RM50, whichever is higher) is`, mpIkon('kad'), mpOpts(m, [mpR2(B * 0.05), 50, mpR2(B * 0.1), mpR2(B * 0.01), mpR2(B * 0.05) + 50], mpRMf, 5)); },
    () => { const B = pick([ri(3, 9) * 100, ri(11, 98) * 100, ri(105, 300) * 100]), c = mpLate(B); return mpMcq(`Outstanding balance ${mpRM(B)} and payment is late. The late payment charge (1%, min RM10, max RM100) is`, mpIkon('kad'), mpOpts(c, [mpR2(B * 0.01), 10, 100, mpR2(B * 0.05)], mpRMf, 5)); },
    () => { const s = ri(4, 60) * 100, rr = pick([15, 18]), f = mpFC(s, rr); return mpMcq(`Unpaid balance ${mpRM(s)}, finance charge ${rr}% per annum. The finance charge for a month is`, mpIkon('kad'), mpOpts(f, [mpR2(s * rr / 100), mpR2(f * 2), mpR2(s * 0.01), mpR2(s * rr / 100 / 365)], v => mpRM(v, true), 1)); }
  ],
  pinjam: [
    () => { const d = mpLoanData(mpRG); return mpMcq(`The interest for a loan of ${mpRM(d.P)} at ${mpPc(d.r)} per annum for ${d.t} years is`, mpIkon('kereta'), mpOpts(d.I, [d.A, mpSimple(d.P, d.r, 1), d.P * d.r * d.t, mpR2(d.I / 12)], mpRMf, mpStep(d.I))); },
    () => { if (Math.random() < .5) { const H = pick([40, 50, 60, 80, 90, 100, 120]) * 1000, dd = pick([10, 15, 20]), P = H * (100 - dd) / 100; return mpMcq(`A car of ${mpRM(H)} with a ${dd}% down payment. The loan amount is`, mpIkon('kereta'), mpOpts(P, [H * dd / 100, H, H + H * dd / 100, H - dd * 100], mpRMf, 1000)); }
      const d = mpLoanData(mpRG); return mpMcq(`The total repayment for a loan of ${mpRM(d.P)} at ${mpPc(d.r)} per annum for ${d.t} years is`, mpIkon('kereta'), mpOpts(d.A, [d.I, mpR2(d.P + mpSimple(d.P, d.r, 1)), mpR2(d.P + 2 * d.I), mpComp(d.P, d.r, 1, d.t)], mpRMf, mpStep(d.A))); },
    () => { const d = mpLoanData(mpRG, true); return mpMcq(`The monthly instalment for a loan of ${mpRM(d.P)} at ${mpPc(d.r)} per annum for ${d.t} years is`, mpIkon('kereta'), mpOpts(d.m, [mpR2(d.P / (12 * d.t)), mpR2(d.A / d.t), mpR2(d.A / 12), mpR2((d.P + mpSimple(d.P, d.r, 1)) / (12 * d.t))], mpRMf, 10)); }
  ]
};
const CQT = { faedah: 'Simple & compound interest', labur: 'Investment & average cost', kad: 'Credit card', pinjam: 'Loans & instalments' };
function mpCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.faedah;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['faedah', 'faedah', 'labur', 'kad', 'pinjam'] : Object.keys(CQT);
  return mpCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return mpCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}

/* pecahan bertingkat & punca (25 Nov): semua soalan Latihan, Lembaran, game & kuiz melalui mpBtO */
for (const s in GEN) for (const l in GEN[s]) GEN[s][l] = GEN[s][l].map(f => (...a) => mpBtO(f(...a)));
if (typeof WG === 'object') for (const k in WG) { const f = WG[k]; WG[k] = (...a) => mpBtO(f(...a)); }
{ const c0 = cq, g0 = gq; cq = (...a) => mpBtO(c0(...a)); gq = (...a) => mpBtO(g0(...a)); }
