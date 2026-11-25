'use strict';
/* =================== GARIS DAN SUDUT · KONFIGURASI BAB (Tingkatan 1 Bab 6, KP2027) =================== */
const BAB = {
  id: 'garissudut',
  nama: ['GARIS', 'SUDUT'],
  ting: 1, no: 6, tajuk: 'Garis dan Sudut',
  slogan: [['Garis.', 'am'], ['Sudut.', 'tr'], ['Selari!', 'pk']],
  logo: 'logo.svg',
  key: 'garissudut-v2',
  ajarKey: 'garissudut-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang jenis sudut, pasangan sudut, garis bersilang dan garis selari.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};
// DSKP KP2027 T1 Bab 6: 6.1 Garis dan Jenis Sudut · 6.2 Sudut yang Berkaitan dengan Garis Selari dan Garis Rentas Lintang
const SUBDESC = {
  '6.1': 'Tembereng dan kekongruenan, pembinaan geometri, jenis sudut, sudut pelengkap, penggenap dan konjugat, garis bersilang dan masalah harian',
  '6.2': 'Garis selari dan garis rentas lintang, sudut sepadan, selang-seli dan pedalaman, serta masalah harian'
};
const SHORT = { '6.1': 'Garis & Jenis Sudut', '6.2': 'Garis Selari' };
const SUBSIM = { '6.1': 'jenis-sudut', '6.2': 'garis-selari' };
const SIMLIST = [['jenis-sudut', 'Jenis Sudut', 'am'], ['garis-selari', 'Garis Selari', 'tr']];
