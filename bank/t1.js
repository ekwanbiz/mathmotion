'use strict';
/* =================== BANK SOALAN · TINGKATAN 1 · SET 1 (format UASA, bab KP2027) ===================
   Set 1 (27 Nov 2026): 20 A · 5 B · 6 C. Diolah semula oleh Mat berdasarkan bentuk dan aras kertas
   UASA 2024 SMKRP (rujukan: Downloads/Bank Soalan/1.Soalan UASA Lengkap 2024.docx). Soalan topik Set
   (tiada dalam KP2027 T1) diganti dengan soalan Faktor dan Gandaan pada aras yang sama.
   Bab ikut BAB[1] dalam bank.js. Dimuat selepas t2.js dan t2s2.js (guna BS_FIG, bsGrid, bsLine). */

const BS_T1F = (pts, alt) => `<svg viewBox="0 0 110 70" width="100" role="img" aria-label="${alt}"><polygon points="${pts}" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
const BS_IT = s => `<tspan font-style="italic">${s}</tspan>`;

Object.assign(BS_FIG, {
  T1A15: `<svg viewBox="0 0 240 150" width="220" role="img" aria-label="Sisi empat PQRS dengan sudut tegak di R, sudut 75 darjah di P, sudut 120 darjah di luar S dan sudut refleks x di Q">
    <g fill="none" stroke="currentColor" stroke-width="2"><polygon points="40,125 40,70 110,18 150,125"/><line x1="150" y1="125" x2="225" y2="125"/>
    <rect x="40" y="113" width="12" height="12" stroke-width="1.3"/><path d="M98 27 A15 15 0 0 0 115 33" stroke-width="1.3"/><path d="M172 125 A22 22 0 0 0 142 104" stroke-width="1.3"/>
    <path d="M34 62 A12 12 0 1 0 48 64" stroke-width="1.3"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12"><text x="106" y="13" font-style="italic">P</text><text x="46" y="70" font-style="italic">Q</text><text x="30" y="140" font-style="italic">R</text><text x="146" y="140" font-style="italic">S</text><text x="222" y="140" font-style="italic">T</text>
    <text x="104" y="46">75°</text><text x="170" y="112">120°</text><text x="16" y="66" font-style="italic">x</text></g></svg>`,
  T1A17: `<svg viewBox="0 0 250 120" width="230" role="img" aria-label="Segi empat selari dengan sisi condong 13 cm dan tinggi 12 cm">
    <g fill="none" stroke="currentColor" stroke-width="2"><polygon points="20,105 180,105 230,15 70,15"/></g>
    <line x1="180" y1="15" x2="180" y2="105" stroke="currentColor" stroke-dasharray="4 3"/><rect x="170" y="95" width="10" height="10" fill="none" stroke="currentColor"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12"><text x="10" y="58">13 cm</text><text x="186" y="64">12 cm</text></g></svg>`,
  T1A19: `<svg viewBox="0 0 260 110" width="240" role="img" aria-label="Jongkang-jongket: y kg dan 4 kg di kiri, 11 kg di kanan; sebelah kanan lebih rendah">
    <polygon points="130,78 120,96 140,96" fill="currentColor"/><line x1="20" y1="58" x2="240" y2="98" stroke="currentColor" stroke-width="5"/>
    <g fill="var(--bg,#fff)" stroke="currentColor" stroke-width="1.6"><rect x="30" y="34" width="40" height="22"/><rect x="72" y="42" width="40" height="22" transform="rotate(10.3 92 53)"/><rect x="186" y="58" width="48" height="26" transform="rotate(10.3 210 71)"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12" text-anchor="middle"><text x="50" y="50"><tspan font-style="italic">y</tspan> kg</text><text x="92" y="60">4 kg</text><text x="210" y="76">11 kg</text></g></svg>`,
  T1A20: `<svg viewBox="0 0 240 150" width="220" role="img" aria-label="Segi empat tepat KLMN 14 cm kali 10 cm dengan pepenjuru KM; segi tiga KLM dan segi empat tepat NPQR berlorek">
    <g fill="currentColor" fill-opacity=".25"><polygon points="30,20 190,20 190,130"/><rect x="30" y="75" width="80" height="55"/></g>
    <g fill="none" stroke="currentColor" stroke-width="2"><rect x="30" y="20" width="160" height="110"/><line x1="30" y1="20" x2="190" y2="130"/><polyline points="30,75 110,75 110,130"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12"><text x="20" y="16" font-style="italic">K</text><text x="192" y="16" font-style="italic">L</text><text x="194" y="144" font-style="italic">M</text><text x="18" y="144" font-style="italic">N</text>
    <text x="18" y="79" font-style="italic">P</text><text x="112" y="72" font-style="italic">Q</text><text x="106" y="144" font-style="italic">R</text><text x="94" y="14">14 cm</text><text x="194" y="79">10 cm</text></g></svg>`,
  T1B03: `<svg viewBox="0 0 200 130" width="180" role="img" aria-label="Pokok faktor bagi 70 dengan petak kosong">
    <g stroke="currentColor" stroke-width="1.5"><line x1="100" y1="22" x2="60" y2="52"/><line x1="100" y1="22" x2="140" y2="52"/><line x1="140" y1="72" x2="110" y2="100"/><line x1="140" y1="72" x2="170" y2="100"/></g>
    <g fill="var(--bg,#fff)" stroke="currentColor" stroke-width="1.5"><rect x="44" y="52" width="32" height="22" rx="3"/><rect x="94" y="100" width="32" height="22" rx="3"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="14" text-anchor="middle"><text x="100" y="18">70</text><text x="60" y="68">(i)</text><text x="140" y="68">35</text><text x="110" y="116">(ii)</text><text x="170" y="116">7</text></g></svg>`,
  T1C03: `<svg viewBox="0 0 200 150" width="180" role="img" aria-label="Segi tiga sama kaki dengan sisi sama (3a − 2) cm dan (a + 6) cm, tapak 2b cm">
    <polygon points="100,15 30,130 170,130" fill="none" stroke="currentColor" stroke-width="2"/>
    <g stroke="currentColor" stroke-width="1.5"><line x1="60" y1="70" x2="68" y2="76"/><line x1="140" y1="70" x2="132" y2="76"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12"><text x="0" y="70">(3<tspan font-style="italic">a</tspan> − 2) cm</text><text x="142" y="62">(<tspan font-style="italic">a</tspan> + 6) cm</text><text x="84" y="146">2<tspan font-style="italic">b</tspan> cm</text></g></svg>`,
  T1C04: `<svg viewBox="0 0 200 150" width="180" role="img" aria-label="Segi tiga sama kaki ABC, AB = AC = 13 cm, BC = 10 cm, AD tegak lurus dengan BC">
    <polygon points="100,15 35,130 165,130" fill="none" stroke="currentColor" stroke-width="2"/><line x1="100" y1="15" x2="100" y2="130" stroke="currentColor" stroke-dasharray="4 3"/>
    <rect x="100" y="120" width="10" height="10" fill="none" stroke="currentColor"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12"><text x="96" y="11" font-style="italic">A</text><text x="22" y="144" font-style="italic">B</text><text x="168" y="144" font-style="italic">C</text><text x="96" y="146" font-style="italic">D</text>
    <text x="30" y="70">13 cm</text><text x="138" y="70">13 cm</text><text x="118" y="146">10 cm</text></g></svg>`,
  T1C05a: `<svg viewBox="0 0 150 150" width="140" role="img" aria-label="Rajah berbentuk salib yang terdiri daripada lima segi empat sama yang sama saiz">
    <g fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="2"><rect x="55" y="10" width="40" height="40"/><rect x="15" y="50" width="40" height="40"/><rect x="55" y="50" width="40" height="40"/><rect x="95" y="50" width="40" height="40"/><rect x="55" y="90" width="40" height="40"/></g></svg>`,
  T1C05b: `<svg viewBox="0 0 300 180" width="280" role="img" aria-label="Tiga garis selari AB, CD dan EF dipotong oleh dua garis rentas lintang; sudut p, q, n, m, 70 darjah dan 115 darjah">
    <g stroke="currentColor" stroke-width="2"><line x1="20" y1="30" x2="280" y2="30"/><line x1="20" y1="90" x2="280" y2="90"/><line x1="20" y1="150" x2="280" y2="150"/></g>
    <g stroke="currentColor" stroke-width="1.6"><line x1="60" y1="10" x2="160" y2="170"/><line x1="250" y1="10" x2="190" y2="170"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12"><text x="8" y="34" font-style="italic">A</text><text x="284" y="34" font-style="italic">B</text><text x="8" y="94" font-style="italic">C</text><text x="284" y="94" font-style="italic">D</text><text x="8" y="154" font-style="italic">E</text><text x="284" y="154" font-style="italic">F</text>
    <text x="84" y="46" font-style="italic">p</text><text x="94" y="84" font-style="italic">q</text><text x="120" y="106" font-style="italic">n</text><text x="156" y="166">70°</text>
    <text x="222" y="108">115°</text><text x="206" y="144" font-style="italic">m</text></g></svg>`,
  T1C05c: `<svg viewBox="0 0 300 60" width="290" role="img" aria-label="Garis nombor dengan selang yang sama: −3.2, P, Q, −0.5, R">
    <g stroke="currentColor" stroke-width="1.6"><line x1="10" y1="25" x2="290" y2="25"/>${[30, 90, 150, 210, 270].map(x => `<line x1="${x}" y1="18" x2="${x}" y2="32"/>`).join('')}</g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="13" text-anchor="middle"><text x="30" y="50">−3.2</text><text x="90" y="50" font-style="italic">P</text><text x="150" y="50" font-style="italic">Q</text><text x="210" y="50">−0.5</text><text x="270" y="50" font-style="italic">R</text></g></svg>`,
  T1C06a: bsLine({ w: 290, h: 180, xm: 5.6, ym: 240, p: [[1, 120], [2, 180], [3, 150]], gy: [[5.4, 60], [5.4, 120], [5.4, 180], [5.4, 240]], tx: [[1, 'Isnin'], [2, 'Selasa'], [3, 'Rabu'], [4, 'Khamis'], [5, 'Jumaat']], ty: [[60], [120], [180], [240]], xl: 'Hari', yl: 'Bilangan bungkus', alt: 'Graf garis tidak lengkap: Isnin 120, Selasa 180, Rabu 150' })
});

