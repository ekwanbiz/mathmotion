'use strict';
/* =================== SERAKAN TERKUMPUL · KONFIGURASI BAB (Tingkatan 5 Bab 7) =================== */
const BAB = {
  id: 'serakanterkumpul',
  nama: ['SERAKAN', 'KUMPUL'],
  ting: 5, no: 7, tajuk: 'Sukatan Serakan Data Terkumpul',
  slogan: [['Kumpul.', 'tr'], ['Lukis.', 'pk'], ['Sebar!', 'am']],
  logo: 'logo.svg',
  key: 'serakanterkumpul-v2',
  ajarKey: 'serakanterkumpul-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang data terkumpul: titik tengah, sempadan kelas, kekerapan longgokan, julat, kuartil, julat antara kuartil, varians dan sisihan piawai.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

// KSSM T5 Bab 7: 7.1 Serakan · 7.2 Sukatan Serakan
const SUBDESC = {
  '7.1': 'Selang kelas, had & sempadan kelas, titik tengah, kekerapan longgokan, histogram, poligon kekerapan dan ogif',
  '7.2': 'Julat, kuartil & persentil daripada ogif, julat antara kuartil, varians, sisihan piawai dan plot kotak'
};
const SHORT = { '7.1': 'Serakan', '7.2': 'Sukatan Serakan' };
const SUBSIM = { '7.1': 'histogram-poligon', '7.2': 'ogif-kuartil' };
const SIMLIST = [['histogram-poligon', 'Histogram & Poligon', 'tr'], ['ogif-kuartil', 'Ogif & Kuartil', 'pk']];
