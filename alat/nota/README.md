# Panduan bina nota slaid TerokaMath ikut buku teks

Panduan ini untuk sesiapa (Claude atau ejen) yang membina semula nota slaid satu bab TerokaMath.
Diluluskan guru pada 26 Nov 2026. Semua bab Tingkatan 2 (Bab 1–13) siap.

## 1. Prinsip kandungan

1. **Rujuk buku teks KPM sahaja.** Jangan guna buku aktiviti penerbit luar.
2. **Guna ayat buku teks sebanyak mungkin.** Sama sebiji tidak mengapa. Ini termasuk:
   maksud/definisi, sifat, rumus, langkah kerja, ayat soalan CONTOH dan ayat jalan penyelesaian.
3. **Tukar nombor, koordinat, sudut dan nama** dalam setiap CONTOH. Rajah dilukis semula ikut nombor baharu.
   Jika nombor tidak boleh ditukar (cth. Segi Tiga Pascal, heksagon sekata), kekalkan.
4. **Semak semua kiraan** selepas menukar nombor (kira semula dengan Python jika perlu).
   Pilih nombor yang memberi jawapan kemas (integer atau 2 tempat perpuluhan seperti dalam buku).
5. **Ayat sendiri hanya jika buku tiada ayat** untuk bahagian itu (cth. label rajah, jawapan yang buku beri dalam bentuk rajah).
   Ayat sendiri mesti ikut gaya buku teks. Guru menegur ayat yang kekok, jadi elakkan gaya ringkas seperti
   "(a) Ya. Hanya kedudukan berubah." Tulis seperti buku: "(a) Transformasi kerana hanya kedudukannya yang berubah."
6. **Perkataan arahan ikut buku:** Tentukan, Hitung, Nyatakan, Huraikan, Perihalkan, Lengkapkan, Permudah, Kembangkan, Faktorkan.
   Penutup jawapan: "Maka, ...", "Oleh itu, ...", "... kerana ...".
7. **Jika buku tidak tepat dari segi Matematik,** kekalkan ayat buku dan tambah nota kecil berlabel "Nota:".
   Jangan sebut "buku teks" dalam slaid.
   Contoh yang dijumpai: imej putaran "orientasi yang sama" (Bab 11); "peringkat simetri putaran = bilangan paksi simetri" (Bab 11).
8. **Susunan ikut buku:** subtopik, standard pembelajaran dan nombor CONTOH. Label slaid contoh "CONTOH n" ikut nombor buku.
9. **Tatatanda:** pecahan bertindan (`span.fr`), bukan garis condong (unit seperti km/j kekal). Bar punca kuasa meliputi seluruh nombor (`sq()`).
   Pemboleh ubah condong (`<i>x</i>`). Tanda tolak tipografi (−). Bahasa Melayu sahaja.

## 2. Struktur slaid

| Jenis | Kicker | Isi |
|---|---|---|
| Maksud | DEFINISI | `de()` kotak maksud ayat buku + `bul()` |
| Sifat / rumus | SIFAT / KONSEP | `bul()` atau `cards()` untuk rumus besar |
| Contoh | CONTOH n | ayat soalan `p()` → `pen()` ("Penyelesaian:" + langkah muncul satu demi satu) |
| Contoh algebra / kiraan panjang | CONTOH n | soalan di kiri, jalan kerja dalam `work()` (panel kanan, baris "= ..." muncul satu demi satu) |
| Penyelesaian masalah | CONTOH n | `four()`: Memahami masalah, Merancang strategi, Melaksanakan strategi, Membuat kesimpulan |
| Jadual rumusan | RUMUSAN / PERBANDINGAN | `full` (jadual lebar penuh) |

- Rajah di kanan (`fig`) dilukis dengan SVG (`svg.py`: `Plane` untuk satah Cartes, `box()` untuk rajah bebas). Tambah "Rajah tidak mengikut skala" jika sudut/panjang tidak tepat.
- Bahagian rajah yang muncul bersama langkah: bungkus dengan `<g class="rv">`.
- Contoh yang terlalu panjang: pecah kepada 2 slaid ("... (sambungan)") — jangan kecilkan tulisan.
- **Setiap slaid mesti muat skrin 1366×768 tanpa skrol.** Cara memendekkan: buang label "Penyelesaian:" (`pen(..., False)`),
  pindahkan nota kecil ke dalam rajah, gabungkan baris pendek, atau pecah slaid.

## 3. Alat (folder ini)

