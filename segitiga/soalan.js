'use strict';
/* =================== SEGI TIGA DAN SISI EMPAT · SOALAN BAB 7 (Tingkatan 1, KP2027) =================== */
// Semua nama global berawalan "st" / "ST".

const stRG = { i: (a, b) => ri(a, b), p: a => pick(a) };
const stRW = { i: (a, b) => wri(a, b), p: a => wpick(a) };
const stD = v => String(Math.round(v * 100) / 100);
const stRM = v => 'RM' + (Number.isInteger(v) ? String(v) : v.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const ST_TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [15, 20, 25], [9, 40, 41], [20, 21, 29], [10, 24, 26], [12, 35, 37]];

/* ---------- rajah ---------- */
const stT = (x, y, t, col, sz = 19) => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" fill="${col}" font-family="Inter,sans-serif" font-size="${sz}" font-weight="700" text-anchor="middle" dominant-baseline="central">${t}</text>`;
const stSvg = (inner, lab) => `<svg viewBox="0 0 500 340" role="img" aria-label="${lab}" style="width:100%;max-width:520px"><rect x="0" y="0" width="500" height="340" rx="18" fill="#131C2E" stroke="#22304A" stroke-width="2"/>${inner}</svg>`;
// segi tiga dengan sudut a di A dan b di B; lab = [labA, labB, labC, labPeluaranB]
function stTri(a, b, lab) {
  const ta = Math.tan(a * Math.PI / 180), tb = Math.tan(b * Math.PI / 180); let w = 300; if (w * ta * tb / (ta + tb) > 220) w = 220 * (ta + tb) / (ta * tb); const x0 = 230 - w / 2, A = [x0, 280], B = [x0 + w, 280], x = x0 + w * tb / (ta + tb), h = (x - x0) * ta, C = [x, 280 - h];
  let s = '';
  if (lab[3]) s += `<line x1="${B[0]}" y1="280" x2="470" y2="280" stroke="#94A3B8" stroke-width="3" stroke-dasharray="6 5"/>`;
  s += `<polygon points="${A.join(',')} ${B.join(',')} ${C[0].toFixed(1)},${C[1].toFixed(1)}" fill="#0E1626" stroke="#E6EDF7" stroke-width="4" stroke-linejoin="round"/>`;
  const G = [(A[0] + B[0] + C[0]) / 3, (280 * 2 + C[1]) / 3], at = (P, d) => { const dx = G[0] - P[0], dy = G[1] - P[1], n = Math.hypot(dx, dy) || 1; return [P[0] + dx / n * d, P[1] + dy / n * d]; };
  const pa = at(A, 52), pb = at(B, 52), pc = at(C, 46);
  if (lab[0]) s += stT(pa[0], pa[1], lab[0], '#FBBF24');
  if (lab[1]) s += stT(pb[0], pb[1], lab[1], '#38BDF8');
  if (lab[2]) s += stT(pc[0], pc[1], lab[2], '#34D399');
  if (lab[3]) s += stT(B[0] + 44, 262, lab[3], '#F472B6');
  return stSvg(s, 'Segi tiga dengan sudut berlabel');
}
// segi tiga bersudut tegak: a mendatar, b menegak; lab = [mendatar, menegak, hipotenus]
function stRight(a, b, lab) {
  const k = Math.min(300 / a, 230 / b), A = [100, 300], B = [100 + a * k, 300], C = [100, 300 - b * k];
  let s = `<polygon points="${A.join(',')} ${B[0].toFixed(1)},300 100,${C[1].toFixed(1)}" fill="#0E1626" stroke="#E6EDF7" stroke-width="4" stroke-linejoin="round"/><path d="M120 300 L120 280 L100 280" fill="none" stroke="#94A3B8" stroke-width="3"/>`;
  s += stT((A[0] + B[0]) / 2, 322, lab[0], '#FBBF24') + stT(62, (300 + C[1]) / 2, lab[1], '#38BDF8') + (() => { const dx = B[0] - 100, dy = 300 - C[1], n = Math.hypot(dx, dy); return stT((B[0] + 100) / 2 + dy / n * 30, (300 + C[1]) / 2 - dx / n * 30, lab[2], '#F472B6'); })();
  return stSvg(s, 'Segi tiga bersudut tegak');
}

