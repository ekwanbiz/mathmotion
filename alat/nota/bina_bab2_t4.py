"""Bab 2 T4 Asas Nombor: nota ikut buku teks (ayat buku, nombor ditukar).
Subtopik folder asasnombor dikekalkan (2.1.1 – 2.1.4, setara SP 2.1.1 – 2.1.4 buku)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "2.1.1", "name": "Nombor dalam Pelbagai Asas", "col": "#38BDF8"}, {"no": "2.1.2", "name": "Penukaran Asas", "col": "#FB923C"},
        {"no": "2.1.3", "name": "Tambah dan Tolak", "col": "#34D399"}, {"no": "2.1.4", "name": "Penyelesaian Masalah", "col": "#A78BFA"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr


def nb(n, b):
    return f'{n}<sub>{b}</sub>'


def val(s, b):
    return int(str(s), b)


def tob(n, b):
    d = ''
    while n:
        d = str(n % b) + d
        n //= b
    return d or '0'


def pv(b, k):
    return pw(b, k)


def placetab(num, b, c, extra=None, fs=19):
    """jadual nombor / nilai tempat (/ baris tambahan)."""
    ds = list(str(num))
    n = len(ds)
    rows = [[f'<b>Nombor asas {b}</b>'] + ds, ['Nilai tempat'] + [pv(b, n - 1 - k) for k in range(n)]]
    if extra:
        rows.append([extra[0]] + extra[1])
    return table(['', *[''] * n], rows, c, fs).replace('<thead><tr>' + ''.join(f'<th style="padding:7px 10px;text-align:center;font-size:{fs - 2}px;color:{c};border:1px solid #22304A;background:#0E1626"></th>' for _ in range(n + 1)) + '</tr></thead>', '')


def ladder(n, b, c, fs=19):
    """pembahagian berulang dengan nilai asas; baki dibaca dari bawah ke atas."""
    rows = []
    while n:
        rows.append((b, n, n % b))
        n //= b
    rows.append(('', 0, ''))
    out = ''
    for k, (bb, q, r) in enumerate(rows):
        bt = 'border-left:2px solid #94A3B8;border-bottom:2px solid #94A3B8;' if bb != '' else ''
        out += (f'<tr class="rv"><td style="padding:2px 10px;text-align:right;color:{c};font-weight:700">{bb}</td>'
                f'<td style="padding:2px 14px;text-align:right;{bt}">{q}</td>'
                f'<td style="padding:2px 10px;color:{AM}">{"– " + str(r) if r != "" else ""}</td></tr>')
    return f'<table style="border-collapse:collapse;font-size:{fs}px;font-weight:600;width:auto;align-self:flex-start">{out}</table>'


def colop(a, b2, base, op, res, carries='', borrow=None, fs=24):
    """operasi bentuk lazim (menegak). carries: rentetan sejajar digit a (kosong = tiada)."""
    w = max(len(a), len(b2), len(res)) + 1
    def cells(s, col=TX, rv=False, small=False):
        s = s.rjust(w)
        return ''.join(f'<td style="width:30px;text-align:center;color:{col};{"font-size:15px;" if small else ""}">{"" if ch == " " else ch}</td>' for ch in s)
    top = ''
    if carries:
        top = f'<tr class="rv">{cells(carries, AM, small=True)}<td></td></tr>'
    if borrow:
        top += f'<tr class="rv">{cells(borrow, AM, small=True)}<td></td></tr>'
    top = top.replace('<td></td></tr>', '<td></td></tr>')
    body = (top + f'<tr>{cells(a)}<td style="color:{MU};font-size:15px;vertical-align:bottom">{base}</td></tr>'
            + f'<tr>{cells(op + b2.rjust(w - 1))}<td style="color:{MU};font-size:15px;vertical-align:bottom">{base}</td></tr>'
            + f'<tr class="rv" style="border-top:2px solid #94A3B8">{cells(res, GR)}<td style="color:{MU};font-size:15px;vertical-align:bottom">{base}</td></tr>')
    return f'<table style="border-collapse:collapse;font-size:{fs}px;font-weight:700;font-family:Inter,sans-serif;margin:4px 0;width:auto;align-self:flex-start">{body}</table>'


def four(sub, a, b, c, d):
    return steps(sub, [f'<b>Memahami masalah:</b> {a}', f'<b>Merancang strategi:</b> {b}', f'<b>Melaksanakan strategi:</b> {c}', f'<b>Membuat kesimpulan:</b> {d}'])


# =====================================================================
# 2.1.1 NOMBOR DALAM PELBAGAI ASAS (SP 2.1.1)
# =====================================================================
s = '2.1.1'
c = COL[s]
S(s, 'DEFINISI', 'Asas nombor',
  de(s, 'Asas nombor ialah sistem nombor yang merangkumi digit 0 hingga 9. Sistem nombor terdiri daripada pelbagai asas nombor.')
  + p('Asas sepuluh atau perpuluhan merupakan asas yang digunakan secara meluas dalam kehidupan seharian. Asas nombor seperti asas 2, asas 8, asas 10 dan asas 16 antara asas nombor yang digunakan dalam sains komputer.')
  + note('Digit bermaksud simbol yang digunakan atau digabungkan untuk membentuk nombor dalam sistem penomboran. Contohnya, 3 152 mempunyai 4 digit.', 'Info:')
  ,
  stack(table(['Asas nombor', 'Digit'], [[f'Asas {k}', ', '.join(str(d) for d in range(k))] for k in range(2, 11)], c, 18, rvrows=tuple(range(1, 9))),
        note('Setiap asas mempunyai digit 0 hingga digit yang kurang daripada asasnya. Contohnya, asas dua hanya mempunyai digit 0 dan 1.', 'Tip:')))

ex1 = {2: ('11', '10110'), 3: ('12', '2102'), 4: ('31', '1302'), 5: ('24', '4031'), 6: ('53', '25014'), 7: ('46', '6153'), 8: ('75', '3627'), 9: ('68', '8402'), 10: ('97', '51 260')}
for b, (u, v) in ex1.items():
    assert all(int(ch) < b for ch in (u + v).replace(' ', ''))
S(s, 'CONTOH 1', 'Contoh nombor dalam pelbagai asas',
  p('Berikan dua contoh nombor yang mewakili nombor asas dua hingga nombor asas sepuluh.')
  + note(f'Nombor {nb(342, 5)} dibaca sebagai "tiga empat dua asas lima".', 'Info:')
  + note('Setiap digit dalam nombor mesti kurang daripada asasnya.', 'Ingat:'),
  table(['Asas', 'Nombor', 'Nombor'], [[str(b), nb(u, b), nb(v, b)] for b, (u, v) in ex1.items()], c, 19, rvrows=tuple(range(9))))

pvrows = [[f'Asas {b}'] + [f'{b ** k:,}'.replace(',', ' ') for k in range(5, -1, -1)] for b in range(2, 11)]
S(s, 'KONSEP', 'Nilai tempat',
  p('Setiap asas mempunyai nilai tempat mengikut asas masing-masing.')
  + de(s, f'Nilai tempat suatu asas ialah pendaraban berulang asas tersebut. Katakan <i>a</i> ialah asas, maka nilai tempat asas tersebut bermula dengan <i>a</i><sup>0</sup>, <i>a</i><sup>1</sup>, <i>a</i><sup>2</sup>, …, <i>a</i><sup><i>n</i></sup>.')
  + note('<i>a</i><sup>4</sup> = <i>a</i> × <i>a</i> × <i>a</i> × <i>a</i>; <i>a</i> ialah asas dan <i>n</i> ialah kuasa.', 'Imbas kembali:'),
  table(['Asas', *[pw('<i>a</i>', k) for k in range(5, -1, -1)]], pvrows, c, 17))

assert val(5132, 7) and val(101101, 2)
S(s, 'CONTOH 2', 'Menyatakan nilai tempat',
  p(f'Nyatakan nilai tempat bagi setiap digit dalam nombor di bawah. (a) {nb(5132, 7)} (b) {nb(101101, 2)}')
  + p('<b>Penyelesaian:</b>')
  + f'<div class="rv"><b style="color:{c}">(a)</b>' + placetab(5132, 7, c) + '</div>'
,
  stack(f'<div class="rv"><b style="color:{c}">(b)</b>' + placetab(101101, 2, c) + '</div>', note('Nilai tempat bermula dengan <i>a</i><sup>0</sup> pada digit paling kanan dan bertambah satu kuasa bagi setiap digit ke kiri.', 'Tip:')))

assert 6 * 9 ** 3 == 4374 and 2 * 6 ** 2 == 72 and 1 * 2 ** 1 == 2 and 2 * 3 ** 3 == 54
S(s, 'CONTOH 3', 'Nilai digit',
  de(s, 'Nilai digit dalam suatu nombor ialah pendaraban digit dengan nilai tempat yang mewakili digit tersebut.')
  + placetab(1010, 2, c, ('Nilai digit', ['', '', f'1 × {pw(2, 1)} = 2', '']))
  + p(f'<b>CONTOH 3</b> Nyatakan nilai digit yang bergaris bagi setiap nombor berikut. (a) {nb("<u>6</u>031", 9)} (b) {nb("4<u>2</u>53", 6)}'),
  stack(f'<div class="rv"><b style="color:{c}">(a)</b>' + placetab(6031, 9, c) + f'<p class="sl-p">Nilai digit 6 = 6 × {pw(9, 3)} = 4 374</p></div>',
        f'<div class="rv"><b style="color:{c}">(b)</b>' + placetab(4253, 6, c) + f'<p class="sl-p">Nilai digit 2 = 2 × {pw(6, 2)} = 72</p></div>'))

assert val(10110, 2) == 22 and val(21012, 3) == 194 and val(2310, 4) == 180
S(s, 'KONSEP', 'Nilai nombor',
  de(s, 'Nilai nombor dalam pelbagai asas boleh ditentukan dengan menghitung hasil tambah nilai digit nombor tersebut.')
  + p(f'(a) Nilai nombor bagi nombor dalam asas dua: {nb(10110, 2)}') + placetab(10110, 2, c, fs=18)
  + work([('', [f'Nilai nombor = (1 × {pw(2, 4)}) + (0 × {pw(2, 3)}) + (1 × {pw(2, 2)}) + (1 × {pw(2, 1)}) + (0 × {pw(2, 0)})', f'= 16 + 0 + 4 + 2 + 0 = {nb(22, 10)}'])], s, 1, 18),
  stack(p(f'(b) Asas tiga: {nb(21012, 3)}'),
        work([('', [f'(2 × {pw(3, 4)}) + (1 × {pw(3, 3)}) + (0 × {pw(3, 2)}) + (1 × {pw(3, 1)}) + (2 × {pw(3, 0)})', f'= 162 + 27 + 0 + 3 + 2 = {nb(194, 10)}'])], s, 1, 18),
        p(f'(c) Asas empat: {nb(2310, 4)}'),
        work([('', [f'(2 × {pw(4, 3)}) + (3 × {pw(4, 2)}) + (1 × {pw(4, 1)}) + (0 × {pw(4, 0)})', f'= 128 + 48 + 4 + 0 = {nb(180, 10)}'])], s, 1, 18),
        note('Penulisan tanda asas untuk nombor asas 10 bersifat pilihan, iaitu boleh ditulis dan sebaliknya.', 'Info:')))

assert val(423, 5) == 113 and val(256, 7) == 139 and val(1374, 8) == 764
S(s, 'CONTOH 4', 'Menentukan nilai nombor',
  p(f'Tentukan nilai nombor bagi yang berikut. (a) {nb(423, 5)} (b) {nb(256, 7)} (c) {nb(1374, 8)}')
  + work([('(a)', [f'Nilai nombor = (4 × {pw(5, 2)}) + (2 × {pw(5, 1)}) + (3 × {pw(5, 0)})', f'= 100 + 10 + 3', f'= {nb(113, 10)}']),
          ('(b)', [f'Nilai nombor = (2 × {pw(7, 2)}) + (5 × {pw(7, 1)}) + (6 × {pw(7, 0)})', f'= 98 + 35 + 6', f'= {nb(139, 10)}'])], s, 1, 19),
  stack(work([('(c)', [f'Nilai nombor = (1 × {pw(8, 3)}) + (3 × {pw(8, 2)}) + (7 × {pw(8, 1)}) + (4 × {pw(8, 0)})', f'= 512 + 192 + 56 + 4', f'= {nb(764, 10)}'])], s, 1, 19),
        note('Jawapan boleh disemak dengan kalkulator saintifik dalam mod BASE: tekan OCT, masukkan 1374, kemudian tekan DEC.', 'Semak jawapan:')))

# =====================================================================
# 2.1.2 PENUKARAN ASAS (SP 2.1.2)
# =====================================================================
s = '2.1.2'
c = COL[s]
S(s, 'KONSEP', 'Menukar nombor daripada satu asas kepada asas yang lain',
  p('Suatu nombor boleh ditukar kepada asas lain dengan menggunakan pelbagai kaedah, iaitu kaedah penggunaan nilai tempat dan kaedah pembahagian. Proses ini melibatkan penukaran')
  + bul(s, ['(a) nombor dalam asas sepuluh kepada asas lain,', '(b) nombor daripada sesuatu asas kepada asas sepuluh dan seterusnya kepada asas lain,',
            '(c) nombor dalam asas dua terus kepada asas lapan,', '(d) nombor dalam asas lapan terus kepada asas dua.'])
,
  stack(p(f'Nombor asas sepuluh boleh ditukar kepada asas lain dengan membahagikan nombornya menggunakan nilai tempat atau nilai asas yang dikehendaki.'), work([('Contoh: 37₁₀ kepada asas dua', ['Bahagi 37 dengan 2 secara berulang. Baki dibaca dari bawah ke atas.'])], s, 1, 18), ladder(37, 2, c),
        p(f'{nb(37, 10)} = {nb(tob(37, 2), 2)}')))
assert tob(37, 2) == '100101'

assert tob(459, 5) == '3314' and tob(459, 8) == '713'
S(s, 'CONTOH 5', 'Asas sepuluh kepada asas lain',
  p(f'Sungai Pahang ialah sungai terpanjang di Semenanjung Malaysia, iaitu 459 kilometer. Tukar {nb(459, 10)} kepada (a) asas lima (b) asas lapan.')
  + work([('(a) Pembahagian dengan menggunakan nilai tempat', ['Nilai 625 lebih besar daripada 459, mula dengan 125.', '459 ÷ 125 = 3 baki 84', '84 ÷ 25 = 3 baki 9', '9 ÷ 5 = 1 baki 4', '4 ÷ 1 = 4 baki 0', f'{nb(459, 10)} = {nb(3314, 5)}'])], s, 1, 18)
  + note('Baki dipindahkan ke nilai tempat sebelum untuk pembahagian seterusnya sehingga mendapat baki sifar.', 'Tip:'),
  stack(work([('Kaedah alternatif: pembahagian dengan nilai asas', [])], s, 1, 17),
        f'<div style="display:flex;gap:40px;align-items:flex-start"><div><b style="color:{c}">(a)</b>{ladder(459, 5, c, 18)}<p class="sl-p rv">{nb(459, 10)} = {nb(3314, 5)}</p></div>'
        f'<div><b style="color:{c}">(b)</b>{ladder(459, 8, c, 18)}<p class="sl-p rv">{nb(459, 10)} = {nb(713, 8)}</p></div></div>'))

assert val(341, 6) == 133 and tob(133, 9) == '157'
S(s, 'CONTOH 6', 'Asas p kepada asas sepuluh dan seterusnya kepada asas q',
  p('Sesuatu nombor dalam asas <i>p</i> boleh ditukarkan kepada asas sepuluh dan seterusnya kepada asas <i>q</i>.')
  + formula(f'Asas <i>p</i> → Asas 10 → Asas <i>q</i>', c)
  + p(f'<b>CONTOH 6</b> Tukar {nb(341, 6)} kepada asas sembilan.')
  + work([('Langkah 1: Tukar nombor dalam asas enam kepada asas sepuluh.', [f'(3 × {pw(6, 2)}) + (4 × {pw(6, 1)}) + (1 × {pw(6, 0)})', f'= 108 + 24 + 1 = {nb(133, 10)}'])], s, 1, 19),
  stack(work([('Langkah 2: Tukar nombor dalam asas sepuluh kepada asas sembilan.', [])], s, 1, 18), ladder(133, 9, c),
        p(f'<span class="rv">{nb(341, 6)} = {nb(133, 10)} = {nb(157, 9)}</span>')))

assert val(243, 5) == 73 and tob(73, 2) == '1001001'
S(s, 'CONTOH 7', 'Asas lima kepada asas dua',
  p(f'Tukar {nb(243, 5)} kepada asas dua.')
  + work([('Langkah 1: Tukar nombor dalam asas lima kepada asas sepuluh.', [f'(2 × {pw(5, 2)}) + (4 × {pw(5, 1)}) + (3 × {pw(5, 0)})', f'= 50 + 20 + 3 = {nb(73, 10)}'])], s, 1, 19),
  stack(work([('Langkah 2: Tukar nombor dalam asas sepuluh kepada asas dua.', [])], s, 1, 18), ladder(73, 2, c, 17),
        p(f'<span class="rv">{nb(243, 5)} = {nb(73, 10)} = {nb(1001001, 2)}</span>')))

conv = table(['Asas 2', *[f'{k:03b}' for k in range(8)]], [['Asas 8', *[str(k) for k in range(8)]]], c, 17)
assert tob(val(101110, 2), 8) == '56' and tob(val(1011011, 2), 8) == '133'
S(s, 'CONTOH 8', 'Asas dua terus kepada asas lapan',
  p('Nombor dalam asas dua boleh ditukar terus kepada asas lapan. Setiap digit dalam asas lapan adalah setara dengan tiga digit dalam asas dua.')
  + steps(s, ['Asingkan setiap tiga digit dalam nombor asas dua bermula dari kanan ke kiri.', 'Tentukan hasil tambah nilai digit bagi gabungan tiga digit asas dua.', 'Gabungkan nombor dalam asas lapan.'])
  + conv,
  stack(p(f'Tukar nombor asas dua kepada nombor asas lapan. (a) {nb(101110, 2)} (b) {nb(1011011, 2)}'),
        work([('(a)', ['101 | 110', f'(4 + 0 + 1) | (4 + 2 + 0)', '5 | 6', f'{nb(101110, 2)} = {nb(56, 8)}']),
              ('(b)', ['1 | 011 | 011', '(1) | (0 + 2 + 1) | (0 + 2 + 1)', '1 | 3 | 3', f'{nb(1011011, 2)} = {nb(133, 8)}'])], s, 1, 19)))

assert tob(val(642, 8), 2) == '110100010' and tob(val(357, 8), 2) == '11101111'
S(s, 'CONTOH 9', 'Asas lapan terus kepada asas dua',
  p('Nombor dalam asas lapan boleh ditukarkan terus kepada asas dua. Setiap digit dalam asas lapan digantikan dengan tiga digit yang setara dalam asas dua.')
  + steps(s, ['Asingkan setiap digit dalam nombor asas lapan.', 'Tukarkan setiap digit tersebut kepada nombor asas dua.', 'Gabungkan kesemua nilai digit dalam asas dua.'])
  + conv,
  stack(p(f'Tukar nombor asas lapan kepada nombor asas dua. (a) {nb(642, 8)} (b) {nb(357, 8)}'),
        work([('(a)', ['6 | 4 | 2', '(4 + 2) | (4) | (2)', '110 | 100 | 010', f'{nb(642, 8)} = {nb(110100010, 2)}']),
              ('(b)', ['3 | 5 | 7', '(2 + 1) | (4 + 1) | (4 + 2 + 1)', '011 | 101 | 111', f'{nb(357, 8)} = {nb(11101111, 2)}'])], s, 1, 19)
        + note('Digit 0 di sebelah kiri nombor asas dua boleh diabaikan.', 'Tip:')))

# =====================================================================
# 2.1.3 TAMBAH DAN TOLAK (SP 2.1.3)
# =====================================================================
s = '2.1.3'
c = COL[s]
S(s, 'KONSEP', 'Operasi tambah dan tolak dalam pelbagai asas',
  p('Operasi tambah dan operasi tolak dalam asas nombor boleh dijalankan dengan dua kaedah berikut.')
  + bul(s, ['(a) Bentuk lazim iaitu cara menulis nombor secara menegak dalam operasi tambah dan operasi tolak.', '(b) Penukaran nombor dalam suatu asas kepada asas sepuluh.']),
  stack(work([('Bentuk lazim (tambah)', ['1. Tambah digit yang diberikan bermula dari kanan ke kiri.', '2. Hasil tambah digit dalam asas sepuluh ditukar kepada asas yang diberikan untuk ditulis di ruang jawapan.', '3. Proses ini akan berulang sehingga semua digit dalam nombor selesai ditambah.']),
              ('Penukaran asas', ['1. Tukar nombor kepada asas sepuluh dan lakukan operasi tambah atau tolak.', '2. Tukarkan semula jawapan dalam asas sepuluh kepada asas yang dikehendaki.'])], s, 1, 18)))

assert tob(val(101, 2) + val(111, 2), 2) == '1100' and tob(val(547, 8) + val(356, 8), 8) == '1125'
S(s, 'CONTOH 10', 'Operasi tambah',
  p(f'Hitung nilai bagi setiap yang berikut. (a) {nb(101, 2)} + {nb(111, 2)} (b) {nb(547, 8)} + {nb(356, 8)}')
  + f'<div style="display:flex;gap:40px"><div><b style="color:{c}">(a)</b>' + colop('101', '111', 2, '+', '1100', '11 ') + '</div>'
  + f'<div><b style="color:{c}">(b)</b>' + colop('547', '356', 8, '+', '1125', '11 ') + '</div></div>'
  + note('Angka kecil di atas ialah nilai yang dibawa ke nilai tempat seterusnya.', 'Tip:'),
  work([('(a)', ['1 + 1 = 2₁₀ = 10₂. Tulis 0, 1 dibawa ke nilai tempat seterusnya.', '1 + 0 + 1 = 2₁₀ = 10₂. Tulis 0, bawa 1.', '1 + 1 + 1 = 3₁₀ = 11₂',
                 f'Penukaran asas: {nb(101, 2)} → 5₁₀, {nb(111, 2)} → 7₁₀; 5 + 7 = 12₁₀ = {nb(1100, 2)}']),
        ('(b)', ['7 + 6 = 13₁₀ = 15₈. Tulis 5, bawa 1.', '1 + 4 + 5 = 10₁₀ = 12₈. Tulis 2, bawa 1.', '1 + 5 + 3 = 9₁₀ = 11₈',
                 f'Penukaran asas: 359₁₀ + 238₁₀ = 597₁₀ = {nb(1125, 8)}'])], s, 1, 17))

assert tob(val(2648, 9) + val(573, 9), 9) == '3332' and val(2648, 9) == 1988 and val(573, 9) == 471
S(s, 'CONTOH 10', 'Operasi tambah (sambungan)',
  p(f'(c) {nb(2648, 9)} + {nb(573, 9)}')
  + colop('2648', '573', 9, '+', '3332', '111 ')
  + p(f'Maka, {nb(2648, 9)} + {nb(573, 9)} = {nb(3332, 9)}'),
  work([('Bentuk lazim', ['8 + 3 = 11₁₀ = 12₉. Tulis 2, bawa 1.', '1 + 4 + 7 = 12₁₀ = 13₉. Tulis 3, bawa 1.', '1 + 6 + 5 = 12₁₀ = 13₉. Tulis 3, bawa 1.', '1 + 2 = 3₁₀ = 3₉']),
        ('Penukaran asas', [f'{nb(2648, 9)} → 1 988₁₀, {nb(573, 9)} → 471₁₀', '1 988 + 471 = 2 459₁₀', f'2 459₁₀ = {nb(3332, 9)}'])], s, 1, 19))

assert tob(val(3012, 6) - val(245, 6), 6) == '2323' and tob(val(5324, 7) - val(456, 7), 7) == '4535'
S(s, 'CONTOH 11', 'Operasi tolak',
  p('Bagi operasi tolak, apabila digit atas lebih kecil, pinjam satu daripada nilai tempat sebelah kiri. Nilai yang dipinjam bersamaan dengan asas nombor itu.')
  + p(f'Hitung nilai bagi setiap yang berikut. (a) {nb(3012, 6)} − {nb(245, 6)} (b) {nb(5324, 7)} − {nb(456, 7)}')
  + f'<div style="display:flex;gap:40px"><div><b style="color:{c}">(a)</b>' + colop('3012', '245', 6, '−', '2323') + '</div>'
  + f'<div><b style="color:{c}">(b)</b>' + colop('5324', '456', 7, '−', '4535') + '</div></div>',
  work([('(a) Pindahan nombor mengikut asas enam', ['(6 + 2) − 5 = 3; 1 menjadi 0', '0 meminjam daripada 3 melalui 0: (6 + 0) − 4 = 2', '0 menjadi 5: 5 − 2 = 3', '3 menjadi 2: 2 − 0 = 2', f'Semak: 656₁₀ − 101₁₀ = 555₁₀ = {nb(2323, 6)}']),
        ('(b) Pindahan nombor mengikut asas tujuh', ['(7 + 4) − 6 = 5', '2 menjadi 1: (7 + 1) − 5 = 3', '3 menjadi 2: (7 + 2) − 4 = 5', '5 menjadi 4: 4 − 0 = 4', f'Semak: 1 880₁₀ − 237₁₀ = 1 643₁₀ = {nb(4535, 7)}'])], s, 1, 18))

assert tob(val(461, 8) - val(75, 8), 8) == '364' and tob(val(2735, 9) - val(84, 9), 9) == '2641'
S(s, 'CONTOH 11', 'Operasi tolak (sambungan)',
  p(f'(c) {nb(461, 8)} − {nb(75, 8)} &nbsp;&nbsp; (d) {nb(2735, 9)} − {nb(84, 9)}')
  + f'<div style="display:flex;gap:40px"><div><b style="color:{c}">(c)</b>' + colop('461', '75', 8, '−', '364') + '</div>'
  + f'<div><b style="color:{c}">(d)</b>' + colop('2735', '84', 9, '−', '2641') + '</div></div>'
  + note('Hasil tolak setiap digit sentiasa kurang daripada asas yang diberikan.', 'Ingat:'),
  work([('(c) Asas lapan', ['(8 + 1) − 5 = 4', '6 menjadi 5: (8 + 5) − 7 = 6', '4 menjadi 3: 3 − 0 = 3', f'Semak: 305₁₀ − 61₁₀ = 244₁₀ = {nb(364, 8)}']),
        ('(d) Asas sembilan', ['5 − 4 = 1', '(9 + 3) − 8 = 4', '7 menjadi 6: 6 − 0 = 6', '2 − 0 = 2', f'Semak: 2 057₁₀ − 76₁₀ = 1 981₁₀ = {nb(2641, 9)}'])], s, 1, 18))

# =====================================================================
# 2.1.4 PENYELESAIAN MASALAH (SP 2.1.4)
# =====================================================================
s = '2.1.4'
c = COL[s]
pct = [('Bas', 30), ('Kereta', 35), ('Jalan kaki', 15), ('Basikal', 12), ('Motosikal', 8)]
assert sum(v for _, v in pct) == 100
nbus, ncar, nwalk, nmot = 90, 105, 45, 24
assert tob(nbus, 4) == '1122' and tob(ncar, 4) == '1221' and tob(nbus + ncar, 4) == '3003' and tob(nwalk - nmot, 7) == '30'
S(s, 'CONTOH 12', 'Menyelesaikan masalah yang melibatkan asas nombor',
  p('Jadual di sebelah menunjukkan kajian tentang cara 300 orang murid hadir ke sekolah.')
  + bul(s, ['(a) Tentukan bilangan murid yang hadir ke sekolah dengan menaiki bas dan menaiki kereta dalam asas empat.',
            '(b) Hitung jumlah murid yang hadir ke sekolah dengan menaiki bas dan menaiki kereta dalam asas empat.',
            '(c) Hitung beza antara bilangan murid yang hadir ke sekolah dengan berjalan kaki dan menunggang motosikal dalam asas tujuh.']),
  stack(table(['Cara ke sekolah', 'Peratus (%)'], [[a, str(v)] for a, v in pct], c, 18), work([('Memahami masalah', ['Jumlah murid = 300. Peratus yang diberikan perlu ditukar kepada bilangan murid.']),
              ('Merancang strategi', ['(a) Tukar bilangan murid yang menaiki bas dan kereta kepada nombor dalam asas empat. (b) Tambah jawapan dalam (a). (c) Tolak bilangan murid yang berjalan kaki dengan yang menunggang motosikal. Tukar jawapan kepada nombor asas tujuh.'])], s, 1, 17)))

S(s, 'CONTOH 12', 'Menyelesaikan masalah (sambungan)',
  work([('Melaksanakan strategi', [f'(a) Bas = {F(30, 100)} × 300 = {nb(90, 10)} = {nb(1122, 4)}', f'Kereta = {F(35, 100)} × 300 = {nb(105, 10)} = {nb(1221, 4)}'])], s, 1, 19)
  + f'<div style="display:flex;gap:36px;align-items:flex-start"><div><b style="color:{c}">(b)</b>' + colop('1122', '1221', 4, '+', '3003', '11  ') + '</div>'
  + f'<div class="rv" style="padding-top:6px"><b style="color:{c}">Semak jawapan:</b><br>90 + 105 = 195₁₀<br>195₁₀ = {nb(3003, 4)}</div></div>',
  stack(work([('', [f'(c) Jalan kaki = {F(15, 100)} × 300 = 45₁₀', f'Motosikal = {F(8, 100)} × 300 = 24₁₀', f'45 − 24 = 21₁₀ = {nb(30, 7)}'])], s, 1, 19),
        f'<div style="display:flex;gap:30px"><div>{ladder(90, 4, c, 17)}</div><div>{ladder(21, 7, c, 17)}</div></div>',
        work([('Membuat kesimpulan', [f'(a) Bas = {nb(1122, 4)}, kereta = {nb(1221, 4)}', f'(b) {nb(1122, 4)} + {nb(1221, 4)} = {nb(3003, 4)}', f'(c) Beza = {nb(30, 7)}'])], s, 1, 19)))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'asasnombor', 'slides.js')
HEAD = '/* Nota Bab 2 ikut buku teks Matematik T4 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
