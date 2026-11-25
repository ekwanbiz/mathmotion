'use strict';
/* =================== PANJAT KELAPA · KAMPUNG PANTAI ===================
   Budak kampung memanjat pokok kelapa yang sangat tinggi. Tukar sisi batang (← →) untuk elak kelapa
   yang jatuh dan kutip kelapa emas. Bila soalan muncul, 4 pelepah (dahan) terjulur dengan jawapan:
   pilih pelepah jawapan betul untuk terus naik. Pelepah salah akan patah! */
const KL_X = 640, KL_SIDE = 52, KL_PY = 500, KL_V0 = 150, KL_VMAX = 420, KL_BACA = 12, KL_DAHAN = [330, 510, 770, 950];
class KelapaScene extends Phaser.Scene {
  constructor() { super('kelapa'); }
  create() {
    TMG.scene = this;
    Object.assign(this, { sisi: -1, speed: KL_V0, tinggi: 0, nextSpawn: 300, obj: [], gate: null, kebal: 0, pilih: 1, henti: false });
    this.buatTekstur();
    const g = this.add.graphics(); g.fillGradientStyle(0x38BDF8, 0x38BDF8, 0xBAE6FD, 0xBAE6FD); g.fillRect(0, 0, 1280, 720);
    this.awan = this.add.tileSprite(640, 360, 1280, 720, 'kl-awan');
    this.laut = this.add.rectangle(640, 690, 1280, 60, 0x0EA5E9);
    this.batang = this.add.tileSprite(KL_X, 360, 70, 720, 'kl-batang');
    this.objLayer = this.add.container(0, 0);
    this.budak = this.add.image(KL_X + this.sisi * KL_SIDE, KL_PY, 'kl-budak').setFlipX(this.sisi > 0);
    this.tweens.add({ targets: this.budak, scaleY: .94, duration: 180, yoyo: true, repeat: -1 });
    this.ukur = this.add.text(1240, 100, '0 m', { fontFamily: '"Space Grotesk", sans-serif', fontSize: '26px', fontStyle: '700', color: '#0B1220' }).setOrigin(1, .5);
    const k = this.input.keyboard;
    k.on('keydown-LEFT', () => this.kiriKanan(-1)); k.on('keydown-A', () => this.kiriKanan(-1));
    k.on('keydown-RIGHT', () => this.kiriKanan(1)); k.on('keydown-D', () => this.kiriKanan(1));
    k.on('keydown-SPACE', () => this.pasti()); k.on('keydown-UP', () => this.pasti()); k.on('keydown-ENTER', () => this.pasti());
    this.input.on('pointerdown', p => {
      if (this.gate && this.gate.sedia) {
        let best = -1, bd = 1e9; KL_DAHAN.forEach((x, i) => { const d = Math.abs(p.x - x); if (d < bd) { bd = d; best = i; } });
        if (bd < 110 && p.y < 380) { this.pilih = best; this.tanda(); this.pasti(); }
        return;
      }
      this.kiriKanan(p.x < KL_X ? -1 : 1);
    });
    this.jadualSoalan(TMG.SELANG * .6);
  }
  buatTekstur() {
    if (this.textures.exists('kl-batang')) return;
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xA16207); g.fillRect(0, 0, 70, 64); g.fillStyle(0x854D0E); for (let y = 0; y < 64; y += 16) g.fillRect(0, y, 70, 5);
    g.generateTexture('kl-batang', 70, 64); g.clear();
    g.fillStyle(0xFFFFFF, .9); [[200, 150], [900, 420], [520, 620], [1100, 90]].forEach(([x, y]) => { g.fillEllipse(x, y, 160, 46); g.fillEllipse(x + 50, y - 16, 100, 46); });
    g.generateTexture('kl-awan', 1280, 720); g.clear();
    // budak memanjat (sisi kiri batang, menghadap kanan)
    g.fillStyle(0x7C2D12); g.fillCircle(30, 22, 18); g.fillStyle(0x0B1220); g.fillRect(14, 6, 32, 10);
    g.fillStyle(0xFFFFFF); g.fillCircle(38, 22, 3); g.fillStyle(0x0B1220); g.fillCircle(39, 22, 1.6);
    g.fillStyle(0xEF4444); g.fillRoundedRect(12, 40, 36, 40, 10); g.fillStyle(0x1E3A8A); g.fillRect(14, 76, 32, 18);
    g.lineStyle(8, 0x7C2D12); g.lineBetween(40, 46, 62, 34); g.lineBetween(40, 62, 62, 70); g.lineBetween(22, 92, 50, 104); g.lineBetween(38, 92, 60, 92);
    g.generateTexture('kl-budak', 66, 110); g.clear();
    g.fillStyle(0x65A30D); g.fillCircle(20, 20, 18); g.fillStyle(0x4D7C0F); g.fillCircle(14, 14, 5); g.generateTexture('kl-kelapa', 40, 40); g.clear();
    g.fillStyle(0xF59E0B); g.fillCircle(20, 20, 18); g.fillStyle(0xFDE68A); g.fillCircle(14, 13, 6); g.generateTexture('kl-emas', 40, 40); g.clear();
    // pelepah (dahan kelapa)
    g.lineStyle(8, 0x4D7C0F); g.lineBetween(0, 30, 200, 30); g.lineStyle(4, 0x65A30D);
    for (let x = 14; x < 196; x += 14) { g.lineBetween(x, 30, x + 14, 2); g.lineBetween(x, 30, x + 14, 58); }
    g.generateTexture('kl-dahan', 204, 60); g.clear();
    g.destroy();
  }
  kiriKanan(d) {
    if (TMG.over) return;
    if (this.gate && this.gate.sedia) { this.pilih = Phaser.Math.Clamp(this.pilih + d, 0, 3); this.tanda(); TMG.bunyi('tap'); return; }
    if (this.henti || this.sisi === d) return;
    this.sisi = d; this.budak.setFlipX(d > 0); TMG.bunyi('tap');
    this.tweens.add({ targets: this.budak, x: KL_X + d * KL_SIDE, duration: 110 });
  }
  pasti() { if (!TMG.over && this.gate && this.gate.sedia) this.pilihDahan(); }
  /* ---------- soalan: pelepah ---------- */
  jadualSoalan(ms) {
    if (TMG.over || TMG.qn >= TMG.MAX) return;
    this.time.delayedCall(Math.max(0, ms - 1500), () => { if (!TMG.over) TMG.amaran(); });
    this.time.delayedCall(ms, () => this.soalanBaru());
  }
  soalanBaru() {
    if (TMG.over) return;
    const q = TMG.nextQ(); if (!q) return;
    this.obj.forEach(o => { o.mati = true; this.tweens.add({ targets: o, alpha: 0, duration: 250, onComplete: () => o.destroy() }); });
    this.henti = true;
    const c = this.add.container(0, -260); c.q = q; c.sedia = false; c.umur = 0; c.dahan = [];
    q.opts.forEach((o, i) => {
      const kiri = i < 2, x = KL_DAHAN[i], y = 250 + (i === 0 || i === 3 ? 30 : 0);
      const d = this.add.image((x + KL_X) / 2, y + 40, 'kl-dahan').setDisplaySize(Math.abs(KL_X - x) + 40, 60).setFlipX(kiri).setAngle(kiri ? 12 : -12);
      const lb = this.add.rectangle(x, y - 6, 160, 52, 0x0B1220, .88).setStrokeStyle(3, 0xFDE68A);
      const t = this.add.text(x, y - 6, o, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '28px', fontStyle: '700', color: '#FFFFFF' }).setOrigin(.5);
      if (t.width > 146) t.setScale(146 / t.width);
      c.add([d, lb, t]); c.dahan.push([d, lb, t]);
    });
    c.anak = this.add.text(KL_DAHAN[this.pilih], 180, '▼', { fontFamily: 'Inter, sans-serif', fontSize: '34px', fontStyle: '900', color: '#DC2626', stroke: '#FFFFFF', strokeThickness: 4 }).setOrigin(.5);
    c.add(c.anak); this.objLayer.add(c); this.gate = c;
    this.tweens.add({ targets: c, y: 0, duration: 900, ease: 'Quad.easeOut', onComplete: () => { c.sedia = true; this.tanda(); } });
  }
  tanda() { const c = this.gate; if (!c) return; c.anak.x = KL_DAHAN[this.pilih]; c.dahan.forEach(([d, lb], i) => lb.setStrokeStyle(i === this.pilih ? 5 : 3, i === this.pilih ? 0xDC2626 : 0xFDE68A)); }
  pilihDahan() {
    const c = this.gate; c.sedia = false; const i = this.pilih, ok = i === c.q.c;
    this.tweens.add({ targets: this.budak, x: KL_DAHAN[i], y: 330, duration: 450, ease: 'Sine.easeInOut', onComplete: () => this.hasil(i, ok) });
  }
  hasil(i, ok) {
    const c = this.gate; this.gate = null; const sebelum = TMG.skor;
    const end = i >= 0 && ok ? TMG.betul() : TMG.salah();
    if (i >= 0) {
      const [d, lb, t] = c.dahan[i];
      if (ok) { this.letup(KL_DAHAN[i], 250, 0x34D399); this.timbul('+' + (TMG.skor - sebelum), KL_DAHAN[i], '#34D399'); }
      else {
        this.letup(KL_DAHAN[i], 250, 0xF87171); this.cameras.main.shake(260, .01); this.timbul('Patah!', KL_DAHAN[i], '#F87171');
        this.tweens.add({ targets: [d, lb, t], y: '+=500', angle: 40, alpha: 0, duration: 700, ease: 'Quad.easeIn' });
        this.tweens.add({ targets: this.budak, y: 640, duration: 420, ease: 'Quad.easeIn' });
      }
    } else this.cameras.main.shake(220, .006);
    this.time.delayedCall(ok ? 600 : 900, () => {
      this.tweens.add({ targets: c, alpha: 0, duration: 300, onComplete: () => c.destroy() });
      this.tweens.add({ targets: this.budak, x: KL_X + this.sisi * KL_SIDE, y: KL_PY, duration: 500, onComplete: () => { this.henti = false; } });
    });
    if (!end) { this.time.delayedCall(900, () => { if (!TMG.over && !this.gate) TMG.rehat(); }); this.jadualSoalan(TMG.SELANG); }
  }
  timbul(txt, x, col) {
    const t = this.add.text(x, 200, txt, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '40px', fontStyle: '700', color: col, stroke: '#0B1220', strokeThickness: 6 }).setOrigin(.5);
    this.tweens.add({ targets: t, y: 140, alpha: 0, duration: 800, onComplete: () => t.destroy() });
  }
  letup(x, y, col) {
    for (let i = 0; i < 14; i++) {
      const d = this.add.circle(x, y, Phaser.Math.Between(5, 10), col), a = Math.random() * Math.PI * 2, r = Phaser.Math.Between(60, 140);
      this.tweens.add({ targets: d, x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, alpha: 0, scale: .3, duration: 520, ease: 'Quad.easeOut', onComplete: () => d.destroy() });
    }
  }
  /* ---------- kelapa jatuh & kelapa emas ---------- */
  spawn() {
    const s = Math.random() < .5 ? -1 : 1;
    if (Math.random() < .45) { for (let i = 0; i < 3; i++) this.tambah('kl-emas', KL_X + s * KL_SIDE, -40 - i * 70, 'emas'); return; }
    const o = this.tambah('kl-kelapa', KL_X + s * KL_SIDE, -40, 'jatuh'); o.vy = 260;
  }
  tambah(tex, x, y, jenis) { const o = this.add.image(x, y, tex); o.jenis = jenis; o.mati = false; o.vy = 0; this.objLayer.add(o); this.obj.push(o); return o; }
  update(t, dtms) {
    if (TMG.over) return;
    const dt = Math.min(dtms, 50) / 1000; this.kebal = Math.max(0, this.kebal - dt);
    if (this.gate) {
      if (this.gate.sedia) {
        this.gate.umur += dt; const baki = Math.max(0, KL_BACA - this.gate.umur);
        this.gate.anak.setText(baki < 4 ? Math.ceil(baki) + ' ▼' : '▼');
        if (baki <= 0) { this.gate.sedia = false; this.hasil(-1, false); }
      }
      return;
    }
    if (this.henti) return;
    this.speed = Math.min(KL_VMAX, this.speed + 2.2 * dt);
    const v = this.speed * dt; this.tinggi += v;
    this.batang.tilePositionY -= v; this.awan.tilePositionY -= v * .2;
    this.laut.y = 690 + Math.min(200, this.tinggi * .1);
    this.ukur.setText(Math.floor(this.tinggi / 40) + ' m');
    if (this.tinggi >= this.nextSpawn) { this.spawn(); this.nextSpawn = this.tinggi + Phaser.Math.Between(230, 380); }
    for (const o of this.obj) {
      o.y += v + o.vy * dt; if (o.jenis === 'jatuh') o.angle += 300 * dt;
      if (o.mati || Math.abs(o.x - this.budak.x) > 40 || Math.abs(o.y - KL_PY) > 50) continue;
      if (o.jenis === 'emas') { o.mati = true; TMG.kutip(10); this.tweens.add({ targets: o, scale: 0, alpha: 0, duration: 200, onComplete: () => o.destroy() }); }
      else if (!this.kebal) {
        o.mati = true; this.kebal = 1.1; this.cameras.main.shake(180, .008);
        this.tweens.add({ targets: o, alpha: 0, x: o.x + 200 * Math.sign(o.x - KL_X), duration: 400, onComplete: () => o.destroy() });
        this.tweens.add({ targets: this.budak, alpha: .3, duration: 90, yoyo: true, repeat: 4 });
        if (TMG.cedera()) return;
      }
    }
    this.obj = this.obj.filter(o => { if (!o.active) return false; if (o.y > 800) { o.destroy(); return false; } return true; });
  }
}
const GAMEDEF = {
  nama: 'Panjat Kelapa', warna: '#FBBF24', scene: KelapaScene,
  rehat: 'Elak kelapa jatuh, kutip kelapa emas!',
  cara: '<b>← →</b> tukar sisi / pilih pelepah · <b>Ruang</b> pasti · <b>P</b> jeda',
  caraSentuh: 'Ketik kiri atau kanan skrin untuk tukar sisi batang. Elak kelapa jatuh, kutip kelapa emas. Bila soalan muncul, ketik pelepah yang ada jawapan betul.'
};
