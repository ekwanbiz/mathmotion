# Panduan bina nota slaid TerokaMath ikut buku teks

Panduan ini untuk sesiapa (Claude atau ejen) yang membina semula nota slaid satu bab TerokaMath.
Diluluskan guru pada 26 Nov 2026. Contoh siap: Bab 1–6 dan 11 Tingkatan 2.

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
| `tail.py` | Nombor slaid ikut subtopik dan tulis `slides.js` |
| `bina_babN_tT.py` | Penjana satu bab. Salin yang paling hampir sebagai permulaan |
| `semak_muat.py` | Semak limpahan setiap slaid (perlu pelayan tempatan port 8765) |
| `tangkap_slaid.py` | Tangkap skrin setiap slaid (semua langkah dipaparkan) untuk semakan |
| `pepejal.py` | Pelukis bentuk 3D (kuboid, prisma, piramid, silinder, kon, sfera, bentangan kubus). `import pepejal as G` |

Contoh untuk bab tertentu: algebra → `bina_bab2_t2.py`; geometri/bulatan → `bina_bab5_t2.py`; satah Cartes → `bina_bab11_t2.py`; jujukan → `bina_bab1_t2.py`; rumus/perkara rumus → `bina_bab3_t2.py`; bentuk 3D → `bina_bab6_t2.py`.

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
| 11 Transformasi Isometri | `isomove` | 42 | 26 |
| 7–10, 12, 13 | – | – | belum |
