const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// =====================
// ESTADOS DO JOGO
// =====================
let gameStarted = false;
let score = 0;

// =====================
// JOGADOR (QUADRADO)
// =====================
const player = {
  size: 30,
  x: canvas.width / 2,
  y: canvas.height - 100,
  vx: 0,
  vy: 0,
  gravity: 0.5,
  jumping: false
};

// =====================
// TRAMPOLIM
// =====================
const trampoline = {
  width: 120,
  height: 15,
  x: canvas.width / 2 - 60,
  y: canvas.height / 2,
  speed: 3,
  dir: 1
};

// =====================
// CONTROLE DE ARREMESSO
// =====================
let startTouch = null;

// =====================
// PLAY
// =====================
playBtn.onclick = () => {
  gameStarted = true;
  playBtn.style.display = "none";
  resetPlayer();
};

// =====================
// TOUCH (ESTILO ANGRY BIRDS)
// =====================
canvas.addEventListener("touchstart", (e) => {
  if (!gameStarted) return;
  startTouch = e.touches[0];
});

canvas.addEventListener("touchend", (e) => {
  if (!gameStarted || !startTouch) return;

  const endTouch = e.changedTouches[0];

  const dx = startTouch.clientX - endTouch.clientX;
  const dy = startTouch.clientY - endTouch.clientY;

  player.vx = dx * 0.1;
  player.vy = dy * 0.1;

  player.jumping = true;
  startTouch = null;
});

// =====================
// FUNÇÕES
// =====================
function resetPlayer() {
  player.x = canvas.width / 2;
  player.y = canvas.height - 100;
  player.vx = 0;
  player.vy = 0;
  player.jumping = false;
}

function update() {
  if (!gameStarted) return;

  // Gravidade
  if (player.jumping) {
    player.vy += player.gravity;
    player.x += player.vx;
    player.y += player.vy;
  }

  // Movimento do trampolim
  trampoline.x += trampoline.speed * trampoline.dir;
  if (trampoline.x <= 0 || trampoline.x + trampoline.width >= canvas.width) {
    trampoline.dir *= -1;
  }

  // Colisão com trampolim
  if (
    player.x < trampoline.x + trampoline.width &&
    player.x + player.size > trampoline.x &&
    player.y + player.size >= trampoline.y &&
    player.y + player.size <= trampoline.y + trampoline.height &&
    player.vy > 0
  ) {
    score++;
    resetPlayer();
  }

  // Caiu no chão
  if (player.y > canvas.height) {
    score = 0;
    resetPlayer();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Quadrado
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Trampolim
  ctx.fillStyle = "#ff4444";
  ctx.fillRect(trampoline.x, trampoline.y, trampoline.width, trampoline.height);

  // Score
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + score, 20, 30);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
