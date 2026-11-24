'use strict';
/* =================== NOMBOR NYATA · KONFIGURASI BAB (Tingkatan 1 Bab 1, KP2027) =================== */
const BAB = {
  id: 'nombornyata',
  nama: ['NOMBOR', 'NYATA'],
  ting: 1, no: 1, tajuk: 'Nombor Nyata',
  slogan: [['Nisbah.', 'tr'], ['Operasi.', 'pk'], ['Kuasa!', 'am']],
  logo: 'logo.svg',
  key: 'nombornyata-v2',
  ajarKey: 'nombornyata-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang nombor nisbah dan tak nisbah, gabungan operasi serta kuasa dan punca kuasa.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};
// DSKP KP2027 T1 Bab 1: 1.1 Nombor Nisbah dan Nombor Tak Nisbah · 1.2 Operasi Asas Aritmetik · 1.3 Kuasa Dua, Punca Kuasa Dua, Kuasa Tiga dan Punca Kuasa Tiga
const SUBDESC = {
  '1.1': 'Nombor nisbah (a/b), perpuluhan berulang, nombor tak nisbah (π, surd), membanding dan menyusun pada garis nombor',
  '1.2': 'Tertib operasi, hukum operasi asas aritmetik, gabungan operasi pecahan, perpuluhan dan integer, masalah harian',
  '1.3': 'Maksud kuasa dan punca kuasa, kuasa dua dan tiga sempurna, anggaran, gabungan operasi dan masalah harian'
};
const SHORT = { '1.1': 'Nisbah & Tak Nisbah', '1.2': 'Operasi Aritmetik', '1.3': 'Kuasa & Punca Kuasa' };
const SUBSIM = { '1.1': 'garis-nombor', '1.2': 'garis-nombor', '1.3': 'kuasa-punca' };
const SIMLIST = [['garis-nombor', 'Garis Nombor Nyata', 'tr'], ['kuasa-punca', 'Kuasa & Punca Kuasa', 'am']];
