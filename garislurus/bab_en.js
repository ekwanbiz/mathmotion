'use strict';
/* =================== GARIS LURUS · KONFIGURASI BAB (ENGLISH / DLP) ===================
   Versi English bagi bab.js. Kunci storan (key, ajarKey) MESTI sama dengan bab.js. */
const BAB = {
  id: 'garislurus',
  nama: ['STRAIGHT', 'LINE'],
  ting: 3, no: 9, tajuk: 'Straight Lines',
  slogan: [['Draw.', 'tr'], ['Parallel.', 'am'], ['Intersect!', 'pk']],
  logo: 'logo.svg',
  key: 'garislurus-v2',
  ajarKey: 'garislurus-ajar',
  en: true,
  g60: {
    soalan: 'There are <b>multiple-choice</b> questions on the equation <i>y</i> = <i>mx</i> + <i>c</i>, other forms of equations, points on a line, parallel lines, the equation of a straight line and the point of intersection.',
    lepas: 'After answering, the correct answer is highlighted.'
  }
};
const SUBDESC = {
  '9.1.1': 'Gradient m and y-intercept c, horizontal and vertical lines',
  '9.1.2': 'The general form ax + by = c and the intercept form x/a + y/b = 1',
  '9.1.3': 'Checking points and finding unknown coordinates or constants',
  '9.1.4': 'Parallel lines have the same gradient',
  '9.1.5': 'From the gradient and a point, two points or the intercepts',
  '9.1.6': 'Graphical, substitution and elimination methods',
  '9.1.7': 'Rates, initial values and comparing two situations'
};
const SHORT = { '9.1.1': 'y = mx + c', '9.1.2': 'Other Forms', '9.1.3': 'Points on a Line', '9.1.4': 'Parallel Lines', '9.1.5': 'Find the Equation', '9.1.6': 'Intersection', '9.1.7': 'Problems' };
const SUBSIM = { '9.1.1': 'main-m-c', '9.1.2': 'main-m-c', '9.1.3': 'dua-titik-persamaan', '9.1.4': 'persilangan-selari', '9.1.5': 'dua-titik-persamaan', '9.1.6': 'persilangan-selari', '9.1.7': 'persilangan-selari' };
const SIMLIST = [['main-m-c', 'Play with m & c', 'tr'], ['dua-titik-persamaan', 'Two Points → Equation', 'pa'], ['persilangan-selari', 'Intersection & Parallel', 'pk']];
