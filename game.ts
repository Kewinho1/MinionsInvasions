// Configurações principais
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = 1280;
canvas.height = 720;

// Carregar imagens
const playerImg = new Image();
playerImg.src = 'nave.png';  // Certifique-se de que o arquivo esteja no caminho correto

const invaderImg = new Image();
invaderImg.src = 'alien.png'; // Certifique-se de que o arquivo esteja no caminho correto

const backgroundImg = new Image();
backgroundImg.src = 'fundo.avif'; // Carregando a imagem de fundo

// Estado do jogo
let isPlaying = false;  // Controla se o jogo está ativo ou se estamos na tela inicial
let gameOver = false;   // Controla se o jogo foi perdido
let score = 0;          // Pontuação inicial

class Player {
    width: number = 90;
    height: number = 150;
    x: number;
    y: number;
    speed: number = 7;
    lives: number = 3;

    constructor() {
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
    }

    draw() {
        ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
    }

    move(direction: number) {
        this.x += direction * this.speed;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
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
                    endGame();  // Chamar a função que termina o jogo
                }
            }
        });
    }
}

class Invader {
    width: number = 60;
    height: number =70;
    x: number;
    y: number;
    speed: number;
    alive: boolean = true;

    constructor(x: number, speed: number) {
        this.x = x;
        this.y = Math.random() * 100; // Começa em uma posição aleatória no topo da tela
        this.speed = speed;  // Atribuir velocidade de acordo com o nível de dificuldade
    }

    draw() {
        if (this.alive) {
            ctx.drawImage(invaderImg, this.x, this.y, this.width, this.height);
        }
    }

    move() {
        this.y += this.speed; // Inimigo desce lentamente
    }

    checkCollision(bullets: Bullet[]) {
        bullets.forEach((bullet, index) => {
            if (
                bullet.x < this.x + this.width &&
                bullet.x + bullet.width > this.x &&
                bullet.y < this.y + this.height &&
                bullet.height + bullet.y > this.y
            ) {
                // Colisão detectada
                this.alive = false;
                bullets.splice(index, 1); // Remove o tiro que atingiu o invasor

                // Incrementa a pontuação
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

const player = new Player();
let invaders: Invader[] = [];
let bullets: Bullet[] = [];
let invaderSpeed: number = 1;  // Velocidade inicial dos invasores
let spawnRate: number = 1000;  // Intervalo inicial de geração (ms)

// Gerar um único invasor com intervalo
function spawnInvader() {
    if (!isPlaying) return;  // Só gerar inimigos se o jogo estiver ativo

    const randomX = Math.random() * (canvas.width - 40); // X aleatório no canvas
    invaders.push(new Invader(randomX, invaderSpeed));

    // Aumenta a dificuldade gradualmente
    invaderSpeed += 0.1;  // Aumenta a velocidade dos invasores a cada geração
    spawnRate = Math.max(300, spawnRate - 10); // Reduz o tempo entre gerações (não menos de 300ms)

    // Chama a função novamente após um intervalo
    setTimeout(spawnInvader, spawnRate);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha o fundo
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    
    if (isPlaying) {
        player.draw();
        invaders.forEach((invader) => invader.draw());
        bullets.forEach((bullet) => bullet.draw());
        drawScore();  // Exibir a pontuação
    } else if (gameOver) {
        drawGameOverScreen();
    } else {
        drawStartScreen();
    }
}

function update() {
    if (!isPlaying) return;  // Não atualizar o jogo se não estiver jogando

    invaders.forEach((invader) => {
        invader.move();
        invader.checkCollision(bullets); // Verificar colisão com os tiros
        
        // Remover os invasores mortos ou fora da tela
        if (invader.y > canvas.height) {
            invader.alive = false;
        }
    });

    bullets.forEach((bullet, index) => {
        bullet.move();
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });

    // Remover os invasores mortos
    invaders = invaders.filter((invader) => invader.alive);

    // Verificar colisão entre o jogador e os invasores
    player.checkCollision(invaders);
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    isPlaying = true;
    gameOver = false;
    invaders = [];
    bullets = [];
    invaderSpeed = 1;  // Reiniciar a velocidade dos inimigos
    spawnRate = 1000;  // Reiniciar o intervalo de geração

    player.lives = 3;  // Reiniciar vidas do jogador
    score = 0;         // Reiniciar a pontuação

    spawnInvader();    // Iniciar a geração de invasores
}

function endGame() {
    isPlaying = false;
    gameOver = true;
    showStartButton();  // Mostrar o botão de "Jogar Novamente" ao perder
}

function drawStartScreen() {
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black"; // Define a cor da borda
    ctx.lineWidth = 3; // Define a espessura da borda

    ctx.font = "30px Arial";
    ctx.strokeText("Minions Invasions", canvas.width / 2 - 100, canvas.height / 2 - 20);
    ctx.fillText("Minions Invasions", canvas.width / 2 - 100, canvas.height / 2 - 20);

    ctx.font = "20px Arial";
    ctx.strokeText("Clique no botão para iniciar", canvas.width / 2 - 120, canvas.height / 2 + 20);
    ctx.fillText("Clique no botão para iniciar", canvas.width / 2 - 120, canvas.height / 2 + 20);
}

function drawGameOverScreen() {
    ctx.fillStyle = "purple";
    ctx.strokeStyle = "black"; // Define a cor da borda
    ctx.lineWidth = 3; // Define a espessura da borda

    ctx.font = "30px Arial";
    ctx.strokeText("Game Over!", canvas.width / 2 - 80, canvas.height / 2 - 20);
    ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2 - 20);

    ctx.font = "20px Arial";
    ctx.strokeText("Clique no botão para jogar novamente", canvas.width / 2 - 160, canvas.height / 2 + 20);
    ctx.fillText("Clique no botão para jogar novamente", canvas.width / 2 - 160, canvas.height / 2 + 20);
}


// Função para desenhar a pontuação
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Pontuação: " + score, 10, 30);
}

// Controle do jogador
window.addEventListener("keydown", (e) => {
    if (isPlaying) {
        if (e.key === "ArrowLeft") {
            player.move(-1);
        } else if (e.key === "ArrowRight") {
            player.move(1);
        } else if (e.key === " ") {
            bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y));
        }
    }
});

// Criar o botão para iniciar/reiniciar o jogo
const startButton = document.createElement("button");
startButton.innerText = "Jogar";
document.body.appendChild(startButton);

startButton.style.position = "absolute";
startButton.style.top = "650px";  // Posição do botão abaixo do canvas
startButton.style.left = "50%";
startButton.style.transform = "translateX(-50%)";
startButton.style.padding = "10px 20px";
startButton.style.fontSize = "20px";

startButton.addEventListener("click", () => {
    startGame();
    startButton.style.display = "none";  // Esconder o botão quando o jogo começar
});

function showStartButton() {
    startButton.style.display = "block";  // Mostrar o botão de "Jogar Novamente"
}

gameLoop();  // Iniciar o loop do jogo
