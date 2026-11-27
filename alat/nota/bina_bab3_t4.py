"""Bab 3 T4 Penaakulan Logik: nota ikut buku teks (ayat buku, nombor dan nama ditukar).
Subtopik folder logik dikekalkan (digabung kepada 3.1 dan 3.2 dalam bab.js). Pemetaan ke standard pembelajaran buku:
3.1.1 → SP 3.1.1–3.1.2, 3.1.3 → SP 3.1.3, 3.1.4 → SP 3.1.4–3.1.6, 3.2.1 → SP 3.2.1–3.2.3, 3.2.4 → SP 3.2.4–3.2.6."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX, RD

SUBS = [{"no": "3.1.1", "name": "Pernyataan & Penafian", "col": "#38BDF8"}, {"no": "3.1.3", "name": "Pernyataan Majmuk", "col": "#FB923C"},
        {"no": "3.1.4", "name": "Implikasi", "col": "#A78BFA"}, {"no": "3.2.1", "name": "Hujah Deduktif", "col": "#34D399"},
        {"no": "3.2.4", "name": "Hujah Induktif", "col": "#F472B6"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr
B, P_ = f'<b style="color:{GR}">Benar</b>', f'<b style="color:{RD}">Palsu</b>'


def i(s):
    return f'<i>{s}</i>'


def tv(v):
    return B if v else P_


def arg(lines, c, fs=19):
    """hujah: [(label, ayat), ...]"""
    rows = ''.join(f'<div class="rv" style="display:grid;grid-template-columns:120px 1fr;gap:8px"><b style="color:{c}">{a}</b><span>{b}</span></div>' for a, b in lines)
    return f'<div style="width:100%;background:#131C2E;border:1px solid #22304A;border-radius:18px;padding:12px 18px;display:flex;flex-direction:column;gap:6px;font-size:{fs}px;line-height:1.45">{rows}</div>'


def four2(sub, a, b, c, d):
    return work([('Memahami masalah', a), ('Merancang strategi', b), ('Melaksanakan strategi', c), ('Membuat kesimpulan', d)], sub, 1, 18)


# =====================================================================
# 3.1.1 PERNYATAAN DAN PENAFIAN (SP 3.1.1, 3.1.2)
# =====================================================================
s = '3.1.1'
c = COL[s]
S(s, 'DEFINISI', 'Pernyataan',
  p('Kebanyakan hasil matematik sering melibatkan pernyataan.')
  + de(s, 'Pernyataan ialah suatu ayat yang dapat ditentukan nilai kebenarannya, iaitu sama ada benar atau palsu, tetapi bukan kedua-duanya.')
  + bul(s, ['Ayat tanya, ayat seruan dan ayat perintah bukan pernyataan. Ayat-ayat ini tidak dapat ditentukan kebenarannya.',
            'Pernyataan boleh dibahagikan kepada pernyataan benar dan pernyataan palsu.']),
  stack(work([('Cikgu:', ['Murid-murid, berapakah bucu bagi sebuah kuboid?']), ('Amir:', ['Sebuah kuboid mempunyai 8 bucu.']), ('Lina:', ['Sebuah kuboid mempunyai 12 bucu.'])], s, 1, 19),
        p(f'Kedua-dua jawapan ialah pernyataan. Pernyataan "sebuah kuboid mempunyai 8 bucu" ialah pernyataan {B} manakala pernyataan "sebuah kuboid mempunyai 12 bucu" ialah pernyataan {P_}.')))

S(s, 'CONTOH 1', 'Pernyataan atau bukan pernyataan',
  p('Tentukan sama ada ayat-ayat di bawah ialah pernyataan atau bukan pernyataan. Berikan justifikasi anda.')
  + bul(s, ['(a) Sila tutup pintu itu.', '(b) Gunung Kinabalu ialah gunung yang paling tinggi di Malaysia.', '(c) Berapakah umur anda?', f'(d) 2{i("x")} − 1 = 7.', '(e) −3 < −9.'])
  + note('Gunung Kinabalu di Sabah setinggi 4 095 meter ialah gunung tertinggi di Malaysia.', 'Malaysiaku:'),
  work([('', ['(a) Bukan pernyataan kerana ayat itu tidak dapat ditentukan nilai kebenarannya.', '(b) Pernyataan kerana ayat itu benar.',
              '(c) Bukan pernyataan kerana ayat itu tidak dapat ditentukan nilai kebenarannya.', '(d) Bukan pernyataan kerana ayat itu tidak dapat ditentukan nilai kebenarannya.',
              '(e) Pernyataan kerana ayat itu palsu.'])], s, 1, 19))

assert (3 - 1) ** 2 == 4 and 3 ** 2 - 1 ** 2 == 8 and 5 + 4 * 3 > 3 + 4 * 2
S(s, 'CONTOH 2', 'Nilai kebenaran pernyataan matematik',
  p('Bukan semua pernyataan matematik benar. Nilai kebenaran bagi semua pernyataan matematik boleh ditentukan.')
  + p('Tentukan sama ada pernyataan berikut benar atau palsu. Sekiranya palsu, buktikan.')
  + bul(s, [f'(a) ({i("x")} − {i("y")})² = {i("x")}² − {i("y")}², {i("x")} ≠ 0, {i("y")} ≠ 0', f'(b) ({i("x")} − 4)² < 0, {i("x")} ∈ R', '(c) 5 + 4(3) > 3 + 4(2)',
            '(d) 3 ∈ {Faktor bagi 12}', '(e) {1, 3, 5} ∪ {Nombor ganjil} = {1, 3, 5}'])
  + note(f'{i("x")} ∈ R bermaksud {i("x")} unsur kepada nombor nyata.', 'Info:'),
  work([('', [f'(a) Palsu. Andaikan {i("x")} = 3 dan {i("y")} = 1, (3 − 1)² = 4 tetapi 3² − 1² = 8. Maka ({i("x")} − {i("y")})² ≠ {i("x")}² − {i("y")}².',
              '(b) Palsu. (5 − 4)² = 1 > 0', '(c) Benar', '(d) Benar', '(e) Palsu. {1, 3, 5} ∪ {1, 3, 5, 7, 9, …} = {Nombor ganjil}'])], s, 1, 19))

S(s, 'CONTOH 3', 'Pernyataan dengan "semua" dan "sebilangan"',
  p('Tentukan sama ada pernyataan matematik di bawah benar atau palsu. Sekiranya palsu, buktikan.')
  + bul(s, ['(a) Semua sisi empat mempunyai sudut tegak.', '(b) Sebilangan gandaan 4 ialah nombor genap.', '(c) Semua gandaan 6 ialah gandaan 3.', '(d) Sebilangan segi tiga ialah segi tiga sama sisi.']),
  work([('', ['(a) Palsu. Trapezium tidak semestinya mempunyai sudut tegak.', '(b) Palsu. Semua gandaan 4 ialah nombor genap.', '(c) Benar', '(d) Benar'])], s, 1, 20))

S(s, 'CONTOH 4', 'Menafikan suatu pernyataan',
  p('Kita menggunakan perkataan "tidak" atau "bukan" untuk menafikan suatu pernyataan.')
  + de(s, f'Penafian pernyataan {i("p")} ditulis sebagai ~{i("p")}. Nilai kebenaran bertukar daripada benar kepada palsu atau sebaliknya melalui proses penafian.')
  + note(f'~{i("p")} disebut sebagai "tilda {i("p")}".', 'Info:')
  + p(f'<b>CONTOH 4</b> Bentuk satu penafian (~{i("p")}) bagi setiap pernyataan ({i("p")}) berikut dengan menggunakan perkataan "tidak" atau "bukan". Kemudian, tentukan nilai kebenaran penafian tersebut. Rujuk jadual di sebelah.'),
  table([i('p'), 'Nilai', f'~{i("p")}', 'Nilai'],
        [['15 ialah gandaan 4.', P_, '15 bukan gandaan 4.', B], ['37 ialah nombor perdana.', B, '37 bukan nombor perdana.', P_],
         ['Semua gandaan 4 ialah gandaan 8.', P_, 'Bukan semua gandaan 4 ialah gandaan 8.', B], ['0.5 kg bersamaan dengan 500 g.', B, '0.5 kg tidak bersamaan dengan 500 g.', P_]], c, 17, False, rvrows=(0, 1, 2, 3)))

# =====================================================================
# 3.1.3 PERNYATAAN MAJMUK (SP 3.1.3)
# =====================================================================
s = '3.1.3'
c = COL[s]
S(s, 'CONTOH 5', 'Pernyataan majmuk',
  de(s, 'Pernyataan majmuk ialah gabungan dua atau lebih pernyataan dengan menggunakan perkataan "dan" atau "atau".')
  + p(f'<b>CONTOH 5</b> Gabungkan pernyataan {i("p")} dan {i("q")} berikut dengan perkataan (i) dan, (ii) atau.')
  + bul(s, [f'(a) {i("p")} : Heksagon mempunyai sembilan pepenjuru. &nbsp; {i("q")} : Oktagon mempunyai 20 pepenjuru.',
            f'(b) {i("p")} : Kon mempunyai satu bucu. &nbsp; {i("q")} : Kon mempunyai satu permukaan rata.', f'(c) {i("p")} : −7 ialah integer. &nbsp; {i("q")} : 3 ialah integer.']),
  work([('(a)', ['(i) Heksagon mempunyai sembilan pepenjuru dan oktagon mempunyai 20 pepenjuru.', '(ii) Heksagon mempunyai sembilan pepenjuru atau oktagon mempunyai 20 pepenjuru.']),
        ('(b)', ['(i) Kon mempunyai satu bucu dan satu permukaan rata.', '(ii) Kon mempunyai satu bucu atau satu permukaan rata.']),
        ('(c)', ['(i) −7 dan 3 ialah integer.', '(ii) −7 atau 3 ialah integer.'])], s, 1, 19))

S(s, 'CONTOH 6', 'Menentukan dua pernyataan daripada ayat majmuk',
  p(f'Tentukan dua pernyataan {i("p")} dan {i("q")} daripada ayat majmuk di bawah.')
  + bul(s, ['(a) 7 + 2 > 7 dan 7 − 2 < 7.', '(b) 15 dan 51 ialah nombor perdana.', '(c) 3² = 9 atau 3³ = 27.', '(d) −8 < 6 atau 8 < 6.'])
  + note('Perkataan "dan" dalam pernyataan matematik membawa maksud kedua-dua, manakala perkataan "atau" membawa maksud salah satu atau kedua-dua.', 'Ingat:'),
  work([('(a)', [f'{i("p")} : 7 + 2 > 7. &nbsp; {i("q")} : 7 − 2 < 7.']), ('(b)', [f'{i("p")} : 15 ialah nombor perdana. &nbsp; {i("q")} : 51 ialah nombor perdana.']),
        ('(c)', [f'{i("p")} : 3² = 9. &nbsp; {i("q")} : 3³ = 27.']), ('(d)', [f'{i("p")} : −8 < 6. &nbsp; {i("q")} : 8 < 6.'])], s, 1, 20))

S(s, 'KONSEP', 'Nilai kebenaran pernyataan majmuk',
  p(f'Tiga pernyataan dibentuk: {i("p")} : Aiman sedang berlari. {i("q")} : Mei Ling sedang berlari. {i("r")} : Kavitha sedang berlari. Aiman dan Mei Ling sedang berlari, tetapi Kavitha tidak.')
  + bul(s, [f'"{i("p")} dan {i("q")}" : Aiman dan Mei Ling sedang berlari. Benar kerana kedua-dua Aiman dan Mei Ling sedang berlari.',
            f'"{i("p")} dan {i("r")}" : Aiman dan Kavitha sedang berlari. Palsu kerana bukan kedua-dua Aiman dan Kavitha sedang berlari.',
            f'"{i("q")} atau {i("r")}" : Mei Ling atau Kavitha sedang berlari. Benar kerana sebahagian daripada pernyataan itu benar.']),
  stack(p('Maka, nilai kebenaran pernyataan majmuk boleh disimpulkan seperti yang ditunjukkan dalam jadual kebenaran berikut.'),
        table([i('p'), i('q'), f'{i("p")} dan {i("q")}', f'{i("p")} atau {i("q")}'], [[B, B, B, B], [B, P_, P_, B], [P_, B, P_, B], [P_, P_, P_, P_]], c, 20, rvrows=(0, 1, 2, 3))))

c7 = [('(a)', '3 lebih besar daripada 5.', '−4 lebih besar daripada 5.', '3 dan −4 lebih besar daripada 5.', 0, 0, 'dan'),
      ('(b)', f'{i("x")} + 2 < {i("x")} − 3.', '77 ialah nombor ganjil.', f'{i("x")} + 2 < {i("x")} − 3 dan 77 ialah nombor ganjil.', 0, 1, 'dan'),
      ('(c)', '64 ialah nombor kuasa dua sempurna.', '4 ialah faktor bagi 24.', '64 ialah nombor kuasa dua sempurna dan 4 ialah faktor bagi 24.', 1, 1, 'dan'),
      ('(d)', f'{i("y")} = 2{i("x")} selari dengan {i("y")} − 2{i("x")} = 3.', f'Pintasan-{i("y")} bagi garis lurus {i("y")} − 2{i("x")} = 3 ialah 2.', '—', 1, 0, 'dan'),
      ('(e)', '3 + 4 = 34.', '3 × 4 = 34.', '3 + 4 = 34 atau 3 × 4 = 34.', 0, 0, 'atau'),
      ('(f)', '2 × 2 × 2 = 2³.', f'{sq(16)} = 8.', f'2 × 2 × 2 = 2³ atau {sq(16)} = 8.', 1, 0, 'atau'),
      ('(g)', 'Hasil tambah sudut pedalaman segi tiga ialah 540°.', 'Hasil tambah sudut pedalaman pentagon ialah 540°.', 'Hasil tambah sudut pedalaman segi tiga atau pentagon ialah 540°.', 0, 1, 'atau'),
      ('(h)', '5 − (−3) = 8.', '5 + 3 = 8.', '5 − (−3) = 8 atau 5 + 3 = 8.', 1, 1, 'atau')]
assert 5 - (-3) == 8 and 64 == 8 ** 2 and 24 % 4 == 0 and (5 - 2) * 180 == 540


def c7rows(rows):
    out = []
    for lb, a, b, _, va, vb, op in rows:
        r = (va and vb) if op == 'dan' else (va or vb)
        out.append([lb, f'{i("p")} : {a}<br>{i("q")} : {b}', f'{tv(va)}<br>{tv(vb)}', f'{i("p")} {op} {i("q")} : {tv(r)}'])
    return out


S(s, 'CONTOH 7', 'Menentukan nilai kebenaran pernyataan majmuk',
  p('Tentukan nilai kebenaran pernyataan majmuk yang berikut.')
  + bul(s, [f'{x[0]} {x[3]}' if x[0] != '(d)' else f'(d) {i("y")} = 2{i("x")} selari dengan {i("y")} − 2{i("x")} = 3 dan pintasan-{i("y")} bagi garis lurus {i("y")} − 2{i("x")} = 3 ialah 2.' for x in c7[:4]]),
  table(['', 'Pernyataan', 'Kebenaran', ''], c7rows(c7[:4]), c, 16, False, rvrows=(0, 1, 2, 3)))

S(s, 'CONTOH 7', 'Menentukan nilai kebenaran pernyataan majmuk (sambungan)',
  bul(s, [f'{x[0]} {x[3]}' for x in c7[4:]])
  + note(f'Pernyataan majmuk "{i("p")} atau {i("q")}" palsu hanya apabila kedua-dua {i("p")} dan {i("q")} palsu.', 'Ingat:'),
  table(['', 'Pernyataan', 'Kebenaran', ''], c7rows(c7[4:]), c, 16, False, rvrows=(0, 1, 2, 3)))

# =====================================================================
# 3.1.4 IMPLIKASI (SP 3.1.4 – 3.1.6)
# =====================================================================
s = '3.1.4'
c = COL[s]
S(s, 'CONTOH 8', 'Implikasi "jika p, maka q"',
  p('Cikgu, bolehkah saya bermain bola di padang? "Jika kamu dapat menyiapkan semua soalan, maka kamu boleh bermain di padang."')
  + de(s, f'Pernyataan "jika {i("p")}, maka {i("q")}" dikenali sebagai implikasi dengan keadaan {i("p")} dikenali sebagai <b>antejadian</b> dan {i("q")} dikenali sebagai <b>akibat</b>.')
  + p(f'<b>CONTOH 8</b> Bentuk implikasi "jika {i("p")}, maka {i("q")}" dengan antejadian dan akibat berikut.')
  + bul(s, [f'(a) Antejadian : {i("m")} boleh dibahagi tepat dengan 3. Akibat : {i("m")} ialah gandaan 3.', f'(b) Antejadian : Set {i("A")} subset kepada set {i("B")}. Akibat : {i("n")}({i("A")}) ≤ {i("n")}({i("B")}).']),
  stack(work([('Penyelesaian 8', [f'(a) Jika {i("m")} boleh dibahagi tepat dengan 3, maka {i("m")} ialah gandaan 3.', f'(b) Jika set {i("A")} subset kepada set {i("B")}, maka {i("n")}({i("A")}) ≤ {i("n")}({i("B")}).'])], s, 1, 19),
        work([('CONTOH 9', [f'Tentukan antejadian dan akibat daripada implikasi berikut. (a) Jika {i("x")} ialah faktor bagi 12, maka {i("x")} ialah faktor bagi 36. (b) Jika {i("a")} − {i("b")} < 0, maka {i("a")} < {i("b")}.']),
              ('(a)', [f'Antejadian : {i("x")} ialah faktor bagi 12.', f'Akibat : {i("x")} ialah faktor bagi 36.']),
              ('(b)', [f'Antejadian : {i("a")} − {i("b")} < 0.', f'Akibat : {i("a")} < {i("b")}.'])], s, 1, 19)))

S(s, 'CONTOH 10', 'Implikasi "p jika dan hanya jika q"',
  p(f'Selain implikasi "jika {i("p")}, maka {i("q")}", implikasi "{i("p")} jika dan hanya jika {i("q")}" juga kerap digunakan dalam penaakulan logik.')
  + de(s, f'Implikasi "{i("p")} jika dan hanya jika {i("q")}" terdiri daripada dua implikasi yang berikut: jika {i("p")}, maka {i("q")}; jika {i("q")}, maka {i("p")}.')
  + p(f'<b>CONTOH 10</b> Bentuk implikasi "{i("p")} jika dan hanya jika {i("q")}" bagi implikasi yang berikut.')
  + bul(s, [f'(a) Jika {i("k")} ialah nombor genap, maka {i("k")} boleh dibahagi tepat dengan 2. Jika {i("k")} boleh dibahagi tepat dengan 2, maka {i("k")} ialah nombor genap.',
            f'(b) Jika garis lurus {i("y")} = {i("m")}{i("x")} + {i("c")} selari dengan paksi-{i("x")}, maka {i("m")} = 0. Jika {i("m")} = 0, maka garis lurus {i("y")} = {i("m")}{i("x")} + {i("c")} selari dengan paksi-{i("x")}.']),
  stack(work([('Penyelesaian 10', [f'(a) {i("k")} ialah nombor genap jika dan hanya jika {i("k")} boleh dibahagi tepat dengan 2.', f'(b) Garis lurus {i("y")} = {i("m")}{i("x")} + {i("c")} selari dengan paksi-{i("x")} jika dan hanya jika {i("m")} = 0.'])], s, 1, 18),
        work([('CONTOH 11', [f'Tulis dua implikasi berdasarkan implikasi berikut. (a) {sq(i("r"))} = 12 jika dan hanya jika {i("r")} = 144. (b) {i("x")} < 4 jika dan hanya jika {i("x")} + 7 < 11.']),
              ('(a)', [f'Implikasi 1: Jika {sq(i("r"))} = 12, maka {i("r")} = 144.', f'Implikasi 2: Jika {i("r")} = 144, maka {sq(i("r"))} = 12.']),
              ('(b)', [f'Implikasi 1: Jika {i("x")} < 4, maka {i("x")} + 7 < 11.', f'Implikasi 2: Jika {i("x")} + 7 < 11, maka {i("x")} < 4.'])], s, 1, 18)))

S(s, 'KONSEP', 'Akas, songsangan dan kontrapositif',
  p('Perhatikan perbezaan antara empat jenis pernyataan dengan contoh berikut.')
  + table(['', 'Contoh'], [['Pernyataan', 'Jika Siti seorang pengawas, maka Siti seorang yang berdisiplin.'], ['Akas', 'Jika Siti seorang yang berdisiplin, maka Siti seorang pengawas.'],
                          ['Songsangan', 'Jika Siti bukan seorang pengawas, maka Siti seorang yang tidak berdisiplin.'], ['Kontrapositif', 'Jika Siti seorang yang tidak berdisiplin, maka Siti bukan seorang pengawas.']], c, 17, False, rvrows=(1, 2, 3)),
  stack(p('Secara generalisasi,'),
        table(['', 'Bentuk'], [['Pernyataan', f'Jika {i("p")}, maka {i("q")}.'], ['Akas', f'Jika {i("q")}, maka {i("p")}.'], ['Songsangan', f'Jika ~{i("p")}, maka ~{i("q")}.'], ['Kontrapositif', f'Jika ~{i("q")}, maka ~{i("p")}.']], c, 21),
        note(f'~{i("p")} merupakan pelengkap bagi {i("p")}. Maka, pelengkap bagi {i("a")}² − {i("b")}² < 0 ialah {i("a")}² − {i("b")}² ≥ 0.', 'Tip:')))

S(s, 'CONTOH 12', 'Menulis akas, songsangan dan kontrapositif',
  p('Tulis akas, songsangan dan kontrapositif bagi implikasi yang diberikan berikut.')
  + bul(s, [f'(a) Jika {i("x")} ialah nombor negatif, maka {i("x")} lebih kecil daripada 0.', f'(b) Jika {i("a")}² − {i("b")}² < 0, maka ({i("a")} + {i("b")})({i("a")} − {i("b")}) < 0.', f'(c) Jika {i("x")} = 4, maka {i("x")} + 3 = 7.']),
  work([('(a)', [f'Akas : Jika {i("x")} lebih kecil daripada 0, maka {i("x")} ialah nombor negatif.', f'Songsangan : Jika {i("x")} bukan nombor negatif, maka {i("x")} tidak lebih kecil daripada 0.',
                 f'Kontrapositif : Jika {i("x")} tidak lebih kecil daripada 0, maka {i("x")} bukan nombor negatif.']),
        ('(b)', [f'Akas : Jika ({i("a")} + {i("b")})({i("a")} − {i("b")}) < 0, maka {i("a")}² − {i("b")}² < 0.', f'Songsangan : Jika {i("a")}² − {i("b")}² ≥ 0, maka ({i("a")} + {i("b")})({i("a")} − {i("b")}) ≥ 0.',
                 f'Kontrapositif : Jika ({i("a")} + {i("b")})({i("a")} − {i("b")}) ≥ 0, maka {i("a")}² − {i("b")}² ≥ 0.']),
        ('(c)', [f'Akas : Jika {i("x")} + 3 = 7, maka {i("x")} = 4.', f'Songsangan : Jika {i("x")} ≠ 4, maka {i("x")} + 3 ≠ 7.', f'Kontrapositif : Jika {i("x")} + 3 ≠ 7, maka {i("x")} ≠ 4.'])], s, 1, 17))

assert 3 * 4 == 12 and 10 - 3 * 4 != 28
S(s, 'CONTOH 13', 'Membandingkan nilai kebenaran',
  bul(s, [f'Nilai kebenaran kontrapositif sama dengan nilai kebenaran implikasi "jika {i("p")}, maka {i("q")}".', 'Akas dan songsangan adalah kontrapositif kepada satu sama lain dan mempunyai nilai kebenaran yang sama.'])
  + table([i('p'), i('q'), 'Pernyataan', 'Akas', 'Songsangan', 'Kontrapositif'], [[B, B, B, B, B, B], [B, P_, P_, B, B, P_], [P_, B, B, P_, P_, B], [P_, P_, B, B, B, B]], c, 16)
  + de(s, f'Nilai kebenaran implikasi "jika {i("p")}, maka {i("q")}" adalah sentiasa benar kecuali apabila {i("p")} benar dan {i("q")} palsu berlaku pada masa yang serentak.'),
  stack(p(f'<b>CONTOH 13</b> Tentukan nilai kebenaran implikasi, akas, songsangan dan kontrapositif bagi implikasi "Jika 3 × 4 = 12, maka 10 − 3 × 4 = 28."'),
        table(['Pernyataan', 'Antejadian', 'Akibat', 'Nilai'],
              [['Implikasi: Jika 3 × 4 = 12, maka 10 − 3 × 4 = 28.', B, P_, P_], ['Akas: Jika 10 − 3 × 4 = 28, maka 3 × 4 = 12.', P_, B, B],
               ['Songsangan: Jika 3 × 4 ≠ 12, maka 10 − 3 × 4 ≠ 28.', P_, B, B], ['Kontrapositif: Jika 10 − 3 × 4 ≠ 28, maka 3 × 4 ≠ 12.', B, P_, P_]], c, 15, False, rvrows=(0, 1, 2, 3))))

S(s, 'CONTOH 14', 'Contoh penyangkal',
  de(s, 'Bagi setiap pernyataan palsu, sekurang-kurangnya satu contoh penyangkal boleh diberi untuk menafikan kebenaran pernyataan tersebut.')
  + p('Sebagai contoh, pernyataan "Semua poligon mempunyai dua atau lebih pepenjuru." adalah palsu kerana segi tiga tidak mempunyai pepenjuru. Segi tiga di sini merupakan contoh penyangkal.')
  + p('<b>CONTOH 14</b> Tentukan nilai kebenaran pernyataan matematik di sebelah. Sekiranya palsu, berikan satu contoh penyangkal untuk menyokong jawapan anda.'),
  stack(bul(s, ['(a) Semua poligon mempunyai hasil tambah sudut pedalaman 360°.', '(b) Sebilangan gandaan 5 ialah nombor ganjil.', '(c) 3 dan 9 ialah faktor bagi 21.', '(d) 8 atau 48 ialah gandaan 12.']),
  work([('', ['(a) Palsu kerana segi tiga mempunyai hasil tambah sudut pedalaman 180°.', '(b) Benar.', '(c) Palsu kerana 9 bukan faktor bagi 21.', '(d) Benar.'])], s, 1, 20)))

assert (-3) ** 2 > 4
S(s, 'CONTOH 15', 'Menulis pernyataan dan contoh penyangkal',
  p('Tulis pernyataan matematik yang dikehendaki dalam kurungan bagi setiap yang berikut. Kemudian, tentukan nilai kebenaran bagi pernyataan yang ditulis. Sekiranya palsu, berikan satu contoh penyangkal untuk menyokong jawapan anda.')
  + bul(s, ['(a) 5 ∈ {1, 3, 5}. (Penafian)', '(b) Semua gandaan 6 ialah gandaan 3. (Penafian)', f'(c) Jika {i("x")} > 7, maka {i("x")} > 2. (Akas)',
            f'(d) Jika {i("x")} ialah punca bagi {i("x")}³ − 8 = 0, maka {i("x")} = 2. (Songsangan)', f'(e) Jika {i("m")}² > 4, maka {i("m")} > 2. (Kontrapositif)']),
  work([('', ['(a) Penafian: 5 ∉ {1, 3, 5}. Palsu kerana 5 ialah unsur bagi {1, 3, 5}.', '(b) Penafian: Bukan semua gandaan 6 ialah gandaan 3. Palsu kerana semua gandaan 6 boleh dibahagi tepat dengan 3.',
              f'(c) Akas: Jika {i("x")} > 2, maka {i("x")} > 7. Palsu kerana 3 > 2 tetapi 3 < 7.', f'(d) Songsangan: Jika {i("x")} bukan punca bagi {i("x")}³ − 8 = 0, maka {i("x")} ≠ 2. Benar.',
              f'(e) Kontrapositif: Jika {i("m")} ≤ 2, maka {i("m")}² ≤ 4. Palsu kerana −3 ≤ 2 tetapi (−3)² = 9 > 4.'])], s, 1, 18))

# =====================================================================
# 3.2.1 HUJAH DEDUKTIF (SP 3.2.1 – 3.2.3)
# =====================================================================
s = '3.2.1'
c = COL[s]
S(s, 'DEFINISI', 'Hujah, premis dan kesimpulan',
  de(s, 'Proses membuat kesimpulan berdasarkan pernyataan dikenali sebagai penghujahan. Hujah boleh terdiri daripada beberapa premis dan satu kesimpulan.')
  + bul(s, ['<b>Premis</b> merupakan satu pernyataan yang memberikan informasi sebelum satu kesimpulan dibuat.', '<b>Kesimpulan</b> merupakan suatu kesudahan pendapat atau keputusan.',
            'Suatu hujah ringkas biasanya terdiri daripada sekurang-kurangnya dua premis dan satu kesimpulan.'])
  + note('Pernyataan khusus ialah pernyataan yang khas merujuk suatu kes tertentu, manakala pernyataan umum ialah pernyataan yang menerangkan sesuatu konsep secara menyeluruh.', 'Ingat:'),
  stack(table(['Pernyataan', 'Jenis'], [['Luas segi tiga <i>PQR</i> ialah 12 cm².', 'Khusus'], ['Semua prisma mempunyai keratan rentas seragam.', 'Umum'], ['18 boleh dibahagi tepat dengan 3.', 'Khusus'],
                                       ['Isi padu kubus = <i>x</i>³, dengan <i>x</i> ialah sisi kubus.', 'Umum'], ['Tinggi bagi silinder <i>K</i> ialah 50 cm.', 'Khusus']], c, 17, False, rvrows=(0, 1, 2, 3, 4))))

c16 = [('(a)', 'Semua sudut cakah lebih besar daripada 90°. Sudut <i>ABC</i> ialah sudut cakah. Maka, sudut <i>ABC</i> lebih besar daripada 90°.',
        'Semua sudut cakah lebih besar daripada 90°. (Umum)', 'Maka, sudut <i>ABC</i> lebih besar daripada 90°. (Khusus)', 'Hujah deduktif'),
       ('(b)', 'Semua ahli pasukan bola jaring ialah ahli Kelab Sukan. Mei Ling ialah ahli pasukan bola jaring. Maka, Mei Ling ialah ahli Kelab Sukan.',
        'Semua ahli pasukan bola jaring ialah ahli Kelab Sukan. (Umum)', 'Maka, Mei Ling ialah ahli Kelab Sukan. (Khusus)', 'Hujah deduktif'),
       ('(c)', '1 + 3 = 2². 1 + 3 + 5 = 3². 1 + 3 + 5 + 7 = 4². Maka, hasil tambah <i>n</i> nombor ganjil yang pertama ialah <i>n</i>².',
        '1 + 3 = 2². (Khusus)', 'Maka, hasil tambah <i>n</i> nombor ganjil yang pertama ialah <i>n</i>². (Umum)', 'Hujah induktif'),
       ('(d)', 'Hasil tambah digit 12 boleh dibahagi tepat dengan 3. Hasil tambah digit 21 boleh dibahagi tepat dengan 3. Hasil tambah digit 45 boleh dibahagi tepat dengan 3. Maka, hasil tambah digit gandaan 3 boleh dibahagi tepat dengan 3.',
        'Hasil tambah digit 12 boleh dibahagi tepat dengan 3. (Khusus)', 'Maka, hasil tambah digit gandaan 3 boleh dibahagi tepat dengan 3. (Umum)', 'Hujah induktif')]
for k, half in enumerate((c16[:2], c16[2:])):
    S(s, 'CONTOH 16', 'Hujah deduktif dan hujah induktif' + (' (sambungan)' if k else ''),
      (de(s, 'Hujah deduktif ialah proses kesimpulan khusus dibina berdasarkan premis umum. Hujah induktif ialah proses kesimpulan umum dibina berdasarkan premis khusus.')
       + p('<b>CONTOH 16</b> Tentukan sama ada hujah berikut ialah hujah deduktif atau hujah induktif.') if not k else '')
      + bul(s, [f'{x[0]} {x[1]}' for x in half]),
      stack(*[f'<b style="color:{c}">{x[0]} {x[4]}</b>' + arg([('Premis 1:', x[2]), ('Kesimpulan:', x[3])], c, 17) for x in half]))

S(s, 'KONSEP', 'Kesahan dan kemunasabahan hujah deduktif',
  p('Hujah deduktif yang sah boleh dikategorikan kepada tiga bentuk berikut.')
  + table(['', 'Bentuk I', 'Bentuk II', 'Bentuk III'], [['Premis 1', 'Semua <i>A</i> ialah <i>B</i>', 'Jika <i>p</i>, maka <i>q</i>', 'Jika <i>p</i>, maka <i>q</i>'],
                                                    ['Premis 2', '<i>C</i> ialah <i>A</i>', '<i>p</i> adalah benar', 'Bukan <i>q</i> adalah benar'],
                                                    ['Kesimpulan', '<i>C</i> ialah <i>B</i>', '<i>q</i> adalah benar', 'Bukan <i>p</i> adalah benar']], c, 18)
  + de(s, 'Suatu hujah deduktif dikatakan munasabah jika semua premis dan kesimpulannya adalah benar. Kesahan suatu hujah ditentukan berdasarkan bentuk hujah tersebut, bukan berdasarkan kebenaran premis atau kesimpulan.'),
  stack(arg([('Premis 1:', 'Semua pelukis pandai menyanyi.'), ('Premis 2:', 'Farah ialah pelukis.'), ('Kesimpulan:', 'Farah pandai menyanyi.')], c, 18),
        p('Hujah ini sah kerana memenuhi Bentuk I, tetapi tidak munasabah kerana Premis 1 adalah palsu (bukan semua pelukis pandai menyanyi).'),
        arg([('Premis 1:', 'Semua pelukis pandai menyanyi.'), ('Premis 2:', 'Farah pandai menyanyi.'), ('Kesimpulan:', 'Farah ialah pelukis.')], c, 18),
        p('Hujah ini tidak sah kerana tidak mematuhi ketiga-tiga bentuk deduktif yang sah.')))

c17 = [('(a)', ['Semua gandaan 12 ialah nombor genap.', '48 ialah gandaan 12.', '48 ialah nombor genap.'], 'Sah dan munasabah.'),
       ('(b)', ['Semua bola sepak berbentuk sfera.', 'Bulan berbentuk sfera.', 'Bulan ialah bola sepak.'], 'Tidak sah kerana tidak mematuhi bentuk hujah deduktif yang sah. Tidak munasabah kerana kesimpulan adalah palsu.'),
       ('(c)', ['Jika <i>w</i> < 7, maka <i>w</i> < 15.', '3 < 7.', '3 < 15.'], 'Sah dan munasabah.'),
       ('(d)', ['Jika <i>a</i> ≠ 0, maka <i>ax</i><sup><i>n</i></sup> + <i>bx</i> + <i>c</i> ialah ungkapan kuadratik.', '<i>a</i> ≠ 0.', '<i>ax</i><sup><i>n</i></sup> + <i>bx</i> + <i>c</i> ialah ungkapan kuadratik.'], 'Sah tetapi tidak munasabah kerana premis 1 dan kesimpulan tidak benar.'),
       ('(e)', ['Jika <i>k</i> boleh dibahagi tepat dengan 6, maka <i>k</i> boleh dibahagi tepat dengan 3.', '9 tidak boleh dibahagi tepat dengan 6.', '9 tidak boleh dibahagi tepat dengan 3.'], 'Tidak sah kerana tidak mematuhi bentuk hujah deduktif yang sah. Tidak munasabah kerana kesimpulannya palsu.'),
       ('(f)', ['Jika <i>k</i> ialah nombor ganjil, maka <i>k</i> + 1 ialah nombor genap.', '7 + 1 ialah nombor genap.', '7 ialah nombor ganjil.'], 'Tidak sah kerana tidak mematuhi bentuk hujah deduktif yang sah, tetapi munasabah kerana semua premis dan kesimpulan benar.')]
for half, lab in ((c17[:2], 'CONTOH 17'), (c17[2:4], 'CONTOH 17'), (c17[4:], 'CONTOH 17')):
    S(s, lab, 'Sah dan munasabah' + ('' if half[0][0] == '(a)' else ' (sambungan)'),
      (p('Adakah hujah di bawah sah dan munasabah? Sekiranya tidak, berikan justifikasi anda.') if half[0][0] == '(a)' else '')
      + ''.join(f'<p class="sl-p" style="margin:6px 0 2px"><b style="color:{c}">{lb}</b></p>' + arg([('Premis 1:', a), ('Premis 2:', b), ('Kesimpulan:', k)], c, 17).replace(' class="rv"', '') for lb, (a, b, k), _ in half),
      work([(lb, [ans_]) for lb, _, ans_ in half], s, 1, 19))

S(s, 'CONTOH 18', 'Membentuk hujah deduktif yang sah',
  p('Bentuk suatu hujah deduktif yang sah bagi setiap situasi yang berikut.')
  + bul(s, ['(a) Semua burung bertelur. Merpati ialah burung. Merpati bertelur.', '(b) Jika <i>x</i> kurang daripada 0, maka <i>x</i> bernilai negatif. −4 kurang daripada 0. −4 bernilai negatif.',
            '(c) Jika <i>x</i> ialah nombor genap, maka <i>x</i> + 1 ialah nombor ganjil. 15 + 1 bukan nombor ganjil. 15 bukan nombor genap.']),
  stack(*[f'<b style="color:{c}">{lb}</b>' + arg(L, c, 17) for lb, L in [
      ('(a) Bentuk I', [('Premis 1:', 'Semua burung bertelur.'), ('Premis 2:', 'Merpati ialah burung.'), ('Kesimpulan:', 'Merpati bertelur.')]),
      ('(b) Bentuk II', [('Premis 1:', 'Jika <i>x</i> kurang daripada 0, maka <i>x</i> bernilai negatif.'), ('Premis 2:', '−4 kurang daripada 0.'), ('Kesimpulan:', '−4 bernilai negatif.')]),
      ('(c) Bentuk III', [('Premis 1:', 'Jika <i>x</i> ialah nombor genap, maka <i>x</i> + 1 ialah nombor ganjil.'), ('Premis 2:', '15 + 1 bukan nombor ganjil.'), ('Kesimpulan:', '15 bukan nombor genap.')])]]))

assert 2 * 9 - 3 == 15 and 2 * 16 - 3 != 15
S(s, 'CONTOH 19', 'Menulis kesimpulan bagi hujah deduktif',
  p('Tulis kesimpulan bagi setiap hujah deduktif berikut untuk membentuk hujah deduktif yang sah dan munasabah.')
  + f'<b style="color:{c}">(a)</b>' + arg([('Premis 1:', 'Semua nombor bulat ialah nombor nyata.'), ('Premis 2:', '52 ialah nombor bulat.'), ('Kesimpulan:', '<span class="rv">52 ialah nombor nyata.</span>')], c, 17).replace('<div class="rv"', '<div')
  + f'<b style="color:{c}">(b)</b>' + arg([('Premis 1:', 'Jika <i>ax</i>² + <i>bx</i> + <i>c</i> = 0 mempunyai punca nyata, maka <i>b</i>² − 4<i>ac</i> ≥ 0.'), ('Premis 2:', '3<i>x</i>² + <i>kx</i> − 1 = 0 mempunyai punca nyata.'),
                                            ('Kesimpulan:', '<span class="rv"><i>k</i>² − 4(3)(−1) ≥ 0.</span>')], c, 17).replace('<div class="rv"', '<div'),
  stack(f'<b style="color:{c}">(c)</b>' + arg([('Premis 1:', 'Jika garis lurus <i>y</i> = <i>mx</i> + <i>c</i> selari dengan paksi-<i>x</i>, maka <i>m</i> = 0.'), ('Premis 2:', '<i>m</i> ≠ 0.'),
                                            ('Kesimpulan:', '<span class="rv">Garis lurus <i>y</i> = <i>mx</i> + <i>c</i> tidak selari dengan paksi-<i>x</i>.</span>')], c, 17).replace('<div class="rv"', '<div'),
        note('Bagi 3<i>x</i>² + <i>kx</i> − 1 = 0, <i>a</i> = 3, <i>b</i> = <i>k</i> dan <i>c</i> = −1.', 'Imbas kembali:'),
        note('Pilih bentuk hujah yang sesuai: Bentuk I bagi (a), Bentuk II bagi (b) dan Bentuk III bagi (c).', 'Tip:')))

S(s, 'CONTOH 20', 'Menulis premis bagi hujah deduktif',
  p('Tulis premis bagi setiap hujah deduktif berikut untuk membentuk hujah deduktif yang sah dan munasabah.')
  + f'<b style="color:{c}">(a)</b>' + arg([('Premis 1:', '<span class="rv">Semua nombor perdana hanya mempunyai dua faktor.</span>'), ('Premis 2:', '41 ialah nombor perdana.'), ('Kesimpulan:', '41 hanya mempunyai dua faktor.')], c, 17).replace('<div class="rv"', '<div')
  + f'<b style="color:{c}">(b)</b>' + arg([('Premis 1:', 'Jika jualan tahunan Syarikat XYZ melebihi dua juta, maka pekerjanya mendapat bonus dua bulan gaji.'), ('Premis 2:', '<span class="rv">Pekerja Syarikat XYZ tidak mendapat bonus dua bulan gaji.</span>'),
                                              ('Kesimpulan:', 'Jualan tahunan Syarikat XYZ tidak melebihi dua juta.')], c, 17).replace('<div class="rv"', '<div'),
  stack(f'<b style="color:{c}">(c)</b>' + arg([('Premis 1:', 'Jika <i>x</i> = <i>k</i>, maka <i>k</i> ialah punca bagi persamaan 2<i>x</i>² − 3 = 15.'), ('Premis 2:', '<span class="rv">4 bukan punca bagi persamaan 2<i>x</i>² − 3 = 15.</span>'),
                                              ('Kesimpulan:', '<i>x</i> ≠ 4.')], c, 17).replace('<div class="rv"', '<div'),
        note('2<i>x</i>² − 3 = 15 mempunyai punca 3 dan −3. Maka, 4 bukan punca bagi persamaan itu.', 'Semak:')))

# =====================================================================
# 3.2.4 HUJAH INDUKTIF (SP 3.2.4 – 3.2.6)
# =====================================================================
s = '3.2.4'
c = COL[s]
S(s, 'KONSEP', 'Kekuatan hujah induktif',
  p('Hujah deduktif menekankan kesahan hujah manakala hujah induktif lebih menekankan kekuatan hujah.')
  + de(s, 'Kekuatan hujah induktif ditentukan daripada tahap kemungkinan kesimpulan itu benar dengan andaian bahawa semua premis adalah benar. Sesuatu hujah itu meyakinkan atau tidak perlu dibincangkan berdasarkan kebenaran premis dan kesimpulannya.')
  + p('Bilangan premis tidak menjamin hujah yang kuat kerana kekuatan suatu hujah bergantung pada nilai kebenaran kesimpulan. Hujah yang lemah adalah tidak meyakinkan, manakala hujah yang kuat hanya akan meyakinkan sekiranya semua premisnya benar.'),
  table(['Kesimpulan', 'Kekuatan', 'Premis', 'Hujah'], [['Benar', 'Kuat', 'Semua premis benar', '<b style="color:#34D399">Meyakinkan</b>'], ['Benar', 'Kuat', 'Ada premis yang palsu', 'Tidak meyakinkan'],
                                                     ['Palsu', 'Lemah', '—', 'Tidak meyakinkan']], c, 18, rvrows=(0, 1, 2)))

S(s, 'CONTOH 21', 'Kuat atau lemah, meyakinkan atau tidak',
  p('Tentukan sama ada hujah yang diberi kuat atau lemah, serta meyakinkan atau tidak meyakinkan. Berikan justifikasi anda.')
  + bul(s, ['(a) Pintu kelas 4A berwarna biru. Pintu kelas 4B berwarna biru. Pintu kelas 4C berwarna biru. Kesimpulan: Semua pintu di sekolah berwarna biru.',
            '(b) 36 ialah gandaan 4. 100 ialah gandaan 4. Kesimpulan: Semua gandaan 8 ialah gandaan 4.',
            '(c) Burung pipit boleh terbang. Burung helang boleh terbang. Kesimpulan: Semua burung boleh terbang.',
            '(d) 13 × 2 = 26. 14 × 2 = 28. Kesimpulan: Semua gandaan 2 berakhir dengan digit genap.',
            ]),
  stack(bul(s, ['(e) 9 ialah nombor perdana. 3 ialah nombor perdana. 5 ialah nombor perdana. Kesimpulan: Semua nombor perdana mempunyai tepat dua faktor.']), work([('', ['(a) Hujah ini lemah dan tidak meyakinkan kerana premis adalah benar tetapi kesimpulan mungkin palsu.', '(b) Hujah ini kuat dan meyakinkan kerana semua premis dan kesimpulan benar.',
              '(c) Hujah ini lemah dan tidak meyakinkan kerana premis adalah benar tetapi kesimpulan adalah palsu. Contohnya, burung penguin tidak boleh terbang.',
              '(d) Hujah ini kuat dan meyakinkan kerana kesemua premis dan kesimpulan adalah benar.', '(e) Hujah ini kuat tetapi tidak meyakinkan kerana premis 1 adalah palsu.'])], s, 1, 17)))

assert [2 * n * n - 1 for n in range(1, 5)] == [1, 7, 17, 31] and [3 * n + 2 for n in range(4)] == [2, 5, 8, 11]
S(s, 'CONTOH 22', 'Membentuk hujah induktif yang kuat',
  p('Hujah induktif yang kuat dan meyakinkan bergantung pada premis dan kesimpulan yang benar. Penaakulan induktif boleh dijalankan mengikut langkah-langkah berikut.')
  + steps(s, ['Teliti beberapa contoh atau situasi yang khusus.', 'Perhatikan ciri yang sepunya.', 'Buat satu kesimpulan umum.'])
  + p('<b>CONTOH 22</b> Bentuk satu kesimpulan induktif yang kuat bagi setiap pola nombor yang berikut.'),
  work([('(a) Pola ' + ', '.join(F(1, 2 * k) for k in range(1, 5)) + ', …', [', '.join(f'{F(1, 2 * k)} = {pw(f"(2 × {k})", "−1")}' for k in range(1, 5)), f'Kesimpulan: {pw("(2<i>n</i>)", "−1")}; <i>n</i> = 1, 2, 3, 4, …']),
        ('(b) Pola 0.2, 0.04, 0.008, 0.0016, …', ['0.2 = (0.2)¹, 0.04 = (0.2)², 0.008 = (0.2)³, 0.0016 = (0.2)⁴', 'Kesimpulan: (0.2)<sup><i>n</i></sup>; <i>n</i> = 1, 2, 3, 4, …']),
        ('(c) Pola 2, 5, 8, 11, …', ['2 = 3(0) + 2, 5 = 3(1) + 2, 8 = 3(2) + 2, 11 = 3(3) + 2', 'Kesimpulan: 3<i>n</i> + 2; <i>n</i> = 0, 1, 2, 3, …']),
        ('(d) Pola 1, 7, 17, 31, …', ['1 = 2(1)² − 1, 7 = 2(2)² − 1, 17 = 2(3)² − 1, 31 = 2(4)² − 1', 'Kesimpulan: 2<i>n</i>² − 1; <i>n</i> = 1, 2, 3, 4, …'])], s, 1, 17))

assert 2 ** 9 == 512 and 2 ** 12 == 4096
o = ''
for lv in range(4):
    nn = 2 ** lv
    for k in range(nn):
        x = 250 + (k - (nn - 1) / 2) * (440 / max(nn, 1)) * (0.9 if lv == 3 else 1)
        y = 60 + lv * 110
        o += f'<circle cx="{x:.1f}" cy="{y}" r="{18 - lv * 3}" fill="{c}" fill-opacity="0.25" stroke="{c}" stroke-width="2.5"/>'
        if lv < 3:
            for d in (0, 1):
                x2 = 250 + ((2 * k + d) - (2 * nn - 1) / 2) * (440 / (2 * nn)) * (0.9 if lv == 2 else 1)
                o += GF.L((x, y + 16 - lv * 3), (x2, y + 110 - 16 + lv * 3), MU3, 2)
    o += GF.T(470, 60 + lv * 110 - 30, 'Sel A' if lv == 0 else f'Hari {lv}: {nn}', TX if lv == 0 else AM, 15, 'end')
S(s, 'CONTOH 23', 'Menyelesaikan masalah: hujah deduktif',
  p('Rajah di sebelah menunjukkan pertumbuhan sejenis sel bermula dengan sel A. Pada hari pertama, dua sel baharu dihasilkan. Setiap sel akan menghasilkan dua sel yang lain pada hari seterusnya. Diberi bilangan pertumbuhan sel ialah <i>P</i>(<i>t</i>) = 2<sup><i>t</i></sup>, dengan keadaan <i>t</i> ialah bilangan hari. (a) Berapakah bilangan sel baharu akan terhasil pada hari ke-9? (b) Pada hari keberapakah bilangan sel baharu ialah 4 096?')
  + work([('(a)', ['Memahami masalah: Membina kesimpulan secara deduktif. <i>t</i> = 9.', 'Melaksanakan strategi: <i>P</i>(9) = 2⁹ = 512', 'Kesimpulan: 512 sel baharu akan terhasil pada hari ke-9.']),
          ('(b)', ['Merancang strategi: Selesaikan 2<sup><i>t</i></sup> = 4 096.', '2<sup><i>t</i></sup> = 2¹², <i>t</i> = 12', 'Kesimpulan: Pada hari ke-12 bilangan sel baharu ialah 4 096.'])], s, 2, 17),
  SV(o, 'Pertumbuhan sel: setiap sel menghasilkan dua sel baharu setiap hari'))

rows24 = [('8:00 pagi', 330), ('9:00 pagi', 630), ('10:00 pagi', 930), ('11:00 pagi', 1230)]
assert all(v == 300 * (k + 1) + 30 for k, (_, v) in enumerate(rows24)) and 300 * 15 + 30 == 4530 and 4530 * 5 == 22650 and 300 * 17 + 30 == 5130 and 5130 * 5 == 25650 and 4830 * 5 < 25000
S(s, 'CONTOH 24', 'Menyelesaikan masalah: hujah induktif',
  p('Jadual di sebelah menunjukkan jumlah kereta mainan yang telah dihasilkan oleh Kilang MAINAN pada suatu pagi.')
  + bul(s, ['(a) Bina satu rumus yang umum bagi bilangan kereta mainan yang telah dihasilkan berdasarkan jadual.',
            '(b) Kilang MAINAN beroperasi dari pukul 7 pagi hingga pukul 10 malam, 5 hari dalam seminggu. (i) Berapakah kereta mainan dapat dihasilkan pada satu hari? (ii) Pesanan 25 000 kereta mainan perlu disiapkan dalam masa seminggu. Adakah kilang dapat menyerahkannya pada masa yang ditetapkan? Sekiranya tidak, cadangkan satu cara penyelesaian.'])
  + work([('(a) Membina kesimpulan secara induktif', ['330 = 300 + 30, 630 = 2(300) + 30, 930 = 3(300) + 30, 1 230 = 4(300) + 30', 'Rumus umum: 300<i>n</i> + 30; <i>n</i> = 1, 2, 3, 4, …'])], s, 1, 17),
  stack(table(['Masa', 'Jumlah kereta mainan'], [[a, f'{v:,}'.replace(',', ' ')] for a, v in rows24], c, 18),
        work([('(b)(i)', ['Waktu beroperasi = 15 jam sehari, <i>n</i> = 15', '300(15) + 30 = 4 530 kereta mainan sehari']),
              ('(b)(ii)', ['4 530 × 5 = 22 650 &lt; 25 000', 'Kilang tidak dapat menyerahkan kereta mainan yang dipesan.', 'Cadangan: Panjangkan waktu operasi kepada 17 jam sehari: 300(17) + 30 = 5 130; 5 130 × 5 = 25 650 ≥ 25 000'])], s, 1, 17)))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'logik', 'slides.js')
HEAD = '/* Nota Bab 3 ikut buku teks Matematik T4 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
