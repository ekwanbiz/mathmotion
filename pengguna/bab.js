'use strict';
/* =================== WANGKU · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'pengguna',
  nama: ['WANG', 'KU'],             // nama app: bahagian kedua berwarna
  ting: 3, no: 3, tajuk: 'Matematik Pengguna: Simpanan dan Pelaburan, Kredit dan Hutang',
  slogan: [['Simpan.', 'gr'], ['Labur.', 'am'], ['Bijak!', 'pa']],
  logo: 'logo.svg',
  key: 'pengguna-v2',               // storan tetapan & rekod (jangan tukar)
  ajarKey: 'pengguna-ajar',         // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang faedah mudah dan kompaun, nilai matang, pulangan pelaburan, purata kos seunit, kad kredit dan ansuran pinjaman.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM bab ini ada dua SK: 3.1 Simpanan dan Pelaburan, 3.2 Pengurusan Kredit dan Hutang.
const SUBDESC = {
  '3.1': 'Jenis simpanan & pelaburan, faedah mudah & kompaun, nilai matang, pulangan pelaburan, risiko & kecairan, purata kos seunit',
  '3.2': 'Kredit & hutang, kad kredit, bayaran minimum, caj kewangan & caj lewat bayaran, jumlah bayaran balik & ansuran pinjaman'
};
const SHORT = { '3.1': 'Simpanan & Pelaburan', '3.2': 'Kredit & Hutang' };
const SUBSIM = { '3.1': 'faedah-tumbuh', '3.2': 'kad-kredit' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['faedah-tumbuh', 'Faedah Bertumbuh', 'gr'], ['kad-kredit', 'Kad Kredit', 'pa'], ['ansuran-pinjaman', 'Ansuran Pinjaman', 'tr']];
