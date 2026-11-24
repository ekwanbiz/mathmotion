'use strict';
/* =================== PERCUKAIAN · KONFIGURASI BAB (Tingkatan 5 Bab 4) =================== */
const BAB = {
  id: 'percukaian',
  nama: ['CU', 'KAI'],
  ting: 5, no: 4, tajuk: 'Matematik Pengguna: Percukaian',
  slogan: [['Kira.', 'tr'], ['Bayar.', 'am'], ['Bangunkan!', 'gr']],
  logo: 'logo.svg',
  key: 'percukaian-v2',
  ajarKey: 'percukaian-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang agensi pemungut cukai, pendapatan bercukai, cukai pendapatan, cukai jalan serta cukai jualan dan perkhidmatan.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

// KSSM T5 Bab 4: 4.1 Percukaian (dipecahkan ikut SP: 4.1.1–4.1.2 · 4.1.3 · 4.1.4)
const SUBDESC = {
  '4.1.1': 'Tujuan percukaian, jenis cukai di Malaysia dan agensi yang memungutnya',
  '4.1.3': 'Pendapatan bercukai, pelepasan, kadar cukai berperingkat, rebat dan cukai yang perlu dibayar',
  '4.1.4': 'Cukai jalan, cukai pintu, cukai tanah serta cukai jualan dan perkhidmatan'
};
const SHORT = { '4.1.1': 'Tujuan & Jenis Cukai', '4.1.3': 'Cukai Pendapatan', '4.1.4': 'Cukai Lain' };
const SUBSIM = { '4.1.1': 'troli-sst', '4.1.3': 'kalkulator-cukai', '4.1.4': 'troli-sst' };
const SIMLIST = [['kalkulator-cukai', 'Kalkulator Cukai Pendapatan', 'tr'], ['troli-sst', 'Troli Belanja & SST', 'am']];
