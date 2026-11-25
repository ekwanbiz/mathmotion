'use strict';
/* =================== PERSAMAAN DAN KETAKSAMAAN LINEAR · KONFIGURASI BAB (Tingkatan 1 Bab 5, KP2027) =================== */
const BAB = {
  id: 'persamaanlinear',
  nama: ['PERSAMAAN', 'LINEAR'],
  ting: 1, no: 5, tajuk: 'Persamaan dan Ketaksamaan Linear',
  slogan: [['Seimbang.', 'tr'], ['Selesai.', 'gr'], ['Bandingkan!', 'pk']],
  logo: 'logo.svg',
  key: 'persamaanlinear-v2',
  ajarKey: 'persamaanlinear-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang menyelesaikan persamaan linear, simbol ketaksamaan dan menyelesaikan ketaksamaan.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};
// DSKP KP2027 T1 Bab 5: 5.1 Persamaan Linear dalam Satu Pemboleh Ubah · 5.2 Ketaksamaan Linear dalam Satu Pemboleh Ubah
const SUBDESC = {
  '5.1': 'Ciri persamaan linear, membentuk persamaan daripada situasi, menyelesaikan persamaan (neraca, kurungan, pecahan) dan masalah harian',
  '5.2': 'Simbol ketaksamaan dan garis nombor, ketaksamaan dalam PKJR, operasi pada ketaksamaan, menyelesaikan ketaksamaan, ketaksamaan serentak dan masalah harian'
};
const SHORT = { '5.1': 'Persamaan Linear', '5.2': 'Ketaksamaan Linear' };
const SUBSIM = { '5.1': 'neraca-persamaan', '5.2': 'garis-ketaksamaan' };
const SIMLIST = [['neraca-persamaan', 'Neraca Persamaan', 'tr'], ['garis-ketaksamaan', 'Garis Ketaksamaan', 'pk']];
