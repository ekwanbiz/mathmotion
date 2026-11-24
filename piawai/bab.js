'use strict';
/* =================== PIAWAI · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'piawai',
  nama: ['PIA', 'WAI'],             // nama app: bahagian kedua berwarna
  ting: 3, no: 2, tajuk: 'Bentuk Piawai',
  slogan: [['Kira.', 'tr'], ['Bundar.', 'am'], ['Ringkaskan!', 'pu']],
  logo: 'logo.svg',
  key: 'piawai-v2',                 // storan tetapan & rekod (jangan tukar)
  ajarKey: 'piawai-ajar',           // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang angka bererti, membundarkan, bentuk piawai dan operasi dalam bentuk piawai.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '2.1': 'Mengenal pasti angka bererti dan membundarkan nombor kepada bilangan angka bererti tertentu',
  '2.2': 'Menulis nombor dalam bentuk A × 10ⁿ, operasi tambah, tolak, darab, bahagi dan penyelesaian masalah'
};
const SHORT = { '2.1': 'Angka Bererti', '2.2': 'Bentuk Piawai' };
const SUBSIM = { '2.1': 'angka-bererti', '2.2': 'skala-alam' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['angka-bererti', 'Angka Bererti', 'tr'], ['skala-alam', 'Skala Alam', 'pu']];
