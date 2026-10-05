(() => {
'use strict';
const $ = s => document.querySelector(s);

/* ---------- Navigation, reveal, scroll progress ---------- */
const menuButton = $('.menu-toggle'), nav = $('.nav-links');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}
const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const ob = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); ob.unobserve(e.target); }
  }), { threshold: .06 });
  reveals.forEach(el => ob.observe(el));
} else reveals.forEach(el => el.classList.add('visible'));

const progress = $('.scroll-progress');
if (progress) addEventListener('scroll', () => {
  const m = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (m ? scrollY / m * 100 : 0) + '%';
}, { passive: true });

/* ---------- Click-to-enlarge images ---------- */
const lb = $('#image-lightbox');
if (lb) {
  const full = lb.querySelector('.lightbox-image'), cap = lb.querySelector('.lightbox-caption'), close = lb.querySelector('.lightbox-close');
  document.querySelectorAll('.photo img').forEach(img => {
    img.tabIndex = 0; img.setAttribute('role', 'button');
    const open = () => {
      full.src = img.src; full.alt = img.alt;
      cap.textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || img.alt;
      lb.hidden = false; document.body.classList.add('lightbox-open'); close.focus();
    };
    img.addEventListener('click', open);
    img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  const shut = () => { lb.hidden = true; full.src = ''; document.body.classList.remove('lightbox-open'); };
  close.addEventListener('click', shut);
  lb.addEventListener('click', e => { if (e.target === lb) shut(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) shut(); });
}

/* ---------- Pause / resume button ---------- */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let stored = null; try { stored = localStorage.getItem('space-paused'); } catch (e) {}
let paused = stored === null ? reduced : stored === '1';
const tog = document.createElement('button');
tog.type = 'button'; tog.className = 'motion-toggle';
const label = () => { tog.textContent = paused ? '▶ RESUME SPACE' : '❚❚ PAUSE SPACE'; tog.setAttribute('aria-pressed', String(paused)); };
label(); document.body.appendChild(tog);
const toast = msg => { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2700); };

/* ---------- 8-bit live space wallpaper ---------- */
const cv = document.createElement('canvas');
cv.id = 'space-canvas'; cv.setAttribute('aria-hidden', 'true');
document.body.prepend(cv);
const g = cv.getContext('2d', { alpha: false });

const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgb = c => `rgb(${c[0]},${c[1]},${c[2]})`;
const BAYER = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v => (v + .5) / 16);
const dith = (x, y) => BAYER[((y & 3) * 4) + (x & 3)];
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
function hash(x, y, s) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, s) { let t = 0, a = .5, f = 1; for (let i = 0; i < 4; i++) { t += a * vnoise(x * f, y * f, s + i * 17); f *= 2; a *= .5; } return t; }

const VOID = hex('#04030c');
const NEB_V = ['#04030c','#0a0720','#120a34','#1d0e4c','#2c1266','#43177c'].map(hex);
const NEB_B = ['#04030c','#061026','#0a1a3e','#0e2a5a','#143e78','#1d5a94'].map(hex);
const NEB_P = ['#04030c','#140618','#240a2a','#3a0e3e','#561455','#781c6a'].map(hex);
const P_A  = ['#120a2c','#2b1660','#4f2a9a','#7f4fd2','#b98cf5'].map(hex);
const P_B  = ['#0a1830','#123f6c','#1f6fa6','#3fb0d8','#9ae9ff'].map(hex);
const P_S  = ['#3a1208','#7a2a10','#c45420','#f08a3c','#ffc078'].map(hex);
const RING = ['#2a1d0c','#5a4018','#9a7230','#d6a84c','#ffe08a'].map(hex);
const MOON = ['#1c1a2e','#3c3954','#67637f','#9b97b6','#d4d0ea'].map(hex);
const STAR_COLORS = ['#ffffff','#ffffff','#cfe8ff','#59f3ff','#ffd166','#ff9fd0','#b9a0ff'];

let W = 0, H = 0, PX = 4, neb = null, nebW = 0, stars = [], rocks = [], shooters = [];
let ship = null, nextShip = 6, sat = null, pBuf = null, pCtx = null, pImg = null, R = 30;
let warp = 0, lastFrame = 0, time = 0, running = false;

