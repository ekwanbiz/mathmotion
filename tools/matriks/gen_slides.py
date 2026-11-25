# Penjana slaid NOTA MATRIKS (Tingkatan 5 Bab 2 Matriks) -> matriks/slides.js
# Jalankan:  python3 tools/matriks/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from mathfmt import FR, RT, SFR, SRT
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'matriks', 'slides.js'))
BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
# SK 2.1 (SP 2.1.1-2.1.3) · SK 2.2 (SP 2.2.1-2.2.7), dipecah ikut SP
SUB = {
    '2.1.1': ('Matriks', TR),
    '2.2.1': ('Tambah, Tolak dan Pendaraban Skalar', GR),
    '2.2.3': ('Pendaraban Dua Matriks dan Matriks Identiti', PK),
    '2.2.5': ('Matriks Songsang dan Persamaan Linear Serentak', AM),
}
ROWC, COLC = TR, PK   # warna tetap: baris biru, lajur merah jambu

# ---------- semakan matematik ----------
def mmul(A, B):
    assert len(A[0]) == len(B)
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]
def madd(A, B, s=1): return [[a + s * b for a, b in zip(r, q)] for r, q in zip(A, B)]
def msc(k, A): return [[k * a for a in r] for r in A]
def det(A): return A[0][0] * A[1][1] - A[0][1] * A[1][0]
def inv(A):
    d = det(A); assert d != 0
    return [[F(A[1][1], d), F(-A[0][1], d)], [F(-A[1][0], d), F(A[0][0], d)]]
def fs(v):
    v = F(v); t = str(abs(v.numerator)) if v.denominator == 1 else f'{abs(v.numerator)}/{v.denominator}'
    return ('−' if v < 0 else '') + t

# ---------- pembantu teks ----------
def P(t, sm=False): return f'<p class="sl-p{" sm" if sm else ""}">{t}</p>'
def DEF(t, col): return f'<div class="sl-def" style="--c:{col}"><p>{t}</p></div>'
def BUL(items, col): return f'<ul class="sl-bul" style="--c:{col}">' + ''.join(f'<li><span>{i}</span></li>' for i in items) + '</ul>'
def STEPS(items, col): return f'<ol class="sl-steps" style="--c:{col}">' + ''.join(f'<li class="rv"><span class="n">{n}</span><span>{t}</span></li>' for n, t in enumerate(items, 1)) + '</ol>'
def ANS(t): return f'<div class="sl-ans rv"><span>JAWAPAN</span> {t}</div>'
def NOTE(t, lab='Ingat:'): return f'<div class="sl-note"><b>{lab}</b> {t}</div>'
def B(t, col): return f'<b style="color: {col}">{t}</b>'
def M(rows, col=TX):
    """Matriks sebaris dalam HTML (kurungan kiri-kanan)."""
    n = len(rows[0])
    cells = ''.join(f'<span>{fs(v) if not isinstance(v, str) else v}</span>' for r in rows for v in r)
    return (f'<span style="display: inline-grid; grid-template-columns: repeat({n}, auto); gap: 2px 12px; align-items: center; text-align: center; vertical-align: middle; '
            f'padding: 2px 9px; margin: 2px 3px; border-left: 3px solid {col}; border-right: 3px solid {col}; border-radius: 10px; font-weight: 700; line-height: 1.15">{cells}</span>')

# ---------- pembantu rajah ----------
FONT = 'font-family="Inter, sans-serif"'
W, H = 500, 470
def svg(inner, label, h=H): return f'<svg class="sl-svg" viewBox="0 0 {W} {h}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'
def r1(v): return round(v, 1)
def T(x, y, t, col=TX, size=20, anchor='middle', weight=700, halo=True):
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round"' if halo else ''
    return f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" dominant-baseline="middle"{ha}>{t}</text>'
def LINE(p, q, col=TX, sw=4, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"{d}/>'
def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=14, sw=2):
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def CROSS(x, y, col=RD, k=9): return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9): return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
def MS(x, y, rows, col=MU, cw=48, rh=44, size=22, hl=None, txc=TX):
    """Matriks SVG; (x, y) = sudut kiri atas. hl = {(i,j): warna}. Pulang (svg, lebar)."""
    m, n = len(rows), len(rows[0]); w = n * cw + 16; h = m * rh
    s = f'<path d="M{x + 10} {y} H{x} V{y + h} H{x + 10} M{x + w - 10} {y} H{x + w} V{y + h} H{x + w - 10}" fill="none" stroke="{col}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'
    for i, r in enumerate(rows):
        for j, v in enumerate(r):
            cx, cy = x + 8 + cw * j + cw / 2, y + rh * i + rh / 2
            c = (hl or {}).get((i, j))
            if c: s += RECT(cx - cw / 2 + 3, cy - rh / 2 + 3, cw - 6, rh - 6, SURF, c, 10, 2.5)
            s += T(cx, cy, v if isinstance(v, str) else fs(v), c or txc, size, halo=False)
    return s, w

