'use strict';
/* =================== TRIGONOMETRI · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'trigonometri',
  nama: ['TRIGO', 'NO'],            // nama app: bahagian kedua berwarna
  ting: 3, no: 5, tajuk: 'Nisbah Trigonometri',
  slogan: [['Sudut.', 'pa'], ['Nisbah.', 'pu'], ['Ukur!', 'gr']],
  logo: 'logo.svg',
  key: 'trigonometri-v2',           // storan tetapan & rekod (jangan tukar)
  ajarKey: 'trigonometri-ajar',     // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang hipotenus, sisi bertentangan dan bersebelahan, sin, kos, tan, sudut khas serta mencari sisi dan sudut.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM bab ini hanya ada SK 5.1 (SP 5.1.1 – 5.1.7). Subtopik app mengikut Standard Pembelajaran:
// 5.1.1 · 5.1.2 (+ SP 5.1.3) · 5.1.4 (+ SP 5.1.5, 5.1.6) · 5.1.7
const SUBDESC = {
  '5.1.1': 'Hipotenus, sisi bertentangan dan sisi bersebelahan bagi suatu sudut tirus',
  '5.1.2': 'Takrif sin θ, kos θ, tan θ, nisbah tetap bagi sudut sama dan kesan perubahan sudut',
  '5.1.4': 'Nilai dengan kalkulator, darjah dan minit, sudut khas 30°, 45°, 60° dan operasi',
  '5.1.7': 'Mencari sisi dan sudut dalam situasi harian'
};
const SHORT = { '5.1.1': 'Sisi Segi Tiga', '5.1.2': 'Sin, Kos & Tan', '5.1.4': 'Nilai & Sudut Khas', '5.1.7': 'Penyelesaian Masalah' };
const SUBSIM = { '5.1.1': 'sisi-sudut', '5.1.2': 'segi-tiga-serupa', '5.1.4': 'sisi-sudut', '5.1.7': 'klinometer' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['sisi-sudut', 'Sisi & Sudut', 'pa'], ['segi-tiga-serupa', 'Segi Tiga Serupa', 'pu'], ['klinometer', 'Klinometer', 'gr']];
