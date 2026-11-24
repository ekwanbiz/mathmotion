'use strict';
/* =================== INDEKS · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'indeks',
  nama: ['IN', 'DEKS'],             // nama app: bahagian kedua berwarna
  ting: 3, no: 1, tajuk: 'Indeks',
  slogan: [['Darab.', 'am'], ['Kuasa.', 'pu'], ['Ringkas!', 'gr']],
  logo: 'logo.svg',
  key: 'indeks-v2',                 // storan tetapan & rekod (jangan tukar)
  ajarKey: 'indeks-ajar',           // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang bentuk indeks, nilai kuasa, hukum indeks, indeks sifar, negatif dan pecahan.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM: SK 1.1 Tatatanda Indeks (SP 1.1.1–1.1.2) dan SK 1.2 Hukum Indeks (SP 1.2.1–1.2.7).
const SUBDESC = {
  '1.1': 'Bentuk indeks aⁿ, asas dan indeks, pendaraban berulang dan menukar nombor kepada bentuk indeks',
  '1.2': 'Hukum darab, bahagi dan kuasa, indeks sifar, negatif dan pecahan, serta persamaan indeks'
};
const SHORT = { '1.1': 'Tatatanda Indeks', '1.2': 'Hukum Indeks' };
const SUBSIM = { '1.1': 'gandaan-separuh', '1.2': 'pembina-kuasa' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['pembina-kuasa', 'Pembina Kuasa', 'am'], ['mesin-hukum', 'Mesin Hukum', 'pu'], ['gandaan-separuh', 'Gandaan & Separuh', 'gr']];