S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 2.1.1 MATRIKS =====================
col = TR
JUAL = [[25, 30, 18], [40, 22, 35]]   # baris: Kedai A, B; lajur: nasi lemak, roti canai, mi goreng
fig = T(250, 30, 'Jualan sarapan (bungkus)', MU3, 19, halo=False)
heads = ['Nasi lemak', 'Roti canai', 'Mi goreng']
for j, h_ in enumerate(heads): fig += T(190 + j * 100, 72, h_, COLC, 15)
for i, k in enumerate(['Kedai A', 'Kedai B']):
    fig += T(70, 112 + i * 44, k, ROWC, 16)
    for j in range(3): fig += RECT(150 + j * 100, 92 + i * 44, 80, 38, SURF, BD, 8, 1.5) + T(190 + j * 100, 112 + i * 44, str(JUAL[i][j]), TX, 19, halo=False)
fig += f'<path d="M250 200 V246" stroke="{AM}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M238 234 L250 248 L262 234" stroke="{AM}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
ms, w_ = MS(0, 0, JUAL, TR, 70, 52, 26)
fig += f'<g transform="translate({250 - w_ / 2 + 20},280)">{ms}</g>' + T(250 - w_ / 2 - 6, 332, 'J =', TX, 26, 'end')
fig += T(250, 420, '2 baris × 3 lajur', AM, 20)
add('2.1.1', 'DEFINISI', 'Apakah matriks?',
    DEF('<b>Matriks</b> ialah susunan nombor dalam bentuk segi empat tepat yang terdiri daripada <b>baris</b> dan <b>lajur</b>, ditulis di dalam kurungan [ ] atau ( ).', col)
    + BUL([f'{B("Baris", ROWC)}: susunan mengufuk (kiri ke kanan).', f'{B("Lajur", COLC)}: susunan mencancang (atas ke bawah).',
           'Setiap nombor dalam matriks dipanggil <b>unsur</b>.', 'Matriks dinamakan dengan huruf besar seperti <i>A</i>, <i>B</i>, <i>J</i>.'], col)
    + NOTE('Maklumat dalam jadual boleh diwakili oleh matriks dengan mengekalkan susunan baris dan lajur.'),
    svg(fig, 'Jadual jualan dua kedai ditukar kepada matriks J bersaiz 2 × 3'))

# 2 Peringkat
EX = [([[3, 1]], 'baris', '1 × 2'), ([[2], [5], [0]], 'lajur', '3 × 1'), ([[1, 4], [2, 7]], 'segi empat sama', '2 × 2'), ([[6, 0, 1], [2, 5, 3]], '', '2 × 3')]
assert [f'{len(m)} × {len(m[0])}' for m, _, _ in EX] == [e for _, _, e in EX]
fig = ''
pos = [(30, 40), (290, 30), (30, 250), (260, 250)]
for (m, nm, o), (x, y) in zip(EX, pos):
    ms, w_ = MS(x + 20, y + 20, m, TR, 44, 40, 21)
    fig += ms + T(x + 20 + w_ / 2, y + 20 + 40 * len(m) + 26, o, AM, 20) + (T(x + 20 + w_ / 2, y + 20 + 40 * len(m) + 52, 'matriks ' + nm, MU, 15, halo=False) if nm else '')
add('2.1.1', 'PERINGKAT', 'Peringkat matriks',
    DEF(f'Matriks yang mempunyai {B("<i>m</i> baris", ROWC)} dan {B("<i>n</i> lajur", COLC)} mempunyai <b>peringkat <i>m</i> × <i>n</i></b> (dibaca “<i>m</i> darab <i>n</i>”).', col)
    + STEPS([f'Kira bilangan {B("baris", ROWC)} dahulu, kemudian bilangan {B("lajur", COLC)}.',
             f'{M([[6, 0, 1], [2, 5, 3]])} ada 2 baris dan 3 lajur → peringkat 2 × 3.',
             'Matriks 1 × <i>n</i> = <b>matriks baris</b>; <i>m</i> × 1 = <b>matriks lajur</b>; <i>n</i> × <i>n</i> = <b>matriks segi empat sama</b>.'], col)
    + NOTE('Peringkat 2 × 3 <b>tidak sama</b> dengan 3 × 2.'),
    svg(fig, 'Empat matriks dengan peringkat 1 × 2, 3 × 1, 2 × 2 dan 2 × 3'))

