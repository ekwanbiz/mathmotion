'use strict';
/* =================== PENGGUNA · KONFIGURASI BAB (ENGLISH / DLP) ===================
   Versi English bagi bab.js. Dimuat menggantikan bab.js apabila bahasa = EN.
   Kunci storan (key, ajarKey) MESTI sama dengan bab.js supaya rekod dan pelan dikongsi. */
const BAB = {
  id: 'pengguna',
  nama: ['MONEY', 'WISE'],
  ting: 3, no: 3, tajuk: 'Consumer Mathematics: Savings and Investments, Credit and Debt',
  slogan: [['Save.', 'gr'], ['Invest.', 'am'], ['Be wise!', 'pa']],
  logo: 'logo.svg',
  key: 'pengguna-v2',
  ajarKey: 'pengguna-ajar',
  en: true,
  g60: {
    soalan: 'There are <b>multiple-choice</b> questions on simple and compound interest, matured value, return on investment, average cost per share unit, credit cards and loan instalments.',
    lepas: 'After answering, the correct answer is highlighted.'
  }
};
const SUBDESC = {
  '3.1': 'Types of savings & investments, simple & compound interest, matured value, return on investment, risk & liquidity, cost averaging strategy',
  '3.2': 'Credit & debt, credit cards, minimum payment, finance charges & late payment charges, total loan repayment & instalments'
};
const SHORT = { '3.1': 'Savings & Investments', '3.2': 'Credit & Debt Management' };
const SUBSIM = { '3.1': 'faedah-tumbuh', '3.2': 'kad-kredit' };
const SIMLIST = [['faedah-tumbuh', 'Growing Interest', 'gr'], ['kad-kredit', 'Credit Card', 'pa'], ['ansuran-pinjaman', 'Loan Instalment', 'tr']];
