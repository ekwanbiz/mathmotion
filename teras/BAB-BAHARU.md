# TerokaMath · Templat bab baharu

Panduan untuk membina satu bab (contoh: CIRCMOTION, T2 Bab 5 Bulatan) di atas **enjin bersama** dalam `teras/`.
Rujukan lengkap: folder `isomove/` (Bab 11 Transformasi Isometri).

## 1. Struktur folder bab

```
mathmotion/<id-bab>/
  index.html   ← salin dari isomove/index.html, tukar meta/title sahaja
  bab.js       ← konfigurasi bab (BAB, SUBDESC, SHORT, SUBSIM, SIMLIST)
  slides.js    ← SUBS + SLIDES (nota slaid)
  soalan.js    ← semua penjana soalan bab
  logo.svg     ← logo bab (petak bulat 512×512)
  simulasi/*.html  ← simulasi TEROKA (fon: ../../teras/fonts/, bunyi: ../../teras/fx.js)
```

Enjin (JANGAN salin ke folder bab): `teras/teras.css`, `asas.js`, `lembaran.js`, `app.js`, `kelas.js`, `ajar.js`, `fx.js`, `fonts/`.
Urutan skrip dalam `index.html`: `bab.js → slides.js → ../teras/asas.js → soalan.js → ../teras/lembaran.js → ../teras/app.js → ../teras/kelas.js → ../teras/ajar.js`.

## 2. Kontrak: apa yang setiap bab MESTI sediakan

### bab.js
| Nama | Isi |
|---|---|
| `BAB` | `{ id, nama:['CIRC','MOTION'], ting, no, tajuk, slogan:[[teks,warna]…], logo, key:'<id>-v2', ajarKey:'<id>-ajar', g60:{soalan, lepas} }` |
| `SUBDESC` | `{ '5.1': 'huraian pendek' … }` – kad subtopik NOTA |
| `SHORT` | `{ '5.1': 'nama pendek' … }` – cip subtopik |
| `SUBSIM` | `{ '5.1': 'fail-simulasi' … }` – butang "Cuba di TEROKA" & pelan siap sedia |
| `SIMLIST` | `[[fail, 'Nama', warna] …]` – tab TEROKA (fail = `simulasi/<fail>.html`) |

Warna = nama pemboleh ubah tema: `tr` biru, `pa` oren, `pu` ungu, `am` kuning, `gr` hijau, `pk` merah jambu, `rd` merah.
`key` dan `ajarKey` mesti unik untuk setiap bab dan **tidak boleh ditukar** selepas diterbitkan (data guru disimpan di situ).

