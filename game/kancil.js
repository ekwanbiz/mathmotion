'use strict';
/* =================== KEJAR KANCIL · HUTAN HUJAN ===================
   Sang Kancil berlari dalam hutan: lompat akar & batu, kutip rambutan. Bila soalan muncul, Kancil
   tiba di tebing sungai dan 4 ekor buaya timbul dengan jawapan di belakangnya (macam cerita rakyat!).
   Pilih buaya jawapan betul dan lompat ke belakangnya untuk menyeberang. */
const KC_GY = 560, KC_PX = 240, KC_V0 = 260, KC_VMAX = 620, KC_BACA = 12, KC_BUAYA = [470, 640, 810, 980];
class KancilScene extends Phaser.Scene {
  constructor() { super('kancil'); }
  create() {
    TMG.scene = this;
    Object.assign(this, { speed: KC_V0, jarak: 0, nextSpawn: 500, obj: [], gate: null, kebal: 0, masa: 0, vy: 0, y: KC_GY, lompat2: 0, pilih: 1, henti: false });
    this.buatTekstur();
    this.add.rectangle(640, 360, 1280, 720, 0x14532D);
    this.jauh = this.add.tileSprite(640, 300, 1280, 360, 'kc-jauh');
    this.dekat = this.add.tileSprite(640, 400, 1280, 300, 'kc-dekat');
    this.tanah = this.add.tileSprite(640, KC_GY + 100, 1280, 200, 'kc-tanah');
    this.sungai = this.add.container(1400, 0);
    this.objLayer = this.add.container(0, 0);
    this.kancil = this.add.image(KC_PX, KC_GY - 34, 'kc-kancil1');
    this.time.addEvent({ delay: 110, loop: true, callback: () => { if (this.y >= KC_GY && !this.henti) this.kancil.setTexture(this.kancil.texture.key === 'kc-kancil1' ? 'kc-kancil2' : 'kc-kancil1'); } });
    const k = this.input.keyboard;
    k.on('keydown-SPACE', () => this.tindak()); k.on('keydown-UP', () => this.tindak()); k.on('keydown-W', () => this.tindak());
    k.on('keydown-LEFT', () => this.gerakPilih(-1)); k.on('keydown-RIGHT', () => this.gerakPilih(1));
    k.on('keydown-A', () => this.gerakPilih(-1)); k.on('keydown-D', () => this.gerakPilih(1));
    this.input.on('pointerdown', p => {
      if (this.gate && this.gate.sedia) { let best = -1, bd = 1e9; KC_BUAYA.forEach((x, i) => { const d = Math.abs(p.x - x); if (d < bd) { bd = d; best = i; } }); if (bd < 90 && p.y > 420) { this.pilih = best; this.tandaPilih(); this.tindak(); return; } }
      this.tindak();
    });
    this.jadualSoalan(TMG.SELANG * .6);
  }
  buatTekstur() {
    if (this.textures.exists('kc-kancil1')) return;
    const g = this.make.graphics({ add: false });
    const kancil = (key, f) => {
      g.clear(); g.fillStyle(0xB45309); g.fillEllipse(44, 34, 64, 30); g.fillEllipse(78, 18, 26, 20); g.fillTriangle(86, 14, 100, 20, 86, 24);
      g.fillStyle(0x92400E); g.fillTriangle(72, 8, 76, -4 + 4, 80, 10); g.fillStyle(0xFEF3C7); g.fillEllipse(44, 42, 40, 10); g.fillStyle(0x0B1220); g.fillCircle(82, 15, 2.5);
      g.lineStyle(5, 0x78350F);
      if (f) { g.lineBetween(24, 44, 10, 64); g.lineBetween(34, 46, 40, 66); g.lineBetween(56, 46, 50, 66); g.lineBetween(64, 44, 80, 62); }
      else { g.lineBetween(24, 44, 26, 68); g.lineBetween(34, 46, 30, 68); g.lineBetween(56, 46, 60, 68); g.lineBetween(64, 44, 66, 68); }
      g.fillStyle(0xFEF3C7); g.fillCircle(12, 26, 5);
      g.generateTexture(key, 104, 70);
    };
    kancil('kc-kancil1', true); kancil('kc-kancil2', false); g.clear();
    // latar hutan jauh & dekat
    g.fillStyle(0x166534); for (let x = 0; x < 640; x += 64) g.fillCircle(x + 32, 230 - (x % 128 ? 20 : 0), 70); g.fillRect(0, 230, 640, 130);
    g.generateTexture('kc-jauh', 640, 360); g.clear();
    g.fillStyle(0x3F2A14); [60, 300, 520].forEach(x => g.fillRect(x, 60, 26, 240)); g.fillStyle(0x15803D); [73, 313, 533].forEach(x => { g.fillCircle(x, 70, 70); g.fillCircle(x - 50, 100, 40); g.fillCircle(x + 50, 100, 40); });
    g.fillStyle(0x22C55E, .7); for (let x = 0; x < 640; x += 40) g.fillTriangle(x, 300, x + 20, 250, x + 40, 300);
    g.generateTexture('kc-dekat', 640, 300); g.clear();
    g.fillStyle(0x78350F); g.fillRect(0, 0, 256, 200); g.fillStyle(0x65A30D); g.fillRect(0, 0, 256, 18); g.fillStyle(0x92400E); [[30, 60], [120, 100], [200, 50], [80, 150]].forEach(([x, y]) => g.fillEllipse(x, y, 40, 12));
    g.generateTexture('kc-tanah', 256, 200); g.clear();
    // akar & batu & rambutan
    g.lineStyle(14, 0x5B3A1E); g.beginPath(); g.arc(50, 50, 40, Math.PI, 0); g.strokePath(); g.generateTexture('kc-akar', 100, 56); g.clear();
    g.fillStyle(0x78716C); g.fillEllipse(36, 30, 70, 50); g.fillStyle(0xA8A29E); g.fillEllipse(28, 22, 30, 16); g.generateTexture('kc-batu', 72, 56); g.clear();
    g.fillStyle(0xDC2626); g.fillCircle(18, 18, 14); g.lineStyle(2, 0xFCA5A5); for (let a = 0; a < 12; a++) { const t = a / 12 * Math.PI * 2; g.lineBetween(18 + 13 * Math.cos(t), 18 + 13 * Math.sin(t), 18 + 18 * Math.cos(t), 18 + 18 * Math.sin(t)); }
    g.generateTexture('kc-rambutan', 36, 36); g.clear();
    // sungai & buaya (sisi)
    g.fillStyle(0x0E7490); g.fillRect(0, 0, 760, 220); g.lineStyle(3, 0x67E8F9, .4); for (let x = 10; x < 760; x += 70) g.lineBetween(x, 40 + (x % 3) * 30, x + 40, 40 + (x % 3) * 30);
    g.generateTexture('kc-sungai', 760, 220); g.clear();
    g.fillStyle(0x3F6212); g.fillEllipse(70, 26, 140, 34); g.fillTriangle(130, 20, 170, 26, 130, 34); g.fillEllipse(14, 22, 40, 22);
    g.fillStyle(0x65A30D); for (let x = 30; x < 120; x += 16) g.fillTriangle(x, 12, x + 6, 2, x + 12, 12);
    g.fillStyle(0xFEF08A); g.fillCircle(12, 14, 4); g.fillStyle(0x0B1220); g.fillCircle(12, 14, 2);
    g.generateTexture('kc-buaya', 172, 46); g.clear();
    g.destroy();
  }
  tindak() {
    if (TMG.over) return;
    if (this.gate && this.gate.sedia) { this.lompatBuaya(); return; }
    if (this.henti) return;
    if (this.y >= KC_GY) { this.vy = -820; this.lompat2 = 1; TMG.bunyi('tap'); }
    else if (this.lompat2 === 1) { this.vy = -640; this.lompat2 = 2; }
  }
  /* ---------- soalan: buaya di sungai ---------- */
  jadualSoalan(ms) {
    if (TMG.over || TMG.qn >= TMG.MAX) return;
    this.time.delayedCall(Math.max(0, ms - 1500), () => { if (!TMG.over) TMG.amaran(); });
    this.time.delayedCall(ms, () => this.soalanBaru());
  }
  soalanBaru() {
    if (TMG.over) return;
    const q = TMG.nextQ(); if (!q) return;
    // sungai datang dari kanan; kancil berhenti di tebing
    const c = this.add.container(0, 0); c.q = q; c.sedia = false; c.umur = 0;
    const sungai = this.add.image(800, KC_GY + 60, 'kc-sungai');
    c.add(sungai); c.buaya = [];
    q.opts.forEach((o, i) => {
      const b = this.add.image(KC_BUAYA[i], KC_GY + 40, 'kc-buaya');
      const lb = this.add.rectangle(KC_BUAYA[i], KC_GY - 30, 150, 50, 0x0B1220, .85).setStrokeStyle(3, 0xFDE68A);
      const t = this.add.text(KC_BUAYA[i], KC_GY - 30, o, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '28px', fontStyle: '700', color: '#FFFFFF' }).setOrigin(.5);
      if (t.width > 138) t.setScale(138 / t.width);
      c.add([b, lb, t]); c.buaya.push([b, lb]);
    });
    c.anak = this.add.text(KC_BUAYA[this.pilih], KC_GY - 90, '▼', { fontFamily: 'Inter, sans-serif', fontSize: '34px', fontStyle: '900', color: '#FACC15' }).setOrigin(.5);
    c.add(c.anak); c.x = 900;
    this.objLayer.add(c); this.gate = c;
    this.obj.forEach(o => { o.mati = true; this.tweens.add({ targets: o, alpha: 0, duration: 250, onComplete: () => o.destroy() }); });
    this.tweens.add({ targets: c, x: 0, duration: 1200, ease: 'Quad.easeOut', onComplete: () => { c.sedia = true; this.henti = true; this.kancil.setTexture('kc-kancil2'); this.tandaPilih(); } });
    c.buaya.forEach(([b], i) => this.tweens.add({ targets: b, y: b.y + 5, duration: 600 + i * 90, yoyo: true, repeat: -1 }));
  }
  gerakPilih(d) { if (!this.gate || !this.gate.sedia) return; this.pilih = Phaser.Math.Clamp(this.pilih + d, 0, 3); this.tandaPilih(); TMG.bunyi('tap'); }
  tandaPilih() { const c = this.gate; if (!c) return; c.anak.x = KC_BUAYA[this.pilih]; c.buaya.forEach(([b, lb], i) => lb.setStrokeStyle(i === this.pilih ? 5 : 3, i === this.pilih ? 0xFACC15 : 0xFDE68A)); }
  lompatBuaya() {
    const c = this.gate; if (!c || !c.sedia) return; c.sedia = false;
    const i = this.pilih, ok = i === c.q.c, x = KC_BUAYA[i];
    this.tweens.add({ targets: this.kancil, x, y: KC_GY - 10, duration: 420, ease: 'Sine.easeInOut', onComplete: () => this.hasil(i, ok) });
    this.tweens.add({ targets: this.kancil, angle: -10, duration: 210, yoyo: true });
  }
  hasil(i, ok) {
    const c = this.gate; this.gate = null; const sebelum = TMG.skor;
    const end = i >= 0 && ok ? TMG.betul() : TMG.salah();
    if (i >= 0) {
      const [b] = c.buaya[i];
      if (ok) { this.letup(KC_BUAYA[i], KC_GY - 40, 0x34D399); this.timbul('+' + (TMG.skor - sebelum)); this.tweens.add({ targets: this.kancil, x: 1100, y: KC_GY - 34, duration: 600, ease: 'Sine.easeIn' }); }
      else { this.letup(KC_BUAYA[i], KC_GY - 40, 0xF87171); this.cameras.main.shake(260, .01); this.tweens.add({ targets: b, angle: -20, duration: 120, yoyo: true, repeat: 2 }); this.tweens.add({ targets: this.kancil, y: KC_GY - 140, duration: 300, yoyo: true }); }
    } else this.cameras.main.shake(220, .006);
    this.time.delayedCall(ok ? 700 : 900, () => {
      this.tweens.add({ targets: c, alpha: 0, duration: 300, onComplete: () => c.destroy() });
      this.kancil.setPosition(-60, KC_GY - 34).setAngle(0); this.y = KC_GY; this.vy = 0;
      this.tweens.add({ targets: this.kancil, x: KC_PX, duration: 600, onComplete: () => { this.henti = false; } });
    });
    if (!end) { this.time.delayedCall(900, () => { if (!TMG.over && !this.gate) TMG.rehat(); }); this.jadualSoalan(TMG.SELANG); }
  }
  timbul(txt) {
    const t = this.add.text(this.kancil.x, KC_GY - 120, txt, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '40px', fontStyle: '700', color: '#34D399', stroke: '#0B1220', strokeThickness: 6 }).setOrigin(.5);
    this.tweens.add({ targets: t, y: t.y - 60, alpha: 0, duration: 700, onComplete: () => t.destroy() });
  }
  letup(x, y, col) {
    for (let i = 0; i < 14; i++) {
      const d = this.add.circle(x, y, Phaser.Math.Between(5, 10), col), a = Math.random() * Math.PI * 2, r = Phaser.Math.Between(60, 140);
      this.tweens.add({ targets: d, x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, alpha: 0, scale: .3, duration: 520, ease: 'Quad.easeOut', onComplete: () => d.destroy() });
    }
  }
  /* ---------- halangan & rambutan ---------- */
  spawn() {
    const X = 1360, tahap = Math.min(1, (this.speed - KC_V0) / (KC_VMAX - KC_V0));
    if (Math.random() < .4) { const h = Phaser.Math.Between(0, 2) * 70, n = Phaser.Math.Between(3, 5); for (let i = 0; i < n; i++) this.tambahObj('kc-rambutan', X + i * 54, KC_GY - 40 - h, 'buah'); return; }
    this.tambahObj(Math.random() < .5 ? 'kc-akar' : 'kc-batu', X, KC_GY - 22, 'halang');
    if (Math.random() < tahap * .4) this.tambahObj('kc-batu', X + 90, KC_GY - 22, 'halang');
  }
  tambahObj(tex, x, y, jenis) { const o = this.add.image(x, y, tex); o.jenis = jenis; o.mati = false; this.objLayer.add(o); this.obj.push(o); return o; }
  update(t, dtms) {
    if (TMG.over) return;
    const dt = Math.min(dtms, 50) / 1000; this.masa += dt; this.kebal = Math.max(0, this.kebal - dt);
    if (this.gate && this.gate.sedia) {
      this.gate.umur += dt; const baki = Math.max(0, KC_BACA - this.gate.umur);
      this.gate.anak.setText(baki < 4 ? Math.ceil(baki) + ' ▼' : '▼');
      if (baki <= 0) { this.gate.sedia = false; this.hasil(-1, false); }
      return;
    }
    if (this.henti) return;
    this.speed = Math.min(KC_VMAX, this.speed + 2.4 * dt);
    const v = this.speed * dt; this.jarak += v;
    this.jauh.tilePositionX += v * .15; this.dekat.tilePositionX += v * .45; this.tanah.tilePositionX += v;
    // lompat
    if (this.y < KC_GY || this.vy < 0) { this.vy += 2200 * dt; this.y += this.vy * dt; if (this.y >= KC_GY) { this.y = KC_GY; this.vy = 0; this.lompat2 = 0; } }
    if (!this.gate) this.kancil.setPosition(KC_PX, this.y - 34);
    if (!this.gate && this.jarak >= this.nextSpawn) { this.spawn(); this.nextSpawn = this.jarak + Phaser.Math.Between(340, 560); }
    for (const o of this.obj) {
      o.x -= v;
      if (o.mati || Math.abs(o.x - KC_PX) > 44 || Math.abs(o.y - (this.y - 34)) > 46) continue;
      if (o.jenis === 'buah') { o.mati = true; TMG.kutip(10); this.tweens.add({ targets: o, scale: 0, alpha: 0, duration: 200, onComplete: () => o.destroy() }); }
      else if (!this.kebal) {
        o.mati = true; this.kebal = 1.1; this.cameras.main.shake(180, .008);
        this.tweens.add({ targets: this.kancil, alpha: .3, duration: 90, yoyo: true, repeat: 4 });
        if (TMG.cedera()) return;
      }
    }
    this.obj = this.obj.filter(o => { if (!o.active) return false; if (o.x < -80) { o.destroy(); return false; } return true; });
  }
}
const GAMEDEF = {
  nama: 'Kejar Kancil', warna: '#84CC16', scene: KancilScene,
  rehat: 'Lompat akar dan batu, kutip rambutan!',
  cara: '<b>Ruang</b> lompat (tekan 2 kali: lompat tinggi) · <b>← →</b> pilih buaya · <b>P</b> jeda',
  caraSentuh: 'Ketik skrin untuk lompat (ketik 2 kali untuk lompat tinggi). Kutip rambutan. Bila soalan muncul, ketik buaya yang ada jawapan betul untuk menyeberang sungai.'
};