function buildNebula() {
  nebW = W * 2;
  neb = document.createElement('canvas'); neb.width = nebW; neb.height = H;
  const c = neb.getContext('2d'), img = c.createImageData(nebW, H), d = img.data;
  const wrap = (fn, x, y) => { const s = x / nebW; return fn(x, y) * (1 - s) + fn(x - nebW, y) * s; };
  const fV = (x, y) => fbm(x / 46, y / 46, 11) * (.35 + .9 * fbm(x / 140, y / 140, 3));
  const fB = (x, y) => fbm(x / 52 + 40, y / 52, 23) * (.35 + .9 * fbm(x / 150 + 9, y / 150, 5));
  const fP = (x, y) => fbm(x / 30 + 90, y / 30, 37) * (.2 + .9 * fbm(x / 120 + 30, y / 120, 8));
  for (let y = 0; y < H; y++) for (let x = 0; x < nebW; x++) {
    const v = wrap(fV, x, y), b = wrap(fB, x, y), p = wrap(fP, x, y), th = dith(x, y);
    const lv = clamp(Math.floor((v - .36) * 16 + th), 0, 5);
    const lb2 = clamp(Math.floor((b - .38) * 16 + th), 0, 5);
    const lp = clamp(Math.floor((p - .44) * 18 + th), 0, 5);
    let col = VOID;
    if (lv >= lb2 && lv >= lp && lv > 0) col = NEB_V[lv];
    else if (lb2 >= lp && lb2 > 0) col = NEB_B[lb2];
    else if (lp > 0) col = NEB_P[lp];
    const i = (y * nebW + x) * 4;
    d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
  }
  c.putImageData(img, 0, 0);
}

function buildStars() {
  stars = [];
  const n = Math.floor(W * H / 55);
  for (let i = 0; i < n; i++) {
    const layer = Math.random() < .6 ? 0 : Math.random() < .7 ? 1 : 2;
    stars.push({ x: Math.random() * W, y: Math.random() * H, l: layer,
      c: STAR_COLORS[Math.random() * STAR_COLORS.length | 0],
      ph: Math.random() * 6.28, tw: .5 + Math.random() * 2, big: layer === 2 && Math.random() < .35 });
  }
}

function buildRocks() {
  rocks = [];
  const n = Math.max(4, Math.floor(W / 90));
  for (let i = 0; i < n; i++) {
    const r = 2 + Math.random() * 4 | 0, m = document.createElement('canvas');
    m.width = m.height = r * 2 + 2;
    const c = m.getContext('2d');
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
      const dd = Math.hypot(x, y) + vnoise(x * .7 + i * 9, y * .7, 4) * 1.6 - .6;
      if (dd <= r) {
        const shade = clamp(Math.floor((-(x + y) / (r * 2) + .5) * 4 + dith(x & 3, y & 3) * .8), 0, 4);
        c.fillStyle = rgb(MOON[shade]); c.fillRect(x + r + 1, y + r + 1, 1, 1);
      }
    }
    rocks.push({ img: m, x: Math.random() * W, y: Math.random() * H, vx: -(.05 + Math.random() * .12), vy: (Math.random() - .5) * .03 });
  }
}

function buildPlanet() {
  R = clamp(Math.round(Math.min(W, H) * (W < 200 ? .13 : .17)), 14, 64);
  pBuf = document.createElement('canvas');
  pBuf.width = Math.ceil(R * 4.2); pBuf.height = Math.ceil(R * 2.6);
  pCtx = pBuf.getContext('2d'); pImg = pCtx.createImageData(pBuf.width, pBuf.height);
}

