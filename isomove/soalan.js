'use strict';
/* =================== ISOMOVE · SOALAN BAB (isi bab sahaja) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq/gTap: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js.
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


/* =================== Penjana soalan =================== */
// setiap fungsi: {q, fig?, figAns?, ans, work[]}
const AX = 'paksi';
const GEN = {
  '11.1': {
    m: [() => vq('istilah', {}), () => {
      const [o, m] = pick([['P', 'Q'], ['M', 'N'], ['X', 'Y'], ['F', 'G'], ['S', 'T']]), sh = pick(['segi tiga', 'segi empat', 'pentagon']);
      return GEN_LQ('objImej', { sh, o, m, ans: `Objek: ${sh} ${o}; Imej: ${sh} ${m}`, work: ['Bentuk asal sebelum transformasi ialah <b>objek</b>.', 'Bentuk selepas transformasi ialah <b>imej</b>.'] });
    }, () => {
      const same = Math.random() < .6, a = ri(2, 3), b = ri(2, 3);
      const o = [[0, 0], [a, 0], [0, b]];
      const im = same ? (Math.random() < .5 ? o.map(([x, y]) => [12 - x - 1, y]) : o.map(([x, y]) => [8 + y, a - x])) : o.map(([x, y]) => [6 + 2 * x, 2 * y]);
      return GEN_LQ('kongruen', { same, ans: same ? 'Ya, kongruen' : 'Tidak kongruen', work: same ? ['Kedua-dua bentuk mempunyai bentuk yang sama.', 'Saiznya juga sama (panjang sisi sama).', 'Jadi bentuk itu <b>kongruen</b>.'] : ['Bentuknya sama tetapi <b>saiz berbeza</b>.', 'Bentuk kongruen mesti sama bentuk dan sama saiz.', 'Jadi bentuk itu <b>tidak kongruen</b>.'] },
        { fig: plot({ x0: 0, x1: 12, y0: 0, y1: 6, axes: false, items: [{ t: 'poly', pts: o, c: 'tr' }, { t: 'poly', pts: im, c: 'pa', dash: true }], label: 'Dua bentuk' }) });
    }],
    s: [() => {
      const iso = Math.random() < .5, o = [[1, 1], [3, 1], [1, 3]];
      const im = iso ? o.map(([x, y]) => [x + 6, y + 2]) : o.map(([x, y]) => [7 + (x - 1) * 2, 1 + (y - 1) * 2]);
      return GEN_LQ('isoFig', { iso, ans: iso ? 'Ya, isometri' : 'Bukan isometri', work: iso ? ['Bandingkan saiz objek dan imej.', 'Bentuk dan saiz imej <b>sama</b> dengan objek.', 'Jadi transformasi ini ialah isometri.'] : ['Bandingkan saiz objek dan imej.', 'Saiz imej <b>lebih besar</b> daripada objek.', 'Isometri mesti mengekalkan saiz, jadi ini bukan isometri.'] },
        { fig: plot({ x0: 0, x1: 12, y0: 0, y1: 7, axes: false, items: [{ t: 'poly', pts: o, c: 'tr' }, { t: 'poly', pts: im, c: 'pa', dash: true }], label: 'Objek dan imej' }) });
    }],
    k: [() => {
      const n = pick(['ABC', 'PQR', 'KLM', 'DEF', 'XYZ']), ab = ri(3, 12), ang = pick([35, 40, 48, 55, 62, 70, 75]);
      return GEN_LQ('panjangSudut', { n, ab, ang, ans: `${pr(n[0] + n[1])} = ${ab} cm, ∠${pr(n)} = ${ang}°`, work: ['Isometri mengekalkan bentuk dan saiz.', 'Maka imej kongruen dengan objek.', `Panjang sisi dan saiz sudut tidak berubah: ${pr(n[0] + n[1])} = ${ab} cm, ∠${pr(n)} = ${ang}°.`] });
    }]
  },
  '11.2': {
    m: [() => {
      const L = vlet(), x = ri(0, 4), y = ri(0, 4), a = nz(-3, 4), b = nz(-3, 4), X = x + a, Y = y + b;
      const box = { x0: Math.min(0, x, X) - 1, x1: Math.max(x, X) + 1, y0: Math.min(0, y, Y) - 1, y1: Math.max(y, Y) + 1 };
      return GEN_LQ('trImej', { L, x, y, a, b, X, Y, ans: `${L}′${P(X, Y)}`, work: [`Gerak ${Math.abs(a)} unit ke ${a > 0 ? 'kanan' : 'kiri'}: ${fmt(x)} + ${par(a)} = ${fmt(X)}.`, `Gerak ${Math.abs(b)} unit ke ${b > 0 ? 'atas' : 'bawah'}: ${fmt(y)} + ${par(b)} = ${fmt(Y)}.`] }, {
        fig: plot({ ...box, items: [{ t: 'pt', x, y, c: 'tr', l: L }], label: `Titik ${L}` }),
        figAns: plot({ ...box, items: [{ t: 'line', a: [x, y], b: [X, Y], c: 'tx', dash: true, w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: X, y: Y, c: 'gr', l: L + '′' }], label: `${L} dan ${L}′` }) });
    }, () => {
      const a = nz(-5, 5), b = nz(-5, 5);
      return GEN_LQ('trKata', { a, b, ans: `Vektor translasi = ${vec(a, b, 'gr')}`, work: [`${a > 0 ? 'Ke kanan: positif' : 'Ke kiri: negatif'}, ${fmt(a)}.`, `${b > 0 ? 'Ke atas: positif' : 'Ke bawah: negatif'}, ${fmt(b)}.`, `Tulis sebagai vektor ${vec(a, b)}.`] });
    }],
    s: [() => {
      const L = vlet(), x = ri(-3, 3), y = ri(-3, 3), a = nz(-4, 4), b = nz(-4, 4), X = x + a, Y = y + b;
      return GEN_LQ('trVektor', { L, x, y, X, Y, ans: `Vektor translasi = ${vec(a, b, 'gr')}`, work: [`Gerakan mengufuk: ${fmt(X)} − ${par(x)} = ${fmt(a)}.`, `Gerakan mencancang: ${fmt(Y)} − ${par(y)} = ${fmt(b)}.`, `Tulis sebagai vektor ${vec(a, b)}.`] });
    }, () => {
      const L = vlet(), X = ri(-2, 6), Y = ri(-2, 6), a = nz(-4, 4), b = nz(-4, 4);
      return GEN_LQ('trObjek', { L, X, Y, a, b, x: X - a, y: Y - b, ans: `${L}${P(X - a, Y - b)}`, work: ['Gerak dalam arah <b>songsang</b> dari imej ke objek.', `Koordinat-x: ${fmt(X)} − ${par(a)} = ${fmt(X - a)}.`, `Koordinat-y: ${fmt(Y)} − ${par(b)} = ${fmt(Y - b)}.`] });
    }],
    k: [() => {
      const A = vlet(); let B; do B = vlet(); while (B === A);
      const ax = ri(-3, 3), ay = ri(-3, 3), a = nz(-4, 4), b = nz(-4, 4), bx = ri(-4, 4), by = ri(-4, 4);
      return GEN_LQ('trB', { A, B, ax, ay, a, b, bx, by, ans: `${B}′${P(bx + a, by + b)}`, work: [`Cari vektor translasi: ${vec(a, b)} (${fmt(ax + a)} − ${par(ax)}, ${fmt(ay + b)} − ${par(ay)}).`, `Tambah vektor pada ${B}: (${fmt(bx)} + ${par(a)}, ${fmt(by)} + ${par(b)}).`, `${B}′${P(bx + a, by + b)}.`] });
    }, () => {
      const L = vlet(), x = ri(-3, 3), y = ri(-3, 3), a = nz(-3, 3), b = nz(-3, 3), c = nz(-3, 3), e = nz(-3, 3);
      return GEN_LQ('trDua', { L, x, y, a, b, c, e, ans: P(x + a + c, y + b + e), work: [`Selepas translasi pertama: ${P(x + a, y + b)}.`, `Selepas translasi kedua: ${P(x + a + c, y + b + e)}.`] });
    }]
  },
  '11.3': {
    m: [() => {
      const L = vlet(), x = nz(-4, 4), y = nz(-4, 4), onX = Math.random() < .5, X = onX ? x : -x, Y = onX ? -y : y;
      const box = { x0: -5, x1: 5, y0: -5, y1: 5, u: 34 };
      return GEN_LQ('paImej', { L, x, y, onX, X, Y, ans: `${L}′${P(X, Y)}`, work: onX ? ['Pantulan pada paksi-x: (x, y) → (x, −y).', `Koordinat-x kekal: ${fmt(x)}.`, `Koordinat-y bertukar tanda: ${fmt(y)} → ${fmt(-y)}.`] : ['Pantulan pada paksi-y: (x, y) → (−x, y).', `Koordinat-x bertukar tanda: ${fmt(x)} → ${fmt(-x)}.`, `Koordinat-y kekal: ${fmt(y)}.`] }, {
        fig: plot({ ...box, items: [{ t: 'pt', x, y, c: 'tr', l: L }], label: `Titik ${L}` }),
        figAns: plot({ ...box, items: [{ t: 'line', a: [x, y], b: [X, Y], c: 'tx', dash: true, w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: X, y: Y, c: 'gr', l: L + '′' }], label: `${L} dan ${L}′` }) });
    }, () => {
      const L = vlet(), v = nz(-5, 5), onX = Math.random() < .5, pt = onX ? P(v, 0) : P(0, v);
      return GEN_LQ('paPaksi', { L, pt, onX, ans: `${L}′${pt}`, work: [`Titik ${L} terletak pada ${PK(onX)}, iaitu paksi pantulan.`, 'Titik pada paksi pantulan tidak berubah kedudukan.', `Maka imejnya ialah titik yang sama: ${pt}.`] });
    }],
    s: [() => {
      const L = vlet(), vert = Math.random() < .5, h = ri(-2, 4), x = ri(-3, 6), y = ri(-3, 6);
      if (vert) { let px = x; if (px === h) px = h - 2; const d = h - px, X = h + d;
        return GEN_LQ('paGaris', { L, x: px, y, X, Y: y, ln: `x = ${fmt(h)}`, ans: `${L}′${P(X, y)}`, work: [`Jarak ${L} ke garis x = ${fmt(h)} ialah ${Math.abs(d)} unit.`, `Imej berada ${Math.abs(d)} unit di sebelah lain garis: x = ${fmt(X)}.`, `Koordinat-y tidak berubah: ${fmt(y)}.`] }); }
      let py = y; if (py === h) py = h - 2; const d = h - py, Y = h + d;
      return GEN_LQ('paGaris', { L, x, y: py, X: x, Y, ln: `y = ${fmt(h)}`, ans: `${L}′${P(x, Y)}`, work: [`Jarak ${L} ke garis y = ${fmt(h)} ialah ${Math.abs(d)} unit.`, `Imej berada ${Math.abs(d)} unit di sebelah lain garis: y = ${fmt(Y)}.`, `Koordinat-x tidak berubah: ${fmt(x)}.`] });
    }],
    k: [() => {
      const L = vlet(), vert = Math.random() < .5, m = ri(-3, 4), d = ri(1, 4), c = ri(-3, 4);
      if (vert) return GEN_LQ('paCari', { L, p1: P(m - d, c), p2: P(m + d, c), ans: `x = ${fmt(m)}`, work: ['Kedua-dua titik mempunyai koordinat-y yang sama, jadi paksi pantulan ialah garis mencancang.', `Titik tengah: (${fmt(m - d)} + ${par(m + d)}) ÷ 2 = ${fmt(m)}.`, `Paksi pantulan: x = ${fmt(m)}.`] });
      return GEN_LQ('paCari', { L, p1: P(c, m - d), p2: P(c, m + d), ans: `y = ${fmt(m)}`, work: ['Kedua-dua titik mempunyai koordinat-x yang sama, jadi paksi pantulan ialah garis mengufuk.', `Titik tengah: (${fmt(m - d)} + ${par(m + d)}) ÷ 2 = ${fmt(m)}.`, `Paksi pantulan: y = ${fmt(m)}.`] });
    }]
  },
  '11.4': {
    m: [() => {
      const L = vlet(), x = nz(-4, 4), y = nz(-4, 4);
      const box = { x0: -5, x1: 5, y0: -5, y1: 5, u: 34 };
      return GEN_LQ('r180', { L, x, y, ans: `${L}′${P(-x, -y)}`, work: ['Putaran 180° pada asalan: (x, y) → (−x, −y).', `Kedua-dua koordinat bertukar tanda: ${P(x, y)} → ${P(-x, -y)}.`] }, {
        fig: plot({ ...box, items: [{ t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: 0, y: 0, c: 'am' }], label: `Titik ${L}` }),
        figAns: plot({ ...box, items: [{ t: 'line', a: [x, y], b: [-x, -y], c: 'tx', dash: true, w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: -x, y: -y, c: 'gr', l: L + '′' }, { t: 'pt', x: 0, y: 0, c: 'am' }], label: `${L} dan ${L}′` }) });
    }, () => vq('putarInfo', {})],
    s: [() => {
      const L = vlet(), x = nz(-4, 4), y = nz(-4, 4), cw = Math.random() < .5, X = cw ? y : -y, Y = cw ? -x : x;
      const box = { x0: -5, x1: 5, y0: -5, y1: 5, u: 34 };
      return GEN_LQ('r90', { L, x, y, cw, X, Y, ans: `${L}′${P(X, Y)}`, work: [`Surih ${L} dan O pada kertas surih.`, `Putar kertas surih 90° ${ARAH(cw)} dengan pensel di O.`, `Baca kedudukan baharu ${L}: ${P(X, Y)}.`] }, {
        fig: plot({ ...box, items: [{ t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: 0, y: 0, c: 'am' }], label: `Titik ${L}` }),
        figAns: plot({ ...box, items: [{ t: 'line', a: [0, 0], b: [x, y], c: 'tr', w: 2.5 }, { t: 'line', a: [0, 0], b: [X, Y], c: 'gr', w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: X, y: Y, c: 'gr', l: L + '′' }, { t: 'pt', x: 0, y: 0, c: 'am' }], label: `${L} dan ${L}′` }) });
    }],
    k: [() => {
      const L = vlet(), h = ri(-2, 2), k = ri(-2, 2), dx = nz(-3, 3), dy = nz(-3, 3), x = h + dx, y = k + dy, cw = Math.random() < .5;
      const X = cw ? h + dy : h - dy, Y = cw ? k - dx : k + dx;
      return GEN_LQ('r90p', { L, x, y, h, k, cw, ans: `${L}′${P(X, Y)}`, work: [`Dari pusat ke ${L}: ${Math.abs(dx)} unit ${dx > 0 ? 'kanan' : 'kiri'}, ${Math.abs(dy)} unit ${dy > 0 ? 'atas' : 'bawah'}.`, `Putar arah gerakan itu 90° ${ARAH(cw)}.`, `Dari pusat ${P(h, k)}, imej berada di ${P(X, Y)}.`] }, {
        fig: plot({ x0: -6, x1: 6, y0: -6, y1: 6, u: 30, items: [{ t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: h, y: k, c: 'am', l: 'pusat', dy: 22 }], label: `Titik ${L} dan pusat` }),
        figAns: plot({ x0: -6, x1: 6, y0: -6, y1: 6, u: 30, items: [{ t: 'line', a: [h, k], b: [x, y], c: 'tr', w: 2.5 }, { t: 'line', a: [h, k], b: [X, Y], c: 'gr', w: 2.5 }, { t: 'pt', x, y, c: 'tr', l: L }, { t: 'pt', x: X, y: Y, c: 'gr', l: L + '′' }, { t: 'pt', x: h, y: k, c: 'am' }], label: `${L} dan ${L}′` }) });
    }]
  },
  '11.5': {
    m: [() => {
      const n = ri(3, 15), t = pick(['translasi', 'pantulan', 'putaran']), nm = pick(['ABC', 'PQR', 'KLM', 'DEF', 'XYZ']);
      return GEN_LQ('panjang', { nm, n, t, ans: `${n} cm`, work: [`${vcap(t)} ialah isometri.`, 'Isometri mengekalkan jarak antara dua titik.', `Maka panjang sisi sepadan = ${n} cm.`] });
    }, () => {
      const d = pick([30, 35, 42, 50, 58, 64, 72, 85, 96, 105, 118, 125]), t = pick(['translasi', 'pantulan', 'putaran']), nm = pick(['ABC', 'PQR', 'KLM', 'DEF', 'XYZ']);
      return GEN_LQ('sudut', { nm, d, t, ans: `${d}°`, work: [`${vcap(t)} ialah isometri.`, 'Isometri mengekalkan saiz sudut.', `Maka saiz sudut sepadan = ${d}°.`] });
    }],
    s: [() => pick([
      { q: 'Dalam pantulan, titik manakah yang tidak berubah kedudukan?', ans: 'Titik pada paksi pantulan', work: ['Titik pada paksi pantulan berjarak 0 dari paksi.', 'Imejnya berada pada kedudukan yang sama.'] },
      { q: 'Dalam putaran, titik manakah yang tidak berubah kedudukan?', ans: 'Pusat putaran', work: ['Setiap titik diputar pada pusat putaran.', 'Pusat itu sendiri tidak bergerak.'] },
      { q: 'Transformasi isometri manakah yang menghasilkan imej terbalik (songsang sisi)?', ans: 'Pantulan', work: ['Translasi dan putaran tidak menterbalikkan bentuk.', 'Pantulan menghasilkan imej yang terbalik seperti dalam cermin.'] },
      { q: 'Nyatakan tiga maklumat yang diperlukan untuk menghuraikan satu putaran.', ans: 'Pusat, sudut dan arah putaran', work: ['Pusat: titik tetap putaran.', 'Sudut: contohnya 90° atau 180°.', 'Arah: ikut atau lawan arah jam.'] },
      { q: 'Apakah maklumat yang diperlukan untuk menghuraikan satu translasi?', ans: 'Vektor translasi', work: ['Translasi ditentukan oleh jarak dan arah gerakan.', 'Kedua-duanya diwakili oleh vektor translasi.'] },
      { q: 'Apakah maklumat yang diperlukan untuk menghuraikan satu pantulan?', ans: 'Paksi pantulan', work: ['Pantulan ditentukan oleh garis cermin.', 'Garis itu dipanggil paksi pantulan.'] },
      { q: 'Dalam translasi, adakah orientasi imej sama dengan orientasi objek?', ans: 'Ya, sama', work: ['Translasi hanya menggelongsor bentuk.', 'Bentuk tidak berputar atau terbalik.'] },
      { q: 'Dalam putaran, adakah jarak setiap titik dari pusat putaran berubah?', ans: 'Tidak berubah', work: ['Setiap titik bergerak pada bulatan berpusat di pusat putaran.', 'Jaraknya dari pusat kekal sama.'] }
    ])],
    k: [() => {
      const p = ri(4, 12), l = ri(2, p - 1), t = pick(['diputar 90° pada satu titik', 'dipantulkan pada satu garis', 'ditranslasikan']), area = Math.random() < .5;
      return GEN_LQ('luas', { p, l, t, area, ans: area ? `${p * l} cm²` : `${2 * (p + l)} cm`, work: ['Transformasi ini ialah isometri, jadi imej kongruen dengan objek.', `Ukuran imej juga ${p} cm × ${l} cm.`, area ? `Luas = ${p} × ${l} = ${p * l} cm².` : `Perimeter = 2 × (${p} + ${l}) = ${2 * (p + l)} cm.`] });
    }]
  },
  '11.6': {
    m: [() => {
      const o = pick([['poly', 3, 'segi tiga sama sisi', 3], ['poly', 4, 'segi empat sama', 4], ['rect', 0, 'segi empat tepat', 2], ['poly', 5, 'pentagon sekata', 5], ['poly', 6, 'heksagon sekata', 6], ['poly', 8, 'oktagon sekata', 8], ['rhombus', 0, 'rombus', 2], ['para', 0, 'segi empat selari', 2]]);
      return GEN_LQ('bentuk', { name: o[2], ord: o[3], ans: `${o[3]}`, work: ['Bayangkan bentuk diputar satu putaran lengkap (360°).', `Kira berapa kali bentuk kelihatan sama seperti asal: ${o[3]} kali.`] }, { fig: o[0] === 'poly' || o[0] === 'rect' ? shapeSVG(o[0], o[1]) : wsShape(o[0], o[1]).replace(' class="shp"', '') });
    }, () => {
      const [h, ord] = pick([['H', 2], ['N', 2], ['S', 2], ['Z', 2], ['X', 2], ['A', 1], ['T', 1], ['L', 1], ['F', 1], ['E', 1]]);
      return GEN_LQ('huruf', { h, ord, ans: `${ord}`, work: ord === 2 ? ['Putar huruf 180°.', 'Huruf kelihatan sama seperti asal.', 'Dalam satu putaran lengkap, ia kelihatan sama 2 kali.'] : ['Putar huruf 90° dan 180°: huruf tidak kelihatan sama.', 'Ia hanya kelihatan sama selepas satu putaran lengkap.', 'Maka peringkat simetri putaran ialah 1.'] }, { fig: shapeSVG('letter', h) });
    }],
    s: [() => {
      const [h, ord] = pick([['H', 2], ['N', 2], ['S', 2], ['Z', 2], ['X', 2], ['A', 1], ['T', 1], ['L', 1], ['F', 1], ['E', 1]]);
      return GEN_LQ('huruf', { h, ord, ans: `${ord}`, work: ord === 2 ? ['Putar huruf 180°.', 'Huruf kelihatan sama seperti asal.', 'Dalam satu putaran lengkap, ia kelihatan sama 2 kali.'] : ['Putar huruf 90° dan 180°: huruf tidak kelihatan sama.', 'Ia hanya kelihatan sama selepas satu putaran lengkap.', 'Maka peringkat simetri putaran ialah 1.'] }, { fig: shapeSVG('letter', h) });
    }, () => {
      const two = shuffle(['H', 'N', 'S', 'Z', 'X', 'I']).slice(0, 2), one = shuffle(['A', 'T', 'L', 'F', 'E', 'K', 'M', 'W', 'V', 'U', 'Y']).slice(0, 2);
      const dan2 = a => a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1];
      const list = dan2(shuffle(two.concat(one))), dua = dan2(two.slice().sort()), satu = dan2(one.slice().sort());
      return GEN_LQ('pilihHuruf', { list, dua, satu, ans: dua, work: ['Bayangkan setiap huruf diputar 180°.', `${dua} kelihatan sama: peringkat 2.`, `${satu} tidak kelihatan sama: peringkat 1.`] });
    }],
    k: [() => {
      const n = pick([3, 4, 5, 6, 8, 9, 10, 12]);
      return GEN_LQ('poligon', { n, ans: `${360 / n}°`, work: [`Peringkat simetri putaran poligon sekata ${n} sisi ialah ${n}.`, `Sudut putaran terkecil = 360° ÷ ${n}.`, `= ${360 / n}°.`] });
    }]
  }
};


