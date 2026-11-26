"""Bab 3 T2 Rumus Algebra: nota ikut buku teks (ayat buku, nombor ditukar)."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'helpers.py')).read())
SUBS = [{"no": "3.1.1", "name": "Menulis Rumus", "col": "#38BDF8"}, {"no": "3.1.2", "name": "Perkara Rumus", "col": "#A78BFA"}, {"no": "3.1.3", "name": "Menyelesaikan Masalah", "col": "#34D399"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()


def E(s):
    s = s.replace('^2', '²').replace('*', ' × ').replace(' - ', ' − ').replace('(-', '(−').replace('= -', '= −')
    s = re.sub(r'^-', '−', s)
    return re.sub(r'([a-z]+)', r'<i>\1</i>', s)


def F(a, b):
    return f'<span class="fr"><span>{E(a)}</span><span>{E(b)}</span></span>'


def sq(x):
    return f'√<span style="display:inline-block;border-top:2px solid currentColor;padding:2px 3px 0;line-height:1.15">{x}</span>'


def pen(sub, items, label=True):
    return (p('<b>Penyelesaian:</b>') if label else '') + steps(sub, items)


def four(sub, a, b, c, d):
    return steps(sub, [f'<b>Memahami masalah:</b> {a}', f'<b>Merancang strategi:</b> {b}', f'<b>Melaksanakan strategi:</b> {c}', f'<b>Membuat kesimpulan:</b> {d}'])


def work(blocks, sub, cols=1):
    c = COL[sub]
    out = []
    for lb, lines in blocks:
        inner = ''.join(f'<div class="rv">{ln}</div>' for ln in lines)
        out.append(f'<div>{f"<b style=\"color:{c}\">{lb}</b> " if lb else ""}{inner}</div>')
    return ('<div style="width:100%;align-self:flex-start;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:18px 22px;'
            + ('display:grid;grid-template-columns:1fr 1fr;gap:12px 18px;' if cols == 2 else 'display:flex;flex-direction:column;gap:10px;') + 'font-size:19px;line-height:1.45">' + ''.join(out) + '</div>')


# =====================================================================
# 3.1.1 MEMBENTUK RUMUS
# =====================================================================
s = '3.1.1'
S(s, 'DEFINISI', 'Rumus algebra',
  de(s, '<b>Ungkapan algebra</b> ialah gabungan dua atau lebih sebutan algebra menggunakan operasi tambah, tolak, darab atau bahagi. <b>Rumus algebra</b> ialah ungkapan algebra yang ditulis dalam bentuk persamaan.')
  + bul(s, ['<b>Pemboleh ubah</b> ialah kuantiti yang nilainya belum dikenal pasti atau boleh berubah.', '<b>Pemalar</b> ialah kuantiti yang nilainya tetap.',
            'Rumus algebra ialah persamaan yang menghubungkan beberapa pemboleh ubah.']),
  work([('Contoh', [f'Perimeter segi tiga sama kaki: {E("P = a + 2b")}', f'{E("P")}, {E("a")} dan {E("b")} ialah pemboleh ubah.', '2 ialah pemalar.'])], s))

th = 'padding: 10px 12px; text-align: left; font-size: 19px; border-bottom: 2px solid #22304A; color: #94A3B8'
td = 'padding: 10px 12px; font-size: 20px; font-weight: 600; border-bottom: 1px solid #22304A'
rows = [('Sumazau', 'a', '3c', '2a'), ('Kuda Kepang', '2b', 'b', '4b'), ('Singa', '2c', '2a', 'c')]
tab = (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: #131C2E"><thead><tr><th style="{th}">Jenis tarian</th><th style="{th}">Melayu</th><th style="{th}">Cina</th><th style="{th}">India</th></tr></thead><tbody>'
       + ''.join(f'<tr><td style="{td}">{a}</td><td style="{td}">{E(b)}</td><td style="{td}">{E(c)}</td><td style="{td}">{E(d)}</td></tr>' for a, b, c, d in rows) + '</tbody></table></div>')
S(s, 'KONSEP', 'Membentuk rumus',
  p('Sebuah kelab kebudayaan akan membuat persembahan pada malam kebudayaan peringkat sekolah. Jadual menunjukkan bilangan penari mengikut jenis tarian dan bangsa yang diwakili oleh satu abjad. Terbitkan rumus untuk setiap perkara rumus yang berikut.')
  + bul(s, [f'(a) {E("s")}, bilangan penari berbangsa Cina.', f'(b) {E("d")}, bilangan penari tarian Kuda Kepang.', f'(c) {E("w")}, bilangan penari India dan Melayu.'])
  + note(f'{E("s")}, {E("d")} dan {E("w")} ialah perkara rumus dan boleh ditulis di sebelah kiri atau kanan.', 'Tip:'),
  '<div style="width:100%;display:flex;flex-direction:column;gap:12px">' + tab
  + work([('', [f'Rumus yang diterbitkan {E("s = 3c + b + 2a")}', E('d = 2b + b + 4b = 7b'), E('w = 3a + 6b + 3c'), 'Rumus dibentuk dengan menghubungkan beberapa pemboleh ubah.'])], s) + '</div>')

S(s, 'CONTOH 1', 'Menerbitkan rumus daripada situasi',
  p(f'Suzi menjual dua jenis kek pada harga yang berlainan. Kek coklat dijual pada harga RM4 sepotong manakala kek keju dijual pada harga dua kali ganda harga kek coklat. Sempena pembukaan cawangan baru, dia memberikan diskaun 20% untuk semua harga kek. Terbitkan rumus pengiraan harga jualan kek, jika {E("m")} potong kek coklat dan {E("n")} potong kek keju berjaya dijual.')
  + note(f'Pemboleh ubah dalam sesuatu rumus boleh diwakili dengan huruf {E("a")} hingga {E("z")}. {E("z")} dalam rumus di sebelah dikenali sebagai perkara rumus.', 'Tip:'),
  work([('', ['Harga kek keju = 2 kali ganda kek coklat = 2 × RM4 = RM8', f'Harga jualan, {E("z")} = [(bilangan kek coklat × harga) + (bilangan kek keju × harga)] × diskaun',
               f'= [({E("m")} × RM4) + ({E("n")} × RM8)] × (100% − 20%)', f'= (RM4{E("m")} + RM8{E("n")}) × 80%', E('= (4m + 8n) × 0.8'),
               f'dengan {E("z")} = harga jualan, {E("m")} = bilangan kek coklat, {E("n")} = bilangan kek keju', f'Rumus algebra: {E("z = 0.8(4m + 8n) = 3.2m + 6.4n")}'])], s))

# =====================================================================
# 3.1.2 MENUKAR PERKARA RUMUS
# =====================================================================
s = '3.1.2'
k = [P([(250, 60), (360, 370), (140, 370)], PU), '<text x="250" y="405" fill="#E6EDF7" font-family="Inter, sans-serif" font-size="22" font-weight="700" font-style="italic" text-anchor="middle">a</text>',
     '<text x="172" y="215" fill="#E6EDF7" font-family="Inter, sans-serif" font-size="22" font-weight="700" font-style="italic" text-anchor="middle">b</text>',
     '<text x="328" y="215" fill="#E6EDF7" font-family="Inter, sans-serif" font-size="22" font-weight="700" font-style="italic" text-anchor="middle">b</text>']
S(s, 'KONSEP', 'Menukar perkara rumus',
  de(s, 'Pemboleh ubah boleh diungkapkan menjadi perkara rumus suatu rumus algebra. Begitu juga perkara rumus boleh menjadi pemboleh ubah rumus algebra tersebut.')
  + p(f'Perimeter, {E("P")} bagi sebuah segi tiga sama kaki boleh diungkapkan dalam sebutan {E("a")} dan {E("b")} sebagai {E("P = a + 2b")}. Perkara rumus bagi persamaan di atas boleh ditukar seperti berikut.')
  + steps(s, [f'(i) {E("a = P − 2b")}', f'(ii) {E("b")} = {F("P − a", "2")}']),
  box(''.join(k + [T(250, 435, 'Tip: Pekali bagi perkara rumus mesti bernilai 1.', AM, 15), T(250, 457, 'Perkara rumus sebaik-baiknya ditulis di sebelah kiri.', AM, 15)]), 'Segi tiga sama kaki dengan tapak a dan dua sisi b'))

S(s, 'DEFINISI', 'Perkara rumus',
  de(s, '<b>Perkara rumus</b> ialah pemboleh ubah bersandar yang diungkapkan dalam sebutan pemboleh ubah tak bersandar bagi suatu rumus. Perkara rumus sentiasa mempunyai pekali 1.')
  + p('Penentuan perkara rumus melibatkan')
  + bul(s, ['(a) satu daripada operasi asas matematik.', '(b) kuasa atau punca kuasa.', '(c) gabungan operasi asas dan kuasa atau punca kuasa.'])
  + note('Anda telah belajar menyelesaikan persamaan linear dengan tiga kaedah berikut: (a) Kaedah cuba jaya (b) Aplikasi konsep kesamaan (c) Kaedah pematahbalikan.', 'Imbas kembali:'), '')

S(s, 'CONTOH 2', 'Mengungkapkan m sebagai perkara rumus',
  p(f'Ungkapkan {E("m")} sebagai perkara rumus.')
  + bul(s, [f'(a) {E("k = m + r")}', f'(b) {E("c = 3s − m")}', f'(c) {E("a")} = {F("7", "3m")}', f'(d) {E("t")} = {F("m − n", "−4")}']),
  work([('(a)', [E('m + r = k'), E('m + r − r = k − r'), f'Maka, {E("m = k − r")}']),
        ('(b)', [E('3s − m = c'), E('3s − 3s − m = c − 3s'), E('−m = c − 3s'), f'Maka, {E("m = 3s − c")}']),
        ('(c)', [f'{E("a × 3m")} = {F("7", "3m")} × {E("3m")}', E('3am = 7'), f'Maka, {E("m")} = {F("7", "3a")}']),
        ('(d)', [f'{F("m − n", "−4")} × (−4) = {E("t")} × (−4)', E('m − n = −4t'), f'Maka, {E("m = n − 4t")}'])], s, 2))

S(s, 'CONTOH 3', 'Perkara rumus melibatkan kuasa dan punca kuasa',
  p(f'Ungkapkan {E("p")} sebagai perkara rumus.')
  + bul(s, [f'(a) {E("k")} = {sq(E("p"))}', f'(b) {E("r = p^2")}', f'(c) {E("w")} = {sq(F("p", "5"))}', f'(d) {E("t")} = {F("1", "p^2")}'])
  + note(f'({sq(E("a"))})² = {E("a")}, {sq(E("a²"))} = {E("a")}. Kedua-dua belah persamaan dikuasaduakan atau dipuncakuasaduakan.', 'Tip:'),
  work([('(a)', [f'{sq(E("p"))} = {E("k")}', f'({sq(E("p"))})² = ({E("k")})²', E('p = k^2')]), ('(b)', [E('p^2 = r'), f'{sq(E("p²"))} = {sq(E("r"))}', f'{E("p")} = {sq(E("r"))}']),
        ('(c)', [f'({sq(F("p", "5"))})² = {E("w^2")}', f'{F("p", "5")} = {E("w^2")}', E('p = 5w^2')]), ('(d)', [E('tp^2 = 1'), f'{E("p^2")} = {F("1", "t")}', f'{E("p")} = {sq(F("1", "t"))}'])], s, 2))

# =====================================================================
# 3.1.3 MENENTUKAN NILAI PEMBOLEH UBAH DAN PENYELESAIAN MASALAH
# =====================================================================
s = '3.1.3'
S(s, 'CONTOH 4', 'Menentukan nilai pemboleh ubah',
  de(s, 'Nilai bagi suatu perkara rumus boleh diperoleh apabila semua nilai pemboleh ubah diberikan. Sebaliknya, nilai suatu pemboleh ubah boleh diperoleh apabila nilai perkara rumus dan pemboleh ubah lain diberikan.')
  + p(f'Diberi {E("w = 6t − 4u")}, hitung nilai berikut (a) nilai {E("w")} apabila {E("t")} = 5 dan {E("u")} = −3 (b) nilai {E("t")} apabila {E("w")} = 18 dan {E("u")} = 3'),
  work([('(a)', [f'Gantikan {E("t")} = 5 dan {E("u")} = −3 ke dalam rumus.', E('w = 6(5) − 4(−3)'), '= 30 + 12', '= 42']),
        ('(b)', [f'Gantikan {E("w")} = 18 dan {E("u")} = 3 ke dalam rumus.', E('6t − 4(3) = 18'), E('6t = 18 + 12'), f'{E("t")} = {F("30", "6")}', E('t = 5')])], s))

S(s, 'CONTOH 5', 'Nilai pemboleh ubah melibatkan kuasa dua',
  p(f'Diberi {E("m")} = {F("1", "4")}{E("(p − q)^2")}, hitung nilai {E("q")} jika diberi {E("m")} = 9 dan {E("p")} = 2.')
  + note(f'Kaedah alternatif: Gantikan {E("m")} = 9 dan {E("p")} = 2 terus ke dalam rumus: 9 = {F("1", "4")}(2 − {E("q")})², 36 = (2 − {E("q")})², 6 = 2 − {E("q")}, {E("q")} = −4', 'Tip:'),
  work([('', [f'{E("m")} × 4 = {F("1", "4")}{E("(p − q)^2")} × 4', E('4m = (p − q)^2'), f'{sq(E("4m"))} = {sq(E("(p − q)²"))}', f'{E("p − q")} = {sq(E("4m"))}', f'−{E("q")} = {sq(E("4m"))} − {E("p")}',
               f'{E("q")} = {E("p")} − {sq(E("4m"))}', f'{E("q")} = 2 − {sq("4(9)")}  (Gantikan {E("m")} = 9 dan {E("p")} = 2)', E('q = 2 − 6'), E('q = −4')])], s))

S(s, 'CONTOH 6', 'Penyelesaian masalah',
  p('Harga seketul ayam goreng di kantin sekolah ialah tiga kali ganda harga sebungkus roti. Dengan wang sebanyak RM10, Azman membeli dua bungkus roti dan seketul ayam. Baki perbelanjaan tersebut ialah RM5 dan disimpan. Jika Azman membawa RM20, berapa ketulkah ayam goreng yang dapat dibeli dengan jumlah bilangan roti yang sama?')
  + note('Penyelesaian ikut empat langkah: Memahami masalah, Merancang strategi, Melaksanakan strategi dan Membuat kesimpulan.', 'Ingat:'),
  work([('Memahami masalah', ['Bilangan ayam goreng yang dapat dibeli oleh Azman dengan wang sebanyak RM20.']),
        ('Merancang strategi', [f'Wakilkan harga roti dan ayam dengan huruf {E("x")}. Harga roti = RM{E("x")}, Harga ayam = RM3{E("x")}', f'2(RM{E("x")}) + RM3{E("x")} + RM5 = RM10, {E("5x + 5 = 10")}, {E("x")} = {F("10 − 5", "5")} = 1',
                                'Maka, harga sebungkus roti ialah RM1 dan harga seketul ayam ialah RM3.']),
        ('Melaksanakan strategi', [f'Wakilkan bilangan ayam goreng dengan huruf {E("y")}.', f'(RM1 × 2) + (RM3 × {E("y")}) = RM20, {E("2 + 3y = 20")}, {E("y")} = {F("20 − 2", "3")} = 6']),
        ('Membuat kesimpulan', ['Azman dapat membeli 6 ketul ayam goreng.'])], s))

OUTFILE = os.path.join(HERE, '..', '..', 'rumus', 'slides.js')
HEAD = '/* Nota Bab 3 ikut buku teks Matematik T2 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
