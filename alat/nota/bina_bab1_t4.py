"""Bab 1 T4 Fungsi dan Persamaan Kuadratik dalam Satu Pemboleh Ubah: nota ikut buku teks (ayat buku, nombor ditukar).
Subtopik folder kuadratik dikekalkan (1.1.1, 1.1.3, 1.1.4, 1.1.6; digabung kepada 1.1 dalam bab.js).
Pemetaan ke standard pembelajaran buku: 1.1.1 → SP 1.1.1–1.1.2, 1.1.3 → SP 1.1.3, 1.1.4 → SP 1.1.4–1.1.5,
1.1.6 → SP 1.1.6–1.1.8."""
import os, sys
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX, mn, Gr

SUBS = [{"no": "1.1.1", "name": "Ungkapan dan Fungsi Kuadratik", "col": "#38BDF8"}, {"no": "1.1.3", "name": "Kesan Perubahan a, b dan c", "col": "#A78BFA"},
        {"no": "1.1.4", "name": "Persamaan Kuadratik dan Punca", "col": "#34D399"}, {"no": "1.1.6", "name": "Pemfaktoran, Lakaran Graf dan Penyelesaian Masalah", "col": "#FB923C"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr
x_ = '<i>x</i>'
fx = '<i>f</i>(<i>x</i>)'


def i(s):
    return f'<i>{s}</i>'


def x2(k=''):
    return f'{k}<i>x</i>²'


def SVc(inner, aria, vb):
    return f'<svg class="sl-svg" viewBox="{vb}" role="img" aria-label="{aria}">{inner}</svg>'


def four(sub, a, b, c, d):
    return steps(sub, [f'<b>Memahami masalah:</b> {a}', f'<b>Merancang strategi:</b> {b}', f'<b>Melaksanakan strategi:</b> {c}', f'<b>Membuat kesimpulan:</b> {d}'])


def quad(a, b, c):
    return lambda v: a * v * v + b * v + c


def mini(g_box, fn, xr, yr, col, lab='', axis=None):
    """graf kecil tanpa label nombor."""
    g = Gr(g_box, xr, yr, 1, 1, labels=False, origin='O', fs=11)
    g.curve(fn, xr[0], xr[1], col, 3.2, 200)
    if axis is not None:
        g.seg((axis, yr[0]), (axis, yr[1]), AM, 2, '6 5')
    if lab:
        g.add(GF.T((g_box[0] + g_box[2]) / 2, g_box[3] + 26, lab, col, 15))
    return g.svg()


# =====================================================================
# 1.1.1 UNGKAPAN DAN FUNGSI KUADRATIK (SP 1.1.1, 1.1.2)
# =====================================================================
s = '1.1.1'
c = COL[s]
big = (f'<div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:16px;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:28px">'
       f'<div style="font-size:52px;font-weight:800"><span style="color:{PK}">{i("a")}</span>{x_}² + <span style="color:{AM}">{i("b")}</span>{x_} + <span style="color:{GR}">{i("c")}</span></div>'
       f'<div style="display:flex;gap:26px;font-size:19px"><span><b style="color:{PK}">{i("a")}</b> : pekali {x_}²</span><span><b style="color:{AM}">{i("b")}</b> : pekali {x_}</span><span><b style="color:{GR}">{i("c")}</b> : pemalar</span></div>'
       f'<div style="font-size:19px;color:{MU3}">{i("a")}, {i("b")} dan {i("c")} ialah pemalar, {i("a")} ≠ 0</div>'
       f'<div style="font-size:19px">{x2()} + 3{x_} − 2, &nbsp; −{i("y")}² + 5{i("y")}, &nbsp; {F(1, 4)}{i("m")}² − {i("m")} + 6, &nbsp; 3{i("n")}² + 1</div></div>')
S(s, 'DEFINISI', 'Ungkapan kuadratik dalam satu pemboleh ubah',
  p('Pernahkah anda melakar gerakan sebiji bola yang ditendang oleh seorang pemain? Bentuk gerakan ini dikenali sebagai bentuk parabola.')
  + de(s, 'Ungkapan kuadratik dalam satu pemboleh ubah ialah ungkapan yang kuasa tertinggi pemboleh ubahnya ialah dua.')
  + p(f'Secara generalisasi, bentuk am suatu ungkapan kuadratik ialah {i("a")}{x2()} + {i("b")}{x_} + {i("c")}, dengan keadaan {i("a")}, {i("b")} dan {i("c")} ialah pemalar dan {i("a")} ≠ 0, {x_} ialah pemboleh ubah.')
,
  stack(big, note(f'Selain {x_}, huruf lain juga boleh digunakan sebagai pemboleh ubah. Nilai pemalar {i("b")} dan {i("c")} boleh sifar.', 'Tip:')))

S(s, 'CONTOH 1', 'Mengenal pasti ungkapan kuadratik',
  p('Tentukan sama ada setiap ungkapan berikut merupakan ungkapan kuadratik dalam satu pemboleh ubah atau bukan. Jika bukan, berikan justifikasi anda.')
  + bul(s, [f'(a) 3{x2()} − 4 &nbsp;&nbsp; (b) {x_}³ + 2 &nbsp;&nbsp; (c) 2{x2()} + 5{i("y")} − 1',
            f'(d) {F(1, 3)}{i("p")}² &nbsp;&nbsp; (e) 4{x2()} − {F(5, x2())} &nbsp;&nbsp; (f) 3{x2()} − {pw(x_, F(1, 2))}'])
  + note(f'{F(5, x2())} = 5{pw(x_, "−2")} &nbsp;&nbsp; {pw(x_, F(1, 2))} = {sq(x_)}', 'Imbas kembali:'),
  work([('', [f'(a) 3{x2()} − 4 ialah ungkapan kuadratik dalam satu pemboleh ubah.',
              f'(b) {x_}³ + 2 bukan ungkapan kuadratik kerana kuasa tertinggi pemboleh ubah ialah tiga.',
              f'(c) 2{x2()} + 5{i("y")} − 1 bukan ungkapan kuadratik dalam satu pemboleh ubah kerana terdapat dua pemboleh ubah iaitu {x_} dan {i("y")}.',
              f'(d) {F(1, 3)}{i("p")}² ialah ungkapan kuadratik dalam satu pemboleh ubah.',
              f'(e) 4{x2()} − {F(5, x2())} bukan ungkapan kuadratik kerana terdapat kuasa yang bukan nombor bulat.',
              f'(f) 3{x2()} − {pw(x_, F(1, 2))} bukan ungkapan kuadratik kerana terdapat kuasa yang bukan nombor bulat.'])], s, 1, 17))

S(s, 'KONSEP', 'Nilai a, b dan c',
  p(f'Semua ungkapan kuadratik boleh ditulis dalam bentuk {i("a")}{x2()} + {i("b")}{x_} + {i("c")} dengan keadaan {i("a")} ≠ 0. Dalam ungkapan kuadratik,')
  + bul(s, [f'{i("a")} ialah pekali {x2()},', f'{i("b")} ialah pekali {x_},', f'{i("c")} ialah pemalar.'])
  + note(f'Bandingkan setiap sebutan dengan {i("a")}{x2()} + {i("b")}{x_} + {i("c")}. Jika sebutan tiada, nilainya ialah sifar.', 'Tip:'),
  table(['Ungkapan kuadratik', i('a'), i('b'), i('c')],
        [[f'3{x2()} − 2{x_} + 5', '3', '−2', '5'], [f'4{x2()} − 7', '4', '0', '−7'], [f'{F(1, 2)}{x2()} + 3{x_} − {F(5, 2)}', F(1, 2), '3', f'−{F(5, 2)}'],
         [f'−{x2()} + 2{x_}', '−1', '2', '0'], [f'−2{x2()} − {x_} − 6', '−2', '−1', '−6'], [f'{F(1, 4)}{x2()}', F(1, 4), '0', '0']], c, 19, rvrows=(1, 2, 3, 4, 5)))

g = Gr((60, 40, 455, 420), (-2, 4), (-2, 8), 1, 1, fs=12)
g.curve(quad(1, -2, 0), -2, 4, PK, 3.5)
g.seg((-2, 3), (4, 3), AM, 2.5, '7 6')
g.pt(-1, 3, '(−1, 3)', AM, -10, -16, 'end', reveal=True)
g.pt(3, 3, '(3, 3)', AM, 10, -16, reveal=True)
g.text(3.9, 7.4, f'{fx} = {x2()} − 2{x_}', PK, 16, 'end')
S(s, 'KONSEP', 'Fungsi kuadratik: hubungan banyak kepada satu',
  p(f'Fungsi kuadratik ditulis dalam bentuk {fx} = {i("a")}{x2()} + {i("b")}{x_} + {i("c")}. Bagi fungsi kuadratik, {i("y")} = {fx}.')
  + p(f'Garis {fx} = 3 yang selari dengan paksi-{x_} bersilang dengan graf pada dua titik, (−1, 3) dan (3, 3).')
  + de(s, 'Semua fungsi kuadratik mempunyai imej yang sama daripada dua objek yang berbeza. Sebagai kesimpulannya, jenis hubungan suatu fungsi kuadratik ialah hubungan banyak kepada satu.')
,
  stack(SVc(g.svg(), 'Graf f(x) = x² − 2x bersilang dengan garis f(x) = 3 pada dua titik', '0 25 500 420'), note(f'Bagi titik pada satah Cartes, koordinat-{x_} ialah objek dan koordinat-{i("y")} ialah imej.', 'Imbas kembali:')))

body = (p('Bentuk graf melengkung bagi fungsi kuadratik digelar sebagai <b>parabola</b>. Hanya terdapat dua bentuk graf dan nilai ' + i('a') + ' menentukan bentuk graf.')
        + p(f'Setiap lakaran graf fungsi kuadratik mempunyai nilai koordinat-{i("y")} yang tertinggi atau terendah berdasarkan bentuk lakaran.')
        + bul(s, [f'Bagi {i("a")} < 0, titik dengan nilai tertinggi bagi koordinat-{i("y")} dikenali sebagai <b>titik maksimum</b>.',
                  f'Bagi {i("a")} > 0, titik dengan nilai terendah bagi koordinat-{i("y")} dikenali sebagai <b>titik minimum</b>.'])
)
o = ''
for k, (bx, fn, yr, lab, tp, col) in enumerate([((40, 70, 230, 330), quad(1, -4, 1), (-4, 6), f'{i("a")} > 0', (2, -3, 'Titik minimum (2, −3)'), GR),
                                                 ((280, 70, 470, 330), quad(-1, 2, 3), (-2, 6), f'{i("a")} < 0', (1, 4, 'Titik maksimum (1, 4)'), PA)]):
    g = Gr(bx, (-1, 5) if k == 0 else (-2, 4), yr, 1, 1, labels=False, fs=11)
    g.curve(fn, g.x0, g.x1, col, 3.5)
    g.pt(tp[0], tp[1], '', AM)
    o += g.svg() + GF.T((bx[0] + bx[2]) / 2, 30, lab, col, 20) + GF.T((bx[0] + bx[2]) / 2, 370, tp[2], AM, 15)
o += GF.T(135, 410, f'{fx} = {x2()} − 4{x_} + 1', GR, 15) + GF.T(375, 410, f'{fx} = −{x2()} + 2{x_} + 3', PA, 15)
S(s, 'KONSEP', 'Bentuk graf, titik maksimum dan titik minimum', body,
  stack(SVc(o, 'Dua bentuk graf fungsi kuadratik dengan titik minimum dan titik maksimum', '0 10 500 410'), note('Titik maksimum dan titik minimum juga dikenali sebagai titik pegun atau titik pusingan.', 'Info:')))

g = Gr((60, 40, 455, 420), (-1, 5), (-4, 6), 1, 1, fs=12)
g.curve(quad(1, -4, 1), -1, 5, PK, 3.5)
g.seg((2, -4), (2, 6), AM, 2.5, '8 6', reveal=True)
g.pt(2, -3, '(2, −3)', AM, 12, 6, reveal=True)
g.pt(0, 1, '', PK).pt(4, 1, '', PK)
g.text(2.15, 5.4, f'{x_} = 2', AM, 17, 'start', reveal=True)
g.text(4.9, 4.4, f'{fx} = {x2()} − 4{x_} + 1', PK, 15, 'end')
S(s, 'KONSEP', 'Paksi simetri graf fungsi kuadratik',
  de(s, f'Paksi simetri suatu graf fungsi kuadratik ialah garis lurus yang selari dengan paksi-{i("y")} dan membahagikan graf tersebut kepada dua bahagian yang sama saiz dan bentuk.')
  + p('Setiap fungsi kuadratik mempunyai satu paksi simetri dan paksi simetri akan melalui titik maksimum atau titik minimum bagi fungsi kuadratik tersebut.')
  + p(f'Bagi graf di sebelah, titik minimum ialah (2, −3). Maka, persamaan paksi simetri ialah {x_} = 2.')
  + note(f'Persamaan garis lurus yang selari dengan paksi-{i("y")} ialah {x_} = {i("h")}.', 'Imbas kembali:')
  + note(f'Persamaan paksi simetri graf fungsi kuadratik ialah {x_} = −{F(i("b"), "2" + i("a"))}.', 'Celik minda:'),
  SV(g.svg(), 'Graf f(x) = x² − 4x + 1 dengan paksi simetri x = 2 melalui titik minimum (2, −3)'))

# =====================================================================
# 1.1.3 KESAN PERUBAHAN a, b DAN c (SP 1.1.3)
# =====================================================================
s = '1.1.3'
c = COL[s]
g = Gr((60, 40, 455, 420), (-3, 3), (-6, 6), 1, 1, fs=12)
for a, col, lab, pos in [(0.5, GR, f'½{x2()}', (2.9, 4.4)), (1, TR, x2(), (2.25, 5.5)), (3, PK, f'3{x2()}', (-1.5, 5.6))]:
    g.curve(quad(a, 0, 0), -3, 3, col, 3.2)
    g.curve(quad(-a, 0, 0), -3, 3, col, 3.2, reveal=True)
    g.text(pos[0], pos[1], f'{i("y")} = {lab}', col, 14, 'end' if a == 3 else 'middle')
g.text(0, -5.4, f'{i("y")} = −½{x2()}, −{x2()}, −3{x2()}', MU3, 15, reveal=True)
S(s, 'KONSEP', 'Kesan perubahan nilai a',
  p(f'Apakah kesan perubahan nilai {i("a")} terhadap graf fungsi kuadratik {fx} = {i("a")}{x2()} + {i("b")}{x_} + {i("c")}?')
  + de(s, f'Nilai {i("a")} menentukan bentuk graf. Bagi graf fungsi kuadratik {fx} = {i("a")}{x2()} + {i("b")}{x_} + {i("c")}, semakin kecil nilai {i("a")}, semakin lebar lengkok graf fungsi kuadratik dan sebaliknya.')
  + bul(s, [f'{i("a")} > 0: graf berbentuk ∪ dan mempunyai titik minimum.', f'{i("a")} < 0: graf berbentuk ∩ dan mempunyai titik maksimum.'])
  + note(f'Bagi {i("a")} < 0, bandingkan nilai {i("a")} tanpa tanda negatif. Contohnya, graf {i("y")} = −{F(1, 2)}{x2()} lebih lebar daripada graf {i("y")} = −3{x2()}.', 'Nota:'),
  SV(g.svg(), 'Graf y = ½x², x², 3x² dan pantulannya: semakin kecil nilai a, semakin lebar lengkok'))

o = ''
cases = [(1, 2, f'{i("b")} > 0'), (1, -2, f'{i("b")} < 0'), (1, 0, f'{i("b")} = 0'), (-1, 2, f'{i("b")} > 0'), (-1, -2, f'{i("b")} < 0'), (-1, 0, f'{i("b")} = 0')]
for k, (a, b, lab) in enumerate(cases):
    r, q = divmod(k, 3)
    bx = (25 + q * 160, 60 + r * 235, 155 + q * 160, 190 + r * 235)
    yr = (-2, 4) if a > 0 else (-4, 2)
    o += mini(bx, quad(a, b, 0), (-3, 3), yr, GR if a > 0 else PA, lab, -b / (2 * a))
o += GF.T(250, 28, f'{i("a")} > 0', GR, 18) + GF.T(250, 262, f'{i("a")} < 0', PA, 18)
S(s, 'KONSEP', 'Kesan perubahan nilai b',
  de(s, f'Nilai {i("b")} menentukan kedudukan paksi simetri.')
  + p(f'Secara generalisasi, bagi graf fungsi kuadratik {fx} = {i("a")}{x2()} + {i("b")}{x_} + {i("c")},')
  + table(['', f'{i("b")} > 0', f'{i("b")} < 0', f'{i("b")} = 0'],
          [[f'{i("a")} > 0', f'paksi simetri berada di sebelah kiri paksi-{i("y")}', f'paksi simetri berada di sebelah kanan paksi-{i("y")}', f'paksi simetri ialah paksi-{i("y")}'],
           [f'{i("a")} < 0', f'paksi simetri berada di sebelah kanan paksi-{i("y")}', f'paksi simetri berada di sebelah kiri paksi-{i("y")}', f'paksi simetri ialah paksi-{i("y")}']], c, 17, rvrows=(1,)),
  SV(o, 'Kedudukan paksi simetri bagi b positif, negatif dan sifar'))

g = Gr((60, 40, 455, 420), (-3, 3), (-4, 7), 1, 1, fs=12)
for cc, col in [(4, PK), (1, TR), (-2, GR)]:
    g.curve(quad(1, 0, cc), -3, 3, col, 3.2)
    g.pt(0, cc, f'{cc}'.replace('-', '−'), col, 10, -12)
g.text(2.9, 6.3, f'{i("y")} = {x2()} + {i("c")}', MU3, 15, 'end')
S(s, 'KONSEP', 'Kesan perubahan nilai c',
  p(f'Apakah kesan nilai {i("c")} ke atas graf fungsi kuadratik {fx} = {i("a")}{x2()} + {i("b")}{x_} + {i("c")}?')
  + de(s, f'Nilai {i("c")} menentukan kedudukan pintasan-{i("y")} bagi suatu graf fungsi kuadratik {fx} = {i("a")}{x2()} + {i("b")}{x_} + {i("c")}.')
  + note(f'Pintasan-{i("y")} ialah titik sesuatu graf memotong paksi-{i("y")}.', 'Imbas kembali:'),
  SV(g.svg(), 'Graf y = x² + c bagi c = 4, 1 dan −2: nilai c ialah pintasan-y'))

S(s, 'CONTOH 2', 'Menghitung nilai c',
  p(f'Fungsi kuadratik {fx} = {x2()} − 5{x_} + {i("c")} melalui titik {i("A")}. Hitung nilai {i("c")} bagi setiap kes yang berikut. (a) {i("A")}(0, 6) (b) {i("A")}(−2, 9)')
  + work([('(a)', [f'Titik {i("A")}(0, 6) berada di paksi-{i("y")}, maka nilai {i("c")} = 6.']),
          ('(b)', [f'Gantikan nilai {x_} = −2 dan {fx} = 9 ke dalam fungsi kuadratik,', f'9 = (−2)² − 5(−2) + {i("c")}', f'9 = 14 + {i("c")}', f'{i("c")} = −5'])], s, 1, 20)
  + note(f'{i("c")} ialah pintasan-{i("y")} bagi graf fungsi kuadratik {fx} = {i("a")}{x2()} + {i("b")}{x_} + {i("c")}.', 'Tip:'))
assert 4 + 10 - 5 == 9

g = Gr((60, 40, 455, 420), (-3, 3), (-6, 4), 1, 1, fs=12)
g.curve(quad(2, 0, -5), -3, 3, PK, 3.5)
g.curve(quad(0.7, 0, -5), -3, 3, TR, 3.5, reveal=True)
g.text(1.25, 2.6, f'{fx} = 2{x2()} − 5', PK, 15, 'end')
g.text(2.95, -2.2, f'{i("g")}({x_}) = {i("p")}{x2()} − 5', TR, 15, 'end', reveal=True)
S(s, 'CONTOH 3', 'Julat nilai a',
  p(f'Rajah di sebelah menunjukkan dua graf fungsi kuadratik {i("y")} = {fx} dan {i("y")} = {i("g")}({x_}) yang dilukis pada paksi yang sama. Nyatakan julat nilai {i("p")}. Berikan justifikasi anda.')
  + pen(s, [f'Oleh sebab bukaan bagi graf {i("g")}({x_}) adalah lebih lebar, maka {i("p")} < 2.',
            f'Bagi graf berbentuk ∪, {i("p")} > 0.', f'Oleh itu, 0 < {i("p")} < 2.']),
  SV(g.svg(), 'Graf f(x) = 2x² − 5 dan g(x) = px² − 5 yang lebih lebar'))

# =====================================================================
# 1.1.4 PERSAMAAN KUADRATIK DAN PUNCA (SP 1.1.4, 1.1.5)
# =====================================================================
s = '1.1.4'
c = COL[s]
o = (GF.box(40, 90, 150, 150) + GF.T(115, 70, f'{x_} cm', MU3, 17) + GF.T(22, 165, f'{x_} cm', MU3, 17, 'middle')
     + GF.box(230, 90, 250, 150) + GF.T(355, 70, f'(3{x_} − 2) cm', MU3, 17) + GF.T(495, 165, f'{x_} cm', MU3, 17, 'end')
     + GF.T(115, 165, 'Kad A', TR, 18) + GF.T(355, 165, 'Kad B', PK, 18)
)
assert all(v * v + v * (3 * v - 2) == 4 * v * v - 2 * v for v in range(1, 6)) and 4 * 25 - 10 == 90
S(s, 'CONTOH 4', 'Membentuk fungsi kuadratik berdasarkan situasi',
  p(f'Fungsi kuadratik ditulis dalam bentuk {fx} = {i("a")}{x2()} + {i("b")}{x_} + {i("c")} manakala suatu persamaan kuadratik ditulis dalam bentuk am, {i("a")}{x2()} + {i("b")}{x_} + {i("c")} = 0.')
  + p(f'<b>CONTOH 4</b> Encik Hafiz merancang untuk membuat dua jenis kad untuk digunakan dalam aktiviti Kelab Matematik. Ukuran kad-kad tersebut adalah seperti yang ditunjukkan dalam rajah. (a) Bentuk satu ungkapan kuadratik bagi jumlah luas kedua-dua kad ini, {i("L")} cm², dalam sebutan {x_}. (b) Diberi jumlah luas kedua-dua kad ialah 90 cm², bentuk satu persamaan kuadratik dalam sebutan {x_}.')
,
  stack(SVc(o, 'Kad segi empat sama bersisi x cm dan kad segi empat tepat x cm kali (3x − 2) cm', '0 50 500 210'),
        work([('(a)', [f'{i("L")} = {x2()} + {x_}(3{x_} − 2)', f'= {x2()} + 3{x2()} − 2{x_}', f'= 4{x2()} − 2{x_}']),
              ('(b)', [f'4{x2()} − 2{x_} = 90', f'4{x2()} − 2{x_} − 90 = 0'])], s, 2, 18)))

g = Gr((60, 40, 455, 420), (-3, 5), (-7, 6), 1, 1, fs=12)
g.curve(quad(1, -2, -3), -3, 5, PK, 3.5)
g.pt(-1, 0, 'punca', AM, -8, -18, 'end', reveal=True)
g.pt(3, 0, 'punca', AM, 8, -18, reveal=True)
g.text(4.9, 5.3, f'{fx} = {x2()} − 2{x_} − 3', PK, 15, 'end')
S(s, 'DEFINISI', 'Maksud punca persamaan kuadratik',
  de(s, f'Punca bagi persamaan kuadratik {i("a")}{x2()} + {i("b")}{x_} + {i("c")} = 0 ialah nilai pemboleh ubah, {x_}, yang memuaskan persamaan tersebut.')
  + bul(s, ['Terdapat satu atau dua nilai pemboleh ubah yang memuaskan suatu persamaan kuadratik.',
            'Nilai-nilai pemboleh ubah yang memuaskan suatu persamaan kuadratik dikenali sebagai punca bagi persamaan kuadratik tersebut.',
            f'Punca bagi suatu persamaan kuadratik {i("a")}{x2()} + {i("b")}{x_} + {i("c")} = 0 merupakan titik persilangan antara graf fungsi kuadratik {fx} = {i("a")}{x2()} + {i("b")}{x_} + {i("c")} dengan paksi-{x_} dan juga dikenali sebagai pintasan-{x_}.'])
  + note(f'Punca bagi {x2()} − 2{x_} − 3 = 0 ialah −1 dan 3.', 'Contoh:'),
  SV(g.svg(), 'Punca persamaan x² − 2x − 3 = 0 ialah pintasan-x graf, iaitu −1 dan 3'))

o = ''
fa5, fb5 = quad(2, 3, -9), quad(-1, 2, 8)
assert fa5(-3) == 0 and fa5(1.5) == 0 and fb5(-2) == 0 and fb5(4) == 0
ga = Gr((50, 50, 235, 400), (-4, 2), (-12, 12), 1, 4, fs=10)
ga.curve(fa5, -4, 2, PK, 3.2)
ga.pt(-3, 0, '−3', AM, -4, -16, 'end', 16, reveal=True).pt(1.5, 0, '1.5', AM, 4, -16, 'start', 16, reveal=True)
gb = Gr((290, 50, 475, 400), (-3, 5), (-8, 10), 1, 2, fs=10)
gb.curve(fb5, -3, 5, TR, 3.2)
gb.pt(-2, 0, '−2', AM, -4, -16, 'end', 16, reveal=True).pt(4, 0, '4', AM, 6, -16, 'start', 16, reveal=True)
o = ga.svg() + gb.svg() + GF.T(142, 445, '(a)', PK, 16) + GF.T(382, 445, '(b)', TR, 16)
S(s, 'CONTOH 5', 'Menandakan punca pada graf',
  p('Bagi setiap graf fungsi kuadratik di sebelah, tandakan dan nyatakan punca bagi persamaan kuadratik yang diberikan.')
  + bul(s, [f'(a) 2{x2()} + 3{x_} − 9 = 0', f'(b) −{x2()} + 2{x_} + 8 = 0'])
  + pen(s, [f'(a) Graf bersilang dengan paksi-{x_} pada {x_} = −3 dan {x_} = 1.5. Punca ialah −3 dan 1.5.',
            f'(b) Graf bersilang dengan paksi-{x_} pada {x_} = −2 dan {x_} = 4. Punca ialah −2 dan 4.']),
  SV(o, 'Graf 2x² + 3x − 9 dan −x² + 2x + 8 dengan punca ditanda pada paksi-x'))
S_ = OUT[-1]

assert 2 - 9 + 4 == -3 and 2 * 16 - 36 + 4 == 0 and 3 * 4 - 10 + 4 == 6 and Fr(3) * Fr(2, 3) ** 2 - 5 * Fr(2, 3) + 4 == 2
S(s, 'CONTOH 6', 'Menentukan sama ada suatu nilai ialah punca',
  p(f'Tentukan sama ada setiap nilai berikut merupakan punca bagi persamaan kuadratik yang diberikan atau bukan. (a) 2{x2()} − 9{x_} + 4 = 0; {x_} = 1, {x_} = 4 (b) 3{x2()} − 5{x_} + 4 = 2; {x_} = 2, {x_} = {F(2, 3)}')
  + note('Punca suatu persamaan kuadratik ialah nilai ' + x_ + ' yang memuaskan persamaan tersebut. Bandingkan nilai di kiri dengan nilai di kanan persamaan.', 'Ingat:'),
  work([('(a)', [f'Apabila {x_} = 1: Kiri = 2(1)² − 9(1) + 4 = −3, Kanan = 0 (tidak sama)', f'Maka, {x_} = 1 bukan punca bagi persamaan 2{x2()} − 9{x_} + 4 = 0.',
                 f'Apabila {x_} = 4: Kiri = 2(4)² − 9(4) + 4 = 32 − 36 + 4 = 0, Kanan = 0 (sama)', f'Maka, {x_} = 4 ialah punca bagi persamaan 2{x2()} − 9{x_} + 4 = 0.']),
        ('(b)', [f'Apabila {x_} = 2: Kiri = 3(2)² − 5(2) + 4 = 6, Kanan = 2 (tidak sama)', f'Maka, {x_} = 2 bukan punca bagi persamaan 3{x2()} − 5{x_} + 4 = 2.',
                 f'Apabila {x_} = {F(2, 3)}: Kiri = 3({F(2, 3)})² − 5({F(2, 3)}) + 4 = {F(4, 3)} − {F(10, 3)} + 4 = 2, Kanan = 2 (sama)', f'Maka, {x_} = {F(2, 3)} ialah punca bagi persamaan 3{x2()} − 5{x_} + 4 = 2.'])], s, 1, 17))

class Lk:
    """lakaran graf tanpa grid (paksi, lengkung, titik berlabel) dalam kotak bx."""

    def __init__(self, bx, xr, yr):
        self.g = Gr(bx, xr, yr, 1, 1, gx=1e9, gy=1e9, labels=False, fs=12)
        self.g.out = [o for o in self.g.out if 'stroke-width="1.2"' not in o]


def sketch(fn, xr, yr, roots, yint, col, extra=None, bx=(70, 40, 450, 420)):
    g = Lk(bx, xr, yr).g
    g.curve(fn, xr[0], xr[1], col, 3.5)
    for r in roots:
        g.pt(r, 0, mn(r), AM, 0, 20, 'middle', 17)
    g.pt(0, yint, mn(yint), AM, -10, -2, 'end', 17)
    if extra:
        g.pt(extra[0], extra[1], f'({mn(extra[0])}, {mn(extra[1])})', AM, 10, -14, 'start', 16)
    return g


def two(fa, fb, la, lb):
    """fa, fb = argumen sketch tanpa bx."""
    ga = sketch(*fa, bx=(40, 50, 225, 360)); gb = sketch(*fb, bx=(290, 50, 475, 360))
    return ga.svg() + gb.svg() + GF.T(132, 420, la, TX, 15) + GF.T(382, 420, lb, TX, 15)


sk_demo = sketch(quad(1, -4, 3), (-1, 5), (-2, 6), (1, 3), 3, PK).add(GF.T(345, 120, 'bentuk ∪', PK, 17)).svg()


# =====================================================================
# 1.1.6 PEMFAKTORAN, LAKARAN GRAF DAN PENYELESAIAN MASALAH (SP 1.1.6 – 1.1.8)
# =====================================================================
s = '1.1.6'
c = COL[s]
for v in (3, 4):
    assert v * v - 7 * v + 12 == 0
assert 2 * 0.25 + 2.5 - 3 == 0 and 2 * 9 - 15 - 3 == 0
assert all(v * (v - 3) == 2 * (4 * v - 15) for v in (5, 6)) and all((v + 2) * (v + 3) == 2 * (v + 12) for v in (3, -6))
S(s, 'CONTOH 7', 'Menentukan punca dengan kaedah pemfaktoran',
  p('Kaedah pemfaktoran ialah salah satu cara untuk menentukan punca bagi sesuatu persamaan. Setiap persamaan kuadratik perlu ditulis dalam bentuk ' + f'{i("a")}{x2()} + {i("b")}{x_} + {i("c")} = 0 sebelum melakukan pemfaktoran.')
  + p(f'<b>CONTOH 7</b> Tentukan punca persamaan kuadratik berikut dengan kaedah pemfaktoran. (a) {x2()} − 7{x_} + 12 = 0 (b) {x2()} + {F(5, 2)}{x_} = {F(3, 2)} (c) {F(x_, 2)} = {F(f"4{x_} − 15", f"{x_} − 3")} (d) ({i("y")} + 2)({i("y")} + 3) = 2({i("y")} + 12)')
  + note('Persamaan kuadratik juga boleh diselesaikan dengan kaedah penyempurnaan kuasa dua dan kaedah rumus.', 'Info:'),
  work([('(a)', [f'{x2()} − 7{x_} + 12 = 0', f'({x_} − 3)({x_} − 4) = 0', f'{x_} = 3 atau {x_} = 4']),
        ('(b)', [f'{x2()} + {F(5, 2)}{x_} = {F(3, 2)}', f'2{x2()} + 5{x_} = 3', f'2{x2()} + 5{x_} − 3 = 0', f'(2{x_} − 1)({x_} + 3) = 0', f'{x_} = {F(1, 2)} atau {x_} = −3']),
        ('(c)', [f'{x_}({x_} − 3) = 2(4{x_} − 15)', f'{x2()} − 3{x_} = 8{x_} − 30', f'{x2()} − 11{x_} + 30 = 0', f'({x_} − 5)({x_} − 6) = 0', f'{x_} = 5 atau {x_} = 6']),
        ('(d)', [f'{i("y")}² + 5{i("y")} + 6 = 2{i("y")} + 24', f'{i("y")}² + 3{i("y")} − 18 = 0', f'({i("y")} + 6)({i("y")} − 3) = 0', f'{i("y")} = −6 atau {i("y")} = 3'])], s, 2, 16))

o = ''
for k, (a, col) in enumerate([(1, GR), (-1, PA)]):
    bx = (40 + k * 240, 70, 220 + k * 240, 300)
    g = Gr(bx, (-2, 4), (-5, 5) if a > 0 else (-5, 5), 1, 1, labels=False, fs=11)
    g.curve(quad(a, -2 * a, -3 * a), -2, 4, col, 3.4)
    g.pt(-1, 0, '', AM).pt(3, 0, '', AM)
    g.text(-1, 0.9 if a > 0 else -0.9, 'punca', AM, 13).text(3, 0.9 if a > 0 else -0.9, 'punca', AM, 13)
    o += g.svg() + GF.T((bx[0] + bx[2]) / 2, 35, f'{i("a")} > 0' if a > 0 else f'{i("a")} < 0', col, 18)
o += GF.T(250, 370, 'Ciri-ciri lakaran graf:', TX, 17)
S(s, 'KONSEP', 'Menentukan punca dengan kaedah graf',
  p('Bagaimanakah anda menentukan punca persamaan kuadratik dengan kaedah graf?')
  + de(s, f'Punca bagi suatu persamaan kuadratik {i("a")}{x2()} + {i("b")}{x_} + {i("c")} = 0 dapat diperoleh dengan kaedah graf dengan membaca nilai-nilai {x_} yang merupakan titik persilangan antara graf fungsi kuadratik {fx} = {i("a")}{x2()} + {i("b")}{x_} + {i("c")} dengan paksi-{x_}.'),
  SV(o.replace(GF.T(250, 370, 'Ciri-ciri lakaran graf:', TX, 17), ''), 'Punca ialah titik persilangan graf dengan paksi-x bagi a > 0 dan a < 0'))

S(s, 'KONSEP', 'Melakar graf fungsi kuadratik',
  p('Ciri-ciri graf yang perlu ditunjukkan semasa melakar graf fungsi kuadratik adalah seperti yang berikut.')
  + steps(s, ['Bentuk graf yang betul.', f'Pintasan-{i("y")}.', f'Pintasan-{x_} atau satu titik yang dilalui oleh graf tersebut.'])
  + note(f'Pemalar {i("c")} bagi suatu fungsi kuadratik merupakan pintasan-{i("y")} graf fungsi kuadratik tersebut.', 'Imbas kembali:')
  + p(f'Graf fungsi kuadratik boleh bersilang pada paksi-{x_} (Kes 1) atau tidak bersilang dengan paksi-{x_} (Kes 2).'),
  SV(sk_demo, 'Lakaran graf dengan bentuk, pintasan-y dan pintasan-x'))




ga = (quad(1, -6, 5), (-1, 6), (-5, 7), (1, 5), 5, PK)
gb = (quad(1, -4, 4), (-1, 5), (-1, 6), (2,), 4, TR)
assert quad(1, -6, 5)(1) == 0 and quad(1, -6, 5)(5) == 0 and quad(1, -4, 4)(2) == 0
S(s, 'CONTOH 8', 'Melakar graf: graf bersilang pada paksi-x',
  p(f'<b>Kes 1</b> Graf fungsi kuadratik bersilang pada paksi-{x_}. Lakar setiap graf fungsi kuadratik yang berikut. (a) {fx} = {x2()} − 6{x_} + 5 (b) {fx} = {x2()} − 4{x_} + 4')
  + work([('(a)', [f'Nilai {i("a")} = 1 > 0, bentuk ∪', f'Nilai {i("c")} = 5, pintasan-{i("y")} = 5', f'Apabila {fx} = 0, {x2()} − 6{x_} + 5 = 0', f'({x_} − 1)({x_} − 5) = 0', f'{x_} = 1 atau {x_} = 5']),
          ('(b)', [f'Nilai {i("a")} = 1 > 0, bentuk ∪', f'Nilai {i("c")} = 4, pintasan-{i("y")} = 4', f'Apabila {fx} = 0, {x2()} − 4{x_} + 4 = 0', f'({x_} − 2)({x_} − 2) = 0', f'{x_} = 2'])], s, 2, 17),
  SV(GF.rv(two(ga, gb, f'(a) {fx} = {x2()} − 6{x_} + 5', f'(b) {fx} = {x2()} − 4{x_} + 4')), 'Lakaran graf x² − 6x + 5 dan x² − 4x + 4'))

gc = (quad(-1, 2, 8), (-3, 5), (-3, 10), (-2, 4), 8, PK)
gd = (quad(-3, 0, 12), (-3, 3), (-3, 14), (-2, 2), 12, TR)
assert quad(-1, 2, 8)(-2) == 0 and quad(-3, 0, 12)(2) == 0
S(s, 'CONTOH 8', 'Melakar graf: graf bersilang pada paksi-x (sambungan)',
  p(f'(c) {fx} = −{x2()} + 2{x_} + 8 &nbsp;&nbsp; (d) {fx} = −3{x2()} + 12')
  + work([('(c)', [f'Nilai {i("a")} = −1 < 0, bentuk ∩', f'Nilai {i("c")} = 8, pintasan-{i("y")} = 8', f'Apabila {fx} = 0, −{x2()} + 2{x_} + 8 = 0', f'{x2()} − 2{x_} − 8 = 0', f'({x_} − 4)({x_} + 2) = 0', f'{x_} = −2 atau {x_} = 4']),
          ('(d)', [f'Nilai {i("a")} = −3 < 0, bentuk ∩', f'Nilai {i("b")} = 0, paksi simetri ialah paksi-{i("y")}', f'Nilai {i("c")} = 12, pintasan-{i("y")} = 12', f'Apabila {fx} = 0, −3{x2()} + 12 = 0', f'{x2()} − 4 = 0', f'({x_} + 2)({x_} − 2) = 0', f'{x_} = −2, {x_} = 2'])], s, 2, 16),
  SV(GF.rv(two(gc, gd, f'(c) {fx} = −{x2()} + 2{x_} + 8', f'(d) {fx} = −3{x2()} + 12')), 'Lakaran graf −x² + 2x + 8 dan −3x² + 12'))

ge = (quad(1, 0, 2), (-3, 3), (-1, 8), (), 2, PK, (2, 6))
gf = (quad(-1, 0, -1), (-3, 3), (-4, 2), (), -1, TR, (1, -2))
assert quad(1, 0, 2)(2) == 6 and quad(-1, 0, -1)(1) == -2
S(s, 'CONTOH 9', 'Melakar graf: graf tidak bersilang dengan paksi-x',
  p(f'<b>Kes 2</b> Graf fungsi kuadratik tidak bersilang dengan paksi-{x_}. Lakar setiap graf fungsi kuadratik yang berikut. (a) {fx} = {x2()} + 2 (b) {fx} = −{x2()} − 1')
  + work([('(a)', [f'Nilai {i("a")} = 1 > 0, bentuk ∪', f'Nilai {i("b")} = 0, paksi simetri ialah paksi-{i("y")}', f'Nilai {i("c")} = 2, pintasan-{i("y")} ialah 2, maka titik minimum ialah (0, 2)', f'Apabila {x_} = 2, {i("f")}(2) = 2² + 2 = 6']),
          ('(b)', [f'Nilai {i("a")} = −1 < 0, bentuk ∩', f'Nilai {i("b")} = 0, paksi simetri ialah paksi-{i("y")}', f'Nilai {i("c")} = −1, pintasan-{i("y")} ialah −1, maka titik maksimum ialah (0, −1)', f'Apabila {x_} = 1, {i("f")}(1) = −(1)² − 1 = −2'])], s, 2, 16)
  + note(f'Jika nilai pekali {i("b")} = 0 bagi suatu fungsi kuadratik, maka paksi-{i("y")} ialah paksi simetri graf fungsi kuadratik tersebut.', 'Imbas kembali:'),
  SV(GF.rv(two(ge, gf, f'(a) {fx} = {x2()} + 2', f'(b) {fx} = −{x2()} − 1')), 'Lakaran graf x² + 2 dan −x² − 1'))

assert 6 * 400 + 40 * 20 == 3200 and 3 * 400 + 20 * 20 - 1600 == 0 and 8 * 20 + 4 * 30 == 280 and abs(6 * 2.8 - 16.8) < 1e-9
# kuboid
P0 = [(170, 330), (360, 330), (360, 140), (170, 140)]
dx, dy = 90, -60
cub = ''.join(GF.L(P0[j], P0[(j + 1) % 4], TR, 3) for j in range(4))
cub += ''.join(GF.L((x0 + dx, y0 + dy), (x1 + dx, y1 + dy), TR, 3) for (x0, y0), (x1, y1) in [(P0[1], P0[2]), (P0[2], P0[3])])
cub += GF.L(P0[1], (P0[1][0] + dx, P0[1][1] + dy), TR, 3) + GF.L(P0[2], (P0[2][0] + dx, P0[2][1] + dy), TR, 3) + GF.L(P0[3], (P0[3][0] + dx, P0[3][1] + dy), TR, 3)
cub += GF.L(P0[0], (P0[0][0] + dx, P0[0][1] + dy), TR, 2, '6 6') + GF.L((P0[0][0] + dx, P0[0][1] + dy), (P0[1][0] + dx, P0[1][1] + dy), TR, 2, '6 6') + GF.L((P0[0][0] + dx, P0[0][1] + dy), (P0[3][0] + dx, P0[3][1] + dy), TR, 2, '6 6')
cub += GF.T(265, 355, f"{x_} cm", MU3, 18) + GF.T(435, 315, f"{x_} cm", MU3, 18) + GF.T(158, 235, f'({x_} + 10) cm', MU3, 18, 'end')
S(s, 'CONTOH 10', 'Menyelesaikan masalah yang melibatkan persamaan kuadratik',
  p('Joseph ingin membuat rangka sebuah kotak berbentuk kuboid dengan menggunakan rod kayu. Harga rod kayu ialah RM6 per meter. Tapak kuboid tersebut berbentuk segi empat sama. Tinggi kuboid ialah 10 cm lebih daripada panjang tapak. Jumlah luas permukaan kotak ini ialah 3 200 cm². Bajet Joseph untuk membina rangka sebuah kotak ialah RM15. Tentukan sama ada Joseph mempunyai bajet yang mencukupi atau tidak.')
  + steps(s, [f'<b>Memahami masalah:</b> Panjang tapak = {x_} cm, tinggi kuboid = ({x_} + 10) cm, jumlah luas permukaan = 3 200 cm², bajet = RM15 sebuah kotak.']),
  stack(SVc(cub, 'Kuboid bertapak segi empat sama bersisi x cm dan tinggi (x + 10) cm', '0 70 500 300'),
        work([('Merancang strategi', ['• Tentukan ungkapan luas permukaan kuboid.', '• Bentuk persamaan kuadratik.', '• Selesaikan persamaan kuadratik berkenaan.', '• Tentukan ukuran kotak dan bajet.'])], s, 1, 18)))

S(s, 'CONTOH 10', 'Menyelesaikan masalah (sambungan)',
  work([('Melaksanakan strategi', [f'Jumlah luas permukaan = 2({x_})({x_}) + 4({x_})({x_} + 10)', f'= 2{x2()} + 4{x2()} + 40{x_} = 6{x2()} + 40{x_}', f'6{x2()} + 40{x_} = 3 200', f'6{x2()} + 40{x_} − 3 200 = 0',
                                   f'3{x2()} + 20{x_} − 1 600 = 0', f'({x_} − 20)(3{x_} + 80) = 0', f'{x_} = 20 atau {x_} = −{F(80, 3)}', f'{x_} = −{F(80, 3)} tidak diterima, maka {x_} = 20 cm'])], s, 1, 19)
  + note('Ukuran panjang tidak boleh bernilai negatif.', 'Info:'),
  work([('', ['Ukuran kotak ialah 20 cm × 20 cm × 30 cm', 'Panjang sisi kotak = 8 × 20 cm + 4 × 30 cm', '= 160 cm + 120 cm = 280 cm = 2.8 m', 'Bajet = RM6 × 2.8 = RM16.80']),
        ('Membuat kesimpulan', ['Joseph tidak mempunyai bajet yang mencukupi untuk membina rangka kotak ini.']),
        ('Semak jawapan', ['Apabila ' + x_ + ' = 20, luas = 6(20)² + 40(20) = 2 400 + 800 = 3 200'])], s, 1, 19))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'kuadratik', 'slides.js')
HEAD = '/* Nota Bab 1 ikut buku teks Matematik T4 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
