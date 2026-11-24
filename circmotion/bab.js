'use strict';
/* =================== CIRCMOTION · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'circmotion',
  nama: ['CIRC', 'MOTION'],         // nama app: bahagian kedua berwarna
  ting: 2, no: 5, tajuk: 'Bulatan',
  slogan: [['Kenal.', 'pa'], ['Golek.', 'gr'], ['Ukur!', 'pu']],
  logo: 'logo.svg',
  key: 'circmotion-v2',             // storan tetapan & rekod (jangan tukar)
  ajarKey: 'circmotion-ajar',       // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang bahagian, perentas, lilitan dan luas bulatan.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '5.1': 'Pusat, jejari, diameter dan bahagian bulatan',
  '5.2': 'Pembahagi dua sama serenjang, perentas dan pusat',
  '5.3': 'Nilai π, lilitan, lengkok, luas dan sektor'
};
const SHORT = { '5.1': 'Sifat Bulatan', '5.2': 'Simetri Perentas', '5.3': 'Lilitan & Luas' };
const SUBSIM = { '5.1': 'bahagian-bulatan', '5.2': 'simetri-perentas', '5.3': 'lilitan-luas' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['bahagian-bulatan', 'Bahagian Bulatan', 'pa'], ['simetri-perentas', 'Simetri Perentas', 'tr'], ['lilitan-luas', 'Lilitan & Luas', 'gr'], ['lengkok-sektor', 'Lengkok & Sektor', 'pu']];
