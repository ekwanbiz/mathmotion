'use strict';
/* =================== POLIGON · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'poligon',
  nama: ['POLI', 'GON'],            // nama app: bahagian kedua berwarna
  ting: 2, no: 4, tajuk: 'Poligon',
  slogan: [['Bina.', 'tr'], ['Sudut.', 'pa'], ['Pusing!', 'gr']],
  logo: 'logo.svg',
  key: 'poligon-v2',                // storan tetapan & rekod (jangan tukar)
  ajarKey: 'poligon-ajar',          // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang nama poligon, paksi simetri, hasil tambah sudut pedalaman, sudut peluaran dan bilangan sisi.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '4.1': 'Sifat poligon sekata, paksi simetri dan membina poligon sekata',
  '4.2': 'Hasil tambah sudut pedalaman (n − 2) × 180°, sudut peluaran 360° dan bilangan sisi'
};
const SHORT = { '4.1': 'Poligon Sekata', '4.2': 'Sudut Pedalaman & Peluaran' };
const SUBSIM = { '4.1': 'pembina-poligon', '4.2': 'pembahagian-segi-tiga' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['pembina-poligon', 'Pembina Poligon', 'tr'], ['pembahagian-segi-tiga', 'Pembahagian Segi Tiga', 'pa'], ['jalan-keliling', 'Jalan Keliling', 'gr']];
