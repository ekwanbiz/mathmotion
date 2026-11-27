"""Alat terjemah skrip penjana nota (Python) ke English.
  python3 alat/en/py_en.py list <src.py>                 -> senarai literal bernombor (yang ada huruf kecil)
  python3 alat/en/py_en.py apply <src.py> <tsv> <out.py>  -> tulis skrip English
TSV: <literal asal (sumber penuh, termasuk awalan f dan petikan)>\t<literal English>; '\\t' dan '\\n' dilepas."""
import ast, sys, re

def segs(src):
    tree = ast.parse(src)
    lines = src.splitlines(keepends=True)
    off = [0]
    for l in lines: off.append(off[-1] + len(l))
    out = []
    def walk(n, inside=False):
        if isinstance(n, ast.JoinedStr) or (isinstance(n, ast.Constant) and isinstance(n.value, str) and not inside):
            a = off[n.lineno - 1] + len(lines[n.lineno - 1].encode()[:n.col_offset].decode())
            b = off[n.end_lineno - 1] + len(lines[n.end_lineno - 1].encode()[:n.end_col_offset].decode())
            out.append((a, b)); return
        for c in ast.iter_child_nodes(n): walk(c, inside or isinstance(n, ast.JoinedStr))
    walk(tree)
    # buang bertindih (concat implisit menghasilkan satu nod)
    return sorted(set(out))

def esc(s): return s.replace('\\', '\\\\').replace('\t', '\\t').replace('\n', '\\n')
def unesc(s): return re.sub(r'\\(.)', lambda m: {'t': '\t', 'n': '\n', '\\': '\\'}.get(m.group(1), '\\' + m.group(1)), s)

if __name__ == '__main__':
    cmd, path = sys.argv[1], sys.argv[2]
    src = open(path).read()
    S = segs(src)
    if cmd == 'list':
        for k, (a, b) in enumerate(S):
            t = src[a:b]
            body = re.sub(r'\{[^{}]*\}', '', t)
            if re.search(r'[a-z]{3}', re.sub(r'<[^>]*>|&\w+;', '', body)): print(f'{k}\t{esc(t)}')
    else:
        P = {}
        for l in open(sys.argv[3], encoding='utf-8'):
            l = l.rstrip('\n')
            if not l or l.startswith('#'): continue
            x, y = l.split('\t', 1); P[unesc(x)] = unesc(y)
        used = set(); out = []; last = 0
        for a, b in S:
            t = src[a:b]
            if t in P: out.append(src[last:a]); out.append(P[t]); last = b; used.add(t)
        out.append(src[last:])
        miss = [k for k in P if k not in used]
        if miss: print('TAK JUMPA:', [m[:60] for m in miss]); sys.exit(1)
        open(sys.argv[4], 'w').write(''.join(out)); print('ok', len(used), 'literal')
