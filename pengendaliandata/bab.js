'use strict';
/* =================== PENGENDALIAN DATA · KONFIGURASI BAB (Tingkatan 1 Bab 8, KP2027) =================== */
const BAB = {
  id: 'pengendaliandata',
  nama: ['DATA', 'CARTA'],
  ting: 1, no: 8, tajuk: 'Pengendalian Data',
  slogan: [['Kumpul.', 'am'], ['Wakil.', 'tr'], ['Tafsir!', 'pk']],
  logo: 'logo.svg',
  key: 'pengendaliandata-v2',
  ajarKey: 'pengendaliandata-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang jenis data, membaca carta dan carta pai.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};
// DSKP KP2027 T1 Bab 8: 8.1 Pengendalian dan Analisis Data (SP 8.1.1–8.1.4)
const SUBDESC = {
  '8.1': 'Soalan statistik, kaedah mengumpul data, data kategori dan numerik, jadual kekerapan, carta pai, carta palang, graf garis, plot titik, plot batang-dan-daun, histogram dan graf sebar'
};
const SHORT = { '8.1': 'Pengendalian Data' };
const SUBSIM = { '8.1': 'perwakilan-data' };
const SIMLIST = [['perwakilan-data', 'Perwakilan Data', 'tr'], ['graf-sebar', 'Graf Sebar', 'pk']];
