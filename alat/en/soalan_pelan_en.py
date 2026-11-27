"""Jana pelan/soalan_en.js (English DLP) daripada pelan/soalan.js. Istilah ikut buku teks English T3 Bab 7.
Kunci 'pelan', 'depan', 'sisi', 'atas' TIDAK diterjemah (kunci kod); nilai paparan ditukar melalui RAW.
Jalankan dari akar repo: python3 alat/en/soalan_pelan_en.py"""
import sys, os
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from jana_en import terjemah
P = [l.rstrip('\n').split('\t') for l in open(os.path.join(HERE, 'soalan_pelan_en.tsv'), encoding='utf-8') if l.strip()]
RAW = [("const PDVN = { pelan: 'pelan', depan: 'dongakan depan', sisi: 'dongakan sisi' };", "const PDVN = { pelan: 'plan', depan: 'front elevation', sisi: 'side elevation' };"),
       ("const PDARAH = { pelan: 'atas', depan: 'depan', sisi: 'sisi (kanan)' };", "const PDARAH = { pelan: 'above', depan: 'the front', sisi: 'the side (right)' };"),
       ("{ arrows: { depan: 'depan', sisi: 'sisi', atas: v === 'pelan' ? 'atas' : null } }", "{ arrows: { depan: 'front', sisi: 'side', atas: v === 'pelan' ? 'top' : null } }"),
       ('aria-label="Pelan bernombor: nombor ialah bilangan kiub dalam setiap lajur"', 'aria-label="Numbered plan: the numbers are the number of cubes in each column"'),
       ("{ arrows: { depan: 'depan', sisi: 'sisi' } }", "{ arrows: { depan: 'front', sisi: 'side' } }")]
terjemah('pelan/soalan.js', 'pelan/soalan_en.js', P, RAW, 'alat/en/soalan_pelan_en.py')
