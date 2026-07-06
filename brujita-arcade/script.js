/* ============================================================
   BRUJITA EXPRESS — Arcade Game
   Vanilla JS + Canvas
============================================================ */

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width, H = canvas.height;

const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('start-btn');
const storyText = document.getElementById('story-text');
const muteBtn = document.getElementById('mute');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');
const objectiveEl = document.getElementById('objective');
const comboEl = document.getElementById('combo');

// ---------- AUDIO ----------
const audioBase = 'audio/';
const audio = {
  bgm: ['bgm_main.mp3','bgm_level2.mp3','bgm_level3.mp3','bgm_boss.mp3'],
  menu: 'bgm_menu.mp3',
  victory: 'bgm_victory.mp3',
  gameover: 'bgm_gameover.mp3',
  narration: ['narration_intro.mp3','narration_level1.mp3','narration_level2.mp3','narration_level3.mp3','narration_level4.mp3'],
  sfx: {
    broom: 'sfx_broom.mp3',
    potion: 'sfx_potion.mp3',
    combo: 'sfx_combo.mp3',
    hit: 'sfx_hit.mp3',
    shoot: 'sfx_shoot.mp3',
    levelup: 'sfx_levelup.mp3',
    gameover: 'sfx_gameover.mp3',
    start: 'sfx_start.mp3',
  }
};

let audioMuted = false;
let bgmCurrent = null;

function playBGM(file, loop=true) {
  if (audioMuted) return;
  if (bgmCurrent) { bgmCurrent.pause(); bgmCurrent.currentTime = 0; }
  bgmCurrent = new Audio(audioBase + file);
  bgmCurrent.loop = loop;
  bgmCurrent.volume = 0.55;
  bgmCurrent.play().catch(()=>{});
}
function stopBGM() {
  if (bgmCurrent) { bgmCurrent.pause(); bgmCurrent.currentTime = 0; }
}
function playSFX(name, vol=0.7) {
  if (audioMuted) return;
  const s = new Audio(audioBase + audio.sfx[name]);
  s.volume = vol;
  s.play().catch(()=>{});
}
function playNarration(idx) {
  if (audioMuted) return;
  const s = new Audio(audioBase + audio.narration[idx]);
  s.volume = 0.85;
  s.play().catch(()=>{});
}

muteBtn.addEventListener('click', () => {
  audioMuted = !audioMuted;
  muteBtn.textContent = audioMuted ? '🔇' : '🔊';
  if (audioMuted) stopBGM();
  else if (state.phase === 'playing') playBGM(audio.bgm[state.level-1] || audio.bgm[0]);
});

// ---------- INPUT ----------
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// touch
const touchState = {};
const joystick = document.getElementById('joystick');
const joystickKnob = document.getElementById('joystick-knob');
const touchControls = document.getElementById('touch');
const joystickState = { active: false, x: 0, y: 0, pointerId: null };

function resetJoystickInput() {
  joystickState.active = false;
  joystickState.pointerId = null;
  joystickState.x = 0;
  joystickState.y = 0;
  touchState.up = false;
  touchState.down = false;
  touchState.left = false;
  touchState.right = false;
  if (joystickKnob) {
    joystickKnob.style.transform = 'translate(-50%, -50%)';
  }
}

function setJoystickInput(x, y) {
  const radius = 44;
  const magnitude = Math.min(Math.hypot(x, y), radius);
  const angle = Math.atan2(y, x);
  const clampedX = Math.cos(angle) * magnitude;
  const clampedY = Math.sin(angle) * magnitude;

  joystickState.x = clampedX / radius;
  joystickState.y = clampedY / radius;
  touchState.up = joystickState.y < -0.25;
  touchState.down = joystickState.y > 0.25;
  touchState.left = joystickState.x < -0.25;
  touchState.right = joystickState.x > 0.25;

  if (joystickKnob) {
    joystickKnob.style.transform = `translate(calc(-50% + ${clampedX}px), calc(-50% + ${clampedY}px))`;
  }
}

document.querySelectorAll('.touch-btn').forEach(btn => {
  const k = btn.dataset.key;
  const press = e => { e.preventDefault(); touchState[k]=true; };
  const release = e => { e.preventDefault(); touchState[k]=false; };
  btn.addEventListener('touchstart', press, {passive:false});
  btn.addEventListener('touchend', release, {passive:false});
  btn.addEventListener('touchcancel', release, {passive:false});
  btn.addEventListener('mousedown', press);
  btn.addEventListener('mouseup', release);
  btn.addEventListener('mouseleave', release);
});

