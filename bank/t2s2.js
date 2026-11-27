'use strict';
/* =================== BANK SOALAN · TINGKATAN 2 · SET 2 (format UASA) ===================
   Set 2 (27 Nov 2026): 20 A · 5 B · 6 C. Diolah semula oleh Mat berdasarkan bentuk dan aras kertas
   UASA 2025 SMKRP (rujukan: Downloads/Bank Soalan/T2_UASA-2025_SMKRP.docx). Nombor, konteks dan pilihan
   jawapan ditukar; skema dikira semula. Format medan sama dengan t2.js. Dimuat selepas t2.js. */

/* ---------- rajah: graf garis ringkas (laju-masa / jarak-masa) ---------- */
function bsLine(o) {
  const W = o.w || 230, H = o.h || 150, L = 34, B = 26, R = 12, T = 12, pw = W - L - R, ph = H - B - T;
  const X = t => L + t / o.xm * pw, Y = v => T + ph - v / o.ym * ph, F = 'font-family="Inter,sans-serif" fill="currentColor"';
  let h = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${o.alt || 'Graf'}"><g stroke="currentColor" stroke-width="1.5" fill="none">`;
  h += `<line x1="${L}" y1="${T - 4}" x2="${L}" y2="${T + ph}"/><line x1="${L}" y1="${T + ph}" x2="${L + pw + 6}" y2="${T + ph}"/>`;
  h += `<polyline points="${o.p.map(q => X(q[0]) + ',' + Y(q[1])).join(' ')}" stroke-width="2.2"/></g><g stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" fill="none">`;
  (o.gx || []).forEach(q => { h += `<line x1="${X(q[0])}" y1="${Y(q[1])}" x2="${X(q[0])}" y2="${T + ph}"/>`; });
  (o.gy || []).forEach(q => { h += `<line x1="${L}" y1="${Y(q[1])}" x2="${X(q[0])}" y2="${Y(q[1])}"/>`; });
  h += `</g><g ${F} font-size="10">`;
  (o.tx || []).forEach(t => { h += `<text x="${X(t[0])}" y="${T + ph + 12}" text-anchor="middle">${t[1] == null ? t[0] : t[1]}</text>`; });
  (o.ty || []).forEach(v => { h += `<text x="${L - 4}" y="${Y(v[0]) + 3.5}" text-anchor="end">${v[1] == null ? v[0] : v[1]}</text>`; });
  h += `<text x="${L - 4}" y="${T + ph + 12}" text-anchor="end">0</text>`;
  h += `<text x="${L + pw + 8}" y="${T + ph + 4}" font-size="10">${o.xl || ''}</text><text x="${L + 4}" y="${T - 2}" font-size="10">${o.yl || ''}</text></g></svg>`;
  return h;
}

