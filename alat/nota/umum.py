# Pembantu HTML yang dikongsi oleh penjana Tingkatan 3 ke atas.
# Guna: exec(open(os.path.join(HERE, 'umum.py')).read()) selepas helpers.py dan selepas COL ditakrif.
import graf as GF


def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'


def sq(x, n=''):
    nn = f'<sup style="margin-right:-3px">{n}</sup>' if n else ''
    return f'<span style="white-space:nowrap">{nn}√<span style="display:inline-block;white-space:nowrap;border-top:2px solid currentColor;padding:2px 3px 0;line-height:1.15">{x}</span></span>'


def pw(a, n):
    return f'{a}<sup>{n}</sup>'


def pen(s, items, label=True):
    return (p('<b>Penyelesaian:</b>') if label else '') + steps(s, items)


def work(blocks, s, cols=1, fs=19):
    c = COL[s]
    out = []
    for lb, lines in blocks:
        inner = ''.join(f'<div class="rv">{ln}</div>' for ln in lines)
        out.append(f'<div>{f"<b style=\"color:{c}\">{lb}</b> " if lb else ""}{inner}</div>')
    return ('<div style="width:100%;align-self:flex-start;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:16px 20px;'
            + (f'display:grid;grid-template-columns:repeat({cols},1fr);gap:10px 18px;' if cols > 1 else 'display:flex;flex-direction:column;gap:8px;')
            + f'font-size:{fs}px;line-height:1.5">' + ''.join(out) + '</div>')


def formula(html, c):
    return f'<div style="display:inline-block;margin:6px 0;padding:10px 18px;border:2px solid {c};border-radius:14px;background:#131C2E;font-size:21px;font-weight:700">{html}</div>'


def table(head, rows, c, fs=18, center=True, rvrows=()):
    al = 'center' if center else 'left'
    th = ''.join(f'<th style="padding:7px 10px;text-align:{al};font-size:{fs - 2}px;color:{c};border:1px solid #22304A;background:#0E1626">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if i in rvrows else ""}>' + ''.join(f'<td style="padding:6px 10px;text-align:{al};font-size:{fs}px;font-weight:600;border:1px solid #22304A;vertical-align:top">{x}</td>' for x in r) + '</tr>' for i, r in enumerate(rows))
    return f'<div class="sl-table" style="width:100%"><table style="width:100%;border-collapse:collapse;background:#131C2E"><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'


def stack(*xs):
    return '<div style="width:100%;display:flex;flex-direction:column;gap:12px;align-self:flex-start">' + ''.join(xs) + '</div>'


def SV(inner, aria):
    return GF.svg(inner, aria)


def rm(v, d=2):
    """RM dengan ruang ribuan."""
    t = f'{v:,.{d}f}'.replace(',', ' ')
    if d and t.endswith('.00') and False:
        t = t[:-3]
    return 'RM' + t