| Fail | Guna |
|---|---|
| `svg.py` | Pembantu SVG (warna tema gelap, `Plane`, `box`, `T`, `P`, `arrowhead`) |
| `helpers.py` | Pembantu HTML slaid (`S`, `de`, `bul`, `p`, `note`, `steps`, `ans`, `vec`, `card`, `cards`, `reg`, `arc`) |
| `urutan.json` | Susunan langkah bagi slaid yang ada langkah di kedua-dua lajur (contoh: rajah kanan dahulu, kemudian jawapan kiri). Dibaca oleh `tail.py` |
| `tail.py` | Nombor slaid ikut subtopik dan tulis `slides.js` |
| `bina_babN_tT.py` | Penjana satu bab. Salin yang paling hampir sebagai permulaan |
| `semak_muat.py` | Semak limpahan setiap slaid (perlu pelayan tempatan port 8765) |
| `tangkap_slaid.py` | Tangkap skrin setiap slaid (semua langkah dipaparkan) untuk semakan |
| `graf.py` | Satah Cartes berskala bebas (`Gr`: titik, garis, lengkung fungsi, bacaan graf) dan rajah anak panah. `import graf as GF` |
| `statrajah.py` | Plot titik, carta palang, carta pai, gambar rajah Venn, gambar rajah pokok, gundalan. `import statrajah as SR` |
| `umum.py` | Pembantu HTML dikongsi (fr, sq, pw, pen, work, formula, table, stack). Penjana T3 ke atas: `exec(open(os.path.join(HERE, 'umum.py')).read())` selepas `COL` ditakrif |
| `rajah2d.py` | Rajah geometri 2D: bulatan, lengkok, sudut, tangen, label bucu (Bab 6 T3). `import rajah2d as RJ` |
| `unjuran.py` | Prisma keratan rentas seragam: lakaran 3D, pelan, dongakan depan dan sisi dengan garis sempang automatik (Bab 7 T3) |
| `pepejal.py` | Pelukis bentuk 3D (kuboid, prisma, piramid, silinder, kon, sfera, bentangan kubus). `import pepejal as G` |

Contoh untuk bab tertentu: algebra → `bina_bab2_t2.py`; geometri/bulatan → `bina_bab5_t2.py`; satah Cartes → `bina_bab11_t2.py`; jujukan → `bina_bab1_t2.py`; rumus/perkara rumus → `bina_bab3_t2.py`; bentuk 3D → `bina_bab6_t2.py`; koordinat/jarak/titik tengah → `bina_bab7_t2.py`; fungsi dan graf fungsi → `bina_bab8_t2.py`; laju/pecutan → `bina_bab9_t2.py`; kecerunan → `bina_bab10_t2.py`; statistik → `bina_bab12_t2.py`; kebarangkalian → `bina_bab13_t2.py`.

Bab yang menggabungkan subtopik (`BAB.gabung` dalam `bab.js`, contoh Bab 12 → 12.1) dipaparkan sebagai satu subtopik: semak dengan `semak_muat.py '[["12.1",N]]'` dan pastikan `SUBDESC` ada kunci gabungan.

SUBS sedia ada folder bab dikekalkan walaupun susunan buku berbeza, kerana `bab.js` dan `soalan.js` bergantung pada nombor subtopik itu (contoh: Bab 10 kekal 10.1.1–10.1.3).

Rajah HTML dalam `fig` (panel kerja + nota) mesti dibungkus dalam `stack()` (lajur menegak), jika tidak ia tersusun mendatar dan melimpah.

Rajah SVG: teks dalam `<text>` tidak boleh guna `<i>`. Guna `<tspan font-style="italic">` (penjana Bab 6 menukar secara automatik).

Ujian tanpa menyentuh folder sebenar: `NOTA_OUT=../../<folder>bt/slides.js python3 bina_bab6_t2.py` (salin folder bab ke `<folder>bt` dahulu).

## 4. Aliran kerja satu bab

1. **Dapatkan buku teks.** PDF buku teks penuh (guru muat naik di chat; fail Drive > 10 MB tidak boleh dimuat turun melalui penyambung).
   Cari halaman bab: `pdftotext -f N -l N buku.pdf -`. Asingkan bab: `qpdf buku.pdf --pages . A-B -- babN.pdf`.
