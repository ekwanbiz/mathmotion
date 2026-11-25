# Penjana slaid NOTA KEKONGRUENAN (Tingkatan 5 Bab 5) -> kekongruenan/slides.js
# Jalankan:  python3 tools/kekongruenan/gen_slides.py
import json, os, html, re, math, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fxsvg import fx_svg, fx_html   # pecahan bertingkat (25 Nov)
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'kekongruenan', 'slides.js'))
BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
TR, PA, PU, AM, GR, PK, RD = (C[k] for k in ['tr', 'pa', 'pu', 'am', 'gr', 'pk', 'rd'])
SUB = {'5.1': ('Kekongruenan', TR), '5.2': ('Pembesaran', PK), '5.3': ('Gabungan Transformasi', GR), '5.4': ('Teselasi', AM)}

def P(t, sm=False): return f'<p class="sl-p{" sm" if sm else ""}">{t}</p>'
def DEF(t, col): return f'<div class="sl-def" style="--c:{col}"><p>{t}</p></div>'
def BUL(items, col): return f'<ul class="sl-bul" style="--c:{col}">' + ''.join(f'<li><span>{i}</span></li>' for i in items) + '</ul>'
def STEPS(items, col): return f'<ol class="sl-steps" style="--c:{col}">' + ''.join(f'<li class="rv"><span class="n">{n}</span><span>{t}</span></li>' for n, t in enumerate(items, 1)) + '</ol>'
def ANS(t): return f'<div class="sl-ans rv"><span>JAWAPAN</span> {t}</div>'
def NOTE(t, lab='Ingat:'): return f'<div class="sl-note"><b>{lab}</b> {t}</div>'
def B(t, col): return f'<b style="color: {col}">{t}</b>'
def TABLE(head, rows, col, rv=False):
    th = ''.join(f'<th style="padding: 10px 14px; text-align: left; font-size: 18px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 9px 14px; font-size: 19px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}"><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'

FONT = 'font-family="Inter, sans-serif"'
W, H = 500, 470
def svg(inner, label, h=H): return f'<svg class="sl-svg" viewBox="0 0 {W} {h}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'
def r1(v): return round(v, 1)
def T(x, y, t, col=TX, size=20, anchor='middle'):
    return f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="700" text-anchor="{anchor}" dominant-baseline="middle" paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round">{t}</text>'
def LINE(p, q, col=TX, sw=3, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"{d}/>'
def POLY(pts, col, op='33', dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<polygon points="{" ".join(f"{r1(x)},{r1(y)}" for x, y in pts)}" fill="{col}{op}" stroke="{col}" stroke-width="3.5" stroke-linejoin="round"{d}/>'
def DOT(p, col=AM, r=7): return f'<circle cx="{r1(p[0])}" cy="{r1(p[1])}" r="{r}" fill="{col}" stroke="{TX}" stroke-width="2"/>'

# grid koordinat: unit -> piksel
class G:
    def __init__(s, x0, x1, y0, y1, u=None):
        s.x0, s.x1, s.y0, s.y1 = x0, x1, y0, y1
        s.u = u or min(440 / (x1 - x0), 420 / (y1 - y0))
        s.ox = (W - s.u * (x1 - x0)) / 2; s.oy = (H - s.u * (y1 - y0)) / 2
    def p(s, x, y): return (s.ox + (x - s.x0) * s.u, s.oy + (s.y1 - y) * s.u)
    def draw(s):
        o = ''
        for i in range(s.x0, s.x1 + 1): o += LINE(s.p(i, s.y0), s.p(i, s.y1), GRID, 1.5 if i else 2.5) if i else LINE(s.p(i, s.y0), s.p(i, s.y1), MU2, 2.5)
        for j in range(s.y0, s.y1 + 1): o += LINE(s.p(s.x0, j), s.p(s.x1, j), GRID, 1.5) if j else LINE(s.p(s.x0, j), s.p(s.x1, j), MU2, 2.5)
        return o
    def poly(s, pts, col, op='33', dash=None): return POLY([s.p(*q) for q in pts], col, op, dash)

def tri(pts, col, labs=None, op='33'):
    o = POLY(pts, col, op)
    if labs:
        cx = sum(p[0] for p in pts) / 3; cy = sum(p[1] for p in pts) / 3
        for (x, y), l in zip(pts, labs):
            dx, dy = x - cx, y - cy; n = math.hypot(dx, dy)
            o += T(x + dx / n * 20, y + dy / n * 20, l, TX, 20)
    return o
def tick(p, q, col, n=1):
    mx, my = (p[0] + q[0]) / 2, (p[1] + q[1]) / 2; dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy); ux, uy = dx / L, dy / L; nx, ny = -uy, ux
    o = ''
    for k in range(n):
        off = (k - (n - 1) / 2) * 7
        cx, cy = mx + ux * off, my + uy * off
        o += LINE((cx - nx * 9, cy - ny * 9), (cx + nx * 9, cy + ny * 9), col, 3)
    return o

S = []
def add(sub, kicker, title, body, fig=''): S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig})

