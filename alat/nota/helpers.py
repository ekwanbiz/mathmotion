"""Bina slaid nota Bab 11 (versi ikut buku teks T2 KSSM) dalam format slides.js TerokaMath."""
import json, math
from svg import *

SUBS = [{"no": "11.1", "name": "Transformasi", "col": "#34D399"}, {"no": "11.2", "name": "Translasi", "col": "#38BDF8"},
        {"no": "11.3", "name": "Pantulan", "col": "#FB923C"}, {"no": "11.4", "name": "Putaran", "col": "#A78BFA"},
        {"no": "11.5", "name": "Translasi, Pantulan dan Putaran sebagai Isometri", "col": "#FBBF24"},
        {"no": "11.6", "name": "Simetri Putaran", "col": "#F472B6"}]
COL = {s['no']: s['col'] for s in SUBS}
OUT = []


def S(sub, kicker, title, body, fig='', full=''):
    OUT.append({"sub": sub, "kicker": kicker, "title": title, "body": body, "fig": fig, "full": full})


# ---------- pembantu HTML ----------
def de(sub, html):
    return f'<div class="sl-def" style="--c:{COL[sub]}"><p>{html}</p></div>'


def bul(sub, items):
    return f'<ul class="sl-bul" style="--c:{COL[sub]}">' + ''.join(f'<li><span>{i}</span></li>' for i in items) + '</ul>'


def p(html):
    return f'<p class="sl-p">{html}</p>'


def note(html, lb='Ingat:'):
    return f'<div class="sl-note"><b>{lb}</b> {html}</div>'


def steps(sub, items):
    return f'<ol class="sl-steps" style="--c:{COL[sub]}">' + ''.join(f'<li class="rv"><span class="n">{k}</span><span>{i}</span></li>' for k, i in enumerate(items, 1)) + '</ol>'


def ans(html):
    return f'<div class="sl-ans rv"><span>JAWAPAN</span> {html}</div>'


def vec(a, b, c='#34D399'):
    return f'<span class="vec" style="--c:{c}">{a}<br>{b}</span>'


def card(title, big, small, c):
    return (f'<div style="padding: 14px 20px; border-radius: 18px; background: #131C2E; border: 2px solid {c}">'
            f'<p style="margin: 0 0 4px; font-size: 16px; font-weight: 800; letter-spacing: 0.08em; color: {c}">{title}</p>'
            f'<p style="margin: 0; font-size: 26px; font-weight: 700">{big}</p>'
            + (f'<p style="margin: 4px 0 0; font-size: 18px; color: #94A3B8">{small}</p>' if small else '') + '</div>')


def cards(*cs):
    return '<div style="display: flex; flex-direction: column; gap: 12px">' + ''.join(cs) + '</div>'


def m(s):  # tolak → tanda tolak tipografi
    return str(s).replace('-', '−')


def reg(cx, cy, r, n, rot=-90):
    return [(cx + r * math.cos(math.radians(rot + 360 * k / n)), cy + r * math.sin(math.radians(rot + 360 * k / n))) for k in range(n)]


def arc(cx, cy, r, a1, a2, col, ccw=True, w=4):
    """lengkok dari sudut a1 ke a2 (darjah, matematik: lawan arah jam positif), y skrin ke bawah."""
    x1, y1 = cx + r * math.cos(math.radians(a1)), cy - r * math.sin(math.radians(a1))
    x2, y2 = cx + r * math.cos(math.radians(a2)), cy - r * math.sin(math.radians(a2))
    large = 1 if abs(a2 - a1) > 180 else 0
    sweep = 0 if ccw else 1
    path = f'<path d="M{f(x1)} {f(y1)} A{f(r)} {f(r)} 0 {large} {sweep} {f(x2)} {f(y2)}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round"/>'
    # kepala anak panah ikut tangen
    d = 1 if ccw else -1
    tx, ty = -math.sin(math.radians(a2)) * d, -math.cos(math.radians(a2)) * d
    return path + arrowhead(x2 - tx * 10, y2 - ty * 10, x2, y2, col, w)


