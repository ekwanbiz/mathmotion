'use strict';
/* =================== ROKET SAINS · PELANCARAN LANGKAWI ===================
   Roket terbang ke angkasa. Gerak kiri/kanan dengan bebas untuk kutip sel bahan api (bar bahan api
   sentiasa berkurang) dan elak meteor. Bila soalan muncul, 4 tangki bahan api berlabel jawapan turun:
   terbang ke tangki jawapan betul untuk isi penuh dan roket melonjak tinggi. */
const RK_PY = 560, RK_MIN = 300, RK_MAX = 980, RK_V0 = 220, RK_VMAX = 560, RK_BACA = 10, RK_TANGKI = [380, 560, 740, 920];
class RoketScene extends Phaser.Scene {
  constructor() { super('roket'); }
  create() {
    TMG.scene = this;
    Object.assign(this, { speed: RK_V0, jarak: 0, nextSpawn: 300, obj: [], gate: null, kebal: 0, api: 100, sasar: null, km: 0 });
    this.buatTekstur();
    const g = this.add.graphics(); g.fillGradientStyle(0x0B1220, 0x0B1220, 0x312E81, 0x312E81); g.fillRect(0, 0, 1280, 720);
    this.bintang = this.add.tileSprite(640, 360, 1280, 720, 'rk-bintang');
    this.add.rectangle(RK_MIN - 60, 360, 4, 720, 0xFFFFFF, .06); this.add.rectangle(RK_MAX + 60, 360, 4, 720, 0xFFFFFF, .06);
    this.objLayer = this.add.container(0, 0);
    this.api_ = this.add.image(0, 70, 'rk-api'); this.roket = this.add.container(640, RK_PY, [this.api_, this.add.image(0, 0, 'rk-roket')]);
    this.tweens.add({ targets: this.api_, scaleY: .7, duration: 90, yoyo: true, repeat: -1 });
    // bar bahan api
    this.add.text(40, 120, 'BAHAN API', { fontFamily: 'Inter, sans-serif', fontSize: '16px', fontStyle: '800', color: '#FDE68A' });
    this.add.rectangle(40, 150, 200, 18, 0x1E293B).setOrigin(0, .5).setStrokeStyle(2, 0xFDE68A);
    this.barApi = this.add.rectangle(42, 150, 196, 14, 0x34D399).setOrigin(0, .5);
    this.ukur = this.add.text(1240, 120, '0 km', { fontFamily: '"Space Grotesk", sans-serif', fontSize: '26px', fontStyle: '700', color: '#FFFFFF' }).setOrigin(1, 0);
    this.kekunci = this.input.keyboard.addKeys('LEFT,RIGHT,A,D');
    this.input.on('pointerdown', p => { this.sasar = p.x; }); this.input.on('pointermove', p => { if (p.isDown) this.sasar = p.x; });
    this.input.on('pointerup', () => { this.sasar = null; });
    this.jadualSoalan(TMG.SELANG * .6);
  }
  buatTekstur() {
    if (this.textures.exists('rk-roket')) return;
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xFFFFFF); for (let i = 0; i < 90; i++) g.fillCircle(Math.random() * 1280, Math.random() * 720, Math.random() < .2 ? 2 : 1);
    g.generateTexture('rk-bintang', 1280, 720); g.clear();
    g.fillStyle(0xDC2626); g.fillTriangle(10, 96, 0, 130, 26, 110); g.fillTriangle(70, 96, 80, 130, 54, 110); g.fillTriangle(40, 0, 18, 40, 62, 40);
    g.fillStyle(0xF1F5F9); g.fillRoundedRect(18, 36, 44, 84, 10); g.fillStyle(0x38BDF8); g.fillCircle(40, 64, 11); g.lineStyle(3, 0x64748B); g.strokeCircle(40, 64, 11);
    g.fillStyle(0xDC2626); g.fillRect(18, 96, 44, 8);
    g.generateTexture('rk-roket', 80, 130); g.clear();
    g.fillStyle(0xF97316); g.fillTriangle(0, 0, 40, 0, 20, 60); g.fillStyle(0xFDE68A); g.fillTriangle(10, 0, 30, 0, 20, 36);
    g.generateTexture('rk-api', 40, 60); g.clear();
    g.fillStyle(0x22C55E); g.fillRoundedRect(4, 6, 28, 40, 6); g.fillStyle(0xBBF7D0); g.fillRect(10, 0, 16, 8); g.fillStyle(0xFFFFFF); g.fillTriangle(20, 14, 12, 28, 22, 28); g.fillTriangle(16, 26, 26, 26, 16, 40);
    g.generateTexture('rk-sel', 36, 48); g.clear();
    g.fillStyle(0x78716C); g.fillCircle(32, 32, 30); g.fillStyle(0x57534E); g.fillCircle(22, 24, 8); g.fillCircle(42, 40, 6); g.fillCircle(38, 18, 4);
    g.generateTexture('rk-meteor', 64, 64); g.clear();
    g.fillStyle(0x0EA5E9); g.fillRoundedRect(10, 16, 100, 90, 18); g.fillStyle(0x7DD3FC); g.fillRect(40, 4, 40, 16); g.fillStyle(0x0369A1); g.fillRect(10, 40, 100, 10); g.fillRect(10, 72, 100, 10);
    g.generateTexture('rk-tangki', 120, 110); g.clear();
    g.destroy();
  }
  /* ---------- soalan: tangki bahan api ---------- */
  jadualSoalan(ms) {
    if (TMG.over || TMG.qn >= TMG.MAX) return;
    this.time.delayedCall(Math.max(0, ms - 1500), () => { if (!TMG.over) TMG.amaran(); });
    this.time.delayedCall(ms, () => this.soalanBaru());
  }
  soalanBaru() {
    if (TMG.over) return;
    const q = TMG.nextQ(); if (!q) return;
    this.obj.forEach(o => { o.mati = true; this.tweens.add({ targets: o, alpha: 0, duration: 250, onComplete: () => o.destroy() }); }); this.obj = [];
    const c = this.add.container(0, 150); c.q = q; c.alpha = 0;
    q.opts.forEach((o, i) => {
      const tk = this.add.image(RK_TANGKI[i], 0, 'rk-tangki');
      const lb = this.add.rectangle(RK_TANGKI[i], 6, 150, 50, 0x0B1220, .88).setStrokeStyle(3, 0x7DD3FC);
      const t = this.add.text(RK_TANGKI[i], 6, o, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '28px', fontStyle: '700', color: '#FFFFFF' }).setOrigin(.5);
      if (t.width > 138) t.setScale(138 / t.width);
      c.add([tk, lb, t]);
    });
    this.objLayer.add(c); this.gate = c;
    this.tweens.add({ targets: c, alpha: 1, duration: 400 });
  }
  nilai() {
    const c = this.gate; this.gate = null;
    let i = -1; RK_TANGKI.forEach((x, k) => { if (Math.abs(this.roket.x - x) < 80) i = k; });
    const ok = i === c.q.c, sebelum = TMG.skor;
    const end = ok ? TMG.betul() : TMG.salah();
    if (ok) {
      this.letup(this.roket.x, RK_PY - 40, 0x34D399); this.timbul('+' + (TMG.skor - sebelum), '#34D399'); this.api = 100;
      this.km += 50; this.tweens.add({ targets: this.roket, y: RK_PY - 60, duration: 250, yoyo: true });
      this.tweens.addCounter({ from: 0, to: 1, duration: 900, onUpdate: tw => { this.bintang.tilePositionY -= 40 * (1 - tw.getValue()); } });
    } else { this.letup(i >= 0 ? RK_TANGKI[i] : this.roket.x, RK_PY - 40, 0xF87171); this.cameras.main.shake(240, .008); }
    this.tweens.add({ targets: c, alpha: 0, y: c.y + 120, duration: 350, onComplete: () => c.destroy() });
    if (!end) { this.time.delayedCall(900, () => { if (!TMG.over && !this.gate) TMG.rehat(); }); this.jadualSoalan(TMG.SELANG); }
  }
  timbul(txt, col) {
    const t = this.add.text(this.roket.x, RK_PY - 110, txt, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '40px', fontStyle: '700', color: col, stroke: '#0B1220', strokeThickness: 6 }).setOrigin(.5);
    this.tweens.add({ targets: t, y: t.y - 60, alpha: 0, duration: 700, onComplete: () => t.destroy() });
  }
  letup(x, y, col) {
    for (let i = 0; i < 14; i++) {
      const d = this.add.circle(x, y, Phaser.Math.Between(5, 10), col), a = Math.random() * Math.PI * 2, r = Phaser.Math.Between(60, 140);
      this.tweens.add({ targets: d, x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, alpha: 0, scale: .3, duration: 520, ease: 'Quad.easeOut', onComplete: () => d.destroy() });
    }
  }
  /* ---------- sel bahan api & meteor ---------- */
  spawn() {
    const x = Phaser.Math.Between(RK_MIN, RK_MAX);
    if (Math.random() < .45) { this.tambah('rk-sel', x, -40, 'sel'); return; }
    const m = this.tambah('rk-meteor', x, -50, 'meteor'); m.vx = Phaser.Math.Between(-60, 60); m.setScale(Phaser.Math.FloatBetween(.8, 1.3));
  }
  tambah(tex, x, y, jenis) { const o = this.add.image(x, y, tex); o.jenis = jenis; o.mati = false; o.vx = 0; this.objLayer.add(o); this.obj.push(o); return o; }
  update(t, dtms) {
    if (TMG.over) return;
    const dt = Math.min(dtms, 50) / 1000; this.kebal = Math.max(0, this.kebal - dt);
    // kawal roket
    const K = this.kekunci; let arah = (K.RIGHT.isDown || K.D.isDown ? 1 : 0) - (K.LEFT.isDown || K.A.isDown ? 1 : 0);
    if (this.sasar !== null && !arah) { const d = this.sasar - this.roket.x; arah = Math.abs(d) < 8 ? 0 : Math.sign(d) * Math.min(1, Math.abs(d) / 60); }
    this.roket.x = Phaser.Math.Clamp(this.roket.x + arah * 560 * dt, RK_MIN, RK_MAX); this.roket.angle = arah * 12;
    this.speed = Math.min(RK_VMAX, this.speed + 2.4 * dt);
    const v = this.speed * dt; this.jarak += v; this.km += v / 60;
    this.bintang.tilePositionY -= v * .5; this.ukur.setText(Math.floor(this.km) + ' km');
    if (this.gate) {
      this.gate.y += (RK_PY - 200) / RK_BACA * dt;
      if (this.gate.y >= RK_PY - 60) { this.nilai(); if (TMG.over) return; }
      return;
    }
    // bahan api berkurang
    this.api = Math.max(0, this.api - 5 * dt);
    this.barApi.width = 196 * this.api / 100; this.barApi.fillColor = this.api > 50 ? 0x34D399 : this.api > 25 ? 0xFBBF24 : 0xF87171;
    if (this.api <= 0) { this.api = 60; this.cameras.main.shake(200, .008); if (TMG.cedera()) return; }
    if (this.jarak >= this.nextSpawn) { this.spawn(); this.nextSpawn = this.jarak + Phaser.Math.Between(160, 280); }
    for (const o of this.obj) {
      o.y += v; o.x += o.vx * dt; if (o.jenis === 'meteor') o.angle += 90 * dt;
      if (o.mati || Math.abs(o.x - this.roket.x) > (o.jenis === 'sel' ? 50 : 30 + 28 * o.scale) || Math.abs(o.y - RK_PY) > 60) continue;
      if (o.jenis === 'sel') { o.mati = true; TMG.kutip(10); this.api = Math.min(100, this.api + 20); this.tweens.add({ targets: o, scale: 0, alpha: 0, duration: 200, onComplete: () => o.destroy() }); }
      else if (!this.kebal) {
        o.mati = true; this.kebal = 1.1; this.cameras.main.shake(200, .01);
        this.tweens.add({ targets: o, alpha: 0, scale: 2, duration: 300, onComplete: () => o.destroy() });
        this.tweens.add({ targets: this.roket, alpha: .3, duration: 90, yoyo: true, repeat: 4 });
        if (TMG.cedera()) return;
      }
    }
    this.obj = this.obj.filter(o => { if (!o.active) return false; if (o.y > 800) { o.destroy(); return false; } return true; });
  }
}
const GAMEDEF = {
  nama: 'Roket Sains', warna: '#F87171', scene: RoketScene,
  rehat: 'Kutip sel bahan api, elak meteor!',
  cara: '<b>← →</b> atau tetikus gerak roket · <b>P</b> jeda',
  caraSentuh: 'Sentuh dan seret ke kiri atau kanan untuk gerak roket. Kutip sel bahan api sebelum bahan api habis dan elak meteor. Bila soalan muncul, terbang ke tangki jawapan betul.'
};
