// 🎮 Juego: Catch the Ball
// Explicación: Mueves una barra con el mouse para atrapar bolas que caen.
// Si las atrapas, ganas puntos. Si no, se reinicia el juego.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 🔧 Ajustes del lienzo
canvas.width = 400;
canvas.height = 600;

// 🏀 Configuración inicial de bolas (ahora es un array)
let balls = [
  {
    x: Math.random() * 380 + 10,
    y: 0,
    radius: 15,
    speed: 3,
    color: "red",
  },
];

// 🧍 Control del jugador (la barra)
let catcher = {
  width: 80,
  height: 10,
  x: canvas.width / 2 - 40,
  y: canvas.height - 40,
  color: "white",
};

let score = 0;
let mouseX = canvas.width / 2;

// 🖱 Evento: mover el mouse
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
});

// ⚙️ Actualizar posición y lógica
function update() {
  catcher.x = mouseX - catcher.width / 2;

  balls.forEach((ball) => {
    ball.y += ball.speed;

    // 🧮 Detección de colisión (bola vs catcher)
    if (
      ball.y + ball.radius >= catcher.y &&
      ball.x >= catcher.x &&
      ball.x <= catcher.x + catcher.width
    ) {
      score++;
      resetBall(ball);

      // Aumenta dificultad cada 5 puntos
      if (score % 5 === 0) ball.speed += 0.5;

      // 💥 NUEVO CAMBIO: cuando score llega a 10, agrega una bola nueva
      if (score === 10) {
        balls.push({
          x: Math.random() * 380 + 10,
          y: 0,
          radius: 15,
          speed: 3,
          color: "yellow",
        });
      }
    }

    // 🚫 Si la bola cae fuera del canvas
    if (ball.y > canvas.height) {
      alert(`💀 Game Over! Score: ${score}`);
      score = 0;
      balls = [
        {
          x: Math.random() * 380 + 10,
          y: 0,
          radius: 15,
          speed: 3,
          color: "red",
        },
      ];
    }
  });
}

// 🔁 Reinicia una bola desde arriba
function resetBall(ball) {
  ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius;
  ball.y = 0;
}

// 🎨 Dibujar todo en pantalla
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibuja todas las bolas
  balls.forEach((ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
  });

  // Dibuja el catcher
  ctx.fillStyle = catcher.color;
  ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

  // Dibuja el score
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

// 🌀 Bucle del juego
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
