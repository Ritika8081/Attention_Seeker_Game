const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Background objects (stars and planets)
const stars = [];
const planets = [];

// Generate stars
for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 0.5
    });
}

// Generate planets
for (let i = 0; i < 5; i++) {
    planets.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 40 + 20,
        speed: Math.random() * 0.5 + 0.1
    });
}

// Update background animation
function updateBackground() {
    // Move stars
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });

    // Move planets
    planets.forEach(planet => {
        planet.y += planet.speed;
        if (planet.y > canvas.height) {
            planet.y = -planet.size;
            planet.x = Math.random() * canvas.width;
        }
    });
}

// Draw background
// Nebula effect variables
let nebulaColor1 = { r: 50, g: 0, b: 150 };  // Deep purple
let nebulaColor2 = { r: 0, g: 0, b: 100 };   // Dark blue
let colorChangeSpeed = 0.3;

// Function to smoothly change nebula colors over time (stays within blue-purple)
function updateNebulaColors() {
    nebulaColor1.r = 50 + Math.sin(Date.now() * 0.0001) * 100; // Varies between 50-150 (purple)
    nebulaColor1.g = 0;  // No green to keep the shades in blue-purple
    nebulaColor1.b = 150 + Math.sin(Date.now() * 0.0002) * 105; // Varies between 150-255 (violet)

    nebulaColor2.r = 0;   // No red to keep it blue-toned
    nebulaColor2.g = 50;  // Adds a bit of purple tint
    nebulaColor2.b = 100 + Math.sin(Date.now() * 0.0003) * 100; // Varies between 100-200
}

// Function to draw nebula gradient background
function drawBackground() {
    updateNebulaColors(); 

    // Create gradient effect
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, `rgb(${Math.abs(nebulaColor1.r) % 255}, ${Math.abs(nebulaColor1.g) % 255}, ${Math.abs(nebulaColor1.b) % 255})`);
    gradient.addColorStop(1, `rgb(${Math.abs(nebulaColor2.r) % 255}, ${Math.abs(nebulaColor2.g) % 255}, ${Math.abs(nebulaColor2.b) % 255})`);
    
    // Apply gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = "white";
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw planets
    ctx.fillStyle = "rgba(100, 100, 255, 0.8)";
    planets.forEach(planet => {
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);
        ctx.fill();
    });
}


// Player spaceship
const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    speed: 5,
    dx: 0,
    dy: 0,
    width: 50,
    height: 50
};

// Load spaceship image and maintain aspect ratio
const spaceshipImg = new Image();
spaceshipImg.src = "assets/spaceship.png";  

spaceshipImg.onload = () => {
    const aspectRatio = spaceshipImg.width / spaceshipImg.height;
    player.width = 150;  
    player.height = player.width / aspectRatio;
};

// Handle player movement
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") player.dx = -player.speed;
    if (event.key === "ArrowRight") player.dx = player.speed;
    if (event.key === "ArrowUp") player.dy = -player.speed;
    if (event.key === "ArrowDown") player.dy = player.speed;
});

document.addEventListener("keyup", () => {
    player.dx = 0;
    player.dy = 0;
});

// Update player position
function updatePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Draw player spaceship
function drawPlayer() {
    if (spaceshipImg.complete) {
        ctx.drawImage(spaceshipImg, player.x, player.y, player.width, player.height);
    }
}

// Enemy system
const enemies = [];

function spawnEnemy() {
    const enemySize = 40;
    enemies.push({
        x: Math.random() * (canvas.width - enemySize),
        y: -enemySize,
        width: enemySize,
        height: enemySize,
        speed: 2
    });
}

function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

function drawEnemies() {
    ctx.fillStyle = "red";
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Bullet system
const bullets = [];

// Function to add a bullet (reused from your spacebar logic)
function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        speed: 5
    });
}

// Expose the function globally so index.html can call it
window.shootBullet = shootBullet;


function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function drawBullets() {
    ctx.fillStyle = "yellow";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Collision detection
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
            }
        });
    });
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateBackground();
    drawBackground();

    updatePlayer();
    updateEnemies();
    updateBullets();
    checkCollisions();

    drawPlayer();
    drawEnemies();
    drawBullets();

    requestAnimationFrame(gameLoop);
}

// Start game
setInterval(spawnEnemy, 2000);
gameLoop();

// Sidebar panel switching logic
window.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('eegSection');
  const icons = sidebar.querySelectorAll('.sidebar-icon');
  const panels = sidebar.querySelectorAll('.sidebar-panel');
  const closeBtns = sidebar.querySelectorAll('.close-panel');

  function openPanel(panelName) {
    sidebar.classList.add('expanded');
    panels.forEach(panel => {
      if (panel.id === 'panel-' + panelName) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
    icons.forEach(icon => {
      if (icon.dataset.panel === panelName) {
        icon.classList.add('active');
      } else {
        icon.classList.remove('active');
      }
    });
  }

  icons.forEach(icon => {
    icon.addEventListener('click', function() {
      const panelName = this.dataset.panel;
      // If already open, close it
      const isActive = this.classList.contains('active');
      if (isActive) {
        sidebar.classList.remove('expanded');
        panels.forEach(panel => panel.classList.remove('active'));
        icons.forEach(ic => ic.classList.remove('active'));
      } else {
        openPanel(panelName);
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      sidebar.classList.remove('expanded');
      panels.forEach(panel => panel.classList.remove('active'));
      icons.forEach(ic => ic.classList.remove('active'));
    });
  });
});
