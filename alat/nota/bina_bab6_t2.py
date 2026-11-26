"""Bab 6 T2 Bentuk Geometri Tiga Dimensi: nota ikut buku teks (ayat buku, nombor ditukar).
Rajah 3D guna pepejal.py (pelukis lama tools/bentuk3d)."""
import os, math, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import pepejal as G

SUBS = [{"no": "6.1", "name": "Sifat Geometri Bentuk Tiga Dimensi", "col": "#2DD4BF"},
        {"no": "6.2", "name": "Bentangan Bentuk Geometri Tiga Dimensi", "col": "#A78BFA"},
        {"no": "6.3", "name": "Luas Permukaan Bentuk Geometri Tiga Dimensi", "col": "#FB923C"},
        {"no": "6.4", "name": "Isi Padu Bentuk Geometri Tiga Dimensi", "col": "#38BDF8"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()

# ---------- pembantu teks ----------
j, t, s_, p_, l_ = '<i>j</i>', '<i>t</i>', '<i>s</i>', '<i>p</i>', '<i>l</i>'
PI = 'π'


def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'


P7 = fr(22, 7); TIGA = fr(1, 3); SEP = fr(1, 2)


def sq(x):
    return f'√<span style="display:inline-block;border-top:2px solid currentColor;padding:2px 3px 0;line-height:1.15">{x}</span>'


def hd(x, c):
    return f'<div style="font-weight:800;font-size:20px;color:{c};margin:2px 0 -6px">{x}</div>'


def pen(sub, items, label=True):
    return (p('<b>Penyelesaian:</b>') if label else '') + steps(sub, items)


def work(blocks, sub, cols=1, fs=19):
    c = COL[sub]
    out = []
    for lb, lines in blocks:
        inner = ''.join(f'<div class="rv">{ln}</div>' for ln in lines)
        out.append(f'<div>{f"<b style=\"color:{c}\">{lb}</b> " if lb else ""}{inner}</div>')
    return ('<div style="width:100%;align-self:flex-start;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:18px 22px;'
            + ('display:grid;grid-template-columns:1fr 1fr;gap:12px 18px;' if cols == 2 else 'display:flex;flex-direction:column;gap:10px;')
            + f'font-size:{fs}px;line-height:1.5">' + ''.join(out) + '</div>')


def formula(html, c):
    return f'<div style="display:inline-block;margin:6px 0;padding:10px 18px;border:2px solid {c};border-radius:14px;background:#131C2E;font-size:21px;font-weight:700">{html}</div>'


def stack(*xs):
    return '<div style="width:100%;display:flex;flex-direction:column;gap:12px">' + ''.join(xs) + '</div>'


def table(head, rows, c, fs=19):
    th = ''.join(f'<th style="padding:9px 12px;text-align:left;font-size:17px;color:{c};border-bottom:2px solid #22304A">{h}</th>' for h in head)
    tb = ''.join('<tr>' + ''.join(f'<td style="padding:8px 12px;font-size:{fs}px;font-weight:600;border-bottom:1px solid #22304A;vertical-align:top">{x}</td>' for x in r) + '</tr>' for r in rows)
    return f'<div class="sl-table" style="width:100%"><table style="width:100%;border-collapse:collapse;background:#131C2E"><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'


def num(x, d=2):
    v = round(x + 1e-9, d)
    t_ = f'{v:,.{d}f}'.rstrip('0').rstrip('.') if d else f'{v:,.0f}'
    return t_.replace(',', ' ')


# ---------- pembantu rajah ----------
_T0 = G.T


def _T(x, y, t_, *a, **k):
    return _T0(x, y, str(t_).replace('<i>', '<tspan font-style="italic">').replace('</i>', '</tspan>'), *a, **k)


G.T = _T


def cub_lab(S_, tp, tl, tt, col=TX, size=17):
    v = max(range(4), key=lambda i: S_.P[i][1])
    o = ''
    for n in ((v + 1) % 4, (v + 3) % 4):
        o += S_.lab(v, n, tp if {v, n} in ({0, 1}, {2, 3}) else tl, col, size)
    side = min(((v + 1) % 4, (v + 3) % 4), key=lambda i: S_.P[i][0])
    far = max(((v + 1) % 4, (v + 3) % 4), key=lambda i: S_.P[i][0])
    return o + S_.lab(far, far + 4, tt, col, size, 30)


T, LINE, POLY, PATH, CIRC, ELL, DOT, RECT = G.T, G.LINE, G.POLY, G.PATH, G.CIRC, G.ELL, G.DOT, G.RECT
TR, PA, PU, AM, PK, GR, MU3, TX = G.TR, G.PA, G.PU, G.AM, G.PK, G.GR, G.MU3, G.TX


def SV(inner, aria):
    return G.svg(inner, aria)


def rv(x):
    return f'<g class="rv">{x}</g>'


def mid(a, b):
    return ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)


def cen(pts):
    return (sum(x for x, _ in pts) / len(pts), sum(y for _, y in pts) / len(pts))


def arrow(a, b, col=MU3, w=3):
    return LINE(a, b, col, w) + G.PATH(_ah(a, b), 'none', col, w)


def _ah(a, b):
    ang = math.atan2(b[1] - a[1], b[0] - a[0]); L = 13
    p1 = (b[0] - L * math.cos(ang - .45), b[1] - L * math.sin(ang - .45)); p2 = (b[0] - L * math.cos(ang + .45), b[1] - L * math.sin(ang + .45))
    return f'M{p1[0]:.1f} {p1[1]:.1f} L{b[0]:.1f} {b[1]:.1f} L{p2[0]:.1f} {p2[1]:.1f}'


def sector(c, R, a0, a1, col, fillop='33', sw=3):
    """Sektor pusat c, sudut skrin a0→a1 (darjah, 90 = bawah)."""
    x0, y0 = c[0] + R * math.cos(math.radians(a0)), c[1] + R * math.sin(math.radians(a0))
    x1, y1 = c[0] + R * math.cos(math.radians(a1)), c[1] + R * math.sin(math.radians(a1))
    lg = 1 if (a1 - a0) % 360 > 180 else 0
    return f'<path d="M{c[0]:.1f} {c[1]:.1f} L{x0:.1f} {y0:.1f} A{R:.1f} {R:.1f} 0 {lg} 1 {x1:.1f} {y1:.1f} Z" fill="{col}{fillop}" stroke="{col}" stroke-width="{sw}" stroke-linejoin="round"/>'


def tri(a, b, c, col, op='33', sw=3):
    return POLY([a, b, c], f'{col}{op}', col, sw)


def rect(x, y, w, h, col, op='33', sw=3):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{col}{op}" stroke="{col}" stroke-width="{sw}"/>'


def solid(V, Fc, bx, yaw=-32, pitch=22):
    return G.Solid(V, Fc, G.Cam(yaw, pitch), box=bx)


def front_edge(S_, idx):
    """tepi tapak paling hadapan (skrin paling bawah) di antara bucu idx (kitaran)."""
    best = None
    for k in range(len(idx)):
        a, b = idx[k], idx[(k + 1) % len(idx)]
        m_ = mid(S_.P[a], S_.P[b])
        if best is None or m_[1] > best[0][1]:
            best = (m_, a, b)
    return best


def lab_dim(S_, i, k, text, col=TX, size=18, off=24):
    return S_.lab(i, k, text, col, size, off)


def cyl_lab(c, r, h, tj, tt, col=TX):
    top = (c[0], c[1] - h)
    return (LINE(top, (c[0] + r, top[1]), PK, 3) + DOT(top, PK, 5) + T(c[0] + r / 2, top[1] - 16, tj, col, 18)
            + G.DIMLINE((c[0] + r, top[1]), (c[0] + r, c[1]), tt, MU3, 24, 18, -1))


def cone_lab(c, r, h, tj='', tt='', ts='', col=TX):
    A = (c[0], c[1] - h); o = ''
    if tt:
        o += LINE(A, c, PK, 2.5, '7 6') + G.right_angle(c, (-1, 0), (0, -1), MU3, 12) + T(c[0] - 18, c[1] - h / 2, tt, col, 18, 'end')
    if tj:
        o += LINE(c, (c[0] + r, c[1]), PK, 3) + DOT(c, PK, 5) + T(c[0] + r / 2, c[1] + 22, tj, col, 18)
    if ts:
        m_ = mid(A, (c[0] + r, c[1]))
        o += T(m_[0] + 30, m_[1] - 4, ts, col, 18, 'start')
    return o


def sph_lab(c, r, tj, col=TX):
    return LINE(c, (c[0] + r, c[1]), PK, 3) + DOT(c, PK, 5) + T(c[0] + r / 2, c[1] - 16, tj, col, 18)


# =====================================================================
# 6.1 SIFAT GEOMETRI BENTUK TIGA DIMENSI
# =====================================================================
s = '6.1'
c = COL[s]
# rajah: 2D vs 3D
fig = RECT(14, 14, 230, 442) + RECT(256, 14, 230, 442)
fig += T(129, 52, 'Dua dimensi', c, 20) + T(371, 52, 'Tiga dimensi', c, 20)
fig += rect(74, 160, 130, 110, TR, '33', 4) + T(139, 296, 'panjang', MU3, 17) + T(66, 221, 'lebar', MU3, 17, 'end')
fig += T(139, 221, 'rata', TX, 16)
V, Fc = G.cuboid(1.5, 1.1, 1.2); cb = solid(V, Fc, (300, 160, 430, 290))
fig += cb.draw(fill=TR, edge=AM) + cub_lab(cb, 'panjang', 'kedalaman', 'lebar', MU3, 15)
fig += T(129, 400, 'panjang, lebar', TX, 17) + T(371, 400, 'panjang, lebar, kedalaman', TX, 16)
S(s, 'KONSEP', 'Bentuk dua dimensi dan tiga dimensi',
  p('Bentuk geometri dua dimensi seperti segi tiga, segi empat tepat dan poligon mempunyai panjang dan lebar. Selain itu bentuk geometri dua dimensi mempunyai permukaan yang rata. Bentuk tiga dimensi pula mempunyai panjang, lebar dan kedalaman. Bentuk ini mempunyai permukaan sama ada rata atau melengkung.')
  + de(s, 'Bentuk tiga dimensi terbina daripada cantuman bentuk dua dimensi.')
  + note('<b>Bentuk dua dimensi</b> tidak mempunyai isi padu. <b>Bentuk tiga dimensi</b> mempunyai tiga ukuran asas, iaitu panjang, lebar dan tinggi. Bentuk tiga dimensi mempunyai isi padu.', 'Tip:'),
  SV(fig, 'Segi empat tepat dua dimensi dan kuboid tiga dimensi'))

# rajah: prisma & piramid
fig = RECT(14, 14, 472, 214) + RECT(14, 242, 472, 214)
V, Fc = G.prism_x([(0, 0), (0, 2), (1.75, 1)], 3.2); pr = solid(V, Fc, (70, 52, 340, 212), -38, 20)
fig += pr.draw(fill=TR, edge=AM, hl=[0, 1], hlcol=PA)
for fi in (0, 1):
    if pr.vis[fi]:
        q = cen([pr.P[k] for k in Fc[fi]]); fig += T(q[0], q[1], 'tapak', TX, 15)
fig += T(420, 110, 'Prisma', c, 20) + T(420, 140, 'tapak: segi tiga', MU3, 15) + T(420, 162, '(dua tapak)', MU3, 15)
V, Fc = G.pyramid([(0, 0), (2, 0), (2, 2), (0, 2)], 1.9); py = solid(V, Fc, (90, 282, 330, 436), -30, 18)
fig += py.draw(fill=TR, edge=AM) + G.DOT(py.P[4], PK, 7) + T(py.P[4][0], py.P[4][1] - 22, 'puncak', PK, 17)
bq = cen([py.P[k] for k in range(4)]); fig += T(bq[0], bq[1] + 4, 'tapak', TX, 15)
fig += T(420, 340, 'Piramid', c, 20) + T(420, 370, 'tapak: segi empat', MU3, 15) + T(420, 392, '(satu tapak)', MU3, 15)
S(s, 'KONSEP', 'Sifat geometri prisma dan piramid',
  hd('Prisma', c)
  + bul(s, ['Mempunyai dua tapak rata berbentuk poligon yang kongruen dan selari.', 'Permukaan rata dengan muka lainnya berbentuk segi empat.', 'Mempunyai keratan rentas yang seragam.'])
  + hd('Piramid', c)
  + bul(s, ['Mempunyai satu tapak rata berbentuk poligon.', 'Muka lainnya berbentuk segi tiga yang bertemu di puncak.'])
  + note('Kongruen bermaksud perihal yang mempunyai saiz dan bentuk yang sama. Piramid dan prisma dinamakan mengikut bentuk tapak.'),
  SV(fig, 'Prisma segi tiga dengan dua tapak dan piramid tapak segi empat dengan puncak'))

# rajah: silinder, kon, sfera
fig = RECT(14, 14, 150, 442) + RECT(175, 14, 150, 442) + RECT(336, 14, 150, 442)
fig += T(89, 50, 'Silinder', c, 20) + T(250, 50, 'Kon', c, 20) + T(411, 50, 'Sfera', c, 20)
fig += G.cylinder((89, 330), 52, 190, top_hl=PA) + T(89, 140, 'tapak', TX, 14) + T(89, 392, 'tapak', MU3, 15)
kn, A = G.cone((250, 330), 56, 210); fig += kn + G.DOT(A, PK, 7) + T(250, 98, 'puncak', PK, 16) + T(250, 392, 'tapak', MU3, 15)
fig += G.sphere((411, 250), 62) + G.DOT((411, 250), PK, 6) + T(411, 345, 'pusat sfera', PK, 15)
fig += T(89, 425, '2 tapak, 1 lengkung', MU3, 13) + T(250, 425, '1 tapak, 1 puncak', MU3, 13) + T(411, 425, '1 lengkung', MU3, 13)
S(s, 'KONSEP', 'Sifat geometri silinder, kon dan sfera',
  hd('Silinder', c)
  + bul(s, ['Dua tapak rata berbentuk bulatan yang kongruen dan selari.', 'Satu permukaan sisi melengkung yang mencantumkan dua tapak.'])
  + hd('Kon', c)
  + bul(s, ['Satu tapak rata berbentuk bulatan.', 'Mempunyai satu puncak.', 'Satu permukaan melengkung menyambungkan tapak dengan puncak.'])
  + hd('Sfera', c)
  + bul(s, ['Semua titik pada permukaan sfera mempunyai satu titik tetap berjarak sama dari pusat sfera.', 'Mempunyai satu permukaan melengkung.']),
  SV(fig, 'Silinder, kon dan sfera dengan tapak, puncak dan pusat sfera'))

# Contoh: nyatakan bentuk
fig = RECT(14, 14, 150, 442) + RECT(175, 14, 150, 442) + RECT(336, 14, 150, 442)
fig += T(89, 50, '(a)', c, 20) + T(250, 50, '(b)', c, 20) + T(411, 50, '(c)', c, 20)
kn, A = G.cone((89, 320), 55, 200)
V, Fc = G.pyramid([(0, 0), (2, 0), (2, 2), (0, 2)], 2.2); py = solid(V, Fc, (190, 130, 310, 330), -30, 18)
fig += rv(kn + G.DOT(A, PK, 7) + T(89, 400, 'Kon', TX, 22))
fig += rv(py.draw(fill=TR, edge=AM) + G.DOT(py.P[4], PK, 7) + T(250, 400, 'Piramid', TX, 22))
fig += rv(G.sphere((411, 240), 60) + G.DOT((411, 240), PK, 6) + T(411, 400, 'Sfera', TX, 22))
S(s, 'CONTOH 1', 'Mengenal pasti bentuk tiga dimensi',
  p('Nyatakan bentuk tiga dimensi yang mempunyai sifat geometri seperti berikut.')
  + bul(s, ['(a) Mempunyai satu puncak dengan satu permukaan melengkung.', '(b) Mempunyai satu puncak dengan tapaknya berbentuk poligon.', '(c) Semua titik di permukaannya mempunyai jarak yang sama dari pusat objek.'])
  + p('<b>Penyelesaian:</b> (a) Kon (b) Piramid (c) Sfera'),
  SV(fig, 'Kon, piramid dan sfera'))

# =====================================================================
# 6.2 BENTANGAN
# =====================================================================
s = '6.2'
c = COL[s]
CROSSNET = [(1, 0), (0, 1), (1, 1), (2, 1), (3, 1), (1, 2)]
assert G.cube_net_ok(CROSSNET)
V, Fc = G.cuboid(1, 1, 1); cb = solid(V, Fc, (30, 150, 160, 290), -30, 24)
fig = cb.draw(fill=PU, edge=PU) + T(95, 120, 'Kubus', TX, 20)
fig += PATH('M170 220 C 190 200, 210 200, 228 220', 'none', MU3, 3) + PATH('M220 210 L230 222 L216 226', 'none', MU3, 3) + T(200, 186, 'buka', MU3, 17)
k = 56; x0, y0 = 252, 148
fig += G.NET(CROSSNET, x0, y0, k, PU, base=(1, 1)) + T(x0 + 1.5 * k, y0 + 1.5 * k, 'tapak', TX, 16)
fig += T(250, 68, 'Bentangan kubus', MU3, 19, halo=False)
fig += T(250, 400, 'Dua dimensi', PU, 19, halo=False)
S(s, 'DEFINISI', 'Bentangan',
  de(s, 'Bentangan suatu bentuk tiga dimensi diperoleh dengan membuka dan membentangkan setiap permukaan objek tiga dimensi menjadi dua dimensi.')
  + p('Susunan bentangan bentuk tiga dimensi boleh dipelbagaikan.')
  + note('Sebuah kubus mempunyai pelbagai bentangan. Sfera tidak mempunyai bentangan kerana permukaannya tidak boleh dibentangkan menjadi rata.', 'Nota:'),
  SV(fig, 'Kubus dibuka menjadi bentangan enam segi empat sama'))


def cyl_net(cx, y, w, h, r, col=PU):
    o = CIRC((cx, y + r), r, f'{col}33', col, 3) + rect(cx - w / 2, y + 2 * r, w, h, col) + CIRC((cx, y + 3 * r + h), r, f'{col}33', col, 3)
    return o


def cone_net(cx, cy, R, ang, r, col=PU):
    """sektor menghala ke bawah (sudut ang darjah) + bulatan tapak di bawahnya."""
    return sector((cx, cy), R, 90 - ang / 2, 90 + ang / 2, col) + CIRC((cx, cy + R + r), r, f'{col}33', col, 3)


# silinder & kon
fig = RECT(14, 14, 472, 214) + RECT(14, 242, 472, 214)
fig += G.cylinder((110, 205), 48, 112) + cyl_lab((110, 205), 48, 112, j, t) + T(40, 40, 'Silinder', c, 19, 'start')
fig += arrow((190, 120), (240, 120))
fig += cyl_net(360, 26, 190, 92, 30) + T(360, 104 + 0, f'lilitan = 2{PI}{j}', TX, 16) + T(463, 132, t, TX, 18)
fig += T(360, 42, j, TX, 16)
kn, A = G.cone((110, 420), 52, 140); fig += kn + cone_lab((110, 420), 52, 140, ts=f'{s_}') + T(110, 268, 'Kon', c, 19)
fig += arrow((190, 350), (240, 350))
fig += cone_net(360, 262, 118, 116, 34) + T(330, 330, s_, TX, 18) + T(360, 414, j, TX, 16)
S(s, 'KONSEP', 'Bentangan silinder dan kon',
  p('Jadual menunjukkan bentuk geometri tiga dimensi dan bentangannya.')
  + table(['Bentuk geometri', 'Bentangan'], [['Silinder', '2 bulatan dan 1 segi empat tepat'], ['Kon', '1 bulatan dan 1 sektor']], c)
  + note(f'{s_} ialah tinggi sendeng kon. Panjang segi empat tepat dalam bentangan silinder ialah lilitan bulatan.', 'Tip:')
  + note('Kon dihasilkan dengan putaran sebuah segi tiga bersudut tegak.', 'Tahukah anda:'),
  SV(fig, 'Silinder dan kon dengan bentangan masing-masing'))


def sqpyr_net(cx, cy, a, hs, col=PU):
    h = a / 2
    o = rect(cx - h, cy - h, a, a, PA, '55')
    o += tri((cx - h, cy - h), (cx + h, cy - h), (cx, cy - h - hs), col) + tri((cx - h, cy + h), (cx + h, cy + h), (cx, cy + h + hs), col)
    o += tri((cx - h, cy - h), (cx - h, cy + h), (cx - h - hs, cy), col) + tri((cx + h, cy - h), (cx + h, cy + h), (cx + h + hs, cy), col)
    return o


def triprism_net(x0, y0, a, L, col=PU):
    o = rect(x0, y0, a, L, col) + rect(x0 + a, y0, a, L, col) + rect(x0 + 2 * a, y0, a, L, col)
    hh = a * math.sqrt(3) / 2
    o += tri((x0 + a, y0), (x0 + 2 * a, y0), (x0 + 1.5 * a, y0 - hh), PA, '55') + tri((x0 + a, y0 + L), (x0 + 2 * a, y0 + L), (x0 + 1.5 * a, y0 + L + hh), PA, '55')
    return o


fig = RECT(14, 14, 472, 214) + RECT(14, 242, 472, 214)
V, Fc = G.pyramid([(0, 0), (2, 0), (2, 2), (0, 2)], 1.8); py = solid(V, Fc, (40, 70, 180, 200), -30, 18)
fm, a_, b_ = front_edge(py, [0, 1, 2, 3])
fig += py.draw(fill=PU, edge=PU) + LINE(py.P[4], fm, PK, 2.5, '6 5') + T(fm[0] + 6, fm[1] + 22, f'{s_}', TX, 16) + T(110, 46, 'Piramid segi empat', c, 17)
fig += arrow((200, 120), (250, 120))
fig += sqpyr_net(370, 121, 64, 44)
V, Fc = G.prism_x([(0, 0), (0, 2), (1.73, 1)], 3); pr = solid(V, Fc, (30, 300, 190, 420), -38, 20)
fig += pr.draw(fill=PU, edge=PU, hl=[0, 1], hlcol=PA) + T(110, 268, 'Prisma segi tiga', c, 17)
fig += arrow((200, 350), (250, 350))
fig += triprism_net(282, 296, 52, 108)
S(s, 'KONSEP', 'Bentangan piramid dan prisma',
  table(['Bentuk geometri', 'Bentangan'], [['Piramid segi empat', '1 segi empat sama dan 4 segi tiga'], ['Prisma segi tiga', '3 segi empat tepat dan 2 segi tiga']], c)
  + note(f'{s_} ialah tinggi sendeng piramid, iaitu tinggi bagi muka segi tiga.', 'Tip:')
  + note('Bentangan dilipat di sepanjang tepi untuk membina semula bentuk tiga dimensi.', 'Ingat:'),
  SV(fig, 'Piramid segi empat dan prisma segi tiga dengan bentangan masing-masing'))

# Contoh 1: lakarkan bentangan
fig = RECT(14, 14, 150, 442) + RECT(175, 14, 150, 442) + RECT(336, 14, 150, 442)
fig += T(89, 44, '(a)', c, 20) + T(250, 44, '(b)', c, 20) + T(411, 44, '(c)', c, 20)
kn, A = G.cone((89, 200), 44, 130); fig += kn
tv = [(0, 0), (2, 0), (1, 1.73)]
V, Fc = G.pyramid(tv, 1.7); tp = solid(V, Fc, (195, 70, 305, 210), -20, 18); fig += tp.draw(fill=PU, edge=PU)
V, Fc = G.prism([(0, 0), (1.6, 0), (0.8, 1.39)], 2.2); pr = solid(V, Fc, (370, 70, 452, 215), -25, 22); fig += pr.draw(fill=PU, edge=PU)
fig += T(250, 245, 'Penyelesaian', MU3, 16)
fig += rv(cone_net(89, 268, 70, 150, 26))
a = 46; bx, by = 204, 420
fig += rv(tri((bx, by - 2 * a * .866 * 0) , (bx + 2 * a, by), (bx + a, by - 2 * a * .866), PU) + tri((bx + a / 2, by - a * .866), (bx + 1.5 * a, by - a * .866), (bx + a, by), PU) )
a = 34; L = 66; x0_ = 360; y0_ = 300
fig += rv(rect(x0_, y0_, a, L, PU) + rect(x0_ + a, y0_, a, L, PU) + rect(x0_ + 2 * a, y0_, a, L, PU)
          + tri((x0_ + a, y0_), (x0_ + 2 * a, y0_), (x0_ + 1.5 * a, y0_ - a * .866), PU) + tri((x0_ + a, y0_ + L), (x0_ + 2 * a, y0_ + L), (x0_ + 1.5 * a, y0_ + L + a * .866), PU))
S(s, 'CONTOH 2', 'Melakar bentangan',
  p('Lakarkan bentangan bagi bentuk geometri tiga dimensi berikut.')
  + bul(s, ['(a) Kon', '(b) Piramid tapak segi tiga', '(c) Prisma segi tiga'])
  + pen(s, ['(a) 1 sektor dan 1 bulatan', '(b) 4 segi tiga', '(c) 3 segi empat tepat dan 2 segi tiga']),
  SV(fig, 'Kon, piramid tapak segi tiga dan prisma segi tiga serta bentangan masing-masing'))

# =====================================================================
# 6.3 LUAS PERMUKAAN
# =====================================================================
s = '6.3'
c = COL[s]
S(s, 'KONSEP', 'Luas permukaan',
  de(s, 'Luas permukaan bentuk geometri tiga dimensi dapat dihitung dengan menjumlahkan luas semua permukaan bentuk geometri tersebut.')
  + p('Rumus luas permukaan setiap bentuk diperoleh daripada bentangannya.')
  + note('Kubus juga dikenali sebagai heksahedron kerana kubus mempunyai enam permukaan.', 'Tahukah anda:'),
  table(['Bentuk', 'Luas permukaan'], [
      ['Kubus', '6 × luas segi empat sama'],
      ['Kuboid', '4 × luas segi empat tepat + 2 × luas segi empat sama'],
      ['Piramid', '1 × luas segi empat sama + 4 × luas segi tiga'],
      ['Prisma', '2 × luas segi tiga + 3 × luas segi empat'],
      ['Silinder', '2 × luas bulatan + 1 × luas segi empat tepat'],
      ['Kon', '1 × luas bulatan + 1 × luas permukaan melengkung']], c, 18))

# silinder
fig = G.cylinder((90, 310), 52, 150) + T(90, 120, 'Silinder', c, 19)
fig += arrow((165, 235), (215, 235))
fig += CIRC((340, 85), 38, f'{PU}33', PU, 3) + LINE((340, 85), (378, 85), PK, 3) + T(359, 72, j, TX, 18)
fig += rect(240, 123, 200, 130, PU) + CIRC((340, 291), 38, f'{PU}33', PU, 3)
fig += G.DIMLINE((240, 253), (440, 253), f'2{PI}{j}', MU3, 70, 18)
fig += T(465, 188, t, TX, 20)
fig += T(250, 420, f'panjang = lilitan bulatan = 2{PI}{j}', MU3, 17, halo=False) + T(250, 448, 'lebar = tinggi silinder', MU3, 17, halo=False)
S(s, 'RUMUS', 'Luas permukaan silinder',
  p('Luas permukaan sebuah silinder tertutup dihitung daripada bentangan silinder.')
  + p('Daripada bentangan silinder, panjang segi empat ialah lilitan bulatan dan lebar segi empat ialah tinggi silinder.')
  + steps(s, ['Luas permukaan silinder = (2 × luas bulatan) + luas segi empat', f'= (2 × {PI}{j}²) + (2{PI}{j} × {t})', f'= 2{PI}{j}² + 2{PI}{j}{t}'])
  + note(f'Luas bulatan = {PI}{j}². Lilitan bulatan = 2{PI}{j}.', 'Imbas kembali:'),
  SV(fig, 'Bentangan silinder: dua bulatan dan segi empat tepat'))

# kon
fig = sector((95, 60), 120, 25, 155, PU) + CIRC((95, 222), 42, f'{PU}33', PU, 3) + T(55, 120, s_, TX, 18) + T(95, 228, j, TX, 18)
fig += T(250, 52, 'Potong kepada 88 sektor', MU3, 16, halo=False)
z = ''
x0, y0, w_, h_ = 200, 120, 280, 110
n = 22
for i in range(n):
    xa = x0 + w_ * i / n; xb = x0 + w_ * (i + .5) / n; xc = x0 + w_ * (i + 1) / n
    z += POLY([(xa, y0 + h_), (xb, y0), (xc, y0 + h_)], f'{PU}33', PU, 1.5)
    if i < n - 1:
        z += POLY([(xb, y0), (xc, y0 + h_), (x0 + w_ * (i + 1.5) / n, y0)], f'{AM}26', AM, 1.5)
fig += z + T(x0 - 10, y0 - 6, 'A', TX, 18) + T(x0 + w_ + 12, y0 - 6, 'B', TX, 18) + T(x0 + w_ + 12, y0 + h_ + 8, 'C', TX, 18) + T(x0 - 10, y0 + h_ + 8, 'D', TX, 18)
fig += T(x0 + w_ + 26, y0 + h_ / 2, s_, TX, 18)
fig += T(340, 262, f'AB + CD = lilitan tapak = 2{PI}{j}', MU3, 16, halo=False)
fig += rv(rect(200, 300, 280, 110, PU, '33', 3) + T(340, 355, f'{PI}{j} × {s_} = {PI}{j}{s_}', TX, 20) + G.DIMLINE((200, 410), (480, 410), f'{PI}{j}', MU3, 22, 17) + T(490, 355, s_, TX, 18, 'start'))
fig += rv(T(95, 360, 'Segi empat', MU3, 16) + T(95, 382, 'ABCD', MU3, 16))
S(s, 'RUMUS', 'Luas permukaan kon',
  p('Potong permukaan melengkung kepada 88 sektor yang sama saiz, kemudian susun. Rajah berbentuk segi empat <i>ABCD</i> terhasil. Hasil tambah panjang <i>AB</i> dan <i>CD</i> ialah lilitan tapak kon.')
  + steps(s, [f'Maka, panjang <i>AB</i> = panjang <i>CD</i> = {SEP} × 2{PI}{j} = {PI}{j}',
              f'Luas permukaan melengkung = luas segi empat <i>ABCD</i> = <i>AB</i> × <i>BC</i> = {PI}{j} × {s_} = {PI}{j}{s_}',
              f'Luas permukaan kon = luas tapak + luas permukaan melengkung = {PI}{j}² + {PI}{j}{s_}'])
  + note(f'Semakin kecil bahagian permukaan melengkung dipotong, susunan potongan semakin menyerupai bentuk segi empat tepat.', 'Tip:'),
  SV(fig, 'Permukaan melengkung kon dipotong dan disusun menjadi segi empat ABCD'))

# Contoh 3 (a)(b)
fig = RECT(14, 14, 472, 214) + RECT(14, 242, 472, 214) + T(40, 46, '(a)', c, 19, 'start') + T(40, 274, '(b)', c, 19, 'start')
V, Fc = G.cuboid(1, 1, 1); cb = solid(V, Fc, (150, 46, 340, 206)); fig += cb.draw(fill=TR, edge=AM) + cub_lab(cb, '5 cm', '5 cm', '5 cm')
V, Fc = G.cuboid(9, 5, 5); kb = solid(V, Fc, (90, 290, 400, 420), -18, 20); fig += kb.draw(fill=TR, edge=AM) + cub_lab(kb, '9 cm', '5 cm', '5 cm')
assert 6 * 5 * 5 == 150 and 4 * 5 * 9 + 2 * 5 * 5 == 230
S(s, 'CONTOH 3', 'Luas permukaan kubus dan kuboid',
  p('Hitung luas permukaan bentuk geometri berikut.')
  + work([('(a) Luas permukaan kubus', ['= 6 × luas segi empat sama', '= 6 × (5 cm × 5 cm)', '= 6 × 25 cm²', '= 150 cm²']),
          ('(b) Luas permukaan kuboid', ['= (4 × luas segi empat tepat) + (2 × luas segi empat sama)', '= (4 × 5 cm × 9 cm) + (2 × 5 cm × 5 cm)', '= (4 × 45 cm²) + (2 × 25 cm²)', '= 230 cm²'])], s, 2, 18),
  SV(fig, 'Kubus bersisi 5 cm dan kuboid 9 cm × 5 cm × 5 cm'))

# Contoh 3 (c)(d)
fig = RECT(14, 14, 472, 214) + RECT(14, 242, 472, 214) + T(40, 46, '(c)', c, 19, 'start') + T(40, 274, '(d)', c, 19, 'start')
V, Fc = G.pyramid([(0, 0), (10, 0), (10, 10), (0, 10)], 4.9); py = solid(V, Fc, (130, 40, 370, 212), -30, 20)
fm, a_, b_ = front_edge(py, [0, 1, 2, 3])
fig += py.draw(fill=TR, edge=AM) + LINE(py.P[4], fm, PK, 2.5, '6 5') + T((py.P[4][0] + fm[0]) / 2 + 12, (py.P[4][1] + fm[1]) / 2, '7 cm', PK, 17, 'start')
fig += py.lab(a_, b_, '10 cm', TX, 17)
fig += py.lab(b_, [k for k in ((b_ + 1) % 4, (b_ + 3) % 4) if k != a_][0], '10 cm', TX, 17)
V, Fc = G.prism_x([(0, 0), (0, 3), (4, 0)], 8)
pr = solid(V, Fc, (70, 270, 430, 436), -35, 18)
fig += pr.draw(fill=TR, edge=AM) + pr.lab(3, 4, '3 cm', TX, 17) + pr.lab(3, 5, '4 cm', TX, 17) + pr.lab(1, 4, '8 cm', TX, 17) + pr.lab(4, 5, '5 cm', TX, 17, 40)
assert 4 * (10 * 7 / 2) + 100 == 240 and (3 * 8 + 4 * 8 + 5 * 8) + 2 * (3 * 4 / 2) == 108 and 3 ** 2 + 4 ** 2 == 5 ** 2
S(s, 'CONTOH 3 (sambungan)', 'Luas permukaan piramid dan prisma',
  p('Hitung luas permukaan bentuk geometri berikut.')
  + work([('(c) Luas permukaan piramid', ['= (4 × luas segi tiga) + (luas segi empat sama)', f'= 4({SEP} × 10 cm × 7 cm) + (10 cm × 10 cm)', '= 140 cm² + 100 cm²', '= 240 cm²']),
          ('(d) Luas permukaan prisma', ['= (3 × luas tapak segi empat) + (2 × luas segi tiga)', f'= [(3 × 8) + (4 × 8) + (5 × 8)] cm² + 2({SEP} × 3 × 4) cm²', '= 96 cm² + 12 cm²', '= 108 cm²'])], s, 2, 18),
  SV(fig, 'Piramid tapak segi empat sama 10 cm dengan tinggi sendeng 7 cm dan prisma segi tiga bersudut tegak'))

# Contoh 4 silinder
fig = G.cylinder((220, 380), 95, 250) + cyl_lab((220, 380), 95, 250, '7 cm', '10 cm')
assert round(2 * 22 / 7 * 49) == 308 and round(2 * 22 / 7 * 70) == 440
S(s, 'CONTOH 4', 'Luas permukaan silinder',
  p(f'Hitung luas permukaan silinder di sebelah. Diberi jejari bulatan ialah 7 cm. (Guna {PI} = {P7})')
  + pen(s, [f'Luas permukaan silinder = 2{PI}{j}² + 2{PI}{j}{t}', f'= (2 × {P7} × 7²) + (2 × {P7} × 7 × 10)', '= 308 cm² + 440 cm²', '= 748 cm²'], False)
  + ans('748 cm²'),
  SV(fig, 'Silinder berjejari 7 cm dan tinggi 10 cm'))

# Contoh 5 kon
kn, A = G.cone((220, 400), 120, 300)
fig = kn + cone_lab((220, 400), 120, 300, '6 cm', '8 cm', '10 cm')
v1, v2 = 22 / 7 * 36, 22 / 7 * 60
assert num(v1) == '113.14' and num(v2) == '188.57' and num(v1 + v2) == '301.71' and 6 ** 2 + 8 ** 2 == 10 ** 2
S(s, 'CONTOH 5', 'Luas permukaan kon',
  p(f'Rajah menunjukkan sebuah kon tegak. Diberi jejari bulatan ialah 6 cm. Hitung luas permukaan kon. (Guna {PI} = {P7})')
  + pen(s, [f'Luas permukaan kon = {PI}{j}² + {PI}{j}{s_}', f'= ({P7} × 6²) + ({P7} × 6 × 10)', '= 113.14 cm² + 188.57 cm²', '= 301.71 cm²'], False)
  + ans('301.71 cm²'),
  SV(fig, 'Kon tegak berjejari 6 cm, tinggi 8 cm dan tinggi sendeng 10 cm'))

# sfera
fig = G.sphere((250, 235), 165) + sph_lab((250, 235), 165, '<tspan font-style="italic">j</tspan> = 7 cm')
assert round(4 * 22 / 7 * 49) == 616
S(s, 'RUMUS', 'Luas permukaan sfera',
  p(f'Luas permukaan sebuah sfera yang berjejari {j} boleh ditentukan dengan menggunakan rumus berikut.')
  + formula(f'Luas permukaan sfera = 4{PI}{j}²', c)
  + p(f'<b style="color:{c}">CONTOH 6</b> Rajah menunjukkan sebuah sfera. Hitung luas permukaan sfera tersebut. Diberi jejari ialah 7 cm. (Guna {PI} = {P7})')
  + pen(s, [f'Luas permukaan = 4{PI}{j}²', f'= 4 × {P7} × 7²', '= 616 cm²'], False),
  SV(fig, 'Sfera berjejari 7 cm'))

# Contoh 7 penyelesaian masalah
V = [(0, 0, 0), (6, 0, 0), (6, 0, 6), (0, 0, 6), (0, 6, 0), (6, 6, 0), (6, 6, 6), (0, 6, 6), (3, 10, 3)]
Fc = [[0, 1, 2, 3], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7], [4, 5, 8], [5, 6, 8], [6, 7, 8], [7, 4, 8]]
bk = solid(V, Fc, (150, 20, 330, 230), -30, 16)
fig = bk.draw(fill=GR, edge=AM) + bk.lab(0, 1, '6 cm', TX, 26, 30)
small = f'<svg viewBox="140 10 200 235" style="width:120px;height:120px;display:block;margin:0 auto">{fig}</svg>'
assert 5 * 36 + 4 * (6 * 5 / 2) == 240 and 3 ** 2 + 4 ** 2 == 25


