'use strict';
/* =================== PASAR MALAM · GERAI MALAM ===================
   Jadi penjual di gerai pasar malam. Pelanggan datang dan tunjuk makanan yang dimahu: serahkan
   dulang yang betul (kekunci 1–4 atau ketik dulang) sebelum pelanggan hilang sabar.
   Bila soalan muncul, papan harga di atas setiap dulang bertukar menjadi jawapan:
   serahkan dulang yang ada jawapan betul. */
const PM_X = [250, 510, 770, 1030], PM_DY = 560, PM_BACA = 12;
const PM_MAKAN = [['pm-sate', 'Sate'], ['pm-nasi', 'Nasi lemak'], ['pm-air', 'Air tebu'], ['pm-apam', 'Apam balik']];
class PasarScene extends Phaser.Scene {
  constructor() { super('pasar'); }
  create() {
    TMG.scene = this;
    Object.assign(this, { gate: null, pel: null, masa: 0, sabar0: 9 });
    this.buatTekstur();
    // malam, lampu, gerai
    this.add.rectangle(640, 360, 1280, 720, 0x1E1B4B);
    for (let i = 0; i < 40; i++) this.add.circle(Phaser.Math.Between(0, 1280), Phaser.Math.Between(80, 260), 1.5, 0xFDE68A, .6);
    const g = this.add.graphics(); g.lineStyle(2, 0x0B1220); g.beginPath(); g.moveTo(0, 110);
    for (let x = 0; x <= 1280; x += 80) g.lineTo(x, 110 + 18 * Math.sin(x / 80 * Math.PI)); g.strokePath();
    this.lampu = [];
    for (let x = 40; x <= 1280; x += 80) { const l = this.add.circle(x, 110 + 18 * Math.sin(x / 80 * Math.PI) + 10, 8, [0xFBBF24, 0xF472B6, 0x34D399, 0x60A5FA][(x / 80) % 4 | 0]); this.lampu.push(l); this.tweens.add({ targets: l, alpha: .4, duration: Phaser.Math.Between(400, 900), yoyo: true, repeat: -1 }); }
    this.add.rectangle(640, 300, 1280, 300, 0x312E81, .4);
    // kanopi gerai
    for (let x = 0; x < 1280; x += 80) this.add.rectangle(x + 40, 190, 80, 50, (x / 80) % 2 ? 0xDC2626 : 0xFEF3C7);
    this.add.rectangle(640, 650, 1280, 140, 0x7C2D12); this.add.rectangle(640, 586, 1280, 16, 0xA16207);
    this.pelLayer = this.add.container(0, 0);
    this.dulang = PM_MAKAN.map(([tex, nm], i) => {
      const c = this.add.container(PM_X[i], PM_DY);
      c.add([this.add.ellipse(0, 26, 200, 40, 0xE2E8F0), this.add.image(0, 0, tex), this.add.text(0, 70, `${i + 1}`, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '26px', fontStyle: '700', color: '#FDE68A' }).setOrigin(.5)]);
      const papan = this.add.rectangle(0, -100, 200, 56, 0x0B1220, .9).setStrokeStyle(3, 0xFDE68A), pt = this.add.text(0, -100, nm, { fontFamily: 'Inter, sans-serif', fontSize: '22px', fontStyle: '800', color: '#FFFFFF' }).setOrigin(.5);
      c.add([papan, pt]); c.papan = papan; c.pt = pt; c.nm = nm;
      c.setSize(220, 220).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.serah(i));
      return c;
    });
    const k = this.input.keyboard;
    ['ONE', 'TWO', 'THREE', 'FOUR'].forEach((n, i) => { k.on('keydown-' + n, () => this.serah(i)); k.on('keydown-NUMPAD_' + n, () => this.serah(i)); });
    this.time.delayedCall(800, () => this.pelangganBaru());
    this.jadualSoalan(TMG.SELANG * .6);
  }
  buatTekstur() {
    if (this.textures.exists('pm-sate')) return;
    const g = this.make.graphics({ add: false });
    g.lineStyle(4, 0xD6D3D1); [20, 44, 68].forEach(x => g.lineBetween(x, 6, x + 30, 100)); g.fillStyle(0x92400E); [20, 44, 68].forEach(x => { for (let k = 0; k < 4; k++) g.fillEllipse(x + 8 + k * 5, 30 + k * 14, 18, 12); });
    g.generateTexture('pm-sate', 110, 110); g.clear();
    g.fillStyle(0x16A34A); g.fillTriangle(0, 100, 55, 0, 110, 100); g.fillStyle(0xFFFFFF); g.fillEllipse(55, 66, 70, 40); g.fillStyle(0xDC2626); g.fillCircle(32, 80, 10); g.fillStyle(0xFDE68A); g.fillCircle(76, 76, 10); g.fillStyle(0x78350F); g.fillEllipse(60, 88, 24, 8);
    g.generateTexture('pm-nasi', 110, 110); g.clear();
    g.fillStyle(0xBEF264, .9); g.fillRoundedRect(28, 20, 54, 84, 8); g.lineStyle(3, 0xE2E8F0); g.strokeRoundedRect(28, 20, 54, 84, 8); g.lineStyle(4, 0xF472B6); g.lineBetween(60, 0, 54, 40); g.fillStyle(0xFFFFFF, .6); g.fillRect(34, 30, 10, 60);
    g.generateTexture('pm-air', 110, 110); g.clear();
    g.fillStyle(0xF59E0B); g.beginPath(); g.slice(55, 80, 52, Math.PI, 0); g.fillPath(); g.fillStyle(0xFDE68A); g.beginPath(); g.slice(55, 80, 40, Math.PI, 0); g.fillPath(); g.fillStyle(0x78350F); for (let x = 25; x < 90; x += 12) g.fillCircle(x, 70, 3);
    g.generateTexture('pm-apam', 110, 110); g.clear();
    // pelanggan
    const orang = (key, baju) => { g.clear(); g.fillStyle(0xFCD34D); g.fillCircle(50, 36, 30); g.fillStyle(baju); g.fillRoundedRect(14, 70, 72, 90, 18); g.fillStyle(0x0B1220); g.fillCircle(40, 34, 4); g.fillCircle(60, 34, 4); g.lineStyle(3, 0x0B1220); g.beginPath(); g.arc(50, 44, 10, .2, Math.PI - .2); g.strokePath(); g.generateTexture(key, 100, 160); };
    orang('pm-o1', 0x38BDF8); orang('pm-o2', 0xF472B6); orang('pm-o3', 0x34D399); orang('pm-o4', 0xA78BFA);
    // belon kata
    g.clear(); g.fillStyle(0xFFFFFF); g.fillRoundedRect(0, 0, 150, 120, 20); g.fillTriangle(20, 110, 50, 110, 10, 140); g.generateTexture('pm-belon', 150, 142);
    g.destroy();
  }
  /* ---------- pelanggan biasa ---------- */
  pelangganBaru() {
    if (TMG.over || this.gate || this.pel) return;
    const mahu = Phaser.Math.Between(0, 3), x = Phaser.Math.Between(380, 900);
    const c = this.add.container(x, 340, [this.add.image(0, 0, 'pm-o' + Phaser.Math.Between(1, 4)), this.add.image(110, -100, 'pm-belon'), this.add.image(110, -110, PM_MAKAN[mahu][0]).setScale(.75)]);
    c.bar = this.add.rectangle(-50, -86, 100, 10, 0x34D399).setOrigin(0, .5); c.add(c.bar);
    c.mahu = mahu; c.sabar = Math.max(4.5, this.sabar0 - this.masa / 25); c.baki = c.sabar; c.alpha = 0;
    this.pelLayer.add(c); this.pel = c;
    this.tweens.add({ targets: c, alpha: 1, y: 320, duration: 300 });
  }
  pelangganPergi(senyum) {
    const c = this.pel; if (!c) return; this.pel = null;
    this.tweens.add({ targets: c, alpha: 0, y: c.y + (senyum ? -30 : 30), duration: 350, onComplete: () => c.destroy() });
    this.time.delayedCall(700, () => this.pelangganBaru());
  }
  serah(i) {
    if (TMG.over || !this.scene.isActive()) return;
    const d = this.dulang[i];
    this.tweens.add({ targets: d, y: PM_DY - 40, duration: 110, yoyo: true });
    if (this.gate) { this.nilai(i); return; }
    if (!this.pel) return;
    if (i === this.pel.mahu) { TMG.kutip(20); this.teks('+20', this.pel.x, 200, '#34D399'); this.pelangganPergi(true); }
    else { TMG.combo = 0; TMG.bunyi('no'); this.teks('Bukan ini!', this.pel.x, 200, '#F87171'); this.pel.baki -= 1.5; }
  }
  teks(s, x, y, col) {
    const t = this.add.text(x, y, s, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '36px', fontStyle: '700', color: col, stroke: '#0B1220', strokeThickness: 6 }).setOrigin(.5);
    this.tweens.add({ targets: t, y: y - 60, alpha: 0, duration: 700, onComplete: () => t.destroy() });
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
    if (this.pel) { const p = this.pel; this.pel = null; this.tweens.add({ targets: p, alpha: 0, duration: 250, onComplete: () => p.destroy() }); }
    this.gate = { q, umur: 0 };
    // pelanggan istimewa: Cikgu
    const c = this.add.container(640, 330, [this.add.image(0, 0, 'pm-o4'), this.add.text(0, -116, 'SOALAN!', { fontFamily: '"Space Grotesk", sans-serif', fontSize: '30px', fontStyle: '700', color: '#FACC15', stroke: '#0B1220', strokeThickness: 6 }).setOrigin(.5)]);
    c.bar = this.add.rectangle(-80, -86, 160, 12, 0x60A5FA).setOrigin(0, .5); c.add(c.bar);
    this.pelLayer.add(c); this.gate.c = c;
    q.opts.forEach((o, i) => { const d = this.dulang[i]; d.pt.setText(o).setColor('#FDE68A').setFontFamily('"Space Grotesk", sans-serif').setFontSize(30); d.pt.setScale(d.pt.width > 186 ? 186 / d.pt.width : 1); d.papan.setStrokeStyle(4, 0xFACC15); });
  }
  nilai(i) {
    const G = this.gate; this.gate = null;
    const ok = i === G.q.c, sebelum = TMG.skor;
    const end = ok ? TMG.betul() : TMG.salah();
    if (i >= 0) this.letup(PM_X[i], PM_DY - 100, ok ? 0x34D399 : 0xF87171);
    if (ok) this.teks('+' + (TMG.skor - sebelum), 640, 200, '#34D399'); else this.cameras.main.shake(220, .006);
    this.tweens.add({ targets: G.c, alpha: 0, duration: 300, onComplete: () => G.c.destroy() });
    this.dulang.forEach(d => { d.pt.setText(d.nm).setColor('#FFFFFF').setFontFamily('Inter, sans-serif').setFontSize(22).setScale(1); d.papan.setStrokeStyle(3, 0xFDE68A); });
    this.time.delayedCall(800, () => this.pelangganBaru());
    if (!end) { this.time.delayedCall(900, () => { if (!TMG.over && !this.gate) TMG.rehat(); }); this.jadualSoalan(TMG.SELANG); }
  }
  update(t, dtms) {
    if (TMG.over) return;
    const dt = Math.min(dtms, 50) / 1000; this.masa += dt;
    if (this.gate) {
      const G = this.gate; G.umur += dt; const baki = Math.max(0, 1 - G.umur / PM_BACA);
      G.c.bar.width = 160 * baki; G.c.bar.fillColor = baki > .3 ? 0x60A5FA : 0xF87171;
      if (G.umur >= PM_BACA) this.nilai(-1);
      return;
    }
    const p = this.pel; if (!p) return;
    p.baki -= dt; const e = Math.max(0, p.baki / p.sabar);
    p.bar.width = 100 * e; p.bar.fillColor = e > .5 ? 0x34D399 : e > .25 ? 0xFBBF24 : 0xF87171;
    if (p.baki <= 0) { this.teks('Pelanggan merajuk!', p.x, 200, '#F87171'); this.pelangganPergi(false); if (TMG.cedera()) return; }
  }
}
const GAMEDEF = {
  nama: 'Pasar Malam', warna: '#E879F9', scene: PasarScene,
  rehat: 'Layan pelanggan: serahkan makanan yang mereka mahu!',
  cara: 'Kekunci <b>1 2 3 4</b> atau klik dulang · <b>P</b> jeda',
  caraSentuh: 'Ketik dulang makanan yang pelanggan mahu sebelum mereka hilang sabar. Bila soalan muncul, papan di atas dulang menunjukkan jawapan: ketik dulang jawapan betul.'
};
