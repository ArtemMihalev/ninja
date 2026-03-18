class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        this.gravity = 0.5;
        this.platformSpeed = 2;
        this.score = 0;
        this.gameOver = false;
        this.gameStarted = true;
        
        this.inputHandler = new InputHandler();
        this.renderer = new Renderer(this.canvas, this.ctx);
        
        // Сначала создаём платформы
        this.platforms = [];
        this.createInitialPlatforms();
        
        // Потом создаём игрока на первой платформе
        this.player = this.createPlayerOnPlatform();
        
        this.platformTimer = 0;
        this.platformInterval = 60;
        
        this.gameLoop = this.gameLoop.bind(this);
    }
    
    // Добавьте этот метод после constructor, перед createInitialPlatforms()
reset() {
    // Полный сброс игры
    this.gameOver = false;
    this.score = 0;
    this.platformSpeed = 2; // Убедитесь, что здесь тоже 2
    this.platformInterval = 60;
    this.platformTimer = 0;
    
    // Очищаем платформы
    this.platforms = [];
    
    // Создаём новые платформы (теперь с фиксированной медленной скоростью)
    this.createInitialPlatforms();
    
    // Создаём нового игрока
    this.player = this.createPlayerOnPlatform();
    
    // Обновляем UI
    document.getElementById('score').textContent = '0';
    document.getElementById('finalScore').textContent = '0';
    document.getElementById('gameOverlay').classList.remove('active');
}

    createInitialPlatforms() {
        // Стартовые платформы ещё медленнее для лёгкого начала
this.platforms.push(new Platform(250, 320, 180, 20, 1.5)); // Фиксированная медленная скорость
this.platforms.push(new Platform(500, 250, 150, 20, 1.5));
this.platforms.push(new Platform(700, 300, 140, 20, 1.5));
    }
    
    createPlayerOnPlatform() {
        // Находим самую нижнюю платформу для старта
        let startPlatform = this.platforms[0]; // По умолчанию первая
        
        // Ищем платформу, на которой удобно стоять (средняя высота)
        for (let platform of this.platforms) {
            if (platform.y > 250 && platform.y < 350) {
                startPlatform = platform;
                break;
            }
        }
        
        // Создаём игрока прямо на платформе
        const playerX = startPlatform.x + 50; // Немного правее левого края платформы
        const playerY = startPlatform.y - 50; // Ставим прямо на платформу (высота игрока 50)
        const player = new Player(playerX, playerY, 40, 50);
        
        // Важно: устанавливаем grounded = true, чтобы игрок стоял на платформе
        player.grounded = true;
        player.velocityY = 0;
        
        return player;
    }
    
    init() {
        this.gameLoop();
    }
    
    gameLoop() {
    if (this.gameStarted) {
        if (!this.gameOver) {
            this.update();
        }
        this.draw();
        requestAnimationFrame(this.gameLoop);
    }
}
    
    update() {
        // Обработка ввода
        if (this.inputHandler.isLeftPressed()) {
            this.player.moveLeft();
        } else if (this.inputHandler.isRightPressed()) {
            this.player.moveRight();
        } else {
            this.player.stop();
        }
        
        if (this.inputHandler.isUpPressed()) {
            this.player.jump();
        }
        
        // Сохраняем позицию до обновления для проверки
        const oldY = this.player.y;
        
        // Обновление игрока
        this.player.update(this.gravity);
        
        // Проверка коллизий с платформами (важно делать после обновления)
        Collision.handlePlatformCollisions(this.player, this.platforms);
        
        // Проверка падения с платформы
        if (!this.player.grounded && this.player.velocityY > 0) {
            // Игрок падает - проверяем, есть ли платформа под ним
            let platformBelow = false;
            const playerBottom = this.player.y + this.player.height;
            
            for (let platform of this.platforms) {
                if (!platform.active) continue;
                
                // Проверяем, есть ли платформа прямо под игроком
                if (playerBottom <= platform.y && 
                    playerBottom + 10 >= platform.y && // Небольшой запас
                    this.player.x + this.player.width > platform.x &&
                    this.player.x < platform.x + platform.width) {
                    platformBelow = true;
                    break;
                }
            }
            
            // Если нет платформы под игроком, он может упасть
            if (!platformBelow && this.player.y > 350) {
                // Слишком низко - скоро упадёт на землю
            }
        }
        
        // Проверка столкновения с землёй (проигрыш)
        // Проверка столкновения с землёй (проигрыш)
        // Проверка столкновения с землёй (проигрыш)
        if (Collision.checkGroundCollision(this.player, this.canvas.height)) {
            this.gameOver = true;
            document.getElementById('finalScore').textContent = this.score;
            document.getElementById('gameOverlay').classList.add('active');
            return; // Важно: выходим из update, но не останавливаем игру полностью
        }
        
        // Обновление платформ
        for (let i = this.platforms.length - 1; i >= 0; i--) {
            this.platforms[i].update();
            if (!this.platforms[i].active) {
                this.platforms.splice(i, 1);
            }
        }
        
        // Генерация новых платформ
        this.platformTimer++;
        if (this.platformTimer >= this.platformInterval) {
            this.platformTimer = 0;
            this.generatePlatform();
        }
        
        // Увеличение счёта
        this.score++;
        document.getElementById('score').textContent = this.score;
    }
    
    generatePlatform() {
        const minY = 150;
        const maxY = 350;
        const y = Math.random() * (maxY - minY) + minY;
        const width = Math.random() * 80 + 80;
        
        // Случайная скорость для разнообразия
        // Меньше разброс скорости между платформами
const speed = this.platformSpeed + (Math.random() * 1 - 0.5); // Было +-1, стало +-0.5
        
        this.platforms.push(new Platform(
            this.canvas.width,
            y,
            width,
            20,
            Math.max(2, speed)
        ));
        
        // Постепенно увеличиваем скорость и частоту
        // Постепенно увеличиваем скорость (более плавно и медленно)
        if (this.score > 1000) {
            this.platformSpeed = 3.5; // Было 5.5
            this.platformInterval = 45;
        } else if (this.score > 600) {
            this.platformSpeed = 3.0; // Было 4.5
            this.platformInterval = 50;
        } else if (this.score > 300) {
            this.platformSpeed = 2.5; // Было 4.5
            this.platformInterval = 55;
        }
    }
    
    draw() {
        this.renderer.clear();
        this.renderer.drawBackground();
        
        // Рисуем землю (красная линия)
        this.ctx.fillStyle = '#8b0000';
        this.ctx.fillRect(0, this.canvas.height - 5, this.canvas.width, 5);
        
        // Рисуем платформы
        this.platforms.forEach(platform => this.renderer.drawPlatform(platform));
        
        // Рисуем игрока
        this.renderer.drawPlayer(this.player);
        
        // Рисуем счёт
        this.renderer.drawScore(this.score);
        
        // Отладочная информация (можно убрать потом)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Grounded: ${this.player.grounded}`, 10, 20);
        this.ctx.fillText(`Y: ${Math.round(this.player.y)}`, 10, 40);
    }
    
    restart() {
    this.reset();
    console.log('Игра перезапущена через restart');
}
}