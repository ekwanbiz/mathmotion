'use strict';
/* =================== LARI PECUT · JALAN KAMPUNG ===================
   Lari bebas: kutip syiling, elak halangan. Setiap ~15 saat soalan muncul (papan jawapan).
   Makin lama makin laju dan halangan makin banyak. */
const LR_LANE = [375, 472, 569, 666], LR_PX = 250, LR_V0 = 230, LR_VMAX = 760, LR_ACC = 3.2, LR_BACA = 6;
class LariScene extends Phaser.Scene {
  constructor() { super('lari'); }
  create() {
    TMG.scene = this;
    Object.assign(this, { speed: LR_V0, lane: 1, jump: false, gate: null, obj: [], deco: [], jarak: 0, nextSpawn: 500, kebal: 0 });
    this.buatTekstur();
    this.add.rectangle(640, 165, 1280, 330, 0x7DD3FC);
    this.add.circle(1080, 150, 52, 0xFDE68A);
    this.awan = [this.add.ellipse(300, 175, 180, 52, 0xffffff, .85), this.add.ellipse(760, 125, 140, 40, 0xffffff, .85), this.add.ellipse(1150, 230, 120, 34, 0xffffff, .8)];
    const g = this.add.graphics(); g.fillStyle(0x4D7C0F); g.beginPath(); g.moveTo(0, 300);
    for (let x = 0; x <= 1280; x += 40) g.lineTo(x, 290 - 22 * Math.sin(x / 170)); g.lineTo(1280, 335); g.lineTo(0, 335); g.closePath(); g.fillPath();
    this.decoLayer = this.add.container(0, 0);
    this.add.rectangle(640, 525, 1280, 390, 0x57534E);
    this.add.rectangle(640, 333, 1280, 6, 0x44403C);
    this.dash = [427, 524, 621].map(y => this.add.tileSprite(640, y, 1280, 5, 'lr-dash'));
    this.objLayer = this.add.container(0, 0);
    this.pemain = this.add.container(LR_PX, LR_LANE[this.lane]);
    this.bayang = this.add.ellipse(0, 40, 60, 14, 0x000000, .25);
    this.badan = this.add.image(0, 0, 'lr-lari1');
    this.pemain.add([this.bayang, this.badan]);
    this.time.addEvent({ delay: 120, loop: true, callback: () => { if (!this.jump) this.badan.setTexture(this.badan.texture.key === 'lr-lari1' ? 'lr-lari2' : 'lr-lari1'); } });
    for (let x = 80; x < 1400; x += 320) this.tambahDeco(x);
    const k = this.input.keyboard;
    k.on('keydown-UP', () => this.tukar(-1)); k.on('keydown-W', () => this.tukar(-1));
    k.on('keydown-DOWN', () => this.tukar(1)); k.on('keydown-S', () => this.tukar(1));
    k.on('keydown-SPACE', () => this.lompat());
    let sy = null, st = 0;
    this.input.on('pointerdown', p => { sy = p.y; st = p.downTime; });
    this.input.on('pointerup', p => { if (sy === null) return; const dy = p.y - sy; if (Math.abs(dy) > 40) this.tukar(dy < 0 ? -1 : 1); else if (p.upTime - st < 300) this.lompat(); sy = null; });
    this.jadualSoalan(TMG.SELANG * .6);
  }
  buatTekstur() {
    if (this.textures.exists('lr-dash')) return;
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xFDE68A); g.fillRect(0, 0, 40, 5); g.generateTexture('lr-dash', 70, 5); g.clear();
    const orang = (key, f) => {
      g.clear(); g.lineStyle(8, 0x0B1220); g.fillStyle(0xFCD34D); g.fillCircle(40, 18, 18); g.strokeCircle(40, 18, 18);
      g.fillStyle(0x38BDF8); g.fillRoundedRect(22, 38, 36, 38, 9); g.lineStyle(3, 0x0B1220); g.strokeRoundedRect(22, 38, 36, 38, 9);
      g.lineStyle(8, 0x0B1220);
      if (f) { g.lineBetween(30, 74, 16, 96); g.lineBetween(50, 74, 66, 92); g.lineBetween(24, 46, 6, 58); g.lineBetween(56, 46, 74, 36); }
      else { g.lineBetween(30, 74, 40, 98); g.lineBetween(50, 74, 54, 98); g.lineBetween(24, 46, 14, 66); g.lineBetween(56, 46, 66, 64); }
      g.generateTexture(key, 80, 100);
    };
    orang('lr-lari1', true); orang('lr-lari2', false);
    g.clear(); g.fillStyle(0xB45309); g.fillRoundedRect(0, 0, 70, 56, 8); g.lineStyle(4, 0x451A03); g.strokeRoundedRect(2, 2, 66, 52, 8); g.lineBetween(4, 4, 66, 52); g.lineBetween(66, 4, 4, 52); g.generateTexture('lr-kotak', 70, 56);
    g.clear(); g.fillStyle(0x1D4ED8); g.fillRoundedRect(4, 0, 52, 66, 10); g.fillStyle(0x93C5FD); g.fillRect(4, 14, 52, 6); g.fillRect(4, 46, 52, 6); g.lineStyle(3, 0x0B1220); g.strokeRoundedRect(5, 1, 50, 64, 10); g.generateTexture('lr-tong', 60, 68);
    g.clear(); g.fillStyle(0xFBBF24); g.fillCircle(18, 18, 17); g.lineStyle(3, 0xB45309); g.strokeCircle(18, 18, 14); g.fillStyle(0xFEF3C7); g.fillCircle(13, 12, 4); g.generateTexture('lr-syiling', 36, 36);
    g.clear(); g.fillStyle(0xFBBF24); g.fillRoundedRect(0, 0, 230, 82, 16); g.lineStyle(4, 0x0B1220); g.strokeRoundedRect(2, 2, 226, 78, 16); g.generateTexture('lr-papan', 230, 82);
    g.clear();
    g.fillStyle(0x78350F); g.fillRect(4, 100, 140, 10); g.fillStyle(0x92400E); g.fillRect(14, 50, 120, 54);
    g.fillStyle(0xB45309); g.fillTriangle(0, 54, 74, 0, 148, 54); g.fillStyle(0x451A03); g.fillRect(52, 66, 26, 38); g.fillStyle(0xFDE68A); g.fillRect(92, 64, 24, 20);
    g.lineStyle(5, 0x78350F); g.lineBetween(24, 110, 24, 130); g.lineBetween(124, 110, 124, 130); g.generateTexture('lr-rumah', 148, 130);
    g.clear();
    g.lineStyle(9, 0x78350F); g.beginPath(); g.moveTo(60, 160); g.lineTo(66, 110); g.lineTo(58, 50); g.strokePath();
    g.fillStyle(0x15803D); g.fillTriangle(58, 50, 0, 70, 20, 50); g.fillTriangle(58, 50, 120, 66, 98, 44); g.fillTriangle(58, 50, 22, 10, 44, 46); g.fillTriangle(58, 50, 96, 8, 74, 46);
    g.generateTexture('lr-kelapa', 120, 160);
    g.destroy();
  }
  tambahDeco(x) {
    const r = Math.random() < .5, s = this.add.image(x, r ? 268 : 222, r ? 'lr-rumah' : 'lr-kelapa');
    this.decoLayer.add(s); this.deco.push(s);
  }
  tukar(d) { if (TMG.over) return; const n = Phaser.Math.Clamp(this.lane + d, 0, 3); if (n === this.lane) return; this.lane = n; this.tweens.add({ targets: this.pemain, y: LR_LANE[n], duration: 110, ease: 'Quad.easeOut' }); }
  lompat() {
    if (this.jump || TMG.over) return; this.jump = true; TMG.bunyi('tap');
    this.badan.setTexture('lr-lari1');
    const d = Math.max(190, 300 - (this.speed - LR_V0) / 5);
    this.tweens.add({ targets: this.badan, y: -95, duration: d, ease: 'Quad.easeOut', yoyo: true, onComplete: () => { this.jump = false; } });
    this.tweens.add({ targets: this.bayang, scaleX: .5, scaleY: .5, alpha: .12, duration: d, yoyo: true });
  }
  /* ---------- soalan sekali-sekala ---------- */
  jadualSoalan(ms) {
    if (TMG.over || TMG.qn >= TMG.MAX) return;
    this.time.delayedCall(Math.max(0, ms - 1500), () => { if (!TMG.over) TMG.amaran(); });
    this.time.delayedCall(ms, () => this.soalanBaru());
  }
  soalanBaru() {
    if (TMG.over) return;
    const q = TMG.nextQ(); if (!q) return;
    // papan sampai kepada pelari selepas LR_BACA saat, walau selaju mana pun
    const c = this.add.container(LR_PX + 140 + this.speed * LR_BACA, 0); c.q = q; c.papan = [];
    q.opts.forEach((o, i) => {
      const p = this.add.image(0, LR_LANE[i], 'lr-papan');
      const t = this.add.text(0, LR_LANE[i], o, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '34px', fontStyle: '700', color: '#0B1220' }).setOrigin(.5);
      if (t.width > 206) t.setScale(206 / t.width);
      c.add([p, t]); c.papan.push(p);
    });
    this.objLayer.add(c); this.gate = c;
  }
  nilai() {
    const c = this.gate; this.gate = null;
    const ok = this.lane === c.q.c, x = c.x, y = LR_LANE[this.lane], sebelum = TMG.skor;
    const end = ok ? TMG.betul() : TMG.salah();
    c.list.forEach(o => this.tweens.add({ targets: o, alpha: 0, duration: 250 }));
    this.time.delayedCall(300, () => c.destroy());
    if (c.papan[this.lane]) this.letup(x, y, ok ? 0x34D399 : 0xF87171);
    if (ok) this.timbul('+' + (TMG.skor - sebelum), y);
    else this.cameras.main.shake(220, .006);
    if (!end) { this.time.delayedCall(900, () => { if (!TMG.over && !this.gate) TMG.rehat(); }); this.jadualSoalan(TMG.SELANG); }
  }
  timbul(txt, y) {
    const t = this.add.text(LR_PX + 20, y - 60, txt, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '40px', fontStyle: '700', color: '#34D399', stroke: '#0B1220', strokeThickness: 6 }).setOrigin(.5);
    this.tweens.add({ targets: t, y: y - 120, alpha: 0, duration: 700, ease: 'Quad.easeOut', onComplete: () => t.destroy() });
  }
  letup(x, y, col) {
    for (let i = 0; i < 14; i++) {
      const d = this.add.circle(x, y, Phaser.Math.Between(5, 10), col), a = Math.random() * Math.PI * 2, r = Phaser.Math.Between(60, 140);
      this.tweens.add({ targets: d, x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, alpha: 0, scale: .3, duration: 520, ease: 'Quad.easeOut', onComplete: () => d.destroy() });
    }
  }
  /* ---------- syiling & halangan ---------- */
  spawn() {
    const X = 1360;
    if (this.gate && Math.abs(this.gate.x - X) < 420) return; // jangan dekat papan jawapan
    const tahap = Math.min(1, (this.speed - LR_V0) / (LR_VMAX - LR_V0));
    if (Math.random() < .45 - tahap * .15) {
      const ln = Phaser.Math.Between(0, 3), n = Phaser.Math.Between(3, 6);
      for (let i = 0; i < n; i++) this.tambahObj('lr-syiling', X + i * 60, ln, 'syiling');
      return;
    }
    const nb = Math.random() < tahap * .8 ? (Math.random() < tahap * .5 ? 3 : 2) : 1, lanes = Phaser.Utils.Array.Shuffle([0, 1, 2, 3]).slice(0, nb);
    lanes.forEach(ln => this.tambahObj(Math.random() < .5 ? 'lr-kotak' : 'lr-tong', X, ln, 'halang'));
    const bebas = [0, 1, 2, 3].filter(l => !lanes.includes(l));
    if (bebas.length && Math.random() < .5) this.tambahObj('lr-syiling', X, Phaser.Utils.Array.GetRandom(bebas), 'syiling');
  }
  tambahObj(tex, x, ln, jenis) {
    const o = this.add.image(x, LR_LANE[ln] + (jenis === 'halang' ? 8 : 0), tex); o.lane = ln; o.jenis = jenis; o.mati = false;
    if (jenis === 'syiling') this.tweens.add({ targets: o, scaleX: .3, duration: 300, yoyo: true, repeat: -1 });
    this.objLayer.add(o); this.obj.push(o);
  }
  update(t, dtms) {
    if (TMG.over) return;
    const dt = Math.min(dtms, 50) / 1000;
    this.speed = Math.min(LR_VMAX, this.speed + LR_ACC * dt);
    const v = this.speed * dt;
    this.jarak += v;
    this.kebal = Math.max(0, this.kebal - dt);
    this.dash.forEach(d => d.tilePositionX += v);
    this.awan.forEach(a => { a.x -= v * .08; if (a.x < -120) a.x = 1400; });
    this.deco.forEach(s => { s.x -= v * .35; });
    if (this.deco.length && this.deco[0].x < -100) { this.deco.shift().destroy(); this.tambahDeco(this.deco[this.deco.length - 1].x + Phaser.Math.Between(260, 380)); }
    if (this.jarak >= this.nextSpawn) { this.spawn(); this.nextSpawn = this.jarak + Phaser.Math.Between(300, 480); }
    if (this.gate) { this.gate.x -= v; if (this.gate.x <= LR_PX + 140) this.nilai(); }
    for (const o of this.obj) {
      o.x -= v;
      if (o.mati || o.lane !== this.lane || Math.abs(o.x - LR_PX) > 42) continue;
      if (o.jenis === 'syiling') { o.mati = true; TMG.kutip(10); this.tweens.add({ targets: o, y: o.y - 60, alpha: 0, duration: 250, onComplete: () => o.destroy() }); }
      else if (!this.jump && !this.kebal) {
        o.mati = true; this.kebal = 1; this.cameras.main.shake(180, .008);
        this.tweens.add({ targets: o, angle: 80, alpha: 0, y: o.y - 40, duration: 350, onComplete: () => o.destroy() });
        this.tweens.add({ targets: this.badan, alpha: .3, duration: 90, yoyo: true, repeat: 4 });
        if (TMG.cedera()) return;
      }
    }
    this.obj = this.obj.filter(o => { if (!o.active) return false; if (o.x < -80) { o.destroy(); return false; } return true; });
  }
}
const GAMEDEF = {
  nama: 'Lari Pecut', warna: '#FBBF24', scene: LariScene,
  rehat: 'Kutip syiling, elak kotak dan tong!',
  cara: '<b>↑ ↓</b> tukar lorong · <b>Ruang</b> lompat · <b>P</b> jeda',
  caraSentuh: 'Tekan <b>↑ ↓</b> (atau leret) untuk tukar lorong, <b>LOMPAT</b> untuk elak halangan. Kutip syiling. Bila soalan muncul, masuk lorong jawapan betul.',
  sentuh(el) {
    el.innerHTML = '<button id="sJ" aria-label="Lompat" style="left:1.4cqw;bottom:23cqw;width:8cqw;height:8cqw;font-size:1.25cqw;border-color:#FBBF24;background:#FBBF2499;color:#0B1220">LOMPAT</button>'
      + '<button id="sU" aria-label="Lorong atas" style="left:1.4cqw;bottom:12.5cqw;width:8cqw;height:8cqw;font-size:3cqw">↑</button>'
      + '<button id="sD" aria-label="Lorong bawah" style="left:1.4cqw;bottom:2cqw;width:8cqw;height:8cqw;font-size:3cqw">↓</button>';
    const on = (id, f) => el.querySelector(id).addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (TMG.scene && TMG.scene.scene.isActive()) f(); });
    on('#sU', () => TMG.scene.tukar(-1)); on('#sD', () => TMG.scene.tukar(1)); on('#sJ', () => TMG.scene.lompat());
  }
};
