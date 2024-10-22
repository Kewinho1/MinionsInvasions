// Configurações principais
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
canvas.width = 1280;
canvas.height = 720;
// Carregar imagens
var playerImg = new Image();
playerImg.src = 'nave.png'; // Certifique-se de que o arquivo esteja no caminho correto
var invaderImg = new Image();
invaderImg.src = 'alien.png'; // Certifique-se de que o arquivo esteja no caminho correto
var backgroundImg = new Image();
backgroundImg.src = 'fundo.avif'; // Carregando a imagem de fundo
// Estado do jogo
var isPlaying = false; // Controla se o jogo está ativo ou se estamos na tela inicial
var gameOver = false; // Controla se o jogo foi perdido
var score = 0; // Pontuação inicial
var Player = /** @class */ (function () {
    function Player() {
        this.width = 90;
        this.height = 150;
        this.speed = 7;
        this.lives = 3;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
    }
    Player.prototype.draw = function () {
        ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
    };
    Player.prototype.move = function (direction) {
        this.x += direction * this.speed;
        if (this.x < 0)
            this.x = 0;
        if (this.x + this.width > canvas.width)
            this.x = canvas.width - this.width;
    };
    Player.prototype.checkCollision = function (invaders) {
        var _this = this;
        invaders.forEach(function (invader) {
            if (_this.x < invader.x + invader.width &&
                _this.x + _this.width > invader.x &&
                _this.y < invader.y + invader.height &&
                _this.height + _this.y > invader.y) {
                _this.lives--;
                console.log("Colisão com invasor! Vidas restantes:", _this.lives);
                if (_this.lives <= 0) {
                    endGame(); // Chamar a função que termina o jogo
                }
            }
        });
    };
    return Player;
}());
var Invader = /** @class */ (function () {
    function Invader(x, speed) {
        this.width = 60;
        this.height = 70;
        this.alive = true;
        this.x = x;
        this.y = Math.random() * 100; // Começa em uma posição aleatória no topo da tela
        this.speed = speed; // Atribuir velocidade de acordo com o nível de dificuldade
    }
    Invader.prototype.draw = function () {
        if (this.alive) {
            ctx.drawImage(invaderImg, this.x, this.y, this.width, this.height);
        }
    };
    Invader.prototype.move = function () {
        this.y += this.speed; // Inimigo desce lentamente
    };
    Invader.prototype.checkCollision = function (bullets) {
        var _this = this;
        bullets.forEach(function (bullet, index) {
            if (bullet.x < _this.x + _this.width &&
                bullet.x + bullet.width > _this.x &&
                bullet.y < _this.y + _this.height &&
                bullet.height + bullet.y > _this.y) {
                // Colisão detectada
                _this.alive = false;
                bullets.splice(index, 1); // Remove o tiro que atingiu o invasor
                // Incrementa a pontuação
                score += 100;
            }
        });
    };
    return Invader;
}());
var Bullet = /** @class */ (function () {
    function Bullet(x, y) {
        this.width = 5;
        this.height = 10;
        this.speed = 10;
        this.color = "cyan";
        this.x = x;
        this.y = y;
    }
    Bullet.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    Bullet.prototype.move = function () {
        this.y -= this.speed;
    };
    return Bullet;
}());
var player = new Player();
var invaders = [];
var bullets = [];
var invaderSpeed = 1; // Velocidade inicial dos invasores
var spawnRate = 1000; // Intervalo inicial de geração (ms)
// Gerar um único invasor com intervalo
function spawnInvader() {
    if (!isPlaying)
        return; // Só gerar inimigos se o jogo estiver ativo
    var randomX = Math.random() * (canvas.width - 40); // X aleatório no canvas
    invaders.push(new Invader(randomX, invaderSpeed));
    // Aumenta a dificuldade gradualmente
    invaderSpeed += 0.1; // Aumenta a velocidade dos invasores a cada geração
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
        invaders.forEach(function (invader) { return invader.draw(); });
        bullets.forEach(function (bullet) { return bullet.draw(); });
        drawScore(); // Exibir a pontuação
    }
    else if (gameOver) {
        drawGameOverScreen();
    }
    else {
        drawStartScreen();
    }
}
function update() {
    if (!isPlaying)
        return; // Não atualizar o jogo se não estiver jogando
    invaders.forEach(function (invader) {
        invader.move();
        invader.checkCollision(bullets); // Verificar colisão com os tiros
        // Remover os invasores mortos ou fora da tela
        if (invader.y > canvas.height) {
            invader.alive = false;
        }
    });
    bullets.forEach(function (bullet, index) {
        bullet.move();
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
    // Remover os invasores mortos
    invaders = invaders.filter(function (invader) { return invader.alive; });
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
    invaderSpeed = 1; // Reiniciar a velocidade dos inimigos
    spawnRate = 1000; // Reiniciar o intervalo de geração
    player.lives = 3; // Reiniciar vidas do jogador
    score = 0; // Reiniciar a pontuação
    spawnInvader(); // Iniciar a geração de invasores
}
function endGame() {
    isPlaying = false;
    gameOver = true;
    showStartButton(); // Mostrar o botão de "Jogar Novamente" ao perder
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
window.addEventListener("keydown", function (e) {
    if (isPlaying) {
        if (e.key === "ArrowLeft") {
            player.move(-1);
        }
        else if (e.key === "ArrowRight") {
            player.move(1);
        }
        else if (e.key === " ") {
            bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y));
        }
    }
});
// Criar o botão para iniciar/reiniciar o jogo
var startButton = document.createElement("button");
startButton.innerText = "Jogar";
document.body.appendChild(startButton);
startButton.style.position = "absolute";
startButton.style.top = "650px"; // Posição do botão abaixo do canvas
startButton.style.left = "50%";
startButton.style.transform = "translateX(-50%)";
startButton.style.padding = "10px 20px";
startButton.style.fontSize = "20px";
startButton.addEventListener("click", function () {
    startGame();
    startButton.style.display = "none"; // Esconder o botão quando o jogo começar
});
function showStartButton() {
    startButton.style.display = "block"; // Mostrar o botão de "Jogar Novamente"
}
gameLoop(); // Iniciar o loop do jogo