# 3 Unsur aij
A3 = [[4, -1, 7], [0, 9, 2]]
assert A3[1][2] == 2 and A3[0][1] == -1
fig = T(250, 40, 'a₂₃ = unsur baris ke-2, lajur ke-3', MU3, 18, halo=False)
ms, w_ = MS(150, 150, A3, MU, 70, 64, 28, {(1, 2): AM, (0, 1): PU})
fig += ms + T(140, 214, 'A =', TX, 26, 'end')
for i in range(2): fig += T(150 + w_ + 30, 150 + 32 + i * 64, f'baris {i + 1}', ROWC, 15, 'start', halo=False)
for j in range(3): fig += T(158 + 35 + j * 70, 130, f'lajur {j + 1}', COLC, 14, halo=False)
fig += T(250, 340, 'a₁₂ = −1', PU, 24) + T(250, 390, 'a₂₃ = 2', AM, 24)
add('2.1.1', 'UNSUR', 'Unsur a<sub>ij</sub>',
    DEF(f'Unsur <b><i>a</i><sub>ij</sub></b> ialah unsur pada {B("baris ke-<i>i</i>", ROWC)} dan {B("lajur ke-<i>j</i>", COLC)} bagi matriks <i>A</i>.', col)
    + P(f'Diberi <i>A</i> = {M(A3)}. Nyatakan <i>a</i><sub>23</sub> dan <i>a</i><sub>12</sub>.', True)
    + STEPS(['<i>a</i><sub>23</sub>: pergi ke baris 2, kemudian lajur 3 → 2.', '<i>a</i><sub>12</sub>: pergi ke baris 1, kemudian lajur 2 → −1.'], col)
    + ANS('<i>a</i><sub>23</sub> = 2, <i>a</i><sub>12</sub> = −1'),
    svg(fig, 'Matriks A dengan unsur a12 dan a23 diserlahkan'))

# 4 Matriks sama
x_, y_ = 3, -2
assert 2 * x_ - 1 == 5 and y_ + 6 == 4
add('2.1.1', 'MATRIKS SAMA', 'Dua matriks yang sama',
    DEF('Dua matriks adalah <b>sama</b> jika (i) peringkatnya sama dan (ii) setiap unsur sepadan adalah sama.', col)
    + P(f'Diberi {M([["2<i>x</i> − 1", 8], [0, "<i>y</i> + 6"]])} = {M([[5, 8], [0, 4]])}. Cari nilai <i>x</i> dan <i>y</i>.', True)
    + STEPS(['Samakan unsur sepadan: 2<i>x</i> − 1 = 5 dan <i>y</i> + 6 = 4.', '2<i>x</i> = 6 → <i>x</i> = 3', '<i>y</i> = 4 − 6 = −2'], col)
    + ANS('<i>x</i> = 3, <i>y</i> = −2')
    + NOTE(f'{M([[1, 2]])} ≠ {M([[1], [2]])} kerana peringkat berbeza (1 × 2 dan 2 × 1).'))

# 5 Kesilapan biasa
fig = ''
CASES = [(60, 'Peringkat [1 2 3] ialah 3 × 1', False), (126, 'Peringkat [1 2 3] ialah 1 × 3', True),
         (210, 'a₂₁: lajur 2, baris 1', False), (276, 'a₂₁: baris 2, lajur 1', True),
         (360, 'Peringkat sama → matriks sama', False), (426, 'Semua unsur sepadan mesti sama', True)]
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2) + (TICK(44, y) if ok else CROSS(44, y)) + T(70, y, t, GR if ok else RD, 18, 'start')
add('2.1.1', 'KESILAPAN BIASA', 'Baris dahulu, lajur kemudian',
    BUL([f'{B("Peringkat terbalik", RD)}: sentiasa tulis <b>baris × lajur</b>.',
         f'{B("Indeks terbalik", RD)}: dalam <i>a</i><sub>ij</sub>, <i>i</i> = baris, <i>j</i> = lajur.',
         f'{B("Matriks sama", RD)}: peringkat sama sahaja tidak cukup.'], col)
    + NOTE('Matriks → baris × lajur → unsur <i>a</i><sub>ij</sub> → matriks sama (bandingkan unsur sepadan).', 'Ringkasan:'),
    svg(fig, 'Contoh kesilapan dan pembetulan tentang peringkat dan unsur matriks'))

# ===================== 2.2.1 TAMBAH, TOLAK, SKALAR =====================
col = GR
A, Bm = [[3, -2], [5, 1]], [[4, 6], [-1, 7]]
Sm, Dm = madd(A, Bm), madd(A, Bm, -1)
assert Sm == [[7, 4], [4, 8]] and Dm == [[-1, -8], [6, -6]]
fig = T(250, 36, 'Tambah unsur sepadan', MU3, 19, halo=False)
ms1, w1 = MS(14, 80, A, TR, 50, 50, 23); ms2, w2 = MS(180, 80, Bm, PU, 50, 50, 23); ms3, w3 = MS(356, 80, Sm, GR, 50, 50, 23, {(0, 0): AM})
fig += ms1 + T(14 + w1 + 22, 130, '+', TX, 30) + ms2 + T(180 + w2 + 26, 130, '=', TX, 30) + ms3
fig += T(250, 250, '3 + 4 = 7', AM, 24) + T(250, 300, '(baris 1, lajur 1)', MU, 17, halo=False)
fig += RECT(40, 350, 420, 80, SURF, RD, 16, 2) + CROSS(80, 390) + T(250, 375, '2 × 2  +  2 × 3', RD, 20) + T(260, 408, 'tidak boleh ditambah', RD, 17, halo=False)
add('2.2.1', 'TAMBAH & TOLAK', 'Menambah dan menolak matriks',
    DEF('Dua matriks boleh ditambah atau ditolak <b>hanya jika peringkatnya sama</b>. Tambah atau tolak <b>unsur sepadan</b>.', col)
    + P(f'<i>A</i> = {M(A)}, <i>B</i> = {M(Bm)}', True)
    + STEPS([f'<i>A</i> + <i>B</i> = {M([["3 + 4", "−2 + 6"], ["5 + (−1)", "1 + 7"]])} = {M(Sm)}',
             f'<i>A</i> − <i>B</i> = {M([["3 − 4", "−2 − 6"], ["5 − (−1)", "1 − 7"]])} = {M(Dm)}'], col)
    + NOTE('Peringkat jawapan sama dengan peringkat matriks asal.'),
    svg(fig, 'Penambahan dua matriks 2 × 2 dengan unsur sepadan'))

