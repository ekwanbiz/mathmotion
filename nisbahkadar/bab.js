'use strict';
/* =================== NISBAH, KADAR DAN PERKADARAN · KONFIGURASI BAB (Tingkatan 1 Bab 3, KP2027) =================== */
const BAB = {
  id: 'nisbahkadar',
  nama: ['NISBAH', 'KADAR'],
  ting: 1, no: 3, tajuk: 'Nisbah, Kadar dan Perkadaran',
  slogan: [['Nisbah.', 'pu'], ['Kadar.', 'tr'], ['Perkadaran!', 'am']],
  logo: 'logo.svg',
  key: 'nisbahkadar-v2',
  ajarKey: 'nisbahkadar-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang nisbah termudah, nisbah setara, perkadaran dan kadar.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};
// DSKP KP2027 T1 Bab 3: 3.1 Nisbah · 3.2 Kadar dan Perkadaran
const SUBDESC = {
  '3.1': 'Nisbah dua dan tiga kuantiti (a : b : c), nisbah setara, bentuk termudah termasuk pecahan, perpuluhan dan peratusan, serta model bar',
  '3.2': 'Kadar (laju, harga, pecutan), perkadaran dan pertukaran unit, nilai tidak diketahui (darab silang, unitari, model bar) dan masalah harian'
};
const SHORT = { '3.1': 'Nisbah', '3.2': 'Kadar & Perkadaran' };
const SUBSIM = { '3.1': 'model-bar', '3.2': 'kadar-perkadaran' };
const SIMLIST = [['model-bar', 'Model Bar Nisbah', 'pu'], ['kadar-perkadaran', 'Kadar & Perkadaran', 'tr']];