def is_cong(a, b):
    def sides(t): return sorted(round(math.dist(t[i], t[(i + 1) % 3]), 6) for i in range(3))
    return sides(a) == sides(b)

# ======================= 5.1 KEKONGRUENAN =======================
c = TR
A1 = [(60, 330), (200, 330), (90, 180)]; A2 = [(300, 330), (440, 330), (410, 180)]
assert is_cong(A1, A2)
f = tri(A1, TR, ['A', 'B', 'C']) + tri(A2, PK, ['P', 'Q', 'R']) + T(250, 400, 'Saiz dan bentuk sama', MU, 18)
add('5.1', 'DEFINISI', 'Bentuk kongruen',
    DEF('Dua bentuk adalah <b>kongruen</b> jika kedua-duanya mempunyai <b>bentuk dan saiz yang sama</b>.', c)
    + BUL(['Sisi sepadan sama panjang.', 'Sudut sepadan sama besar.', 'Bentuk kongruen boleh ditranslasi, dipantul atau diputar supaya bertindih tepat.'], c)
    + NOTE('Imej bagi translasi, pantulan dan putaran sentiasa <b>kongruen</b> dengan objek.'),
    svg(f, 'Dua segi tiga kongruen'))

rows = [['SSS', 'Tiga sisi sepadan sama panjang'], ['SAS', 'Dua sisi dan sudut <b>di antara</b> dua sisi itu sama'],
        ['ASA', 'Dua sudut dan sisi <b>di antara</b> dua sudut itu sama'], ['AAS', 'Dua sudut dan satu sisi <b>bukan</b> di antara dua sudut itu sama']]
f = (tri([(50, 200), (200, 200), (90, 70)], TR) + tick((50, 200), (200, 200), AM, 1) + tick((200, 200), (90, 70), AM, 2) + tick((90, 70), (50, 200), AM, 3)
     + T(125, 240, 'SSS', TR, 22)
     + tri([(290, 200), (450, 200), (320, 70)], PK) + tick((290, 200), (450, 200), AM, 1) + tick((290, 200), (320, 70), AM, 2)
     + f'<path d="M 316 200 A 26 26 0 0 0 296 176" fill="none" stroke="{GR}" stroke-width="3"/>' + T(370, 240, 'SAS', PK, 22)
     + T(250, 330, 'S = sisi,  A = sudut', MU3, 20) + T(250, 375, 'SSA dan AAA bukan syarat', RD, 20))
add('5.1', 'SYARAT', 'Syarat kekongruenan segi tiga',
    P('Dua segi tiga adalah kongruen jika memenuhi <b>salah satu</b> syarat berikut:') + TABLE(['Syarat', 'Maksud'], rows, c, rv=True),
    svg(f, 'Syarat SSS dan SAS'))