/* =================== QV =================== */
const QV = {
  kelas: [d => ({ q: d.q }), d => ({ q: d.q.replace('Kelaskan', 'Namakan jenis') })],
  sudut: [d => ({ q: d.q }), d => ({ q: d.q.replace('Cari', 'Hitung') }), d => ({ q: d.q.replace('Cari', 'Tentukan') })],
  pyth: [d => ({ q: d.q }), d => ({ q: d.q.replace('Hitung', 'Cari') }), d => ({ q: d.q.replace('Hitung', 'Tentukan') })],
  akas: [d => ({ q: `Sisi-sisi sebuah segi tiga ialah ${d.s}. Adakah segi tiga itu bersudut tegak? Tunjukkan pengiraan.` }), d => ({ q: `Dengan menggunakan akas teorem Pythagoras, tentukan sama ada segi tiga bersisi ${d.s} ialah segi tiga bersudut tegak.` })],
  luas: [d => ({ q: d.q }), d => ({ q: d.q.replace('Hitung', 'Cari') })],
  masalah: [d => ({ q: d.q }), d => ({ q: /Berapakah/.test(d.q) ? d.q.replace('Berapakah', 'Hitung').replace(/\?$/, '.') : d.q })]
};
const stLQ = (k, d) => GEN_LQ(k, d, d.fig ? { fig: d.fig } : undefined);

/* =================== penjana =================== */
const ST = {};
// ---- 7.1 ----
ST.kelas = r => {
  const k = r.i(0, 4);
  if (k === 0) { const s = r.i(4, 12); return stLQ('kelas', { q: `Kelaskan segi tiga dengan sisi ${s} cm, ${s} cm dan ${s} cm berdasarkan sisinya, dan nyatakan bilangan paksi simetrinya.`, ans: 'Segi tiga sama sisi; 3 paksi simetri', work: ['Ketiga-tiga sisi sama panjang'] }); }
  if (k === 1) { const s = r.i(5, 12), t = r.i(3, 15); if (t === s) return ST.kelas(r); return stLQ('kelas', { q: `Kelaskan segi tiga dengan sisi ${s} cm, ${s} cm dan ${t} cm berdasarkan sisinya, dan nyatakan bilangan paksi simetrinya.`, ans: 'Segi tiga sama kaki; 1 paksi simetri', work: ['Dua sisi sama panjang'] }); }
  if (k === 2) { const [a, b, c] = r.p([[4, 6, 7], [5, 7, 9], [6, 8, 11], [3, 5, 7]]); return stLQ('kelas', { q: `Kelaskan segi tiga dengan sisi ${a} cm, ${b} cm dan ${c} cm berdasarkan sisinya, dan nyatakan bilangan paksi simetrinya.`, ans: 'Segi tiga tak sama kaki; tiada paksi simetri', work: ['Semua sisi berbeza panjang'] }); }
  const a = r.i(20, 60), b = k === 3 ? 90 - a : r.i(15, 40); const c = 180 - a - b;
  return stLQ('kelas', { q: `Dua sudut sebuah segi tiga ialah ${a}° dan ${b}°. Kelaskan segi tiga itu berdasarkan sudutnya.`, ans: `${c === 90 ? 'Segi tiga bersudut tegak' : c > 90 ? 'Segi tiga bersudut cakah' : 'Segi tiga bersudut tirus'} (sudut ketiga ${c}°)`, work: [`Sudut ketiga = 180° − ${a}° − ${b}° = ${c}°`] });
};
ST.sudut3 = r => { const a = r.i(25, 80), b = r.i(25, 80); if (a + b > 160) return ST.sudut3(r); const c = 180 - a - b;
  return stLQ('sudut', { q: 'Cari nilai x dalam rajah.', fig: stTri(a, b, [`${a}°`, `${b}°`, 'x']), ans: `x = ${c}°`, work: ['Hasil tambah sudut pedalaman = 180°', `x = 180° − ${a}° − ${b}° = ${c}°`] }); };
ST.peluaran = r => { const a = r.i(30, 75), b = r.i(40, 80); if (a + b > 150) return ST.peluaran(r); const c = 180 - a - b, ext = 180 - b;
  return stLQ('sudut', { q: 'Cari nilai y, iaitu sudut peluaran dalam rajah.', fig: stTri(a, b, [`${a}°`, '', `${c}°`, 'y']), ans: `y = ${ext}°`, work: ['Sudut peluaran = hasil tambah dua sudut pedalaman bertentangan', `y = ${a}° + ${c}° = ${ext}°`] }); };