### slides.js
- `window.SUBS = [{ no:'5.1', name:'…', col:'#hex' } …]` – 4–7 subtopik ikut buku teks KSSM.
- `window.SLIDES = [{ sub, n, N, kicker, title, body, fig } …]` atau `{ …, full }` untuk slaid lebar.
  - Unsur dengan kelas `rv` keluar satu demi satu (▶). Kelas sedia ada: `sl-def`, `sl-bul`, `sl-steps`, `sl-ans`, `sl-note`, `sl-table`, `sl-svg`.
  - Warna gelap (#0B1220 dsb.) ditukar automatik untuk mod cerah oleh `themed()`.
  - Dijana dengan skrip Python (contoh: `tools/isomove/gen_slides.py` + `gen_app_slides.py`). **Isi slaid mesti diluluskan guru dahulu.**

### soalan.js
| Nama | Untuk | Bentuk |
|---|---|---|
| `QV` | kepelbagaian ayat | `{ kunci: [d => ({ q, ans?, pre?, work?, rev? }) …] }` – 3–6 cara tanya setiap jenis; panggil `vq('kunci', data)` |
| `GEN` | Latihan Kelas | `{ '5.1': { m:[fn…], s:[fn…], k:[fn…] } … }` setiap fn → `{ q, ans, work[], fig?, figAns? }` |
| `WG` + `WSPLAN` | Lembaran Kerja (bank tetap) | `WSPLAN['5.1'] = [[aras, namaWG, bilangan] …]` = **30 soalan/subtopik: 18 m, 9 s, 3 k**. `WG.nama = i => ({ q, ans, work[], fig?, figAns?, kind? })`. Guna `wri/wpick/wnz` (rawak berbenih), bukan `ri/pick`. |
| `gq(level)` | Cabaran 60 Saat | `{ type:'mcq', q, fig, opts[4], c, anim?, rot?, reveal? }` atau `{ type:'tap', q, fig (gSvg), target:[x,y], anim }` |
| `CQT` + `cq(level, types)` | Pertandingan Kumpulan, Siapa Nak Jawab?, Roda | `CQT = { jenis: 'Label' }`; `cq` pulangkan soalan `mcq` seperti di atas |

Pembantu tersedia (teras/asas.js): `ri, pick, shuffle, nz, fmt, par, P, vec, esc, plot, shapeSVG, gSvg, gPoly, gPt, gLine, vq, vreset, vlet, vnama, pr, vcap, wri, wpick, wnz, wcap, mulberry32, GEN_LQ, LVLN, IC, sv, themed, subOf, subCol, snd, burst`.

## 3. Daftar bab dalam hub
1. `mathmotion/index.html` → tambah objek dalam `APPS` (`id, name, path:'/<id>/', logo, mark, key, col, glyph, topic, kw, where:[[ting, bab]]`).
2. `mathmotion/sw.js` → tambah fail bab dalam `APPS`; naikkan `CACHE='mathmotion-vN'`.
3. Butang kembali, kepala "TerokaMath" (logo + Bab N : nama bab, tiada nama app) dan butang **Pelan Mengajar** di kanan atas sudah automatik (dalam teras). Tab: NOTA · TEROKA · LATIHAN · GAMES.

## 4. Aliran kerja dengan ejen (Manager + 2 Programmer)
1. **Manager** (sesi utama): pecahkan bab ikut buku teks → senarai subtopik, idea slaid, jenis soalan, idea simulasi → **bincang & lulus dengan guru**.
2. **Programmer 1** (ejen): `slides.js` (melalui skrip penjana) + `simulasi/` + `logo.svg` + `bab.js`.
3. **Programmer 2** (ejen): `soalan.js` (QV, GEN, WG/WSPLAN, gq, CQT/cq).
   - Kedua-dua ejen kerja dalam folder bab sahaja; **tidak menyentuh `teras/`**.
4. **Manager**: satukan, semak fakta matematik, uji semua tab (pelayar tanpa kepala), letak slaid dalam kanvas reka bentuk → guru semak sekali gus → push.
5. Perubahan pada enjin (`teras/`) dibuat oleh Manager sahaja, dan diuji pada SEMUA bab sebelum push.

## 5. Senarai semakan sebelum push
- [ ] Semua laluan dibuka tanpa ralat: `#/`, `#/ajar`, `#/ajar/tayang`, `#/nota`, `#/nota/<sub>/1`, `#/teroka`, `#/latihan`, `#/latihan/main`, `#/latihan/lembaran`, `#/games`, `#/games/60|kumpulan|siapa|roda`, Kongsi link.
- [ ] Bank Lembaran Kerja = 30 × bilangan subtopik; tiada `undefined`/`NaN`; ayat sama ≤ 2–3 kali/subtopik.
- [ ] Mod gelap & cerah; telefon (390 px) & projektor (1366 px).
- [ ] Bahasa Melayu sahaja; fakta matematik disemak.
- [ ] `sw.js` dikemas kini; hub menunjukkan bab baharu.

## SEO (v133) – selepas tambah bab baharu
Jalankan: `node tools/seo-meta.js > /tmp/meta.json && python3 tools/seo.py /tmp/meta.json`
(kemas kini tag Google/Open Graph, teks statik dalam `<div id="app">`, `sitemap.xml` dan `robots.txt`). Pastikan `index.html` bab juga ada `bebas.js` dan `ga.js` selepas `ajar.js`.

## Slaid tajuk subtopik (teras/muka.js)
Setiap subtopik dimulakan dengan slaid tajuk (n = 0, `cover: true`) yang disisip automatik: "BAB n : tajuk bab",
nombor dan nama subtopik, serta rajah hiasan bab. Slaid ini juga masuk dalam Pelan Mengajar; tidak dicetak.
Bab baharu: tambah satu fungsi dalam `MUKA` (kunci = `BAB.id`, viewBox 600×600, warna gelap) dan pastikan
`<script src="../teras/muka.js"></script>` ada selepas app.js dalam index.html bab. Tiada fungsi → slaid tajuk tanpa rajah.