function renderPlanet(rot) {
  const pw = pBuf.width, ph = pBuf.height, d = pImg.data;
  d.fill(0);
  const cx = pw / 2 | 0, cy = ph / 2 | 0, a = R * 1.95, b = R * .42, L = [-.58, -.48, .66];
  const put = (x, y, c) => { const i = (y * pw + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255; };
  const ringPass = front => {
    for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
      const dx = x - cx, dy = y - cy, ex = dx / a, ey = (dy - dx * .16) / b, rr = Math.sqrt(ex * ex + ey * ey);
      if (rr < .66 || rr > 1 || (ey > 0) !== front) continue;
      if (!front && dx * dx + dy * dy <= R * R) continue;
      if (rr > .8 && rr < .84) continue; // ring gap
      let lvl = (rr < .74 ? 2.6 : rr < .8 ? 3.6 : rr < .92 ? 2.8 : 1.8) + (dx < 0 ? .6 : -.4);
      if (front && dx > R * .2 && Math.abs(dy) < R * .55 && dx < R * 1.3) lvl -= 2; // planet shadow on ring
      put(x, y, RING[clamp(Math.floor(lvl + dith(x, y) - .5), 0, 4)]);
    }
  };
  ringPass(false);
  for (let y = -R - 6; y <= R + 6; y++) for (let x = -R - 6; x <= R + 6; x++) {
    const px = cx + x, py = cy + y;
    if (px < 0 || py < 0 || px >= pw || py >= ph) continue;
    const r2 = (x * x + y * y) / (R * R);
    if (r2 > 1) { // atmosphere glow
      const r = Math.sqrt(r2);
      if (r < 1.14 && dith(px, py) < (1.14 - r) / .14 * .75 && d[(py * pw + px) * 4 + 3] === 0) put(px, py, hex('#2a1a6a'));
      continue;
    }
    const nx = x / R, ny = y / R, nz = Math.sqrt(1 - r2);
    const li = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
    const lon = Math.atan2(nx, nz) + rot, lat = ny;
    const band = Math.sin(lat * 10 + vnoise(lon * 1.4 + 20, lat * 4, 5) * 3.2);
    let ramp = band > .15 ? P_B : P_A;
    const sd = Math.hypot((((lon % 6.283) + 6.283) % 6.283) - 3.1, (lat - .32) * 2.4);
    if (sd < .42) ramp = P_S; // storm spot
    if (li < .06) { put(px, py, hex('#07051a')); continue; }
    put(px, py, ramp[clamp(Math.floor(li * 4.7 + dith(px, py) - .5), 0, 4)]);
  }
  ringPass(true);
  pCtx.putImageData(pImg, 0, 0);
}

function drawMoon(mx, my, rm) {
  for (let y = -rm; y <= rm; y++) for (let x = -rm; x <= rm; x++) {
    if (x * x + y * y > rm * rm) continue;
    const nx = x / rm, ny = y / rm, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    let li = Math.max(0, -.6 * nx - .4 * ny + .7 * nz);
    if (hash(x + 40, y + 40, 7) > .86) li *= .55; // craters
    g.fillStyle = rgb(MOON[clamp(Math.floor(li * 4.6 + dith(x & 3, y & 3) - .5), 0, 4)]);
    g.fillRect(Math.round(mx + x), Math.round(my + y), 1, 1);
  }
}

const SHIP = ["....aa.......","...abba......","..abbbbaa....","cccbbddbbbaa.","eccbbddbbbbbf","cccbbddbbbaa.","..abbbbaa....","...abba......","....aa......."];
const SAT  = ["....r....","pp.ggg.pp","pp.gwg.pp","ppxgggxpp","pp.gwg.pp","pp.ggg.pp"];
function sprite(rows, x, y, map) {
  for (let r = 0; r < rows.length; r++) for (let c = 0; c < rows[r].length; c++) {
    const col = map[rows[r][c]]; if (!col) continue;
    g.fillStyle = col; g.fillRect(Math.round(x) + c, Math.round(y) + r, 1, 1);
  }
}

function resize() {
  PX = innerWidth < 640 ? 3 : 4;
  W = Math.ceil(innerWidth / PX); H = Math.ceil(innerHeight / PX);
  cv.width = W; cv.height = H;
  buildNebula(); buildStars(); buildRocks(); buildPlanet();
  sat = { x: W * .15, y: H * .22, blink: 0 };
  draw(16);
}

