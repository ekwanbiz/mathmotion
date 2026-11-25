'use strict';
/* =================== WAU TERBANG · PANTAI TIMUR ===================
   Tekan & tahan untuk naikkan wau, lepas untuk turun. Kutip guli emas, elak burung camar.
   Bila soalan muncul, 4 gelung jawapan datang dari kanan: terbangkan wau melalui gelung jawapan betul. */
const WU_PX = 300, WU_TOP = 120, WU_BOT = 640, WU_RING = [190, 330, 470, 610], WU_V0 = 230, WU_VMAX = 520, WU_BACA = 6;
class WauScene extends Phaser.Scene {
  constructor() { super('wau'); }
  create() {
    TMG.scene = this;
    Object.assign(this, { y: 380, vy: 0, naik: false, speed: WU_V0, jarak: 0, nextSpawn: 500, obj: [], gate: null, kebal: 0, masa: 0 });
    this.buatTekstur();
    // langit senja, laut & pantai
    const g = this.add.graphics();
    g.fillGradientStyle(0x7DD3FC, 0x7DD3FC, 0xFDE68A, 0xFDE68A, 1); g.fillRect(0, 0, 1280, 560);
    this.add.circle(160, 500, 56, 0xFDBA74);
    this.awan = [this.add.ellipse(360, 160, 200, 50, 0xffffff, .85), this.add.ellipse(860, 250, 150, 40, 0xffffff, .8), this.add.ellipse(1200, 130, 130, 34, 0xffffff, .8)];
    this.add.rectangle(640, 600, 1280, 80, 0x0EA5E9);
    this.ombak = this.add.tileSprite(640, 562, 1280, 16, 'wu-ombak');
    this.add.rectangle(640, 680, 1280, 80, 0xFDE68A);
    this.deco = [];
    for (let x = 80; x < 1400; x += 340) this.tambahDeco(x);
    this.objLayer = this.add.container(0, 0);
    this.tali = this.add.graphics();
    this.wau = this.add.image(WU_PX, this.y, 'wu-wau');
    this.ekor = this.add.graphics();
    const k = this.input.keyboard;
    this.kunci = k.addKeys('UP,SPACE,W');
    this.input.on('pointerdown', () => { this.tekan = true; });
    this.input.on('pointerup', () => { this.tekan = false; });
    this.jadualSoalan(TMG.SELANG * .6);
  }
  buatTekstur() {
    if (this.textures.exists('wu-wau')) return;
    const g = this.make.graphics({ add: false });
    // wau bulan ringkas: badan berlian + sayap bulan sabit
    g.fillStyle(0xDC2626); g.fillTriangle(50, 0, 14, 40, 86, 40); g.fillStyle(0xFACC15); g.fillTriangle(14, 40, 86, 40, 50, 92);
    g.fillStyle(0x16A34A); g.fillEllipse(50, 40, 100, 22); g.fillStyle(0xFACC15); g.fillEllipse(50, 40, 70, 12);
    g.fillStyle(0x1D4ED8); g.fillEllipse(50, 80, 56, 20);
    g.lineStyle(3, 0x0B1220); g.strokeTriangle(50, 0, 14, 40, 86, 40); g.strokeTriangle(14, 40, 86, 40, 50, 92); g.lineBetween(50, 0, 50, 92);
    g.generateTexture('wu-wau', 100, 96); g.clear();
    g.lineStyle(3, 0xFFFFFF, .9); g.beginPath(); for (let x = 0; x <= 64; x += 4) g.lineTo(x, 8 + 5 * Math.sin(x / 64 * Math.PI * 2)); g.strokePath();
    g.generateTexture('wu-ombak', 64, 16); g.clear();
    // guli emas
    g.fillStyle(0xFBBF24); g.fillCircle(16, 16, 15); g.fillStyle(0xFEF3C7); g.fillCircle(11, 11, 5); g.lineStyle(3, 0xB45309); g.strokeCircle(16, 16, 14);
    g.generateTexture('wu-guli', 32, 32); g.clear();
    // burung camar
    g.lineStyle(6, 0xF8FAFC); g.beginPath(); g.moveTo(0, 10); g.lineTo(18, 22); g.lineTo(30, 14); g.lineTo(42, 22); g.lineTo(60, 10); g.strokePath();
    g.fillStyle(0xF8FAFC); g.fillEllipse(30, 22, 22, 12); g.fillStyle(0xF59E0B); g.fillTriangle(40, 20, 48, 23, 40, 26);
    g.lineStyle(2, 0x334155); g.strokeEllipse(30, 22, 22, 12);
    g.generateTexture('wu-burung', 60, 32); g.clear();
    // pokok kelapa (hiasan pantai)
    g.lineStyle(10, 0x78350F); g.beginPath(); g.moveTo(40, 170); g.lineTo(52, 100); g.lineTo(48, 40); g.strokePath();
    g.fillStyle(0x15803D); g.fillTriangle(48, 40, -10, 66, 14, 40); g.fillTriangle(48, 40, 110, 62, 84, 36); g.fillTriangle(48, 40, 10, 0, 34, 36); g.fillTriangle(48, 40, 90, 0, 64, 36);
    g.generateTexture('wu-kelapa', 110, 170); g.clear();
    g.destroy();
  }
  tambahDeco(x) { const s = this.add.image(x, 640, 'wu-kelapa').setOrigin(.5, 1).setScale(.8); this.deco.push(s); }
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
    const c = this.add.container(WU_PX + this.speed * WU_BACA, 0); c.q = q;
    q.opts.forEach((o, i) => {
      const y = WU_RING[i];
      const r = this.add.ellipse(0, y, 70, 118); r.setStrokeStyle(10, COL[i]); r.isFilled = false;
      const lb = this.add.rectangle(110, y, 150, 56, 0x0B1220, .82).setStrokeStyle(3, COL[i]);
      const t = this.add.text(110, y, o, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '30px', fontStyle: '700', color: '#FFFFFF' }).setOrigin(.5);
      if (t.width > 136) t.setScale(136 / t.width);
      c.add([lb, t, r]);
    });
    this.objLayer.add(c); this.gate = c;
  }
  nilai() {
    const c = this.gate; this.gate = null;
    let pilih = -1; WU_RING.forEach((y, i) => { if (Math.abs(this.y - y) < 52) pilih = i; });
    const ok = pilih === c.q.c, sebelum = TMG.skor;
    const end = ok ? TMG.betul() : TMG.salah();
    c.list.forEach(o => this.tweens.add({ targets: o, alpha: 0, duration: 260 }));
    this.time.delayedCall(320, () => c.destroy());
    this.letup(WU_PX, this.y, ok ? 0x34D399 : 0xF87171);
    if (ok) this.timbul('+' + (TMG.skor - sebelum)); else this.cameras.main.shake(220, .006);
    if (!end) { this.time.delayedCall(900, () => { if (!TMG.over && !this.gate) TMG.rehat(); }); this.jadualSoalan(TMG.SELANG); }
  }
  timbul(txt) {
    const t = this.add.text(WU_PX + 40, this.y - 70, txt, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '40px', fontStyle: '700', color: '#34D399', stroke: '#0B1220', strokeThickness: 6 }).setOrigin(.5);
    this.tweens.add({ targets: t, y: t.y - 60, alpha: 0, duration: 700, onComplete: () => t.destroy() });
  }
  letup(x, y, col) {
    for (let i = 0; i < 14; i++) {
      const d = this.add.circle(x, y, Phaser.Math.Between(5, 10), col), a = Math.random() * Math.PI * 2, r = Phaser.Math.Between(60, 140);
      this.tweens.add({ targets: d, x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, alpha: 0, scale: .3, duration: 520, ease: 'Quad.easeOut', onComplete: () => d.destroy() });
    }
  }
  /* ---------- guli & burung ---------- */
  spawn() {
    const X = 1360;
    if (this.gate && Math.abs(this.gate.x - X) < 420) return;
    const tahap = Math.min(1, (this.speed - WU_V0) / (WU_VMAX - WU_V0));
    if (Math.random() < .5 - tahap * .15) {
      const y0 = Phaser.Math.Between(WU_TOP + 40, WU_BOT - 60), n = Phaser.Math.Between(3, 5), dy = Phaser.Math.Between(-30, 30);
      for (let i = 0; i < n; i++) this.tambahObj('wu-guli', X + i * 56, Phaser.Math.Clamp(y0 + i * dy, WU_TOP, WU_BOT), 'guli');
      return;
    }
    const nb = Math.random() < tahap * .6 ? 2 : 1;
    for (let i = 0; i < nb; i++) { const o = this.tambahObj('wu-burung', X + i * 160, Phaser.Math.Between(WU_TOP + 20, WU_BOT - 40), 'burung'); o.fase = Math.random() * 6; }
  }
  tambahObj(tex, x, y, jenis) {
    const o = this.add.image(x, y, tex); o.jenis = jenis; o.mati = false; o.y0 = y;
    if (jenis === 'burung') this.tweens.add({ targets: o, scaleY: .55, duration: 180, yoyo: true, repeat: -1 });
    this.objLayer.add(o); this.obj.push(o); return o;
  }
  update(t, dtms) {
    if (TMG.over) return;
    const dt = Math.min(dtms, 50) / 1000;
    this.masa += dt; this.kebal = Math.max(0, this.kebal - dt);
    this.speed = Math.min(WU_VMAX, this.speed + 2.2 * dt);
    const v = this.speed * dt; this.jarak += v;
    // fizik wau: tahan = angin naik, lepas = graviti
    const naik = this.tekan || this.kunci.UP.isDown || this.kunci.SPACE.isDown || this.kunci.W.isDown;
    this.vy += (naik ? -900 : 620) * dt; this.vy = Phaser.Math.Clamp(this.vy, -340, 300);
    this.y += this.vy * dt;
    if (this.y < WU_TOP) { this.y = WU_TOP; this.vy = 0; }
    if (this.y > WU_BOT) { this.y = WU_BOT; this.vy = 0; }
    this.wau.setPosition(WU_PX, this.y).setAngle(this.vy / 22 + 8 * Math.sin(this.masa * 3));
    // tali ke tangan di pantai & ekor
    this.tali.clear(); this.tali.lineStyle(2, 0x0B1220, .5); this.tali.lineBetween(WU_PX, this.y + 30, 120, 720);
    this.ekor.clear(); this.ekor.lineStyle(4, 0xDC2626, .9); this.ekor.beginPath(); this.ekor.moveTo(WU_PX - 6, this.y + 44);
    for (let i = 1; i <= 8; i++) this.ekor.lineTo(WU_PX - 6 - i * 12, this.y + 44 + i * 6 + 6 * Math.sin(this.masa * 8 + i)); this.ekor.strokePath();
    this.ombak.tilePositionX += v * .6;
    this.awan.forEach(a => { a.x -= v * .08; if (a.x < -120) a.x = 1400; });
    this.deco.forEach(s => { s.x -= v * .5; });
    if (this.deco[0].x < -80) { this.deco.shift().destroy(); this.tambahDeco(this.deco[this.deco.length - 1].x + Phaser.Math.Between(280, 400)); }
    if (this.jarak >= this.nextSpawn) { this.spawn(); this.nextSpawn = this.jarak + Phaser.Math.Between(320, 520); }
    if (this.gate) { this.gate.x -= v; if (this.gate.x <= WU_PX) { this.nilai(); if (TMG.over) return; } }
    for (const o of this.obj) {
      o.x -= v * (o.jenis === 'burung' ? 1.25 : 1);
      if (o.jenis === 'burung') o.y = o.y0 + 26 * Math.sin(this.masa * 3 + o.fase);
      if (o.mati || Math.abs(o.x - WU_PX) > 44 || Math.abs(o.y - this.y) > 44) continue;
      if (o.jenis === 'guli') { o.mati = true; TMG.kutip(10); this.tweens.add({ targets: o, scale: 0, alpha: 0, duration: 220, onComplete: () => o.destroy() }); }
      else if (!this.kebal) {
        o.mati = true; this.kebal = 1.2; this.cameras.main.shake(180, .008);
        this.tweens.add({ targets: o, y: o.y - 80, alpha: 0, angle: 90, duration: 380, onComplete: () => o.destroy() });
        this.tweens.add({ targets: this.wau, alpha: .3, duration: 90, yoyo: true, repeat: 4 });
        if (TMG.cedera()) return;
      }
    }
    this.obj = this.obj.filter(o => { if (!o.active) return false; if (o.x < -80) { o.destroy(); return false; } return true; });
  }
}
const GAMEDEF = {
  nama: 'Wau Terbang', warna: '#FB7185', scene: WauScene,
  rehat: 'Kutip guli emas, elak burung camar!',
  cara: 'Tahan <b>↑</b> / <b>Ruang</b> untuk naik, lepas untuk turun · <b>P</b> jeda',
  caraSentuh: 'Sentuh dan tahan skrin untuk naikkan wau, lepas untuk turun. Kutip guli emas, elak burung camar. Bila soalan muncul, terbang melalui gelung jawapan betul.'
};
