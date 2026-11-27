"""Jana skrip nota English: python3 alat/en/nota_en.py <N>   (contoh 6)
Baca alat/nota/bina_bab<N>_t3.py + alat/en/nota_bab<N>_t3_en.tsv, tulis alat/nota/bina_bab<N>_t3_en.py, kemudian jalankannya.
Label kicker huruf besar (CONTOH, DEFINISI...) dan label pen/note ditukar automatik."""
import sys, os, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..', '..')
sys.path.insert(0, HERE)
from py_en import segs, unesc
N = sys.argv[1]
src_p = os.path.join(ROOT, 'alat', 'nota', f'bina_bab{N}_t3.py'); out_p = src_p.replace('.py', '_en.py')
src = open(src_p).read()
P = {}
for l in open(os.path.join(HERE, f'nota_bab{N}_t3_en.tsv'), encoding='utf-8'):
    l = l.rstrip('\n')
    if l and not l.startswith('#'):
        x, y = l.split('\t', 1); P[unesc(x)] = unesc(y)
out, last, used = [], 0, set()
for a, b in segs(src):
    t = src[a:b]
    if t in P: out += [src[last:a], P[t]]; last = b; used.add(t)
out.append(src[last:]); s = ''.join(out)
miss = [k for k in P if k not in used]
if miss: sys.exit('TAK JUMPA: ' + repr([m[:70] for m in miss]))
KICK = {'CONTOH': 'EXAMPLE', 'DEFINISI': 'DEFINITION', 'KONSEP': 'CONCEPT', 'RUMUS': 'FORMULA', 'PERATURAN': 'RULES', 'HUKUM': 'LAW',
        'PENGENALAN': 'INTRODUCTION', 'KONJEKTUR': 'CONJECTURE', 'SIFAT': 'PROPERTIES', 'GENERALISASI': 'GENERALISATION', 'AKTIVITI': 'ACTIVITY',
        'NOTA': 'NOTES', 'IMBAS KEMBALI': 'FLASHBACK', 'KESIMPULAN': 'CONCLUSION', 'LANGKAH': 'STEPS', 'ISTILAH': 'TERMS', 'CIRI-CIRI': 'CHARACTERISTICS',
        'PEMBINAAN': 'CONSTRUCTION', 'TAKRIF': 'DEFINITION', 'TEOREM': 'THEOREM', 'JENIS': 'TYPES', 'PERBANDINGAN': 'COMPARISON', 'LATIHAN': 'PRACTICE'}
def kick(m):
    w = m.group(2)
    mm = re.match(r'([A-Z][A-Z\- ]*?)( \d+)?( \(sambungan\))?$', w)
    if mm and mm.group(1) in KICK: w = KICK[mm.group(1)] + (mm.group(2) or '') + (' (continued)' if mm.group(3) else '')
    return m.group(1) + w + "'"
s = re.sub(r"(S\(s, ')([^']+)'", kick, s)
s = s.replace("exec(open(os.path.join(HERE, 'umum.py')).read())\n", "exec(open(os.path.join(HERE, 'umum.py')).read())\n\n\ndef pen(s, items, label=True):\n    return (p('<b>Solution:</b>') if label else '') + steps(s, items)\n\n\ndef note(html, lb='Reminder:'):\n    return f'<div class=\"sl-note\"><b>{lb}</b> {html}</div>'\n", 1)
L = {"'Peringatan:'": "'Reminder:'", "'Tip:'": "'Tips:'", "'Imbas kembali:'": "'Flashback:'", "'Imbas Kembali:'": "'Flashback:'", "'Buletin:'": "'Bulletin:'", "'Kuiz:'": "'Quiz:'", "'Ingat:'": "'Reminder:'", "'Nota:'": "'Note:'", "'Sudut diskusi:'": "'Discussion corner:'", "'Bijak minda:'": "'Smart mind:'", "'Petua:'": "'Tips:'"}
for a, b in L.items(): s = s.replace(a, b)
s = s.replace("'slides.js')", "'slides_en.js')")
open(out_p, 'w').write(s); print('tulis', out_p, len(used), 'literal')
subprocess.run([sys.executable, out_p], check=True)