function handleJoystickMove(clientX, clientY) {
  if (!joystick || !joystick.isConnected) return;
  const rect = joystick.getBoundingClientRect();
  const x = clientX - (rect.left + rect.width / 2);
  const y = clientY - (rect.top + rect.height / 2);
  setJoystickInput(x, y);
}

function updateTouchControlsVisibility() {
  const useTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches || 'ontouchstart' in window || window.innerWidth <= 768;
  const shouldShow = useTouch && typeof state !== 'undefined' && state.phase === 'playing';
  if (touchControls) {
    touchControls.classList.toggle('visible', shouldShow);
  }
}

if (joystick) {
  joystick.addEventListener('pointerdown', e => {
    e.preventDefault();
    joystickState.active = true;
    joystickState.pointerId = e.pointerId;
    joystick.setPointerCapture?.(e.pointerId);
    handleJoystickMove(e.clientX, e.clientY);
  });

  window.addEventListener('pointermove', e => {
    if (!joystickState.active || joystickState.pointerId !== null && joystickState.pointerId !== e.pointerId) return;
    handleJoystickMove(e.clientX, e.clientY);
  });

  window.addEventListener('pointerup', e => {
    if (joystickState.pointerId !== null && joystickState.pointerId !== e.pointerId) return;
    resetJoystickInput();
  });

  window.addEventListener('pointercancel', e => {
    if (joystickState.pointerId !== null && joystickState.pointerId !== e.pointerId) return;
    resetJoystickInput();
  });
}

window.addEventListener('resize', updateTouchControlsVisibility);
window.addEventListener('orientationchange', updateTouchControlsVisibility);

function isKey(...codes) {
  for (const c of codes) {
    if (keys[c] || touchState[c]) return true;
  }
  if (codes.includes('up') && joystickState.y < -0.25) return true;
  if (codes.includes('down') && joystickState.y > 0.25) return true;
  if (codes.includes('left') && joystickState.x < -0.25) return true;
  if (codes.includes('right') && joystickState.x > 0.25) return true;
  return false;
}

function resizeCanvas() {
  const maxWidth = Math.max(260, window.innerWidth - 16);
  const maxHeight = Math.max(220, window.innerHeight - 140);
  const ratio = canvas.width / canvas.height;
  let width = maxWidth;
  let height = width / ratio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }

  canvas.style.width = `${Math.round(width)}px`;
  canvas.style.height = `${Math.round(height)}px`;
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);
resizeCanvas();

// ---------- GAME STATE ----------
const LEVELS = [
  { // 1 - Bosque
    name: 'Bosque Encantado',
    bgColors: ['#0a0420','#1a0a3a','#2a0a4a'],
    objective: 5,
    enemies: ['bat'],
    spawnRate: 60,
    enemySpeed: 2,
    bgm: 'bgm_main.mp3',
    narration: 1,
  },
  { // 2 - Cripta
    name: 'Cripta Susurrante',
    bgColors: ['#1a0520','#2a0a3a','#3a0a3a'],
    objective: 7,
    enemies: ['bat','skull'],
    spawnRate: 50,
    enemySpeed: 2.5,
    bgm: 'bgm_level2.mp3',
    narration: 2,
  },
  { // 3 - Pueblo
    name: 'Pueblo de los Duendes',
    bgColors: ['#2a0530','#3a1550','#5a2070'],
    objective: 9,
    enemies: ['bat','skull','rival'],
    spawnRate: 42,
    enemySpeed: 3,
    bgm: 'bgm_level3.mp3',
    narration: 3,
  },
  { // 4 - Castillo (boss)
    name: 'Castillo del Conde Draculín',
    bgColors: ['#0a0210','#200515','#3a0520'],
    objective: 12,
    enemies: ['bat','skull','rival','lightning'],
    spawnRate: 35,
    enemySpeed: 3.5,
    bgm: 'bgm_boss.mp3',
    narration: 4,
  }
];

