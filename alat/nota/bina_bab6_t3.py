"""Bab 6 T3 Sudut dan Tangen bagi Bulatan: nota ikut buku teks (ayat buku, nombor dan nama ditukar).
Subtopik ikut buku: 6.1, 6.2, 6.3, 6.4 (sama dengan folder sudutbulatan)."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
import rajah2d as RJ
from rajah2d import P as Pc, circle, lab, seg, ang, angbig, arc, rt, tick, side, labp, ext, dot, poly, tangent
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX, RD

SUBS = [{"no": "6.1", "name": "Sudut Lilitan & Sudut Pusat", "col": "#38BDF8"}, {"no": "6.2", "name": "Sisi Empat Kitaran", "col": "#A78BFA"},
        {"no": "6.3", "name": "Tangen kepada Bulatan", "col": "#34D399"}, {"no": "6.4", "name": "Sudut dan Tangen", "col": "#FB923C"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def i(s):
    return f'<i>{s}</i>'


def an(s):
    return f'∠{i(s)}'


F = fr
C0 = (250, 240, 165)       # bulatan utama rajah
NTS = GF.T(250, 456, 'Rajah tidak mengikut skala', MU, 14, halo=False)


def chords(c, pairs, col=TX, w=3):
    return ''.join(seg(Pc(c, a), Pc(c, b), col, w) for a, b in pairs)


def labs(c, d, off=20, size=17):
    return ''.join(lab(c, a, s, off, TX, size) for s, a in d.items())


# =====================================================================
# 6.1 SUDUT PADA LILITAN DAN SUDUT PUSAT
# =====================================================================
s = '6.1'
c = COL[s]
cA = (130, 190, 95)
o = circle(cA) + chords(cA, [(200, 95), (95, -20)], c) + arc(cA, 200, 340, PK, 5) + labs(cA, {'P': 200, 'Q': 95, 'R': -20})
o += ang(Pc(cA, 95), Pc(cA, 200), Pc(cA, -20), '', AM, 26) + GF.T(130, 312, 'Lengkok PR', PK, 15) + GF.T(130, 40, 'Rajah 1', MU3, 15)
cB = (370, 250, 100)
o += circle(cB) + chords(cB, [(200, 150), (150, 60), (200, 110), (110, 60)], c) + arc(cB, 200, 60, AM, 5) + arc(cB, 110, 150, GR, 5)
o += labs(cB, {'P': 200, 'Q': 150, 'R': 110, 'S': 60}) + GF.T(370, 392, 'lengkok major PS', AM, 14) + GF.T(370, 412, 'lengkok minor RQ', GR, 14) + GF.T(370, 440, 'Rajah 2', MU3, 15)
S(s, 'DEFINISI', 'Sudut pada lilitan bulatan',
  p(f'Rajah 1 menunjukkan dua perentas, {i("PQ")} dan {i("QR")} yang bertemu di titik {i("Q")} pada lilitan bulatan.')
  + de(s, f'{an("PQR")} ialah <b>sudut pada lilitan bulatan</b> yang <b>dicangkum</b> oleh lengkok {i("PR")}.')
  + p('Dalam Rajah 2,')
  + bul(s, [f'(a) {an("PQS")} dan {an("PRS")} ialah sudut-sudut pada lilitan bulatan yang dicangkum oleh <b>lengkok major</b> {i("PS")}.',
            f'(b) {an("QPR")} dan {an("QSR")} ialah sudut-sudut pada lilitan bulatan yang dicangkum oleh <b>lengkok minor</b> {i("RQ")}.']),
  SV(o, 'Rajah 1 sudut PQR dicangkum lengkok PR, Rajah 2 sudut dicangkum lengkok major dan minor'))

o = circle(C0) + arc(C0, 235, 305, PK, 6)
Pp, Qp = Pc(C0, 235), Pc(C0, 305)
for d, col in [(150, TR), (95, AM), (40, GR)]:
    V = Pc(C0, d); o += seg(Pp, V, col) + seg(Qp, V, col) + ang(V, Pp, Qp, '', col, 30)
o += labs(C0, {'P': 235, 'Q': 305, 'S': 150, 'R': 40, 'T': 95})
o += GF.T(250, 456, '∠PRQ = ∠PSQ = ∠PTQ', AM, 18)
S(s, 'SIFAT', 'Sudut yang dicangkum oleh lengkok yang sama',
  p('Secara generalisasi,')
  + de(s, 'Sudut-sudut pada suatu lilitan bulatan yang dicangkum oleh lengkok yang sama adalah sama besar.')
  + formula(f'{an("PRQ")} = {an("PSQ")} = {an("PTQ")}', c),
  SV(o, 'Tiga sudut pada lilitan di R, S dan T dicangkum oleh lengkok PQ yang sama'))

# Contoh 1
A, B, Cc, E = Pc(C0, 140), Pc(C0, 70), Pc(C0, 5), Pc(C0, 205)
D = Pc(C0, 295, C0[2] * 1.32)
o = circle(C0) + seg(A, B, c) + seg(B, E, c) + seg(A, Cc, AM) + seg(Cc, E, AM) + seg(A, D, MU3, 2.5) + seg(E, D, MU3, 2.5)
o += ang(B, A, E, '35°', TX, 34, 15, 54) + ang(Cc, A, E, i('y'), AM, 34, 16, 54) + ang(D, A, E, '28°', MU3, 30, 14, 48)
o += labs(C0, {'A': 140, 'B': 70, 'C': 5, 'E': 205}) + labp(D, (250, 240), 'D', 14)
S(s, 'CONTOH 1', 'Sudut yang dicangkum oleh lengkok yang sama',
  p(f'Berdasarkan rajah di sebelah, hitung nilai {i("y")}.')
  + pen(s, [f'{i("y")} = {an("ABE")} = 35°'])
  + note(f'{i("y")} = {an("ABE")} = 35°. {an("ADE")} ≠ 35° kerana {an("ADE")} bukan sudut pada lilitan bulatan yang dicangkum oleh lengkok {i("AE")}.', 'Buletin:'),
  SV(o, 'Bulatan dengan sudut 35 darjah di B dan y di C dicangkum lengkok AE, titik D di luar bulatan'))

# lengkok sama panjang / berkadaran
c1 = (130, 200, 100)
o = circle(c1) + arc(c1, 95, 135, PK, 6) + arc(c1, 275, 315, PK, 6)
o += seg(Pc(c1, 95), Pc(c1, 205), c) + seg(Pc(c1, 135), Pc(c1, 205), c) + seg(Pc(c1, 275), Pc(c1, 40), c) + seg(Pc(c1, 315), Pc(c1, 40), c)
o += labs(c1, {'P': 95, 'Q': 135, 'S': 275, 'U': 315, 'R': 205, 'T': 40}, 16, 15)
c2 = (370, 260, 100)
o += circle(c2) + arc(c2, 260, 290, GR, 6) + arc(c2, 80, 170, AM, 6)
V1, V2 = Pc(c2, 200), Pc(c2, 20)
o += seg(Pc(c2, 260), Pc(c2, 120), c) + seg(Pc(c2, 290), Pc(c2, 120), c) + seg(Pc(c2, 80), Pc(c2, 330), c) + seg(Pc(c2, 170), Pc(c2, 330), c)
o += ang(Pc(c2, 120), Pc(c2, 260), Pc(c2, 290), i('x'), GR, 34, 14, 50) + ang(Pc(c2, 330), Pc(c2, 80), Pc(c2, 170), f'3{i("x")}', AM, 34, 14, 52)
o += GF.T(370, 385, f'{i("y")} cm', GR, 15) + GF.T(298, 160, f'3{i("y")} cm', AM, 15)
S(s, 'SIFAT', 'Lengkok sama panjang dan lengkok berkadaran',
  p('Secara generalisasi,')
  + de(s, f'Sudut-sudut pada lilitan bulatan yang dicangkum oleh lengkok yang sama panjang adalah sama saiz. Jika panjang lengkok {i("PQ")} = panjang lengkok {i("SU")} maka, {an("PRQ")} = {an("STU")}.')
  + de(s, 'Saiz sudut pada lilitan bulatan yang dicangkum oleh suatu lengkok adalah berkadaran dengan panjang lengkok tersebut.'),
  SV(o, 'Lengkok sama panjang memberi sudut sama, lengkok tiga kali panjang memberi sudut tiga kali besar'))

# Contoh 2: lengkok PR = QS, sudut 52
pP, pR, pQ, pS = 100, -4, 75, -29
T_, U_ = Pc(C0, 195), Pc(C0, 235)
o = circle(C0) + arc(C0, pR, pP, PK, 6, 12) + arc(C0, pS, pQ, GR, 6, 24)
o += seg(T_, Pc(C0, pP), c) + seg(T_, Pc(C0, pR), c) + seg(U_, Pc(C0, pQ), AM) + seg(U_, Pc(C0, pS), AM)
o += ang(T_, Pc(C0, pP), Pc(C0, pR), '52°', TX, 40, 15, 60) + ang(U_, Pc(C0, pQ), Pc(C0, pS), i('x'), AM, 46, 16, 66)
o += labs(C0, {'P': pP, 'R': pR, 'Q': pQ, 'S': pS}, 36) + NTS
S(s, 'CONTOH 2', 'Lengkok yang sama panjang',
  p(f'Rajah di sebelah menunjukkan bulatan dengan panjang lengkok {i("PR")} = {i("QS")}. Tentukan nilai {i("x")}. Berikan alasan untuk jawapan anda.')
  + pen(s, [f'{i("x")} = 52° kerana ∠{i("x")} dan ∠52° berada pada lilitan bulatan dan panjang lengkok {i("PR")} = {i("QS")}.']),
  SV(o, 'Bulatan dengan lengkok PR sama panjang dengan lengkok QS'))

# Contoh 3: 20° pada lengkok 2 cm, x pada lengkok 8 cm
V = Pc(C0, 110); pP, pQ, pR = 230, 270, 70
o = circle(C0) + arc(C0, pP, pQ, GR, 6) + arc(C0, pQ, pR + 360, AM, 6)
o += seg(V, Pc(C0, pP), c) + seg(V, Pc(C0, pQ), c) + seg(V, Pc(C0, pR), c)
o += ang(V, Pc(C0, pP), Pc(C0, pQ), '20°', GR, 60, 15, 80) + ang(V, Pc(C0, pQ), Pc(C0, pR), i('x'), AM, 40, 16, 58)
o += labs(C0, {'P': pP, 'Q': pQ, 'R': pR}) + lab(C0, 250, '2 cm', 40, GR, 15) + lab(C0, 345, '8 cm', 36, AM, 15)
S(s, 'CONTOH 3', 'Sudut berkadaran dengan panjang lengkok',
  p(f'Berdasarkan rajah di sebelah, tentukan nilai {i("x")}.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'{F(i("x"), "20°")} = {F("8 cm", "2 cm")}', f'{i("x")} = 4 (20°)', f'{i("x")} = 80°'])], s, 1, 21),
  SV(o, 'Sudut 20 darjah dicangkum lengkok 2 cm dan sudut x dicangkum lengkok 8 cm'))

# Contoh 4: lengkok PS = 2 lengkok QR, segi tiga TPS sama kaki 50°
pT, pP, pS, pQ, pR = 180, 80, 280, 50, -30
T_ = Pc(C0, pT)
o = circle(C0) + arc(C0, pS, pP + 360, PK, 5, 12) + seg(T_, Pc(C0, pP), c) + seg(T_, Pc(C0, pS), c) + seg(Pc(C0, pP), Pc(C0, pS), c)
o += seg(T_, Pc(C0, pQ), AM) + seg(T_, Pc(C0, pR), AM)
o += ang(Pc(C0, pP), T_, Pc(C0, pS), '50°', TX, 28, 14, 46) + ang(Pc(C0, pS), T_, Pc(C0, pP), '50°', TX, 28, 14, 46) + ang(T_, Pc(C0, pQ), Pc(C0, pR), i('x'), AM, 70, 16, 88)
o += labs(C0, {'T': pT, 'P': pP, 'S': pS, 'Q': pQ, 'R': pR}) + NTS
S(s, 'CONTOH 4', 'Panjang lengkok dua kali ganda',
  p(f'Diberi panjang lengkok minor {i("PS")} ialah dua kali panjang lengkok {i("QR")}. Tentukan nilai {i("x")}.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'{an("PTS")} = 180° − 2 (50°) &emsp;(Jumlah sudut pedalaman suatu segi tiga ialah 180°.)', f'{an("PTS")} = 80°',
                f'Maka, {i("x")} = {F("80°", 2)} &emsp;({i("QR")} = {F(i("PS"), 2)})', f'{i("x")} = 40°'])], s, 1, 20),
  SV(o, 'Segi tiga TPS dengan sudut 50 darjah di P dan S, sudut x di T dicangkum lengkok QR'))

# sudut pusat = 2 × sudut lilitan
o = circle(C0) + dot(C0[:2]) + GF.T(C0[0] + 14, C0[1] + 14, 'O', TX, 16)
pP, pR, pQ = 220, 320, 95
o += seg(Pc(C0, pP), Pc(C0, pQ), c) + seg(Pc(C0, pR), Pc(C0, pQ), c) + seg(Pc(C0, pP), C0[:2], AM) + seg(Pc(C0, pR), C0[:2], AM)
o += ang(Pc(C0, pQ), Pc(C0, pP), Pc(C0, pR), i('x'), c, 36, 16, 54) + ang(C0[:2], Pc(C0, pP), Pc(C0, pR), f'2{i("x")}', AM, 30, 16, 50)
o += labs(C0, {'P': pP, 'R': pR, 'Q': pQ})
S(s, 'SIFAT', 'Sudut pada pusat bulatan',
  p('Secara generalisasi,')
  + de(s, 'Saiz <b>sudut pada pusat bulatan</b> yang dicangkum oleh suatu lengkok yang sama ialah <b>dua kali ganda</b> saiz sudut pada <b>lilitan bulatan</b>.')
  + formula(f'{an("POR")} = 2 × {an("PQR")}', c)
  + p(f'Nilai {an("PQR")} tetap walaupun titik {i("Q")} digerakkan sepanjang lilitan bulatan.'),
  SV(o, 'Sudut pusat 2x dan sudut lilitan x dicangkum lengkok PR'))

# Contoh 5
o = ''
for k, (cx, lbl) in enumerate([(85, '(a)'), (250, '(b)'), (415, '(c)')]):
    cc = (cx, 230, 72); O_ = cc[:2]
    o += circle(cc) + dot(O_, TX, 3.5) + GF.T(cx, 120, lbl, MU3, 15)
    if k == 0:
        A_, B_, X_, Y_ = Pc(cc, 225), Pc(cc, 315), Pc(cc, 110), Pc(cc, 60)
        o += seg(A_, O_, AM) + seg(B_, O_, AM) + seg(A_, X_, c) + seg(B_, X_, c) + seg(A_, Y_, PU) + seg(B_, Y_, PU)
        o += ang(O_, A_, B_, '96°', AM, 18, 13, 32) + ang(X_, A_, B_, i('x'), c, 24, 14, 38) + ang(Y_, A_, B_, i('y'), PU, 24, 14, 38)
    elif k == 1:
        A_, B_, X_, Y_ = Pc(cc, 230), Pc(cc, 310), Pc(cc, 115), Pc(cc, 65)
        o += seg(A_, X_, c) + seg(B_, X_, c) + seg(A_, Y_, PU) + seg(B_, Y_, PU) + seg(A_, O_, AM) + seg(B_, O_, AM)
        o += ang(X_, A_, B_, '32°', c, 24, 13, 40) + ang(Y_, A_, B_, i('x'), PU, 24, 14, 38) + ang(O_, A_, B_, i('y'), AM, 16, 14, 30)
    else:
        A_, B_, Y_ = Pc(cc, 15), Pc(cc, 165), Pc(cc, 270)
        o += seg(A_, O_, AM) + seg(B_, O_, AM) + seg(A_, Y_, c) + seg(B_, Y_, c)
        o += ang(O_, A_, B_, '150°', TX, 14, 13, 28) + angbig(O_, A_, B_, i('x'), AM, 20, 14, 34) + ang(Y_, A_, B_, i('y'), c, 22, 14, 36)
S(s, 'CONTOH 5', 'Sudut pusat dan sudut lilitan',
  p(f'Tentukan nilai {i("x")} dan nilai {i("y")} bagi setiap yang berikut.')
  + p('<b>Penyelesaian:</b>')
  + work([('(a)', [f'{i("x")} = {F(1, 2)} (96°)', f'{i("x")} = 48°', f'{i("y")} = 48°']), ('(b)', [f'{i("x")} = 32°', f'{i("y")} = 2 (32°)', f'{i("y")} = 64°']),
          ('(c)', [f'{i("x")} = 360° − 150°', f'{i("x")} = 210°', f'{i("y")} = {F(1, 2)} (210°)', f'{i("y")} = 105°'])], s, 3, 19),
  SV(o, 'Tiga bulatan berpusat O dengan sudut pusat dan sudut lilitan'))

# sudut pusat berkadaran
o = circle(C0) + dot(C0[:2]) + GF.T(C0[0] - 4, C0[1] + 22, 'O', TX, 16)
o += arc(C0, 280, 320, GR, 6) + arc(C0, 40, 120, AM, 6)
O_ = C0[:2]
o += seg(O_, Pc(C0, 280), GR) + seg(O_, Pc(C0, 320), GR) + seg(O_, Pc(C0, 40), AM) + seg(O_, Pc(C0, 120), AM)
o += ang(O_, Pc(C0, 280), Pc(C0, 320), i('x'), GR, 34, 16, 52) + ang(O_, Pc(C0, 40), Pc(C0, 120), f'2{i("x")}', AM, 30, 16, 50)
o += lab(C0, 300, f'{i("y")} cm', 24, GR, 16) + lab(C0, 80, f'2{i("y")} cm', 24, AM, 16)
S(s, 'SIFAT', 'Sudut pada pusat dan panjang lengkok',
  p('Anda telah pelajari bahawa sudut-sudut pada lilitan bulatan yang dicangkum oleh lengkok yang sama panjang adalah sama saiz, dan saiz sudut pada lilitan bulatan yang dicangkum oleh suatu lengkok adalah berkadaran dengan panjang lengkok tersebut.')
  + p('Kedua-dua konsep di atas juga boleh diaplikasi untuk sudut pada pusat bulatan. Secara generalisasi,')
  + de(s, 'Bagi sudut-sudut pada pusat bulatan yang dicangkum oleh suatu lengkok;<br>(a) saiz sudut adalah sama jika panjang lengkok sama.<br>(b) perubahan saiz sudut adalah berkadaran dengan perubahan panjang lengkok.'),
  SV(o, 'Sudut pusat x dicangkum lengkok y cm dan sudut pusat 2x dicangkum lengkok 2y cm'))

# semibulatan 90°
o = circle(C0) + dot(C0[:2]) + GF.T(C0[0], C0[1] + 22, 'O', TX, 16)
Pp, Rp = Pc(C0, 180), Pc(C0, 0)
o += seg(Pp, Rp, AM) + GF.T(250, 228, 'Diameter', AM, 15)
for d, col in [(120, c), (70, GR)]:
    Q_ = Pc(C0, d); o += seg(Pp, Q_, col) + seg(Rp, Q_, col) + rt(Q_, Pp, Rp, 14)
o += labs(C0, {'P': 180, 'R': 0}) + lab(C0, 120, 'Q', 20) + lab(C0, 70, "Q'", 20)
S(s, 'SIFAT', 'Sudut dalam semibulatan',
  p(f'Bagi semua kedudukan titik {i("Q")} pada lilitan bulatan yang dicangkum oleh diameter {i("PR")}, nilai {an("PQR")} ialah 90°. Secara generalisasi,')
  + de(s, f'Sudut pada lilitan bulatan yang dicangkum oleh diameter ialah 90°. Jika {i("PQR")} ialah semi bulatan maka, {an("PQR")} = 90°.')
  + note('Adakah diameter merupakan satu perentas? Bincangkan.', 'Sudut diskusi:'),
  SV(o, 'Sudut di Q dan Q aksen dicangkum diameter PR ialah 90 darjah'))

# Contoh 6
Q_, R_, S_, P_ = Pc(C0, 90), Pc(C0, 0), Pc(C0, 270), Pc(C0, 180)
o = circle(C0) + dot(C0[:2]) + GF.T(C0[0] + 16, C0[1] + 4, 'O', TX, 16) + poly([P_, Q_, R_, S_], c, False) + seg(P_, R_, MU3, 2.5) + seg(Q_, S_, AM)
o += ang(Q_, P_, S_, i('x'), AM, 40, 15, 56) + ang(Q_, S_, R_, i('x'), AM, 46, 15, 62) + ang(S_, Q_, R_, i('y'), c, 46, 16, 64)
o += labs(C0, {'Q': 90, 'R': 0, 'S': 270, 'P': 180})
S(s, 'CONTOH 6', 'Sudut yang dicangkum oleh diameter',
  p(f'Rajah di sebelah menunjukkan bulatan berpusat di {i("O")} dengan titik-titik {i("P")}, {i("Q")}, {i("R")} dan {i("S")} terletak pada lilitan bulatan. Diberi bahawa {i("PR")} dan {i("QS")} ialah diameter. Hitung nilai {i("y")}.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'{i("PR")} = {i("QS")}', f'Maka, 2{i("x")} = 90°', f'{i("x")} = 45°']), ('', [f'{i("y")} + {i("x")} + {an("QRS")} = 180°', f'{i("y")} + 45° + 90° = 180°',
                f'{i("y")} = 180° − 45° − 90°', f'{i("y")} = 45°'])], s, 2, 19)
  + note(f'2{i("x")} = 90° kerana {an("PQR")} = 90° (dicangkum oleh diameter {i("PR")}).', 'Nota:'),
  SV(o, 'Bulatan berpusat O dengan diameter PR dan QS'))

# Contoh 7: arca
pQ, pR, pP, pS = 40, -24, 104, 220
O_ = C0[:2]
o = circle(C0) + dot(O_) + GF.T(O_[0] - 18, O_[1] + 6, 'O', TX, 16)
o += seg(Pc(C0, pS), Pc(C0, pQ), c) + seg(Pc(C0, pS), Pc(C0, pR), c) + seg(Pc(C0, pS), Pc(C0, pP), c) + seg(Pc(C0, pP), Pc(C0, pQ), c) + seg(O_, Pc(C0, pR), AM)
o += ang(O_, Pc(C0, pQ), Pc(C0, pR), '64°', AM, 30, 15, 50) + arc(C0, pR, pQ, GR, 5, 12) + arc(C0, pQ, pP, GR, 5, 12)
o += labs(C0, {'Q': pQ, 'R': pR, 'P': pP, 'S': pS}, 30)
o += f'<rect x="160" y="420" width="180" height="20" rx="4" fill="{MU}55" stroke="{MU}" stroke-width="2"/>'
S(s, 'CONTOH 7', 'Menyelesaikan masalah sudut dalam bulatan',
  p(f'Sebuah arca dibina dalam bentuk bulatan berpusat di {i("O")} seperti pada rajah di sebelah. Titik-titik pada lilitan membentuk lengkok {i("PQ")} yang sama panjang dengan lengkok {i("QR")}. Garis {i("SQ")} melalui {i("O")}. Tentukan nilai (a) {an("QSR")} (b) {an("PQS")}')
  + p('<b>Penyelesaian:</b>')
  + work([('(a)', [f'{an("QSR")} = {F(1, 2)} {an("QOR")}', f'&emsp;&emsp;&ensp;&nbsp;= {F(1, 2)} (64°)', '&emsp;&emsp;&ensp;&nbsp;= 32°']),
          ('(b)', [f'{an("PSQ")} = {an("QSR")} = 32°', f'{an("PQS")} + 90° + 32° = 180°', f'{an("PQS")} = 180° − 90° − 32°', '&emsp;&emsp;&ensp;&nbsp;= 58°'])], s, 2, 19),
  SV(o, 'Arca bulatan berpusat O, sudut QOR 64 darjah'))

# =====================================================================
# 6.2 SISI EMPAT KITARAN
# =====================================================================
s = '6.2'
c = COL[s]
pts = {'P': 115, 'Q': 30, 'R': 280, 'S': 200}
o = circle(C0) + poly([Pc(C0, a) for a in pts.values()], c) + labs(C0, pts)
S(s, 'DEFINISI', 'Sisi empat kitaran',
  de(s, '<b>Sisi empat kitaran</b> ialah suatu sisi empat dalam bulatan dengan keadaan keempat-empat bucu sisi empat tersebut terletak pada lilitan bulatan.')
  + p(f'{i("PQRS")} pada rajah di sebelah ialah sisi empat kitaran. ∠{i("P")} dan ∠{i("R")} serta ∠{i("S")} dan ∠{i("Q")} dikenali sebagai <b>sudut bertentangan</b> dalam sisi empat kitaran.'),
  SV(o, 'Sisi empat kitaran PQRS dalam bulatan'))

# Contoh 8
o = ''
spec = [((85, 110), ['A', 'B', 'C', 'D'], [120, 200, 300, None], (1.35, 25)),
        ((250, 110), ['D', 'E', 'F', 'G'], [125, 220, 300, 50], None),
        ((415, 110), ['K', 'L', 'O', 'N'], [100, 230, 'O', 310], None),
        ((150, 330), ['P', 'Q', 'R', 'S'], [150, 230, 320, 60], None),
        ((350, 330), ['O', 'T', 'U', 'V'], ['O', 190, 270, 350], None)]
for k, (cen, nm, ds, outp) in enumerate(spec):
    cc = (cen[0], cen[1], 62)
    o += circle(cc) + dot(cen, MU3, 3) + GF.T(cen[0] - 72, cen[1] - 70, f'({["i", "ii", "iii", "iv", "v"][k]})', MU3, 14)
    ptsx = []
    for n_, d in zip(nm, ds):
        if d == 'O':
            q = cen
        elif d is None:
            q = Pc(cc, outp[1], cc[2] * outp[0])
        else:
            q = Pc(cc, d)
        ptsx.append(q)
    o += poly(ptsx, c, w=2.5)
    for n_, q in zip(nm, ptsx):
        o += labp(q, cen, n_, 13, TX, 14) if q != cen else GF.T(cen[0] + 4, cen[1] + 16, n_, TX, 14)
S(s, 'CONTOH 8', 'Mengenal pasti sisi empat kitaran',
  p(f'Bagi setiap bulatan di sebelah, {i("O")} ialah pusat bulatan. (a) Kenal pasti sisi empat kitaran yang terdapat dalam setiap bulatan dan jelaskan jawapan anda. (b) Nyatakan sudut bertentangan yang wujud dalam setiap sisi empat kitaran yang telah anda kenal pasti.')
  + work([('(a)', [f'(i) Bucu {i("D")} tidak terletak pada lilitan maka, {i("ABCD")} bukan sisi empat kitaran.', f'(ii) Semua bucu terletak pada lilitan maka, {i("DEFG")} ialah sisi empat kitaran.',
                   f'(iii) Bucu {i("O")} tidak terletak pada lilitan maka, {i("KLON")} bukan sisi empat kitaran.', f'(iv) Semua bucu terletak pada lilitan maka, {i("PQRS")} ialah sisi empat kitaran.',
                   f'(v) Bucu {i("O")} tidak terletak pada lilitan maka, {i("OTUV")} bukan sisi empat kitaran.']),
          ('(b)', [f'(i) Tiada (ii) ∠{i("D")} dan ∠{i("F")}, ∠{i("E")} dan ∠{i("G")} (iii) Tiada (iv) ∠{i("P")} dan ∠{i("R")}, ∠{i("Q")} dan ∠{i("S")} (v) Tiada'])], s, 1, 17),
  SV(o, 'Lima bulatan dengan sisi empat, hanya DEFG dan PQRS bucunya pada lilitan'))

# sudut bertentangan 180°
d4 = [120, 40, 290, 210]
Q4 = [Pc(C0, a) for a in d4]
o = circle(C0) + poly(Q4, c)
o += ang(Q4[0], Q4[3], Q4[1], i('x'), AM, 30, 16, 48) + ang(Q4[2], Q4[1], Q4[3], i('y'), AM, 30, 16, 48)
o += ang(Q4[1], Q4[0], Q4[2], i('p'), GR, 30, 16, 48) + ang(Q4[3], Q4[2], Q4[0], i('q'), GR, 30, 16, 48)
o += labs(C0, dict(zip('ABCD', [120, 40, 290, 210])))
S(s, 'SIFAT', 'Sudut bertentangan dalam sisi empat kitaran',
  p('Didapati bahawa;')
  + bul(s, [f'{an("DAB")} + {an("BCD")} = 180° dan {an("ABC")} + {an("ADC")} = 180°', 'Jumlah sudut pedalaman yang bertentangan dalam sisi empat kitaran ialah 180°.'])
  + p('Secara generalisasi,')
  + de(s, 'Hasil tambah sudut-sudut yang bertentangan dalam suatu sisi empat kitaran ialah 180°.')
  + formula(f'∠{i("x")} + ∠{i("y")} = 180° &emsp; dan &emsp; ∠{i("p")} + ∠{i("q")} = 180°', c),
  SV(o, 'Sisi empat kitaran ABCD dengan sudut bertentangan x dan y, p dan q'))

# Contoh 9: KLMN, 108, 96, 8x, 4y
d9 = {'K': 120, 'L': 68, 'M': -48, 'N': 212}
K9, L9, M9, N9 = [Pc(C0, a) for a in d9.values()]
o = circle(C0) + poly([K9, L9, M9, N9], c)
o += ang(K9, N9, L9, '108°', TX, 30, 14, 52) + ang(L9, K9, M9, '96°', TX, 30, 14, 50) + ang(M9, L9, N9, f'8{i("x")}', AM, 30, 15, 50) + ang(N9, M9, K9, f'4{i("y")}', AM, 30, 15, 50)
o += labs(C0, d9)
assert (180 - 108) / 8 == 9 and (180 - 96) / 4 == 21
S(s, 'CONTOH 9', 'Sudut bertentangan',
  p(f'Rajah di sebelah menunjukkan sisi empat kitaran {i("KLMN")}. Hitung nilai (a) {i("x")} (b) {i("y")}')
  + work([('(a)', [f'Sudut-sudut pedalaman {an("LKN")} dan {an("LMN")} adalah bertentangan dalam sisi empat kitaran.', f'Maka, {an("LKN")} + {an("LMN")} = 180°',
                   f'108° + 8{i("x")} = 180°', f'8{i("x")} = 72°', f'{i("x")} = {F("72°", 8)} = 9°']),
          ('(b)', [f'Sudut-sudut pedalaman {an("KNM")} dan {an("KLM")} adalah bertentangan dalam sisi empat kitaran.', f'Maka, {an("KNM")} + {an("KLM")} = 180°',
                   f'4{i("y")} + 96° = 180°', f'4{i("y")} = 84°', f'{i("y")} = {F("84°", 4)} = 21°'])], s, 2, 17),
  SV(o, 'Sisi empat kitaran KLMN dengan sudut 108, 96, 8x dan 4y'))

# sudut peluaran
dP, dQ, dR, dS = 120, 45, 300, 215
P2, Q2, R2, S2 = [Pc(C0, a) for a in (dP, dQ, dR, dS)]
T2 = ext(P2, S2, 95)
o = circle(C0) + poly([P2, Q2, R2, S2], c) + seg(S2, T2, c)
o += ang(S2, T2, R2, i('a'), AM, 34, 16, 52) + ang(Q2, P2, R2, 'θ', AM, 32, 16, 50)
o += labs(C0, {'P': dP, 'Q': dQ, 'R': dR, 'S': dS}) + labp(T2, S2, 'T', 14)
S(s, 'KONSEP', 'Sudut peluaran sisi empat kitaran',
  p(f'Rajah di sebelah menunjukkan sisi empat kitaran {i("PQRS")}. Perentas {i("PS")} dipanjangkan kepada {i("T")}. {an("TSR")}, {i("a")}, ialah <b>sudut peluaran</b> untuk sisi empat kitaran {i("PQRS")}. {an("PQR")}, θ, dikenali sebagai <b>sudut pedalaman bertentangan</b> yang sepadan dengan {i("a")}.')
  + de(s, f'Sudut peluaran suatu sisi empat kitaran adalah sama dengan sudut pedalaman bertentangan yang sepadan, iaitu {i("a")} = θ.')
  + work([('', [f'{i("a")} + {an("PSR")} = 180° &emsp;(sudut pada garis lurus)', f'θ + {an("PSR")} = 180° &emsp;(sudut bertentangan)', f'Maka, {i("a")} = θ'])], s, 1, 18),
  SV(o, 'Sisi empat kitaran PQRS dengan PS dipanjangkan ke T, sudut peluaran a dan sudut theta di Q'))

# Contoh 10
dP, dQ, dR, dS = 135, 50, 315, 225
P3, Q3, R3, S3 = [Pc(C0, a) for a in (dP, dQ, dR, dS)]
o = circle(C0) + poly([P3, Q3, R3, S3], c) + seg(Q3, ext(P3, Q3, 80), c) + seg(S3, ext(R3, S3, 80), c)
o += ang(Q3, ext(P3, Q3, 80), R3, i('m'), AM, 30, 16, 48) + ang(Q3, P3, R3, i('n'), GR, 30, 16, 48) + ang(R3, Q3, S3, i('x'), GR, 30, 16, 48)
o += ang(S3, ext(R3, S3, 80), P3, i('z'), AM, 30, 16, 48) + ang(S3, R3, P3, i('y'), GR, 30, 16, 48)
o += labs(C0, {'P': dP, 'Q': dQ, 'R': dR, 'S': dS}, 22)
S(s, 'CONTOH 10', 'Sudut peluaran dan sudut pedalaman',
  p(f'Dalam rajah di sebelah, {i("PQRS")} ialah sisi empat kitaran. Diberi bahawa {i("m")} dan {i("z")} ialah sudut peluaran. Nyatakan sudut pedalaman bertentangan yang sepadan dengan {i("m")} dan {i("z")}.')
  + pen(s, [f'{i("y")} ialah sudut pedalaman bertentangan yang sepadan dengan {i("m")}.', f'{i("n")} ialah sudut pedalaman bertentangan yang sepadan dengan {i("z")}.']),
  SV(o, 'Sisi empat kitaran PQRS dengan sudut peluaran m di Q dan z di S'))

# Contoh 11: ABCD, CDE, 52
dB, dA, dC, dD = 270, 166, 14, 95
A4, B4, C4, D4 = [Pc(C0, a) for a in (dA, dB, dC, dD)]
E4 = ext(C4, D4, 90)
o = circle(C0) + poly([A4, B4, C4, D4], c) + seg(A4, C4, c) + seg(D4, E4, c) + tick(A4, B4) + tick(B4, C4)
o += ang(C4, A4, B4, '52°', TX, 46, 14, 64) + ang(A4, C4, B4, '52°', TX, 46, 14, 64) + ang(B4, A4, C4, i('a'), AM, 30, 16, 48) + ang(D4, E4, A4, i('b'), AM, 30, 16, 48)
o += labs(C0, {'A': dA, 'B': dB, 'C': dC, 'D': dD}) + labp(E4, D4, 'E', 14)
S(s, 'CONTOH 11', 'Menyelesaikan masalah sisi empat kitaran',
  p(f'Rajah di sebelah menunjukkan sisi empat kitaran {i("ABCD")} dan garis lurus {i("CDE")}. Hitung nilai (a) {i("a")} (b) {i("b")}')
  + p('<b>Penyelesaian:</b>')
  + work([('(a)', [f'{an("ACB")} = {an("CAB")} = 52°', f'{an("ACB")} + {an("CAB")} + {i("a")} = 180°', f'52° + 52° + {i("a")} = 180°', f'{i("a")} = 180° − 52° − 52°', f'{i("a")} = 76°']),
          ('(b)', [f'{i("b")} = {i("a")}', f'Maka, {i("b")} = 76°'])], s, 2, 19),
  SV(o, 'Sisi empat kitaran ABCD dengan CDE garis lurus dan AB sama dengan BC'))

# Contoh 12: 7y dan 3y
dP, dQ, dR, dS = 100, 50, -8, 210
P5, Q5, R5, S5 = [Pc(C0, a) for a in (dP, dQ, dR, dS)]
T5 = ext(R5, S5, 90)
o = circle(C0) + poly([P5, Q5, R5, S5], c) + seg(S5, T5, c)
o += ang(Q5, P5, R5, f'7{i("y")}', AM, 30, 15, 50) + ang(S5, R5, P5, f'3{i("y")}', AM, 30, 15, 50) + ang(S5, T5, P5, '', PK, 40)
o += labs(C0, {'P': dP, 'Q': dQ, 'R': dR, 'S': dS}) + labp(T5, S5, 'T', 14)
assert 180 / 10 == 18 and 7 * 18 == 126
S(s, 'CONTOH 12', 'Sudut peluaran',
  p(f'Rajah di sebelah menunjukkan sisi empat kitaran {i("PQRS")} dan garis lurus {i("RST")}. Hitung nilai {an("PST")}.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'{an("PQR")} + {an("PSR")} = 180°', f'7{i("y")} + 3{i("y")} = 180°', f'10{i("y")} = 180°', f'{i("y")} = 18°']),
          ('', [f'{an("PST")} = {an("PQR")}', f'&emsp;&emsp;&ensp;&nbsp;= 7{i("y")}', '&emsp;&emsp;&ensp;&nbsp;= 7(18°)', f'{an("PST")} = 126°'])], s, 2, 20),
  SV(o, 'Sisi empat kitaran PQRS dengan RST garis lurus'))

# Contoh 13: KLMN, MNP, 82, 71
d13 = {'N': 100, 'M': 40, 'K': 204, 'L': 242}
N6, M6, K6, L6 = [Pc(C0, a) for a in d13.values()]
P6 = ext(M6, N6, 100)
o = circle(C0) + poly([K6, L6, M6, N6], c) + seg(N6, P6, c)
o += ang(N6, P6, K6, '82°', TX, 30, 14, 50) + ang(M6, N6, L6, '71°', TX, 30, 14, 50) + ang(L6, K6, M6, i('x'), AM, 30, 16, 48) + ang(K6, L6, N6, i('y'), AM, 30, 16, 48)
o += labs(C0, d13) + labp(P6, N6, 'P', 14)
S(s, 'CONTOH 13', 'Sudut peluaran dan sudut bertentangan',
  p(f'Rajah di sebelah menunjukkan sisi empat kitaran {i("KLMN")} dan garis lurus {i("MNP")}. Hitung nilai (a) {i("x")} (b) {i("y")}')
  + p('<b>Penyelesaian:</b>')
  + work([('(a)', [f'{an("PNK")} ialah sudut peluaran. Sudut pedalaman bertentangan yang sepadan dengannya ialah sudut {i("x")}.', f'Maka, {i("x")} = 82°']),
          ('(b)', [f'{i("y")} dan {an("NML")} ialah sudut pedalaman bertentangan dalam sisi empat kitaran {i("KLMN")}.', f'Maka, {i("y")} = 180° − {an("NML")}', f'{i("y")} = 180° − 71°', f'{i("y")} = 109°'])], s, 2, 18),
  SV(o, 'Sisi empat kitaran KLMN dengan MNP garis lurus'))

# =====================================================================
# 6.3 TANGEN KEPADA BULATAN
# =====================================================================
s = '6.3'
c = COL[s]
cT = (250, 230, 130)
X1, X2 = tangent(cT, 120, 120, 120)
Y1, Y2 = tangent(cT, 300, 120, 120)
Ap, Bp = Pc(cT, 200), Pc(cT, 250)
U_, V_ = ext(Bp, Ap, 70), ext(Ap, Bp, 70)
o = circle(cT) + seg(X1, X2, c) + seg(Y1, Y2, c) + seg(U_, V_, PK)
o += dot(Pc(cT, 120), AM, 6) + dot(Pc(cT, 300), AM, 6) + dot(Ap, PK, 5) + dot(Bp, PK, 5)
o += lab(cT, 120, 'X', 22) + lab(cT, 300, 'Y', 22) + labp(Ap, cT[:2], 'A', 16) + labp(Bp, cT[:2], 'B', 16)
o += labp(X1, X2, 'P', 14) + labp(X2, X1, 'Q', 14) + labp(Y1, Y2, 'S', 14) + labp(Y2, Y1, 'R', 14) + labp(U_, V_, 'U', 14) + labp(V_, U_, 'V', 14)
S(s, 'DEFINISI', 'Tangen kepada bulatan',
  p(f'Dalam rajah di sebelah, garis lurus {i("PQ")} dan {i("RS")} masing-masing menyentuh bulatan pada titik {i("X")} dan titik {i("Y")}. Sementara garis lurus {i("UV")} melalui titik {i("A")} dan titik {i("B")} pada bulatan. Maka,')
  + bul(s, [f'(a) {i("PQ")} dan {i("RS")}: Tangen kepada bulatan.', f'(b) {i("X")} dan {i("Y")}: Titik ketangenan bagi {i("PQ")} dan {i("RS")}, masing-masing.', f'(c) {i("UV")}: Bukan tangen.', f'(d) {i("A")} dan {i("B")}: Bukan titik ketangenan bagi {i("UV")}.'])
  + de(s, '<b>Tangen</b> kepada bulatan ialah suatu <b>garis lurus</b> yang <b>menyentuh bulatan</b> tersebut <b>pada satu titik</b> sahaja. <b>Titik sentuhan di antara tangen dengan bulatan</b> ialah <b>titik ketangenan</b>.'),
  SV(o, 'Garis PQ dan RS menyentuh bulatan di X dan Y, garis UV memotong bulatan di A dan B'))

# Contoh 14
E1, E2 = tangent(cT, 90, 150, 150)
U1, U2 = tangent(cT, 270, 140, 140)
F_, G_ = Pc(cT, 150), Pc(cT, 30)
R_, S_ = ext(G_, F_, 60), ext(F_, G_, 60)
M_ = Pc(cT, 330); N_ = ext(Pc(cT, 160), M_, 110)
o = circle(cT) + seg(E1, E2, c) + seg(U2, U1, c) + seg(R_, S_, PK) + seg(M_, N_, AM)
o += dot(Pc(cT, 90), c, 5) + dot(Pc(cT, 270), c, 5) + dot(F_, PK, 5) + dot(G_, PK, 5) + dot(M_, AM, 5)
o += lab(cT, 90, 'E', 20) + lab(cT, 270, 'U', 20) + labp(F_, cT[:2], 'F', 16) + labp(G_, cT[:2], 'G', 16) + GF.T(M_[0] - 14, M_[1] - 12, 'M', TX, 16)
o += labp(E1, E2, 'P', 14) + labp(E2, E1, 'Q', 14) + labp(R_, S_, 'R', 14) + labp(S_, R_, 'S', 14) + labp(U2, U1, 'T', 14) + labp(N_, M_, 'N', 14)
S(s, 'CONTOH 14', 'Mengenal pasti tangen',
  p('Adakah semua garis lurus dan titik yang ditunjukkan dalam rajah di sebelah ialah tangen kepada bulatan dan titik ketangenan? Nyatakan alasan untuk jawapan anda.')
  + pen(s, [f'{i("PQ")} dan {i("TU")} ialah tangen kepada bulatan kerana menyentuh bulatan hanya pada satu titik. Titik {i("E")} dan titik {i("U")} ialah titik ketangenan bagi {i("PQ")} dan {i("TU")} masing-masing.',
            f'{i("RS")} bukan tangen kepada bulatan kerana melalui dua titik pada bulatan. Maka, titik {i("F")} dan titik {i("G")} bukan titik ketangenan bagi {i("RS")}.',
            f'{i("MN")} bukan tangen kepada bulatan kerana akan menyentuh dua titik pada bulatan jika dipanjangkan. Maka, titik {i("M")} bukan titik ketangenan.'], False),
  SV(o, 'Bulatan dengan tangen PQ di E, TU di U, garis RS melalui F dan G, dan garis MN'))

# jejari ⟂ tangen
O_ = cT[:2]; Qt = Pc(cT, 270)
t1, t2 = tangent(cT, 270, 170, 170)
o = circle(cT) + seg(t1, t2, c) + seg(O_, Qt, AM) + rt(Qt, O_, t2, 16) + dot(O_) + GF.T(O_[0] + 16, O_[1], 'O', TX, 16)
o += GF.T(O_[0] - 14, (O_[1] + Qt[1]) / 2, 'Jejari', AM, 15, 'end') + GF.T(Qt[0], Qt[1] + 24, 'Titik ketangenan', TX, 15) + GF.T(t2[0] - 10, t2[1] - 16, 'Tangen', c, 15, 'end')
o += GF.T(Qt[0] + 30, Qt[1] - 26, '90°', AM, 16)
S(s, 'SIFAT', 'Sudut di antara tangen dengan jejari',
  p('Sudut di antara tangen dengan jejari yang bersilang pada titik ketangenan ialah sudut tegak. Secara generalisasi,')
  + de(s, 'Jejari suatu bulatan yang bersilang dengan tangen kepada bulatan pada titik ketangenan akan membentuk 90°.'),
  SV(o, 'Jejari bertemu tangen pada titik ketangenan membentuk 90 darjah'))

# Contoh 15: 146°
cc = (240, 290, 115); O_ = cc[:2]
Bq = Pc(cc, 110); A_ = Pc(cc, 110 + 34, cc[2] / math.cos(math.radians(34))); D_ = Pc(cc, 110 + 34 + 180)
t1, t2 = tangent(cc, 110, 0, 140)
o = circle(cc) + seg(A_, t2, c) + seg(A_, D_, MU3, 2.5) + seg(O_, Bq, AM) + rt(Bq, O_, t2, 14) + dot(O_)
o += ang(O_, Bq, D_, '146°', TX, 30, 14, 52) + ang(A_, Bq, O_, i('x'), AM, 40, 16, 58)
o += labp(A_, O_, 'A', 16) + labp(Bq, O_, 'B', 18) + labp(t2, A_, 'C', 14) + GF.T(O_[0] + 16, O_[1] + 16, 'O', TX, 16)
assert 180 - 146 == 34 and 90 - 34 == 56
S(s, 'CONTOH 15', 'Tangen dan jejari',
  p(f'Rajah di sebelah menunjukkan bulatan berpusat di {i("O")} yang bertemu dengan garis lurus {i("ABC")} pada titik {i("B")} sahaja. Hitung nilai {i("x")}.')
  + p('<b>Penyelesaian:</b>')
  + p(f'Garis {i("ABC")} ialah tangen kepada bulatan dan bertemu jejari bulatan di titik {i("B")}. Maka, sudut {an("OBA")} = 90°.')
  + work([('', [f'{an("AOB")} + 146° = 180°', f'{an("AOB")} = 180° − 146°', '&emsp;&emsp;&ensp;&nbsp;= 34°']),
          ('', [f'{i("x")} + {an("AOB")} = 90°', f'{i("x")} = 90° − {an("AOB")}', f'{i("x")} = 90° − 34°', f'{i("x")} = 56°'])], s, 2, 19),
  SV(o, 'Tangen ABC menyentuh bulatan di B, sudut 146 darjah di O'))

# dua tangen
cc = (150, 235, 95); O_ = cc[:2]; a = 58
Bq, Cq = Pc(cc, a), Pc(cc, -a); A_ = (O_[0] + cc[2] / math.cos(math.radians(a)), O_[1])
o = circle(cc) + seg(Bq, A_, c) + seg(Cq, A_, c) + seg(O_, Bq, AM) + seg(O_, Cq, AM) + seg(O_, A_, MU3, 2.5) + dot(O_)
o += rt(Bq, O_, A_, 12) + rt(Cq, O_, A_, 12) + ang(O_, Bq, A_, i('x'), AM, 26, 15, 42) + ang(O_, A_, Cq, i('x'), AM, 32, 15, 48)
o += ang(A_, O_, Bq, i('y'), GR, 44, 15, 62) + ang(A_, Cq, O_, i('y'), GR, 52, 15, 70)
o += labp(Bq, O_, 'B', 16) + labp(Cq, O_, 'C', 16) + GF.T(A_[0] + 14, A_[1] + 4, 'A', TX, 17) + GF.T(O_[0] - 16, O_[1] + 4, 'O', TX, 16) + tick(Bq, A_) + tick(Cq, A_)
S(s, 'SIFAT', 'Dua tangen kepada suatu bulatan',
  p('Secara generalisasi,')
  + de(s, f'Jika dua tangen kepada suatu bulatan berpusat di {i("O")} dengan titik ketangenan {i("B")} dan {i("C")}, masing-masing bertemu pada titik {i("A")}, maka,')
  + bul(s, [f'{i("BA")} = {i("CA")}', f'{an("BOA")} = {an("COA")}', f'{an("OAB")} = {an("OAC")}']),
  SV(o, 'Dua tangen dari A menyentuh bulatan di B dan C'))

# Contoh 16: 58°, PQ 15 cm
a = 58; r16 = 15 * math.tan(math.radians(32))
assert f'{r16:.3f}' == '9.373'
cc = (140, 235, 92); O_ = cc[:2]
Pq, Rq = Pc(cc, a), Pc(cc, -a); Q_ = (O_[0] + cc[2] / math.cos(math.radians(a)), O_[1])
o = circle(cc) + seg(Pq, Q_, c) + seg(Rq, Q_, c) + seg(O_, Pq, AM) + seg(O_, Q_, MU3, 2.5) + dot(O_) + rt(Pq, O_, Q_, 12)
o += ang(O_, Pq, Q_, '58°', AM, 24, 14, 42) + ang(Q_, O_, Pq, i('x'), GR, 50, 15, 68)
o += labp(Pq, O_, 'P', 16) + labp(Rq, O_, 'R', 16) + GF.T(Q_[0] + 16, Q_[1] + 4, 'Q', TX, 17) + GF.T(O_[0] - 16, O_[1] + 4, 'O', TX, 16)
o += side(Pq, Q_, '15 cm', TX, 18, 15, O_) + side(Rq, Q_, f'{i("y")} cm', TX, 18, 15, O_)
S(s, 'CONTOH 16', 'Dua tangen',
  p(f'Rajah di sebelah menunjukkan bulatan berpusat di {i("O")}. Tangen {i("PQ")} dan {i("RQ")} bertemu di titik {i("Q")}. Hitung (a) nilai {i("x")} (b) nilai {i("y")} (c) panjang jejari bulatan')
  + work([('(a)', [f'Segi tiga ∆{i("OPQ")} bersudut tegak dan {an("OPQ")} = 90°.', f'Maka, {i("x")} + 58° = 90°', f'{i("x")} = 90° − 58°', f'{i("x")} = 32°']),
          ('(b)', [f'Panjang {i("PQ")} = {i("QR")} = {i("y")}', f'Maka, {i("y")} = 15 cm']),
          ('(c)', [f'tan 32° = {F(i("OP"), 15)}', f'{i("OP")} = 15 × tan 32°', f'Jejari, {i("OP")} = 9.373 cm'])], s, 3, 17),
  SV(o, 'Bulatan berpusat O dengan tangen PQ 15 cm dan RQ y cm'))

# sudut tangen-perentas
cc = (250, 215, 150); O_ = cc[:2]
Qq = Pc(cc, 270); Sq = Pc(cc, 30); Tq = Pc(cc, 120)
t1, t2 = tangent(cc, 270, 200, 200)
o = circle(cc) + seg(t2, t1, c) + seg(Qq, Sq, AM) + seg(Qq, Tq, PU) + seg(Tq, Sq, PU)
o += ang(Qq, t1, Sq, i('x'), AM, 40, 16, 58) + ang(Tq, Qq, Sq, i('y'), PU, 40, 16, 58)
o += labp(Qq, O_, 'Q', 18) + labp(Sq, O_, 'S', 18) + labp(Tq, O_, 'T', 18) + labp(t2, t1, 'P', 14) + labp(t1, t2, 'R', 14)
o += GF.T(330, 340, 'tembereng minor', MU3, 14) + GF.T(200, 160, 'tembereng major', MU3, 14)
S(s, 'KONSEP', 'Sudut di antara tangen dan perentas',
  p(f'Dalam rajah di sebelah, {i("PQR")} ialah tangen kepada bulatan.')
  + bul(s, [f'∠{i("x")} ialah sudut di antara perentas {i("QS")} dengan tangen {i("PQR")} pada tembereng minor.', f'∠{i("y")} ialah sudut pada tembereng major atau <b>tembereng selang-seli</b> yang dicangkum oleh perentas {i("QS")}.'])
  + de(s, f'∠{i("x")} = ∠{i("y")} kerana sudut di antara perentas dengan tangen bernilai sama dengan sudut pada tembereng selang-seli yang dicangkum oleh perentas tersebut.'),
  SV(o, 'Tangen PQR di Q, perentas QS, sudut x di antara tangen dan perentas sama dengan sudut y di T'))

Gq = Qq
o = circle(cc) + seg(t2, t1, c) + seg(Qq, Sq, AM) + seg(Qq, Tq, PU) + seg(Tq, Sq, PU) + seg(O_, Qq, GR) + seg(O_, Sq, GR) + dot(O_)
o += ang(Qq, t1, Sq, i('x'), AM, 40, 16, 58) + ang(Tq, Qq, Sq, i('y'), PU, 40, 16, 58) + ang(Qq, O_, Sq, i('g'), GR, 34, 15, 50)
o += ang(Sq, Qq, O_, i('e'), GR, 34, 15, 50) + ang(O_, Qq, Sq, i('f'), GR, 30, 15, 48) + rt(Qq, O_, t1, 12)
o += labp(Qq, O_, 'Q', 18) + labp(Sq, O_, 'S', 18) + labp(Tq, O_, 'T', 18) + labp(t2, t1, 'P', 14) + labp(t1, t2, 'R', 14) + GF.T(O_[0] - 16, O_[1] - 6, 'O', TX, 16)
S(s, 'KONSEP', 'Mengapakah ∠x = ∠y?',
  p(f'Dalam rajah di sebelah, {i("O")} ialah pusat bulatan. {i("OQ")} dan {i("OS")} ialah jejari bulatan serta {i("PQR")} ialah tangen kepada bulatan. Maka,')
  + work([('(a)', [f'{i("x")} + {i("g")} = 90°', f'{i("g")} = 90° − {i("x")}', f'{i("e")} = {i("g")}']),
          ('(b)', [f'{i("f")} = 180° − 2{i("g")}', f'{i("f")} = 180° − 2(90° − {i("x")})', f'{i("f")} = 2{i("x")} &emsp;①']),
          ('(c)', [f'{i("y")} = {F(i("f"), 2)} &emsp;②', 'Gantikan ① dalam ②:', f'{i("y")} = {F("2" + i("x"), 2)}', f'{i("y")} = {i("x")}'])], s, 3, 18),
  SV(o, 'Bulatan berpusat O dengan jejari OQ dan OS, tangen PQR'))

# Contoh 17
cc = (250, 210, 140)
L_, K_, M_ = Pc(cc, 95), Pc(cc, 215), Pc(cc, 325)
t1, t2 = tangent(cc, 325, 150, 150)
o = circle(cc) + poly([K_, L_, M_], c) + seg(t2, t1, AM)
o += labp(L_, cc[:2], 'L', 18) + labp(K_, cc[:2], 'K', 18) + labp(M_, cc[:2], 'M', 18) + labp(t1, t2, 'N', 14) + labp(t2, t1, 'P', 14)
S(s, 'CONTOH 17', 'Sudut dalam tembereng selang-seli',
  p(f'Rajah di sebelah menunjukkan segi tiga {i("KLM")} dan {i("PMN")} ialah tangen kepada bulatan. Tentukan sudut dalam tembereng selang-seli untuk (a) {an("PMK")} (b) {an("NML")}')
  + pen(s, [f'(a) {an("KLM")}', f'(b) {an("LKM")}']),
  SV(o, 'Segi tiga KLM dalam bulatan dengan tangen PMN di M'))

# Contoh 18: 48°, 72°
cc = (250, 205, 150)
L_, A_, B_ = Pc(cc, 270), Pc(cc, 126), Pc(cc, 6)
t1, t2 = tangent(cc, 270, 190, 190)
o = circle(cc) + poly([A_, B_, L_], c) + seg(t2, t1, AM)
o += ang(L_, t2, A_, '72°', TX, 40, 14, 60) + ang(A_, B_, L_, '48°', TX, 40, 14, 60) + ang(B_, L_, A_, i('x'), AM, 40, 16, 58) + ang(L_, B_, t1, i('y'), AM, 40, 16, 58)
o += labp(L_, cc[:2], 'L', 18) + labp(A_, cc[:2], 'A', 18) + labp(B_, cc[:2], 'B', 18) + labp(t2, t1, 'K', 14) + labp(t1, t2, 'M', 14)
S(s, 'CONTOH 18', 'Menentukan sudut dengan tangen',
  p(f'Rajah di sebelah menunjukkan segi tiga ∆{i("ABL")} dalam bulatan. Diberi bahawa {i("KLM")} ialah tangen kepada bulatan. Tentukan nilai (a) {i("x")} (b) {i("y")}')
  + pen(s, [f'(a) {i("x")} = 72° kerana {i("x")} ialah sudut dalam tembereng selang-seli bagi {an("KLA")} yang dicangkum oleh perentas {i("AL")}.',
            f'(b) {i("y")} = 48° kerana {an("LAB")} ialah sudut dalam tembereng selang-seli bagi {i("y")} yang dicangkum oleh perentas {i("BL")}.']),
  SV(o, 'Segi tiga ABL dalam bulatan dengan tangen KLM di L'))


# tangen sepunya
def ctan(c1, c2, inner=False):
    """garis tangen sepunya (luar atau dalam) bagi dua bulatan; pulangkan senarai pasangan titik ketangenan."""
    (x1, y1, r1), (x2, y2, r2) = c1, c2
    dx, dy = x2 - x1, y2 - y1; d = math.hypot(dx, dy)
    out = []
    R2 = -r2 if inner else r2
    cc_ = (r1 - R2) / d
    if abs(cc_) > 1 + 1e-9:
        return out
    cc_ = max(-1, min(1, cc_))
    base = math.atan2(dy, dx)
    for sg in (1, -1):
        t = base + sg * math.acos(cc_)
        nx, ny = math.cos(t), math.sin(t)
        p1 = (x1 + r1 * nx, y1 + r1 * ny); p2 = (x2 + R2 * nx, y2 + R2 * ny)
        if math.dist(p1, p2) < 1e-6:
            p2 = (p1[0] - ny * 40, p1[1] + nx * 40); p1 = (p1[0] + ny * 40, p1[1] - nx * 40)
        out.append((p1, p2))
    return out


def tline(p1, p2, ext_=34, col=GR):
    return seg(ext(p2, p1, ext_), ext(p1, p2, ext_), col, 2.2)


o = ''
cases = [((70, 120, 40), (170, 120, 28), '(a) tidak bersentuhan: 4'), ((330, 120, 38), (398, 120, 30), '(b) bersentuhan di luar: 3'),
         ((90, 330, 42), (145, 330, 34), '(c) bersilang: 2'), ((360, 330, 55), (380, 330, 35), '(d) bertindih di dalam: 1')]
for c1, c2, t in cases:
    o += circle(c1, TX, 2.5) + circle(c2, TX, 2.5)
    for p1, p2 in ctan(c1, c2) + ctan(c1, c2, True):
        o += tline(p1, p2)
    o += GF.T((c1[0] + c2[0]) / 2, c1[1] + 92, t, MU3, 14, halo=False)
S(s, 'KONSEP', 'Tangen sepunya',
  de(s, '<b>Tangen sepunya</b> kepada dua bulatan ialah satu garis lurus yang merupakan tangen kepada kedua-dua bulatan tersebut.')
  + p('Didapati bahawa jika dua bulatan yang sama saiz atau berlainan saiz')
  + bul(s, ['(a) tidak bersentuhan akan menghasilkan <b>empat</b> tangen sepunya.', '(b) bersentuhan di luar akan menghasilkan <b>tiga</b> tangen sepunya.',
            '(c) bersilang akan menghasilkan <b>dua</b> tangen sepunya.', '(d) bertindih di dalam akan menghasilkan hanya <b>satu</b> tangen sepunya.']),
  SV(o, 'Empat pasangan bulatan dengan 4, 3, 2 dan 1 tangen sepunya'))

# Contoh 19: jejari 6 dan 4, AB 8
x19 = math.degrees(math.acos(2 / 8))
assert f'{x19:.2f}' == '75.52'
k = 17
Qx = 120; QR = math.sqrt(64 - 4)
A_ = (Qx, 390 - 6 * k); B_ = (Qx + QR * k, 390 - 4 * k)
Q_, R_ = (Qx, 390), (Qx + QR * k, 390)
o = circle((A_[0], A_[1], 6 * k)) + circle((B_[0], B_[1], 4 * k)) + seg((40, 390), (460, 390), c) + seg(A_, B_, AM) + seg(A_, Q_, MU3, 2.5) + seg(B_, R_, MU3, 2.5)
o += rt(Q_, A_, R_, 12) + rt(R_, B_, Q_, 12) + ang(A_, Q_, B_, i('x'), AM, 30, 16, 48) + dot(A_) + dot(B_)
o += GF.T(A_[0] - 14, A_[1] - 6, 'A', TX, 16) + GF.T(B_[0] + 12, B_[1] - 10, 'B', TX, 16) + GF.T(Q_[0], 412, 'Q', TX, 16) + GF.T(R_[0], 412, 'R', TX, 16)
o += GF.T(50, 380, 'P', TX, 16) + GF.T(452, 380, 'S', TX, 16) + side(A_, Q_, '6 cm', TX, 14, 15, B_) + side(B_, R_, '4 cm', TX, 14, 15, A_) + side(A_, B_, '8 cm', AM, 14, 15, Q_)
S(s, 'CONTOH 19', 'Tangen sepunya',
  p(f'Rajah di sebelah menunjukkan dua bulatan yang berpusat di {i("A")} dan di {i("B")} dengan jejari 6 cm dan 4 cm masing-masing. Diberi {i("PQRS")} ialah tangen sepunya kepada kedua-dua bulatan tersebut dan {i("AB")} = 8 cm. Hitung nilai {i("x")}.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'Lukis garis dari {i("B")} selari dengan {i("QR")} untuk membentuk segi tiga bersudut tegak.', 'Sisi bersebelahan dengan sudut <i>x</i> = 6 cm − 4 cm = 2 cm',
                f'kos {i("x")} = {F(2, 8)}', f'{i("x")} = kos<sup>−1</sup> ({F(2, 8)})', f'{i("x")} = 75.52°'])], s, 1, 19),
  SV(o, 'Dua bulatan berpusat A dan B dengan tangen sepunya PQRS'))

# Contoh 20: diameter 60 cm, WY 1.6 m
OY = math.sqrt(1.6 ** 2 + 0.3 ** 2)
assert f'{OY:.2f}' == '1.63'
k = 190
O_ = (120, 390 - 0.3 * k); Y_ = (120 + 1.6 * k, 390)
ang_ = math.atan2(0.3, 1.6)
W_ = (Y_[0] + 1.6 * k * math.cos(math.pi - 2 * ang_), Y_[1] - 1.6 * k * math.sin(math.pi - 2 * ang_))
V_ = (120, 390)
fig20 = circle((O_[0], O_[1], 0.3 * k), TX, 3, '#64748B33') + dot(O_) + seg((30, 390), (470, 390), MU3) + seg(Y_, ext(Y_, W_, 30), PA, 5)
fig20 += GF.T(O_[0] - 14, O_[1] - 8, 'O', TX, 16) + GF.T(V_[0], 410, 'V', TX, 16) + GF.T(Y_[0] + 4, 410, 'Y', TX, 16) + labp(W_, O_, 'W', 16)
fig20 += GF.T(60, 300, 'Tayar', MU3, 15) + GF.T(330, 280, 'Kayu', PA, 15) + GF.T(440, 410, 'Jalan', MU3, 15)
S(s, 'CONTOH 20', 'Menyelesaikan masalah tangen',
  p(f'Sebatang kayu disandarkan kepada sebuah tayar seperti dalam rajah di sebelah. Diberi {i("V")} ialah titik sentuhan di antara tayar dengan jalan. {i("W")} ialah titik sentuhan di antara kayu dengan tayar sementara {i("Y")} ialah titik sentuhan di antara kayu dengan jalan raya. Diameter tayar ialah 60 cm dan jarak {i("WY")} ialah 1.6 meter. Dengan menganggap bahawa jalan raya itu ialah suatu garis lurus, hitung')
  + p(f'(a) jarak {i("VY")}<br>(b) jarak di antara pusat tayar dengan titik {i("Y")} dalam meter. Nyatakan jawapan anda betul kepada dua tempat perpuluhan.'),
  SV(fig20, 'Kayu disandarkan pada tayar, titik sentuhan V, W dan Y'))
o = circle((O_[0], O_[1], 0.3 * k), TX, 3) + seg((30, 390), (470, 390), MU3) + seg(Y_, W_, PA, 4) + seg(O_, W_, AM) + seg(O_, V_, AM) + seg(O_, Y_, GR, 2.5, '7 5') + dot(O_)
o += rt(W_, O_, Y_, 11) + rt(V_, O_, Y_, 11) + GF.T(O_[0] - 14, O_[1] - 8, 'O', TX, 16) + GF.T(V_[0], 410, 'V', TX, 16) + GF.T(Y_[0] + 4, 410, 'Y', TX, 16) + labp(W_, O_, 'W', 16)
o += side(W_, Y_, '1.6 m', TX, 16, 15, O_) + side(O_, V_, '0.3 m', TX, 14, 14, Y_)
S(s, 'CONTOH 20 (sambungan)', 'Memahami masalah dan merancang strategi',
  work([('Memahami masalah', [f'(a) {i("VY")} dan {i("WY")} ialah tangen kepada bulatan. Diameter tayar 60 cm dan jarak {i("WY")} ialah 1.6 meter.', f'(b) Jarak di antara pusat tayar dengan titik {i("Y")}.']),
        ('Merancang strategi', ['Lakar rajah dan labelkannya dengan nilai-nilai yang diberi.', 'Diameter = 60 cm = 0.6 meter', 'Jejari = 30 cm = 0.3 meter', f'{i("WY")} = 1.6 meter'])], s, 1, 18),
  SV(o, 'Lakaran tayar berpusat O dengan jejari 0.3 m dan tangen WY 1.6 m'))
S(s, 'CONTOH 20 (sambungan)', 'Melaksanakan strategi',
  work([('Melaksanakan strategi', [f'(a) {i("VY")} = {i("WY")} = 1.6 m', f'(b) {i("OY")} = {sq("1.6² + 0.3²")}', f'&emsp;&emsp;&ensp;= {sq("2.65")}', f'{i("OY")} = 1.63 m (2 t.p.)'])], s, 1, 19)
  + work([('Membuat kesimpulan', [f'(a) ∆{i("OWY")} dan ∆{i("OVY")} ialah kongruen. Maka, {i("VY")} = {i("WY")} = 1.6 meter.', f'(b) Jarak di antara pusat tayar dengan titik {i("Y")}, {i("OY")} = 1.63 m.'])], s, 1, 19),
  SV(o, 'Lakaran tayar berpusat O dengan jejari 0.3 m dan tangen WY 1.6 m'))

# =====================================================================
# 6.4 SUDUT DAN TANGEN BAGI BULATAN
# =====================================================================
s = '6.4'
c = COL[s]
Rs, d21 = 34, 255
O_ = (110, 80 + Rs)
A_ = (O_[0] + d21 * math.sin(math.radians(116)), O_[1] - d21 * math.cos(math.radians(116)))
rA = A_[1] - 80
Cq, Bq = (O_[0], 80), (A_[0], 80)
u = ((O_[0] - A_[0]) / d21, (O_[1] - A_[1]) / d21); D_ = (A_[0] + u[0] * rA, A_[1] + u[1] * rA)
assert abs(math.dist(O_, A_) - d21) < 1e-6 and (360 - 90 - 90 - 116) == 64 and (180 - 64) / 2 == 58
fig21 = seg((30, 80), (470, 80), MU3, 4) + circle((O_[0], O_[1], Rs), TX, 3) + circle((A_[0], A_[1], rA), TX, 3) + dot(O_) + dot(A_)
fig21 += seg(Cq, O_, AM, 2.5) + seg(Bq, A_, AM, 2.5) + seg(O_, A_, PA, 3) + seg(Bq, D_, GR, 2.5)
fig21 += ang(O_, Cq, A_, '116°', TX, 22, 14, 42) + ang(Bq, A_, D_, i('x'), GR, 34, 16, 50) + ang(D_, Bq, A_, i('x'), GR, 30, 16, 46)
fig21 += GF.T(Cq[0], 62, 'C', TX, 16) + GF.T(Bq[0], 62, 'B', TX, 16) + GF.T(O_[0] - 14, O_[1] + 8, 'O', TX, 16) + GF.T(A_[0] + 14, A_[1] + 8, 'A', TX, 16) + labp(D_, A_, 'D', 16)
S(s, 'CONTOH 21', 'Masalah sudut dan tangen',
  p('Kita sentiasa melihat bentuk bulatan dalam pelbagai kegunaan harian, seperti roda basikal dan takal.')
  + p(f'Rajah di sebelah menunjukkan dua takal berpusat {i("O")} dan {i("A")}, masing-masing, digantung dari siling rata {i("BC")}. Tali {i("ADO")} menghubungkan kedua-dua takal itu. Hitung nilai {i("x")}.')
  + work([('Memahami masalah', [f'{i("BC")} ialah tangen pada bulatan-bulatan pada titik {i("C")} dan {i("B")}.', f'{an("OCB")} = {an("ABC")} = 90°', f'{an("AOC")} = 116°', f'Mengenal pasti {an("ABD")}, {i("x")}']),
          ('Merancang strategi', [f'{an("OCB")} + {an("ABC")} + {an("AOC")} + {an("OAB")} = 360°', f'{an("ABD")} = {an("ADB")} = {i("x")}'])], s, 1, 17),
  SV(fig21, 'Dua takal berpusat O dan A digantung dari siling BC'))
S(s, 'CONTOH 21 (sambungan)', 'Melaksanakan strategi',
  work([('Melaksanakan strategi', [f'{an("OAB")} + 90° + 90° + 116° = 360°', f'{an("OAB")} = 360° − 90° − 90° − 116°', '&emsp;&emsp;&ensp;&nbsp;= 64°',
                                   f'{i("AB")} dan {i("AD")} ialah jejari. Maka, {an("ABD")} = {an("ADB")} = {i("x")}', f'{i("x")} = {F("180° − 64°", 2)}', f'{i("x")} = 58°'])], s, 1, 19)
  + work([('Membuat kesimpulan', [f'Nilai {i("x")} = 58°'])], s, 1, 19),
  SV(fig21, 'Dua takal berpusat O dan A digantung dari siling BC'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'sudutbulatan', 'slides.js')
HEAD = '/* Nota Bab 6 ikut buku teks Matematik T3 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
