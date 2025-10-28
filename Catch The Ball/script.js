// 🎮 Juego: Catch the Ball
// Explicación: Mueves una barra con el mouse para atrapar una bola que cae.
// Si la atrapas, ganas puntos. Si no, aparece una pantalla Game Over.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 🔧 Ajustes del lienzo
canvas.width = 400;
canvas.height = 600;

// 🏀 Configuración de la bola
let ball = {
  x: Math.random() * 380 + 10, // Posición aleatoria inicial (evita los bordes)
  y: 0,
  radius: 15,
  speed: 3,
  color: "red",
};

let special_ball = {
  x: Math.random() * 380 + 10,
  y: 0,
  radius: 8,
  speed: 5,
  color: "gold",
  active: false,
  spawnInterval: 10000,
  lastSpawn: Date.now(),
};

// 🧍 Control del jugador (la barra)
let catcher = {
  width: 80,
  height: 10,
  x: canvas.width / 2 - 40,
  y: canvas.height - 40,
  color: "white",
};

let score = 0;
let highScore = 0;
let mouseX = canvas.width / 2;
let gameOver = false;
let gameOverButton = null;

// 🔊 Efectos de sonido
const hitSound = new Audio("hit.mp3");
const loseSound = new Audio("lose.mp3");

// 🖱 Evento: mover el mouse
canvas.addEventListener("mousemove", (e) => {
  if (gameOver) return;
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
});

// ⚙️ Actualizar posición y lógica
function update() {
  if (gameOver) return;

  ball.y += ball.speed;

  if (special_ball.active) {
    special_ball.y += special_ball.speed;
  } else {
    if (Date.now() - special_ball.lastSpawn >= special_ball.spawnInterval) {
      reset_specialBall();
      special_ball.active = true;
      special_ball.lastSpawn = Date.now();
    }
  }

  catcher.x = mouseX - catcher.width / 2;

  if (
    ball.y + ball.radius >= catcher.y &&
    ball.x >= catcher.x &&
    ball.x <= catcher.x + catcher.width
  ) {
    score++;
    hitSound.currentTime = 0;
    hitSound.play();
    resetBall();

    if (score % 5 === 0) ball.speed += 0.5;
  }

  if (
    special_ball.active &&
    special_ball.y + special_ball.radius >= catcher.y &&
    special_ball.x >= catcher.x &&
    special_ball.x <= catcher.x + catcher.width
  ) {
    score += 10;
    special_ball.active = false;
    special_ball.lastSpawn = Date.now();
    reset_specialBall();
  }

  if (ball.y > canvas.height) {
    loseSound.currentTime = 0;
    loseSound.play();
    gameOver = true;
    if (score > highScore) highScore = score;
  }

  if (special_ball.active && special_ball.y > canvas.height) {
    special_ball.active = false;
    special_ball.lastSpawn = Date.now();
  }
}

// 🔁 Reinicia la bola desde arriba y cambia color
function resetBall() {
  ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius;
  ball.y = 0;

  const colores = ["red", "blue", "green", "yellow", "orange", "purple", "cyan", "magenta"];
  ball.color = colores[Math.floor(Math.random() * colores.length)];
}

function reset_specialBall() {
  special_ball.x = Math.random() * (canvas.width - special_ball.radius * 2) + special_ball.radius;
  special_ball.y = -special_ball.radius * 2;
}

// 🎨 Dibujar todo en pantalla
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🏷️ TÍTULO animado (nuevo)
  drawTitle();

  // Dibuja la bola con gradiente
  ctx.beginPath();
  let gradient = ctx.createRadialGradient(ball.x, ball.y, 5, ball.x, ball.y, ball.radius);
  gradient.addColorStop(0, "white");
  gradient.addColorStop(1, ball.color);
  ctx.fillStyle = gradient;
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  ctx.fillStyle = catcher.color;
  ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  if (special_ball.active) {
    draw_specialBall();
  }

  if (gameOver) {
    drawGameOver();
  }
}

function drawTitle() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "#8000ff");
  gradient.addColorStop(0.5, "#ff00ff");
  gradient.addColorStop(1, "#8000ff");

  ctx.fillStyle = gradient;
  ctx.font = "bold 22px 'Press Start 2P', monospace";
  ctx.textAlign = "center";
  ctx.fillText("🎮 Catch The Ball 🎮", canvas.width / 2, 50);
}

function draw_specialBall() {
  ctx.beginPath();
  ctx.arc(special_ball.x, special_ball.y, special_ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = special_ball.color;
  ctx.fill();
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "24px 'Press Start 2P', monospace";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 80);

  ctx.font = "16px 'Press Start 2P', monospace";
  ctx.fillText(`Puntuación: ${score}`, canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillText(`Récord: ${highScore}`, canvas.width / 2, canvas.height / 2 + 10);

  const buttonX = canvas.width / 2 - 70;
  const buttonY = canvas.height / 2 + 50;
  const buttonW = 140;
  const buttonH = 40;

  ctx.fillStyle = "#8000ff";
  ctx.fillRect(buttonX, buttonY, buttonW, buttonH);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(buttonX, buttonY, buttonW, buttonH);

  ctx.fillStyle = "white";
  ctx.font = "14px 'Press Start 2P', monospace";
  ctx.fillText("REINTENTAR", canvas.width / 2, buttonY + 25);

  gameOverButton = { x: buttonX, y: buttonY, w: buttonW, h: buttonH };
}

// 🌀 Bucle del juego
function gameLoop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

// 🔄 Reiniciar juego
function restartGame() {
  score = 0;
  ball.speed = 3;
  gameOver = false;
  resetBall();
  gameLoop();
}

canvas.addEventListener("click", (e) => {
  if (gameOver && gameOverButton) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (
      x >= gameOverButton.x &&
      x <= gameOverButton.x + gameOverButton.w &&
      y >= gameOverButton.y &&
      y <= gameOverButton.y + gameOverButton.h
    ) {
      restartGame();
    }
  }
});

window.addEventListener("keydown", () => {
  if (gameOver) restartGame();
});

// 🔓 Desbloquear audio y empezar el juego
function enableAudio() {
  hitSound.play().then(() => {
    hitSound.pause();
    hitSound.currentTime = 0;
  }).catch(() => {});

  loseSound.play().then(() => {
    loseSound.pause();
    loseSound.currentTime = 0;
  }).catch(() => {});

  gameLoop();

  window.removeEventListener("click", enableAudio);
  window.removeEventListener("keydown", enableAudio);
}

window.addEventListener("click", enableAudio);
window.addEventListener("keydown", enableAudio);
