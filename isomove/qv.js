'use strict';
/* =================== KEPELBAGAIAN AYAT SOALAN =================== */
// Bank ayat dikongsi oleh Latihan Kelas (app.js) dan Lembaran Kerja (ws.js).
// Setiap jenis soalan ada beberapa cara tanya. vq() memilih cara tanya yang
// PALING JARANG digunakan setakat ini, jadi ayat yang sama tidak berulang
// selagi masih ada cara tanya lain. Panggil vreset() setiap kali set/bank baharu dijana.
// Bergantung pada fungsi app.js (dipanggil semasa jana sahaja): P, vec, fmt.
let VR = Math.random;
let VUSE = {};
function vreset(rnd) { VUSE = {}; VR = rnd || Math.random; }
const vr = a => a[Math.floor(VR() * a.length)];
function vq(key, d) {
  const list = QV[key], u = VUSE[key] || (VUSE[key] = list.map(() => 0));
  const min = Math.min(...u), idx = [];
  u.forEach((c, i) => { if (c === min) idx.push(i); });
  const k = idx[Math.floor(VR() * idx.length)];
  u[k]++;
  const v = list[k](d);
  return { q: v.q, ans: v.ans || d.ans, work: v.work || (v.pre || []).concat(d.work || []), rev: !!v.rev };
}
const pr = s => s.split('').map(c => c + '′').join('');
const vcap = s => s[0].toUpperCase() + s.slice(1);
const HUR = ['A', 'B', 'D', 'E', 'G', 'H', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'W'];
const vlet = () => vr(HUR);
const NAMA = ['Amir', 'Siti', 'Mei Ling', 'Ravi', 'Aisyah', 'Daniel'];
const vnama = () => vr(NAMA);
const arahX = a => `${Math.abs(a)} unit ke ${a > 0 ? 'kanan' : 'kiri'}`;
const arahY = b => `${Math.abs(b)} unit ke ${b > 0 ? 'atas' : 'bawah'}`;
const PK = onX => (onX ? 'paksi-x' : 'paksi-y');
const ARAH = cw => (cw ? 'ikut arah jam' : 'lawan arah jam');
const KATAKERJA = { translasi: 'ditranslasikan', pantulan: 'dipantulkan pada satu garis', putaran: 'diputar pada satu titik' };
const salah = (N, betul, sebab) => ({ ans: `Tidak betul. Jawapan yang betul: ${betul}`, pre: [sebab] });

