'use strict';
/* =================== SUDUT BULAT · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'sudutbulatan',
  nama: ['SUDUT', 'BULAT'],         // nama app: bahagian kedua berwarna
  ting: 3, no: 6, tajuk: 'Sudut dan Tangen bagi Bulatan',
  slogan: [['Cangkum.', 'tr'], ['Kitar.', 'pu'], ['Sentuh!', 'gr']],
  logo: 'logo.svg',
  key: 'sudutbulatan-v2',           // storan tetapan & rekod (jangan tukar)
  ajarKey: 'sudutbulatan-ajar',     // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang sudut pada lilitan, sudut pusat, sisi empat kitaran dan tangen kepada bulatan.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '6.1': 'Sudut dicangkum lengkok yang sama, sudut pusat = 2 × sudut pada lilitan, sudut dalam semibulatan',
  '6.2': 'Sudut bertentangan berjumlah 180° dan sudut peluaran = sudut pedalaman bertentangan',
  '6.3': 'Tangen ⊥ jejari, dua tangen dari titik luar, tembereng selang-seli dan tangen sepunya',
  '6.4': 'Gabungan sifat sudut dan tangen untuk menyelesaikan masalah'
};
const SHORT = { '6.1': 'Sudut Lilitan & Pusat', '6.2': 'Sisi Empat Kitaran', '6.3': 'Tangen', '6.4': 'Sudut & Tangen' };
const SUBSIM = { '6.1': 'sudut-lilitan', '6.2': 'sisi-empat-kitaran', '6.3': 'tangen', '6.4': 'tangen' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['sudut-lilitan', 'Sudut Lilitan & Pusat', 'tr'], ['sisi-empat-kitaran', 'Sisi Empat Kitaran', 'pu'], ['tangen', 'Tangen Bulatan', 'gr']];
