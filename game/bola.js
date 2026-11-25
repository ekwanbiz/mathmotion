'use strict';
/* =================== BOLA SEPAK · PADANG SEKOLAH ===================
   Sepakan penalti. Gerakkan penanda sasaran dalam gol, kemudian sepak. Antara soalan, sepak ke
   papan sasaran untuk markah (penjaga gol cuba menghalang). Bila soalan muncul, gol dibahagi
   kepada 4 petak jawapan: sepak ke petak jawapan betul sebelum masa tamat. */
const BS_GX0 = 290, BS_GX1 = 990, BS_GY0 = 160, BS_GY1 = 460, BS_BX = 640, BS_BY = 650, BS_BACA = 12;
const BS_ZON = [[BS_GX0, BS_GY0], [640, BS_GY0], [BS_GX0, 310], [640, 310]], BS_ZW = 350, BS_ZH = 150;
class BolaScene extends Phaser.Scene {
  constructor() { super('bola'); }
  create() {
    TMG.scene = this;
    Object.assign(this, { ax: 640, ay: 300, terbang: false, gate: null, masa: 0, kx: 640, kdir: 1, sasar: null });
    this.buatTekstur();
    // langit, penonton, padang
    this.add.rectangle(640, 90, 1280, 180, 0x7DD3FC);
    this.add.rectangle(640, 150, 1280, 70, 0x334155);
    for (let i = 0; i < 90; i++) this.add.circle(10 + i * 14.3, 128 + (i % 3) * 16, 6, [0xF87171, 0xFBBF24, 0x60A5FA, 0x34D399, 0xF472B6][i % 5]);
    this.add.rectangle(640, 450, 1280, 540, 0x16A34A);
    for (let i = 0; i < 6; i++) this.add.rectangle(640, 200 + i * 90, 1280, 45, 0x15803D);
    this.add.ellipse(640, 640, 520, 90).setStrokeStyle(4, 0xFFFFFF, .7);
    // gol
    this.add.image(640, (BS_GY0 + BS_GY1) / 2, 'bs-jaring');
    const g = this.add.graphics(); g.lineStyle(14, 0xFFFFFF); g.strokeRect(BS_GX0 - 7, BS_GY0 - 7, BS_GX1 - BS_GX0 + 14, BS_GY1 - BS_GY0 + 7);
    g.lineStyle(4, 0xFFFFFF, .8); g.lineBetween(120, BS_GY1, 1160, BS_GY1);
    this.zonLayer = this.add.container(0, 0);
    this.penjaga = this.add.image(this.kx, BS_GY1 - 70, 'bs-penjaga');
    this.sasaran = this.add.image(0, 0, 'bs-sasaran').setVisible(false);
    this.penanda = this.add.image(this.ax, this.ay, 'bs-penanda');
    this.tweens.add({ targets: this.penanda, scale: 1.15, duration: 400, yoyo: true, repeat: -1 });
    this.bola = this.add.image(BS_BX, BS_BY, 'bs-bola');
    this.barMasa = this.add.rectangle(BS_GX0, BS_GY0 - 26, 0, 10, 0x60A5FA).setOrigin(0, .5);
    const k = this.input.keyboard;
    this.kunci = k.addKeys('UP,DOWN,LEFT,RIGHT,W,A,S,D');
    k.on('keydown-SPACE', () => this.sepak());
    k.on('keydown-ENTER', () => this.sepak());
    this.input.on('pointerdown', p => { if (p.x > BS_GX0 - 20 && p.x < BS_GX1 + 20 && p.y > BS_GY0 - 20 && p.y < BS_GY1 + 20) { this.ax = Phaser.Math.Clamp(p.x, BS_GX0 + 20, BS_GX1 - 20); this.ay = Phaser.Math.Clamp(p.y, BS_GY0 + 20, BS_GY1 - 20); this.sepak(); } });
    this.sasarBaru();
    this.jadualSoalan(TMG.SELANG * .6);
  }
  buatTekstur() {
    if (this.textures.exists('bs-bola')) return;
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xFFFFFF); g.fillCircle(34, 34, 32); g.fillStyle(0x0B1220); g.fillCircle(34, 34, 10);
    [[34, 8], [58, 26], [50, 56], [18, 56], [10, 26]].forEach(([x, y]) => g.fillCircle(x, y, 7));
    g.lineStyle(3, 0x0B1220); g.strokeCircle(34, 34, 32); g.generateTexture('bs-bola', 68, 68); g.clear();
    // jaring
    g.fillStyle(0xFFFFFF, .12); g.fillRect(0, 0, BS_GX1 - BS_GX0, BS_GY1 - BS_GY0);
    g.lineStyle(2, 0xFFFFFF, .35); for (let x = 0; x <= 700; x += 28) g.lineBetween(x, 0, x, 300); for (let y = 0; y <= 300; y += 28) g.lineBetween(0, y, 700, y);
    g.generateTexture('bs-jaring', BS_GX1 - BS_GX0, BS_GY1 - BS_GY0); g.clear();
    // penjaga gol
    g.fillStyle(0xFCD34D); g.fillCircle(50, 22, 18); g.fillStyle(0xF97316); g.fillRoundedRect(26, 42, 48, 58, 10);
    g.lineStyle(12, 0xF97316); g.lineBetween(30, 52, 4, 30); g.lineBetween(70, 52, 96, 30);
    g.fillStyle(0xFFFFFF); g.fillCircle(4, 28, 9); g.fillCircle(96, 28, 9);
    g.fillStyle(0x1E293B); g.fillRect(30, 98, 16, 40); g.fillRect(54, 98, 16, 40);
    g.lineStyle(3, 0x0B1220); g.strokeCircle(50, 22, 18); g.strokeRoundedRect(26, 42, 48, 58, 10);
    g.generateTexture('bs-penjaga', 100, 140); g.clear();
    // penanda sasaran
    g.lineStyle(5, 0xFACC15); g.strokeCircle(26, 26, 22); g.lineBetween(26, 0, 26, 14); g.lineBetween(26, 38, 26, 52); g.lineBetween(0, 26, 14, 26); g.lineBetween(38, 26, 52, 26);
    g.generateTexture('bs-penanda', 52, 52); g.clear();
    // papan sasaran latihan
    g.fillStyle(0xDC2626); g.fillCircle(40, 40, 38); g.fillStyle(0xFFFFFF); g.fillCircle(40, 40, 26); g.fillStyle(0xDC2626); g.fillCircle(40, 40, 13);
    g.generateTexture('bs-sasaran', 80, 80); g.clear();
    g.destroy();
  }
  sasarBaru() {
    this.sasar = [Phaser.Math.Between(BS_GX0 + 60, BS_GX1 - 60), Phaser.Math.Between(BS_GY0 + 50, BS_GY1 - 60)];
    this.sasaran.setPosition(...this.sasar).setVisible(!this.gate).setScale(.2);
    this.tweens.add({ targets: this.sasaran, scale: 1, duration: 260, ease: 'Back.easeOut' });
  }
  /* ---------- sepak ---------- */
  sepak() {
    if (TMG.over || this.terbang) return;
    this.terbang = true; TMG.bunyi('tap');
    const tx = this.ax, ty = this.ay;
    this.tweens.add({ targets: this.bola, x: tx, y: ty, scale: .5, angle: 540, duration: 480, ease: 'Quad.easeOut', onComplete: () => this.sampai(tx, ty) });
  }
  sampai(x, y) {
    if (this.gate) {
      const i = (x < 640 ? 0 : 1) + (y < 310 ? 0 : 2);
      this.nilai(i, x, y);
    } else {
      const dekatPenjaga = Math.abs(x - this.kx) < 70 && y > BS_GY1 - 150;
      if (dekatPenjaga) { this.teks('Diselamatkan!', x, y, '#FBBF24'); this.tweens.add({ targets: this.penjaga, angle: x < this.kx ? -25 : 25, duration: 120, yoyo: true }); }
      else if (Math.hypot(x - this.sasar[0], y - this.sasar[1]) < 42) { TMG.kutip(30); this.teks('+30', x, y, '#34D399'); this.letup(x, y, 0xFBBF24); this.sasarBaru(); }
      else this.teks('Gol!', x, y, '#FFFFFF');
    }
    this.time.delayedCall(450, () => { this.bola.setPosition(BS_BX, BS_BY).setScale(1).setAngle(0); this.terbang = false; });
  }
  teks(s, x, y, col) {
    const t = this.add.text(x, y - 40, s, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '34px', fontStyle: '700', color: col, stroke: '#0B1220', strokeThickness: 6 }).setOrigin(.5);
    this.tweens.add({ targets: t, y: t.y - 50, alpha: 0, duration: 700, onComplete: () => t.destroy() });
  }
  letup(x, y, col) {
    for (let i = 0; i < 14; i++) {
      const d = this.add.circle(x, y, Phaser.Math.Between(5, 10), col), a = Math.random() * Math.PI * 2, r = Phaser.Math.Between(60, 140);
      this.tweens.add({ targets: d, x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, alpha: 0, scale: .3, duration: 520, ease: 'Quad.easeOut', onComplete: () => d.destroy() });
    }
  }
  /* ---------- soalan ---------- */
  jadualSoalan(ms) {
    if (TMG.over || TMG.qn >= TMG.MAX) return;
    this.time.delayedCall(Math.max(0, ms - 1500), () => { if (!TMG.over) TMG.amaran(); });
    this.time.delayedCall(ms, () => this.soalanBaru());
  }
  soalanBaru() {
    if (TMG.over) return;
    const q = TMG.nextQ(); if (!q) return;
    const COL = [0xF87171, 0x60A5FA, 0x34D399, 0xC084FC];
    const c = this.add.container(0, 0); c.q = q; c.umur = 0;
    q.opts.forEach((o, i) => {
      const [x0, y0] = BS_ZON[i], cx = x0 + BS_ZW / 2, cy = y0 + BS_ZH / 2;
      const r = this.add.rectangle(cx, cy, BS_ZW - 10, BS_ZH - 10, COL[i], .5).setStrokeStyle(4, COL[i]);
      const lb = this.add.rectangle(cx, cy, Math.min(BS_ZW - 40, 260), 64, 0x0B1220, .8);
      const t = this.add.text(cx, cy, o, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '32px', fontStyle: '700', color: '#FFFFFF' }).setOrigin(.5);
      if (t.width > 240) t.setScale(240 / t.width);
      c.add([r, lb, t]);
    });
    this.zonLayer.add(c); this.gate = c;
    this.sasaran.setVisible(false);
    this.tweens.add({ targets: this.penjaga, x: BS_GX1 + 90, duration: 400 }); // penjaga ke tepi
  }
  nilai(i, x, y) {
    const c = this.gate; this.gate = null;
    const ok = i === c.q.c, sebelum = TMG.skor;
    const end = ok ? TMG.betul() : TMG.salah();
    if (i >= 0) this.letup(x, y, ok ? 0x34D399 : 0xF87171);
    if (ok) this.teks('+' + (TMG.skor - sebelum), x == null ? 640 : x, y == null ? 300 : y, '#34D399'); else this.cameras.main.shake(220, .006);
    c.list.forEach(o => this.tweens.add({ targets: o, alpha: 0, duration: 260 }));
    this.time.delayedCall(320, () => c.destroy());
    this.barMasa.width = 0;
    this.tweens.add({ targets: this.penjaga, x: 640, duration: 400, onComplete: () => { this.kx = 640; } });
    this.time.delayedCall(500, () => { if (!TMG.over) this.sasarBaru(); });
    if (!end) { this.time.delayedCall(900, () => { if (!TMG.over && !this.gate) TMG.rehat(); }); this.jadualSoalan(TMG.SELANG); }
  }
  update(t, dtms) {
    if (TMG.over) return;
    const dt = Math.min(dtms, 50) / 1000; this.masa += dt;
    const K = this.kunci, V = 520;
    if (K.LEFT.isDown || K.A.isDown) this.ax -= V * dt; if (K.RIGHT.isDown || K.D.isDown) this.ax += V * dt;
    if (K.UP.isDown || K.W.isDown) this.ay -= V * dt; if (K.DOWN.isDown || K.S.isDown) this.ay += V * dt;
    this.ax = Phaser.Math.Clamp(this.ax, BS_GX0 + 20, BS_GX1 - 20); this.ay = Phaser.Math.Clamp(this.ay, BS_GY0 + 20, BS_GY1 - 20);
    this.penanda.setPosition(this.ax, this.ay);
    // penjaga gol bergerak (latihan sahaja)
    if (!this.gate) {
      const laju = Math.min(330, 150 + this.masa * 1.5);
      this.kx += this.kdir * laju * dt; if (this.kx > BS_GX1 - 70) { this.kx = BS_GX1 - 70; this.kdir = -1; } if (this.kx < BS_GX0 + 70) { this.kx = BS_GX0 + 70; this.kdir = 1; }
      if (!this.tweens.isTweening(this.penjaga)) this.penjaga.x = this.kx;
    } else {
      const c = this.gate; c.umur += dt;
      const baki = Math.max(0, 1 - c.umur / BS_BACA);
      this.barMasa.width = (BS_GX1 - BS_GX0) * baki; this.barMasa.fillColor = baki > .3 ? 0x60A5FA : 0xF87171;
      if (c.umur >= BS_BACA && !this.terbang) this.nilai(-1);
    }
  }
}
const GAMEDEF = {
  nama: 'Bola Sepak', warna: '#38BDF8', scene: BolaScene,
  rehat: 'Sepak ke papan sasaran untuk markah!',
  cara: '<b>← ↑ → ↓</b> halakan · <b>Ruang</b> sepak · <b>P</b> jeda',
  caraSentuh: 'Ketik di dalam gol untuk menyepak bola ke situ. Antara soalan, sepak ke papan sasaran untuk markah. Bila soalan muncul, sepak ke petak jawapan betul sebelum masa tamat.'
};
