'use strict';
/* =================== TEMBAK ANGKASA · LANGIT KL =================== */
const TB_Y = 628, TB_BAWAH = 560, TB_BACA = 8;
class TembakScene extends Phaser.Scene {
  constructor() { super('tembak'); }
  create() {
    TMG.scene = this;
    this.batu = []; this.meteor = []; this.laser = []; this.cool = 0; this.target = null; this.dir = 0; this.masa = 0; this.nextMet = 1.2; this.kebal = 0; this.amar = false;
    this.buatTekstur();
    this.add.rectangle(640, 360, 1280, 720, 0x0F0A2E);
    for (let i = 0; i < 90; i++) {
      const s = this.add.circle(Phaser.Math.Between(0, 1280), Phaser.Math.Between(0, 560), Math.random() < .2 ? 2 : 1.3, 0xE6EDF7, Phaser.Math.FloatBetween(.4, 1));
      if (i % 3 === 0) this.tweens.add({ targets: s, alpha: .15, duration: Phaser.Math.Between(700, 1600), yoyo: true, repeat: -1 });
    }
    this.add.circle(1120, 120, 34, 0xFDE68A, .9);
    this.add.image(640, 720, 'tb-kota').setOrigin(.5, 1);
    this.lapisBatu = this.add.container(0, 0);
    this.roket = this.add.container(640, TB_Y, [this.add.image(0, 22, 'tb-api'), this.add.image(0, 0, 'tb-roket')]);
    this.tweens.add({ targets: this.roket.list[0], scaleY: .6, duration: 110, yoyo: true, repeat: -1 });
    const k = this.input.keyboard;
    this.kunci = k.addKeys('LEFT,RIGHT,A,D');
    k.on('keydown-SPACE', () => this.tembak());
    k.on('keydown-UP', () => this.tembak());
    this.input.on('pointerdown', p => { this.target = p.x; this.tembak(); });
    this.input.on('pointermove', p => { if (p.isDown) this.target = p.x; });
    this.input.on('pointerup', () => { this.target = null; });
    this.jadualSoalan(TMG.SELANG * .6);
  }
  buatTekstur() {
    if (this.textures.exists('tb-roket')) return;
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xE6EDF7); g.fillTriangle(36, 0, 6, 80, 66, 80); g.lineStyle(3, 0x0B1220); g.strokeTriangle(36, 0, 6, 80, 66, 80);
    g.fillStyle(0x38BDF8); g.fillCircle(36, 46, 11); g.fillStyle(0xF472B6); g.fillTriangle(6, 80, 0, 96, 22, 80); g.fillTriangle(66, 80, 72, 96, 50, 80);
    g.generateTexture('tb-roket', 72, 98); g.clear();
    g.fillStyle(0xFB923C); g.fillTriangle(0, 0, 40, 0, 20, 40); g.fillStyle(0xFDE68A); g.fillTriangle(10, 0, 30, 0, 20, 22); g.generateTexture('tb-api', 40, 40); g.clear();
    g.fillStyle(0x34D399); g.fillRoundedRect(0, 0, 8, 34, 4); g.generateTexture('tb-laser', 8, 34); g.clear();
    g.fillStyle(0x78716C); g.lineStyle(4, 0x0F0A2E);
    const pts = [[20, 22], [80, 4], [140, 22], [150, 70], [118, 104], [52, 108], [8, 76]].map(([x, y]) => new Phaser.Math.Vector2(x, y));
    g.fillPoints(pts, true); g.strokePoints(pts, true, true);
    g.fillStyle(0x57534E); g.fillCircle(46, 40, 10); g.fillCircle(116, 76, 8); g.fillCircle(92, 30, 6);
    g.generateTexture('tb-batu', 156, 112); g.clear();
    g.destroy();
    // kota KL di bawah (dianjak supaya menara tidak terpotong)
    const g2 = this.make.graphics({ add: false }), off = 120;
    g2.fillStyle(0x1E1B4B); g2.fillRect(0, 70 + off, 1280, 120);
    [[40, 30, 70], [130, 0, 50], [200, 45, 80], [960, 15, 60], [1040, -20, 44], [1100, 35, 90], [1200, 10, 60], [470, 40, 70], [700, 55, 90]].forEach(([x, y, w]) => g2.fillRect(x, y + 20 + off, w, 170));
    g2.fillStyle(0x312E81);
    [320, 380].forEach(x => { g2.fillRect(x, -40 + off, 24, 230); g2.fillTriangle(x, -40 + off, x + 24, -40 + off, x + 12, -60 + off); g2.fillTriangle(x + 9, -60 + off, x + 15, -60 + off, x + 12, -110 + off); });
    g2.fillRect(344, 30 + off, 36, 8); g2.fillRect(860, off, 20, 190); g2.fillCircle(870, off, 14); g2.fillTriangle(866, -14 + off, 874, -14 + off, 870, -70 + off);
    g2.fillStyle(0xFDE68A, .7); for (let i = 0; i < 40; i++) g2.fillRect(Phaser.Math.Between(40, 1240), Phaser.Math.Between(80, 180) + off, 4, 6);
    g2.generateTexture('tb-kota', 1280, 190 + off); g2.destroy();
  }
  jadualSoalan(ms) {
    if (TMG.over || TMG.qn >= TMG.MAX) return;
    this.time.delayedCall(Math.max(0, ms - 1500), () => { if (!TMG.over) { this.amar = true; TMG.amaran(); } });
    this.time.delayedCall(ms, () => this.soalanBaru());
  }
  tambahMeteor() {
    const x = Phaser.Math.Between(80, 1200), sz = Phaser.Math.FloatBetween(.4, .6);
    const m = this.add.image(x, -50, 'tb-batu').setScale(sz).setTint(0xA8A29E); m.v = Math.min(560, 170 + this.masa * 3) * Phaser.Math.FloatBetween(.85, 1.15); m.spin = Phaser.Math.FloatBetween(-90, 90); m.mati = false;
    this.lapisBatu.add(m); this.meteor.push(m);
  }
  soalanBaru() {
    if (TMG.over) return; this.amar = false;
    const q = TMG.nextQ(); if (!q) return;
    const n = q.opts.length, w = 1000 / n, sp = (TB_BAWAH + 70) / TB_BACA;
    const xs = Phaser.Utils.Array.Shuffle([...Array(n).keys()]);
    this.batu = q.opts.map((o, i) => {
      const x = 140 + w * xs[i] + w / 2 + Phaser.Math.Between(-30, 30), y0 = -70 - i * 30;
      const rock = this.add.image(0, 0, 'tb-batu').setAngle(Phaser.Math.Between(-20, 20));
      const t = this.add.text(0, 2, o, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '30px', fontStyle: '700', color: '#FFFFFF', stroke: '#0F0A2E', strokeThickness: 6 }).setOrigin(.5);
      if (t.width > 150) t.setScale(150 / t.width);
      const c = this.add.container(x, y0, [rock, t]); c.betul = i === q.c; c.v = sp * (i === q.c ? 1 : Phaser.Math.FloatBetween(.9, 1.15)); c.rock = c.list[0]; c.spin = Phaser.Math.FloatBetween(-12, 12); c.mati = false;
      this.lapisBatu.add(c); return c;
    });
  }
  tembak() {
    if (TMG.over || this.cool > 0) return;
    this.cool = .22; TMG.bunyi('tap');
    this.laser.push(this.add.image(this.roket.x, TB_Y - 50, 'tb-laser'));
  }
  pecah(c, col) {
    c.mati = true;
    for (let i = 0; i < 16; i++) {
      const d = this.add.circle(c.x, c.y, Phaser.Math.Between(4, 10), col); const a = Math.random() * Math.PI * 2, r = Phaser.Math.Between(50, 140);
      this.tweens.add({ targets: d, x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r, alpha: 0, scale: .3, duration: 520, onComplete: () => d.destroy() });
    }
    this.tweens.add({ targets: c, scale: 1.3, alpha: 0, duration: 250, onComplete: () => c.destroy() });
  }
  selesai(ok, kena) {
    this.batu.forEach(c => { if (c.mati) return; if (c.betul && ok) return; c.mati = true; if (c.betul) c.rock.setTint(0x34D399); this.tweens.add({ targets: c, alpha: 0, duration: 700, delay: c.betul ? 500 : 0, onComplete: () => c.destroy() }); });
    if (kena) this.pecah(kena, ok ? 0x34D399 : 0xF87171);
    if (!ok) this.cameras.main.shake(220, .006);
    this.batu = [];
    const end = ok ? TMG.betul() : TMG.salah();
    if (!end) { this.time.delayedCall(900, () => { if (!TMG.over && !this.batu.length && !this.amar) TMG.rehat(); }); this.jadualSoalan(TMG.SELANG); }
  }
  update(t, dtms) {
    if (TMG.over) return;
    const dt = Math.min(dtms, 50) / 1000;
    this.masa += dt; this.kebal = Math.max(0, this.kebal - dt);
    this.cool = Math.max(0, this.cool - dt);
    // meteor biasa: makin lama makin laju dan makin banyak (berhenti semasa soalan)
    if (!this.batu.length && !this.amar) { this.nextMet -= dt; if (this.nextMet <= 0) { this.tambahMeteor(); this.nextMet = Math.max(.35, 1.3 - this.masa * .007) * Phaser.Math.FloatBetween(.7, 1.3); } }
    for (const m of this.meteor) {
      if (m.mati) continue;
      m.y += m.v * dt; m.angle += m.spin * dt;
      for (const l of this.laser) if (l.active && Math.abs(l.x - m.x) < 48 && Math.abs(l.y - m.y) < 38) { l.destroy(); m.mati = true; TMG.kutip(10); this.pecah(m, 0xFBBF24); break; }
      if (!m.mati && !this.kebal && Math.abs(m.x - this.roket.x) < 52 && Math.abs(m.y - (TB_Y + 5)) < 50) {
        m.mati = true; this.kebal = 1.2; this.pecah(m, 0xF87171); this.cameras.main.shake(200, .008);
        this.tweens.add({ targets: this.roket, alpha: .3, duration: 100, yoyo: true, repeat: 4 });
        if (TMG.cedera()) return;
      }
    }
    this.meteor = this.meteor.filter(m => { if (m.mati) return false; if (m.y > 760) { m.destroy(); return false; } return true; });
    let dx = 0; const K = this.kunci;
    if (K.LEFT.isDown || K.A.isDown) dx = -1; else if (K.RIGHT.isDown || K.D.isDown) dx = 1;
    if (this.dir) dx = this.dir;
    if (this.target !== null && !dx) { const d = this.target - this.roket.x; if (Math.abs(d) > 6) dx = Math.sign(d) * Math.min(1, Math.abs(d) / 40); }
    this.roket.x = Phaser.Math.Clamp(this.roket.x + dx * 600 * dt, 60, 1220);
    this.roket.angle = dx * 8;
    for (const l of this.laser) l.y -= 1100 * dt;
    for (const c of this.batu) {
      if (c.mati) continue;
      c.y += c.v * dt; c.rock.angle += c.spin * dt;
      for (const l of this.laser) {
        if (l.active && Math.abs(l.x - c.x) < 72 && Math.abs(l.y - c.y) < 52) { l.destroy(); this.selesai(c.betul, c); return; }
      }
      if (c.betul && c.y > TB_BAWAH && !TMG.over) { this.selesai(false, null); return; }
    }
    this.laser = this.laser.filter(l => { if (!l.active) return false; if (l.y < -40) { l.destroy(); return false; } return true; });
  }
}
const GAMEDEF = {
  nama: 'Tembak Angkasa', warna: '#A78BFA', scene: TembakScene,
  rehat: 'Tembak meteor, jangan sampai roket dilanggar!',
  cara: '<b>← →</b> gerak roket · <b>Ruang</b> tembak · <b>P</b> jeda',
  caraSentuh: 'Tekan <b>← →</b> untuk gerak roket dan <b>TEMBAK</b> meteor. Elak meteor melanggar roket. Bila soalan muncul, tembak asteroid jawapan betul.',
  sentuh(el) {
    el.innerHTML = '<button id="sL" aria-label="Ke kiri" style="left:1.4cqw;bottom:2cqw;width:8.5cqw;height:8.5cqw;font-size:3cqw">←</button>'
      + '<button id="sR" aria-label="Ke kanan" style="left:11.5cqw;bottom:2cqw;width:8.5cqw;height:8.5cqw;font-size:3cqw">→</button>'
      + '<button id="sT" aria-label="Tembak" style="right:2cqw;bottom:2.5cqw;width:11cqw;height:11cqw;font-size:1.6cqw;border-color:#A78BFA;background:#A78BFA99;color:#0B1220">TEMBAK</button>';
    const hold = (id, d) => { const b = el.querySelector(id); b.addEventListener('pointerdown', e => { e.preventDefault(); if (TMG.scene) TMG.scene.dir = d; }); ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => b.addEventListener(n, () => { if (TMG.scene && TMG.scene.dir === d) TMG.scene.dir = 0; })); };
    hold('#sL', -1); hold('#sR', 1);
    el.querySelector('#sT').addEventListener('pointerdown', e => { e.preventDefault(); if (TMG.scene && TMG.scene.scene.isActive()) TMG.scene.tembak(); });
  }
};