S(s, 'CONTOH 7', 'Penyelesaian masalah',
  p('Rajah menunjukkan sebuah bongkah, gabungan piramid dan kubus. Tinggi bongkah adalah 10 cm. Hitung luas permukaan gabungan bentuk geometri tiga dimensi tersebut. Nyatakan jawapan dalam unit m².')
  + small
  + work([('Memahami masalah', ['Menghitung luas permukaan bentuk gabungan geometri tiga dimensi.']),
          ('Merancang strategi', ['(i) Menentukan bentuk yang terlibat. (ii) Menentukan rumus luas permukaan bagi setiap bentuk yang terlibat.'])], s, 1, 17),
  work([('Melaksanakan strategi', ['Bentuk yang terlibat ialah kubus dan piramid. Tinggi tegak piramid = 10 − 6 = 4 cm',
                                   f'Tinggi sendeng piramid, {s_} = {sq("4² + 3²")} = 5 cm',
                                   'Jumlah luas permukaan = 5 × (luas segi empat) + 4 × (luas segi tiga)', f'= 5(6 × 6) + 4({SEP} × 6 × 5) = 180 + 60 = 240 cm²']),
        ('Membuat kesimpulan', ['1 m² = 10 000 cm²', f'{fr("240 cm²", "10 000 cm²")} × 1 m² = 0.024 m²', 'Luas permukaan bentuk gabungan tersebut ialah 0.024 m².'])], s, 1, 18))

