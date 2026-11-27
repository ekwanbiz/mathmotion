"""Jana berskala/soalan_en.js (English DLP) daripada berskala/soalan.js. Istilah ikut buku teks English T3 Bab 4.
Pasangan BM<TAB>English dalam soalan_berskala_en.tsv. Jalankan dari akar repo: python3 alat/en/soalan_berskala_en.py"""
import sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from jana_en import terjemah
P = [l.rstrip('\n').split('\t') for l in open(os.path.join(HERE, 'soalan_berskala_en.tsv'), encoding='utf-8') if l.strip()]
RAW = [
 ("const bsPj = ob => (ob === 'daun' ? 'sehelai' : ob === 'kancing baju' ? 'sebiji' : 'seekor');", "const bsPj = ob => (ob === 'ant' ? 'an' : 'a');"),
 ("const bsBare = s => s.replace(/^(sebuah|sekeping|sehelai|seekor|sebiji|sebatang) /, '');", "const bsBare = s => s.replace(/^(a|an) /, '');"),
 ("ctx = n >= 10000 ? 'peta' : r.p(['pelan', 'lukisan']);", "ctx = n >= 10000 ? 'map' : r.p(['plan', 'drawing']);"),
 ("bsBarFig(3, 'lukisan', `Skala ${bsSk(a, b)}`)", "bsBarFig(3, 'drawing', `Skala ${bsSk(a, b)}`)"),
]
terjemah('berskala/soalan.js', 'berskala/soalan_en.js', P, RAW, 'alat/en/soalan_berskala_en.py')
