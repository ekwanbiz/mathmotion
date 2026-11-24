# Tukar slaid yang diluluskan (gen_slides.py) kepada data app ISOMOVE: isomove/slides.js
import json, re

src = open('/home/claude/isodesign/gen_slides.py').read()
head, rest = src.split('# ---------- pembantu teks ----------', 1)
_, rest = rest.split('# ---------- pembantu rajah ----------', 1)
body_src, _ = rest.split('# ---------- tulis fail ----------', 1)
head = head.replace("os.makedirs(OUT, exist_ok=True)", "")

HELPERS = '''
def vec(a, b, col=None, size=24):
    col = col or C['tr']
    return f'<span class="vec" style="--c:{col}">{a}<br>{b}</span>'
def P(t, size=24):
    return f'<p class="sl-p{" sm" if size <= 20 else ""}">{t}</p>'
def DEF(t, col):
    return f'<div class="sl-def" style="--c:{col}"><p>{t}</p></div>'
def BUL(items, col):
    return f'<ul class="sl-bul" style="--c:{col}">' + ''.join(f'<li><span>{i}</span></li>' for i in items) + '</ul>'
def STEPS(items, col):
    return f'<ol class="sl-steps" style="--c:{col}">' + ''.join(f'<li class="rv"><span class="n">{n}</span><span>{t}</span></li>' for n, t in enumerate(items, 1)) + '</ol>'
def ANS(t):
    return f'<div class="sl-ans rv"><span>JAWAPAN</span> {t}</div>'
def NOTE(t):
    return f'<div class="sl-note"><b>Ingat:</b> {t}</div>'
'''

body_src = '# ---------- pembantu rajah ----------' + body_src
# svg: saiz ikut CSS
body_src = body_src.replace(
    '''return (f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="{html.escape(label)}" '
            f'style="flex: none; background: {NAV}; border-radius: 22px; border: 1px solid {BD}">{inner}</svg>')''',
    '''return f'<svg class="sl-svg" viewBox="0 0 {W} {H}" role="img" aria-label="{html.escape(label)}">{inner}</svg>' ''')
# 11.1-3: jawapan disorok dahulu
body_src = body_src.replace("s += T(330, 96, 'Kongruen', C['gr'], 18, 'start') + tick(310, 90)", "s += '<g class=\"rv\">' + T(330, 96, 'Kongruen', C['gr'], 18, 'start') + tick(310, 90) + '</g>'")
body_src = body_src.replace("s += T(330, 236, 'Tidak', C['rd'], 18, 'start') + cross(310, 230)", "s += '<g class=\"rv\">' + T(330, 236, 'Tidak', C['rd'], 18, 'start') + cross(310, 230) + '</g>'")
body_src = body_src.replace("s += T(330, 386, 'Kongruen', C['gr'], 18, 'start') + tick(310, 380)", "s += '<g class=\"rv\">' + T(330, 386, 'Kongruen', C['gr'], 18, 'start') + tick(310, 380) + '</g>'")
# 11.6-2: peringkat disorok
body_src = body_src.replace(
    "s += f'<rect x=\"{x-52}\" y=\"{y+58}\" width=\"104\" height=\"38\" rx=\"19\" fill=\"{SURF}\" stroke=\"{BD}\" stroke-width=\"2\"/>' + T(x, y + 84, f'Peringkat {n}', TX, 17)",
    "s += '<g class=\"rv\">' + f'<rect x=\"{x-52}\" y=\"{y+58}\" width=\"104\" height=\"38\" rx=\"19\" fill=\"{SURF}\" stroke=\"{BD}\" stroke-width=\"2\"/>' + T(x, y + 84, f'Peringkat {n}', TX, 17) + '</g>'")
# 11.6-3: nombor peringkat disorok
for nm, x, y, num in [('Kipas', 'x', 230, 3), ('Bintang', 'x', 230, 5), ('Huruf S', '125', 440, 2), ('Huruf L', '385', 440, 1)]:
    old = f"T({x}, {y}, '{nm} → {num}', TX, 18)"
    assert old in body_src, old
    body_src = body_src.replace(old, f"T({x}, {y - 14}, '{nm}', TX, 18) + '<g class=\"rv\">' + T({x}, {y + 12}, 'Peringkat {num}', C['am'], 18) + '</g>'")
body_src = body_src.replace("+ P('<span style=\"color: #94A3B8\">Putar bersama kelas dan kira berapa kali bentuk kelihatan sama.</span>', 20)",
                            "+ P('<span style=\"color: #94A3B8\">Putar bersama kelas dan kira berapa kali bentuk kelihatan sama. Tekan ▶ untuk jawapan.</span>', 20)")
# 11.5-2: jadual dalam kotak boleh skrol
body_src = body_src.replace("return (f'<table style=\"width: 100%;", "return (f'<div class=\"sl-table\"><table style=\"width: 100%; min-width: 640px;")
body_src = body_src.replace("f'<thead><tr>{hd}</tr></thead><tbody>{body}</tbody></table>')", "f'<thead><tr>{hd}</tr></thead><tbody>{body}</tbody></table></div>')")

ns = {}
exec(head + HELPERS + body_src, ns)
S, SUB = ns['S'], ns['SUB']
counts = {}
for s in S: counts[s['sub']] = counts.get(s['sub'], 0) + 1
out, idx = [], {}
for s in S:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s['kicker'], 'title': s['title'],
                'body': s['body'], 'fig': s['diagram'] or '', 'full': s['full'] or ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]
js = '/* Dijana daripada slaid yang diluluskan guru. Jangan sunting dengan tangan. */\nwindow.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + json.dumps(out, ensure_ascii=False) + ';\n'
open('/home/claude/mathmotion/isomove/slides.js', 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait')
