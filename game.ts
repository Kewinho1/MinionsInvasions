// Configurações principais
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = 1280;
canvas.height = 720;

// Carregar imagens dos jogadores
const player1Img = new Image();
player1Img.src = 'nave.png'; // Imagem para o player1

const player2Img = new Image();
player2Img.src = 'nave2.png'; // Imagem para o player2

const invaderImg = new Image();
invaderImg.src = 'alien.png';

const backgroundImg = new Image();
backgroundImg.src = 'fundo.avif';

// Estado do jogo
let isPlaying = false;
let gameOver = false;
let score = 0;

// Estado de teclas para movimento contínuo
const keysPressed: { [key: string]: boolean } = {};

// Adicionar a função de disparo na classe Player
// Atualize a classe Player para receber uma imagem como parâmetro
class Player {
    width: number = 90;
    height: number = 150;
    x: number;
    y: number;
    speed: number = 7;
    lives: number = 3;
    image: HTMLImageElement;

    constructor(startX: number, startY: number, image: HTMLImageElement) {
        this.x = startX;
        this.y = startY;
        this.image = image;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(direction: number) {
        this.x += direction * this.speed;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    }

    shoot() {
        bullets.push(new Bullet(this.x + this.width / 2, this.y));
    }

    checkCollision(invaders: Invader[]) {
        invaders.forEach((invader) => {
            if (
                this.x < invader.x + invader.width &&
                this.x + this.width > invader.x &&
                this.y < invader.y + invader.height &&
                this.height + this.y > invader.y
            ) {
                this.lives--;
                console.log("Colisão com invasor! Vidas restantes:", this.lives);
                if (this.lives <= 0) {
                    endGame();
                }
            }
        });
    }
}


// Função movePlayers atualizada para incluir controles de tiro
function movePlayers() {
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;

        // Controles de tiro
        if (event.key === ' ') {  // Barra de espaço para o jogador 1
            player1.shoot();
        }
        if (event.key === 'w') {  // Tecla 'w' para o jogador 2
            player2.shoot();
        }
    });

    document.addEventListener('keyup', (event) => {
        keysPressed[event.key] = false;
    });
}

class Invader {
    width: number = 60;
    height: number = 70;
    x: number;
    y: number;
    speed: number;
    alive: boolean = true;

    constructor(x: number, speed: number) {
        this.x = x;
        this.y = Math.random() * 100;
        this.speed = speed;
    }

    draw() {
        if (this.alive) {
            ctx.drawImage(invaderImg, this.x, this.y, this.width, this.height);
        }
    }

    move() {
        this.y += this.speed;
    }

    checkCollision(bullets: Bullet[]) {
        bullets.forEach((bullet, index) => {
            if (
                bullet.x < this.x + this.width &&
                bullet.x + bullet.width > this.x &&
                bullet.y < this.y + this.height &&
                bullet.height + bullet.y > this.y
            ) {
                this.alive = false;
                bullets.splice(index, 1);
                score += 100;
            }
        });
    }
}

class Bullet {
    width: number = 5;
    height: number = 10;
    x: number;
    y: number;
    speed: number = 10;
    color: string = "cyan";

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.y -= this.speed;
    }
}

// Inicializando os jogadores com imagens diferentes
const player1 = new Player(canvas.width / 4 - 45, canvas.height - 160, player1Img);
const player2 = new Player(3 * canvas.width / 4 - 45, canvas.height - 160, player2Img);

let invaders: Invader[] = [];
let bullets: Bullet[] = [];
let invaderSpeed: number = 1;
let spawnRate: number = 1000;

function spawnInvader() {
    if (!isPlaying) return;

    const randomX = Math.random() * (canvas.width - 40);
    invaders.push(new Invader(randomX, invaderSpeed));
    invaderSpeed += 0.1;
    spawnRate = Math.max(300, spawnRate - 10);

    setTimeout(spawnInvader, spawnRate);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    if (isPlaying) {
        player1.draw();
        player2.draw();
        invaders.forEach((invader) => invader.draw());
        bullets.forEach((bullet) => bullet.draw());
        drawScore();
    } else if (gameOver) {
        drawGameOverScreen();
    } else {
        drawStartScreen();
    }
}

