'use strict';
/* =================== PECUT · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'pecut',
  nama: ['PE', 'CUT'],              // nama app: bahagian kedua berwarna
  ting: 2, no: 9, tajuk: 'Laju dan Pecutan',
  slogan: [['Gerak.', 'rd'], ['Ukur.', 'tr'], ['Pecut!', 'am']],
  logo: 'logo.svg',
  key: 'pecut-v2',                  // storan tetapan & rekod (jangan tukar)
  ajarKey: 'pecut-ajar',            // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang laju, jarak, masa, laju purata, penukaran unit, pecutan dan nyahpecutan.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '9.1': 'Laju = jarak ÷ masa, laju seragam & tak seragam, laju purata dan tukar unit',
  '9.2': 'Pecutan = perubahan laju ÷ masa, nyahpecutan, pecutan sifar dan unit m/s²'
};
const SHORT = { '9.1': 'Laju', '9.2': 'Pecutan' };
const SUBSIM = { '9.1': 'perjalanan', '9.2': 'pedal-minyak' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['lumba-laju', 'Lumba Laju', 'rd'], ['perjalanan', 'Laju Purata', 'tr'], ['pedal-minyak', 'Pedal Minyak', 'am']];