# =====================================================================
# 6.4 ISI PADU
# =====================================================================
s = '6.4'
c = COL[s]
# rajah: keratan rentas & tapak
fig = RECT(14, 14, 150, 442) + RECT(175, 14, 150, 442) + RECT(336, 14, 150, 442)
V, Fc = G.cuboid(1.2, 1, 2); V = V + [(0, 1, 0), (1.2, 1, 0), (1.2, 1, 1), (0, 1, 1)]
k1 = solid(V, Fc, (36, 90, 142, 330)); fig += k1.draw(fill=TR, edge=AM, hidden=True) + POLY([k1.P[i] for i in (8, 9, 10, 11)], f'{PK}55', PK, 2.5, '6 5')
tb = [(1.6, 0), (2.8, 1.6), (0.6, 1.8)]
V, Fc = G.prism(tb, 2); V = V + [(x, 1, z) for x, z in tb]
k2 = solid(V, Fc, (192, 90, 308, 330)); fig += k2.draw(fill=TR, edge=AM) + POLY([k2.P[i] for i in (6, 7, 8)], f'{PK}55', PK, 2.5, '6 5')
fig += G.cylinder((411, 320), 52, 220) + ELL((411, 210), 52, 16.6, f'{PK}55', PK, 2.5, '6 5')
fig += T(250, 380, 'keratan rentas', PK, 18) + T(250, 408, 'sama bentuk dan saiz dengan tapak', MU3, 15)
fig += T(89, 50, 'Kuboid', c, 18) + T(250, 50, 'Prisma', c, 18) + T(411, 50, 'Silinder', c, 18)
S(s, 'DEFINISI', 'Isi padu',
  de(s, 'Isi padu suatu bentuk geometri tiga dimensi ialah ukuran ruang yang memenuhi bentuk geometri tiga dimensi tersebut.')
  + p('Bentuk ini diukur dalam unit padu seperti milimeter padu (mm³), sentimeter padu (cm³) atau meter padu (m³).')
  + note('Unit SI bagi luas ialah cm² (sentimeter persegi). Unit SI bagi isi padu ialah cm³ (sentimeter padu).', 'Imbas kembali:'),
  SV(fig, 'Kuboid, prisma dan silinder dengan keratan rentas yang sama dengan tapak'))

