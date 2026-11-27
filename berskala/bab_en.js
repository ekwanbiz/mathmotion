'use strict';
/* =================== BERSKALA · KONFIGURASI BAB (ENGLISH / DLP) ===================
   Versi English bagi bab.js. Dimuat menggantikan bab.js apabila bahasa = EN.
   Kunci storan (key, ajarKey) MESTI sama dengan bab.js supaya rekod dan pelan dikongsi. */
const BAB = {
  id: 'berskala',
  nama: ['SCA', 'LE'],
  ting: 3, no: 4, tajuk: 'Scale Drawings',
  slogan: [['Measure.', 'tr'], ['Scale.', 'am'], ['Draw!', 'gr']],
  logo: 'logo.svg',
  key: 'berskala-v2',
  ajarKey: 'berskala-ajar',
  en: true,
  g60: {
    soalan: 'There are <b>multiple-choice</b> questions on the meaning of scale drawings, the scale 1 : n, measurements of drawings and actual measurements, plans and maps.',
    lepas: 'After answering, the correct answer is highlighted.'
  }
};
const SUBDESC = {
  '4.1.1': 'Relationship between measurements of drawings and of the object, and the meaning of scale drawing',
  '4.1.2': 'The scale 1 : n, the value of n, determining scales and map scales',
  '4.1.3': 'Drawing scale drawings on grids and finding actual measurements from drawings',
  '4.1.4': 'Plans, maps, actual area, cost and travel time'
};
const SHORT = { '4.1.1': 'Meaning of Scale Drawing', '4.1.2': 'Interpreting the Scale', '4.1.3': 'Drawing to Scale', '4.1.4': 'Problem Solving' };
const SUBSIM = { '4.1.1': 'penukar-skala', '4.1.2': 'pelan-rumah', '4.1.3': 'lukis-grid', '4.1.4': 'pelan-rumah' };
const SIMLIST = [['penukar-skala', 'Scale Converter', 'tr'], ['pelan-rumah', 'House Plan', 'am'], ['lukis-grid', 'Draw on Grid', 'gr']];
BAB.gabung = {"4.1.1":"4.1","4.1.2":"4.1","4.1.3":"4.1","4.1.4":"4.1"};
BAB.gabungNama = {"4.1":"Scale Drawings"};
Object.assign(SUBDESC, {"4.1":"Meaning of scale drawing, interpreting the scale 1 : n, determining scales and measurements, drawing on grids, and problems involving plans, maps, area and cost"});
Object.assign(SHORT, {"4.1":"Scale Drawings"});
Object.assign(SUBSIM, {"4.1":"penukar-skala"});