const LET = ['ABC', 'PQR', 'KLM', 'DEF', 'XYZ', 'JKL', 'STU'];

/* ---------- rajah ---------- */
function wsTri(x0, x1, y0, y1) {
  // segi tiga tidak simetri dengan bucu titik grid dalam julat
  for (let t = 0; t < 200; t++) {
    const a = [wri(x0, x1), wri(y0, y1)], b = [wri(x0, x1), wri(y0, y1)], c = [wri(x0, x1), wri(y0, y1)];
    const area2 = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]));
    const d = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
    const s = [d(a, b), d(b, c), d(a, c)];
    if (area2 >= 4 && area2 <= 10 && new Set(s).size === 3 && Math.max(...s) <= 18 && Math.min(...s) >= 4) return [a, b, c];
  }
  return [[x0, y0], [x0 + 2, y0], [x0, y0 + 3]];
}
const offs = (pts, i) => { const g = [pts.reduce((s, p) => s + p[0], 0) / 3, pts.reduce((s, p) => s + p[1], 0) / 3]; const p = pts[i]; let dx = p[0] - g[0], dy = p[1] - g[1]; const L = Math.hypot(dx, dy) || 1; return { dx: Math.round(dx / L * 16) - 6, dy: Math.round(-dy / L * 16) + 6 }; };
function triItems(pts, c, names, dash) {
  return [{ t: 'poly', pts, c, dash }].concat(pts.map((p, i) => Object.assign({ t: 'pt', x: p[0], y: p[1], c, l: names[i] }, offs(pts, i))));
}
const G6 = { x0: -6, x1: 6, y0: -6, y1: 6, u: 30 };
function wsShape(kind, n) {
  const c = 'var(--pk)', st = `style="fill:${c};fill-opacity:.18;stroke:${c}" stroke-width="5" stroke-linejoin="round"`;
  let s = '';
  if (kind === 'poly') { const pts = []; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (n % 2 ? 0 : Math.PI / n) + i * 2 * Math.PI / n; pts.push((150 + 100 * Math.cos(a)).toFixed(1) + ',' + (150 + 100 * Math.sin(a)).toFixed(1)); } s = `<polygon points="${pts.join(' ')}" ${st}/>`; }
  if (kind === 'rect') s = `<rect x="40" y="95" width="220" height="110" ${st}/>`;
  if (kind === 'rhombus') s = `<polygon points="150,40 230,150 150,260 70,150" ${st}/>`;
  if (kind === 'para') s = `<polygon points="90,90 270,90 210,210 30,210" ${st}/>`;
  if (kind === 'kite') s = `<polygon points="150,30 230,120 150,270 70,120" ${st}/>`;
  if (kind === 'trap') s = `<polygon points="100,90 200,90 260,210 40,210" ${st}/>`;
  if (kind === 'letter') s = `<text x="150" y="222" text-anchor="middle" font-family="Inter, sans-serif" font-size="210" font-weight="800" ${st.replace('stroke-width="5"', 'stroke-width="4"')}>${n}</text>`;
  return `<svg class="shp" viewBox="0 0 300 300" role="img" aria-label="Bentuk">${s}</svg>`;
}

