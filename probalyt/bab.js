'use strict';
/* =================== PROBALYT · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'probalyt',
  nama: ['PROBA', 'LYT'],           // nama app: bahagian kedua berwarna
  ting: 2, no: 13, tajuk: 'Kebarangkalian Mudah',
  slogan: [['Lambung.', 'pu'], ['Cabut.', 'gr'], ['Ramal!', 'am']],
  logo: 'logo.svg',
  key: 'probalyt-v2',               // storan tetapan & rekod (jangan tukar)
  ajarKey: 'probalyt-ajar',         // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang kebarangkalian eksperimen, ruang sampel, P(A) = n(A) ÷ n(S) dan peristiwa pelengkap.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '13.1': 'Eksperimen, kesudahan, ruang sampel dan kebarangkalian eksperimen',
  '13.2': 'Kesudahan sama boleh jadi, P(A) = n(A) ÷ n(S), julat 0 hingga 1 dan ramalan',
  '13.3': 'Peristiwa pelengkap A′ dan P(A′) = 1 − P(A)',
  '13.4': 'Masalah harian: dadu, syiling, kad, guli dan cabutan bertuah'
};
const SHORT = { '13.1': 'Eksperimen', '13.2': 'Kebarangkalian Teori', '13.3': 'Pelengkap', '13.4': 'Penyelesaian Masalah' };
const SUBSIM = { '13.1': 'lambung-gulung', '13.2': 'beg-guli', '13.3': 'pelengkap', '13.4': 'beg-guli' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['lambung-gulung', 'Lambung & Putar', 'pu'], ['beg-guli', 'Beg Guli', 'gr'], ['pelengkap', 'Peristiwa Pelengkap', 'pk']];