add('5.1', 'CONTOH 1', 'Kenal pasti syarat',
    P('Dalam ΔABC dan ΔPQR, AB = PQ = 7 cm, ∠ABC = ∠PQR = 50° dan BC = QR = 9 cm. Adakah kedua-dua segi tiga kongruen?')
    + STEPS(['Sisi AB = PQ (S).', 'Sudut ∠B = ∠Q terletak <b>di antara</b> sisi AB dan BC (A).', 'Sisi BC = QR (S).', 'Susunan sisi–sudut–sisi → syarat <b>SAS</b>.'], c)
    + ANS('Ya, ΔABC ≅ ΔPQR (SAS).'),
    svg(tri([(60, 320), (230, 320), (110, 160)], TR, ['A', 'B', 'C']) + T(150, 345, '7 cm', AM, 18) + T(200, 225, '9 cm', AM, 18)
        + tri([(270, 320), (440, 320), (320, 160)], PK, ['P', 'Q', 'R']) + T(355, 345, '7 cm', AM, 18) + T(410, 225, '9 cm', AM, 18)
        + T(250, 410, '∠B = ∠Q = 50°', GR, 20), 'Dua segi tiga SAS'))

add('5.1', 'CONTOH 2', 'Cari sisi yang tidak diketahui',
    P('ΔKLM ≅ ΔXYZ. Diberi KL = 6 cm, LM = 8 cm dan KM = 11 cm. Cari panjang YZ.')
    + STEPS(['Padankan bucu mengikut susunan nama: K↔X, L↔Y, M↔Z.', 'YZ sepadan dengan LM.', 'Sisi sepadan bentuk kongruen sama panjang.'], c)
    + ANS('YZ = LM = 8 cm'),
    svg(T(250, 150, 'K L M', TR, 40) + T(250, 260, 'X Y Z', PK, 40) + LINE((250, 175), (250, 235), AM, 3) + LINE((308, 175), (308, 235), AM, 3) + LINE((192, 175), (192, 235), AM, 3)
        + T(250, 340, 'LM ↔ YZ', GR, 28), 'Padanan bucu'))
assert 8 == 8

add('5.1', 'KESILAPAN BIASA', 'SSA dan AAA bukan syarat',
    BUL([B('SSA', RD) + ': sudut tidak di antara dua sisi — boleh menghasilkan dua segi tiga berbeza.', B('AAA', RD) + ': sudut sama tetapi saiz berbeza — segi tiga <b>serupa</b>, bukan kongruen.',
         'Pastikan sudut dalam SAS terletak <b>di antara</b> dua sisi yang diberi.'], RD)
    + NOTE('Bentuk serupa = bentuk sama, saiz mungkin berbeza. Bentuk kongruen = bentuk <b>dan</b> saiz sama.'),
    svg(tri([(60, 330), (180, 330), (100, 250)], TR) + tri([(240, 330), (480, 330), (320, 170)], PK) + T(250, 400, 'AAA: sudut sama, saiz berbeza', RD, 20), 'Segi tiga serupa tetapi tidak kongruen'))

add('5.1', 'RINGKASAN', 'Ringkasan 5.1',
    TABLE(['Perkara', 'Isi penting'], [['Kongruen', 'Bentuk dan saiz sama'], ['Syarat', 'SSS, SAS, ASA, AAS'], ['Bukan syarat', 'SSA, AAA'], ['Simbol', 'ΔABC ≅ ΔPQR']], c, rv=True),
    svg(tri(A1, TR, ['A', 'B', 'C']) + tri(A2, PK, ['P', 'Q', 'R']) + T(250, 420, 'ΔABC ≅ ΔPQR', AM, 26), 'Ringkasan'))

# ======================= 5.2 PEMBESARAN =======================
c = PK
g = G(-1, 9, -1, 7)
O = (0, 0); obj = [(1, 1), (3, 1), (1, 2)]; k = 3; img = [(k * x, k * y) for x, y in obj]
assert img == [(3, 3), (9, 3), (3, 6)]
f = g.draw() + ''.join(LINE(g.p(*O), g.p(*q), AM, 2, '6 5') for q in img) + g.poly(obj, TR) + g.poly(img, PK, '22') + DOT(g.p(*O)) + T(*g.p(0.4, -0.5), 'O', AM, 18)
add('5.2', 'DEFINISI', 'Pembesaran',
    DEF('<b>Pembesaran</b> ialah transformasi yang setiap titik bergerak dari satu titik tetap, <b>pusat pembesaran</b>, dengan nisbah tetap <b>faktor skala k</b>.', c)
    + P('k = ' + 'jarak imej dari pusat ÷ jarak objek dari pusat')
    + BUL(['Imej <b>serupa</b> dengan objek.', 'Garis dari pusat melalui titik objek dan titik imej.'], c),
    svg(f, 'Pembesaran faktor skala 3 pada asalan'))