ST.samaKaki = r => { const k = r.i(0, 1);
  if (k === 0) { const top = r.p([30, 40, 50, 70, 80, 100, 110, 120]), base = (180 - top) / 2; return stLQ('sudut', { q: `Sebuah segi tiga sama kaki mempunyai sudut puncak ${top}°. Cari setiap sudut tapaknya.`, ans: `${base}°`, work: ['Dua sudut tapak sama', `(180° − ${top}°) ÷ 2 = ${base}°`] }); }
  const x = r.i(10, 25), m = 2, b = r.i(10, 30), base = m * x + b; if (base >= 85) return ST.samaKaki(r);
  return stLQ('sudut', { q: `Sudut-sudut tapak sebuah segi tiga sama kaki ialah (${m}x + ${b})° dan ${base}°. Cari nilai x dan sudut puncak.`, ans: `x = ${x}, sudut puncak = ${180 - 2 * base}°`, work: [`${m}x + ${b} = ${base} → x = ${x}`, `Puncak = 180° − 2(${base}°) = ${180 - 2 * base}°`] });
};
ST.luasTri = (r, idx) => {
  const k = idx == null ? r.i(0, 2) : idx % 3;
  if (k === 0) { const t = r.p([6, 8, 10, 12, 14]), h = r.p([5, 7, 9, 11]), n = r.i(3, 8), c = r.p([1.5, 2.5, 3, 4]); const A = t * h / 2;
    return stLQ('masalah', { q: `Sebuah kelab menempah ${n} helai panji segi tiga, setiap satu bertapak ${t} m dan tinggi ${h} m. Kos kain ialah RM${c.toFixed(2)} semeter persegi. Berapakah kos kain?`, ans: stRM(A * n * c), work: [`Luas sehelai = ½ × ${t} × ${h} = ${A} m²`, `Jumlah luas = ${A} × ${n} = ${A * n} m²`, `Kos = ${A * n} × RM${c.toFixed(2)} = ${stRM(A * n * c)}`] }); }
  if (k === 1) { const [a, b, c] = r.p(ST_TRIPLES), p = r.p([3, 4, 5]); return stLQ('masalah', { q: `Sebidang tanah berbentuk segi tiga bersudut tegak dengan sisi ${a} m, ${b} m dan ${c} m. Pagar dipasang di sekelilingnya dengan kos RM${p} semeter. Hitung (a) luas tanah, (b) kos pagar.`, fig: stRight(a, b, [`${a} m`, `${b} m`, `${c} m`]), ans: `(a) ${a * b / 2} m² (b) ${stRM((a + b + c) * p)}`, work: [`Luas = ½ × ${a} × ${b} = ${a * b / 2} m²`, `Perimeter = ${a + b + c} m`, `Kos = ${a + b + c} × RM${p} = ${stRM((a + b + c) * p)}`] }); }
  const L = r.p([24, 30, 36, 48, 60]), t = r.p([6, 8, 10, 12]); return stLQ('masalah', { q: `Luas sebuah segi tiga ialah ${L} cm² dan tapaknya ${t} cm. Berapakah tinggi segi tiga itu?`, ans: `${stD(2 * L / t)} cm`, work: [`½ × ${t} × t = ${L}`, `t = 2 × ${L} ÷ ${t} = ${stD(2 * L / t)} cm`] });
};
// ---- 7.2 ----
ST.hipo = r => { const [a, b, c] = r.p(ST_TRIPLES), sw = r.i(0, 1), A = sw ? b : a, B = sw ? a : b;
  return stLQ('pyth', { q: 'Hitung panjang hipotenus, c, dalam rajah.', fig: stRight(A, B, [`${A} cm`, `${B} cm`, 'c']), ans: `c = ${c} cm`, work: [`c² = ${A}² + ${B}² = ${A * A} + ${B * B} = ${c * c}`, `c = √${c * c} = ${c} cm`] }); };
