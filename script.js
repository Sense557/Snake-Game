const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scale = 20;
const rows = canvas.height / scale;
const cols = canvas.width / scale;

let snake;
let direction;
let food;
let score;
let gameOver;
let gamePaused;
let level;
let speed;
let gameInterval;
let theme;

function initializeGame() {
    snake = [{ x: 2 * scale, y: 2 * scale }];
    direction = 'RIGHT';
    food = { x: 5 * scale, y: 5 * scale };
    score = 0;
    gameOver = false;
    gamePaused = false;
    level = 1;
    speed = 200;
    theme = 'default';

    // Reset canvas and score
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('score').textContent = 'Score: ' + score;

    // Draw initial game state
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, scale, scale));
    
    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, scale, scale);
    
    // Draw the score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, canvas.height - 10);
}

function update() {
    if (gameOver || gamePaused) return;
    
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'UP':
            head.y -= scale;
            break;
        case 'DOWN':
            head.y += scale;
            break;
        case 'LEFT':
            head.x -= scale;
            break;
        case 'RIGHT':
            head.x += scale;
            break;
    }
    
    if (head.x === food.x && head.y === food.y) {
        score++;
        snake.unshift(head);
        generateFood();
    } else {
        snake.unshift(head);
        snake.pop();
    }
    
    if (checkCollision()) {
        gameOver = true;
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * cols) * scale,
        y: Math.floor(Math.random() * rows) * scale
    };
}

function checkCollision() {
    const head = snake[0];
    
    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    
    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function changeDirection(event) {
    const key = event.key;
    if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

function gameLoop() {
    if (!gameOver && !gamePaused) {
        update();
        draw();
    }
}

function startGame() {
    if (!gameOver) {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    }
}

function pauseGame() {
    gamePaused = true;
}

function resumeGame() {
    if (!gameOver) {
        gamePaused = false;
    }
}

function restartGame() {
    clearInterval(gameInterval);
    initializeGame();
    startGame();
}

function changeLevel() {
    const levelSelect = document.getElementById('level');
    level = parseInt(levelSelect.value);
    speed = 200 - (level - 1) * 50; // Adjust speed based on level
    if (!gameOver && !gamePaused) {
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    }
}

function changeTheme() {
    const themeSelect = document.getElementById('theme');
    theme = themeSelect.value;
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
}

document.getElementById('start').addEventListener('click', startGame);
document.getElementById('pause').addEventListener('click', pauseGame);
document.getElementById('resume').addEventListener('click', resumeGame);
document.getElementById('restart').addEventListener('click', restartGame);
document.getElementById('level').addEventListener('change', changeLevel);
document.getElementById('theme').addEventListener('change', changeTheme);
document.addEventListener('keydown', changeDirection);

// Initialize game
initializeGame();
startGame();