# 2 Sifat
add('2.2.1', 'SIFAT', 'Sifat tambah dan tolak',
    BUL(['<b>Kalis tukar tertib</b>: <i>A</i> + <i>B</i> = <i>B</i> + <i>A</i>',
         '<b>Kalis sekutuan</b>: (<i>A</i> + <i>B</i>) + <i>C</i> = <i>A</i> + (<i>B</i> + <i>C</i>)',
         '<b>Penolakan tidak</b> kalis tukar tertib: <i>A</i> − <i>B</i> ≠ <i>B</i> − <i>A</i> (secara amnya)',
         f'<b>Matriks sifar</b> <i>O</i> = {M([[0, 0], [0, 0]])}: <i>A</i> + <i>O</i> = <i>A</i>'], col)
    + P(f'Contoh: {M([[2, 5]])} − {M([[7, -1]])} = {M([[-5, 6]])}, tetapi {M([[7, -1]])} − {M([[2, 5]])} = {M([[5, -6]])}.', True))
assert madd([[2, 5]], [[7, -1]], -1) == [[-5, 6]]

# 3 Skalar
K = [[2, -1, 0], [3, 4, -5]]
assert msc(3, K) == [[6, -3, 0], [9, 12, -15]]
fig = T(250, 40, 'Setiap unsur didarab dengan 3', MU3, 19, halo=False)
ms1, w1 = MS(110, 90, K, TR, 54, 52, 23)
fig += T(96, 142, '3', AM, 34, 'end') + ms1
fig += f'<path d="M250 210 V258" stroke="{AM}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M238 246 L250 260 L262 246" stroke="{AM}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
ms2, w2 = MS(250 - (3 * 64 + 16) / 2, 290, msc(3, K), GR, 64, 52, 23)
fig += ms2 + T(250, 430, 'Peringkat kekal 2 × 3', MU, 17, halo=False)
add('2.2.1', 'PENDARABAN SKALAR', 'Darab matriks dengan nombor',
    DEF('Bagi skalar (nombor) <i>k</i>, matriks <i>kA</i> diperoleh dengan mendarab <b>setiap unsur</b> <i>A</i> dengan <i>k</i>.', col)
    + STEPS([f'3{M(K)}', f'= {M([["3 × 2", "3 × (−1)", "3 × 0"], ["3 × 3", "3 × 4", "3 × (−5)"]])}', f'= {M(msc(3, K))}'], col)
    + NOTE('−<i>A</i> = (−1)<i>A</i>: tukar tanda setiap unsur.'),
    svg(fig, 'Pendaraban skalar 3 dengan matriks 2 × 3'))

# 4 Gabungan + persamaan matriks
P1, Q1 = [[1, 4], [-2, 3]], [[5, 2], [0, -1]]
R1 = madd(msc(2, P1), Q1, -1)
assert R1 == [[-3, 6], [-4, 7]]
# 2X + [1 3] = [7 -5]  -> X = [3 -4]
assert madd([[7, -5]], [[1, 3]], -1) == [[6, -8]] and msc(F(1, 2), [[6, -8]]) == [[3, -4]]
add('2.2.1', 'CONTOH', 'Operasi gabungan',
    P(f'Diberi <i>P</i> = {M(P1)} dan <i>Q</i> = {M(Q1)}. Cari 2<i>P</i> − <i>Q</i>.', True)
    + STEPS([f'2<i>P</i> = {M(msc(2, P1))}', f'2<i>P</i> − <i>Q</i> = {M([["2 − 5", "8 − 2"], ["−4 − 0", "6 − (−1)"]])}', f'= {M(R1)}'], col)
    + ANS(M(R1))
    + NOTE(f'Persamaan matriks: 2<i>X</i> + {M([[1, 3]])} = {M([[7, -5]])} → 2<i>X</i> = {M([[6, -8]])} → <i>X</i> = {M([[3, -4]])}', 'Lanjutan:'))

# 5 Kesilapan
fig = ''
CASES = [(60, '[2 3] + [1 2 4] = [3 5 4]', False), (126, 'Peringkat berbeza: tidak tertakrif', True),
         (210, '2[3 1; 4 5] = [6 1; 8 5]', False), (276, 'Darab SEMUA unsur: [6 2; 8 10]', True),
         (360, '[5 1] − [2 −3] = [3 −2]', False), (426, '1 − (−3) = 4 → [3 4]', True)]
