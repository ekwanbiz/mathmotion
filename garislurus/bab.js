'use strict';
/* =================== GARIS LURUS · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'garislurus',
  nama: ['GARIS', 'LURUS'],         // nama app: bahagian kedua berwarna
  ting: 3, no: 9, tajuk: 'Garis Lurus',
  slogan: [['Lukis.', 'tr'], ['Selari.', 'am'], ['Bersilang!', 'pk']],
  logo: 'logo.svg',
  key: 'garislurus-v2',             // storan tetapan & rekod (jangan tukar)
  ajarKey: 'garislurus-ajar',       // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang persamaan <i>y</i> = <i>mx</i> + <i>c</i>, bentuk lain persamaan, titik pada garis, garis selari, persamaan garis lurus dan titik persilangan.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM bab ini hanya ada SK 9.1 Garis Lurus, jadi subtopik app mengikut Standard Pembelajaran 9.1.1 – 9.1.7.
const SUBDESC = {
  '9.1.1': 'Kecerunan m dan pintasan-y c, garis mengufuk dan mencancang',
  '9.1.2': 'Bentuk am ax + by = c dan bentuk pintasan x/a + y/b = 1',
  '9.1.3': 'Menyemak titik dan mencari koordinat atau pemalar yang tidak diketahui',
  '9.1.4': 'Garis selari mempunyai kecerunan yang sama',
  '9.1.5': 'Daripada kecerunan dan satu titik, dua titik atau pintasan',
  '9.1.6': 'Kaedah graf, penggantian dan penghapusan',
  '9.1.7': 'Kadar, nilai awal dan membanding dua situasi'
};
const SHORT = { '9.1.1': 'y = mx + c', '9.1.2': 'Bentuk Lain', '9.1.3': 'Titik pada Garis', '9.1.4': 'Garis Selari', '9.1.5': 'Cari Persamaan', '9.1.6': 'Persilangan', '9.1.7': 'Masalah' };
const SUBSIM = { '9.1.1': 'main-m-c', '9.1.2': 'main-m-c', '9.1.3': 'dua-titik-persamaan', '9.1.4': 'persilangan-selari', '9.1.5': 'dua-titik-persamaan', '9.1.6': 'persilangan-selari', '9.1.7': 'persilangan-selari' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['main-m-c', 'Main m & c', 'tr'], ['dua-titik-persamaan', 'Dua Titik → Persamaan', 'pa'], ['persilangan-selari', 'Persilangan & Selari', 'pk']];