ST.sisi = r => { const [a, b, c] = r.p(ST_TRIPLES), sw = r.i(0, 1), known = sw ? a : b, unk = sw ? b : a;
  return stLQ('pyth', { q: 'Hitung nilai x dalam rajah.', fig: stRight(sw ? unk : known, sw ? known : unk, sw ? ['x', `${known} cm`, `${c} cm`] : [`${known} cm`, 'x', `${c} cm`]), ans: `x = ${unk} cm`, work: [`x² = ${c}² − ${known}² = ${c * c} − ${known * known} = ${unk * unk}`, `x = √${unk * unk} = ${unk} cm`] }); };
ST.namaHipo = r => { const [a, b, c] = r.p(ST_TRIPLES); const nm = r.p([['PQ', 'QR', 'PR', 'Q'], ['AB', 'BC', 'AC', 'B'], ['KL', 'LM', 'KM', 'L']]);
  return stLQ('pyth', { q: `Dalam segi tiga ${nm[0][0]}${nm[1]}, sudut ${nm[3]} = 90°, ${nm[0]} = ${a} cm dan ${nm[1]} = ${b} cm. Namakan hipotenus dan hitung panjangnya.`, ans: `Hipotenus ${nm[2]} = ${c} cm`, work: [`Hipotenus bertentangan dengan sudut tegak ${nm[3]}: ${nm[2]}`, `${nm[2]}² = ${a * a} + ${b * b} = ${c * c}, ${nm[2]} = ${c} cm`] }); };
ST.akas = r => { const ok = r.i(0, 1) === 1; let [a, b, c] = r.p(ST_TRIPLES); if (!ok) c += r.p([1, -1, 2]);
  const yes = a * a + b * b === c * c;
  return stLQ('akas', { s: `${a} cm, ${b} cm dan ${c} cm`, ans: yes ? `Ya, kerana ${a}² + ${b}² = ${a * a + b * b} = ${c}²` : `Bukan, kerana ${a}² + ${b}² = ${a * a + b * b} ≠ ${c}² = ${c * c}`, work: [`${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}`, `${c}² = ${c * c}`] }); };
ST.gabung = r => { const [a, b, c] = r.p([[3, 4, 5], [6, 8, 10], [9, 12, 15]]); const m = c === 5 ? [12, 13] : c === 10 ? [24, 26] : [36, 39];
  return stLQ('pyth', { q: `ABD dan BCD ialah segi tiga bersudut tegak. Dalam ABD, sudut A = 90°, AB = ${a} cm dan AD = ${b} cm. Dalam BCD, sudut B = 90° dan BC = ${m[0]} cm. Hitung panjang CD.`, ans: `CD = ${m[1]} cm`, work: [`BD² = ${a}² + ${b}² = ${c * c}, BD = ${c} cm`, `CD² = ${c}² + ${m[0]}² = ${m[1] * m[1]}`, `CD = ${m[1]} cm`] }); };
