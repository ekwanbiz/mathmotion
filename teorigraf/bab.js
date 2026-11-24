'use strict';
/* =================== TEORI GRAF · KONFIGURASI BAB =================== */
// Fail ini (bersama slides.js, soalan.js, logo.svg dan simulasi/) ialah SATU-SATUNYA
// isi khusus bab. Enjin (Mula Mengajar, NOTA, LATIHAN, GAMES ...) ada dalam ../teras/.
const BAB = {
  id: 'teorigraf',
  nama: ['RANG', 'KAIAN'],          // nama app: bahagian kedua berwarna
  ting: 4, no: 5, tajuk: 'Rangkaian dalam Teori Graf',
  slogan: [['Bucu.', 'am'], ['Tepi.', 'tr'], ['Sambung!', 'gr']],
  logo: 'logo.svg',
  key: 'teorigraf-v2',              // storan tetapan & rekod (jangan tukar)
  ajarKey: 'teorigraf-ajar',        // storan pelan Mula Mengajar (jangan tukar)
  g60: {                            // teks peraturan Cabaran 60 Saat
    soalan: 'Ada soalan <b>pilih jawapan</b> tentang bucu, tepi dan darjah, graf terarah dan berpemberat, subgraf dan pokok, serta laluan terpendek.',
    lepas: 'Selepas menjawab, lihat jawapan yang betul diserlahkan.'
  }
};

/* ---------- data subtopik (nama & warna subtopik ada dalam slides.js: SUBS) ---------- */
// KSSM bab ini hanya ada SK 5.1 Rangkaian, jadi subtopik app mengikut Standard Pembelajaran.
// SP 5.1.4 (mewakilkan maklumat sebagai rangkaian) dan 5.1.5 (menyelesaikan masalah) digabung dalam '5.1.4'.
const SUBDESC = {
  '5.1.1': 'Bucu, tepi, darjah, gelung, berbilang tepi, graf mudah dan jumlah darjah = 2 × bilangan tepi',
  '5.1.2': 'Graf terarah dan tidak terarah, graf berpemberat dan tidak berpemberat',
  '5.1.3': 'Subgraf daripada graf asal, pokok dan bilangan tepi pokok = bucu − 1',
  '5.1.4': 'Rangkaian sosial dan pengangkutan, laluan terpendek dan kos optimum'
};
const SHORT = { '5.1.1': 'Graf & Darjah', '5.1.2': 'Terarah & Pemberat', '5.1.3': 'Subgraf & Pokok', '5.1.4': 'Rangkaian & Masalah' };
const SUBSIM = { '5.1.1': 'pembina-graf', '5.1.2': 'laluan-terpendek', '5.1.3': 'jadikan-pokok', '5.1.4': 'laluan-terpendek' };

/* ---------- simulasi TEROKA: [fail dalam simulasi/, nama, warna] ---------- */
const SIMLIST = [['pembina-graf', 'Pembina Graf', 'tr'], ['jadikan-pokok', 'Jadikan Pokok', 'gr'], ['laluan-terpendek', 'Laluan Terpendek', 'pu']];
