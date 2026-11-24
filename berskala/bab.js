'use strict';
/* =================== BERSKALA · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'berskala',
  nama: ['SKA', 'LA'],              // nama app: bahagian kedua berwarna
  ting: 3, no: 4, tajuk: 'Lukisan Berskala',
  slogan: [['Ukur.', 'tr'], ['Skala.', 'am'], ['Lukis!', 'gr']],
  logo: 'logo.svg',
  key: 'berskala-v2',               // storan tetapan & rekod (jangan tukar)
  ajarKey: 'berskala-ajar',         // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang maksud lukisan berskala, skala 1 : n, ukuran lukisan dan ukuran sebenar, pelan serta peta.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM bab ini hanya ada SK 4.1 Lukisan Berskala, jadi subtopik app mengikut Standard Pembelajaran.
const SUBDESC = {
  '4.1.1': 'Hubungan ukuran lukisan dengan ukuran objek, dan maksud lukisan berskala',
  '4.1.2': 'Skala 1 : n, nilai n, menentukan skala dan skala peta',
  '4.1.3': 'Melukis lukisan berskala pada grid dan mencari ukuran sebenar daripada lukisan',
  '4.1.4': 'Pelan, peta, luas sebenar, kos dan masa perjalanan'
};
const SHORT = { '4.1.1': 'Maksud Lukisan', '4.1.2': 'Mentafsir Skala', '4.1.3': 'Melukis Berskala', '4.1.4': 'Penyelesaian Masalah' };
const SUBSIM = { '4.1.1': 'penukar-skala', '4.1.2': 'pelan-rumah', '4.1.3': 'lukis-grid', '4.1.4': 'pelan-rumah' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['penukar-skala', 'Penukar Skala', 'tr'], ['pelan-rumah', 'Pelan Rumah', 'am'], ['lukis-grid', 'Lukis pada Grid', 'gr']];

// Subtopik disatukan ikut nombor buku teks (25 Nov) – lihat teras/lembaran.js gabungSub()
BAB.gabung = {"4.1.1":"4.1","4.1.2":"4.1","4.1.3":"4.1","4.1.4":"4.1"};
BAB.gabungNama = {"4.1":"Lukisan Berskala"};
Object.assign(SUBDESC, {"4.1":"Maksud lukisan berskala, mentafsir skala 1 : n, menentukan skala dan ukuran, melukis pada grid, serta masalah pelan, peta, luas dan kos"});
Object.assign(SHORT, {"4.1":"Lukisan Berskala"});
Object.assign(SUBSIM, {"4.1":"penukar-skala"});
