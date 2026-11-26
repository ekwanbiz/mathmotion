'use strict';
/* =================== RUMUS · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'rumus',
  nama: ['RU', 'MUS'],              // nama app: bahagian kedua berwarna
  ting: 2, no: 3, tajuk: 'Rumus Algebra',
  slogan: [['Tulis.', 'tr'], ['Tukar.', 'pu'], ['Ganti!', 'gr']],
  logo: 'logo.svg',
  tema2: true,                      // gaya halaman utama (cubaan 26 Nov)
  key: 'rumus-v2',                  // storan tetapan & rekod (jangan tukar)
  ajarKey: 'rumus-ajar',            // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang menulis rumus, menukar perkara rumus dan mencari nilai pemboleh ubah melalui gantian.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM bab ini hanya ada SK 3.1 Rumus Algebra, jadi subtopik app mengikut Standard Pembelajaran.
const SUBDESC = {
  '3.1.1': 'Pemboleh ubah, pemalar dan membentuk rumus daripada situasi atau rajah',
  '3.1.2': 'Operasi songsang pada kedua-dua belah, termasuk kuasa dua dan punca kuasa dua',
  '3.1.3': 'Gantian nilai, mencari pemboleh ubah yang tidak diketahui dan masalah harian'
};
const SHORT = { '3.1.1': 'Menulis Rumus', '3.1.2': 'Perkara Rumus', '3.1.3': 'Menyelesaikan Masalah' };
const SUBSIM = { '3.1.1': 'kalkulator-rumus', '3.1.2': 'neraca-rumus', '3.1.3': 'kalkulator-rumus' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['neraca-rumus', 'Neraca Rumus', 'pu'], ['kalkulator-rumus', 'Kalkulator Rumus', 'gr']];
