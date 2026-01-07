const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playBtn = document.getElementById("playBtn");

let running = false;
let score = 0;

// Quadrado
const player = {
  x: 180,
  y: 500,
  size: 20,
  vx: 0,
  vy: 0,
  launched: false
};

// Trampolim
const platform = {
  x: 130,
  y: 300,
  w: 100,
  h: 15
};

// Touch
let startTouch = null;

canvas.addEventListener("touchstart", (e) => {
  if (!running || player.launched) return;
  startTouch = e.touches[0];
}, { passive: true });

canvas.addEventListener("touchend", (e) => {
  if (!running || player.launched || !startTouch) return;

  const endTouch = e.changedTouches[0];

  const dx = startTouch.clientX - endTouch.clientX;
  const dy = startTouch.clientY - endTouch.clientY;

  player.vx = dx * 0.08;
  player.vy = dy * 0.08;
  player.launched = true;

  startTouch = null;
});

// Botão play
playBtn.addEventListener("click", () => {
  resetGame();
  running = true;
  playBtn.style.display = "none";
});

function resetGame() {
  player.x = 180;
  player.y = 500;
  player.vx = 0;
  player.vy = 0;
  player.launched = false;
  score = 0;
}

function update() {
  if (!running) return;

  if (player.launched) {
    player.vy += 0.4; // gravidade
    player.x += player.vx;
    player.y += player.vy;
  }

  // Colisão com trampolim
  if (
    player.y + player.size > platform.y &&
    player.y < platform.y + platform.h &&
    player.x + player.size > platform.x &&
    player.x < platform.x + platform.w &&
    player.vy > 0
  ) {
    score++;
    player.launched = false;
    player.vx = 0;
    player.vy = 0;
    player.y = platform.y - player.size;
  }

  // Caiu
  if (player.y > canvas.height) {
    running = false;
    playBtn.style.display = "block";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Quadrado
  ctx.fillStyle = "#00ff88";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Trampolim
  ctx.fillStyle = "#ff8800";
  ctx.fillRect(platform.x, platform.y, platform.w, platform.h);

  // Pontuação
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
