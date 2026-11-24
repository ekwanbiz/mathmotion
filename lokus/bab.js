'use strict';
/* =================== LOKUS · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'lokus',
  nama: ['LO', 'KUS'],              // nama app: bahagian kedua berwarna
  ting: 3, no: 8, tajuk: 'Lokus dalam Dua Dimensi',
  slogan: [['Gerak.', 'gr'], ['Jejak.', 'pk'], ['Bersilang!', 'pu']],
  logo: 'logo.svg',
  key: 'lokus-v2',                  // storan tetapan & rekod (jangan tukar)
  ajarKey: 'lokus-ajar',            // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang lokus dalam situasi harian, lima jenis lokus asas dan persilangan dua lokus.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM Bab 8: SK 8.1 Lokus dan SK 8.2 Lokus dalam Dua Dimensi.
const SUBDESC = {
  '8.1': 'Maksud lokus, lokus dalam situasi harian (2D & 3D) dan titik yang memenuhi syarat',
  '8.2': 'Lima lokus asas, membina lokus dan persilangan dua lokus'
};
const SHORT = { '8.1': 'Lokus', '8.2': 'Lokus 2D' };
const SUBSIM = { '8.1': 'lokus-harian', '8.2': 'jejak-lokus' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['lokus-harian', 'Lokus Harian', 'am'], ['jejak-lokus', 'Jejak Lokus', 'gr'], ['persilangan-lokus', 'Persilangan Lokus', 'pu']];