2. **Baca bab:** teks (`pdftotext`) untuk ayat tepat, dan imej halaman (`pdftoppm -r 65 -png`) untuk rajah dan susunan contoh.
3. **Semak `SUBS` sedia ada** dalam `<folder>/slides.js` — kekalkan nombor, nama dan warna subtopik (bank soalan dan simulasi bergantung padanya).
4. **Tulis penjana** `bina_babN_tT.py` ikut prinsip di atas. Jalankan: `python3 bina_babN_tT.py` → menulis `<folder>/slides.js`.
5. **Semak:** pelayan `python3 -m http.server 8765` di akar repo, kemudian
   `python3 alat/nota/semak_muat.py '[["4.1",6],["4.2",12]]' <folder>` (tiada output = semua muat) dan
   `python3 alat/nota/tangkap_slaid.py <folder> tag '[...]'` → semak setiap imej: rajah betul, label tidak bertindih, kiraan betul.
   Semak juga mod cerah sekali.
6. **Uji laluan bab** (`#/nota`, `#/ajar`, `#/latihan`, `#/games/60`) tiada ralat konsol.
7. **Naikkan `CACHE` dalam `sw.js`**, commit, push.
8. **Laporan kepada guru:** bilangan slaid lama vs baharu, contoh yang dipecah, ayat buku yang tidak tepat, dan PDF semakan.

## 5. Status (Tingkatan 2)

| Bab | Folder | Slaid | Contoh |
|---|---|---|---|
| 1 Pola dan Jujukan | `pola` | 18 | 12 |
| 2 Pemfaktoran dan Pecahan Algebra | `pemfaktoran` | 29 | 20 |
| 3 Rumus Algebra | `rumus` | 10 | 6 |
| 4 Poligon | `poligon` | 18 | 9 |
| 5 Bulatan | `circmotion` | 29 | 17 |
| 6 Bentuk Geometri Tiga Dimensi | `bentuk3d` | 28 | 12 |
| 7 Koordinat | `koordinat` | 19 | 14 |
| 8 Graf Fungsi | `graphx` | 24 | 15 |
| 9 Laju dan Pecutan | `pecut` | 19 | 20 |
| 10 Kecerunan Garis Lurus | `gradien` | 18 | 13 |
| 12 Sukatan Kecenderungan Memusat | `kecenderungan` | 30 | 27 |
| 13 Kebarangkalian Mudah | `probalyt` | 18 | 12 |
| 11 Transformasi Isometri | `isomove` | 42 | 26 |

## Status Tingkatan 3

| Bab | Folder | Slaid | Contoh |
|---|---|---|---|
| 1 Indeks | `indeks` | 22 | 21 |
| 2 Bentuk Piawai | `piawai` | 16 | 16 |
| 3 Matematik Pengguna | `pengguna` | 28 | 20 |
| 4 Lukisan Berskala | `berskala` | 20 | 14 |
| 5 Nisbah Trigonometri | `trigonometri` | 28 | 16 |
| 6 Sudut dan Tangen bagi Bulatan | `sudutbulatan` | 39 | 21 |
| 7 Pelan dan Dongakan | `pelan` | 26 | 11 |
| 8 Lokus dalam Dua Dimensi | `lokus` | 20 | 13 |
| 9 Garis Lurus | `garislurus` | 26 | 18 |

Buku teks T3: Bab 1 = PDF hlm 13–39, Bab 2 = 40–59, Bab 3 = 60–95, Bab 4 = 96–115, Bab 5 = 116–137, Bab 6 = 138–177, Bab 7 = 178–207, Bab 8 = 208–233, Bab 9 = 234–261. Semua bab T3 siap.

Bab 4 dan Bab 5 T3 mengekalkan SUBS lama (4.1.1–4.1.4, 5.1.1/5.1.2/5.1.4/5.1.7) yang digabung kepada 4.1 dan 5.1 melalui `BAB.gabung`: semak dengan `semak_muat.py '[["4.1",20]]' berskala`.

## Susunan langkah (penting)

Enjin memaparkan langkah `.rv` mengikut atribut `data-o` jika ada, jika tiada ikut susunan HTML (lajur kiri dahulu). Jika slaid ada langkah di kedua-dua lajur, tentukan susunan dalam `urutan.json`:
- jawapan di kiri bergantung pada rajah/jalan kira di kanan → `f,b`
- empat langkah penyelesaian masalah di kiri + jalan kira di kanan → `b:3,f,b` (kesimpulan paling akhir)
- langkah pembinaan + rajah setiap langkah → `mix`; rajah dahulu bagi setiap bahagian → `mixf`
- dua contoh berasingan (kiri dan kanan) → tiada entri.
Semak setiap slaid sebegini sebelum dimasukkan.

