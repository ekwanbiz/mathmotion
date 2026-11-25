'use strict';
/* =================== GASING JUARA · GELANGGANG KELANTAN ===================
   Gasing berpusing dalam gelanggang dan tenaganya makin berkurang. Gerakkan gasing untuk kutip
   bintang tenaga dan elak kumbang. Bila soalan muncul, 4 papan jawapan muncul di sekeliling
   gelanggang: bawa gasing ke papan jawapan betul. Tenaga habis = hilang satu nyawa. */
const GS_CX = 640, GS_CY = 420, GS_R = 270, GS_RG = 30, GS_BACA = 12;
const GS_PAD = [[640, 207], [905, 420], [640, 633], [375, 420]], GS_PW = 214, GS_PH = 78;
class GasingScene extends Phaser.Scene {
  constructor() { super('gasing'); }
  create() {
    TMG.scene = this;
    Object.assign(this, { x: GS_CX, y: GS_CY, vx: 0, vy: 0, tenaga: 100, kebal: 0, masa: 0, gate: null, bintang: [], kumbang: [], nextB: 1.5, nextK: 4, sudut: 0, tPtr: null });
    this.buatTekstur();
    // lantai kayu & corak tepi
    this.add.rectangle(640, 360, 1280, 720, 0x7C2D12);
    for (let x = 0; x < 1280; x += 80) this.add.rectangle(x + 40, 360, 76, 720, x % 160 ? 0x8A3A16 : 0x7C2D12);
    const g = this.add.graphics();
    g.fillStyle(0xFACC15, .9); for (let a = 0; a < 48; a++) { const t = a / 48 * Math.PI * 2; g.fillCircle(GS_CX + Math.cos(t) * (GS_R + 26), GS_CY + Math.sin(t) * (GS_R + 26), 7); }
    g.fillStyle(0xB91C1C); g.fillCircle(GS_CX, GS_CY, GS_R + 14);
    g.fillStyle(0xFDE68A); g.fillCircle(GS_CX, GS_CY, GS_R);
    g.lineStyle(3, 0xD97706, .6); g.strokeCircle(GS_CX, GS_CY, GS_R - 60); g.strokeCircle(GS_CX, GS_CY, 60);
    // bar tenaga
    this.add.text(40, 96, 'TENAGA GASING', { fontFamily: 'Inter, sans-serif', fontSize: '18px', fontStyle: '800', color: '#FEF3C7' });
    this.add.rectangle(40, 132, 260, 24, 0x0B1220, .8).setOrigin(0, .5);
    this.bar = this.add.rectangle(43, 132, 254, 18, 0x34D399).setOrigin(0, .5);
    this.lapis = this.add.container(0, 0);
    // gasing: bayang + badan berpusing + tali
    this.bayang = this.add.ellipse(this.x + 6, this.y + 10, 72, 30, 0x000000, .25);
    this.gasing = this.add.image(this.x, this.y, 'gs-gasing');
    const k = this.input.keyboard;
    this.kunci = k.addKeys('UP,DOWN,LEFT,RIGHT,W,A,S,D');
    this.input.on('pointerdown', p => { this.tPtr = p; });
    this.input.on('pointermove', p => { if (p.isDown) this.tPtr = p; });
    this.input.on('pointerup', () => { this.tPtr = null; });
    this.jadualSoalan(TMG.SELANG * .6);
  }
  buatTekstur() {
    if (this.textures.exists('gs-gasing')) return;
    const g = this.make.graphics({ add: false });
    // gasing dari atas: cakera berjalur merah-kuning-hijau
    const C = [0xDC2626, 0xFACC15, 0x16A34A, 0xFACC15];
    for (let i = 0; i < 8; i++) { g.fillStyle(C[i % 4]); g.beginPath(); g.slice(40, 40, 36, i * Math.PI / 4, (i + 1) * Math.PI / 4, false); g.fillPath(); }
    g.fillStyle(0xFEF3C7); g.fillCircle(40, 40, 12); g.fillStyle(0x78350F); g.fillCircle(40, 40, 6);
    g.lineStyle(4, 0x0B1220); g.strokeCircle(40, 40, 36);
    g.generateTexture('gs-gasing', 80, 80); g.clear();
    // bintang tenaga
    const st = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 9 : 22, a = -Math.PI / 2 + i * Math.PI / 5; st.push(new Phaser.Math.Vector2(24 + r * Math.cos(a), 24 + r * Math.sin(a))); }
    g.fillStyle(0xFBBF24); g.fillPoints(st, true); g.lineStyle(3, 0xB45309); g.strokePoints(st, true, true);
    g.generateTexture('gs-bintang', 48, 48); g.clear();
    // kumbang
    g.fillStyle(0x1E293B); g.fillEllipse(30, 22, 44, 34); g.fillStyle(0x0F766E); g.fillEllipse(30, 22, 38, 28);
    g.lineStyle(2, 0x0B1220); g.lineBetween(30, 8, 30, 36); g.fillStyle(0x0B1220); g.fillCircle(52, 22, 8);
    g.lineStyle(3, 0x0B1220); [[16, 8, 6, 0], [30, 6, 30, -2], [42, 8, 50, 0], [16, 36, 6, 44], [30, 38, 30, 46], [42, 36, 50, 44]].forEach(([a, b, c, d]) => g.lineBetween(a, b, c, d));
    g.generateTexture('gs-kumbang', 62, 48); g.clear();
    // papan jawapan
    g.fillStyle(0xFFFFFF); g.fillRoundedRect(0, 0, GS_PW, GS_PH, 18); g.lineStyle(5, 0x0B1220); g.strokeRoundedRect(3, 3, GS_PW - 6, GS_PH - 6, 16);
    g.generateTexture('gs-papan', GS_PW, GS_PH); g.clear();
    g.destroy();
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
    const c = this.add.container(0, 0); c.q = q; c.umur = 0; c.dalam = GS_PAD.map(([px, py]) => this.atasPad(px, py));
    q.opts.forEach((o, i) => {
      const [px, py] = GS_PAD[i];
      const p = this.add.image(px, py, 'gs-papan').setTint(COL[i]);
      const t = this.add.text(px, py, o, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '32px', fontStyle: '700', color: '#0B1220' }).setOrigin(.5);
      if (t.width > GS_PW - 26) t.setScale((GS_PW - 26) / t.width);
      c.add([p, t]); p.setScale(.2); this.tweens.add({ targets: p, scale: 1, duration: 260, ease: 'Back.easeOut' });
    });
    // jam: gelang masa di sekeliling gelanggang
    c.jam = this.add.graphics(); c.add(c.jam);
    this.lapis.add(c); this.gate = c;
    this.kumbang.forEach(b => { this.tweens.add({ targets: b, alpha: 0, duration: 300, onComplete: () => b.destroy() }); b.mati = true; });
  }
  atasPad(px, py) { return Math.abs(this.x - px) < GS_PW / 2 + 6 && Math.abs(this.y - py) < GS_PH / 2 + 6; }
  nilai(pilih) {
    const c = this.gate; this.gate = null;
    const ok = pilih === c.q.c, sebelum = TMG.skor;
    const end = ok ? TMG.betul() : TMG.salah();
    if (ok) { this.tenaga = Math.min(100, this.tenaga + 35); this.timbul('+' + (TMG.skor - sebelum)); }
    else { this.goyang(); this.cameras.main.shake(220, .006); }
    if (pilih >= 0) this.letup(GS_PAD[pilih][0], GS_PAD[pilih][1], ok ? 0x34D399 : 0xF87171);
    c.list.forEach(o => this.tweens.add({ targets: o, alpha: 0, duration: 260 }));
    this.time.delayedCall(320, () => c.destroy());
    if (!end) { this.time.delayedCall(900, () => { if (!TMG.over && !this.gate) TMG.rehat(); }); this.jadualSoalan(TMG.SELANG); }
  }
  timbul(txt) {
    const t = this.add.text(this.x, this.y - 60, txt, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '40px', fontStyle: '700', color: '#34D399', stroke: '#0B1220', strokeThickness: 6 }).setOrigin(.5);
    this.tweens.add({ targets: t, y: t.y - 60, alpha: 0, duration: 700, ease: 'Quad.easeOut', onComplete: () => t.destroy() });
  }
  letup(x, y, col) {
    for (let i = 0; i < 14; i++) {
      const d = this.add.circle(x, y, Phaser.Math.Between(5, 10), col), a = Math.random() * Math.PI * 2, r = Phaser.Math.Between(60, 140);
      this.tweens.add({ targets: d, x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, alpha: 0, scale: .3, duration: 520, ease: 'Quad.easeOut', onComplete: () => d.destroy() });
    }
  }
  goyang() { this.tweens.add({ targets: this.gasing, scaleX: .8, duration: 80, yoyo: true, repeat: 3 }); }
  /* ---------- bintang & kumbang ---------- */
  titikRawak(jauhDari) {
    for (let i = 0; i < 20; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * (GS_R - 50), x = GS_CX + Math.cos(a) * r, y = GS_CY + Math.sin(a) * r;
      if (Math.hypot(x - this.x, y - this.y) > jauhDari) return [x, y];
    }
    return [GS_CX, GS_CY - 120];
  }
  tambahBintang() {
    if (this.bintang.length >= 3) return;
    const [x, y] = this.titikRawak(140), b = this.add.image(x, y, 'gs-bintang'); b.hidup = 7; b.mati = false;
    this.tweens.add({ targets: b, angle: 360, duration: 3000, repeat: -1 }); this.tweens.add({ targets: b, scale: 1.15, duration: 400, yoyo: true, repeat: -1 });
    this.lapis.add(b); this.bintang.push(b);
  }
  tambahKumbang() {
    const a = Math.random() * Math.PI * 2, x = GS_CX + Math.cos(a) * (GS_R - 10), y = GS_CY + Math.sin(a) * (GS_R - 10);
    const b2 = a + Math.PI + Phaser.Math.FloatBetween(-.6, .6), v = Math.min(220, 110 + this.masa * 1.5);
    const k = this.add.image(x, y, 'gs-kumbang'); k.vx = Math.cos(b2) * v; k.vy = Math.sin(b2) * v; k.rotation = b2; k.mati = false;
    this.lapis.add(k); this.kumbang.push(k);
  }
  update(t, dtms) {
    if (TMG.over) return;
    const dt = Math.min(dtms, 50) / 1000;
    this.masa += dt; this.kebal = Math.max(0, this.kebal - dt);
    // kawalan
    const K = this.kunci, A = 1100; let ax = 0, ay = 0;
    if (K.LEFT.isDown || K.A.isDown) ax -= 1; if (K.RIGHT.isDown || K.D.isDown) ax += 1;
    if (K.UP.isDown || K.W.isDown) ay -= 1; if (K.DOWN.isDown || K.S.isDown) ay += 1;
    if (this.tPtr && this.tPtr.isDown) { const dx = this.tPtr.x - this.x, dy = this.tPtr.y - this.y, d = Math.hypot(dx, dy); if (d > 12) { ax = dx / d; ay = dy / d; } }
    const n = Math.hypot(ax, ay) || 1; this.vx += ax / n * A * dt; this.vy += ay / n * A * dt;
    const geser = Math.pow(.25, dt); this.vx *= geser; this.vy *= geser;
    const sp = Math.hypot(this.vx, this.vy), VMAX = 430; if (sp > VMAX) { this.vx *= VMAX / sp; this.vy *= VMAX / sp; }
    this.x += this.vx * dt; this.y += this.vy * dt;
    // dinding gelanggang: lantun
    const dx = this.x - GS_CX, dy = this.y - GS_CY, d = Math.hypot(dx, dy), lim = GS_R - GS_RG;
    if (d > lim) {
      const nx = dx / d, ny = dy / d; this.x = GS_CX + nx * lim; this.y = GS_CY + ny * lim;
      const dot = this.vx * nx + this.vy * ny; if (dot > 0) { this.vx -= 1.7 * dot * nx; this.vy -= 1.7 * dot * ny; if (dot > 160) { this.tenaga -= 2; TMG.bunyi('tap'); } }
    }
    // tenaga
    this.tenaga -= (5 + Math.min(4, this.masa / 30)) * dt;
    if (this.tenaga <= 0) {
      this.tenaga = 60; this.goyang(); this.cameras.main.shake(250, .01);
      const tx = this.add.text(this.x, this.y - 70, 'Gasing hampir jatuh!', { fontFamily: 'Inter, sans-serif', fontSize: '24px', fontStyle: '800', color: '#F87171', stroke: '#0B1220', strokeThickness: 5 }).setOrigin(.5);
      this.tweens.add({ targets: tx, y: tx.y - 40, alpha: 0, duration: 1000, onComplete: () => tx.destroy() });
      if (TMG.cedera()) return;
    }
    const e = Phaser.Math.Clamp(this.tenaga / 100, 0, 1);
    this.bar.width = 254 * e; this.bar.fillColor = e > .5 ? 0x34D399 : e > .25 ? 0xFBBF24 : 0xF87171;
    this.sudut += (300 + 1100 * e) * dt;
    const goy = e < .25 ? Math.sin(this.masa * 18) * 5 * (1 - e * 4) : 0;
    this.gasing.setPosition(this.x + goy, this.y).setAngle(this.sudut);
    this.bayang.setPosition(this.x + 6, this.y + 12);
    // bintang
    this.nextB -= dt; if (this.nextB <= 0) { this.tambahBintang(); this.nextB = Phaser.Math.FloatBetween(1.6, 2.8); }
    for (const b of this.bintang) {
      b.hidup -= dt;
      if (!b.mati && Math.hypot(b.x - this.x, b.y - this.y) < 48) { b.mati = true; this.tenaga = Math.min(100, this.tenaga + 12); TMG.kutip(10); this.tweens.add({ targets: b, scale: 0, alpha: 0, duration: 220, onComplete: () => b.destroy() }); }
      else if (!b.mati && b.hidup <= 0) { b.mati = true; this.tweens.add({ targets: b, alpha: 0, duration: 300, onComplete: () => b.destroy() }); }
    }
    this.bintang = this.bintang.filter(b => !b.mati);
    // kumbang (tiada semasa soalan)
    if (!this.gate) { this.nextK -= dt; if (this.nextK <= 0) { this.tambahKumbang(); this.nextK = Math.max(1.6, 4.2 - this.masa / 40) * Phaser.Math.FloatBetween(.8, 1.2); } }
    for (const k of this.kumbang) {
      if (k.mati) continue;
      k.x += k.vx * dt; k.y += k.vy * dt;
      if (Math.hypot(k.x - GS_CX, k.y - GS_CY) > GS_R + 30) { k.mati = true; k.destroy(); continue; }
      if (!this.kebal && Math.hypot(k.x - this.x, k.y - this.y) < 50) {
        k.mati = true; this.kebal = 1; this.tenaga -= 22; this.goyang(); this.cameras.main.shake(180, .008); TMG.bunyi('no');
        this.vx += (this.x - k.x) * 6; this.vy += (this.y - k.y) * 6;
        this.tweens.add({ targets: k, alpha: 0, scale: .4, duration: 300, onComplete: () => k.destroy() });
        this.tweens.add({ targets: this.gasing, alpha: .35, duration: 90, yoyo: true, repeat: 4 });
      }
    }
    this.kumbang = this.kumbang.filter(k => !k.mati);
    // soalan: masuk papan jawapan
    if (this.gate) {
      const c = this.gate; c.umur += dt;
      const baki = Math.max(0, 1 - c.umur / GS_BACA);
      c.jam.clear(); c.jam.lineStyle(10, baki > .3 ? 0x60A5FA : 0xF87171, .9); c.jam.beginPath(); c.jam.arc(GS_CX, GS_CY, GS_R + 14, -Math.PI / 2, -Math.PI / 2 + baki * Math.PI * 2); c.jam.strokePath();
      for (let i = 0; i < c.q.opts.length; i++) {
        const di = this.atasPad(GS_PAD[i][0], GS_PAD[i][1]);
        if (di && !c.dalam[i] && c.umur > .4) { this.nilai(i); return; }
        c.dalam[i] = di;
      }
      if (c.umur >= GS_BACA) { this.nilai(-1); return; }
    }
  }
}
const GAMEDEF = {
  nama: 'Gasing Juara', warna: '#FB923C', scene: GasingScene,
  rehat: 'Kutip bintang untuk tenaga, elak kumbang!',
  cara: '<b>← ↑ → ↓</b> gerak gasing · <b>P</b> jeda',
  caraSentuh: 'Sentuh dan tahan pada skrin untuk gerakkan gasing ke arah jari. Kutip bintang untuk tenaga, elak kumbang. Bila soalan muncul, bawa gasing ke papan jawapan betul sebelum masa tamat.'
};
