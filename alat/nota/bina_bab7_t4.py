"""Bab 7 T4 Graf Gerakan: nota ikut buku teks (ayat buku, nombor dan nama ditukar).
Subtopik folder grafgerakan dikekalkan (7.1 Graf Jarak-Masa, 7.2 Graf Laju-Masa)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "7.1", "name": "Graf Jarak-Masa", "col": "#38BDF8"}, {"no": "7.2", "name": "Graf Laju-Masa", "col": "#FB923C"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr


def i(s):
    return f'<i>{s}</i>'


KJ = 'km j<sup>−1</sup>'
MS = 'm s<sup>−1</sup>'
MS2 = 'm s<sup>−2</sup>'


def SVh(inner, aria, h, y0=0):
    return f'<svg class="sl-svg" viewBox="0 {y0} 500 {h:.0f}" role="img" aria-label="{aria}">{inner}</svg>'


def gm(bx, xr, yr, xs, ys, path, xl, yl, col=TR, lab=(), fill=None, fs=12, dots=True, extra=(), dash=()):
    """graf gerakan: path = senarai titik (x, y) disambung; lab = (x, y, teks, dx, dy); fill = poligon dilorek (luas)."""
    g = GF.Gr(bx, xr, yr, xs, ys, xl=xl, yl=yl, fs=fs if fs > 1 else 13, labels=fs > 1)
    if fill:
        for poly, fc in fill:
            d = ' '.join(f'{g.X(x):.1f},{g.Y(y):.1f}' for x, y in poly)
            g.add(f'<polygon points="{d}" fill="{fc}" fill-opacity="0.3" stroke="none"/>', True)
    for a, b in dash:
        g.seg(a, b, MU3, 2, '6 6')
    for k in range(len(path) - 1):
        g.seg(path[k], path[k + 1], col, 4)
    if dots:
        for x, y in path:
            g.pt(x, y, '', col, r=4.5)
    for x, y, t, dx, dy in lab:
        g.add(GF.T(g.X(x) + dx, g.Y(y) + dy, t, TX, 15))
    for e in extra:
        g.add(e(g))
    return g.svg()


def ps4(a, b, c_, d, s, fs=15):
    return work([('Memahami masalah', a), ('Merancang strategi', b), ('Melaksanakan strategi', c_), ('Kesimpulan', d)], s, 2, fs)


# =====================================================================
# 7.1 GRAF JARAK-MASA
# =====================================================================
s = '7.1'
c = COL[s]
g = gm((70, 40, 450, 360), (0, 5), (0, 5), 1, 1, [(0, 0), (4, 4)], 'Masa', 'Jarak', lab=[(2.6, 2.6, 'kecerunan = laju', -70, -20)], fs=1)
S(s, 'KONSEP', 'Graf jarak-masa',
  p('Laju ialah suatu kadar yang melibatkan jarak dan masa. Kaitan antara laju dengan masa boleh diwakilkan dengan melukis graf jarak-masa. Graf jarak-masa membolehkan gerakan suatu objek digambarkan dalam bentuk grafik yang mudah difahami.')
  + p('Pada suatu graf jarak-masa:')
  + bul(s, ['paksi mencancang mewakili jarak yang dilalui.', 'paksi mengufuk mewakili tempoh masa yang diambil.', 'kecerunan graf mewakili kadar perubahan jarak terhadap masa, iaitu laju.'])
  + formula(f'Laju = {F("Jarak", "Masa")}', c),
  stack(SVh(g, 'Graf jarak-masa', 400, 20), p('Graf jarak-masa boleh dilukis daripada (a) jadual jarak-masa atau (b) persamaan yang mewakili hubungan antara jarak dengan masa.')))

T1 = [0, 20, 40, 60, 80]
D1 = [0, 8, 16, 24, 32]
assert all(d == 0.4 * t for t, d in zip(T1, D1))
g = gm((80, 40, 450, 370), (0, 90), (0, 36), 20, 8, list(zip(T1, D1)), 'Masa (minit)', 'Jarak (km)')
S(s, 'CONTOH 1', 'Melukis graf jarak-masa daripada jadual',
  p('Aiman menjalani latihan berbasikal setiap hari. Jadual di bawah menunjukkan jarak yang dilalui dan masa yang diambil oleh Aiman semasa latihan. Lukis graf jarak-masa berdasarkan jadual.')
  + table(['Masa (minit)'] + [str(t) for t in T1], [['Jarak (km)'] + [str(d) for d in D1]], c, 17)
  + steps(s, ['Pilih skala yang sesuai bagi mewakili jarak dan masa yang diberikan.', 'Plot titik yang mewakili pasangan nilai jarak dan masa pada kertas graf.', 'Sambungkan titik-titik yang diplot dengan menggunakan pembaris.']),
  SVh(g, 'Graf jarak-masa latihan berbasikal', 420, 10))

ga = gm((60, 40, 230, 250), (0, 3.5), (0, 240), 1, 70, [(0, 0), (3, 210)], 'Masa, t (jam)', 'Jarak (km)', fs=11)
gb = gm((310, 40, 480, 250), (0, 35), (0, 7), 10, 2, [(0, 6), (30, 0)], 'Masa, t (minit)', 'Jarak (km)', fs=11)
S(s, 'CONTOH 2', 'Melukis graf jarak-masa daripada persamaan',
  p(f'Encik Rahim memandu selama 3 jam sejauh 210 km. Jarak, {i("s")} km yang dilalui dalam masa {i("t")} jam diwakili oleh persamaan {i("s")} = 70{i("t")}. Lukis graf jarak-masa yang mewakili perjalanan Encik Rahim.')
  + steps(s, [f'Bina jadual jarak-masa dengan menggunakan persamaan {i("s")} = 70{i("t")}.', 'Lukis graf jarak-masa dengan memplot titik berdasarkan jadual yang dibina.'])
  + note('Suatu graf garis lurus boleh dilukis dengan memplot sekurang-kurangnya dua titik yang berkaitan.', 'Tip:'),
  stack(table([f'Masa, {i("t")} (jam)', '0', '1', '2', '3'], [[f'Jarak, {i("s")} (km)', '0', '70', '140', '210']], c, 17),
        SVh(gm((90, 40, 450, 330), (0, 3.5), (0, 240), 1, 70, [(0, 0), (1, 70), (2, 140), (3, 210)], 'Masa, t (jam)', 'Jarak (km)'), 'Graf s = 70t', 380, 0)))

S(s, 'CONTOH 3', 'Graf jarak-masa dengan kecerunan negatif',
  p(f'Ravi menyertai acara merentas desa sejauh 6 km. Hubungan antara jarak dari garis penamat dengan masa larian ialah {i("s")} = 6 − {F(1, 5)}{i("t")}, dengan {i("s")} ialah jarak dalam km dan {i("t")} ialah masa dalam minit. Lukis graf jarak-masa.')
  + work([('Penyelesaian', [f'Apabila {i("t")} = 0, {i("s")} = 6 − {F(1, 5)}(0) = 6', f'Apabila {i("t")} = 30, {i("s")} = 6 − {F(1, 5)}(30) = 0'])], s, 1, 18)
  + note('Dua titik yang memenuhi persamaan adalah mencukupi untuk melukis garis lurus.', 'Tip:'),
  stack(table([f'Masa, {i("t")} (minit)', '0', '30'], [[f'Jarak, {i("s")} (km)', '6', '0']], c, 17),
        SVh(gm((90, 40, 450, 330), (0, 35), (0, 7), 10, 1, [(0, 6), (30, 0)], 'Masa, t (minit)', 'Jarak (km)'), 'Graf s = 6 − t/5', 380, 0)))

r1 = gm((50, 40, 230, 230), (0, 5), (0, 5), 1, 1, [(0, 0), (2, 3), (3, 3), (4.5, 4.5)], 'Masa', 'Jarak', lab=[(2, 3, 'A', -4, -14), (3, 3, 'B', 4, -14), (4.5, 4.5, 'C', 12, 0)], fs=1)
r2 = gm((300, 40, 480, 230), (0, 5), (0, 5), 1, 1, [(0, 0), (1.8, 3.5), (3, 3.5), (4.6, 0)], 'Masa', 'Jarak', lab=[(1.8, 3.5, 'P', -4, -14), (3, 3.5, 'Q', 4, -14), (4.6, 0, 'R', 10, -14)], fs=1)
S(s, 'KONSEP', 'Mentafsir graf jarak-masa',
  table(['Bahagian graf', 'Kecerunan', 'Maksud'], [['OA, BC, OP', 'Positif', 'Bergerak dengan laju seragam; kecerunan mewakili laju.'], ['AB, PQ', 'Sifar', 'Tiada perubahan jarak: gerakan terhenti (pegun).'],
                                                ['QR', 'Negatif', 'Objek bergerak balik ke tempat asal atau pada arah bertentangan.']], c, 16, False)
  + bul(s, ['Rajah 1: gerakan dari O ke C.', 'Rajah 2: gerakan dari O ke R melalui P dan Q (pergi dan balik); jumlah jarak = 2 kali jarak OP.'])
  + note(f'Kecerunan = {F("jarak mencancang", "jarak mengufuk")}. Kecerunan positif dan negatif menunjukkan arah gerakan.', 'Ingat:'),
  SVh(r1 + r2 + GF.T(140, 290, 'Rajah 1', TX, 16) + GF.T(390, 290, 'Rajah 2', TX, 16), 'Dua graf jarak-masa', 310, 20))

assert 180 / 2 == 90 and 180 / 3 == 60
g = GF.Gr((80, 40, 450, 360), (0, 3.5), (0, 200), 1, 20, xl='Masa (jam)', yl='Jarak (km)', fs=12, skipy=(20, 40, 80, 100, 140, 160, 200))
g.seg((0, 0), (2, 180), TR, 4).seg((0, 180), (3, 0), PK, 4).text(1.15, 125, 'Kereta', TR, 16).text(2.3, 80, 'Bas', PK, 16)
S(s, 'CONTOH 4', 'Beza laju dua kenderaan',
  p('Graf jarak-masa di sebelah menunjukkan gerakan sebuah kereta dan sebuah bas persiaran. Kereta bergerak dari Ipoh ke Kuala Lumpur dan bas persiaran bergerak dari Kuala Lumpur ke Ipoh. Tentukan beza laju, dalam km j<sup>−1</sup>, kedua-dua kenderaan tersebut.')
  + work([('Penyelesaian', [f'Laju kereta = {F("beza jarak yang dilalui", "beza masa yang sepadan")} = {F("(180 − 0) km", "(2 − 0) jam")} = 90 {KJ}',
                            f'Laju bas persiaran = {F("(0 − 180) km", "(3 − 0) jam")} = −60 {KJ} = 60 {KJ}', f'Beza laju = (90 − 60) {KJ} = 30 {KJ}'])], s, 1, 18)
  + note('Tanda negatif bermakna arah gerakan bas persiaran bertentangan dengan arah gerakan kereta.', 'Tip:'),
  SVh(g.svg(), 'Graf kereta dan bas', 410, 0))

assert 160 / 2 == 80 and (280 - 160) / 1.5 == 80
g = gm((80, 40, 450, 360), (0, 5), (0, 300), 1, 40, [(0, 0), (2, 160), (3, 160), (4.5, 280)], 'Masa (jam)', 'Jarak (km)', dash=[((0, 160), (2, 160)), ((0, 280), (4.5, 280)), ((4.5, 0), (4.5, 280))], fs=12)
S(s, 'CONTOH 5', 'Mentafsir graf jarak-masa',
  p('Graf jarak-masa di sebelah menunjukkan gerakan sebuah kereta untuk tempoh 4.5 jam. (a) Tentukan (i) tempoh masa kereta berada dalam keadaan pegun, (ii) laju kereta sejam yang pertama. (b) Huraikan gerakan kereta untuk tempoh 90 minit terakhir.')
  + work([('Penyelesaian', ['(a)(i) Tempoh keadaan pegun = (3 − 2) jam = 1 jam', f'(ii) Laju sejam pertama = laju 2 jam pertama = {F("(160 − 0) km", "(2 − 0) jam")} = 80 {KJ}',
                            f'(b) Laju = {F("(280 − 160) km", "(4.5 − 3) jam")} = 80 {KJ}', f'Kereta bergerak sejauh 120 km dengan kelajuan 80 {KJ} bagi tempoh 90 minit terakhir.'])], s, 1, 17)
  + note('Nilai kecerunan pada satu garis lurus adalah sama.', 'Tip:'),
  SVh(g, 'Graf gerakan kereta 4.5 jam', 410, 0))

assert 3 / 12 * 60 == 15 and -3 / 0.5 == -6
g = GF.Gr((80, 40, 450, 340), (0, 80), (0, 4), 10, 1, xl='Waktu', yl='Jarak (km)', fs=12, labels=True, skipx=tuple(range(0, 81, 10)))
pp = [(0, 0), (15, 3), (40, 3), (70, 0)]
for k in range(3):
    g.seg(pp[k], pp[k + 1], TR, 4)
for x, t in [(0, '0800'), (15, '<tspan font-style="italic">t</tspan>'), (40, '0840'), (70, '0910')]:
    g.add(GF.T(g.X(x), g.Y(0) + 18, t, MU, 13))
g.seg((15, 0), (15, 3), MU3, 2, '6 6')
S(s, 'CONTOH 6', 'Perjalanan pergi dan balik',
  p(f'Sofia berbasikal dari rumahnya ke pejabat pos dan balik semula. (a) Tentukan (i) jumlah jarak keseluruhan perjalanan, (ii) nilai {i("t")}, jika Sofia berbasikal dengan kelajuan 12 {KJ} ke pejabat pos. (b) Huraikan perjalanan Sofia dari pejabat pos ke rumahnya.')
  + work([('Penyelesaian', ['(a)(i) Jumlah jarak = 3 km + 3 km = 6 km', f'(ii) Masa = {F("Jarak", "Laju")} = {F("3 km", f"12 {KJ}")} = 0.25 jam = 15 minit; {i("t")} = 0800 + 0015 = 0815',
                            f'(b) Kadar perubahan jarak = {F("(0 − 3) km", F(30, 60) + " jam")} = −6 {KJ}', f'Sofia berbasikal sejauh 3 km dalam tempoh 30 minit dengan kelajuan 6 {KJ}.'])], s, 1, 17),
  SVh(g.svg(), 'Graf perjalanan Sofia', 380, 20))

assert 90 / 1.5 == 60 and 50 * 1 == 50
g = gm((80, 40, 450, 270), (0, 1.75), (0, 100), 0.5, 20, [(0, 0), (1, 50), (1.5, 90)], 'Masa (jam)', 'Jarak (km)', lab=[(0, 0, 'Seremban', 12, 18), (1, 50, 'Rembau', -60, -6), (1.5, 90, 'Tampin', 10, -14)], dash=[((0, 50), (1, 50)), ((0, 90), (1.5, 90))], fs=12)
S(s, 'CONTOH 7', 'Laju purata',
  p('Kelajuan suatu gerakan biasanya berubah-ubah sepanjang perjalanan. Dalam situasi ini, laju purata digunakan.')
  + formula(f'Laju purata = {F("Jumlah jarak yang dilalui", "Jumlah masa yang diambil")}', c)
  + p(f'Graf menunjukkan perjalanan Puan Nora dari Seremban ke Tampin melalui Rembau. (a) Hitung laju purata. (b) Jika kadar perubahan jarak dari Seremban ke Rembau ialah 50 {KJ}, hitung jarak di antara Rembau dengan Tampin.')
  ,
  stack(SVh(g, 'Graf perjalanan Seremban ke Tampin', 320, 0), work([('Penyelesaian', [f'(a) Laju purata = {F("90 km", "1.5 jam")} = 60 {KJ}', f'(b) Jarak Seremban–Rembau = 50 {KJ} × 1 jam = 50 km', 'Jarak Rembau–Tampin = (90 − 50) km = 40 km'])], s, 1, 16)))

d8a = 70 * 1.5
d8b = 265 - d8a
assert d8a == 105 and d8b == 160 and d8b / 80 == 2
g = gm((80, 40, 450, 330), (0, 4.5), (0, 280), 1, 50, [(0, 0), (1.5, 105), (2, 105), (4, 265)], 'Masa (jam)', 'Jarak (km)', lab=[(1.75, 105, 'Tapah', 0, -18), (4, 265, 'Kuala Lumpur', -30, -16)], dash=[((0, 105), (1.5, 105)), ((0, 265), (4, 265))], fs=11)
S(s, 'CONTOH 8', 'Menyelesaikan masalah graf jarak-masa',
  p(f'Graf jarak-masa menunjukkan perjalanan Encik Lee dari Ipoh ke Kuala Lumpur. Encik Lee berhenti di Tapah untuk makan tengah hari sebelum meneruskan perjalanan. (a) Jika laju purata dari Ipoh ke Tapah ialah 70 {KJ} selama 1.5 jam, hitung jarak di antara Ipoh dengan Tapah. (b) Diberi jarak Ipoh ke Kuala Lumpur ialah 265 km dan Encik Lee memandu dengan laju purata 80 {KJ} dari Tapah, lengkapkan graf jarak-masa.'),
  SVh(g, 'Graf jarak-masa Ipoh ke Kuala Lumpur', 370, 0))

S(s, 'CONTOH 8 (sambungan)', 'Penyelesaian Contoh 8',
  ps4(['(a) Menghitung jarak Ipoh ke Tapah.', '(b) Melengkapkan graf dari Tapah ke Kuala Lumpur.'], [f'(a) Jarak = laju × masa', f'(b) Tentukan jarak Tapah ke Kuala Lumpur; masa = {F("jarak", "laju")}'],
      [f'(a) Jarak = 70 {KJ} × 1.5 jam = 105 km', '(b) Jarak = 265 km − 105 km = 160 km', f'Masa = {F("160 km", f"80 {KJ}")} = 2 jam (dari jam ke-2 hingga ke-4)'],
      ['(a) Jarak Ipoh ke Tapah ialah 105 km.', '(b) Jarak Tapah ke Kuala Lumpur ialah 160 km dan masa yang diambil ialah 2 jam.'], s, 15),
  SVh(g, 'Graf jarak-masa Ipoh ke Kuala Lumpur', 370, 0))

kOA = 60 / 48
t9 = 73 + (150 - 60) / kOA
m9 = 150 / 80 * 60
assert t9 == 145 and m9 == 112.5 and t9 - m9 == 32.5
g = gm((80, 40, 450, 330), (0, 160), (0, 170), 20, 30, [(0, 0), (48, 60), (73, 60), (145, 150)], 'Masa (minit)', 'Jarak (km)', lab=[(48, 60, 'A', -8, -16), (73, 60, 'B', 8, 16), (145, 150, 'C', 12, -10), (0, 150, 'P', -14, -12), (112.5, 0, 'Q', 0, -14), (145, 0, 't', 0, 18)],
       dash=[((0, 150), (145, 150)), ((145, 0), (145, 150))], fs=11, extra=[lambda g: GF.L(g.P(0, 150), g.P(112.5, 0), PK, 4)])
S(s, 'CONTOH 9', 'Perjalanan dua buah kereta',
  p(f'Graf jarak-masa menunjukkan perjalanan dua buah kereta di antara Kuala Lipis dengan Cameron Highlands yang berjarak 150 km. Graf PQ mewakili perjalanan Encik Azlan dari Cameron Highlands ke Kuala Lipis. Graf OABC mewakili perjalanan keluarga Encik Ravi dari Kuala Lipis ke Cameron Highlands. (a) Diberi kadar perubahan jarak bagi OA dan BC adalah sama, hitung nilai {i("t")}. (b) Laju purata Encik Azlan ialah 80 {KJ}. Hitung beza masa, dalam minit, kedua-dua perjalanan untuk sampai di destinasi masing-masing.'),
  SVh(g, 'Graf perjalanan dua kereta', 370, 0))

S(s, 'CONTOH 9 (sambungan)', 'Penyelesaian Contoh 9',
  ps4([f'(a) Hitung {i("t")}, iaitu masa dalam minit.', '(b) Beza masa perjalanan kedua-dua kereta.'], ['(a) Kecerunan OA = kecerunan BC', f'(b) Masa Encik Ravi = {i("t")}; masa Encik Azlan = {F("jarak", "laju")}'],
      [f'(a) {F("60 − 0", "48 − 0")} = {F("150 − 60", f"{i(chr(116))} − 73")} → {i("t")} − 73 = 72 → {i("t")} = 145', f'(b) Masa Encik Azlan = {F("150 km", f"80 {KJ}")} = 1.875 jam × 60 = 112.5 minit', 'Beza masa = 145 − 112.5 = 32.5 minit'],
      [f'(a) {i("t")} = 145', '(b) Beza masa ialah 32.5 minit.'], s, 15),
  SVh(g, 'Graf perjalanan dua kereta', 370, 0))

# =====================================================================
# 7.2 GRAF LAJU-MASA
# =====================================================================
s = '7.2'
c = COL[s]
g = gm((70, 40, 450, 360), (0, 5), (0, 5), 1, 1, [(0, 0), (1.5, 3), (3.5, 3), (4.5, 0)], 'Masa', 'Laju', lab=[(0.75, 1.5, 'pecutan', -70, 0), (2.5, 3, 'laju seragam', 0, -16), (4, 1.5, 'nyahpecutan', 62, 0)], fs=1)
S(s, 'KONSEP', 'Graf laju-masa',
  p('Jarum pada meter laju kenderaan menunjukkan nilai 0 apabila kenderaan berada dalam keadaan pegun. Nilai yang bertambah bermaksud kelajuan kenderaan semakin bertambah. Kadar perubahan laju suatu gerakan boleh digambarkan dengan melukis graf laju-masa.')
  + p('Pada suatu graf laju-masa:')
  + bul(s, ['paksi mencancang mewakili laju suatu gerakan.', 'paksi mengufuk mewakili tempoh masa yang diambil.', 'kecerunan graf mewakili kadar perubahan laju terhadap masa, iaitu pecutan.'])
  + formula(f'Pecutan = {F("Perubahan laju", "Masa")}', c),
  SVh(g, 'Graf laju-masa', 410, 0))

T9 = [0, 1, 2, 3, 4, 5]
V9 = [10, 14, 18, 22, 26, 30]
ga = gm((60, 40, 230, 250), (0, 5.5), (0, 32), 1, 8, list(zip(T9, V9)), 'Masa (s)', f'Laju (m s⁻¹)', fs=11)
gb = gm((310, 40, 480, 250), (0, 0.55), (0, 700), 0.1, 100, [(0, 600), (0.5, 0)], 'Masa, t (jam)', 'Laju (km j⁻¹)', fs=10)
assert 600 - 1200 * 0.5 == 0
S(s, 'CONTOH 10 – 11', 'Melukis graf laju-masa',
  p('<b>CONTOH 10</b> Jadual menunjukkan perubahan laju kereta Encik Hakim untuk tempoh 5 saat. Lukis graf laju-masa.')
  + table(['Masa (s)'] + [str(t) for t in T9], [[f'Laju ({MS})'] + [str(v) for v in V9]], c, 16)
  + p(f'<b>CONTOH 11</b> Laju sebuah kapal terbang yang sedang mendarat diberi oleh {i("v")} = 600 − 1 200{i("t")}, dengan {i("v")} dalam {KJ} dan {i("t")} dalam jam. Lukis graf laju-masa untuk 0 ≤ {i("t")} ≤ 0.5.')
  + work([('Penyelesaian', [f'{i("t")} = 0: {i("v")} = 600', f'{i("t")} = 0.5: {i("v")} = 600 − 1 200(0.5) = 0'])], s, 2, 18),
  SVh(ga + gb + GF.T(145, 318, 'Contoh 10', TX, 16) + GF.T(395, 318, 'Contoh 11', TX, 16), 'Graf contoh 10 dan contoh 11', 335, 0))

assert 20 * 10 == 200 and (10 + 25) / 2 * 6 == 105
ga = gm((60, 40, 230, 250), (0, 12), (0, 25), 2, 5, [(0, 20), (10, 20)], 'Masa (s)', 'Laju (m s⁻¹)', fill=[([(0, 0), (10, 0), (10, 20), (0, 20)], PA)], fs=10, dash=[((10, 0), (10, 20))])
gb = gm((310, 40, 480, 250), (0, 7), (0, 30), 1, 5, [(0, 10), (6, 25)], 'Masa (s)', 'Laju (m s⁻¹)', fill=[([(0, 0), (6, 0), (6, 25), (0, 10)], PA)], fs=10, dash=[((6, 0), (6, 25))])
S(s, 'CONTOH 12', 'Luas di bawah graf laju-masa',
  p('Daripada kecerunan graf jarak-masa, kita boleh menentukan laju. Jarak suatu gerakan pula boleh ditentukan daripada graf laju-masa.')
  + formula('Luas di bawah graf = Jarak yang dilalui', c)
  + p('Nilai luas di bawah graf laju-masa adalah sama dengan jumlah jarak yang dilalui bagi tempoh masa yang sama.')
  + work([('CONTOH 12', ['Hitung jarak yang dilalui bagi setiap gerakan.', f'(a) Jarak = luas segi empat tepat = 10 × 20 = 200 m', f'(b) Jarak = luas trapezium = {F(1, 2)} × (10 + 25) × 6 = 105 m'])], s, 1, 18),
  SVh(ga + gb + GF.T(145, 318, '(a)', TX, 17) + GF.T(395, 318, '(b)', TX, 17), 'Luas di bawah graf laju-masa', 335, 0))

d1, d2, d3 = 0.5 * 6 / 60 * 72, 18 / 60 * 72, 0.5 * 12 / 60 * 72
assert round(d1 + d2 + d3, 6) == 32.4 and round(32.4 / 0.6, 6) == 54
g = gm((80, 40, 450, 360), (0, 40), (0, 80), 6, 8, [(0, 0), (6, 72), (24, 72), (36, 0)], 'Masa (minit)', 'Laju (km j⁻¹)', fill=[([(0, 0), (6, 72), (24, 72), (36, 0)], PA)], fs=11, dash=[((0, 72), (6, 72))], extra=[lambda g: ''])
S(s, 'CONTOH 13', 'Jarak dan laju purata daripada graf laju-masa',
  p('Graf laju-masa di sebelah menunjukkan kelajuan kereta Puan Lim dalam tempoh 36 minit. Hitung (a) jumlah jarak, dalam km, (b) laju purata, dalam km j<sup>−1</sup>.')
  + work([('Penyelesaian', [f'(a) Jumlah jarak = {F(1, 2)} × {F(6, 60)} × 72 + {F(18, 60)} × 72 + {F(1, 2)} × {F(12, 60)} × 72', '= 3.6 + 21.6 + 7.2 = 32.4 km',
                            f'(b) Laju purata = {F("32.4 km", F(36, 60) + " jam")} = 54 {KJ}'])], s, 1, 18)
  + note('Tukar masa dalam minit kepada jam kerana laju dalam km j<sup>−1</sup>.', 'Tip:'),
  SVh(g, 'Graf laju-masa kereta 36 minit', 410, 0))

g = gm((70, 40, 450, 360), (0, 5), (0, 5), 1, 1, [(0, 1), (1.5, 3.5), (3.5, 3.5), (4.6, 0)], 'Masa (saat)', 'Laju', lab=[(0, 1, 'P', -14, 0), (1.5, 3.5, 'Q', 0, -16), (3.5, 3.5, 'R', 0, -16), (4.6, 0, 'S', 10, -14), (0.75, 1, 'A', 0, 0), (2.5, 1.7, 'B', 0, 0), (3.85, 1, 'C', 0, 0)],
       fill=[([(0, 0), (1.5, 0), (1.5, 3.5), (0, 1)], PA), ([(1.5, 0), (3.5, 0), (3.5, 3.5), (1.5, 3.5)], GR), ([(3.5, 0), (4.6, 0), (3.5, 3.5)], PK)], fs=1)
S(s, 'KONSEP', 'Mentafsir graf laju-masa',
  table(['Bahagian', 'Gerakan', 'Kecerunan'], [['PQ', 'Kelajuan bertambah. Luas trapezium A mewakili jarak yang dilalui.', 'Positif (pecutan)'], ['QR', 'Laju seragam. Luas segi empat tepat B mewakili jarak yang dilalui.', 'Sifar'],
                                               ['RS', 'Kelajuan berkurang. Luas segi tiga C mewakili jarak yang dilalui.', 'Negatif (nyahpecutan)']], c, 16, False)
  + note('Kadar perubahan laju yang negatif dipanggil nyahpecutan. Contoh: pecutan −5 m s<sup>−2</sup> = nyahpecutan 5 m s<sup>−2</sup>.', 'Ingat:'),
  SVh(g, 'Tafsiran graf laju-masa', 410, 0))

assert (30 - 10) / 4 == 5 and 0.5 * 4 * 40 + 6 * 30 + 0.5 * 4 * 80 == 420
g = gm((80, 40, 450, 330), (0, 15), (0, 55), 2, 10, [(0, 10), (4, 30), (10, 30), (14, 50)], 'Masa (s)', 'Laju (m s⁻¹)', dash=[((0, 30), (4, 30)), ((0, 50), (14, 50)), ((4, 0), (4, 30)), ((10, 0), (10, 30))], fs=11)
S(s, 'CONTOH 14', 'Mentafsir graf laju-masa',
  p('Graf laju-masa menunjukkan gerakan kereta Puan Salmah dalam tempoh 14 saat. (a) Hitung kadar perubahan laju, dalam m s<sup>−2</sup>, bagi 4 saat yang pertama. (b) Huraikan gerakan kereta dari saat ke-4 hingga saat ke-10. (c) Hitung jumlah jarak, dalam meter, yang dilalui dalam tempoh 14 saat.')
  + work([('Penyelesaian', [f'(a) Kadar perubahan laju = {F("(30 − 10) m s<sup>−1</sup>", "(4 − 0) s")} = 5 {MS2}', f'(b) Kereta bergerak dengan laju seragam 30 {MS} untuk tempoh 6 saat.',
                            f'(c) Jumlah jarak = luas di bawah graf = {F(1, 2)} × 4 × (10 + 30) + (10 − 4) × 30 + {F(1, 2)} × 4 × (30 + 50)', '= 80 + 180 + 160 = 420 m'])], s, 1, 17),
  SVh(g, 'Graf laju-masa kereta Puan Salmah', 370, 0))

assert 20 / 8 == 2.5 and (0 - 20) / 4 == -5 and 0.5 * 4 * 20 == 40
g = gm((80, 40, 450, 360), (0, 24), (0, 24), 2, 4, [(0, 0), (8, 20), (18, 20), (22, 0)], 'Masa (s)', 'Laju (m s⁻¹)', dash=[((0, 20), (8, 20))], fs=11)
S(s, 'CONTOH 15', 'Pecutan dan nyahpecutan',
  p('Graf laju-masa di sebelah menunjukkan gerakan kereta Encik Daniel. (a) Hitung kadar perubahan laju untuk 8 saat yang pertama. (b) Huraikan gerakan kereta dari saat ke-8 hingga saat ke-18. (c) Hitung kadar perubahan laju bagi 4 saat terakhir. (d) Hitung jarak yang dilalui semasa nyahpecutan.')
  + work([('Penyelesaian', [f'(a) {F("(20 − 0) m s<sup>−1</sup>", "(8 − 0) s")} = 2.5 {MS2}; kereta mengalami pecutan 2.5 {MS2}.', f'(b) Kereta bergerak dengan laju seragam 20 {MS}.',
                            f'(c) {F("(0 − 20) m s<sup>−1</sup>", "(22 − 18) s")} = −5 {MS2}, iaitu nyahpecutan 5 {MS2}', f'(d) Jarak = {F(1, 2)} × 4 × 20 = 40 m'])], s, 1, 17),
  SVh(g, 'Graf laju-masa kereta Encik Daniel', 410, 0))

assert 0.5 * (5 + 10) * 4 == 30 and 30 == 0.5 * (10 - 4) * 10 and 10 + 3.5 * 2 == 17
g = gm((80, 40, 450, 360), (0, 13), (0, 20), 2, 2, [(0, 5), (4, 10), (10, 10), (12, 17)], 'Masa (s)', 'Laju (m s⁻¹)', lab=[(10, 10, 't', 0, 32), (12, 17, 'v', 14, 0)], dash=[((0, 10), (4, 10)), ((10, 0), (10, 10)), ((0, 17), (12, 17))], fs=11)
S(s, 'CONTOH 16', 'Menyelesaikan masalah graf laju-masa',
  p(f'Graf laju-masa menunjukkan gerakan sebuah kereta untuk tempoh 12 saat. Hitung (a) laju purata untuk 6 saat pertama, (b) nilai {i("t")}, jika jarak 4 saat pertama ialah separuh daripada jarak semasa laju seragam, (c) nilai {i("v")}, jika pecutan bagi 2 saat terakhir ialah 3.5 {MS2}.'),
  SVh(g, 'Graf laju-masa kereta 12 saat', 410, 0))

S(s, 'CONTOH 16 (sambungan)', 'Penyelesaian Contoh 16',
  ps4(['(a) Laju purata untuk 6 saat pertama.', f'(b) Nilai {i("t")}, masa laju seragam berakhir.', f'(c) Nilai {i("v")}, laju akhir.'], [f'(a) Laju purata = {F("jumlah jarak", "jumlah masa")}', f'(b) Jarak 4 s pertama = {F(1, 2)} × jarak laju seragam', f'(c) Pecutan = {F("perubahan laju", "perubahan masa")}'],
      [f'(a) Jarak 6 s pertama = {F(1, 2)}(5 + 10)(4) + (6 − 4)(10) = 50 m; laju purata = {F(50, 6)} = 8{F(1, 3)} {MS}',
                            f'(b) {F(1, 2)}(5 + 10)(4) = {F(1, 2)} × ({i("t")} − 4) × 10 → 30 = 5({i("t")} − 4) → {i("t")} = 10',
                            f'(c) {F(f"{i("v")} − 10", "12 − 10")} = 3.5 → {i("v")} = 17'], [f'(a) {F(25, 3)} {MS}', f'(b) {i("t")} = 10', f'(c) {i("v")} = 17'], s, 14),
  SVh(g, 'Graf laju-masa kereta 12 saat', 410, 0))

v17 = (130 + 170) / 10
assert v17 == 30 and 0.5 * 6 * 20 + 14 * 20 - 0.5 * 14 * 30 == 130
g = gm((80, 40, 450, 330), (0, 22), (0, 35), 2, 5, [(0, 0), (6, 20), (20, 20)], 'Masa (s)', 'Laju (m s⁻¹)', lab=[(6, 20, 'A', 0, -16), (20, 20, 'B', 10, -14), (6, 0, 'C', 0, 18), (20, 30, 'D', 10, -12), (0, 30, 'v', -18, 0), (0, 20, 'v − 10', -34, 0)],
       dash=[((0, 30), (20, 30)), ((20, 0), (20, 30))], fs=11, extra=[lambda g: GF.L(g.P(6, 0), g.P(20, 30), PK, 4)])
S(s, 'CONTOH 17', 'Gerakan dua buah kenderaan',
  p(f'Graf laju-masa menunjukkan gerakan dua buah kenderaan. Graf OAB mewakili gerakan kereta Encik Zaki dan graf CD mewakili gerakan teksi Encik Wong. Diberi beza jarak antara kereta dengan teksi bagi tempoh 20 saat ialah 130 m. Hitung nilai {i("v")}.'),
  SVh(g, 'Graf laju-masa dua kenderaan', 370, 0))

S(s, 'CONTOH 17 (sambungan)', 'Penyelesaian Contoh 17',
  ps4([f'Nilai {i("v")}, iaitu laju akhir teksi untuk tempoh 14 saat.'], ['Jarak kereta − jarak teksi = 130 m'],
      [f'[{F(1, 2)} × 6 × ({i("v")} − 10) + 14({i("v")} − 10)] − {F(1, 2)} × 14 × {i("v")} = 130', f'17{i("v")} − 170 − 7{i("v")} = 130 → 10{i("v")} = 300 → {i("v")} = 30', 'Semak: kereta 340 m, teksi 210 m, beza 130 m'],
      [f'Nilai {i("v")} = 30'], s, 15),
  SVh(g, 'Graf laju-masa dua kenderaan', 370, 0))

t18 = 12 + 30 / 5
assert (30 - 10) / 4 == 5 and t18 == 18 and 0.5 * 4 * 40 + 8 * 30 == 320
g = gm((80, 40, 450, 330), (0, 20), (0, 35), 2, 5, [(0, 10), (4, 30), (12, 30), (18, 0)], 'Masa (s)', 'Laju (m s⁻¹)', lab=[(18, 0, 't', 0, 18)], dash=[((0, 30), (4, 30)), ((4, 0), (4, 30)), ((12, 0), (12, 30))], fs=11)
S(s, 'CONTOH 18', 'Pecutan dan jarak sebuah van',
  p(f'Graf laju-masa menunjukkan gerakan sebuah van dalam tempoh {i("t")} saat. Hitung (a) kadar perubahan laju, dalam m s<sup>−2</sup>, untuk 4 saat yang pertama, (b) jarak yang dilalui, dalam meter, untuk 12 saat yang pertama, (c) nilai {i("t")} jika magnitud kadar perubahan laju selepas saat ke-12 sama dengan magnitud kadar perubahan laju pada 4 saat yang pertama.')
  + work([('Penyelesaian', [f'(a) {F("(30 − 10) m s<sup>−1</sup>", "(4 − 0) s")} = 5 {MS2}', f'(b) Jarak = {F(1, 2)} × 4 × (10 + 30) + (12 − 4) × 30 = 80 + 240 = 320 m',
                            f'(c) {F("0 − 30", f"{i(chr(116))} − 12")} = −5 → {i("t")} − 12 = 6 → {i("t")} = 18'])], s, 1, 17),
  SVh(g, 'Graf laju-masa van', 370, 0))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'grafgerakan', 'slides.js')
HEAD = '/* Nota Bab 7 ikut buku teks Matematik T4 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
