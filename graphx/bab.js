'use strict';
/* =================== GRAPHX · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'graphx',
  nama: ['GRAPH', 'X'],             // nama app: bahagian kedua berwarna
  ting: 2, no: 8, tajuk: 'Graf Fungsi',
  slogan: [['Masuk.', 'pu'], ['Plot.', 'tr'], ['Kenal!', 'gr']],
  logo: 'logo.svg',
  key: 'graphx-v2',                 // storan tetapan & rekod (jangan tukar)
  ajarKey: 'graphx-ajar',           // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang fungsi, objek dan imej, nilai f(x), jadual nilai dan bentuk graf.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '8.1': 'Hubungan, objek dan imej, jenis hubungan, tatatanda f(x) dan mesin fungsi',
  '8.2': 'Jadual nilai, skala, plot titik, lukis dan baca graf, bentuk graf'
};
const SHORT = { '8.1': 'Fungsi', '8.2': 'Graf Fungsi' };
const SUBSIM = { '8.1': 'mesin-fungsi', '8.2': 'lukis-graf' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['mesin-fungsi', 'Mesin Fungsi', 'pu'], ['lukis-graf', 'Lukis Graf', 'tr'], ['bentuk-graf', 'Bentuk Graf', 'gr']];
