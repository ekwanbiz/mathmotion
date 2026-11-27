'use strict';
/* =================== PELAN · KONFIGURASI BAB (ENGLISH / DLP) ===================
   Versi English bagi bab.js. Kunci storan (key, ajarKey) MESTI sama dengan bab.js. */
const BAB = {
  id: 'pelan',
  nama: ['PL', 'AN'],
  ting: 3, no: 7, tajuk: 'Plans and Elevations',
  slogan: [['Project.', 'tr'], ['View.', 'gr'], ['Draw!', 'pa']],
  logo: 'logo.svg',
  key: 'pelan-v2',
  ajarKey: 'pelan-ajar',
  en: true,
  g60: {
    soalan: 'There are <b>multiple-choice</b> questions on orthogonal projections, plans, front elevations, side elevations and solids made of cubes.',
    lepas: 'After answering, the correct answer is highlighted.'
  }
};
const SUBDESC = {
  '7.1': 'Planes of projection, projection lines, characteristics of orthogonal projections and comparing objects with their images',
  '7.2': 'Drawing plans, front elevations and side elevations, hidden lines and building solids'
};
const SHORT = { '7.1': 'Orthogonal Projections', '7.2': 'Plans & Elevations' };
const SUBSIM = { '7.1': 'pemutar-pepejal', '7.2': 'bina-kiub' };
const SIMLIST = [['pemutar-pepejal', 'Solid Rotator', 'tr'], ['bina-kiub', 'Build with Cubes', 'pa'], ['padan-pandangan', 'Match the Views', 'gr']];
