"""Jana pengguna/soalan_en.js (English DLP) daripada pengguna/soalan.js. Istilah ikut buku teks English T3 Bab 3.
Pasangan BM<TAB>English dalam soalan_pengguna_en.tsv. Jalankan dari akar repo: python3 alat/en/soalan_pengguna_en.py"""
import sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from jana_en import terjemah
P = [l.rstrip('\n').split('\t') for l in open(os.path.join(HERE, 'soalan_pengguna_en.tsv'), encoding='utf-8') if l.strip()]
terjemah('pengguna/soalan.js', 'pengguna/soalan_en.js', P, (), 'alat/en/soalan_pengguna_en.py')