/* ---------- penjana (i = indeks dalam kumpulan) ---------- */
// Ayat soalan diambil daripada bank QV (qv.js) supaya cara tanya berbeza-beza.
const WG = {};
const wq = (key, d, extra) => Object.assign({}, extra || {}, vq(key, d));
const LET4 = ['ABCD', 'PQRS', 'KLMN', 'EFGH', 'WXYZ'];
const wlet2 = () => { const a = vlet(); let b; do b = vlet(); while (b === a); return [a, b]; };
const wshuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(WR() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const dan = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1];
// 11.1
WG.istilah = () => vq('istilah', {});
WG.kongruen = i => {
  const same = i % 3 !== 2, a = wri(2, 3), b = wri(2, 4);
  const o = wpick([[[0, 0], [a, 0], [0, b]], [[0, 0], [a, 0], [a, b], [0, b]], [[0, 0], [a + 1, 0], [1, b]]]);
  const how = wri(0, 2);
  let im;
  if (!same) im = o.map(([x, y]) => [5 + 2 * x, 2 * y]);
  else if (how === 0) im = o.map(([x, y]) => [13 - x, y]);
  else if (how === 1) im = o.map(([x, y]) => [9 + y, a + 1 - x]);
  else im = o.map(([x, y]) => [x + 8, y + 1]);
  return wq('kongruen', { same, ans: same ? 'Ya, kongruen' : 'Tidak kongruen', work: same ? ['Bentuk dan saiz kedua-duanya sama.'] : ['Bentuk sama tetapi saiz berbeza.'] },
    { fig: plot({ x0: 0, x1: 14, y0: 0, y1: 8, u: 26, axes: false, items: [{ t: 'poly', pts: o, c: 'tr' }, { t: 'poly', pts: im, c: 'pa', dash: true }], label: 'Dua bentuk' }) });
};
WG.objekImej = i => {
  const [o, m] = [['P', 'Q'], ['M', 'N'], ['X', 'Y'], ['F', 'G'], ['S', 'T']][i % 5];
  const sh = wpick(['segi tiga', 'segi empat', 'pentagon']);
  return wq('objImej', { sh, o, m, ans: `Objek: ${sh} ${o}; Imej: ${sh} ${m}`, work: ['Bentuk asal ialah objek.', 'Bentuk selepas transformasi ialah imej.'] });
};
WG.titikImej = () => {
  const nm = wpick(LET4), k = wri(0, 3);
  return wq('titikImej', { nm, k, ans: `${nm[k]}′`, work: [`Titik ${nm[k]} dipetakan kepada titik sepadan ${nm[k]}′.`] });
};
WG.isometriFig = i => {
  const iso = i % 2 === 0, o = wpick([[[1, 1], [3, 1], [1, 3]], [[1, 1], [4, 1], [4, 3]], [[1, 1], [3, 1], [3, 2], [1, 3]]]);
  const dy = wri(0, 3), im = iso ? o.map(([x, y]) => [x + 6, y + dy]) : o.map(([x, y]) => [6 + (x - 1) * 2, 1 + (y - 1) * 2]);
  return wq('isoFig', { iso, ans: iso ? 'Ya, isometri' : 'Bukan isometri', work: iso ? ['Bentuk dan saiz imej sama dengan objek.'] : ['Saiz imej berbeza daripada objek.'] },
    { fig: plot({ x0: 0, x1: 13, y0: 0, y1: 8, u: 26, axes: false, items: [{ t: 'poly', pts: o, c: 'tr' }, { t: 'poly', pts: im, c: 'pa', dash: true }], label: 'Objek dan imej' }) });
};
const ISOTEKS = [
  ['Imej mempunyai bentuk dan saiz yang sama dengan objek.', true],
  ['Panjang setiap sisi imej dua kali panjang sisi objek.', false],
  ['Imej ialah hasil pantulan objek pada paksi-y.', true],
  ['Luas imej separuh daripada luas objek.', false],
  ['Semua sudut dan panjang sisi imej sama dengan objek.', true],
  ['Imej lebih kecil daripada objek tetapi bentuknya sama.', false],
  ['Objek diputar 90° pada satu titik.', true],
  ['Perimeter imej berbeza daripada perimeter objek.', false]
];
WG.isometriTeks = i => {
  const [s, iso] = ISOTEKS[(i * 2 + wri(0, 1)) % ISOTEKS.length];
  return wq('isoTeks', { s, iso, ans: iso ? 'Ya, isometri' : 'Bukan isometri', work: ['Isometri mengekalkan bentuk dan saiz.'] });
};
WG.panjangSudut = i => {
  const ab = [5, 8, 12][i], ang = [40, 65, 110][i], n = LET[i];
  return wq('panjangSudut', { n, ab, ang, ans: `${pr(n[0] + n[1])} = ${ab} cm, ∠${pr(n)} = ${ang}°`, work: ['Isometri mengekalkan bentuk dan saiz.', 'Panjang sisi dan saiz sudut tidak berubah.'] });
};
// 11.2
WG.imejTitik = () => {
  const L = vlet(), x = wri(-4, 4), y = wri(-4, 4), a = wnz(-4, 4), b = wnz(-4, 4), X = x + a, Y = y + b;
  return wq('trImej', { L, x, y, a, b, X, Y, ans: `${L}′${P(X, Y)}`, work: [`x: ${fmt(x)} + ${par(a)} = ${fmt(X)}`, `y: ${fmt(y)} + ${par(b)} = ${fmt(Y)}`] });
};
WG.vektorKata = () => {
  const a = wnz(-5, 5), b = wnz(-5, 5);
  return wq('trKata', { a, b, ans: vec(a, b), work: [`${a > 0 ? 'Kanan positif' : 'Kiri negatif'}: ${fmt(a)}.`, `${b > 0 ? 'Atas positif' : 'Bawah negatif'}: ${fmt(b)}.`] });
};
function lukis(kind, opt) {
  // soalan melukis: objek pada grid, murid lukis imej
  for (let t = 0; t < 300; t++) {
    let o, f, extra = [], desc, descP;
    const names = wpick(LET);
    if (kind === 'tr') { o = wsTri(-5, 0, -5, 0); const a = opt.neg ? wnz(-4, 4) : wri(2, 5), b = opt.neg ? wnz(-4, 4) : wri(1, 5); f = ([x, y]) => [x + a, y + b]; desc = `di bawah translasi ${vec(a, b)}`; descP = `ditranslasikan oleh ${vec(a, b)}`; }
    if (kind === 'px') { o = wsTri(-5, 5, 1, 5); f = ([x, y]) => [x, -y]; desc = 'apabila dipantulkan pada paksi-x'; descP = 'dipantulkan pada paksi-x'; }
    if (kind === 'py') { o = wsTri(1, 5, -5, 5); f = ([x, y]) => [-x, y]; desc = 'apabila dipantulkan pada paksi-y'; descP = 'dipantulkan pada paksi-y'; }
    if (kind === 'xh') { const h = wnz(-2, 2); o = wsTri(h + 1, Math.min(6, h + 4), -4, 4); f = ([x, y]) => [2 * h - x, y]; desc = `apabila dipantulkan pada garis x = ${fmt(h)}`; descP = `dipantulkan pada garis x = ${fmt(h)}`; extra = [{ t: 'line', a: [h, -6], b: [h, 6], c: 'pa', w: 3 }, { t: 'text', x: h, y: 6, s: `x = ${fmt(h)}`, c: 'pa', anchor: 'start', size: 14 }]; }
    if (kind === 'yk') { const k = wnz(-2, 2); o = wsTri(-4, 4, k + 1, Math.min(6, k + 4)); f = ([x, y]) => [x, 2 * k - y]; desc = `apabila dipantulkan pada garis y = ${fmt(k)}`; descP = `dipantulkan pada garis y = ${fmt(k)}`; extra = [{ t: 'line', a: [-6, k], b: [6, k], c: 'pa', w: 3 }, { t: 'text', x: -6, y: k, s: `y = ${fmt(k)}`, c: 'pa', anchor: 'start', size: 14 }]; }
    if (kind === 'r180') { o = wsTri(1, 5, 1, 5); f = ([x, y]) => [-x, -y]; desc = 'apabila diputar 180° pada asalan O'; descP = 'diputar 180° pada asalan O'; }
    if (kind === 'r90') { const cw = opt.cw; o = wsTri(1, 5, 1, 5); f = cw ? ([x, y]) => [y, -x] : ([x, y]) => [-y, x]; desc = `apabila diputar 90° ${ARAH(cw)} pada asalan O`; descP = `diputar 90° ${ARAH(cw)} pada asalan O`; }
    const im = o.map(f);
    if (!im.every(([x, y]) => Math.abs(x) <= 6 && Math.abs(y) <= 6)) continue;
    const nm = names.split(''), nm2 = nm.map(c => c + '′');
    const base = Object.assign({}, G6, { u: 28 });
    return wq('lukis', { names, desc, descP, ans: im.map((p, i) => `${nm2[i]}${P(p[0], p[1])}`).join(', '), work: [] }, {
      kind: 'lukis',
      fig: plot(Object.assign({}, base, { items: extra.concat(triItems(o, 'tr', nm)), label: `Grid dengan segi tiga ${names}` })),
      figAns: plot(Object.assign({}, base, { items: extra.concat(triItems(o, 'tr', nm), triItems(im, 'gr', nm2, true)), label: `Segi tiga ${names} dan imejnya` })) });
  }
}
WG.lukisTr = () => lukis('tr', { neg: false });
WG.lukisTrNeg = () => lukis('tr', { neg: true });
WG.cariVektor = () => {
  const L = vlet(), x = wri(-4, 4), y = wri(-4, 4), a = wnz(-5, 5), b = wnz(-5, 5), X = x + a, Y = y + b;
  return wq('trVektor', { L, x, y, X, Y, ans: vec(a, b), work: [`${fmt(X)} − ${par(x)} = ${fmt(a)}`, `${fmt(Y)} − ${par(y)} = ${fmt(b)}`] });
};
WG.cariObjek = () => {
  const L = vlet(), X = wri(-3, 6), Y = wri(-3, 6), a = wnz(-4, 4), b = wnz(-4, 4);
  return wq('trObjek', { L, X, Y, a, b, x: X - a, y: Y - b, ans: `${L}${P(X - a, Y - b)}`, work: [`${fmt(X)} − ${par(a)} = ${fmt(X - a)}`, `${fmt(Y)} − ${par(b)} = ${fmt(Y - b)}`] });
};
WG.imejB = () => {
  const [A, B] = wlet2(), ax = wri(-3, 3), ay = wri(-3, 3), a = wnz(-4, 4), b = wnz(-4, 4), bx = wri(-4, 4), by = wri(-4, 4);
  return wq('trB', { A, B, ax, ay, a, b, bx, by, ans: `${B}′${P(bx + a, by + b)}`, work: [`Vektor translasi = ${vec(a, b)}`, `${B}′ = (${fmt(bx)} + ${par(a)}, ${fmt(by)} + ${par(b)})`] });
};
WG.duaTranslasi = () => {
  const L = vlet(), x = wri(-3, 3), y = wri(-3, 3), a = wnz(-3, 3), b = wnz(-3, 3), c = wnz(-3, 3), e = wnz(-3, 3);
  return wq('trDua', { L, x, y, a, b, c, e, ans: P(x + a + c, y + b + e), work: [`Selepas translasi pertama: ${P(x + a, y + b)}`, `Selepas translasi kedua: ${P(x + a + c, y + b + e)}`] });
};
// 11.3
WG.paksiTitik = () => {
  const L = vlet(), x = wnz(-5, 5), y = wnz(-5, 5), onX = WR() < .5, X = onX ? x : -x, Y = onX ? -y : y;
  return wq('paImej', { L, x, y, onX, X, Y, ans: `${L}′${P(X, Y)}`, work: [onX ? '(x, y) → (x, −y)' : '(x, y) → (−x, y)'] });
};
WG.padaPaksi = i => {
  const L = vlet(), v = wnz(-5, 5), onX = i % 2 === 0, pt = onX ? P(v, 0) : P(0, v);
  return wq('paPaksi', { L, pt, onX, ans: `${L}′${pt}`, work: ['Titik pada paksi pantulan tidak berubah kedudukan.'] });
};
WG.lukisPaksi = i => lukis(i % 2 ? 'px' : 'py', {});
WG.garisHK = i => {
  const L = vlet(), h = wri(-2, 4);
  if (i % 2 === 0) {
    let x = wri(-3, 6); if (x === h) x = h - 2; const y = wri(-4, 5), X = 2 * h - x;
    return wq('paGaris', { L, x, y, X, Y: y, ln: `x = ${fmt(h)}`, ans: `${L}′${P(X, y)}`, work: [`Jarak ke garis = ${Math.abs(h - x)} unit`, `x′ = ${fmt(X)}, y tidak berubah`] });
  }
  let y = wri(-3, 6); if (y === h) y = h - 2; const x = wri(-4, 5), Y = 2 * h - y;
  return wq('paGaris', { L, x, y, X: x, Y, ln: `y = ${fmt(h)}`, ans: `${L}′${P(x, Y)}`, work: [`Jarak ke garis = ${Math.abs(h - y)} unit`, `y′ = ${fmt(Y)}, x tidak berubah`] });
};
WG.lukisHK = i => lukis(i % 2 ? 'yk' : 'xh', {});
WG.cariPaksi = i => {
  const L = vlet(), m = wri(-3, 4), d = wri(1, 4), c = wri(-3, 4);
  if (i % 2 === 0) return wq('paCari', { L, p1: P(m - d, c), p2: P(m + d, c), ans: `x = ${fmt(m)}`, work: [`Titik tengah: x = ${fmt(m)}`] });
  return wq('paCari', { L, p1: P(c, m - d), p2: P(c, m + d), ans: `y = ${fmt(m)}`, work: [`Titik tengah: y = ${fmt(m)}`] });
};
// 11.4
WG.r180 = () => {
  const L = vlet(), x = wnz(-5, 5), y = wnz(-5, 5);
  return wq('r180', { L, x, y, ans: `${L}′${P(-x, -y)}`, work: ['(x, y) → (−x, −y)'] });
};
WG.putarInfo = () => vq('putarInfo', {});
WG.lukis180 = () => lukis('r180', {});
WG.r90 = i => {
  const L = vlet(), x = wnz(-5, 5), y = wnz(-5, 5), cw = i % 2 === 0, X = cw ? y : -y, Y = cw ? -x : x;
  return wq('r90', { L, x, y, cw, X, Y, ans: `${L}′${P(X, Y)}`, work: [cw ? '(x, y) → (y, −x)' : '(x, y) → (−y, x)'] });
};
WG.lukis90 = i => lukis('r90', { cw: i % 2 === 0 });
WG.r90pusat = i => {
  const L = vlet(), h = wri(-2, 2), k = wri(-2, 2), dx = wnz(-3, 3), dy = wnz(-3, 3), cw = i % 2 === 0;
  const X = cw ? h + dy : h - dy, Y = cw ? k - dx : k + dx;
  return wq('r90p', { L, x: h + dx, y: k + dy, h, k, cw, ans: `${L}′${P(X, Y)}`, work: [`Dari pusat ke ${L}: (${fmt(dx)}, ${fmt(dy)})`, `Selepas putaran: (${fmt(X - h)}, ${fmt(Y - k)})`, `${L}′ = ${P(X, Y)}`] });
};
// 11.5
WG.panjang = () => {
  const n = wri(3, 20), t = wpick(['translasi', 'pantulan', 'putaran']), nm = wpick(LET);
  return wq('panjang', { nm, n, t, ans: `${n} cm`, work: [`${wcap(t)} ialah isometri; jarak dikekalkan.`] });
};
WG.sudut = () => {
  const d = wpick([30, 35, 42, 50, 58, 64, 72, 85, 96, 105, 118, 125]), t = wpick(['translasi', 'pantulan', 'putaran']), nm = wpick(LET);
  return wq('sudut', { nm, d, t, ans: `${d}°`, work: [`${wcap(t)} ialah isometri; saiz sudut dikekalkan.`] });
};
const SIFAT = [
  ['Dalam pantulan, titik manakah yang tidak berubah kedudukan?', 'Titik pada paksi pantulan'],
  ['Dalam putaran, titik manakah yang tidak berubah kedudukan?', 'Pusat putaran'],
  ['Transformasi isometri manakah yang menghasilkan imej terbalik (songsang sisi)?', 'Pantulan'],
  ['Nyatakan tiga maklumat yang diperlukan untuk menghuraikan satu putaran.', 'Pusat, sudut dan arah putaran'],
  ['Apakah maklumat yang diperlukan untuk menghuraikan satu translasi?', 'Vektor translasi'],
  ['Apakah maklumat yang diperlukan untuk menghuraikan satu pantulan?', 'Paksi pantulan'],
  ['Adakah imej yang dihasilkan oleh isometri sentiasa kongruen dengan objek?', 'Ya'],
  ['Dalam translasi, adakah orientasi imej sama dengan orientasi objek?', 'Ya, sama'],
  ['Dalam putaran, adakah jarak setiap titik dari pusat putaran berubah?', 'Tidak berubah']
];
WG.sifat = i => ({ q: SIFAT[i % SIFAT.length][0], ans: SIFAT[i % SIFAT.length][1], work: [] });
WG.luas = i => {
  const p = [8, 10, 7][i], l = [5, 3, 6][i], area = i !== 1, t = ['diputar 90° pada satu titik', 'dipantulkan pada satu garis', 'ditranslasikan'][i];
  return wq('luas', { p, l, t, area, ans: area ? `${p * l} cm²` : `${2 * (p + l)} cm`, work: ['Isometri: imej kongruen dengan objek.', area ? `${p} × ${l} = ${p * l} cm²` : `2 × (${p} + ${l}) = ${2 * (p + l)} cm`] });
};
// 11.6
const BENTUK = [['poly', 3, 'segi tiga sama sisi', 3], ['poly', 4, 'segi empat sama', 4], ['rect', 0, 'segi empat tepat', 2], ['poly', 5, 'pentagon sekata', 5], ['poly', 6, 'heksagon sekata', 6], ['poly', 8, 'oktagon sekata', 8], ['rhombus', 0, 'rombus', 2], ['para', 0, 'segi empat selari', 2], ['kite', 0, 'lelayang', 1], ['trap', 0, 'trapezium sama kaki', 1]];
WG.bentuk = i => {
  const o = BENTUK[i % BENTUK.length];
  return wq('bentuk', { name: o[2], ord: o[3], ans: `${o[3]}`, work: [`Bentuk kelihatan sama ${o[3]} kali dalam satu putaran lengkap.`] }, { fig: wsShape(o[0], o[1]) });
};
const HURUF1 = [['H', 2], ['N', 2], ['S', 2], ['Z', 2], ['X', 2], ['I', 2], ['A', 1], ['T', 1]];
const HURUF2 = [['L', 1], ['F', 1], ['E', 1], ['K', 1], ['M', 1], ['W', 1], ['V', 1], ['U', 1], ['Y', 1]];
const hurufWork = ord => ord === 2 ? ['Kelihatan sama selepas diputar 180°.', 'Dalam satu putaran lengkap, ia kelihatan sama 2 kali.'] : ['Huruf ini tidak kelihatan sama selepas diputar 90° atau 180°.', 'Ia hanya kelihatan sama selepas satu putaran lengkap.'];
WG.huruf = i => { const [h, ord] = HURUF1[i % HURUF1.length]; return wq('huruf', { h, ord, ans: `${ord}`, work: hurufWork(ord) }, { fig: wsShape('letter', h) }); };
WG.huruf2 = i => { const [h, ord] = HURUF2[i % HURUF2.length]; return wq('huruf', { h, ord, ans: `${ord}`, work: hurufWork(ord) }, { fig: wsShape('letter', h) }); };
WG.pilihHuruf = () => {
  const two = wshuf(['H', 'N', 'S', 'Z', 'X', 'I']).slice(0, 2), one = wshuf(['A', 'T', 'L', 'F', 'E', 'K', 'M', 'W', 'V', 'U', 'Y']).slice(0, 2);
  const list = dan(wshuf(two.concat(one))), dua = dan(two.slice().sort()), satu = dan(one.slice().sort());
  return wq('pilihHuruf', { list, dua, satu, ans: dua, work: [`${dua}: kelihatan sama selepas diputar 180° (peringkat 2).`, `${satu}: hanya kelihatan sama selepas satu putaran lengkap (peringkat 1).`] });
};
WG.poligonSudut = i => {
  const n = [5, 8, 12][i];
  return wq('poligon', { n, ans: `${360 / n}°`, work: [`Peringkat simetri putaran = ${n}`, `360° ÷ ${n} = ${360 / n}°`] });
};

