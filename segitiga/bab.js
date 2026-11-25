'use strict';
/* =================== SEGI TIGA DAN SISI EMPAT · KONFIGURASI BAB (Tingkatan 1 Bab 7, KP2027) =================== */
const BAB = {
  id: 'segitiga',
  nama: ['SEGI', 'TIGA'],
  ting: 1, no: 7, tajuk: 'Segi Tiga dan Sisi Empat',
  slogan: [['Sudut.', 'am'], ['Sisi.', 'tr'], ['Pythagoras!', 'pk']],
  logo: 'logo.svg',
  key: 'segitiga-v2',
  ajarKey: 'segitiga-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang sudut segi tiga, teorem Pythagoras dan sisi empat.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};
// DSKP KP2027 T1 Bab 7: 7.1 Segi Tiga · 7.2 Teorem Pythagoras · 7.3 Sisi Empat
const SUBDESC = {
  '7.1': 'Jenis segi tiga, paksi simetri, kongruen dan serupa, sudut pedalaman dan peluaran, perimeter dan luas',
  '7.2': 'Hipotenus, teorem Pythagoras, trirangkap Pythagoras, akas dan mencari sisi yang tidak diketahui',
  '7.3': 'Jenis sisi empat, sudut pedalaman dan peluaran, perimeter dan luas serta gabungan bentuk'
};
const SHORT = { '7.1': 'Segi Tiga', '7.2': 'Pythagoras', '7.3': 'Sisi Empat' };
const SUBSIM = { '7.1': 'sudut-segitiga', '7.2': 'pythagoras', '7.3': 'sudut-segitiga' };
const SIMLIST = [['sudut-segitiga', 'Sudut Segi Tiga', 'am'], ['pythagoras', 'Teorem Pythagoras', 'tr']];
