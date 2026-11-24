'use strict';
/* =================== POLA · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'pola',
  nama: ['PO', 'LA'],               // nama app: bahagian kedua berwarna
  ting: 2, no: 1, tajuk: 'Pola dan Jujukan',
  slogan: [['Perhati.', 'am'], ['Teka.', 'tr'], ['Buktikan!', 'gr']],
  logo: 'logo.svg',
  key: 'pola-v2',                   // storan tetapan & rekod (jangan tukar)
  ajarKey: 'pola-ajar',             // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang pola nombor, segi tiga Pascal, nombor Fibonacci, melengkapkan jujukan dan sebutan ke-n.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '1.1': 'Pola nombor dan objek, nombor genap dan ganjil, segi tiga Pascal dan nombor Fibonacci',
  '1.2': 'Maksud jujukan, melengkapkan jujukan dan menghuraikan pola dengan perkataan',
  '1.3': 'Sebutan ke-n, ungkapan algebra Tn, sebutan tertentu dan penyelesaian masalah'
};
const SHORT = { '1.1': 'Pola', '1.2': 'Jujukan', '1.3': 'Sebutan ke-n' };
const SUBSIM = { '1.1': 'pascal-fibonacci', '1.2': 'pembina-pola', '1.3': 'mesin-sebutan' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['pembina-pola', 'Pembina Pola', 'am'], ['pascal-fibonacci', 'Pascal & Fibonacci', 'tr'], ['mesin-sebutan', 'Mesin Sebutan ke-n', 'gr']];
