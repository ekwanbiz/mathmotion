'use strict';
/* =================== PIAWAI · KONFIGURASI BAB (ENGLISH / DLP) ===================
   Versi English bagi bab.js. Dimuat menggantikan bab.js apabila bahasa = EN.
   Kunci storan (key, ajarKey) MESTI sama dengan bab.js supaya rekod dan pelan dikongsi. */
const BAB = {
  id: 'piawai',
  nama: ['STAN', 'DARD'],
  ting: 3, no: 2, tajuk: 'Standard Form',
  slogan: [['Count.', 'tr'], ['Round.', 'am'], ['Simplify!', 'pu']],
  logo: 'logo.svg',
  key: 'piawai-v2',
  ajarKey: 'piawai-ajar',
  en: true,
  g60: {
    soalan: 'There are <b>multiple-choice</b> questions on significant figures, rounding off, standard form and operations involving numbers in standard form.',
    lepas: 'After answering, the correct answer is highlighted.'
  }
};
const SUBDESC = {
  '2.1': 'Determining the number of significant figures and rounding off numbers to certain numbers of significant figures',
  '2.2': 'Writing numbers in the form A × 10ⁿ, addition, subtraction, multiplication, division and problem solving'
};
const SHORT = { '2.1': 'Significant Figures', '2.2': 'Standard Form' };
const SUBSIM = { '2.1': 'angka-bererti', '2.2': 'skala-alam' };
const SIMLIST = [['angka-bererti', 'Significant Figures', 'tr'], ['skala-alam', 'Scale of Nature', 'pu']];
