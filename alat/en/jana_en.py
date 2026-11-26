"""Pembantu dikongsi: terjemah literal rentetan dalam fail JS bab (BM -> English, DLP).
Guna: from jana_en import terjemah; terjemah(src, out, PAIRS, RAW, HDR_TAG)"""
def terjemah(src, out, PAIRS, RAW=(), note=''):
    s = open(src).read()
    miss = []
    for a, b in RAW:
        if a not in s: miss.append('RAW:' + a[:60]); continue
        s = s.replace(a, b)
    for bm, en in PAIRS:
        hit = False
        for q in ["'", '`', '"']:
            a = q + bm + q
            if a in s:
                bq = q
                if q == "'" and "'" in en: bq = '"' if '"' not in en else '`'
                if q == '"' and '"' in en: bq = "'" if "'" not in en else '`'
                s = s.replace(a, bq + en + bq); hit = True
        if not hit: miss.append(bm)
    s = s.replace("'use strict';", "'use strict';\n/* ENGLISH (DLP): dijana daripada " + src.split('/')[-1] + " oleh " + note + "; jangan sunting dengan tangan. */", 1)
    open(out, 'w').write(s)
    print(out, 'tak jumpa:', miss)