/* ---------- susunan bank ---------- */
// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '11.1': [['m', 'kongruen', 6], ['m', 'objekImej', 4], ['m', 'titikImej', 5], ['m', 'istilah', 3], ['s', 'isometriFig', 5], ['s', 'isometriTeks', 4], ['k', 'panjangSudut', 3]],
  '11.2': [['m', 'imejTitik', 8], ['m', 'vektorKata', 5], ['m', 'lukisTr', 5], ['s', 'cariVektor', 4], ['s', 'cariObjek', 3], ['s', 'lukisTrNeg', 2], ['k', 'imejB', 2], ['k', 'duaTranslasi', 1]],
  '11.3': [['m', 'paksiTitik', 9], ['m', 'padaPaksi', 4], ['m', 'lukisPaksi', 5], ['s', 'garisHK', 6], ['s', 'lukisHK', 3], ['k', 'cariPaksi', 3]],
  '11.4': [['m', 'r180', 9], ['m', 'lukis180', 5], ['m', 'putarInfo', 4], ['s', 'r90', 6], ['s', 'lukis90', 3], ['k', 'r90pusat', 3]],
  '11.5': [['m', 'panjang', 10], ['m', 'sudut', 8], ['s', 'sifat', 9], ['k', 'luas', 3]],
  '11.6': [['m', 'bentuk', 10], ['m', 'huruf', 8], ['s', 'huruf2', 5], ['s', 'pilihHuruf', 4], ['k', 'poligonSudut', 3]]
};

