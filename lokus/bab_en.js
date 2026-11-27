'use strict';
/* =================== LOKUS · KONFIGURASI BAB (ENGLISH / DLP) ===================
   Versi English bagi bab.js. Kunci storan (key, ajarKey) MESTI sama dengan bab.js. */
const BAB = {
  id: 'lokus',
  nama: ['LO', 'CUS'],
  ting: 3, no: 8, tajuk: 'Loci in Two Dimensions',
  slogan: [['Move.', 'gr'], ['Trace.', 'pk'], ['Intersect!', 'pu']],
  logo: 'logo.svg',
  key: 'lokus-v2',
  ajarKey: 'lokus-ajar',
  en: true,
  g60: {
    soalan: 'There are <b>multiple-choice</b> questions on loci in daily situations, the five basic loci and the intersection of two loci.',
    lepas: 'After answering, the correct answer is highlighted.'
  }
};
const SUBDESC = {
  '8.1': 'The meaning of locus, loci in daily situations and points that satisfy conditions',
  '8.2': 'The five basic loci, constructing loci and the intersection of two loci'
};
const SHORT = { '8.1': 'Loci', '8.2': '2D Loci' };
const SUBSIM = { '8.1': 'lokus-harian', '8.2': 'jejak-lokus' };
const SIMLIST = [['lokus-harian', 'Daily Loci', 'am'], ['jejak-lokus', 'Trace a Locus', 'gr'], ['persilangan-lokus', 'Intersection of Loci', 'pu']];
