'use strict';
/* =================== KOORDINAT · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'koordinat',
  nama: ['KOOR', 'DINAT'],          // nama app: bahagian kedua berwarna
  ting: 2, no: 7, tajuk: 'Koordinat',
  slogan: [['Plot.', 'tr'], ['Ukur.', 'gr'], ['Jelajah!', 'pa']],
  logo: 'logo.svg',
  key: 'koordinat-v2',              // storan tetapan & rekod (jangan tukar)
  ajarKey: 'koordinat-ajar',        // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang jarak dua titik, titik tengah, titik hujung dan bentuk pada satah Cartes.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '7.1': 'Jarak mengufuk, mencancang dan rumus jarak (Teorem Pythagoras)',
  '7.2': 'Rumus titik tengah dan mencari titik hujung',
  '7.3': 'Penyelesaian masalah: perimeter, bentuk geometri dan peta'
};
const SHORT = { '7.1': 'Jarak', '7.2': 'Titik Tengah', '7.3': 'Penyelesaian Masalah' };
const SUBSIM = { '7.1': 'jarak-dua-titik', '7.2': 'titik-tengah', '7.3': 'peta-harta' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['jarak-dua-titik', 'Jarak Dua Titik', 'tr'], ['titik-tengah', 'Titik Tengah', 'gr'], ['peta-harta', 'Peta Harta Karun', 'pa']];
