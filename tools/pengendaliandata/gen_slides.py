# Penjana slaid NOTA Bab 8 Pengendalian Data (Tingkatan 1, KP2027) -> pengendaliandata/slides.js
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from t1lib import *
from mathfmt import FR, RT, SFR, SRT
OUT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'pengendaliandata', 'slides.js'))
SUB = {'8.1': ('Pengendalian dan Analisis Data', TR)}

def frame(ymax, step, xl, yl):
    s = BOX()
    for v in range(0, ymax + 1, step):
        y = 370 - v / ymax * 300
        s += LINE((70, y), (470, y), GRID, 1.5) + T(58, y, str(v), MU, 15, 'end')
    return s + LINE((70, 370), (475, 370), MU, 3) + LINE((70, 372), (70, 60), MU, 3) + T(470, 405, xl, MU, 16, 'end') + T(70, 40, yl, MU, 16, 'start')

def bars(labels, series, cols, ymax, step, xl, yl, stacked=False, legend=()):
    s = frame(ymax, step, xl, yl); n = len(labels); gw = 400 / n
    for i, lab in enumerate(labels):
        x0 = 70 + i * gw; base = 370
        for j, ser in enumerate(series):
            h = ser[i] / ymax * 300
            if stacked:
                s += RECT(x0 + gw * .2, base - h, gw * .6, h, cols[j], cols[j], 1, 2); base -= h
            else:
                bw = gw * .7 / len(series); s += RECT(x0 + gw * .15 + j * bw, 370 - h, bw, h, cols[j], cols[j], 1, 2)
        s += T(x0 + gw / 2, 390, lab, TX, 15)
    for j, l in enumerate(legend):
        s += RECT(300 + j * 90, 22, 16, 16, cols[j], cols[j], 1, 3) + T(322 + j * 90, 30, l, TX, 14, 'start')
    return s

def pie(parts):
    s = BOX(); c = (165, 215); r = 120; a0 = -90; tot = sum(v for _, v, _ in parts)
    for lab, v, col in parts:
        a1 = a0 + v / tot * 360
        p0 = (c[0] + r * math.cos(math.radians(a0)), c[1] + r * math.sin(math.radians(a0))); p1 = (c[0] + r * math.cos(math.radians(a1)), c[1] + r * math.sin(math.radians(a1)))
        s += f'<path d="M{c[0]} {c[1]} L{p0[0]:.1f} {p0[1]:.1f} A{r} {r} 0 {1 if a1 - a0 > 180 else 0} 1 {p1[0]:.1f} {p1[1]:.1f} Z" fill="{col}" stroke="{NAV}" stroke-width="3"/>'
        m = math.radians((a0 + a1) / 2); s += T(c[0] + (r + 26) * math.cos(m), c[1] + (r + 26) * math.sin(m), f'{round(v / tot * 360)}°', TX, 17)
        a0 = a1
    for i, (lab, v, col) in enumerate(parts):
        s += RECT(345, 120 + i * 40, 16, 16, col, col, 1, 3) + T(367, 128 + i * 40, lab, TX, 15, 'start')
    return svg(s, 'Carta pai')

def dotplot(vals, lo, hi, xl):
    s = BOX(); step = 380 / (hi - lo)
    s += LINE((60, 330), (450, 330), MU, 3)
    for v in range(lo, hi + 1): s += LINE((60 + (v - lo) * step, 330), (60 + (v - lo) * step, 340), MU, 2) + T(60 + (v - lo) * step, 360, str(v), TX, 16)
    for v in range(lo, hi + 1):
        for k in range(vals.count(v)): s += DOT((60 + (v - lo) * step, 310 - k * 26), TR, 10)
    return svg(s + T(255, 395, xl, MU, 16), 'Plot titik')

