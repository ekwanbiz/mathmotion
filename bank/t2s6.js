'use strict';
/* =================== BANK SOALAN · TINGKATAN 2 · SET 6 (format UPSA, Bab 1–6) ===================
   Set 6 (27 Nov 2026): 16 A · 5 B · 6 C. Diolah semula oleh Mat berdasarkan bentuk dan aras UPSA Set 2
   (rujukan: Downloads/Bank Soalan/UPSA Set 2.docx). Soalan yang sama bentuk dengan set terdahulu tidak diulang;
   soalan lukis / bina diganti dengan soalan bertulis pada konsep yang sama. Dimuat selepas t2s5.js (guna BS_S5T). */

Object.assign(BS_FIG, {
  S6A06: `<svg viewBox="0 0 200 200" width="170" role="img" aria-label="Bulatan berpusat O dengan dua perentas selari PQ dan RS yang sama panjang; V dan T titik tengah perentas">
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="2"/>
    <g stroke="currentColor" stroke-width="2"><line x1="29.4" y1="62.4" x2="170.6" y2="62.4"/><line x1="29.4" y1="137.6" x2="170.6" y2="137.6"/></g>
    <line x1="100" y1="62.4" x2="100" y2="137.6" stroke="currentColor" stroke-width="1.3" stroke-dasharray="4 3"/><circle cx="100" cy="100" r="2.5" fill="currentColor"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12">${BS_S5T(14, 60, 'P')}${BS_S5T(176, 60, 'Q')}${BS_S5T(14, 148, 'S')}${BS_S5T(176, 148, 'R')}${BS_S5T(104, 56, 'V')}${BS_S5T(104, 152, 'T')}${BS_S5T(106, 104, 'O')}</g></svg>`,
  S6A11: `<svg viewBox="0 0 200 120" width="190" role="img" aria-label="Segi empat sama PQRS bersisi 7 cm dan sukuan bulatan QRT berpusat Q di sebelah kanan">
    <g fill="none" stroke="currentColor" stroke-width="2"><rect x="20" y="15" width="90" height="90"/><path d="M110 105 A90 90 0 0 0 200 15" transform="translate(-0 0)"/><line x1="110" y1="15" x2="200" y2="15"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12">${BS_S5T(8, 14, 'P')}${BS_S5T(104, 11, 'Q')}${BS_S5T(104, 118, 'R')}${BS_S5T(8, 118, 'S')}${BS_S5T(190, 30, 'T')}<text x="54" y="11">7 cm</text></g></svg>`,
  S6B05: `<svg viewBox="0 0 250 80" width="240" role="img" aria-label="Empat bulatan yang sama saiz bersebelahan di atas sekeping kertas segi empat tepat">
    <rect x="5" y="10" width="240" height="60" fill="none" stroke="currentColor" stroke-width="2"/>
    <g fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="1.8">${[35, 95, 155, 215].map(x => `<circle cx="${x}" cy="40" r="30"/>`).join('')}</g></svg>`,
  S6C05: `<svg viewBox="0 0 200 200" width="170" role="img" aria-label="Keratan rentas paip berbentuk bulatan berpusat O; permukaan air awal AB dan permukaan air baharu CD, kedua-duanya di bawah pusat">
    <path d="M23.2 122.4 A80 80 0 0 0 176.8 122.4 Z" fill="currentColor" fill-opacity=".18"/><path d="M52 164 A80 80 0 0 0 148 164 Z" fill="currentColor" fill-opacity=".25"/>
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="2"/>
    <g stroke="currentColor" stroke-width="1.8"><line x1="52" y1="164" x2="148" y2="164"/><line x1="23.2" y1="122.4" x2="176.8" y2="122.4"/></g><circle cx="100" cy="100" r="2.5" fill="currentColor"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12">${BS_S5T(38, 176, 'A')}${BS_S5T(152, 176, 'B')}${BS_S5T(8, 126, 'C')}${BS_S5T(182, 126, 'D')}${BS_S5T(106, 98, 'O')}</g></svg>`
});

