"""Bab 7 T5 Sukatan Serakan Data Terkumpul. Nota ikut buku teks Matematik T5 KSSM (ayat buku, data dan nama ditukar;
semua kiraan disemak; ogif dilukis dengan garis lurus antara titik, maka kuartil/persentil dibaca secara interpolasi linear).
CONTOH 1–13 ikut buku. SUBS folder serakanterkumpul dikekalkan (7.1, 7.2)."""
import os, sys, math
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "7.1", "name": "Serakan", "col": "#38BDF8"}, {"no": "7.2", "name": "Sukatan Serakan", "col": "#F472B6"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr
T_, L_ = GF.T, GF.L


def f1(v):
    return f'{v:.1f}'


def nm(v):
    """nombor dengan ruang ribuan, tanpa .0"""
    if isinstance(v, Fr):
        v = float(v)
    s_ = f'{v:,.10g}' if isinstance(v, float) else f'{v:,}'
    if 'e' in s_:
        s_ = f'{v:,.4f}'.rstrip('0').rstrip('.')
    return s_.replace(',', ' ').replace('-', '−')


def d2(v):
    return f'{float(v):,.2f}'.replace(',', ' ')


# ---------- carta ----------
class Ch:
    """carta dalam ruang (u, v): u = indeks (0..n), v = nilai. xl/yl label paksi."""

    def __init__(self, bx, n, vmax, vstep, xlabels, ylab, xlab, fs=12, u0=0):
        self.g = GF.Gr(bx, (u0, n), (0, vmax), xs=1, ys=vstep, labels=False, origin='', xl='', yl='')
        g = self.g
        for i, t in xlabels:
            g.add(T_(g.X(i), g.Y(0) + 16, t, MU, fs, 'middle', 600))
        v = vstep
        while v <= vmax + 1e-9:
            g.add(T_(g.X(u0) - 8, g.Y(v), nm(v), MU, fs, 'end', 600))
            v += vstep
        g.add(T_(g.X(u0) - 8, g.Y(0), '0', MU, fs, 'end', 600))
        g.add(T_((g.L + g.R) / 2, g.B + 38, xlab, MU3, 13, 'middle', 600))
        g.add(f'<text x="{f1(g.L - 42)}" y="{f1((g.T_ + g.B) / 2)}" fill="{MU3}" font-family="Inter, sans-serif" font-size="13" font-weight="600" text-anchor="middle" transform="rotate(-90 {f1(g.L - 42)} {f1((g.T_ + g.B) / 2)})">{ylab}</text>')

    def bars(self, fs, col, start=0):
        g = self.g
        for i, f in enumerate(fs):
            x0, x1 = g.X(start + i), g.X(start + i + 1)
            g.add(f'<rect x="{f1(x0)}" y="{f1(g.Y(f))}" width="{f1(x1 - x0)}" height="{f1(g.Y(0) - g.Y(f))}" fill="{col}33" stroke="{col}" stroke-width="2"/>')
        return self

    def line(self, pts, col, w=3, dots=True, dash=None):
        g = self.g
        P = [g.P(*q) for q in pts]
        d = f' stroke-dasharray="{dash}"' if dash else ''
        s = f'<polyline points="{" ".join(f"{f1(a)},{f1(b)}" for a, b in P)}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linejoin="round"{d}/>'
        if dots:
            s += ''.join(f'<circle cx="{f1(a)}" cy="{f1(b)}" r="4.5" fill="{col}"/>' for a, b in P)
        g.add(s)
        return self

    def read(self, v, u, col=AM, lab=''):
        """garis bacaan mengufuk dari paksi-v ke lengkung, kemudian turun ke paksi-u."""
        g = self.g
        g.add(L_((g.L, g.Y(v)), (g.X(u), g.Y(v)), col, 2, '5 4') + L_((g.X(u), g.Y(v)), (g.X(u), g.Y(0)), col, 2, '5 4'))
        if lab:
            g.add(T_(g.X(u), g.Y(0) - 12, lab, col, 12))
        return self

    def svg(self, aria, extra='', more=0):
        g = self.g
        return f'<svg class="sl-svg" viewBox="0 {f1(g.T_ - 20)} 500 {f1(g.B - g.T_ + 70 + more)}" role="img" aria-label="{aria}">{g.svg()}{extra}</svg>'


def cum(fs):
    out, t = [0], 0
    for f in fs:
        t += f; out.append(t)
    return out


def interp(bd, cf, pos):
    """nilai pada kedudukan kekerapan longgokan pos (interpolasi linear antara sempadan atas)."""
    for i in range(1, len(cf)):
        if cf[i] >= pos:
            return bd[i - 1] + Fr(bd[i] - bd[i - 1]) * Fr(pos - cf[i - 1]) / (cf[i] - cf[i - 1])
    raise ValueError


def stats(mid, fs):
    sf = sum(fs); sfx = sum(Fr(str(x)) * f for x, f in zip(mid, fs)); sfx2 = sum(Fr(str(x)) ** 2 * f for x, f in zip(mid, fs))
    mean = sfx / sf; var = sfx2 / sf - mean ** 2
    return sf, sfx, sfx2, mean, var, math.sqrt(var)


# =====================================================================
# 7.1 SERAKAN
# =====================================================================
s = '7.1'
c = COL[s]
S(s, 'KONSEP', 'Jadual kekerapan data terkumpul',
  p('Bagi suatu set data terkumpul, kita boleh melihat serakan dengan membina histogram dan poligon kekerapan. Sebelum itu, kita perlu mengetahui selang kelas, had bawah, had atas, titik tengah, sempadan bawah, sempadan atas dan kekerapan longgokan.')
  + formula(f'Saiz selang kelas = {F("nilai data terbesar − nilai data terkecil", "bilangan kelas")}', c)
  + note('Selang kelas ialah ukuran julat bagi suatu pembahagian data.', 'Info:'),
  work([('', ['<b>Had bawah</b> ialah nilai terkecil dan <b>had atas</b> ialah nilai terbesar dalam setiap selang kelas.', f'Titik tengah = {F("had bawah + had atas", "2")}',
              f'Sempadan bawah = {F("had atas kelas sebelumnya + had bawah kelas itu", "2")}', f'Sempadan atas = {F("had atas kelas itu + had bawah kelas selepasnya", "2")}'])], s, 1, 17))

data1 = [52, 47, 61, 55, 44, 58, 63, 49, 57, 53, 41, 66, 59, 50, 54, 68, 46, 56, 62, 51, 48, 60, 55, 57]
assert max(data1) == 68 and min(data1) == 41 and len(data1) == 24
cls1 = [(41 + 5 * i, 45 + 5 * i) for i in range(6)]
f1s = [sum(1 for v in data1 if a <= v <= b) for a, b in cls1]
assert sum(f1s) == 24 and f1s == [2, 5, 6, 6, 3, 2]
S(s, 'CONTOH 1', 'Membina jadual kekerapan',
  p('Set data menunjukkan jisim, kepada kg yang terhampir, bagi sekumpulan murid Tingkatan 5.')
  + p(' &nbsp; '.join(str(v) for v in data1))
  + p('(a) Tentukan selang kelas yang sesuai supaya bilangan kelas menjadi 6. (b) Bina jadual kekerapan dan lengkapkan dengan had bawah, had atas, titik tengah, sempadan bawah dan sempadan atas.')
  + work([('(a)', ['Data terbesar ialah 68 dan data terkecil ialah 41.', f'Saiz setiap selang kelas = {F("68 − 41", "6")} = 4.5 ≈ 5'])], s, 1, 16),
  stack(table(['Jisim (kg)', 'Kekerapan', 'Had bawah', 'Had atas', 'Titik tengah', 'Sempadan bawah', 'Sempadan atas'],
              [[f'{a} – {b}', str(f), str(a), str(b), f'{(a + b) / 2:g}', str(a - 0.5), str(b + 0.5)] for (a, b), f in zip(cls1, f1s)], c, 14),
        note('Saiz selang kelas = sempadan atas − sempadan bawah = 45.5 − 40.5 = 5. Elakkan menggunakan had atas − had bawah (45 − 41 = 4, tidak benar).', 'Ingat:')))

f2 = [5, 9, 12, 6, 3]
cf2 = cum(f2)[1:]
assert cf2 == [5, 14, 26, 32, 35]
S(s, 'CONTOH 2', 'Jadual kekerapan longgokan',
  p('Kekerapan longgokan bagi suatu selang kelas ialah hasil tambah kekerapan bagi selang kelas itu dengan jumlah kekerapan kelas-kelas sebelumnya.')
  + p('<b>CONTOH 2</b> Bina jadual kekerapan longgokan daripada jadual kekerapan umur ahli sebuah kelab.')
  + note('Nilai 26 bermaksud terdapat 26 orang berumur 39 tahun dan kurang.', 'Info:'),
  table(['Umur', 'Kekerapan', 'Kekerapan longgokan'], [[f'{10 * (i + 1)} – {10 * (i + 1) + 9}', str(f), f'{cf2[i - 1]} + {f} = {cf2[i]}' if i else str(f)] for i, f in enumerate(f2)], c, 18))

f3 = [4, 12, 18, 26, 15, 5]
b3 = [59.5 + 10 * i for i in range(7)]
c3 = Ch((70, 20, 470, 300), 8, 30, 5, [(i, f'{59.5 + 10 * (i - 1):g}') for i in range(1, 8)], 'Bilangan kereta', 'Laju (km j⁻¹)', u0=0)
c3.bars(f3, TR, 1).line([(0.5, 0)] + [(1.5 + i, f) for i, f in enumerate(f3)] + [(7.5, 0)], PK)
S(s, 'CONTOH 3', 'Histogram dan poligon kekerapan',
  p('<b>Histogram</b> ialah perwakilan grafik data terkumpul dengan palang bersebelahan; tinggi palang mewakili kekerapan. <b>Poligon kekerapan</b> dibina dengan menyambungkan titik tengah setiap kelas pada hujung atas setiap palang, termasuk satu kelas sebelum kelas pertama dan selepas kelas terakhir dengan kekerapan sifar.')
  + table(['Laju (km j⁻¹)', '60 – 69', '70 – 79', '80 – 89', '90 – 99', '100 – 109', '110 – 119'], [['Bilangan kereta'] + [str(f) for f in f3]], c, 14)
  + note('Histogram dan poligon kekerapan boleh dibina hanya menggunakan data selanjar.', 'Info:'),
  c3.svg('Histogram dan poligon kekerapan laju kereta'))

f4 = [2, 5, 8, 4, 1]
c4 = Ch((70, 20, 470, 280), 7, 10, 2, [(i, f'{37 + 5 * i}') for i in range(7)], 'Bilangan peserta', 'Titik tengah, masa (s)')
c4.line([(i, f) for i, f in enumerate([0] + f4 + [0])], GR)
assert sum(f4) == 20
S(s, 'CONTOH 4', 'Poligon kekerapan daripada jadual kekerapan',
  steps(s, ['Cari titik tengah setiap selang kelas.', 'Tambah satu selang kelas sebelum kelas pertama dan selepas kelas terakhir dengan kekerapan sifar.', 'Tandakan titik tengah dengan kekerapan yang sepadan.', 'Sambungkan setiap titik tengah dengan garis lurus.'])
  + table(['Masa (s)', '35 – 39', '40 – 44', '45 – 49', '50 – 54', '55 – 59', '60 – 64', '65 – 69'], [['Bilangan peserta', '0'] + [str(f) for f in f4] + ['0'], ['Titik tengah'] + [str(37 + 5 * i) for i in range(7)]], c, 14),
  c4.svg('Poligon kekerapan masa peserta'))


def mini(x, y, hs, col, lab):
    w = 14
    s_ = ''.join(f'<rect x="{x + i * w}" y="{y - h}" width="{w}" height="{h}" fill="{col}44" stroke="{col}" stroke-width="1.5"/>' for i, h in enumerate(hs))
    return s_ + L_((x - 4, y), (x + w * len(hs) + 4, y), MU, 1.5) + T_(x + w * len(hs) / 2, y + 16, lab, MU3, 12, 'middle', 600)


shp = mini(20, 90, [10, 25, 45, 60, 45, 25, 10], TR, 'Simetri (loceng)') + mini(180, 90, [60, 50, 35, 22, 14, 8, 4], PK, 'Pencong ke kanan') + mini(340, 90, [4, 8, 14, 22, 35, 50, 60], GR, 'Pencong ke kiri') \
    + mini(20, 200, [35, 35, 35, 35, 35, 35, 35], AM, 'Seragam') + mini(180, 200, [8, 12, 18, 26, 36, 48, 62], PU, 'Bentuk-J') + mini(340, 200, [20, 45, 30, 15, 30, 48, 22], PA, 'Bimod')
S(s, 'CONTOH 5', 'Bentuk taburan data',
  p('Bentuk taburan data ialah <b>simetri</b> jika bentuk dan saiz taburan hampir sama apabila dibahagi kepada bahagian kiri dan kanan. Bentuk taburan ialah <b>pencong</b> jika satu daripada hujung histogram lebih panjang daripada hujungnya yang lain.')
  + work([('CONTOH 5', ['Dua histogram mewakili masa yang diambil oleh 25 orang pelari dalam acara 200 m dan 400 m. Histogram 200 m berbentuk seragam (julat 24 s – 33 s) manakala histogram 400 m berbentuk loceng (julat 52 s – 79 s).',
                                    '(a) Bentuk taburan: 400 m ialah bentuk loceng; 200 m ialah seragam.', '(b) Acara 400 m mempunyai serakan yang lebih luas kerana beza masa lebih besar, iaitu 27 saat (79 s − 52 s) berbanding 9 saat.'])], s, 1, 15),
  stack(f'<svg class="sl-svg" viewBox="0 15 500 220" role="img" aria-label="Bentuk-bentuk taburan">{shp}</svg>',
        note('Bentuk taburan data tidak selalunya sempurna. Kenal pasti bentuk taburan secara keseluruhan.', 'Ingat:')))

fA = [2, 9, 14, 10, 6, 4, 3, 2]
fB = [1, 2, 3, 5, 8, 13, 12, 6]
assert sum(fA) == sum(fB) == 50
c6 = Ch((70, 20, 470, 290), 9, 15, 5, [(i, f'{82.5 + 35 * (i - 1):g}') for i in range(1, 9, 2)], 'Unit rumah', 'Titik tengah harga jualan (RM ribu)')
c6.line([(i, f) for i, f in enumerate([0] + fA + [0])], TR).line([(i, f) for i, f in enumerate([0] + fB + [0])], PK)
S(s, 'CONTOH 6', 'Membanding serakan dua poligon kekerapan',
  p('Poligon kekerapan menunjukkan harga jualan 50 unit rumah di dua buah kawasan, A (biru) dan B (merah jambu), bagi tempoh enam bulan yang lepas. (a) Nyatakan bentuk taburan bagi kedua-dua kawasan. (b) Bandingkan serakan harga jualan. (c) Kawasan manakah mungkin mewakili kawasan bandar dan luar bandar?')
  + work([('Penyelesaian', ['(a) Taburan harga di kawasan A ialah pencong ke kanan manakala kawasan B ialah pencong ke kiri.', '(b) Serakan harga jualan di kedua-dua kawasan adalah hampir sama walaupun bentuk taburan berbeza.',
                                          '(c) Kawasan A mewakili luar bandar kerana kebanyakan harga rumahnya rendah; kawasan B mewakili bandar kerana kebanyakan harga rumahnya tinggi.'])], s, 1, 15),
  c6.svg('Poligon kekerapan harga rumah kawasan A dan B', T_(150, 40, 'A', TR, 16) + T_(400, 40, 'B', PK, 16)))

f7 = [3, 9, 16, 20, 10, 2]
bd7 = [99.5 + 50 * i for i in range(7)]
cf7 = cum(f7)
N7 = cf7[-1]
q7 = [interp(bd7, cf7, Fr(k * N7, 4)) for k in (1, 2, 3)]
assert N7 == 60 and [float(x) for x in q7] == [208.875, 254.5, 292.0]
c7 = Ch((70, 20, 470, 300), 6, 60, 10, [(i, f'{bd7[i]:g}') for i in range(7)], 'Kekerapan longgokan', 'Kuantiti gula (mg)')
c7.line([(i, f) for i, f in enumerate(cf7)], GR)
for k, qv in zip((1, 2, 3), q7):
    c7.read(k * 15, float((qv - Fr(199, 2)) / 50), AM, ['Q₁', 'Q₂', 'Q₃'][k - 1])
S(s, 'CONTOH 7', 'Membina ogif dan menentukan kuartil',
  p('<b>Ogif</b> ialah lengkung kekerapan longgokan berbentuk S. Plot kekerapan longgokan dengan sempadan atas yang sepadan, bermula dengan satu kelas sebelum kelas pertama berkekerapan sifar.')
  + table(['Gula (mg)', '100–149', '150–199', '200–249', '250–299', '300–349', '350–399'], [['Kekerapan'] + [str(f) for f in f7], ['Kekerapan longgokan'] + [str(x) for x in cf7[1:]]], c, 14)
  + work([('Penyelesaian (N = 60)', [f'Kedudukan Q₁ = {F("1", "4")} × 60 = 15 → Q₁ ≈ 209 mg', f'Kedudukan Q₂ = {F("1", "2")} × 60 = 30 → median ≈ 254.5 mg', f'Kedudukan Q₃ = {F("3", "4")} × 60 = 45 → Q₃ ≈ 292 mg'])], s, 1, 15),
  stack(c7.svg('Ogif kandungan gula dalam 60 jenis minuman'), note('15 jenis minuman mengandungi gula kurang daripada atau sama dengan 209 mg.', 'Info:')))

bd8 = [30.5 + 10 * i for i in range(7)]
cf8 = [0, 2, 8, 20, 36, 46, 50]
P10, P46, P92 = interp(bd8, cf8, 5), interp(bd8, cf8, 23), interp(bd8, cf8, 46)
at555 = cf8[2] + Fr(cf8[3] - cf8[2], 10) * 5
assert (float(P10), float(P46), float(P92)) == (45.5, 62.375, 80.5) and at555 == 14 and Fr(14, 50) * 100 == 28
c8 = Ch((70, 20, 470, 300), 6, 50, 10, [(i, f'{bd8[i]:g}') for i in range(7)], 'Kekerapan longgokan', 'Skor')
c8.line([(i, f) for i, f in enumerate(cf8)], PU)
c8.read(5, 1.5, AM, 'P₁₀').read(23, float((P46 - Fr(605, 10)) / 10) + 3, AM, 'P₄₆').read(46, 5, PK, 'P₉₂')
S(s, 'CONTOH 8', 'Persentil daripada ogif',
  p('<b>Persentil</b> ialah nilai yang membahagikan satu set data kepada 100 bahagian yang sama, diwakili dengan P₁, P₂, …, P₉₉. Ogif menunjukkan skor ujian kecerdasan 50 orang calon jawatan.')
  + p('(a) Cari (i) P₁₀, (ii) P₄₆. (b) Hanya calon yang memperoleh persentil ke-92 dan ke atas dipanggil temu duga. Apakah skor minimum? (c) Berapakah peratusan calon yang mendapat skor 55 dan ke bawah?')
  + work([('Penyelesaian', [f'(a)(i) {F("10", "100")} × 50 = 5 → P₁₀ = 45.5', f'(ii) {F("46", "100")} × 50 = 23 → P₄₆ ≈ 62.4', f'(b) {F("92", "100")} × 50 = 46 → P₉₂ = 80.5. Skor minimum ialah 80.5.',
                                          f'(c) Daripada ogif, 14 orang mendapat skor 55.5 dan ke bawah: {F("14", "50")} × 100% = 28%'])], s, 1, 15),
  stack(c8.svg('Ogif skor ujian kecerdasan'), note('Persentil ke-25 juga dikenali sebagai kuartil pertama, persentil ke-50 sebagai median dan persentil ke-75 sebagai kuartil ketiga.', 'Info:')))

# =====================================================================
# 7.2 SUKATAN SERAKAN
# =====================================================================
s = '7.2'
c = COL[s]
f9 = [5, 12, 22, 25, 10, 6]
bd9 = [399.5 + 100 * i for i in range(7)]
cf9 = cum(f9)
Q1_9, Q3_9 = interp(bd9, cf9, 20), interp(bd9, cf9, 60)
assert cf9[-1] == 80 and round(float(Q1_9), 1) == 613.1 and round(float(Q3_9), 1) == 783.5 and round(float(Q3_9 - Q1_9), 1) == 170.4 and 949.5 - 449.5 == 500
c9 = Ch((70, 20, 470, 300), 6, 80, 20, [(i, f'{bd9[i]:g}') for i in range(7)], 'Kekerapan longgokan', 'Jisim (g)')
c9.line([(i, f) for i, f in enumerate(cf9)], PK)
c9.read(20, float((Q1_9 - Fr(3995, 10)) / 100), AM, 'Q₁').read(60, float((Q3_9 - Fr(3995, 10)) / 100), AM, 'Q₃')
S(s, 'CONTOH 9', 'Julat dan julat antara kuartil',
  p('Pak Kassim mencatatkan jisim 80 biji buah mangga yang dipetik dari kebunnya. Tentukan julat dan julat antara kuartil bagi data tersebut.')
  + table(['Jisim (g)', '400–499', '500–599', '600–699', '700–799', '800–899', '900–999'], [['Bilangan mangga'] + [str(f) for f in f9]], c, 14)
  + work([('Penyelesaian', [f'Julat = titik tengah kelas tertinggi − titik tengah kelas terendah = {F("900 + 999", "2")} − {F("400 + 499", "2")} = 949.5 − 449.5 = 500 g',
                                          f'Kedudukan Q₁ = {F("1", "4")} × 80 = 20 → Q₁ ≈ 613.1; kedudukan Q₃ = {F("3", "4")} × 80 = 60 → Q₃ ≈ 783.5', 'Julat antara kuartil = Q₃ − Q₁ = 783.5 − 613.1 = 170.4 g'])], s, 1, 15),
  stack(c9.svg('Ogif jisim mangga'), note('Julat antara kuartil ialah beza jisim antara mangga yang paling berat dengan yang paling ringan bagi 50% bahagian tengah taburan.', 'Info:')))

mid10 = [154.5 + 10 * i for i in range(6)]
f10 = [3, 9, 18, 24, 14, 7]
sf, sfx, sfx2, mean, var, sd = stats(mid10, f10)
assert sf == 75 and float(sfx) == 13667.5 and float(sfx2) == 2502588.75 and f'{float(mean):.2f}' == '182.23' and f'{float(var):.2f}' == '158.86' and f'{sd:.2f}' == '12.60'
rows10 = [[f'{int(m - 4.5)} – {int(m + 4.5)}', str(f), f'{m:g}', d2(m * f).rstrip('0').rstrip('.'), d2(m * m).rstrip('0').rstrip('.'), d2(m * m * f).rstrip('0').rstrip('.')] for m, f in zip(mid10, f10)]
S(s, 'CONTOH 10', 'Varians dan sisihan piawai data terkumpul',
  formula(f'σ² = {F("Σ<i>fx</i>²", "Σ<i>f</i>")} − <i>x̄</i>² &nbsp;&nbsp; σ = {sq(F("Σ<i>fx</i>²", "Σ<i>f</i>") + " − <i>x̄</i>²")}', c)
  + p('(<i>x</i> = titik tengah, <i>f</i> = kekerapan, <i>x̄</i> = min). Jadual menunjukkan isi padu air (liter) sehari bagi 75 isi rumah. Hitung varians dan sisihan piawai.')
  + work([('Penyelesaian', [f'Min, <i>x̄</i> = {F("13 667.5", "75")} = 182.23 l', f'Varians, σ² = {F("2 502 588.75", "75")} − ({F("13 667.5", "75")})²', '= 158.86 l² (2 tempat perpuluhan)', f'Sisihan piawai, σ = {sq("158.8622")} = 12.60 l'])], s, 1, 16),
  table(['Isi padu (l)', '<i>f</i>', '<i>x</i>', '<i>fx</i>', '<i>x</i>²', '<i>fx</i>²'], rows10 + [['', 'Σ<i>f</i> = 75', '', 'Σ<i>fx</i> = 13 667.5', '', 'Σ<i>fx</i>² = 2 502 588.75']], c, 13))

bd11 = [80, 90, 100, 110, 120, 130, 140, 150]
cf11 = [0, 4, 10, 18, 36, 70, 84, 90]
q11 = [interp(bd11, cf11, Fr(k * 90, 4)) for k in (1, 2, 3)]
assert [round(float(x), 1) for x in q11] == [112.5, 122.6, 129.3] and (q11[1] - q11[0]) > (q11[2] - q11[1])
c11 = Ch((70, 20, 470, 230), 7, 90, 30, [(i, str(bd11[i])) for i in range(8)], 'Kekerapan longgokan', 'Jisim (g)')
c11.line([(i, f) for i, f in enumerate(cf11)], TR)
g = c11.g
Y0 = 310
uu = lambda v: g.X(float((Fr(v) - 80) / 10))
bx = L_((uu(80), Y0), (uu(q11[0]), Y0), PK, 2.5) + L_((uu(q11[2]), Y0), (uu(150), Y0), PK, 2.5) \
    + f'<rect x="{f1(uu(q11[0]))}" y="{Y0 - 20}" width="{f1(uu(q11[2]) - uu(q11[0]))}" height="40" fill="{PK}33" stroke="{PK}" stroke-width="2.5"/>' + L_((uu(q11[1]), Y0 - 20), (uu(q11[1]), Y0 + 20), PK, 3) \
    + L_((uu(80), Y0 - 12), (uu(80), Y0 + 12), PK, 2.5) + L_((uu(150), Y0 - 12), (uu(150), Y0 + 12), PK, 2.5)
for v, t in [(80, '80'), (q11[0], '112.5'), (q11[1], '122.6'), (q11[2], '129.3'), (150, '150')]:
    bx += T_(uu(v), Y0 + 34, t, MU3, 12)
S(s, 'CONTOH 11', 'Membina dan mentafsir plot kotak',
  p('Plot kotak memaparkan data melalui lima nilai: nilai minimum, Q₁, median, Q₃ dan nilai maksimum.')
  + bul(s, ['Garis median di tengah-tengah kotak dan sungut sama panjang: taburan simetri.', 'Bahagian kiri kotak lebih besar: taburan pencong ke kiri.', 'Bahagian kanan kotak lebih besar: taburan pencong ke kanan.'])
  + work([('CONTOH 11', ['Ogif menunjukkan jisim 90 biji jambu batu. Bina plot kotak dan nyatakan bentuk taburan.', 'Minimum = 80, maksimum = 150', f'Kedudukan Q₁ = 22.5 → 112.5; Q₂ = 45 → 122.6; Q₃ = 67.5 → 129.3',
                                       'Data mempunyai taburan pencong ke kiri kerana bahagian kiri plot kotak lebih besar daripada bahagian kanan.'])], s, 1, 15),
  c11.svg('Ogif dan plot kotak jisim jambu batu', bx, 70))

mid12 = [13.2, 13.7, 14.2, 14.7, 15.2]
fA12, fB12 = [3, 6, 10, 13, 8], [8, 10, 9, 7, 6]
A = stats(mid12, fA12); B = stats(mid12, fB12)
assert A[0] == B[0] == 40 and float(A[3]) == 14.4125 and f'{A[5]:.2f}' == '0.59' and float(B[3]) == 14.1125 and f'{B[5]:.2f}' == '0.67'
assert float(A[1]) == 576.5 and float(A[2]) == 8322.75 and float(B[1]) == 564.5 and float(B[2]) == 7984.45
S(s, 'CONTOH 12', 'Membanding dua set data terkumpul',
  p('Seorang ahli botani menyemai 40 sampel anak benih orkid daripada dua hibrid, A dan B. Jadual menunjukkan diameter bunga bagi kedua-dua hibrid. Berdasarkan min dan sisihan piawai, tentukan hibrid yang menghasilkan bunga yang lebih besar dan konsisten.')
  + table(['Diameter (cm)', '13.0–13.4', '13.5–13.9', '14.0–14.4', '14.5–14.9', '15.0–15.4'], [['Hibrid A'] + [str(f) for f in fA12], ['Hibrid B'] + [str(f) for f in fB12], ['Titik tengah, <i>x</i>'] + [str(m) for m in mid12]], c, 14),
  work([('Hibrid A', ['Σ<i>fx</i> = 576.5, Σ<i>fx</i>² = 8 322.75', f'<i>x̄</i> = {F("576.5", "40")} = 14.41 cm', f'σ = {sq(F("8 322.75", "40") + " − 14.4125²")} = 0.59 cm']),
        ('Hibrid B', ['Σ<i>fx</i> = 564.5, Σ<i>fx</i>² = 7 984.45', f'<i>x̄</i> = {F("564.5", "40")} = 14.11 cm', f'σ = {sq(F("7 984.45", "40") + " − 14.1125²")} = 0.67 cm']),
        ('Kesimpulan', ['Hibrid A menghasilkan bunga yang lebih besar kerana minnya lebih besar (14.41 cm &gt; 14.11 cm) dan lebih konsisten kerana sisihan piawainya lebih kecil (0.59 cm &lt; 0.67 cm).'])], s, 1, 16))

bd13 = [0.45, 0.95, 1.45, 1.95, 2.45, 2.95]
cf13 = [0, 5, 20, 50, 68, 80]
f13 = [cf13[i + 1] - cf13[i] for i in range(5)]
mid13 = [0.7, 1.2, 1.7, 2.2, 2.7]
R = stats(mid13, f13)
assert f13 == [5, 15, 30, 18, 12] and float(R[1]) == 144.5 and float(R[2]) == 285.35 and float(R[3]) == 1.80625 and f'{R[5]:.2f}' == '0.55'
c13 = Ch((70, 20, 470, 280), 5, 80, 20, [(i, f'{bd13[i]:g}') for i in range(6)], 'Kekerapan longgokan', 'Masa (jam)')
c13.line([(i, f) for i, f in enumerate(cf13)], GR)
S(s, 'CONTOH 13', 'Menyelesaikan masalah sukatan serakan',
  p('Ogif menunjukkan tempoh masa (jam) yang diambil oleh 80 pelanggan untuk membeli barang di sebuah pasar raya. (a) Bina jadual kekerapan dengan kelas 0.5 – 0.9, 1.0 – 1.4, 1.5 – 1.9, 2.0 – 2.4 dan 2.5 – 2.9. (b) Anggarkan min dan sisihan piawai.')
  ,
  c13.svg('Ogif masa pelanggan di pasar raya'))

S(s, 'CONTOH 13 (sambungan)', 'Min dan sisihan piawai daripada ogif',
  table(['Masa (jam)', 'Kekerapan, <i>f</i>', 'Titik tengah, <i>x</i>'], [[f'{0.5 + 0.5 * i:.1f} – {0.9 + 0.5 * i:.1f}', str(fq), str(m)] for i, (fq, m) in enumerate(zip(f13, mid13))], c, 16),
  work([('Memahami masalah', ['Menentukan min dan sisihan piawai daripada ogif.']), ('Merancang strategi', ['(a) Bina jadual kekerapan daripada ogif.', '(b) Hitung min dan sisihan piawai menggunakan rumus.']),
        ('Melaksanakan strategi', ['(a) Kekerapan = beza kekerapan longgokan: 5 − 0 = 5, 20 − 5 = 15, 50 − 20 = 30, 68 − 50 = 18, 80 − 68 = 12', '(b) Σ<i>f</i> = 80, Σ<i>fx</i> = 144.5, Σ<i>fx</i>² = 285.35',
                                   f'<i>x̄</i> = {F("144.5", "80")} = 1.81 jam; σ = {sq(F("285.35", "80") + " − 1.80625²")} = 0.55 jam']),
        ('Membuat kesimpulan', ['Min masa ialah 1.81 jam dan sisihan piawai ialah 0.55 jam.'])], s, 1, 15))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'serakanterkumpul', 'slides.js')
HEAD = '/* Nota Bab 7 T5 ikut buku teks Matematik T5 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
