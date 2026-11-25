# Pembantu pecahan bertingkat & punca kuasa untuk skrip gen_slides (25 Nov).
# HTML (teks slaid): FR(a, b), RT(x, n=None) – sama dengan fr()/rt() dalam teras/asas.js (gaya .fr/.rt dalam teras.css)
# SVG (rajah): SFR(x, y, a, b, col, size, anchor), SRT(x, y, t, col, size, anchor, n)
#   SFR: y = kedudukan garis pecahan; SRT: y = garis dasar teks.
def FR(a, b): return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'
def RT(x, n=None): return f'<span class="rt">' + (f'<sup class="rti">{n}</sup>' if n else '') + f'<span class="rts">√</span><span class="rtx">{x}</span></span>'
import re as _re
def mathW(t, size):
    w = 0
    for c in str(t):
        w += size * (.28 if c == ' ' else .34 if _re.match(r'[²³⁰-⁹₀-₉′]', c) else .62 if c in '−+=×÷' else .36 if c in 'ijl1.,()' else .56)
    return 1.12 * w
def SFR(x, y, a, b, col, size=20, anchor='middle'):
    w = max(mathW(a, size), mathW(b, size)) + 10
    x0 = x if anchor == 'start' else (x - w if anchor == 'end' else x - w / 2); cx = x0 + w / 2
    sw = max(1.5, size / 11)
    return (f'<text x="{cx:.1f}" y="{y - size*.25:.1f}" fill="{col}" font-size="{size}" font-weight="700" text-anchor="middle">{a}</text>'
            f'<line x1="{x0:.1f}" y1="{y:.1f}" x2="{x0+w:.1f}" y2="{y:.1f}" stroke="{col}" stroke-width="{sw:.1f}"/>'
            f'<text x="{cx:.1f}" y="{y + size*.95:.1f}" fill="{col}" font-size="{size}" font-weight="700" text-anchor="middle">{b}</text>')
def SRT(x, y, t, col, size=20, anchor='middle', n=None):
    tw = mathW(t, size); rw = size * .62; w = rw + tw + 4
    x0 = x if anchor == 'start' else (x - w if anchor == 'end' else x - w / 2); top = y - size * .9
    sw = max(1.5, size / 12)
    idx = f'<text x="{x0-2:.1f}" y="{y - size*.55:.1f}" fill="{col}" font-size="{size*.5:.1f}" font-weight="700" text-anchor="end">{n}</text>' if n else ''
    return (idx + f'<path d="M{x0:.1f} {y-size*.35:.1f} L{x0+rw*.3:.1f} {y-size*.45:.1f} L{x0+rw*.6:.1f} {y+size*.12:.1f} L{x0+rw:.1f} {top:.1f} L{x0+w:.1f} {top:.1f}" '
            f'fill="none" stroke="{col}" stroke-width="{sw:.1f}" stroke-linejoin="round"/>'
            f'<text x="{x0+rw+2:.1f}" y="{y:.1f}" fill="{col}" font-size="{size}" font-weight="700">{t}</text>')
