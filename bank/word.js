'use strict';
/* =================== Bank Soalan · Muat turun Word (.docx) ===================
   Dimuat hanya apabila guru tekan butang Word (bersama ../lib/docx.js).
   Guna fungsi bank.js: P, sections, kepala, onOf, stOf, mk, FIG, marksOf, ROM, toast.
   Pecahan/vektor/punca → persamaan Word (boleh edit). Rajah SVG → gambar PNG. */
(function () {
  const D = docx, A4W = 11906, MG = 850, CW = A4W - 2 * MG, IND = [0, 567, 1134, 1701];
  const NONE = { style: D.BorderStyle.NONE, size: 0, color: 'FFFFFF' }, LINE = { style: D.BorderStyle.SINGLE, size: 6, color: '000000' };
  const NB = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };
  const BX = { top: LINE, bottom: LINE, left: LINE, right: LINE, insideHorizontal: LINE, insideVertical: LINE };
  const TABS = [567, 1134, 1701].map(position => ({ type: D.TabStopType.LEFT, position }));
  const EN = { i: true, c: '404040', sz: 20 };
  const R = (text, o) => new D.TextRun(Object.assign({ text }, o || {}));
  const TAB = () => new D.TextRun({ children: [new D.Tab()] });
  const Pg = (children, o) => new D.Paragraph(Object.assign({ children, tabStops: TABS, spacing: { after: 60 } }, o || {}));
  const bi = (dw, bm, en) => dw ? [R(bm + ' / '), R(en, { italics: true })] : [R(bm)];

  /* ---------- HTML soalan → run Word ---------- */
  function runsOf(html, st) { const box = document.createElement('div'); box.innerHTML = mk(html); return walk(box, st || {}); }
  function walk(node, st) {
    const out = [];
    node.childNodes.forEach(n => {
      if (n.nodeType === 3) { const t = n.textContent.replace(/ /g, ' '); if (t) out.push(R(t, { italics: st.i, bold: st.b, subScript: st.sub, superScript: st.sup, color: st.c, size: st.sz })); return; }
      if (n.nodeType !== 1) return;
      const tg = n.tagName, cl = n.classList;
      if (tg === 'BR') { out.push(new D.TextRun({ break: 1 })); return; }
      if (cl.contains('fr') || cl.contains('vc') || cl.contains('rt')) { out.push(new D.Math({ children: mathOf(n) })); return; }
      if (cl.contains('ch')) { out.push(R([...n.children].map(c => c.textContent).join('    /    '), { italics: st.i, color: st.c, size: st.sz })); return; }
      const s2 = Object.assign({}, st);
      if (tg === 'I' || tg === 'EM') s2.i = true; if (tg === 'B' || tg === 'STRONG') s2.b = true;
      if (tg === 'SUB') s2.sub = true; if (tg === 'SUP') s2.sup = true;
      out.push(...walk(n, s2));
    });
    return out;
  }
  function mathOf(n) {
    if (n.nodeType === 3) { const t = n.textContent.replace(/ /g, ' '); return t ? [new D.MathRun(t)] : []; }
    if (n.nodeType !== 1) return [];
    const cl = n.classList;
    if (cl.contains('fr')) return [new D.MathFraction({ numerator: kids(n.children[0]), denominator: kids(n.children[1]) })];
    if (cl.contains('vc')) { const s = n.querySelectorAll('.fr>span'); return [new D.MathRoundBrackets({ children: [new D.MathFraction({ numerator: kids(s[0]), denominator: kids(s[1]), type: 'noBar' })] })]; }
    if (cl.contains('rt')) return [new D.MathRadical({ children: kids(n.querySelector('span')) })];
    return kids(n);
  }
  function kids(el) { const o = []; if (el) el.childNodes.forEach(c => o.push(...mathOf(c))); return o.length ? o : [new D.MathRun(' ')]; }

  /* ---------- rajah ---------- */
  function svgPng(svg) {
    return new Promise(res => {
      let s = svg.replace(/currentColor/g, '#000');
      if (!/xmlns=/.test(s)) s = s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      const vb = /viewBox="([^"]+)"/.exec(s), wa = /<svg[^>]*\swidth="([\d.]+)"/.exec(s);
      const v = vb ? vb[1].trim().split(/[\s,]+/).map(Number) : [0, 0, 200, 150], w = wa ? +wa[1] : v[2], h = w * v[3] / v[2];
      const img = new Image();
      img.onload = () => {
        const k = 3, c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
        const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
        c.toBlob(b => b ? b.arrayBuffer().then(a => res({ data: new Uint8Array(a), w, h })) : res(null), 'image/png');
      };
      img.onerror = () => res(null);
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
    });
  }
  async function prepImgs(secs) {
    const ids = new Set();
    secs.forEach(s => s.rows.forEach(({ q }) => { if (q.fig) ids.add(q.fig); (q.parts || []).forEach(p => { if (p.fig) ids.add(p.fig); }); }));
    const out = {};
    for (const id of ids) if (FIG[id] && FIG[id].trim().startsWith('<svg')) out[id] = await svgPng(FIG[id]);
    return out;
  }
  function figBlocks(id, big, lvl, imgs) {
    if (!id || !FIG[id]) return [];
    if (/class="kd"/.test(FIG[id])) { // kad bernombor
      const nums = [...FIG[id].matchAll(/<span>([^<]*)<\/span>/g)].map(m => m[1]);
      return [new D.Table({ indent: { size: IND[lvl], type: D.WidthType.DXA }, borders: BX, rows: [new D.TableRow({ children: nums.map(n => new D.TableCell({ width: { size: 520, type: D.WidthType.DXA }, verticalAlign: D.VerticalAlign.CENTER, children: [Pg([R(n, { bold: true })], { alignment: D.AlignmentType.CENTER, spacing: { before: 120, after: 120 } })] })) })] }), Pg([])];
    }
    const im = imgs[id]; if (!im) return [];
    const w = big ? 420 : Math.min(im.w * 1.05, 250), h = im.h * w / im.w;
    return [Pg([new D.ImageRun({ type: 'png', data: im.data, transformation: { width: Math.round(w), height: Math.round(h) } })], { indent: { left: IND[lvl] }, spacing: { before: 60, after: 100 } })];
  }

  /* ---------- jadual ---------- */
  const cell = (children, o) => new D.TableCell(Object.assign({ children, margins: { top: 50, bottom: 50, left: 100, right: 100 } }, o || {}));
  const ctr = (runs, o) => Pg(runs, Object.assign({ alignment: D.AlignmentType.CENTER, spacing: { after: 0 } }, o || {}));
  function jadual(jd, dw, lvl) {
    if (!jd || !jd.r) return [];
    const n = jd.r[0].length, fw = 2200, cw = Math.min(1100, Math.floor((CW - IND[lvl] - fw) / (n - 1)));
    return [new D.Table({ indent: { size: IND[lvl], type: D.WidthType.DXA }, borders: BX, columnWidths: [fw, ...Array(n - 1).fill(cw)],
      rows: jd.r.map((r, i) => new D.TableRow({ height: { value: 440, rule: D.HeightRule.ATLEAST }, children: r.map((c, j) => cell(j === 0
        ? [ctr(runsOf(c, { b: true })), ...(dw && jd.re && jd.re[i] ? [ctr(runsOf(jd.re[i], EN))] : [])]
        : [ctr(c === '?' ? [] : runsOf(c))], { width: { size: j ? cw : fw, type: D.WidthType.DXA }, verticalAlign: D.VerticalAlign.CENTER })) })) }), Pg([])];
  }
  const markPara = (m, dw) => Pg(dw ? [R(`[${m} markah / `, { size: 20 }), R(`${m} marks]`, { italics: true, size: 20 })] : [R(`[${m} markah]`, { size: 20 })], { alignment: D.AlignmentType.RIGHT, spacing: { after: 100 } });

  /* ---------- satu soalan ---------- */
  function qBlocks(q, no, dw, imgs) {
    const B = [];
    let lead = [R(no + '.', { bold: true }), TAB()];
    // perenggan dengan label (nombor soalan dan/atau label bahagian)
    const line = (html, lvl, label, en) => {
      const L = [];
      if (lead) { L.push(...lead); lead = null; }
      if (label) L.push(R(label, { bold: true }), TAB());
      const hang = L.length ? (label && L.length > 2 ? 1134 : 567) : 0;
      const left = label ? IND[2] : IND[1];
      B.push(Pg([...L, ...runsOf(html)], { indent: hang ? { left, hanging: hang } : { left } }));
      if (dw && en) B.push(Pg(runsOf(en, EN), { indent: { left } }));
    };
    if (q.q) line(q.q, 1, '', q.qe);
    B.push(...figBlocks(q.fig, false, 1, imgs));
    if (q.bhg === 'A' && q.pil) {
      if (lead) line('', 1, '');
      const opt = i => cell([Pg([R('ABCD'[i], { bold: true }), TAB(), ...runsOf(q.pil[i])], { indent: { left: 567, hanging: 567 }, spacing: { after: 0 } }),
        ...(dw && q.pe && q.pe[i] ? [Pg(runsOf(q.pe[i], EN), { indent: { left: 567 } })] : [])], { width: { size: (CW - 567) / 2, type: D.WidthType.DXA } });
      B.push(new D.Table({ indent: { size: 567, type: D.WidthType.DXA }, borders: NB, columnWidths: [(CW - 567) / 2, (CW - 567) / 2],
        rows: [0, 2].map(k => new D.TableRow({ children: [opt(k), opt(k + 1)] })) }), Pg([]));
    }
    (q.parts || []).forEach(pt => {
      const lvl = pt.l ? 2 : 1;
      if (pt.q || lead || pt.l) line(pt.q || '', lvl, pt.l || '', pt.qe);
      B.push(...figBlocks(pt.fig, pt.big, lvl, imgs));
      if (q.bhg === 'B') B.push(...partB(pt, lvl, dw));
      else {
        B.push(...jadual(pt.jadual, dw, lvl), markPara(+pt.m || 0, dw));
        if (!pt.big) {
          B.push(Pg([R(dw ? 'Jawapan / ' : 'Jawapan:', { bold: true, size: 19 }), ...(dw ? [R('Answer:', { bold: true, italics: true, size: 19 })] : [])], { indent: { left: IND[lvl] }, spacing: { after: 40 } }));
          const hmm = pt.ruang || 12 + 9 * (+pt.m || 1);
          B.push(new D.Table({ indent: { size: IND[lvl], type: D.WidthType.DXA }, borders: NB, columnWidths: [CW - IND[lvl]],
            rows: [new D.TableRow({ height: { value: Math.round(hmm * 56.7), rule: D.HeightRule.ATLEAST }, children: [cell([Pg([])], { width: { size: CW - IND[lvl], type: D.WidthType.DXA } })] })] }), Pg([]));
        }
      }
    });
    if (lead) line('', 1, '');
    return B;
  }
  function partB(pt, lvl, dw) {
    const it = pt.items || [], j = pt.jenis, B = [], L = IND[lvl], W2 = CW - L;
    const tc = x => [Pg(runsOf(x.t), { spacing: { after: 0 } }), ...(dw && x.te ? [Pg(runsOf(x.te, EN), { spacing: { after: 0 } })] : [])];
    if (j === 'pad') {
      const ws = [Math.round(W2 * .45), 1100, W2 - Math.round(W2 * .45) - 1100];
      B.push(new D.Table({ indent: { size: L, type: D.WidthType.DXA }, borders: NB, columnWidths: ws, rows: it.map((x, i) => new D.TableRow({ height: { value: 560, rule: D.HeightRule.ATLEAST }, children: [
        cell(tc(x), { width: { size: ws[0], type: D.WidthType.DXA }, verticalAlign: D.VerticalAlign.CENTER }),
        cell([ctr([R('•          •')])], { width: { size: ws[1], type: D.WidthType.DXA }, verticalAlign: D.VerticalAlign.CENTER }),
        cell([ctr(runsOf((pt.kanan || [])[i] || '')), ...(dw && pt.kanane && pt.kanane[i] ? [ctr(runsOf(pt.kanane[i], EN))] : [])],
          { width: { size: ws[2], type: D.WidthType.DXA }, verticalAlign: D.VerticalAlign.CENTER, borders: { top: LINE, bottom: LINE, left: LINE, right: LINE } })] })) }), Pg([]));
    } else if (j === 'jadual') B.push(...jadual(pt.jadual, dw, lvl));
    else if (j === 'bp' || j === 'tanda' || j === 'label') {
      const ws = [W2 - 1700, 1700];
      B.push(new D.Table({ indent: { size: L, type: D.WidthType.DXA }, borders: BX, columnWidths: ws, rows: it.map(x => new D.TableRow({ height: { value: 520, rule: D.HeightRule.ATLEAST }, children: [
        cell(tc(x), { width: { size: ws[0], type: D.WidthType.DXA }, verticalAlign: D.VerticalAlign.CENTER }),
        cell([ctr(j === 'tanda' ? [R('☐', { size: 32 })] : [])], { width: { size: ws[1], type: D.WidthType.DXA }, verticalAlign: D.VerticalAlign.CENTER })] })) }), Pg([]));
    } else it.forEach((x, i) => {
      const lab = it.length > 1 ? [R(`(${ROM[i]})`), TAB()] : [];
      B.push(Pg([...lab, ...runsOf(x.t)], { indent: lab.length ? { left: L + 567, hanging: 567 } : { left: L }, spacing: { after: dw && x.te ? 20 : 140 } }));
      if (dw && x.te) B.push(Pg(runsOf(x.te, EN), { indent: { left: L + (lab.length ? 567 : 0) }, spacing: { after: 140 } }));
    });
    B.push(markPara(+pt.m || 0, dw));
    return B;
  }

  /* ---------- kulit ---------- */
  function cover(p, secs, withSk) {
    const K = kepala(p), dw = !!p.dw, on = k => onOf(p, k), B = [], C = D.AlignmentType.CENTER;
    if (K.tajuk) B.push(Pg([R(K.tajuk.toUpperCase(), { bold: true, size: 26 })], { alignment: C }));
    if (K.sekolah) B.push(Pg([R(K.sekolah, { bold: true, size: 24 })], { alignment: C }));
    if (K.alamat) B.push(Pg([R(K.alamat, { size: 21 })], { alignment: C }));
    if (on('kotak')) {
      const cs = [[R(K.mp, { bold: true, size: 28 }), ...(K.kod ? [R('   ' + K.kod, { bold: true, size: 28 })] : [])], K.ting ? [R(K.ting)] : null, K.masa ? [R(K.masa)] : null].filter(Boolean);
      B.push(Pg([], { spacing: { after: 120 } }), new D.Table({ alignment: C, borders: BX, rows: [new D.TableRow({ height: { value: 620, rule: D.HeightRule.ATLEAST },
        children: cs.map((r, i) => cell([ctr(r)], { width: { size: i ? 2600 : 3400, type: D.WidthType.DXA }, verticalAlign: D.VerticalAlign.CENTER, margins: { left: 240, right: 240, top: 80, bottom: 80 } })) })] }), Pg([], { spacing: { after: 120 } }));
    }
    if (K.tarikh) B.push(Pg([...bi(dw, 'Tarikh', 'Date'), R(': ' + K.tarikh)], { alignment: C }));
    if (withSk) { B.push(Pg(dw ? [R('SKEMA JAWAPAN / ', { bold: true }), R('MARKING SCHEME', { bold: true, italics: true })] : [R('SKEMA JAWAPAN', { bold: true })], { alignment: C, spacing: { before: 160, after: 200 } })); return B; }
    if (on('jangan')) B.push(Pg([R('JANGAN BUKA KERTAS SOALAN INI SEHINGGA DIBERITAHU', { bold: true, size: 21 }), ...(dw ? [new D.TextRun({ break: 1 }), R('DO NOT OPEN THIS QUESTION PAPER UNTIL YOU ARE TOLD TO DO SO', { bold: true, italics: true, size: 19 })] : [])], { alignment: C, spacing: { before: 120, after: 200 } }));
    if (on('nama')) B.push(Pg([...bi(dw, 'Nama', 'Name'), R(': ______________________________________   '), ...bi(dw, 'Kelas', 'Class'), R(': ____________')], { spacing: { before: 120, after: 240 } }));
    if (on('arahan') && K.arahan.length) {
      const ps = [Pg([R(dw ? 'Arahan / ' : 'Arahan:', { bold: true }), ...(dw ? [R('Instructions:', { bold: true, italics: true })] : [])], { spacing: { after: 80 } })];
      K.arahan.forEach((a, i) => {
        ps.push(Pg([R(i + 1 + '.'), TAB(), R(a[0], { size: 20 })], { indent: { left: 567, hanging: 567 }, spacing: { after: dw && a[1] ? 0 : 60 } }));
        if (dw && a[1]) ps.push(Pg([R(a[1], { italics: true, color: '404040', size: 19 })], { indent: { left: 567 } }));
      });
      B.push(new D.Table({ borders: BX, columnWidths: [CW], rows: [new D.TableRow({ children: [cell(ps, { width: { size: CW, type: D.WidthType.DXA }, margins: { top: 100, bottom: 100, left: 160, right: 160 } })] })] }), Pg([], { spacing: { after: 200 } }));
    }
    if (on('pem')) B.push(pem(secs, dw), Pg([]));
    if (on('nota') && K.nota) B.push(Pg([R(K.nota, { size: 19 })], { alignment: C, spacing: { before: 240 } }));
    if (on('kulit')) B.push(Pg([new D.PageBreak()]));
    return B;
  }
  function pem(secs, dw) {
    const W = [1500, 1500, 1700, 2200], c = (r, o) => cell([ctr(r, { spacing: { after: 0 } })], Object.assign({ verticalAlign: D.VerticalAlign.CENTER }, o || {}));
    const b = t => [R(t, { bold: true, size: 19 })];
    const hd = (bm, en) => dw ? [R(bm + ' / ', { bold: true, size: 18 }), R(en, { bold: true, italics: true, size: 18 })] : b(bm);
    const rows = [new D.TableRow({ children: [c(hd('Untuk Kegunaan Pemeriksa', 'For Examiner’s Use'), { columnSpan: 4 })] }),
      new D.TableRow({ children: [c(hd('Bahagian', 'Section')), c(hd('Soalan', 'Question')), c(hd('Markah Penuh', 'Full Marks')), c(hd('Markah Diperoleh', 'Marks Obtained'))] })];
    let tot = 0;
    secs.forEach(({ b: s, rows: r }) => {
      const ms = r.map(x => marksOf(x.q)), sum = ms.reduce((a, x) => a + x, 0); tot += sum;
      if (!s || s === 'A') rows.push(new D.TableRow({ children: [c([R(s || '')]), c([R('1 – ' + r.length)]), c([R(String(sum))]), c([])] }));
      else ms.forEach((m, i) => rows.push(new D.TableRow({ children: [...(i === 0 ? [c([R(s)], { rowSpan: ms.length })] : []), c([R(String(i + 1))]), c([R(String(m))]), c([])] })));
    });
    rows.push(new D.TableRow({ children: [c(hd('Jumlah', 'Total'), { columnSpan: 2 }), c(b(String(tot))), c([])] }));
    return new D.Table({ alignment: D.AlignmentType.RIGHT, borders: BX, columnWidths: W, rows });
  }

  /* ---------- skema ---------- */
  function skBlocks(q, no) {
    const B = [], first = [R(no + '.', { bold: true }), TAB()];
    let lead = first;
    const ln = (runs, left) => { const l = lead; lead = null; left = left || 567; B.push(Pg([...(l || []), ...runs], { indent: l ? { left, hanging: left } : left > 567 ? { left, hanging: 567 } : { left } })); };
    (q.parts || []).forEach(pt => {
      const it = pt.items || [];
      if (q.bhg === 'B') {
        const ans = it.map((x, i) => pt.jenis === 'pad' ? `${x.t} → <b>${x.a}</b>` : pt.jenis === 'tanda' ? `${it.length > 1 ? '(' + ROM[i] + ') ' : ''}<b>${x.a ? '✓' : '✗'}</b>`
          : `${it.length > 1 ? '(' + ROM[i] + ') ' : ''}<b>${x.a}</b>`).join(pt.jenis === 'pad' ? '<br>' : '      ');
        ln([...(pt.l ? [R(pt.l, { bold: true }), TAB()] : []), ...runsOf(ans), R(`   [${+pt.m || 0}]`, { color: '666666', size: 19 })], pt.l ? 1134 : 567);
        if (pt.sk) B.push(Pg(runsOf(pt.sk, { i: true, c: '555555', sz: 19 }), { indent: { left: 1134 } }));
      } else {
        ln([R(pt.l || '', { bold: true }), TAB(), ...runsOf(pt.sk || ''), R(`   [${+pt.m || 0}]`, { color: '666666', size: 19 })], 1134);
      }
    });
    B.push(Pg([], { spacing: { after: 80 } }));
    return B;
  }

  /* ---------- dokumen ---------- */
  window.wordBuild = async function (withSk) {
    const p = P(), st = stOf(p), dw = !!p.dw, secs = sections(p).filter(s => s.rows.length);
    if (!secs.length) { toast('Kertas masih kosong'); return; }
    const imgs = withSk ? {} : await prepImgs(secs);
    const ch = cover(p, secs, withSk);
    let first = true;
    secs.forEach(({ b, rows }) => {
      if (b) ch.push(Pg([...(dw ? [R('Bahagian ' + b + ' / ', { bold: true, size: 24 }), R('Section ' + b, { bold: true, italics: true, size: 24 })] : [R('Bahagian ' + b, { bold: true, size: 24 })]),
        R(`   [${rows.reduce((a, x) => a + marksOf(x.q), 0)} ${dw ? 'markah / marks' : 'markah'}]`, { size: 20 })],
        { pageBreakBefore: st === 'ABC' && !first && !withSk, keepNext: true, border: { bottom: { style: D.BorderStyle.SINGLE, size: 8, color: '000000', space: 2 } }, spacing: { before: 200, after: 160 } }));
      first = false;
      if (withSk && b === 'A') {
        const n = 5, rs = [];
        for (let i = 0; i < rows.length; i += n) rs.push(new D.TableRow({ children: Array.from({ length: n }, (_, k) => cell([Pg(rows[i + k] ? [R(i + k + 1 + '.  '), R(rows[i + k].q.jaw || '?', { bold: true })] : [], { spacing: { after: 0 } })], { width: { size: CW / n, type: D.WidthType.DXA } })) }));
        ch.push(new D.Table({ borders: NB, columnWidths: Array(n).fill(CW / n), rows: rs }), Pg([]));
        return;
      }
      rows.forEach((x, i) => ch.push(...(withSk ? skBlocks(x.q, i + 1) : qBlocks(x.q, i + 1, dw, imgs))));
    });
    if (!withSk && onOf(p, 'tamat')) ch.push(Pg([R('KERTAS SOALAN TAMAT', { bold: true }), ...(dw ? [new D.TextRun({ break: 1 }), R('END OF QUESTION PAPER', { bold: true, italics: true })] : [])], { alignment: D.AlignmentType.CENTER, spacing: { before: 360 } }));
    const doc = new D.Document({
      creator: 'TerokaMath', title: p.nama,
      styles: { default: { document: { run: { font: 'Arial', size: 22 } } } },
      sections: [{ properties: { page: { size: { width: A4W, height: 16838 }, margin: { top: MG, bottom: MG, left: MG, right: MG } } },
        footers: { default: new D.Footer({ children: [new D.Paragraph({ alignment: D.AlignmentType.CENTER, children: [new D.TextRun({ children: [D.PageNumber.CURRENT], size: 18 })] })] }) },
        children: ch }]
    });
    const blob = await D.Packer.toBlob(doc);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (p.nama + (withSk ? ' - Skema' : '')).replace(/[\\/:*?"<>|]+/g, '').trim() + '.docx';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 8000);
    toast('Fail Word dimuat turun');
  };
})();
