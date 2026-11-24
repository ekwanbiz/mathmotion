'use strict';
/* =================== ASAS NOMBOR · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'asasnombor',
  nama: ['ASAS', 'NOMBOR'],         // nama app: bahagian kedua berwarna
  ting: 4, no: 2, tajuk: 'Asas Nombor',
  slogan: [['Kumpul.', 'tr'], ['Tukar.', 'pa'], ['Kira!', 'gr']],
  logo: 'logo.svg',
  key: 'asasnombor-v2',             // storan tetapan & rekod (jangan tukar)
  ajarKey: 'asasnombor-ajar',       // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang nilai tempat, nilai digit, penukaran nombor antara asas, tambah dan tolak dalam asas yang sama serta mencari digit atau asas yang tidak diketahui.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM: SK 2.1 Asas Nombor (SP 2.1.1 – 2.1.4). Bab ini hanya ada satu SK, jadi subtopik app
// mengikut Standard Pembelajaran: 2.1.1 · 2.1.2 · 2.1.3 · 2.1.4
const SUBDESC = {
  '2.1.1': 'Asas dua hingga sepuluh, konsep pengumpulan, nilai tempat, nilai digit dan nilai nombor',
  '2.1.2': 'Tukar asas n kepada asas sepuluh dan sebaliknya, tukar antara dua asas, asas dua dan asas lapan',
  '2.1.3': 'Tambah dengan "bawa" dan tolak dengan "pinjam" dalam asas yang sama',
  '2.1.4': 'Banding dan susun nombor, cari digit atau asas yang tidak diketahui, masalah harian'
};
const SHORT = { '2.1.1': 'Nilai Tempat', '2.1.2': 'Penukaran', '2.1.3': 'Tambah & Tolak', '2.1.4': 'Masalah' };
const SUBSIM = { '2.1.1': 'kotak-nilai-tempat', '2.1.2': 'penukar-asas', '2.1.3': 'tambah-tolak-asas', '2.1.4': 'penukar-asas' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['kotak-nilai-tempat', 'Kotak Nilai Tempat', 'tr'], ['penukar-asas', 'Penukar Asas', 'pa'], ['tambah-tolak-asas', 'Tambah & Tolak Asas', 'gr']];
