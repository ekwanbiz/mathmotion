'use strict';
/* =================== SAMPAN LAJU · SUNGAI & BAKAU ===================
   Sampan mudik sungai (pandangan atas). Tukar lorong kiri/kanan untuk kutip ikan emas dan elak
   buaya serta kayu hanyut. Bila soalan muncul, 4 pelampung jawapan hanyut ke arah sampan:
   masuk lorong pelampung jawapan betul. */
const SP_LANE = [370, 563, 756, 949], SP_PY = 600, SP_V0 = 200, SP_VMAX = 560, SP_BACA = 9;
class SampanScene extends Phaser.Scene {
  constructor() { super('sampan'); }
  create() {
    TMG.scene = this;
    Object.assign(this, { lane: 1, speed: SP_V0, jarak: 0, nextSpawn: 400, obj: [], gate: null, kebal: 0, masa: 0 });
    this.buatTekstur();
    this.air = this.add.tileSprite(660, 360, 820, 720, 'sp-air');
    this.tebingK = this.add.tileSprite(125, 360, 250, 720, 'sp-tebing');
    this.tebingKa = this.add.tileSprite(1175, 360, 250, 720, 'sp-tebing').setFlipX(true);
    this.objLayer = this.add.container(0, 0);
    this.sampan = this.add.container(SP_LANE[this.lane], SP_PY, [this.add.image(0, 0, 'sp-sampan')]);
    this.dayung = this.add.image(0, 6, 'sp-dayung'); this.sampan.add(this.dayung);
    this.tweens.add({ targets: this.dayung, angle: 35, duration: 260, yoyo: true, repeat: -1 });
    this.riak = this.time.addEvent({ delay: 140, loop: true, callback: () => this.buatRiak() });
    const k = this.input.keyboard;
    k.on('keydown-LEFT', () => this.tukar(-1)); k.on('keydown-A', () => this.tukar(-1));
    k.on('keydown-RIGHT', () => this.tukar(1)); k.on('keydown-D', () => this.tukar(1));
    let sx = null;
    this.input.on('pointerdown', p => { sx = p.x; });
    this.input.on('pointerup', p => { if (sx === null) return; const dx = p.x - sx; if (Math.abs(dx) > 40) this.tukar(dx < 0 ? -1 : 1); else this.tukar(p.x < this.sampan.x ? -1 : 1); sx = null; });
    this.jadualSoalan(TMG.SELANG * .6);
  }
  buatTekstur() {
    if (this.textures.exists('sp-air')) return;
    const g = this.make.graphics({ add: false });
    g.fillStyle(0x0E7490); g.fillRect(0, 0, 820, 180); g.lineStyle(3, 0x67E8F9, .35);
    for (let i = 0; i < 9; i++) { const x = (i * 97) % 800 + 10, y = (i * 53) % 170 + 5; g.beginPath(); g.arc(x, y, 14, Math.PI * 1.1, Math.PI * 1.9); g.strokePath(); }
    g.generateTexture('sp-air', 820, 180); g.clear();
    // tebing bakau
    g.fillStyle(0x854D0E); g.fillRect(0, 0, 250, 240); g.fillStyle(0x166534); g.fillRect(0, 0, 200, 240);
    [[60, 40], [150, 110], [80, 180], [170, 20], [30, 120]].forEach(([x, y]) => { g.fillStyle(0x15803D); g.fillCircle(x, y, 40); g.fillStyle(0x22C55E); g.fillCircle(x - 10, y - 10, 18); });
    g.lineStyle(4, 0x78350F); for (let y = 20; y < 240; y += 60) { g.lineBetween(200, y, 238, y + 18); g.lineBetween(200, y + 10, 230, y + 36); }
    g.generateTexture('sp-tebing', 250, 240); g.clear();
    // sampan (atas)
    g.fillStyle(0x92400E); g.fillEllipse(40, 70, 70, 150); g.fillStyle(0xB45309); g.fillEllipse(40, 70, 50, 120);
    g.fillStyle(0x38BDF8); g.fillCircle(40, 74, 16); g.fillStyle(0xFCD34D); g.fillCircle(40, 74, 10);
    g.lineStyle(3, 0x451A03); g.strokeEllipse(40, 70, 70, 150);
    g.generateTexture('sp-sampan', 80, 140); g.clear();
    g.fillStyle(0x78350F); g.fillRect(0, 4, 110, 6); g.fillStyle(0xA16207); g.fillEllipse(8, 7, 18, 12); g.fillEllipse(102, 7, 18, 12);
    g.generateTexture('sp-dayung', 110, 14); g.clear();
    // buaya (atas)
    g.fillStyle(0x3F6212); g.fillEllipse(40, 80, 44, 130); g.fillTriangle(24, 130, 56, 130, 40, 170); g.fillEllipse(40, 22, 30, 44);
    g.fillStyle(0x65A30D); for (let y = 50; y < 130; y += 16) g.fillCircle(40, y, 5);
    g.fillStyle(0x3F6212); [[14, 50], [66, 50], [14, 110], [66, 110]].forEach(([x, y]) => g.fillEllipse(x, y, 20, 12));
    g.fillStyle(0xFEF08A); g.fillCircle(32, 26, 4); g.fillCircle(48, 26, 4); g.fillStyle(0x0B1220); g.fillCircle(32, 26, 2); g.fillCircle(48, 26, 2);
    g.generateTexture('sp-buaya', 80, 172); g.clear();
    // kayu hanyut
    g.fillStyle(0x78350F); g.fillRoundedRect(0, 0, 150, 34, 16); g.fillStyle(0xA16207); g.fillEllipse(140, 17, 18, 30); g.lineStyle(2, 0x451A03); g.lineBetween(20, 12, 110, 12); g.lineBetween(30, 24, 100, 24);
    g.generateTexture('sp-kayu', 152, 34); g.clear();
    // ikan emas
    g.fillStyle(0xF59E0B); g.fillEllipse(24, 16, 34, 20); g.fillTriangle(4, 16, -6 + 6, 4, 0, 28); g.fillStyle(0x0B1220); g.fillCircle(34, 13, 2.5);
    g.generateTexture('sp-ikan', 44, 32); g.clear();
    // pelampung jawapan
    g.fillStyle(0xFFFFFF); g.fillCircle(60, 60, 58); g.fillStyle(0xEF4444); for (let i = 0; i < 4; i++) { g.beginPath(); g.slice(60, 60, 58, i * Math.PI / 2, i * Math.PI / 2 + Math.PI / 4); g.fillPath(); }
    g.fillStyle(0x0E7490); g.fillCircle(60, 60, 34); g.lineStyle(4, 0x0B1220); g.strokeCircle(60, 60, 57);
    g.generateTexture('sp-pelampung', 120, 120); g.clear();
    g.destroy();
  }
  buatRiak() {
    if (TMG.over) return;
    const r = this.add.ellipse(this.sampan.x + Phaser.Math.Between(-20, 20), SP_PY + 70, 30, 10).setStrokeStyle(2, 0xE0F2FE, .7);
    this.objLayer.add(r);
    this.tweens.add({ targets: r, y: r.y + 80, scaleX: 2.4, alpha: 0, duration: 700, onComplete: () => r.destroy() });
  }
  tukar(d) { if (TMG.over) return; const n = Phaser.Math.Clamp(this.lane + d, 0, 3); if (n === this.lane) return; this.lane = n; this.tweens.add({ targets: this.sampan, x: SP_LANE[n], duration: 140, ease: 'Quad.easeOut' }); }
  /* ---------- soalan ---------- */
  jadualSoalan(ms) {
    if (TMG.over || TMG.qn >= TMG.MAX) return;
    this.time.delayedCall(Math.max(0, ms - 1500), () => { if (!TMG.over) TMG.amaran(); });
    this.time.delayedCall(ms, () => this.soalanBaru());
  }
  soalanBaru() {
    if (TMG.over) return;
    const q = TMG.nextQ(); if (!q) return;
    const c = this.add.container(0, 140); c.q = q; c.alpha = 0; this.tweens.add({ targets: c, alpha: 1, duration: 400 });
    q.opts.forEach((o, i) => {
      const p = this.add.image(SP_LANE[i], 0, 'sp-pelampung');
      const lb = this.add.rectangle(SP_LANE[i], 0, 150, 52, 0x0B1220, .85).setStrokeStyle(3, 0xFFFFFF);
      const t = this.add.text(SP_LANE[i], 0, o, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '30px', fontStyle: '700', color: '#FFFFFF' }).setOrigin(.5);
      if (t.width > 136) t.setScale(136 / t.width);
      c.add([p, lb, t]);
    });
    this.objLayer.add(c); this.gate = c;
  }
  nilai() {
    const c = this.gate; this.gate = null;
    const ok = this.lane === c.q.c, sebelum = TMG.skor;
    const end = ok ? TMG.betul() : TMG.salah();
    c.list.forEach(o => this.tweens.add({ targets: o, alpha: 0, duration: 260 }));
    this.time.delayedCall(320, () => c.destroy());
    this.letup(this.sampan.x, SP_PY - 60, ok ? 0x34D399 : 0xF87171);
    if (ok) this.timbul('+' + (TMG.skor - sebelum)); else this.cameras.main.shake(220, .006);
    if (!end) { this.time.delayedCall(900, () => { if (!TMG.over && !this.gate) TMG.rehat(); }); this.jadualSoalan(TMG.SELANG); }
  }
  timbul(txt) {
    const t = this.add.text(this.sampan.x, SP_PY - 110, txt, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '40px', fontStyle: '700', color: '#34D399', stroke: '#0B1220', strokeThickness: 6 }).setOrigin(.5);
    this.tweens.add({ targets: t, y: t.y - 60, alpha: 0, duration: 700, onComplete: () => t.destroy() });
  }
  letup(x, y, col) {
    for (let i = 0; i < 14; i++) {
      const d = this.add.circle(x, y, Phaser.Math.Between(5, 10), col), a = Math.random() * Math.PI * 2, r = Phaser.Math.Between(60, 140);
      this.tweens.add({ targets: d, x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, alpha: 0, scale: .3, duration: 520, ease: 'Quad.easeOut', onComplete: () => d.destroy() });
    }
  }
  /* ---------- ikan, buaya, kayu ---------- */
  spawn() {
    const Y = -100;
    if (this.gate && Math.abs(this.gate.y - Y) < 420) return;
    const tahap = Math.min(1, (this.speed - SP_V0) / (SP_VMAX - SP_V0));
    if (Math.random() < .45 - tahap * .15) {
      const ln = Phaser.Math.Between(0, 3), n = Phaser.Math.Between(3, 5);
      for (let i = 0; i < n; i++) this.tambahObj('sp-ikan', ln, Y - i * 60, 'ikan');
      return;
    }
    const nb = Math.random() < tahap * .7 ? 2 : 1, lanes = Phaser.Utils.Array.Shuffle([0, 1, 2, 3]).slice(0, nb);
    lanes.forEach(ln => this.tambahObj(Math.random() < .55 ? 'sp-buaya' : 'sp-kayu', ln, Y, 'halang'));
  }
  tambahObj(tex, ln, y, jenis) {
    const o = this.add.image(SP_LANE[ln], y, tex); o.lane = ln; o.jenis = jenis; o.mati = false;
    if (jenis === 'ikan') this.tweens.add({ targets: o, angle: 12, duration: 300, yoyo: true, repeat: -1 });
    if (tex === 'sp-kayu') o.setAngle(Phaser.Math.Between(-12, 12));
    this.objLayer.add(o); this.obj.push(o);
  }
  update(t, dtms) {
    if (TMG.over) return;
    const dt = Math.min(dtms, 50) / 1000;
    this.masa += dt; this.kebal = Math.max(0, this.kebal - dt);
    this.speed = Math.min(SP_VMAX, this.speed + 2.6 * dt);
    const v = this.speed * dt; this.jarak += v;
    this.air.tilePositionY -= v; this.tebingK.tilePositionY -= v; this.tebingKa.tilePositionY -= v;
    if (this.jarak >= this.nextSpawn) { this.spawn(); this.nextSpawn = this.jarak + Phaser.Math.Between(280, 440); }
    if (this.gate) { this.gate.y += (SP_PY - 180) / SP_BACA * dt; if (this.gate.y >= SP_PY - 40) { this.nilai(); if (TMG.over) return; } }
    for (const o of this.obj) {
      o.y += v;
      if (o.mati || o.lane !== this.lane || Math.abs(o.y - SP_PY) > (o.jenis === 'ikan' ? 60 : 100)) continue;
      if (o.jenis === 'ikan') { o.mati = true; TMG.kutip(10); this.tweens.add({ targets: o, scale: 0, alpha: 0, duration: 220, onComplete: () => o.destroy() }); }
      else if (!this.kebal) {
        o.mati = true; this.kebal = 1.1; this.cameras.main.shake(200, .008);
        this.tweens.add({ targets: o, alpha: 0, angle: o.angle + 60, duration: 380, onComplete: () => o.destroy() });
        this.tweens.add({ targets: this.sampan, alpha: .35, duration: 90, yoyo: true, repeat: 4 });
        if (TMG.cedera()) return;
      }
    }
    this.obj = this.obj.filter(o => { if (!o.active) return false; if (o.y > 820) { o.destroy(); return false; } return true; });
  }
}
const GAMEDEF = {
  nama: 'Sampan Laju', warna: '#22D3EE', scene: SampanScene,
  rehat: 'Kutip ikan emas, elak buaya dan kayu hanyut!',
  cara: '<b>← →</b> tukar lorong · <b>P</b> jeda',
  caraSentuh: 'Tekan <b>← →</b> (atau leret) untuk tukar lorong. Kutip ikan emas, elak buaya dan kayu. Bila soalan muncul, masuk lorong pelampung jawapan betul.',
  sentuh(el) {
    el.innerHTML = '<button id="sL" aria-label="Lorong kiri" style="left:1.4cqw;bottom:2cqw;width:9cqw;height:9cqw;font-size:3.4cqw">←</button>'
      + '<button id="sR" aria-label="Lorong kanan" style="right:1.4cqw;bottom:2cqw;width:9cqw;height:9cqw;font-size:3.4cqw">→</button>';
    const on = (id, f) => el.querySelector(id).addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (TMG.scene && TMG.scene.scene.isActive()) f(); });
    on('#sL', () => TMG.scene.tukar(-1)); on('#sR', () => TMG.scene.tukar(1));
  }
};