function draw(dt) {
  if (!paused) time += dt / 1000;
  const sy = scrollY / PX, speed = 1 + warp * 14;

  // nebula (seamless drift)
  const off = Math.floor(((time * 1.2 + sy * .05) % nebW + nebW) % nebW);
  g.drawImage(neb, -off, 0); g.drawImage(neb, nebW - off, 0);

  // parallax stars
  const par = [.08, .18, .34], drift = [.6, 1.3, 2.4];
  for (const s of stars) {
    const x = ((s.x - time * drift[s.l] * speed) % W + W) % W;
    const y = ((s.y - sy * par[s.l]) % H + H) % H;
    const tw = .5 + .5 * Math.sin(time * s.tw * 2 + s.ph);
    g.fillStyle = s.c;
    if (warp > .05) { g.globalAlpha = .8; g.fillRect(x | 0, y | 0, Math.max(1, warp * (s.l + 1) * 10) | 0, 1); g.globalAlpha = 1; continue; }
    if (tw < .25 && s.l === 0) continue;
    g.fillRect(x | 0, y | 0, 1, 1);
    if (s.big && tw > .7) {
      g.globalAlpha = .6;
      g.fillRect((x | 0) - 1, y | 0, 1, 1); g.fillRect((x | 0) + 1, y | 0, 1, 1);
      g.fillRect(x | 0, (y | 0) - 1, 1, 1); g.fillRect(x | 0, (y | 0) + 1, 1, 1);
      if (tw > .92) { g.fillRect((x | 0) - 2, y | 0, 1, 1); g.fillRect((x | 0) + 2, y | 0, 1, 1); g.fillRect(x | 0, (y | 0) - 2, 1, 1); g.fillRect(x | 0, (y | 0) + 2, 1, 1); }
      g.globalAlpha = 1;
    }
  }

  // asteroids
  for (const r of rocks) {
    if (!paused) { r.x += r.vx * speed * dt / 33; r.y += r.vy * dt / 33; }
    if (r.x < -12) r.x = W + 10; if (r.y < -12) r.y = H + 10; if (r.y > H + 12) r.y = -10;
    g.drawImage(r.img, Math.round(r.x), Math.round(((r.y - sy * .22) % H + H) % H));
  }

  // CubeSat sprite
  if (!paused) { sat.x += .05 * dt / 33; if (sat.x > W + 12) sat.x = -12; }
  sat.blink += dt;
  sprite(SAT, sat.x, ((sat.y - sy * .28) % H + H) % H + Math.sin(time * .8) * 2, {
    r: (sat.blink % 1400) < 300 ? '#ff4d6d' : '#3a1020',
    p: (Math.floor(time * 2) % 2) ? '#2a5bd8' : '#3a6ef0', g: '#c9c9dc', w: '#ffd166', x: '#8a88a8' });

  // planet + orbiting moon
  const pcx = W * (W < 220 ? .78 : .8), pcy = H * (W < 220 ? .2 : .3) - sy * .12;
  const ma = time * .22, mx = pcx + Math.cos(ma) * R * 2.55, my = pcy + Math.sin(ma) * R * .6 - R * .1;
  const rm = Math.max(3, Math.round(R * .2)), behind = Math.sin(ma) < 0;
  if (behind) drawMoon(mx, my, rm);
  renderPlanet(time * .12);
  g.drawImage(pBuf, Math.round(pcx - pBuf.width / 2), Math.round(pcy - pBuf.height / 2));
  if (!behind) drawMoon(mx, my, rm);

  // shooting stars
  if (!paused && Math.random() < .012 * (dt / 33))
    shooters.push({ x: Math.random() * W * .8 + W * .1, y: Math.random() * H * .4, vx: -(2.2 + Math.random() * 1.6), vy: 1.1 + Math.random() * .8, life: 1 });
  shooters = shooters.filter(s => s.life > 0);
  for (const s of shooters) {
    if (!paused) { s.x += s.vx * dt / 33; s.y += s.vy * dt / 33; s.life -= .022 * dt / 33; }
    for (let i = 0; i < 14; i++) {
      g.globalAlpha = Math.max(0, s.life * (1 - i / 14));
      g.fillStyle = i < 2 ? '#ffffff' : i < 6 ? '#59f3ff' : '#9b6bff';
      g.fillRect(Math.round(s.x - s.vx * i * .5), Math.round(s.y - s.vy * i * .5), 1, 1);
    }
    g.globalAlpha = 1;
  }

  // spaceship flyby
  if (!ship && time > nextShip) { ship = { x: -16, y: H * (.35 + Math.random() * .45), v: .55 + Math.random() * .35, ph: Math.random() * 6 }; nextShip = time + 14 + Math.random() * 16; }
  if (ship) {
    if (!paused) ship.x += ship.v * speed * dt / 33;
    const fl = Math.floor(time * 12) % 2;
    sprite(SHIP, ship.x, ship.y + Math.sin(time * 2 + ship.ph) * 2, {
      a: '#3b3f6e', b: '#c9d2ff', d: '#59f3ff', c: fl ? '#ff5fa8' : '#ffd166', e: fl ? '#ffd166' : '#ffffff', f: '#9b6bff' });
    if (ship.x > W + 16) ship = null;
  }
  if (warp > 0 && !paused) warp = Math.max(0, warp - dt / 2600);
}

