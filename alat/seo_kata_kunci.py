"""SEO kata kunci: tajuk dan penerangan halaman ikut perkataan carian (nota, slaid, latihan, game Matematik KSSM).
Jalankan dari akar repo: python3 alat/seo_kata_kunci.py  (selamat dijalankan berulang kali)."""
import re, glob, os, datetime
TODAY = datetime.date.today().isoformat()
D_RE = re.compile(r'Matematik Tingkatan (\d) Bab (\d+) (.+?) \(KSSM\): nota slaid, simulasi interaktif, latihan dan permainan kelas\.')
NEWD = 'Nota dan slaid Matematik Tingkatan {t} KSSM Bab {n} {x}: simulasi interaktif, latihan, kuiz, lembaran kerja dan game matematik untuk PdP dan ulang kaji.'
n_ok = 0
for bj in sorted(glob.glob('*/bab.js')):
    d = os.path.dirname(bj); p = f'{d}/index.html'; s = open(p).read()
    m = D_RE.search(s)
    if m:
        t, n, x = m.groups()
        s = s.replace(m.group(0), NEWD.format(t=t, n=n, x=x))
    else:
        m2 = re.search(r'Nota dan slaid Matematik Tingkatan (\d) KSSM Bab (\d+) (.+?): simulasi', s)
        if not m2: print('LANGKAU', d); continue
        t, n, x = m2.groups()
    title = f'Bab {n} {x} – Nota &amp; Slaid Matematik Tingkatan {t} KSSM | TerokaMath'
    s = re.sub(r'<title>[^<]*</title>', f'<title>{title}</title>', s, count=1)
    s = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{title}">', s, count=1)
    if '"keywords"' not in s:
        kw = f'nota matematik tingkatan {t}, slaid matematik tingkatan {t}, {x.lower()}, latihan matematik, game matematik, KSSM, PdP'
        s = s.replace('"@type": "LearningResource",', f'"@type": "LearningResource", "keywords": "{kw}", "educationalLevel": "Tingkatan {t}", "learningResourceType": ["Nota", "Slaid", "Simulasi", "Latihan", "Game"],', 1)
    open(p, 'w').write(s); n_ok += 1
print('bab dikemas kini:', n_ok)
# halaman utama
p = 'index.html'; s = open(p).read()
T = 'TerokaMath – Nota Matematik KSSM Tingkatan 1–5: Slaid, Simulasi, Latihan &amp; Game'
s = re.sub(r'<title>[^<]*</title>', f'<title>{T}</title>', s, count=1)
s = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{T}">', s, count=1)
D = 'Nota Matematik KSSM Tingkatan 1 hingga 5 dalam bentuk slaid, simulasi interaktif, latihan, kuiz online dan game matematik. Bahan PdP percuma untuk guru dan murid sekolah menengah.'
s = re.sub(r'(<meta name="description" content=")[^"]*(">)', r'\g<1>' + D + r'\g<2>', s, count=1)
s = re.sub(r'(<meta property="og:description" content=")[^"]*(">)', r'\g<1>' + D + r'\g<2>', s, count=1)
open(p, 'w').write(s)
# game
p = 'game/index.html'; s = open(p).read()
if 'name="description"' not in s:
    GD = 'Game matematik percuma untuk murid sekolah menengah: berlatih soalan Matematik KSSM Tingkatan 1 hingga 5 sambil bermain. TerokaMath.'
    GT = 'Game Matematik KSSM Tingkatan 1–5 | TerokaMath'
    head = (f'<meta name="description" content="{GD}">\n<title>{GT}</title>\n<link rel="canonical" href="https://terokamath.com/game/">\n'
            f'<meta property="og:type" content="website">\n<meta property="og:site_name" content="TerokaMath">\n<meta property="og:title" content="{GT}">\n'
            f'<meta property="og:description" content="{GD}">\n<meta property="og:url" content="https://terokamath.com/game/">\n<meta property="og:image" content="https://terokamath.com/icons/og.png">\n'
            '<script type="application/ld+json">{"@context": "https://schema.org", "@type": "LearningResource", "name": "Game Matematik TerokaMath", "url": "https://terokamath.com/game/", '
            '"inLanguage": "ms", "keywords": "game matematik, permainan matematik, latihan matematik tingkatan 1, tingkatan 2, tingkatan 3, KSSM", "learningResourceType": "Game", '
            '"educationalLevel": "Sekolah Menengah", "isAccessibleForFree": true, "description": "' + GD + '"}</script>')
    s = re.sub(r'<title>[^<]*</title>', head, s, count=1)
    open(p, 'w').write(s)
# bank soalan: dipindah ke repo ekwanbiz/banksoalan (28 Nov 2026)
# sitemap lastmod
p = 'sitemap.xml'; s = open(p).read(); s = re.sub(r'<lastmod>[^<]*</lastmod>', f'<lastmod>{TODAY}</lastmod>', s); open(p, 'w').write(s)
print('siap')