def scatter(pts, xl, yl, xmax, ymax):
    s = frame(ymax, ymax // 5, xl, yl)
    for x, y in pts: s += DOT((70 + x / xmax * 390, 370 - y / ymax * 300), PK, 8)
    return svg(s, 'Graf sebar')

def hist(edges, freq, ymax, xl):
    s = frame(ymax, 2, xl, 'Kekerapan'); n = len(freq); w = 380 / n
    for i, f in enumerate(freq):
        h = f / ymax * 300; s += RECT(80 + i * w, 370 - h, w, h, NAV, TR, 2, 0)
    for i, e in enumerate(edges): s += T(80 + i * w, 390, str(e), TX, 14)
    return svg(s, 'Histogram')

def linegraph(labels, vals, ymax, step, xl, yl):
    s = frame(ymax, step, xl, yl); n = len(labels); gw = 400 / n
    pts = [(70 + gw * (i + .5), 370 - v / ymax * 300) for i, v in enumerate(vals)]
    s += PATH(pts, AM, 4) + ''.join(DOT(p, AM, 8) for p in pts) + ''.join(T(70 + gw * (i + .5), 390, l, TX, 15) for i, l in enumerate(labels))
    return svg(s, 'Graf garis')

c = TR
add('8.1', '8.1 Mengumpul data', 'Soalan statistik dan kaedah mengumpul data',
    DEF('<b>Soalan statistik</b> ialah soalan yang jawapannya berbeza-beza dan perlu dikumpul sebagai data. Contoh: “Berapa jam murid Tingkatan 1 tidur setiap malam?”', c)
    + TABLE(['Kaedah', 'Contoh'], [['Temu bual', 'bertanya terus kepada guru kantin'], ['Tinjauan', 'borang soal selidik kepada semua murid'], ['Eksperimen', 'menguji masa ais cair pada suhu berbeza'], ['Pemerhatian', 'mengira kenderaan yang lalu di hadapan sekolah']], c), '')
add('8.1', '8.1 Jenis data', 'Data kategori dan data numerik',
    TABLE(['Jenis', 'Maksud', 'Contoh'], [['Kategori', 'dalam bentuk kumpulan atau label', 'warna kegemaran, jenis sukan'], ['Numerik diskret', 'nombor hasil membilang', 'bilangan adik-beradik'], ['Numerik selanjar', 'nombor hasil mengukur', 'tinggi, jisim, masa']], c)
    + NOTE('Tanya: adakah data itu <b>dibilang</b>, <b>diukur</b> atau sekadar <b>label</b>?'), '')
add('8.1', '8.1 Jadual kekerapan', 'Membina jadual kekerapan',
    P('Saiz kasut 12 murid: 4, 5, 5, 6, 4, 5, 7, 6, 5, 4, 5, 6')
    + TABLE(['Saiz', 'Gundalan', 'Kekerapan'], [['4', '|||', '3'], ['5', '||||', '5'], ['6', '|||', '3'], ['7', '|', '1']], c)
    + NOTE('Jumlah kekerapan mesti sama dengan bilangan data: 3 + 5 + 3 + 1 = 12.'), '')
assert 5 + 3 + 3 + 1 == 12
add('8.1', '8.1 Carta palang', 'Carta palang berkelompok dan bertindan',
    BUL(['<b>Berkelompok</b>: palang dua set data diletak bersebelahan untuk dibandingkan.', '<b>Bertindan</b>: palang disusun bertindih; tinggi keseluruhan = jumlah.', 'Contoh: Kelas A, lelaki 12 dan perempuan 16, jumlah 28 murid.'], c),
    svg(bars(['A', 'B', 'C'], [[12, 15, 10], [16, 13, 18]], [TR, PK], 30, 5, 'Kelas', 'Bilangan murid', True, ['Lelaki', 'Perempuan']), 'Carta palang bertindan'))
assert 90 / 360 * 40 == 10
add('8.1', '8.1 Carta pai', 'Carta pai',
    BUL(['Sudut sektor = (kekerapan ÷ jumlah) × 360°.', f'40 murid, 10 suka bola sepak: {FR(10, 40)} × 360° = <b>90°</b>.', 'Bilangan = (sudut ÷ 360°) × jumlah.'], c),
    pie([('Bola sepak', 10, TR), ('Badminton', 15, AM), ('Bola jaring', 9, PK), ('Lain-lain', 6, GR)]))
add('8.1', '8.1 Graf garis dan plot titik', 'Graf garis dan plot titik',
    BUL(['<b>Graf garis</b>: menunjukkan perubahan data mengikut masa (trend).', '<b>Plot titik</b>: setiap titik mewakili satu data pada garis nombor; mudah melihat nilai paling kerap.'], c),
    linegraph(['Jan', 'Feb', 'Mac', 'Apr', 'Mei'], [120, 150, 140, 190, 210], 250, 50, 'Bulan', 'Jualan (RM)'))
add('8.1', '8.1 Plot titik', 'Membaca plot titik',
    P('Bilangan buku yang dibaca oleh 15 murid dalam sebulan:')
    + BUL(['Nilai paling kerap = <b>3</b> buku (5 murid).', 'Murid yang membaca lebih daripada 3 buku = 3 + 1 = <b>4</b> orang.'], c),
    dotplot([1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5, 0], 0, 5, 'Bilangan buku'))
assert [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5, 0].count(3) == 5
add('8.1', '8.1 Plot batang-dan-daun', 'Plot batang-dan-daun',
    TABLE(['Batang', 'Daun'], [['3', '2  5  8'], ['4', '0  1  1  6'], ['5', '3  7'], ['6', '4']], c)
    + BUL(['Kekunci: 3 | 2 bermaksud 32 markah.', 'Data: 32, 35, 38, 40, 41, 41, 46, 53, 57, 64.', 'Markah tertinggi 64, terendah 32, julat = 64 − 32 = <b>32</b>.'], c), '')
assert 64 - 32 == 32
add('8.1', '8.1 Histogram dan graf sebar', 'Histogram dan graf sebar',
    BUL(['<b>Histogram</b>: palang bercantum untuk data selanjar dalam selang kelas (cth. tinggi 140–150 cm).', '<b>Graf sebar</b>: titik bagi dua pemboleh ubah untuk melihat hubungan: positif, negatif atau tiada hubungan.'], c),
    scatter([(1, 30), (2, 42), (3, 48), (4, 60), (5, 66), (6, 80), (7, 85), (8, 96)], 'Jam ulang kaji', 'Markah', 10, 100))
add('8.1', '8.1 Tafsiran beretika', 'Perwakilan data yang beretika',
    BUL(['Paksi mesti bermula pada <b>0</b> dan sela skala sama, supaya perbezaan tidak kelihatan lebih besar.', 'Nyatakan tajuk, label paksi dan sumber data.', 'Pilih perwakilan yang sesuai: carta pai untuk bahagian daripada keseluruhan, graf garis untuk perubahan masa.'], c)
    + NOTE('Contoh PKJR: graf garis bilangan kemalangan jalan raya mengikut bulan membantu melihat bulan yang paling berisiko.', 'Konteks:'), '')
assert 72 / 360 * 500 == 100 and 100 * 3 == 300
add('8.1', 'Contoh 1', 'Masalah harian: carta pai perbelanjaan',
    P('Carta pai menunjukkan perbelanjaan bulanan RM500 seorang murid. Sektor makanan bersudut 144° dan sektor buku 72°. (a) Berapakah belanja makanan? (b) Berapa lebih belanja makanan berbanding buku?')
    + STEPS([f'Makanan = {FR(144, 360)} × RM500 = RM200', f'Buku = {FR(72, 360)} × RM500 = RM100', 'Beza = RM200 − RM100'], c) + ANS('(a) RM200 (b) RM100'),
    pie([('Makanan', 144, AM), ('Buku', 72, TR), ('Pengangkutan', 90, PK), ('Simpanan', 54, GR)]))
assert 144 / 360 * 500 == 200

finish(SUB, OUT, {'8.1': 11})
