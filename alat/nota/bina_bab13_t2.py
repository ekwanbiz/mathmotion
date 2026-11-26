"""Bab 13 T2 Kebarangkalian Mudah: nota ikut buku teks (ayat buku, nombor dan nama ditukar)."""
import os, math, sys
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
import statrajah as SR
from graf import Gr, TR, PA, PU, AM, PK, GR, MU3, TX, mn

SUBS = [{"no": "13.1", "name": "Eksperimen Kebarangkalian", "col": "#818CF8"}, {"no": "13.2", "name": "Kebarangkalian Teori", "col": "#34D399"},
        {"no": "13.3", "name": "Peristiwa Pelengkap", "col": "#F472B6"}, {"no": "13.4", "name": "Kebarangkalian Mudah", "col": "#FBBF24"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()


def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'


def frq(q):
    q = Fr(q)
    return mn(q.numerator) if q.denominator == 1 else fr(q.numerator, q.denominator)


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


def table(head, rows, c, fs=18):
    th = ''.join(f'<th style="padding:7px 10px;text-align:center;font-size:{fs - 2}px;color:{c};border:1px solid #22304A;background:#0E1626">{h}</th>' for h in head)
    tb = ''.join('<tr>' + ''.join(f'<td style="padding:6px 10px;text-align:center;font-size:{fs}px;font-weight:600;border:1px solid #22304A">{x}</td>' for x in r) + '</tr>' for r in rows)
    return f'<div class="sl-table" style="width:100%"><table style="width:100%;border-collapse:collapse;background:#131C2E"><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'


def stack(*xs):
    return '<div style="width:100%;display:flex;flex-direction:column;gap:12px;align-self:flex-start">' + ''.join(xs) + '</div>'


def SV(inner, aria):
    return GF.svg(inner, aria)


def setv(xs):
    return '{' + ', '.join(str(x) for x in xs) + '}'


PA_ = '<i>P</i>(<i>A</i>)'
PAc = "<i>P</i>(<i>A</i>')"
nA, nS = '<i>n</i>(<i>A</i>)', '<i>n</i>(<i>S</i>)'
nAc = "<i>n</i>(<i>A'</i>)"

# =====================================================================
# 13.1 KEBARANGKALIAN EKSPERIMEN
# =====================================================================
s = '13.1'
c = COL[s]
o = GF.L((50, 220), (450, 220), MU3, 4)
for x, v, t1, t2, col in ((50, '0', 'Tidak akan', 'berlaku', '#F87171'), (250, '0.5', 'Mungkin', 'berlaku', AM), (450, '1', 'Pasti akan', 'berlaku', GR)):
    o += GF.L((x, 205), (x, 235), col, 4) + GF.T(x, 185, v, col, 22) + GF.T(x, 268, t1, TX, 16) + GF.T(x, 290, t2, TX, 16)
o += GF.T(250, 360, 'Kebarangkalian bernilai antara 0 dengan 1', MU3, 17, halo=False)
S(s, 'DEFINISI', 'Kebarangkalian',
  p('Situasi seperti cuaca esok diramalkan hujan atau kemungkinan sebiji guli berwarna hitam diambil dari kotak yang mengandungi guli biru dan merah menunjukkan peristiwa yang mungkin berlaku, pasti berlaku dan mustahil berlaku. Ukuran kemungkinan suatu peristiwa berlaku ditentukan oleh nilai antara 0 dengan 1 dikenali sebagai kebarangkalian.')
  + de(s, 'Kebarangkalian ialah ukuran kemungkinan berlakunya sesuatu peristiwa, dinyatakan sama ada dalam bentuk pecahan atau peratusan.')
  + note('Kebarangkalian boleh ditulis dalam bentuk pecahan, peratus atau nombor perpuluhan.', 'Tip:'),
  SV(o, 'Skala kebarangkalian dari 0 hingga 1'))

# eksperimen syiling
lb = [25, 50, 100]; ang = [12, 27, 49]
g = Gr((80, 50, 450, 330), (0, 1200), (0, 1), 200, 0.25, xl='Bilangan lambungan', yl='Kebarangkalian', fs=11)
pts = [(10, .7), (40, .38), (80, .6), (150, .45), (250, .54), (350, .47), (500, .52), (650, .49), (800, .51), (1000, .495), (1200, .5)]
g.add(f'<polyline points="{" ".join(f"{g.X(a):.1f},{g.Y(b):.1f}" for a, b in pts)}" fill="none" stroke="{PK}" stroke-width="3"/>')
g.seg((0, .5), (1200, .5), AM, 2, '6 5').text(1190, .58, '0.5', AM, 15, 'end')
S(s, 'KONSEP', 'Kebarangkalian eksperimen',
  p('Sekeping duit syiling dilambung sebanyak 25, 50 dan 100 kali. Nisbah \'kekerapan muncul angka terhadap bilangan lambungan\' ialah kebarangkalian eksperimen bagi peristiwa mendapat \'angka\'.')
  + de(s, 'Kebarangkalian eksperimen ditafsirkan sebagai kebarangkalian yang diperoleh daripada suatu eksperimen.')
  + formula(f'Kebarangkalian eksperimen bagi suatu peristiwa = {fr("Kekerapan berlakunya peristiwa", "Bilangan cubaan")}', c)
  + table(['Bilangan lambungan', '25', '50', '100'], [['Kekerapan muncul angka', *ang], ['Nisbah', *[f'{a / b:.2f}' for a, b in zip(ang, lb)]]], c, 15),
  SV(g.svg() + GF.T(260, 410, 'Kebarangkalian eksperimen menuju kepada satu nilai', MU3, 15, halo=False)
     + GF.T(260, 434, 'tertentu jika eksperimen diulangi dengan bilangan', MU3, 15, halo=False) + GF.T(260, 458, 'cubaan yang cukup besar.', MU3, 15, halo=False), 'Graf kebarangkalian eksperimen mendapat gambar menuju 0.5'))

# =====================================================================
# 13.2 KEBARANGKALIAN TEORI
# =====================================================================
s = '13.2'
c = COL[s]
o = SR.tree(110, 220, '4', ['1', '6', '9'], 90, TR, 'Kotak A', 'Kotak B', w=130)
S(s, 'DEFINISI', 'Ruang sampel',
  p('Apabila sebiji dadu adil dilambung, nombor yang tertera boleh jadi 1, 2, 3, 4, 5 atau 6. Maka, senarai kesudahan bagi lambungan dadu adil ialah nombor 1, 2, 3, 4, 5 dan 6. Ruang sampel bagi lambungan dadu adil ialah, <i>S</i> = {1, 2, 3, 4, 5, 6}.')
  + de(s, '<b>Ruang sampel</b> ialah set semua kesudahan yang mungkin bagi suatu eksperimen.')
  + p('Kotak <i>A</i> mengandungi kad berlabel 4 dan kotak <i>B</i> mengandungi kad berlabel 1, 6 dan 9. Apabila anda mengambil kad secara rawak, anda mungkin mendapat pasangan seperti yang tertera pada gambar rajah pokok. Ruang sampel ialah <i>S</i> = {(4, 1), (4, 6), (4, 9)}.'),
  SV(o + GF.T(250, 400, 'Gambar rajah pokok membantu menyusun atur', MU3, 15, halo=False) + GF.T(250, 424, 'semua kesudahan yang mungkin.', MU3, 15, halo=False), 'Gambar rajah pokok kotak A ke kotak B'))

primes = [n for n in range(41, 60) if all(n % d for d in range(2, n))]
assert primes == [41, 43, 47, 53, 59]
S(s, 'CONTOH 1', 'Peristiwa',
  de(s, '<b>Peristiwa</b> ialah set kesudahan yang memenuhi syarat tertentu bagi suatu ruang sampel dan merupakan subset bagi ruang sampel.')
  + p('<b>CONTOH 1</b> Satu huruf dipilih secara rawak daripada perkataan PINTAR. Senaraikan kesudahan yang mungkin dan tulis unsur dalam ruang sampel bagi eksperimen ini. Nyatakan bilangan unsur dalam ruang sampel.')
  + work([('', ['Perkataan PINTAR terdiri daripada enam huruf yang berlainan. Maka, kesudahan yang mungkin ialah P, I, N, T, A, R.', 'Ruang sampel, <i>S</i> = {P, I, N, T, A, R}. Bilangan unsur dalam ruang sampel, <i>n</i>(<i>S</i>) = 6.'])], s, 1, 18),
  work([('CONTOH 2', ['Satu nombor dipilih secara rawak daripada nombor perdana 40 hingga 60. Senaraikan kesudahan yang mungkin dan tulis unsur dalam ruang sampel bagi eksperimen ini. Nyatakan bilangan unsur dalam ruang sampel.']), ('Penyelesaian:', ['Nombor perdana yang berada di antara 40 hingga 60 ialah 41, 43, 47, 53, 59.', 'Ruang sampel, <i>S</i> = {41, 43, 47, 53, 59}. Bilangan unsur di dalam ruang sampel, <i>n</i>(<i>S</i>) = 5.'])], s, 1, 18))

o = SR.tree(90, 220, 'R', ['M', 'H', 'B', 'U'], 80, TR, 'Pembaris', 'Pemadam', w=130)
S(s, 'CONTOH 3', 'Ruang sampel daripada gambar rajah pokok',
  p('Sebuah koperasi sekolah menjual pembaris jenama <i>R</i> manakala pemadam yang dijual berwarna merah, hijau, biru dan ungu. Lina ingin membeli sebatang pembaris dan satu pemadam dari koperasi tersebut. Dengan bantuan gambar rajah pokok, senaraikan kesudahan yang mungkin dan tulis unsur dalam ruang sampel pasangan barang yang boleh dibeli oleh Lina. Nyatakan bilangan pasangan tersebut.')
  + work([('', ['Langkah 1: Lukiskan gambar rajah pokok.', 'Langkah 2: Senaraikan unsur dalam ruang sampel, <i>S</i> = {(<i>R</i>, <i>M</i>), (<i>R</i>, <i>H</i>), (<i>R</i>, <i>B</i>), (<i>R</i>, <i>U</i>)}.', 'Maka, bilangan unsur dalam ruang sampel, <i>n</i>(<i>S</i>) = 4'])], s, 1, 18),
  SV(o, 'Gambar rajah pokok pembaris R dan pemadam empat warna'))

o4 = ''.join(f'<rect x="{30 + 56 * i}" y="170" width="48" height="66" rx="8" fill="#131C2E" stroke="{c}" stroke-width="2.5"/>' + GF.T(54 + 56 * i, 203, str(i + 1), TX, 24) for i in range(8))
o4 += GF.T(250, 290, 'Kad bernombor 1 hingga 8', MU3, 17, halo=False)
S(s, 'CONTOH 4', 'Mungkin atau tidak mungkin berlaku',
  p('Sekeping kad telah dipilih secara rawak dari sebuah kotak yang mengandungi kad bernombor 1 hingga 8. Tentukan sama ada peristiwa berikut mungkin berlaku atau tidak mungkin berlaku. (i) Nombor kurang daripada 3. (ii) Nombor lebih besar daripada 10. (iii) Gandaan 4.')
  + pen(s, ['Ruang sampel, <i>S</i> = {1, 2, 3, 4, 5, 6, 7, 8}', '(i) Mungkin berlaku (ii) Tidak mungkin berlaku (iii) Mungkin berlaku']),
  SV(o4, 'Lapan kad bernombor 1 hingga 8'))

o = SR.tree(90, 220, 'E', ['E', 'M', 'A', 'S'], 80, TR, 'Balang A', 'Balang B', w=130)
S(s, 'CONTOH 5', 'Menyenaraikan peristiwa',
  p('Dalam satu acara sukaneka, peserta perlu mengambil sekeping kad secara rawak dari kad bertulis huruf <i>B</i>, <i>U</i>, <i>K</i>, <i>I</i>, <i>T</i>. Senaraikan unsur dalam ruang sampel bagi peristiwa memilih (a) huruf konsonan. (b) huruf vokal.')
  + pen(s, ['Ruang sampel, <i>S</i> = {<i>B</i>, <i>U</i>, <i>K</i>, <i>I</i>, <i>T</i>}', '(a) Huruf konsonan = {<i>B</i>, <i>K</i>, <i>T</i>}', '(b) Huruf vokal = {<i>U</i>, <i>I</i>}']),
  SV(''.join(f'<rect x="{55 + 82 * i}" y="160" width="66" height="86" rx="10" fill="#131C2E" stroke="{c}" stroke-width="2.5"/>' + GF.T(88 + 82 * i, 203, L_, TX, 30) for i, L_ in enumerate('BUKIT')), 'Lima kad huruf B, U, K, I, T'))

S(s, 'CONTOH 6', 'Peristiwa daripada gambar rajah pokok',
  p('Balang <i>A</i> mengandungi kad berlabel huruf <i>E</i>. Balang <i>B</i> mengandungi kad berlabel huruf <i>E</i>, <i>M</i>, <i>A</i> dan <i>S</i>. Sekeping kad dari balang <i>A</i> dan sekeping kad dari balang <i>B</i> diambil secara rawak. (a) Senaraikan unsur dalam ruang sampel. (b) Senaraikan unsur dalam ruang sampel yang memperoleh (i) pasangan huruf yang sama, <i>X</i>. (ii) sekurang-kurangnya satu huruf konsonan, <i>Y</i>.')
  + pen(s, ['Langkah 1: Lukis gambar rajah pokok.', '(a) <i>S</i> = {(<i>E</i>, <i>E</i>), (<i>E</i>, <i>M</i>), (<i>E</i>, <i>A</i>), (<i>E</i>, <i>S</i>)}', '(b) (i) Peristiwa <i>X</i> = {(<i>E</i>, <i>E</i>)} (ii) Peristiwa <i>Y</i> = {(<i>E</i>, <i>M</i>), (<i>E</i>, <i>S</i>)}']),
  SV(o, 'Gambar rajah pokok balang A dan balang B'))

# kebarangkalian suatu peristiwa
o = ''
x0, y0, k = 80, 60, 56
o += f'<rect x="{x0}" y="{y0}" width="{k}" height="{k}" fill="#0E1626" stroke="#22304A"/>' + GF.T(x0 + k / 2, y0 + k / 2, '+', TX, 20)
for i in range(6):
    o += f'<rect x="{x0 + k * (i + 1)}" y="{y0}" width="{k}" height="{k}" fill="#0E1626" stroke="#22304A"/>' + GF.T(x0 + k * (i + 1.5), y0 + k / 2, str(i + 1), c, 19)
    o += f'<rect x="{x0}" y="{y0 + k * (i + 1)}" width="{k}" height="{k}" fill="#0E1626" stroke="#22304A"/>' + GF.T(x0 + k / 2, y0 + k * (i + 1.5), str(i + 1), c, 19)
    for j in range(6):
        sm = i + j + 2
        o += f'<rect x="{x0 + k * (j + 1)}" y="{y0 + k * (i + 1)}" width="{k}" height="{k}" fill="{PK + "55" if sm == 7 else "#131C2E"}" stroke="#22304A"/>' + GF.T(x0 + k * (j + 1.5), y0 + k * (i + 1.5), str(sm), TX, 18)
o += GF.T(x0 + k * 3.5, 40, 'Dadu 1', MU3, 16) + GF.T(50, y0 + k * 3.5, 'Dadu 2', MU3, 16)
assert sum(1 for i in range(1, 7) for j in range(1, 7) if i + j == 7) == 6
S(s, 'RUMUS', 'Kebarangkalian suatu peristiwa',
  p(f'Lambungan sebiji dadu adil mempunyai enam kesudahan yang mungkin, iaitu nombor 1, 2, 3, 4, 5 dan 6. Kejadian mendapat nombor 4 hanya sekali, iaitu {fr(1, 6)}. Kejadian mendapat nombor ganjil ialah tiga kali, iaitu nombor 1, 3 dan 5, iaitu {fr(3, 6)} = {fr(1, 2)}.')
  + p(f'Bilangan kesudahan lambungan dadu adil diwakili oleh {nS} dan bilangan kejadian suatu peristiwa diwakili oleh {nA}. Kebarangkalian suatu peristiwa diwakili oleh {PA_}.')
  + formula(f'Maka, kebarangkalian suatu peristiwa <i>A</i> diwakili oleh {PA_} = {fr(nA, nS)}', c),
  cards(card('Mendapat nombor 4', fr(1, 6), 'satu daripada enam kesudahan', TR), card('Mendapat nombor ganjil', f'{fr(3, 6)} = {fr(1, 2)}', '1, 3 dan 5', PK)))

S(s, 'KONSEP', 'Kebarangkalian teori',
  p('Jadual di sebelah menunjukkan hasil tambah dua biji dadu adil secara teori.')
  + p(f'Daripada jadual, hasil tambah dua biji dadu adil yang bernilai 7 muncul sebanyak 6 kali. Maka, kebarangkalian memperoleh hasil tambah 7 ialah {fr(6, 36)} = {fr(1, 6)}. Kebarangkalian ini digelar <b>kebarangkalian teori</b>.')
  + note(f'Jika eksperimen melambung dua biji dadu adil dilakukan dengan bilangan percubaan yang cukup besar, kebarangkalian eksperimen akan menghampiri kebarangkalian teori.', 'Ingat:'),
  SV(o, 'Jadual hasil tambah dua dadu dengan hasil tambah 7 ditanda'))

assert Fr(18, 48) == Fr(3, 8) and Fr(6, 21) == Fr(2, 7)
S(s, 'CONTOH 7', 'Menentukan kebarangkalian',
  p('Sebiji epal diambil dari sebuah kotak yang mengandungi 18 biji epal hijau dan 30 biji epal merah. Hitung kebarangkalian epal berwarna hijau diambil.')
  + work([('', ['Bilangan epal hijau = 18 biji, jumlah epal dalam kotak = 48 biji', 'Anggap <i>A</i> ialah peristiwa mendapat epal hijau.',
                f'<i>P</i>(epal hijau) = {fr("bilangan epal hijau", "jumlah epal")}', f'{PA_} = {fr(nA, nS)} = {fr(18, 48)} = {fr(3, 8)}'])], s, 1, 18)
  + note('Kebarangkalian boleh ditulis dalam bentuk pecahan, peratus atau nombor perpuluhan.', 'Tip:'),
  work([('CONTOH 8', ['Mei Mei mendapat wang saku sebanyak RM4 pada setiap hari Isnin dan Jumaat. Hitung kebarangkalian dia mendapat wang saku sebanyak RM4 dalam tiga minggu.']),
        ('Penyelesaian:', ['Anggap <i>A</i> ialah peristiwa mendapat wang saku.', 'Jumlah hari Isnin dan Jumaat dalam 3 minggu, <i>n</i>(<i>A</i>) = 6 hari', 'Jumlah hari dalam 3 minggu, <i>n</i>(<i>S</i>) = 21 hari',
                           f'Kebarangkalian mendapat wang saku sebanyak RM4 dalam 3 minggu, {PA_} = {fr(nA, nS)} = {fr(6, 21)} = {fr(2, 7)}'])], s, 1, 18))

# =====================================================================
# 13.3 PERISTIWA PELENGKAP
# =====================================================================
s = '13.3'
c = COL[s]
U = [4 * k for k in range(1, 10)]; A3 = [n for n in U if n > 25]
assert A3 == [28, 32, 36] and Fr(len(A3), 9) == Fr(1, 3)
S(s, 'DEFINISI', 'Peristiwa pelengkap',
  p('Set semesta, ξ terdiri daripada sembilan nombor pertama gandaan 4. <i>A</i> ialah peristiwa memilih nombor yang lebih besar daripada 25. <i>A</i> ialah subset bagi set semesta. <i>A\'</i> ialah pelengkap bagi set <i>A</i>.')
  + de(s, 'Peristiwa pelengkap bagi peristiwa <i>A</i> dalam suatu ruang sampel <i>S</i>, adalah terdiri daripada semua kesudahan yang bukan kesudahan <i>A</i>.')
  ,
  SV(SR.venn((40, 60, 460, 400), U, A3, 'A'), 'Gambar rajah Venn gandaan 4 dengan set A'))

S(s, 'RUMUS', 'Hubungan P(A) dan P(A\')',
  p(f"Dalam kebarangkalian, ruang sampel, <i>S</i> ialah set semesta. Jika set <i>A</i> mewakili peristiwa <i>A</i>, maka set <i>A'</i> ialah peristiwa pelengkap bagi peristiwa <i>A</i>.")
  + p(f"Kebarangkalian memilih nombor lebih besar daripada 25, {PA_} = {fr(3, 9)}. Kebarangkalian memilih bukan nombor lebih besar daripada 25, {PAc} = {fr(6, 9)}.")
  + work([('', [f"{PA_} + {PAc} = {fr(3, 9)} + {fr(6, 9)} = {fr(9, 9)} = 1. Didapati {PA_} + {PAc} = 1."])], s, 1, 18)
  + formula(f"{PAc} = 1 − {PA_}, &nbsp; 0 ≤ {PA_} ≤ 1", c),
  cards(card('P(A) = 0', 'Pasti tidak berlaku', 'peristiwa <i>A</i> pasti tidak berlaku', '#F87171'), card('0 < P(A) < 1', 'Mungkin berlaku', '', AM),
        card('P(A) = 1', 'Pasti berlaku', 'peristiwa <i>A</i> pasti berlaku', GR)))

U9 = list(range(2, 25, 2)); A9 = [n for n in U9 if n % 6 == 0]
S(s, 'CONTOH 9', 'Memerihalkan peristiwa pelengkap',
  p('Seorang pekerja di kedai bunga menyusun 12 jambak bunga mengikut bilangan kuntuman bunga dalam kiraan genap 2 hingga 24 mengikut tertib menaik. <i>A</i> ialah peristiwa menjual jambak bunga yang mempunyai bilangan kuntuman bunga dengan nilai gandaan 6. Perihalkan peristiwa pelengkap, <i>A\'</i> dalam (i) perkataan. (ii) tatatanda set.')
  + work([('', [f'Ruang sampel, <i>S</i> = {setv(U9)}', f'Peristiwa <i>A</i> = {setv(A9)}', "(i) <i>A'</i> = peristiwa memilih nombor bukan gandaan 6.",
                f"(ii) <i>A'</i> = {setv([n for n in U9 if n not in A9])}"])], s, 1, 19),
  SV(SR.venn((40, 60, 460, 400), U9, A9, 'A'), 'Gambar rajah Venn bagi contoh 9'))

U10 = list(range(1, 21)); A10 = [n for n in U10 if n % 3 == 0]
assert Fr(len(A10), 20) == Fr(3, 10)
S(s, 'CONTOH 10', 'Kebarangkalian peristiwa pelengkap',
  p('Satu nombor dipilih secara rawak daripada set integer daripada 1 hingga 20. <i>A</i> ialah peristiwa memilih nombor gandaan 3. Hitung kebarangkalian peristiwa pelengkap bagi peristiwa <i>A</i>.')
  + work([('', [f'Ruang sampel, <i>S</i> = {{1, 2, 3, ..., 20}}, Peristiwa <i>A</i> = {setv(A10)}', f'Kebarangkalian peristiwa <i>A</i>, {PA_} = {fr(nA, nS)} = {fr(6, 20)} = {fr(3, 10)}'])], s, 1, 18)
  + work([('Kaedah 1', [f'{PAc} = 1 − {PA_}', f'= 1 − {fr(3, 10)}', f'= {fr(7, 10)}']),
          ('Kaedah 2', [f"Peristiwa <i>A'</i> = {setv([n for n in U10 if n % 3])}", f"{PAc} = {fr(14, 20)} = {fr(7, 10)}"])], s, 2, 17)
  + note(f'{PA_} + {PAc} = 1, {PAc} = 1 − {PA_}, {PA_} = 1 − {PAc}', 'Perhatian:'))

U11 = list(range(60, 72)); A11 = [n for n in U11 if n not in (60, 61, 70, 71)]
assert len(U11) == 12 and len(A11) == 8
S(s, 'CONTOH 11', 'Pelengkap daripada gambar rajah Venn',
  p("Gambar rajah Venn di sebelah menunjukkan unsur dalam set semesta. Hitung kebarangkalian memilih peristiwa pelengkap <i>A'</i>.")
  + pen(s, ["Bilangan unsur peristiwa pelengkap, <i>n</i>(<i>A'</i>) = 4", 'Bilangan unsur set semesta = 12',
            f"Kebarangkalian peristiwa pelengkap, {PAc} = {fr(nAc, nS)} = {fr(4, 12)} = {fr(1, 3)}"], False),
  SV(SR.venn((40, 60, 460, 400), U11, A11, 'A'), 'Gambar rajah Venn dengan 12 unsur dan set A'))

# =====================================================================
# 13.4 KEBARANGKALIAN MUDAH
# =====================================================================
s = '13.4'
c = COL[s]
assert Fr(80, 100) == Fr(4, 5) and Fr(4, 5) * 100 * 2 == 160 and 160 / 20 * 150 == 1200 and Fr(1, 5) * 100 == 20
S(s, 'CONTOH 12', 'Penyelesaian masalah',
  p('Seorang usahawan tudung mampu menghasilkan 100 helai tudung dalam masa sebulan. Dia berjaya menjual 20 helai tudung dalam masa seminggu. Keuntungan menjual 20 helai tudung ialah RM150. Hitung')
  + p('(a) kebarangkalian tudung terjual dalam masa sebulan. (b) keuntungan dalam masa dua bulan. (c) kebarangkalian tudung yang tidak terjual dalam masa sebulan.')
  + work([('Memahami masalah', ['(a) Kebarangkalian tudung terjual dalam masa tersebut. (b) Keuntungan yang diperoleh dalam masa dua bulan. (c) Kebarangkalian jumlah tudung yang tidak terjual dalam masa sebulan.']),
          ('Merancang strategi', ['Ruang sampel, <i>S</i> = Bilangan tudung yang dihasilkan, <i>n</i>(<i>S</i>) = 100', 'Peristiwa <i>A</i> = Jumlah tudung yang terjual dalam masa sebulan, <i>n</i>(<i>A</i>) = 80'])], s, 1, 16))

S(s, 'CONTOH 12 (sambungan)', 'Penyelesaian',
  work([('Melaksanakan strategi', [f'(a) {PA_} = {fr(nA, nS)} = {fr(80, 100)} = {fr(4, 5)}', f'(b) Jumlah tudung terjual dalam masa dua bulan = {fr(4, 5)} × 100 × 2 = 160 helai',
                                   f'Jumlah keuntungan = {fr(160, 20)} × RM150 = RM1 200', f'(c) {PAc} = 1 − {PA_} = 1 − {fr(4, 5)} = {fr(1, 5)}', f'Jumlah tudung tidak terjual = {fr(1, 5)} × 100 = 20 helai'])], s, 1, 19),
  work([('Membuat kesimpulan', [f'(a) Maka, kebarangkalian tudung terjual dalam masa sebulan ialah {fr(4, 5)}.', '(b) Jumlah keuntungan ialah RM1 200.', '(c) Jumlah tudung yang tidak terjual dalam masa sebulan ialah 20 helai.'])], s, 1, 19))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'probalyt', 'slides.js')
HEAD = '/* Nota Bab 13 ikut buku teks Matematik T2 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
