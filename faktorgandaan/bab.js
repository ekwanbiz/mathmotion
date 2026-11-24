'use strict';
/* =================== FAKTOR DAN GANDAAN · KONFIGURASI BAB (Tingkatan 1 Bab 2, KP2027) =================== */
const BAB = {
  id: 'faktorgandaan',
  nama: ['FAKTOR', 'GANDAAN'],
  ting: 1, no: 2, tajuk: 'Faktor dan Gandaan',
  slogan: [['Faktor.', 'gr'], ['FSTB.', 'am'], ['GSTK!', 'pu']],
  logo: 'logo.svg',
  key: 'faktorgandaan-v2',
  ajarKey: 'faktorgandaan-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang faktor, nombor perdana, FSTB, gandaan dan GSTK.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};
// DSKP KP2027 T1 Bab 2: 2.1 Faktor, Faktor Perdana, Faktor Sepunya dan FSTB · 2.2 Gandaan, Gandaan Sepunya dan GSTK
const SUBDESC = {
  '2.1': 'Faktor, nombor dan faktor perdana, pemfaktoran perdana (pokok faktor, pembahagian berulang), faktor sepunya, FSTB, koperdana dan masalah agihan',
  '2.2': 'Gandaan, gandaan sepunya, GSTK bagi dua atau tiga nombor, perkaitan FSTB dan GSTK, dan masalah jadual'
};
const SHORT = { '2.1': 'Faktor & FSTB', '2.2': 'Gandaan & GSTK' };
const SUBSIM = { '2.1': 'pokok-faktor', '2.2': 'fstb-gstk' };
const SIMLIST = [['pokok-faktor', 'Pokok Faktor', 'gr'], ['fstb-gstk', 'FSTB & GSTK', 'pu']];
