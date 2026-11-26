"""Bab 7 T3 Pelan dan Dongakan: nota ikut buku teks (ayat buku, nombor ditukar).
Subtopik ikut buku: 7.1 Unjuran Ortogon, 7.2 Pelan dan Dongakan (sama dengan folder pelan).
Pelan dan dongakan dijana automatik daripada model prisma (unjuran.py) supaya sentiasa sepadan dengan objek."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX
from unjuran import Prism, dimline

SUBS = [{"no": "7.1", "name": "Unjuran Ortogon", "col": "#38BDF8"}, {"no": "7.2", "name": "Pelan dan Dongakan", "col": "#FB923C"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


F = fr


def i(s):
    return f'<i>{s}</i>'


def arrow_lbl(p, q, lb, col=PK):
    return GF.arrow(p, q, col, 3) + GF.T(p[0] + (p[0] - q[0]) * 0.35, p[1] + (p[1] - q[1]) * 0.35, lb, col, 17)


def plane_h(x, y, w, h, sk=60, col=MU):
    """satah mengufuk (segi empat selari)."""
    pts = [(x, y + h), (x + w, y + h), (x + w + sk, y), (x + sk, y)]
    return '<polygon points="' + ' '.join(f'{a:.1f},{b:.1f}' for a, b in pts) + f'" fill="{col}22" stroke="{col}" stroke-width="2"/>'


def plane_v(x, y, w, h, sk=40, col=MU):
    pts = [(x, y + h), (x + w, y + h - sk), (x + w, y - sk), (x, y)]
    return '<polygon points="' + ' '.join(f'{a:.1f},{b:.1f}' for a, b in pts) + f'" fill="{col}22" stroke="{col}" stroke-width="2"/>'


def cap(x, y, t, col=MU3, size=15):
    return GF.T(x, y, t, col, size, halo=False)


def quad(P, s, cx, cy, method=1, gx=46, gy=30, dims=None):
    """lukisan empat sukuan: kaedah 1 (dongakan sisi di kiri) atau kaedah 2 (dongakan sisi di kanan)."""
    W = P.xmax - P.xmin; d = P.d
    o = GF.L((14, cy), (486, cy), MU, 1.6) + GF.L((cx, 14), (cx, 456), MU, 1.6)
    if method == 1:
        o += P.front(cx + gx, cy - gy, s, TR, 12) + P.plan(cx + gx, cy + gy + s * d, s, AM, 12) + P.side(cx - gx - s * d, cy - gy, s, 'kanan', PK, 12)
        o += GF.L((cx, cy), (cx - s * d - 30, cy + s * d + 30), MU, 1.4) + GF.T(cx - 26, cy + 14, '45°', MU3, 12)
        o += cap(cx + gx + s * W / 2, 30, 'Dongakan depan', TR, 13) + cap(cx - gx - s * d / 2, 30, 'Dongakan sisi', PK, 13) + cap(cx + gx + s * W / 2, cy + gy + s * d + 36, 'Pelan', AM, 13)
    else:
        x0 = cx - gx - s * W
        o += P.front(x0, cy - gy, s, TR, 12) + P.plan(x0, cy + gy + s * d, s, AM, 12) + P.side(cx + gx, cy - gy, s, 'kiri', PK, 12)
        o += GF.L((cx, cy), (cx + s * d + 30, cy + s * d + 30), MU, 1.4) + GF.T(cx + 26, cy + 14, '45°', MU3, 12)
        o += cap(x0 + s * W / 2, 30, 'Dongakan depan', TR, 13) + cap(cx + gx + s * d / 2, 30, 'Dongakan sisi', PK, 13) + cap(x0 + s * W / 2, cy + gy + s * d + 36, 'Pelan', AM, 13)
    return o


# =====================================================================
# 7.1 UNJURAN ORTOGON
# =====================================================================
s = '7.1'
c = COL[s]
P0 = Prism([(0, 0), (4, 0), (2, 2.4)], ['A', 'B', 'F'], ['D', 'C', 'E'], 4)
Pf, Pb, _ = P0.pts3d(110, 330, 62)
o = P0.draw3d(110, 330, 62, c)
o += cap(250, 440, 'ABCD: satah mengufuk · ABF, CDE: satah mencancang', MU3, 14)
S(s, 'DEFINISI', 'Satah',
  p('Anda telah mempelajari objek dalam dua dimensi dan tiga dimensi. Setiap objek tersebut terdiri daripada permukaan rata atau permukaan melengkung atau kedua-duanya.')
  + de(s, '<b>Satah</b> ialah <b>permukaan rata</b> pada suatu objek. Terdapat tiga jenis satah iaitu <b>satah mengufuk, satah mencancang</b> dan <b>satah condong</b>.')
  + p(f'Rajah di sebelah menunjukkan suatu prisma tegak dengan {i("ABCD")} ialah satah mengufuk. {i("ABF")} dan {i("CDE")} ialah satah mencancang. {i("BCEF")} dan {i("ADEF")} ialah satah condong.'),
  SV(o, 'Prisma tegak dengan satah mengufuk ABCD, satah mencancang ABF dan CDE, satah condong BCEF dan ADEF'))

M_ = ((Pf[0][0] + Pf[1][0]) / 2, (Pf[0][1] + Pf[1][1]) / 2); N_ = ((Pb[0][0] + Pb[1][0]) / 2, (Pb[0][1] + Pb[1][1]) / 2)
o = P0.draw3d(110, 330, 62, c) + GF.L(Pf[2], M_, AM, 3) + GF.L(Pb[2], N_, AM, 2.4, '6 5') + GF.T(M_[0], M_[1] + 18, 'M', TX, 15) + GF.T(N_[0] + 4, N_[1] + 16, 'N', TX, 15)
o += f'<path d="M{M_[0] + 12:.1f} {M_[1]:.1f} L{M_[0] + 12:.1f} {M_[1] - 12:.1f} L{M_[0]:.1f} {M_[1] - 12:.1f}" fill="none" stroke="{TX}" stroke-width="2"/>'
S(s, 'DEFINISI', 'Normal kepada satah',
  p(f'Garis {i("FM")} dan {i("EN")} berserenjang dengan garis {i("AB")} dan {i("CD")} masing-masing. Garis {i("FM")} dan {i("EN")} juga dikenali sebagai <b>normal</b> kepada satah {i("ABCD")}.')
  + de(s, '<b>Normal kepada</b> suatu <b>satah</b> ialah garis lurus yang <b>berserenjang</b> atau bersudut tegak dengan sebarang <b>garis pada satah</b> tersebut.'),
  SV(o, 'Prisma tegak dengan garis FM dan EN berserenjang dengan satah ABCD'))

# Contoh 1: kubus
P1 = Prism([(0, 0), (3, 0), (3, 3), (0, 3)], ['P', 'Q', 'V', 'U'], ['S', 'R', 'W', 'T'], 3)
o = P1.draw3d(120, 380, 78, c)
S(s, 'CONTOH 1', 'Normal kepada satah kubus',
  p(f'Rajah di sebelah menunjukkan kubus. Nyatakan normal kepada satah berikut. (a) {i("PQRS")} (b) {i("PSTU")} (c) {i("RSTW")} (d) {i("QRTU")}')
  + pen(s, [f'(a) {i("UP")}, {i("VQ")}, {i("WR")}, {i("TS")}', f'(b) {i("QP")}, {i("RS")}, {i("WT")}, {i("VU")}', f'(c) {i("QR")}, {i("PS")}, {i("UT")}, {i("VW")}', f'(d) {i("PV")}, {i("SW")}'], False)
  + note(f'Susunan huruf untuk menyatakan normal adalah penting. {i("TS")} bermaksud garis {i("TS")} berserenjang dengan satah {i("PQRS")} pada titik {i("S")}.', 'Tip:'),
  SV(o, 'Kubus PQRSTUVW'))

# Contoh 2: prisma dengan M, N titik tengah
P2 = Prism([(0, 0), (4, 0), (2, 2.6), (0, 2.6)], ['A', 'B', 'G', 'F'], ['D', 'C', 'H', 'E'], 3.6)
Pf, Pb, _ = P2.pts3d(110, 360, 66)
M_ = ((Pf[0][0] + Pf[1][0]) / 2, Pf[0][1]); N_ = ((Pb[0][0] + Pb[1][0]) / 2, Pb[0][1])
o = P2.draw3d(110, 360, 66, c) + GF.L(Pf[2], M_, AM, 2.2, '5 4') + GF.L(Pb[2], N_, AM, 2.2, '5 4') + GF.T(M_[0], M_[1] + 18, 'M', TX, 15) + GF.T(N_[0] + 6, N_[1] + 16, 'N', TX, 15)
S(s, 'CONTOH 2', 'Normal kepada satah prisma',
  p(f'Rajah di sebelah menunjukkan prisma tegak dengan tapak segi empat tepat {i("ABCD")}. {i("M")} dan {i("N")} ialah titik tengah {i("AB")} dan {i("CD")} masing-masing. Diberi {i("FG")} = {i("EH")} = {i("DN")} = {i("NC")} = {i("AM")} = {i("MB")}. Nyatakan normal kepada satah berikut. (a) {i("ABCD")} (b) {i("ADEF")}')
  + pen(s, [f'(a) {i("FA")}, {i("GM")}, {i("HN")}, {i("ED")}', f'(b) {i("BA")}, {i("CD")}, {i("GF")}, {i("HE")}']),
  SV(o, 'Prisma tegak ABCDEFGH dengan M dan N titik tengah AB dan CD'))

# unjuran ortogon: Rajah 1 dan Rajah 2
o = plane_h(40, 150, 300, 70, 80) + cap(70, 140, 'Rajah 1', MU3, 14)
Q1, R1, P1_ = (150, 200), (250, 190), (250, 70)
o += GF.L(Q1, P1_, AM, 3.5) + GF.L(P1_, R1, PK, 2.4, '6 5') + GF.L(Q1, R1, GR, 4) + GF.T(Q1[0] - 12, Q1[1] + 4, 'Q', TX, 15) + GF.T(P1_[0] + 12, P1_[1] - 4, 'P', TX, 15) + GF.T(R1[0] + 12, R1[1] + 6, 'R', TX, 15)
o += cap(300, 100, 'normal', PK, 14) + cap(330, 200, 'satah ABCD', MU3, 13)
o += plane_h(40, 360, 300, 70, 80) + cap(70, 350, 'Rajah 2', MU3, 14)
S2, R2, P2_, Q2 = (140, 405), (260, 395), (140, 290), (260, 260)
o += GF.L(P2_, Q2, AM, 3.5) + GF.L(P2_, S2, PK, 2.4, '6 5') + GF.L(Q2, R2, PK, 2.4, '6 5') + GF.L(S2, R2, GR, 4)
o += GF.T(P2_[0] - 12, P2_[1], 'P', TX, 15) + GF.T(Q2[0] + 12, Q2[1], 'Q', TX, 15) + GF.T(S2[0] - 12, S2[1] + 6, 'S', TX, 15) + GF.T(R2[0] + 12, R2[1] + 6, 'R', TX, 15)
o += cap(420, 395, 'unjuran ortogon', GR, 14) + cap(420, 270, 'objek', AM, 14)
S(s, 'DEFINISI', 'Unjuran ortogon',
  bul(s, [f'Dalam Rajah 1, {i("PQ")} ialah satu garis lurus dengan keadaan titik {i("Q")} berada pada satah mengufuk {i("ABCD")}. {i("PR")} ialah garis normal kepada satah {i("ABCD")}. Garis lurus {i("RQ")} yang terletak pada satah {i("ABCD")} ialah unjuran ortogon bagi garis lurus {i("PQ")} pada satah {i("ABCD")}.',
            f'Dalam Rajah 2, garis {i("PS")} dan {i("QR")} adalah normal kepada satah {i("ABCD")}. {i("SR")} ialah unjuran ortogon bagi garis lurus {i("PQ")} pada satah {i("ABCD")}.'])
  + de(s, '<b>Unjuran ortogon</b> ialah <b>imej</b> yang terbentuk pada suatu satah apabila <b>unjuran garis</b> dari objek <b>berserenjang</b> dengan satah tersebut.'),
  SV(o, 'Garis PQ dan unjuran ortogonnya pada satah mengufuk'))

# unjuran satah 2D dan objek 3D
o = plane_h(20, 330, 200, 80, 70)
sq_ = [(60, 130), (160, 130), (210, 90), (110, 90)]; pr_ = [(60, 400), (160, 400), (210, 360), (110, 360)]
o += '<polygon points="' + ' '.join(f'{a},{b}' for a, b in sq_) + f'" fill="{c}33" stroke="{c}" stroke-width="2.6"/>'
o += '<polygon points="' + ' '.join(f'{a},{b}' for a, b in pr_) + f'" fill="{GR}33" stroke="{GR}" stroke-width="2.6"/>'
for (a, b), (e, f_), lb, lb2 in zip(sq_, pr_, 'EFGH', 'RSTU'):
    o += GF.L((a, b), (e, f_), MU3, 1.6, '6 5') + GF.T(a - 10, b - 10, lb, TX, 14) + GF.T(e - 10, f_ + 14, lb2, TX, 14)
o += cap(130, 446, 'Rajah 4: satah mengufuk', MU3, 13)
Pk = Prism([(0, 0), (2.4, 0), (2.4, 1.8), (0, 1.8)], ['P', 'Q', 'V', 'U'], ['S', 'R', 'W', 'T'], 2.2)
o += plane_h(270, 360, 180, 70, 70) + Pk.draw3d(300, 220, 48, c, fs=13)
for x_, y_ in [(300, 220), (415, 220)]:
    o += GF.L((x_, y_), (x_, y_ + 175), MU3, 1.4, '6 5')
o += cap(370, 446, 'Rajah 5: satah mengufuk', MU3, 13)
S(s, 'KONSEP', 'Unjuran ortogon bagi satah dan objek',
  p(f'Dalam Rajah 4, objek {i("EFGH")} diunjurkan kepada satah mengufuk dan dalam Rajah 5, suatu kuboid diunjurkan kepada satah mengufuk.')
  + table(['Rajah', 'Objek', 'Normal kepada satah', 'Unjuran ortogon'], [['Rajah 4', i('EFGH'), f'{i("ER")}, {i("FS")}, {i("GT")}, {i("HU")}', i('RSTU')],
                                                                         ['Rajah 5', 'Kuboid', 'garis menegak dari setiap bucu tapak', 'segi empat tepat']], c, 17),
  SV(o, 'Satah EFGH dan kuboid diunjurkan kepada satah mengufuk'))

# Contoh 3
o = ''
o += plane_v(20, 70, 70, 120, 30) + f'<rect x="120" y="85" width="60" height="45" fill="{c}33" stroke="{c}" stroke-width="2.4"/>'
o += ''.join(GF.L((120, yy), (60, yy - 8), MU3, 1.4, '5 4') for yy in (85, 130)) + f'<rect x="38" y="70" width="28" height="44" fill="{GR}55" stroke="{GR}" stroke-width="2"/>' + GF.arrow((230, 108), (190, 108), PK, 3) + cap(100, 230, '(a)', MU3, 15)
o += plane_h(260, 200, 170, 50, 50) + f'<rect x="320" y="70" width="70" height="50" fill="{c}33" stroke="{c}" stroke-width="2.4"/>'
o += ''.join(GF.L((xx, 120), (xx, 225), MU3, 1.4, '5 4') for xx in (320, 390)) + f'<rect x="320" y="212" width="70" height="18" fill="{GR}55" stroke="{GR}" stroke-width="2"/>' + GF.arrow((355, 30), (355, 62), PK, 3) + cap(355, 280, '(b)', MU3, 15)
o += plane_h(140, 380, 220, 60, 60)
o += f'<path d="M250 300 L215 360 L285 360 Z" fill="{c}33" stroke="{c}" stroke-width="2.4"/>' + GF.L((250, 300), (190, 410), MU3, 1.4, '5 4') + GF.L((250, 300), (330, 410), MU3, 1.4, '5 4')
o += f'<ellipse cx="260" cy="410" rx="70" ry="16" fill="{GR}55" stroke="{GR}" stroke-width="2"/>' + GF.arrow((250, 262), (250, 292), PK, 3) + cap(250, 455, '(c)', MU3, 15)
S(s, 'CONTOH 3', 'Unjuran ortogon atau bukan',
  p('Setiap rajah di sebelah menunjukkan unjuran suatu objek pada satah mencancang atau satah mengufuk. Tentukan sama ada unjuran yang terhasil ialah unjuran ortogon atau bukan.')
  + pen(s, ['(a) Ya', '(b) Ya', '(c) Bukan kerana garis yang diunjurkan dari objek kepada satah <b>bukan normal</b>.']),
  SV(o, 'Tiga unjuran objek pada satah: dua dengan garis normal, satu dengan garis condong'))

S(s, 'LANGKAH', 'Cara melukis unjuran ortogon',
  steps(s, ['Kenal pasti jenis satah dan arah objek perlu diunjurkan.', 'Lukiskan garis normal daripada semua bucu objek tersebut kepada satah. Pastikan garis normal tersebut lurus dan tegak agar panjang sisi unjuran sama seperti panjang sisi objek.',
              'Sambungkan titik-titik persilangan normal dengan satah untuk melukis bentuk unjuran ortogon.', 'Lukis semula unjuran ortogon tersebut dengan ukuran yang sebenar. Labelkan semua bucu dan panjang sisi.']))

# Contoh 4
P4 = Prism([(0, 0), (7, 0), (7, 2), (5, 2), (3, 5), (0, 5)], ['A', 'B', 'K', 'L', 'G', 'F'], ['D', 'C', 'J', 'I', 'H', 'E'], 4)
s4 = 40
o = P4.draw3d(70, 390, s4, c, fs=15)
Pf, Pb, _ = P4.pts3d(70, 390, s4)
o += dimline(Pf[0], Pf[1], '7 cm', MU3, 18, 14, -1) + dimline(Pf[5], Pf[0], '5 cm', MU3, 18, 14, -1) + dimline(Pf[5], Pf[4], '3 cm', MU3, 16, 14, 1)
o += dimline(Pf[3], Pf[2], '2 cm', MU3, 14, 13, 1) + dimline(Pf[1], Pb[1], '4 cm', MU3, 16, 13, -1) + GF.T(Pf[1][0] + 28, (Pf[1][1] + Pf[2][1]) / 2, '2 cm', MU3, 13, 'start')
o += arrow_lbl((Pf[4][0] + 30, 40), (Pf[4][0] + 30, 80), 'Z') + arrow_lbl((470, 300), (440, 300), 'X') + arrow_lbl((Pf[0][0] + 120, 455), (Pf[0][0] + 120, 430), 'Y')
S(s, 'CONTOH 4', 'Melukis unjuran ortogon',
  p(f'Rajah di sebelah menunjukkan sebuah prisma tegak dengan tapak berbentuk segi empat tepat {i("ABCD")} yang terletak pada suatu satah mengufuk. Permukaan {i("ABKLGF")} ialah keratan rentas seragam prisma tersebut. Sisi-sisi {i("AF")} dan {i("BK")} adalah tegak.')
  + p('Lukis unjuran ortogon bagi objek tersebut pada')
  + bul(s, [f'(a) satah mengufuk sebagaimana dilihat dari arah {i("Z")}.', f'(b) satah mencancang sebagaimana dilihat dari arah {i("X")}.', f'(c) satah mencancang sebagaimana dilihat dari arah {i("Y")}.']),
  SV(o, 'Prisma tegak dengan keratan rentas ABKLGF dan arah pandangan X, Y, Z'))
s4b = 24
o = cap(110, 30, '(a) Arah Z: satah mengufuk', AM, 14) + P4.plan(30, 150, s4b, AM, 12) + dimline((30, 150), (30 + 7 * s4b, 150), '7 cm', MU3, 30, 12, -1) + dimline((30 + 7 * s4b, 150), (30 + 7 * s4b, 150 - 4 * s4b), '4 cm', MU3, 30, 12, -1)
o += cap(380, 30, '(b) Arah X: satah mencancang', PK, 14) + P4.side(330, 200, s4b, 'kanan', PK, 12) + dimline((330, 200), (330 + 4 * s4b, 200), '4 cm', MU3, 18, 12, -1)
o += cap(200, 270, '(c) Arah Y: satah mencancang', TR, 14) + P4.front(110, 440, s4b, TR, 12) + dimline((110, 440), (110 + 7 * s4b, 440), '7 cm', MU3, 14, 12, -1)
S(s, 'CONTOH 4 (sambungan)', 'Unjuran ortogon prisma',
  p('<b>Penyelesaian:</b>')
  + bul(s, [f'(a) Susunan huruf adalah mengikut arah pandangan. Titik {i("D")} berada di bawah titik {i("E")} apabila dipandang dari arah {i("Z")}, maka ditulis {i("E")}/{i("D")}.',
            f'(b) Titik {i("A")} berada di belakang titik {i("B")} apabila dilihat dari arah {i("X")}, maka ditulis {i("B")}/{i("A")}.',
            f'(c) Titik {i("D")} berada di belakang titik {i("A")} apabila dilihat dari arah {i("Y")}, maka ditulis {i("A")}/{i("D")}.']),
  SV(o, 'Unjuran ortogon prisma dari arah Z, X dan Y'))

# Contoh 5: silinder diameter 5, tinggi 7
o = ''
cx_, top, bot, rx, ry = 110, 110, 330, 62, 18
o += f'<ellipse cx="{cx_}" cy="{bot}" rx="{rx}" ry="{ry}" fill="{c}22" stroke="{c}" stroke-width="2.6"/>'
o += f'<rect x="{cx_ - rx}" y="{top}" width="{2 * rx}" height="{bot - top}" fill="{c}22" stroke="none"/>' + GF.L((cx_ - rx, top), (cx_ - rx, bot), c, 2.6) + GF.L((cx_ + rx, top), (cx_ + rx, bot), c, 2.6)
o += f'<ellipse cx="{cx_}" cy="{top}" rx="{rx}" ry="{ry}" fill="#1B2A44" stroke="{c}" stroke-width="2.6"/>'
o += GF.T(cx_ - rx - 10, top - 10, 'D', TX, 14) + GF.T(cx_ + rx + 10, top - 10, 'C', TX, 14) + GF.T(cx_ - rx - 10, bot + 6, 'A', TX, 14) + GF.T(cx_ + rx + 10, bot + 6, 'B', TX, 14)
o += GF.T(cx_ - rx - 14, (top + bot) / 2, '7 cm', MU3, 14, 'end') + GF.T(cx_, bot + 36, '5 cm', MU3, 14) + arrow_lbl((cx_, 40), (cx_, 78), 'Z') + arrow_lbl((cx_, 430), (cx_, 395), 'Y')
o += cap(360, 36, '(a) Arah Z', AM, 14) + f'<circle cx="360" cy="125" r="70" fill="{AM}22" stroke="{AM}" stroke-width="2.6"/>' + GF.T(286, 132, 'A', TX, 14) + GF.T(436, 132, 'B', TX, 14) + dimline((290, 200), (430, 200), '5 cm', MU3, 4, 13, -1)
o += cap(360, 240, '(b) Arah Y', PK, 14) + f'<rect x="325" y="260" width="70" height="98" fill="{PK}22" stroke="{PK}" stroke-width="2.6"/>'
o += GF.T(316, 262, 'D', TX, 14) + GF.T(404, 262, 'C', TX, 14) + GF.T(316, 360, 'A', TX, 14) + GF.T(404, 360, 'B', TX, 14) + GF.T(405, 309, '7 cm', MU3, 13, 'start') + GF.T(360, 380, '5 cm', MU3, 13)
o += GF.T(360, 440, 'Skala: 1 cm diwakili 14 px', MU, 12, halo=False)
S(s, 'CONTOH 5', 'Unjuran ortogon silinder',
  p(f'Rajah di sebelah menunjukkan objek berbentuk silinder yang terletak pada suatu satah mengufuk. Diberi diameter silinder ialah 5 cm dan tingginya 7 cm. Lukis unjuran ortogon objek silinder tersebut pada')
  + bul(s, [f'(a) satah mengufuk sebagaimana dilihat dari arah {i("Z")}.', f'(b) satah mencancang sebagaimana dilihat dari arah {i("Y")}.'])
  + pen(s, ['(a) Unjuran ortogon ialah bulatan berdiameter 5 cm.', '(b) Unjuran ortogon ialah segi empat tepat 5 cm × 7 cm.']),
  SV(o.replace(GF.T(360, 440, 'Skala: 1 cm diwakili 14 px', MU, 12, halo=False), ''), 'Silinder dan unjuran ortogonnya: bulatan dari atas dan segi empat tepat dari depan'))

# Contoh 6: keratan rentas segi tiga URQ, QR 8, UR 6, PQ 3
assert math.hypot(8, 6) == 10
P6 = Prism([(0, 0), (8, 0), (8, 6)], ['Q', 'R', 'U'], ['P', 'S', 'T'], 3)
o = P6.draw3d(50, 330, 38, c)
Pf, Pb, _ = P6.pts3d(50, 330, 38)
o += dimline(Pf[0], Pf[1], '8 cm', MU3, 18, 14, -1) + dimline(Pf[1], Pf[2], '6 cm', MU3, 16, 14, -1) + dimline(Pf[0], Pb[0], '3 cm', MU3, 14, 13, 1)
o += arrow_lbl((Pf[2][0] + 22, 40), (Pf[2][0] + 22, 80), 'Z') + arrow_lbl((Pf[0][0] + 150, 440), (Pf[0][0] + 150, 405), 'X')
S(s, 'CONTOH 6', 'Panjang sisi dan saiz sudut unjuran',
  p(f'Rajah di sebelah menunjukkan prisma tegak dengan tapak segi empat tepat {i("PQRS")} terletak pada suatu satah mengufuk. Satah {i("URQ")} ialah keratan rentas seragam objek.')
  + p(f'(a) Lukiskan dengan skala penuh unjuran ortogon prisma itu pada (i) satah mengufuk sebagaimana dilihat dari arah {i("Z")}. (ii) satah mencancang sebagaimana dilihat dari arah {i("X")}.')
  + p('(b) Nyatakan kesimpulan anda tentang panjang sisi dan saiz sudut di antara objek dengan unjuran ortogon masing-masing. Jelaskan kesimpulan anda.'),
  SV(o, 'Prisma tegak dengan keratan rentas segi tiga bersudut tegak URQ'))
s6 = 30
o = cap(140, 40, '(a)(i) Arah Z', AM, 14) + P6.plan(40, 170, s6, AM, 12) + dimline((40, 170), (40 + 8 * s6, 170), '8 cm', MU3, 30, 12, -1) + dimline((40 + 8 * s6, 170), (40 + 8 * s6, 170 - 3 * s6), '3 cm', MU3, 36, 12, -1)
o += cap(140, 225, '(a)(ii) Arah X', TR, 14) + P6.front(50, 430, s6, TR, 12) + GF.T(50 + 8 * s6 + 30, 430 - 3 * s6, '6 cm', MU3, 13, 'start') + GF.T(50 + 4 * s6, 456, '8 cm', MU3, 13) + GF.T(50 + 4 * s6 - 20, 430 - 3 * s6 - 18, '10 cm', MU3, 13)
o += f'<path d="M{50 + 8 * s6 - 12} 430 L{50 + 8 * s6 - 12} 418 L{50 + 8 * s6} 418" fill="none" stroke="{TX}" stroke-width="2"/>'
S(s, 'CONTOH 6 (sambungan)', 'Kesimpulan',
  work([('(b)(i)', [f'Panjang sisi {i("TU")}, {i("SR")}, {i("PQ")}, {i("PS")} dan {i("QR")} serta saiz sudut tegak tidak berubah pada unjuran ortogon sebagaimana dilihat dari arah {i("Z")}. Panjang sisi {i("TP")} dan {i("UQ")} berubah.']),
        ('(b)(ii)', [f'Panjang sisi {i("TP")}, {i("UQ")}, {i("PS")}, {i("QR")}, {i("TS")} dan {i("UR")} serta saiz semua sudut tidak berubah pada unjuran ortogon sebagaimana dilihat dari arah {i("X")}.'])], s, 1, 18)
  + de(s, 'Secara generalisasi, panjang sisi dan saiz sudut pada unjuran ortogon suatu objek berbeza mengikut arah pandangan.'),
  SV(o, 'Pelan prisma dari arah Z dan unjuran segi tiga dari arah X'))

# =====================================================================
# 7.2 PELAN DAN DONGAKAN
# =====================================================================
s = '7.2'
c = COL[s]
PP = Prism([(0, 0), (4, 0), (4, 4), (3, 4), (3, 2), (1, 2), (1, 3), (0, 3)], list('ABCDEFGH'), list('JKLMNOPI'), 4)
o = PP.draw3d(70, 380, 44, TR, fs=14)
Pf, Pb, _ = PP.pts3d(70, 380, 44)
o += arrow_lbl((Pf[3][0] + 40, 40), (Pf[3][0] + 40, 78), 'Z') + arrow_lbl((Pf[0][0] + 88, 455), (Pf[0][0] + 88, 425), 'X') + arrow_lbl((475, 290), (445, 290), 'Y')
S(s, 'DEFINISI', 'Pelan dan dongakan',
  p('Anda telah pelajari bahawa unjuran ortogon suatu objek atau pepejal boleh dilukis pada satah mengufuk dan satah mencancang.')
  + de(s, '<b>Unjuran ortogon</b> pada <b>satah mengufuk</b> yang dilihat dari pandangan atas dikenali sebagai <b>pelan</b>. <b>Unjuran ortogon</b> pada <b>satah mencancang</b> yang dilihat dari pandangan sisi atau pandangan depan dikenali sebagai <b>dongakan</b>.')
  + p('Lukisan unjuran ortogon memberi maklumat tepat berkaitan reka bentuk dan saiz suatu objek.')
  + note('Skala penuh bermaksud ukuran sebenar.', 'Tip:'),
  SV(o, 'Prisma tegak dengan arah pandangan X, Y dan Z'))
s0 = 26
o = cap(90, 30, 'Pelan (arah Z)', AM, 14) + PP.plan(30, 160, s0, AM, 12)
o += cap(360, 30, 'Dongakan depan (arah X)', TR, 14) + PP.front(300, 170, s0, TR, 12)
o += cap(140, 250, 'Dongakan sisi (arah Y)', PK, 14) + PP.side(80, 400, s0, 'kanan', PK, 12)
o += cap(370, 300, 'Garis padu: sisi kelihatan', MU3, 13) + cap(370, 325, 'Garis sempang: sisi terlindung', MU3, 13)
S(s, 'KONSEP', 'Melukis pelan dan dongakan mengikut skala',
  p(f'Rajah sebelum ini menunjukkan prisma tegak dengan tapak berbentuk segi empat tepat {i("ABKJ")} terletak pada suatu satah mengufuk. {i("ABCDEFGH")} ialah keratan rentas seragam prisma tersebut. Pelan boleh dilukis seperti yang dilihat dari arah {i("Z")} dan dongakan boleh dilukis seperti yang dilihat dari arah {i("X")} dan arah {i("Y")}.')
  + bul(s, [f'<b>Pelan</b>: semua sisi dilukis dengan <b>garis padu</b> kerana dapat dilihat dari pandangan atas.', f'<b>Dongakan depan</b>: semua sisi dilukis dengan garis padu kerana dapat dilihat dari arah {i("X")}.',
            f'<b>Dongakan sisi</b>: garis {i("GP")}, {i("HI")}, {i("EN")} dan {i("FO")} dilukis dengan <b>garis sempang</b> kerana sisi tersebut terlindung dari pandangan mata sebagaimana dilihat dari arah {i("Y")}.']),
  SV(o, 'Pelan, dongakan depan dan dongakan sisi prisma tegak'))

# kaedah empat sukuan
o = ''
for k, (x0, ttl, tl, tr_, bl, br) in enumerate([(20, 'Kaedah 1', 'Dongakan sisi', 'Dongakan depan', '45°', 'Pelan'), (260, 'Kaedah 2', 'Dongakan depan', 'Dongakan sisi', 'Pelan', '45°')]):
    cx_, cy_ = x0 + 110, 230
    o += cap(cx_, 70, ttl, c, 16) + GF.L((x0, cy_), (x0 + 220, cy_), MU, 1.6) + GF.L((cx_, 100), (cx_, 360), MU, 1.6)
    o += cap(cx_ - 55, 130, 'Sukuan Kedua', MU3, 12) + cap(cx_ + 55, 130, 'Sukuan Pertama', MU3, 12) + cap(cx_ - 55, 330, 'Sukuan Ketiga', MU3, 12) + cap(cx_ + 55, 330, 'Sukuan Keempat', MU3, 12)
    o += cap(cx_ - 55, 185, tl, PK if 'sisi' in tl else TR, 14) + cap(cx_ + 55, 185, tr_, PK if 'sisi' in tr_ else TR, 14)
    o += cap(cx_ - 55, 280, bl, AM, 14) + cap(cx_ + 55, 280, br, AM, 14)
    o += GF.L((cx_, cy_), (cx_ - 70, cy_ + 70), MU3, 1.4) if k == 0 else GF.L((cx_, cy_), (cx_ + 70, cy_ + 70), MU3, 1.4)
S(s, 'KONSEP', 'Pelan dan dongakan dalam empat sukuan',
  p('Lukisan pelan, dongakan depan dan dongakan sisi suatu objek juga boleh dilukis secara gabungan pada sehelai kertas yang dibahagikan kepada empat sukuan.')
  + bul(s, ['Kedudukan dongakan depan adalah pada bahagian atas pelan. Dongakan sisi dilukis pada bahagian kiri atau bahagian kanan dongakan depan, mengikut arah pandangan.',
            'Dalam kaedah 1, pandangan sisi adalah dari kanan ke kiri. Maka, kedudukan dongakan ini adalah di sebelah kiri dongakan depan.',
            'Dalam kaedah 2, pandangan sisi adalah dari kiri ke kanan. Maka, kedudukan dongakan ini adalah di sebelah kanan dongakan depan.']),
  SV(o, 'Kaedah 1 dan kaedah 2 susunan pelan dan dongakan dalam empat sukuan'))

# Contoh 7
P7 = Prism([(0, 0), (5, 0), (5, 6), (3, 4), (0, 4)], ['A', 'B', 'H', 'G', 'F'], ['D', 'C', 'I', 'J', 'E'], 4)
o = P7.draw3d(60, 390, 40, TR, fs=15)
Pf, Pb, _ = P7.pts3d(60, 390, 40)
o += dimline(Pf[0], Pf[1], '5 cm', MU3, 18, 14, -1) + dimline(Pf[4], Pf[0], '4 cm', MU3, 18, 14, -1) + dimline(Pf[4], Pf[3], '3 cm', MU3, 14, 13, 1) + dimline(Pf[1], Pb[1], '4 cm', MU3, 16, 13, -1)
o += GF.T(Pf[1][0] + 30, (Pf[1][1] + Pf[2][1]) / 2, '6 cm', MU3, 13, 'start')
o += arrow_lbl((Pf[0][0] + 100, 455), (Pf[0][0] + 100, 425), 'X') + arrow_lbl((475, 250), (445, 250), 'Y')
S(s, 'CONTOH 7', 'Melukis pelan dan dongakan',
  p(f'Rajah di sebelah menunjukkan prisma tegak dengan tapak berbentuk segi empat tepat {i("ABCD")} terletak pada suatu satah mengufuk. {i("ABHGF")} ialah keratan rentas seragam prisma tersebut. Sisi-sisi {i("AF")} dan {i("BH")} adalah tegak. Lukis dengan skala penuh')
  + bul(s, ['(a) pelan prisma.', f'(b) dongakan prisma dari arah {i("X")}.', f'(c) dongakan prisma dari arah {i("Y")}.']),
  SV(o, 'Prisma tegak dengan keratan rentas ABHGF'))
o = quad(P7, 24, 180, 230, 1)
S(s, 'CONTOH 7 (sambungan)', 'Penyelesaian',
  steps(s, [f'Arah dongakan sisi (arah {i("Y")}) adalah ke kiri, maka kedudukan dongakan sisi pada sukuan kedua.', 'Lukiskan pelan dengan skala penuh pada sukuan keempat.',
            f'Unjurkan sisi pelan dengan garis halus ke sukuan pertama sebagai panduan untuk melukis dongakan depan (arah {i("X")}).', 'Unjurkan sisi dongakan depan dan pelan sehingga ke sukuan kedua untuk melukis dongakan sisi.'])
  + note(f'Dalam dongakan sisi, garis pada aras {i("G")}/{i("F")} dilukis dengan garis sempang kerana terlindung oleh permukaan {i("BHIC")}.', 'Ingat:'),
  SV(o, 'Pelan, dongakan depan dan dongakan sisi prisma dalam empat sukuan kaedah 1'))

# Contoh 8
P8 = Prism([(0, 0), (6, 0), (6, 3), (4, 5), (0, 5), (0, 3)], ['A', 'B', 'G', 'H', 'I', 'F'], ['D', 'C', 'L', 'K', 'J', 'E'], 5)
o = P8.draw3d(70, 395, 36, TR, fs=15)
Pf, Pb, _ = P8.pts3d(70, 395, 36)
o += dimline(Pf[0], Pf[1], '6 cm', MU3, 18, 14, -1) + dimline(Pf[5], Pf[0], '3 cm', MU3, 18, 14, -1) + dimline(Pf[4], Pf[3], '4 cm', MU3, 14, 13, 1) + dimline(Pf[1], Pb[1], '5 cm', MU3, 16, 13, -1)
o += GF.T(Pf[5][0] - 14, (Pf[4][1] + Pf[5][1]) / 2, '2 cm', MU3, 13, 'end')
o += arrow_lbl((Pf[0][0] + 108, 455), (Pf[0][0] + 108, 425), 'X') + arrow_lbl((22, 400), (52, 400), 'Y')
S(s, 'CONTOH 8', 'Gabungan kuboid dan prisma tegak',
  p(f'Rajah di sebelah menunjukkan gabungan kuboid dan prisma tegak dengan tapak berbentuk segi empat tepat {i("ABCD")} yang terletak pada suatu satah mengufuk. {i("ABGHIF")} ialah keratan rentas seragam objek. Sisi-sisi {i("AF")}, {i("FI")} dan {i("BG")} adalah tegak. Lukis dengan skala penuh')
  + bul(s, ['(a) pelan objek.', f'(b) dongakan objek dari arah {i("X")}.', f'(c) dongakan objek dari arah {i("Y")}.']),
  SV(o, 'Gabungan kuboid dan prisma tegak dengan keratan rentas ABGHIF'))
o = quad(P8, 24, 230, 205, 2)
S(s, 'CONTOH 8 (sambungan)', 'Penyelesaian',
  p(f'Arah dongakan sisi (arah {i("Y")}) adalah dari kiri ke kanan, maka kedudukan dongakan sisi adalah pada sukuan pertama.')
  + steps(s, ['Lukis pelan dengan skala penuh pada sukuan ketiga.', 'Unjurkan sisi pelan ke atas untuk melukis dongakan depan pada sukuan kedua.',
              'Unjurkan sisi pelan melalui garis 45° dan sisi dongakan depan ke sukuan pertama untuk melukis dongakan sisi.'])
  + note('Garis padu tebal untuk sisi yang nampak. Garis sempang untuk sisi terlindung. Garis padu halus untuk garis binaan.', 'Tip:'),
  SV(o, 'Pelan, dongakan depan dan dongakan sisi dalam empat sukuan kaedah 2'))

# Contoh 9: mensintesis
P9 = Prism([(0, 0), (4, 0), (4, 3), (2.5, 3), (2.5, 2), (1.5, 2), (1.5, 3), (0, 3)], list('ABCDEFGH'), list('JKLMNPQR'), 3)
o = quad(P9, 26, 220, 175, 1)
S(s, 'CONTOH 9', 'Mensintesis pelan dan dongakan',
  p('Lukisan pelan dan dongakan pada empat sukuan yang dihubungkan antara satu dengan lain boleh digunakan untuk melakar bentuk tiga dimensi objek tersebut dengan mudah.')
  + p('Rajah di sebelah menunjukkan pelan, dongakan depan dan dongakan sisi bagi sebuah prisma tegak dengan tapak berbentuk segi empat tepat. Suatu bongkah berbentuk kuboid telah dikeluarkan dari prisma tersebut. Lakar bentuk tiga dimensi prisma tersebut.')
  + note('Ukuran sebenar: lebar 4 cm, dalam 3 cm, tinggi 3 cm. Bongkah kuboid yang dikeluarkan berukuran 1 cm × 1 cm × 3 cm.', 'Diberi:'),
  SV(o, 'Pelan dan dongakan prisma tegak yang telah dikeluarkan bongkah kuboid'))
o = P9.draw3d(70, 360, 62, TR, fs=15)
Pf, Pb, _ = P9.pts3d(70, 360, 62)
o += dimline(Pf[0], Pf[1], '4 cm', MU3, 18, 14, -1) + dimline(Pf[7], Pf[0], '3 cm', MU3, 18, 14, -1) + dimline(Pf[1], Pb[1], '3 cm', MU3, 16, 13, -1) + dimline(Pf[5], Pf[4], '1 cm', MU3, 12, 13, -1)
S(s, 'CONTOH 9 (sambungan)', 'Melakar bentuk tiga dimensi',
  p('Kedudukan dongakan sisi adalah di sukuan kedua. Maka, pandangan dongakan sisi adalah dari arah kanan.')
  + steps(s, ['Lakarkan ketiga-tiga unjuran ortogon yang diberi pada satah yang berkaitan dengan menggunakan ukuran sebenar.', 'Unjurkan permukaan-permukaan supaya bertemu.',
              'Lakarkan objek dan labelkan bucu-bucu berkaitan dengan huruf dalam unjuran.', 'Lengkapkan lakaran objek dengan melabelkan panjang sisi.']),
  SV(o, 'Lakaran tiga dimensi prisma tegak dengan alur di bahagian atas'))

# Contoh 10: gabungan kuboid dan prisma, sudut 60°
hJ = 1.5 + 4 * math.sin(math.radians(60))
P10 = Prism([(0, 0), (7, 0), (7, 1.5), (2, hJ), (0, 1.5)], ['A', 'B', 'G', 'J', 'F'], ['D', 'C', 'H', 'I', 'E'], 4.5)
o = quad(P10, 22, 240, 195, 2)
S(s, 'CONTOH 10', 'Melakar gabungan objek',
  p('Rajah di sebelah menunjukkan pelan, dongakan depan dan dongakan sisi bagi gabungan sebuah kuboid dan prisma tegak. Lakar bentuk tiga dimensi gabungan objek tersebut.')
  + note(f'{i("AB")} = 7 cm, {i("AF")} = 1.5 cm, {i("BC")} = 4.5 cm, {i("FJ")} = 4 cm dan ∠{i("JFG")} = 60°.', 'Diberi:')
  + p('Kedudukan dongakan sisi adalah di sukuan pertama. Maka, pandangan dongakan sisi adalah dari kiri ke kanan.'),
  SV(o, 'Pelan dan dongakan gabungan kuboid dan prisma tegak'))
o = P10.draw3d(60, 380, 40, TR, fs=15)
Pf, Pb, _ = P10.pts3d(60, 380, 40)
o += dimline(Pf[0], Pf[1], '7 cm', MU3, 18, 14, -1) + dimline(Pf[4], Pf[3], '4 cm', MU3, 16, 14, 1) + dimline(Pf[1], Pb[1], '4.5 cm', MU3, 16, 13, -1)
o += GF.T(Pf[0][0] - 14, (Pf[0][1] + Pf[4][1]) / 2, '1.5 cm', MU3, 13, 'end')
o += f'<path d="M{Pf[4][0] + 30:.1f} {Pf[4][1]:.1f} A30 30 0 0 0 {Pf[4][0] + 15:.1f} {Pf[4][1] - 26:.1f}" fill="none" stroke="{AM}" stroke-width="2"/>' + GF.T(Pf[4][0] + 44, Pf[4][1] - 16, '60°', AM, 14)
S(s, 'CONTOH 10 (sambungan)', 'Melakar gabungan objek',
  steps(s, ['Lakarkan ketiga-tiga unjuran ortogon yang diberi pada satah yang berkaitan dengan menggunakan ukuran yang sebenar. Soalan ini mengandungi sudut 60° pada permukaan berbentuk segi tiga. Maka, sudut 60° mesti dibina dengan kaedah yang betul.',
            'Sambungkan bucu-bucu untuk menghasilkan objek gabungan. Labelkan bucu mengikut unjuran.', 'Lukis gabungan objek dengan ukuran yang tepat dan labelkan bucu dan panjang sisi.']),
  SV(o, 'Lakaran tiga dimensi gabungan kuboid dan prisma tegak dengan sudut 60 darjah'))

# Contoh 11: kuboid 9 × 5 × 4, prisma trapezium dikeluarkan
FG = math.hypot(1, 2); Vk, Vr = 9 * 5 * 4, (5 + 4) / 2 * 2 * 5
assert f'{FG:.1f}' == '2.2' and Vk == 180 and Vr == 45 and (Vk - Vr) == 135
P11 = Prism([(0, 0), (9, 0), (9, 4), (5, 4), (5, 2), (1, 2), (0, 4)], ['A', 'B', 'N', 'K', 'J', 'G', 'F'], ['D', 'C', 'M', 'L', 'I', 'H', 'E'], 5)
o = quad(P11, 20, 215, 170, 1) + cap(350, 432, 'FK = 5 cm, GJ = 4 cm,', MU3, 13) + cap(350, 452, 'kedalaman alur 2 cm, BC = 5 cm', MU3, 13)
S(s, 'CONTOH 11', 'Menyelesaikan masalah pelan dan dongakan',
  p('Rajah di sebelah menunjukkan pelan, dongakan depan dan dongakan sisi suatu prisma tegak.')
  + bul(s, ['(a) Lukis dengan skala penuh prisma tegak tersebut.', f'(b) Nyatakan panjang sisi {i("FG")}, dalam cm, betul kepada satu tempat perpuluhan.',
            f'(c) Pada asalnya, prisma tersebut merupakan sebuah kuboid dengan ukuran 9 cm × 5 cm × 4 cm. Hitung isi padu prisma tegak {i("EFGHIJKL")}, dalam cm<sup>3</sup>, yang telah dikeluarkan dari kuboid tersebut.',
            '(d) Nyatakan nisbah isi padu prisma tegak yang dikeluarkan berbanding dengan prisma tegak yang anda lukis di dalam soalan (a).'])
  ,
  SV(o, 'Pelan dan dongakan prisma tegak yang dihasilkan daripada kuboid'))
o = P11.draw3d(75, 380, 31, TR, fs=14)
Pf, Pb, _ = P11.pts3d(75, 380, 31)
o += dimline(Pf[0], Pf[1], '9 cm', MU3, 18, 14, -1) + dimline(Pf[6], Pf[0], '4 cm', MU3, 18, 14, -1) + dimline(Pf[1], Pb[1], '5 cm', MU3, 16, 13, -1)
S(s, 'CONTOH 11 (sambungan)', 'Penyelesaian',
  work([('(b)', [f'{i("FG")} = 2.2 cm']),
        ('(c)', ['Isi padu prisma yang dikeluarkan', f'= {F(1, 2)}(2 cm)(4 + 5) cm × 5 cm', '= 45 cm<sup>3</sup>']),
        ('(d)', ['Isi padu prisma tegak yang dilukis', f'= Isi padu kuboid − isi padu prisma {i("EFGHIJKL")}', '= (9 cm × 5 cm × 4 cm) − 45 cm<sup>3</sup>', '= 180 cm<sup>3</sup> − 45 cm<sup>3</sup>',
                 '= 135 cm<sup>3</sup>', 'Maka, nisbah 45 : 135 = 1 : 3'])], s, 1, 17),
  SV(o, 'Lakaran tiga dimensi prisma tegak (a)'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'pelan', 'slides.js')
HEAD = '/* Nota Bab 7 ikut buku teks Matematik T3 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
