// ==============================
// CONSOLE NA TELA
// ==============================
const consoleLog = document.getElementById("consoleLog");

function log(msg) {
  const time = new Date().toLocaleTimeString();
  consoleLog.innerText += `[${time}] ${msg}\n`;
  consoleLog.parentElement.scrollTop = consoleLog.parentElement.scrollHeight;
}

// ==============================
// CANVAS
// ==============================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ground.y = canvas.height - 80;
  ground.width = canvas.width;

  player.x = canvas.width / 2;
  player.y = ground.y - player.size;
}

window.addEventListener("resize", resizeCanvas);

// ==============================
// ESTADO DO JOGO
// ==============================
let gameStarted = false;
let score = 0;

// ==============================
// JOGADOR (QUADRADO)
// ==============================
const player = {
  size: 30,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  gravity: 0.5,
  jumping: false
};

// ==============================
// CHÃO
// ==============================
const ground = {
  x: 0,
  y: 0,
  width: 0,
  height: 80
};

// ==============================
// TRAMPOLIM
// ==============================
const trampoline = {
  x: 100,
  y: 0,
  width: 120,
  height: 20,
  speed: 3,
  dir: 1
};

// ==============================
// RESET PLAYER
// ==============================
function resetPlayer() {
  player.x = canvas.width / 2;
  player.y = ground.y - player.size;
  player.vx = 0;
  player.vy = 0;
  player.jumping = false;
}

// ==============================
// INPUT (TOQUE / CLICK)
// ==============================
canvas.addEventListener("pointerdown", () => {
  if (!gameStarted) return;

  if (!player.jumping) {
    player.vy = -12;
    player.jumping = true;
  }
});

// ==============================
// BOTÃO PLAY
// ==============================
playBtn.addEventListener("click", () => {
  gameStarted = true;
  playBtn.style.display = "none";
  score = 0;
  resetPlayer();
  log("Jogo iniciado");
});

// ==============================
// UPDATE
// ==============================
function update() {
  if (!gameStarted) return;

  // Gravidade
  player.vy += player.gravity;
  player.y += player.vy;

  // Movimento do trampolim
  trampoline.x += trampoline.speed * trampoline.dir;
  if (
    trampoline.x <= 0 ||
    trampoline.x + trampoline.width >= canvas.width
  ) {
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
    player.y = trampoline.y - player.size;
    player.vy = -12; // impulso
    player.jumping = true;
    score++;
    log("Acertou o trampolim | Score: " + score);
  }

  // Colisão com o chão
  if (player.y + player.size >= ground.y) {
    player.y = ground.y - player.size;
    player.vy = 0;
    player.jumping = false;
  }
}

// ==============================
// DRAW
// ==============================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fundo
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Chão
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

  // Trampolim
  trampoline.y = ground.y - 120;
  ctx.fillStyle = "#ffaa00";
  ctx.fillRect(
    trampoline.x,
    trampoline.y,
    trampoline.width,
    trampoline.height
  );

  // Player
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Score
  ctx.fillStyle = "#00ff88";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);
}

// ==============================
// GAME LOOP
// ==============================
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// ==============================
// INIT
// ==============================
resizeCanvas();
resetPlayer();
gameLoop();
log("Game carregado com sucesso");
