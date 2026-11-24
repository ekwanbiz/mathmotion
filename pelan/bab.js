'use strict';
/* =================== PELAN · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'pelan',
  nama: ['PE', 'LAN'],              // nama app: bahagian kedua berwarna
  ting: 3, no: 7, tajuk: 'Pelan dan Dongakan',
  slogan: [['Unjur.', 'tr'], ['Lihat.', 'gr'], ['Lukis!', 'pa']],
  logo: 'logo.svg',
  key: 'pelan-v2',                  // storan tetapan & rekod (jangan tukar)
  ajarKey: 'pelan-ajar',            // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang unjuran ortogon, pelan, dongakan depan, dongakan sisi dan pepejal kiub.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM bab ini ada dua SK: 7.1 Unjuran Ortogon dan 7.2 Pelan dan Dongakan.
const SUBDESC = {
  '7.1': 'Satah unjuran, garis unjuran, ciri-ciri unjuran ortogon dan perbandingan objek dengan imejnya',
  '7.2': 'Melukis pelan, dongakan depan dan dongakan sisi, garis tersembunyi serta membina pepejal'
};
const SHORT = { '7.1': 'Unjuran Ortogon', '7.2': 'Pelan & Dongakan' };
const SUBSIM = { '7.1': 'pemutar-pepejal', '7.2': 'bina-kiub' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['pemutar-pepejal', 'Pemutar Pepejal', 'tr'], ['bina-kiub', 'Bina dengan Kiub', 'pa'], ['padan-pandangan', 'Padankan Pandangan', 'gr']];