rows = [['k > 1', 'Imej lebih besar, sebelah yang sama'], ['0 < k < 1', 'Imej lebih kecil, sebelah yang sama'], ['k = 1', 'Imej kongruen, di tempat yang sama'],
        ['k < 0', 'Imej di <b>sebelah bertentangan</b> pusat, songsang'], ['−1 < k < 0', 'Imej lebih kecil dan songsang']]
add('5.2', 'FAKTOR SKALA', 'Nilai k dan kesannya',
    TABLE(['Nilai k', 'Kesan pada imej'], rows, c, rv=True) + NOTE('Saiz imej bergantung pada |k|. Tanda negatif hanya menukar sebelah.'),
    svg(G(-6, 6, -5, 5).draw() + G(-6, 6, -5, 5).poly([(1, 1), (3, 1), (1, 3)], TR)
        + G(-6, 6, -5, 5).poly([(-1, -1), (-3, -1), (-1, -3)], PK, '22') + DOT(G(-6, 6, -5, 5).p(0, 0)) + T(*G(-6, 6, -5, 5).p(2.5, 3.6), 'objek', TR, 18) + T(*G(-6, 6, -5, 5).p(-2.5, -3.9), 'k = −1', PK, 18),
        'Pembesaran dengan k negatif'))

O = (1, 1); A = (3, 2); k = -2; Ai = (O[0] + k * (A[0] - O[0]), O[1] + k * (A[1] - O[1]))
assert Ai == (-3, -1)
g = G(-5, 5, -4, 4)
add('5.2', 'CONTOH 1', 'Cari koordinat imej',
    P('Titik A(3, 2) dibesarkan pada pusat O(1, 1) dengan faktor skala −2. Cari koordinat imej A′.')
    + STEPS(['Vektor dari pusat ke A: (3 − 1, 2 − 1) = (2, 1).', 'Darab dengan k: −2 × (2, 1) = (−4, −2).', 'Tambah pada pusat: (1 − 4, 1 − 2).'], c) + ANS('A′(−3, −1)'),
    svg(g.draw() + LINE(g.p(*A), g.p(*Ai), AM, 2.5, '6 5') + DOT(g.p(*O)) + DOT(g.p(*A), TR) + DOT(g.p(*Ai), PK) + T(*g.p(1, 1.7), 'O', AM, 18) + T(*g.p(3, 2.7), 'A', TR, 18) + T(*g.p(-3, -1.7), 'A′', PK, 18), 'Imej titik A'))

lo = 12; k = F(5, 2); li = lo * k * k
assert li == 75
add('5.2', 'CONTOH 2', 'Luas imej',
    DEF('Luas imej = <b>k²</b> × luas objek', c)
    + P('Sebuah segi tiga dengan luas 12 cm² dibesarkan dengan faktor skala '+fx_html('5/2')+'. Cari luas imej.')
    + STEPS([fx_html('k² = (5/2)² = 25/4'), fx_html('Luas imej = 25/4 × 12'), '= 75'], c) + ANS('75 cm²') + NOTE('Jika k negatif, k² tetap positif: k = −3 → luas × 9.'),
    svg(POLY([(80, 330), (160, 330), (80, 270)], TR) + POLY([(220, 330), (420, 330), (220, 180)], PK, '22') + T(110, 360, '12 cm²', TR, 18) + T(300, 360, '75 cm²', PK, 18) + fx_svg(250, 110, '× (5/2)² = × 25/4', AM, 24, 'middle', ' font-family="Inter, sans-serif" font-weight="700"'), 'Luas imej'))