assert madd([[5, 1]], [[2, -3]], -1) == [[3, 4]]
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2) + (TICK(44, y) if ok else CROSS(44, y)) + T(70, y, t, GR if ok else RD, 18, 'start')
add('2.2.1', 'KESILAPAN BIASA', 'Semak sebelum mengira',
    BUL([f'{B("Peringkat berbeza", RD)}: tidak boleh ditambah atau ditolak.',
         f'{B("Skalar separuh", RD)}: darab <b>setiap</b> unsur, bukan satu baris sahaja.',
         f'{B("Tanda negatif", RD)}: tolak nombor negatif = tambah.'], col)
    + NOTE('Semak peringkat → operasi unsur sepadan → semak tanda.', 'Ringkasan:'),
    svg(fig, 'Contoh kesilapan semasa menambah, menolak dan mendarab skalar'))

# ===================== 2.2.3 DARAB DUA MATRIKS & IDENTITI =====================
col = PK
fig = T(250, 40, 'Syarat pendaraban AB', MU3, 19, halo=False)
fig += T(110, 120, 'A', TR, 34) + T(110, 165, '2 × 3', TR, 24) + T(250, 140, '×', TX, 32) + T(390, 120, 'B', PU, 34) + T(390, 165, '3 × 4', PU, 24)
fig += f'<path d="M140 190 Q250 250 360 190" fill="none" stroke="{GR}" stroke-width="3.5"/>' + T(250, 248, 'mesti sama: 3 = 3 ✓', GR, 19)
fig += f'<path d="M84 190 Q250 330 416 190" fill="none" stroke="{AM}" stroke-width="3.5" stroke-dasharray="8 6"/>' + T(250, 312, 'peringkat AB', AM, 18)
fig += RECT(170, 340, 160, 64, SURF, AM, 16, 2.5) + T(250, 372, '2 × 4', AM, 28)
add('2.2.3', 'SYARAT', 'Bilakah dua matriks boleh didarab?',
    DEF('Hasil darab <i>AB</i> tertakrif <b>hanya jika bilangan lajur <i>A</i> = bilangan baris <i>B</i></b>.', col)
    + STEPS(['<i>A</i> (<i>m</i> × <b><i>n</i></b>) × <i>B</i> (<b><i>n</i></b> × <i>p</i>) → <i>AB</i> (<i>m</i> × <i>p</i>)',
             'Contoh: (2 × 3)(3 × 4) → 2 × 4', '(2 × 3)(2 × 3) → <b>tidak tertakrif</b> kerana 3 ≠ 2'], col)
    + NOTE('Nombor “dalam” mesti sama; nombor “luar” memberi peringkat jawapan.'),
    svg(fig, 'Syarat pendaraban: lajur A sama dengan baris B'))

# 2 Baris × lajur
A2, B2 = [[2, 1], [3, 4]], [[5, 0], [-1, 2]]
AB = mmul(A2, B2)
assert AB == [[9, 2], [11, 8]]
fig = T(250, 34, 'Baris 1 × Lajur 1', MU3, 19, halo=False)
ms1, w1 = MS(14, 70, A2, MU, 48, 50, 22, {(0, 0): ROWC, (0, 1): ROWC}); ms2, w2 = MS(164, 70, B2, MU, 48, 50, 22, {(0, 0): COLC, (1, 0): COLC})
ms3, w3 = MS(330, 70, AB, MU, 52, 50, 22, {(0, 0): AM})
fig += ms1 + ms2 + T(164 + w2 + 26, 120, '=', TX, 28) + ms3
fig += T(250, 230, '(2)(5) + (1)(−1)', TX, 24) + T(250, 274, '= 10 − 1 = 9', AM, 26)
fig += T(250, 340, 'Ulang bagi setiap baris A', MU, 17, halo=False) + T(250, 370, 'dengan setiap lajur B', MU, 17, halo=False)
add('2.2.3', 'BARIS × LAJUR', 'Cara mendarab dua matriks',
    P(f'<i>A</i> = {M(A2)}, <i>B</i> = {M(B2)}. Cari <i>AB</i>.', True)
    + STEPS([f'Unsur (1, 1) = {B("baris 1", ROWC)} × {B("lajur 1", COLC)} = (2)(5) + (1)(−1) = 9',
             'Unsur (1, 2) = (2)(0) + (1)(2) = 2', 'Unsur (2, 1) = (3)(5) + (4)(−1) = 11', 'Unsur (2, 2) = (3)(0) + (4)(2) = 8'], col)
    + ANS(f'<i>AB</i> = {M(AB)}'),
    svg(fig, 'Baris pertama A didarab dengan lajur pertama B'))

