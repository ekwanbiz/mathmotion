'use strict';
/* =================== KETAKSAMAAN · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'ketaksamaan',
  nama: ['KETAK', 'SAMAAN'],        // nama app: bahagian kedua berwarna
  ting: 4, no: 6, tajuk: 'Ketaksamaan Linear dalam Dua Pemboleh Ubah',
  slogan: [['Bentuk.', 'tr'], ['Lorek.', 'pk'], ['Sepunya!', 'am']],
  logo: 'logo.svg',
  key: 'ketaksamaan-v2',            // storan tetapan & rekod (jangan tukar)
  ajarKey: 'ketaksamaan-ajar',      // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang garis padu dan putus-putus, titik yang memuaskan ketaksamaan, rantau berlorek dan rantau sepunya bagi sistem ketaksamaan.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM Tingkatan 4 Bab 6: SK 6.1 Ketaksamaan Linear dalam Dua Pemboleh Ubah, SK 6.2 Sistem Ketaksamaan Linear.
const SUBDESC = {
  '6.1': 'Membentuk ketaksamaan daripada situasi, titik yang memuaskan, rantau di atas atau di bawah garis, garis padu dan putus-putus',
  '6.2': 'Membentuk sistem ketaksamaan, melorek rantau sepunya dan menyelesaikan masalah harian'
};
const SHORT = { '6.1': 'Ketaksamaan Linear', '6.2': 'Sistem Ketaksamaan' };
const SUBSIM = { '6.1': 'rantau-ketaksamaan', '6.2': 'sistem-ketaksamaan' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['rantau-ketaksamaan', 'Rantau Ketaksamaan', 'tr'], ['sistem-ketaksamaan', 'Sistem Ketaksamaan', 'pk'], ['masalah-harian', 'Masalah Harian', 'am']];