Object.assign(BS_FIG, {
  S2A05: `<svg viewBox="0 0 220 150" width="200" role="img" aria-label="Oktagon sekata dengan satu sisi dipanjangkan; sudut x di luar">
    <g fill="none" stroke="currentColor" stroke-width="2"><polygon points="70,130 120,130 155.4,94.6 155.4,44.6 120,9.2 70,9.2 34.6,44.6 34.6,94.6"/>
    <line x1="120" y1="130" x2="200" y2="130"/><path d="M140 130 A20 20 0 0 0 134.1 115.9" stroke-width="1.4"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="13" font-style="italic"><text x="64" y="146">P</text><text x="116" y="146">Q</text><text x="196" y="146">R</text><text x="146" y="124">x</text></g></svg>`,
  S2A08: `<svg viewBox="0 0 220 120" width="210" role="img" aria-label="Gambar rajah anak panah: 1 kepada 2, 2 kepada 5, 3 kepada 10">
    <g fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="45" cy="60" rx="28" ry="50"/><ellipse cx="175" cy="60" rx="28" ry="50"/></g>
    <g stroke="currentColor" stroke-width="1.4"><line x1="55" y1="30" x2="160" y2="30"/><line x1="55" y1="60" x2="160" y2="60"/><line x1="55" y1="90" x2="160" y2="90"/></g>
    <g fill="currentColor"><path d="M160 26 L168 30 L160 34Z"/><path d="M160 56 L168 60 L160 64Z"/><path d="M160 86 L168 90 L160 94Z"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="13" text-anchor="middle"><text x="42" y="34">1</text><text x="42" y="64">2</text><text x="42" y="94">3</text>
    <text x="180" y="34">2</text><text x="180" y="64">5</text><text x="180" y="94">10</text><text x="45" y="8" font-style="italic">x</text><text x="175" y="8" font-style="italic">f(x)</text></g></svg>`,
  S2A10: bsLine({ xm: 18, ym: 30, p: [[0, 24], [15, 0]], tx: [[15]], ty: [[24, '<tspan font-style="italic">u</tspan>']], xl: 'Masa (s)', yl: 'Laju (m/s)', alt: 'Graf laju-masa: laju berkurang daripada u kepada 0 dalam 15 saat' }),
  S2A13: `<svg viewBox="0 0 220 120" width="200" role="img" aria-label="Sebahagian poligon sekata; KLM garis lurus dengan sudut 20 darjah di L">
    <g fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,100 120,100 214,65.8"/><line x1="120" y1="100" x2="200" y2="100" stroke-dasharray="5 4"/><polyline points="20,100 0,80" />
    <path d="M150 100 A30 30 0 0 0 148.2 89.7" stroke-width="1.4"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12"><text x="36" y="116" font-style="italic">K</text><text x="114" y="116" font-style="italic">L</text><text x="196" y="116" font-style="italic">M</text><text x="156" y="96">20°</text></g></svg>`,
  S2A15: bsGrid({ x: [-4, 4], y: [-4, 5], pt: [[2, 3, '<tspan font-style="italic">P</tspan>'], [2, -1, '<tspan font-style="italic">P′</tspan>'], [-3, 5, '<tspan font-style="italic">Q</tspan>']], alt: 'Titik P, imejnya P′ dan titik Q pada satah Cartes' }),
  S2A17: `<svg viewBox="0 0 220 125" width="200" role="img" aria-label="Semibulatan berpusat O dengan segi tiga PRQ; kawasan di luar segi tiga berlorek">
    <g fill="currentColor" fill-opacity=".22"><path d="M20 110 A90 90 0 0 1 110 20 Z"/><path d="M110 20 A90 90 0 0 1 200 110 Z"/></g>
    <g fill="none" stroke="currentColor" stroke-width="2"><path d="M20 110 A90 90 0 0 1 200 110 Z"/><polyline points="20,110 110,20 200,110"/></g><line x1="110" y1="110" x2="110" y2="20" stroke="currentColor" stroke-dasharray="3 3"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="13" font-style="italic"><text x="8" y="122">P</text><text x="204" y="122">Q</text><text x="106" y="14">R</text><text x="106" y="123">O</text></g></svg>`,
  S2B05: bsLine({ w: 250, h: 160, xm: 4.4, ym: 270, p: [[0, 0], [2, 150], [2.5, 150], [4, 240]], gx: [[2, 150], [2.5, 150], [4, 240]], gy: [[2.5, 150], [4, 240]], tx: [[1], [2], [2.5], [3], [4]], ty: [[150], [240]], xl: 'Masa (j)', yl: 'Jarak (km)', alt: 'Graf jarak-masa perjalanan bas' }),
  S2C02a: `<svg viewBox="-16 -16 232 212" width="190" role="img" aria-label="Bulatan berpusat O dengan garis PQ melalui O, rantau A, lengkok RS dan rantau B">
    <path d="M100 90 L163.6 26.4 A90 90 0 0 1 190 90 Z" fill="currentColor" fill-opacity=".18"/><path d="M36.4 153.6 A90 90 0 0 0 163.6 153.6 Z" fill="currentColor" fill-opacity=".32"/>
    <g fill="none" stroke="currentColor" stroke-width="2"><circle cx="100" cy="90" r="90"/><line x1="10" y1="90" x2="190" y2="90"/><line x1="100" y1="90" x2="163.6" y2="26.4"/><line x1="36.4" y1="153.6" x2="163.6" y2="153.6"/></g>
    <path d="M36.4 26.4 A90 90 0 0 1 100 0" fill="none" stroke="currentColor" stroke-width="4"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="13" font-style="italic"><text x="-12" y="94">P</text><text x="194" y="94">Q</text><text x="96" y="106">O</text><text x="150" y="76">A</text><text x="96" y="172">B</text><text x="22" y="20">R</text><text x="98" y="-5">S</text></g></svg>`,
  S2C02c: `<svg viewBox="-50 -10 280 130" width="230" role="img" aria-label="Segi empat sama ABDE dan sebahagian poligon sekata yang berkongsi sisi AB; sudut 120 darjah di B">
    <g fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="2"><polygon points="20,40 90,40 90,110 20,110"/></g>
    <g fill="none" stroke="currentColor" stroke-width="2"><polyline points="-40.6,5 20,40 90,40 150.6,5"/><path d="M107.3 30 A20 20 0 0 1 90 60" stroke-width="1.3"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12"><text x="104" y="58">120°</text><text x="12" y="54" font-style="italic">A</text><text x="94" y="36" font-style="italic">B</text></g></svg>`,
  S2C03c: bsLine({ w: 250, h: 160, xm: 4.4, ym: 310, p: [[0, 0], [1.5, 120], [2, 120], [4, 280]], gx: [[1.5, 120], [2, 120], [4, 280]], gy: [[2, 120], [4, 280]], tx: [[1.5], [2], [4]], ty: [[120], [280, '<tspan font-style="italic">a</tspan>']], xl: 'Masa (j)', yl: 'Jarak (km)', alt: 'Graf jarak-masa perjalanan sebuah kereta' }),
  S2C05a: bsGrid({ x: [-5, 4], y: [-4, 4], poly: [{ p: [[-4, 1], [-2, 1], [-4, 3]], l: 'P', at: [-3.4, 1.5] }, { p: [[1, -1], [3, -1], [1, -3]], l: 'P′', at: [1.6, -2] }], alt: 'Objek P dan imejnya P′' }),
  S2C05b: bsGrid({ x: [-4, 5], y: [-3, 4], poly: [{ p: [[-2, 0], [-1, 0], [-1, 2], [-2, 1]], l: 'Q', at: [-1.5, 0.6] }], seg: [[1, -3, 1, 4]], pt: [[1, -3, '<tspan font-style="italic">A</tspan>'], [1, 4, '<tspan font-style="italic">B</tspan>']], alt: 'Bentuk Q dan garis lurus AB' }),
  S2C05c: bsGrid({ x: [-2, 5], y: [-4, 3], poly: [{ p: [[1, 1], [3, 1], [1, 2]], l: 'T', at: [1.5, 1.25] }, { p: [[1, -1], [1, -3], [2, -1]], l: 'T′', at: [1.3, -1.7] }], alt: 'Bentuk T dan imejnya T′ di bawah suatu putaran' }),
  S2C06b: `<svg viewBox="0 0 250 170" width="240" role="img" aria-label="Carta palang tidak lengkap: 3 jam 4 orang, 4 jam 6 orang, 5 jam 8 orang, 6 jam tiada palang, 7 jam 2 orang">
    <g stroke="currentColor" stroke-opacity=".2">${[0, 2, 4, 6, 8].map(v => `<line x1="40" y1="${140 - v * 15}" x2="240" y2="${140 - v * 15}"/>`).join('')}</g>
    <g stroke="currentColor" stroke-width="1.5"><line x1="40" y1="10" x2="40" y2="140"/><line x1="40" y1="140" x2="244" y2="140"/></g>
    <g fill="currentColor" fill-opacity=".35" stroke="currentColor">${[[3, 4], [4, 6], [5, 8], [7, 2]].map(([t, f]) => `<rect x="${58 + (t - 3) * 38}" y="${140 - f * 15}" width="24" height="${f * 15}"/>`).join('')}</g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="10" text-anchor="middle">${[3, 4, 5, 6, 7].map(t => `<text x="${70 + (t - 3) * 38}" y="153">${t}</text>`).join('')}
    ${[0, 2, 4, 6, 8].map(v => `<text x="34" y="${143 - v * 15}" text-anchor="end">${v}</text>`).join('')}<text x="140" y="167">Masa (jam) / Time (hours)</text><text x="44" y="8" text-anchor="start">Bilangan murid</text></g></svg>`
});

/* pilihan graf bagi S2-A19 */
const BS_S2G = (p, alt) => bsLine({ w: 150, h: 96, xm: 38, ym: 28, p, gx: p.slice(1, 3), tx: [[p[1][0]], [p[2][0]], [p[3][0]]], ty: [[p[1][1]]], alt });

