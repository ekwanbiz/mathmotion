'use strict';
/* =================== TRIGONOMETRI · KONFIGURASI BAB (ENGLISH / DLP) ===================
   Versi English bagi bab.js. Dimuat menggantikan bab.js apabila bahasa = EN.
   Kunci storan (key, ajarKey) MESTI sama dengan bab.js supaya rekod dan pelan dikongsi. */
const BAB = {
  id: 'trigonometri',
  nama: ['TRIGO', 'NO'],
  ting: 3, no: 5, tajuk: 'Trigonometric Ratios',
  slogan: [['Angle.', 'pa'], ['Ratio.', 'pu'], ['Measure!', 'gr']],
  logo: 'logo.svg',
  key: 'trigonometri-v2',
  ajarKey: 'trigonometri-ajar',
  en: true,
  g60: {
    soalan: 'There are <b>multiple-choice</b> questions on the hypotenuse, opposite and adjacent sides, sin, cos, tan, special angles and finding sides and angles.',
    lepas: 'After answering, the correct answer is highlighted.'
  }
};
const SUBDESC = {
  '5.1.1': 'Hypotenuse, opposite side and adjacent side of an acute angle',
  '5.1.2': 'Definitions of sin θ, cos θ, tan θ, constant ratios for the same angle and the impact of changing the angle',
  '5.1.4': 'Values using a calculator, degrees and minutes, special angles 30°, 45°, 60° and operations',
  '5.1.7': 'Finding sides and angles in daily situations'
};
const SHORT = { '5.1.1': 'Sides of Triangles', '5.1.2': 'Sin, Cos & Tan', '5.1.4': 'Values & Special Angles', '5.1.7': 'Problem Solving' };
const SUBSIM = { '5.1.1': 'sisi-sudut', '5.1.2': 'segi-tiga-serupa', '5.1.4': 'sisi-sudut', '5.1.7': 'klinometer' };
const SIMLIST = [['sisi-sudut', 'Sides & Angles', 'pa'], ['segi-tiga-serupa', 'Similar Triangles', 'pu'], ['klinometer', 'Clinometer', 'gr']];
BAB.gabung = {"5.1.1": "5.1", "5.1.2": "5.1", "5.1.4": "5.1", "5.1.7": "5.1"};
BAB.gabungNama = {"5.1": "Sine, Cosine and Tangent of Acute Angles in Right-angled Triangles"};
Object.assign(SUBDESC, {"5.1": "Sides of right-angled triangles, the ratios sin, cos and tan, special angles and problem solving"});
Object.assign(SHORT, {"5.1": "Sin, Cos & Tan"});
Object.assign(SUBSIM, {"5.1": "sisi-sudut"});
