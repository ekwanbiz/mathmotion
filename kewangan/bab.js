'use strict';
/* =================== KEWANGAN · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'kewangan',
  nama: ['KEWA', 'NGAN'],           // nama app: bahagian kedua berwarna
  ting: 4, no: 10, tajuk: 'Matematik Pengguna: Pengurusan Kewangan',
  slogan: [['Rancang.', 'tr'], ['Simpan.', 'gr'], ['Capai!', 'am']],
  logo: 'logo.svg',
  key: 'kewangan-v2',               // storan tetapan & rekod (jangan tukar)
  ajarKey: 'kewangan-ajar',         // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang langkah pengurusan kewangan, matlamat SMART, pendapatan dan perbelanjaan, aliran tunai serta simpanan bulanan dan tempoh untuk mencapai matlamat.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM bab ini hanya ada SK 10.1 dengan dua SP. Subtopik app: 10.1.1 = SP 10.1.1 (proses pengurusan kewangan);
// 10.1.2 = SP 10.1.2 bahagian membina pelan kewangan; 10.1.3 = SP 10.1.2 bahagian menilai kebolehlaksanaan pelan.
const SUBDESC = {
  '10.1.1': 'Lima langkah proses pengurusan kewangan, keperluan dan kehendak, matlamat jangka pendek dan panjang, matlamat SMART',
  '10.1.2': 'Pendapatan aktif dan pasif, perbelanjaan tetap dan tidak tetap, aliran tunai positif dan negatif, pelan kewangan peribadi',
  '10.1.3': 'Simpanan bulanan dan tempoh untuk mencapai matlamat, kebolehlaksanaan pelan dan cadangan penambahbaikan'
};
const SHORT = { '10.1.1': 'Proses Kewangan', '10.1.2': 'Pelan & Aliran Tunai', '10.1.3': 'Menilai Pelan' };
const SUBSIM = { '10.1.1': 'matlamat-smart', '10.1.2': 'aliran-tunai', '10.1.3': 'nilai-pelan' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['matlamat-smart', 'Matlamat SMART', 'tr'], ['aliran-tunai', 'Aliran Tunai', 'gr'], ['nilai-pelan', 'Penilai Pelan', 'am']];

// DSKP SK 10.1 hanya ada SP 10.1.1 dan 10.1.2 – 10.1.3 (menilai pelan) disatukan ke 10.1.2 (lihat teras/lembaran.js gabungSub())
BAB.gabung = {"10.1.3": "10.1.2"};
BAB.gabungNama = {"10.1.2": "Pelan Kewangan Peribadi"};
