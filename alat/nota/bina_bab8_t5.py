"""Bab 8 T5 Pemodelan Matematik. Nota ikut buku teks Matematik T5 KSSM (ayat buku, nombor dan nama ditukar; kiraan disemak).
CONTOH 1–4 ikut buku, didahului contoh proses pemodelan (beras). SUBS folder pemodelan dikekalkan (8.1.1, 8.1.2)."""
import os, sys, math
from fractions import Fraction as Fr
from decimal import Decimal as D, ROUND_HALF_UP
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "8.1.1", "name": "Proses Pemodelan Matematik", "col": "#38BDF8"}, {"no": "8.1.2", "name": "Menyelesaikan Masalah dengan Pemodelan", "col": "#34D399"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr
T_, L_ = GF.T, GF.L


def f1(v):
    return f'{v:.1f}'


def q2(v):
    return D(str(v)).quantize(D('0.01'), rounding=ROUND_HALF_UP)


def gsvg(g, aria, top=34, bot=46):
    return f'<svg class="sl-svg" viewBox="0 {f1(g.T_ - top)} 500 {f1(g.B - g.T_ + top + bot)}" role="img" aria-label="{aria}">{g.svg()}</svg>'


KOMP = ['Mengenal pasti dan mendefinisikan masalah', 'Membuat andaian dan mengenal pasti pemboleh ubah', 'Mengaplikasi matematik untuk menyelesaikan masalah', 'Menentusahkan dan mentafsir penyelesaian dalam konteks masalah berkenaan', 'Memurnikan model matematik', 'Melaporkan dapatan']

# =====================================================================
# 8.1.1 PROSES PEMODELAN MATEMATIK
# =====================================================================
s = '8.1.1'
c = COL[s]
S(s, 'DEFINISI', 'Apakah itu pemodelan matematik?',
  de(s, 'Satu <b>model matematik</b> ialah suatu hubungan matematik yang menghuraikan situasi dunia sebenar. Misalnya, rumus <i>I</i> = <i>Prt</i> menunjukkan hubungan antara faedah mudah dengan prinsipal, kadar faedah dan masa.')
  + p('Model matematik ialah suatu perwakilan bagi satu sistem atau senario yang digunakan untuk memperoleh kefahaman secara kualitatif dan/atau kuantitatif bagi masalah dunia sebenar serta meramalkan perlakuan masa depan.')
  + p('Dalam <b>pemodelan matematik</b>, masalah dunia sebenar diterjemah sebagai masalah matematik, diselesaikan, dan penyelesaiannya ditafsir semula dalam konteks masalah dunia sebenar.'),
  work([('Soalan 1 (masalah biasa)', ['Di bandar P, terdapat 30 000 orang penduduk dan 40% mengitar semula botol plastik. Jika setiap orang menggunakan 4 botol seminggu, berapakah bilangan botol yang dikitar semula setiap minggu?', 'Semua maklumat diberi; kita hanya perlu melaksanakan perhitungan.']),
        ('Soalan 2 (soalan terbuka)', ['Berapa lamakah masa yang diperlukan untuk membersihkan tumpahan minyak di lautan?', 'Maklumat tidak mencukupi. Pemodelan matematik paling sesuai untuk menyelesaikan soalan terbuka seperti ini.'])], s, 1, 16))

flow = ''
for i, t in enumerate(KOMP):
    y = 20 + i * 66
    flow += f'<rect x="50" y="{y}" width="400" height="50" rx="12" fill="{c}22" stroke="{c}" stroke-width="2"/>'
    if len(t) > 45:
        cut = t.rfind(' ', 0, 40)
        flow += T_(250, y + 16, f'{i + 1}. {t[:cut]}', TX, 13, 'middle', 600) + T_(250, y + 34, t[cut + 1:], TX, 13, 'middle', 600)
    else:
        flow += T_(250, y + 25, f'{i + 1}. {t}', TX, 14, 'middle', 600)
    if i < 5:
        flow += GF.arrow((250, y + 50), (250, y + 64), MU3, 2.5)
flow += f'<path d="M450 {20 + 4 * 66 + 25} H475 V{20 + 2 * 66 + 25} H456" fill="none" stroke="{AM}" stroke-width="2.5" stroke-dasharray="6 4"/>' + GF.head((475, 20 + 2 * 66 + 25), (452, 20 + 2 * 66 + 25), AM, 2.5) + T_(480, 20 + 3 * 66 + 25, 'ulang', AM, 12, 'start')
S(s, 'KONSEP', 'Komponen pemodelan matematik',
  p('Terdapat enam komponen penting dalam pemodelan matematik seperti dalam carta alir. Proses boleh diulang jika model matematik perlu dimurnikan.')
  + note('Andaian biasanya dimulakan dengan pemboleh ubah paling mudah. Setelah masalah diselesaikan, andaian yang lebih rumit boleh dipertimbangkan.', 'Info:')
  + note('Pemboleh ubah merupakan kuantiti yang tidak diketahui nilainya.', 'Ingat:'),
  f'<svg class="sl-svg" viewBox="0 10 520 400" role="img" aria-label="Carta alir proses pemodelan">{flow}</svg>')

P1, P2, n, sd, m, H = D('27.50'), D('25.40'), 2, 5, 16, D('2.05')
Sv = (P1 - P2) * n
Tv = D(sd) / m * H * 2
assert Sv == D('4.20') and q2(Tv) == D('1.28') and q2(Sv - Tv) == D('2.92') and q2(D(sd) / m) == D('0.31')
S(s, 'CONTOH', 'Pemodelan: membeli beras di pasar raya lebih jauh',
  p('Pasar raya B yang terletak lebih jauh dari rumah menjual sekampit beras 10 kg dengan harga yang lebih rendah daripada pasar raya A yang berdekatan. Adakah berbaloi memandu ke pasar raya B untuk membeli dua kampit beras?')
  + work([('Mengenal pasti dan mendefinisikan masalah', ['Harga sekampit beras 10 kg dan kos petrol; jarak dua pasar raya dari rumah; harga petrol semasa dan kadar penggunaan petrol kereta.']),
          ('Membuat andaian', ['Rumah, pasar raya A dan pasar raya B berada pada satu garis lurus; memandu kereta; membeli bilangan kampit dan cap beras yang sama.'])], s, 1, 15),
  work([('Mengenal pasti pemboleh ubah', ['<i>s</i>: jarak antara pasar raya A dan B (km)', '<i>P</i>₁, <i>P</i>₂: harga sekampit beras di pasar raya A dan B', '<i>m</i>: kadar penggunaan petrol (km per liter); <i>H</i>: harga petrol (RM per liter)', '<i>n</i>: bilangan kampit beras',
                                         '<i>S</i>: beza harga beras; <i>T</i>: beza kos petrol bagi perjalanan ke pasar raya B']),
        ('Mengaplikasi matematik', ['<i>P</i>₁ = RM27.50, <i>P</i>₂ = RM25.40, <i>n</i> = 2: jimat 2 × (RM27.50 − RM25.40) = RM4.20', f'<i>s</i> = 5 km, <i>m</i> = 16 km/liter, <i>H</i> = RM2.05: petrol = {F("5", "16")} = 0.3125 liter',
                                    'Kos petrol dua hala = 0.3125 × RM2.05 × 2 = RM1.28', 'Wang yang dijimatkan = RM4.20 − RM1.28 = RM2.92'])], s, 1, 15))

s_opt = Fr(42, 10) * 16 / Fr(41, 10)
p2max = D('27.50') - Tv / 2
assert round(float(s_opt), 2) == 16.39 and q2(p2max) == D('26.86')
S(s, 'CONTOH (sambungan)', 'Menentusahkan, memurnikan dan melaporkan',
  formula(f'<i>S</i> = (<i>P</i>₁ − <i>P</i>₂) × <i>n</i> &nbsp;&nbsp; <i>T</i> = {F("<i>s</i>", "<i>m</i>")} × <i>H</i> × 2', c)
  + p('Jika <i>S</i> &gt; <i>T</i>, lebih jimat membeli beras di pasar raya B. Jika <i>S</i> &lt; <i>T</i>, kita tidak seharusnya memandu ke pasar raya B.')
  + work([('Penerokaan lanjutan', [f'Jarak optimum: (27.50 − 25.40) × 2 &gt; {F("<i>s</i>", "16")} × 2.05 × 2 → <i>s</i> &lt; 16.39 km', f'Harga maksimum di B: (27.50 − <i>P</i>₂) × 2 &gt; {F("5", "16")} × 2.05 × 2 → <i>P</i>₂ &lt; RM26.86'])], s, 1, 15),
  stack(work([('Memurnikan model', ['Andaian rumah dan dua pasar raya pada satu garis lurus perlu dikaji semula. Jika andaian baharu dibuat, model perlu diubah.']),
        ('Melaporkan dapatan', ['Model ini tidak mempertimbangkan nilai masa seseorang dan impak kepada alam sekitar, misalnya pengeluaran karbon dioksida.', 'Setiap model mempunyai kekuatan dan kelemahannya; laporan perlu mengenali kedua-duanya.'])], s, 1, 15)
  , note('Soalan terbuka berkemungkinan menjana model matematik yang berbeza tetapi masih sah.', 'Ingat:')))

t1 = Fr(600) / (5000 * Fr(2, 100))
assert t1 == 6
S(s, 'CONTOH 1', 'Mendefinisikan masalah dan membuat andaian',
  p('Farah menyimpan RM5 000 di sebuah bank dengan kadar faedah mudah 2% setahun. Farah ingin membeli seunit komputer riba berharga RM5 600 melalui hasil simpanannya. Berapa lamakah tempoh penyimpanan yang diperlukan? (a) Kenal pasti dan definisikan masalah. (b) Tentukan andaian dan kenal pasti pemboleh ubah.')
  + note('Faedah mudah boleh dihitung dengan rumus <i>I</i> = <i>Prt</i> dengan <i>I</i> ialah faedah, <i>P</i> ialah prinsipal, <i>r</i> ialah kadar faedah dan <i>t</i> ialah masa dalam tahun.', 'Info:'),
  work([('(a)', ['Kita mengetahui prinsipal dan kadar faedah. Faedah ialah amaun yang Farah perlukan selain RM5 000 untuk membeli komputer riba. Kita perlu mencari tempoh simpanan Farah di bank.']),
        ('(b) Andaian', ['Kadar faedah tidak berubah sepanjang tempoh perhitungan faedah. Jika tidak, rumus <i>I</i> = <i>Prt</i> menjadi tidak sah.', 'Harga komputer riba tidak berubah apabila Farah berjaya mengumpulkan amaun wang yang diperlukan.']),
        ('Pemboleh ubah', ['<i>I</i> untuk faedah, <i>P</i> untuk prinsipal, <i>r</i> untuk kadar faedah dan <i>t</i> untuk masa dalam tahun.', f'(Seterusnya: 600 = 5 000 × 0.02 × <i>t</i>, maka <i>t</i> = 6 tahun.)'])], s, 1, 16))

# =====================================================================
# 8.1.2 MENYELESAIKAN MASALAH DENGAN PEMODELAN
# =====================================================================
s = '8.1.2'
c = COL[s]


def mini(bx, fn, xr, yr, col, lab):
    g = GF.Gr(bx, xr, yr, labels=False, origin='', xl='', yl='')
    g.out = [o for o in g.out if 'stroke="#1E2A40"' not in o and 'stroke="#26344F"' not in o]
    g.curve(fn, xr[0], xr[1], col, 3.5)
    g.add(T_((bx[0] + bx[2]) / 2, bx[3] + 22, lab, col, 14))
    return g.svg()


fg = mini((30, 30, 150, 150), lambda x: 0.5 + 0.8 * x, (0, 4), (0, 4), TR, 'Linear') + mini((190, 30, 310, 150), lambda x: -(x - 2) ** 2 + 4, (0, 4), (0, 4.5), PK, 'Kuadratik') + mini((350, 30, 470, 150), lambda x: 2 ** x / 4, (0, 4), (0, 4.5), AM, 'Eksponen')
S(s, 'KONSEP', 'Model linear, kuadratik dan eksponen',
  p('Kita dapat menentukan jenis fungsi yang mungkin boleh digunakan sebagai model bagi data dengan mengkaji pola graf.')
  + bul(s, ['<b>Fungsi linear:</b> graf menyerupai satu garis lurus.', '<b>Fungsi kuadratik:</b> graf lengkung berbentuk parabola; lengkung mungkin naik kemudian turun, atau turun kemudian naik.',
            '<b>Fungsi eksponen:</b> graf lengkung yang mengilustrasikan kenaikan atau penurunan nilai data pada kadar yang mendadak, iaitu <i>y</i> = <i>Ca</i><sup><i>x</i></sup> dengan <i>a</i> nombor nyata positif, <i>a</i> ≠ 1 dan <i>C</i> ialah nilai awal.']),
  stack(f'<svg class="sl-svg" viewBox="0 10 500 180" role="img" aria-label="Graf linear, kuadratik dan eksponen">{fg}</svg>',
        note('Contoh: kadar denyutan nadi rehat melawan jam senaman (linear), keuntungan produk mengikut tahun (kuadratik), pertumbuhan populasi (eksponen).', 'Info:')))

k2 = Fr(40, 480)
assert k2 == Fr(1, 12) and k2 * 210 == Fr(35, 2)
S(s, 'CONTOH 2', 'Pemodelan dengan fungsi linear',
  p('Kereta Encik Rahman menggunakan 40 liter petrol untuk bergerak sejauh 480 km. Jika dia ingin memandu kereta yang sama untuk suatu perjalanan sejauh 210 km, berapakah jumlah petrol dalam liter yang diperlukan? Selesaikan masalah ini melalui pemodelan matematik.')
  + work([('Mengenal pasti dan mendefinisikan masalah', ['Tentukan isi padu petrol untuk perjalanan sejauh 210 km. Lebih jauh perjalanan, lebih banyak petrol diperlukan; jumlah petrol berubah secara langsung dengan jarak.']),
          ('Membuat andaian dan mengenal pasti pemboleh ubah', ['Andaikan kelajuan memandu bagi kedua-dua perjalanan adalah sama.', '<i>x</i>: jarak perjalanan; <i>y</i>: jumlah petrol; <i>y</i> = <i>kx</i>'])], s, 1, 15),
  work([('Mengaplikasi matematik', [f'40 = <i>k</i>(480), maka <i>k</i> = {F("1", "12")} dan <i>y</i> = {F("1", "12")}<i>x</i>', f'Apabila <i>x</i> = 210, <i>y</i> = {F("1", "12")}(210) = 17.5 liter']),
        ('Menentusahkan dan mentafsir', [f'Model <i>y</i> = {F("1", "12")}<i>x</i> mungkin tidak sesuai untuk semua situasi, misalnya perjalanan pertama melalui jalan bandar dan perjalanan kedua menerusi lebuh raya: kadar penggunaan petrol berbeza.']),
        ('Memurnikan model', ['Model tidak dapat dimurnikan kerana maklumat yang diberi adalah terhad.']), ('Melaporkan dapatan', ['Laporkan dapatan berdasarkan tafsiran penyelesaian di atas.'])], s, 1, 15))

xs3 = [0, 5, 10, 15, 20, 25, 30]
a3 = Fr(-18, 1250)
b3 = -30 * a3
fn3 = lambda x: float(a3) * x * x + float(b3) * x
ys3 = [round(fn3(x), 1) for x in xs3]
assert ys3 == [0, 1.8, 2.9, 3.2, 2.9, 1.8, 0] and 625 * a3 + 25 * b3 == Fr(18, 10) and float(a3) == -0.0144 and float(b3) == 0.432 and round(fn3(15), 2) == 3.24
g3 = GF.Gr((60, 20, 470, 260), (0, 32), (0, 4), xs=5, ys=1, fs=12, xl='<i>x</i> (m)', yl='<i>y</i> (m)')
g3.curve(fn3, 0, 30, GR, 3)
for x, y in zip(xs3, ys3):
    g3.pt(x, y, '', AM, r=5)
g3.text(15, 3.6, '(15, 3.2)', AM, 13)
S(s, 'CONTOH 3', 'Pemodelan dengan fungsi kuadratik',
  p('Seorang ahli hidrologi mengukur kedalaman sebatang sungai, <i>y</i> m, pada jarak berbeza, <i>x</i> m, dari tebing sungai. Dengan menggunakan pemodelan matematik, tentukan kedalaman sungai itu.')
  + table(['<i>x</i> (m)'] + [str(x) for x in xs3], [['<i>y</i> (m)'] + [f'{y:g}' for y in ys3]], c, 15)
  + work([('Andaian dan pemboleh ubah', ['Sungai paling dalam di bahagian tengah dan kedalamannya berkurang hingga 0 di tepi sungai.']),
          ('Mengaplikasi matematik', ['Data kelihatan menaik kemudian menurun, menyerupai fungsi kuadratik. Daripada graf, kedalaman sungai ≈ 3.2 m pada jarak 15 m.'])], s, 1, 15),
  stack(gsvg(g3, 'Graf kedalaman sungai'),
        work([('Menentusahkan', ['<i>y</i> = <i>ax</i>² + <i>bx</i> + <i>c</i>; guna (0, 0), (25, 1.8), (30, 0): <i>c</i> = 0', '1.8 = 625<i>a</i> + 25<i>b</i> dan 0 = 900<i>a</i> + 30<i>b</i> → <i>b</i> = −30<i>a</i>',
                                     '1.8 = −125<i>a</i> → <i>a</i> = −0.0144, <i>b</i> = 0.432', '<i>x</i> = 15: <i>y</i> = −0.0144(15)² + 0.432(15) = 3.24 (hampir dengan graf)'])], s, 1, 14)))

A4 = [q2(D(15000) * D('1.03') ** t) for t in (1, 2, 3)]
assert A4 == [D('15450.00'), D('15913.50'), D('16390.91')] and round(15000 * 1.03 ** 20, 2) == 27091.67
g4 = GF.Gr((80, 20, 470, 250), (0, 20), (0, 30000), xs=5, ys=10000, fs=12, xl='<i>t</i> (tahun)', yl='<i>A</i>(<i>t</i>) (RM)')
g4.curve(lambda t: 15000 * 1.03 ** t, 0, 20, AM, 3.5)
g4.text(12, 26000, '<i>A</i>(<i>t</i>) = 15 000(1.03)<tspan dy="-6" font-size="11"><i>t</i></tspan>', AM, 14)
S(s, 'CONTOH 4', 'Pemodelan dengan fungsi eksponen',
  p('Pada awal suatu tahun, Puan Mei Ling menyimpan RM15 000 dalam akaun simpanan dengan faedah 3% setahun yang dikompaun setiap tahun. Terbitkan satu model matematik bagi jumlah simpanannya selepas <i>t</i> tahun.')
  + work([('Andaian dan pemboleh ubah', ['Tiada pengeluaran atau tambahan wang. Pemboleh ubah: prinsipal <i>P</i>, kadar faedah tahunan <i>r</i>, masa <i>t</i> tahun.']),
          ('Mengaplikasi matematik', ['Tahun 1: 15 000(1.03) = RM15 450.00', 'Tahun 2: 15 000(1.03)² = RM15 913.50', 'Tahun 3: 15 000(1.03)³ = RM16 390.91'])], s, 1, 15)
  + formula('<i>A</i>(<i>t</i>) = <i>P</i>(1 + <i>r</i>)<sup><i>t</i></sup> &nbsp; → &nbsp; <i>A</i>(<i>t</i>) = 15 000(1.03)<sup><i>t</i></sup>', c),
  stack(gsvg(g4, 'Graf pertumbuhan eksponen simpanan'),
        work([('Memurnikan model', [f'Jika faedah dikompaun <i>n</i> kali setahun: <i>A</i>(<i>t</i>) = <i>P</i>(1 + {F("<i>r</i>", "<i>n</i>")})<sup><i>nt</i></sup>', 'Contoh: dikompaun sebulan sekali, <i>n</i> = 12.'])], s, 1, 15)))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'pemodelan', 'slides.js')
HEAD = '/* Nota Bab 8 T5 ikut buku teks Matematik T5 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