add('5.2', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([B('Salah', RD) + ': luas imej = k × luas objek. ' + B('Betul', GR) + ': darab dengan <b>k²</b>.',
         B('Salah', RD) + ': k negatif bermakna imej lebih kecil. ' + B('Betul', GR) + ': k negatif bermakna imej di sebelah bertentangan.',
         B('Salah', RD) + ': ukur jarak dari asalan. ' + B('Betul', GR) + ': ukur dari <b>pusat pembesaran</b>.',
         'Cari pusat: sambungkan titik objek ke titik imej sepadan; titik persilangan garis ialah pusat.'], c),
    svg(T(250, 180, 'k = jarak imej', PK, 26) + LINE((130, 215), (370, 215), PK, 3) + T(250, 250, 'jarak objek', TR, 26) + T(250, 330, 'Luas imej = k² × luas objek', AM, 22), 'Rumus pembesaran'))

add('5.2', 'RINGKASAN', 'Ringkasan 5.2',
    TABLE(['Perkara', 'Isi penting'], [['Pusat', 'Titik tetap (tidak bergerak)'], ['k', 'jarak imej ÷ jarak objek dari pusat'], ['k < 0', 'Imej di sebelah bertentangan'], ['Luas', 'Luas imej = k² × luas objek']], c, rv=True),
    svg(G(-1, 9, -1, 7).draw() + G(-1, 9, -1, 7).poly([(1, 1), (3, 1), (1, 2)], TR) + G(-1, 9, -1, 7).poly([(3, 3), (9, 3), (3, 6)], PK, '22') + DOT(G(-1, 9, -1, 7).p(0, 0)), 'Ringkasan pembesaran'))

# ======================= 5.3 GABUNGAN TRANSFORMASI =======================
c = GR
def refl_x(p): return (p[0], -p[1])
def tr(v): return lambda p: (p[0] + v[0], p[1] + v[1])
def rot90cw(p): return (p[1], -p[0])
g = G(-6, 6, -5, 5)
add('5.3', 'DEFINISI', 'Gabungan dua transformasi',
    DEF('Gabungan transformasi <b>AB</b> bermaksud: lakukan transformasi <b>B dahulu</b>, kemudian transformasi <b>A</b>.', c)
    + BUL(['Objek → (B) → imej pertama → (A) → imej akhir.', 'Baca dari <b>kanan ke kiri</b>.', 'A² = AA: lakukan A dua kali.'], c)
    + NOTE('Selalunya AB ≠ BA, jadi urutan penting.'),
    svg(T(250, 160, 'AB', AM, 60) + T(140, 260, 'objek', TR, 22) + T(250, 260, '→ B →', GR, 22) + T(360, 260, '→ A →', PK, 22) + T(250, 330, 'B dahulu, kemudian A', MU3, 22), 'Urutan AB'))

Pt = (2, 1); Tv = (3, -2)
ab = refl_x(tr(Tv)(Pt)); ba = tr(Tv)(refl_x(Pt))
assert ab == (5, 1) and ba == (5, -3)
add('5.3', 'CONTOH 1', 'AB dan BA berbeza',
    P('A = pantulan pada paksi-x, B = translasi (3, −2). Cari imej titik (2, 1) di bawah AB dan BA.')
    + STEPS(['AB: B dahulu → (2 + 3, 1 − 2) = (5, −1); kemudian A → (5, 1).', 'BA: A dahulu → (2, −1); kemudian B → (2 + 3, −1 − 2) = (5, −3).'], c)
    + ANS('AB: (5, 1);  BA: (5, −3)') + NOTE('AB ≠ BA bagi contoh ini.'),
    svg(g.draw() + DOT(g.p(*Pt), TR) + DOT(g.p(*ab), GR) + DOT(g.p(*ba), PK) + T(*g.p(2, 1.8), '(2, 1)', TR, 17) + T(*g.p(5, 1.8), 'AB', GR, 17) + T(*g.p(5, -3.8), 'BA', PK, 17), 'Imej AB dan BA'))