# 3 Bukan matriks segi empat sama + AB != BA
C3, D3 = [[1, -2], [3, 0]], [[4], [1]]
CD = mmul(C3, D3); BA = mmul(B2, A2)
assert CD == [[2], [12]] and BA == [[10, 5], [4, 7]] and BA != AB
add('2.2.3', 'CONTOH', 'Peringkat berbeza & tertib',
    P(f'Cari {M(C3)}{M(D3)}.', True)
    + STEPS(['(2 × 2)(2 × 1) → jawapan 2 × 1', '(1)(4) + (−2)(1) = 2', '(3)(4) + (0)(1) = 12'], col)
    + ANS(M(CD))
    + NOTE(f'Pendaraban matriks <b>tidak</b> kalis tukar tertib: dengan <i>A</i>, <i>B</i> tadi, <i>AB</i> = {M(AB)} tetapi <i>BA</i> = {M(BA)}.', 'Awas:'))

# 4 Identiti
I2 = [[1, 0], [0, 1]]
assert mmul(A2, I2) == A2 and mmul(I2, A2) == A2
fig = T(250, 36, 'Matriks identiti I', MU3, 19, halo=False)
ms1, w1 = MS(60, 70, I2, AM, 54, 52, 26, {(0, 0): AM, (1, 1): AM}); fig += T(50, 122, 'I =', TX, 24, 'end') + ms1
ms1, w1 = MS(270, 50, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], AM, 46, 46, 22, {(0, 0): AM, (1, 1): AM, (2, 2): AM}); fig += ms1
fig += T(150, 206, '2 × 2', MU, 16, halo=False) + T(350, 210, '3 × 3', MU, 16, halo=False)
ms1, w1 = MS(20, 280, A2, TR, 44, 46, 21); ms2, w2 = MS(140, 280, I2, AM, 44, 46, 21); ms3, w3 = MS(330, 280, A2, TR, 44, 46, 21)
fig += ms1 + ms2 + T(290, 326, '=', TX, 28) + ms3 + T(250, 420, 'AI = IA = A', AM, 24)
add('2.2.3', 'MATRIKS IDENTITI', 'Matriks identiti, <i>I</i>',
    DEF('<b>Matriks identiti</b> <i>I</i> ialah matriks segi empat sama dengan unsur <b>1</b> pada pepenjuru utama dan <b>0</b> di tempat lain.', col)
    + BUL(['<i>AI</i> = <i>IA</i> = <i>A</i> (seperti nombor 1 dalam pendaraban).', '<i>I</i>² = <i>I</i>, <i>I</i>³ = <i>I</i>, …',
           'Pepenjuru utama: dari kiri atas ke kanan bawah.'], col)
    + NOTE(f'{M(A2)}{M(I2)} = {M(A2)}'),
    svg(fig, 'Matriks identiti 2 × 2 dan 3 × 3 serta AI = A'))

# 5 Kesilapan
fig = ''
CASES = [(60, 'Darab unsur sepadan sahaja', False), (126, 'Baris × lajur, kemudian tambah', True),
         (210, 'AB = BA', False), (276, 'Secara amnya AB ≠ BA', True),
         (360, '(2 × 3)(2 × 3) tertakrif', False), (426, 'Lajur A mesti = baris B', True)]
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2) + (TICK(44, y) if ok else CROSS(44, y)) + T(70, y, t, GR if ok else RD, 18, 'start')
add('2.2.3', 'KESILAPAN BIASA', 'Pendaraban matriks',
    BUL([f'{B("Darab sepadan", RD)}: pendaraban matriks bukan seperti penambahan.',
         f'{B("Tukar tertib", RD)}: <i>AB</i> dan <i>BA</i> biasanya berbeza; kadang-kadang salah satu tidak tertakrif.',
         f'{B("A² ≠ unsur kuasa dua", RD)}: <i>A</i>² = <i>A</i> × <i>A</i> (baris × lajur).'], col)
    + NOTE('Semak peringkat → baris × lajur → tambah hasil darab → tulis di kedudukan (baris, lajur).', 'Ringkasan:'),
    svg(fig, 'Contoh kesilapan semasa mendarab matriks'))

# ===================== 2.2.5 SONGSANG & SERENTAK =====================
col = AM
A5 = [[3, 1], [5, 2]]
assert det(A5) == 1 and mmul(A5, inv(A5)) == I2
add('2.2.5', 'DEFINISI', 'Matriks songsang & penentu',
    DEF('Jika <i>AA</i><sup>−1</sup> = <i>A</i><sup>−1</sup><i>A</i> = <i>I</i>, maka <i>A</i><sup>−1</sup> ialah <b>matriks songsang</b> bagi <i>A</i>.', col)
    + BUL([f'Bagi <i>A</i> = {M([["<i>a</i>", "<i>b</i>"], ["<i>c</i>", "<i>d</i>"]])}, <b>penentu</b> |<i>A</i>| = <i>ad</i> − <i>bc</i>.',
           '<i>A</i><sup>−1</sup> wujud <b>hanya jika</b> <i>ad</i> − <i>bc</i> ≠ 0.',
           'Jika <i>ad</i> − <i>bc</i> = 0, <i>A</i> tiada songsang (matriks singular).'], col)
    + NOTE(f'Semak: {M(A5)}{M([[2, -1], [-5, 3]])} = {M(I2)}, maka kedua-duanya saling songsang.'))
