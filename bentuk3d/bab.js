'use strict';
/* =================== BENTUK3D · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'bentuk3d',
  nama: ['BENTUK', '3D'],           // nama app: bahagian kedua berwarna
  ting: 2, no: 6, tajuk: 'Bentuk Geometri Tiga Dimensi',
  slogan: [['Putar.', 'gr'], ['Buka.', 'pu'], ['Isi!', 'tr']],
  logo: 'logo.svg',
  key: 'bentuk3d-v2',               // storan tetapan & rekod (jangan tukar)
  ajarKey: 'bentuk3d-ajar',         // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang muka, tepi dan bucu, bentangan, luas permukaan dan isi padu bentuk 3D.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '6.1': 'Prisma, piramid, silinder, kon dan sfera: muka, tepi, bucu dan tapak',
  '6.2': 'Kenal pasti dan lukis bentangan, bentangan yang boleh membentuk pepejal',
  '6.3': 'Jumlah luas semua muka: kubus, kuboid, prisma, piramid, silinder, kon dan sfera',
  '6.4': 'Prisma, silinder, piramid, kon dan sfera, tukar unit dan gabungan pepejal'
};
const SHORT = { '6.1': 'Sifat Bentuk 3D', '6.2': 'Bentangan', '6.3': 'Luas Permukaan', '6.4': 'Isi Padu' };
const SUBSIM = { '6.1': 'putar-3d', '6.2': 'bentangan', '6.3': 'bentangan', '6.4': 'isi-air' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['putar-3d', 'Putar 3D', 'gr'], ['bentangan', 'Buka Bentangan', 'pu'], ['isi-air', 'Isi Air', 'tr']];
