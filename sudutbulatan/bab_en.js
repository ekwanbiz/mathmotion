'use strict';
/* =================== SUDUT BULAT · KONFIGURASI BAB (ENGLISH / DLP) ===================
   Versi English bagi bab.js. Kunci storan (key, ajarKey) MESTI sama dengan bab.js. */
const BAB = {
  id: 'sudutbulatan',
  nama: ['CIRCLE', 'ANGLE'],
  ting: 3, no: 6, tajuk: 'Angles and Tangents of Circles',
  slogan: [['Subtend.', 'tr'], ['Cycle.', 'pu'], ['Touch!', 'gr']],
  logo: 'logo.svg',
  key: 'sudutbulatan-v2',
  ajarKey: 'sudutbulatan-ajar',
  en: true,
  g60: {
    soalan: 'There are <b>multiple-choice</b> questions on angles at the circumference, central angles, cyclic quadrilaterals and tangents to circles.',
    lepas: 'After answering, the correct answer is highlighted.'
  }
};
const SUBDESC = {
  '6.1': 'Angles subtended by the same arc, central angle = 2 × angle at the circumference, angles in a semicircle',
  '6.2': 'Opposite angles add up to 180° and exterior angle = interior opposite angle',
  '6.3': 'Tangent ⊥ radius, two tangents from an external point, alternate segment and common tangents',
  '6.4': 'Combining the properties of angles and tangents to solve problems'
};
const SHORT = { '6.1': 'Circumference & Centre', '6.2': 'Cyclic Quadrilaterals', '6.3': 'Tangents', '6.4': 'Angles & Tangents' };
const SUBSIM = { '6.1': 'sudut-lilitan', '6.2': 'sisi-empat-kitaran', '6.3': 'tangen', '6.4': 'tangen' };
const SIMLIST = [['sudut-lilitan', 'Circumference & Central Angles', 'tr'], ['sisi-empat-kitaran', 'Cyclic Quadrilaterals', 'pu'], ['tangen', 'Tangents to Circles', 'gr']];