# prisma
V, Fc = G.cuboid(2.4, 1.4, 1.6); kb = solid(V, Fc, (60, 70, 440, 330))
fig = kb.draw(fill=TR, edge=AM) + POLY([kb.P[i] for i in (1, 3, 7, 5)], f'{PA}55', PA, 3)
fig += cub_lab(kb, 'panjang', 'lebar', 'tinggi', MU3)
fig += T(250, 400, 'Kuboid dipotong kepada dua prisma segi tiga', MU3, 17, halo=False)
S(s, 'RUMUS', 'Isi padu prisma',
  p('Isi padu kuboid = panjang × lebar × tinggi = luas tapak × tinggi')
  + p('Kuboid tersebut dipotong kepada dua bahagian yang sama saiz melalui pepenjurunya. Dua buah prisma segi tiga terhasil. Hubungan antara isi padu kuboid dengan isi padu prisma segi tiga ialah')
  + steps(s, [f'Isi padu prisma segi tiga = {SEP} × isi padu kuboid = {SEP} × luas tapak × tinggi', f'= ({SEP} × panjang × lebar) × tinggi = luas segi tiga × tinggi'])
  + formula('Isi padu prisma = luas keratan rentas × tinggi', c),
  SV(fig, 'Kuboid dipotong melalui pepenjuru menjadi dua prisma segi tiga'))