/* ---------- penjana soalan games ---------- */
const SHAPE = [[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]]; // bentuk L (tidak simetri)
function tfm(kind) {
  for (let t = 0; t < 80; t++) {
    const ox = ri(-6, 1), oy = ri(-6, 1), o = SHAPE.map(([x, y]) => [x + ox, y + oy]);
    let im, an = { kind: 'lin' }, extra = '';
    if (kind === 'Translasi') { const a = nz(-6, 6), b = nz(-6, 6); im = o.map(([x, y]) => [x + a, y + b]); }
    else if (kind === 'Pantulan') {
      if (Math.random() < .5) { const h = ri(-2, 3); im = o.map(([x, y]) => [2 * h - x, y]); extra = gLine([h, -7], [h, 7], 'pa', .1, true); }
      else { const k = ri(-2, 3); im = o.map(([x, y]) => [x, 2 * k - y]); extra = gLine([-7, k], [7, k], 'pa', .1, true); }
    } else if (kind === 'Putaran') {
      const cx = ri(-2, 2), cy = ri(-2, 2), r = pick([90, 180, 270]);
      im = o.map(([x, y]) => { const dx = x - cx, dy = y - cy; return r === 90 ? [cx - dy, cy + dx] : r === 180 ? [cx - dx, cy - dy] : [cx + dy, cy - dx]; });
      an = { kind: 'pu', cx, cy, th: r === 270 ? -90 : r };
    } else { const cx = o[0][0], cy = o[0][1]; im = o.map(([x, y]) => [cx + 2 * (x - cx) + 3, cy + 2 * (y - cy) + 1]); }
    const all = o.concat(im);
    if (all.every(([x, y]) => x >= -7 && x <= 7 && y >= -7 && y <= 7)) {
      const bb = p => [Math.min(...p.map(q => q[0])), Math.max(...p.map(q => q[0])), Math.min(...p.map(q => q[1])), Math.max(...p.map(q => q[1]))];
      const A = bb(o), B = bb(im), overlap = !(A[1] < B[0] || B[1] < A[0] || A[3] < B[2] || B[3] < A[2]);
      if (!overlap || t > 60) return { o, im, an: Object.assign(an, { from: o, to: im, col: 'gr' }), extra };
    }
  }
  return null;
}
const GOPT4 = ['Translasi', 'Pantulan', 'Putaran', 'Bukan isometri'];
function gTap(level) {
  // soalan ketik: cari kedudukan imej titik A
  const pool = level === 0 ? ['tr', 'px', 'py'] : level === 1 ? ['tr', 'px', 'py', 'r180', 'xh', 'yk'] : ['tr', 'xh', 'yk', 'r90', 'r270', 'r180'];
  for (let k = 0; k < 60; k++) {
    const t = pick(pool), x = nz(-5, 5), y = nz(-5, 5);
    let q, T, extra = '', an = { kind: 'lin' };
    if (t === 'tr') { const a = nz(-4, 4), b = nz(-4, 4); T = [x + a, y + b]; q = `A ditranslasikan oleh ${vec(a, b)}. Ketik kedudukan imej A′.`; an = { kind: 'L' }; }
    if (t === 'px') { T = [x, -y]; q = 'A dipantulkan pada <b>paksi-x</b>. Ketik kedudukan imej A′.'; extra = gLine([-6, 0], [6, 0], 'pa', .14); }
    if (t === 'py') { T = [-x, y]; q = 'A dipantulkan pada <b>paksi-y</b>. Ketik kedudukan imej A′.'; extra = gLine([0, -6], [0, 6], 'pa', .14); }
    if (t === 'xh') { const h = nz(-3, 3); T = [2 * h - x, y]; q = `A dipantulkan pada garis <b>x = ${fmt(h)}</b>. Ketik kedudukan imej A′.`; extra = gLine([h, -6], [h, 6], 'pa', .14) + `<text x="${h + .2}" y="-5.4" font-size=".5" font-weight="700" style="fill:var(--pa)">x = ${fmt(h)}</text>`; }
    if (t === 'yk') { const kk = nz(-3, 3); T = [x, 2 * kk - y]; q = `A dipantulkan pada garis <b>y = ${fmt(kk)}</b>. Ketik kedudukan imej A′.`; extra = gLine([-6, kk], [6, kk], 'pa', .14) + `<text x="-5.8" y="${-kk - .25}" font-size=".5" font-weight="700" style="fill:var(--pa)">y = ${fmt(kk)}</text>`; }
    if (t === 'r180') { T = [-x, -y]; q = 'A diputar <b>180°</b> pada asalan O. Ketik kedudukan imej A′.'; an = { kind: 'pu', cx: 0, cy: 0, th: 180 }; }
    if (t === 'r90') { T = [y, -x]; q = 'A diputar <b>90° ikut arah jam</b> pada asalan O. Ketik kedudukan imej A′.'; an = { kind: 'pu', cx: 0, cy: 0, th: -90 }; }
    if (t === 'r270') { T = [-y, x]; q = 'A diputar <b>90° lawan arah jam</b> pada asalan O. Ketik kedudukan imej A′.'; an = { kind: 'pu', cx: 0, cy: 0, th: 90 }; }
    if (Math.abs(T[0]) > 6 || Math.abs(T[1]) > 6 || (T[0] === x && T[1] === y)) continue;
    const fig = gSvg(6, extra + gPt(x, y, 'tr', `A${P(x, y)}`) + `<g id="gTap" visibility="hidden"><circle r=".42" style="fill:none;stroke:var(--am)" stroke-width=".12"/><path d="M-.6 0H.6M0 -.6V.6" style="stroke:var(--am)" stroke-width=".1"/></g>`, 'Satah Cartes dengan titik A. Ketik untuk meletakkan imej.');
    return { type: 'tap', q, fig, target: T, anim: Object.assign(an, { from: [[x, y]], to: [T], col: 'gr' }) };
  }
  return gTap(0);
}
function gq(level) {
  const types = level === 0 ? ['kenal', 'tap', 'tap', 'simetri'] : level === 1 ? ['kenal', 'tap', 'tap', 'vektor', 'simetri'] : ['kenal', 'tap', 'tap', 'vektor', 'simetri'];
  const ty = pick(types);
  if (ty === 'tap') return gTap(level);
  if (ty === 'kenal') {
    const kinds = level === 0 ? ['Translasi', 'Pantulan', 'Putaran'] : GOPT4;
    const k = pick(kinds), r = tfm(k);
    if (!r) return gq(level);
    return { type: 'mcq', q: 'Transformasi apakah yang memetakan objek kepada imej?', fig: gSvg(7, gPoly(r.o, 'tr', false) + gPoly(r.im, 'pa', true), 'Objek biru, imej oren', false), opts: GOPT4, c: GOPT4.indexOf(k), legend: true, anim: r.an, reveal: r.extra };
  }
  if (ty === 'vektor') {
    let x, y, a, b; do { x = ri(-5, 3); y = ri(-5, 3); a = nz(-5, 5); b = nz(-5, 5); } while (Math.abs(x + a) > 6 || Math.abs(y + b) > 6);
    const cands = [[-a, -b], [b, a], [a, -b], [-a, b], [a + 1, b]];
    const seen = new Set([a + ',' + b]), wrong = [];
    for (const c of shuffle(cands)) { if (!seen.has(c.join(','))) { seen.add(c.join(',')); wrong.push(c); } if (wrong.length === 3) break; }
    const right = [a, b], opts = shuffle([right, ...wrong]);
    return { type: 'mcq', q: 'Vektor translasi yang memetakan P kepada P′?', fig: gSvg(6, gPt(x, y, 'tr', `P${P(x, y)}`) + gPt(x + a, y + b, 'pa', `P′${P(x + a, y + b)}`), 'Titik P dan P′'), opts: opts.map(p => vec(p[0], p[1])), c: opts.indexOf(right), anim: { kind: 'L', from: [[x, y]], to: [[x + a, y + b]], col: 'gr' } };
  }
  const o = pick([['poly', 3, 3], ['poly', 4, 4], ['poly', 5, 5], ['poly', 6, 6], ['rect', 0, 2], ['letter', 'S', 2], ['letter', 'Z', 2], ['letter', 'H', 2], ['letter', 'N', 2], ['letter', 'L', 1], ['letter', 'T', 1]]);
  const nums = shuffle([1, 2, 3, 4, 5, 6].filter(n => n !== o[2])).slice(0, 3).concat(o[2]).sort((p, q) => p - q);
  return { type: 'mcq', q: 'Apakah peringkat simetri putaran bagi bentuk ini?', fig: shapeSVG(o[0], o[1]).replace(/(<svg[^>]*>)([\s\S]*)<\/svg>$/, '$1<g id="gRot">$2</g></svg>'), opts: nums.map(String), c: nums.indexOf(o[2]), rot: 360 / o[2] };
}


