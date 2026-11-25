'use strict';
/* =================== PENYU PULANG · PANTAI TERENGGANU ===================
   Anak penyu menetas di pantai dan mesti merangkak ke laut. Gerak ke mana-mana arah (anak panah /
   sentuh) untuk kutip tapak sulaiman dan elak ketam. Deretan batu menghalang laut. Bila soalan muncul,
   4 laluan terbuka di antara batu dengan jawapan: rangkak melalui laluan jawapan betul ke laut. */
const PY_BATU = 220, PY_LALUAN = [310, 520, 760, 970], PY_BACA = 15, PY_V = 280;
class PenyuScene extends Phaser.Scene {
  constructor() { super('penyu'); }
  create() {
    TMG.scene = this;
    Object.assign(this, { gate: null, kebal: 0, masa: 0, sasar: null, obj: [], nextBuah: 0, sedangLaut: false });
    this.buatTekstur();
    this.add.rectangle(640, 360, 1280, 720, 0xFDE68A);
    this.ombak = this.add.tileSprite(640, 90, 1280, 180, 'py-laut');
    this.add.image(640, 182, 'py-buih');
    for (let i = 0; i < 40; i++) this.add.circle(Phaser.Math.Between(0, 1280), Phaser.Math.Between(260, 720), 2, 0xD97706, .35);
    // deretan batu
    this.batu = [];
    for (let x = 60; x <= 1220; x += 76) { const b = this.add.image(x, PY_BATU, 'py-batu').setScale(Phaser.Math.FloatBetween(.9, 1.1)); b.asalX = x; this.batu.push(b); }
    this.objLayer = this.add.container(0, 0);
    this.penyu = this.add.image(640, 600, 'py-penyu');
    this.tweens.add({ targets: this.penyu, scaleX: .92, duration: 200, yoyo: true, repeat: -1 });
    this.kekunci = this.input.keyboard.addKeys('LEFT,RIGHT,UP,DOWN,A,D,W,S');
    this.input.on('pointerdown', p => { this.sasar = { x: p.x, y: p.y }; }); this.input.on('pointermove', p => { if (p.isDown) this.sasar = { x: p.x, y: p.y }; });
    this.input.on('pointerup', () => { this.sasar = null; });
    for (let i = 0; i < 3; i++) this.ketamBaru();
    this.jadualSoalan(TMG.SELANG * .6);
  }
  buatTekstur() {
    if (this.textures.exists('py-penyu')) return;
    const g = this.make.graphics({ add: false });
    g.fillStyle(0x0284C7); g.fillRect(0, 0, 256, 180); g.lineStyle(4, 0x7DD3FC, .6); for (let y = 30; y < 180; y += 40) for (let x = 0; x < 256; x += 64) { g.beginPath(); g.arc(x + 32, y, 22, Math.PI * 1.1, Math.PI * 1.9); g.strokePath(); }
    g.generateTexture('py-laut', 256, 180); g.clear();
    g.fillStyle(0xFFFFFF, .85); for (let x = 0; x < 1280; x += 40) g.fillCircle(x + 20, 8, 16);
    g.generateTexture('py-buih', 1280, 24); g.clear();
    g.fillStyle(0x57534E); g.fillEllipse(40, 30, 76, 54); g.fillStyle(0x78716C); g.fillEllipse(32, 22, 40, 22);
    g.generateTexture('py-batu', 80, 60); g.clear();
    // anak penyu (menghadap atas)
    g.fillStyle(0x4D7C0F); g.fillEllipse(12, 30, 22, 12); g.fillEllipse(56, 30, 22, 12); g.fillEllipse(18, 58, 16, 10); g.fillEllipse(50, 58, 16, 10);
    g.fillCircle(34, 12, 11); g.fillStyle(0x0B1220); g.fillCircle(29, 9, 2.4); g.fillCircle(39, 9, 2.4);
    g.fillStyle(0x65A30D); g.fillEllipse(34, 42, 40, 46); g.lineStyle(2, 0x3F6212); g.strokeEllipse(34, 42, 40, 46); g.lineBetween(34, 22, 34, 64); g.lineBetween(16, 42, 52, 42);
    g.generateTexture('py-penyu', 68, 70); g.clear();
    g.fillStyle(0xEF4444); g.fillEllipse(30, 26, 40, 26); g.lineStyle(4, 0xEF4444); [[12, 20, 0, 10], [48, 20, 60, 10], [14, 32, 2, 40], [46, 32, 58, 40]].forEach(a => g.lineBetween(...a));
    g.fillStyle(0xFFFFFF); g.fillCircle(24, 16, 4); g.fillCircle(36, 16, 4); g.fillStyle(0x0B1220); g.fillCircle(24, 16, 2); g.fillCircle(36, 16, 2);
    g.generateTexture('py-ketam', 60, 46); g.clear();
    g.fillStyle(0xF97316); const pts = []; for (let k = 0; k < 10; k++) { const r = k % 2 ? 7 : 18, a = -Math.PI / 2 + k * Math.PI / 5; pts.push({ x: 20 + r * Math.cos(a), y: 20 + r * Math.sin(a) }); } g.fillPoints(pts, true);
    g.generateTexture('py-bintang', 40, 40); g.clear();
    g.destroy();
  }
  ketamBaru() {
    const k = this.add.image(Phaser.Math.Between(80, 1200), Phaser.Math.Between(300, 680), 'py-ketam');
    k.vx = (Math.random() < .5 ? -1 : 1) * Phaser.Math.Between(90, 170); k.jenis = 'ketam'; k.mati = false;
    this.objLayer.add(k); this.obj.push(k);
  }
  bintangBaru() {
    const b = this.add.image(Phaser.Math.Between(80, 1200), Phaser.Math.Between(300, 680), 'py-bintang').setScale(0);
    b.jenis = 'bintang'; b.mati = false; this.objLayer.add(b); this.obj.push(b);
    this.tweens.add({ targets: b, scale: 1, duration: 300 }); this.tweens.add({ targets: b, angle: 360, duration: 4000, repeat: -1 });
  }
  /* ---------- soalan: laluan di antara batu ---------- */
  jadualSoalan(ms) {
    if (TMG.over || TMG.qn >= TMG.MAX) return;
    this.time.delayedCall(Math.max(0, ms - 1500), () => { if (!TMG.over) TMG.amaran(); });
    this.time.delayedCall(ms, () => this.soalanBaru());
  }
  soalanBaru() {
    if (TMG.over) return;
    const q = TMG.nextQ(); if (!q) return;
    const c = this.add.container(0, 0); c.q = q; c.umur = 0; c.lb = [];
    this.batu.forEach(b => { if (PY_LALUAN.some(x => Math.abs(b.asalX - x) < 60)) this.tweens.add({ targets: b, alpha: 0, scale: .4, duration: 400 }); });
    q.opts.forEach((o, i) => {
      const lb = this.add.rectangle(PY_LALUAN[i], PY_BATU + 70, 150, 50, 0x0B1220, .88).setStrokeStyle(3, 0x5EEAD4);
      const t = this.add.text(PY_LALUAN[i], PY_BATU + 70, o, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '28px', fontStyle: '700', color: '#FFFFFF' }).setOrigin(.5);
      if (t.width > 138) t.setScale(138 / t.width);
      const anak = this.add.text(PY_LALUAN[i], PY_BATU + 2, '▲', { fontFamily: 'Inter, sans-serif', fontSize: '26px', fontStyle: '900', color: '#0F766E' }).setOrigin(.5);
      c.add([lb, t, anak]); c.lb.push(lb);
    });
    c.masa = this.add.rectangle(640, PY_BATU + 112, 600, 8, 0x0F766E); c.add(c.masa);
    c.alpha = 0; this.tweens.add({ targets: c, alpha: 1, duration: 300 });
    this.objLayer.add(c); this.gate = c;
  }
  nilai(i) {
    const c = this.gate; this.gate = null;
    const ok = i === c.q.c, sebelum = TMG.skor;
    const end = ok ? TMG.betul() : TMG.salah();
    if (ok) {
      this.sedangLaut = true; this.letup(PY_LALUAN[i], PY_BATU, 0x34D399); this.timbul('+' + (TMG.skor - sebelum), PY_LALUAN[i], '#34D399');
      this.tweens.add({ targets: this.penyu, y: 60, alpha: 0, duration: 900, ease: 'Sine.easeIn', onComplete: () => this.penyuBaru() });
    } else {
      if (i >= 0) { this.letup(PY_LALUAN[i], PY_BATU, 0xF87171); this.timbul('Salah laluan!', PY_LALUAN[i], '#F87171'); }
      this.cameras.main.shake(220, .006); this.sedangLaut = true;
      this.tweens.add({ targets: this.penyu, y: 600, duration: 600, ease: 'Quad.easeOut', onComplete: () => { this.sedangLaut = false; } });
    }
    this.tweens.add({ targets: c, alpha: 0, duration: 300, onComplete: () => c.destroy() });
    this.batu.forEach(b => this.tweens.add({ targets: b, alpha: 1, scale: 1, duration: 400 }));
    if (!end) { this.time.delayedCall(900, () => { if (!TMG.over && !this.gate) TMG.rehat(); }); this.jadualSoalan(TMG.SELANG); }
  }
  penyuBaru() {
    this.penyu.setPosition(Phaser.Math.Between(400, 880), 760).setAlpha(1);
    this.tweens.add({ targets: this.penyu, y: 600, duration: 600, onComplete: () => { this.sedangLaut = false; } });
  }
  timbul(txt, x, col) {
    const t = this.add.text(x, PY_BATU + 130, txt, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '36px', fontStyle: '700', color: col, stroke: '#0B1220', strokeThickness: 6 }).setOrigin(.5);
    this.tweens.add({ targets: t, y: t.y - 60, alpha: 0, duration: 800, onComplete: () => t.destroy() });
  }
  letup(x, y, col) {
    for (let i = 0; i < 14; i++) {
      const d = this.add.circle(x, y, Phaser.Math.Between(5, 10), col), a = Math.random() * Math.PI * 2, r = Phaser.Math.Between(60, 140);
      this.tweens.add({ targets: d, x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, alpha: 0, scale: .3, duration: 520, ease: 'Quad.easeOut', onComplete: () => d.destroy() });
    }
  }
  update(t, dtms) {
    if (TMG.over) return;
    const dt = Math.min(dtms, 50) / 1000; this.masa += dt; this.kebal = Math.max(0, this.kebal - dt);
    this.ombak.tilePositionX += 30 * dt;
    // gerak penyu
    if (!this.sedangLaut) {
      const K = this.kekunci;
      let dx = (K.RIGHT.isDown || K.D.isDown ? 1 : 0) - (K.LEFT.isDown || K.A.isDown ? 1 : 0), dy = (K.DOWN.isDown || K.S.isDown ? 1 : 0) - (K.UP.isDown || K.W.isDown ? 1 : 0);
      if (!dx && !dy && this.sasar) { const ax = this.sasar.x - this.penyu.x, ay = this.sasar.y - this.penyu.y, d = Math.hypot(ax, ay); if (d > 10) { dx = ax / d; dy = ay / d; } }
      const n = Math.hypot(dx, dy) || 1, p = this.penyu;
      if (dx || dy) p.angle = Phaser.Math.RadToDeg(Math.atan2(dy, dx)) + 90;
      const nx = Phaser.Math.Clamp(p.x + dx / n * PY_V * dt, 40, 1240);
      let ny = Phaser.Math.Clamp(p.y + dy / n * PY_V * dt, PY_BATU + 50, 690);
      // laluan terbuka hanya semasa soalan
      const lorong = this.gate ? PY_LALUAN.findIndex(x => Math.abs(nx - x) < 55) : -1;
      if (lorong >= 0) ny = Phaser.Math.Clamp(p.y + dy / n * PY_V * dt, PY_BATU - 30, 690);
      p.setPosition(nx, ny);
      if (this.gate && lorong >= 0 && ny <= PY_BATU - 20) { this.nilai(lorong); if (TMG.over) return; }
    }
    if (this.gate) {
      const c = this.gate; c.umur += dt; c.masa.width = 600 * Math.max(0, 1 - c.umur / PY_BACA);
      c.lb.forEach((lb, i) => lb.setStrokeStyle(Math.abs(this.penyu.x - PY_LALUAN[i]) < 55 ? 5 : 3, Math.abs(this.penyu.x - PY_LALUAN[i]) < 55 ? 0xFACC15 : 0x5EEAD4));
      if (c.umur >= PY_BACA) { this.nilai(-1); if (TMG.over) return; }
    }
    // tapak sulaiman
    if (this.masa >= this.nextBuah && this.obj.filter(o => o.jenis === 'bintang').length < 3) { this.bintangBaru(); this.nextBuah = this.masa + 2.5; }
    // ketam
    const laju = 1 + Math.min(1, this.masa / 120);
    for (const o of this.obj) {
      if (o.jenis === 'ketam') { o.x += o.vx * laju * dt; if (o.x < 40 || o.x > 1240) { o.vx *= -1; o.x = Phaser.Math.Clamp(o.x, 40, 1240); } }
      if (o.mati || this.sedangLaut || Math.abs(o.x - this.penyu.x) > 44 || Math.abs(o.y - this.penyu.y) > 40) continue;
      if (o.jenis === 'bintang') { o.mati = true; TMG.kutip(10); this.tweens.add({ targets: o, scale: 0, alpha: 0, duration: 200, onComplete: () => o.destroy() }); }
      else if (!this.kebal) {
        this.kebal = 1.4; this.cameras.main.shake(180, .008);
        this.tweens.add({ targets: this.penyu, alpha: .3, duration: 90, yoyo: true, repeat: 5 });
        if (TMG.cedera()) return;
      }
    }
    this.obj = this.obj.filter(o => o.active && !(o.mati && o.jenis === 'bintang' && o.alpha === 0));
  }
}
const GAMEDEF = {
  nama: 'Penyu Pulang', warna: '#2DD4BF', scene: PenyuScene,
  rehat: 'Kutip tapak sulaiman, elak ketam!',
  cara: '<b>← ↑ → ↓</b> atau tetikus gerak penyu · <b>P</b> jeda',
  caraSentuh: 'Sentuh dan seret untuk gerak anak penyu. Kutip tapak sulaiman dan elak ketam. Bila soalan muncul, laluan terbuka di antara batu: rangkak melalui laluan jawapan betul ke laut.'
};
