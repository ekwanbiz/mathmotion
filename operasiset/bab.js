'use strict';
/* =================== OPERASI SET · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'operasiset',
  nama: ['OPERASI', 'SET'],         // nama app: bahagian kedua berwarna
  ting: 4, no: 4, tajuk: 'Operasi Set',
  slogan: [['Silang.', 'gr'], ['Satukan.', 'pa'], ['Lorek!', 'pu']],
  logo: 'logo.svg',
  key: 'operasiset-v2',             // storan tetapan & rekod (jangan tukar)
  ajarKey: 'operasiset-ajar',       // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang persilangan, kesatuan, pelengkap, rantau berlorek dalam gambar rajah Venn dan bilangan unsur set.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '4.1': 'A ∩ B, persilangan tiga set, pelengkap (A ∩ B)′ dan penyelesaian masalah',
  '4.2': 'A ∪ B, kesatuan tiga set, pelengkap (A ∪ B)′ dan n(A ∪ B)',
  '4.3': 'Gabungan ∩, ∪ dan ′, melorek dan menamakan rantau, masalah tiga set'
};
const SHORT = { '4.1': 'Persilangan', '4.2': 'Kesatuan', '4.3': 'Gabungan Operasi' };
const SUBSIM = { '4.1': 'venn-berlorek', '4.2': 'seret-unsur', '4.3': 'cabaran-lorek' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['venn-berlorek', 'Venn Berlorek', 'gr'], ['seret-unsur', 'Seret Unsur', 'pa'], ['cabaran-lorek', 'Cabaran Lorek', 'pu']];
