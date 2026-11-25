'use strict';
/* =================== KERETA API JAWAPAN · LANDASAN KTM ===================
   Kereta api bergerak di atas 4 landasan. Tukar landasan untuk kutip tiket dan elak lembu
   (atau bunyikan hon supaya lembu lari). Bila soalan muncul, 4 stesen muncul di hujung landasan:
   tukar ke landasan stesen yang ada jawapan betul. */
const KR_LANE = [372, 470, 568, 666], KR_PX = 300, KR_V0 = 220, KR_VMAX = 700, KR_ACC = 3, KR_BACA = 6;
class KeretapiScene extends Phaser.Scene {
  constructor() { super('keretapi'); }
  create() {
    TMG.scene = this;
    Object.assign(this, { speed: KR_V0, lane: 1, gate: null, obj: [], deco: [], jarak: 0, nextSpawn: 600, kebal: 0, honCool: 0 });
    this.buatTekstur();
    // langit, bukit & sawah
    this.add.rectangle(640, 160, 1280, 320, 0x93C5FD);
    this.add.circle(180, 120, 46, 0xFEF3C7);
    this.awan = [this.add.ellipse(420, 110, 170, 46, 0xffffff, .9), this.add.ellipse(900, 160, 130, 36, 0xffffff, .85), this.add.ellipse(1180, 90, 110, 30, 0xffffff, .8)];
    const g = this.add.graphics();
    g.fillStyle(0x4B7F52); g.beginPath(); g.moveTo(0, 260);
    for (let x = 0; x <= 1280; x += 40) g.lineTo(x, 230 - 50 * Math.sin(x / 210) - 18 * Math.sin(x / 70)); g.lineTo(1280, 320); g.lineTo(0, 320); g.closePath(); g.fillPath();
    this.decoLayer = this.add.container(0, 0);
    this.add.rectangle(640, 306, 1280, 28, 0x84CC16);
    // tanah landasan
    this.add.rectangle(640, 520, 1280, 400, 0x78716C);
    this.add.rectangle(640, 322, 1280, 6, 0x57534E);
    this.rel = KR_LANE.map(y => this.add.tileSprite(640, y + 22, 1280, 44, 'kr-rel'));
    this.objLayer = this.add.container(0, 0);
    // kereta api: lokomotif + 1 gerabak
    this.kereta = this.add.container(KR_PX, KR_LANE[this.lane]);
    this.kereta.add([this.add.image(-168, 0, 'kr-gerabak'), this.add.image(0, 0, 'kr-lokomotif')]);
    this.time.addEvent({ delay: 260, loop: true, callback: () => this.kepul() });
    for (let x = 60; x < 1400; x += 300) this.tambahDeco(x);
    const k = this.input.keyboard;
    k.on('keydown-UP', () => this.tukar(-1)); k.on('keydown-W', () => this.tukar(-1));
    k.on('keydown-DOWN', () => this.tukar(1)); k.on('keydown-S', () => this.tukar(1));
    k.on('keydown-SPACE', () => this.hon());
    let sy = null, st = 0;
    this.input.on('pointerdown', p => { sy = p.y; st = p.downTime; });
    this.input.on('pointerup', p => { if (sy === null) return; const dy = p.y - sy; if (Math.abs(dy) > 40) this.tukar(dy < 0 ? -1 : 1); else if (p.upTime - st < 300) this.hon(); sy = null; });
    this.jadualSoalan(TMG.SELANG * .6);
  }
  buatTekstur() {
    if (this.textures.exists('kr-rel')) return;
    const g = this.make.graphics({ add: false });
    // landasan: palang kayu + 2 rel
    g.fillStyle(0x5B3A1E); for (let x = 4; x < 80; x += 26) g.fillRect(x, 2, 12, 40);
    g.fillStyle(0xCBD5E1); g.fillRect(0, 8, 80, 5); g.fillRect(0, 31, 80, 5); g.fillStyle(0x64748B); g.fillRect(0, 13, 80, 2); g.fillRect(0, 36, 80, 2);
    g.generateTexture('kr-rel', 78, 44); g.clear();
    // lokomotif KTM (biru, jalur kuning)
    g.fillStyle(0x1D4ED8); g.fillRoundedRect(0, 0, 150, 66, 12); g.fillStyle(0x1E3A8A); g.fillRect(0, 54, 150, 12);
    g.fillStyle(0xFACC15); g.fillRect(0, 36, 150, 8); g.fillTriangle(150, 0, 176, 30, 150, 66);
    g.fillStyle(0x1D4ED8); g.fillTriangle(150, 4, 172, 30, 150, 62);
    g.fillStyle(0xBFDBFE); g.fillRoundedRect(112, 8, 30, 22, 4); g.fillRoundedRect(18, 10, 22, 18, 3); g.fillRoundedRect(50, 10, 22, 18, 3);
    g.fillStyle(0xFEF3C7); g.fillCircle(166, 46, 5);
    g.fillStyle(0x0B1220); [24, 62, 100, 134].forEach(x => g.fillCircle(x, 68, 9)); g.fillStyle(0x94A3B8); [24, 62, 100, 134].forEach(x => g.fillCircle(x, 68, 4));
    g.lineStyle(3, 0x0B1220); g.strokeRoundedRect(1, 1, 148, 64, 12);
    g.generateTexture('kr-lokomotif', 180, 80); g.clear();
    // gerabak
    g.fillStyle(0xE2E8F0); g.fillRoundedRect(0, 4, 160, 60, 10); g.fillStyle(0x1D4ED8); g.fillRect(0, 34, 160, 8);
    g.fillStyle(0x93C5FD); for (let x = 12; x < 150; x += 36) g.fillRoundedRect(x, 12, 26, 16, 3);
    g.fillStyle(0x0B1220); [26, 64, 104, 140].forEach(x => g.fillCircle(x, 68, 8)); g.fillStyle(0x94A3B8); [26, 64, 104, 140].forEach(x => g.fillCircle(x, 68, 3.5));
    g.lineStyle(3, 0x0B1220); g.strokeRoundedRect(1, 5, 158, 58, 10); g.fillStyle(0x334155); g.fillRect(158, 30, 12, 6);
    g.generateTexture('kr-gerabak', 172, 80); g.clear();
    // lembu
    g.fillStyle(0xF5F5F4); g.fillRoundedRect(8, 10, 64, 34, 14); g.fillStyle(0x292524); g.fillCircle(30, 22, 8); g.fillCircle(56, 32, 6);
    g.fillStyle(0xF5F5F4); g.fillRoundedRect(0, 4, 24, 24, 8); g.fillStyle(0xFDA4AF); g.fillRoundedRect(0, 16, 16, 12, 5); g.fillStyle(0x0B1220); g.fillCircle(10, 12, 2.5);
    g.fillStyle(0xA8A29E); g.fillTriangle(4, 4, 8, -2 + 4, 12, 4); g.fillTriangle(16, 4, 20, -2 + 4, 24, 4);
    g.fillStyle(0x57534E); [16, 30, 52, 64].forEach(x => g.fillRect(x, 40, 6, 16));
    g.lineStyle(2.5, 0x0B1220); g.strokeRoundedRect(8, 10, 64, 34, 14);
    g.generateTexture('kr-lembu', 76, 58); g.clear();
    // tiket emas
    g.fillStyle(0xFBBF24); g.fillRoundedRect(0, 0, 44, 28, 5); g.fillStyle(0xB45309); g.fillCircle(0, 14, 5); g.fillCircle(44, 14, 5);
    g.lineStyle(2, 0xB45309); g.lineBetween(30, 4, 30, 24); g.fillStyle(0xFEF3C7); g.fillRect(8, 8, 16, 4); g.fillRect(8, 16, 12, 3);
    g.generateTexture('kr-tiket', 46, 30); g.clear();
    // papan stesen
    g.fillStyle(0x334155); g.fillRect(14, 70, 8, 26); g.fillRect(212, 70, 8, 26);
    g.fillStyle(0x1D4ED8); g.fillRoundedRect(0, 0, 234, 76, 12); g.fillStyle(0xFACC15); g.fillRect(0, 60, 234, 8);
    g.lineStyle(4, 0x0B1220); g.strokeRoundedRect(2, 2, 230, 72, 12);
    g.generateTexture('kr-stesen', 234, 96); g.clear();
    // pokok & rumah stesen kecil (hiasan)
    g.fillStyle(0x78350F); g.fillRect(28, 40, 10, 50); g.fillStyle(0x15803D); g.fillCircle(33, 34, 30); g.fillCircle(14, 46, 18); g.fillCircle(52, 46, 18);
    g.generateTexture('kr-pokok', 70, 92); g.clear();
    g.fillStyle(0xFEF3C7); g.fillRect(8, 30, 104, 46); g.fillStyle(0xB91C1C); g.fillTriangle(0, 32, 60, 0, 120, 32); g.fillStyle(0x7C2D12); g.fillRect(48, 48, 22, 28);
    g.fillStyle(0x93C5FD); g.fillRect(18, 42, 20, 14); g.fillRect(82, 42, 20, 14);
    g.generateTexture('kr-rumah', 120, 78); g.clear();
    g.destroy();
  }
  tambahDeco(x) {
    const r = Math.random() < .35, s = this.add.image(x, r ? 270 : 262, r ? 'kr-rumah' : 'kr-pokok');
    this.decoLayer.add(s); this.deco.push(s);
  }
  kepul() {
    if (TMG.over || !this.kereta) return;
    const c = this.add.circle(this.kereta.x + 60, this.kereta.y - 40, Phaser.Math.Between(8, 13), 0xE2E8F0, .8);
    this.objLayer.add(c);
    this.tweens.add({ targets: c, x: c.x - 120, y: c.y - 50, scale: 2.2, alpha: 0, duration: 900, onComplete: () => c.destroy() });
  }
  tukar(d) {
    if (TMG.over) return; const n = Phaser.Math.Clamp(this.lane + d, 0, 3); if (n === this.lane) return;
    this.lane = n; this.tweens.add({ targets: this.kereta, y: KR_LANE[n], duration: 140, ease: 'Quad.easeOut' });
  }
  hon() {
    if (TMG.over || this.honCool > 0) return; this.honCool = 1.2;
    try { const C = SND.ctx || (SND.ctx = new (window.AudioContext || window.webkitAudioContext)()); const t = C.currentTime;
      [370, 466].forEach(f => { const o = C.createOscillator(), v = C.createGain(); o.type = 'square'; o.frequency.value = f; v.gain.setValueAtTime(.05, t); v.gain.exponentialRampToValueAtTime(.001, t + .45); o.connect(v); v.connect(C.destination); o.start(t); o.stop(t + .5); }); } catch (e) {}
    const t = this.add.text(this.kereta.x + 110, this.kereta.y - 60, 'PON PON!', { fontFamily: '"Space Grotesk", sans-serif', fontSize: '26px', fontStyle: '700', color: '#FACC15', stroke: '#0B1220', strokeThickness: 5 }).setOrigin(.5);
    this.tweens.add({ targets: t, y: t.y - 40, alpha: 0, duration: 600, onComplete: () => t.destroy() });
    // lembu di landasan sendiri yang dekat akan lari
    this.obj.forEach(o => {
      if (o.jenis !== 'lembu' || o.mati || o.lane !== this.lane || o.x < KR_PX || o.x - KR_PX > 520) return;
      o.mati = true; TMG.kutip(5);
      this.tweens.add({ targets: o, y: o.y + (o.lane === 3 ? -60 : 60), alpha: 0, angle: -15, duration: 420, onComplete: () => o.destroy() });
    });
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
    const c = this.add.container(KR_PX + 150 + this.speed * KR_BACA, 0); c.q = q; c.papan = [];
    q.opts.forEach((o, i) => {
      const p = this.add.image(0, KR_LANE[i] - 10, 'kr-stesen');
      const t = this.add.text(0, KR_LANE[i] - 22, o, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '32px', fontStyle: '700', color: '#FFFFFF' }).setOrigin(.5);
      if (t.width > 210) t.setScale(210 / t.width);
      c.add([p, t]); c.papan.push(p);
    });
    this.objLayer.add(c); this.gate = c;
  }
  nilai() {
    const c = this.gate; this.gate = null;
    const ok = this.lane === c.q.c, x = c.x, y = KR_LANE[this.lane], sebelum = TMG.skor;
    const end = ok ? TMG.betul() : TMG.salah();
    c.list.forEach(o => this.tweens.add({ targets: o, alpha: 0, duration: 260 }));
    this.time.delayedCall(320, () => c.destroy());
    this.letup(x, y - 20, ok ? 0x34D399 : 0xF87171);
    if (ok) this.timbul('+' + (TMG.skor - sebelum), y);
    else this.cameras.main.shake(220, .006);
    if (!end) { this.time.delayedCall(900, () => { if (!TMG.over && !this.gate) TMG.rehat(); }); this.jadualSoalan(TMG.SELANG); }
  }
  timbul(txt, y) {
    const t = this.add.text(KR_PX + 60, y - 70, txt, { fontFamily: '"Space Grotesk", sans-serif', fontSize: '40px', fontStyle: '700', color: '#34D399', stroke: '#0B1220', strokeThickness: 6 }).setOrigin(.5);
    this.tweens.add({ targets: t, y: y - 130, alpha: 0, duration: 700, ease: 'Quad.easeOut', onComplete: () => t.destroy() });
  }
  letup(x, y, col) {
    for (let i = 0; i < 14; i++) {
      const d = this.add.circle(x, y, Phaser.Math.Between(5, 10), col), a = Math.random() * Math.PI * 2, r = Phaser.Math.Between(60, 140);
      this.tweens.add({ targets: d, x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, alpha: 0, scale: .3, duration: 520, ease: 'Quad.easeOut', onComplete: () => d.destroy() });
    }
  }
  /* ---------- tiket & lembu ---------- */
  spawn() {
    const X = 1360;
    if (this.gate && Math.abs(this.gate.x - X) < 460) return;
    const tahap = Math.min(1, (this.speed - KR_V0) / (KR_VMAX - KR_V0));
    if (Math.random() < .45 - tahap * .15) {
      const ln = Phaser.Math.Between(0, 3), n = Phaser.Math.Between(3, 5);
      for (let i = 0; i < n; i++) this.tambahObj('kr-tiket', X + i * 64, ln, 'tiket');
      return;
    }
    const nb = Math.random() < tahap * .7 ? 2 : 1, lanes = Phaser.Utils.Array.Shuffle([0, 1, 2, 3]).slice(0, nb);
    lanes.forEach(ln => this.tambahObj('kr-lembu', X, ln, 'lembu'));
    const bebas = [0, 1, 2, 3].filter(l => !lanes.includes(l));
    if (bebas.length && Math.random() < .5) this.tambahObj('kr-tiket', X, Phaser.Utils.Array.GetRandom(bebas), 'tiket');
  }
  tambahObj(tex, x, ln, jenis) {
    const o = this.add.image(x, KR_LANE[ln] + (jenis === 'lembu' ? -4 : 0), tex); o.lane = ln; o.jenis = jenis; o.mati = false;
    if (jenis === 'tiket') this.tweens.add({ targets: o, y: o.y - 8, duration: 380, yoyo: true, repeat: -1 });
    this.objLayer.add(o); this.obj.push(o);
  }
  update(t, dtms) {
    if (TMG.over) return;
    const dt = Math.min(dtms, 50) / 1000;
    this.speed = Math.min(KR_VMAX, this.speed + KR_ACC * dt);
    const v = this.speed * dt;
    this.jarak += v; this.kebal = Math.max(0, this.kebal - dt); this.honCool = Math.max(0, this.honCool - dt);
    this.rel.forEach(r => r.tilePositionX += v);
    this.awan.forEach(a => { a.x -= v * .06; if (a.x < -120) a.x = 1400; });
    this.deco.forEach(s => { s.x -= v * .3; });
    if (this.deco.length && this.deco[0].x < -100) { this.deco.shift().destroy(); this.tambahDeco(this.deco[this.deco.length - 1].x + Phaser.Math.Between(240, 360)); }
    if (this.jarak >= this.nextSpawn) { this.spawn(); this.nextSpawn = this.jarak + Phaser.Math.Between(320, 500); }
    if (this.gate) { this.gate.x -= v; if (this.gate.x <= KR_PX + 150) this.nilai(); }
    for (const o of this.obj) {
      o.x -= v;
      if (o.mati || o.lane !== this.lane || o.x - KR_PX > 100 || o.x - KR_PX < -60) continue;
      if (o.jenis === 'tiket') { o.mati = true; TMG.kutip(10); this.tweens.add({ targets: o, y: o.y - 60, alpha: 0, duration: 250, onComplete: () => o.destroy() }); }
      else if (!this.kebal) {
        o.mati = true; this.kebal = 1; this.cameras.main.shake(200, .008);
        this.tweens.add({ targets: o, y: o.y - 70, angle: 60, alpha: 0, duration: 380, onComplete: () => o.destroy() });
        this.tweens.add({ targets: this.kereta, alpha: .35, duration: 90, yoyo: true, repeat: 4 });
        if (TMG.cedera()) return;
      }
    }
    this.obj = this.obj.filter(o => { if (!o.active) return false; if (o.x < -100) { o.destroy(); return false; } return true; });
  }
}
const GAMEDEF = {
  nama: 'Kereta Api Jawapan', warna: '#60A5FA', scene: KeretapiScene,
  rehat: 'Kutip tiket, elak lembu! Bunyikan hon supaya lembu lari.',
  cara: '<b>↑ ↓</b> tukar landasan · <b>Ruang</b> hon · <b>P</b> jeda',
  caraSentuh: 'Tekan <b>↑ ↓</b> (atau leret) untuk tukar landasan, <b>HON</b> supaya lembu lari. Kutip tiket. Bila soalan muncul, masuk landasan stesen jawapan betul.',
  sentuh(el) {
    el.innerHTML = '<button id="sH" aria-label="Hon" style="left:1.4cqw;bottom:23cqw;width:8cqw;height:8cqw;font-size:1.4cqw;border-color:#60A5FA;background:#60A5FA99;color:#0B1220">HON</button>'
      + '<button id="sU" aria-label="Landasan atas" style="left:1.4cqw;bottom:12.5cqw;width:8cqw;height:8cqw;font-size:3cqw">↑</button>'
      + '<button id="sD" aria-label="Landasan bawah" style="left:1.4cqw;bottom:2cqw;width:8cqw;height:8cqw;font-size:3cqw">↓</button>';
    const on = (id, f) => el.querySelector(id).addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (TMG.scene && TMG.scene.scene.isActive()) f(); });
    on('#sU', () => TMG.scene.tukar(-1)); on('#sD', () => TMG.scene.tukar(1)); on('#sH', () => TMG.scene.hon());
  }
};
