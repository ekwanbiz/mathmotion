"""Bab 8 T4 Sukatan Serakan Data Tak Terkumpul: nota ikut buku teks (ayat buku, nombor dan nama ditukar).
SUBS lama dikekalkan (8.1.1, 8.2.1–8.2.4) dan digabung kepada 8.1 dan 8.2 melalui BAB.gabung."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "8.1.1", "name": "Serakan", "col": "#38BDF8"}, {"no": "8.2.1", "name": "Julat dan Julat Antara Kuartil", "col": "#FB923C"}, {"no": "8.2.2", "name": "Varians dan Sisihan Piawai", "col": "#F472B6"},
        {"no": "8.2.3", "name": "Plot Kotak", "col": "#A78BFA"}, {"no": "8.2.4", "name": "Kesan Perubahan dan Perbandingan", "col": "#34D399"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr


def i(s):
    return f'<i>{s}</i>'


X = i('x')
SIG = 'σ'
XB = '<i>x̄</i>'


def SVh(inner, aria, h, y0=0):
    return f'<svg class="sl-svg" viewBox="0 {y0} 500 {h:.0f}" role="img" aria-label="{aria}">{inner}</svg>'


def med(v):
    v = sorted(v)
    n = len(v)
    return v[n // 2] if n % 2 else (v[n // 2 - 1] + v[n // 2]) / 2


def quart(v):
    v = sorted(v)
    n = len(v)
    lo, hi = v[:n // 2], v[(n + 1) // 2:]
    return med(lo), med(v), med(hi)


def nm(x):
    x = round(x, 4)
    return (str(int(x)) if x == int(x) else str(x)).replace('-', '−')


def var(v):
    m = sum(v) / len(v)
    return sum((a - m) ** 2 for a in v) / len(v)


assert quart([4, 4, 6, 8, 10, 13, 15, 16, 20, 22, 23]) == (6, 13, 20)  # semak kaedah buku


def numline(x0, x1, step, y, L=40, R=470, lab='', fs=14, sub=1):
    sx = (R - L) / (x1 - x0)
    X_ = lambda v: L + (v - x0) * sx
    o = GF.L((L - 10, y), (R + 10, y), MU3, 2.5)
    k = 0
    v = x0
    while v <= x1 + 1e-9:
        big = abs((v - x0) / step - round((v - x0) / step)) < 1e-9
        o += GF.L((X_(v), y - (6 if big else 3)), (X_(v), y + (6 if big else 3)), MU3, 2)
        if big:
            o += GF.T(X_(v), y + 20, nm(v), MU, fs)
        v = round(v + step / sub, 6)
    if lab:
        o += GF.T((L + R) / 2, y + 44, lab, TX, 15)
    return o, X_


def dotplot(data, x0, x1, step, y, lab='', col=TR, r=7, L=40, R=470, sub=1):
    o, X_ = numline(x0, x1, step, y, L, R, lab, sub=sub)
    cnt = {}
    for d in sorted(data):
        cnt[d] = cnt.get(d, 0) + 1
        o += f'<circle cx="{X_(d):.1f}" cy="{y - 4 - (2 * r + 3) * cnt[d] + r:.1f}" r="{r}" fill="{col}"/>'
    return o


def boxplot(mn_, q1, md, q3, mx, x0, x1, step, y, col=PU, L=40, R=470, h=50, lab=True):
    o, X_ = numline(x0, x1, step, y + h / 2 + 30, L, R)
    yc = y
    o += GF.L((X_(mn_), yc), (X_(q1), yc), col, 3) + GF.L((X_(q3), yc), (X_(mx), yc), col, 3)
    o += f'<rect x="{X_(q1):.1f}" y="{yc - h / 2:.1f}" width="{X_(q3) - X_(q1):.1f}" height="{h}" fill="{col}" fill-opacity="0.22" stroke="{col}" stroke-width="3"/>'
    o += GF.L((X_(md), yc - h / 2), (X_(md), yc + h / 2), col, 3)
    for v in (mn_, mx):
        o += GF.L((X_(v), yc - 12), (X_(v), yc + 12), col, 3)
    if lab:
        for v, t in [(mn_, 'Min'), (q1, 'Q₁'), (md, 'Q₂'), (q3, 'Q₃'), (mx, 'Maks')]:
            o += GF.T(X_(v), yc - h / 2 - 14, t, AM, 14)
    return o


# =====================================================================
# 8.1 SERAKAN
# =====================================================================
s = '8.1.1'
c = COL[s]
J = [54, 61, 63, 46, 57, 49, 72, 68, 70, 65, 49, 52, 66, 50, 67, 78, 60, 64, 77, 71]
assert max(J) - min(J) == 32
SG = [3.2, 3.5, 4.0, 4.0, 4.4, 5.0, 5.0, 5.0, 5.6, 6.1, 6.6]
o = dotplot(SG, 3, 7, 1, 120, 'Panjang (cm)', TR, 7, sub=10)
S(s, 'KONSEP', 'Maksud serakan',
  p('Sukatan serakan memberi gambaran tentang cara nilai-nilai dalam satu set data ditaburkan. Serakan adalah kecil jika set data itu mempunyai julat yang kecil dan sebaliknya.')
  + de(s, 'Sukatan serakan suatu data ialah sukatan kuantitatif seperti julat, julat antara kuartil, varians dan sisihan piawai.')
  + p('Bagi melihat serakan suatu taburan data, beza antara nilai cerapan terbesar dengan nilai cerapan terkecil diambil kira. Jika beza itu besar, data diserak lebih luas.')
  + note('Cerapan merupakan data atau dapatan yang diperoleh daripada sesuatu pemerhatian.', 'Info:'),
  stack(work([('CONTOH 1(a)', ['Jisim, dalam kg, bagi 20 orang murid:', ', '.join(map(str, J)), f'Beza jisim = {max(J)} kg − {min(J)} kg = 32 kg'])], s, 1, 16),
        SVh(o, 'Plot titik panjang serangga', 175, 0),
        work([('CONTOH 1(b)', ['Plot titik menunjukkan panjang beberapa sampel serangga.', f'Beza = {SG[-1]} cm − {SG[0]} cm = {round(SG[-1] - SG[0], 1)} cm'])], s, 1, 16)))

M = [26, 28, 31, 33, 35, 35, 36, 37, 37, 38, 39, 39, 40, 40, 41, 42, 42, 42, 43, 43, 44, 45, 45, 46, 47, 47, 48, 48, 49, 49, 51, 52, 52, 53, 55, 56]
assert len(M) == 36
st = {}
for v in M:
    st.setdefault(v // 10, []).append(v % 10)
rows = [[str(k), ' '.join(map(str, st[k]))] for k in sorted(st)]
S(s, 'KONSEP', 'Plot batang-dan-daun',
  p('Plot batang-dan-daun merupakan satu cara untuk menunjukkan taburan suatu set data. Melalui plot ini, kita dapat melihat sama ada data cenderung kepada satu nilai, nilai yang paling kerap muncul atau data yang paling kurang muncul.')
  + p('Data menunjukkan markah 36 orang murid dalam suatu ujian. Kita tetapkan nilai puluh sebagai <b>batang</b> dan nilai sa sebagai <b>daun</b>.')
  + p(', '.join(map(str, M)))
  + note('Digit daun disusun dari nilai terkecil ke nilai terbesar.', 'Info:'),
  stack(table(['Batang', 'Daun'], rows, c, 18, False), p('Kekunci: 2 | 6 bermaksud 26'),
        p('Markah paling kerap muncul adalah dalam julat 40 hingga 49.')))

Q = [0, 2, 4, 7, 6, 0, 5, 4, 1, 2, 3, 7, 7, 3, 5, 6, 7, 3, 8, 7]
assert len(Q) == 20 and max(Q) == 8 and min(Q) == 0 and max(set(Q), key=Q.count) == 7
S(s, 'KONSEP', 'Plot titik',
  p('Plot titik ialah carta statistik yang mengandungi titik-titik yang diplot dengan menggunakan skala seragam. Setiap titik mewakili satu cerapan.')
  + p('Data berikut menunjukkan skor 20 orang murid dalam satu kuiz Biologi.')
  + p(', '.join(map(str, Q)))
  + bul(s, ['Cerapan paling tinggi ialah 8 dan cerapan paling rendah ialah 0.', 'Paling ramai murid memperoleh skor 7.'])
  + note('Plot titik sesuai digunakan jika bilangan cerapan adalah tidak banyak.', 'Info:'),
  SVh(dotplot(Q, 0, 8, 1, 250, 'Skor', TR, 9), 'Plot titik skor kuiz Biologi', 310, 0))

SM = [10, 11, 11, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15]
SS = [8, 9, 9, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 15, 15]
assert len(SM) == len(SS) == 20 and max(SS) - min(SS) == 7 and max(SM) - min(SM) == 5
o = dotplot(SM, 8, 15, 1, 150, 'Skor kuiz Matematik', TR, 7) + dotplot(SS, 8, 15, 1, 360, 'Skor kuiz Sains', PK, 7)
S(s, 'CONTOH 2', 'Membandingkan dua set data dengan plot titik',
  p('Plot titik menunjukkan skor 20 orang murid dalam kuiz Matematik dan kuiz Sains. (a) Data manakah yang menunjukkan serakan yang lebih besar? (b) Kuiz manakah mempunyai beza cerapan yang lebih tinggi? (c) Pencapaian kuiz manakah lebih baik?')
  + work([('Penyelesaian', ['(a) Serakan skor kuiz Sains lebih besar kerana beza cerapan datanya lebih besar.', '(b) Kuiz Sains, iaitu 15 − 8 = 7.', '(c) Kuiz Matematik kerana kebanyakan cerapan tertumpu pada bahagian kanan plot titik.'])], s, 1, 17),
  stack(SVh(o, 'Dua plot titik', 365, 55), note('Melalui plot titik, kita boleh membandingkan bentuk, serakan titik, kekerapan serta cerapan yang tertumpu di kiri atau di kanan bagi dua set data.', 'Info:')))

# =====================================================================
# 8.2.1 JULAT DAN JULAT ANTARA KUARTIL
# =====================================================================
s = '8.2.1'
c = COL[s]
D3 = [36, 25, 15, 28, 42, 27, 21]
sk = [2, 3, 4, 5, 6, 7, 8]
fk = [2, 5, 7, 11, 8, 4, 3]
assert max(D3) - min(D3) == 27
S(s, 'DEFINISI', 'Julat',
  de(s, 'Julat bagi suatu set data tak terkumpul ialah beza antara nilai cerapan terbesar dengan nilai cerapan terkecil.')
  + formula('Julat = nilai cerapan terbesar − nilai cerapan terkecil', c)
  + p('Sebagai contoh, suatu kelas yang mempunyai julat markah yang lebih besar bermaksud kebolehan murid dalam kelas itu adalah sangat berbeza.')
  + work([('CONTOH 3', [f'Set data: {", ".join(map(str, D3))}', f'Julat = {max(D3)} − {min(D3)} = 27'])], s, 1, 18),
  stack(p('<b>CONTOH 4</b> Jadual menunjukkan skor sekumpulan murid dalam suatu kuiz Kimia. Tentukan julat.'),
        table(['Skor'] + list(map(str, sk)), [['Bilangan murid'] + list(map(str, fk))], c, 17),
        work([('Penyelesaian', ['Cerapan terkecil = 2, cerapan terbesar = 8', 'Julat = 8 − 2 = 6'])], s, 1, 18)))

A = [3, 3, 5, 8, 10, 12, 15, 17, 19, 21, 24]
B = [10, 13, 13, 16, 18, 19, 19, 20, 23]
C_ = [2.2, 2.4, 2.4, 2.5, 2.7, 2.9, 3.1, 3.3]
qa, qb, qc = quart(A), quart(B), quart(C_)
assert qa == (5, 12, 19) and qb == (13, 18, 19.5) and qc == (2.4, 2.6, 3.0)
S(s, 'DEFINISI', 'Julat antara kuartil',
  p(f'Apabila data disusun mengikut tertib menaik, kuartil pertama, Q₁ ialah nilai pada kedudukan {F(1, 4)} yang pertama dan kuartil ketiga, Q₃ ialah nilai pada kedudukan {F(3, 4)} daripada keseluruhan susunan data.')
  + steps(s, ['Susun data mengikut tertib menaik.', 'Tentukan median data tersebut.', 'Bahagikan data kepada bahagian sebelum median dan bahagian selepas median.', 'Q₁ ialah data di tengah-tengah bahagian sebelum median; Q₃ ialah data di tengah-tengah bahagian selepas median.']),
  stack(formula('Julat antara kuartil = Q₃ − Q₁', c), work([('CONTOH 5', [f'(a) {", ".join(map(str, A))}', 'Median = 12, Q₁ = 5, Q₃ = 19', 'Julat antara kuartil = 19 − 5 = 14',
                            f'(b) {", ".join(map(str, B))}', 'Median = 18, Q₁ = (13 + 13) ÷ 2 = 13, Q₃ = (19 + 20) ÷ 2 = 19.5', 'Julat antara kuartil = 19.5 − 13 = 6.5',
                            f'(c) {", ".join(map(str, C_))}', 'Median = (2.5 + 2.7) ÷ 2 = 2.6, Q₁ = 2.4, Q₃ = (2.9 + 3.1) ÷ 2 = 3.0', 'Julat antara kuartil = 3.0 − 2.4 = 0.6'])], s, 1, 15),
        note('Jika bilangan data genap, ambil purata dua data di kedudukan tengah.', 'Tip:')))

sk6 = [1, 2, 3, 4, 5, 6, 7]
f6 = [4, 6, 7, 9, 11, 3, 4]
n6 = sum(f6)
cum = [sum(f6[:k + 1]) for k in range(7)]
data6 = [x for x, f in zip(sk6, f6) for _ in range(f)]
q1_6, q3_6 = data6[n6 // 4 - 1], data6[3 * n6 // 4 - 1]
assert n6 == 44 and (q1_6, q3_6) == (3, 5)
S(s, 'CONTOH 6', 'Julat antara kuartil daripada jadual kekerapan',
  p('Tentukan julat antara kuartil bagi jadual kekerapan berikut.')
  + table(['Skor'] + list(map(str, sk6)), [['Kekerapan'] + list(map(str, f6)), ['Kekerapan longgokan'] + list(map(str, cum))], c, 17, rvrows=(1,))
  + work([('Penyelesaian', [f'Jumlah kekerapan = {n6}', f'Q₁ = cerapan ke-({F(1, 4)} × 44) = cerapan ke-11 → skor 3', f'Q₃ = cerapan ke-({F(3, 4)} × 44) = cerapan ke-33 → skor 5', 'Julat antara kuartil = 5 − 3 = 2'])], s, 1, 18),
  note('Kekerapan longgokan ditentukan dengan menambahkan kekerapan suatu data dengan semua kekerapan data sebelumnya. Cerapan ke-11 terletak dalam C11 – C17 (skor 3) dan cerapan ke-33 dalam C27 – C37 (skor 5).', 'Info:'))

# =====================================================================
# 8.2.2 VARIANS DAN SISIHAN PIAWAI
# =====================================================================
s = '8.2.2'
c = COL[s]
V7 = [3, 5, 6, 6, 10]
assert sum(V7) / 5 == 6 and var(V7) == 5.2 and sum(a * a for a in V7) == 206
S(s, 'DEFINISI', 'Varians dan sisihan piawai',
  p('Varians dan sisihan piawai ialah sukatan serakan yang sering digunakan dalam statistik.')
  + de(s, 'Varians ialah purata kuasa dua bagi beza data dengan min. Sisihan piawai ialah punca kuasa dua varians dan mengukur serakan data pada min, dengan unit yang sama dengan data.')
  + formula(f'{SIG}² = {F(f"Σ({X} − {XB})²", i("N"))} atau {SIG}² = {F(f"Σ{X}²", i("N"))} − {XB}²', c)
  + formula(f'{SIG} = √varians', c),
  stack(p(f'<b>CONTOH 7</b> Tentukan varians bagi set data 3, 5, 6, 6, 10.'),
        work([('Penyelesaian', [f'{XB} = {F("3 + 5 + 6 + 6 + 10", 5)} = 6', f'{SIG}² = {F("(3 − 6)² + (5 − 6)² + (6 − 6)² + (6 − 6)² + (10 − 6)²", 5)}', f'= {F(26, 5)} = 5.2']),
              ('Kaedah alternatif', [f'Σ{X}² = 3² + 5² + 6² + 6² + 10² = 206', f'{SIG}² = {F(206, 5)} − 6² = 5.2'])], s, 1, 16)))

V8 = [4, 6, 7, 7, 9, 12, 14, 15, 15, 21]
m8 = sum(V8) / 10
sx2 = sum(a * a for a in V8)
v8 = sx2 / 10 - m8 ** 2
sd8 = math.sqrt(v8)
assert m8 == 11 and sx2 == 1462 and abs(v8 - 25.2) < 1e-9
S(s, 'CONTOH 8', 'Sisihan piawai',
  p(f'Tentukan sisihan piawai bagi set data {", ".join(map(str, V8))}.')
  + work([('Penyelesaian', [f'{XB} = {F(sum(V8), 10)} = 11', f'Σ{X}² = 4² + 6² + 7² + … + 21² = {sx2:,}'.replace(',', ' '), f'{SIG}² = {F(sx2, 10)} − 11² = 146.2 − 121 = 25.2',
                            f'{SIG} = √25.2 = {sd8:.3f}'])], s, 1, 18)
  + note(f'{SIG} ialah simbol bagi sisihan piawai dan {XB} ialah simbol bagi min.', 'Info:'),
  table([f'{X}', f'{X}²'], [[str(a), str(a * a)] for a in V8] + [[f'Σ{X} = 110', f'Σ{X}² = 1 462']], c, 16))

xb9 = [0, 1, 2, 3, 4]
f9 = [2, 6, 7, 3, 2]
n9 = sum(f9)
sfx = sum(a * b for a, b in zip(xb9, f9))
sfx2 = sum(a * a * b for a, b in zip(xb9, f9))
m9 = sfx / n9
v9 = sfx2 / n9 - m9 ** 2
assert n9 == 20 and sfx == 37 and sfx2 == 93 and abs(v9 - 1.2275) < 1e-9
S(s, 'CONTOH 9', 'Varians dan sisihan piawai daripada jadual',
  p('Jadual menunjukkan bilangan buku yang dibaca oleh sekumpulan murid dalam satu bulan. Hitung varians dan sisihan piawai.')
  + table(['Bilangan buku, <i>x</i>'] + list(map(str, xb9)), [['Bilangan murid, <i>f</i>'] + list(map(str, f9))], c, 17)
  + formula(f'{SIG}² = {F(f"Σ{i("f")}{X}²", f"Σ{i("f")}")} − {XB}², dengan {XB} = {F(f"Σ{i("f")}{X}", f"Σ{i("f")}")}', c),
  work([('Penyelesaian', [f'Σ{i("f")} = 20', f'Σ{i("f")}{X} = 2(0) + 6(1) + 7(2) + 3(3) + 2(4) = 37', f'{XB} = {F(37, 20)} = 1.85', f'Σ{i("f")}{X}² = 2(0)² + 6(1)² + 7(2)² + 3(3)² + 2(4)² = 93',
                          f'{SIG}² = {F(93, 20)} − 1.85² = 4.65 − 3.4225 = 1.2275', f'{SIG} = √1.2275 = {math.sqrt(v9):.4f}'])], s, 1, 17))

# =====================================================================
# 8.2.3 PLOT KOTAK
# =====================================================================
s = '8.2.3'
c = COL[s]
BC = [42, 47, 51, 55, 58, 60, 62, 65, 68, 70, 71, 74, 78, 82, 88]
q1, md, q3 = quart(BC)
assert (q1, md, q3) == (55, 65, 74)
o = boxplot(min(BC), q1, md, q3, max(BC), 40, 90, 10, 110, PU)
S(s, 'KONSEP', 'Plot kotak',
  p('Plot kotak ialah satu cara untuk mempamerkan taburan suatu set data berdasarkan lima nilai, iaitu nilai minimum, kuartil pertama, median, kuartil ketiga dan nilai maksimum. Plot kotak dapat menunjukkan sama ada suatu set data adalah simetri pada median.')
  + p(f'Data menunjukkan markah 15 orang murid dalam suatu ujian Bahasa Cina: {", ".join(map(str, BC))}')
  + table(['Nilai minimum', 'Q₁', 'Median', 'Q₃', 'Nilai maksimum'], [[str(min(BC)), str(q1), str(md), str(q3), str(max(BC))]], c, 17)
  + note('Plot kotak dibina di atas garis nombor. Plot kotak juga boleh dibuat secara mencancang.', 'Info:'),
  stack(SVh(o, 'Plot kotak markah ujian', 200, 50), p(f'Julat antara kuartil = {q3} − {q1} = {q3 - q1}; julat = {max(BC)} − {min(BC)} = {max(BC) - min(BC)}')))

o1 = boxplot(15, 32, 50, 63, 82, 10, 90, 10, 70, PU)
o2 = boxplot(0, 6, 12, 22, 36, 0, 40, 5, 250, GR)
S(s, 'CONTOH 10', 'Mentafsir plot kotak',
  p('Bagi setiap plot kotak, nyatakan (i) median, (ii) kuartil pertama, (iii) kuartil ketiga, (iv) julat antara kuartil, (v) nilai minimum, (vi) nilai maksimum, (vii) julat.')
  + table(['', '(a)', '(b)'], [['(i) Median', '50', '12'], ['(ii) Q₁', '32', '6'], ['(iii) Q₃', '63', '22'], ['(iv) Julat antara kuartil', '63 − 32 = 31', '22 − 6 = 16'], ['(v) Nilai minimum', '15', '0'], ['(vi) Nilai maksimum', '82', '36'], ['(vii) Julat', '82 − 15 = 67', '36 − 0 = 36']], c, 16),
  SVh(o1 + o2 + GF.T(20, 70, '(a)', TX, 17) + GF.T(20, 250, '(b)', TX, 17), 'Dua plot kotak', 330, 20))

# =====================================================================
# 8.2.4 KESAN PERUBAHAN DAN PERBANDINGAN
# =====================================================================
s = '8.2.4'
c = COL[s]
D10 = [12, 13, 13, 15, 19, 22, 23, 23, 26, 45]
q = quart(D10)
assert q[0] == 13 and q[2] == 23 and max(D10) - min(D10) == 33
S(s, 'KONSEP', 'Kelebihan dan kekurangan sukatan serakan',
  bul(s, ['<b>Julat</b> ialah sukatan serakan yang paling mudah dihitung, tetapi tidak memberikan gambaran yang baik tentang cara data ditaburkan.', '<b>Julat antara kuartil</b> lebih sesuai jika wujud pencilan atau nilai ekstrem.',
            '<b>Sisihan piawai</b> biasanya digunakan untuk membanding dua set data. Sisihan piawai yang kecil menunjukkan data terserak berhampiran dengan min; yang besar menunjukkan data terserak jauh daripada min.'])
  + p(f'<b>CONTOH 11</b> Hitung julat dan julat antara kuartil bagi set data {", ".join(map(str, D10))}. Tentukan sukatan serakan yang lebih sesuai.'),
  work([('Penyelesaian', ['Julat = 45 − 12 = 33', 'Q₁ = 13, Q₃ = 23', 'Julat antara kuartil = 23 − 13 = 10', 'Julat antara kuartil lebih sesuai kerana wujudnya pencilan, 45.'])], s, 1, 18))

Ak = [75, 68, 80, 62, 70]
Bk = [72, 70, 74, 69, 70]
sa, sb = math.sqrt(var(Ak)), math.sqrt(var(Bk))
assert sum(Ak) == sum(Bk) == 355 and sb < sa
S(s, 'CONTOH 12', 'Membandingkan dua set data dengan sisihan piawai',
  p('Jadual menunjukkan markah dua orang murid dalam 5 ujian Fizik. Salah seorang murid akan dipilih untuk mewakili sekolah dalam pertandingan kuiz Fizik. Tentukan siapakah yang layak dipilih dan berikan justifikasi anda.')
  + table(['Murid', 'Ujian 1', 'Ujian 2', 'Ujian 3', 'Ujian 4', 'Ujian 5'], [['Hafiz'] + list(map(str, Ak)), ['Kumar'] + list(map(str, Bk))], c, 17),
  stack(work([('Penyelesaian', ['Min kedua-dua murid = 355 ÷ 5 = 71', f'Hafiz: {SIG} = {sa:.3f}', f'Kumar: {SIG} = {sb:.3f}', 'Kumar dipilih kerana sisihan piawai markahnya lebih rendah, iaitu pencapaiannya lebih konsisten.'])], s, 1, 18)
  , note('Sisihan piawai boleh dihitung dengan kalkulator saintifik (mod SD).', 'Tip:')))

base = [5, 8, 3, 4, 1]
add = [a + 5 for a in base]
mul = [a * 2 for a in base]
assert abs(var(add) - var(base)) < 1e-9 and abs(var(mul) - 4 * var(base)) < 1e-9
S(s, 'KONSEP', 'Kesan perubahan data terhadap serakan',
  table(['Perubahan data', 'Julat, julat antara kuartil, sisihan piawai', 'Varians'],
        [[f'Setiap data ditambah atau ditolak dengan pemalar {i("k")}', 'Tidak berubah', 'Tidak berubah'], [f'Setiap data didarab atau dibahagi dengan pemalar {i("k")}', f'Didarab atau dibahagi dengan {i("k")}', f'Didarab atau dibahagi dengan {i("k")}²'],
         ['Wujud nilai pencilan', 'Julat dan sisihan piawai bertambah dengan ketara', 'Bertambah'], ['Suatu nilai dikeluarkan atau dimasukkan', 'Boleh berubah, bergantung pada nilai itu', 'Boleh berubah']], c, 16, False),
  work([('Contoh', [f'Set data asal: 5, 8, 3, 4, 1 → julat = 7, {SIG}² = {nm(var(base))}', f'Tambah 5: 10, 13, 8, 9, 6 → julat = 7, {SIG}² = {nm(var(add))}', f'Darab 2: 10, 16, 6, 8, 2 → julat = 14, {SIG}² = {nm(var(mul))} = 2² × {nm(var(base))}'])], s, 1, 18))

nA, sA, s2A = 20, 900, 40800
nB, sB, s2B = 15, 690, 31950
n, sx, s2 = nA + nB, sA + sB, s2A + s2B
vv = s2 / n - (sx / n) ** 2
assert (n, sx, s2) == (35, 1590, 72750)
S(s, 'CONTOH 13', 'Menyelesaikan masalah sukatan serakan',
  p(f'Jadual menunjukkan maklumat jisim dua kumpulan murid. Semua murid kumpulan A dan B digabungkan. Tentukan sisihan piawai bagi jisim gabungan.')
  + table(['Kumpulan', 'Bilangan murid', f'Σ{X}', f'Σ{X}²'], [['A', '20', '900', '40 800'], ['B', '15', '690', '31 950']], c, 17)
  + note(f'Kenal pasti Σ{X} dan Σ{X}² bagi kedua-dua kumpulan, kemudian hitung Σ{X} dan Σ{X}² bagi gabungan.', 'Strategi:'),
  work([('Penyelesaian', ['Jumlah murid = 20 + 15 = 35', f'Jumlah Σ{X} = 900 + 690 = 1 590', f'Jumlah Σ{X}² = 40 800 + 31 950 = 72 750',
                          f'{SIG} = √({F("72 750", 35)} − ({F("1 590", 35)})²) = √{vv:.3f} = {math.sqrt(vv):.3f}'])], s, 1, 18))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'serakan', 'slides.js')
HEAD = '/* Nota Bab 8 ikut buku teks Matematik T4 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
