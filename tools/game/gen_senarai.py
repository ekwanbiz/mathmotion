# Jana game/senarai.js (senarai bab untuk Game TerokaMath) daripada hub index.html. Jalankan semula selepas tambah bab.
import re, os, json
R = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
h = open(os.path.join(R, 'index.html')).read()
babsrc = h[h.index('const BAB={'):h.index('};', h.index('const BAB={')) + 2]
BAB = {int(k): re.findall(r"'([^']*)'", v) for k, v in re.findall(r"\n (\d):\[(.*?)\]", babsrc)}
out = []
for m in re.finditer(r"\{id:'([a-z0-9]+)'.*?col:'(#[0-9A-Fa-f]{6})'.*?where:\[\[(\d+),(\d+)\]", h):
    i, col, t, n = m.group(1), m.group(2), int(m.group(3)), int(m.group(4))
    if not os.path.exists(os.path.join(R, i, 'soalan.js')): continue
    out.append({'id': i, 't': t, 'n': n, 'tajuk': BAB[t][n - 1], 'col': col})
out.sort(key=lambda x: (x['t'], x['n']))
open(os.path.join(R, 'game', 'senarai.js'), 'w').write('// Dijana oleh tools/game/gen_senarai.py\nconst SENARAI = ' + json.dumps(out, ensure_ascii=False) + ';\n')
print(len(out), 'bab')