const state = {
  phase: 'menu', // menu | playing | levelIntro | levelComplete | gameover | victory
  level: 1,
  score: 0,
  lives: 5,
  potions: 0,
  delivered: 0,
  combo: 0,
  comboTimer: 0,
  invuln: 0,
  shootCooldown: 0,
  spawnTimer: 0,
  time: 0,
  narrationPlayed: false,
};

const witch = {
  x: W/2, y: H/2,
  vx: 0, vy: 0,
  r: 22,
  tilt: 0,
  trail: [],
  shield: 0,
};

const entities = {
  potions: [],
  enemies: [],
  bullets: [],
  particles: [],
  clients: [],
  stars: [],
  clouds: [],
};

// ---------- HELPERS ----------
function rand(min, max) { return Math.random()*(max-min)+min; }
function dist(a,b) { return Math.hypot(a.x-b.x, a.y-b.y); }

// ---------- ENTITY SPAWNERS ----------
function spawnPotion() {
  entities.potions.push({
    x: rand(40, W-40),
    y: rand(80, H-80),
    r: 14,
    vy: rand(0.3, 1.2),
    color: ['#ff6ec7','#6effd6','#ffe066','#7c9bff'][Math.floor(Math.random()*4)],
    rot: 0,
  });
}
function spawnEnemy() {
  const lvl = LEVELS[state.level-1];
  const type = lvl.enemies[Math.floor(Math.random()*lvl.enemies.length)];
  const e = { x: W+40, y: rand(60, H-60), type, vx: 0, vy: 0, r: 22, rot:0, hp:1 };
  switch(type) {
    case 'bat':
      e.vx = -lvl.enemySpeed - rand(0,1.5);
      e.vy = Math.sin(state.time*0.05) * 1.5;
      e.r = 20;
      break;
    case 'skull':
      e.vx = -lvl.enemySpeed * 0.8;
      e.vy = rand(-0.5,0.5);
      e.r = 18;
      break;
    case 'rival':
      e.vx = -lvl.enemySpeed * 1.2;
      e.vy = rand(-1,1);
      e.r = 22;
      break;
    case 'lightning':
      e.x = rand(50, W-50);
      e.y = -40;
      e.vx = 0;
      e.vy = lvl.enemySpeed * 3;
      e.r = 16;
      e.hp = 1;
      break;
  }
  entities.enemies.push(e);
}
function spawnClient() {
  // A delivery target
  const side = Math.random() < 0.5 ? 'left' : 'right';
  entities.clients.push({
    x: side === 'left' ? -30 : W+30,
    y: rand(80, H-100),
    side,
    r: 28,
    bob: rand(0, Math.PI*2),
    waiting: true,
    need: 1 + Math.floor(state.level/2),
    served: 0,
    emoji: ['🏠','🏰','🛖','🏯','🕍'][Math.floor(Math.random()*5)],
  });
}
function spawnStars(count) {
  for (let i=0;i<count;i++) {
    entities.stars.push({
      x: rand(0,W),
      y: rand(0,H),
      s: rand(0.5, 2.5),
      tw: rand(0, Math.PI*2),
    });
  }
}
function spawnClouds() {
  for (let i=0;i<5;i++) {
    entities.clouds.push({
      x: rand(0, W),
      y: rand(40, H-40),
      s: rand(0.6, 1.3),
      vx: -rand(0.2, 0.6),
    });
  }
}

function spawnParticle(x,y,color,count=8) {
  for (let i=0;i<count;i++) {
    entities.particles.push({
      x, y,
      vx: rand(-3,3),
      vy: rand(-3,3),
      life: 30,
      color,
      r: rand(2,5),
    });
  }
}

function shoot() {
  if (state.shootCooldown > 0) return;
  state.shootCooldown = 12;
  entities.bullets.push({
    x: witch.x + 20, y: witch.y,
    vx: 8, vy: 0,
    r: 6,
    life: 80,
    color: '#ffe066',
  });
  playSFX('shoot', 0.5);
}

