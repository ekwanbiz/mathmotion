'use strict';
/* =================== UBAHAN · KONFIGURASI BAB (Tingkatan 5 Bab 1) =================== */
const BAB = {
  id: 'ubahan',
  nama: ['UBA', 'HAN'],
  ting: 5, no: 1, tajuk: 'Ubahan',
  slogan: [['Langsung.', 'tr'], ['Songsang.', 'pk'], ['Bergabung!', 'am']],
  logo: 'logo.svg',
  key: 'ubahan-v2',
  ajarKey: 'ubahan-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang ubahan langsung, ubahan songsang dan ubahan bergabung: menulis hubungan, mencari pemalar <i>k</i> dan mencari nilai pemboleh ubah.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

// KSSM T5 Bab 1: 1.1 Ubahan Langsung · 1.2 Ubahan Songsang · 1.3 Ubahan Bergabung
const SUBDESC = {
  '1.1': 'y ∝ xⁿ (n = 1, 2, 3, ½, ⅓), pemalar k, graf y melawan xⁿ dan mencari nilai',
  '1.2': 'y ∝ 1/xⁿ, hasil darab xⁿy = k sentiasa tetap dan mencari nilai',
  '1.3': 'Ubahan bersama dan ubahan separa: y ∝ xz, y ∝ x/z, serta penyelesaian masalah'
};
const SHORT = { '1.1': 'Ubahan Langsung', '1.2': 'Ubahan Songsang', '1.3': 'Ubahan Bergabung' };
const SUBSIM = { '1.1': 'langsung-graf', '1.2': 'songsang-segiempat', '1.3': 'bergabung-gelangsar' };
const SIMLIST = [['langsung-graf', 'Ubahan Langsung', 'tr'], ['songsang-segiempat', 'Segi Empat Luas Tetap', 'pk'], ['bergabung-gelangsar', 'Ubahan Bergabung', 'am']];
