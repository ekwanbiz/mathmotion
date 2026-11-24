'use strict';
/* =================== GRAF GERAKAN · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'grafgerakan',
  nama: ['GRAF', 'GERAK'],          // nama app: bahagian kedua berwarna
  ting: 4, no: 7, tajuk: 'Graf Gerakan',
  slogan: [['Gerak.', 'tr'], ['Plot.', 'am'], ['Tafsir!', 'pa']],
  logo: 'logo.svg',
  key: 'grafgerakan-v2',            // storan tetapan & rekod (jangan tukar)
  ajarKey: 'grafgerakan-ajar',      // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang graf jarak-masa (laju, pegun, laju purata) dan graf laju-masa (pecutan, nyahpecutan, jarak = luas di bawah graf).',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '7.1': 'Lukis dan tafsir graf jarak-masa: kecerunan = laju, garis mengufuk = pegun, laju purata',
  '7.2': 'Lukis dan tafsir graf laju-masa: kecerunan = pecutan, jarak = luas di bawah graf'
};
const SHORT = { '7.1': 'Graf Jarak-Masa', '7.2': 'Graf Laju-Masa' };
const SUBSIM = { '7.1': 'kereta-graf', '7.2': 'luas-laju' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['kereta-graf', 'Kereta & Graf', 'tr'], ['luas-laju', 'Luas & Pecutan', 'pa'], ['padan-cerita', 'Padan Cerita', 'gr']];
