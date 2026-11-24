'use strict';
/* =================== KEKONGRUENAN · KONFIGURASI BAB (Tingkatan 5 Bab 5) =================== */
const BAB = {
  id: 'kekongruenan',
  nama: ['TRANS', 'FORMASI'],
  ting: 5, no: 5, tajuk: 'Kekongruenan, Pembesaran dan Gabungan Transformasi',
  slogan: [['Padan.', 'tr'], ['Besarkan.', 'pk'], ['Gabung!', 'gr']],
  logo: 'logo.svg',
  key: 'kekongruenan-v2',
  ajarKey: 'kekongruenan-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang syarat kekongruenan, faktor skala dan luas imej, gabungan transformasi serta teselasi.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};
const SUBDESC = {
  '5.1': 'Bentuk kongruen dan syarat kekongruenan segi tiga: SSS, SAS, ASA, AAS',
  '5.2': 'Pusat dan faktor skala k (positif, negatif, pecahan); luas imej = k² × luas objek',
  '5.3': 'Gabungan dua transformasi, AB dan BA, transformasi setara',
  '5.4': 'Teselasi dan poligon sekata yang boleh menteselasi'
};
const SHORT = { '5.1': 'Kekongruenan', '5.2': 'Pembesaran', '5.3': 'Gabungan', '5.4': 'Teselasi' };
const SUBSIM = { '5.1': 'pembesaran', '5.2': 'pembesaran', '5.3': 'gabungan', '5.4': 'teselasi' };
const SIMLIST = [['pembesaran', 'Pembesaran', 'pk'], ['gabungan', 'Gabungan AB & BA', 'gr'], ['teselasi', 'Teselasi', 'am']];
