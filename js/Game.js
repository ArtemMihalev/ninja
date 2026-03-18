class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        this.gravity = 0.5;
        this.platformSpeed = 3;
        this.score = 0;
        this.gameOver = false;
        this.gameStarted = true;
        
        this.inputHandler = new InputHandler();
        this.renderer = new Renderer(this.canvas, this.ctx);
        this.player = new Player(100, 200, 40, 50);
        
        this.platforms = [];
        this.platformTimer = 0;
        this.platformInterval = 60; // Уменьшил для более частого появления платформ
        
        this.gameLoop = this.gameLoop.bind(this);
    }
    
    init() {
        // Создаём стартовые платформы
        this.platforms.push(new Platform(200, 300, 150, 20, this.platformSpeed));
        this.platforms.push(new Platform(400, 250, 150, 20, this.platformSpeed));
        this.platforms.push(new Platform(600, 200, 150, 20, this.platformSpeed));
        
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.gameOver && this.gameStarted) {
            this.update();
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
        
        // Обновление игрока
        this.player.update(this.gravity);
        
        // Проверка столкновения с землёй (проигрыш)
        if (Collision.checkGroundCollision(this.player, this.canvas.height)) {
            this.gameOver = true;
            document.getElementById('finalScore').textContent = this.score;
            document.getElementById('gameOverlay').classList.add('active');
            document.getElementById('overlayTitle').textContent = 'ИГРА ОКОНЧЕНА';
            document.getElementById('overlayMessage').innerHTML = `Ваш счёт: <span>${this.score}</span>`;
            return;
        }
        
        // Обновление платформ
        for (let i = this.platforms.length - 1; i >= 0; i--) {
            this.platforms[i].update();
            if (!this.platforms[i].active) {
                this.platforms.splice(i, 1);
            }
        }
        
        // Проверка коллизий с платформами
        Collision.handlePlatformCollisions(this.player, this.platforms);
        
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
        const width = Math.random() * 80 + 80; // 80-160 пикселей
        
        // Случайная скорость для разнообразия
        const speed = this.platformSpeed + (Math.random() * 2 - 1);
        
        this.platforms.push(new Platform(
            this.canvas.width,
            y,
            width,
            20,
            Math.max(2, speed) // Не меньше 2
        ));
        
        // Постепенно увеличиваем скорость и частоту
        if (this.score > 500) {
            this.platformSpeed = 5.5;
            this.platformInterval = 50;
        } else if (this.score > 200) {
            this.platformSpeed = 4.5;
            this.platformInterval = 55;
        }
    }
    
    draw() {
        this.renderer.clear();
        this.renderer.drawBackground();
        
        // Рисуем землю (красная линия, символизирующая опасность)
        this.ctx.fillStyle = '#8b0000';
        this.ctx.fillRect(0, this.canvas.height - 5, this.canvas.width, 5);
        
        // Рисуем платформы
        this.platforms.forEach(platform => this.renderer.drawPlatform(platform));
        
        // Рисуем игрока
        this.renderer.drawPlayer(this.player);
        
        // Рисуем счёт
        this.renderer.drawScore(this.score);
    }
    
    restart() {
        this.gameOver = false;
        this.score = 0;
        this.platformSpeed = 3;
        this.platformInterval = 60;
        this.platformTimer = 0;
        this.platforms = [];
        
        this.player = new Player(100, 200, 40, 50);
        
        // Создаём стартовые платформы
        this.platforms.push(new Platform(200, 300, 150, 20, this.platformSpeed));
        this.platforms.push(new Platform(400, 250, 150, 20, this.platformSpeed));
        this.platforms.push(new Platform(600, 200, 150, 20, this.platformSpeed));
        
        document.getElementById('score').textContent = '0';
        document.getElementById('gameOverlay').classList.remove('active');
        
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.gameLoop();
        }
    }
}