ST.masalahP = (r, idx) => { const k = idx == null ? r.i(0, 2) : idx % 3;
  if (k === 0) { const [a, b, c] = r.p([[6, 8, 10], [5, 12, 13], [9, 12, 15], [7, 24, 25]]); return stLQ('masalah', { q: `Sebatang tangga sepanjang ${c} m disandarkan pada dinding tegak. Kaki tangga berada ${a} m dari dinding. Berapakah tinggi dinding yang dicapai oleh hujung tangga?`, fig: stRight(a, b, [`${a} m`, '?', `${c} m`]), ans: `${b} m`, work: [`tinggi² = ${c}² − ${a}² = ${b * b}`, `tinggi = ${b} m`] }); }
  if (k === 1) { const [a, b, c] = r.p([[30, 40, 50], [60, 80, 100], [50, 120, 130], [80, 150, 170]]); return stLQ('masalah', { q: `Sebuah padang segi empat tepat berukuran ${a} m × ${b} m. Aiman berjalan di sepanjang pepenjuru padang, manakala Siti berjalan di tepi padang dari bucu yang sama ke bucu bertentangan. Berapakah perbezaan jarak yang dilalui mereka?`, ans: `${a + b - c} m`, work: [`Pepenjuru² = ${a}² + ${b}² = ${c * c}, pepenjuru = ${c} m`, `Siti = ${a} + ${b} = ${a + b} m`, `Beza = ${a + b} − ${c} = ${a + b - c} m`] }); }
  const [a, b, c] = r.p([[8, 15, 17], [5, 12, 13], [9, 12, 15]]); return stLQ('masalah', { q: `Sebatang tiang bendera setinggi ${b} m disokong oleh seutas kabel yang diikat dari puncak tiang ke titik di tanah ${a} m dari kaki tiang. Berapakah panjang kabel itu?`, fig: stRight(a, b, [`${a} m`, `${b} m`, '?']), ans: `${c} m`, work: [`kabel² = ${a}² + ${b}² = ${c * c}`, `kabel = ${c} m`] });
};
// ---- 7.3 ----
const STQ = [['Segi empat sama', 'empat sisi sama panjang dan empat sudut tegak'], ['Segi empat tepat', 'sisi bertentangan sama panjang dan empat sudut tegak, tetapi sisi bersebelahan tidak sama'], ['Rombus', 'empat sisi sama panjang tetapi tiada sudut tegak'], ['Segi empat selari', 'sisi bertentangan sama dan selari, tiada sudut tegak dan sisi bersebelahan tidak sama'], ['Trapezium', 'hanya sepasang sisi selari'], ['Lelayang', 'dua pasang sisi bersebelahan sama panjang dan pepenjuru bersilang serenjang']];
const STAX = { 'Segi empat sama': '4 paksi simetri', 'Segi empat tepat': '2 paksi simetri', 'Rombus': '2 paksi simetri', 'Segi empat selari': 'tiada paksi simetri', 'Trapezium': 'tiada paksi simetri (1 jika trapezium sama kaki)', 'Lelayang': '1 paksi simetri' };
ST.kenalSE = r => { const [nm, sf] = r.p(STQ); return stLQ('kelas', { q: `Sebuah sisi empat mempunyai ${sf}. Kelaskan sisi empat itu dan nyatakan bilangan paksi simetrinya.`, ans: `${nm}; ${STAX[nm]}`, work: [`Sifat: ${sf} → ${nm}`] }); };
ST.sudutSE = r => { const k = r.i(0, 1);
  if (k === 0) { const a = r.i(60, 120), b = r.i(60, 120), c = r.i(60, 120), d = 360 - a - b - c; if (d < 40 || d > 170) return ST.sudutSE(r); return stLQ('sudut', { q: `Tiga sudut pedalaman sebuah sisi empat ialah ${a}°, ${b}° dan ${c}°. Cari sudut keempat.`, ans: `${d}°`, work: ['Hasil tambah sudut pedalaman sisi empat = 360°', `360° − ${a}° − ${b}° − ${c}° = ${d}°`] }); }
  const a = r.p([55, 62, 70, 75, 108, 115, 124]); return stLQ('sudut', { q: `Satu sudut sebuah segi empat selari ialah ${a}°. Cari tiga sudut yang lain.`, ans: `${180 - a}°, ${a}° dan ${180 - a}°`, work: ['Sudut bertentangan sama', `Sudut bersebelahan = 180° − ${a}° = ${180 - a}°`] }); };
ST.luasSE = r => { const k = r.i(0, 3);
  if (k === 0) { const a = r.i(4, 12), b = r.i(6, 18), h = r.i(3, 9); return stLQ('luas', { q: `Hitung luas trapezium dengan sisi selari ${a} cm dan ${b} cm serta tinggi ${h} cm.`, ans: `${stD((a + b) * h / 2)} cm²`, work: [`½ × (${a} + ${b}) × ${h} = ${stD((a + b) * h / 2)} cm²`] }); }
  if (k === 1) { const t = r.i(5, 14), h = r.i(3, 9); return stLQ('luas', { q: `Hitung luas segi empat selari dengan tapak ${t} cm dan tinggi ${h} cm.`, ans: `${t * h} cm²`, work: [`tapak × tinggi = ${t} × ${h} = ${t * h} cm²`] }); }
  if (k === 2) { const d1 = r.p([6, 8, 10, 12]), d2 = r.p([5, 9, 14, 16]); return stLQ('luas', { q: `Hitung luas lelayang dengan pepenjuru ${d1} cm dan ${d2} cm.`, ans: `${d1 * d2 / 2} cm²`, work: [`½ × ${d1} × ${d2} = ${d1 * d2 / 2} cm²`] }); }
  const p = r.p([20, 24, 28]); const pairs = []; for (let l = 1; l < p / 2; l++) pairs.push([p / 2 - l, l]); const [L, W] = r.p(pairs.filter(([l, w]) => l > w));
  return stLQ('luas', { q: `Sebuah segi empat tepat mempunyai perimeter ${p} cm dan panjang ${L} cm. Hitung lebar dan luasnya.`, ans: `Lebar ${W} cm, luas ${L * W} cm²`, work: [`2(${L} + l) = ${p} → l = ${W}`, `Luas = ${L} × ${W} = ${L * W} cm²`] }); };
