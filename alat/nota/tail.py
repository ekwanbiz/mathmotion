# ---------- nombor slaid ----------
for sb in SUBS:
    L = [x for x in OUT if x['sub'] == sb['no']]
    for i, x in enumerate(L, 1):
        x['n'], x['N'] = i, len(L)
# ---------- susunan langkah (urutan.json) ----------
import re as _re
_folder = os.path.basename(os.path.dirname(os.path.abspath(OUTFILE)))
if _folder.endswith('bt'):
    _folder = _folder[:-2]
try:
    _URUT = json.load(open(os.path.join(HERE, 'urutan.json'))).get(_folder, {})
except Exception:
    _URUT = {}
_RVPAT = _re.compile(r'class="([^"]*\brv\b[^"]*)"')


def _seq(spec, nb, nf):
    if spec in ('mix', 'mixf'):
        out, j = [], 0
        for i in range(nb):
            k = round((i + 1) * nf / nb) if nb else nf
            if spec == 'mixf':
                out += [('f', x) for x in range(j, k)] + [('b', i)]
            else:
                out += [('b', i)] + [('f', x) for x in range(j, k)]
            j = k
        return out + [('f', x) for x in range(j, nf)]
    out, ib, iff = [], 0, 0
    for tok in spec.split(','):
        w, _, n = tok.strip().partition(':')
        if w == 'b':
            m = int(n) if n else nb - ib
            out += [('b', x) for x in range(ib, ib + m)]; ib += m
        else:
            m = int(n) if n else nf - iff
            out += [('f', x) for x in range(iff, iff + m)]; iff += m
    out += [('b', x) for x in range(ib, nb)] + [('f', x) for x in range(iff, nf)]
    return out


def _tag(html, ranks):
    it = iter(ranks)
    return _RVPAT.sub(lambda mm: f'class="{mm.group(1)}" data-o="{next(it)}"', html)


for _x in OUT:
    _k = f"{_x['sub']}/{_x['n']}"
    if _k not in _URUT:
        continue
    _nb = len(_RVPAT.findall(_x['body'])); _nf = len(_RVPAT.findall(_x['fig']))
    _order = _seq(_URUT[_k], _nb, _nf)
    assert len(_order) == _nb + _nf, (_k, _order)
    _rb = [0] * _nb; _rf = [0] * _nf
    for _r, (_w, _i) in enumerate(_order):
        (_rb if _w == 'b' else _rf)[_i] = _r
    _x['body'] = _tag(_x['body'], _rb); _x['fig'] = _tag(_x['fig'], _rf)

ORDER = ['sub', 'n', 'N', 'kicker', 'title', 'body', 'fig', 'full']
OUT2 = [{k: x[k] for k in ORDER} for x in OUT]
js = ('' + HEAD + '\nwindow.SUBS=' + json.dumps(SUBS, ensure_ascii=False)
      + ';\nwindow.SLIDES=' + json.dumps(OUT2, ensure_ascii=False) + ';\n')
open(OUTFILE, 'w').write(js)
print(len(OUT2), 'slaid;', {sb['no']: sum(1 for x in OUT2 if x['sub'] == sb['no']) for sb in SUBS})
