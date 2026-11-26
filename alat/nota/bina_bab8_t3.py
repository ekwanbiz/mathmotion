"""Bab 8 T3 Lokus dalam Dua Dimensi: nota ikut buku teks (ayat buku, nombor ditukar).
Subtopik ikut buku: 8.1 Lokus, 8.2 Lokus dalam Dua Dimensi (sama dengan folder lokus)."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX
from rajah2d import circle, dot, seg, ang, rt, tick, ext

SUBS = [{"no": "8.1", "name": "Lokus", "col": "#FBBF24"}, {"no": "8.2", "name": "Lokus dalam Dua Dimensi", "col": "#34D399"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def i(s):
    return f'<i>{s}</i>'


def cap(x, y, t, col=MU3, size=15, anchor='middle'):
    return GF.T(x, y, t, col, size, anchor, halo=False)


def grid(x0, y0, cols, rows, u, col='#26344F'):
    o = ''.join(GF.L((x0 + k * u, y0), (x0 + k * u, y0 + rows * u), col, 1.2) for k in range(cols + 1))
    return o + ''.join(GF.L((x0, y0 + k * u), (x0 + cols * u, y0 + k * u), col, 1.2) for k in range(rows + 1))


def lokus(p, q, col=PK, w=3.5, dash=None):
    return GF.L(p, q, col, w, dash)


def arcmark(c, r, a1, a2, col=MU3, w=1.8):
    """lengkok kecil jangka lukis berpusat c (darjah math a1→a2)."""
    p1 = (c[0] + r * math.cos(math.radians(a1)), c[1] - r * math.sin(math.radians(a1)))
    p2 = (c[0] + r * math.cos(math.radians(a2)), c[1] - r * math.sin(math.radians(a2)))
    return f'<path d="M{p1[0]:.1f} {p1[1]:.1f} A{r:.1f} {r:.1f} 0 0 0 {p2[0]:.1f} {p2[1]:.1f}" fill="none" stroke="{col}" stroke-width="{w}"/>'


def otimes(p, col=PK):
    return f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="8" fill="none" stroke="{col}" stroke-width="2.4"/>' + GF.L((p[0] - 5.7, p[1] - 5.7), (p[0] + 5.7, p[1] + 5.7), col, 2.2) + GF.L((p[0] - 5.7, p[1] + 5.7), (p[0] + 5.7, p[1] - 5.7), col, 2.2)


# =====================================================================
# 8.1 LOKUS
# =====================================================================
s = '8.1'
c = COL[s]
o = f'<circle cx="120" cy="140" r="70" fill="none" stroke="{MU3}" stroke-width="10"/>' + f'<circle cx="120" cy="140" r="70" fill="none" stroke="{c}" stroke-width="2.5" stroke-dasharray="6 6"/>'
o += f'<circle cx="120" cy="70" r="8" fill="{PK}"/>' + cap(120, 240, 'Pelekat pada tayar: bulatan', MU3, 14)
o += f'<path d="M260 230 Q 350 40 460 200" fill="none" stroke="{c}" stroke-width="3" stroke-dasharray="7 6"/>' + f'<circle cx="260" cy="230" r="12" fill="{TX}"/>' + cap(360, 240, 'Bola ditendang: lengkung', MU3, 14)
o += f'<path d="M240 430 L240 300" stroke="{c}" stroke-width="3" stroke-dasharray="7 6"/>' + f'<path d="M240 290 L228 330 L252 330 Z" fill="{TR}"/>' + cap(240, 455, 'Roket dilancarkan: garis lurus', MU3, 14)
S(s, 'DEFINISI', 'Lokus',
  p('Sekeping pelekat warna dilekatkan pada tayar basikal. Bentuk yang dihasilkan oleh pelekat itu apabila basikal dikayuh ialah suatu bulatan.')
  + p('Pergerakan suatu titik pada bola yang ditendang menghasilkan suatu lengkung. Pergerakan suatu titik pada roket yang sedang dilancarkan akan menghasilkan suatu bentuk garis lurus.')
  + de(s, '<b>Lokus</b> ialah satu surihan atau lintasan oleh satu set titik dalam satu satah atau ruang tiga dimensi yang memenuhi syarat-syarat tertentu.')
  + note('Bentuk lokus dua dimensi boleh dilihat dalam bentuk garis lurus, lengkok dan lengkung.'),
  SV(o, 'Lokus titik pada tayar, bola dan roket'))

# Contoh 1: kipas
o = ''
for k in range(3):
    a = math.radians(90 + 120 * k)
    tip = (130 + 95 * math.cos(a), 220 - 95 * math.sin(a))
    o += f'<path d="M130 220 L{130 + 30 * math.cos(a - 0.4):.1f} {220 - 30 * math.sin(a - 0.4):.1f} L{tip[0]:.1f} {tip[1]:.1f} L{130 + 30 * math.cos(a + 0.4):.1f} {220 - 30 * math.sin(a + 0.4):.1f} Z" fill="{MU}66" stroke="{MU3}" stroke-width="2"/>'
o += f'<circle cx="130" cy="220" r="12" fill="{MU3}"/>' + dot((130, 125), PK, 7) + GF.T(146, 118, 'C', TX, 16)
o += GF.L((250, 220), (290, 220), MU3, 2) + GF.head((250, 220), (292, 220), MU3, 2)
o += circle((380, 220, 95), c, 3.5) + dot((380, 125), PK, 7) + GF.T(396, 118, 'C', TX, 16) + cap(380, 350, 'Lokus titik C: bulatan', c, 15)
S(s, 'CONTOH 1', 'Lokus titik pada kipas',
  p(f'Satu titik {i("C")} dilukis pada satu sayap sebuah kipas yang sedang berputar seperti dalam rajah. Terang dan lakarkan lokus bagi titik {i("C")}.')
  + pen(s, ['Lokus itu adalah berbentuk bulatan.']),
  SV(o, 'Titik C pada sayap kipas dan lokusnya berbentuk bulatan'))

# Contoh 2: papan segi empat tepat → silinder
o = GF.L((110, 70), (110, 400), TX, 5) + GF.T(96, 66, 'N', TX, 16) + GF.T(96, 404, 'M', TX, 16)
o += f'<rect x="110" y="140" width="80" height="190" fill="{PA}55" stroke="{PA}" stroke-width="2.5"/>' + GF.T(204, 134, 'Q', TX, 15) + GF.T(204, 340, 'P', TX, 15) + GF.T(96, 134, 'R', TX, 15) + GF.T(96, 340, 'S', TX, 15)
o += GF.L((330, 70), (330, 400), TX, 4)
o += f'<ellipse cx="330" cy="140" rx="80" ry="20" fill="none" stroke="{c}" stroke-width="3"/>' + f'<path d="M250 330 A80 20 0 0 0 410 330" fill="none" stroke="{c}" stroke-width="3"/>' + f'<path d="M250 330 A80 20 0 0 1 410 330" fill="none" stroke="{c}" stroke-width="2" stroke-dasharray="6 5"/>'
o += GF.L((250, 140), (250, 330), c, 3) + GF.L((410, 140), (410, 330), c, 3) + cap(330, 440, 'Silinder tegak', c, 15) + cap(150, 440, 'Papan PQRS', PA, 15)
S(s, 'CONTOH 2', 'Lokus sisi papan yang diputarkan',
  p(f'Rajah di sebelah menunjukkan sebatang tiang {i("MN")}. Sekeping papan berbentuk segi empat tepat {i("PQRS")} disambung pada tiang itu dengan keadaan papan {i("PQRS")} boleh digerakkan. Jika sisi {i("PQ")} diputarkan 360°, mengelilingi tiang {i("MN")}, apakah bentuk tiga dimensi yang akan terbentuk?')
  + pen(s, [f'Bentuk yang dihasilkan apabila sisi {i("PQ")} diputarkan 360° mengelilingi tiang {i("MN")} ialah bentuk <b>silinder tegak</b>.'])
  + note('Silinder, sfera, kon, prisma dan piramid merupakan antara contoh bentuk tiga dimensi.', 'Imbas kembali:'),
  SV(o, 'Papan segi empat tepat pada tiang dan silinder yang terbentuk'))

# Contoh 3: semi bulatan → sfera
o = GF.L((110, 70), (110, 400), TX, 5) + GF.T(96, 66, 'N', TX, 16) + GF.T(96, 404, 'M', TX, 16)
o += f'<path d="M110 145 A90 90 0 0 1 110 325 Z" fill="{PA}55" stroke="{PA}" stroke-width="2.5"/>' + GF.T(96, 140, 'R', TX, 15) + GF.T(96, 330, 'P', TX, 15) + GF.T(214, 236, 'Q', TX, 15)
o += GF.L((340, 70), (340, 400), TX, 4) + circle((340, 235, 92), c, 3) + f'<ellipse cx="340" cy="235" rx="92" ry="22" fill="none" stroke="{c}" stroke-width="2" stroke-dasharray="6 5"/>'
o += cap(340, 440, 'Sfera', c, 15) + cap(150, 440, 'Papan semi bulatan PQR', PA, 15)
S(s, 'CONTOH 3', 'Lokus papan semi bulatan yang diputarkan',
  p(f'Rajah di sebelah menunjukkan sebatang tiang {i("MN")}. Sekeping papan berbentuk semi bulatan {i("PQR")} disambung pada tiang itu dengan keadaan papan {i("PQR")} itu boleh digerakkan. Jika papan {i("PQR")} diputarkan 360°, mengelilingi tiang {i("MN")}, apakah bentuk tiga dimensi yang akan terbentuk?')
  + pen(s, ['Bentuk yang dihasilkan apabila papan berbentuk semi bulatan diputarkan 360° mengelilingi tiang <i>MN</i> ialah bentuk <b>sfera</b>.']),
  SV(o, 'Papan semi bulatan pada tiang dan sfera yang terbentuk'))

# =====================================================================
# 8.2 LOKUS DALAM DUA DIMENSI
# =====================================================================
s = '8.2'
c = COL[s]
# (1) jarak tetap dari satu titik
O_ = (250, 230)
o = circle((250, 230, 150), c, 3.5) + dot(O_) + GF.T(264, 244, 'O', TX, 17)
for k in range(12):
    a = math.radians(30 * k + 8)
    q = (250 + 150 * math.cos(a), 230 - 150 * math.sin(a))
    o += GF.T(q[0], q[1], '×', AM, 20)
o += GF.L(O_, (400, 230), MU3, 2, '6 5') + cap(325, 218, '5 cm', MU3, 15)
S(s, 'SIFAT', 'Lokus titik yang berjarak tetap dari satu titik tetap',
  p(f'Titik-titik yang ditanda pada jarak yang sama dari titik tetap {i("O")}, membentuk satu bulatan. Secara generalisasi,')
  + de(s, 'Lokus bagi suatu titik yang berjarak tetap dari satu titik tetap ialah sebuah <b>bulatan</b> yang berpusat di titik tetap tersebut.'),
  SV(o, 'Titik-titik berjarak 5 cm dari O membentuk bulatan'))

# Contoh 4: 2.5 cm
o = dot((250, 230)) + GF.T(236, 244, 'O', TX, 17) + GF.rv(circle((250, 230, 100), PK, 3.5) + GF.L((250, 230), (350, 230), MU3, 2, '6 5') + cap(300, 218, '2.5 cm', MU3, 15) + GF.T(340, 140, 'Lokus P', PK, 16))
S(s, 'CONTOH 4', 'Membina lokus berjarak tetap dari satu titik',
  p(f'Bina lokus bagi titik {i("P")} yang sentiasa berjarak 2.5 cm dari satu titik tetap {i("O")}.')
  + pen(s, [f'Tandakan titik {i("O")}.', 'Ukur 2.5 cm untuk bukaan jangka lukis.', f'Bina bulatan berjejari 2.5 cm yang berpusat pada titik {i("O")}.']),
  SV(o, 'Bulatan berjejari 2.5 cm berpusat di O ialah lokus P'))

# (2) sama jarak dari dua titik
P_, Q_ = (130, 260), (370, 260)
o = dot(P_) + dot(Q_) + GF.T(P_[0] - 14, P_[1] + 4, 'P', TX, 17) + GF.T(Q_[0] + 14, Q_[1] + 4, 'Q', TX, 17) + GF.L(P_, Q_, MU3, 2, '6 5')
for d_ in (60, 110, 160):
    h = math.sqrt(max(0, (120 + d_ * 0.4) ** 2 - 120 ** 2)) if False else d_
    for sg in (1, -1):
        X = (250, 260 - sg * h)
        o += GF.T(X[0], X[1], '×', AM, 20)
o += lokus((250, 60), (250, 440), PK) + rt((250, 260), (250, 200), (310, 260), 14) + tick(P_, (250, 260)) + tick((250, 260), Q_) + cap(320, 80, 'Lokus', PK, 15)
S(s, 'SIFAT', 'Lokus titik yang berjarak sama dari dua titik tetap',
  p(f'Kedudukan tanda-tanda persilangan yang ditanda sama jarak dari titik tetap {i("P")} dan {i("Q")} membentuk satu garis lurus yang melalui titik tengah {i("PQ")}. Secara generalisasi,')
  + de(s, 'Lokus bagi suatu titik yang berjarak sama dari dua titik tetap ialah <b>pembahagi dua sama serenjang</b> bagi garis lurus yang menyambungkan dua titik tetap itu.'),
  SV(o, 'Garis pembahagi dua sama serenjang PQ ialah lokus berjarak sama dari P dan Q'))

# Contoh 5: membina pembahagi dua sama serenjang
M_, N_ = (130, 250), (370, 250); r_ = 160
h = math.sqrt(r_ ** 2 - 120 ** 2)
X1, X2 = (250, 250 - h), (250, 250 + h)
o = dot(M_) + dot(N_) + GF.T(M_[0] - 14, M_[1] + 4, 'M', TX, 17) + GF.T(N_[0] + 14, N_[1] + 4, 'N', TX, 17) + GF.L(M_, N_, MU3, 2, '6 5')
o += GF.rv(arcmark(M_, r_, 32, 52) + arcmark(M_, r_, -52, -32))
o += GF.rv(arcmark(N_, r_, 128, 148) + arcmark(N_, r_, 212, 232))
o += GF.rv(lokus(ext(X2, X1, 40), ext(X1, X2, 40), PK) + rt((250, 250), (250, 200), (300, 250), 14) + GF.T(300, 70, 'Lokus P', PK, 16))
S(s, 'CONTOH 5', 'Membina lokus berjarak sama dari dua titik',
  p(f'Bina lokus bagi titik {i("P")} yang berjarak sama dari dua titik tetap {i("M")} dan {i("N")}.')
  + pen(s, [f'Tandakan dua lengkok kecil menggunakan jangka lukis dengan bukaan lebih separuh daripada panjang {i("MN")} dari titik {i("M")}.',
            f'Dengan bukaan jangka lukis yang sama, tanda persilangan lengkok dari titik {i("N")}.', 'Sambungkan kedua-dua titik persilangan dengan garis lurus.']),
  SV(o, 'Pembinaan pembahagi dua sama serenjang MN dengan jangka lukis'))
OUT[-1]['fig'] = OUT[-1]['fig']  # susunan langkah: urutan.json

# Contoh 6: segi tiga sama sisi
P_, R_ = (110, 380), (390, 380); Q_ = (250, 380 - 280 * math.sqrt(3) / 2)
o = '<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in (P_, Q_, R_)) + f'" fill="{TR}22" stroke="{TR}" stroke-width="3"/>'
o += GF.T(P_[0] - 14, P_[1] + 6, 'P', TX, 17) + GF.T(R_[0] + 14, R_[1] + 6, 'R', TX, 17) + GF.T(Q_[0], Q_[1] - 16, 'Q', TX, 17)
o += GF.rv(lokus((250, 60), (250, 440), PK) + rt((250, 380), (250, 330), (300, 380), 14) + GF.T(306, 80, 'Lokus X', PK, 16))
S(s, 'CONTOH 6', 'Lokus dalam segi tiga sama sisi',
  p(f'Rajah di sebelah menunjukkan segi tiga sama sisi {i("PQR")}. Tentukan lokus bagi titik {i("X")} yang berjarak sama dari titik {i("P")} dan titik {i("R")}.')
  + pen(s, [f'Lokus bagi titik {i("X")} yang berjarak sama dari titik {i("P")} dan titik {i("R")} ialah pembahagi dua sama serenjang bagi garis yang menyambungkan titik {i("P")} dan titik {i("R")}.']),
  SV(o, 'Segi tiga sama sisi PQR dan lokus X melalui Q'))

# (3) jarak tetap dari satu garis
u = 30
o = grid(25, 85, 15, 10, u) + GF.L((25, 235), (475, 235), TX, 3.5) + GF.T(16, 235, 'M', TX, 16, 'end') + GF.T(484, 235, 'N', TX, 16, 'start')
for k in range(1, 15):
    o += GF.T(25 + k * u, 235 - 3 * u, '×', AM, 18) + GF.T(25 + k * u, 235 + 3 * u, '×', AM, 18)
o += lokus((25, 145), (475, 145), PK, 2.5) + lokus((25, 325), (475, 325), PK, 2.5) + GF.L((60, 235), (60, 145), MU3, 2) + GF.T(66, 190, '3 unit', MU3, 13, 'start')
S(s, 'SIFAT', 'Lokus titik yang berjarak tetap dari satu garis lurus',
  p(f'Lokus bagi suatu titik yang sentiasa sama jarak dari garis lurus, {i("MN")}, ialah sepasang garis lurus yang selari dengan {i("MN")}. Secara generalisasi,')
  + de(s, 'Lokus bagi titik yang berjarak tetap dari satu garis lurus ialah <b>garis lurus yang selari</b> dengan garis lurus tersebut.'),
  SV(o, 'Titik-titik berjarak 3 unit dari MN membentuk dua garis selari'))

# Contoh 7: 2 unit
o = grid(85, 85, 11, 10, u) + GF.L((85 + u, 235), (85 + 10 * u, 235), TX, 3.5) + dot((85 + u, 235)) + dot((85 + 10 * u, 235))
o += GF.T(85 + u - 12, 235, 'A', TX, 16, 'end') + GF.T(85 + 10 * u + 12, 235, 'B', TX, 16, 'start')
o += GF.rv(lokus((85, 235 - 2 * u), (85 + 11 * u, 235 - 2 * u), PK) + lokus((85, 235 + 2 * u), (85 + 11 * u, 235 + 2 * u), PK) + GF.T(430, 235 - 2 * u, 'Lokus X', PK, 15, 'start') + GF.T(430, 235 + 2 * u, 'Lokus X', PK, 15, 'start'))
S(s, 'CONTOH 7', 'Lokus berjarak tetap dari garis lurus',
  p(f'Rajah di sebelah menunjukkan satu garis {i("AB")} dilukis pada grid segi empat sama bersisi 1 unit. Pada rajah, lukiskan lokus bagi titik {i("X")} yang sentiasa bergerak 2 unit dari garis {i("AB")}.')
  + pen(s, [f'Lokus bagi titik {i("X")} yang bergerak 2 unit dari garis {i("AB")} ialah sepasang garis yang selari dengan {i("AB")} dan berjarak 2 unit dari garis {i("AB")}.']),
  SV(o, 'Garis AB pada grid dan dua garis selari berjarak 2 unit'))

# (4) sama jarak dari dua garis selari
o = GF.L((40, 140), (460, 140), TX, 3.5) + GF.L((40, 340), (460, 340), TX, 3.5) + GF.T(30, 140, 'P', TX, 16, 'end') + GF.T(470, 140, 'Q', TX, 16, 'start') + GF.T(30, 340, 'M', TX, 16, 'end') + GF.T(470, 340, 'N', TX, 16, 'start')
for x_ in (100, 250, 400):
    o += GF.T(x_, 240, '×', AM, 22) + tick((x_, 140), (x_, 240)) + tick((x_, 240), (x_, 340)) + GF.L((x_, 140), (x_, 340), MU, 1.4, '5 5')
o += lokus((40, 240), (460, 240), PK) + cap(250, 225, 'Lokus', PK, 15)
S(s, 'SIFAT', 'Lokus titik yang berjarak sama dari dua garis selari',
  p('Didapati bahawa;')
  + bul(s, [f'(a) Lokus yang berjarak sama dari dua garis selari {i("PQ")} dan {i("MN")} ialah satu garis lurus.', f'(b) Lokus tersebut adalah selari dengan garis lurus {i("PQ")} dan {i("MN")} serta melalui titik tengah garis {i("PQ")} dan {i("MN")}.'])
  + p('Secara generalisasi,')
  + de(s, 'Lokus bagi titik yang <b>berjarak sama dari dua garis lurus</b> yang selari ialah <b>satu garis lurus yang selari dan melalui titik tengah</b> bagi pasangan garis lurus selari tersebut.'),
  SV(o, 'Garis di tengah antara dua garis selari PQ dan MN'))

# Contoh 8: AB dan DC 8 unit
u = 34
o = grid(80, 80, 10, 8, u) + f'<rect x="{80 + u}" y="80" width="{8 * u}" height="{8 * u}" fill="none" stroke="{TR}" stroke-width="3"/>'
o += GF.T(80 + u - 8, 66, 'A', TX, 16) + GF.T(80 + 9 * u + 8, 66, 'B', TX, 16) + GF.T(80 + u - 8, 80 + 8 * u + 16, 'D', TX, 16) + GF.T(80 + 9 * u + 8, 80 + 8 * u + 16, 'C', TX, 16)
o += GF.rv(lokus((80 + u, 80 + 4 * u), (80 + 9 * u, 80 + 4 * u), PK) + GF.T(80 + 9 * u + 12, 80 + 4 * u, 'Lokus X', PK, 15, 'start'))
S(s, 'CONTOH 8', 'Lokus berjarak sama dari dua garis selari',
  p(f'Rajah di sebelah menunjukkan segi empat sama {i("ABCD")} yang dilukis pada grid segi empat sama bersisi 1 unit. Huraikan dan lukis lokus {i("X")} yang berjarak sama dari garis {i("AB")} dan {i("DC")}.')
  + pen(s, [f'Lokus bagi titik {i("X")} yang berjarak sama dari garis {i("AB")} dan {i("DC")} ialah garis yang selari dengan {i("AB")} dan {i("DC")} serta berjarak 4 unit dari garis {i("AB")} dan {i("DC")}.']),
  SV(o, 'Segi empat sama ABCD dengan lokus X di tengah antara AB dan DC'))

# (5) sama jarak dari dua garis bersilang
Gr = GF.Gr((60, 50, 440, 430), (-4.5, 4.5), (-4.5, 4.5), 2, 2, 1, 1, equal=True)
for v in (-4, -2, 0, 2, 4):
    Gr.add(GF.T(Gr.X(v), Gr.Y(v), '×', AM, 20))
Gr.add(lokus(Gr.P(-4.4, -4.4), Gr.P(4.4, 4.4), PK, 3))
Gr.add(ang(Gr.P(0, 0), Gr.P(3, 0), Gr.P(3, 3), i('a'), GR, 40, 15, 56) + ang(Gr.P(0, 0), Gr.P(0, 3), Gr.P(3, 3), i('b'), GR, 46, 15, 62))
S(s, 'SIFAT', 'Lokus titik yang berjarak sama dari dua garis bersilang',
  p('Didapati bahawa;')
  + bul(s, [f'(a) ∠{i("a")} = ∠{i("b")} = 45°.', f'(b) Garis lurus yang menyambungkan pasangan koordinat bernilai sama, membahagi dua sama sudut persilangan antara paksi-{i("x")} dengan paksi-{i("y")}.'])
  + p('Secara generalisasi,')
  + de(s, 'Lokus bagi titik yang berjarak sama dari dua garis lurus yang bersilang ialah <b>pembahagi dua sama sudut</b> bagi garis-garis tersebut.'),
  SV(Gr.svg(), 'Titik dengan koordinat sama membentuk garis pembahagi dua sama sudut antara paksi'))

# Contoh 9: pembahagi dua sama sudut
Pp = (90, 330); Qd = (440, 120); Nd = (460, 360)
uq = ((Qd[0] - Pp[0]), (Qd[1] - Pp[1])); lq = math.hypot(*uq); uq = (uq[0] / lq, uq[1] / lq)
un = ((Nd[0] - Pp[0]), (Nd[1] - Pp[1])); ln = math.hypot(*un); un = (un[0] / ln, un[1] / ln)
A1 = (Pp[0] + 120 * uq[0], Pp[1] + 120 * uq[1]); A2 = (Pp[0] + 120 * un[0], Pp[1] + 120 * un[1])
bis = ((uq[0] + un[0]), (uq[1] + un[1])); lb = math.hypot(*bis); bis = (bis[0] / lb, bis[1] / lb)
Xp = (Pp[0] + 230 * bis[0], Pp[1] + 230 * bis[1])
a_ = lambda p_: math.degrees(math.atan2(-(p_[1] - Pp[1]), p_[0] - Pp[0]))
o = GF.L(Pp, Qd, TX, 3.5) + GF.L(Pp, Nd, TX, 3.5) + GF.T(Pp[0] - 14, Pp[1], 'P', TX, 17) + GF.T(Qd[0] + 12, Qd[1] - 4, 'Q', TX, 17) + GF.T(Nd[0] + 6, Nd[1] + 16, 'N', TX, 17)
o += GF.rv(arcmark(Pp, 120, a_(Nd) - 6, a_(Qd) + 6, MU3) + dot(A1, AM, 4) + dot(A2, AM, 4) + GF.T(A1[0] - 6, A1[1] - 16, 'A₁', AM, 15) + GF.T(A2[0] + 4, A2[1] + 18, 'A₂', AM, 15))
dA = math.dist(A1, Xp)
o += GF.rv(arcmark(A1, dA, math.degrees(math.atan2(-(Xp[1] - A1[1]), Xp[0] - A1[0])) - 12, math.degrees(math.atan2(-(Xp[1] - A1[1]), Xp[0] - A1[0])) + 12) + arcmark(A2, dA, math.degrees(math.atan2(-(Xp[1] - A2[1]), Xp[0] - A2[0])) - 12, math.degrees(math.atan2(-(Xp[1] - A2[1]), Xp[0] - A2[0])) + 12))
o += GF.rv(lokus(Pp, (Pp[0] + 380 * bis[0], Pp[1] + 380 * bis[1]), PK) + GF.T(Pp[0] + 380 * bis[0] - 6, Pp[1] + 380 * bis[1] - 18, 'Lokus X', PK, 15))
S(s, 'CONTOH 9', 'Membina pembahagi dua sama sudut',
  p(f'Bina lokus bagi titik {i("X")} yang berjarak sama dari dua garis lurus, {i("PQ")} dan {i("PN")} yang bersilang di {i("P")}.')
  + pen(s, [f'Dengan menggunakan jangka lukis, tanda satu lengkok daripada titik {i("P")} yang memotong garis lurus {i("PQ")} dan {i("PN")}.',
            f'Tandakan titik persilangan antara lengkok dan garis lurus {i("PQ")} dan {i("PN")} sebagai {i("A")}<sub>1</sub> dan {i("A")}<sub>2</sub> masing-masing.',
            f'Bina persilangan dari titik {i("A")}<sub>1</sub> dan {i("A")}<sub>2</sub>.', f'Lukis satu garis lurus yang menyambungkan titik persilangan yang dibina pada langkah 3 dan titik {i("P")}.']),
  SV(o, 'Pembinaan pembahagi dua sama sudut QPN dengan jangka lukis'))

# Contoh 10: segi empat sama
A_, B_, C_, D_ = (110, 90), (390, 90), (390, 370), (110, 370)
o = '<polygon points="' + ' '.join(f'{x},{y}' for x, y in (A_, B_, C_, D_)) + f'" fill="{TR}18" stroke="{TR}" stroke-width="3"/>'
o += GF.T(96, 80, 'A', TX, 17) + GF.T(404, 80, 'B', TX, 17) + GF.T(404, 384, 'C', TX, 17) + GF.T(96, 384, 'D', TX, 17)
o += GF.rv(lokus(A_, C_, PK) + ang(A_, B_, C_, '', AM, 40) + ang(A_, C_, D_, '', AM, 46) + GF.T(300, 300, 'Lokus Y', PK, 15))
S(s, 'CONTOH 10', 'Lokus berjarak sama dari dua sisi bersilang',
  p(f'Rajah di sebelah menunjukkan segi empat sama {i("ABCD")}. Huraikan dan lukis lokus bagi titik {i("Y")} yang bergerak sama jarak dari garis {i("AB")} dan garis {i("AD")}.')
  + pen(s, [f'Lokus bagi titik {i("Y")} yang bergerak sama jarak dari garis {i("AB")} dan garis {i("AD")} ialah garis lurus yang membahagi dua sama sudut {i("BAD")}.']),
  SV(o, 'Segi empat sama ABCD dan lokus Y sepanjang pepenjuru AC'))

# Contoh 11: dua syarat
u = 38; x0, y0 = 95, 70
A_, B_, C_, D_ = (x0, y0), (x0 + 8 * u, y0), (x0 + 8 * u, y0 + 8 * u), (x0, y0 + 8 * u)
o = grid(x0, y0, 8, 8, u) + '<polygon points="' + ' '.join(f'{x},{y}' for x, y in (A_, B_, C_, D_)) + f'" fill="none" stroke="{TR}" stroke-width="3"/>'
o += GF.T(x0 - 12, y0 - 10, 'A', TX, 16) + GF.T(x0 + 8 * u + 12, y0 - 10, 'B', TX, 16) + GF.T(x0 + 8 * u + 12, y0 + 8 * u + 16, 'C', TX, 16) + GF.T(x0 - 12, y0 + 8 * u + 16, 'D', TX, 16)
o += GF.rv(f'<path d="M{x0 + 6 * u} {y0} A{6 * u} {6 * u} 0 0 1 {x0} {y0 + 6 * u}" fill="none" stroke="{PK}" stroke-width="3.5"/>' + GF.T(x0 + 6 * u + 10, y0 + 40, 'Lokus X', PK, 14, 'start'))
o += GF.rv(lokus((x0, y0 + 4 * u), (x0 + 8 * u, y0 + 4 * u), GR) + GF.T(x0 + 8 * u + 8, y0 + 4 * u - 14, 'Lokus Y', GR, 14, 'start'))
xi = math.sqrt(36 - 16)
o += GF.rv(otimes((x0 + xi * u, y0 + 4 * u), AM))
S(s, 'CONTOH 11', 'Lokus yang memenuhi dua syarat',
  p('Persilangan bagi dua atau lebih lokus boleh ditentukan dengan membina setiap lokus yang dinyatakan pada satu rajah yang sama.')
  + p(f'Rajah di sebelah menunjukkan segi empat sama {i("ABCD")} yang dilukis pada grid segi empat sama bersisi 1 unit. Titik {i("X")} dan titik {i("Y")} ialah dua titik yang bergerak di dalam segi empat sama {i("ABCD")} tersebut. Pada rajah, lukis')
  + bul(s, [f'(a) lokus bagi titik {i("X")} yang bergerak dengan keadaan jaraknya sentiasa 6 unit dari {i("A")}.', f'(b) lokus bagi titik {i("Y")} yang bergerak dengan keadaan jaraknya adalah sentiasa sama dari garis {i("AB")} dan garis {i("CD")}.',
            f'(c) Tandakan kedudukan bagi semua titik persilangan lokus {i("X")} dan lokus {i("Y")} dengan simbol ⊗.']),
  SV(o, 'Segi empat sama ABCD dengan lokus X lengkok berjejari 6 unit dan lokus Y garis tengah'))

# Contoh 12: empat segi empat sama 2.5 cm
k = 72; x0, y0 = 110, 85
pts = {'P': (x0, y0), 'Q': (x0 + k, y0), 'R': (x0 + 2 * k, y0), 'S': (x0 + 2 * k, y0 + k), 'T': (x0 + 2 * k, y0 + 2 * k), 'U': (x0 + k, y0 + 2 * k), 'V': (x0, y0 + 2 * k), 'W': (x0, y0 + k), 'M': (x0 + k, y0 + k)}
o = f'<rect x="{x0}" y="{y0}" width="{2 * k}" height="{2 * k}" fill="none" stroke="{TR}" stroke-width="3"/>' + GF.L(pts['Q'], pts['U'], TR, 2.4) + GF.L(pts['W'], pts['S'], TR, 2.4)
for n_, (x, y) in pts.items():
    dx, dy = (x - pts['M'][0]), (y - pts['M'][1]); dd = math.hypot(dx, dy) or 1
    o += GF.T(x + dx / dd * 18 if n_ != 'M' else x + 12, y + dy / dd * 18 if n_ != 'M' else y + 16, n_, TX, 16)
o += GF.T(x0 + k / 2, y0 - 14, '2.5 cm', MU3, 13)
o += GF.rv(circle((pts['M'][0], pts['M'][1], k), PK, 3.5) + GF.T(x0 + 2 * k + 30, y0 + 20, 'Lokus X', PK, 14, 'start'))
o += GF.rv(lokus(pts['P'], pts['T'], GR) + GF.T(x0 + 2 * k + 30, y0 + 2 * k - 10, 'Lokus Y', GR, 14, 'start'))
d_ = k / math.sqrt(2)
o += GF.rv(otimes((pts['M'][0] - d_, pts['M'][1] - d_), AM) + otimes((pts['M'][0] + d_, pts['M'][1] + d_), AM))
S(s, 'CONTOH 12', 'Persilangan dua lokus',
  p(f'Rajah di sebelah menunjukkan empat segi empat sama bersisi 2.5 cm yang digabungkan. Titik {i("X")} dan titik {i("Y")} ialah dua titik yang bergerak dalam segi empat sama {i("PRTV")}. Pada rajah, lukis')
  + bul(s, [f'(a) lokus bagi titik {i("X")} yang bergerak dengan keadaan jaraknya sentiasa 2.5 cm dari {i("M")}.', f'(b) lokus bagi titik {i("Y")} yang bergerak dengan keadaan jaraknya adalah sentiasa sama dari garis {i("PR")} dan garis {i("PV")}.',
            f'(c) Tandakan kedudukan bagi semua titik persilangan lokus {i("X")} dan lokus {i("Y")} dengan simbol ⊗.']),
  SV(o, 'Empat segi empat sama dengan lokus X bulatan berpusat M dan lokus Y pepenjuru PT'))

# Contoh 13: klinik (skala 1 cm = 500 m)
k = 60   # px per cm
Ap, Bp = (60, 330), (440, 330); Pq, Qq = (170, 170), (330, 110)
mid = ((Pq[0] + Qq[0]) / 2, (Pq[1] + Qq[1]) / 2); dv = (Qq[0] - Pq[0], Qq[1] - Pq[1]); nb = (-dv[1], dv[0]); ln_ = math.hypot(*nb); nb = (nb[0] / ln_, nb[1] / ln_)
fig13 = GF.L(Ap, Bp, TX, 4) + dot(Ap) + dot(Bp) + GF.T(Ap[0] - 4, Ap[1] + 20, 'A', TX, 16) + GF.T(Bp[0] + 4, Bp[1] + 20, 'B', TX, 16) + cap(250, 352, 'Jalan raya', MU3, 14)
fig13 += dot(Pq, AM, 6) + dot(Qq, AM, 6) + GF.T(Pq[0] - 14, Pq[1] - 6, 'P', TX, 16) + GF.T(Qq[0] + 14, Qq[1] - 6, 'Q', TX, 16) + cap(250, 440, 'Skala 1 cm = 500 meter', MU3, 14)
o = fig13
S(s, 'CONTOH 13', 'Menyelesaikan masalah lokus',
  p(f'Sebuah klinik akan dibina di sebuah kampung. Klinik itu hendaklah berjarak sama di antara rumah {i("P")} dengan rumah {i("Q")}, serta berjarak 500 meter dari suatu jalan raya {i("AB")}. Tentukan kedudukan yang mungkin bagi klinik itu. (skala 1 cm = 500 meter)')
  + work([('Memahami masalah', [f'Klinik itu berjarak sama dari {i("P")} dan {i("Q")}, iaitu garis lurus pembahagi dua sama untuk {i("P")} dan {i("Q")}.', f'Klinik berjarak 500 meter dari jalan raya {i("AB")}. Wujud dua garis lurus selari.']),
          ('Merancang strategi', ['Melukis dengan menggunakan jangka lukis dan pembaris.'])], s, 1, 18),
  SV(o, 'Rumah P dan Q serta jalan raya AB'))
L1, L2 = 330 - k, 330 + k
def on_line(yv):
    t = (yv - mid[1]) / nb[1]
    return (mid[0] + nb[0] * t, yv)
o = fig13 + lokus(on_line(105), on_line(430), PK, 3) + tick(Pq, mid) + tick(mid, Qq) + GF.L(Pq, Qq, MU3, 1.6, '5 5') + GF.L((30, L1), (470, L1), GR, 3) + GF.L((30, L2), (470, L2), GR, 3)
o += GF.L((150, 330), (150, L1), MU3, 2) + GF.T(156, (330 + L1) / 2, '500 m', MU3, 13, 'start') + GF.L((150, 330), (150, L2), MU3, 2) + GF.T(156, (330 + L2) / 2, '500 m', MU3, 13, 'start')
o += otimes(on_line(L1), AM) + otimes(on_line(L2), AM) + GF.T(on_line(L1)[0] + 14, L1 - 14, 'Klinik', AM, 14, 'start') + GF.T(on_line(L2)[0] + 14, L2 + 18, 'Klinik', AM, 14, 'start')
S(s, 'CONTOH 13 (sambungan)', 'Melaksanakan strategi',
  work([('Melaksanakan strategi', [f'Bina pembahagi dua sama serenjang bagi garis {i("PQ")}.', f'Bina dua garis lurus yang selari dengan {i("AB")} dan berjarak 1 cm (500 meter) dari {i("AB")}.', 'Tandakan titik-titik persilangan dengan simbol ⊗.']),
        ('Membuat kesimpulan', ['Dua kedudukan yang ditandakan dengan simbol ⊗ memenuhi syarat-syarat untuk membina klinik.'])], s, 1, 19),
  SV(o, 'Pembahagi dua sama serenjang PQ dan dua garis selari jalan raya, dua kedudukan klinik'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'lokus', 'slides.js')
HEAD = '/* Nota Bab 8 ikut buku teks Matematik T3 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
