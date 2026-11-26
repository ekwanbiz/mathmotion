'use strict';
/* =================== INDEKS · KONFIGURASI BAB (ENGLISH / DLP) ===================
   Versi English bagi bab.js. Dimuat menggantikan bab.js apabila bahasa = EN.
   Kunci storan (key, ajarKey) MESTI sama dengan bab.js supaya rekod dan pelan dikongsi. */
const BAB = {
  id: 'indeks',
  nama: ['IN', 'DICES'],
  ting: 3, no: 1, tajuk: 'Indices',
  slogan: [['Multiply.', 'am'], ['Power.', 'pu'], ['Simplify!', 'gr']],
  logo: 'logo.svg',
  key: 'indeks-v2',
  ajarKey: 'indeks-ajar',
  en: true,
  g60: {
    soalan: 'There are <b>multiple-choice</b> questions on index form, values of powers, laws of indices, and zero, negative and fractional indices.',
    lepas: 'After answering, the correct answer is highlighted.'
  }
};
const SUBDESC = {
  '1.1': 'Index form aⁿ, base and index, repeated multiplication and converting numbers into index form',
  '1.2': 'Laws of multiplication, division and powers, zero, negative and fractional indices, and equations in index form'
};
const SHORT = { '1.1': 'Index Notation', '1.2': 'Law of Indices' };
const SUBSIM = { '1.1': 'gandaan-separuh', '1.2': 'pembina-kuasa' };
const SIMLIST = [['pembina-kuasa', 'Power Builder', 'am'], ['mesin-hukum', 'Laws Machine', 'pu'], ['gandaan-separuh', 'Doubling & Halving', 'gr']];