assert mmul(A5, [[2, -1], [-5, 3]]) == I2

# 2 Rumus songsang
A6 = [[4, 3], [2, 2]]
d6 = det(A6); iv6 = inv(A6)
assert d6 == 2 and iv6 == [[1, F(-3, 2)], [-1, 2]] and mmul(A6, iv6) == I2
fig = T(250, 36, 'Rumus songsang 2 × 2', MU3, 19, halo=False)
ms1, w1 = MS(150, 66, [['a', 'b'], ['c', 'd']], TR, 54, 50, 24); fig += T(140, 116, 'A =', TX, 24, 'end') + ms1
fig += T(150, 226, 'A⁻¹ =', TX, 24, 'end') + T(200, 210, '1', TX, 22) + LINE((168, 228), (232, 228), TX, 2.5) + T(200, 248, 'ad − bc', AM, 18)
ms2, w2 = MS(252, 176, [['d', '−b'], ['−c', 'a']], PK, 54, 50, 24, {(0, 0): PK, (1, 1): PK}); fig += ms2
fig += T(250, 330, 'tukar a ↔ d', PK, 19) + T(250, 366, 'tukar tanda b dan c', PU, 19) + T(250, 410, 'bahagi dengan penentu', AM, 19)
add('2.2.5', 'RUMUS', 'Mencari matriks songsang',
    P(f'Cari songsang bagi <i>A</i> = {M(A6)}.', True)
    + STEPS(['Penentu: (4)(2) − (3)(2) = 8 − 6 = 2 ≠ 0', f'<i>A</i><sup>−1</sup> = {FR(1, 2)}{M([[2, -3], [-2, 4]])}', f'= {M([[1, "−" + FR(3, 2)], [-1, 2]])}'], col)
    + ANS(f'<i>A</i><sup>−1</sup> = {M([[1, "−" + FR(3, 2)], [-1, 2]])}'),
    svg(fig, 'Rumus matriks songsang 2 × 2'))

# 3 Persamaan serentak dalam bentuk matriks
# 2x + y = 7, x - y = 2 -> x = 3, y = 1
A7, b7 = [[2, 1], [1, -1]], [[7], [2]]
d7 = det(A7); iv7 = inv(A7); sol = mmul(iv7, b7)
assert d7 == -3 and sol == [[3], [1]]
def plane_fig():
    X0, X1, Y0, Y1 = -1, 6, -2, 8
    Lp, Tp, Rp, Bp = 40, 20, 480, 440
    sx, sy = (Rp - Lp) / (X1 - X0), (Bp - Tp) / (Y1 - Y0)
    X = lambda x: Lp + (x - X0) * sx; Y = lambda y: Bp - (y - Y0) * sy
    s = ''
    for i in range(X0, X1 + 1): s += LINE((X(i), Y(Y0)), (X(i), Y(Y1)), GRID, 1.5)
    for j in range(Y0, Y1 + 1): s += LINE((X(X0), Y(j)), (X(X1), Y(j)), GRID, 1.5)
    s += LINE((X(X0), Y(0)), (X(X1), Y(0)), MU, 2.5) + LINE((X(0), Y(Y0)), (X(0), Y(Y1)), MU, 2.5)
    for i in range(X0, X1 + 1):
        if i: s += T(X(i), Y(0) + 15, fs(i), MU2, 14, weight=600)
    for j in range(Y0, Y1 + 1, 2):
        if j: s += T(X(0) - 10, Y(j), fs(j), MU2, 14, 'end', weight=600)
    s += LINE((X(-0.5), Y(8)), (X(5), Y(-3) if False else Y(-3)), TR, 4) if False else LINE((X(-0.5), Y(8)), (X(4.5), Y(-2)), TR, 4.5)
    s += LINE((X(0), Y(-2)), (X(6), Y(4)), PK, 4.5)
    s += f'<circle cx="{r1(X(3))}" cy="{r1(Y(1))}" r="8" fill="{AM}" stroke="{NAV}" stroke-width="3"/>' + T(X(3) + 14, Y(1) + 24, '(3, 1)', AM, 20, 'start')
    s += T(X(1) - 8, Y(6) , '2x + y = 7', TR, 18, 'end') + T(X(5.4), Y(3.4) - 18, 'x − y = 2', PK, 18, 'end')
    return s
assert 2 * -0.5 + 8 == 7 and 2 * 4.5 - 2 == 7 and 0 - (-2) == 2 and 6 - 4 == 2
add('2.2.5', 'PERSAMAAN SERENTAK', 'Tulis dalam bentuk matriks',
    P('2<i>x</i> + <i>y</i> = 7 dan <i>x</i> − <i>y</i> = 2', True)
    + STEPS([f'Bentuk matriks: {M(A7)}{M([["<i>x</i>"], ["<i>y</i>"]])} = {M(b7)}',
             f'Penentu = (2)(−1) − (1)(1) = −3',
             f'{M([["<i>x</i>"], ["<i>y</i>"]])} = −{FR(1, 3)}{M([[-1, -1], [-1, 2]])}{M(b7)} = −{FR(1, 3)}{M([[-9], [-3]])}',
             f'= {M([[3], [1]])}'], col)
    + ANS('<i>x</i> = 3, <i>y</i> = 1'),
    svg(plane_fig(), 'Dua garis 2x + y = 7 dan x − y = 2 bersilang pada titik (3, 1)'))
