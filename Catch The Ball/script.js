// 🎮 Juego: Catch the Ball
// Explicación: Mueves una barra con el mouse para atrapar una bola que cae.
// Si la atrapas, ganas puntos. Si no, se reinicia el juego.

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
  // added control properties:
  active: false,                 // si la bola especial está visible/activa
  spawnInterval: 10000,          // tiempo entre apariciones en ms (ej. 10000 = 10s)
  lastSpawn: Date.now(),         // timestamp del último intento de spawn
};

// 🧍 Control del jugador (la barra)
let catcher = {
  width: 80,
  height: 10,
  x: canvas.width / 2 - 40, // Centrado al inicio
  y: canvas.height - 40,
  color: "white",
};

let score = 0;
let mouseX = canvas.width / 2;

// 🔊 Efectos de sonido
const hitSound = new Audio("hit.mp3");   // cuando la bola toca la barra
const loseSound = new Audio("lose.mp3"); // cuando el jugador pierde

// 🖱 Evento: mover el mouse
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
});

// ⚙️ Actualizar posición y lógica
function update() {
  // Mueve la bola
  ball.y += ball.speed;

  // special_ball solo se actualiza si está activa
  if (special_ball.active) {
    special_ball.y += special_ball.speed;
  } else {
    // comprobar si es momento de reaparecer la bola especial
    if (Date.now() - special_ball.lastSpawn >= special_ball.spawnInterval) {
      // activar y posicionar la bola especial
      reset_specialBall();
      special_ball.active = true;
      special_ball.lastSpawn = Date.now();
    }
  }

  // Actualiza la posición del catcher
  catcher.x = mouseX - catcher.width / 2;

  // 🧮 Detección de colisión (bola vs catcher)
  if (
    ball.y + ball.radius >= catcher.y &&
    ball.x >= catcher.x &&
    ball.x <= catcher.x + catcher.width
  ) {
    score++;
    hitSound.currentTime = 0;
    hitSound.play();
    resetBall();

    // Aumenta un poco la dificultad cada 5 puntos
    if (score % 5 === 0) ball.speed += 0.5;
  }

  // Colisión special_ball solo si está activa
  if (special_ball.active &&
    special_ball.y + special_ball.radius >= catcher.y &&
    special_ball.x >= catcher.x &&
    special_ball.x <= catcher.x + catcher.width
  ) {
    score += 10;
    // al atraparla, desactivarla y programar el siguiente spawn
    special_ball.active = false;
    special_ball.lastSpawn = Date.now();
    // opcional: reiniciar posición para la próxima vez
    reset_specialBall();
  }

  // 🚫 Si la bola cae fuera del canvas
  if (ball.y > canvas.height) {
    loseSound.currentTime = 0;
    loseSound.play();
    alert(`💀 Game Over! Score: ${score}`);
    score = 0;
    ball.speed = 3;
    resetBall();
  }

  // Si la special_ball sale del canvas, desactivarla y programar reaparición
  if (special_ball.active && special_ball.y > canvas.height) {
    special_ball.active = false;
    special_ball.lastSpawn = Date.now();
  }
}

// 🔁 Reinicia la bola desde arriba y cambia color
function resetBall() {
  ball.x = Math.random() * (canvas.width - ball.radius * 2) + ball.radius;
  ball.y = 0;

  // 🎨 Cambiar color aleatorio cada vez que reinicia
  const colores = ["red", "blue", "green", "yellow", "orange", "purple", "cyan", "magenta"];
  ball.color = colores[Math.floor(Math.random() * colores.length)];
}

function reset_specialBall() {
  special_ball.x = Math.random() * (canvas.width - special_ball.radius * 2) + special_ball.radius;
  special_ball.y = -special_ball.radius * 2; // empezar justo encima del canvas para que aparezca "desde arriba"
  // no activar aquí; la activación la controla update() (pero mantener función para reutilizar)
}

// 🎨 Dibujar todo en pantalla
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🏷️ Título del juego
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("🎮 Catch the Ball", canvas.width / 2, 40);
  ctx.textAlign = "left"; // volver a alineación normal

  // Dibuja la bola con gradiente
  ctx.beginPath();
  let gradient = ctx.createRadialGradient(ball.x, ball.y, 5, ball.x, ball.y, ball.radius);
  gradient.addColorStop(0, "white");
  gradient.addColorStop(1, ball.color);
  ctx.fillStyle = gradient;
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Dibuja el catcher
  ctx.fillStyle = catcher.color;
  ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

  // Dibuja el score
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  // dibujar special_ball solo si está activa
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
  // intenta reproducir y pausar ambos para desbloquearlos
  hitSound.play().then(() => {
    hitSound.pause();
    hitSound.currentTime = 0;
  }).catch(() => {});
  
  loseSound.play().then(() => {
    loseSound.pause();
    loseSound.currentTime = 0;
  }).catch(() => {});

  // arranca el juego
  gameLoop();

  // quita el listener
  window.removeEventListener("click", enableAudio);
  window.removeEventListener("keydown", enableAudio);
}

// Espera una interacción real del usuario
window.addEventListener("click", enableAudio);
window.addEventListener("keydown", enableAudio);