sq = [(1, 1), (3, 1), (3, 2), (1, 2)]
im = [rot90cw(refl_x(p)) for p in sq]
add('5.3', 'CONTOH 2', 'Lukis imej langkah demi langkah',
    P('R = putaran 90° ikut arah jam pada O, M = pantulan pada paksi-x. Lukis imej segi empat tepat di bawah RM.')
    + STEPS(['M dahulu: pantulkan pada paksi-x.', 'Kemudian R: putar imej pertama 90° ikut arah jam pada O.', 'Imej akhir kongruen dengan objek (isometri).'], c),
    svg(g.draw() + g.poly(sq, TR) + g.poly([refl_x(p) for p in sq], AM, '22', '6 5') + g.poly(im, GR) + DOT(g.p(0, 0)) + T(*g.p(2, 2.6), 'objek', TR, 17) + T(*g.p(2, -2.7), 'M', AM, 17) + T(*g.p(-2.2, -3.6), 'RM', GR, 17), 'Imej RM'))
assert sorted(im) == sorted([(-1, -1), (-1, -3), (-2, -3), (-2, -1)])

add('5.3', 'TRANSFORMASI SETARA', 'Satu transformasi yang setara',
    P('Gabungan dua transformasi kadang-kadang sama dengan <b>satu</b> transformasi:')
    + TABLE(['Gabungan', 'Setara dengan'], [['Dua translasi', 'Satu translasi (tambah vektor)'], ['Pantulan pada dua garis selari', 'Satu translasi'], ['Pantulan pada dua garis bersilang', 'Satu putaran'], ['Dua putaran pada pusat sama', 'Satu putaran (tambah sudut)'], ['Dua pembesaran pusat sama', 'Pembesaran faktor k₁k₂']], c, rv=True),
    svg(T(250, 170, '(2, 1) + (3, −4)', TR, 26) + T(250, 240, '= (5, −3)', GR, 30) + T(250, 320, '90° + 90° = 180°', PK, 26), 'Contoh transformasi setara'))
assert (2 + 3, 1 - 4) == (5, -3)

add('5.3', 'KESILAPAN BIASA & RINGKASAN', 'Ringkasan 5.3',
    BUL([B('Salah', RD) + ': lakukan A dahulu dalam AB. ' + B('Betul', GR) + ': lakukan <b>B</b> dahulu.', 'Gabungan isometri menghasilkan imej kongruen.', 'Gabungan dengan pembesaran: luas imej akhir = k² × luas objek.'], c)
    + NOTE('Semak dengan satu titik: kira imej AB dan BA secara berasingan.'),
    svg(T(250, 200, 'AB ≠ BA', AM, 52) + T(250, 300, 'kanan → kiri', MU3, 24), 'Ringkasan gabungan'))

# ======================= 5.4 TESELASI =======================
c = AM
def hexpts(cx, cy, r): return [(cx + r * math.cos(math.radians(60 * i)), cy + r * math.sin(math.radians(60 * i))) for i in range(6)]
f = ''
r = 40
for i in range(-1, 7):
    for j in range(-1, 7):
        cx = 60 + i * 1.5 * r; cy = 60 + j * math.sqrt(3) * r + (i % 2) * math.sqrt(3) * r / 2
        if -20 < cx < 520 and -20 < cy < 490: f += POLY(hexpts(cx, cy, r), [AM, TR, PK][(i + 2 * j) % 3], '33')
add('5.4', 'DEFINISI', 'Apa itu teselasi?',
    DEF('<b>Teselasi</b> ialah corak bentuk yang <b>berulang</b> dan menutup satu permukaan satah <b>tanpa ruang kosong</b> dan <b>tanpa bertindih</b>.', c)
    + BUL(['Contoh: jubin lantai, sarang lebah, corak batik.', 'Teselasi dibentuk dengan translasi, pantulan atau putaran.'], c)
    + NOTE('Hasil tambah sudut di setiap bucu pertemuan = <b>360°</b>.'),
    svg(f, 'Teselasi heksagon sekata'))

