// 🎮 Juego: Catch the Ball
// Explicación: Mueves una barra con el mouse para atrapar una bola que cae.
// Si la atrapas, ganas puntos. Si no, se reinicia el juego.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 🔧 Ajustes del lienzo
canvas.width = 400;
canvas.height = 600;

// 🏀 Configuración inicial (ahora manejaremos múltiples bolas)
let balls = [
  {
    x: Math.random() * 380 + 10,
    y: 0,
    radius: 15,
    speed: 3,
    color: "red",
  },
];

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
let mouseX = canvas.width / 2;

// 🔊 Efectos de sonido
const hitSound = new Audio("hit.mp3");
const loseSound = new Audio("lose.mp3");

// 🖱 Evento: mover el mouse
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
});

// ⚙️ Actualizar posición y lógica
function update() {
  catcher.x = mouseX - catcher.width / 2;

  // Mover todas las bolas normales
  balls.forEach((ball) => {
    ball.y += ball.speed;

    // 🧮 Colisión (bola vs catcher)
    if (
      ball.y + ball.radius >= catcher.y &&
      ball.x >= catcher.x &&
      ball.x <= catcher.x + catcher.width
    ) {
      score++;
      hitSound.currentTime = 0;
      hitSound.play();
      resetBall(ball);

      if (score % 5 === 0) ball.speed += 0.5;

      // 💥 NUEVO CAMBIO: cuando el score llega a 10, agregar otra bola
      if (score === 10 && balls.length < 2) {
        balls.push({
          x: Math.random() * 380 + 10,
          y: 0,
          radius: 15,
          speed: 3,
          color: "yellow",
        });
      }
    }

    // 🚫 Si una bola cae fuera del canvas
    if (ball.y > canvas.height) {
      loseSound.currentTime = 0;
      loseSound.play();
      alert(`💀 Game Over! Score: ${score}`);
      score = 0;
      resetGame();
    }
  });

  // Lógica de la bola especial
  if (special_ball.active) {
    special_ball.y += special_ball.speed;
  } else {
    if (Date.now() - special_ball.lastSpawn >= special_ball.spawnInterval) {
      reset_specialBall();
      special_ball.active = true;
      special_ball.lastSpawn = Date.now();
    }
  }

  // Colisión con bola especial
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

  // Si la bola especial cae fuera
  if (special_ball.active && special_ball.y > canvas.height) {
    special_ball.active = false;
    special_ball.lastSpawn = Date.now();
  }
}

// 🔁 Reinicia una bola desde arriba y cambia su color
function resetBall(ball) {
  ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius;
  ball.y = 0;
  const colores = ["red", "blue", "green", "yellow", "orange", "purple", "cyan", "magenta"];
  ball.color = colores[Math.floor(Math.random() * colores.length)];
}

function reset_specialBall() {
  special_ball.x = Math.random() * (canvas.width - special_ball.radius * 2) + special_ball.radius;
  special_ball.y = -special_ball.radius * 2;
}

// 🔁 Reinicia el juego completamente
function resetGame() {
  balls = [
    {
      x: Math.random() * 380 + 10,
      y: 0,
      radius: 15,
      speed: 3,
      color: "red",
    },
  ];
  special_ball.active = false;
  special_ball.lastSpawn = Date.now();
}

// 🎨 Dibujar todo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibuja todas las bolas normales
  balls.forEach((ball) => {
    ctx.beginPath();
    let gradient = ctx.createRadialGradient(ball.x, ball.y, 5, ball.x, ball.y, ball.radius);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, ball.color);
    ctx.fillStyle = gradient;
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });

  // Dibuja el catcher
  ctx.fillStyle = catcher.color;
  ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

  // Dibuja el score
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  // Dibuja la bola especial
  if (special_ball.active) {
    draw_specialBall();
  }
}

function draw_specialBall() {
  ctx.beginPath();
  ctx.arc(special_ball.x, special_ball.y, special_ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = special_ball.color;
  ctx.fill();
}

// 🌀 Bucle del juego
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

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
