'use strict';
/* =================== BANK SOALAN · TINGKATAN 2 · SET 4 (format UASA, latihan pecutan) ===================
   Set 4 (27 Nov 2026): 17 A · 6 B. Diolah semula oleh Mat berdasarkan bentuk dan aras Soalan Pecutan T2 UASA 2025
   (rujukan: Downloads/Bank Soalan/SOALAN DAN JAWAPAN PECUTAN MATEMATIK TG 2 UASA 2025.docx). Soalan yang sama bentuk
   dengan Set 2 (UASA 2025) dan Set 3 (Sumatif 1) tidak diulang; Bahagian C kertas itu bertindih dengan Set 2.
   Dimuat selepas t2.js dan t2s2.js. */

const BS_S4N = (body, alt) => `<svg viewBox="0 0 120 96" width="110" role="img" aria-label="${alt}"><g fill="none" stroke="currentColor" stroke-width="1.6">${body}</g></svg>`;
const BS_S4R = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;

Object.assign(BS_FIG, {
  S4A24: `<svg viewBox="0 0 200 200" width="180" role="img" aria-label="Bulatan berpusat O dengan perentas PQ dan RS; T titik tengah PQ, U titik tengah RS">
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="2"/>
    <g stroke="currentColor" stroke-width="2"><line x1="26.2" y1="130.8" x2="173.8" y2="130.8"/><line x1="26.2" y1="69.2" x2="173.8" y2="69.2"/></g>
    <g stroke="currentColor" stroke-width="1.3" stroke-dasharray="4 3"><line x1="100" y1="100" x2="100" y2="130.8"/><line x1="100" y1="100" x2="100" y2="69.2"/></g>
    <g fill="none" stroke="currentColor" stroke-width="1"><rect x="100" y="122.8" width="8" height="8"/><rect x="100" y="69.2" width="8" height="8"/></g><circle cx="100" cy="100" r="2.5" fill="currentColor"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12" font-style="italic"><text x="12" y="140">P</text><text x="178" y="140">Q</text><text x="12" y="68">R</text><text x="178" y="68">S</text><text x="92" y="146">T</text><text x="92" y="64">U</text><text x="106" y="104">O</text></g></svg>`,
  S4A27: `<svg viewBox="0 -8 220 140" width="210" role="img" aria-label="Gambar rajah anak panah dari set P {1, 2, 3} ke set Q {a, b, c, d}: 1 ke a, 1 ke b, 2 ke c, 3 ke d">
    <g fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="45" cy="66" rx="28" ry="52"/><ellipse cx="175" cy="66" rx="28" ry="58"/></g>
    <g stroke="currentColor" stroke-width="1.3"><line x1="52" y1="36" x2="162" y2="22"/><line x1="52" y1="36" x2="162" y2="52"/><line x1="52" y1="66" x2="162" y2="82"/><line x1="52" y1="96" x2="162" y2="110"/></g>
    <g fill="currentColor"><path d="M162 18 L170 21 L163 26Z"/><path d="M161 48 L169 53 L161 56Z"/><path d="M161 78 L169 83 L161 86Z"/><path d="M161 106 L169 111 L161 114Z"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="13" text-anchor="middle"><text x="40" y="40">1</text><text x="40" y="70">2</text><text x="40" y="100">3</text>
    <text x="180" y="26">a</text><text x="180" y="56">b</text><text x="180" y="86">c</text><text x="180" y="114">d</text><text x="45" y="10" font-style="italic">P</text><text x="175" y="6" font-style="italic">Q</text></g></svg>`,
  S4A32: `<svg viewBox="0 0 200 200" width="170" role="img" aria-label="Bulatan berpusat O dengan perentas PQ; garis TS melalui O dan berserenjang dengan PQ">
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="2"/><line x1="36" y1="148" x2="164" y2="148" stroke="currentColor" stroke-width="2"/>
    <line x1="100" y1="148" x2="100" y2="20" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 3"/><rect x="100" y="140" width="8" height="8" fill="none" stroke="currentColor"/><circle cx="100" cy="100" r="2.5" fill="currentColor"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12" font-style="italic"><text x="22" y="160">P</text><text x="168" y="160">Q</text><text x="96" y="164">T</text><text x="96" y="14">S</text><text x="106" y="104">O</text></g></svg>`,
  S4A36: bsGrid({ x: [-1, 6], y: [-1, 6], poly: [{ p: [[1, 3], [1, 5], [2, 3]], l: 'M', at: [1.3, 3.5] }, { p: [[3, 1], [5, 1], [3, 2]], l: 'M′', at: [3.4, 1.3] }], alt: 'Bentuk M dan imejnya M′' }),
  S4B01: (() => {
    const c = 60, r = 48, pts = [...Array(9)].map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 9; return (c + r * Math.cos(a)).toFixed(1) + ',' + (c + r * Math.sin(a)).toFixed(1); }).join(' ');
    return `<svg viewBox="0 0 120 120" width="110" role="img" aria-label="Sebuah poligon sekata dengan sembilan sisi"><polygon points="${pts}" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="2"/></svg>`;
  })()
});