// ---------- DRAW HELPERS ----------
function drawWitch() {
  ctx.save();
  ctx.translate(witch.x, witch.y);
  ctx.rotate(witch.tilt);

  // broom trail
  ctx.strokeStyle = 'rgba(255,180,80,0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  witch.trail.forEach((t,i) => {
    if (i===0) ctx.moveTo(t.x-witch.x, t.y-witch.y);
    else ctx.lineTo(t.x-witch.x, t.y-witch.y);
  });
  ctx.stroke();

  // broom (under)
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-30, -2, 50, 4);
  // bristles
  ctx.strokeStyle = '#D2691E';
  ctx.lineWidth = 2;
  for (let i=0;i<6;i++) {
    ctx.beginPath();
    ctx.moveTo(18, -3);
    ctx.lineTo(28 + i*1.5, -8 + (i%2)*4);
    ctx.stroke();
  }

  // body (cape)
  ctx.fillStyle = '#6a30a8';
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(-10, 8);
  ctx.lineTo(10, 8);
  ctx.closePath();
  ctx.fill();

  // head
  ctx.fillStyle = '#ffd9b3';
  ctx.beginPath();
  ctx.arc(0, -12, 8, 0, Math.PI*2);
  ctx.fill();

  // hat
  ctx.fillStyle = '#2a1058';
  ctx.beginPath();
  ctx.moveTo(-10, -14);
  ctx.lineTo(0, -32);
  ctx.lineTo(10, -14);
  ctx.closePath();
  ctx.fill();
  // hat brim
  ctx.fillStyle = '#3a1578';
  ctx.fillRect(-12, -16, 24, 3);
  // hat buckle
  ctx.fillStyle = '#ffe066';
  ctx.beginPath();
  ctx.arc(0, -22, 2.5, 0, Math.PI*2);
  ctx.fill();
  // hat star
  ctx.fillStyle = '#fff';
  ctx.font = '8px sans-serif';
  ctx.fillText('⭐', -3, -20);

  // eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(-4, -13, 2, 2);
  ctx.fillRect(2, -13, 2, 2);

  // arms
  ctx.strokeStyle = '#ffd9b3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-5, -4); ctx.lineTo(-12, 0);
  ctx.moveTo(5, -4); ctx.lineTo(14, -2);
  ctx.stroke();

  // shield glow
  if (witch.shield > 0) {
    ctx.strokeStyle = `rgba(110,255,214,${0.4 + Math.sin(state.time*0.3)*0.3})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI*2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawPotion(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(Math.sin(p.rot)*0.2);
  // bottle
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.ellipse(0, 2, 10, 12, 0, 0, Math.PI*2);
  ctx.fill();
  // neck
  ctx.fillStyle = '#a89070';
  ctx.fillRect(-3, -10, 6, 4);
  // cork
  ctx.fillStyle = '#6a4a30';
  ctx.fillRect(-3, -13, 6, 3);
  // shine
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.ellipse(-3, -2, 2, 4, 0, 0, Math.PI*2);
  ctx.fill();
  // sparkle
  ctx.fillStyle = '#fff';
  ctx.font = '10px sans-serif';
  ctx.fillText('✨', 8, -6);
  ctx.restore();
  p.rot += 0.05;
}

function drawEnemy(e) {
  ctx.save();
  ctx.translate(e.x, e.y);
  switch(e.type) {
    case 'bat':
      ctx.fillStyle = '#3a1550';
      ctx.beginPath();
      // body
      ctx.ellipse(0,0,8,6,0,0,Math.PI*2);
      ctx.fill();
      // wings
      const wing = Math.sin(state.time*0.2 + e.x*0.05)*5;
      ctx.beginPath();
      ctx.moveTo(-2,-3); ctx.lineTo(-18, -8-wing); ctx.lineTo(-12, 2); ctx.closePath();
      ctx.moveTo(2,-3); ctx.lineTo(18, -8-wing); ctx.lineTo(12, 2); ctx.closePath();
      ctx.fillStyle = '#2a0a4a';
      ctx.fill();
      // ears
      ctx.fillStyle = '#3a1550';
      ctx.beginPath();
      ctx.moveTo(-3,-5); ctx.lineTo(-6,-12); ctx.lineTo(-1,-7);
      ctx.moveTo(3,-5); ctx.lineTo(6,-12); ctx.lineTo(1,-7);
      ctx.fill();
      // eyes
      ctx.fillStyle = '#ff3030';
      ctx.fillRect(-3,-2,2,2);
      ctx.fillRect(1,-2,2,2);
      break;
    case 'skull':
      ctx.fillStyle = '#e8e8e8';
      ctx.beginPath();
      ctx.arc(0,0,e.r,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(-5,-2,4,0,Math.PI*2);
      ctx.arc(5,-2,4,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#e8e8e8';
      ctx.fillRect(-2, 4, 4, 6);
      ctx.strokeStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(-5, 9); ctx.lineTo(-2, 6); ctx.lineTo(2, 6); ctx.lineTo(5, 9);
      ctx.stroke();
      break;
    case 'rival':
      // mini witch on broom
      ctx.fillStyle = '#a020f0';
      ctx.fillRect(-3, -10, 6, 14);
      ctx.fillStyle = '#ffd9b3';
      ctx.beginPath(); ctx.arc(0,-13,4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.fillRect(-12, 2, 24, 2);
      ctx.fillStyle = '#ffe066';
      ctx.font = '10px sans-serif';
      ctx.fillText('😠', -5, -10);
      break;
    case 'lightning':
      ctx.fillStyle = '#ffe066';
      ctx.beginPath();
      ctx.moveTo(-4, -16);
      ctx.lineTo(2, -2);
      ctx.lineTo(-2, -2);
      ctx.lineTo(6, 16);
      ctx.lineTo(-2, 4);
      ctx.lineTo(2, 4);
      ctx.lineTo(-4, -16);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
      break;
  }
  ctx.restore();
}

function drawClient(c) {
  ctx.save();
  ctx.translate(c.x, c.y);
  ctx.font = '32px sans-serif';
  ctx.fillText(c.emoji, -16, 10);
  // need indicator
  if (c.need - c.served > 0) {
    ctx.font = '14px sans-serif';
    ctx.fillText('🧪'.repeat(c.need - c.served), -10, -22);
  }
  // bobbing arrow
  const arrowY = -30 + Math.sin(state.time*0.1 + c.bob)*4;
  ctx.fillStyle = '#ffe066';
  ctx.beginPath();
  ctx.moveTo(0, arrowY);
  ctx.lineTo(-6, arrowY - 8);
  ctx.lineTo(6, arrowY - 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBullet(b) {
  ctx.save();
  ctx.fillStyle = b.color;
  ctx.shadowBlur = 15;
  ctx.shadowColor = b.color;
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
  ctx.fill();
  // trail
  ctx.fillStyle = 'rgba(255,255,150,0.3)';
  ctx.beginPath();
  ctx.arc(b.x - b.vx, b.y, b.r * 0.7, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawStar(s) {
  const a = Math.sin(s.tw + state.time*0.05) * 0.5 + 0.5;
  ctx.fillStyle = `rgba(255,255,255,${0.3 + a*0.7})`;
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.s, 0, Math.PI*2);
  ctx.fill();
}

function drawCloud(c) {
  ctx.fillStyle = 'rgba(180,140,220,0.15)';
  ctx.beginPath();
  ctx.ellipse(c.x, c.y, 30*c.s, 12*c.s, 0, 0, Math.PI*2);
  ctx.ellipse(c.x-20*c.s, c.y, 20*c.s, 10*c.s, 0, 0, Math.PI*2);
  ctx.ellipse(c.x+20*c.s, c.y, 20*c.s, 10*c.s, 0, 0, Math.PI*2);
  ctx.fill();
}

function drawParticle(p) {
  ctx.fillStyle = p.color;
  ctx.globalAlpha = p.life / 30;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

// ---------- BACKGROUND ----------
function drawBackground() {
  const lvl = LEVELS[state.level-1] || LEVELS[0];
  const grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0, lvl.bgColors[0]);
  grad.addColorStop(0.5, lvl.bgColors[1]);
  grad.addColorStop(1, lvl.bgColors[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);

  // stars
  entities.stars.forEach(drawStar);
  // clouds
  entities.clouds.forEach(drawCloud);

  // moon
  ctx.fillStyle = 'rgba(255,240,200,0.85)';
  ctx.beginPath();
  ctx.arc(W-100, 80, 40, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = lvl.bgColors[1];
  ctx.beginPath();
  ctx.arc(W-90, 75, 36, 0, Math.PI*2);
  ctx.fill();
}

// ---------- HUD ----------
function updateHUD() {
  const totalLives = 5;
  scoreEl.textContent = state.score;
  livesEl.textContent = '❤️'.repeat(Math.max(0, state.lives)) + '🖤'.repeat(Math.max(0, totalLives - state.lives));
  levelEl.textContent = state.level;
  const lvl = LEVELS[state.level-1];
  objectiveEl.textContent = `📍 ${lvl.name} — Entrega ${state.delivered}/${lvl.objective}`;
  comboEl.textContent = state.combo >= 2 ? `🔥 Combo x${state.combo}` : '';
}

// ---------- GAME LOOP ----------
function resetLevel(fullReset=false) {
  if (fullReset) {
    state.score = 0;
    state.lives = 5;
    state.level = 1;
  } else {
    state.lives = Math.max(state.lives, 5);
  }
  state.potions = 0;
  state.delivered = 0;
  state.combo = 0;
  state.comboTimer = 0;
  state.invuln = 0;
  state.shootCooldown = 0;
  state.spawnTimer = 0;
  state.narrationPlayed = false;
  entities.potions = [];
  entities.enemies = [];
  entities.bullets = [];
  entities.particles = [];
  entities.clients = [];
  entities.clouds = [];
  witch.x = W/2; witch.y = H/2;
  witch.vx = 0; witch.vy = 0;
  witch.trail = [];
  witch.shield = 0;

  // spawn initial items
  for (let i=0;i<3;i++) spawnPotion();
  spawnClient();
}

function startLevel() {
  // Skip intro screen — go straight to playing
  state.phase = 'levelIntro';
  resetLevel();
  const lvl = LEVELS[state.level-1];
  // Play narration in background (don't block UI)
  if (!audioMuted) {
    try {
      const s = new Audio(audioBase + audio.narration[lvl.narration]);
      s.volume = 0.9;
      s.play().catch(()=>{});
    } catch(e) {}
  }
  // Immediately begin playing
  beginPlay();
}

function beginPlay() {
  state.phase = 'playing';
  overlay.classList.add('hidden');
  updateTouchControlsVisibility();
  playBGM(LEVELS[state.level-1].bgm);
  state.spawnTimer = 0;
}

function nextLevel() {
  if (state.level >= LEVELS.length) {
    victory();
    return;
  }
  state.level++;
  playSFX('levelup');
  startLevel();
}

function gameOver() {
  state.phase = 'gameover';
  updateTouchControlsVisibility();
  stopBGM();
  playBGM(audio.gameover);
  playSFX('gameover');
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <h1>💀 Game Over</h1>
    <h2>Brujita se quedó dormida en la escoba...</h2>
    <div class="story">"¡Tendre que tirarme las cartas!"</div>
    <p>Puntos finales: <b>${state.score}</b></p>
    <p>Niveles completados: <b>${state.level - 1}</b> / ${LEVELS.length}</p>
    <button id="retry-btn">🧹 Intentar de Nuevo</button>
  `;
  document.getElementById('retry-btn').addEventListener('click', () => {
    state.level = 1;
    startLevel();
  });
}