BS_T2.push(
  // ---------------- SET 2 · BAHAGIAN A ----------------
  { id: 'T2S2-A01', bhg: 'A', bab: 1, kon: 'Memahami', aras: 'R', why: 'Kenal pasti pola subset jujukan', m: 1,
    q: 'Berikut ialah suatu urutan nombor.<br>9, 14, 19, 24, 29, 34, …<br>Apakah pola bagi nombor-nombor ganjil dalam urutan itu?',
    qe: 'The following is a sequence of numbers.<br>9, 14, 19, 24, 29, 34, …<br>What is the pattern of the odd numbers in the sequence?',
    pil: ['Menambah 5 kepada nombor sebelumnya', 'Menambah 10 kepada nombor sebelumnya', 'Menambah 15 kepada nombor sebelumnya', 'Menambah 20 kepada nombor sebelumnya'],
    pe: ['Adding 5 to the previous number', 'Adding 10 to the previous number', 'Adding 15 to the previous number', 'Adding 20 to the previous number'], jaw: 'B', sk: 'Nombor ganjil: 9, 19, 29, … (tambah 10)' },
  { id: 'T2S2-A02', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'FSTB tiga sebutan algebra', m: 1,
    q: 'Antara berikut, yang manakah faktor sepunya terbesar bagi 6<i>x</i>²<i>y</i>, 9<i>xy</i>² dan 12<i>x</i>²<i>yz</i>?',
    qe: 'Which of the following is the highest common factor of 6<i>x</i>²<i>y</i>, 9<i>xy</i>² and 12<i>x</i>²<i>yz</i>?',
    pil: ['3<i>xy</i>', '6<i>xy</i>', '3<i>x</i>²<i>y</i>', '36<i>x</i>²<i>y</i>²<i>z</i>'], jaw: 'A', sk: 'FSTB(6, 9, 12) = 3; kuasa terendah <i>x</i> dan <i>y</i> → 3<i>xy</i>' },
  { id: 'T2S2-A03', bhg: 'A', bab: 3, kon: 'Memahami', aras: 'S', why: 'Pilih perkara rumus yang betul', m: 1,
    q: 'Diberi <i>m</i> = <i>n</i> + 3<i>pq</i>. Antara berikut, yang manakah benar?', qe: 'Given <i>m</i> = <i>n</i> + 3<i>pq</i>. Which of the following is true?',
    pil: ['<i>n</i> = <i>m</i> − 3<i>pq</i>', '<i>n</i> = <i>m</i> + 3<i>pq</i>', '<i>p</i> = FR(<i>m</i> − <i>n</i>|3)', '<i>q</i> = FR(<i>n</i> − <i>m</i>|3<i>p</i>)'], jaw: 'A',
    sk: '<i>n</i> = <i>m</i> − 3<i>pq</i> (<i>p</i> = FR(<i>m</i> − <i>n</i>|3<i>q</i>), <i>q</i> = FR(<i>m</i> − <i>n</i>|3<i>p</i>))' },
  { id: 'T2S2-A04', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'S', why: 'Faktorkan pengangka dan penyebut dahulu', m: 1,
    q: 'Permudahkan FR(3<i>a</i> + 6|<i>a</i>² − 4).', qe: 'Simplify FR(3<i>a</i> + 6|<i>a</i>² − 4).',
    pil: ['FR(3|<i>a</i> − 2)', 'FR(3|<i>a</i> + 2)', 'FR(3<i>a</i>|<i>a</i> − 2)', 'FR(6|<i>a</i>² − 2)'], jaw: 'A', sk: 'FR(3(<i>a</i> + 2)|(<i>a</i> − 2)(<i>a</i> + 2)) = FR(3|<i>a</i> − 2)' },
  { id: 'T2S2-A05', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'R', why: 'Sudut peluaran poligon sekata daripada rajah', m: 1, fig: 'S2A05',
    q: 'Rajah menunjukkan sebuah oktagon sekata. <i>PQR</i> ialah garis lurus. Cari nilai <i>x</i>.', qe: 'The diagram shows a regular octagon. <i>PQR</i> is a straight line. Find the value of <i>x</i>.',
    pil: ['30°', '36°', '45°', '60°'], jaw: 'C', sk: '<i>x</i> = sudut peluaran = FR(360°|8) = 45°' },
  { id: 'T2S2-A06', bhg: 'A', bab: 5, kon: 'Mengingat', aras: 'R', why: 'Takrif bahagian bulatan', m: 1,
    q: 'Antara berikut, yang manakah menerangkan <b>sektor</b> bulatan?', qe: 'Which of the following describes a <b>sector</b> of a circle?',
    pil: ['Perentas yang paling panjang bagi suatu bulatan', 'Rantau yang dibatasi oleh satu lengkok dan dua jejari', 'Rantau yang dibatasi oleh satu lengkok dan satu perentas', 'Sebahagian daripada lilitan bulatan'],
    pe: ['The longest chord of a circle', 'A region bounded by an arc and two radii', 'A region bounded by an arc and a chord', 'A part of the circumference of a circle'], jaw: 'B' },
  { id: 'T2S2-A07', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'S', why: 'Kerja songsang daripada luas permukaan sfera', m: 1,
    q: 'Luas permukaan sebuah sfera ialah 616 cm². Hitung diameter, dalam cm, sfera itu. (Guna π = FR(22|7))', qe: 'The surface area of a sphere is 616 cm². Calculate the diameter, in cm, of the sphere. (Use π = FR(22|7))',
    pil: ['7', '12', '14', '28'], jaw: 'C', sk: '4 × FR(22|7) × <i>j</i>² = 616 → <i>j</i>² = 49 → <i>j</i> = 7, diameter = 14 cm' },
  { id: 'T2S2-A08', bhg: 'A', bab: 8, kon: 'Menganalisis', aras: 'S', why: 'Kenal pasti fungsi daripada gambar rajah anak panah', m: 1, fig: 'S2A08',
    q: 'Rajah menunjukkan suatu fungsi. Apakah persamaan yang mewakili fungsi itu?', qe: 'The diagram shows a function. What is the equation that represents the function?',
    pil: ['<i>f</i>(<i>x</i>) = 2<i>x</i>', '<i>f</i>(<i>x</i>) = 3<i>x</i> − 1', '<i>f</i>(<i>x</i>) = <i>x</i>² + 1', '<i>f</i>(<i>x</i>) = <i>x</i>(<i>x</i> + 1)'], jaw: 'C', sk: '1² + 1 = 2, 2² + 1 = 5, 3² + 1 = 10' },
  { id: 'T2S2-A09', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'R', why: 'Gantian nilai negatif ke dalam rumus', m: 1,
    q: 'Diberi 2<i>p</i> = <i>q</i> − 5, hitung nilai <i>q</i> apabila <i>p</i> = −4.', qe: 'Given 2<i>p</i> = <i>q</i> − 5, calculate the value of <i>q</i> when <i>p</i> = −4.',
    pil: ['−13', '−3', '3', '13'], jaw: 'B', sk: '<i>q</i> = 2<i>p</i> + 5 = 2(−4) + 5 = −3' },
  { id: 'T2S2-A10', bhg: 'A', bab: 9, kon: 'Mengaplikasi', aras: 'S', why: 'Nyahpecutan daripada graf laju-masa', m: 1, fig: 'S2A10',
    q: 'Rajah menunjukkan graf laju-masa bagi pergerakan sebuah kereta mainan dalam 15 saat. Pecutan kereta itu ialah −1.6 m/s². Cari nilai <i>u</i>.',
    qe: 'The diagram shows the speed-time graph of the motion of a toy car in 15 seconds. The acceleration of the car is −1.6 m/s². Find the value of <i>u</i>.',
    pil: ['16', '20', '24', '30'], jaw: 'C', sk: 'FR(0 − <i>u</i>|15) = −1.6 → <i>u</i> = 24' },
  { id: 'T2S2-A11', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'S', why: 'Isi padu silinder berongga (beza dua silinder)', m: 1,
    q: 'Sebatang paip berongga berbentuk silinder mempunyai diameter luar 10 cm, diameter dalam 6 cm dan panjang 14 cm. Hitung isi padu, dalam cm³, bahan paip itu. (Guna π = FR(22|7))',
    qe: 'A hollow cylindrical pipe has an outer diameter of 10 cm, an inner diameter of 6 cm and a length of 14 cm. Calculate the volume, in cm³, of the material of the pipe. (Use π = FR(22|7))',
    pil: ['396', '704', '1 100', '1 584'], jaw: 'B', sk: 'FR(22|7) × (5² − 3²) × 14 = FR(22|7) × 16 × 14 = 704' },
  { id: 'T2S2-A12', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'T', why: 'Gantian ke dalam rumus pecahan, selesaikan persamaan', m: 1,
    q: 'Diberi <i>p</i> = FR(<i>q</i> + 4|3<i>q</i>). Hitung nilai <i>q</i> apabila <i>p</i> = −1.', qe: 'Given <i>p</i> = FR(<i>q</i> + 4|3<i>q</i>). Calculate the value of <i>q</i> when <i>p</i> = −1.',
    pil: ['FR(1|2)', '1', '−FR(1|2)', '−1'], jaw: 'D', sk: '−3<i>q</i> = <i>q</i> + 4 → −4<i>q</i> = 4 → <i>q</i> = −1' },
  { id: 'T2S2-A13', bhg: 'A', bab: 4, kon: 'Menganalisis', aras: 'S', why: 'Bilangan sisi daripada sudut peluaran pada rajah', m: 1, fig: 'S2A13',
    q: 'Rajah menunjukkan sebahagian daripada sebuah poligon sekata. <i>KLM</i> ialah garis lurus. Hitung bilangan sisi poligon itu.',
    qe: 'The diagram shows part of a regular polygon. <i>KLM</i> is a straight line. Calculate the number of sides of the polygon.',
    pil: ['12', '16', '18', '20'], jaw: 'C', sk: 'Sudut peluaran = 20° → FR(360°|20°) = 18' },
  { id: 'T2S2-A14', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'S', why: 'Kenal pasti kon daripada ciri, kemudian isi padu', m: 1,
    q: 'Berikut ialah ciri-ciri sebuah pepejal geometri.<br>• Mempunyai tapak rata berbentuk bulatan dengan diameter 12 cm.<br>• Puncaknya terletak tegak 14 cm dari tapak.<br>Hitung isi padu pepejal itu, dalam cm³. (Guna π = FR(22|7))',
    qe: 'The following are the characteristics of a geometric solid.<br>• It has a circular flat base with a diameter of 12 cm.<br>• Its apex is vertically 14 cm from the base.<br>Calculate the volume of the solid, in cm³. (Use π = FR(22|7))',
    pil: ['528', '1 056', '1 584', '2 112'], jaw: 'A', sk: 'Kon: FR(1|3) × FR(22|7) × 6² × 14 = 528' },
  { id: 'T2S2-A15', bhg: 'A', bab: 11, kon: 'Menganalisis', aras: 'S', why: 'Tentukan paksi pantulan, kemudian guna pada titik lain', m: 1, fig: 'S2A15',
    q: 'Dalam rajah, <i>P′</i> ialah imej bagi <i>P</i> di bawah suatu pantulan. Tentukan koordinat imej bagi <i>Q</i> di bawah pantulan yang sama.',
    qe: 'In the diagram, <i>P′</i> is the image of <i>P</i> under a reflection. Determine the coordinates of the image of <i>Q</i> under the same reflection.',
    pil: ['(−3, −3)', '(−3, −1)', '(3, 5)', '(−3, −4)'], jaw: 'A', sk: 'Paksi pantulan: <i>y</i> = 1<br><i>Q</i>(−3, 5) → (−3, 2 − 5) = (−3, −3)' },
  { id: 'T2S2-A16', bhg: 'A', bab: 7, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Titik tengah dua langkah', m: 1,
    q: 'Titik asalan <i>O</i> ialah titik tengah bagi garis lurus <i>QR</i>. Diberi <i>Q</i>(4, 6) dan <i>S</i>(8, −6). Garis <i>RS</i> selari dengan paksi-<i>x</i>. Antara berikut, yang manakah titik tengah bagi <i>RS</i>?',
    qe: 'The origin <i>O</i> is the midpoint of the straight line <i>QR</i>. Given <i>Q</i>(4, 6) and <i>S</i>(8, −6). The line <i>RS</i> is parallel to the <i>x</i>-axis. Which of the following is the midpoint of <i>RS</i>?',
    pil: ['(2, −6)', '(−2, −6)', '(6, 0)', '(4, −6)'], jaw: 'A', sk: '<i>R</i> = (−4, −6)<br>Titik tengah <i>RS</i> = (FR(−4 + 8|2), −6) = (2, −6)' },
  { id: 'T2S2-A17', bhg: 'A', bab: 5, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Luas berlorek: semibulatan tolak segi tiga', m: 1, fig: 'S2A17',
    q: 'Rajah menunjukkan sebuah semibulatan berpusat <i>O</i> dan segi tiga <i>PRQ</i>. Diberi <i>OP</i> = 7 cm. Hitung luas, dalam cm², kawasan berlorek. (Guna π = FR(22|7))',
    qe: 'The diagram shows a semicircle with centre <i>O</i> and a triangle <i>PRQ</i>. Given <i>OP</i> = 7 cm. Calculate the area, in cm², of the shaded region. (Use π = FR(22|7))',
    pil: ['28', '49', '77', '105'], jaw: 'A', sk: 'Semibulatan = FR(1|2) × FR(22|7) × 7² = 77<br>Segi tiga = FR(1|2) × 14 × 7 = 49<br>77 − 49 = 28' },
  { id: 'T2S2-A18', bhg: 'A', bab: 12, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Min tidak berubah, bina persamaan', m: 1,
    q: 'Min bagi lima nombor ialah 30. Dua nombor ditambah ke dalam set itu dengan keadaan nombor kedua ialah tiga kali nombor pertama. Min baharu tetap 30. Apakah dua nombor yang ditambah?',
    qe: 'The mean of five numbers is 30. Two numbers are added to the set such that the second number is three times the first number. The new mean remains 30. What are the two numbers added?',
    pil: ['12, 36', '15, 45', '20, 60', '10, 30'], jaw: 'B', sk: 'Jumlah dua nombor = 7(30) − 5(30) = 60<br><i>a</i> + 3<i>a</i> = 60 → <i>a</i> = 15, 45' },
  { id: 'T2S2-A19', bhg: 'A', bab: 9, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Tafsir tiga peringkat gerakan kepada graf', m: 1,
    q: 'Suatu objek bergerak dari keadaan pegun dan memecut 2 m/s² selama 10 saat. Kemudian objek itu bergerak dengan laju seragam selama 15 saat sebelum menyahpecut 4 m/s² sehingga berhenti. Antara graf laju-masa berikut, yang manakah mewakili pergerakan objek itu?',
    qe: 'An object starts from rest and accelerates at 2 m/s² for 10 seconds. Then the object moves at a uniform speed for 15 seconds before decelerating at 4 m/s² until it stops. Which of the following speed-time graphs represents the motion of the object?',
    pil: [BS_S2G([[0, 0], [10, 20], [25, 20], [30, 0]], 'Graf A'), BS_S2G([[0, 0], [10, 20], [25, 20], [35, 0]], 'Graf B'), BS_S2G([[0, 0], [10, 25], [25, 25], [30, 0]], 'Graf C'), BS_S2G([[0, 0], [10, 20], [15, 20], [20, 0]], 'Graf D')],
    jaw: 'A', sk: 'Laju maksimum = 2 × 10 = 20 m/s<br>Laju seragam 10 s → 25 s<br>Masa berhenti = FR(20|4) = 5 s → 30 s' },
  { id: 'T2S2-A20', bhg: 'A', bab: 13, kon: 'Mengaplikasi', aras: 'R', why: 'Kebarangkalian peristiwa pelengkap', m: 1,
    q: 'Sebuah balang mengandungi 24 biji guli merah, 10 biji guli biru dan 6 biji guli putih. Sebiji guli dipilih secara rawak. Hitung kebarangkalian memilih guli yang <b>bukan</b> berwarna biru.',
    qe: 'A jar contains 24 red marbles, 10 blue marbles and 6 white marbles. A marble is chosen at random. Calculate the probability of choosing a marble that is <b>not</b> blue.',
    pil: ['FR(1|4)', 'FR(3|5)', 'FR(3|4)', 'FR(4|5)'], jaw: 'C', sk: '1 − FR(10|40) = FR(30|40) = FR(3|4)' },

  // ---------------- SET 2 · BAHAGIAN B ----------------
  { id: 'T2S2-B01', bhg: 'B', bab: 11, babs: [4, 11], parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Memahami', q: 'Bulatkan jenis transformasi yang betul.', qe: 'Circle the correct type of transformation.',
      items: [{ t: 'Bentuk <i>K</i> dipusingkan 90° ikut arah jam pada satu titik tetap: CH(Pantulan|Putaran|Translasi)', te: 'Shape <i>K</i> is turned 90° clockwise about a fixed point: CH(Reflection|Rotation|Translation)', a: 'Putaran' },
        { t: 'Setiap titik bentuk <i>L</i> dianjak 3 unit ke kanan dan 2 unit ke atas: CH(Pantulan|Putaran|Translasi)', te: 'Every point of shape <i>L</i> is moved 3 units to the right and 2 units up: CH(Reflection|Rotation|Translation)', a: 'Translasi' }] },
    { l: '(b)', jenis: 'pad', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Padankan setiap poligon sekata dengan bilangan sisinya.', qe: 'Match each regular polygon with its number of sides.',
      items: [{ t: 'Sudut peluaran 30°', te: 'Exterior angle 30°', a: '12' }, { t: 'Sudut peluaran 36°', te: 'Exterior angle 36°', a: '10' },
        { t: 'Sudut pedalaman 162°', te: 'Interior angle 162°', a: '20' }, { t: 'Sudut pedalaman 165°', te: 'Interior angle 165°', a: '24' }],
      kanan: ['10', '24', '12', '20'] }] },
  { id: 'T2S2-B02', bhg: 'B', bab: 2, babs: [2, 10], parts: [
    { l: '(a)', jenis: 'tanda', m: 2, aras: 'R', kon: 'Memahami', q: 'Tandakan (✓) bagi <b>dua</b> faktor sepunya bagi sebutan 18<i>n</i>² dan 12<i>n</i>.', qe: 'Tick (✓) the <b>two</b> common factors of the terms 18<i>n</i>² and 12<i>n</i>.',
      items: [{ t: '6<i>n</i>', a: '✓' }, { t: '9<i>n</i>', a: '' }, { t: '3<i>n</i>', a: '✓' }, { t: '2<i>n</i>²', a: '' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Isi tempat kosong.', qe: 'Fill in the blanks.',
      items: [{ t: 'Garis lurus berkecerunan −FR(2|3) memotong paksi-<i>y</i> di (0, 8). Pintasan-<i>x</i> = __________', te: 'A straight line with a gradient of −FR(2|3) cuts the <i>y</i>-axis at (0, 8). The <i>x</i>-intercept = __________', a: '12' },
        { t: 'Garis lurus berkecerunan FR(1|2) memotong paksi-<i>x</i> di (−10, 0). Pintasan-<i>y</i> = __________', te: 'A straight line with a gradient of FR(1|2) cuts the <i>x</i>-axis at (−10, 0). The <i>y</i>-intercept = __________', a: '5' }] }] },
  { id: 'T2S2-B03', bhg: 'B', bab: 8,
    q: 'Suatu hubungan diwakili oleh pasangan tertib {(2, 10), (5, 25), (7, 35), (10, 25)}.', qe: 'A relation is represented by the ordered pairs {(2, 10), (5, 25), (7, 35), (10, 25)}.', parts: [
    { l: '', jenis: 'bp', m: 4, aras: 'S', kon: 'Memahami', q: 'Tulis <b>Benar</b> atau <b>Palsu</b> bagi setiap pernyataan.', qe: 'Write <b>True</b> or <b>False</b> for each statement.',
      items: [{ t: 'Hubungan ini ialah suatu fungsi.', te: 'This relation is a function.', a: 'Benar' }, { t: 'Domain ialah {2, 5, 7, 10}.', te: 'The domain is {2, 5, 7, 10}.', a: 'Benar' },
        { t: 'Imej bagi 10 ialah 2.', te: 'The image of 10 is 2.', a: 'Palsu' }, { t: 'Imej-imejnya ialah 10, 25 dan 35.', te: 'The images are 10, 25 and 35.', a: 'Benar' }] }] },
  { id: 'T2S2-B04', bhg: 'B', bab: 7, babs: [7, 12], parts: [
    { l: '(a)', jenis: 'isi', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Titik <i>B</i>(<i>p</i>, 7) ialah titik tengah bagi garis lurus yang menyambungkan <i>A</i>(−2, 3) dan <i>C</i>(6, <i>q</i>). Isi tempat kosong.',
      qe: 'The point <i>B</i>(<i>p</i>, 7) is the midpoint of the straight line joining <i>A</i>(−2, 3) and <i>C</i>(6, <i>q</i>). Fill in the blanks.',
      items: [{ t: '<i>p</i> = __________', a: '2' }, { t: '<i>q</i> = __________', a: '11' }] },
    { l: '(b)', jenis: 'bulat', m: 2, aras: 'T', kon: 'Menganalisis',
      q: 'Jadual menunjukkan masa, dalam jam, yang diperuntukkan oleh sekumpulan murid untuk membaca dalam seminggu. Diberi min ialah 3.8 jam. Bulatkan jawapan yang betul.',
      qe: 'The table shows the time, in hours, allocated by a group of pupils for reading in a week. Given that the mean is 3.8 hours. Circle the correct answers.',
      jadual: { r: [['Masa (jam)', '2', '3', '4', '5', '6'], ['Kekerapan', '3', '6', '<i>x</i>', '4', '2']], re: ['Time (hours)', 'Frequency'] },
      items: [{ t: 'Mod ialah CH(3|4|6) jam.', te: 'The mode is … hours.', a: '3' }, { t: 'Median ialah CH(3|4|5) jam.', te: 'The median is … hours.', a: '4' }],
      sk: '(56 + 4<i>x</i>) ÷ (15 + <i>x</i>) = 3.8 → <i>x</i> = 5; kekerapan 3, 6, 5, 4, 2' }] },
  { id: 'T2S2-B05', bhg: 'B', bab: 9, fig: 'S2B05',
    q: 'Graf jarak-masa menunjukkan perjalanan sebuah bas dari bandar <i>K</i> ke bandar <i>M</i>.', qe: 'The distance-time graph shows the journey of a bus from town <i>K</i> to town <i>M</i>.', parts: [
    { l: '', jenis: 'garis', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Gariskan jawapan yang betul.', qe: 'Underline the correct answers.',
      items: [{ t: 'Jarak dari bandar <i>K</i> ke bandar <i>M</i> ialah CH(150 km|240 km).', te: 'The distance from town <i>K</i> to town <i>M</i> is …', a: '240 km' },
        { t: 'Tempoh bas itu berhenti ialah CH(30 minit|60 minit).', te: 'The duration the bus stops is …', a: '30 minit' },
        { t: 'Laju bas pada bahagian pertama perjalanan CH(lebih|kurang) daripada laju pada bahagian kedua.', te: 'The speed of the bus in the first part of the journey is … than in the second part.', a: 'lebih' },
        { t: 'Laju purata bas bagi keseluruhan perjalanan ialah CH(60 km/j|75 km/j).', te: 'The average speed of the bus for the whole journey is …', a: '60 km/j' }],
      sk: 'Laju pertama = FR(150|2) = 75 km/j; kedua = FR(90|1.5) = 60 km/j; purata = FR(240|4) = 60 km/j' }] },

  // ---------------- SET 2 · BAHAGIAN C ----------------
  { id: 'T2S2-C01', bhg: 'C', bab: 2, babs: [1, 2, 3], parts: [
    { l: '(a)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Kembangkan:<br>(i) 3<i>k</i>(<i>k</i> − 4<i>h</i>)<br>(ii) −FR(1|4)(16<i>c</i> + 28<i>d</i>)', qe: 'Expand:<br>(i) 3<i>k</i>(<i>k</i> − 4<i>h</i>)<br>(ii) −FR(1|4)(16<i>c</i> + 28<i>d</i>)',
      sk: '(i) 3<i>k</i>² − 12<i>hk</i> <b>N1</b><br>(ii) −4<i>c</i> − 7<i>d</i> <b>N1</b>' },
    { l: '(b)', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Diberi <i>p</i> = FR(2<i>q</i>|5) − 4<i>r</i>. Ungkapkan <i>q</i> dalam sebutan <i>p</i> dan <i>r</i>.', qe: 'Given <i>p</i> = FR(2<i>q</i>|5) − 4<i>r</i>. Express <i>q</i> in terms of <i>p</i> and <i>r</i>.',
      sk: 'FR(2<i>q</i>|5) = <i>p</i> + 4<i>r</i> <b>K1</b><br><i>q</i> = FR(5(<i>p</i> + 4<i>r</i>)|2) <b>N1</b>' },
    { l: '(c)', m: 6, aras: 'T', kon: 'Menilai',
      q: 'Sebuah botol berisi 3 liter air. Air itu dituang ke dalam beberapa bekas kecil mengikut jujukan berikut.<br>Bekas 1: 15 mℓ, Bekas 2: 40 mℓ, Bekas 3: 65 mℓ, Bekas 4: 90 mℓ, …<br>(i) Hitung baki isi padu air, dalam mℓ, di dalam botol selepas air dituang ke dalam bekas ke-10.<br>(ii) Adakah air di dalam botol itu mencukupi untuk mengisi 16 buah bekas mengikut jujukan yang sama? Tunjukkan pengiraan anda.',
      qe: 'A bottle contains 3 litres of water. The water is poured into several small containers according to the following sequence.<br>Container 1: 15 mℓ, Container 2: 40 mℓ, Container 3: 65 mℓ, Container 4: 90 mℓ, …<br>(i) Calculate the remaining volume of water, in mℓ, in the bottle after the water is poured into the 10th container.<br>(ii) Is the water in the bottle enough to fill 16 containers according to the same sequence? Show your calculation.',
      sk: '(i) Bekas 1–10: 15, 40, 65, …, 240 (tambah 25) <b>K1</b><br>Jumlah = 1 275 mℓ <b>K1</b><br>Baki = 3 000 − 1 275 = 1 725 mℓ <b>N1</b><br>(ii) Bekas 11–16: 265, 290, 315, 340, 365, 390 → jumlah 16 bekas = 3 240 mℓ <b>K1 K1</b><br>3 240 > 3 000, tidak mencukupi <b>N1</b>' }] },
  { id: 'T2S2-C02', bhg: 'C', bab: 5, babs: [4, 5, 6], parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Mengingat', fig: 'S2C02a', q: 'Dalam rajah, <i>O</i> ialah pusat bulatan. Namakan bahagian berikut.<br>(i) Garis lurus <i>PQ</i> &nbsp; (ii) Rantau <i>A</i> &nbsp; (iii) Garis melengkung <i>RS</i> &nbsp; (iv) Rantau <i>B</i>',
      qe: 'In the diagram, <i>O</i> is the centre of the circle. Name the following parts.<br>(i) Straight line <i>PQ</i> &nbsp; (ii) Region <i>A</i> &nbsp; (iii) Curved line <i>RS</i> &nbsp; (iv) Region <i>B</i>',
      sk: '(i) Diameter <b>P1</b> (ii) Sektor <b>P1</b> (iii) Lengkok <b>P1</b> (iv) Tembereng <b>P1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Sebuah piramid tegak mempunyai tapak segi empat sama bersisi 10 cm dan tinggi tegak 12 cm. Hitung luas permukaan piramid itu, dalam cm².',
      qe: 'A right pyramid has a square base with sides of 10 cm and a vertical height of 12 cm. Calculate the surface area of the pyramid, in cm².',
      sk: 'Tinggi sendeng = RT(12² + 5²) = 13 cm <b>K1</b><br>100 + 4 × FR(1|2) × 10 × 13 <b>K1</b><br>360 cm² <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'T', kon: 'Menganalisis', fig: 'S2C02c', q: 'Rajah menunjukkan sebuah segi empat sama dan sebahagian daripada sebuah poligon sekata yang berkongsi sisi <i>AB</i>. Sudut yang ditanda di <i>B</i> ialah 120°. Hitung bilangan sisi poligon sekata itu.',
      qe: 'The diagram shows a square and part of a regular polygon sharing the side <i>AB</i>. The marked angle at <i>B</i> is 120°. Calculate the number of sides of the regular polygon.',
      sk: 'Sudut pedalaman poligon = 360° − 90° − 120° = 150° <b>K1</b><br>Sudut peluaran = 30° <b>K1</b><br>FR(360°|30°) = 12 <b>N1</b>' }] },
  { id: 'T2S2-C03', bhg: 'C', bab: 12, babs: [2, 9, 12], parts: [
    { l: '(a)', m: 3, aras: 'R', kon: 'Mengaplikasi', q: 'Min bagi lima nombor ialah 72. Tiga daripada nombor itu ialah 60, 85 dan 90. Dua nombor yang lain masing-masing bernilai <i>y</i>. Hitung<br>(i) jumlah kelima-lima nombor itu,<br>(ii) nilai <i>y</i>.',
      qe: 'The mean of five numbers is 72. Three of the numbers are 60, 85 and 90. The other two numbers are <i>y</i> each. Calculate<br>(i) the sum of the five numbers,<br>(ii) the value of <i>y</i>.',
      sk: '(i) 5 × 72 = 360 <b>N1</b><br>(ii) 2<i>y</i> = 360 − 235 <b>K1</b><br><i>y</i> = 62.5 <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Ringkaskan FR(9<i>x</i>² − 4|<i>x</i>² − 9) ÷ FR(6<i>x</i> + 4|<i>xy</i> − 3<i>y</i>).', qe: 'Simplify FR(9<i>x</i>² − 4|<i>x</i>² − 9) ÷ FR(6<i>x</i> + 4|<i>xy</i> − 3<i>y</i>).',
      sk: 'FR((3<i>x</i> − 2)(3<i>x</i> + 2)|(<i>x</i> − 3)(<i>x</i> + 3)) × FR(<i>y</i>(<i>x</i> − 3)|2(3<i>x</i> + 2)) <b>K1 K1</b><br>FR(<i>y</i>(3<i>x</i> − 2)|2(<i>x</i> + 3)) <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menganalisis', fig: 'S2C03c', q: 'Rajah menunjukkan graf jarak-masa bagi perjalanan sebuah kereta.<br>(i) Nyatakan tempoh masa, dalam minit, kereta itu berhenti.<br>(ii) Diberi laju purata kereta itu bagi keseluruhan perjalanan ialah 70 km/j. Hitung nilai <i>a</i>.',
      qe: 'The diagram shows the distance-time graph of the journey of a car.<br>(i) State the duration, in minutes, the car stops.<br>(ii) Given that the average speed of the car for the whole journey is 70 km/h, calculate the value of <i>a</i>.',
      sk: '(i) 30 minit <b>N1</b><br>(ii) FR(<i>a</i>|4) = 70 <b>K1 K1</b><br><i>a</i> = 280 <b>N1</b>' }] },
  { id: 'T2S2-C04', bhg: 'C', bab: 4, babs: [4, 7, 13], kbat: true, parts: [
    { l: '(a)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: '<i>PQRSTU</i> ialah sebuah heksagon. <i>a</i>, <i>b</i>, <i>c</i>, <i>d</i> dan <i>e</i> ialah sudut peluaran di bucu <i>P</i>, <i>Q</i>, <i>R</i>, <i>S</i> dan <i>T</i>. Sudut pedalaman di bucu <i>U</i> ialah 130°. Hitung nilai <i>a</i> + <i>b</i> + <i>c</i> + <i>d</i> + <i>e</i>.',
      qe: '<i>PQRSTU</i> is a hexagon. <i>a</i>, <i>b</i>, <i>c</i>, <i>d</i> and <i>e</i> are the exterior angles at the vertices <i>P</i>, <i>Q</i>, <i>R</i>, <i>S</i> and <i>T</i>. The interior angle at the vertex <i>U</i> is 130°. Calculate the value of <i>a</i> + <i>b</i> + <i>c</i> + <i>d</i> + <i>e</i>.',
      sk: 'Sudut peluaran di <i>U</i> = 180° − 130° = 50° <b>K1</b><br>Hasil tambah sudut peluaran = 360° <b>K1</b><br>360° − 50° <b>K1</b> = 310° <b>N1</b>' },
    { l: '(b)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Jarak di antara <i>A</i>(4, −3) dan <i>B</i>(4, <i>p</i>) ialah 10 unit dan <i>B</i> terletak di atas <i>A</i>. Cari nilai <i>p</i>.',
      qe: 'The distance between <i>A</i>(4, −3) and <i>B</i>(4, <i>p</i>) is 10 units and <i>B</i> is above <i>A</i>. Find the value of <i>p</i>.',
      sk: '<i>p</i> − (−3) = 10 <b>K1</b><br><i>p</i> = 7 <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menganalisis', q: 'Jadual menunjukkan bilangan kereta yang dimiliki oleh setiap keluarga di sebuah taman perumahan. Jika <i>x</i> buah keluarga yang memiliki 3 buah kereta berpindah dari taman itu, kebarangkalian sebuah keluarga yang dipilih secara rawak memiliki sekurang-kurangnya tiga buah kereta menjadi FR(1|3). Hitung nilai <i>x</i>.',
      qe: 'The table shows the number of cars owned by each family in a housing estate. If <i>x</i> families who own 3 cars move out of the estate, the probability that a family chosen at random owns at least three cars becomes FR(1|3). Calculate the value of <i>x</i>.',
      jadual: { r: [['Bilangan kereta', '1', '2', '3', '>3'], ['Kekerapan', '10', '22', '18', '6']], re: ['Number of cars', 'Frequency'] },
      sk: 'FR(24 − <i>x</i>|56 − <i>x</i>) = FR(1|3) <b>K1 K1</b><br>72 − 3<i>x</i> = 56 − <i>x</i> <b>K1</b><br><i>x</i> = 8 <b>N1</b>' }] },
  { id: 'T2S2-C05', bhg: 'C', bab: 11, babs: [11, 13], parts: [
    { l: '(a)', m: 2, aras: 'S', kon: 'Menilai', fig: 'S2C05a', q: 'Rajah menunjukkan objek <i>P</i> dan imejnya <i>P′</i>. Tentukan sama ada transformasi itu ialah translasi. Berikan sebab bagi jawapan anda.',
      qe: 'The diagram shows object <i>P</i> and its image <i>P′</i>. Determine whether the transformation is a translation. Give a reason for your answer.',
      sk: 'Bukan translasi <b>P1</b><br>Orientasi imej berbeza dengan objek (imej terbalik) <b>P1</b>' },
    { l: '(b)', m: 2, aras: 'R', kon: 'Mengaplikasi', fig: 'S2C05b', q: 'Rajah menunjukkan bentuk <i>Q</i> dan garis lurus <i>AB</i>. Bentuk <i>Q</i> dipantulkan pada garis <i>AB</i>. Lukis imej bentuk <i>Q</i> dan labelkannya sebagai <i>Q′</i>.',
      qe: 'The diagram shows shape <i>Q</i> and the straight line <i>AB</i>. Shape <i>Q</i> is reflected in the line <i>AB</i>. Draw the image of shape <i>Q</i> and label it as <i>Q′</i>.',
      sk: 'Imej dengan bucu (4, 0), (3, 0), (3, 2), (4, 1) <b>P2</b>' },
    { l: '(c)', m: 2, aras: 'S', kon: 'Memahami', fig: 'S2C05c', q: 'Rajah menunjukkan bentuk <i>T</i> dan imejnya <i>T′</i> di bawah suatu putaran. Huraikan putaran itu selengkapnya.',
      qe: 'The diagram shows shape <i>T</i> and its image <i>T′</i> under a rotation. Describe the rotation in full.',
      sk: 'Putaran 90° ikut arah jam <b>P1</b> pada pusat (0, 0) <b>P1</b>' },
    { l: '(d)', m: 4, aras: 'T', kon: 'Menganalisis', q: 'Sebanyak 25% daripada pen dalam 8 buah kotak ialah pen biru. Setiap kotak mengandungi 40 batang pen. <i>B</i> ialah peristiwa memilih sebatang pen biru secara rawak. Hitung kebarangkalian peristiwa pelengkap bagi <i>B</i>.',
      qe: '25% of the pens in 8 boxes are blue pens. Each box contains 40 pens. <i>B</i> is the event of choosing a blue pen at random. Calculate the probability of the complement of event <i>B</i>.',
      sk: 'Jumlah pen = 8 × 40 = 320 <b>K1</b><br>Pen biru = 25% × 320 = 80 <b>K1</b><br><i>P</i>(<i>B′</i>) = FR(320 − 80|320) <b>K1</b> = FR(3|4) <b>N1</b>' }] },
  { id: 'T2S2-C06', bhg: 'C', bab: 12, parts: [
    { l: '(a)', m: 6, aras: 'S', kon: 'Mengaplikasi',
      q: 'Data menunjukkan markah yang diperoleh 30 orang murid dalam suatu kuiz.<br>48 &nbsp;52 &nbsp;41 &nbsp;57 &nbsp;45 &nbsp;50 &nbsp;53 &nbsp;46 &nbsp;58 &nbsp;51<br>44 &nbsp;49 &nbsp;52 &nbsp;55 &nbsp;43 &nbsp;50 &nbsp;54 &nbsp;47 &nbsp;51 &nbsp;56<br>42 &nbsp;53 &nbsp;50 &nbsp;48 &nbsp;59 &nbsp;52 &nbsp;46 &nbsp;54 &nbsp;51 &nbsp;49<br>(i) Lengkapkan jadual kekerapan di bawah.<br>(ii) Nyatakan kelas mod bagi data ini.<br>(iii) Nyatakan sukatan kecenderungan memusat yang paling sesuai bagi data ini. Berikan sebab.',
      qe: 'The data shows the marks obtained by 30 pupils in a quiz.<br>(i) Complete the frequency table below.<br>(ii) State the modal class of the data.<br>(iii) State the most suitable measure of central tendency for the data. Give a reason.',
      jadual: { r: [['Markah', '40 – 44', '45 – 49', '50 – 54', '55 – 59'], ['Gundalan', '?', '?', '?', '?'], ['Kekerapan', '?', '?', '?', '?']], re: ['Marks', 'Tally', 'Frequency'] },
      sk: '(i) Kekerapan: 4, 8, 13, 5 <b>P4</b> (1 markah bagi setiap kelas betul)<br>(ii) 50 – 54 <b>P1</b><br>(iii) Min, kerana tiada nilai ekstrem dalam data <b>P1</b>' },
    { l: '(b)', m: 4, aras: 'T', kon: 'Menganalisis', fig: 'S2C06b', q: 'Carta palang yang tidak lengkap menunjukkan masa yang diperuntukkan oleh sekumpulan murid untuk bersukan dalam seminggu. Diberi min masa ialah 4.8 jam. Hitung bilangan murid yang memperuntukkan 6 jam.',
      qe: 'The incomplete bar chart shows the time allocated by a group of pupils for sports in a week. Given that the mean time is 4.8 hours, calculate the number of pupils who allocated 6 hours.',
      sk: 'FR(3(4) + 4(6) + 5(8) + 6<i>x</i> + 7(2)|20 + <i>x</i>) = 4.8 <b>K1 K1</b><br>90 + 6<i>x</i> = 96 + 4.8<i>x</i> <b>K1</b><br><i>x</i> = 5 <b>N1</b>' }] }
);
