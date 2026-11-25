'use strict';
/* =================== ISOMOVE · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'isomove',
  nama: ['ISO', 'MOVE'],            // nama app: bahagian kedua berwarna
  ting: 2, no: 11, tajuk: 'Transformasi Isometri',
  slogan: [['Gerak.', 'tr'], ['Pantul.', 'pa'], ['Putar!', 'pu']],
  logo: 'logo.svg',
  gtopik: true,                     // pilihan jenis soalan dalam semua game (percubaan)
  key: 'isomove-v2',                // storan tetapan & rekod (jangan tukar)
  ajarKey: 'isomove-ajar',          // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Semua soalan <b>pilih jawapan</b> daripada bank soalan bab ini.',
    lepas: 'Selepas menjawab, jawapan betul ditunjukkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
const SUBDESC = {
  '11.1': 'Objek & imej, kekongruenan, maksud isometri',
  '11.2': 'Vektor translasi, mencari imej dan objek',
  '11.3': 'Paksi pantulan, sifat, pantulan pada paksi',
  '11.4': 'Pusat, sudut & arah putaran, mencari pusat',
  '11.5': 'Membanding sifat ketiga-tiga transformasi',
  '11.6': 'Peringkat simetri putaran bagi bentuk'
};
const SHORT = { '11.1': 'Transformasi', '11.2': 'Translasi', '11.3': 'Pantulan', '11.4': 'Putaran', '11.5': 'Isometri', '11.6': 'Simetri Putaran' };
const SUBSIM = { '11.2': 'translasi', '11.3': 'pantulan', '11.4': 'putaran' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['translasi', 'Translasi', 'tr'], ['pantulan', 'Pantulan', 'pa'], ['putaran', 'Putaran', 'pu']];

