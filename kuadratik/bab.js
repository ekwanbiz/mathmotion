'use strict';
/* =================== KUADRATIK · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'kuadratik',
  nama: ['KUADRA', 'TIK'],          // nama app: bahagian kedua berwarna
  ting: 4, no: 1, tajuk: 'Fungsi dan Persamaan Kuadratik dalam Satu Pemboleh Ubah',
  slogan: [['Lengkung.', 'tr'], ['Faktor.', 'pk'], ['Punca!', 'am']],
  logo: 'logo.svg',
  key: 'kuadratik-v2',              // storan tetapan & rekod (jangan tukar)
  ajarKey: 'kuadratik-ajar',        // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang bentuk graf, paksi simetri, titik maksimum atau minimum, kesan <i>a</i>, <i>b</i> dan <i>c</i>, serta punca persamaan kuadratik.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM bab ini hanya ada SK 1.1 Fungsi dan Persamaan Kuadratik (SP 1.1.1 – 1.1.8). Subtopik app mengikut Standard Pembelajaran:
// 1.1.1 (+ SP 1.1.2) · 1.1.3 · 1.1.4 (+ SP 1.1.5) · 1.1.6 (+ SP 1.1.7, 1.1.8)
const SUBDESC = {
  '1.1.1': 'Ungkapan kuadratik, fungsi banyak kepada satu, bentuk graf, paksi simetri dan titik maksimum atau minimum',
  '1.1.3': 'Kesan perubahan nilai a, b dan c terhadap bentuk dan kedudukan graf f(x) = ax² + bx + c',
  '1.1.4': 'Membentuk fungsi kuadratik daripada situasi, persamaan kuadratik dan maksud punca',
  '1.1.6': 'Menyelesaikan persamaan dengan pemfaktoran, melakar graf dan menyelesaikan masalah'
};
const SHORT = { '1.1.1': 'Fungsi Kuadratik', '1.1.3': 'Kesan a, b, c', '1.1.4': 'Persamaan & Punca', '1.1.6': 'Pemfaktoran & Masalah' };
const SUBSIM = { '1.1.1': 'main-abc', '1.1.3': 'main-abc', '1.1.4': 'punca-pintasan', '1.1.6': 'masalah-harian' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['main-abc', 'Main a, b, c', 'tr'], ['punca-pintasan', 'Punca & Pintasan-x', 'pk'], ['masalah-harian', 'Nilai Maksimum Harian', 'am']];

// Subtopik disatukan ikut nombor buku teks (25 Nov) – lihat teras/lembaran.js gabungSub()
BAB.gabung = {"1.1.1": "1.1", "1.1.3": "1.1", "1.1.4": "1.1", "1.1.6": "1.1"};
BAB.gabungNama = {"1.1": "Fungsi dan Persamaan Kuadratik"};
Object.assign(SUBDESC, {"1.1": "Fungsi kuadratik, kesan a, b dan c, persamaan kuadratik, punca, pemfaktoran dan penyelesaian masalah"});
Object.assign(SHORT, {"1.1": "Fungsi & Persamaan"});
Object.assign(SUBSIM, {"1.1": "main-abc"});