function victory() {
  state.phase = 'victory';
  updateTouchControlsVisibility();
  stopBGM();
  playBGM(audio.victory);
  overlay.classList.remove('hidden');
  overlay.innerHTML = `
    <h1>👑 ¡Victoria Total!</h1>
    <h2>La Academia de Magia te acepta, Brujita</h2>
    <div class="story">"Después de repartir ${state.delivered} pociones a tiempo, el Conde Draculín te entrega la beca de la Academia. Resulta que repartir era tu verdadero hechizo."</div>
    <p>Puntos finales: <b>${state.score}</b> 🏆</p>
    <p>Has demostrado que volar en escoba es lo tuyo, Brujita.</p>
    <button id="again-btn">🧹 Reparto de Nuevo</button>
  `;
  document.getElementById('again-btn').addEventListener('click', () => {
    state.level = 1;
    startLevel();
  });
}

function levelComplete() {
  state.phase = 'levelComplete';
  updateTouchControlsVisibility();
  stopBGM();
  playBGM(audio.victory);
  playSFX('levelup');
  overlay.classList.remove('hidden');
  const lvl = LEVELS[state.level-1];
  overlay.innerHTML = `
    <h1>✨ ¡Entrega Completa!</h1>
    <h2>${lvl.name}</h2>
    <div class="story">"${getLevelCompleteLine()}"</div>
    <p>Puntos: <b>${state.score}</b></p>
    <p>Pociones: <b>${state.delivered}/${lvl.objective}</b></p>
    <button id="next-btn">🧹 Siguiente Nivel</button>
  `;
  document.getElementById('next-btn').addEventListener('click', nextLevel);
}