const QV = {
  /* ---------- 11.1 ---------- */
  istilah: [
    () => ({ q: 'Bentuk asal sebelum transformasi dipanggil apa?', ans: 'Objek', work: ['Bentuk asal dipanggil <b>objek</b>.', 'Bentuk selepas transformasi dipanggil <b>imej</b>.'] }),
    () => ({ q: 'Bentuk yang terhasil selepas satu transformasi dipanggil apa?', ans: 'Imej', work: ['Bentuk asal dipanggil <b>objek</b>.', 'Bentuk yang terhasil dipanggil <b>imej</b>.'] }),
    () => ({ q: 'Titik A pada objek dipetakan kepada titik A′. Apakah yang diwakili oleh A′?', ans: 'Titik imej', work: ['A ialah titik pada objek.', 'A′ ialah titik sepadan pada <b>imej</b>.'] }),
    () => ({ q: 'Dua bentuk mempunyai bentuk dan saiz yang sama. Apakah istilah bagi kedua-dua bentuk itu?', ans: 'Kongruen', work: ['Bentuk yang sama bentuk dan sama saiz dikatakan <b>kongruen</b>.'] }),
    () => ({ q: 'Apakah nama bagi transformasi yang mengekalkan bentuk dan saiz objek?', ans: 'Isometri', work: ['Transformasi yang mengekalkan bentuk dan saiz ialah <b>isometri</b>.', 'Contoh: translasi, pantulan dan putaran.'] })
  ],
  objImej: [
    ({ sh, o, m }) => ({ q: `${vcap(sh)} ${o} dipetakan kepada ${sh} ${m} oleh satu transformasi. Nyatakan objek dan imej.` }),
    ({ sh, o, m }) => ({ q: `Selepas satu transformasi, ${sh} ${o} menjadi ${sh} ${m}. Yang manakah objek dan yang manakah imej?` }),
    ({ sh, o, m }) => ({ q: `${vcap(sh)} ${m} ialah hasil transformasi ke atas ${sh} ${o}. Kenal pasti objek dan imej.` }),
    ({ sh, o, m }) => ({ q: `Satu transformasi menggerakkan ${sh} ${o} ke kedudukan baharu, iaitu ${sh} ${m}. Namakan objek dan imej.` })
  ],
  titikImej: [
    ({ nm, k }) => ({ q: `Segi empat ${nm} dipetakan kepada ${pr(nm)}. Nyatakan imej bagi titik ${nm[k]}.` }),
    ({ nm, k }) => ({ q: `Di bawah satu transformasi, segi empat ${nm} dipetakan kepada ${pr(nm)}. Titik manakah pada imej yang sepadan dengan titik ${nm[k]}?` }),
    ({ nm, k }) => ({ q: `Segi empat ${nm} dipetakan kepada ${pr(nm)}. Titik ${nm[k]}′ pada imej sepadan dengan titik manakah pada objek?`, ans: nm[k], work: [`Titik ${nm[k]}′ ialah imej bagi titik ${nm[k]}.`] }),
    ({ nm, k }) => { const s = nm[k] + nm[(k + 1) % 4]; return { q: `Segi empat ${nm} dipetakan kepada ${pr(nm)}. Sisi ${s} pada objek dipetakan kepada sisi yang mana pada imej?`, ans: pr(s), work: [`Setiap bucu dipetakan kepada bucu sepadan: ${s[0]} → ${s[0]}′, ${s[1]} → ${s[1]}′.`] }; }
  ],
  kongruen: [
    () => ({ q: 'Adakah kedua-dua bentuk di bawah kongruen? Berikan sebab.' }),
    () => ({ q: 'Rajah di bawah menunjukkan dua bentuk pada grid. Tentukan sama ada bentuk-bentuk itu kongruen.' }),
    ({ same }) => { const N = vnama(); return { q: `${N} berkata kedua-dua bentuk di bawah kongruen. Adakah ${N} betul? Terangkan.`, ans: same ? `Betul, bentuk dan saiznya sama` : `Tidak betul, saiznya berbeza` }; },
    () => ({ q: 'Bandingkan bentuk dan saiz dua rajah di bawah. Adakah rajah-rajah itu kongruen?' })
  ],
  isoFig: [
    () => ({ q: 'Objek (biru) dipetakan kepada imej (oren). Adakah transformasi ini satu isometri? Terangkan.' }),
    () => ({ q: 'Rajah di bawah menunjukkan objek (biru) dan imejnya (oren). Tentukan sama ada transformasi itu satu isometri.' }),
    ({ iso }) => ({ q: 'Adakah imej (oren) kongruen dengan objek (biru)? Seterusnya, nyatakan sama ada transformasi itu satu isometri.', ans: iso ? 'Ya, kongruen; transformasi itu isometri' : 'Tidak kongruen; bukan isometri' }),
    () => { const N = vnama(); return { q: `${N} melukis imej (oren) bagi objek (biru). Adakah ${N} telah melakukan satu isometri? Berikan sebab.` }; }
  ],
  isoTeks: [
    ({ s }) => ({ q: `Diberi: "${s}" Adakah transformasi ini satu isometri?` }),
    ({ s }) => ({ q: `Satu transformasi mempunyai ciri berikut: ${s} Adakah transformasi itu satu isometri?` }),
    ({ s, iso }) => ({ q: `Benar atau palsu? Transformasi dengan ciri "${s}" ialah satu isometri.`, ans: iso ? 'Benar' : 'Palsu' })
  ],
  panjangSudut: [
    ({ n, ab, ang }) => ({ q: `Segi tiga ${n} dipetakan kepada segi tiga ${pr(n)} oleh satu isometri. Diberi ${n[0]}${n[1]} = ${ab} cm dan ∠${n} = ${ang}°. Nyatakan panjang ${pr(n[0] + n[1])} dan saiz ∠${pr(n)}.` }),
    ({ n, ab, ang }) => ({ q: `Segi tiga ${n} dan imejnya, segi tiga ${pr(n)}, adalah kongruen. Jika ${n[0]}${n[1]} = ${ab} cm dan ∠${n} = ${ang}°, cari panjang ${pr(n[0] + n[1])} dan saiz ∠${pr(n)}.` }),
    ({ n, ab, ang }) => ({ q: `Satu isometri memetakan segi tiga ${n} kepada segi tiga ${pr(n)}. Diberi ${n[0]}${n[1]} = ${ab} cm dan ∠${n} = ${ang}°. Lengkapkan: ${pr(n[0] + n[1])} = ___ cm, ∠${pr(n)} = ___°.` })
  ],

  /* ---------- 11.2 Translasi ---------- */
  trImej: [
    ({ L, x, y, a, b }) => ({ q: `Titik ${L}${P(x, y)} ditranslasikan oleh ${vec(a, b)}. Cari koordinat imej ${L}′.` }),
    ({ L, x, y, a, b }) => ({ q: `Di bawah translasi ${vec(a, b)}, titik ${L}${P(x, y)} dipetakan kepada ${L}′. Nyatakan koordinat ${L}′.` }),
    ({ L, x, y, a, b }) => ({ q: `Cari imej bagi titik ${L}${P(x, y)} di bawah translasi ${vec(a, b)}.` }),
    ({ x, y, a, b, X, Y }) => ({ q: `Sebuah kereta mainan berada pada titik ${P(x, y)}. Kereta itu bergerak ${arahX(a)} dan ${arahY(b)}. Nyatakan koordinat kedudukan baharunya.`, ans: P(X, Y) }),
    ({ L, x, y, a, b }) => ({ q: `Titik ${L}${P(x, y)} digerakkan ${arahX(a)}, kemudian ${arahY(b)}. Apakah koordinat imejnya?` }),
    ({ L, x, y, a, b, X, Y }) => { const N = vnama(); return Object.assign({ q: `${N} menyatakan bahawa imej bagi titik ${L}${P(x, y)} di bawah translasi ${vec(a, b)} ialah ${P(x - a, y - b)}. Adakah ${N} betul? Jika tidak, berikan jawapan yang betul.` }, salah(N, `${L}′${P(X, Y)}`, `${N} telah menolak vektor; sepatutnya vektor ditambah.`)); }
  ],
  trVektor: [
    ({ L, x, y, X, Y }) => ({ q: `Titik ${L}${P(x, y)} dipetakan kepada ${L}′${P(X, Y)} oleh satu translasi. Tentukan vektor translasi.` }),
    ({ L, x, y, X, Y }) => ({ q: `Satu translasi memetakan titik ${L}${P(x, y)} kepada titik ${L}′${P(X, Y)}. Nyatakan translasi itu dalam bentuk vektor.` }),
    ({ x, y, X, Y }) => ({ q: `Seekor semut bergerak dari titik ${P(x, y)} ke titik ${P(X, Y)}. Tuliskan vektor translasi bagi pergerakan itu.` }),
    ({ L, x, y, X, Y }) => ({ q: `Diberi titik ${L}${P(x, y)} dan imejnya ${L}′${P(X, Y)}. Cari vektor translasi yang memetakan ${L} kepada ${L}′.` }),
    ({ x, y, X, Y }) => ({ q: `Huraikan selengkapnya translasi yang memetakan titik ${P(x, y)} kepada titik ${P(X, Y)}.` })
  ],
  trKata: [
    ({ a, b }) => ({ q: `Satu titik digerakkan ${arahX(a)} dan ${arahY(b)}. Tuliskan vektor translasi.` }),
    ({ a, b }) => ({ q: `Sebuah buah dam bergerak ${arahX(a)}, kemudian ${arahY(b)}. Wakilkan pergerakan itu sebagai vektor translasi.` }),
    ({ a, b }) => ({ q: `Imej sebuah bentuk berada ${Math.abs(a)} unit di sebelah ${a > 0 ? 'kanan' : 'kiri'} dan ${Math.abs(b)} unit di ${b > 0 ? 'atas' : 'bawah'} objeknya. Nyatakan vektor translasi.` }),
    ({ a, b }) => ({ q: `Huraikan translasi ${vec(a, b)} dalam perkataan.`, ans: `Gerak ${arahX(a)} dan ${arahY(b)}` }),
    ({ a, b }) => ({ q: `Tuliskan vektor translasi bagi gerakan ${arahY(b)} diikuti ${arahX(a)}.`, pre: ['Gerakan mengufuk ditulis di atas, gerakan mencancang di bawah.'] })
  ],
  trObjek: [
    ({ L, X, Y, a, b }) => ({ q: `${L}′${P(X, Y)} ialah imej bagi titik ${L} di bawah translasi ${vec(a, b)}. Cari koordinat ${L}.` }),
    ({ L, X, Y, a, b }) => ({ q: `Di bawah translasi ${vec(a, b)}, imej bagi titik ${L} ialah ${P(X, Y)}. Cari koordinat titik ${L}.` }),
    ({ X, Y, a, b, x, y }) => ({ q: `Selepas ditranslasikan oleh ${vec(a, b)}, sebuah titik berada pada ${P(X, Y)}. Nyatakan koordinat kedudukan asal titik itu.`, ans: P(x, y) }),
    ({ L, X, Y, a, b }) => ({ q: `Titik ${L} dipetakan kepada ${L}′${P(X, Y)} oleh translasi ${vec(a, b)}. Nyatakan koordinat objek ${L}.` })
  ],
  trB: [
    ({ A, B, ax, ay, a, b, bx, by }) => ({ q: `Translasi T memetakan ${A}${P(ax, ay)} kepada ${A}′${P(ax + a, ay + b)}. Cari imej bagi ${B}${P(bx, by)} di bawah translasi T.` }),
    ({ A, B, ax, ay, a, b, bx, by }) => ({ q: `Di bawah satu translasi, titik ${A}${P(ax, ay)} dipetakan kepada ${A}′${P(ax + a, ay + b)}. Di bawah translasi yang sama, cari imej bagi titik ${B}${P(bx, by)}.` }),
    ({ B, ax, ay, a, b, bx, by }) => ({ q: `Translasi yang memetakan ${P(ax, ay)} kepada ${P(ax + a, ay + b)} juga memetakan titik ${B}${P(bx, by)} kepada ${B}′. Cari koordinat ${B}′.` })
  ],
  trDua: [
    ({ L, x, y, a, b, c, e }) => ({ q: `Titik ${L}${P(x, y)} ditranslasikan oleh ${vec(a, b)}, kemudian imejnya ditranslasikan pula oleh ${vec(c, e)}. Cari koordinat imej akhir.` }),
    ({ x, y, a, b, c, e }) => ({ q: `Sebuah robot bermula di titik ${P(x, y)}. Robot itu bergerak mengikut translasi ${vec(a, b)}, kemudian translasi ${vec(c, e)}. Di manakah kedudukan akhir robot itu?` }),
    ({ L, x, y, a, b, c, e }) => ({ q: `Titik ${L}${P(x, y)} mengalami translasi ${vec(a, b)} diikuti translasi ${vec(c, e)}. Nyatakan koordinat imej akhir.` })
  ],

  /* ---------- 11.3 Pantulan ---------- */
  paImej: [
    ({ L, x, y, onX }) => ({ q: `Titik ${L}${P(x, y)} dipantulkan pada ${PK(onX)}. Cari koordinat imej ${L}′.` }),
    ({ L, x, y, onX }) => ({ q: `Cari imej bagi titik ${L}${P(x, y)} di bawah pantulan pada ${PK(onX)}.` }),
    ({ L, x, y, onX }) => ({ q: `Di bawah pantulan pada ${PK(onX)}, titik ${L}${P(x, y)} dipetakan kepada ${L}′. Nyatakan koordinat ${L}′.` }),
    ({ L, x, y, onX }) => ({ q: `${vcap(PK(onX))} bertindak sebagai cermin. Di manakah imej bagi titik ${L}${P(x, y)}?` }),
    ({ L, x, y, onX, X, Y }) => { const N = vnama(); return Object.assign({ q: `${N} menyatakan bahawa imej bagi titik ${L}${P(x, y)} apabila dipantulkan pada ${PK(onX)} ialah ${onX ? P(-x, y) : P(x, -y)}. Adakah ${N} betul? Jika tidak, berikan jawapan yang betul.` }, salah(N, `${L}′${P(X, Y)}`, `${N} telah menukar tanda koordinat yang salah.`)); },
    ({ L, x, y, onX, X, Y }) => ({ q: `Titik ${L}′${P(X, Y)} ialah imej bagi titik ${L} di bawah pantulan pada ${PK(onX)}. Cari koordinat ${L}.`, ans: `${L}${P(x, y)}`, rev: true })
  ],
  paPaksi: [
    ({ L, pt, onX }) => ({ q: `Titik ${L}${pt} dipantulkan pada ${PK(onX)}. Nyatakan koordinat imej ${L}′.` }),
    ({ L, pt, onX }) => ({ q: `Titik ${L}${pt} terletak pada ${PK(onX)}. Apakah imejnya apabila dipantulkan pada ${PK(onX)}?` }),
    ({ L, pt, onX }) => ({ q: `Apakah yang berlaku kepada titik ${L}${pt} apabila dipantulkan pada ${PK(onX)}? Nyatakan koordinat imejnya.` })
  ],
  paGaris: [
    ({ L, x, y, ln }) => ({ q: `Titik ${L}${P(x, y)} dipantulkan pada garis ${ln}. Cari koordinat imej ${L}′.` }),
    ({ L, x, y, ln }) => ({ q: `Cari imej bagi titik ${L}${P(x, y)} di bawah pantulan pada garis ${ln}.` }),
    ({ L, x, y, ln }) => ({ q: `Garis ${ln} ialah paksi pantulan. Titik ${L}${P(x, y)} dipetakan kepada ${L}′. Cari koordinat ${L}′.` }),
    ({ x, y, ln, X, Y }) => ({ q: `Sebuah cermin diletakkan di sepanjang garis ${ln}. Nyatakan koordinat imej bagi titik ${P(x, y)}.`, ans: P(X, Y) }),
    ({ L, x, y, ln, X, Y }) => ({ q: `${L}′${P(X, Y)} ialah imej bagi titik ${L} di bawah pantulan pada garis ${ln}. Cari koordinat ${L}.`, ans: `${L}${P(x, y)}` })
  ],
  paCari: [
    ({ L, p1, p2 }) => ({ q: `Titik ${L}${p1} dipetakan kepada ${L}′${p2} oleh satu pantulan. Nyatakan persamaan paksi pantulan.` }),
    ({ p1, p2 }) => ({ q: `Di bawah satu pantulan, imej bagi titik ${p1} ialah ${p2}. Cari persamaan paksi pantulan.` }),
    ({ L, p1, p2 }) => ({ q: `${L}${p1} dan ${L}′${p2} ialah titik sepadan bagi objek dan imej di bawah satu pantulan. Tentukan persamaan paksi pantulan.` }),
    ({ p1, p2 }) => ({ q: `Sebuah cermin memantulkan titik ${p1} kepada titik ${p2}. Nyatakan persamaan garis cermin itu.` })
  ],

  /* ---------- 11.4 Putaran ---------- */
  r180: [
    ({ L, x, y }) => ({ q: `Titik ${L}${P(x, y)} diputar 180° pada asalan O. Cari koordinat imej ${L}′.` }),
    ({ L, x, y }) => ({ q: `Cari imej bagi titik ${L}${P(x, y)} di bawah putaran 180° pada asalan O.` }),
    ({ L, x, y }) => ({ q: `Di bawah putaran 180° pada asalan O, titik ${L}${P(x, y)} dipetakan kepada ${L}′. Nyatakan koordinat ${L}′.` }),
    ({ L, x, y }) => ({ q: `Titik ${L}${P(x, y)} diputar separuh pusingan pada asalan O. Di manakah imejnya?` }),
    ({ L, x, y }) => ({ q: `Titik ${L}′${P(-x, -y)} ialah imej bagi titik ${L} di bawah putaran 180° pada asalan O. Cari koordinat ${L}.`, ans: `${L}${P(x, y)}`, rev: true }),
    ({ L, x, y }) => { const N = vnama(); return Object.assign({ q: `${N} menyatakan bahawa imej bagi titik ${L}${P(x, y)} di bawah putaran 180° pada asalan O ialah ${P(-x, y)}. Adakah ${N} betul? Jika tidak, berikan jawapan yang betul.` }, salah(N, `${L}′${P(-x, -y)}`, `${N} hanya menukar tanda koordinat-x.`)); }
  ],
  putarInfo: [
    () => ({ q: 'Nyatakan tiga perkara yang perlu diberi untuk menghuraikan satu putaran.', ans: 'Pusat, sudut dan arah putaran', work: ['Pusat: titik tetap putaran.', 'Sudut: contohnya 90° atau 180°.', 'Arah: ikut atau lawan arah jam.'] }),
    () => ({ q: 'Berapakah sudut putaran bagi suku pusingan?', ans: '90°', work: ['Satu pusingan lengkap = 360°.', 'Suku pusingan = 360° ÷ 4 = 90°.'] }),
    () => ({ q: 'Jarum minit bergerak dari angka 12 ke angka 3. Nyatakan sudut dan arah putarannya.', ans: '90° ikut arah jam', work: ['12 ke 3 ialah suku pusingan = 90°.', 'Jarum jam bergerak ikut arah jam.'] }),
    () => ({ q: 'Jarum minit bergerak dari angka 12 ke angka 6. Berapakah sudut putarannya?', ans: '180°', work: ['12 ke 6 ialah separuh pusingan.', '360° ÷ 2 = 180°.'] }),
    () => ({ q: 'Adakah arah putaran perlu dinyatakan bagi putaran 180°? Terangkan.', ans: 'Tidak perlu; putaran 180° ikut atau lawan arah jam menghasilkan imej yang sama', work: ['Putar 180° ikut arah jam dan 180° lawan arah jam.', 'Kedua-duanya berakhir pada kedudukan yang sama.'] }),
    () => ({ q: 'Putaran 90° ikut arah jam menghasilkan imej yang sama dengan putaran berapa darjah lawan arah jam?', ans: '270° lawan arah jam', work: ['Satu pusingan lengkap = 360°.', '360° − 90° = 270°.'] })
  ],
  r90: [
    ({ L, x, y, cw }) => ({ q: `Titik ${L}${P(x, y)} diputar 90° ${ARAH(cw)} pada asalan O. Cari koordinat imej ${L}′.` }),
    ({ L, x, y, cw }) => ({ q: `Cari imej bagi titik ${L}${P(x, y)} di bawah putaran 90° ${ARAH(cw)} pada asalan O.` }),
    ({ L, x, y, cw }) => ({ q: `Di bawah putaran 90° ${ARAH(cw)} pada asalan O, titik ${L}${P(x, y)} dipetakan kepada ${L}′. Nyatakan koordinat ${L}′.` }),
    ({ L, x, y, cw }) => ({ q: `Titik ${L}${P(x, y)} diputar suku pusingan ${ARAH(cw)} pada asalan O. Nyatakan koordinat imejnya.` }),
    ({ x, y, cw, X, Y }) => ({ q: `Sebuah titik pada skrin permainan berada di ${P(x, y)}. Titik itu diputar 90° ${ARAH(cw)} pada asalan O. Di manakah titik itu selepas putaran?`, ans: P(X, Y) })
  ],
  r90p: [
    ({ L, x, y, h, k, cw }) => ({ q: `Titik ${L}${P(x, y)} diputar 90° ${ARAH(cw)} pada pusat ${P(h, k)}. Cari koordinat imej ${L}′.` }),
    ({ L, x, y, h, k, cw }) => ({ q: `Cari imej bagi titik ${L}${P(x, y)} di bawah putaran 90° ${ARAH(cw)} pada titik ${P(h, k)}.` }),
    ({ L, x, y, h, k, cw }) => ({ q: `Di bawah putaran 90° ${ARAH(cw)} pada pusat C${P(h, k)}, titik ${L}${P(x, y)} dipetakan kepada ${L}′. Cari koordinat ${L}′.` }),
    ({ L, x, y, h, k, cw }) => ({ q: `Titik ${L}${P(x, y)} diputar suku pusingan ${ARAH(cw)}. Pusat putaran ialah ${P(h, k)}. Nyatakan koordinat imejnya.` })
  ],

  /* ---------- 11.5 Sifat isometri ---------- */
  panjang: [
    ({ nm, n, t }) => ({ q: `Panjang sisi ${nm[0]}${nm[1]} sebuah objek ialah ${n} cm. Objek itu mengalami ${t}. Berapakah panjang ${pr(nm[0] + nm[1])}?` }),
    ({ nm, n, t }) => ({ q: `Segi tiga ${nm} dipetakan kepada segi tiga ${pr(nm)} oleh satu ${t}. Diberi ${nm[0]}${nm[1]} = ${n} cm, nyatakan panjang ${pr(nm[0] + nm[1])}.` }),
    ({ nm, n, t }) => ({ q: `Selepas satu ${t}, sisi ${nm[0]}${nm[1]} yang panjangnya ${n} cm dipetakan kepada sisi ${pr(nm[0] + nm[1])}. Berapakah panjang ${pr(nm[0] + nm[1])}? Berikan sebab.`, ans: `${n} cm, kerana ${t} ialah isometri` }),
    ({ n, t }) => ({ q: `Sebatang pembaris sepanjang ${n} cm ${KATAKERJA[t]}. Berapakah panjang imej pembaris itu?` }),
    ({ nm, n, t }) => ({ q: `Selepas satu ${t}, panjang sisi ${pr(nm[0] + nm[1])} pada imej ialah ${n} cm. Berapakah panjang sisi ${nm[0]}${nm[1]} pada objek?` })
  ],
  sudut: [
    ({ nm, d, t }) => ({ q: `Diberi ∠${nm} = ${d}°. Segi tiga ${nm} mengalami ${t}. Nyatakan saiz ∠${pr(nm)}.` }),
    ({ nm, d, t }) => ({ q: `Segi tiga ${nm} ${KATAKERJA[t]} dan imejnya ialah segi tiga ${pr(nm)}. Jika ∠${nm} = ${d}°, cari ∠${pr(nm)}.` }),
    ({ nm, d, t }) => ({ q: `Sudut ${nm} berukuran ${d}°. Selepas satu ${t}, berapakah saiz sudut sepadan pada imej?` }),
    ({ nm, d, t }) => ({ q: `Di bawah satu ${t}, ∠${pr(nm)} = ${d}°. Nyatakan saiz ∠${nm} pada objek.` }),
    ({ nm, d, t }) => { const N = vnama(); return { q: `${N} berkata saiz sudut berubah selepas ${t}. Diberi ∠${nm} = ${d}°, nyatakan saiz ∠${pr(nm)} dan jelaskan sama ada ${N} betul.`, ans: `${d}°; ${N} tidak betul kerana ${t} mengekalkan saiz sudut` }; }
  ],
  luas: [
    ({ p, l, t, area }) => ({ q: `Sebuah segi empat tepat berukuran ${p} cm × ${l} cm ${t}. Hitung ${area ? 'luas' : 'perimeter'} imejnya.` }),
    ({ p, l, t, area }) => ({ q: `Sekeping jubin berbentuk segi empat tepat berukuran ${p} cm × ${l} cm ${t}. Berapakah ${area ? 'luas' : 'perimeter'} imej jubin itu?` }),
    ({ p, l, t, area }) => ({ q: `Objek berbentuk segi empat tepat dengan panjang ${p} cm dan lebar ${l} cm ${t}. Hitung ${area ? 'luas' : 'perimeter'} imej.` })
  ],

  /* ---------- 11.6 Simetri putaran ---------- */
  bentuk: [
    ({ name }) => ({ q: `Nyatakan peringkat simetri putaran bagi ${name} di bawah.` }),
    ({ name }) => ({ q: `Berapa kalikah ${name} di bawah kelihatan sama seperti asal dalam satu putaran lengkap?` }),
    ({ name }) => ({ q: `Rajah di bawah menunjukkan sebuah ${name}. Tentukan peringkat simetri putarannya.` }),
    ({ name }) => ({ q: `Sebuah papan tanda berbentuk ${name} diputar pada pusatnya. Nyatakan peringkat simetri putaran papan tanda itu.` }),
    ({ name, ord }) => ({ q: `Cari sudut putaran terkecil supaya ${name} di bawah kelihatan sama seperti asal.`, ans: `${360 / ord}°`, work: [`Peringkat simetri putaran = ${ord}.`, `Sudut putaran terkecil = 360° ÷ ${ord} = ${360 / ord}°.`] })
  ],
  huruf: [
    ({ h }) => ({ q: `Nyatakan peringkat simetri putaran bagi huruf ${h}.` }),
    ({ h }) => ({ q: `Huruf ${h} diputar pada pusatnya. Berapa kalikah huruf itu kelihatan sama dalam satu putaran lengkap?` }),
    ({ h, ord }) => ({ q: `Adakah huruf ${h} mempunyai simetri putaran? Jika ya, nyatakan peringkatnya.`, ans: ord === 1 ? 'Tidak (peringkat 1)' : `Ya, peringkat ${ord}` }),
    ({ h, ord }) => ({ q: `Huruf ${h} dicetak pada sekeping kad. Kad itu diputar 180°. Adakah huruf itu kelihatan sama? Nyatakan peringkat simetri putarannya.`, ans: `${ord === 2 ? 'Ya' : 'Tidak'}; peringkat ${ord}` }),
    ({ h }) => ({ q: `Tentukan peringkat simetri putaran bagi huruf ${h}. Terangkan.` }),
    ({ h, ord }) => ({ q: `Nyatakan sudut putaran terkecil supaya huruf ${h} kelihatan sama seperti asal.`, ans: `${360 / ord}°`, work: [`Peringkat simetri putaran = ${ord}.`, `360° ÷ ${ord} = ${360 / ord}°.`] })
  ],
  pilihHuruf: [
    ({ list, dua }) => ({ q: `Antara huruf ${list}, yang manakah mempunyai peringkat simetri putaran 2?`, ans: dua }),
    ({ list, dua }) => ({ q: `Huruf manakah antara berikut yang kelihatan sama selepas diputar 180°: ${list}?`, ans: dua }),
    ({ list, satu }) => ({ q: `Kenal pasti huruf yang TIDAK mempunyai simetri putaran: ${list}.`, ans: satu })
  ],
  poligon: [
    ({ n }) => ({ q: `Sebuah poligon sekata mempunyai ${n} sisi. Berapakah sudut putaran terkecil supaya poligon itu kelihatan sama seperti asal?` }),
    ({ n }) => ({ q: `Sebuah poligon sekata dengan ${n} sisi diputar pada pusatnya. Hitung sudut putaran terkecil supaya poligon itu kelihatan sama seperti asal.` }),
    ({ n }) => ({ q: `Peringkat simetri putaran sebuah poligon sekata ialah ${n}. Berapakah sudut putaran terkecilnya?` }),
    ({ n }) => ({ q: `Sebuah poligon sekata kelihatan sama seperti asal setiap kali diputar ${360 / n}°. Berapakah bilangan sisi poligon itu?`, ans: `${n} sisi`, work: [`Bilangan sisi = peringkat simetri putaran.`, `360° ÷ ${360 / n}° = ${n}.`] })
  ],

  /* ---------- soalan melukis ---------- */
  lukis: [
    ({ names, desc }) => ({ q: `Pada grid di bawah, lukis imej bagi segi tiga ${names} ${desc}. Labelkan imej itu ${pr(names)}.` }),
    ({ names, descP }) => ({ q: `Segi tiga ${names} ${descP}. Lukis imejnya pada grid di bawah dan labelkan sebagai ${pr(names)}.` }),
    ({ names, desc }) => ({ q: `Rajah di bawah menunjukkan segi tiga ${names} pada satah Cartes. Lukis imej segi tiga itu ${desc}.` }),
    ({ names, desc }) => ({ q: `Lukis imej bagi segi tiga ${names} ${desc}. Seterusnya, nyatakan koordinat bucu-bucu imej ${pr(names)}.` })
  ]
};
