'use strict';
/* =================== INSURANS · KONFIGURASI BAB (Tingkatan 5 Bab 3) =================== */
const BAB = {
  id: 'insurans',
  nama: ['INSU', 'RANS'],
  ting: 5, no: 3, tajuk: 'Matematik Pengguna: Insurans',
  slogan: [['Kenal risiko.', 'rd'], ['Bayar premium.', 'tr'], ['Terlindung!', 'gr']],
  logo: 'logo.svg',
  key: 'insurans-v2',
  ajarKey: 'insurans-ajar',
  g60: {
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang risiko dan jenis insurans, pengiraan premium insurans hayat dan motor, serta bayaran pampasan dengan deduktibel dan ko-insurans.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

// KSSM T5 Bab 3 hanya ada SK 3.1 Risiko dan Perlindungan Insurans. Subtopik app dipecahkan ikut SP:
// 3.1.1 risiko & jenis insurans · 3.1.2 kadar & premium · 3.1.3 deduktibel & ko-insurans
const SUBDESC = {
  '3.1.1': 'Risiko, insurans, polisi, premium, pemegang polisi dan penanggung insurans; insurans hayat dan insurans am (motor, kebakaran, perubatan, perjalanan)',
  '3.1.2': 'Kadar premium per RM1 000 nilai muka, premium insurans hayat dan premium insurans motor (komprehensif, pihak ketiga, NCD)',
  '3.1.3': 'Deduktibel, ko-insurans harta dan perubatan, serta pengiraan bayaran pampasan'
};
const SHORT = { '3.1.1': 'Risiko & Jenis', '3.1.2': 'Premium', '3.1.3': 'Deduktibel & Ko-insurans' };
const SUBSIM = { '3.1.1': 'premium-hayat', '3.1.2': 'premium-hayat', '3.1.3': 'deduktibel-koinsurans' };
const SIMLIST = [['premium-hayat', 'Premium Insurans Hayat', 'tr'], ['deduktibel-koinsurans', 'Deduktibel & Ko-insurans', 'gr']];
