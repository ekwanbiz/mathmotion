'use strict';
/* =================== PERISTIWA · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'peristiwa',
  nama: ['PERIS', 'TIWA'],          // nama app: bahagian kedua berwarna
  ting: 4, no: 9, tajuk: 'Kebarangkalian Peristiwa Bergabung',
  slogan: [['Gabung.', 'tr'], ['Darab.', 'gr'], ['Tambah!', 'pu']],
  logo: 'logo.svg',
  key: 'peristiwa-v2',              // storan tetapan & rekod (jangan tukar)
  ajarKey: 'peristiwa-ajar',        // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang ruang sampel peristiwa bergabung, peristiwa bersandar dan tak bersandar, peristiwa saling eksklusif dan aplikasinya.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '9.1': 'Peristiwa bergabung, ruang sampel pasangan tertib, gambar rajah pokok dan jadual',
  '9.2': 'Peristiwa bersandar dan tak bersandar, P(A ∩ B) = P(A) × P(B), dengan dan tanpa pemulangan',
  '9.3': 'Peristiwa saling eksklusif dan tidak saling eksklusif, P(A ∪ B) = P(A) + P(B) − P(A ∩ B)',
  '9.4': 'Masalah harian: rajah pokok, "tepat satu", "sekurang-kurangnya satu" dan dua dadu'
};
const SHORT = { '9.1': 'Peristiwa Bergabung', '9.2': 'Bersandar & Tak Bersandar', '9.3': 'Saling Eksklusif', '9.4': 'Aplikasi' };
const SUBSIM = { '9.1': 'grid-dadu', '9.2': 'pokok-cabutan', '9.3': 'venn-peristiwa', '9.4': 'pokok-cabutan' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['pokok-cabutan', 'Rajah Pokok Cabutan', 'tr'], ['grid-dadu', 'Grid Dua Dadu', 'gr'], ['venn-peristiwa', 'Venn Peristiwa', 'pu']];