BS_T2.push(
  // ---------------- SET 6 · BAHAGIAN A ----------------
  { id: 'T2S6-A01', bhg: 'A', bab: 2, kon: 'Menganalisis', aras: 'S', why: 'Bandingkan FSTB beberapa kumpulan sebutan', m: 1,
    q: 'Antara berikut, kumpulan sebutan yang manakah mempunyai faktor sepunya terbesar 3<i>pq</i>²?', qe: 'Which of the following groups of terms has a highest common factor of 3<i>pq</i>²?',
    pil: ['3<i>pq</i>², 9<i>p</i>²<i>q</i>', '6<i>pq</i>², 9<i>p</i>²<i>q</i>²', '3<i>p</i>²<i>q</i>², 12<i>pq</i>', '6<i>pq</i>², 12<i>pq</i>²'], jaw: 'B',
    sk: 'FSTB(6, 9) = 3; kuasa terendah <i>p</i> ialah 1, <i>q</i> ialah 2 → 3<i>pq</i>²' },
  { id: 'T2S6-A02', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'S', why: 'Tambah pecahan algebra berpenyebut berbeza', m: 1,
    q: 'FR(3|2<i>a</i>) + FR(<i>a</i> − 1|4<i>a</i>) =', qe: 'FR(3|2<i>a</i>) + FR(<i>a</i> − 1|4<i>a</i>) =',
    pil: ['FR(<i>a</i> + 5|4<i>a</i>)', 'FR(<i>a</i> + 2|6<i>a</i>)', 'FR(<i>a</i> + 2|4<i>a</i>)', 'FR(<i>a</i> + 5|8<i>a</i>²)'], jaw: 'A', sk: 'FR(6 + <i>a</i> − 1|4<i>a</i>) = FR(<i>a</i> + 5|4<i>a</i>)' },
  { id: 'T2S6-A03', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'S', why: 'Tukar perkara rumus yang melibatkan pecahan', m: 1,
    q: 'Diberi FR(2<i>x</i> − <i>y</i>|3) = <i>z</i>, maka <i>x</i> =', qe: 'Given FR(2<i>x</i> − <i>y</i>|3) = <i>z</i>, then <i>x</i> =',
    pil: ['FR(3<i>z</i> + <i>y</i>|2)', 'FR(3<i>z</i> − <i>y</i>|2)', 'FR(<i>z</i> + <i>y</i>|6)', '3<i>z</i> + FR(<i>y</i>|2)'], jaw: 'A', sk: '2<i>x</i> − <i>y</i> = 3<i>z</i> → <i>x</i> = FR(3<i>z</i> + <i>y</i>|2)' },
  { id: 'T2S6-A04', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'S', why: 'Bentuk rumus daripada luas', m: 1,
    q: 'Sebuah segi empat tepat mempunyai lebar <i>x</i> cm dan panjang (<i>y</i> − 2) cm. Luas segi empat tepat itu ialah 20 cm². Ungkapkan <i>y</i> dalam sebutan <i>x</i>.',
    qe: 'A rectangle has a width of <i>x</i> cm and a length of (<i>y</i> − 2) cm. The area of the rectangle is 20 cm². Express <i>y</i> in terms of <i>x</i>.',
    pil: ['<i>y</i> = 20<i>x</i> + 2', '<i>y</i> = FR(20|<i>x</i>) − 2', '<i>y</i> = FR(20|<i>x</i>) + 2', '<i>y</i> = FR(22|<i>x</i>)'], jaw: 'C', sk: '<i>x</i>(<i>y</i> − 2) = 20 → <i>y</i> = FR(20|<i>x</i>) + 2' },
  { id: 'T2S6-A05', bhg: 'A', bab: 4, kon: 'Menilai', aras: 'S', why: 'Hasil tambah sudut pedalaman dan peluaran heksagon', m: 1,
    q: 'Sebuah heksagon mempunyai sudut peluaran <i>a</i>, <i>b</i>, <i>c</i>, <i>d</i>, <i>e</i>, <i>f</i> dan sudut pedalaman sepadan <i>j</i>, <i>k</i>, <i>l</i>, <i>m</i>, <i>n</i>, <i>p</i>. Antara berikut, yang manakah <b>tidak benar</b>?',
    qe: 'A hexagon has exterior angles <i>a</i>, <i>b</i>, <i>c</i>, <i>d</i>, <i>e</i>, <i>f</i> and corresponding interior angles <i>j</i>, <i>k</i>, <i>l</i>, <i>m</i>, <i>n</i>, <i>p</i>. Which of the following is <b>not true</b>?',
    pil: ['<i>a</i> + <i>b</i> + <i>c</i> + <i>d</i> + <i>e</i> + <i>f</i> = 360°', '<i>j</i> + <i>k</i> + <i>l</i> + <i>m</i> + <i>n</i> + <i>p</i> = 720°', '<i>a</i> + <i>j</i> = 180°', '<i>a</i> + <i>b</i> + <i>c</i> + <i>d</i> + <i>e</i> + <i>f</i> = <i>j</i> + <i>k</i> + <i>l</i> + <i>m</i> + <i>n</i> + <i>p</i>'],
    jaw: 'D', sk: 'Hasil tambah sudut peluaran 360° tetapi sudut pedalaman 720°' },
  { id: 'T2S6-A06', bhg: 'A', bab: 5, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Perentas sama panjang sama jarak dari pusat', m: 1, fig: 'S6A06',
    q: 'Rajah menunjukkan sebuah bulatan berpusat <i>O</i>. Perentas <i>PQ</i> dan <i>RS</i> selari dan sama panjang, iaitu 30 cm. Jejari bulatan ialah 17 cm. <i>V</i> dan <i>T</i> ialah titik tengah perentas. Hitung panjang <i>VT</i>, dalam cm.',
    qe: 'The diagram shows a circle with centre <i>O</i>. Chords <i>PQ</i> and <i>RS</i> are parallel and equal in length, 30 cm. The radius of the circle is 17 cm. <i>V</i> and <i>T</i> are the midpoints of the chords. Calculate the length of <i>VT</i>, in cm.',
    pil: ['8', '16', '18', '34'], jaw: 'B', sk: '<i>OV</i> = RT(17² − 15²) = 8 = <i>OT</i> → <i>VT</i> = 16' },
  { id: 'T2S6-A07', bhg: 'A', bab: 5, kon: 'Mengaplikasi', aras: 'R', why: 'Luas bulatan', m: 1,
    q: 'Hitung luas sebuah bulatan yang berjejari 4.2 cm, dalam cm². (Guna π = FR(22|7))', qe: 'Calculate the area of a circle with a radius of 4.2 cm, in cm². (Use π = FR(22|7))',
    pil: ['13.2', '26.4', '55.44', '110.88'], jaw: 'C', sk: 'FR(22|7) × 4.2² = 55.44' },
  { id: 'T2S6-A08', bhg: 'A', bab: 6, kon: 'Memahami', aras: 'R', why: 'Bilangan muka piramid', m: 1,
    q: 'Berapakah bilangan muka bagi sebuah piramid yang bertapak oktagon?', qe: 'How many faces does a pyramid with an octagonal base have?',
    pil: ['8', '9', '10', '16'], jaw: 'B', sk: '8 muka segi tiga + 1 tapak = 9' },
  { id: 'T2S6-A09', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Jujukan darab dengan perpuluhan negatif', m: 1,
    q: 'Berikut ialah suatu jujukan nombor.<br>−0.3, −1.2, −4.8, <i>p</i>, −76.8, <i>q</i>, …<br>Hitung nilai <i>p</i> + <i>q</i>.', qe: 'The following is a number sequence.<br>−0.3, −1.2, −4.8, <i>p</i>, −76.8, <i>q</i>, …<br>Calculate the value of <i>p</i> + <i>q</i>.',
    pil: ['−96', '−307.2', '−326.4', '−384'], jaw: 'C', sk: 'Darab 4: <i>p</i> = −19.2, <i>q</i> = −307.2 → −326.4' },
  { id: 'T2S6-A10', bhg: 'A', bab: 4, kon: 'Menganalisis', aras: 'S', why: 'Segi tiga sama kaki di dalam pentagon sekata', m: 1,
    q: '<i>PQRST</i> ialah sebuah pentagon sekata. Pepenjuru <i>PR</i> dilukis. Hitung ∠<i>PRQ</i>.', qe: '<i>PQRST</i> is a regular pentagon. The diagonal <i>PR</i> is drawn. Calculate ∠<i>PRQ</i>.',
    pil: ['30°', '36°', '54°', '72°'], jaw: 'B', sk: '∠<i>PQR</i> = 108°; segi tiga <i>PQR</i> sama kaki → FR(180° − 108°|2) = 36°' },
  { id: 'T2S6-A11', bhg: 'A', bab: 5, kon: 'Mengaplikasi', aras: 'S', why: 'Perimeter gabungan segi empat sama dan sukuan bulatan', m: 1, fig: 'S6A11',
    q: 'Rajah menunjukkan gabungan sebuah segi empat sama <i>PQRS</i> dan sebuah sukuan bulatan <i>QRT</i> berpusat <i>Q</i>. Hitung perimeter seluruh rajah itu, dalam cm. (Guna π = FR(22|7))',
    qe: 'The diagram shows a combination of a square <i>PQRS</i> and a quadrant <i>QRT</i> with centre <i>Q</i>. Calculate the perimeter of the whole diagram, in cm. (Use π = FR(22|7))',
    pil: ['28', '35', '39', '50'], jaw: 'C', sk: '<i>PS</i> + <i>SR</i> + lengkok <i>RT</i> + <i>TQ</i> + <i>QP</i> = 7 + 7 + 11 + 7 + 7 = 39' },
  { id: 'T2S6-A12', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'S', why: 'Cari tinggi daripada isi padu, kemudian luas permukaan', m: 1,
    q: 'Sebuah kuboid mempunyai tapak berukuran 10 cm × 6 cm dan isi padu 360 cm³. Hitung jumlah luas permukaan kuboid itu, dalam cm².', qe: 'A cuboid has a base measuring 10 cm × 6 cm and a volume of 360 cm³. Calculate the total surface area of the cuboid, in cm².',
    pil: ['252', '312', '360', '372'], jaw: 'B', sk: 'Tinggi = 6 cm; 2(60 + 60 + 36) = 312' },
  { id: 'T2S6-A13', bhg: 'A', bab: 5, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Sektor dalam segi tiga sama sisi', m: 1,
    q: '<i>JOL</i> ialah sebuah segi tiga sama sisi dengan perimeter 54 cm. <i>P</i> dan <i>Q</i> masing-masing ialah titik tengah <i>OJ</i> dan <i>OL</i>. <i>PRQ</i> ialah lengkok bulatan berpusat <i>O</i>. Hitung luas sektor <i>OPRQ</i>, dalam cm², dalam sebutan π.',
    qe: '<i>JOL</i> is an equilateral triangle with a perimeter of 54 cm. <i>P</i> and <i>Q</i> are the midpoints of <i>OJ</i> and <i>OL</i> respectively. <i>PRQ</i> is an arc with centre <i>O</i>. Calculate the area of sector <i>OPRQ</i>, in cm², in terms of π.',
    pil: ['13.5π', '27π', '40.5π', '81π'], jaw: 'A', sk: 'Sisi 18 cm, jejari 9 cm, sudut 60° → FR(60°|360°) × π × 81 = 13.5π' },
  { id: 'T2S6-A14', bhg: 'A', bab: 4, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Sudut di bucu sepunya dua poligon sekata', m: 1,
    q: 'Sebuah heksagon sekata dan sebuah pentagon sekata berkongsi sisi <i>QR</i> dan terletak pada sisi bertentangan garis <i>QR</i>. Hitung sudut di <i>R</i> di antara sisi-sisi lain kedua-dua poligon itu (bukan <i>QR</i>), di luar kedua-dua poligon.',
    qe: 'A regular hexagon and a regular pentagon share the side <i>QR</i> and lie on opposite sides of <i>QR</i>. Calculate the angle at <i>R</i> between the other sides of the two polygons (not <i>QR</i>), outside both polygons.',
    pil: ['120°', '128°', '132°', '144°'], jaw: 'C', sk: '360° − 120° − 108° = 132°' },
  { id: 'T2S6-A15', bhg: 'A', bab: 6, kon: 'Menganalisis', aras: 'T', why: 'Isi padu kubus tolak piramid, kerja songsang', m: 1,
    q: 'Sebuah piramid tegak yang tapaknya sama dengan muka atas sebuah kubus bersisi 12 cm dipotong keluar dari bahagian atas kubus itu. Isi padu pepejal yang tinggal ialah 1 344 cm³. Hitung tinggi piramid itu, dalam cm.',
    qe: 'A right pyramid whose base is the top face of a cube with sides of 12 cm is cut out from the top of the cube. The volume of the remaining solid is 1 344 cm³. Calculate the height of the pyramid, in cm.',
    pil: ['6', '8', '9', '10'], jaw: 'B', sk: '1 728 − FR(1|3) × 144 × <i>t</i> = 1 344 → 48<i>t</i> = 384 → <i>t</i> = 8' },
  { id: 'T2S6-A16', bhg: 'A', bab: 5, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Jarak perentas dari pusat dalam semibulatan', m: 1,
    q: 'Sebuah semibulatan mempunyai diameter <i>PQ</i> = 26 cm. <i>SR</i> ialah perentas sepanjang 24 cm yang selari dengan <i>PQ</i>. <i>V</i> ialah titik tertinggi pada semibulatan itu. Hitung jarak terpendek, dalam cm, dari <i>V</i> ke <i>SR</i>.',
    qe: 'A semicircle has a diameter <i>PQ</i> = 26 cm. <i>SR</i> is a chord of length 24 cm parallel to <i>PQ</i>. <i>V</i> is the highest point on the semicircle. Calculate the shortest distance, in cm, from <i>V</i> to <i>SR</i>.',
    pil: ['5', '8', '12', '13'], jaw: 'B', sk: 'Jarak pusat ke <i>SR</i> = RT(13² − 12²) = 5 → 13 − 5 = 8' },

  // ---------------- SET 6 · BAHAGIAN B ----------------
  { id: 'T2S6-B01', bhg: 'B', bab: 3, babs: [2, 3], parts: [
    { l: '(a)', jenis: 'bp', m: 2, aras: 'R', kon: 'Memahami', q: 'Tulis <b>Benar</b> atau <b>Palsu</b>.', qe: 'Write <b>True</b> or <b>False</b>.',
      items: [{ t: '<i>k</i> ialah perkara rumus bagi <i>k</i> = 3<i>h</i> − 1.', te: '<i>k</i> is the subject of the formula <i>k</i> = 3<i>h</i> − 1.', a: 'Benar' }, { t: '<i>T</i> ialah perkara rumus bagi <i>T</i>² = 4<i>s</i> + 1.', te: '<i>T</i> is the subject of the formula <i>T</i>² = 4<i>s</i> + 1.', a: 'Palsu' }] },
    { l: '(b)', jenis: 'tanda', m: 2, aras: 'R', kon: 'Memahami', q: 'Tandakan (✓) bagi <b>dua</b> faktor bagi 36<i>abc</i>.', qe: 'Tick (✓) the <b>two</b> factors of 36<i>abc</i>.',
      items: [{ t: '9<i>a</i>', a: '✓' }, { t: '8<i>c</i>', a: '' }, { t: '12<i>bc</i>', a: '✓' }, { t: '5<i>ab</i>', a: '' }] }] },
  { id: 'T2S6-B02', bhg: 'B', bab: 2, babs: [1, 2], parts: [
    { l: '(a)', jenis: 'pad', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Padankan setiap ungkapan dengan pemfaktoran selengkapnya.', qe: 'Match each expression with its complete factorisation.',
      items: [{ t: '9<i>k</i>² − 1', a: '(3<i>k</i> + 1)(3<i>k</i> − 1)' }, { t: '9<i>k</i>² + 6<i>k</i> + 1', a: '(3<i>k</i> + 1)²' }, { t: '18<i>k</i>² + 2', a: '2(9<i>k</i>² + 1)' }],
      kanan: ['2(9<i>k</i>² + 1)', '(3<i>k</i> + 1)(3<i>k</i> − 1)', '(3<i>k</i> + 1)²'] },
    { l: '(b)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Bulatkan nombor seterusnya bagi setiap jujukan.', qe: 'Circle the next number of each sequence.',
      items: [{ t: 'FR(1|2), FR(1|4), FR(1|8), FR(1|16), …: CH(FR(1|20)|FR(1|24)|FR(1|32))', a: 'FR(1|32)' }, { t: '192, 48, 12, 3, …: CH(0.75|1|1.5)', a: '0.75' }] }] },
  { id: 'T2S6-B03', bhg: 'B', bab: 4, parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Bulatkan hasil tambah sudut pedalaman bagi setiap poligon.', qe: 'Circle the sum of the interior angles of each polygon.',
      items: [{ t: 'Heptagon: CH(720°|900°|1 080°)', te: 'Heptagon', a: '900°' }, { t: 'Poligon 12 sisi: CH(1 620°|1 800°|1 980°)', te: '12-sided polygon', a: '1 800°' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'S', kon: 'Menganalisis', q: '<i>ABCDEFGH</i> ialah sebuah oktagon sekata. Sisi <i>AB</i> dan <i>DC</i> dipanjangkan dan bertemu di titik <i>J</i>. Isi tempat kosong.',
      qe: '<i>ABCDEFGH</i> is a regular octagon. The sides <i>AB</i> and <i>DC</i> are extended and meet at point <i>J</i>. Fill in the blanks.',
      items: [{ t: '∠<i>JBC</i> = __________', a: '45°' }, { t: '∠<i>BJC</i> = __________', a: '90°' }], sk: '∠<i>JBC</i> dan ∠<i>JCB</i> ialah sudut peluaran = 45°; ∠<i>BJC</i> = 180° − 90° = 90°' }] },
  { id: 'T2S6-B04', bhg: 'B', bab: 5, babs: [5, 6], parts: [
    { l: '(a)', jenis: 'isi', m: 2, aras: 'R', kon: 'Memahami', q: 'Isi tempat kosong bagi sebuah prisma segi tiga.', qe: 'Fill in the blanks for a triangular prism.',
      items: [{ t: 'Bilangan muka segi tiga = __________', te: 'Number of triangular faces = __________', a: '2' }, { t: 'Bilangan muka segi empat tepat = __________', te: 'Number of rectangular faces = __________', a: '3' }] },
    { l: '(b)', jenis: 'bulat', m: 2, aras: 'S', kon: 'Mengaplikasi', q: '<i>POR</i> ialah sektor bulatan berpusat <i>O</i>, berjejari <i>x</i> cm dan bersudut θ. Bulatkan jawapan yang betul.', qe: '<i>POR</i> is a sector of a circle with centre <i>O</i>, radius <i>x</i> cm and angle θ. Circle the correct answers.',
      items: [{ t: 'Panjang lengkok <i>PR</i> = 3π cm dan <i>x</i> = 9: θ = CH(40°|60°|80°)', te: 'Arc length <i>PR</i> = 3π cm and <i>x</i> = 9', a: '60°' }, { t: 'Luas sektor = 54π cm² dan θ = 135°: <i>x</i> = CH(9 cm|12 cm|18 cm)', te: 'Area of sector = 54π cm² and θ = 135°', a: '12 cm' }],
      sk: 'FR(θ|360°) × 18π = 3π → θ = 60°; FR(135°|360°) × π<i>x</i>² = 54π → <i>x</i>² = 144' }] },
  { id: 'T2S6-B05', bhg: 'B', bab: 5, fig: 'S6B05', q: 'Rajah menunjukkan empat bulatan yang sama saiz ditampal bersebelahan di atas sekeping kertas segi empat tepat. Setiap bulatan menyentuh sisi kertas. Luas kertas itu ialah 256 cm².',
    qe: 'The diagram shows four equal circles stuck side by side on a rectangular piece of paper. Each circle touches the sides of the paper. The area of the paper is 256 cm².', parts: [
    { l: '', jenis: 'bulat', m: 4, aras: 'T', kon: 'Menganalisis', q: 'Bulatkan jawapan yang betul.', qe: 'Circle the correct answers.',
      items: [{ t: 'Panjang kertas: CH(16 cm|32 cm|64 cm)', te: 'Length of the paper', a: '32 cm' }, { t: 'Lebar kertas: CH(4 cm|8 cm|16 cm)', te: 'Width of the paper', a: '8 cm' },
        { t: 'Jumlah luas empat bulatan: CH(16π cm²|32π cm²|64π cm²)', te: 'Total area of the four circles', a: '64π cm²' }, { t: 'Luas kertas yang tidak ditutup: CH(256 − 16π cm²|256 − 64π cm²|64π − 256 cm²)', te: 'Area of paper not covered', a: '256 − 64π cm²' }],
      sk: '4<i>d</i> × <i>d</i> = 256 → <i>d</i> = 8; jejari 4 → 4 × 16π = 64π' }] },

  // ---------------- SET 6 · BAHAGIAN C ----------------
  { id: 'T2S6-C01', bhg: 'C', bab: 2, parts: [
    { l: '(a)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Kembangkan dan permudahkan (2<i>x</i> + 3)(<i>x</i> − 1) − <i>x</i>(<i>x</i> + 4).', qe: 'Expand and simplify (2<i>x</i> + 3)(<i>x</i> − 1) − <i>x</i>(<i>x</i> + 4).',
      sk: '2<i>x</i>² + <i>x</i> − 3 <b>K1</b>; − <i>x</i>² − 4<i>x</i> <b>K1</b><br><i>x</i>² − 3<i>x</i> − 3 <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Faktorkan selengkapnya <i>pq</i> + <i>pr</i> + 2<i>q</i> + 2<i>r</i>.', qe: 'Factorise completely <i>pq</i> + <i>pr</i> + 2<i>q</i> + 2<i>r</i>.',
      sk: '<i>p</i>(<i>q</i> + <i>r</i>) + 2(<i>q</i> + <i>r</i>) <b>K1 K1</b><br>(<i>p</i> + 2)(<i>q</i> + <i>r</i>) <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menganalisis', q: 'Terdapat sejumlah (24<i>x</i> + 96) biji muffin di dalam 8 buah kotak yang sama besar.<br>(i) Ungkapkan bilangan muffin di dalam separuh daripada sebuah kotak.<br>(ii) Sebanyak (15<i>x</i> + 60) biji muffin telah dijual. Berapakah bilangan kotak muffin yang masih ada?',
      qe: 'There are (24<i>x</i> + 96) muffins in 8 boxes of the same size.<br>(i) Express the number of muffins in half a box.<br>(ii) (15<i>x</i> + 60) muffins have been sold. How many boxes of muffins are left?',
      sk: '(i) FR(24<i>x</i> + 96|16) <b>K1</b> = FR(3(<i>x</i> + 4)|2) <b>N1</b><br>(ii) Baki = 9<i>x</i> + 36; FR(9(<i>x</i> + 4)|3(<i>x</i> + 4)) <b>K1</b> = 3 kotak <b>N1</b>' }] },
  { id: 'T2S6-C02', bhg: 'C', bab: 1, parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Mengaplikasi', q: '(i) Lengkapkan baris segi tiga Pascal berikut: 1, ____, 6, ____, 1<br>(ii) Suatu jujukan bermula dengan 2.5 dan polanya ialah menolak 0.8 daripada nombor sebelumnya. Tulis lima sebutan pertama jujukan itu.',
      qe: '(i) Complete the following row of Pascal\'s triangle: 1, ____, 6, ____, 1<br>(ii) A sequence starts with 2.5 and its pattern is subtracting 0.8 from the previous number. Write the first five terms of the sequence.',
      sk: '(i) 4, 4 <b>P2</b><br>(ii) 2.5, 1.7, 0.9, 0.1, −0.7 <b>P2</b>' },
    { l: '(b)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Isi padu air di dalam empat botol pertama mengikut satu urutan ialah 30 mℓ, 60 mℓ, 90 mℓ dan 120 mℓ.<br>(i) Tulis ungkapan algebra bagi isi padu air di dalam botol ke-<i>n</i>.<br>(ii) Seterusnya, cari isi padu air di dalam botol ke-12.',
      qe: 'The volumes of water in the first four bottles in a sequence are 30 mℓ, 60 mℓ, 90 mℓ and 120 mℓ.<br>(i) Write an algebraic expression for the volume of water in the <i>n</i>th bottle.<br>(ii) Hence, find the volume of water in the 12th bottle.',
      sk: '(i) 30<i>n</i> <b>P2</b><br>(ii) 30(12) <b>K1</b> = 360 mℓ <b>N1</b>' },
    { l: '(c)', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Air daripada 8 botol pertama dituang ke dalam sebuah bekas kosong. Hitung isi padu air di dalam bekas itu, dalam mℓ.', qe: 'The water from the first 8 bottles is poured into an empty container. Calculate the volume of water in the container, in mℓ.',
      sk: '30 + 60 + … + 240 <b>K1</b> = 1 080 mℓ <b>N1</b>' }] },
  { id: 'T2S6-C03', bhg: 'C', bab: 3, babs: [2, 3], parts: [
    { l: '(a)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Diberi <i>p</i> = 3<i>q</i> + 2<i>t</i>².<br>(i) Ungkapkan <i>q</i> sebagai perkara rumus.<br>(ii) Ungkapkan <i>t</i> sebagai perkara rumus.', qe: 'Given <i>p</i> = 3<i>q</i> + 2<i>t</i>².<br>(i) Express <i>q</i> as the subject of the formula.<br>(ii) Express <i>t</i> as the subject of the formula.',
      sk: '(i) 3<i>q</i> = <i>p</i> − 2<i>t</i>² <b>K1</b>; <i>q</i> = FR(<i>p</i> − 2<i>t</i>²|3) <b>N1</b><br>(ii) <i>t</i>² = FR(<i>p</i> − 3<i>q</i>|2) <b>K1</b>; <i>t</i> = ±RT(FR(<i>p</i> − 3<i>q</i>|2)) <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Sebuah heksagon mempunyai empat sisi yang masing-masing <i>x</i> cm dan dua sisi yang masing-masing 2<i>y</i> cm.<br>(i) Tulis satu rumus bagi perimeter, <i>P</i>, dalam sebutan <i>x</i> dan <i>y</i>.<br>(ii) Diberi <i>P</i> = 30 cm dan <i>x</i> = 4.5 cm. Hitung nilai <i>y</i>.',
      qe: 'A hexagon has four sides of <i>x</i> cm each and two sides of 2<i>y</i> cm each.<br>(i) Write a formula for the perimeter, <i>P</i>, in terms of <i>x</i> and <i>y</i>.<br>(ii) Given <i>P</i> = 30 cm and <i>x</i> = 4.5 cm. Calculate the value of <i>y</i>.',
      sk: '(i) <i>P</i> = 4<i>x</i> + 4<i>y</i> <b>P1</b><br>(ii) 30 = 18 + 4<i>y</i> <b>K1</b>; <i>y</i> = 3 <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'T', kon: 'Mengaplikasi', q: 'Permudahkan FR(<i>x</i>² − 4|3<i>x</i>) × FR(6<i>x</i>²|<i>x</i> + 2).', qe: 'Simplify FR(<i>x</i>² − 4|3<i>x</i>) × FR(6<i>x</i>²|<i>x</i> + 2).',
      sk: 'FR((<i>x</i> − 2)(<i>x</i> + 2)|3<i>x</i>) × FR(6<i>x</i>²|<i>x</i> + 2) <b>K1 K1</b><br>2<i>x</i>(<i>x</i> − 2) <b>N1</b>' }] },
  { id: 'T2S6-C04', bhg: 'C', bab: 4, parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Menilai', q: 'Sebuah poligon mempunyai 7 sisi dengan panjang 4 cm, 4 cm, 5 cm, 4 cm, 4 cm, 5 cm dan 4 cm.<br>(i) Namakan poligon itu.<br>(ii) Adakah poligon itu sebuah poligon sekata? Berikan sebab.<br>(iii) Nyatakan hasil tambah sudut pedalaman poligon itu.',
      qe: 'A polygon has 7 sides of lengths 4 cm, 4 cm, 5 cm, 4 cm, 4 cm, 5 cm and 4 cm.<br>(i) Name the polygon.<br>(ii) Is the polygon a regular polygon? Give a reason.<br>(iii) State the sum of the interior angles of the polygon.',
      sk: '(i) Heptagon <b>P1</b><br>(ii) Bukan, kerana panjang sisinya tidak sama <b>P1 P1</b><br>(iii) 900° <b>P1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Sudut pedalaman sebuah pentagon ialah 2<i>x</i>, 110°, 3<i>x</i>, 95° dan 115°. Hitung nilai <i>x</i>.', qe: 'The interior angles of a pentagon are 2<i>x</i>, 110°, 3<i>x</i>, 95° and 115°. Calculate the value of <i>x</i>.',
      sk: '2<i>x</i> + 110° + 3<i>x</i> + 95° + 115° = 540° <b>K1 K1</b><br><i>x</i> = 44° <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'T', kon: 'Menganalisis', q: '<i>ABCDEF</i> ialah sebuah heksagon sekata. Sisi <i>AB</i> dan <i>DC</i> dipanjangkan dan bertemu di titik <i>J</i>. Hitung ∠<i>BJC</i>.', qe: '<i>ABCDEF</i> is a regular hexagon. The sides <i>AB</i> and <i>DC</i> are extended and meet at point <i>J</i>. Calculate ∠<i>BJC</i>.',
      sk: 'Sudut peluaran = 60° <b>K1</b><br>∠<i>BJC</i> = 180° − 60° − 60° <b>K1</b> = 60° <b>N1</b>' }] },
  { id: 'T2S6-C05', bhg: 'C', bab: 5, kbat: true, parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Mengaplikasi', q: 'Sebuah sektor <i>POQ</i> mempunyai jejari 7 cm dan ∠<i>POQ</i> = 72°. Hitung<br>(i) panjang lengkok minor <i>PQ</i>,<br>(ii) luas sektor minor <i>POQ</i>. (Guna π = FR(22|7))',
      qe: 'A sector <i>POQ</i> has a radius of 7 cm and ∠<i>POQ</i> = 72°. Calculate<br>(i) the length of the minor arc <i>PQ</i>,<br>(ii) the area of the minor sector <i>POQ</i>. (Use π = FR(22|7))',
      sk: '(i) FR(72°|360°) × 44 <b>K1</b> = 8.8 cm <b>N1</b><br>(ii) FR(72°|360°) × 154 <b>K1</b> = 30.8 cm² <b>N1</b>' },
    { l: '(b)', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Hitung perimeter sektor major <i>POQ</i> dalam (a).', qe: 'Calculate the perimeter of the major sector <i>POQ</i> in (a).',
      sk: '7 + 7 + (44 − 8.8) <b>K1</b> = 49.2 cm <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menganalisis', fig: 'S6C05', q: 'Rajah menunjukkan keratan rentas sebatang paip berdiameter 50 cm. Pada mulanya, lebar permukaan air <i>AB</i> ialah 30 cm. Selepas beberapa minit, paras air naik dan lebar permukaan air <i>CD</i> menjadi 48 cm. Kedua-dua permukaan air berada di bawah pusat paip. Hitung peratus kenaikan kedalaman air di dalam paip itu.',
      qe: 'The diagram shows the cross section of a pipe with a diameter of 50 cm. At first, the width of the water surface <i>AB</i> is 30 cm. After a few minutes, the water level rises and the width of the water surface <i>CD</i> becomes 48 cm. Both water surfaces are below the centre of the pipe. Calculate the percentage increase in the depth of water in the pipe.',
      sk: 'Jarak pusat ke <i>AB</i> = RT(25² − 15²) = 20 → kedalaman 5 cm <b>K1</b><br>Jarak pusat ke <i>CD</i> = RT(25² − 24²) = 7 → kedalaman 18 cm <b>K1</b><br>FR(18 − 5|5) × 100% <b>K1</b> = 260% <b>N1</b>' }] },
  { id: 'T2S6-C06', bhg: 'C', bab: 6, parts: [
    { l: '(a)', m: 2, aras: 'R', kon: 'Memahami', q: '(i) Nyatakan satu persamaan antara sebuah silinder dan sebuah prisma.<br>(ii) Terangkan sifat semua titik pada permukaan sebuah sfera.', qe: '(i) State one similarity between a cylinder and a prism.<br>(ii) Explain the property of all points on the surface of a sphere.',
      sk: '(i) Kedua-duanya mempunyai dua tapak yang kongruen dan selari / keratan rentas seragam <b>P1</b><br>(ii) Semua titik sama jarak dari pusat sfera <b>P1</b>' },
    { l: '(b)', m: 5, aras: 'S', kon: 'Mengaplikasi', q: '(i) Nyatakan bilangan muka, tepi dan bucu bagi sebuah kubus.<br>(ii) Sebuah prisma tegak mempunyai keratan rentas segi tiga bersudut tegak dengan sisi 5 cm, 12 cm dan 13 cm. Panjang prisma ialah 20 cm. Hitung jumlah luas permukaan prisma itu, dalam cm².',
      qe: '(i) State the number of faces, edges and vertices of a cube.<br>(ii) A right prism has a right-angled triangular cross section with sides of 5 cm, 12 cm and 13 cm. The length of the prism is 20 cm. Calculate the total surface area of the prism, in cm².',
      sk: '(i) 6 muka, 12 tepi, 8 bucu <b>P2</b><br>(ii) 2 × FR(1|2) × 5 × 12 = 60 <b>K1</b>; 20 × (5 + 12 + 13) = 600 <b>K1</b>; 660 cm² <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'T', kon: 'Menilai', q: 'Bekas <i>P</i> berbentuk kubus bersisi 22 cm. Bekas <i>Q</i> berbentuk silinder berdiameter 7 cm dan tinggi 10 cm. Bekas <i>Q</i> yang berisi penuh air digunakan untuk mengisi bekas <i>P</i> yang kosong. Berapakah bilangan maksimum kali bekas <i>Q</i> yang penuh boleh dituang ke dalam bekas <i>P</i> tanpa air melimpah? (Guna π = FR(22|7))',
      qe: 'Container <i>P</i> is a cube with sides of 22 cm. Container <i>Q</i> is a cylinder with a diameter of 7 cm and a height of 10 cm. Container <i>Q</i>, filled with water, is used to fill the empty container <i>P</i>. What is the maximum number of times a full container <i>Q</i> can be poured into <i>P</i> without the water overflowing? (Use π = FR(22|7))',
      sk: '<i>P</i> = 22³ = 10 648 cm³; <i>Q</i> = FR(22|7) × 3.5² × 10 = 385 cm³ <b>K1</b><br>10 648 ÷ 385 = 27.66 <b>K1</b><br>27 kali <b>N1</b>' }] }
);