ST.masalahSE = (r, idx) => { const k = idx == null ? r.i(0, 2) : idx % 3;
  if (k === 0) { const w = r.p([12, 16, 24]), h = r.p([5, 6, 8]), s = r.p([10, 17, 13, 15, 20]); const half = w / 2; const t2 = s * s - half * half; const t = Math.sqrt(t2); if (!Number.isInteger(t) || t <= 0) return ST.masalahSE(r, 1);
    return stLQ('masalah', { q: `Dinding hadapan sebuah rumah terdiri daripada segi empat tepat ${w} m × ${h} m dan bumbung segi tiga sama kaki dengan sisi condong ${s} m. Hitung (a) perimeter dinding, (b) luas dinding.`, ans: `(a) ${w + 2 * h + 2 * s} m (b) ${w * h + w * t / 2} m²`, work: [`Tinggi bumbung² = ${s}² − ${half}² = ${t2}, tinggi = ${t} m`, `Perimeter = ${w} + ${h} + ${h} + ${s} + ${s} = ${w + 2 * h + 2 * s} m`, `Luas = ${w} × ${h} + ½ × ${w} × ${t} = ${w * h + w * t / 2} m²`] }); }
  if (k === 1) { const a = r.p([6, 8, 10]), b = r.p([12, 14, 16]), h = r.p([4, 5, 6]), c = r.p([25, 30, 35]); const A = (a + b) * h / 2;
    return stLQ('masalah', { q: `Sebuah laman berbentuk trapezium dengan sisi selari ${a} m dan ${b} m serta tinggi ${h} m. Kos memasang jubin ialah RM${c} semeter persegi. Berapakah kos memasang jubin?`, ans: stRM(A * c), work: [`Luas = ½ × (${a} + ${b}) × ${h} = ${A} m²`, `Kos = ${A} × RM${c} = ${stRM(A * c)}`] }); }
  const L = r.p([8, 10, 12]), W = r.p([5, 6, 7]), x = r.p([2, 3]); return stLQ('masalah', { q: `Sebuah kolam segi empat tepat berukuran ${L} m × ${W} m dikelilingi laluan pejalan kaki selebar ${x} m. Hitung luas laluan itu.`, ans: `${(L + 2 * x) * (W + 2 * x) - L * W} m²`, work: [`Luas besar = ${L + 2 * x} × ${W + 2 * x} = ${(L + 2 * x) * (W + 2 * x)} m²`, `Luas kolam = ${L * W} m²`, `Laluan = ${(L + 2 * x) * (W + 2 * x) - L * W} m²`] }); };

/* =================== GEN / WG / WSPLAN =================== */
const GEN = {
  '7.1': { m: [() => ST.kelas(stRG), () => ST.sudut3(stRG)], s: [() => ST.peluaran(stRG), () => ST.samaKaki(stRG)], k: [() => ST.luasTri(stRG)] },
  '7.2': { m: [() => ST.hipo(stRG), () => ST.namaHipo(stRG), () => ST.akas(stRG)], s: [() => ST.sisi(stRG), () => ST.gabung(stRG)], k: [() => ST.masalahP(stRG)] },
  '7.3': { m: [() => ST.kenalSE(stRG), () => ST.sudutSE(stRG)], s: [() => ST.luasSE(stRG)], k: [() => ST.masalahSE(stRG)] }
};
const WG = {
  kelas: () => ST.kelas(stRW), sudut3: () => ST.sudut3(stRW), peluaran: () => ST.peluaran(stRW), samaKaki: () => ST.samaKaki(stRW), luasTri: i => ST.luasTri(stRW, i),
  hipo: () => ST.hipo(stRW), namaHipo: () => ST.namaHipo(stRW), akas: () => ST.akas(stRW), sisi: () => ST.sisi(stRW), gabung: () => ST.gabung(stRW), masalahP: i => ST.masalahP(stRW, i),
  kenalSE: () => ST.kenalSE(stRW), sudutSE: () => ST.sudutSE(stRW), luasSE: () => ST.luasSE(stRW), masalahSE: i => ST.masalahSE(stRW, i)
};
const WSPLAN = {
  '7.1': [['m', 'kelas', 9], ['m', 'sudut3', 9], ['s', 'peluaran', 5], ['s', 'samaKaki', 4], ['k', 'luasTri', 3]],
  '7.2': [['m', 'hipo', 7], ['m', 'namaHipo', 5], ['m', 'akas', 6], ['s', 'sisi', 6], ['s', 'gabung', 3], ['k', 'masalahP', 3]],
  '7.3': [['m', 'kenalSE', 9], ['m', 'sudutSE', 9], ['s', 'luasSE', 9], ['k', 'masalahSE', 3]]
};