# silinder
fig = G.cylinder((90, 260), 60, 14) + T(90, 160, 'Sekeping syiling', MU3, 16, halo=False)
fig += arrow((170, 240), (230, 240))
for kk in range(10):
    fig += G.cylinder((360, 330 - kk * 15), 70, 15, sw=3)
fig += G.DIMLINE((430, 180), (430, 330), t, MU3, 26, 20, -1)
fig += T(360, 150, f'luas tapak = {PI}{j}²', TX, 17) + T(360, 400, '10 keping syiling', MU3, 16, halo=False)
S(s, 'RUMUS', 'Isi padu silinder',
  p('Rajah menunjukkan sekeping syiling berbentuk sebuah bulatan. Jika 10 keping syiling disusun menegak akan menghasilkan sebuah silinder.')
  + steps(s, ['Maka, isi padu silinder = luas tapak × tinggi', f'= {PI}{j}² × {t}'])
  + formula(f'Isi padu silinder = {PI}{j}²{t}', c),
  SV(fig, 'Syiling disusun menegak membentuk silinder'))

# piramid
V, Fc = G.cuboid(2, 2, 2); cbq = solid(V + [(1, 2, 1)], Fc, (90, 40, 410, 360))
fig = cbq.draw(fill=TR, edge=AM, fillop='14')
apx = cbq.P[8]
for i in range(4):
    vis = i in (0, 1)
    fig += LINE(apx, cbq.P[i], PK, 3 if vis else 2.5, None if vis else '6 5')
