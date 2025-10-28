// 🎮 Juego: Catch the Ball
// Explicación: Mueves una barra con el mouse para atrapar una bola que cae.
// Si la atrapas, ganas puntos. Si no, aparece una pantalla Game Over.
// Estilo: pixel art blanco/negro con botón morado "Reintentar".

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 🔧 Ajustes del lienzo
canvas.width = 400;
canvas.height = 600;

// 🏀 Configuración de la bola
let ball = {
  x: Math.random() * 380 + 10, // Posición inicial aleatoria
  y: 0,
  radius: 15,
  speed: 3,
  color: "red",
};

// 🧍 Configuración del jugador
let catcher = {
  width: 80,
  height: 10,
  x: canvas.width / 2 - 40, // Centrado al inicio
  y: canvas.height - 40,
  color: "white",
};

// 🔢 Variables globales
let score = 0;
let highScore = 0;
let mouseX = canvas.width / 2;
let gameOver = false;
let gameOverButton = null;

// 🖱 Movimiento del mouse
canvas.addEventListener("mousemove", (e) => {
  if (gameOver) return; // No mover durante Game Over
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

// ⚙️ Actualiza la lógica del juego
function update() {
  if (gameOver) return;

  // Movimiento de la bola
  ball.y += ball.speed;

  // Movimiento del catcher
  catcher.x = mouseX - catcher.width / 2;

  // Detección de colisión
  if (
    ball.y + ball.radius >= catcher.y &&
    ball.x >= catcher.x &&
    ball.x <= catcher.x + catcher.width
  ) {
    score++;
    resetBall();
    if (score % 5 === 0) ball.speed += 0.5; // Dificultad incremental
  }

  // Si la bola cae fuera del lienzo → Game Over
  if (ball.y > canvas.height) {
    gameOver = true;
    if (score > highScore) highScore = score;
  }
}

// 🎨 Dibuja todo en pantalla
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bola
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();

  // Catcher
  ctx.fillStyle = catcher.color;
  ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

  // Puntuación
  ctx.fillStyle = "white";
  ctx.font = "16px 'Press Start 2P', monospace";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 10, 25);

  // 🟥 Pantalla Game Over
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

    // 🎮 Botón "Reintentar"
    const buttonX = canvas.width / 2 - 70;
    const buttonY = canvas.height / 2 + 50;
    const buttonW = 140;
    const buttonH = 40;

    ctx.fillStyle = "#8000ff"; // 💜 morado brillante
    ctx.fillRect(buttonX, buttonY, buttonW, buttonH);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(buttonX, buttonY, buttonW, buttonH);

    ctx.fillStyle = "white";
    ctx.font = "14px 'Press Start 2P', monospace";
    ctx.fillText("REINTENTAR", canvas.width / 2, buttonY + 25);

    // Guarda coordenadas del botón
    gameOverButton = { x: buttonX, y: buttonY, w: buttonW, h: buttonH };
  }
}

// 🌀 Bucle principal
function gameLoop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(gameLoop);
}

// 🖱 Clic en botón de reintentar
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

// ⌨️ Reiniciar con cualquier tecla
window.addEventListener("keydown", () => {
  if (gameOver) restartGame();
});

// ▶️ Iniciar juego
gameLoop();
