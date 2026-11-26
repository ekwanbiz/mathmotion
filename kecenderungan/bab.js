'use strict';
/* =================== MIN MOD · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'kecenderungan',
  nama: ['MIN', 'MOD'],             // nama app: bahagian kedua berwarna
  ting: 2, no: 12, tajuk: 'Sukatan Kecenderungan Memusat',
  slogan: [['Susun.', 'am'], ['Kira.', 'tr'], ['Wakili!', 'gr']],
  logo: 'logo.svg',
  key: 'kecenderungan-v2',          // storan tetapan & rekod (jangan tukar)
  ajarKey: 'kecenderungan-ajar',    // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang mod, median, min, kesan perubahan data, data terkumpul dan memilih sukatan yang sesuai.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM bab ini hanya ada SK 12.1, jadi subtopik app ialah kumpulan Standard Pembelajaran:
// 12.1.1 = SP 12.1.1 (+ plot titik dari 12.1.6) · 12.1.2 = SP 12.1.2 · 12.1.3 = SP 12.1.3 + 12.1.4 · 12.1.4 = SP 12.1.5 – 12.1.7
const SUBDESC = {
  '12.1.1': 'Mod, median dan min bagi data tak terkumpul, jadual kekerapan dan plot titik',
  '12.1.2': 'Kesan tambah, tolak, darab, bahagi, tambah atau buang data dan nilai ekstrem',
  '12.1.3': 'Selang kelas, titik tengah, kelas mod dan min data terkumpul',
  '12.1.4': 'Memilih sukatan yang paling sesuai, plot batang-dan-daun dan penyelesaian masalah',
  '12.1': 'Mod, median dan min, kesan perubahan data, data terkumpul dan pemilihan sukatan yang sesuai'
};
const SHORT = { '12.1.1': 'Mod, Median & Min', '12.1.2': 'Kesan Perubahan', '12.1.3': 'Data Terkumpul', '12.1.4': 'Memilih Sukatan' };
const SUBSIM = { '12.1.1': 'plot-titik', '12.1.2': 'neraca-min', '12.1.3': 'data-terkumpul', '12.1.4': 'plot-titik' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['plot-titik', 'Plot Titik', 'tr'], ['neraca-min', 'Neraca Min', 'gr'], ['data-terkumpul', 'Data Terkumpul', 'pu']];

// Subtopik disatukan ikut nombor SK DSKP (12.1 ada SP 12.1.1–12.1.7) – lihat teras/lembaran.js gabungSub()
BAB.gabung = {"12.1.1": "12.1", "12.1.2": "12.1", "12.1.3": "12.1", "12.1.4": "12.1"};
BAB.gabungNama = {"12.1": "Sukatan Kecenderungan Memusat"};
