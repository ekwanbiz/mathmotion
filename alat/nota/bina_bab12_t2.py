"""Bab 12 T2 Sukatan Kecenderungan Memusat: nota ikut buku teks (ayat buku, nombor dan nama ditukar).
Subtopik folder kecenderungan dikekalkan (12.1.1 hingga 12.1.4) kerana bab.js dan soalan.js bergantung padanya:
12.1.1 = buku 12.1.1, 12.1.2 = buku 12.1.2, 12.1.3 = buku 12.1.3 + 12.1.4, 12.1.4 = buku 12.1.5 + 12.1.6 + 12.1.7."""
import os, math, sys, random
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
import statrajah as SR
from graf import TR, PA, PU, AM, PK, GR, MU3, TX, mn

SUBS = [{"no": "12.1.1", "name": "Mod, Median dan Min", "col": "#38BDF8"}, {"no": "12.1.2", "name": "Kesan Perubahan Data", "col": "#FB923C"},
        {"no": "12.1.3", "name": "Data Terkumpul", "col": "#A78BFA"}, {"no": "12.1.4", "name": "Memilih Sukatan", "col": "#34D399"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()


def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'


def pen(s, items, label=True):
    return (p('<b>Penyelesaian:</b>') if label else '') + steps(s, items)


def work(blocks, s, cols=1, fs=19):
    c = COL[s]
    out = []
    for lb, lines in blocks:
        inner = ''.join(f'<div class="rv">{ln}</div>' for ln in lines)
        out.append(f'<div>{f"<b style=\"color:{c}\">{lb}</b> " if lb else ""}{inner}</div>')
    return ('<div style="width:100%;align-self:flex-start;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:16px 20px;'
            + (f'display:grid;grid-template-columns:repeat({cols},1fr);gap:10px 18px;' if cols > 1 else 'display:flex;flex-direction:column;gap:8px;')
            + f'font-size:{fs}px;line-height:1.5">' + ''.join(out) + '</div>')


def formula(html, c):
    return f'<div style="display:inline-block;margin:6px 0;padding:10px 18px;border:2px solid {c};border-radius:14px;background:#131C2E;font-size:21px;font-weight:700">{html}</div>'


def table(head, rows, c, fs=18, rvrows=(), hl=None, center=True):
    al = 'center' if center else 'left'
    th = ''.join(f'<th style="padding:7px 10px;text-align:{al};font-size:{fs - 2}px;color:{c};border:1px solid #22304A;background:#0E1626">{h}</th>' for h in head)
    tb = ''
    for i, r in enumerate(rows):
        cls = ' class="rv"' if i in rvrows else ''
        tb += f'<tr{cls}>' + ''.join(f'<td style="padding:6px 10px;text-align:{al};font-size:{fs}px;font-weight:600;border:1px solid #22304A{";color:" + c if hl and (i, j) in hl else ""}">{x}</td>' for j, x in enumerate(r)) + '</tr>'
    return f'<div class="sl-table" style="width:100%"><table style="width:100%;border-collapse:collapse;background:#131C2E"><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'


def htable(rows, c, fs=18):
    """jadual mendatar: setiap baris (label, nilai...)."""
    out = ''
    for lb, *vals in rows:
        out += f'<tr><th style="padding:6px 10px;font-size:{fs - 1}px;color:{c};border:1px solid #22304A;background:#0E1626;text-align:left">{lb}</th>' + ''.join(f'<td style="padding:6px 10px;text-align:center;font-size:{fs}px;font-weight:600;border:1px solid #22304A">{v}</td>' for v in vals) + '</tr>'
    return f'<div class="sl-table" style="width:100%"><table style="width:100%;border-collapse:collapse;background:#131C2E">{out}</table></div>'


def stack(*xs):
    return '<div style="width:100%;display:flex;flex-direction:column;gap:12px;align-self:flex-start">' + ''.join(xs) + '</div>'


def SV(inner, aria):
    return GF.svg(inner, aria)


def d2(x):
    return f'{round(float(x) + 1e-12, 2):.2f}'


def median(xs):
    xs = sorted(xs); n = len(xs)
    return xs[n // 2] if n % 2 else Fr(xs[n // 2 - 1] + xs[n // 2], 2)


def RM(v):
    return f'RM{v:.2f}'


# =====================================================================
# 12.1.1 MOD, MEDIAN DAN MIN
# =====================================================================
s = '12.1.1'
c = COL[s]
S(s, 'DEFINISI', 'Sukatan kecenderungan memusat',
  de(s, 'Sukatan kecenderungan memusat ialah satu sukatan yang dapat menunjukkan kedudukan sesuatu kumpulan data dan memperihalkan maklumat keseluruhan data itu dengan satu nilai sahaja.')
  + p('Proses ini sesuai menggunakan sukatan kecenderungan memusat. Tiga jenis <b>sukatan kecenderungan memusat</b> ini ialah min, median dan mod.')
  + note('Kekerapan ialah bilangan kali sesuatu item muncul dalam suatu data. Jadual kekerapan ialah satu jadual yang menyenaraikan setiap item data dan kekerapan bagi item tersebut.', 'Imbas kembali:'),
  cards(card('MOD', 'Nilai paling kerap', 'nilai yang paling tinggi kekerapannya', TR),
        card('MEDIAN', 'Nilai di tengah-tengah', 'data disusun mengikut tertib menaik atau menurun', PK),
        card('MIN', 'Jumlah nilai data ÷ bilangan data', 'nilai purata', GR)))

d1a = [6, 7, 3, 6, 8, 6, 7]
assert d1a.count(6) == 3
S(s, 'CONTOH 1', 'Mod',
  de(s, '<b>Mod</b> bagi suatu set data ialah nilai yang <b>paling tinggi kekerapannya</b>.')
  + p('Kadang-kadang terdapat dua mod dalam satu set data apabila kekerapan tertingginya sama. Set data dikatakan tiada mod apabila nilai kekerapan satu set data adalah sama.')
  + p('<b>CONTOH 1</b> Nyatakan mod bagi setiap set data berikut.')
  + bul(s, ['(a) 6, 7, 3, 6, 8, 6, 7', '(b) <i>P</i>, <i>Q</i>, <i>R</i>, <i>Q</i>, <i>S</i>, <i>Q</i>, <i>R</i>, <i>Q</i>', '(c) Milo, Teh, Milo, Kopi, Teh, Milo, Kopi, Teh', '(d) 3, 5, 7, 9, 11']),
  work([('(a)', ['6 mempunyai kekerapan tertinggi, iaitu 3', 'Mod = 6']), ('(b)', ['<i>Q</i> mempunyai kekerapan tertinggi, iaitu 4', 'Mod = <i>Q</i>']),
        ('(c)', ['Milo dan Teh mempunyai kekerapan tertinggi, iaitu 3', 'Mod = Milo dan Teh']), ('(d)', ['Tiada nombor yang berulang', 'Tiada mod'])], s))

o = '<rect x="20" y="40" width="460" height="90" rx="14" fill="#131C2E" stroke="#22304A" stroke-width="2"/>'
o += GF.T(250, 70, 'Median', AM, 20) + GF.T(250, 100, 'Data disusun mengikut tertib menaik atau menurun', TX, 15)
o += GF.arrow((160, 130), (110, 190), MU3) + GF.arrow((340, 130), (390, 190), MU3)
o += GF.T(120, 160, 'Bilangan data', MU3, 13, 'end') + GF.T(380, 160, 'Bilangan data', MU3, 13, 'start')
o += '<rect x="20" y="195" width="200" height="56" rx="12" fill="#131C2E" stroke="#38BDF8" stroke-width="2"/><rect x="280" y="195" width="200" height="56" rx="12" fill="#131C2E" stroke="#F472B6" stroke-width="2"/>'
o += GF.T(120, 223, 'Genap', TR, 19) + GF.T(380, 223, 'Ganjil', PK, 19)
o += GF.arrow((120, 251), (120, 300), MU3) + GF.arrow((380, 251), (380, 300), MU3)
o += GF.T(120, 330, 'Purata dua nilai data', TX, 16) + GF.T(120, 354, 'di tengah-tengah', TX, 16) + GF.T(380, 330, 'Nilai data di', TX, 16) + GF.T(380, 354, 'tengah-tengah', TX, 16)
S(s, 'DEFINISI', 'Median',
  de(s, '<b>Median</b> bagi set data dengan bilangan data yang ganjil ialah nilai yang berada di <b>tengah-tengah</b>, manakala median bagi set data dengan bilangan data yang genap ialah nilai purata bagi dua nombor di tengah-tengah data yang telah disusun mengikut tertib menaik atau menurun.')
  + note('Satu kaedah lain untuk menentukan median adalah dengan cara penghapusan data kiri dan kanan secara berpasangan (menaik atau menurun).', 'Tip:'),
  SV(o, 'Carta alir menentukan median bagi bilangan data genap dan ganjil'))

d3 = [0, 3, 2, 4, 1, 5, 2, 4, 3, 2]
d4a, d4b = [5, 8, 3, 6, 5, 9, 7, 4, 2], [32, 30, 25, 27, 28, 25, 29, 28]
assert median(d3) == Fr(5, 2) and median(d4a) == 5 and median(d4b) == 28
S(s, 'CONTOH 2', 'Menentukan median',
  p('Data di bawah ialah wang saku bagi lima orang murid ke sekolah setiap hari. Tentukan median. &nbsp; RM6 &nbsp; RM9 &nbsp; RM4 &nbsp; RM8 &nbsp; RM6')
  + work([('', ['Susun data mengikut tertib menaik: 4 &nbsp;6 &nbsp;<b>6</b> &nbsp;8 &nbsp;9', 'Tandakan data di tengah-tengah. Median = RM6'])], s, 1, 18)
  + p('<b>CONTOH 3</b> Data di bawah menunjukkan jumlah bilangan gol pasukan Rusa dalam 10 permainan. Tentukan median. &nbsp; 0 &nbsp; 3 &nbsp; 2 &nbsp; 4 &nbsp; 1 &nbsp; 5 &nbsp; 2 &nbsp; 4 &nbsp; 3 &nbsp; 2')
  + work([('', ['Susun data mengikut tertib menaik: 0 &nbsp;1 &nbsp;2 &nbsp;2 &nbsp;<b>2</b> &nbsp;<b>3</b> &nbsp;3 &nbsp;4 &nbsp;4 &nbsp;5', f'Tandakan data di tengah-tengah. Hitungkan purata dua nombor itu: {fr("2 + 3", 2)} = 2.5', 'Median = 2.5'])], s, 1, 17),
  work([('CONTOH 4', ['Tentukan median bagi setiap set data berikut.', '(a) 5, 8, 3, 6, 5, 9, 7, 4, 2 &nbsp; (b) 32, 30, 25, 27, 28, 25, 29, 28']),
        ('(a)', ['Susun data mengikut tertib menaik.', '<s>2</s>, <s>3</s>, <s>4</s>, <s>5</s>, <b>5</b>, <s>6</s>, <s>7</s>, <s>8</s>, <s>9</s>', 'Median = 5']),
        ('(b)', ['Susun data mengikut tertib menaik.', '<s>25</s>, <s>25</s>, <s>27</s>, <b>28</b>, <b>28</b>, <s>29</s>, <s>30</s>, <s>32</s>', f'Median = {fr("28 + 28", 2)} = 28'])], s, 1, 18))

# median daripada jadual kekerapan
f5a, f5b = [3, 2, 5, 1], [3, 3, 4, 2]
S(s, 'CONTOH 5', 'Median daripada jadual kekerapan',
  p(f'<i>n</i> ialah jumlah kekerapan. Jika <i>n</i> ganjil, median ialah data pada kedudukan ke-({fr("<i>n</i> + 1", 2)}). Jika <i>n</i> genap, median ialah purata data pada kedudukan ke-({fr("<i>n</i>", 2)}) dan ({fr("<i>n</i>", 2)} + 1).')
  + p('(a) Jadual menunjukkan masa yang diambil oleh 11 kumpulan murid untuk membina model roket dalam satu aktiviti Sains. Tentukan median.')
  + htable([('Masa (minit)', 10, 20, 30, 40), ('Kekerapan', *f5a), ('Kedudukan data', '1 - 3', '4 - 5', '<b>6</b> - 10', '11')], c, 17)
  + work([('', [f'Jumlah kekerapan = 11. Median = data ke-({fr("11 + 1", 2)}) = data ke-6', 'Data ke-6 ialah 30, maka median = 30.'])], s, 1, 17),
  stack(p('(b) Jadual menunjukkan masa yang diambil untuk menjawab teka silang kata oleh 12 kumpulan murid.'),
        htable([('Masa (minit)', 15, 25, 35, 45), ('Kekerapan', *f5b), ('Kedudukan data', '1 - 3', '4 - <b>6</b>', '<b>7</b> - 10', '11 - 12')], c, 17),
        work([('', ['Jumlah kekerapan = 12', f'Median = Purata data ke-[({fr(12, 2)}) dan ({fr(12, 2)} + 1)]', '= Purata data ke-(6 dan 7)', f'= {fr("Data ke-6 + data ke-7", 2)} = {fr("25 + 35", 2)} = 30'])], s, 1, 18)))

# CONTOH 6 plot titik & carta palang
o = GF.box(14, 14, 472, 200) + GF.box(14, 228, 472, 228) + GF.T(30, 36, '1.', c, 16, 'start') + GF.T(30, 250, '2.', c, 16, 'start')
o += SR.dotplot(100, 400, 170, [2, 3, 4, 3, 1], ['1', '2', '3', '4', '5'], TR, r=6)
o += SR.barchart((100, 270, 420, 410), ['1', '2', '3', '4', '5'], [3, 5, 4, 2, 2], 6, 1, 'Kekerapan', 'Bilangan kupon makanan yang dijual', fs=12)
dp = [1] * 2 + [2] * 3 + [3] * 4 + [4] * 3 + [5]
bc = [1] * 3 + [2] * 5 + [3] * 4 + [4] * 2 + [5] * 2
assert median(dp) == 3 and median(bc) == Fr(5, 2)
S(s, 'CONTOH 6', 'Median daripada perwakilan data',
  p('Hitung median bagi situasi di sebelah.')
  + p('1. Plot titik menunjukkan jumlah bilangan kehadiran murid ke perpustakaan dalam lima hari.')
  + work([('', [f'Jumlah kekerapan = 13 (ganjil). Median = data ke-({fr("13 + 1", 2)}) = data ke-7 = 3'])], s, 1, 17)
  + p('2. Carta palang menunjukkan bilangan kupon makanan yang telah dijual oleh guru kelas Tingkatan 2 Cemerlang sempena Hari Kokurikulum.')
  + work([('', ['Jumlah kekerapan = 16 (genap). Median = Purata data ke-(8 dan 9)', f'= {fr("Data ke-8 + data ke-9", 2)} = {fr("2 + 3", 2)} = 2.5'])], s, 1, 17),
  SV(o, 'Plot titik kehadiran dan carta palang kupon makanan'))

# MIN
j7 = [312.40, 405.00, 288.60, 450.20, 343.80]
assert abs(sum(j7) - 1800) < 1e-9
S(s, 'DEFINISI', 'Min',
  p('Nilai purata boleh juga disebut sebagai <b>min</b>.')
  + de(s, '<b>Min</b> bagi suatu set data ialah nilai yang diperoleh apabila <b>jumlah nilai data dibahagikan dengan bilangan data</b>.')
  + formula(f'Min = {fr("Jumlah nilai data", "Bilangan data")}', c)
  + p('<b>CONTOH 7</b> Hitung purata wang jogaton yang telah dipungut oleh Hafiz daripada setiap tingkatan.')
  + work([('', [f'Min = {fr("RM312.40 + RM405.00 + RM288.60 + RM450.20 + RM343.80", 5)} = {fr("RM1 800.00", 5)} = RM360.00'])], s, 1, 17),
  SV(SR.barchart((80, 70, 470, 380), ['1', '2', '3', '4', '5'], j7, 500, 100, 'Kutipan (RM)', 'Tingkatan', vlabels=True), 'Carta palang kutipan jogaton'))

f8 = [2, 3, 4, 6, 4, 3, 2]
assert sum(i * f for i, f in enumerate(f8)) == 72 and sum(f8) == 24
f9 = [3, 5, 10, 8, 4]
assert sum(f9) == 30 and sum((i + 1) * f for i, f in enumerate(f9)) == 95 and d2(95 / 30) == '3.17'
S(s, 'CONTOH 8', 'Min daripada plot titik dan jadual kekerapan',
  p('Plot titik menunjukkan keputusan kaji selidik berkenaan dengan pengambilan bilangan tin air berkarbonat yang diambil oleh 24 orang murid dalam sehari. Hitung min bilangan tin air berkarbonat yang diambil oleh mereka dalam sehari.')
  + work([('', [f'Min = {fr("(2 × 0) + (3 × 1) + (4 × 2) + (6 × 3) + (4 × 4) + (3 × 5) + (2 × 6)", "2 + 3 + 4 + 6 + 4 + 3 + 2")}', f'= {fr(72, 24)} = 3',
                'Maka, bilangan tin air berkarbonat yang diambil oleh mereka dalam sehari ialah 3 tin.'])], s, 1, 17),
  SV(SR.dotplot(70, 430, 400, f8, None, TR, r=9, title='Bilangan tin air berkarbonat'), 'Plot titik bilangan tin air berkarbonat'))

S(s, 'CONTOH 9', 'Min daripada jadual kekerapan',
  de(s, 'Min bagi data dalam jadual kekerapan boleh diperoleh dengan mengira jumlah hasil darab data dengan kekerapan yang sepadan, kemudian dibahagi dengan jumlah kekerapan.')
  + formula(f'Min = {fr("Hasil tambah (data × kekerapan)", "Jumlah kekerapan")}', c)
  + p('Jadual menunjukkan masa penggunaan Internet bagi murid Tingkatan 2 Delima dalam sehari. Hitung min bagi data yang diberikan dalam jadual kekerapan di atas.')
  + htable([('Penggunaan Internet (jam)', 1, 2, 3, 4, 5), ('Bilangan murid', *f9)], c, 17),
  stack(table(['Penggunaan Internet (jam)', 'Bilangan murid', 'Penggunaan Internet × Bilangan murid'],
        [[i + 1, f, f'{i + 1} × {f} = {(i + 1) * f}'] for i, f in enumerate(f9)] + [['<b>Jumlah</b>', '<b>30</b>', '<b>95</b>']], c, 16, rvrows=(5,)),
        work([('', [f'Min = {fr("95 jam", 30)} = 3.17 jam', 'Maka, min ialah 3.17 jam.'])], s, 1, 18)))

# nilai ekstrem
w12 = [2, 5, 5, 6, 7]; w12b = [2, 5, 5, 6, 37]
assert sum(w12) / 5 == 5 and sum(w12b) / 5 == 11 and median(w12) == median(w12b) == 5
S(s, 'CONTOH 10', 'Nilai ekstrem',
  de(s, '<b>Nilai ekstrem</b> ialah nilai yang <b>terlalu kecil</b> atau <b>terlalu besar</b> dalam suatu set data, iaitu nilainya terlalu jauh daripada nilai data-data yang lain dalam setnya.')
  + p('<b>CONTOH 10</b> Masa, dalam minit, yang diambil oleh 7 orang murid untuk menyiapkan model poligon tiga dimensi ialah 4, 5, 6, 6, 7, 8, 25. Antara data tersebut, yang mana satu merupakan nilai ekstrem? Jelaskan.')
  + work([('Penyelesaian:', ['25 ialah nilai ekstrem kerana nilainya jauh lebih besar daripada data-data yang lain.'])], s, 1, 17)
  ,
  SV(SR.dotplot(60, 440, 200, [0] * 0 + [1, 1, 2, 1, 1] + [0] * 0, ['4', '5', '6', '7', '8'], TR, gap=60, r=8)
     + f'<circle cx="440" cy="184" r="8" fill="{PK}"/>' + GF.T(440, 220, '25', PK, 15) + GF.L((340, 200), (440, 200), GF.AX, 2.5, '6 5') + GF.T(440, 150, 'nilai ekstrem', PK, 15)
     + GF.T(250, 300, 'Nilai ekstrem jauh daripada data-data yang lain', MU3, 16, halo=False), 'Plot titik dengan nilai ekstrem 25'))

o11 = GF.L((40, 220), (460, 220), GF.AX, 2.5)
for v in range(-8, 7):
    X = 60 + (v + 8) * 27
    o11 += GF.L((X, 215), (X, 225), GF.AX, 2) + GF.T(X, 242, mn(v), MU3, 12)
for v, k in [(-8, 0), (1, 0), (2, 0), (3, 0), (4, 0), (4, 1), (6, 0)]:
    o11 += f'<circle cx="{60 + (v + 8) * 27}" cy="{202 - k * 18}" r="8" fill="{PK if v == -8 else TR}"/>'
o11 += GF.T(60, 170, 'nilai ekstrem', PK, 15)
S(s, 'CONTOH 11', 'Mengenal pasti nilai ekstrem',
  p('Kenal pasti nilai ekstrem dalam set data di bawah. Jelaskan jawapan anda.')
  + p('<b>−8, 1, 2, 3, 4, 4, 6</b>')
  + work([('Penyelesaian:', ['−8 ialah nilai ekstrem kerana nilainya jauh lebih kecil daripada data-data yang lain.'])], s, 1, 19),
  SV(o11, 'Plot titik dengan nilai ekstrem −8'))

S(s, 'CONTOH 12', 'Kesan nilai ekstrem',
  p('1. Set data di bawah ialah data wang saku yang dibawa oleh lima orang murid ke sekolah: RM2, RM5, RM5, RM6, RM7. Hitung mod, median dan min bagi set data tersebut.')
  + p('2. Anda dikehendaki menggantikan RM7 dengan RM37, kemudian hitung nilai mod, median dan min yang baharu.')
  + work([('1.', ['Mod = RM5', 'Median = RM5', f'Min = {fr("RM2 + RM5 + RM5 + RM6 + RM7", 5)}', f'= {fr("RM25", 5)} = RM5']),
          ('2.', ['Mod = RM5', 'Median = RM5', f'Min = {fr("RM2 + RM5 + RM5 + RM6 + RM37", 5)}', f'= {fr("RM55", 5)} = RM11'])], s, 2, 18),
  de(s, 'Hasil daripada pengiraan menunjukkan bahawa, apabila suatu nilai ekstrem wujud dalam set data, maka data tersebut akan mempengaruhi nilai min. Seperti contoh di atas, nilai min didapati berubah dengan peningkatan sebanyak RM6 manakala nilai median dan mod tidak berubah dengan adanya nilai ekstrem.'))

# =====================================================================
# 12.1.2 KESAN PERUBAHAN DATA
# =====================================================================
s = '12.1.2'
c = COL[s]
sc = [2, 3, 3, 5, 7]
rows = [['<i>n</i>', *sc, 4, 3, 3], ['<i>n</i> + 1', *[x + 1 for x in sc], 5, 4, 4], ['<i>n</i> × 2', *[2 * x for x in sc], 8, 6, 6]]
assert sum(sc) / 5 == 4 and median(sc) == 3
S(s, 'KONSEP', 'Data diubah secara seragam',
  p('Jadual menunjukkan skor lima orang murid <i>A</i>, <i>B</i>, <i>C</i>, <i>D</i> dan <i>E</i> dalam satu kuiz. Setiap data asal ditambah dengan 1 (baris 2) atau didarab dengan 2 (baris 3).')
  + table(['Skor', '<i>A</i>', '<i>B</i>', '<i>C</i>', '<i>D</i>', '<i>E</i>', 'Min', 'Median', 'Mod'], rows, c, 17, rvrows=(1, 2)),
  stack(de(s, 'Daripada aktiviti tersebut, apabila data diubah secara seragam iaitu setiap data asal ditambah dengan 1 atau didarab dengan 2, kita mendapati nilai min, median dan mod juga akan ditambah 1 atau didarab dengan 2.')
  + p('Hal ini bermakna <b>perubahan data secara seragam</b> akan menyebabkan <b>perubahan min, median, dan mod secara seragam</b> juga. Namun, apabila <b>data itu diubah secara tidak seragam</b>, maka nilai <b>min, median dan mod</b> juga akan <b>berubah secara tidak seragam</b>.')))

b13 = [2, 3, 4, 4, 7]
assert sum(b13) / 5 == 4 and sum(x + 2 for x in b13) / 5 == 6 and sum(3 * x for x in b13) / 5 == 12
S(s, 'CONTOH 13', 'Perubahan data secara seragam',
  p('Kamal membeli 5 jenis alat tulis di koperasi sekolah yang masing-masingnya berharga RM2, RM3, RM4, RM4 dan RM7. (a) Hitung min, median dan mod bagi set data tersebut. (b) Hitung min, median dan mod yang baharu jika setiap harga alat tulis itu (i) ditambah RM2 (ii) didarab 3')
  + work([('(a) RM2, RM3, RM4, RM4, RM7', [f'Min = {fr("RM2 + RM3 + RM4 + RM4 + RM7", 5)} = {fr("RM20", 5)} = RM4', 'Median = RM4, Mod = RM4'])], s, 1, 18)
  + note('Berdasarkan contoh tersebut, apabila data diubah secara seragam, nilai min, median dan mod yang baharu juga berubah secara seragam.', 'Kesimpulan:'),
  work([('(b)(i) Data baharu: RM4, RM5, RM6, RM6 dan RM9', [f'Min = {fr("RM4 + RM5 + RM6 + RM6 + RM9", 5)} = {fr("RM30", 5)} = RM6', 'Median = RM6, Mod = RM6', 'Nilai min, median dan mod asal juga ditambah RM2.']),
        ('(b)(ii) Data baharu: RM6, RM9, RM12, RM12 dan RM21', [f'Min = {fr("RM6 + RM9 + RM12 + RM12 + RM21", 5)} = {fr("RM60", 5)} = RM12', 'Median = RM12, Mod = RM12', 'Nilai min, median dan mod asal juga didarab 3.'])], s, 1, 18))

S(s, 'CONTOH 14', 'Perubahan data secara tidak seragam',
  p('Skor Zara dalam kuiz bahasa Arab ialah 2, 5 dan 5. (a) Hitung min, median dan mod bagi set data itu. (b) Tambahkan data pertama dengan 1, tambahkan data kedua dengan 2 dan tambahkan data ketiga dengan 3. Seterusnya, hitung nilai min, median dan mod yang baharu.')
  , stack(work([('(a)', [f'Min = {fr("2 + 5 + 5", 3)} = {fr(12, 3)} = 4', 'Median = 5, Mod = 5']),
          ('(b)', ['Data baharu ialah (2 + 1), (5 + 2), (5 + 3) iaitu 3, 7 dan 8.', f'Min = {fr("3 + 7 + 8", 3)} = {fr(18, 3)} = 6', 'Median = 7, Tiada mod'])], s, 1, 18),
  de(s, 'Berdasarkan contoh tersebut, apabila data diubah secara tidak seragam, nilai min, median dan mod yang baharu juga berubah secara tidak seragam.')))

# =====================================================================
# 12.1.3 DATA TERKUMPUL
# =====================================================================
s = '12.1.3'
c = COL[s]
marks = [12, 17, 25, 38, 31, 22, 36, 29, 33, 45, 52, 41, 58, 47, 55, 49, 50, 43, 57, 63, 71, 66, 78, 61, 74, 69, 85, 92, 81, 97]
rnd = random.Random(7); mk = marks[:]; rnd.shuffle(mk)
kls = [(0, 19), (20, 39), (40, 59), (60, 79), (80, 99)]
cnt = [sum(a <= m <= b for m in marks) for a, b in kls]
assert cnt == [2, 7, 10, 7, 4] and sum(cnt) == 30
grid = '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;background:#131C2E;border:1px solid #22304A;border-radius:14px;padding:10px;font-size:19px;font-weight:700;text-align:center">' + ''.join(f'<span>{m}</span>' for m in mk) + '</div>'
S(s, 'KONSEP', 'Jadual kekerapan bagi data terkumpul',
  de(s, 'Bagi jadual kekerapan data terkumpul, data diklasifikasikan dalam kelas tertentu dengan selang yang seragam.')
  + p('Kelas ini dapat mengkategorikan data itu kepada beberapa kumpulan yang sesuai seperti gred keputusan, lulus atau gagal, tahap pencapaian dan sebagainya. Maklumat-maklumat ini akan membantu kita membuat rumusan. Situasi ini sangat penting apabila kita ingin mengorganisasikan set data yang besar.')
  + p('<b>CONTOH 15</b> Set data menunjukkan markah ujian Matematik bagi 30 orang murid Tingkatan 2 Zamrud dalam Peperiksaan Pertengahan Tahun. Organisasikan data tersebut dalam jadual kekerapan mengikut kelas yang diberi. Contohnya, markah 85 terletak dalam kelas 80 - 99.'),
  stack(p(f'<b style="color:{c}">Markah Matematik Tingkatan 2 Zamrud</b>'), grid,
        table(['Markah', 'Gundalan', 'Kekerapan'], [[f'{a} - {b}', SR.tally(n), n] for (a, b), n in zip(kls, cnt)], c, 16, rvrows=(0, 1, 2, 3, 4))))

times = ['5:10', '5:25', '5:35', '5:48', '5:55', '6:02', '6:10', '6:15', '6:20', '6:24', '6:28', '6:31', '6:35', '6:40', '6:44', '6:50', '6:55', '6:58', '7:05', '7:20']
tm = times[:]; random.Random(3).shuffle(tm)
tk = [('5:00 - 5:29', 2), ('5:30 - 5:59', 3), ('6:00 - 6:29', 6), ('6:30 - 6:59', 7), ('7:00 - 7:29', 2)]


def tmin(t):
    h, m_ = t.split(':'); return int(h) * 60 + int(m_)


for lab, n in tk:
    a, b = [tmin(x.strip()) for x in lab.split('-')]
    assert sum(a <= tmin(t) <= b for t in times) == n
grid2 = '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;background:#131C2E;border:1px solid #22304A;border-radius:14px;padding:10px;font-size:18px;font-weight:700;text-align:center">' + ''.join(f'<span>{t}</span>' for t in tm) + '</div>'
S(s, 'CONTOH 16', 'Mengorganisasikan data masa',
  p('Siew Lan menemu ramah 20 orang kawan-kawannya tentang masa mereka bangun daripada tidur pada waktu pagi semasa cuti sekolah yang lepas. Organisasikan data masa (a.m.) itu dalam jadual kekerapan mengikut kelas berikut. Daripada jadual kekerapan tersebut: (a) Nyatakan bilangan murid yang bangun pada pukul 6:00 a.m. - 6:29 a.m. (b) Perihalkan tentang jumlah kekerapan tertinggi dan terendah, masa murid bangun daripada tidur.')
  + work([('Penyelesaian:', ['(a) 6 orang murid', '(b) Daripada jadual kekerapan itu didapati, murid paling ramai bangun pada pukul 6:30 a.m. - 6:59 a.m. iaitu 7 orang. Hanya 2 orang murid sahaja yang bangun pada pukul 5:00 a.m. - 5:29 a.m. dan 7:00 a.m. - 7:29 a.m.'])], s, 1, 16),
  stack(p(f'<b style="color:{c}">Masa bangun pagi (a.m.)</b>'), grid2,
        table(['Masa (a.m.)', 'Gundalan', 'Kekerapan'], [[lab, SR.tally(n), n] for lab, n in tk], c, 16, rvrows=(0, 1, 2, 3, 4))))

# kelas mod
ws = [5, 8, 10, 12, 15, 20, 18, 14, 11, 25, 22, 30, 28, 21, 26, 24, 29, 23, 35, 32, 40, 38, 31, 45, 42, 50, 48, 44, 55, 60]
wk = [(1, 10), (11, 20), (21, 30), (31, 40), (41, 50), (51, 60)]
wc = [sum(a <= w <= b for w in ws) for a, b in wk]
assert wc == [3, 6, 9, 5, 5, 2] and len(ws) == 30
wsh = ws[:]; random.Random(5).shuffle(wsh)
grid3 = '<div style="display:grid;grid-template-columns:repeat(10,1fr);gap:3px;background:#131C2E;border:1px solid #22304A;border-radius:14px;padding:8px;font-size:17px;font-weight:700;text-align:center">' + ''.join(f'<span>{w}</span>' for w in wsh) + '</div>'
S(s, 'CONTOH 17', 'Kelas mod',
  p('Hasil kajian tentang wang saku mingguan, dalam RM, yang dibawa oleh 30 orang murid SMK Taman Bestari ditunjukkan dalam jadual di bawah. (1) Lengkapkan jadual taburan kekerapan. (2) Daripada jadual taburan kekerapan itu, nyatakan kelas yang mempunyai kekerapan tertinggi.')
  + grid3
  + work([('Penyelesaian:', ['2. Kelas yang mempunyai kekerapan tertinggi ialah kelas 21 - 30.'])], s, 1, 17),
  stack(table(['Wang saku (RM)', 'Gundalan', 'Kekerapan'], [[f'{a} - {b}', SR.tally(n), n] for (a, b), n in zip(wk, wc)], c, 16, rvrows=tuple(range(6)), hl={(2, 0), (2, 2)}),
  de(s, 'Setelah data itu diorganisasikan, kita akan mengetahui kelas mod daripada nilai kekerapan yang paling tinggi. Dalam contoh di atas, kekerapan tertinggi ialah 9 dan kelasnya ialah 21 - 30. Maka, kelas 21 - 30 dikenali sebagai <b>kelas mod</b>.')))

f18 = [6, 8, 3, 10, 5, 4]
k18 = ['40 - 44', '45 - 49', '50 - 54', '55 - 59', '60 - 64', '65 - 69']
assert max(f18) == 10 and sum(f18) == 36
k19 = [(60, 64), (65, 69), (70, 74), (75, 79)]; f19 = [3, 9, 6, 2]
S(s, 'CONTOH 18', 'Kelas mod dan titik tengah',
  p('Jadual kekerapan di bawah menunjukkan markah bagi ujian kecerdasan bagi 36 orang murid. Kenal pasti kelas mod.')
  + htable([('Markah', *k18), ('Kekerapan', *f18)], c, 16)
  + pen(s, ['Kekerapan tertinggi = 10', 'Kelas mod = 55 - 59'], False)
  + p('<b>CONTOH 19</b> Jadual kekerapan merekodkan bilangan surat khabar yang dijual oleh kedai yang berlainan dalam satu minggu. Hitung titik tengah bagi setiap kelas.'),
  stack(table(['Bilangan surat khabar', 'Titik tengah', 'Bilangan kedai (kekerapan)'], [[f'{a} - {b}', f'{fr(f"{a} + {b}", 2)} = {(a + b) // 2}', f] for (a, b), f in zip(k19, f19)], c, 17, rvrows=(0, 1, 2, 3)),
        note(f'Untuk mendapatkan min bagi suatu set data terkumpul, titik tengah bagi setiap selang kelas perlu ditentukan terlebih dahulu. Titik tengah = {fr("Had bawah + had atas", 2)}', 'Tip:')))

k20 = [(5, 9), (10, 14), (15, 19), (20, 24), (25, 29), (30, 34)]; f20 = [3, 6, 5, 7, 6, 3]
x20 = [(a + b) // 2 for a, b in k20]
sfx = sum(f * x for f, x in zip(f20, x20))
assert sum(f20) == 30 and sfx == 590 and d2(590 / 30) == '19.67'
S(s, 'CONTOH 20', 'Min bagi data terkumpul',
  p('Jadual di bawah merekodkan tinggi 30 batang anak pokok yang dicerap oleh Kelab Alam Sekitar dalam satu eksperimen sains. Hitung min bagi tinggi anak pokok itu.')
  + formula(f'Min = {fr("Hasil tambah (kekerapan × titik tengah)", "Jumlah kekerapan")} = {fr("∑<i>fx</i>", "∑<i>f</i>")}', c)
  + work([('', ['1. Hitung titik tengah bagi setiap kelas.', '2. Darabkan setiap titik tengah itu dengan kekerapan.', f'3. Min = {fr("∑<i>fx</i>", "∑<i>f</i>")} = {fr(590, 30)} = 19.67 cm'])], s, 1, 18)
  + note('∑ dibaca sebagai "sigma", iaitu tatatanda bagi hasil tambah. <i>f</i> mewakili kekerapan darab titik tengah. Tatatanda bagi min, <i>x̄</i>, disebut "<i>x</i> bar".', 'Tip:'),
  table(['Tinggi pokok (cm)', 'Titik tengah, <i>x</i>', 'Kekerapan, <i>f</i>', '<i>fx</i>'],
        [[f'{a} - {b}', x, f, f'{f} × {x} = {f * x}'] for (a, b), x, f in zip(k20, x20, f20)] + [['', '', '∑<i>f</i> = 30', '∑<i>fx</i> = 590']], c, 16, rvrows=(6,)))

# =====================================================================
# 12.1.4 MEMILIH SUKATAN
# =====================================================================
s = '12.1.4'
c = COL[s]
S(s, 'KONSEP', 'Pemilihan sukatan kecenderungan memusat',
  p('Kita boleh memilih dan memberikan justifikasi kepada mana-mana sukatan kecenderungan memusat untuk memerihalkan taburan sesuatu set data yang diberikan mengikut kesesuaian data tersebut. Jenis data adalah sangat penting apabila kita ingin membuat pemilihan sukatan kecenderungan memusat yang sesuai. Justifikasi pemilihan juga harus jelas agar tepat dan dapat mewakili keseluruhan data.'),
  cards(card('MIN', 'Melibatkan keseluruhan data', 'Min dipilih sebagai sukatan kecenderungan memusat kerana melibatkan keseluruhan data. Apabila terdapat nilai ekstrem, min tidak dapat memberikan tafsiran tepat tentang data kerana nilai ekstrem itu mempengaruhi min.', GR),
        card('MEDIAN', 'Terdapat nilai ekstrem', 'Median ialah sukatan kecenderungan memusat yang lebih sesuai digunakan apabila terdapat nilai ekstrem. Nilai ekstrem tidak mempengaruhi median.', PK),
        card('MOD', 'Data kategori', 'Mod paling sesuai digunakan apabila data yang digunakan ialah data kategori. Contohnya, item kegemaran atau item popular.', TR)))

S(s, 'CONTOH 21', 'Memilih sukatan yang sesuai',
  p('Tentukan jenis sukatan kecenderungan memusat yang sesuai bagi situasi berikut.')
  + table(['Situasi', 'Penyelesaian'], [
      ['1. Plot batang dan daun menunjukkan berat guli dalam 10 balang plastik: 48, 51, 52, 55, 57, 60, 61, 63, 66, 69 g', 'Min kerana tiada nilai ekstrem dalam set data.'],
      ['2. Piktograf menunjukkan perisa aiskrim yang digemari murid Tadika Ceria.', 'Mod kerana data ini ialah data kategori dan ingin menentukan item kegemaran.'],
      ['3. Jadual menunjukkan masa bagi murid Tingkatan 2 Nilam melayari Internet: 1 hingga 7 jam.', 'Min kerana tiada nilai ekstrem dalam set data.'],
      ['4. Plot titik menunjukkan masa bagi 10 orang pemandu dari Kuantan ke Kuala Terengganu: 3, 3, 4, 4, 4, 4, 5, 5, 5, 12 jam.', 'Median kerana terdapat nilai ekstrem dalam set data.'],
      ['5. Carta pai menunjukkan buah-buahan yang menjadi kegemaran murid di Tingkatan 2 Intan.', 'Mod kerana data ini ialah data kategori dan ingin menentukan item kegemaran.']], c, 14, rvrows=(0, 1, 2, 3, 4), center=False))

# CONTOH 22
o = GF.box(14, 14, 472, 214) + GF.box(14, 242, 472, 214) + GF.T(30, 36, '(a)', c, 16, 'start') + GF.T(30, 264, '(c)', c, 16, 'start')
o += SR.barchart((180, 50, 440, 180), ['Langkawi', 'Pangkor', 'Perhentian', 'Redang'], [9, 5, 10, 4], 12, 2, '', 'Bilangan pelancong (ribu)', horizontal=True, fs=12)
o += SR.pie(250, 352, 90, [('Kereta', 100), ('Bas', 150), ('Motosikal', 30), ('Berjalan kaki', 80)], 12)
S(s, 'CONTOH 22', 'Mod daripada perwakilan data',
  p('Penggunaan sukatan kecenderungan memusat dalam statistik atau kegiatan harian. Tentukan mod bagi setiap perwakilan data berikut.')
  + work([('', ['(a) Carta palang bilangan pelancong ke pulau peranginan: Mod ialah Pulau Perhentian.',
                '(b) Piktograf buah-buahan kegemaran murid Tingkatan 2 Mutiara, setiap buah digemari 9 orang murid: Tiada mod.',
                '(c) Carta pai pengangkutan murid ke sekolah: Mod ialah bas.',
                '(d) Jadual peratus keuntungan jualan atas talian (Buku 75, Perisian komputer 60, Tiket wayang 82, Aksesori wanita 120, Pakej pelancongan 90): Mod ialah aksesori wanita.'])], s, 1, 17),
  SV(o, 'Carta palang pelancong pulau dan carta pai pengangkutan murid'))

k23 = [40, 41, 42, 43, 44, 45]; f23 = [3, 6, 8, 7, 4, 2]
data23 = [k for k, f in zip(k23, f23) for _ in range(f)]
assert len(data23) == 30 and sum(data23) == 1269 and median(data23) == 42 and sum(f23[:3]) == 17
S(s, 'CONTOH 23', 'Min, median dan mod daripada carta palang',
  p('Carta palang menunjukkan komisen yang diperoleh sekumpulan pekerja di sebuah restoran dalam seminggu. (a) Hitung min, median dan mod komisen yang diterima oleh pekerja itu dalam seminggu. (b) Hitung pecahan pekerja yang menerima komisen yang kurang atau sama dengan RM42.')
  + work([('(a)', [f'Min = {fr("3(40) + 6(41) + 8(42) + 7(43) + 4(44) + 2(45)", 30)} = {fr(1269, 30)} = RM42.30',
                   f'Median = Purata data ke-(15 dan 16) = {fr("42 + 42", 2)} = RM42, Mod = RM42']),
          ('(b)', [f'Pecahan = {fr("3 + 6 + 8", 30)} = {fr(17, 30)}'])], s, 1, 16),
  SV(SR.barchart((80, 60, 460, 380), [f'{k}' for k in k23], f23, 10, 2, 'Kekerapan', 'Komisen (RM)'), 'Carta palang komisen pekerja'))

f24 = [3, 5, None, 6, 7, 4]
assert Fr(71 + 2 * 3, 25 + 3) == Fr(11, 4)
S(s, 'CONTOH 24', 'Mencari nilai yang tidak diketahui',
  p('Jadual menunjukkan bilangan kesalahan ejaan murid di Tingkatan 2 Delima yang dilakukan ketika menulis karangan Bahasa Melayu.')
  + htable([('Bilangan kesalahan ejaan', 0, 1, 2, 3, 4, 5), ('Bilangan murid', 3, 5, '<i>x</i>', 6, 7, 4)], c, 17)
  + bul(s, ['(a) Jika min bilangan kesalahan ejaan murid itu ialah 2.75, hitung nilai bagi <i>x</i>.', '(b) Jika median bagi taburan kekerapan itu ialah 3, hitung nilai yang paling maksimum bagi <i>x</i>.',
            '(c) Jika mod bagi kesilapan ejaan yang dilakukan oleh murid ialah 2, tentukan nilai minimum yang mungkin bagi <i>x</i>.']),
  work([('(a)', [f'Min = {fr("3(0) + 5(1) + <i>x</i>(2) + 6(3) + 7(4) + 4(5)", "3 + 5 + <i>x</i> + 6 + 7 + 4")} = 2.75', f'{fr("2<i>x</i> + 71", "<i>x</i> + 25")} = 2.75',
                 '2<i>x</i> + 71 = 2.75<i>x</i> + 68.75, 0.75<i>x</i> = 2.25, <i>x</i> = 3']),
        ('(b)', ['Bilangan data yang kurang daripada 3 ialah 8 + <i>x</i>. Jika <i>x</i> = 8, jumlah data = 33 dan median = data ke-17 = 3.',
                 'Jika <i>x</i> = 9, jumlah data = 34 dan median = purata data ke-17 dan ke-18 = 2.5.', 'Maka, nilai yang maksimum bagi <i>x</i> ialah 8.']),
        ('(c)', ['Kekerapan tertinggi yang lain ialah 7. Maka, nilai minimum yang mungkin bagi <i>x</i> ialah 8.'])], s, 1, 16))

r25a, r25b = [150, 155, 190, 198, 207], [230, 228, 90, 240, 112]
assert sum(r25a) == sum(r25b) == 900 and max(r25a) - min(r25a) == 57 and max(r25b) - min(r25b) == 150
S(s, 'CONTOH 25', 'Membuat keputusan',
  p('Dalam membuat ramalan atau pemilihan sukatan kecenderungan memusat yang paling sesuai, kepentingan julat juga diambil perhatian.')
  + p('Cikgu Rosli ingin memilih seorang wakil sekolah ke pertandingan boling peringkat zon. Arif dan Daniel adalah antara pemain yang telah disenaraipendekkan dalam pemilihan ini. Dalam lima latihan yang terakhir sebelum pemilihan wakil sekolah dijalankan, skor balingan yang telah diperoleh Arif ialah 150, 155, 190, 198 dan 207. Skor balingan yang diperoleh Daniel ialah 230, 228, 90, 240 dan 112. Pemain yang manakah akan dipilih sebagai wakil sekolah?')
  + note('Julat ialah beza antara nilai yang terkecil dengan nilai yang terbesar.', 'Imbas kembali:'),
  work([('', [f'Skor min Arif = {fr("150 + 155 + 190 + 198 + 207", 5)} = {fr(900, 5)} = 180', f'Skor min Daniel = {fr("230 + 228 + 90 + 240 + 112", 5)} = {fr(900, 5)} = 180',
              'Kedua-dua orang pemain mempunyai min yang sama. Oleh itu, min tidak boleh digunakan dalam keputusan pemilihan wakil sekolah.',
              'Julat skor balingan Arif = 207 − 150 = 57', 'Julat skor balingan Daniel = 240 − 90 = 150',
              'Kita mendapati bahawa julat skor balingan Arif lebih rendah berbanding dengan Daniel sebab ada di antara skor Daniel sangat rendah (nilai ekstrem) menyebabkan julatnya menjadi besar. Oleh itu, pemilihan Arif sebagai wakil sekolah adalah lebih tepat.'])], s, 1, 17))

t26 = {'Kijang': [60, 90, 30, 92, 85], 'Harimau': [52, 88, 68, 84, 85], 'Seladang': [88, 82, 48, 45, 78]}
mn26 = {k: Fr(sum(v), 5) for k, v in t26.items()}; md26 = {k: median(v) for k, v in t26.items()}
assert float(mn26['Kijang']) == 71.4 and float(mn26['Harimau']) == 75.4 and float(mn26['Seladang']) == 68.2 and md26 == {'Kijang': 85, 'Harimau': 84, 'Seladang': 78}
S(s, 'CONTOH 26', 'Membentuk hujah',
  p('Cikgu Zaki membentuk tiga pasukan bola keranjang. Jadual menunjukkan jumlah jaringan yang dibuat oleh pasukan-pasukan tersebut dalam lima pertandingan yang telah dijalankan.')
  + bul(s, ['(a) Anda ingin menyertai salah satu daripada pasukan tersebut. (i) Dengan mengambil kira min, pasukan manakah yang akan anda sertai? (ii) Jika anda mengambil kira pula median dalam membuat pertimbangan, pasukan manakah yang anda pilih? Jelaskan.',
            '(b) Jika Cikgu Zaki diminta untuk mengemukakan laporan pencapaian pasukan Harimau kepada pengetua sekolah, sukatan kecenderungan memusat yang manakah sepatutnya yang dipilih oleh Cikgu Zaki? Jelaskan.']),
  table(['Pasukan', '1', '2', '3', '4', '5'], [[k, *v] for k, v in t26.items()], c, 18))

S(s, 'CONTOH 26 (sambungan)', 'Penyelesaian',
  work([('(a)(i)', [f'Min Kijang = {fr(357, 5)} = 71.4', f'Min Harimau = {fr(377, 5)} = 75.4', f'Min Seladang = {fr(341, 5)} = 68.2',
                    'Pasukan Harimau dipilih kerana nilai min bagi pasukan Harimau adalah yang paling tinggi, iaitu 75.4.']),
        ('(b)', ['Min. Hal ini demikian kerana min menggunakan keseluruhan set data dalam jadual tersebut. Oleh sebab itu, min sangat sesuai digunakan kerana tiada nilai ekstrem dalam set data itu.'])], s, 1, 18),
  work([('(a)(ii)', ['Set data pasukan Kijang ialah 30, 60, <b>85</b>, 90, 92. Maka, median = 85', 'Set data pasukan Harimau ialah 52, 68, <b>84</b>, 85, 88. Maka, median = 84',
                     'Set data pasukan Seladang ialah 45, 48, <b>78</b>, 82, 88. Maka, median = 78', 'Pasukan Kijang dipilih kerana nilai mediannya paling tinggi, iaitu 85.'])], s, 1, 18))

jan = [30, 80, 60, 130, 100]; feb = [20, 90, 70, 120, 100]
assert sum(jan) == sum(feb) == 400
o = GF.box(14, 14, 472, 214) + GF.box(14, 242, 472, 214)
lab27 = ['Bihun G.', 'Mi G.', 'Nasi G.', 'Nasi L.', 'Laksa']
o += GF.T(250, 34, 'Januari', c, 16) + SR.barchart((90, 60, 460, 190), lab27, jan, 140, 20, 'Kekerapan', fs=11)
o += GF.T(250, 262, 'Februari', c, 16) + SR.barchart((90, 288, 460, 418), lab27, feb, 140, 20, 'Kekerapan', fs=11)
S(s, 'CONTOH 27', 'Membuat kesimpulan',
  p('Carta palang di sebelah menunjukkan pilihan makanan di kantin sekolah pada bulan Januari dan Februari untuk jualan bagi 400 orang murid. (G. = Goreng, L. = Lemak)')
  + bul(s, ['(a) Sukatan kecenderungan memusat yang manakah sesuai bagi situasi di atas? Jelaskan.', '(b) Adakah anda bersetuju dengan pernyataan "Nasi lemak ialah hidangan yang paling digemari oleh murid"? Jelaskan.',
            '(c) Anda merupakan ahli jawatankuasa kantin dalam Persatuan Pengguna. Anda diminta untuk mencadangkan makanan yang perlu dikurangkan penjualannya. Berikan alasan anda.']),
  SV(o, 'Carta palang pilihan makanan kantin bagi Januari dan Februari'))

S(s, 'CONTOH 27 (sambungan)', 'Penyelesaian',
  pen(s, ['(a) Daripada graf di atas didapati min dan median tidak sesuai digunakan kerana data yang diberikan ialah data kategori. Maka, mod adalah lebih sesuai.',
            '(b) Bersetuju kerana nasi lemak ialah mod bagi bulan Januari dan Februari.', '(c) Bihun goreng perlu dikurangkan kerana mempunyai kekerapan yang terendah dalam bulan Januari dan Februari.'], False),
  SV(o, 'Carta palang pilihan makanan kantin bagi Januari dan Februari'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'kecenderungan', 'slides.js')
HEAD = '/* Nota Bab 12 ikut buku teks Matematik T2 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
