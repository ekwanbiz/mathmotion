'use strict';
/* =================== GRAF TRIGO · KONFIGURASI BAB =================== */
// Tingkatan 5 Bab 6 Nisbah dan Graf Fungsi Trigonometri (KSSM): SK 6.1 dan SK 6.2.
const BAB = {
  id: 'trigograf',
  nama: ['GRAF', 'TRIGO'],
  ting: 5, no: 6, tajuk: 'Nisbah dan Graf Fungsi Trigonometri',
  slogan: [['Putar.', 'pu'], ['Ukur.', 'am'], ['Gelombang!', 'tr']],
  logo: 'logo.svg',
  key: 'trigograf-v2',              // storan tetapan & rekod (jangan tukar)
  ajarKey: 'trigograf-ajar',        // storan pelan Mula Mengajar (jangan tukar)
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang sukuan, tanda sin, kos dan tan, sudut rujukan, nilai sudut khas, serta amplitud, kala dan bentuk graf fungsi trigonometri.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

const SUBDESC = {
  '6.1': 'Bulatan unit, sukuan, sudut rujukan, tanda dan nilai sin θ, kos θ dan tan θ bagi 0° ≤ θ ≤ 360°',
  '6.2': 'Graf y = sin x, y = kos x dan y = tan x, serta kesan a, b dan c dalam y = a sin bx + c'
};
const SHORT = { '6.1': 'Nilai sin, kos, tan', '6.2': 'Graf Fungsi Trigo' };
const SUBSIM = { '6.1': 'bulatan-unit', '6.2': 'main-abc' };

const SIMLIST = [['bulatan-unit', 'Bulatan Unit', 'pu'], ['penjana-graf', 'Penjana Graf', 'tr'], ['main-abc', 'Main a, b, c', 'am']];