fig += POLY([cbq.P[i] for i in range(4)], f'{GR}40', GR, 2) + G.DOT(apx, PK, 6)
fig += cub_lab(cbq, p_, l_, t, TX, 20)
fig += T(250, 420, 'Enam piramid yang sama saiz memenuhi kubus', MU3, 16, halo=False)
S(s, 'RUMUS', 'Isi padu piramid',
  p(f'Perhatikan sebuah kubus yang mempunyai panjang ({p_}), lebar ({l_}) dan tinggi ({t}). Enam buah piramid yang sama saiz boleh dimuatkan ke dalam kubus dengan luas tapak piramid sama seperti luas tapak kubus dan ketinggian piramid adalah separuh daripada ketinggian kubus.')
  + work([('', [f'Luas tapak piramid = {p_} × {l_}, tinggi piramid = {fr(t, 2)}, maka {t} = 2 × tinggi piramid',
                f'Isi padu piramid = {fr("Isi padu kubus", 6)} = {fr(f"{p_} × {l_} × {t}", 6)} = {fr(f"{p_} × {l_} × (2 × tinggi piramid)", 6)} = {fr("Luas tapak piramid × tinggi piramid", 3)}'])], s, 1, 17)
  + formula(f'Isi padu piramid = {TIGA} × luas tapak × tinggi', c),
  SV(fig, 'Piramid di dalam kubus dengan tapak sama dan tinggi separuh'))