def sudut(n): return F(180 * (n - 2), n)
rows = []
for n, nm in [(3, 'Segi tiga sama sisi'), (4, 'Segi empat sama'), (5, 'Pentagon sekata'), (6, 'Heksagon sekata'), (8, 'Oktagon sekata')]:
    a = sudut(n); q = F(360) / a
    rows.append([nm, f'{float(a):g}°', f'{float(q):g}', B('Ya', GR) if q.denominator == 1 else B('Tidak', RD)])
assert [r_[1] for r_ in rows] == ['60°', '90°', '108°', '120°', '135°']
add('5.4', 'POLIGON SEKATA', 'Poligon sekata yang boleh menteselasi',
    P('Sudut pedalaman poligon sekata n sisi = (n − 2) × 180° ÷ n. Poligon boleh menteselasi sendirian jika 360° ÷ sudut ialah nombor bulat.')
    + TABLE(['Poligon', 'Sudut', '360° ÷ sudut', 'Teselasi?'], rows, c, rv=True),
    svg(T(250, 150, 'Hanya 3 poligon sekata:', TX, 22) + T(250, 220, 'segi tiga sama sisi', AM, 24) + T(250, 270, 'segi empat sama', TR, 24) + T(250, 320, 'heksagon sekata', PK, 24), 'Tiga poligon sekata'))

assert 90 + 135 + 135 == 360
add('5.4', 'CONTOH', 'Semak gabungan poligon',
    P('Adakah satu segi empat sama dan dua oktagon sekata boleh bertemu pada satu bucu?')
    + STEPS(['Sudut segi empat sama = 90°.', 'Sudut oktagon sekata = (8 − 2) × 180° ÷ 8 = 135°.', '90° + 135° + 135° = 360°.'], c)
    + ANS('Ya, jumlah sudut = 360°, jadi boleh menteselasi.'),
    svg(T(250, 200, '90° + 135° + 135°', AM, 30) + T(250, 270, '= 360° ✓', GR, 36), 'Semakan 360 darjah'))

assert 108 * 3 == 324 and 108 * 4 == 432
add('5.4', 'KESILAPAN BIASA', 'Mengapa pentagon sekata tidak boleh?',
    STEPS(['Sudut pentagon sekata = 108°.', '3 pentagon: 3 × 108° = 324° (ada ruang).', '4 pentagon: 4 × 108° = 432° (bertindih).'], c)
    + NOTE('Jumlah sudut pada bucu mestilah <b>tepat</b> 360°: tidak kurang, tidak lebih.'),
    svg(T(250, 200, '324° < 360° < 432°', RD, 30) + T(250, 270, 'Pentagon sekata ✗', RD, 26), 'Pentagon tidak menteselasi'))

add('5.4', 'RINGKASAN', 'Ringkasan 5.4',
    TABLE(['Perkara', 'Isi penting'], [['Teselasi', 'Tiada ruang, tiada tindihan'], ['Syarat bucu', 'Jumlah sudut = 360°'], ['Sudut poligon sekata', '(n − 2) × 180° ÷ n'], ['Teselasi sendirian', 'Segi tiga, segi empat sama, heksagon']], c, rv=True),
    svg(f, 'Ringkasan teselasi'))

# ---------- tulis fail ----------
counts = {}
for s in S: counts[s['sub']] = counts.get(s['sub'], 0) + 1
out, idx = [], {}
for s in S:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s['kicker'], 'title': s['title'], 'body': s['body'], 'fig': s['fig'], 'full': ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]
ALLOWED = {x.lower() for x in [BG, SURF, NAV, BD, TX, MU, GRID, DIM, MU2, MU3] + list(C.values())}
js_body = json.dumps(out, ensure_ascii=False)
bad = {h for h in re.findall(r'#[0-9a-fA-F]{6}', js_body) if h.lower() not in ALLOWED}
assert not bad, bad
assert 'NaN' not in js_body and 'None' not in js_body
assert all(5 <= v <= 7 for v in counts.values()), counts
js = '/* Dijana oleh tools/kekongruenan/gen_slides.py. Jangan sunting dengan tangan. */\nwindow.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n'
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid', counts, '->', OUTFILE)
