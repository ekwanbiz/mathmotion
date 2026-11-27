"""Jana sudutbulatan/soalan_en.js (English DLP) daripada sudutbulatan/soalan.js. Istilah ikut buku teks English T3 Bab 6.
Pasangan BM<TAB>English dalam soalan_sudutbulatan_en.tsv. Selepas terjemah, 'kos' ditukar kepada 'cos' di seluruh fail
(kunci fungsi TGF/TGINV/TGNISBAH dan paparan). Jalankan dari akar repo: python3 alat/en/soalan_sudutbulatan_en.py"""
import sys, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from jana_en import terjemah
P = [l.rstrip('\n').split('\t') for l in open(os.path.join(HERE, 'soalan_sudutbulatan_en.tsv'), encoding='utf-8') if l.strip()]
OUT = 'sudutbulatan/soalan_en.js'
terjemah('sudutbulatan/soalan.js', OUT, P, [('aria-label="Kedudukan dua bulatan"', 'aria-label="Positions of two circles"')], 'alat/en/soalan_sudutbulatan_en.py')
s = open(OUT).read()

open(OUT, 'w').write(s)
