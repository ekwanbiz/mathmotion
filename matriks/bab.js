'use strict';
/* =================== MATRIKS · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'matriks',
  nama: ['MAT', 'RIKS'],
  ting: 5, no: 2, tajuk: 'Matriks',
  slogan: [['Baris.', 'tr'], ['Lajur.', 'pk'], ['Songsang!', 'am']],
  logo: 'logo.svg',
  key: 'matriks-v2',                // storan tetapan & rekod (jangan tukar)
  ajarKey: 'matriks-ajar',          // storan pelan Mula Mengajar (jangan tukar)
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang peringkat dan unsur matriks, tambah, tolak, pendaraban matriks, penentu, matriks songsang dan persamaan linear serentak.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik ---------- */
// KSSM: SK 2.1 Matriks (SP 2.1.1 – 2.1.3) · SK 2.2 Operasi Asas Matriks (SP 2.2.1 – 2.2.7).
// SK 2.2 sangat panjang, jadi dipecahkan ikut Standard Pembelajaran:
// 2.1.1 (+2.1.2, 2.1.3) · 2.2.1 (+2.2.2) · 2.2.3 (+2.2.4) · 2.2.5 (+2.2.6, 2.2.7)
const SUBDESC = {
  '2.1.1': 'Mewakili maklumat dengan matriks, peringkat matriks, unsur aᵢⱼ dan matriks sama',
  '2.2.1': 'Menambah dan menolak matriks, serta mendarab matriks dengan suatu nombor (skalar)',
  '2.2.3': 'Mendarab dua matriks (baris × lajur) dan matriks identiti',
  '2.2.5': 'Penentu, matriks songsang 2 × 2, persamaan linear serentak dan penyelesaian masalah'
};
const SHORT = { '2.1.1': 'Matriks', '2.2.1': 'Tambah, Tolak, Skalar', '2.2.3': 'Darab & Identiti', '2.2.5': 'Songsang & Serentak' };
const SUBSIM = { '2.1.1': 'pembina-matriks', '2.2.1': 'pembina-matriks', '2.2.3': 'darab-matriks', '2.2.5': 'songsang-serentak' };

/* ---------- simulasi TEROKA ---------- */
const SIMLIST = [['pembina-matriks', 'Pembina Matriks', 'tr'], ['darab-matriks', 'Baris × Lajur', 'pk'], ['songsang-serentak', 'Songsang & Serentak', 'am']];
