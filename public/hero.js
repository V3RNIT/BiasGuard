// HiDPI-aware canvas setup
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let DPR = 1, W = 0, H = 0;

function resize() {
  DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const cssW = window.innerWidth;
  const cssH = window.innerHeight;
  canvas.width = Math.floor(cssW * DPR);
  canvas.height = Math.floor(cssH * DPR);
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  W = canvas.width; H = canvas.height;
}
window.addEventListener('resize', resize, { passive: true });
resize();

// Particles
class Particle {
  constructor(x, y) {
    const speed = 0.25 + Math.random() * 0.75;
    const angle = Math.random() * Math.PI * 2;
    this.x = x; this.y = y;
    this.vx = Math.cos(angle) * speed * DPR;
    this.vy = Math.sin(angle) * speed * DPR;
    this.r = (1 + Math.random() * 2) * DPR;
    this.alpha = 0.5 + Math.random() * 0.5;
  }
  step() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
}

const particles = [];
const MAX_PARTICLES = 120;
const LINK_DISTANCE = 140;

function seed(n = 80) {
  particles.length = 0;
  for (let i = 0; i < n; i++) {
    particles.push(new Particle(Math.random() * W, Math.random() * H));
  }
}
seed();

// Mouse interaction
window.addEventListener('mousemove', (e) => {
  const x = e.clientX * DPR, y = e.clientY * DPR;
  particles.push(new Particle(x, y));
  if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
}, { passive: true });

// Draw links between nearby particles
function drawLinks() {
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = '#ffffff';
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < LINK_DISTANCE * DPR) {
        ctx.lineWidth = (1 - dist / (LINK_DISTANCE * DPR)) * 1.2 * DPR;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  for (const p of particles) { p.step(); p.draw(); }
  drawLinks();
  requestAnimationFrame(animate);
}
animate();

