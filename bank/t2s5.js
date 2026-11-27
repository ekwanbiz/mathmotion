'use strict';
/* =================== BANK SOALAN · TINGKATAN 2 · SET 5 (format UPSA, Bab 1–6) ===================
   Set 5 (27 Nov 2026): 17 A · 5 B · 6 C. Diolah semula oleh Mat berdasarkan bentuk dan aras UPSA Set 1
   (rujukan: Downloads/Bank Soalan/UPSA Set 1.docx). Soalan yang sama bentuk dengan set terdahulu tidak diulang;
   soalan lukis / bina (corak, heksagon, bentangan) diganti dengan soalan bertulis pada konsep yang sama.
   Dimuat selepas t2.js. */

const BS_S5T = (x, y, s, it = true) => `<text x="${x}" y="${y}"${it ? ' font-style="italic"' : ''}>${s}</text>`;

Object.assign(BS_FIG, {
  S5A10: `<svg viewBox="0 0 200 200" width="170" role="img" aria-label="Bulatan berpusat O; perentas PQR dengan Q titik tengah; jejari OS melalui Q">
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="2"/><line x1="36" y1="148" x2="164" y2="148" stroke="currentColor" stroke-width="2"/>
    <line x1="100" y1="100" x2="100" y2="180" stroke="currentColor" stroke-width="1.6"/><rect x="100" y="140" width="8" height="8" fill="none" stroke="currentColor"/><circle cx="100" cy="100" r="2.5" fill="currentColor"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12">${BS_S5T(22, 160, 'P')}${BS_S5T(110, 142, 'Q')}${BS_S5T(168, 160, 'R')}${BS_S5T(96, 196, 'S')}${BS_S5T(106, 98, 'O')}</g></svg>`,
  S5A15: `<svg viewBox="0 0 240 130" width="220" role="img" aria-label="Dua bulatan yang sama saiz di dalam segi empat tepat; kawasan di luar bulatan berlorek">
    <rect x="10" y="10" width="220" height="110" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="2"/>
    <g fill="var(--bg,#fff)" stroke="currentColor" stroke-width="2"><circle cx="65" cy="65" r="55"/><circle cx="175" cy="65" r="55"/></g></svg>`,
  S5A16: `<svg viewBox="0 0 180 230" width="140" role="img" aria-label="Gabungan kon tegak di atas silinder tegak; diameter 14 cm, tinggi silinder 10 cm, tinggi sendeng kon 25 cm">
    <g fill="none" stroke="currentColor" stroke-width="2"><line x1="30" y1="140" x2="80" y2="10"/><line x1="130" y1="140" x2="80" y2="10"/>
    <line x1="30" y1="140" x2="30" y2="196"/><line x1="130" y1="140" x2="130" y2="196"/><ellipse cx="80" cy="140" rx="50" ry="10" stroke-dasharray="4 3"/><path d="M30 196 A50 10 0 0 0 130 196"/></g>
    <line x1="30" y1="206" x2="130" y2="206" stroke="currentColor"/><g font-family="Inter,sans-serif" fill="currentColor" font-size="11"><text x="64" y="222">14 cm</text><text x="134" y="172">10 cm</text><text x="104" y="70">25 cm</text></g></svg>`,
  S5A17: `<svg viewBox="0 0 200 200" width="160" role="img" aria-label="Gabungan piramid tegak di atas kuboid bertapak segi empat sama; tinggi kuboid 10 cm, tinggi piramid 9 cm">
    <g fill="none" stroke="currentColor" stroke-width="2"><polygon points="30,110 120,110 120,180 30,180"/><polyline points="120,110 160,90 160,160 120,180"/><line x1="30" y1="110" x2="70" y2="90"/><line x1="70" y1="90" x2="160" y2="90"/>
    <line x1="30" y1="110" x2="95" y2="20"/><line x1="120" y1="110" x2="95" y2="20"/><line x1="160" y1="90" x2="95" y2="20"/></g>
    <line x1="95" y1="20" x2="95" y2="100" stroke="currentColor" stroke-dasharray="4 3"/><g font-family="Inter,sans-serif" fill="currentColor" font-size="11"><text x="164" y="130">10 cm</text><text x="101" y="66">9 cm</text></g></svg>`,
  S5B05: `<svg viewBox="0 0 230 130" width="210" role="img" aria-label="Segi empat tepat PQRS, PQ = 14 cm, QR = 7 cm; lengkok QV berpusat R; kawasan di luar sektor berlorek">
    <path d="M20 15 L188 15 A84 84 0 0 0 104 99 L20 99 Z" fill="currentColor" fill-opacity=".25"/>
    <g fill="none" stroke="currentColor" stroke-width="2"><rect x="20" y="15" width="168" height="84"/><path d="M188 15 A84 84 0 0 0 104 99"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12">${BS_S5T(8, 14, 'P')}${BS_S5T(192, 14, 'Q')}${BS_S5T(192, 112, 'R')}${BS_S5T(8, 112, 'S')}${BS_S5T(100, 114, 'V')}<text x="88" y="11">14 cm</text><text x="194" y="62">7 cm</text></g></svg>`,
  S5C02: `<svg viewBox="0 0 170 170" width="150" role="img" aria-label="Segi empat sama bersisi (2x + 3) cm dengan segi empat sama kecil bersisi x cm di sudut; kawasan lain berlorek">
    <rect x="10" y="10" width="140" height="140" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="2"/><rect x="10" y="10" width="55" height="55" fill="var(--bg,#fff)" stroke="currentColor" stroke-width="2"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="11"><text x="28" y="42"><tspan font-style="italic">x</tspan> cm</text><text x="44" y="164">(2<tspan font-style="italic">x</tspan> + 3) cm</text></g></svg>`,
  S5C05: `<svg viewBox="0 0 180 180" width="160" role="img" aria-label="Sukuan bulatan OPQ berpusat O dengan segi empat sama OSTV di sudut O; kawasan di luar segi empat sama berlorek">
    <path d="M20 160 L20 20 A140 140 0 0 1 160 160 Z" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="2"/>
    <rect x="20" y="120" width="40" height="40" fill="var(--bg,#fff)" stroke="currentColor" stroke-width="2"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12">${BS_S5T(8, 174, 'O')}${BS_S5T(8, 22, 'P')}${BS_S5T(162, 174, 'Q')}${BS_S5T(8, 124, 'V')}${BS_S5T(62, 118, 'T')}${BS_S5T(56, 174, 'S')}</g></svg>`
});