# kon & sfera
fig = RECT(14, 14, 230, 442) + RECT(256, 14, 230, 442)
kn, A = G.cone((80, 300), 44, 150); fig += kn + T(80, 350, '3 ×', TX, 22)
fig += G.cylinder((180, 300), 44, 150) + T(180, 350, '1 ×', TX, 22) + T(129, 395, 'tinggi dan tapak sama', MU3, 15)
fig += T(129, 52, 'Kon', c, 19) + T(371, 52, 'Sfera', c, 19)
fig += G.sphere((371, 240), 92) + sph_lab((371, 240), 92, j)
S(s, 'RUMUS', 'Isi padu kon dan sfera',
  p('Didapati anda memerlukan 3 kon sagu halus untuk memenuhkan 1 silinder. Oleh itu, 3 × isi padu kon = 1 × isi padu silinder')
  + formula(f'Isi padu kon = {TIGA}{PI}{j}²{t}', c)
  + p('Sfera ialah satu bentuk geometri tiga dimensi yang mempunyai satu titik tetap yang dikenali sebagai pusat sfera. Semua titik pada permukaannya mempunyai jarak yang sama dari pusat sfera. Isi padu sfera yang mempunyai jejari, ' + j + ' ialah')
  + formula(f'Isi padu sfera = {fr(4, 3)}{PI}{j}³', c),
  SV(fig, 'Tiga kon memenuhi satu silinder dan sfera berjejari j'))

# Contoh 8 prisma
tb = [(0, 0), (6, 0), (3, 4)]
V, Fc = G.prism_x([(0, 0), (0, 6), (4, 3)], 10); pr = solid(V, Fc, (50, 80, 450, 360), -32, 20)
fig = pr.draw(fill=TR, edge=AM) + pr.lab(3, 4, '6 cm', TX, 17) + pr.lab(4, 5, '5 cm', TX, 17, 40) + pr.lab(1, 4, '10 cm', TX, 17)
fig += rv(T(250, 410, 'tinggi segi tiga = 4 cm', MU3, 17, halo=False))
assert 6 * 4 / 2 * 10 == 120 and 5 ** 2 - 3 ** 2 == 16
S(s, 'CONTOH 8', 'Isi padu prisma',
  p('Hitung isi padu prisma tegak di sebelah.')
  + pen(s, ['Isi padu prisma = luas keratan rentas × tinggi', '= luas segi tiga × tinggi', f'= ({SEP} × 6 cm × 4 cm) × 10 cm', '= 120 cm³'], False)
  + note(f'Menggunakan teorem Pythagoras: tinggi segi tiga = {sq("5² − 3²")} = 4 cm', 'Tip:'),
  SV(fig, 'Prisma tegak dengan keratan rentas segi tiga sama kaki 6 cm, 5 cm dan panjang 10 cm'))

# Contoh 9 & 10
fig = RECT(14, 14, 230, 442) + RECT(256, 14, 230, 442) + T(40, 46, '(a)', c, 19, 'start') + T(282, 46, '(b)', c, 19, 'start')
fig += G.cylinder((129, 360), 80, 230)
top = (129, 130); fig += LINE((49, 130), (209, 130), PK, 3) + T(129, 112, '14 cm', TX, 17) + G.DIMLINE((209, 130), (209, 360), '10 cm', MU3, 22, 17, -1)
kn, A = G.cone((371, 380), 80, 260); fig += kn + cone_lab((371, 380), 80, 260, '7 cm', '9 cm')
assert round(22 / 7 * 49 * 10) == 1540 and round(22 / 7 * 49 * 9 / 3) == 462
S(s, 'CONTOH 9', 'Isi padu silinder dan kon',
  p(f'(a) Hitung isi padu silinder tegak di bawah. (b) Hitung isi padu kon tegak di bawah. (Guna {PI} = {P7})')
  + work([('(a)', ['Isi padu silinder = luas keratan rentas × tinggi', f'= {PI}{j}²{t}', f'= ({P7} × 7 cm × 7 cm) × 10 cm', '= 1 540 cm³']),
          ('(b)', [f'Isi padu kon = {TIGA} × luas tapak × tinggi', f'= {TIGA}{PI}{j}²{t}', f'= {TIGA} × ({P7} × 7 cm × 7 cm) × 9 cm', '= 462 cm³'])], s, 2, 18),
  SV(fig, 'Silinder berdiameter 14 cm tinggi 10 cm dan kon berjejari 7 cm tinggi 9 cm'))