assert mmul([[-1, -1], [-1, 2]], b7) == [[-9], [-3]]

# 4 Langkah umum
add('2.2.5', 'KAEDAH MATRIKS', 'Langkah menyelesaikan',
    STEPS([f'Tulis persamaan dalam bentuk <i>AX</i> = <i>B</i>, dengan <i>X</i> = {M([["<i>x</i>"], ["<i>y</i>"]])}.',
           'Cari penentu <i>ad</i> − <i>bc</i>. Jika 0, kaedah matriks tidak boleh digunakan.',
           'Cari <i>A</i><sup>−1</sup>.', 'Darab dari <b>kiri</b>: <i>X</i> = <i>A</i><sup>−1</sup><i>B</i>.', 'Semak dengan menggantikan ke dalam persamaan asal.'], col)
    + NOTE('<i>X</i> = <i>A</i><sup>−1</sup><i>B</i>, <b>bukan</b> <i>BA</i><sup>−1</sup> (peringkat (2 × 1)(2 × 2) tidak tertakrif).', 'Awas:')
    + NOTE('Penyelesaian ialah titik persilangan dua garis lurus.', 'Makna graf:'))

# 5 Masalah
# 2 buku + 3 pen = 23 ; 1 buku + 2 pen = 13 -> buku 7, pen 3
A8, b8 = [[2, 3], [1, 2]], [[23], [13]]
assert det(A8) == 1 and mmul(inv(A8), b8) == [[7], [3]]
add('2.2.5', 'PENYELESAIAN MASALAH', 'Harga buku dan pen',
    P('Aina membayar RM23 untuk 2 buku dan 3 pen. Ben membayar RM13 untuk 1 buku dan 2 pen. Cari harga sebuah buku, <i>x</i>, dan sebatang pen, <i>y</i>.', True)
    + STEPS(['2<i>x</i> + 3<i>y</i> = 23, <i>x</i> + 2<i>y</i> = 13', f'{M(A8)}{M([["<i>x</i>"], ["<i>y</i>"]])} = {M(b8)}; penentu = 4 − 3 = 1',
             f'{M([["<i>x</i>"], ["<i>y</i>"]])} = {M([[2, -3], [-1, 2]])}{M(b8)} = {M([[7], [3]])}'], col)
    + ANS('Buku RM7, pen RM3')
    + NOTE('Semak: 2(7) + 3(3) = 23 ✓, 7 + 2(3) = 13 ✓', 'Semak:'))

# 6 Kesilapan
fig = ''
CASES = [(60, 'A⁻¹ = [d b; c a] (tanda kekal)', False), (126, 'Tukar tanda b dan c: [d −b; −c a]', True),
         (210, 'Penentu = ad + bc', False), (276, 'Penentu = ad − bc', True),
         (360, 'X = BA⁻¹', False), (426, 'X = A⁻¹B (darab dari kiri)', True)]
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2) + (TICK(44, y) if ok else CROSS(44, y)) + T(70, y, t, GR if ok else RD, 18, 'start')
add('2.2.5', 'KESILAPAN BIASA', 'Songsang dan serentak',
    BUL([f'{B("Lupa bahagi", RD)} dengan penentu.', f'{B("Tanda salah", RD)}: hanya <i>b</i> dan <i>c</i> ditukar tanda; <i>a</i> dan <i>d</i> bertukar tempat.',
         f'{B("Penentu 0", RD)}: tiada songsang; garis selari atau bertindih.'], col)
    + NOTE('|<i>A</i>| = <i>ad</i> − <i>bc</i> → <i>A</i><sup>−1</sup> → <i>X</i> = <i>A</i><sup>−1</sup><i>B</i> → semak.', 'Ringkasan:'),
    svg(fig, 'Contoh kesilapan semasa mencari matriks songsang'))

# ---------- tulis fail ----------
counts = {}
for s in S: counts[s['sub']] = counts.get(s['sub'], 0) + 1
out, idx = [], {}
for s in S:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s['kicker'], 'title': s['title'], 'body': s['body'], 'fig': s['fig'] or '', 'full': s['full'] or ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]
ALLOWED = {x.lower() for x in [BG, SURF, NAV, BD, TX, MU, GRID, DIM, MU2, MU3] + list(C.values())}
js_body = json.dumps(out, ensure_ascii=False)
bad = {h for h in re.findall(r'#[0-9a-fA-F]{6}', js_body) if h.lower() not in ALLOWED}
assert not bad, f'warna luar palet: {bad}'
assert 'NaN' not in js_body and 'None' not in js_body
assert counts == {'2.1.1': 5, '2.2.1': 5, '2.2.3': 5, '2.2.5': 6}, counts
js = ('/* Dijana oleh tools/matriks/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