/* ---------- soalan pilih jawapan untuk kelas ---------- */
const CQT = { kenal: 'Kenal transformasi', vektor: 'Vektor translasi', koord: 'Cari imej titik', simetri: 'Simetri putaran' };
function cqKoord(level) {
  const t = gTap(level), [X, Y] = t.target, cands = [[-X, Y], [X, -Y], [-X, -Y], [Y, X], [X + 1, Y], [X, Y - 1], [-Y, -X]];
  const seen = new Set([X + ',' + Y]), wrong = [];
  for (const c of shuffle(cands)) { const k = c.join(','); if (!seen.has(k) && Math.abs(c[0]) <= 6 && Math.abs(c[1]) <= 6) { seen.add(k); wrong.push(c); } if (wrong.length === 3) break; }
  const opts = shuffle([[X, Y], ...wrong]);
  return { type: 'mcq', q: t.q.replace(/Ketik kedudukan imej A′\./, 'Apakah koordinat imej A′?'), fig: t.fig, opts: opts.map(o => 'A′' + P(o[0], o[1])), c: opts.findIndex(o => o[0] === X && o[1] === Y), anim: t.anim };
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT));
  for (let k = 0; k < 30; k++) {
    const ty = pick(pool);
    if (ty === 'koord') return cqKoord(level);
    const q = gq(level);
    if (q.type !== 'mcq') continue;
    const isKenal = /Transformasi apakah/.test(q.q), isVek = /Vektor translasi/.test(q.q), isSim = /simetri putaran/.test(q.q);
    if ((ty === 'kenal' && isKenal) || (ty === 'vektor' && isVek) || (ty === 'simetri' && isSim)) return q;
  }
  return cqKoord(level);
}