## Status Tingkatan 4

| Bab | Folder | Slaid | Contoh |
|---|---|---|---|
| 1 Fungsi dan Persamaan Kuadratik dalam Satu Pemboleh Ubah | `kuadratik` | 23 | 10 |
| 2 Asas Nombor | `asasnombor` | 20 | 12 |
| 3 Penaakulan Logik | `logik` | 32 | 24 |
| 4 Operasi Set | `operasiset` | 26 | 15 |
| 5 Rangkaian dalam Teori Graf | `teorigraf` | 23 | 17 |
| 6 Ketaksamaan Linear dalam Dua Pemboleh Ubah | `ketaksamaan` | 16 | 13 |
| 7 Graf Gerakan | `grafgerakan` | 16 | 13 |
| 8 Sukatan Serakan Data Tak Terkumpul | `serakan` | 16 | 13 |
| 9 Kebarangkalian Peristiwa Bergabung | `peristiwa` | 19 | 13 |
| 10 Matematik Pengguna: Pengurusan Kewangan | `kewangan` | 19 | 6 + contoh tanpa nombor + kajian kes |

Buku teks T4 (PDF_Maths Ting4_1_313_Digital.pdf, 313 halaman): Bab 1 = PDF hlm 1–32, Bab 2 = 33–54, Bab 3 = 55–94, Bab 4 = 95–128, Bab 5 = 129–154, Bab 6 = 155–182, Bab 7 = 183–208, Bab 8 = 209–242, Bab 9 = 243–270, Bab 10 = 271–296.
Bab 4: fungsi `venn()` dalam bina_bab4_t4.py melukis gambar rajah Venn 2/3 set dengan kawasan berlorek (clipPath + mask) dan unsur/nombor ikut kawasan.
Bab 5: fungsi `gdraw()` dalam bina_bab5_t4.py melukis graf (bucu, tepi, berbilang tepi lengkung, gelung, anak panah, pemberat); `gz()` versi besar untuk `panel()` (grid graf kecil).
Bab 6: fungsi `plane()` dalam bina_bab6_t4.py melukis satah Cartes dengan garis padu/sempang dan rantau sepunya berlorek (poligon dipotong ikut setiap ketaksamaan, `clip()`).
Bab 7: fungsi `gm()` dalam bina_bab7_t4.py melukis graf jarak-masa / laju-masa (garis, titik, garis putus, luas berlorek).
Bab 8: `dotplot()`, `boxplot()` dan `quart()` (kaedah kuartil buku) dalam bina_bab8_t4.py. SUBS lama digabung (8.1, 8.2): semak `'[["8.1",4],["8.2",12]]' serakan`.
Bab 9: `tree()` (gambar rajah pokok 2 peringkat, cabang diserlah), `vennbox()`, `sf()` (pecahan bertindan dalam SVG). Kiraan disemak dengan `fractions.Fraction`.
Bab 10: `plan()` jadual pelan kewangan (baris jumlah tebal; jadual panjang dipecah kepada 2 slaid). SUBS lama digabung (10.1.3 → 10.1.2): semak `'[["10.1.1",5],["10.1.2",14]]' kewangan`.
SUBS lama dikekalkan dan digabung melalui `BAB.gabung` (1.1; 3.1 dan 3.2). Semak: `semak_muat.py '[["1.1",23]]' kuadratik`, `'[["3.1",17],["3.2",15]]' logik`.
Bab 1: ayat buku "semakin kecil nilai a, semakin lebar lengkok" dikekalkan dengan Nota (bandingkan nilai a tanpa tanda negatif).


## Status T5 (buku teks Matematik T5 KSSM; halaman PDF = halaman buku + 9)
| Bab | Folder | Slaid | Contoh |
|---|---|---|---|
| 1 Ubahan | `ubahan` | 24 | 1–24 |
| 2 Matriks | `matriks` | 24 | 1–30 |

Bab 1 = PDF hlm 10–42, Bab 2 = 43–80, Bab 3 = 81–102. Penjana: bina_babN_t5.py. Penyelesaian masalah guna 4 kotak (`ps4()`).
Bab 2: `M()` matriks HTML guna inline-grid (jangan guna <table> dalam p(): HTML tidak sah dan susun atur pecah); `mul/add/sc/det/inv` untuk semak jawapan. Semak `'[["2.1",5],["2.2",19]]' matriks`.
