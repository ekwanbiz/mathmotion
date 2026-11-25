# Teks matematik bertingkat untuk gen_slides (25 Nov): pecahan a/b -> bertingkat, √x / ∛x / ^{n}√x -> punca bergaris atas.
# Tatatanda input: '^{..}' = superskrip, 'a/b' = pecahan, '√x', '√(..)', '∛x', '^{n}√x'.
#   fx_html(t)  -> HTML (<sup>, span.fr, span.rt) sama dengan fr()/rt() dalam teras/asas.js
#   fx_svg(x, y, t, col, size, anchor, ...) -> SVG (beberapa <text> + garis), y = garis tengah teks
#   fx_w(t, size) -> anggaran lebar
import re, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from mathfmt import FR, RT

_AT = r'(?:\d+(?:\.\d+)?|[A-Za-z]|[?□]|\((?:[^()]|\([^()]*\))*\)|\x04[^\x06]*\x06|\x01[^\x03]*\x03)(?:\^\{[^}]*\})?'
_FRRE = re.compile(r'(?<![\w.])((?:' + _AT + r')+)/((?:' + _AT + r')+)(?!\w|\.\d)')
_PAR = re.compile(r'^\((?:[^()]|\([^()]*\))*\)$')
def _unp(x): return x[1:-1] if _PAR.match(x) else x
_UN = re.compile(r'(?:km|m|cm|mm|RM|kg|g|l|ml|sen|kWj|unit|orang|liter)$')
_UD = re.compile(r'(?:j|jam|s|min|saat|minit|hari|kg|g|m|m²|m³|cm|cm²|cm³|km|l|L|unit|liter|kWj|minggu|bulan|tahun|orang|kotak)$')
def _conv(s):
    done = ''
    for _ in range(30):
        m = _FRRE.search(s)
        if not m: break
        a, b = m.group(1), m.group(2)
        if (re.fullmatch(r'[A-Za-z]{3,}', a) and re.fullmatch(r'[A-Za-z]{3,}', b)) or (_UN.match(a) and _UD.match(b)) or (re.fullmatch(r'[A-Za-z]{2,}', a) and _UD.match(b)) or (a.startswith('RM') and _UD.match(b)):
            done += s[:m.end()].replace('/', '\x07'); s = s[m.end():]; continue
        s = s[:m.start()] + '\x01' + _unp(a) + '\x02' + _unp(b) + '\x03' + s[m.end():]
    return (done + s).replace('\x07', '/')
_GL = {'½': (1, 2), '⅓': (1, 3), '⅔': (2, 3), '¼': (1, 4), '¾': (3, 4), '⅕': (1, 5), '⅖': (2, 5), '⅗': (3, 5), '⅘': (4, 5), '⅙': (1, 6), '⅚': (5, 6), '⅛': (1, 8)}
def fx_tok(s):
    s = ''.join(f'\x01{_GL[c][0]}\x02{_GL[c][1]}\x03' if c in _GL else c for c in str(s))
    s = s.replace('∛', '^{3}√').replace('∜', '^{4}√')
    s = re.sub(r'(?:\^\{(\d+|n)\})?√(\((?:[^()]|\([^()]*\))*\)|\d+(?:\.\d+)?|[A-Za-z](?:\^\{[^}]*\})?)',
               lambda m: '\x04' + (m.group(1) or '') + '\x05' + _unp(m.group(2)) + '\x06', s)
    s = re.sub(r'\^\{([^}]*)\}', lambda m: '^{' + _conv(m.group(1)) + '}', s)
    return _conv(s)
def fx_html(t):
    s = re.sub(r'\^\{([^}]*)\}', r'<sup>\1</sup>', fx_tok(t))
    for _ in range(12):
        if not re.search('[\x01\x04]', s): break
        s = re.sub('\x01([^\x01-\x06]*)\x02([^\x01-\x06]*)\x03', lambda m: FR(m.group(1), m.group(2)), s)
        s = re.sub('\x04([^\x01-\x06]*)\x05([^\x01-\x06]*)\x06', lambda m: RT(m.group(2), m.group(1) or None), s)
    return s

def _tree(s):
    i = 0
    def run(stop):
        nonlocal i
        out, buf = [], ''
        while i < len(s):
            c = s[i]
            if c in stop: break
            if c == '^' and s[i + 1:i + 2] == '{':
                if buf: out.append({'t': 's', 'v': buf}); buf = ''
                i += 2; k = run('}'); i += 1; out.append({'t': 'u', 'k': k})
            elif c == '\x01':
                if buf: out.append({'t': 's', 'v': buf}); buf = ''
                i += 1; a = run('\x02'); i += 1; b = run('\x03'); i += 1; out.append({'t': 'f', 'a': a, 'b': b})
            elif c == '\x04':
                if buf: out.append({'t': 's', 'v': buf}); buf = ''
                i += 1; n = run('\x05'); i += 1; k = run('\x06'); i += 1; out.append({'t': 'r', 'n': n, 'k': k})
            else:
                buf += c; i += 1
        if buf: out.append({'t': 's', 'v': buf})
        return out
    return run('')
