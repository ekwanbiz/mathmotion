"""Jana garislurus/soalan_en.js (English DLP) daripada garislurus/soalan.js. Istilah ikut buku teks English T3 Bab 9.
Pasangan BM<TAB>English dalam soalan_garislurus_en.tsv. Selepas terjemah, 'kos' ditukar kepada 'cos' di seluruh fail
(kunci fungsi TGF/TGINV/TGNISBAH dan paparan). Jalankan dari akar repo: python3 alat/en/soalan_garislurus_en.py"""
import sys, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from jana_en import terjemah
P = [l.rstrip('\n').split('\t') for l in open(os.path.join(HERE, 'soalan_garislurus_en.tsv'), encoding='utf-8') if l.strip()]
OUT = 'garislurus/soalan_en.js'
terjemah('garislurus/soalan.js', OUT, P, (), 'alat/en/soalan_garislurus_en.py')
s = open(OUT).read()

open(OUT, 'w').write(s)