function loop(now) {
  if (!running) return;
  if (now - lastFrame >= 33) { const dt = lastFrame ? Math.min(80, now - lastFrame) : 33; lastFrame = now; draw(dt); }
  requestAnimationFrame(loop);
}
function start() { if (running) return; running = true; lastFrame = 0; requestAnimationFrame(loop); }
function stop() { running = false; draw(0); }

let rt;
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 160); });
addEventListener('scroll', () => { if (!running) draw(0); }, { passive: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) running = false; else if (!paused) start(); });
tog.addEventListener('click', () => {
  paused = !paused;
  try { localStorage.setItem('space-paused', paused ? '1' : '0'); } catch (e) {}
  label(); paused ? stop() : start();
});
resize();
if (!paused) start();

/* ---------- Easter egg: Konami code = warp drive ---------- */
const code = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
let ci = 0;
addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  ci = k === code[ci] ? ci + 1 : (k === code[0] ? 1 : 0);
  if (ci === code.length) {
    ci = 0; warp = 1; toast('WARP DRIVE ENGAGED');
    if (paused) { paused = false; label(); start(); }
  }
});

/* ---------- Cursor spark trail ---------- */
if (!reduced) {
  const sp = document.createElement('canvas');
  sp.id = 'spark-canvas'; sp.setAttribute('aria-hidden', 'true');
  document.body.appendChild(sp);
  const sc = sp.getContext('2d');
  let sw = 0, sh = 0, parts = [], lx = null, ly = null, live = false;
  const COL = ['#59f3ff','#59f3ff','#ff5fa8','#ffd166','#ffffff','#9b6bff'];
  const sres = () => {
    const d = Math.min(devicePixelRatio || 1, 2);
    sw = innerWidth; sh = innerHeight;
    sp.width = sw * d; sp.height = sh * d; sp.style.width = sw + 'px'; sp.style.height = sh + 'px';
    sc.setTransform(d, 0, 0, d, 0, 0);
  };
  sres(); addEventListener('resize', sres);
  const kick = () => { if (!live) { live = true; requestAnimationFrame(step); } };
  const emit = (x, y, n, pow, size) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, v = Math.random() * pow + .2;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - .3, life: 1, decay: .02 + Math.random() * .025, s: size * (.6 + Math.random() * .8), c: COL[Math.random() * COL.length | 0] });
    }
    if (parts.length > 600) parts.splice(0, parts.length - 600);
    kick();
  };
  function step() {
    sc.clearRect(0, 0, sw, sh);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += .06; p.life -= p.decay;
      if (p.life <= 0) continue;
      const s = Math.max(1, Math.round(p.s * p.life));
      sc.globalAlpha = p.life; sc.fillStyle = p.c; sc.shadowColor = p.c; sc.shadowBlur = 8;
      sc.fillRect(Math.round(p.x), Math.round(p.y), s, s);
    }
    sc.globalAlpha = 1; sc.shadowBlur = 0;
    parts = parts.filter(p => p.life > 0);
    if (parts.length) requestAnimationFrame(step); else { live = false; sc.clearRect(0, 0, sw, sh); }
  }
  const move = (x, y) => {
    if (lx !== null) {
      const dist = Math.hypot(x - lx, y - ly), n = Math.min(10, Math.ceil(dist / 10));
      for (let i = 1; i <= n; i++) emit(lx + (x - lx) * i / n, ly + (y - ly) * i / n, 2, .9, 3.2);
    }
    lx = x; ly = y;
  };
  document.addEventListener('mousemove', e => move(e.clientX, e.clientY), { passive: true });
  document.documentElement.addEventListener('mouseleave', () => { lx = null; });
  document.addEventListener('pointerdown', e => emit(e.clientX, e.clientY, 34, 5.5, 4.5), { passive: true });
}
})();