# Contoh 10 piramid
V, Fc = G.pyramid([(0, 0), (6, 0), (6, 6), (0, 6)], 5); py = solid(V, Fc, (80, 50, 420, 380), -30, 18)
fig = py.draw(fill=TR, edge=AM)
fig += py.lab(0, 1, '6 cm', TX, 17) + py.lab(1, 2, '6 cm', TX, 17)
bc = cen([py.P[k] for k in range(4)]); fig += LINE(py.P[4], bc, PK, 2.5, '6 5') + T(bc[0] + 10, (bc[1] + py.P[4][1]) / 2, '5 cm', PK, 17, 'start')
nm = ['A', 'B', 'C', 'D']
for i in range(4):
    q = py.P[i]; dx, dy = q[0] - bc[0], q[1] - bc[1]; L = math.hypot(dx, dy)
    fig += T(q[0] + dx / L * 20, q[1] + dy / L * 20, nm[i], TX, 18)
fig += T(py.P[4][0], py.P[4][1] - 20, 'V', TX, 18)
assert 36 * 5 / 3 == 60
S(s, 'CONTOH 10', 'Isi padu piramid',
  p('Hitung isi padu piramid tegak di sebelah.')
  + pen(s, [f'Isi padu piramid = {TIGA} × luas tapak × tinggi', f'= {TIGA} × (6 cm × 6 cm) × 5 cm', '= 60 cm³'], False)
  + ans('60 cm³'),
  SV(fig, 'Piramid tegak VABCD bertapak segi empat sama 6 cm dan tinggi 5 cm'))

# Contoh 11 sfera & hemisfera
fig = RECT(14, 14, 230, 442) + RECT(256, 14, 230, 442) + T(40, 46, '(a)', c, 19, 'start') + T(282, 46, '(b)', c, 19, 'start')
fig += G.sphere((129, 240), 90) + sph_lab((129, 240), 90, '3 cm')
hc = (371, 290); r_ = 92
fig += f'<path d="M{hc[0] - r_} {hc[1]} A{r_} {r_} 0 0 1 {hc[0] + r_} {hc[1]} Z" fill="{TR}26"/>' + G.ARC(hc, r_, r_, 180, 360, AM, 4.5)
fig += ELL(hc, r_, r_ * .3, f'{TR}33', AM, 4.5) + sph_lab(hc, r_, '7 cm')
v11, v12 = 4 / 3 * 22 / 7 * 27, 2 / 3 * 22 / 7 * 343
assert num(v11) == '113.14' and num(v12) == '718.67'
S(s, 'CONTOH 11', 'Isi padu sfera dan hemisfera',
  p(f'(a) Hitung isi padu sfera berjejari 3 cm. (b) Hitung isi padu hemisfera berjejari 7 cm. Berikan jawapan dalam dua tempat perpuluhan. (Guna {PI} = {P7})')
  + work([('(a)', [f'Isi padu sfera = {fr(4, 3)}{PI}{j}³', f'= {fr(4, 3)} × {P7} × 3 cm × 3 cm × 3 cm', '= 113.14 cm³']),
          ('(b)', [f'Isi padu hemisfera = {SEP} × isi padu sfera', f'= {SEP} × {fr(4, 3)}{PI}{j}³ = {fr(2, 3)}{PI}{j}³', f'= {fr(2, 3)} × {P7} × 7 cm × 7 cm × 7 cm', '= 718.67 cm³'])], s, 2, 18),
  SV(fig, 'Sfera berjejari 3 cm dan hemisfera berjejari 7 cm'))

# Contoh 12 penyelesaian masalah
cc = (250, 400)
kn, A = G.cone((250, 250), 80, 150); fig += kn
fig = G.cylinder(cc, 80, 150) + kn
fig += G.DIMLINE((330, 250), (330, 400), '5 cm', MU3, 30, 17, -1) + G.DIMLINE((250, 100), (250, 250), '4 cm', MU3, 110, 17, -1)
fig += LINE((170, 438), (330, 438), MU3, 2, '5 5') + T(250, 456, '6 cm', MU3, 17)
vs, vk = 22 / 7 * 9 * 5, 22 / 7 * 9 * 4 / 3
assert num(vs) == '141.43' and num(vk) == '37.71' and num(141.43 + 37.71) == '179.14'
S(s, 'CONTOH 12', 'Penyelesaian masalah',
  p(f'Salim seorang pengusaha aiskrim secara kecil-kecilan. Dia menjual aiskrimnya di dalam bekas seperti rajah di sebelah. Jika dia menetapkan sasaran untuk menjual 10 000 bekas sebulan, berapa liter aiskrim yang diperlukan dalam tempoh sebulan? Bundarkan jawapan kepada liter yang terhampir. (Guna {PI} = {P7})')
  + note('Bekas terdiri daripada sebuah kon dan sebuah silinder yang berdiameter 6 cm.', 'Nota:') + note('1 liter = 1 000 cm³', 'Ingat:'),
  SV(fig, 'Bekas aiskrim: kon tinggi 4 cm di atas silinder tinggi 5 cm, diameter 6 cm'))

S(s, 'CONTOH 12 (sambungan)', 'Penyelesaian masalah',
  work([('Memahami masalah', ['Menghitung isi padu air yang diperlukan untuk membuat 10 000 bekas aiskrim dalam liter yang terhampir.']),
        ('Merancang strategi', ['(i) Menentukan isi padu satu bekas.', '(ii) Menentukan jumlah isi padu 10 000 bekas.']),
        ('Membuat kesimpulan', ['1 liter = 1 000 cm³', f'1 791 400 cm³ = {fr("1 791 400 cm³", "1 000 cm³")} × 1 liter = 1 791.4 liter', 'Maka, 1 791 liter aiskrim diperlukan.'])], s),
  work([('Melaksanakan strategi', [f'Isi padu silinder = {PI}{j}²{t}', f'= {P7} × 3 cm × 3 cm × 5 cm = 141.43 cm³',
                                   f'Isi padu kon = {TIGA} × {PI}{j}²{t}', f'= {TIGA} × {P7} × 3 cm × 3 cm × 4 cm = 37.71 cm³',
                                   'Maka, isi padu bekas = 141.43 cm³ + 37.71 cm³ = 179.14 cm³',
                                   'Jumlah isi padu 10 000 bekas = 10 000 × 179.14 cm³ = 1 791 400 cm³'])], s))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'bentuk3d', 'slides.js')
HEAD = '/* Nota Bab 6 ikut buku teks Matematik T2 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