BS_T2.push(
  // ---------------- SET 4 · BAHAGIAN A ----------------
  { id: 'T2S4-A01', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'S', why: 'Gantian ke dalam rumus berkuasa dua', m: 1,
    q: 'Diberi 4<i>m</i> = FR(<i>n</i>² − 1|2). Hitung nilai <i>m</i> apabila <i>n</i> = 5.', qe: 'Given 4<i>m</i> = FR(<i>n</i>² − 1|2). Calculate the value of <i>m</i> when <i>n</i> = 5.',
    pil: ['2', '3', '6', '12'], jaw: 'B', sk: '4<i>m</i> = FR(24|2) = 12 → <i>m</i> = 3' },
  { id: 'T2S4-A02', bhg: 'A', bab: 5, kon: 'Menilai', aras: 'T', kbat: true, why: 'Sifat perentas sama panjang dan teorem Pythagoras', m: 1, fig: 'S4A24',
    q: 'Rajah menunjukkan sebuah bulatan berpusat <i>O</i>. Diberi panjang perentas <i>PQ</i> = panjang perentas <i>RS</i>, <i>OT</i> = 5 cm dan <i>QT</i> = 12 cm. Antara berikut, yang manakah <b>tidak benar</b>?',
    qe: 'The diagram shows a circle with centre <i>O</i>. Given the length of chord <i>PQ</i> = the length of chord <i>RS</i>, <i>OT</i> = 5 cm and <i>QT</i> = 12 cm. Which of the following is <b>not true</b>?',
    pil: ['Panjang <i>OU</i> = 5 cm', 'Luas tembereng minor <i>PTQ</i> lebih besar daripada luas tembereng minor <i>RUS</i>', 'Panjang <i>RS</i> = 24 cm', 'Diameter bulatan = 26 cm'],
    pe: ['Length of <i>OU</i> = 5 cm', 'The area of minor segment <i>PTQ</i> is greater than the area of minor segment <i>RUS</i>', 'Length of <i>RS</i> = 24 cm', 'Diameter of the circle = 26 cm'],
    jaw: 'B', sk: 'Perentas sama panjang → sama jarak dari pusat dan tembereng sama luas<br>Jejari = RT(5² + 12²) = 13 cm' },
  { id: 'T2S4-A03', bhg: 'A', bab: 6, kon: 'Memahami', aras: 'R', why: 'Kenal pasti bentangan piramid', m: 1,
    q: 'Antara berikut, yang manakah bentangan bagi sebuah piramid tegak bertapak segi empat sama?', qe: 'Which of the following is the net of a right pyramid with a square base?',
    pil: [BS_S4N([[44, 2], [2, 30], [30, 30], [58, 30], [86, 30], [44, 58]].map(([x, y]) => BS_S4R(x, y, 28, 28)).join(''), 'Bentangan kubus'),
      BS_S4N('<rect x="42" y="30" width="34" height="34"/><polygon points="42,30 76,30 59,2"/><polygon points="42,64 76,64 59,94"/><polygon points="42,30 42,64 12,47"/><polygon points="76,30 76,64 106,47"/>', 'Bentangan piramid'),
      BS_S4N('<rect x="8" y="30" width="34" height="34"/><rect x="42" y="30" width="34" height="34"/><rect x="76" y="30" width="34" height="34"/><polygon points="42,30 76,30 59,6"/><polygon points="42,64 76,64 59,88"/>', 'Bentangan prisma segi tiga'),
      BS_S4N('<path d="M60 8 L20 56 A52 52 0 0 0 100 56 Z"/><circle cx="60" cy="76" r="18"/>', 'Bentangan kon')],
    jaw: 'B', sk: 'Satu tapak segi empat sama dengan empat segi tiga' },
  { id: 'T2S4-A04', bhg: 'A', bab: 7, kon: 'Menganalisis', aras: 'S', why: 'Dua kemungkinan titik pada jarak yang sama', m: 1,
    q: 'Diberi koordinat titik <i>P</i>(−3, 5) dan <i>Q</i>(<i>a</i>, 5). Jarak <i>PQ</i> ialah 7 unit. Antara berikut, yang manakah nilai yang mungkin bagi <i>a</i>?<br>I &nbsp;−10 &nbsp;&nbsp; II &nbsp;−4 &nbsp;&nbsp; III &nbsp;4 &nbsp;&nbsp; IV &nbsp;10',
    qe: 'Given the coordinates of points <i>P</i>(−3, 5) and <i>Q</i>(<i>a</i>, 5). The distance <i>PQ</i> is 7 units. Which of the following are the possible values of <i>a</i>?<br>I &nbsp;−10 &nbsp;&nbsp; II &nbsp;−4 &nbsp;&nbsp; III &nbsp;4 &nbsp;&nbsp; IV &nbsp;10',
    pil: ['I dan II', 'I dan III', 'II dan IV', 'III dan IV'], pe: ['I and II', 'I and III', 'II and IV', 'III and IV'], jaw: 'B', sk: '<i>a</i> = −3 + 7 = 4 atau <i>a</i> = −3 − 7 = −10' },
  { id: 'T2S4-A05', bhg: 'A', bab: 8, kon: 'Memahami', aras: 'R', why: 'Jenis hubungan daripada gambar rajah anak panah', m: 1, fig: 'S4A27',
    q: 'Rajah menunjukkan hubungan antara set <i>P</i> dan set <i>Q</i>. Apakah jenis hubungan itu?', qe: 'The diagram shows the relation between set <i>P</i> and set <i>Q</i>. What is the type of the relation?',
    pil: ['Satu kepada satu', 'Satu kepada banyak', 'Banyak kepada satu', 'Banyak kepada banyak'], pe: ['One-to-one', 'One-to-many', 'Many-to-one', 'Many-to-many'], jaw: 'B',
    sk: 'Unsur 1 dipetakan kepada dua imej (<i>a</i> dan <i>b</i>)' },
  { id: 'T2S4-A06', bhg: 'A', bab: 11, kon: 'Mengingat', aras: 'R', why: 'Ciri objek yang kongruen', m: 1,
    q: 'Objek <i>A</i> dan objek <i>B</i> adalah kongruen. Apakah ciri-ciri objek <i>A</i> dan <i>B</i>?', qe: 'Objects <i>A</i> and <i>B</i> are congruent. What are the characteristics of objects <i>A</i> and <i>B</i>?',
    pil: ['Bentuk sama tetapi saiz berbeza', 'Bentuk dan saiz yang sama', 'Bentuk dan saiz yang berbeza', 'Saiz sama tetapi bentuk berbeza'], pe: ['Same shape but different size', 'Same shape and size', 'Different shape and size', 'Same size but different shape'], jaw: 'B' },
  { id: 'T2S4-A07', bhg: 'A', bab: 13, kon: 'Mengaplikasi', aras: 'S', why: 'Kebarangkalian eksperimen daripada kekerapan', m: 1,
    q: 'Aiman memutar sebuah roda bernombor 1 hingga 6 sebanyak 25 kali. Dia memperoleh nombor 1 sebanyak 4 kali, nombor 2 sebanyak 6 kali, nombor 3 sebanyak 5 kali, nombor 4 sebanyak 3 kali, nombor 5 sebanyak 2 kali dan nombor 6 sebanyak 5 kali. Cari kebarangkalian Aiman memperoleh nombor genap.',
    qe: 'Aiman spins a wheel numbered 1 to 6 25 times. He obtains the number 1 four times, 2 six times, 3 five times, 4 three times, 5 twice and 6 five times. Find the probability that Aiman obtains an even number.',
    pil: ['FR(11|25)', 'FR(14|25)', 'FR(1|2)', 'FR(3|5)'], jaw: 'B', sk: 'FR(6 + 3 + 5|25) = FR(14|25)' },
  { id: 'T2S4-A08', bhg: 'A', bab: 13, kon: 'Mengaplikasi', aras: 'S', why: 'Gabung dua kumpulan, kemudian kebarangkalian', m: 1,
    q: 'Kotak <i>P</i> mengandungi kad berhuruf A, I, R dan S. Kotak <i>Q</i> mengandungi kad berhuruf E, T, U, N dan M. Semua kad itu dimasukkan ke dalam sebuah beg. Sekeping kad dipilih secara rawak dari beg itu. Hitung kebarangkalian kad yang dipilih ialah huruf vokal.',
    qe: 'Box <i>P</i> contains cards with the letters A, I, R and S. Box <i>Q</i> contains cards with the letters E, T, U, N and M. All the cards are put into a bag. A card is chosen at random from the bag. Calculate the probability that the chosen card is a vowel.',
    pil: ['FR(1|3)', 'FR(4|9)', 'FR(5|9)', 'FR(2|3)'], jaw: 'B', sk: 'Vokal: A, I, E, U → FR(4|9)' },
  { id: 'T2S4-A09', bhg: 'A', bab: 2, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Bahagi ungkapan kuadratik dengan memfaktorkan', m: 1,
    q: 'Farah mempunyai wang sebanyak RM(2<i>c</i>² + 7<i>c</i> − 15). Dia menggunakan semua wangnya untuk membeli (<i>c</i> + 5) buah buku yang sama harga. Berapakah harga sebuah buku itu?',
    qe: 'Farah has RM(2<i>c</i>² + 7<i>c</i> − 15). She uses all her money to buy (<i>c</i> + 5) books of the same price. What is the price of one book?',
    pil: ['RM(2<i>c</i> + 3)', 'RM(2<i>c</i> − 3)', 'RM(<i>c</i> − 3)', 'RM(2<i>c</i> − 5)'], jaw: 'B', sk: '2<i>c</i>² + 7<i>c</i> − 15 = (2<i>c</i> − 3)(<i>c</i> + 5)' },
  { id: 'T2S4-A10', bhg: 'A', bab: 5, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Jarak perentas dari pusat, kemudian panjang segmen', m: 1, fig: 'S4A32',
    q: 'Rajah menunjukkan sebuah bulatan berpusat <i>O</i> dengan perentas <i>PQ</i> = 16 cm dan diameter 20 cm. Hitung panjang <i>TS</i>, dalam cm.',
    qe: 'The diagram shows a circle with centre <i>O</i>, chord <i>PQ</i> = 16 cm and diameter 20 cm. Calculate the length of <i>TS</i>, in cm.',
    pil: ['14', '16', '18', '20'], jaw: 'B', sk: '<i>OT</i> = RT(10² − 8²) = 6 cm<br><i>TS</i> = 6 + 10 = 16 cm' },
  { id: 'T2S4-A11', bhg: 'A', bab: 10, kon: 'Mengaplikasi', aras: 'S', why: 'Pintasan-x daripada kecerunan dan pintasan-y', m: 1,
    q: 'Garis lurus <i>QR</i> melalui titik <i>Q</i>(0, 6) dan titik <i>R</i> yang terletak pada paksi-<i>x</i>. Kecerunan <i>QR</i> ialah −FR(3|4). Cari koordinat titik <i>R</i>.',
    qe: 'The straight line <i>QR</i> passes through point <i>Q</i>(0, 6) and point <i>R</i> which lies on the <i>x</i>-axis. The gradient of <i>QR</i> is −FR(3|4). Find the coordinates of point <i>R</i>.',
    pil: ['(6, 0)', '(8, 0)', '(9, 0)', '(10, 0)'], jaw: 'B', sk: 'FR(0 − 6|<i>x</i> − 0) = −FR(3|4) → <i>x</i> = 8' },
  { id: 'T2S4-A12', bhg: 'A', bab: 11, kon: 'Mengaplikasi', aras: 'S', why: 'Cari objek daripada imej di bawah translasi', m: 1,
    q: 'Titik <i>P</i>(−1, 4) dipetakan kepada <i>P′</i>(3, −2) di bawah suatu translasi. Apakah koordinat objek bagi <i>Q′</i>(2, 5) di bawah translasi yang sama?',
    qe: 'Point <i>P</i>(−1, 4) is mapped onto <i>P′</i>(3, −2) under a translation. What are the coordinates of the object of <i>Q′</i>(2, 5) under the same translation?',
    pil: ['(−2, 11)', '(6, −1)', '(2, 11)', '(−2, −1)'], jaw: 'A', sk: 'Translasi VC(4|−6); objek = (2 − 4, 5 + 6) = (−2, 11)' },
  { id: 'T2S4-A13', bhg: 'A', bab: 11, kon: 'Menganalisis', aras: 'S', why: 'Kenal pasti transformasi daripada rajah', m: 1, fig: 'S4A36',
    q: 'Rajah menunjukkan bentuk <i>M′</i> ialah imej bagi bentuk <i>M</i> di bawah suatu transformasi. Antara berikut, yang manakah transformasi itu?',
    qe: 'The diagram shows that shape <i>M′</i> is the image of shape <i>M</i> under a transformation. Which of the following is the transformation?',
    pil: ['Translasi', 'Pantulan pada paksi-<i>x</i>', 'Putaran 90° ikut arah jam pada asalan', 'Pantulan pada garis <i>y</i> = <i>x</i>'],
    pe: ['Translation', 'Reflection in the <i>x</i>-axis', 'Rotation of 90° clockwise about the origin', 'Reflection in the line <i>y</i> = <i>x</i>'], jaw: 'D', sk: '(1, 3) → (3, 1), (1, 5) → (5, 1), (2, 3) → (3, 2): koordinat bertukar tempat' },
  { id: 'T2S4-A14', bhg: 'A', bab: 4, kon: 'Menganalisis', aras: 'S', why: 'Hubungan sudut pedalaman dan peluaran', m: 1,
    q: 'Sudut pedalaman sebuah poligon sekata ialah 5 kali sudut peluarannya. Berapakah bilangan sisi poligon itu?', qe: 'The interior angle of a regular polygon is 5 times its exterior angle. How many sides does the polygon have?',
    pil: ['10', '12', '15', '18'], jaw: 'B', sk: '6 × sudut peluaran = 180° → sudut peluaran = 30° → FR(360°|30°) = 12' },
  { id: 'T2S4-A15', bhg: 'A', bab: 7, kon: 'Mengaplikasi', aras: 'S', why: 'Tentukan koordinat daripada huraian, kemudian titik tengah', m: 1,
    q: 'Titik <i>J</i> berada pada paksi-<i>y</i>, 6 unit di atas paksi-<i>x</i>. Titik <i>K</i> berada pada paksi-<i>x</i>, 14 unit di sebelah kanan paksi-<i>y</i>. Cari titik tengah bagi garis lurus <i>JK</i>.',
    qe: 'Point <i>J</i> is on the <i>y</i>-axis, 6 units above the <i>x</i>-axis. Point <i>K</i> is on the <i>x</i>-axis, 14 units to the right of the <i>y</i>-axis. Find the midpoint of the straight line <i>JK</i>.',
    pil: ['(7, 3)', '(3, 7)', '(−7, 3)', '(7, −3)'], jaw: 'A', sk: '<i>J</i>(0, 6), <i>K</i>(14, 0) → (7, 3)' },
  { id: 'T2S4-A16', bhg: 'A', bab: 9, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Nyahpecutan dengan unit km/j per saat dan peratus', m: 1,
    q: 'Sebuah kereta bergerak dengan laju 80 km/j. Kereta itu memperlahankan lajunya selama 1.5 minit dengan nyahpecutan 0.4 km/j per saat. Berapakah peratus pengurangan laju kereta itu?',
    qe: 'A car travels at 80 km/h. The car slows down for 1.5 minutes with a deceleration of 0.4 km/h per second. What is the percentage decrease in the speed of the car?',
    pil: ['36%', '40%', '45%', '55%'], jaw: 'C', sk: '1.5 minit = 90 s → pengurangan = 0.4 × 90 = 36 km/j<br>FR(36|80) × 100% = 45%' },
  { id: 'T2S4-A17', bhg: 'A', bab: 11, kon: 'Menganalisis', aras: 'S', why: 'Cari objek daripada imej putaran', m: 1,
    q: 'Titik <i>Q′</i>(4, −1) ialah imej bagi titik <i>Q</i> di bawah putaran 90° ikut arah jam pada asalan. Cari koordinat titik <i>Q</i>.',
    qe: 'Point <i>Q′</i>(4, −1) is the image of point <i>Q</i> under a rotation of 90° clockwise about the origin. Find the coordinates of point <i>Q</i>.',
    pil: ['(1, 4)', '(−1, −4)', '(−4, 1)', '(4, 1)'], jaw: 'A', sk: 'Putar <i>Q′</i> 90° lawan arah jam pada asalan: (4, −1) → (1, 4)' },

  // ---------------- SET 4 · BAHAGIAN B ----------------
  { id: 'T2S4-B01', bhg: 'B', bab: 4, babs: [2, 4], parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Mengaplikasi', fig: 'S4B01', q: 'Rajah menunjukkan sebuah poligon sekata. Bulatkan jawapan yang betul.', qe: 'The diagram shows a regular polygon. Circle the correct answers.',
      items: [{ t: 'Nama poligon: CH(Oktagon|Nonagon|Dekagon)', te: 'Name of polygon: CH(Octagon|Nonagon|Decagon)', a: 'Nonagon' }, { t: 'Sudut peluaran: CH(36°|40°|45°)', te: 'Exterior angle: CH(36°|40°|45°)', a: '40°' }] },
    { l: '(b)', jenis: 'tanda', m: 2, aras: 'R', kon: 'Memahami', q: 'Tandakan (✓) bagi <b>dua</b> faktor sepunya bagi sebutan 20<i>k</i>² dan 30<i>k</i>.', qe: 'Tick (✓) the <b>two</b> common factors of the terms 20<i>k</i>² and 30<i>k</i>.',
      items: [{ t: '5<i>k</i>', a: '✓' }, { t: '3<i>k</i>', a: '' }, { t: '10<i>k</i>', a: '✓' }, { t: '2<i>k</i>²', a: '' }] }] },
  { id: 'T2S4-B02', bhg: 'B', bab: 11, parts: [
    { l: '', jenis: 'pad', m: 4, aras: 'S', kon: 'Menganalisis', q: 'Padankan setiap maklumat dengan koordinat titik <i>P</i> yang betul.', qe: 'Match each piece of information with the correct coordinates of point <i>P</i>.',
      items: [{ t: '<i>P</i> ialah imej bagi (3, −4) di bawah putaran 180° pada asalan.', te: '<i>P</i> is the image of (3, −4) under a rotation of 180° about the origin.', a: '(−3, 4)' },
        { t: '<i>P</i> ialah imej bagi (−2, 5) di bawah pantulan pada paksi-<i>x</i>.', te: '<i>P</i> is the image of (−2, 5) under a reflection in the <i>x</i>-axis.', a: '(−2, −5)' },
        { t: 'Imej bagi <i>P</i> di bawah translasi VC(4|−1) ialah (2, 2).', te: 'The image of <i>P</i> under the translation VC(4|−1) is (2, 2).', a: '(−2, 3)' },
        { t: 'Imej bagi <i>P</i> di bawah putaran 90° lawan arah jam pada asalan ialah (3, 5).', te: 'The image of <i>P</i> under a rotation of 90° anticlockwise about the origin is (3, 5).', a: '(5, −3)' }],
      kanan: ['(−2, 3)', '(5, −3)', '(−3, 4)', '(−2, −5)'] }] },
  { id: 'T2S4-B03', bhg: 'B', bab: 6, babs: [6, 10], parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Sebuah silinder tertutup mempunyai diameter 7 cm dan isi padu 462 cm³. Bulatkan jawapan yang betul. (Guna π = FR(22|7))', qe: 'A closed cylinder has a diameter of 7 cm and a volume of 462 cm³. Circle the correct answers. (Use π = FR(22|7))',
      items: [{ t: 'Tinggi silinder: CH(10 cm|12 cm|14 cm)', te: 'Height of the cylinder', a: '12 cm' }, { t: 'Jumlah luas permukaan: CH(264 cm²|341 cm²|418 cm²)', te: 'Total surface area', a: '341 cm²' }],
      sk: '<i>t</i> = 462 ÷ (FR(22|7) × 3.5²) = 12; 2 × 38.5 + 22 × 12 = 341' },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Isi tempat kosong.', qe: 'Fill in the blanks.',
      items: [{ t: 'Garis lurus berkecerunan −FR(4|5) dengan pintasan-<i>y</i> 12. Pintasan-<i>x</i> = __________', te: 'A straight line with a gradient of −FR(4|5) and a <i>y</i>-intercept of 12. The <i>x</i>-intercept = __________', a: '15' },
        { t: 'Garis lurus berkecerunan −FR(3|2) dengan pintasan-<i>x</i> 6. Pintasan-<i>y</i> = __________', te: 'A straight line with a gradient of −FR(3|2) and an <i>x</i>-intercept of 6. The <i>y</i>-intercept = __________', a: '9' }] }] },
  { id: 'T2S4-B04', bhg: 'B', bab: 1, babs: [1, 12], parts: [
    { l: '(a)', jenis: 'bp', m: 2, aras: 'S', kon: 'Menganalisis', q: 'Diberi jujukan nombor −11, −5, 1, 7, … Tulis <b>Benar</b> atau <b>Palsu</b> bagi setiap pernyataan.', qe: 'Given the number sequence −11, −5, 1, 7, … Write <b>True</b> or <b>False</b> for each statement.',
      items: [{ t: 'Sebutan ke-6 ialah 19.', te: 'The 6th term is 19.', a: 'Benar' }, { t: 'Hasil tambah sebutan ke-4 hingga ke-7 ialah 70.', te: 'The sum of the 4th to the 7th terms is 70.', a: 'Palsu' }],
      sk: 'Sebutan ke-4 hingga ke-7: 7, 13, 19, 25 → hasil tambah 64' },
    { l: '(b)', jenis: 'bulat', m: 2, aras: 'S', kon: 'Menilai', q: 'Bulatkan sukatan kecenderungan memusat yang paling sesuai bagi setiap set data.', qe: 'Circle the most suitable measure of central tendency for each set of data.',
      items: [{ t: 'Warna kegemaran 30 orang murid: CH(Mod|Median|Min)', te: 'Favourite colours of 30 pupils', a: 'Mod' },
        { t: 'Gaji bulanan (RM): 1 800, 2 000, 2 100, 2 200, 15 000: CH(Mod|Median|Min)', te: 'Monthly salary (RM): 1 800, 2 000, 2 100, 2 200, 15 000', a: 'Median' }] }] },
  { id: 'T2S4-B05', bhg: 'B', bab: 2, parts: [
    { l: '', jenis: 'pad', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Padankan setiap ungkapan dengan pemfaktorannya yang betul.', qe: 'Match each expression with its correct factorisation.',
      items: [{ t: '<i>x</i>² + 7<i>x</i> + 12', a: '(<i>x</i> + 3)(<i>x</i> + 4)' }, { t: '<i>x</i>² − <i>x</i> − 12', a: '(<i>x</i> − 4)(<i>x</i> + 3)' },
        { t: '<i>x</i>² + <i>x</i> − 12', a: '(<i>x</i> + 4)(<i>x</i> − 3)' }, { t: '<i>x</i>² − 7<i>x</i> + 12', a: '(<i>x</i> − 3)(<i>x</i> − 4)' }],
      kanan: ['(<i>x</i> + 4)(<i>x</i> − 3)', '(<i>x</i> − 3)(<i>x</i> − 4)', '(<i>x</i> − 4)(<i>x</i> + 3)', '(<i>x</i> + 3)(<i>x</i> + 4)'] }] },
  { id: 'T2S4-B06', bhg: 'B', bab: 8, babs: [7, 8], parts: [
    { l: '(a)', jenis: 'tanda', m: 2, aras: 'R', kon: 'Memahami', q: 'Suatu hubungan memetakan set <i>A</i> = {2, 5, 7} kepada set <i>B</i> dengan peraturan "darab 3". Tandakan (✓) bagi <b>dua</b> pernyataan yang betul.',
      qe: 'A relation maps set <i>A</i> = {2, 5, 7} to set <i>B</i> with the rule "multiply by 3". Tick (✓) the <b>two</b> correct statements.',
      items: [{ t: 'Julat = {6, 15, 21}', te: 'Range = {6, 15, 21}', a: '✓' }, { t: 'Julat = {2, 5, 7}', te: 'Range = {2, 5, 7}', a: '' },
        { t: 'Pasangan tertib = {(2, 6), (5, 15), (7, 21)}', te: 'Ordered pairs = {(2, 6), (5, 15), (7, 21)}', a: '✓' }, { t: 'Pasangan tertib = {(6, 2), (15, 5), (21, 7)}', te: 'Ordered pairs = {(6, 2), (15, 5), (21, 7)}', a: '' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'T', kon: 'Menganalisis', q: 'Garis lurus <i>AB</i> selari dengan paksi-<i>x</i> dan terletak 8 unit di atas garis <i>y</i> = −2. Titik <i>A</i> berada 6 unit di sebelah kiri paksi-<i>y</i>. Panjang <i>AB</i> ialah 13 unit dan <i>B</i> terletak di sebelah kanan <i>A</i>. Tulis koordinat titik <i>A</i> dan <i>B</i>.',
      qe: 'The straight line <i>AB</i> is parallel to the <i>x</i>-axis and lies 8 units above the line <i>y</i> = −2. Point <i>A</i> is 6 units to the left of the <i>y</i>-axis. The length of <i>AB</i> is 13 units and <i>B</i> is to the right of <i>A</i>. Write the coordinates of points <i>A</i> and <i>B</i>.',
      items: [{ t: '<i>A</i> = __________', a: '(−6, 6)' }, { t: '<i>B</i> = __________', a: '(7, 6)' }] }] }
);