def _cw(ch):
    if ch == ' ': return .26
    if ch in '✓✗→': return 1.0
    if ch in '()[].,:;\'|': return .34
    if ch == '1': return .5
    if ch.isdigit(): return .58
    if ch in 'mwMW': return .84
    if ch == '·': return .3
    if ch in '−+=×÷<>': return .62
    if ch in 'ijlrtf': return .32
    if ch.isupper(): return .66
    return .56
def _meas(L, sz):
    w, up, dn = 0, sz * .5, sz * .5
    for n in L:
        if n['t'] == 's': n['w'] = sum(_cw(c) for c in n['v']) * sz
        elif n['t'] == 'u':
            m = _meas(n['k'], sz * .64); n['w'] = m[0] + sz * .04; up = max(up, sz * .42 + m[1])
        elif n['t'] == 'f':
            s2 = sz * .8; A = _meas(n['a'], s2); B = _meas(n['b'], s2)
            n['w'] = max(A[0], B[0]) + sz * .24; n['A'] = A; n['B'] = B
            up = max(up, A[1] + A[2] + sz * .12); dn = max(dn, B[1] + B[2] + sz * .12)
        else:
            K = _meas(n['k'], sz); N = _meas(n['n'], sz * .5); n['K'] = K; n['N'] = N
            n['ix'] = max(0, N[0] - sz * .25) if n['n'] else 0
            n['w'] = K[0] + sz * .74 + n['ix']; up = max(up, K[1] + sz * .14)
        w += n['w']
    return w, up, dn
def _r(v): return round(v, 1)
def _draw(L, x, y, sz, col, attrs):
    o = ''
    for n in L:
        if n['t'] == 's':
            v = n['v'].replace(' ', ' ')
            o += f'<text x="{_r(x)}" y="{_r(y)}" fill="{col}" font-size="{_r(sz)}"{attrs} dominant-baseline="middle">{v}</text>'
        elif n['t'] == 'u':
            o += _draw(n['k'], x + sz * .02, y - sz * .42, sz * .64, n.get('col', col), attrs)
        elif n['t'] == 'f':
            s2 = sz * .8; sw = max(1.4, sz / 14)
            o += _draw(n['a'], x + (n['w'] - n['A'][0]) / 2, y - sz * .12 - n['A'][2], s2, col, attrs)
            o += _draw(n['b'], x + (n['w'] - n['B'][0]) / 2, y + sz * .12 + n['B'][1], s2, col, attrs)
            o += f'<line x1="{_r(x + sz * .06)}" y1="{_r(y)}" x2="{_r(x + n["w"] - sz * .06)}" y2="{_r(y)}" stroke="{col}" stroke-width="{_r(sw)}"/>'
        else:
            ix = n['ix']; x0 = x + ix; rw = sz * .62; top = y - n['K'][1] - sz * .1; sw = max(1.4, sz / 13)
            if n['n']: o += _draw(n['n'], x, y - sz * .38, sz * .5, col, attrs)
            o += (f'<path d="M{_r(x0)} {_r(y + sz * .05)} L{_r(x0 + rw * .3)} {_r(y - sz * .05)} L{_r(x0 + rw * .6)} {_r(y + sz * .5)} '
                  f'L{_r(x0 + rw)} {_r(top)} L{_r(x + n["w"])} {_r(top)}" fill="none" stroke="{col}" stroke-width="{_r(sw)}" stroke-linejoin="round"/>')
            o += _draw(n['k'], x0 + rw + sz * .06, y, sz, col, attrs)
        x += n['w']
    return o
def has_fx(t):
    return bool(re.search('[\x01\x04]', fx_tok(t)))
def fx_w(t, size):
    return _meas(_tree(fx_tok(t)), size)[0]
def fx_svg(x, y, t, col, size=20, anchor='middle', attrs=' font-weight="700"', supcol=None, wrap=''):
    """attrs: atribut tambahan bagi setiap <text> (font, weight, halo). wrap: atribut untuk <g>."""
    L = _tree(fx_tok(t))
    if supcol:
        for n in L:
            if n['t'] == 'u': n['col'] = supcol
    w = _meas(L, size)[0]
    x0 = x if anchor == 'start' else (x - w if anchor == 'end' else x - w / 2)
    return f'<g{wrap}>' + _draw(L, x0, y, size, col, attrs) + '</g>'
