/* ===== ISOMOVE – bunyi & kesan bintang =====
   Bunyi dijana terus oleh pelayar (Web Audio), jadi tiada fail audio dan berfungsi tanpa internet.
   Guna:  FX.play('betul' | 'salah' | 'ketik' | 'langkah' | 'menang' | 'detik' | 'tamat')
          FX.stars(elemen atau {x, y}, bilangan)   – bintang naik dari satu titik
          FX.celebrate()                           – hujan bintang besar (skrin keputusan)
          FX.button()                              – HTML butang 🔊 tutup/buka bunyi
          FX.watchSim('status', elemenSasaran)     – bunyi automatik untuk halaman simulasi */
(function () {
  'use strict';
  const KEY = 'isomove.sound';
  let on = true;
  try { on = localStorage.getItem(KEY) !== '0'; } catch (e) { /* abaikan */ }

  /* ---------- Audio ---------- */
  let ctx = null, master = null;
  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.55;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  // iPhone hanya benarkan bunyi selepas sentuhan pertama
  function unlock() {
    const c = audio();
    if (c) {
      const b = c.createBuffer(1, 1, 22050), s = c.createBufferSource();
      s.buffer = b; s.connect(master); s.start(0);
    }
    ['pointerdown', 'touchend', 'keydown'].forEach((ev) => document.removeEventListener(ev, unlock, true));
  }
  ['pointerdown', 'touchend', 'keydown'].forEach((ev) => document.addEventListener(ev, unlock, true));

  // satu nada: frekuensi mula→akhir, masa mula (s), tempoh (s), jenis gelombang, kekuatan
  function tone(f1, f2, at, dur, type, vol) {
    const c = ctx, t = c.currentTime + at;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f1, t);
    if (f2 && f2 !== f1) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.3, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  const SOUNDS = {
    ketik: () => tone(1200, 900, 0, 0.05, 'sine', 0.12),
    langkah: () => { tone(520, 780, 0, 0.12, 'triangle', 0.22); },
    detik: () => tone(1500, 1500, 0, 0.06, 'square', 0.06),
    betul: () => { tone(784, 784, 0, 0.14, 'triangle', 0.3); tone(1175, 1175, 0.1, 0.32, 'triangle', 0.3); tone(2350, 2350, 0.1, 0.25, 'sine', 0.06); },
    salah: () => { tone(240, 170, 0, 0.22, 'sawtooth', 0.09); tone(200, 140, 0.16, 0.3, 'sawtooth', 0.09); },
    tamat: () => { tone(330, 330, 0, 0.18, 'triangle', 0.22); tone(262, 262, 0.18, 0.4, 'triangle', 0.22); },
    menang: () => {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, f, i * 0.11, 0.3, 'triangle', 0.26));
      tone(1319, 1319, 0.48, 0.6, 'triangle', 0.24);
      [2093, 2637, 3136].forEach((f, i) => tone(f, f, 0.5 + i * 0.07, 0.25, 'sine', 0.05));
    }
  };
  function play(name) {
    if (!on || !SOUNDS[name]) return;
    if (!audio()) return;
    try { SOUNDS[name](); } catch (e) { /* abaikan */ }
  }

  /* ---------- Bintang ---------- */
  const reduce = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STAR = '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z" fill="currentColor"/></svg>';
  const COLORS = ['#FBBF24', '#FDE68A', '#F59E0B', '#FCD34D', '#FFFFFF'];
  function layer() {
    let l = document.getElementById('fx-layer');
    if (!l) {
      l = document.createElement('div');
      l.id = 'fx-layer';
      l.setAttribute('aria-hidden', 'true');
      document.body.appendChild(l);
    }
    return l;
  }
  function point(src) {
    if (src && src.getBoundingClientRect) {
      const r = src.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return src || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }
  function star(x, y, size, dx, dy, rot, dur, delay) {
    const el = document.createElement('span');
    el.className = 'fx-star';
    el.innerHTML = STAR;
    el.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;color:${COLORS[Math.floor(Math.random() * COLORS.length)]}`;
    layer().appendChild(el);
    if (!el.animate) { setTimeout(() => el.remove(), 800); return; }
    const a = el.animate([
      { transform: 'translate(0,0) scale(.2) rotate(0deg)', opacity: 0 },
      { transform: `translate(${dx * 0.35}px,${dy * 0.35}px) scale(1.15) rotate(${rot * 0.4}deg)`, opacity: 1, offset: 0.25 },
      { transform: `translate(${dx}px,${dy}px) scale(.6) rotate(${rot}deg)`, opacity: 0 }
    ], { duration: dur, delay, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' });
    a.onfinish = () => el.remove();
  }
  // bintang naik dari satu titik (jawapan betul)
  function stars(src, n) {
    const p = point(src), count = reduce() ? 3 : (n || 12);
    for (let i = 0; i < count; i++) {
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
      const dist = 70 + Math.random() * 110;
      star(p.x, p.y, 14 + Math.random() * 16, Math.cos(ang) * dist, Math.sin(ang) * dist - 40, (Math.random() - 0.5) * 360, 900 + Math.random() * 500, i * 18);
    }
  }
  // hujan bintang naik dari bawah skrin (keputusan / simulasi selesai)
  function celebrate(n) {
    const count = reduce() ? 6 : (n || 36), W = window.innerWidth, H = window.innerHeight;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * W;
      star(x, H + 10, 16 + Math.random() * 22, (Math.random() - 0.5) * 120, -(H * 0.45 + Math.random() * H * 0.45), (Math.random() - 0.5) * 540, 1500 + Math.random() * 900, Math.random() * 600);
    }
  }
  // kesan "lompat" kecil pada elemen (contoh: kiraan bintang)
  function bump(el) {
    if (!el || !el.animate) return;
    el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'ease-out' });
  }
  function shake(el) {
    if (!el || !el.animate || reduce()) return;
    el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }], { duration: 360, easing: 'ease-out' });
  }

  /* ---------- Butang bunyi ---------- */
  const ICON_ON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  const ICON_OFF = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6"/><path d="M22 9l-5 6"/></svg>';
  const label = () => on ? 'Bunyi hidup – tekan untuk senyapkan' : 'Bunyi senyap – tekan untuk hidupkan';
  function button(extra) {
    return `<button type="button" class="snd-btn${on ? '' : ' off'}${extra ? ' ' + extra : ''}" data-sound aria-pressed="${on}" aria-label="${label()}" title="${label()}">${on ? ICON_ON : ICON_OFF}</button>`;
  }
  function refresh() {
    document.querySelectorAll('[data-sound]').forEach((b) => {
      b.classList.toggle('off', !on);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', label());
      b.title = label();
      b.innerHTML = on ? ICON_ON : ICON_OFF;
    });
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-sound]');
    if (!b) return;
    on = !on;
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (err) { /* abaikan */ }
    refresh();
    play('ketik');
  });

  /* ---------- Simulasi: bunyi ikut teks status ---------- */
  function watchSim(statusId, target) {
    const st = document.getElementById(statusId);
    if (!st) return;
    let last = st.textContent;
    new MutationObserver(() => {
      const now = st.textContent;
      if (now === last) return;
      last = now;
      if (now === 'Selesai') {
        play('menang');
        stars(target || st, 16);
        setTimeout(() => celebrate(22), 150);
      } else if (now !== 'Sedia' && !/tidak|Masukkan|Kawasan/.test(now)) {
        play('langkah');
      }
    }).observe(st, { childList: true, characterData: true, subtree: true });
    // ketikan lembut untuk butang kawalan
    document.addEventListener('click', (e) => {
      const b = e.target.closest('button, select');
      if (b && !b.matches('[data-sound]')) play('ketik');
    });
  }

  /* ---------- Kunci zoom (rasa seperti app) ---------- */
  // iPhone abaikan "user-scalable=no", jadi halang gerak isyarat cubit di sini
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((ev) => document.addEventListener(ev, (e) => e.preventDefault(), { passive: false }));
  document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  // ketik dua kali untuk zoom sudah dihalang oleh touch-action: manipulation

  /* ---------- Gaya ---------- */
  const css = document.createElement('style');
  css.textContent =
    'html{touch-action:manipulation;-webkit-text-size-adjust:100%;overscroll-behavior:none}body{overscroll-behavior:none}' +
    '#fx-layer{position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden}' +
    '.fx-star{position:absolute;display:block;filter:drop-shadow(0 0 6px rgba(251,191,36,.7));will-change:transform,opacity}' +
    '.snd-btn{flex:none;display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;min-height:44px;padding:0;border-radius:14px;background:var(--surface,#131C2E);border:1px solid var(--border,#22304A);color:var(--text,#E6EDF7);cursor:pointer;touch-action:manipulation}' +
    '.snd-btn svg{width:20px;height:20px;flex:none}' +
    '.snd-btn.off{color:var(--muted,#8A9BB5)}' +
    '.snd-btn:hover{border-color:var(--muted,#8A9BB5)}';
  document.head.appendChild(css);

  window.FX = { play, stars, celebrate, bump, shake, button, watchSim, get on() { return on; } };
})();
