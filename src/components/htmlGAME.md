<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Procedurally Generated Platformer</title>
  <style>
    /* 
      Basic styling to remove default margins/padding 
      and give the page a neutral background. 
    */
    html, body {
      margin: 0;
      padding: 0;
      background: #222;
    }

    #gameCanvas {
      display: block;
      margin: 0 auto;
      background: #87CEEB; /* Light sky background for the game */
      border: 2px solid #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      cursor: none; /* We will hide cursor for aesthetic, can remove if desired */
    }

    /* Simple text overlay for instructions and game over message */
    #infoPanel {
      position: absolute;
      top: 10px;
      width: 100%;
      text-align: center;
      color: #fff;
      font-family: sans-serif;
      font-size: 18px;
      user-select: none;
      pointer-events: none;
    }
  </style>
</head>
<body>

  <canvas id="gameCanvas" width="800" height="400"></canvas>
  <div id="infoPanel">
    <p>Use [SPACE] or [UP ARROW] to jump!</p>
  </div>

  <script>
    /************************************************************************
     * Basic parameters and game variables
     ************************************************************************/
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    
    // Player properties
    const player = {
      x: 100,
      y: HEIGHT - 50,  // start near bottom
      width: 30,
      height: 30,
      vy: 0,           // velocity in Y direction
      jumpForce: 10,
      gravity: 0.6
    };
    
    // Platform properties
    const platformMinWidth = 50;
    const platformMaxWidth = 150;
    const platformHeight = 15;
    
    // Platforms container
    let platforms = [];
    
    // Difficulty / Speed settings
    let gameSpeed = 3; // horizontal speed of platforms
    let spawnInterval = 100; // how frequently to spawn a new platform
    let frameCount = 0;      // to keep track of spawn intervals
    
    // Score and game state
    let score = 0;
    let isGameOver = false;

    /************************************************************************
     * Setup input
     ************************************************************************/
    let keys = {
      space: false,
      arrowUp: false
    };
    
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        keys.space = true;
        keys.arrowUp = true;
      }
    });
    
    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        keys.space = false;
        keys.arrowUp = false;
      }
    });
    
    /************************************************************************
     * Game loop
     ************************************************************************/
    function gameLoop() {
      if (isGameOver) {
        drawGameOver();
        return;
      }
      
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }
    
    /************************************************************************
     * Update game logic
     ************************************************************************/
    function update() {
      frameCount++;
      
      // Handle jump
      if ((keys.space || keys.arrowUp) && isOnPlatform(player)) {
        player.vy = -player.jumpForce;
      }
      
      // Apply gravity
      player.vy += player.gravity;
      player.y += player.vy;
      
      // Stop falling if colliding with platform from above
      let collidedPlatform = getCollidingPlatform(player);
      if (collidedPlatform) {
        // Place player on top of the platform
        player.y = collidedPlatform.y - player.height;
        player.vy = 0;
      }
      
      // Spawn new platforms over time for infinite scroll
      if (frameCount % spawnInterval === 0) {
        spawnPlatform();
      }
      
      // Move existing platforms to the left
      for (let plat of platforms) {
        plat.x -= gameSpeed;
      }
      
      // Remove platforms that have gone off-screen
      platforms = platforms.filter(plat => plat.x + plat.width > 0);
      
      // Check if player fell below the canvas
      if (player.y > HEIGHT) {
        isGameOver = true;
      }
      
      // Increase score as time passes
      score++;
      
      // Gradually increase difficulty by incrementing speed
      if (score % 1000 === 0) {
        gameSpeed += 0.5;
      }
    }
    
    /************************************************************************
     * Draw everything
     ************************************************************************/
    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      
      // Draw player
      ctx.fillStyle = '#ff4';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Draw platforms
      ctx.fillStyle = '#4a2';
      for (let plat of platforms) {
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
      }
      
      // Draw score
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText("Score: " + score, 10, 30);
    }
    
    /************************************************************************
     * Utility / Helper functions
     ************************************************************************/
    
    /**
     * Check if player is currently on a platform (standing).
     * We look for collision directly underneath the player (small offset).
     */
    function isOnPlatform(p) {
      // Temporarily move the player slightly downward to check collision
      p.y += 2;
      let colliding = !!getCollidingPlatform(p);
      // Undo that move
      p.y -= 2;
      return colliding;
    }
    
    /**
     * Returns the platform object that the player is colliding with (if any),
     * or null if no collision.
     */
    function getCollidingPlatform(p) {
      for (let plat of platforms) {
        if (
          p.x < plat.x + plat.width &&
          p.x + p.width > plat.x &&
          p.y < plat.y + plat.height &&
          p.y + p.height > plat.y
        ) {
          // We have a collision
          return plat;
        }
      }
      return null;
    }
    
    /**
     * Randomly spawns a new platform on the right side of the screen.
     * The y position is random, and the width is random within given bounds.
     */
    function spawnPlatform() {
      let width = randomRange(platformMinWidth, platformMaxWidth);
      let y = randomRange(HEIGHT / 2, HEIGHT - 30); // roughly in lower half
      platforms.push({
        x: WIDTH + 50, // spawn beyond the right edge
        y: y,
        width: width,
        height: platformHeight
      });
    }
    
    /**
     * Utility function to generate a random integer in [min, max].
     */
    function randomRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    /**
     * Draw a "Game Over" message and final score.
     */
    function drawGameOver() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = '#00000088';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      
      ctx.fillStyle = '#ff4444';
      ctx.font = '50px Arial';
      ctx.textAlign = 'center';
      ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2 - 20);
      
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText("Your Score: " + score, WIDTH / 2, HEIGHT / 2 + 20);
      
      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.fillText("Refresh the page to play again.", WIDTH / 2, HEIGHT / 2 + 50);
    }
    
    /************************************************************************
     * Initialize and start the game
     ************************************************************************/
    function init() {
      // Initial platform to stand on (guarantee player won't fall immediately)
      platforms.push({
        x: 0,
        y: HEIGHT - 10,
        width: WIDTH,
        height: 10
      });
      
      // Start the game loop
      requestAnimationFrame(gameLoop);
    }
    
    init();
  </script>
</body>
</html>