function getLevelCompleteLine() {
  const lines = [
    '¡Los clientes están felices! Brujita se anota otra.',
    'El búho Remigio te guiña un ojo. "Buena entrega, Brujita."',
    'Pompín la momia te aplaude con sus vendas.',
    'Los duendes te invitan a un café (esta vez con azúcar).',
    'El Conde Draculín se quita el sombrero ante ti. ¡Increíble!',
  ];
  return lines[Math.min(state.level-1, lines.length-1)];
}

// ---------- UPDATE ----------
function update() {
  state.time++;

  if (state.phase !== 'playing') return;

  // witch input
  const ACC = 0.55;
  const FRIC = 0.88;
  if (isKey('KeyW','ArrowUp','up')) witch.vy -= ACC;
  if (isKey('KeyS','ArrowDown','down')) witch.vy += ACC;
  if (isKey('KeyA','ArrowLeft','left')) witch.vx -= ACC;
  if (isKey('KeyD','ArrowRight','right')) witch.vx += ACC;

  witch.vx *= FRIC;
  witch.vy *= FRIC;
  witch.vx = Math.max(-7, Math.min(7, witch.vx));
  witch.vy = Math.max(-7, Math.min(7, witch.vy));
  witch.x += witch.vx;
  witch.y += witch.vy;
  witch.x = Math.max(20, Math.min(W-20, witch.x));
  witch.y = Math.max(50, Math.min(H-20, witch.y));
  witch.tilt = witch.vx * 0.05;

  witch.trail.push({x:witch.x-15, y:witch.y});
  if (witch.trail.length > 12) witch.trail.shift();

  if (isKey('Space')) shoot();

  // broom whoosh when moving fast
  if (Math.abs(witch.vx) + Math.abs(witch.vy) > 4 && state.time % 8 === 0) {
    // subtle, not every frame
  }

  state.shootCooldown = Math.max(0, state.shootCooldown - 1);
  state.invuln = Math.max(0, state.invuln - 1);
  witch.shield = Math.max(0, witch.shield - 1);

  // combo timer
  if (state.combo > 0) {
    state.comboTimer--;
    if (state.comboTimer <= 0) state.combo = 0;
  }

  // spawn
  state.spawnTimer++;
  const lvl = LEVELS[state.level-1];
  if (state.spawnTimer % lvl.spawnRate === 0) spawnEnemy();
  if (state.spawnTimer % 180 === 0) spawnPotion();
  if (state.spawnTimer % 240 === 0 && entities.clients.length < 2) spawnClient();

  // enemies update
  entities.enemies.forEach(e => {
    e.x += e.vx;
    e.y += e.vy;
    if (e.type === 'bat') e.y += Math.sin(state.time*0.08 + e.x*0.05) * 0.8;
    if (e.type === 'skull') e.y += Math.cos(state.time*0.06) * 0.5;
    if (e.type === 'rival') {
      e.y += Math.sin(state.time*0.1 + e.x*0.02) * 1.2;
      // chase a bit
      const dy = witch.y - e.y;
      e.vy += dy * 0.005;
      e.vy = Math.max(-2.5, Math.min(2.5, e.vy));
    }
  });
  entities.enemies = entities.enemies.filter(e => e.x > -60 && e.x < W+60 && e.y < H+60);

  // potions update
  entities.potions.forEach(p => {
    p.y += p.vy;
    if (p.y > H-30) p.vy = -Math.abs(p.vy);
    if (p.y < 60) p.vy = Math.abs(p.vy);
  });

  // clients
  entities.clients.forEach(c => {
    c.bob += 0.05;
    if (c.waiting) {
      // gentle drift toward center
      if (c.side === 'left' && c.x < 80) c.x += 0.4;
      if (c.side === 'right' && c.x > W-80) c.x -= 0.4;
    }
  });

  // clouds
  entities.clouds.forEach(c => {
    c.x += c.vx;
    if (c.x < -60) c.x = W + 60;
  });

  // bullets
  entities.bullets.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
    b.life--;
  });
  entities.bullets = entities.bullets.filter(b => b.life > 0 && b.x < W+20);

  // particles
  entities.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life--; });
  entities.particles = entities.particles.filter(p => p.life > 0);

  // collisions: witch vs potions
  entities.potions = entities.potions.filter(p => {
    if (dist(witch, p) < witch.r + p.r) {
      state.potions++;
      state.combo++;
      state.comboTimer = 90;
      const mult = Math.min(state.combo, 5);
      state.score += 10 * mult;
      spawnParticle(p.x, p.y, p.color, 12);
      spawnParticle(p.x, p.y, '#fff', 4);
      playSFX(state.combo >= 3 ? 'combo' : 'potion');
      return false;
    }
    return true;
  });

  // collisions: witch vs clients (deliver)
  entities.clients.forEach(c => {
    if (c.waiting && dist(witch, c) < witch.r + c.r) {
      if (state.potions > 0) {
        const give = Math.min(state.potions, c.need - c.served);
        state.potions -= give;
        c.served += give;
        state.delivered += give;
        state.score += 50 * give;
        spawnParticle(c.x, c.y, '#ffe066', 16);
        playSFX('potion');
        if (c.served >= c.need) {
          c.waiting = false;
          c.emoji = '😄';
          setTimeout(() => {
            entities.clients = entities.clients.filter(cc => cc !== c);
          }, 600);
        }
      } else {
        // visual cue
        spawnParticle(c.x, c.y - 25, '#ff5050', 4);
      }
    }
  });

  // collisions: witch vs enemies
  if (state.invuln <= 0) {
    entities.enemies = entities.enemies.filter(e => {
      if (dist(witch, e) < witch.r + e.r) {
        state.lives--;
        state.invuln = 90;
        state.combo = 0;
        spawnParticle(witch.x, witch.y, '#ff5050', 18);
        playSFX('hit');
        if (state.lives <= 0) {
          gameOver();
        }
        return false;
      }
      return true;
    });
  }

  // collisions: bullets vs enemies
  entities.bullets.forEach(b => {
    entities.enemies.forEach(e => {
      if (dist(b, e) < b.r + e.r) {
        e.hp--;
        b.life = 0;
        spawnParticle(e.x, e.y, '#ffe066', 10);
        if (e.hp <= 0) {
          state.score += 25;
          spawnParticle(e.x, e.y, '#fff', 14);
          playSFX('combo', 0.5);
          entities.enemies = entities.enemies.filter(ee => ee !== e);
        }
      }
    });
  });

  // check level complete
  if (state.delivered >= lvl.objective) {
    levelComplete();
  }
}

