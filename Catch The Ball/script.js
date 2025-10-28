// 🎮 Juego: Catch the Ball
// Versión con pantalla Game Over estilo pixel art (blanco, negro y rojo)

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// 🏀 Bola
let ball = {
  x: Math.random() * 380 + 10,
  y: 0,
  radius: 15,
  speed: 3,
  color: "red",
};

// 🧍 Barra del jugador
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

// 🖱 Movimiento del mouse
canvas.addEventListener("mousemove", (e) => {
  if (gameOver) return;
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
});

// 🔁 Reinicia la bola
function resetBall() {
  ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius;
  ball.y = 0;
}

// 🔄 Reiniciar juego
function restartGame() {
  score = 0;
  ball.speed = 3;
  gameOver = false;
  resetBall();
  gameLoop();
}

// ⚙️ Actualiza lógica del juego
function update() {
  if (gameOver) return;

  ball.y += ball.speed;
  catcher.x = mouseX - catcher.width / 2;

  // Colisión
  if (
    ball.y + ball.radius >= catcher.y &&
    ball.x >= catcher.x &&
    ball.x <= catcher.x + catcher.width
  ) {
    score++;
    resetBall();
    if (score % 5 === 0) ball.speed += 0.5;
  }

  // Pierde
  if (ball.y > canvas.height) {
    gameOver = true;
    if (score > highScore) highScore = score;
  }
}

// 🎨 Dibuja todo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bola
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();

  // Jugador
  ctx.fillStyle = catcher.color;
  ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

  // Score
  ctx.fillStyle = "white";
  ctx.font = "16px 'Press Start 2P', monospace"; // Fuente pixel art
  ctx.fillText("Score: " + score, 10, 25);

  // Pantalla Game Over
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "24px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 80);

    ctx.font = "16px 'Press Start 2P', monospace";
    ctx.fillText(`Puntuación: ${score}`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText(`Récord: ${highScore}`, canvas.width / 2, canvas.height / 2 + 10);

    // Botón de reintentar
    const buttonX = canvas.width / 2 - 70;
    const buttonY = canvas.height / 2 + 50;
    const buttonW = 140;
    const buttonH = 40;

    ctx.fillStyle = "#4b0082"; // morado brillante
    ctx.fillRect(buttonX, buttonY, buttonW, buttonH);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonW, buttonH);

    ctx.fillStyle = "white";
    ctx.font = "14px 'Press Start 2P', monospace";
    ctx.fillText("REINTENTAR", canvas.width / 2, buttonY + 25);

    // Guardar para clics
    gameOverButton = { x: buttonX, y: buttonY, w: buttonW, h: buttonH };
  }
}

// 🌀 Bucle principal
function gameLoop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

// 🖱 Detectar clic en botón
let gameOverButton = null;
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

gameLoop();