BS_T2.push(
  // ---------------- SET 5 · BAHAGIAN A ----------------
  { id: 'T2S5-A01', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'R', why: 'Jujukan darab dengan nombor negatif', m: 1,
    q: 'Berikut ialah suatu urutan nombor.<br>−3, 12, −48, …<br>Apakah nombor seterusnya?', qe: 'The following is a sequence of numbers.<br>−3, 12, −48, …<br>What is the next number?',
    pil: ['−192', '−96', '96', '192'], jaw: 'D', sk: 'Darab −4: −48 × (−4) = 192' },
  { id: 'T2S5-A02', bhg: 'A', bab: 1, kon: 'Memahami', aras: 'S', why: 'Kenal pasti pola tolak pecahan', m: 1,
    q: 'Antara berikut, jujukan yang manakah mempunyai pola menolak FR(1|4) daripada nombor sebelumnya?', qe: 'Which of the following sequences has the pattern of subtracting FR(1|4) from the previous number?',
    pil: ['FR(3|4), FR(1|2), FR(1|4), 0, …', 'FR(1|4), FR(1|2), FR(3|4), 1, …', 'FR(1|2), FR(1|4), FR(1|8), FR(1|16), …', '1, FR(3|4), FR(1|4), 0, …'], jaw: 'A' },
  { id: 'T2S5-A03', bhg: 'A', bab: 2, kon: 'Menganalisis', aras: 'R', why: 'Kenal pasti bukan faktor sepunya', m: 1,
    q: 'Antara berikut, yang manakah <b>bukan</b> faktor sepunya bagi 18<i>q</i>² − 27<i>q</i>?', qe: 'Which of the following is <b>not</b> a common factor of 18<i>q</i>² − 27<i>q</i>?',
    pil: ['3', '3<i>q</i>', '9<i>q</i>', '6<i>q</i>²'], jaw: 'D', sk: '18<i>q</i>² − 27<i>q</i> = 9<i>q</i>(2<i>q</i> − 3); faktor sepunya: 3, 9, <i>q</i>, 3<i>q</i>, 9<i>q</i>' },
  { id: 'T2S5-A04', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'T', kbat: true, why: 'Perkara rumus apabila pemboleh ubah muncul dua kali', m: 1,
    q: 'Diberi <i>m</i> = FR(3<i>k</i>|<i>k</i> − 2). Ungkapkan <i>k</i> dalam sebutan <i>m</i>.', qe: 'Given <i>m</i> = FR(3<i>k</i>|<i>k</i> − 2). Express <i>k</i> in terms of <i>m</i>.',
    pil: ['<i>k</i> = FR(2<i>m</i>|<i>m</i> − 3)', '<i>k</i> = FR(2<i>m</i>|3 − <i>m</i>)', '<i>k</i> = FR(<i>m</i> − 3|2<i>m</i>)', '<i>k</i> = FR(3<i>m</i>|<i>m</i> − 2)'], jaw: 'A',
    sk: '<i>mk</i> − 2<i>m</i> = 3<i>k</i> → <i>k</i>(<i>m</i> − 3) = 2<i>m</i> → <i>k</i> = FR(2<i>m</i>|<i>m</i> − 3)' },
  { id: 'T2S5-A05', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'S', why: 'Bentuk rumus daripada situasi', m: 1,
    q: 'Sebuah bekas mengandungi <i>p</i> biji guli merah, <i>q</i> biji guli kuning dan <i>r</i> biji guli hijau. Jumlah guli ialah 60 biji. Bilangan guli kuning ialah dua kali bilangan guli merah. Tentukan rumus bagi bilangan guli hijau.',
    qe: 'A container has <i>p</i> red marbles, <i>q</i> yellow marbles and <i>r</i> green marbles. There are 60 marbles altogether. The number of yellow marbles is twice the number of red marbles. Determine the formula for the number of green marbles.',
    pil: ['<i>r</i> = 60 + 3<i>p</i>', '<i>r</i> = 60 − 2<i>p</i>', '<i>r</i> = 60 − 3<i>p</i>', '<i>r</i> = FR(60|3<i>p</i>)'], jaw: 'C', sk: '<i>p</i> + 2<i>p</i> + <i>r</i> = 60 → <i>r</i> = 60 − 3<i>p</i>' },
  { id: 'T2S5-A06', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'R', why: 'Perimeter poligon sekata', m: 1,
    q: 'Sebuah oktagon sekata mempunyai panjang sisi 7 cm. Hitung perimeter oktagon itu, dalam cm.', qe: 'A regular octagon has sides of 7 cm. Calculate the perimeter of the octagon, in cm.',
    pil: ['42', '49', '56', '63'], jaw: 'C', sk: '8 × 7 = 56' },
  { id: 'T2S5-A07', bhg: 'A', bab: 6, kon: 'Mengingat', aras: 'R', why: 'Kenal pasti pepejal daripada ciri', m: 1,
    q: 'Antara pepejal geometri berikut, yang manakah mempunyai dua tapak rata berbentuk bulatan dan satu permukaan melengkung?', qe: 'Which of the following geometric solids has two circular flat bases and one curved surface?',
    pil: ['Kon', 'Prisma', 'Silinder', 'Sfera'], pe: ['Cone', 'Prism', 'Cylinder', 'Sphere'], jaw: 'C' },
  { id: 'T2S5-A08', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'S', why: 'Kerja songsang isi padu piramid', m: 1,
    q: 'Sebuah piramid tegak mempunyai tapak segi empat tepat berukuran 8 cm × 6 cm. Isi padu piramid itu ialah 224 cm³. Hitung tinggi piramid itu, dalam cm.', qe: 'A right pyramid has a rectangular base measuring 8 cm × 6 cm. The volume of the pyramid is 224 cm³. Calculate the height of the pyramid, in cm.',
    pil: ['12', '14', '16', '28'], jaw: 'B', sk: 'FR(1|3) × 48 × <i>t</i> = 224 → <i>t</i> = 14' },
  { id: 'T2S5-A09', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'R', why: 'Poligon daripada sudut peluaran', m: 1,
    q: 'Antara berikut, poligon sekata yang manakah mempunyai sudut peluaran 40°?', qe: 'Which of the following regular polygons has an exterior angle of 40°?',
    pil: ['Heptagon', 'Oktagon', 'Nonagon', 'Dekagon'], pe: ['Heptagon', 'Octagon', 'Nonagon', 'Decagon'], jaw: 'C', sk: 'FR(360°|40°) = 9 sisi' },
  { id: 'T2S5-A10', bhg: 'A', bab: 5, kon: 'Menganalisis', aras: 'S', why: 'Jejari berserenjang membahagi dua sama perentas', m: 1, fig: 'S5A10',
    q: 'Rajah menunjukkan sebuah bulatan berpusat <i>O</i>. Jejari bulatan ialah 10 cm dan <i>QS</i> = 4 cm. Hitung panjang perentas <i>PQR</i>, dalam cm.', qe: 'The diagram shows a circle with centre <i>O</i>. The radius of the circle is 10 cm and <i>QS</i> = 4 cm. Calculate the length of chord <i>PQR</i>, in cm.',
    pil: ['12', '16', '18', '20'], jaw: 'B', sk: '<i>OQ</i> = 10 − 4 = 6; <i>PQ</i> = RT(10² − 6²) = 8; <i>PR</i> = 16' },
  { id: 'T2S5-A11', bhg: 'A', bab: 5, kon: 'Mengaplikasi', aras: 'S', why: 'Panjang lengkok sebagai pecahan lilitan', m: 1,
    q: 'Lilitan sebuah bulatan ialah 88 cm. Hitung panjang lengkok bagi sektor bulatan itu yang bersudut 45°, dalam cm.', qe: 'The circumference of a circle is 88 cm. Calculate the arc length of a sector of the circle with an angle of 45°, in cm.',
    pil: ['5.5', '11', '22', '44'], jaw: 'B', sk: 'FR(45°|360°) × 88 = 11' },
  { id: 'T2S5-A12', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'S', why: 'Kerja songsang luas permukaan kuboid', m: 1,
    q: 'Sebuah kuboid mempunyai tapak berukuran 10 cm × 8 cm. Jumlah luas permukaan kuboid itu ialah 556 cm². Hitung tinggi kuboid itu, dalam cm.', qe: 'A cuboid has a base measuring 10 cm × 8 cm. The total surface area of the cuboid is 556 cm². Calculate the height of the cuboid, in cm.',
    pil: ['9', '10', '11', '12'], jaw: 'C', sk: '2(80) + 2<i>t</i>(10 + 8) = 556 → 36<i>t</i> = 396 → <i>t</i> = 11' },
  { id: 'T2S5-A13', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'S', why: 'Isi padu kuboid dan penukaran unit cm³ kepada liter', m: 1,
    q: 'Sebuah tangki berbentuk kuboid berukuran 40 cm × 25 cm × 20 cm diisi penuh dengan air. FR(3|5) daripada air itu digunakan untuk menyiram pokok. Hitung baki isi padu air, dalam liter, di dalam tangki itu.',
    qe: 'A cuboid tank measuring 40 cm × 25 cm × 20 cm is completely filled with water. FR(3|5) of the water is used to water plants. Calculate the remaining volume of water, in litres, in the tank.',
    pil: ['8', '12', '80', '800'], jaw: 'A', sk: '40 × 25 × 20 = 20 000 cm³ = 20 ℓ; baki FR(2|5) × 20 = 8 ℓ' },
  { id: 'T2S5-A14', bhg: 'A', bab: 4, kon: 'Menganalisis', aras: 'S', why: 'Sudut di pusat poligon sekata', m: 1,
    q: 'Sebuah poligon sekata dibahagikan kepada beberapa segi tiga yang kongruen dengan menyambungkan pusatnya ke setiap bucu. Sudut di pusat bagi setiap segi tiga ialah 40°. Berapakah bilangan segi tiga itu?',
    qe: 'A regular polygon is divided into congruent triangles by joining its centre to every vertex. The angle at the centre of each triangle is 40°. How many triangles are there?',
    pil: ['6', '8', '9', '10'], jaw: 'C', sk: 'FR(360°|40°) = 9' },
  { id: 'T2S5-A15', bhg: 'A', bab: 5, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Kerja songsang luas segi empat tepat, kemudian luas berlorek', m: 1, fig: 'S5A15',
    q: 'Rajah menunjukkan dua bulatan yang sama saiz di dalam sebuah segi empat tepat. Kedua-dua bulatan menyentuh sisi segi empat tepat dan antara satu sama lain. Luas segi empat tepat ialah 392 cm². Hitung luas kawasan berlorek, dalam cm². (Guna π = FR(22|7))',
    qe: 'The diagram shows two equal circles inside a rectangle. Both circles touch the sides of the rectangle and each other. The area of the rectangle is 392 cm². Calculate the area of the shaded region, in cm². (Use π = FR(22|7))',
    pil: ['84', '98', '112', '154'], jaw: 'A', sk: 'Lebar = <i>d</i>, panjang = 2<i>d</i> → 2<i>d</i>² = 392 → <i>d</i> = 14<br>392 − 2 × FR(22|7) × 7² = 392 − 308 = 84' },
  { id: 'T2S5-A16', bhg: 'A', bab: 6, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Luas permukaan gabungan pepejal (tanpa permukaan tercantum)', m: 1, fig: 'S5A16',
    q: 'Rajah menunjukkan gabungan sebuah kon tegak dan sebuah silinder tegak yang berdiameter 14 cm. Hitung jumlah luas permukaan pepejal itu, dalam cm². (Guna π = FR(22|7))',
    qe: 'The diagram shows a combination of a right cone and a right cylinder with a diameter of 14 cm. Calculate the total surface area of the solid, in cm². (Use π = FR(22|7))',
    pil: ['990', '1 144', '1 298', '1 452'], jaw: 'B', sk: 'Tapak: FR(22|7) × 7² = 154<br>Silinder: 2 × FR(22|7) × 7 × 10 = 440<br>Kon: FR(22|7) × 7 × 25 = 550<br>Jumlah = 1 144' },
  { id: 'T2S5-A17', bhg: 'A', bab: 6, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Isi padu gabungan pepejal, kerja songsang', m: 1, fig: 'S5A17',
    q: 'Rajah menunjukkan gabungan sebuah piramid tegak dan sebuah kuboid yang bertapak segi empat sama. Isi padu gabungan pepejal itu ialah 832 cm³. Hitung perimeter tapak pepejal itu, dalam cm.',
    qe: 'The diagram shows a combination of a right pyramid and a cuboid with a square base. The volume of the combined solid is 832 cm³. Calculate the perimeter of the base of the solid, in cm.',
    pil: ['24', '32', '36', '64'], jaw: 'B', sk: '<i>s</i>²(10) + FR(1|3)<i>s</i>²(9) = 13<i>s</i>² = 832 → <i>s</i> = 8 → 4 × 8 = 32' },

  // ---------------- SET 5 · BAHAGIAN B ----------------
  { id: 'T2S5-B01', bhg: 'B', bab: 4, parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Mengingat', q: 'Sebuah poligon sekata mempunyai 10 bucu. Bulatkan jawapan yang betul.', qe: 'A regular polygon has 10 vertices. Circle the correct answers.',
      items: [{ t: 'Nama poligon: CH(Nonagon|Dekagon|Dodekagon)', te: 'Name of polygon: CH(Nonagon|Decagon|Dodecagon)', a: 'Dekagon' }, { t: 'Bilangan paksi simetri: CH(5|10|20)', te: 'Number of axes of symmetry', a: '10' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Isi tempat kosong.', qe: 'Fill in the blanks.',
      items: [{ t: 'Sudut pedalaman sebuah heksagon sekata = __________', te: 'The interior angle of a regular hexagon = __________', a: '120°' }, { t: 'Hasil tambah sudut pedalaman sebuah pentagon = __________', te: 'The sum of the interior angles of a pentagon = __________', a: '540°' }] }] },
  { id: 'T2S5-B02', bhg: 'B', bab: 5, parts: [
    { l: '', jenis: 'garis', m: 4, aras: 'R', kon: 'Memahami', q: 'Gariskan jawapan yang betul.', qe: 'Underline the correct answers.',
      items: [{ t: 'Perentas yang melalui pusat bulatan ialah CH(diameter|jejari).', te: 'A chord that passes through the centre of a circle is a CH(diameter|radius).', a: 'diameter' },
        { t: 'Dua perentas yang sama panjang adalah sama jarak dari CH(lilitan|pusat) bulatan.', te: 'Two chords of equal length are equidistant from the CH(circumference|centre) of the circle.', a: 'pusat' },
        { t: 'Lengkok yang sama panjang dicangkum oleh CH(perentas|tembereng) yang sama panjang.', te: 'Arcs of equal length are subtended by CH(chords|segments) of equal length.', a: 'perentas' },
        { t: 'Jejari yang berserenjang dengan perentas CH(membahagi dua sama|memanjangkan) perentas itu.', te: 'A radius perpendicular to a chord CH(bisects|extends) the chord.', a: 'membahagi dua sama' }] }] },
  { id: 'T2S5-B03', bhg: 'B', bab: 6, parts: [
    { l: '', jenis: 'pad', m: 4, aras: 'R', kon: 'Memahami', q: 'Padankan setiap sifat geometri dengan pepejal yang betul.', qe: 'Match each geometric property with the correct solid.',
      items: [{ t: 'Satu tapak segi empat sama dan empat muka segi tiga', te: 'One square base and four triangular faces', a: 'Piramid' }, { t: 'Keratan rentas seragam berbentuk segi tiga', te: 'Uniform triangular cross section', a: 'Prisma' },
        { t: 'Satu permukaan melengkung dan tiada bucu', te: 'One curved surface and no vertices', a: 'Sfera' }, { t: 'Dua tapak bulatan dan satu permukaan melengkung', te: 'Two circular bases and one curved surface', a: 'Silinder' }],
      kanan: ['Silinder', 'Sfera', 'Piramid', 'Prisma'], kanane: ['Cylinder', 'Sphere', 'Pyramid', 'Prism'] }] },
  { id: 'T2S5-B04', bhg: 'B', bab: 6, babs: [1, 6], parts: [
    { l: '(a)', jenis: 'bp', m: 2, aras: 'S', kon: 'Menganalisis', q: 'Diberi jujukan nombor 2.5, 4, 5.5, 7, … Tulis <b>Benar</b> atau <b>Palsu</b>.', qe: 'Given the number sequence 2.5, 4, 5.5, 7, … Write <b>True</b> or <b>False</b>.',
      items: [{ t: 'Sebutan ke-<i>n</i> ialah 2.5 + 1.5(<i>n</i> − 1).', te: 'The <i>n</i>th term is 2.5 + 1.5(<i>n</i> − 1).', a: 'Benar' }, { t: '17.5 ialah sebutan ke-10.', te: '17.5 is the 10th term.', a: 'Palsu' }], sk: 'Sebutan ke-10 = 2.5 + 13.5 = 16' },
    { l: '(b)', jenis: 'bulat', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Cari nilai <i>t</i> bagi setiap pepejal. Bulatkan jawapan yang betul. (Guna π = FR(22|7))', qe: 'Find the value of <i>t</i> for each solid. Circle the correct answers. (Use π = FR(22|7))',
      items: [{ t: 'Silinder berjejari 7 cm, tinggi <i>t</i> cm, isi padu 1 540 cm³: <i>t</i> = CH(8|10|12)', te: 'Cylinder of radius 7 cm, height <i>t</i> cm, volume 1 540 cm³', a: '10' },
        { t: 'Kon berjejari 3 cm, tinggi <i>t</i> cm, isi padu 132 cm³: <i>t</i> = CH(12|14|21)', te: 'Cone of radius 3 cm, height <i>t</i> cm, volume 132 cm³', a: '14' }] }] },
  { id: 'T2S5-B05', bhg: 'B', bab: 5, fig: 'S5B05', q: 'Rajah menunjukkan sebuah segi empat tepat <i>PQRS</i>. <i>QV</i> ialah lengkok bulatan berpusat <i>R</i>. (Guna π = FR(22|7))',
    qe: 'The diagram shows a rectangle <i>PQRS</i>. <i>QV</i> is an arc of a circle with centre <i>R</i>. (Use π = FR(22|7))', parts: [
    { l: '', jenis: 'bulat', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Bulatkan jawapan yang betul.', qe: 'Circle the correct answers.',
      items: [{ t: 'Panjang lengkok <i>QV</i>: CH(7 cm|11 cm|22 cm)', te: 'Arc length of <i>QV</i>', a: '11 cm' }, { t: 'Luas sektor <i>QRV</i>: CH(38.5 cm²|49 cm²|77 cm²)', te: 'Area of sector <i>QRV</i>', a: '38.5 cm²' },
        { t: 'Luas kawasan berlorek: CH(49 cm²|59.5 cm²|98 cm²)', te: 'Area of the shaded region', a: '59.5 cm²' }, { t: 'Perimeter kawasan berlorek: CH(35 cm|39 cm|46 cm)', te: 'Perimeter of the shaded region', a: '39 cm' }],
      sk: 'Lengkok = FR(1|4) × 2 × FR(22|7) × 7 = 11<br>Sektor = FR(1|4) × FR(22|7) × 7² = 38.5<br>Berlorek = 98 − 38.5 = 59.5<br>Perimeter = 14 + 11 + 7 + 7 = 39' }] },

  // ---------------- SET 5 · BAHAGIAN C ----------------
  { id: 'T2S5-C01', bhg: 'C', bab: 1, parts: [
    { l: '(a)', m: 3, aras: 'R', kon: 'Menganalisis', q: 'Tentukan sama ada setiap senarai nombor berikut ialah suatu jujukan. Jika ya, nyatakan nombor seterusnya.<br>(i) −20, −10, −5, −2.5, …<br>(ii) 4, 7, 6, 9, 3, …',
      qe: 'Determine whether each of the following lists of numbers is a sequence. If yes, state the next number.<br>(i) −20, −10, −5, −2.5, …<br>(ii) 4, 7, 6, 9, 3, …',
      sk: '(i) Ya (bahagi 2) <b>P1</b>; −1.25 <b>N1</b><br>(ii) Bukan jujukan <b>P1</b>' },
    { l: '(b)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Diberi jujukan nombor 6.3, 4.8, 3.3, 1.8, …<br>(i) Nyatakan sebutan ke-<i>n</i> bagi jujukan itu dalam ungkapan algebra.<br>(ii) Tentukan −10.2 ialah sebutan yang keberapa.',
      qe: 'Given the number sequence 6.3, 4.8, 3.3, 1.8, …<br>(i) State the <i>n</i>th term of the sequence as an algebraic expression.<br>(ii) Determine which term −10.2 is.',
      sk: '(i) 6.3 − 1.5(<i>n</i> − 1) <b>P2</b><br>(ii) 6.3 − 1.5(<i>n</i> − 1) = −10.2 <b>K1</b> → <i>n</i> = 12, sebutan ke-12 <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'T', kon: 'Menganalisis', q: 'Bilangan titik dalam empat corak pertama suatu jujukan ialah 1, 3, 6, 10, … Hitung bilangan titik dalam corak ke-7.', qe: 'The numbers of dots in the first four patterns of a sequence are 1, 3, 6, 10, … Calculate the number of dots in the 7th pattern.',
      sk: 'Beza: 2, 3, 4, 5, 6, 7 <b>K1</b><br>10, 15, 21, 28 <b>K1</b><br>28 titik <b>N1</b>' }] },
  { id: 'T2S5-C02', bhg: 'C', bab: 2, parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Mengaplikasi', q: '(i) Kembangkan:<br>&nbsp;&nbsp;a. 4<i>y</i>(2<i>y</i> − 5)<br>&nbsp;&nbsp;b. (<i>y</i> + 7)²<br>(ii) Cari faktor sepunya terbesar bagi 10<i>m</i>² dan 15<i>m</i>.',
      qe: '(i) Expand:<br>&nbsp;&nbsp;a. 4<i>y</i>(2<i>y</i> − 5)<br>&nbsp;&nbsp;b. (<i>y</i> + 7)²<br>(ii) Find the highest common factor of 10<i>m</i>² and 15<i>m</i>.',
      sk: '(i) a. 8<i>y</i>² − 20<i>y</i> <b>N1</b>; b. <i>y</i>² + 14<i>y</i> + 49 <b>N1</b><br>(ii) 5<i>m</i> <b>P2</b>' },
    { l: '(b)', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Ungkapkan FR(2|3<i>x</i>) + FR(5|6<i>x</i>) sebagai satu pecahan tunggal dalam bentuk termudah.', qe: 'Express FR(2|3<i>x</i>) + FR(5|6<i>x</i>) as a single fraction in its simplest form.',
      sk: 'FR(4 + 5|6<i>x</i>) <b>K1</b> = FR(3|2<i>x</i>) <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menganalisis', fig: 'S5C02', q: 'Rajah menunjukkan sebuah segi empat sama bersisi (2<i>x</i> + 3) cm. Sebuah segi empat sama kecil bersisi <i>x</i> cm tidak berlorek.<br>(i) Ungkapkan luas kawasan berlorek dalam sebutan <i>x</i>.<br>(ii) Hitung luas kawasan berlorek apabila <i>x</i> = 4.',
      qe: 'The diagram shows a square with sides of (2<i>x</i> + 3) cm. A small square with sides of <i>x</i> cm is unshaded.<br>(i) Express the area of the shaded region in terms of <i>x</i>.<br>(ii) Calculate the area of the shaded region when <i>x</i> = 4.',
      sk: '(i) (2<i>x</i> + 3)² − <i>x</i>² <b>K1</b> = 3<i>x</i>² + 12<i>x</i> + 9 <b>N1</b><br>(ii) 3(16) + 12(4) + 9 <b>K1</b> = 105 cm² <b>N1</b>' }] },
  { id: 'T2S5-C03', bhg: 'C', bab: 3, parts: [
    { l: '(a)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Ungkapkan <i>p</i> sebagai perkara rumus.<br>(i) <i>k</i> = FR(<i>p</i> + 3|4)<br>(ii) 6<i>m</i> = 5<i>p</i> − 9', qe: 'Express <i>p</i> as the subject of the formula.<br>(i) <i>k</i> = FR(<i>p</i> + 3|4)<br>(ii) 6<i>m</i> = 5<i>p</i> − 9',
      sk: '(i) 4<i>k</i> = <i>p</i> + 3 <b>K1</b>; <i>p</i> = 4<i>k</i> − 3 <b>N1</b><br>(ii) 5<i>p</i> = 6<i>m</i> + 9 <b>K1</b>; <i>p</i> = FR(6<i>m</i> + 9|5) <b>N1</b>' },
    { l: '(b)', m: 4, aras: 'T', kon: 'Menganalisis', q: 'Sebuah tabung mengandungi <i>m</i> keping wang kertas RM5, <i>n</i> keping RM10 dan <i>t</i> keping RM20. Jumlah nilai wang ialah RM300. Bilangan wang kertas RM5 ialah 40% daripada bilangan wang kertas RM10. Tulis satu rumus bagi <i>t</i> dalam sebutan <i>n</i>.',
      qe: 'A money box contains <i>m</i> RM5 notes, <i>n</i> RM10 notes and <i>t</i> RM20 notes. The total value is RM300. The number of RM5 notes is 40% of the number of RM10 notes. Write a formula for <i>t</i> in terms of <i>n</i>.',
      sk: '5<i>m</i> + 10<i>n</i> + 20<i>t</i> = 300 <b>K1</b>; <i>m</i> = 0.4<i>n</i> <b>K1</b><br>2<i>n</i> + 10<i>n</i> + 20<i>t</i> = 300 <b>K1</b><br><i>t</i> = FR(300 − 12<i>n</i>|20) atau <i>t</i> = 15 − FR(3<i>n</i>|5) <b>N1</b>' },
    { l: '(c)', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Berdasarkan rumus di (b), hitung bilangan wang kertas RM20 jika terdapat 15 keping wang kertas RM10.', qe: 'Based on the formula in (b), calculate the number of RM20 notes if there are 15 RM10 notes.',
      sk: '<i>t</i> = 15 − FR(3(15)|5) <b>K1</b> = 6 <b>N1</b>' }] },
  { id: 'T2S5-C04', bhg: 'C', bab: 4, kbat: true, parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Mengaplikasi', q: 'Sudut pedalaman sebuah poligon sekata ialah 140°. Hitung<br>(i) sudut peluaran poligon itu,<br>(ii) bilangan sisi poligon itu,<br>(iii) hasil tambah sudut pedalaman poligon itu.',
      qe: 'The interior angle of a regular polygon is 140°. Calculate<br>(i) the exterior angle of the polygon,<br>(ii) the number of sides of the polygon,<br>(iii) the sum of the interior angles of the polygon.',
      sk: '(i) 40° <b>N1</b><br>(ii) FR(360°|40°) <b>K1</b> = 9 <b>N1</b><br>(iii) 9 × 140° = 1 260° <b>N1</b>' },
    { l: '(b)', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Hasil tambah sudut pedalaman sebuah poligon sekata ialah 1 800°. Hitung sudut peluaran poligon itu.', qe: 'The sum of the interior angles of a regular polygon is 1 800°. Calculate the exterior angle of the polygon.',
      sk: '(<i>n</i> − 2) × 180° = 1 800° → <i>n</i> = 12 <b>K1</b>; 30° <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menilai', q: 'Sekeping heksagon sekata dan sekeping oktagon sekata daripada kadbod dicantumkan pada satu sisi sepunya. Pada bucu sepunya <i>Q</i>, terdapat satu ruang di antara kedua-dua kepingan. Adakah sekeping poligon sekata boleh dimuatkan tepat ke dalam ruang itu? Berikan justifikasi.',
      qe: 'A regular hexagon and a regular octagon made of cardboard are joined along a common side. At the common vertex <i>Q</i>, there is a gap between the two pieces. Can a regular polygon fit exactly into the gap? Give a justification.',
      sk: 'Sudut pedalaman heksagon = 120°, oktagon = 135° <b>K1</b><br>Ruang = 360° − 120° − 135° = 105° <b>K1</b><br>Sudut peluaran = 180° − 105° = 75°; FR(360°|75°) = 4.8 bukan nombor bulat <b>K1</b><br>Tidak boleh <b>N1</b>' }] },
  { id: 'T2S5-C05', bhg: 'C', bab: 5, parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Mengingat', q: 'Lengkapkan pernyataan berikut dengan perkataan yang sesuai.<br>(i) Diameter ialah perentas yang melalui ____________ bulatan.<br>(ii) Tembereng ialah rantau yang dibatasi oleh satu ____________ dan satu ____________.<br>(iii) ____________ ialah garis lurus yang menyambungkan pusat bulatan dengan satu titik pada lilitan.',
      qe: 'Complete the following statements with suitable words.<br>(i) A diameter is a chord that passes through the ____________ of a circle.<br>(ii) A segment is a region bounded by a ____________ and an ____________.<br>(iii) A ____________ is a straight line joining the centre of a circle to a point on the circumference.',
      sk: '(i) pusat <b>P1</b><br>(ii) perentas, lengkok <b>P2</b><br>(iii) Jejari <b>P1</b>' },
    { l: '(b)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Hitung diameter sebuah bulatan, dalam cm, jika lilitannya ialah 52.8 cm. (Guna π = FR(22|7))', qe: 'Calculate the diameter of a circle, in cm, if its circumference is 52.8 cm. (Use π = FR(22|7))',
      sk: 'FR(22|7) × <i>d</i> = 52.8 <b>K1</b>; <i>d</i> = 16.8 cm <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menganalisis', fig: 'S5C05', q: 'Rajah menunjukkan sebuah sukuan bulatan <i>OPQ</i> berpusat <i>O</i> dan sebuah segi empat sama <i>OSTV</i>. Diberi <i>OP</i> = 14 cm dan <i>OV</i> : <i>OP</i> = 2 : 7. Hitung luas kawasan berlorek, dalam cm². (Guna π = FR(22|7))',
      qe: 'The diagram shows a quadrant <i>OPQ</i> with centre <i>O</i> and a square <i>OSTV</i>. Given <i>OP</i> = 14 cm and <i>OV</i> : <i>OP</i> = 2 : 7. Calculate the area of the shaded region, in cm². (Use π = FR(22|7))',
      sk: '<i>OV</i> = 4 cm <b>K1</b><br>Sukuan = FR(1|4) × FR(22|7) × 14² = 154 <b>K1</b><br>154 − 4² <b>K1</b> = 138 cm² <b>N1</b>' }] },
  { id: 'T2S5-C06', bhg: 'C', bab: 6, parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Memahami', q: '(i) Namakan pepejal yang mempunyai sifat berikut.<br>&nbsp;&nbsp;a. Mempunyai dua tapak segi tiga yang kongruen dan selari.<br>&nbsp;&nbsp;b. Tiada bucu dan hanya satu permukaan melengkung.<br>(ii) Nyatakan bilangan muka, tepi dan bucu bagi sebuah piramid bertapak segi empat sama.',
      qe: '(i) Name the solid with the following properties.<br>&nbsp;&nbsp;a. It has two congruent and parallel triangular bases.<br>&nbsp;&nbsp;b. It has no vertices and only one curved surface.<br>(ii) State the number of faces, edges and vertices of a pyramid with a square base.',
      sk: '(i) a. Prisma segi tiga <b>P1</b>; b. Sfera <b>P1</b><br>(ii) 5 muka, 8 tepi, 5 bucu <b>P2</b>' },
    { l: '(b)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Sebuah prisma tegak mempunyai keratan rentas berbentuk segi tiga bersudut tegak dengan tapak 6 cm dan tinggi 8 cm. Panjang prisma ialah 15 cm. Hitung isi padu prisma itu, dalam cm³.',
      qe: 'A right prism has a right-angled triangular cross section with a base of 6 cm and a height of 8 cm. The length of the prism is 15 cm. Calculate the volume of the prism, in cm³.',
      sk: 'FR(1|2) × 6 × 8 × 15 <b>K1</b> = 360 cm³ <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menilai', q: 'Sebuah bongkah kayu berbentuk separuh silinder mempunyai diameter 14 cm dan panjang 20 cm. Hakim ingin mengecat seluruh permukaan bongkah itu. Setiap 10 cm² memerlukan 20 mℓ cat. Dia mempunyai setin cat berisi 1.5 ℓ. Adakah cat itu mencukupi? Tunjukkan pengiraan anda. (Guna π = FR(22|7))',
      qe: 'A wooden block in the shape of a half cylinder has a diameter of 14 cm and a length of 20 cm. Hakim wants to paint the whole surface of the block. Every 10 cm² needs 20 mℓ of paint. He has a 1.5 ℓ tin of paint. Is the paint enough? Show your calculation. (Use π = FR(22|7))',
      sk: 'Permukaan melengkung = FR(22|7) × 7 × 20 = 440; dua semibulatan = 154; tapak = 14 × 20 = 280 <b>K1</b><br>Jumlah = 874 cm² <b>K1</b><br>Cat = 874 × 2 = 1 748 mℓ <b>K1</b><br>1 748 mℓ > 1 500 mℓ, tidak mencukupi <b>N1</b>' }] }
);
