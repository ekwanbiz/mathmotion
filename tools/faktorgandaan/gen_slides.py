# Penjana slaid NOTA Bab 2 Faktor dan Gandaan (Tingkatan 1, KP2027) -> faktorgandaan/slides.js
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from t1lib import *
OUT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'faktorgandaan', 'slides.js'))
SUB = {'2.1': ('Faktor, Faktor Perdana, Faktor Sepunya dan FSTB', GR), '2.2': ('Gandaan, Gandaan Sepunya dan GSTK', PU)}

def pf(n):
    f, d = [], 2
    while n > 1:
        while n % d == 0: f.append(d); n //= d
        d += 1
    return f

def arrays12():
    s = BOX(); s += T(250, 36, 'Susunan 12 biji guli', TX, 20)
    rows = [(1, 12), (2, 6), (3, 4)]
    y = 70
    for r, c in rows:
        cell = 26
        for i in range(r):
            for j in range(c):
                s += CIRC((60 + j * cell + 13, y + i * cell + 13), 10, GR, NAV, 3)
        s += T(440, y + r * cell / 2, f'{r} × {c}', GR, 22)
        y += r * cell + 30
    s += T(250, 410, 'Faktor bagi 12: 1, 2, 3, 4, 6, 12', AM, 20)
    return svg(s, 'Susunan 12 guli dalam bentuk 1 kali 12, 2 kali 6 dan 3 kali 4')

def tree(n, label):
    s = BOX()
    def node(v, x, y, depth, w):
        nonlocal s
        prime = len(pf(v)) == 1
        col = AM if prime else TX
        if prime:
            s += CIRC((x, y), 24, AM, NAV, 3)
        s += T(x, y, str(v), col, 22)
        if not prime:
            p = pf(v)[0]; q = v // p
            xl, xr, yy = x - w, x + w, y + 80
            s += LINE((x - 8, y + 18), (xl + 6, yy - 22), MU, 3) + LINE((x + 8, y + 18), (xr - 6, yy - 22), MU, 3)
            node(p, xl, yy, depth + 1, w * 0.6)
            node(q, xr, yy, depth + 1, w * 0.6)
    node(n, 250, 50, 0, 110)
    f = pf(n)
    s += T(250, 415, f'{n} = ' + ' × '.join(map(str, f)), GR, 22)
    return svg(s, label)

