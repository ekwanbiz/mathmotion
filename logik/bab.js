'use strict';
/* =================== LOGIK · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'logik',
  nama: ['LO', 'GIK'],              // nama app: bahagian kedua berwarna
  ting: 4, no: 3, tajuk: 'Penaakulan Logik',
  slogan: [['Nyatakan.', 'tr'], ['Hubungkan.', 'pu'], ['Simpulkan!', 'gr']],
  logo: 'logo.svg',
  key: 'logik-v2',                  // storan tetapan & rekod (jangan tukar)
  ajarKey: 'logik-ajar',            // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang pernyataan, penafian, nilai kebenaran "dan" dan "atau", implikasi, akas, songsangan, kontrapositif, bentuk hujah deduktif dan kesimpulan umum induktif.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM: SK 3.1 Pernyataan (SP 3.1.1 – 3.1.6) dan SK 3.2 Hujah (SP 3.2.1 – 3.2.6).
// Subtopik app mengikut Standard Pembelajaran (id = SP pertama dalam kumpulan):
// 3.1.1 (+ SP 3.1.2) · 3.1.3 · 3.1.4 (+ SP 3.1.5, 3.1.6) · 3.2.1 (+ SP 3.2.2, 3.2.3) · 3.2.4 (+ SP 3.2.5, 3.2.6)
const SUBDESC = {
  '3.1.1': 'Maksud pernyataan, nilai kebenaran, "semua" dan "sebilangan", penafian ~p',
  '3.1.3': 'Nilai kebenaran pernyataan majmuk dengan "dan" dan "atau"',
  '3.1.4': 'Jika p, maka q; jika dan hanya jika; akas, songsangan, kontrapositif dan contoh penyangkal',
  '3.2.1': 'Premis dan kesimpulan, Bentuk I, II, III, hujah sah dan munasabah',
  '3.2.4': 'Hujah kuat, lemah dan meyakinkan, kesimpulan umum daripada pola dan penyelesaian masalah'
};
const SHORT = { '3.1.1': 'Pernyataan', '3.1.3': 'Majmuk', '3.1.4': 'Implikasi', '3.2.1': 'Deduktif', '3.2.4': 'Induktif' };
const SUBSIM = { '3.1.1': 'jadual-kebenaran', '3.1.3': 'jadual-kebenaran', '3.1.4': 'pembina-implikasi', '3.2.1': 'pengesah-hujah', '3.2.4': 'pengesah-hujah' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['jadual-kebenaran', 'Jadual Kebenaran', 'pa'], ['pembina-implikasi', 'Pembina Implikasi', 'pu'], ['pengesah-hujah', 'Pengesah Hujah', 'gr']];

// Subtopik disatukan ikut nombor buku teks (25 Nov) – lihat teras/lembaran.js gabungSub()
BAB.gabung = {"3.1.1": "3.1", "3.1.3": "3.1", "3.1.4": "3.1", "3.2.1": "3.2", "3.2.4": "3.2"};
BAB.gabungNama = {"3.1": "Pernyataan", "3.2": "Hujah"};
Object.assign(SUBDESC, {"3.1": "Pernyataan, nilai kebenaran, penafian, pernyataan majmuk, implikasi, akas, songsangan dan kontrapositif", "3.2": "Hujah deduktif (Bentuk I, II, III) dan hujah induktif, sah, munasabah dan meyakinkan"});
Object.assign(SHORT, {"3.1": "Pernyataan", "3.2": "Hujah"});
Object.assign(SUBSIM, {"3.1": "jadual-kebenaran", "3.2": "pengesah-hujah"});