const BS_T1 = [
  // ---------------- SET 1 · BAHAGIAN A ----------------
  { id: 'T1S1-A01', bhg: 'A', bab: 1, kon: 'Mengingat', aras: 'R', why: 'Kenal pasti integer negatif', m: 1,
    q: 'Antara berikut, yang manakah integer negatif?', qe: 'Which of the following is a negative integer?',
    pil: ['−0.8', '−18', '−FR(1|2)', '18'], jaw: 'B', sk: 'Integer ialah nombor bulat; −18 ialah integer negatif' },
  { id: 'T1S1-A02', bhg: 'A', bab: 1, kon: 'Memahami', aras: 'R', why: 'Kenal pasti kuasa tiga sempurna', m: 1,
    q: 'Antara berikut, yang manakah <b>bukan</b> kuasa tiga sempurna?', qe: 'Which of the following is <b>not</b> a perfect cube?',
    pil: ['64', '125', '144', '216'], jaw: 'C', sk: '64 = 4³, 125 = 5³, 216 = 6³; 144 = 12² (bukan kuasa tiga)' },
  { id: 'T1S1-A03', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'S', why: 'Gabung dua nisbah dengan sebutan sepunya', m: 1,
    q: 'Diberi <i>p</i> : <i>q</i> = 4 : 5 dan <i>q</i> : <i>r</i> = 10 : 9. Cari <i>p</i> : <i>q</i> : <i>r</i>.', qe: 'Given <i>p</i> : <i>q</i> = 4 : 5 and <i>q</i> : <i>r</i> = 10 : 9. Find <i>p</i> : <i>q</i> : <i>r</i>.',
    pil: ['4 : 5 : 9', '8 : 10 : 9', '4 : 10 : 9', '8 : 5 : 9'], jaw: 'B', sk: '<i>p</i> : <i>q</i> = 8 : 10, jadi <i>p</i> : <i>q</i> : <i>r</i> = 8 : 10 : 9' },
  { id: 'T1S1-A04', bhg: 'A', bab: 4, kon: 'Memahami', aras: 'R', why: 'Bilangan sebutan dalam ungkapan', m: 1,
    q: 'Tentukan bilangan sebutan dalam ungkapan algebra 5<i>p</i>² − 2<i>pq</i> + <i>q</i> − 8 + 3<i>p</i>.', qe: 'Determine the number of terms in the algebraic expression 5<i>p</i>² − 2<i>pq</i> + <i>q</i> − 8 + 3<i>p</i>.',
    pil: ['3', '4', '5', '6'], jaw: 'C', sk: 'Sebutan: 5<i>p</i>², −2<i>pq</i>, <i>q</i>, −8, 3<i>p</i> → 5' },
  { id: 'T1S1-A05', bhg: 'A', bab: 6, kon: 'Memahami', aras: 'R', why: 'Jenis sudut ikut saiz', m: 1,
    q: 'Antara pasangan sudut dan jenisnya berikut, yang manakah <b>benar</b>?', qe: 'Which of the following pairs of angle and type is <b>true</b>?',
    pil: ['210° — sudut refleks', '90° — sudut tirus', '180° — sudut cakah', '360° — sudut refleks'],
    pe: ['210° — reflex angle', '90° — acute angle', '180° — obtuse angle', '360° — reflex angle'], jaw: 'A', sk: 'Sudut refleks: antara 180° dan 360°' },
  { id: 'T1S1-A06', bhg: 'A', bab: 7, kon: 'Mengingat', aras: 'R', why: 'Kenal pasti sisi empat daripada bentuk', m: 1,
    q: 'Antara berikut, yang manakah rombus?', qe: 'Which of the following is a rhombus?',
    pil: [BS_T1F('25,60 85,60 70,12 40,12', 'Trapezium'), BS_T1F('55,5 85,28 55,66 25,28', 'Lelayang'), BS_T1F('8,60 78,60 102,12 32,12', 'Segi empat selari'), BS_T1F('15,62 65,62 95,22 45,22', 'Rombus')],
    jaw: 'D', sk: 'Rombus: semua sisi sama panjang dan dua pasang sisi bertentangan selari' },
  { id: 'T1S1-A07', bhg: 'A', bab: 8, kon: 'Memahami', aras: 'R', why: 'Pilih perwakilan data yang sesuai', m: 1,
    q: 'Seorang guru ingin menunjukkan peratusan murid mengikut buah kegemaran dalam sebuah kelas. Antara perwakilan data berikut, yang manakah paling sesuai?',
    qe: 'A teacher wants to show the percentage of pupils by favourite fruit in a class. Which of the following data representations is the most suitable?',
    pil: ['Graf garis', 'Carta pai', 'Plot batang-dan-daun', 'Histogram'], pe: ['Line graph', 'Pie chart', 'Stem-and-leaf plot', 'Histogram'], jaw: 'B', sk: 'Carta pai menunjukkan bahagian daripada keseluruhan' },
  { id: 'T1S1-A08', bhg: 'A', bab: 7, kon: 'Memahami', aras: 'R', why: 'Kenal pasti sisi empat daripada sifat geometri', m: 1,
    q: 'Berikut ialah sifat geometri sebuah sisi empat.<br>• Dua pasang sisi bersebelahan sama panjang.<br>• Mempunyai satu paksi simetri sahaja.<br>Apakah sisi empat itu?',
    qe: 'The following are the geometric properties of a quadrilateral.<br>• Two pairs of adjacent sides are equal in length.<br>• It has only one axis of symmetry.<br>What is the quadrilateral?',
    pil: ['Segi empat selari', 'Trapezium', 'Lelayang', 'Rombus'], pe: ['Parallelogram', 'Trapezium', 'Kite', 'Rhombus'], jaw: 'C' },
  { id: 'T1S1-A09', bhg: 'A', bab: 2, kon: 'Mengingat', aras: 'R', why: 'Kenal pasti nombor perdana', m: 1,
    q: 'Antara berikut, yang manakah nombor perdana?', qe: 'Which of the following is a prime number?',
    pil: ['21', '27', '29', '33'], jaw: 'C', sk: '21 = 3 × 7, 27 = 3 × 9, 33 = 3 × 11; 29 hanya ada faktor 1 dan 29' },
  { id: 'T1S1-A10', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'S', why: 'FSTB tiga nombor', m: 1,
    q: 'Cari faktor sepunya terbesar (FSTB) bagi 24, 36 dan 60.', qe: 'Find the highest common factor (HCF) of 24, 36 and 60.',
    pil: ['6', '12', '24', '360'], jaw: 'B', sk: '24 = 2³ × 3, 36 = 2² × 3², 60 = 2² × 3 × 5 → FSTB = 2² × 3 = 12' },
  { id: 'T1S1-A11', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Tertib operasi integer', m: 1,
    q: 'Hitung nilai −15 + (−6) ÷ 3 × (−2).', qe: 'Calculate the value of −15 + (−6) ÷ 3 × (−2).',
    pil: ['−19', '−11', '6', '14'], jaw: 'B', sk: '(−6) ÷ 3 × (−2) = 4 → −15 + 4 = −11' },
  { id: 'T1S1-A12', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Tertib operasi pecahan', m: 1,
    q: 'Hitung nilai FR(2|3) − FR(5|6) × FR(4|5).', qe: 'Calculate the value of FR(2|3) − FR(5|6) × FR(4|5).',
    pil: ['−FR(2|15)', '0', 'FR(2|15)', 'FR(1|6)'], jaw: 'B', sk: 'FR(5|6) × FR(4|5) = FR(2|3) → FR(2|3) − FR(2|3) = 0' },
  { id: 'T1S1-A13', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'R', why: 'Darab dua sebutan algebra', m: 1,
    q: 'Cari hasil darab bagi −2<i>xy</i>² dan 5<i>x</i>²<i>y</i>.', qe: 'Find the product of −2<i>xy</i>² and 5<i>x</i>²<i>y</i>.',
    pil: ['−10<i>x</i>³<i>y</i>³', '10<i>x</i>³<i>y</i>³', '−10<i>x</i>²<i>y</i>²', '3<i>x</i>³<i>y</i>³'], jaw: 'A', sk: '(−2)(5) = −10; <i>x</i> × <i>x</i>² = <i>x</i>³; <i>y</i>² × <i>y</i> = <i>y</i>³' },
  { id: 'T1S1-A14', bhg: 'A', bab: 5, kon: 'Mengaplikasi', aras: 'S', why: 'Bahagi dengan nombor negatif menukar simbol', m: 1,
    q: 'Selesaikan ketaksamaan linear 2 − <i>x</i> > 5.', qe: 'Solve the linear inequality 2 − <i>x</i> > 5.',
    pil: ['<i>x</i> < −3', '<i>x</i> > −3', '<i>x</i> < 3', '<i>x</i> > 7'], jaw: 'A', sk: '−<i>x</i> > 3 → <i>x</i> < −3' },
  { id: 'T1S1-A15', bhg: 'A', bab: 7, kon: 'Menganalisis', aras: 'S', why: 'Sudut pedalaman sisi empat dan sudut refleks', m: 1, fig: 'T1A15',
    q: 'Rajah menunjukkan sebuah sisi empat <i>PQRS</i>. <i>RST</i> ialah garis lurus. Hitung nilai <i>x</i>.', qe: 'The diagram shows a quadrilateral <i>PQRS</i>. <i>RST</i> is a straight line. Calculate the value of <i>x</i>.',
    pil: ['215°', '225°', '235°', '245°'], jaw: 'B', sk: '∠<i>PSR</i> = 180° − 120° = 60°<br>∠<i>PQR</i> = 360° − 75° − 90° − 60° = 135°<br><i>x</i> = 360° − 135° = 225°' },
  { id: 'T1S1-A16', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'S', why: 'Perkadaran dengan penukaran unit', m: 1,
    q: 'Apabila pemberat 250 g digantung pada sebatang spring, spring itu memanjang 1.5 cm. Hitung pemanjangan spring, dalam cm, jika pemberat itu diganti dengan pemberat 1.75 kg.',
    qe: 'When a 250 g weight is hung on a spring, the spring stretches by 1.5 cm. Calculate the extension of the spring, in cm, if the weight is replaced by a 1.75 kg weight.',
    pil: ['7.5', '9.0', '10.5', '12.0'], jaw: 'C', sk: '1.75 kg = 1 750 g = 7 × 250 g → 7 × 1.5 = 10.5 cm' },
  { id: 'T1S1-A17', bhg: 'A', bab: 7, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Cari tapak daripada perimeter, kemudian luas', m: 1, fig: 'T1A17',
    q: 'Rajah menunjukkan sebuah segi empat selari. Diberi perimeter segi empat selari itu ialah 70 cm. Hitung luas, dalam cm², segi empat selari itu.',
    qe: 'The diagram shows a parallelogram. Given that the perimeter of the parallelogram is 70 cm, calculate its area, in cm².',
    pil: ['156', '264', '286', '910'], jaw: 'B', sk: 'Tapak = (70 − 2 × 13) ÷ 2 = 22 cm<br>Luas = 22 × 12 = 264 cm²' },
  { id: 'T1S1-A18', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'R', why: 'Bentuk ungkapan daripada situasi', m: 1,
    q: 'Siti dan adiknya masing-masing mempunyai simpanan RM<i>m</i> dan RM<i>n</i>. Mereka berkongsi membeli hadiah berharga RM45. Berapakah baki wang mereka?',
    qe: 'Siti and her brother have savings of RM<i>m</i> and RM<i>n</i> respectively. They share the cost of a present worth RM45. How much money do they have left?',
    pil: ['RM(<i>m</i> + <i>n</i> + 45)', 'RM(<i>m</i> + <i>n</i> − 45)', 'RM(<i>m</i> − <i>n</i> − 45)', 'RM(45 − <i>mn</i>)'], jaw: 'B' },
  { id: 'T1S1-A19', bhg: 'A', bab: 5, kon: 'Menganalisis', aras: 'S', why: 'Bentuk ketaksamaan daripada situasi', m: 1, fig: 'T1A19',
    q: 'Rajah menunjukkan beberapa pemberat di atas sebuah jongkang-jongket. Antara berikut, yang manakah ketaksamaan linear yang mewakili situasi itu?',
    qe: 'The diagram shows some weights on a seesaw. Which of the following is the linear inequality that represents the situation?',
    pil: ['<i>y</i> + 4 < 11', '<i>y</i> + 4 > 11', '4<i>y</i> < 11', '<i>y</i> > 15'], jaw: 'A', sk: 'Sebelah kanan lebih berat: <i>y</i> + 4 < 11' },
  { id: 'T1S1-A20', bhg: 'A', bab: 7, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Luas gabungan bentuk menggunakan titik tengah', m: 1, fig: 'T1A20',
    q: 'Dalam rajah, <i>KLMN</i> dan <i>NPQR</i> ialah segi empat tepat. <i>P</i> dan <i>R</i> masing-masing ialah titik tengah bagi <i>KN</i> dan <i>NM</i>. Cari luas, dalam cm², kawasan berlorek.',
    qe: 'In the diagram, <i>KLMN</i> and <i>NPQR</i> are rectangles. <i>P</i> and <i>R</i> are the midpoints of <i>KN</i> and <i>NM</i> respectively. Find the area, in cm², of the shaded region.',
    pil: ['70', '105', '140', '175'], jaw: 'B', sk: 'Segi tiga <i>KLM</i> = FR(1|2) × 14 × 10 = 70<br>Segi empat tepat <i>NPQR</i> = 7 × 5 = 35<br>70 + 35 = 105' },

  // ---------------- SET 1 · BAHAGIAN B ----------------
  { id: 'T1S1-B01', bhg: 'B', bab: 1, babs: [1, 3], parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Memahami', q: 'Bulatkan kuasa dua sempurna.', qe: 'Circle the perfect square.',
      items: [{ t: 'CH(48|81|125)', a: '81' }, { t: 'CH(169|200|27)', a: '169' }] },
    { l: '(b)', jenis: 'pad', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Padankan setiap nisbah dengan nisbah setaranya.', qe: 'Match each ratio with its equivalent ratio.',
      items: [{ t: '3 : 4', a: '15 : 20' }, { t: '2 : 5', a: '0.4 : 1' }, { t: '18 : 27', a: '2 : 3' }, { t: 'FR(1|2) : FR(1|3)', a: '3 : 2' }],
      kanan: ['2 : 3', '3 : 2', '15 : 20', '0.4 : 1'] }] },
  { id: 'T1S1-B02', bhg: 'B', bab: 4, babs: [1, 4], parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Memahami', q: 'Bulatkan sebutan yang serupa dengan sebutan yang diberi.', qe: 'Circle the term that is like the given term.',
      items: [{ t: '4<i>ab</i>²: CH(4<i>a</i>²<i>b</i>|−<i>b</i>²<i>a</i>|4<i>ab</i>)', a: '−<i>b</i>²<i>a</i>' }, { t: '−7<i>k</i>: CH(7<i>k</i>²|FR(<i>k</i>|2)|−7<i>h</i>)', a: 'FR(<i>k</i>|2)' }] },
    { l: '(b)', jenis: 'tanda', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Tandakan (✓) bagi <b>semua</b> pengiraan yang memberi nilai lebih daripada −4.', qe: 'Tick (✓) <b>all</b> calculations that give a value greater than −4.',
      items: [{ t: '−10 + 7', a: '✓' }, { t: '−2 × 3', a: '' }, { t: '−12 ÷ (−4)', a: '✓' }, { t: '−1 − 5', a: '' }] }] },
  { id: 'T1S1-B03', bhg: 'B', bab: 2, parts: [
    { l: '(a)', jenis: 'isi', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Isi tempat kosong.', qe: 'Fill in the blanks.',
      items: [{ t: 'GSTK bagi 6 dan 8 = __________', te: 'LCM of 6 and 8 = __________', a: '24' }, { t: 'FSTB bagi 18 dan 27 = __________', te: 'HCF of 18 and 27 = __________', a: '9' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'R', kon: 'Mengaplikasi', fig: 'T1B03', q: 'Rajah menunjukkan pokok faktor bagi 70. Isi petak kosong dengan faktor yang sesuai.', qe: 'The diagram shows a factor tree for 70. Fill in the boxes with suitable factors.',
      items: [{ t: '__________', a: '2' }, { t: '__________', a: '5' }] }] },
  { id: 'T1S1-B04', bhg: 'B', bab: 4, babs: [4, 6], parts: [
    { l: '(a)', jenis: 'isi', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Tulis satu ungkapan algebra bagi setiap situasi berikut.', qe: 'Write an algebraic expression for each of the following situations.',
      items: [{ t: 'Tolak 3<i>k</i> daripada 12: __________', te: 'Subtract 3<i>k</i> from 12: __________', a: '12 − 3<i>k</i>' }, { t: 'Darab hasil tambah <i>a</i> dan <i>b</i> dengan 4: __________', te: 'Multiply the sum of <i>a</i> and <i>b</i> by 4: __________', a: '4(<i>a</i> + <i>b</i>)' }] },
    { l: '(b)', jenis: 'bp', m: 2, aras: 'R', kon: 'Memahami', q: 'Tentukan sama ada pernyataan berikut <b>Benar</b> atau <b>Palsu</b>.', qe: 'Determine whether each statement is <b>True</b> or <b>False</b>.',
      items: [{ t: 'Sudut penggenap bagi 65° ialah 25°.', te: 'The supplementary angle of 65° is 25°.', a: 'Palsu' }, { t: '210° dan 150° ialah sudut konjugat.', te: '210° and 150° are conjugate angles.', a: 'Benar' }] }] },
  { id: 'T1S1-B05', bhg: 'B', bab: 8, babs: [5, 8], parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Memahami', q: 'Bulatkan jenis data yang betul.', qe: 'Circle the correct type of data.',
      items: [{ t: 'Jenama telefon bimbit: CH(Data kategori|Data numerik)', te: 'Brand of mobile phone: CH(Categorical data|Numerical data)', a: 'Data kategori' },
        { t: 'Masa perjalanan ke sekolah: CH(Data kategori|Data numerik)', te: 'Travelling time to school: CH(Categorical data|Numerical data)', a: 'Data numerik' }] },
    { l: '(b)', jenis: 'tanda', m: 2, aras: 'S', kon: 'Memahami', q: 'Tandakan (✓) bagi persamaan linear dalam <b>satu</b> pemboleh ubah.', qe: 'Tick (✓) the linear equations in <b>one</b> variable.',
      items: [{ t: '3<i>k</i> − 7 = 11', a: '✓' }, { t: '2<i>m</i> + <i>n</i> = 9', a: '' }, { t: '<i>h</i>² + 1 = 10', a: '' }, { t: 'FR(<i>p</i>|4) + 2 = <i>p</i>', a: '✓' }] }] },

  // ---------------- SET 1 · BAHAGIAN C ----------------
  { id: 'T1S1-C01', bhg: 'C', bab: 1, babs: [1, 3], parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Mengaplikasi', q: 'Hitung nilai setiap yang berikut.<br>(i) −8 + 15 ÷ (−3) − (−6)<br>(ii) 2FR(1|2) − FR(3|4) × FR(2|3)', qe: 'Calculate the value of each of the following.<br>(i) −8 + 15 ÷ (−3) − (−6)<br>(ii) 2FR(1|2) − FR(3|4) × FR(2|3)',
      sk: '(i) −8 + (−5) + 6 <b>K1</b> = −7 <b>N1</b><br>(ii) FR(5|2) − FR(1|2) <b>K1</b> = 2 <b>N1</b>' },
    { l: '(b)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Hitung nilai RT(144) + ∛(−27).', qe: 'Calculate the value of RT(144) + ∛(−27).',
      sk: '12 + (−3) <b>K1</b> = 9 <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Sebuah lori bergerak sejauh 180 km dengan menggunakan 24 liter diesel. Jika lori itu bergerak sejauh 255 km dengan kadar penggunaan yang sama, berapakah isi padu diesel, dalam liter, yang digunakan?',
      qe: 'A lorry travels 180 km using 24 litres of diesel. If the lorry travels 255 km at the same rate of consumption, how much diesel, in litres, is used?',
      sk: 'Kadar = FR(180|24) = 7.5 km/ℓ <b>K1 K1</b><br>FR(255|7.5) <b>K1</b> = 34 liter <b>N1</b>' }] },
  { id: 'T1S1-C02', bhg: 'C', bab: 2, babs: [2, 4], parts: [
    { l: '(a)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Seorang guru mempunyai 48 batang pensel dan 72 biji pemadam. Dia ingin membungkus semuanya ke dalam beg kecil dengan keadaan setiap beg mengandungi bilangan pensel yang sama dan bilangan pemadam yang sama.<br>(i) Cari bilangan maksimum beg yang boleh disediakan.<br>(ii) Berapakah bilangan pensel dan pemadam dalam setiap beg?',
      qe: 'A teacher has 48 pencils and 72 erasers. She wants to pack all of them into small bags so that each bag has the same number of pencils and the same number of erasers.<br>(i) Find the maximum number of bags that can be prepared.<br>(ii) How many pencils and erasers are there in each bag?',
      sk: '(i) FSTB bagi 48 dan 72 <b>K1</b> = 24 beg <b>N1</b><br>(ii) 2 batang pensel <b>N1</b> dan 3 biji pemadam <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'R', kon: 'Mengaplikasi', q: 'Diberi <i>p</i> = −2 dan <i>q</i> = 3. Cari nilai 3<i>p</i>² − 2<i>pq</i> + <i>q</i>.', qe: 'Given <i>p</i> = −2 and <i>q</i> = 3. Find the value of 3<i>p</i>² − 2<i>pq</i> + <i>q</i>.',
      sk: '3(−2)² − 2(−2)(3) + 3 <b>K1</b><br>12 + 12 + 3 <b>K1</b> = 27 <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'T', kon: 'Menganalisis', q: 'Kamal mempunyai <i>k</i> biji guli. Badrul mempunyai 5 biji guli kurang daripada dua kali bilangan guli Kamal. Chong pula mempunyai 3<i>m</i> biji guli lebih daripada Kamal. Ungkapkan jumlah guli mereka bertiga dalam sebutan <i>k</i> dan <i>m</i>.',
      qe: 'Kamal has <i>k</i> marbles. Badrul has 5 marbles fewer than twice the number of Kamal\'s marbles. Chong has 3<i>m</i> marbles more than Kamal. Express the total number of their marbles in terms of <i>k</i> and <i>m</i>.',
      sk: 'Badrul = 2<i>k</i> − 5, Chong = <i>k</i> + 3<i>m</i> <b>K1</b><br><i>k</i> + (2<i>k</i> − 5) + (<i>k</i> + 3<i>m</i>) <b>K1</b><br>4<i>k</i> + 3<i>m</i> − 5 <b>N1</b>' }] },
  { id: 'T1S1-C03', bhg: 'C', bab: 5, babs: [3, 5, 7], parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Mengaplikasi', q: 'Selesaikan persamaan linear berikut.<br>(i) FR(<i>x</i>|3) + 4 = 9<br>(ii) 4(<i>n</i> + 3) = 30', qe: 'Solve the following linear equations.<br>(i) FR(<i>x</i>|3) + 4 = 9<br>(ii) 4(<i>n</i> + 3) = 30',
      sk: '(i) FR(<i>x</i>|3) = 5 <b>K1</b>, <i>x</i> = 15 <b>N1</b><br>(ii) 4<i>n</i> + 12 = 30 <b>K1</b>, <i>n</i> = 4.5 <b>N1</b>' },
    { l: '(b)', m: 4, aras: 'T', kon: 'Menganalisis', fig: 'T1C03', q: 'Rajah menunjukkan sebuah segi tiga sama kaki. Perimeter segi tiga itu ialah 32 cm. Cari nilai <i>a</i> dan nilai <i>b</i>.',
      qe: 'The diagram shows an isosceles triangle. The perimeter of the triangle is 32 cm. Find the value of <i>a</i> and of <i>b</i>.',
      sk: '3<i>a</i> − 2 = <i>a</i> + 6 <b>K1</b> → <i>a</i> = 4 <b>N1</b><br>Sisi sama = 10 cm; 2<i>b</i> = 32 − 20 <b>K1</b> → <i>b</i> = 6 <b>N1</b>' },
    { l: '(c)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Isi tempat kosong dengan nilai yang menjadikan nisbah itu setara.<br>(i) 15 : 35 = ______ : 7<br>(ii) 8 : 20 = 2 : ______', qe: 'Fill in the blanks with values that make the ratios equivalent.<br>(i) 15 : 35 = ______ : 7<br>(ii) 8 : 20 = 2 : ______',
      sk: '(i) 3 <b>N1</b><br>(ii) 5 <b>N1</b>' }] },
  { id: 'T1S1-C04', bhg: 'C', bab: 7, babs: [2, 5, 7], parts: [
    { l: '(a)', m: 4, aras: 'S', kon: 'Mengaplikasi', fig: 'T1C04', q: 'Rajah menunjukkan sebuah segi tiga sama kaki <i>ABC</i>. <i>AD</i> berserenjang dengan <i>BC</i>.<br>(i) Nyatakan hipotenus bagi segi tiga <i>ABD</i>.<br>(ii) Hitung panjang <i>AD</i>, dalam cm.',
      qe: 'The diagram shows an isosceles triangle <i>ABC</i>. <i>AD</i> is perpendicular to <i>BC</i>.<br>(i) State the hypotenuse of triangle <i>ABD</i>.<br>(ii) Calculate the length of <i>AD</i>, in cm.',
      sk: '(i) <i>AB</i> <b>P1</b><br>(ii) <i>BD</i> = 5 cm <b>K1</b>; RT(13² − 5²) <b>K1</b> = 12 cm <b>N1</b>' },
    { l: '(b)', m: 4, aras: 'R', kon: 'Mengaplikasi', q: '(i) Senaraikan semua faktor bagi 45.<br>(ii) Seterusnya, tentukan faktor perdana bagi 45.', qe: '(i) List all the factors of 45.<br>(ii) Hence, determine the prime factors of 45.',
      sk: '(i) 1, 3, 5, 9, 15, 45 <b>P2</b><br>(ii) 3, 5 <b>P2</b>' },
    { l: '(c)', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Selesaikan setiap ketaksamaan berikut.<br>(i) 3<i>x</i> − 5 > 7<br>(ii) 6 − 2<i>y</i> ≤ 14', qe: 'Solve each of the following inequalities.<br>(i) 3<i>x</i> − 5 > 7<br>(ii) 6 − 2<i>y</i> ≤ 14',
      sk: '(i) <i>x</i> > 4 <b>N1</b><br>(ii) <i>y</i> ≥ −4 <b>N1</b>' }] },
  { id: 'T1S1-C05', bhg: 'C', bab: 6, babs: [1, 6, 7], parts: [
    { l: '(a)', m: 3, aras: 'S', kon: 'Mengaplikasi', fig: 'T1C05a', q: 'Rajah terdiri daripada lima segi empat sama yang sama saiz. Luas seluruh rajah itu ialah 245 cm².<br>(i) Cari luas, dalam cm², sebuah segi empat sama itu.<br>(ii) Cari perimeter, dalam cm, seluruh rajah itu.',
      qe: 'The diagram consists of five squares of equal size. The area of the whole diagram is 245 cm².<br>(i) Find the area, in cm², of one square.<br>(ii) Find the perimeter, in cm, of the whole diagram.',
      sk: '(i) 245 ÷ 5 = 49 cm² <b>N1</b><br>(ii) Sisi = 7 cm; 12 × 7 <b>K1</b> = 84 cm <b>N1</b>' },
    { l: '(b)', m: 4, aras: 'T', kon: 'Menganalisis', fig: 'T1C05b', q: 'Dalam rajah, <i>AB</i>, <i>CD</i> dan <i>EF</i> ialah garis selari.<br>(i) Nyatakan hubungan antara sudut <i>p</i> dan sudut <i>q</i>.<br>(ii) Hitung nilai <i>m</i> + <i>n</i>.',
      qe: 'In the diagram, <i>AB</i>, <i>CD</i> and <i>EF</i> are parallel lines.<br>(i) State the relationship between angle <i>p</i> and angle <i>q</i>.<br>(ii) Calculate the value of <i>m</i> + <i>n</i>.',
      sk: '(i) Sudut selang-seli, <i>p</i> = <i>q</i> <b>P1</b><br>(ii) <i>n</i> = 70° (sudut sepadan) <b>K1</b>; <i>m</i> = 180° − 115° = 65° (sudut pedalaman) <b>K1</b><br><i>m</i> + <i>n</i> = 135° <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'S', kon: 'Menganalisis', fig: 'T1C05c', q: 'Rajah menunjukkan sebuah garis nombor dengan selang yang sama. Tentukan nilai <i>P</i>, <i>Q</i> dan <i>R</i>.',
      qe: 'The diagram shows a number line with equal intervals. Determine the values of <i>P</i>, <i>Q</i> and <i>R</i>.',
      sk: 'Selang = (−0.5 − (−3.2)) ÷ 3 = 0.9<br><i>P</i> = −2.3 <b>N1</b>, <i>Q</i> = −1.4 <b>N1</b>, <i>R</i> = 0.4 <b>N1</b>' }] },
  { id: 'T1S1-C06', bhg: 'C', bab: 8, babs: [3, 7, 8], parts: [
    { l: '(a)', m: 4, aras: 'S', kon: 'Mengaplikasi', fig: 'T1C06a', big: true,
      q: 'Graf garis yang tidak lengkap menunjukkan bilangan bungkus nasi lemak yang dijual oleh sebuah gerai dalam lima hari. Gerai itu menjual 210 bungkus pada hari Khamis dan 90 bungkus pada hari Jumaat.<br>(i) Lengkapkan graf garis itu.<br>(ii) Harga sebungkus nasi lemak ialah RM2.50. Hitung jumlah jualan, dalam RM, dari hari Isnin hingga Khamis.',
      qe: 'The incomplete line graph shows the number of packets of nasi lemak sold by a stall in five days. The stall sold 210 packets on Thursday and 90 packets on Friday.<br>(i) Complete the line graph.<br>(ii) The price of a packet of nasi lemak is RM2.50. Calculate the total sales, in RM, from Monday to Thursday.',
      sk: '(i) Titik Khamis (210) dan Jumaat (90) diplot dan disambung <b>P2</b><br>(ii) (120 + 180 + 150 + 210) × 2.50 <b>K1</b> = RM1 650 <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'T', kon: 'Menilai', q: 'Jadual menunjukkan harga dan diskaun bagi sebuah fon kepala di dua kedai. Tentukan pilihan yang lebih baik untuk membeli fon kepala itu. Berikan justifikasi.',
      qe: 'The table shows the price and discount of a headphone at two shops. Determine the better option to buy the headphone. Give a justification.',
      jadual: { r: [['', 'Kedai A', 'Kedai dalam talian B'], ['Harga', 'RM120', 'RM105'], ['Diskaun', '25%', '10%']], re: ['', 'Price', 'Discount'] },
      sk: 'Kedai A: 75% × 120 = RM90 <b>K1</b><br>Kedai B: 90% × 105 = RM94.50 <b>K1</b><br>Kedai A lebih baik kerana harganya lebih murah <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Aina berjalan sejauh 20 m ke arah timur dari titik <i>J</i> ke titik <i>K</i>, kemudian 21 m ke arah utara dari titik <i>K</i> ke titik <i>L</i>. Cari jarak terus, dalam m, dari titik <i>J</i> ke titik <i>L</i>.',
      qe: 'Aina walks 20 m due east from point <i>J</i> to point <i>K</i>, then 21 m due north from point <i>K</i> to point <i>L</i>. Find the direct distance, in m, from point <i>J</i> to point <i>L</i>.',
      sk: 'RT(20² + 21²) <b>K1</b> = RT(841) <b>K1</b> = 29 m <b>N1</b>' }] }
];