function update() {
    if (!isPlaying) return;

    invaders.forEach((invader) => {
        invader.move();
        invader.checkCollision(bullets);
    });

    bullets.forEach((bullet, index) => {
        bullet.move();
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    invaders = invaders.filter((invader) => invader.alive);
    player1.checkCollision(invaders);
    player2.checkCollision(invaders);

    // Atualizar movimento dos jogadores
    if (keysPressed["ArrowLeft"]) player1.move(-1);
    if (keysPressed["ArrowRight"]) player1.move(1);
    if (keysPressed["a"]) player2.move(-1);
    if (keysPressed["d"]) player2.move(1);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Função para iniciar o jogo, agora incluindo a música de fundo
function startGame() {
    isPlaying = true;
    gameOver = false;
    invaders = [];
    bullets = [];
    invaderSpeed = 1;  // Reiniciar a velocidade dos inimigos
    spawnRate = 1000;  // Reiniciar o intervalo de geração

    player1.lives = 3;  // Reiniciar vidas do jogador 1
    player2.lives = 3;  // Reiniciar vidas do jogador 2
    score = 0;          // Reiniciar a pontuação

    backgroundMusic.play(); // Iniciar a música de fundo
    spawnInvader();         // Iniciar a geração de invasores
}


// Função para encerrar o jogo, parando a música de fundo
function endGame() {
    isPlaying = false;
    gameOver = true;
    backgroundMusic.pause(); // Pausar a música de fundo
    backgroundMusic.currentTime = 0; // Reiniciar a música para o início

    showStartButton();  // Mostrar o botão de "Jogar Novamente"
}

function drawStartScreen() {
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    ctx.font = "30px Arial";
    ctx.strokeText("Minions Invasions", canvas.width / 2 - 100, canvas.height / 2 - 20);
    ctx.fillText("Minions Invasions", canvas.width / 2 - 100, canvas.height / 2 - 20);

    ctx.font = "20px Arial";
    ctx.strokeText("Clique no botão para iniciar", canvas.width / 2 - 120, canvas.height / 2 + 20);
    ctx.fillText("Clique no botão para iniciar", canvas.width / 2 - 120, canvas.height / 2 + 20);
}

function drawGameOverScreen() {
    ctx.fillStyle = "purple";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    ctx.font = "30px Arial";
    ctx.strokeText("Game Over!", canvas.width / 2 - 80, canvas.height / 2 - 20);
    ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2 - 20);

    ctx.font = "20px Arial";
    ctx.strokeText("Clique no botão para jogar novamente", canvas.width / 2 - 160, canvas.height / 2 + 20);
    ctx.fillText("Clique no botão para jogar novamente", canvas.width / 2 - 160, canvas.height / 2 + 20);
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Pontuação: " + score, 10, 30);
}

    // Detectar quando uma tecla é solta
    document.addEventListener('keyup', (event) => {
        keysPressed[event.key] = false;
    });


// Criar o botão para iniciar/reiniciar o jogo
const startButton = document.createElement("button");
startButton.innerText = "Jogar";
document.body.appendChild(startButton);

startButton.style.position = "absolute";
startButton.style.top = "650px";
startButton.style.left = "50%";
startButton.style.transform = "translateX(-50%)";
startButton.style.padding = "10px 20px";
startButton.style.fontSize = "20px";

startButton.addEventListener("click", () => {
    startGame();
    startButton.style.display = "none";
});

function showStartButton() {
    startButton.style.display = "block";
}

// Carregar a música de fundo
const backgroundMusic = new Audio('musica_de_fundo.mp3');
backgroundMusic.loop = true; // Definir para tocar em loop

movePlayers(); // Iniciar detecção de teclas para movimento
gameLoop();