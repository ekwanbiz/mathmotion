'use strict';
/* =================== SERAKAN · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'serakan',
  nama: ['SERA', 'KAN'],            // nama app: bahagian kedua berwarna
  ting: 4, no: 8, tajuk: 'Sukatan Serakan Data Tak Terkumpul',
  slogan: [['Sebar.', 'tr'], ['Ukur.', 'pa'], ['Banding!', 'gr']],
  logo: 'logo.svg',
  key: 'serakan-v2',                // storan tetapan & rekod (jangan tukar)
  ajarKey: 'serakan-ajar',          // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang julat, kuartil, julat antara kuartil, varians, sisihan piawai, plot kotak dan kesan perubahan data.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM Bab 8: SK 8.1 Serakan (SP 8.1.1) dan SK 8.2 Sukatan Serakan (SP 8.2.1 – 8.2.6).
// Subtopik app: 8.1.1 = SP 8.1.1 · 8.2.1 = SP 8.2.1 (julat, kuartil, JAK) · 8.2.2 = SP 8.2.1 (varians, sisihan piawai) + SP 8.2.2
//               8.2.3 = SP 8.2.3 (plot kotak) · 8.2.4 = SP 8.2.4 – 8.2.6 (kesan perubahan, pencilan, banding, penyelesaian masalah)
const SUBDESC = {
  '8.1.1': 'Maksud serakan, plot titik, plot batang-dan-daun dan membanding dua set data',
  '8.2.1': 'Julat, kuartil pertama dan ketiga, dan julat antara kuartil',
  '8.2.2': 'Varians, sisihan piawai, jadual kekerapan serta kelebihan dan kekurangan sukatan',
  '8.2.3': 'Lima nilai plot kotak, membina, membaca dan membanding plot kotak',
  '8.2.4': 'Kesan perubahan seragam, pencilan, membanding set data dan penyelesaian masalah'
};
const SHORT = { '8.1.1': 'Serakan', '8.2.1': 'Julat & JAK', '8.2.2': 'Varians & σ', '8.2.3': 'Plot Kotak', '8.2.4': 'Perubahan & Banding' };
const SUBSIM = { '8.1.1': 'plot-kotak', '8.2.1': 'plot-kotak', '8.2.2': 'sisihan-piawai', '8.2.3': 'plot-kotak', '8.2.4': 'kesan-perubahan' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['plot-kotak', 'Plot Titik & Plot Kotak', 'pu'], ['sisihan-piawai', 'Sisihan Piawai', 'pk'], ['kesan-perubahan', 'Kesan Perubahan', 'gr']];

// Subtopik disatukan ikut nombor buku teks (25 Nov) – lihat teras/lembaran.js gabungSub()
BAB.gabung = {"8.1.1": "8.1", "8.2.1": "8.2", "8.2.2": "8.2", "8.2.3": "8.2", "8.2.4": "8.2"};
BAB.gabungNama = {"8.1": "Serakan", "8.2": "Sukatan Serakan"};
Object.assign(SUBDESC, {"8.1": "Maksud serakan, plot titik, plot batang-dan-daun dan membanding dua set data", "8.2": "Julat, kuartil, julat antara kuartil, varians, sisihan piawai, plot kotak dan kesan perubahan data"});
Object.assign(SHORT, {"8.1": "Serakan", "8.2": "Sukatan Serakan"});
Object.assign(SUBSIM, {"8.1": "plot-kotak", "8.2": "sisihan-piawai"});