// ---------- DRAW ----------
function draw() {
  drawBackground();

  if (state.phase === 'menu') {
    ctx.fillStyle = 'rgba(10,4,30,0.6)';
    ctx.fillRect(0,0,W,H);
    return;
  }

  // clients
  entities.clients.forEach(c => {
    drawClient(c);
  });

  // potions
  entities.potions.forEach(drawPotion);

  // enemies
  entities.enemies.forEach(drawEnemy);

  // witch
  drawWitch();

  // bullets
  entities.bullets.forEach(drawBullet);

  // particles
  entities.particles.forEach(drawParticle);

  // invuln flash
  if (state.invuln > 0 && Math.floor(state.time/4) % 2 === 0) {
    ctx.fillStyle = 'rgba(255,80,80,0.3)';
    ctx.fillRect(0,0,W,H);
  }

  updateHUD();
}

// ---------- MAIN LOOP ----------
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// ---------- INIT ----------
function init() {
  spawnStars(80);
  spawnClouds();
  updateTouchControlsVisibility();
  loop();
}

// Start button handler (single click = start game directly)
function handleStart() {
  try { playSFX('start'); } catch(e) {}
  startLevel();
}

// Attach handler with multiple fallbacks for reliability
if (startBtn) {
  startBtn.addEventListener('click', handleStart);
  startBtn.addEventListener('touchstart', e => { e.preventDefault(); handleStart(); }, {passive:false});
  startBtn.addEventListener('pointerdown', e => { e.preventDefault(); handleStart(); });
}
// Also: any click on the overlay during 'menu' state starts the game
overlay.addEventListener('click', e => {
  if (state.phase === 'menu') handleStart();
});

init();