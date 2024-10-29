var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Função para obter a câmera traseira, se disponível
function getBackCameraStream() {
    return __awaiter(this, void 0, void 0, function () {
        var devices, videoDevices, backCamera, _i, videoDevices_1, device, constraints, stream, video, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, navigator.mediaDevices.enumerateDevices()];
                case 1:
                    devices = _a.sent();
                    videoDevices = devices.filter(function (device) { return device.kind === 'videoinput'; });
                    backCamera = void 0;
                    for (_i = 0, videoDevices_1 = videoDevices; _i < videoDevices_1.length; _i++) {
                        device = videoDevices_1[_i];
                        if (device.label.toLowerCase().includes('back')) {
                            backCamera = device;
                            break; // Encerra o loop assim que encontrar a câmera traseira
                        }
                    }
                    constraints = {
                        video: backCamera ? { deviceId: { exact: backCamera.deviceId } } : true
                    };
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia(constraints)];
                case 2:
                    stream = _a.sent();
                    video = document.getElementById('backgroundVideo');
                    video.srcObject = stream;
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Erro ao acessar a câmera:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Chama a função para iniciar o vídeo
getBackCameraStream();
// Configurações principais
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
//canvas.width = 1280;
//canvas.height = 720;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Carregar imagens dos jogadores
var player1Img = new Image();
player1Img.src = 'nave.png'; // Imagem para o player1
//const player2Img = new Image();
//player2Img.src = 'nave2.png'; // Imagem para o player2
var invaderImg = new Image();
invaderImg.src = 'alien.png';
// Estado do jogo
var isPlaying = false;
var gameOver = false;
var score = 0;
// Estado de teclas para movimento contínuo
var keysPressed = {};
// Adicionar a função de disparo na classe Player
// Atualize a classe Player para receber uma imagem como parâmetro
var Player = /** @class */ (function () {
    function Player(startX, startY, image) {
        this.width = 90;
        this.height = 150;
        this.speed = 7;
        this.lives = 3;
        this.x = startX;
        this.y = startY;
        this.image = image;
    }
    Player.prototype.draw = function () {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
    Player.prototype.move = function (targetX) {
        // Define a nova posição, limitando-a aos limites do canvas
        this.x = targetX;
        // Limita a posição do jogador para que não saia da tela
        if (this.x < 0) {
            this.x = 0; // Impede que o jogador saia pela esquerda
        }
        else if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width; // Impede que o jogador saia pela direita
        }
    };
    Player.prototype.shoot = function () {
        bullets.push(new Bullet(this.x + this.width / 2, this.y));
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
                    endGame();
                }
            }
        });
    };
    return Player;
}());
var touchStartTime = 0; // Para armazenar o tempo do início do toque
var isMoving = false; // Para controlar o estado de movimento suave
// Função movePlayers atualizada para incluir controles de tiro e movimento suave
function movePlayers() {
    document.addEventListener('keydown', function (event) {
        keysPressed[event.key] = true;
        // Controles de tiro
        if (event.key === ' ') { // Barra de espaço para o jogador 1
            player1.shoot();
        }
        if (event.key === 'w') { // Tecla 'w' para o jogador 2
            // player2.shoot(); // Descomente se precisar do tiro para o jogador 2
        }
    });
    document.addEventListener('keyup', function (event) {
        keysPressed[event.key] = false;
    });
    // Evento para detectar o início do toque (touch)
    window.addEventListener('touchstart', function (event) {
        var touchX = event.touches[0].clientX;
        touchStartTime = new Date().getTime(); // Armazena o tempo do início do toque
        // Inicia o movimento suave
        isMoving = true;
        player1.move(touchX);
    });
    // Evento para detectar o fim do toque (touch)
    window.addEventListener('touchend', function () {
        isMoving = false; // Para o movimento suave
        // Se o toque foi curto, considera como um tiro
        var touchEndTime = new Date().getTime();
        if (touchEndTime - touchStartTime < 200) {
            player1.shoot();
        }
    });
    // Evento para detectar o movimento do toque (touch)
    window.addEventListener('touchmove', function (event) {
        if (isMoving) {
            var touchX = event.touches[0].clientX; // Pega a posição X do toque
            player1.move(touchX); // Move o jogador 1 baseado na posição do toque
        }
    });
    // Evento para detectar o movimento do mouse sem necessidade de clique
    window.addEventListener('mousemove', function (event) {
        var mouseX = event.clientX; // Pega a posição X do mouse
        player1.move(mouseX); // Move o jogador 1 baseado na posição do mouse
    });
    // Evento para detectar o início do clique do mouse (opcional, se você quiser manter a lógica de tiro)
    window.addEventListener('mousedown', function () {
        touchStartTime = new Date().getTime(); // Armazena o tempo do início do clique
    });
    // Evento para detectar o fim do clique do mouse (opcional, se você quiser manter a lógica de tiro)
    window.addEventListener('mouseup', function () {
        var mouseEndTime = new Date().getTime();
        // Se o clique foi curto, considera como um tiro
        if (mouseEndTime - touchStartTime < 200) {
            player1.shoot();
        }
    });
}
// Função para iniciar o movimento suave
function startSmoothMove(initialX) {
}
var Invader = /** @class */ (function () {
    function Invader(x, speed) {
        this.width = 60;
        this.height = 70;
        this.alive = true;
        this.x = x;
        this.y = Math.random() * 100;
        this.speed = speed;
    }
    Invader.prototype.draw = function () {
        if (this.alive) {
            ctx.drawImage(invaderImg, this.x, this.y, this.width, this.height);
        }
    };
    Invader.prototype.move = function () {
        this.y += this.speed;
    };
    Invader.prototype.checkCollision = function (bullets) {
        var _this = this;
        bullets.forEach(function (bullet, index) {
            if (bullet.x < _this.x + _this.width &&
                bullet.x + bullet.width > _this.x &&
                bullet.y < _this.y + _this.height &&
                bullet.height + bullet.y > _this.y) {
                _this.alive = false;
                bullets.splice(index, 1);
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
// Inicializando os jogadores com imagens diferentes
var player1 = new Player(canvas.width / 4 - 45, canvas.height - 160, player1Img);
//const player2 = new Player(3 * canvas.width / 4 - 45, canvas.height - 160, player2Img);
var invaders = [];
var bullets = [];
var invaderSpeed = 1;
var spawnRate = 1000;
function spawnInvader() {
    if (!isPlaying)
        return;
    var randomX = Math.random() * (canvas.width - 40);
    invaders.push(new Invader(randomX, invaderSpeed));
    invaderSpeed += 0.1;
    spawnRate = Math.max(300, spawnRate - 10);
    setTimeout(spawnInvader, spawnRate);
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    if (isPlaying) {
        player1.draw();
        //player2.draw();
        invaders.forEach(function (invader) { return invader.draw(); });
        bullets.forEach(function (bullet) { return bullet.draw(); });
        drawScore();
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
        return;
    invaders.forEach(function (invader) {
        invader.move();
        invader.checkCollision(bullets);
    });
    bullets.forEach(function (bullet, index) {
        bullet.move();
        if (bullet.y < 0)
            bullets.splice(index, 1);
    });
    invaders = invaders.filter(function (invader) { return invader.alive; });
    player1.checkCollision(invaders);
    //player2.checkCollision(invaders);
    // Atualizar movimento dos jogadores
    if (keysPressed["ArrowLeft"])
        player1.move(-1);
    if (keysPressed["ArrowRight"])
        player1.move(1);
    // if (keysPressed["a"]) player2.move(-1);
    // if (keysPressed["d"]) player2.move(1);
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
    invaderSpeed = 1; // Reiniciar a velocidade dos inimigos
    spawnRate = 1000; // Reiniciar o intervalo de geração
    player1.lives = 3; // Reiniciar vidas do jogador 1
    //player2.lives = 3;  // Reiniciar vidas do jogador 2
    score = 0; // Reiniciar a pontuação
    backgroundMusic.play(); // Iniciar a música de fundo
    spawnInvader(); // Iniciar a geração de invasores
}
// Função para encerrar o jogo, parando a música de fundo
function endGame() {
    isPlaying = false;
    gameOver = true;
    backgroundMusic.pause(); // Pausar a música de fundo
    backgroundMusic.currentTime = 0; // Reiniciar a música para o início
    showStartButton(); // Mostrar o botão de "Jogar Novamente"
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
document.addEventListener('keyup', function (event) {
    keysPressed[event.key] = false;
});
// Criar o botão para iniciar/reiniciar o jogo
var startButton = document.createElement("button");
startButton.innerText = "Jogar";
document.body.appendChild(startButton);
startButton.style.position = "absolute";
startButton.style.top = "650px";
startButton.style.left = "50%";
startButton.style.transform = "translateX(-50%)";
startButton.style.padding = "10px 20px";
startButton.style.fontSize = "20px";
startButton.style.zIndex = '3';
startButton.addEventListener("click", function () {
    startGame();
    startButton.style.display = "none";
});
function showStartButton() {
    startButton.style.display = "block";
}
// Carregar a música de fundo
var backgroundMusic = new Audio('musica_de_fundo.mp3');
backgroundMusic.loop = true; // Definir para tocar em loop
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
movePlayers(); // Iniciar detecção de teclas para movimento
gameLoop();
