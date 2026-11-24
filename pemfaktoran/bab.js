'use strict';
/* =================== PEMFAKTORAN · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'pemfaktoran',
  nama: ['FAK', 'TOR'],             // nama app: bahagian kedua berwarna
  ting: 2, no: 2, tajuk: 'Pemfaktoran dan Pecahan Algebra',
  slogan: [['Kembang.', 'tr'], ['Faktor.', 'gr'], ['Permudah!', 'pu']],
  logo: 'logo.svg',
  key: 'pemfaktoran-v2',            // storan tetapan & rekod (jangan tukar)
  ajarKey: 'pemfaktoran-ajar',      // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang kembangan, pemfaktoran (FSTB, beza dua kuasa dua, trinomial, kumpul sebutan) dan pecahan algebra.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '2.1': 'Kembangan sebutan tunggal dan dua sebutan, (a ± b)², serta permudahkan ungkapan',
  '2.2': 'Faktor sepunya terbesar, beza dua kuasa dua, trinomial dan mengumpul sebutan',
  '2.3': 'Tambah, tolak, darab dan bahagi pecahan algebra dalam bentuk termudah'
};
const SHORT = { '2.1': 'Kembangan', '2.2': 'Pemfaktoran', '2.3': 'Pecahan Algebra' };
const SUBSIM = { '2.1': 'jubin-kembangan', '2.2': 'jubin-faktor', '2.3': 'faktor-pecahan' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['jubin-kembangan', 'Jubin Kembangan', 'tr'], ['jubin-faktor', 'Bina Segi Empat', 'gr'], ['faktor-pecahan', 'Silang & Pecahan', 'pu']];