/* =================== GAMES =================== */
function stMcq(q, ans, wrongs, fig) {
  const A = String(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(wrongs.map(String))) { if (seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 60; k++) { const c = A.replace(/\d+/, m => String(+m + k)); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([A, ...w]); return { type: 'mcq', q, fig: fig || '', opts, c: opts.indexOf(A) };
}
const CQGEN = {
  segitiga: L => {
    if (L === 0) { const a = ri(30, 75), b = ri(30, 75), c = 180 - a - b; return stMcq('Nilai x ialah', `${c}°`, [`${360 - a - b}°`, `${a + b}°`, `${90 - Math.min(a, b)}°`], stTri(a, b, [`${a}°`, `${b}°`, 'x'])); }
    const a = ri(30, 70), b = ri(40, 75), c = 180 - a - b; return stMcq('Nilai y (sudut peluaran) ialah', `${180 - b}°`, [`${b}°`, `${c}°`, `${180 - a}°`], stTri(a, b, [`${a}°`, '', `${c}°`, 'y']));
  },
  pythagoras: L => {
    const [a, b, c] = pick(ST_TRIPLES);
    if (L === 2) { const ok = Math.random() < .5, cc = ok ? c : c + 1; return stMcq(`Segi tiga bersisi ${a}, ${b} dan ${cc}`, ok ? 'ialah segi tiga bersudut tegak' : 'bukan segi tiga bersudut tegak', [ok ? 'bukan segi tiga bersudut tegak' : 'ialah segi tiga bersudut tegak', 'ialah segi tiga sama kaki', 'ialah segi tiga sama sisi']); }
    if (L === 0) return stMcq('Panjang hipotenus c ialah', `${c} cm`, [`${a + b} cm`, `${c + 1} cm`, `${Math.abs(b - a) || 1} cm`], stRight(a, b, [`${a} cm`, `${b} cm`, 'c']));
    return stMcq('Nilai x ialah', `${a} cm`, [`${c - b} cm`, `${a + 2} cm`, `${c + b} cm`], stRight(a, b, ['x', `${b} cm`, `${c} cm`]));
  },
  sisiempat: L => {
    if (L === 0) { const [nm, sf] = pick(STQ); return stMcq(`Sisi empat dengan ${sf} ialah`, nm, STQ.map(x => x[0])); }
    if (L === 1) { const a = ri(70, 110), b = ri(70, 110), c = ri(70, 110), d = 360 - a - b - c; if (d < 40) return CQGEN.sisiempat(L); return stMcq(`Tiga sudut sisi empat ialah ${a}°, ${b}° dan ${c}°. Sudut keempat ialah`, `${d}°`, [`${180 - d > 0 ? 180 - d : d + 20}°`, `${d + 10}°`, `${540 - a - b - c}°`]); }
    const a = ri(4, 9), b = ri(10, 16), h = ri(3, 8), A = (a + b) * h / 2; return stMcq(`Luas trapezium dengan sisi selari ${a} cm dan ${b} cm, tinggi ${h} cm ialah`, `${stD(A)} cm²`, [`${(a + b) * h} cm²`, `${a * b} cm²`, `${stD(A + h)} cm²`]);
  }
};
const CQT = { segitiga: 'Sudut segi tiga', pythagoras: 'Teorem Pythagoras', sisiempat: 'Sisi empat' };
function gq(level) { return CQGEN[pick(Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
function cq(level, types) { const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]); return CQGEN[pick(pool.length ? pool : Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
