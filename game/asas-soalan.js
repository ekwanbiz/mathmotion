'use strict';
/* =================== GAME · KIRA PANTAS (+ − × ÷) ===================
   Dipakai apabila b=asas (tiada bab). Soalan bercampur empat operasi; makin lama makin susah
   (ikut bilangan soalan yang sudah keluar, TMG.qn). Jawapan sentiasa nombor bulat positif. */
const ASR = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
function asasTahap() { const n = (typeof TMG !== 'undefined' && TMG.qn) || 0; return n < 4 ? 0 : n < 7 ? 1 : 2; }
function gq() {
  const T = asasTahap(), op = ['+', '−', '×', '÷'][ASR(0, 3)];
  const addMax = [20, 100, 1000][T], sifir = [[2, 5], [2, 10], [2, 12]][T], kMax = [10, 10, 12][T];
  let a, b, ans;
  if (op === '+') { ans = ASR(T ? 20 : 5, addMax); a = ASR(1, ans - 1); b = ans - a; }
  else if (op === '−') { a = ASR(T ? 20 : 5, addMax); b = ASR(1, a - 1); ans = a - b; }
  else if (op === '×') { a = ASR(sifir[0], sifir[1]); b = ASR(2, kMax); if (Math.random() < .5) [a, b] = [b, a]; ans = a * b; }
  else { b = ASR(sifir[0], sifir[1]); ans = ASR(2, kMax); a = b * ans; }
  // pengganggu dekat dengan jawapan
  const near = op === '×' ? [ans + a, ans - a, ans + b, ans - b, ans + 1, ans - 1, ans + 10]
    : op === '÷' ? [ans + 1, ans - 1, ans + 2, ans - 2, ans * 2, ans + 10]
    : [ans + 1, ans - 1, ans + 10, ans - 10, ans + 2, ans - 2, ans + 11, ans - 9];
  const pool = [...new Set(near.filter(v => v > 0 && v !== ans))].sort(() => Math.random() - .5).slice(0, 3);
  while (pool.length < 3) { const v = ans + ASR(3, 15); if (!pool.includes(v) && v !== ans) pool.push(v); }
  const opts = [ans, ...pool].sort(() => Math.random() - .5);
  return { type: 'mcq', q: `${a} ${op} ${b} = ?`, fig: '', opts: opts.map(String), c: opts.indexOf(ans) };
}
