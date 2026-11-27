"""Bab 5 T4 Rangkaian dalam Teori Graf: nota ikut buku teks (ayat buku, nombor, nama dan graf ditukar).
Subtopik folder teorigraf dikekalkan (5.1.1 Graf & Darjah, 5.1.2 Terarah & Pemberat, 5.1.3 Subgraf & Pokok, 5.1.4 Rangkaian & Masalah)."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "5.1.1", "name": "Graf & Darjah", "col": "#38BDF8"}, {"no": "5.1.2", "name": "Terarah & Pemberat", "col": "#FB923C"},
        {"no": "5.1.3", "name": "Subgraf & Pokok", "col": "#34D399"}, {"no": "5.1.4", "name": "Rangkaian & Masalah", "col": "#A78BFA"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr
GID = [0]


def i(s):
    return f'<i>{s}</i>'


def gdraw(V, E, col=TR, r=17, fs=17, ecol=None, wfs=15, vcol=None, hide=(), z=1):
    """V: {nama: (x, y)}; E: senarai dict(a, b, k=lengkung, w=pemberat/label, d=terarah, loop=sudut, c=warna, rv=bool).
    Pulang svg dalam."""
    GID[0] += 1
    r, fs, wfs = r * z, fs * z, wfs * z
    sw = 3 * z
    mk = f'gar{GID[0]}'
    ec = ecol or MU3
    o = f'<defs><marker id="{mk}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="{AM}"/></marker></defs>'
    for e in E:
        a, b = e['a'], e.get('b', e['a'])
        cc = e.get('c', ec)
        seg = ''
        lx = ly = None
        if a == b:  # gelung
            x, y = V[a]
            ang = math.radians(e.get('loop', -90))
            cx, cy = x + (r + 16 * z) * math.cos(ang), y + (r + 16 * z) * math.sin(ang)
            seg = f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{18 * z}" fill="none" stroke="{cc}" stroke-width="{sw}"/>'
            lx, ly = x + (r + 44 * z) * math.cos(ang), y + (r + 44 * z) * math.sin(ang)
        else:
            (x1, y1), (x2, y2) = V[a], V[b]
            dx, dy = x2 - x1, y2 - y1
            dd = math.hypot(dx, dy)
            ux, uy = dx / dd, dy / dd
            k = e.get('k', 0)
            mx, my = (x1 + x2) / 2 - uy * k, (y1 + y2) / 2 + ux * k
            if k:
                # titik permulaan/akhir di tepi bulatan, menghala ke titik kawalan
                def edge(px, py, qx, qy):
                    vx, vy = qx - px, qy - py
                    l = math.hypot(vx, vy)
                    return px + vx / l * r, py + vy / l * r
                sx, sy = edge(x1, y1, mx, my)
                tx, ty = edge(x2, y2, mx, my)
                seg = f'<path d="M{sx:.1f} {sy:.1f} Q{2 * mx - (sx + tx) / 2:.1f} {2 * my - (sy + ty) / 2:.1f} {tx:.1f} {ty:.1f}" fill="none" stroke="{cc}" stroke-width="{sw}"' + (f' marker-end="url(#{mk})"' if e.get('d') else '') + '/>'
                sg = 1 if k > 0 else -1
                lx, ly = mx - uy * 14 * z * sg, my + ux * 14 * z * sg
            else:
                sx, sy, tx, ty = x1 + ux * r, y1 + uy * r, x2 - ux * (r + (2 if e.get('d') else 0)), y2 - uy * (r + (2 if e.get('d') else 0))
                seg = f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{tx:.1f}" y2="{ty:.1f}" stroke="{cc}" stroke-width="{sw}"' + (f' marker-end="url(#{mk})"' if e.get('d') else '') + '/>'
                off = e.get('off', 15) * z
                lx, ly = mx - uy * off, my + ux * off
        if e.get('w') is not None:
            seg += GF.T(lx, ly, str(e['w']), e.get('wc', AM), wfs)
        o += GF.rv(seg) if e.get('rv') else seg
    for nm, (x, y) in V.items():
        if nm in hide:
            continue
        c = (vcol or {}).get(nm, col)
        o += f'<circle cx="{x}" cy="{y}" r="{r}" fill="#0E1626" stroke="{c}" stroke-width="{sw}"/>' + GF.T(x, y, nm, TX, fs)
    return o


def gz(*a, **k):
    k.setdefault('z', 2.2)
    return gdraw(*a, **k)


def ed(spec, **kw):
    """'AB' atau 'A-B' → dict tepi."""
    a, b = spec.split('-') if '-' in spec else (spec[0], spec[1])
    d = dict(a=a, b=b)
    d.update(kw)
    return d


def SVh(inner, aria, h, y0=0):
    return f'<svg class="sl-svg" viewBox="0 {y0} 500 {h:.0f}" role="img" aria-label="{aria}">{inner}</svg>'


def panel(items, w=500, h=230, cols=2, scale=0.46, cap_fs=16, ih=470):
    """grid graf kecil: items = [(caption, inner_svg)] dilukis dalam 500x470 lalu dikecilkan."""
    o = ''
    cw = w / cols
    rows = (len(items) + cols - 1) // cols
    for k, (cap, inner) in enumerate(items):
        r_, q = divmod(k, cols)
        x0 = q * cw + (cw - 500 * scale) / 2
        y0 = r_ * h
        o += f'<g transform="translate({x0:.1f},{y0 + 6:.1f}) scale({scale})">{inner}</g>' + (GF.T(q * cw + cw / 2, y0 + ih * scale + 18, cap, TX, cap_fs) if cap else '')
    return o, rows * h - (h - ih * scale - 30)


# =====================================================================
# 5.1.1 GRAF DAN DARJAH
# =====================================================================
s = '5.1.1'
c = COL[s]
Vd = {'A': (110, 110), 'B': (330, 90), 'C': (420, 260), 'D': (240, 300), 'E': (90, 330)}
o = gdraw(Vd, [ed('AB'), ed('BC'), ed('CD'), ed('DA'), ed('DE'), ed('AE')])
o += GF.rv(GF.L((150, 60), (128, 96), AM, 2) + GF.T(160, 48, 'Bucu', AM, 17) + GF.L((280, 140), (240, 125), AM, 2) + GF.T(300, 150, 'Tepi', AM, 17))
S(s, 'KONSEP', 'Rangkaian sebagai graf',
  p('Hubung kait antara sekumpulan komputer dengan peranti berkaitan, iaitu rangkaian komputer, membolehkan pencarian, penggunaan dan perkongsian maklumat dilakukan dengan mudahnya.')
  + de(s, 'Dalam teori graf, graf ditafsirkan sebagai suatu siri bintik sama ada berkait atau tidak antara satu sama lain melalui garis. Bintik dikenali sebagai <b>bucu</b> dan garis yang mengaitkan dua bucu ialah <b>tepi</b>.')
  + p('Graf juga sering digunakan untuk mewakilkan suatu rangkaian. Rangkaian merupakan sebahagian daripada graf dengan keadaan bucu dan tepi mempunyai sifat tersendiri.'),
  stack(SVh(o, 'Graf dengan bucu dan tepi', 300, 40), table(['Rangkaian', 'Bucu', 'Tepi'], [['Pengangkutan darat', 'Kawasan, pekan, bandar atau bangunan', 'Jalan raya, lebuh raya atau landasan kereta api'], ['Sosial', 'Individu, kumpulan atau organisasi', 'Jenis hubungan seperti kawan atau keluarga']], c, 15)))

S(s, 'DEFINISI', 'Tatatanda graf, darjah dan graf mudah',
  de(s, f'Tatatanda graf merupakan set pasangan tertib iaitu {i("G")} = ({i("V")}, {i("E")}) dengan keadaan {i("V")} ialah set bucu dan {i("E")} ialah set tepi yang menghubungkan sepasang bucu.')
  + bul(s, [f'{i("V")} = {{{i("v")}₁, {i("v")}₂, {i("v")}₃, …, {i("v")}<sub>{i("n")}</sub>}}', f'{i("E")} = {{({i("a")}₁, {i("b")}₁), ({i("a")}₂, {i("b")}₂), …}}; {i("a")} dan {i("b")} ialah pasangan bucu.',
            f'Darjah, {i("d")}, ialah bilangan tepi yang mengaitkan suatu bucu dengan bucu lain.'])
  + formula(f'Σ{i("d")}({i("v")}) = 2{i("E")}', c)
  + p('Bilangan darjah suatu graf ialah dua kali bilangan tepi.'),
  stack(work([('Graf mudah', ['Graf mudah ialah graf yang tidak mengandungi gelung atau berbilang tepi.'])], s, 1, 19),
        table(['Simbol', 'Maksud'], [[i('G'), 'Graf'], [i('v'), 'Bucu'], [i('e'), 'Tepi'], [i('d'), 'Darjah'], ['Σ', 'Jumlah']], c, 18)))

V1 = {'1': (80, 90), '2': (80, 290), '3': (230, 190), '4': (380, 190), '5': (450, 70), '6': (450, 310)}
E1 = ['12', '13', '23', '34', '45', '46', '56']
deg1 = {v: sum(e.count(v) for e in E1) for v in V1}
assert sum(deg1.values()) == 2 * len(E1) == 14
S(s, 'CONTOH 1', 'Set bucu, set tepi dan bilangan darjah',
  p(f'Berdasarkan graf mudah di sebelah, tentukan (a) {i("V")} dan {i("n")}({i("V")}) (b) {i("E")} dan {i("n")}({i("E")}) (c) bilangan darjah.')
  + work([('(a)', [f'{i("V")} = {{1, 2, 3, 4, 5, 6}}, {i("n")}({i("V")}) = 6']),
          ('(b)', [f'{i("E")} = {{' + ', '.join(f'({e[0]}, {e[1]})' for e in E1) + '}', f'{i("n")}({i("E")}) = 7']),
          ('(c)', [f'Σ{i("d")}({i("v")}) = 2(7) = 14', ', '.join(f'{i("d")}({v}) = {d}' for v, d in deg1.items())])], s, 1, 18)
  + note('Tepi untuk pasangan bucu (1, 2) adalah sama dengan pasangan bucu (2, 1).', 'Info:'),
  SVh(gdraw(V1, [ed(e) for e in E1]), 'Graf mudah dengan 6 bucu dan 7 tepi', 380, 20))

Va = {'1': (60, 80), '2': (200, 60), '3': (200, 220), '4': (60, 240), '5': (130, 380)}
Ea = ['12', '23', '34', '41', '13', '35']
Vb = {'A': (60, 70), 'B': (190, 70), 'C': (190, 230), 'D': (60, 230), 'E': (60, 390), 'F': (190, 390)}
Eb = ['AB', 'BC', 'CD', 'DA', 'AC', 'DE', 'EF', 'CF']
o = f'<g transform="translate(10,0)">{gdraw(Va, [ed(e) for e in Ea])}</g><g transform="translate(250,0)">{gdraw(Vb, [ed(e) for e in Eb])}</g>' + GF.T(140, 440, '(a)', TX, 18) + GF.T(375, 440, '(b)', TX, 18)
S(s, 'CONTOH 2', 'Bilangan bucu, tepi dan darjah',
  p('Nyatakan bilangan bucu, tepi dan darjah bagi graf mudah di sebelah.')
  + work([('(a)', ['Bucu = 5', 'Tepi = 6', 'Darjah = 2 × tepi = 2 × 6 = 12']), ('(b)', ['Bucu = 6', 'Tepi = 8', 'Darjah = 2 × tepi = 2 × 8 = 16'])], s, 2, 19),
  SVh(o, 'Dua graf mudah', 460))

Vm = {'A': (90, 120), 'B': (300, 90), 'C': (400, 280), 'D': (130, 320)}
Em = [ed('AB', k=24, w='e₁'), ed('AB', k=-24, w='e₂'), ed('BC', k=22, w='e₃'), ed('BC', k=-22, w='e₄'), ed('CD', w='e₅'), ed('BD', w='e₆'), ed('AD', w='e₇'), dict(a='D', loop=135, w='e₈')]
S(s, 'KONSEP', 'Berbilang tepi dan gelung',
  table(['Berbilang tepi', 'Gelung'], [['Melibatkan dua bucu.', 'Melibatkan satu bucu.'], ['Kaitan antara dua bucu dinyatakan melalui lebih daripada satu tepi.', 'Tepi berbentuk lengkung atau bulatan yang berbalik kepada bucu asal.'],
                                       ['Bilangan darjah ialah dua kali bilangan tepi.', 'Bilangan darjah setiap gelung ialah dua.']], c, 17, False)
  + p(f'Graf di sebelah ditulis dalam bentuk set pasangan tertib, {i("G")}({i("V")}, {i("E")}):')
  + bul(s, [f'{i("V")} = {{A, B, C, D}}', f'{i("E")} = {{(A, B), (A, B), (B, C), (B, C), (C, D), (B, D), (A, D), (D, D)}}'])
  + note('Pasangan bucu gelung berbentuk (a, a). Pasangan bucu berbilang tepi berbentuk (a, b) dan (a, b).', 'Tip:'),
  SVh(gdraw(Vm, Em), 'Graf dengan berbilang tepi dan gelung', 400, 20))

V3 = {'P': (90, 100), 'Q': (330, 80), 'R': (430, 260), 'S': (250, 360), 'T': (80, 300)}
E3 = [ed('PQ', k=22), ed('PQ', k=-22), ed('QR'), ed('RS'), dict(a='S', loop=90), ed('ST'), ed('TP'), ed('QT')]
deg3 = {'P': 3, 'Q': 4, 'R': 2, 'S': 4, 'T': 3}
assert sum(deg3.values()) == 16
S(s, 'CONTOH 3', 'Graf yang mempunyai gelung dan berbilang tepi',
  p(f'Rajah di sebelah menunjukkan suatu graf yang mempunyai gelung dan berbilang tepi. Nyatakan (a) {i("V")} dan {i("n")}({i("V")}) (b) {i("E")} dan {i("n")}({i("E")}) (c) bilangan darjah.')
  + work([('(a)', [f'{i("V")} = {{P, Q, R, S, T}}, {i("n")}({i("V")}) = 5']),
          ('(b)', [f'{i("E")} = {{(P, Q), (P, Q), (Q, R), (R, S), (S, S), (S, T), (T, P), (Q, T)}}', f'{i("n")}({i("E")}) = 8']),
          ('(c)', ['Bucu P = 3, Q = 4, R = 2, S = 4, T = 3', 'Jumlah bilangan darjah = 16'])], s, 1, 18),
  stack(SVh(gdraw(V3, E3), 'Graf P Q R S T dengan gelung pada S dan berbilang tepi PQ', 430, 20), note('Bilangan darjah setiap gelung ialah dua, iaitu pusingan mengikut arah jam dan lawan arah jam.', 'Tip:')))

V4 = {'1': (50, 70), '2': (200, 70), '3': (50, 250), '4': (130, 370), '5': (225, 270)}
E4 = ['12', '13', '24', '34', '45', '25']
V5 = {'P': (70, 100), 'Q': (210, 100), 'R': (210, 300), 'S': (70, 300)}
E5 = [dict(a='P', loop=-135), ed('PQ'), ed('QR', k=20), ed('QR', k=-20), ed('RS'), ed('SP'), dict(a='S', loop=135)]
o = f'<g transform="translate(10,0)">{gdraw(V4, [ed(e) for e in E4])}</g><g transform="translate(240,0)">{GF.rv(gdraw(V5, E5))}</g>' + GF.T(140, 445, 'Contoh 4', TX, 17) + GF.T(380, 445, 'Contoh 5', TX, 17)
S(s, 'CONTOH 4 – 5', 'Melukis graf berdasarkan set V dan set E',
  p('<b>CONTOH 4</b> Lukis satu graf mudah mengikut maklumat yang diberikan.')
  + bul(s, [f'{i("V")} = {{1, 2, 3, 4, 5}}', f'{i("E")} = {{(1, 2), (1, 3), (2, 4), (3, 4), (4, 5), (2, 5)}}'])
  + p('<b>CONTOH 5</b> Lukis satu graf berbilang tepi dan mempunyai gelung mengikut maklumat yang diberikan.')
  + bul(s, [f'{i("V")} = {{P, Q, R, S}}', f'{i("E")} = {{(P, P), (P, Q), (Q, R), (Q, R), (R, S), (S, P), (S, S)}}'])
  + note('Lukis semua bucu dahulu, kemudian sambungkan setiap pasangan bucu dalam set E.', 'Tip:'),
  SVh(o, 'Graf yang dilukis daripada set V dan set E', 460))

assert sum([3, 3, 2, 1, 2]) == 11 and sum([2, 3, 1, 2, 3, 1]) == 12
S(s, 'CONTOH 6', 'Bolehkah graf dilukis?',
  p('Jumlah darjah suatu graf ialah dua kali bilangan tepi. Maka, jumlah darjah mesti nombor genap.')
  + p('<b>CONTOH 6</b> Tentukan sama ada suatu graf boleh dilukis bagi bilangan darjah yang diberikan. (a) 3, 3, 2, 1, 2 (b) 2, 3, 1, 2, 3, 1')
  + work([('(a)', ['Jumlah darjah = 3 + 3 + 2 + 1 + 2 = 11', 'Graf tidak boleh dilukis kerana jumlah darjah adalah ganjil.']),
          ('(b)', ['Jumlah darjah = 2 + 3 + 1 + 2 + 3 + 1 = 12', 'Graf boleh dilukis kerana jumlah darjah adalah genap.'])], s, 1, 19),
  SVh(GF.rv(gdraw({'A': (80, 90), 'B': (240, 60), 'C': (400, 110), 'D': (90, 290), 'E': (250, 320), 'F': (410, 290)},
                  [ed('AB'), ed('BC'), ed('BE'), ed('CF'), ed('EF'), ed('DE')])) + GF.T(250, 390, 'Satu contoh graf bagi (b): darjah 1, 3, 2, 1, 3, 2', TX, 15), 'Graf contoh bagi darjah 2, 3, 1, 2, 3, 1', 410, 20))

# =====================================================================
# 5.1.2 GRAF TERARAH DAN BERPEMBERAT
# =====================================================================
s = '5.1.2'
c = COL[s]
Vt = {'A': (90, 110), 'B': (330, 90), 'C': (380, 300), 'D': (110, 320)}
Et = [ed('AB', d=1), ed('CB', d=1), ed('CD', d=1), ed('AD', d=1), ed('AC', d=1)]
S(s, 'DEFINISI', 'Graf terarah dan graf tak terarah',
  de(s, 'Graf terarah ialah graf dengan keadaan tepi yang mengaitkan dua bucu ditanda dengan arah kaitan.')
  + bul(s, ['Tepi AB: bucu A ialah bucu awal, bucu B ialah bucu akhir.', 'Tepi CB: bucu C ialah bucu awal, bucu B ialah bucu akhir.'])
  + p('Graf tak terarah ialah graf mudah atau graf yang mempunyai gelung dan berbilang tepi yang dilukis tanpa penandaan arah pada tepi.')
  ,
  stack(SVh(gdraw(Vt, Et), 'Graf terarah A B C D', 300, 70), note(f'{i("d")}<sub>in</sub>(A): bilangan tepi masuk ke bucu A; {i("d")}<sub>out</sub>(A): bilangan tepi keluar dari bucu A.', 'Info:'),
        table(['Bucu', 'A', 'B', 'C', 'D'], [[f'{i("d")}<sub>in</sub>', '0', '2', '1', '2'], [f'{i("d")}<sub>out</sub>', '3', '0', '2', '0']], c, 18)))

Vu = {'A': (60, 60), 'B': (200, 60), 'C': (200, 200), 'D': (60, 200)}
S(s, 'KONSEP', 'Beza graf tak terarah dengan graf terarah',
  table(['', 'Graf tak terarah', 'Graf terarah'],
        [['Set', f'{i("V")} = {{A, B, C, D}}<br>{i("E")} = {{(A, B), (A, C), (B, C), (C, D)}}', f'{i("V")} = {{A, B, C, D}}<br>{i("E")} = {{(B, A), (C, A), (B, C), (D, C)}}'],
         ['Penulisan', 'Kedudukan pasangan bucu adalah bebas. (A, B) atau (B, A) boleh mewakili tepi AB.', 'Kedudukan pasangan bucu adalah mengikut arah pada tepi. (B, A) dan (A, B) mewakili tepi yang berlainan.'],
         ['Darjah', f'{i("d")}(A) = 2, {i("d")}(B) = 2, {i("d")}(C) = 3, {i("d")}(D) = 1; Σ{i("d")} = 8', f'{i("d")}<sub>in</sub>(A) = 2, {i("d")}<sub>out</sub>(A) = 0; … Σ{i("d")} = 8']], c, 15, False),
  SVh(f'<g transform="translate(10,0)">{gdraw(Vu, [ed("AB"), ed("AC"), ed("BC"), ed("CD")])}</g><g transform="translate(250,0)">{gdraw(Vu, [ed("BA", d=1), ed("CA", d=1), ed("BC", d=1), ed("DC", d=1)])}</g>'
      + GF.T(140, 260, 'Graf tak terarah', TX, 16) + GF.T(380, 260, 'Graf terarah', TX, 16), 'Graf tak terarah dan graf terarah', 280, 20))

S(s, 'KONSEP', 'Graf berpemberat dan graf tak berpemberat',
  table(['', 'Graf berpemberat', 'Graf tak berpemberat'],
        [['Jenis graf', 'Graf terarah dan graf tak terarah', 'Graf terarah dan graf tak terarah'], ['Tepi', 'Diberi nilai atau pemberat', 'Tiada nilai atau pemberat yang dinyatakan'],
         ['Contoh', 'Jarak di antara dua bandar, masa yang diambil untuk suatu gerakan, nilai arus litar elektrik, kos', 'Hierarki jawatan dalam carta organisasi, peta alir, peta pokok, peta buih']], c, 16, False)
  + note('Pemberat ialah nilai yang diberikan kepada setiap tepi, contohnya jarak, masa atau kos.', 'Ingat:'),
  SVh(gdraw({'Ipoh': (90, 90), 'Taiping': (400, 90), 'Kuala Kangsar': (250, 300)}, [ed('Ipoh-Taiping', w='88 km'), ed('Ipoh-Kuala Kangsar', w='50 km'), ed('Kuala Kangsar-Taiping', w='38 km')], r=0, fs=16).replace('r="0"', 'r="0"')
      + ''.join(f'<rect x="{x - 62}" y="{y - 18}" width="124" height="36" rx="12" fill="#0E1626" stroke="{TR}" stroke-width="2.5"/>' + GF.T(x, y, n, TX, 15) for n, (x, y) in {'Ipoh': (90, 90), 'Taiping': (400, 90), 'Kuala Kangsar': (250, 300)}.items()),
      'Graf berpemberat jarak antara tiga bandar', 360, 20))

V7 = {'P': (80, 110), 'Q': (260, 70), 'R': (420, 170), 'S': (240, 260), 'T': (400, 360), 'U': (80, 340)}
E7 = [ed('PQ', d=1), ed('QR', d=1), ed('PS', d=1), ed('SR', d=1), ed('ST', d=1), ed('TR', d=1)]
S(s, 'CONTOH 7', 'Melukis graf terarah',
  p(f'Lukis graf terarah mengikut maklumat yang diberikan. {i("V")} = {{P, Q, R, S, T, U}}, {i("E")} = {{(P, Q), (Q, R), (P, S), (S, R), (S, T), (T, R)}}')
  + table(['Pasangan bucu', '(P, Q)', '(Q, R)', '(P, S)', '(S, R)', '(S, T)', '(T, R)'], [['Arah', 'P ke Q', 'Q ke R', 'P ke S', 'S ke R', 'S ke T', 'T ke R']], c, 15)
  + note('Bucu U wujud dalam set V tetapi tidak dalam set E. Hal ini bermakna bucu U tidak berkaitan dengan bucu-bucu lain dan dikenali sebagai <b>bucu terpencil</b>.', 'Info:'),
  stack(SVh(GF.rv(gdraw(V7, E7)), 'Graf terarah P Q R S T dengan bucu terpencil U', 360, 50),
        table(['Bucu', 'P', 'Q', 'R', 'S', 'T', 'U'], [[f'{i("d")}<sub>in</sub>', '0', '1', '3', '1', '1', '0'], [f'{i("d")}<sub>out</sub>', '2', '1', '0', '2', '1', '0']], c, 16)))

V8 = {'v₁': (60, 220), 'v₂': (200, 80), 'v₃': (220, 340), 'v₄': (360, 250), 'v₅': (450, 90)}
E8 = [ed('v₁-v₂', d=1, w='600 m'), ed('v₁-v₃', d=1, w='800 m', off=-15), ed('v₂-v₃', d=1, w='500 m'), ed('v₂-v₅', d=1, w='700 m'), ed('v₃-v₄', d=1, w='600 m', off=-15), ed('v₂-v₄', d=1, w='900 m'), ed('v₄-v₅', d=1, w='400 m', off=-15)]
paths = {'v₁ → v₂ → v₅': 600 + 700, 'v₁ → v₂ → v₃ → v₄ → v₅': 600 + 500 + 600 + 400, 'v₁ → v₃ → v₄ → v₅': 800 + 600 + 400, 'v₁ → v₂ → v₄ → v₅': 600 + 900 + 400}
assert min(paths.values()) == 1300 and max(paths.values()) == 2100
S(s, 'CONTOH 8', 'Graf terarah dan berpemberat',
  p('Rajah di sebelah menunjukkan pilihan laluan sehala Hana untuk menjalankan latihan larian. Bucu v₁ ialah tempat permulaan dan bucu v₅ ialah tempat terakhir. Tentukan')
  + bul(s, ['(a) jarak laluan sehala yang terpendek, dari v₁ ke v₅.', '(b) jarak laluan sehala yang terpanjang, dari v₁ ke v₅.', '(c) bucu-bucu yang perlu dilalui jika jarak larian adalah di antara 1.5 km hingga 2.0 km.'])
  + work([('Penyelesaian', ['(a) v₁ → v₂ → v₅ = (600 + 700) m = 1 300 m = 1.3 km', '(b) v₁ → v₂ → v₃ → v₄ → v₅ = (600 + 500 + 600 + 400) m = 2 100 m = 2.1 km',
                            '(c) v₁, v₃, v₄, v₅ (1.8 km) dan v₁, v₂, v₄, v₅ (1.9 km)'])], s, 1, 17),
  SVh(gdraw(V8, E8, fs=15, wfs=14), 'Graf terarah berpemberat laluan larian', 400, 20))

# =====================================================================
# 5.1.3 SUBGRAF DAN POKOK
# =====================================================================
s = '5.1.3'
c = COL[s]
VG = {'P': (110, 110), 'Q': (370, 110), 'R': (370, 330), 'S': (110, 330)}
EG = [ed('PQ', w='e₁'), dict(a='Q', loop=-45, w='e₂'), ed('PS', w='e₃', off=-15), ed('QR', w='e₄'), ed('RS', w='e₅')]
r1 = gz({'P': VG['P'], 'S': VG['S']}, [ed('PS', w='e₃', off=-15)])
r2 = gz({'P': VG['P'], 'Q': VG['Q']}, [dict(a='P', loop=-135, w='e₂'), ed('PQ', w='e₁')])
r3 = gz({'Q': VG['Q'], 'R': VG['R'], 'S': VG['S']}, [ed('QR', w='e₄'), ed('RS', w='e₃')])
o, h = panel([('Graf G', gz(VG, EG)), ('Rajah 1', r1), ('Rajah 2', r2), ('Rajah 3', r3)], h=210, ih=400)
S(s, 'DEFINISI', 'Subgraf',
  de(s, 'Subgraf merupakan sebahagian atau keseluruhan suatu graf yang dilukis semula tanpa mengubah kedudukan asal bucu dan tepi.')
  + p(f'Suatu graf {i("H")} dikatakan subgraf kepada graf {i("G")} jika')
  + bul(s, [f'bucu dan tepi graf {i("H")} ialah subset kepada bucu dan tepi graf {i("G")}, dan', f'pasangan bucu setiap tepi graf {i("H")} adalah sama dengan tepi graf {i("G")}.'])
  + note('Setiap graf ialah subgraf kepada dirinya.', 'Info:'),
  SVh(gdraw(VG, EG) + GF.T(240, 400, 'Graf G', TX, 18), 'Graf G', 420, 20))

S(s, 'CONTOH 9', 'Mengenal pasti subgraf',
  p(f'Tentukan sama ada Rajah 1, Rajah 2 dan Rajah 3 ialah subgraf bagi graf {i("G")}.')
  + work([('Penyelesaian', ['Rajah 1: Ya, kerana pasangan bucu untuk tepi e₃ adalah sama.', 'Rajah 2: Tidak, kerana kedudukan gelung e₂ bukan pada bucu P.', 'Rajah 3: Tidak, kerana tepi yang mengaitkan bucu R dan bucu S ialah e₅, bukan e₃.'])], s, 1, 18),
  SVh(o, 'Graf G dan tiga rajah', h))

S(s, 'DEFINISI', 'Pokok',
  de(s, 'Pokok suatu graf ialah subgraf bagi graf tersebut dengan ciri-ciri berikut:')
  + steps(s, ['Graf mudah iaitu tanpa gelung atau berbilang tepi.', 'Semua bucu mesti berkait dan setiap pasangan bucu dikaitkan oleh satu tepi sahaja.', 'Bilangan tepi = bilangan bucu − 1'])
  + note('Carta salasilah keluarga ialah contoh pokok.', 'Info:'),
  stack(SVh(f'<g transform="translate(10,0)">{gdraw({"A": (60, 60), "B": (200, 60), "C": (130, 180), "D": (60, 300), "E": (200, 300)}, [ed("AC"), ed("BC"), ed("CD"), ed("CE")])}</g>'
            f'<g transform="translate(250,0)">{gdraw({"A": (60, 60), "B": (200, 60), "C": (130, 180), "D": (60, 300), "E": (200, 300)}, [ed("AC"), ed("BC"), ed("CD"), ed("DE"), ed("BE", k=-40)])}</g>'
            + GF.T(140, 350, 'Rajah 1: pokok', GR, 16) + GF.T(380, 350, 'Rajah 2: bukan pokok', PK, 16), 'Pokok dan bukan pokok', 370),
        p('Rajah 1: bucu = 5, tepi = 4. Rajah 2: bucu = 5, tepi = 5; bucu B dan bucu E boleh dikaitkan dengan dua cara.')))

pos6 = {'P': (60, 60), 'Q': (220, 60), 'R': (380, 60), 'S': (380, 300), 'T': (220, 300), 'U': (60, 300)}
ga = gz(pos6, [ed('PQ'), ed('QR'), ed('RS'), ed('ST'), ed('TU'), ed('UP'), ed('QT')])
gb = gz(pos6, [ed('PQ'), ed('QR'), ed('QT'), ed('TS'), ed('TU')])
gc = gz(pos6, [ed('PU'), ed('UT'), ed('TS'), ed('SR'), ed('RQ')])
gd = gz(pos6, [ed('PQ'), ed('QU'), ed('US')])
o, h = panel([('(a)', ga), ('(b)', gb), ('(c)', gc), ('(d)', gd)], h=190, ih=360)
S(s, 'CONTOH 10', 'Mengenal pasti pokok',
  p('Kenal pasti sama ada pokok atau bukan pokok untuk rajah di sebelah. Berikan justifikasi anda.')
  + work([('Penyelesaian', ['(a) Bukan pokok. Bucu = 6, tepi = 7. Setiap pasangan bucu boleh dikaitkan dengan pelbagai cara.', '(b) Pokok. Bucu = 6, tepi = 5. Setiap pasangan bucu hanya dikaitkan oleh satu tepi.',
                            '(c) Pokok. Bucu = 6, tepi = 5. Setiap pasangan bucu hanya dikaitkan oleh satu tepi.', '(d) Bukan pokok. Bucu = 6, tepi = 3. Bucu R dan bucu T tidak dikaitkan dengan bucu lain.'])], s, 1, 18),
  SVh(o, 'Empat rajah untuk dikenal pasti', h))

G12 = {'A': (70, 80), 'B': (250, 60), 'C': (420, 120), 'D': (330, 320), 'E': (110, 300)}
E12 = ['AB', 'BC', 'CD', 'DE', 'EA', 'BE', 'BD']
t1 = [ed('AB'), ed('BC'), ed('BD'), ed('BE')]
t2 = [ed('EA'), ed('AB'), ed('BC'), ed('CD')]
o, h = panel([('Graf: bucu = 5, tepi = 7', gz(G12, [ed(e) for e in E12])), ('Pokok (i)', gz(G12, t1)), ('Pokok (ii)', gz(G12, t2))], h=200, ih=360)
S(s, 'CONTOH 11 – 12', 'Melukis pokok',
  p('<b>CONTOH 11</b> Lukis satu pokok dengan maklumat yang diberi: (a) bucu = 6 (b) tepi = 4.')
  + work([('', ['(a) Bucu = 6, maka tepi = 6 − 1 = 5', '(b) Tepi = 4, maka bucu = 4 + 1 = 5'])], s, 1, 19)
  + p('<b>CONTOH 12</b> Lukis dua pokok berdasarkan graf yang diberikan.')
  + work([('Penyelesaian', ['Bucu = 5, tepi = 7', 'Pokok mesti mempunyai 5 − 1 = 4 tepi, maka 3 tepi perlu dibuang tanpa memutuskan mana-mana bucu.'])], s, 1, 19)
  ,
  SVh(o, 'Graf dan dua pokok', h))

W13 = {'P': (70, 200), 'Q': (220, 60), 'R': (420, 90), 'S': (400, 330), 'T': (200, 330)}
E13 = [('PQ', 18), ('PT', 24), ('QR', 9), ('QT', 13), ('RS', 11), ('RT', 16), ('ST', 20)]
keep = {'QR', 'RS', 'QT', 'PQ'}
assert sum(w for e, w in E13 if e in keep) == 51
o, h = panel([('Graf berpemberat', gz(W13, [ed(e, w=w, off=-15 if e == 'QT' else 15) for e, w in E13])), ('Pokok pemberat minimum', gz(W13, [ed(e, w=w, off=-15 if e == 'QT' else 15) for e, w in E13 if e in keep]))], h=230, scale=0.48, ih=380)
S(s, 'CONTOH 13', 'Pokok dengan jumlah pemberat minimum',
  p('Rajah di sebelah menunjukkan suatu graf tak terarah dan berpemberat. Lukis satu pokok dengan jumlah nilai pemberat yang minimum.')
  + work([('Langkah 1', ['Bucu = 5, tepi = 7. Pokok perlu 4 tepi, maka 3 tepi perlu dibuang.']),
          ('Langkah 2', ['Keluarkan tepi dengan pemberat nilai tertinggi tanpa memutuskan bucu: PT (24), ST (20) dan RT (16).', 'Tepi RT dibuang kerana Q, R dan T sudah dikaitkan oleh QR dan QT.']),
          ('Langkah 3', ['Graf yang terhasil ialah pokok.', 'Jumlah pemberat minimum = 9 + 11 + 13 + 18 = 51'])], s, 1, 17),
  SVh(o, 'Graf berpemberat dan pokok pemberat minimum', h))

# =====================================================================
# 5.1.4 RANGKAIAN DAN PENYELESAIAN MASALAH
# =====================================================================
s = '5.1.4'
c = COL[s]
S(s, 'CONTOH 14', 'Mewakilkan maklumat dalam bentuk rangkaian',
  p('Rangkaian merupakan satu bentuk graf yang unik dan boleh digunakan untuk mewakilkan maklumat yang bertindih atau bersilang. Rangkaian yang dilukis dalam bentuk grafik membolehkan perkaitan suatu maklumat mudah difahami.')
  + bul(s, ['<b>Rangkaian pengangkutan</b>: pemberat boleh mewakili jarak, masa perjalanan atau kos perjalanan. Contoh sistem navigasi ialah GPS.',
            '<b>Rangkaian sosial</b>: digunakan untuk peluang pekerjaan, perniagaan, bersosial, pendidikan dan media sosial.'])
  + note('Gunakan rangkaian sosial secara berhati-hati dan bersederhana agar tidak leka, terperdaya atau tertipu.', 'Celik minda:'),
  work([('CONTOH 14', ['Tiga laluan dari Seremban ke Port Dickson: laluan P (32 km, 45 minit), laluan Q (35 km, 35 minit) dan laluan R (38 km, 40 minit). Mengapakah laluan P mengambil masa paling lama walaupun jaraknya paling pendek?']),
        ('Penyelesaian', ['Laluan P mungkin melalui kawasan bandar yang sesak dengan lebih banyak lampu isyarat dan pengguna jalan raya berbanding laluan lain.'])], s, 1, 18))

minat = [('Edmund', 'Badminton', 'Catur'), ('Azwan', 'Bola sepak', 'Sepak takraw'), ('Rajan', 'Catur', 'Bola sepak'), ('Aina', 'Catur', 'Bola jaring'), ('Maria', 'Badminton', 'Bola jaring'), ('Jenny', 'Bola jaring', 'Bola tampar')]
VS = {'Catur': (250, 70), 'Bola sepak': (420, 170), 'Sepak takraw': (440, 360), 'Badminton': (80, 170), 'Bola jaring': (150, 360), 'Bola tampar': (300, 430)}
ES = [dict(a=a, b=b, w=n, wc=TX) for n, a, b in minat]
o = gdraw(VS, ES, r=0, wfs=14)
o += ''.join(f'<rect x="{x - 58}" y="{y - 17}" width="116" height="34" rx="12" fill="#0E1626" stroke="{PU}" stroke-width="2.5"/>' + GF.T(x, y, n, TX, 14) for n, (x, y) in VS.items())
S(s, 'CONTOH 15', 'Menukar jadual kepada rangkaian',
  p('Jadual menunjukkan data enam orang murid dan dua jenis permainan yang diminati. Tukar maklumat yang diberi dalam bentuk rangkaian.')
  + table(['Nama murid', 'Permainan'], [[n, f'{a}, {b}'] for n, a, b in minat], c, 16)
  + note('Katakan bucu ialah jenis permainan dan tepi mewakili nama murid. Pilih maklumat yang tidak bersilang sebagai tepi.', 'Tip:'),
  SVh(GF.rv(o), 'Rangkaian permainan dan murid', 460, 10))

tix = [('Bas', '9 jam', 'RM60 – RM70', 'Dewasa sahaja: harga tiket seorang'), ('Kereta api (tempat tidur)', '16 jam', 'Kanak-kanak RM30 – RM36, dewasa RM48 – RM54', ''), ('Kereta api (tanpa tempat tidur)', '16 jam', 'Kanak-kanak RM25, dewasa RM42', ''), ('Kereta', '8 jam', 'RM130 (sebuah kereta)', '')]
assert 2 * 48 + 2 * 30 > 130 and 2 * 42 + 2 * 25 > 130 and 48 - 42 == 6
S(s, 'CONTOH 16', 'Menyelesaikan masalah yang melibatkan rangkaian',
  p('Jadual di sebelah menunjukkan pilihan pengangkutan awam, anggaran masa perjalanan dan anggaran kos dari Kuala Lumpur ke Kota Bharu. Tentukan jenis pengangkutan yang harus dipilih dalam situasi berikut. Berikan justifikasi anda.')
  + bul(s, ['(a) Perjalanan yang melibatkan seorang dewasa tanpa kekangan masa.', '(b) Perjalanan yang melibatkan seorang dewasa dengan kekangan masa.', '(c) Perjalanan yang melibatkan dua orang dewasa dan dua orang kanak-kanak.'])
  , stack(table(['Pengangkutan', 'Masa', 'Anggaran kos'], [[a, b, cc] for a, b, cc, _ in tix], c, 15), work([('Penyelesaian', ['(a) Kereta api dengan kemudahan tempat tidur kerana kosnya hanya beza RM6 berbanding tanpa tempat tidur, dan lebih murah daripada memandu kereta.',
                            '(b) Bas kerana lebih jimat masa daripada kereta api dan penumpang boleh berehat sepanjang perjalanan.',
                            '(c) Kereta, kerana RM130 lebih murah daripada tambang kereta api untuk empat orang (sekurang-kurangnya 2 × RM42 + 2 × RM25 = RM134).'])], s, 1, 15)))

VF = {'Kuala Lumpur': (90, 170), 'Kuching': (300, 330), 'Miri': (360, 170), 'Labuan': (390, 60), 'Kota Kinabalu': (460, 120) }
VF = {'KL': (80, 220), 'KCH': (250, 380), 'MYY': (290, 270), 'LBU': (320, 70), 'BKI': (420, 170)}
EF = [ed('KL-KCH'), ed('KL-MYY'), ed('KL-BKI'), ed('KL-LBU'), ed('LBU-BKI'), ed('KCH-MYY'), ed('MYY-BKI')]
lab = {'KL': 'Kuala Lumpur', 'KCH': 'Kuching', 'MYY': 'Miri', 'LBU': 'Labuan', 'BKI': 'Kota Kinabalu'}
o = gdraw(VF, EF, r=0) + ''.join(f'<rect x="{x - 56}" y="{y - 17}" width="112" height="34" rx="12" fill="#0E1626" stroke="{PU}" stroke-width="2.5"/>' + GF.T(x, y, lab[n], TX, 13) for n, (x, y) in VF.items())
S(s, 'CONTOH 17', 'Rangkaian penerbangan',
  p('Rajah di sebelah menunjukkan laluan penerbangan domestik oleh sebuah syarikat penerbangan swasta di Malaysia.')
  + bul(s, ['(a) Encik Joshua bekerja di Kuala Lumpur. Beliau ingin melawat keluarganya di Kota Kinabalu. Nyatakan laluan penerbangan terbaik yang boleh dipilih.', '(b) Apakah kelebihan dan kekurangan bagi pilihan penerbangan pada jawapan (a)?'])
  + work([('Penyelesaian', ['(a) Penerbangan terus dari Kuala Lumpur ke Kota Kinabalu, atau dari Kuala Lumpur ke Labuan dan seterusnya ke Kota Kinabalu.',
                            '(b) Penerbangan terus boleh menjimatkan masa dan kos perjalanan. Penerbangan melalui Labuan mengambil masa yang lebih panjang dan kemungkinan kos juga lebih tinggi.'])], s, 1, 17),
  SVh(o, 'Rangkaian penerbangan domestik', 400, 20))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'teorigraf', 'slides.js')
HEAD = '/* Nota Bab 5 ikut buku teks Matematik T4 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
