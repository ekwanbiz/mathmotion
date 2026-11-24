'use strict';
/* =================== GRADIEN · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'gradien',
  nama: ['GRAD', 'IEN'],            // nama app: bahagian kedua berwarna
  ting: 2, no: 10, tajuk: 'Kecerunan Garis Lurus',
  slogan: [['Condong.', 'am'], ['Kira.', 'tr'], ['Banding!', 'gr']],
  logo: 'logo.svg',
  key: 'gradien-v2',                // storan tetapan & rekod (jangan tukar)
  ajarKey: 'gradien-ajar',          // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang jarak mencancang dan mengufuk, rumus dua titik, arah kecondongan dan pintasan.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM bab ini hanya ada SK 10.1 Kecerunan, jadi subtopik app mengikut Standard Pembelajaran.
const SUBDESC = {
  '10.1.1': 'Jarak mencancang ÷ jarak mengufuk, cerun dalam kehidupan dan kecuraman',
  '10.1.2': 'Rumus m = (y₂ − y₁) ÷ (x₂ − x₁) pada satah Cartes',
  '10.1.3': 'Kecerunan positif, negatif, sifar, tidak tertakrif dan pintasan'
};
const SHORT = { '10.1.1': 'Kecerunan & Jarak', '10.1.2': 'Rumus Dua Titik', '10.1.3': 'Arah & Pintasan' };
const SUBSIM = { '10.1.1': 'cerun-harian', '10.1.2': 'dua-titik', '10.1.3': 'arah-kecondongan' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['cerun-harian', 'Cerun Harian', 'am'], ['dua-titik', 'Dua Titik', 'tr'], ['arah-kecondongan', 'Arah Kecondongan', 'gr']];