def divtable(nums, divs, label):
    s = BOX(); cw = 80; x0 = 250 - cw * (len(nums) + 1) / 2; y = 50; rows = [nums]
    cur = nums[:]
    for d in divs:
        cur = [v // d if v % d == 0 else v for v in cur]; rows.append(cur)
    for i, row in enumerate(rows):
        yy = y + i * 46
        if i < len(divs):
            s += T(x0 + cw / 2, yy + 23, str(divs[i]), AM, 22)
            s += LINE((x0 + cw - 8, yy + 4), (x0 + cw - 8, yy + 44), MU, 2) + LINE((x0 + cw - 8, yy + 44), (x0 + cw * (len(nums) + 1), yy + 44), MU, 2)
        for j, v in enumerate(row):
            s += T(x0 + cw * (j + 1) + cw / 2, yy + 23, str(v), TX, 22)
    return svg(s, label)

def venn2(a, b):
    fa, fb = pf(a), pf(b); common = []; ra = fa[:]; rb = fb[:]
    for x in fa[:]:
        if x in rb: common.append(x); rb.remove(x); ra.remove(x)
    s = BOX()
    s += f'<circle cx="185" cy="210" r="135" fill="none" stroke="{GR}" stroke-width="4"/><circle cx="315" cy="210" r="135" fill="none" stroke="{PU}" stroke-width="4"/>'
    s += T(120, 62, f'{a}', GR, 24) + T(380, 62, f'{b}', PU, 24)
    for i, v in enumerate(ra): s += T(115, 170 + i * 40, str(v), GR, 24)
    for i, v in enumerate(common): s += T(250, 160 + i * 40, str(v), AM, 24)
    for i, v in enumerate(rb): s += T(385, 170 + i * 40, str(v), PU, 24)
    g = math.prod(common); l = a * b // g
    s += T(250, 372, f'FSTB = {" × ".join(map(str, common))} = {g}', AM, 20) + T(250, 408, f'GSTK = {" × ".join(map(str, ra + common + rb))} = {l}', TR, 20)
    return svg(s, f'Gambar rajah Venn faktor perdana {a} dan {b}')

def mults(a, b, n=10):
    s = BOX(); s += T(250, 40, f'Gandaan {a} dan {b}', TX, 20)
    l = a * b // math.gcd(a, b)
    for row, (v, col) in enumerate([(a, GR), (b, PU)]):
        y = 100 + row * 120
        s += T(40, y, str(v), col, 22, 'start')
        for k in range(1, n + 1):
            m = v * k; x = 70 + k * 38
            if m > l * 3: break
            hit = m % l == 0
            if hit: s += CIRC((x, y), 19, AM, NAV, 3)
            s += T(x, y, str(m), AM if hit else col, 16)
    s += T(250, 330, f'Gandaan sepunya: {l}, {2*l}, {3*l}, …', AM, 20) + T(250, 375, f'GSTK = {l}', TR, 24)
    return svg(s, f'Senarai gandaan {a} dan {b} dengan gandaan sepunya dibulatkan')

def clock(label):
    s = BOX()
    rows = [('Bas A', 12, GR), ('Bas B', 18, PU)]
    x0, x1 = 70, 470; X = lambda t: x0 + t / 72 * (x1 - x0)
    for i, (nm, step, col) in enumerate(rows):
        y = 120 + i * 110
        s += T(40, y - 40, nm + f' (setiap {step} min)', col, 18, 'start') + LINE((x0, y), (x1, y), MU, 3)
        for t in range(0, 73, step):
            hit = t % 36 == 0
            s += DOT((X(t), y), AM if hit else col, 10 if hit else 7)
    for t in range(0, 73, 12):
        s += T(X(t), 360, f'{7 + t // 60}:{t % 60:02d}', MU, 15)
    s += LINE((X(36), 70), (X(36), 340), AM, 2, '6 5') + T(X(36), 395, 'Bertolak bersama semula: 7:36 pagi', AM, 19)
    return svg(s, label)

# ===== 2.1 =====
c = GR
add('2.1', '2.1 Faktor', 'Apakah faktor?',
    DEF('<b>Faktor</b> bagi suatu nombor bulat ialah nombor bulat yang dapat membahagi nombor itu dengan tepat (tiada baki).', c)
    + BUL(['12 ÷ 3 = 4 tanpa baki, maka 3 dan 4 ialah faktor bagi 12.', 'Cari faktor secara berpasangan: 1 × 12, 2 × 6, 3 × 4.', '1 dan nombor itu sendiri sentiasa faktor.'], c), arrays12())
PR = [p for p in range(2, 50) if len(pf(p)) == 1]
assert PR[:5] == [2, 3, 5, 7, 11] and len(PR) == 15
add('2.1', '2.1 Faktor', 'Nombor perdana dan faktor perdana',
    DEF('<b>Nombor perdana</b> hanya mempunyai dua faktor: 1 dan nombor itu sendiri. <b>Faktor perdana</b> ialah faktor yang juga nombor perdana.', c)
    + BUL(['Nombor perdana kurang daripada 50: ' + ', '.join(map(str, PR)), '1 <b>bukan</b> nombor perdana (hanya satu faktor).', 'Faktor bagi 12: 1, 2, 3, 4, 6, 12 → faktor perdana: <b>2 dan 3</b>.'], c), arrays12())
assert pf(60) == [2, 2, 3, 5]
add('2.1', '2.1 Faktor', 'Pemfaktoran perdana',
    P('Ungkapkan nombor sebagai hasil darab faktor perdana. Dua cara:')
    + STEPS(['<b>Pokok faktor</b>: pecahkan 60 → 2 × 30 → 2 × 2 × 15 → …', '<b>Pembahagian berulang</b>: bahagi dengan nombor perdana terkecil berulang kali hingga mendapat 1.', '60 = 2 × 2 × 3 × 5 = 2² × 3 × 5'], c), tree(60, 'Pokok faktor bagi 60'))
assert math.gcd(18, 24) == 6
add('2.1', '2.1 FSTB', 'Faktor sepunya dan FSTB',
    DEF('<b>Faktor sepunya</b> ialah faktor yang dikongsi oleh dua atau lebih nombor. <b>FSTB</b> (faktor sepunya terbesar) ialah faktor sepunya yang paling besar.', c)
    + TABLE(['Nombor', 'Faktor'], [['18', '<b>1</b>, <b>2</b>, <b>3</b>, <b>6</b>, 9, 18'], ['24', '<b>1</b>, <b>2</b>, <b>3</b>, 4, <b>6</b>, 8, 12, 24']], c)
    + ANS('Faktor sepunya: 1, 2, 3, 6. FSTB = 6'), venn2(18, 24))
assert math.gcd(math.gcd(24, 36), 60) == 12
add('2.1', 'Contoh 1', 'FSTB bagi tiga nombor',
    P('Cari FSTB bagi 24, 36 dan 60 dengan pembahagian berulang.')
    + STEPS(['Bahagi dengan nombor perdana yang membahagi <b>semua</b> nombor.', '2 → 12, 18, 30; 2 → 6, 9, 15; 3 → 2, 3, 5', 'Berhenti apabila tiada faktor sepunya lagi.', 'FSTB = 2 × 2 × 3'], c) + ANS('FSTB = 12'),
    divtable([24, 36, 60], [2, 2, 3], 'Pembahagian berulang 24, 36 dan 60'))
assert math.gcd(8, 15) == 1 and math.gcd(3, 6) == 3
add('2.1', '2.1 Koperdana', 'Nombor koperdana',
    DEF('Dua nombor ialah <b>koperdana</b> jika faktor sepunya mereka hanyalah 1 (FSTB = 1).', c)
    + TABLE(['Nombor', 'Faktor sepunya', 'Koperdana?'], [['8 dan 15', '1', 'Ya'], ['3 dan 6', '1, 3', 'Tidak'], ['9 dan 10', '1', 'Ya']], c)
    + NOTE('Nombor koperdana tidak semestinya nombor perdana: 8 dan 15 bukan nombor perdana.'), venn2(8, 15))
assert math.gcd(math.gcd(120, 96), 72) == 24 and (120 // 24, 96 // 24, 72 // 24) == (5, 4, 3)
add('2.1', 'Contoh 2', 'Masalah harian: agihan adil',
    P('Sebuah pusat pemindahan banjir menerima 120 botol air, 96 bungkus roti dan 72 tin sardin. Semua barang dibahagi sama rata ke dalam beg bantuan tanpa baki. Berapakah bilangan beg <b>maksimum</b>? Apakah isi setiap beg?')
    + STEPS(['“Maksimum” dan “sama rata tanpa baki” → cari FSTB.', 'FSTB bagi 120, 96 dan 72 = 24', 'Setiap beg: 120 ÷ 24, 96 ÷ 24, 72 ÷ 24'], c) + ANS('24 beg; setiap beg 5 botol air, 4 roti, 3 tin sardin'),
    divtable([120, 96, 72], [2, 2, 2, 3], 'Pembahagian berulang 120, 96 dan 72'))

# ===== 2.2 =====
c = PU
add('2.2', '2.2 Gandaan', 'Apakah gandaan?',
    DEF('<b>Gandaan</b> bagi suatu nombor ialah hasil darab nombor itu dengan 1, 2, 3, 4, …', c)
    + BUL(['Gandaan 4: 4, 8, 12, 16, 20, …', 'Gandaan 6: 6, 12, 18, 24, 30, …', 'Senarai gandaan tidak berakhir.', 'Jika 4 ialah faktor bagi 12, maka 12 ialah gandaan bagi 4.'], c), mults(4, 6))
assert 4 * 6 // math.gcd(4, 6) == 12
add('2.2', '2.2 Gandaan Sepunya', 'Gandaan sepunya dan GSTK',
    DEF('<b>Gandaan sepunya</b> ialah gandaan yang dikongsi oleh dua atau lebih nombor. <b>GSTK</b> (gandaan sepunya terkecil) ialah gandaan sepunya yang paling kecil.', c)
    + BUL(['Gandaan sepunya 4 dan 6: 12, 24, 36, …', 'GSTK = 12', 'Setiap gandaan sepunya ialah gandaan bagi GSTK: 12, 2 × 12, 3 × 12, …'], c), mults(4, 6))
L = 4 * 6 // math.gcd(4, 6); L = L * 10 // math.gcd(L, 10); assert L == 60
add('2.2', 'Contoh 1', 'GSTK dengan pembahagian berulang',
    P('Cari GSTK bagi 4, 6 dan 10.')
    + STEPS(['Bahagi dengan nombor perdana yang membahagi <b>sekurang-kurangnya dua</b> nombor.', 'Nombor yang tidak boleh dibahagi diturunkan begitu sahaja.', '2 → 2, 3, 5 (tiada lagi faktor sepunya)', 'GSTK = 2 × 2 × 3 × 5'], c) + ANS('GSTK = 60'),
    divtable([4, 6, 10], [2], 'Pembahagian berulang 4, 6 dan 10'))
assert 18 * 24 // math.gcd(18, 24) == 72
add('2.2', 'Contoh 2', 'GSTK dengan pemfaktoran perdana',
    P('Cari FSTB dan GSTK bagi 18 dan 24.')
    + STEPS(['18 = 2 × 3 × 3, 24 = 2 × 2 × 2 × 3', 'FSTB: darab faktor <b>sepunya</b> = 2 × 3 = 6', 'GSTK: darab <b>semua</b> faktor dalam gambar rajah Venn = 3 × 2 × 3 × 2 × 2'], c) + ANS('FSTB = 6, GSTK = 72')
    + NOTE('Bagi dua nombor: FSTB × GSTK = hasil darab dua nombor itu (6 × 72 = 18 × 24).'), venn2(18, 24))
assert 12 * 18 // math.gcd(12, 18) == 36
add('2.2', 'Contoh 3', 'Masalah harian: jadual bas',
    P('Bas A bertolak dari stesen setiap 12 minit dan Bas B setiap 18 minit. Kedua-dua bas bertolak bersama pada 7:00 pagi. Bilakah kedua-dua bas bertolak bersama sekali lagi?')
    + STEPS(['“Bersama sekali lagi” → cari GSTK.', 'GSTK bagi 12 dan 18 = 36', '7:00 pagi + 36 minit'], c) + ANS('7:36 pagi'), clock('Garis masa Bas A setiap 12 minit dan Bas B setiap 18 minit'))
add('2.2', 'Ringkasan', 'FSTB atau GSTK?',
    TABLE(['Kata kunci dalam soalan', 'Guna'], [['bahagi sama rata, maksimum, terbesar, tanpa baki', 'FSTB'], ['serentak, bersama semula, paling awal, terkecil yang boleh dibahagi', 'GSTK']], c)
    + BUL(['FSTB ≤ nombor terkecil dalam set.', 'GSTK ≥ nombor terbesar dalam set.'], c), venn2(12, 18))

finish(SUB, OUT, {'2.1': 7, '2.2': 6})
