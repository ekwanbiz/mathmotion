'use strict';
/* =================== PEMODELAN · KONFIGURASI BAB (Tingkatan 5 Bab 8) =================== */
const BAB = {
  id: 'pemodelan',
  nama: ['MODEL', 'MATEMATIK'],
  ting: 5, no: 8, tajuk: 'Pemodelan Matematik',
  slogan: [['Andaikan.', 'tr'], ['Modelkan.', 'pa'], ['Tentusahkan!', 'gr']],
  logo: 'logo.svg',
  key: 'pemodelan-v2',
  ajarKey: 'pemodelan-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang langkah proses pemodelan matematik, jenis model (linear, kuadratik, eksponen) dan menggunakan model untuk meramal nilai.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

// KSSM T5 Bab 8: SK 8.1 Pemodelan Matematik → SP 8.1.1 (proses) · SP 8.1.2 (selesaikan masalah sebenar)
const SUBDESC = {
  '8.1.1': 'Proses pemodelan: kenal pasti masalah, andaian & pemboleh ubah, aplikasi matematik, tentusahkan, perhalusi, laporkan',
  '8.1.2': 'Menyelesaikan masalah kehidupan sebenar dengan model linear, kuadratik dan eksponen'
};
const SHORT = { '8.1.1': 'Proses Pemodelan', '8.1.2': 'Model Linear, Kuadratik & Eksponen' };
const SUBSIM = { '8.1.1': 'kitaran-pemodelan', '8.1.2': 'padankan-model' };
const SIMLIST = [['kitaran-pemodelan', 'Kitaran Pemodelan', 'tr'], ['padankan-model', 'Padankan Model', 'pa']];
