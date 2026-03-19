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
    
    reset() {
        this.gameOver = false;
        this.score = 0;
        this.platformSpeed = 2;
        this.platformInterval = 60;
        this.platformTimer = 0;
        
        this.platforms = [];
        this.createInitialPlatforms();
        this.player = this.createPlayerOnPlatform();
        
        document.getElementById('score').textContent = '0';
        document.getElementById('finalScore').textContent = '0';
        document.getElementById('gameOverlay').classList.remove('active');
    }

    createInitialPlatforms() {
        this.platforms = [];
        
        // Создаём платформы с большим вертикальным расстоянием
        this.platforms.push(new Platform(200, 320, 180, 20, 1.5));  // Нижняя
        this.platforms.push(new Platform(400, 240, 160, 20, 1.5));  // Средняя (выше на 80px)
        this.platforms.push(new Platform(600, 150, 170, 20, 1.5));  // Верхняя (выше на 90px)
    }
    
    createPlayerOnPlatform() {
        let startPlatform = this.platforms[0];
        
        for (let platform of this.platforms) {
            if (platform.y > 250 && platform.y < 350) {
                startPlatform = platform;
                break;
            }
        }
        
        const playerX = startPlatform.x + 50;
        const playerY = startPlatform.y - 50;
        const player = new Player(playerX, playerY, 40, 50);
        
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
        
        // Проверка коллизий с платформами
        Collision.handlePlatformCollisions(this.player, this.platforms);
        
        // Проверка столкновения с землёй
        if (Collision.checkGroundCollision(this.player, this.canvas.height)) {
            this.gameOver = true;
            document.getElementById('finalScore').textContent = this.score;
            document.getElementById('gameOverlay').classList.add('active');
            return;
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
    const minY = 120;
    const maxY = 350;
    
    let y;
    let attempts = 0;
    let validPositionFound = false;
    
    // Сохраняем занятые высоты
    const occupiedHeights = new Set();
    this.platforms.forEach(p => {
        // Округляем до ближайших 20 пикселей для группировки
        const heightGroup = Math.round(p.y / 20) * 20;
        occupiedHeights.add(heightGroup);
    });
    
    while (!validPositionFound && attempts < 100) {
        // Генерируем высоту с шагом 20 пикселей для более равномерного распределения
        y = Math.round((Math.random() * (maxY - minY) + minY) / 20) * 20;
        
        validPositionFound = true;
        
        // Проверяем, не занята ли эта высота или соседние
        for (let h of occupiedHeights) {
            if (Math.abs(h - y) < 40) { // Минимальное расстояние 40 пикселей
                validPositionFound = false;
                break;
            }
        }
        
        // Дополнительная проверка для уже существующих платформ
        for (let platform of this.platforms) {
            // Вертикальное расстояние не менее 40 пикселей
            if (Math.abs(platform.y - y) < 40) {
                validPositionFound = false;
                break;
            }
            
            // Горизонтальное расстояние для платформ на похожей высоте
            if (Math.abs(platform.y - y) < 60) {
                const horizontalDistance = Math.abs(platform.x - this.canvas.width);
                if (horizontalDistance < 200) {
                    validPositionFound = false;
                    break;
                }
            }
        }
        
        attempts++;
    }
    
    if (!validPositionFound) {
        // Если не нашли идеальную позицию, выбираем случайную
        y = Math.round((Math.random() * (maxY - minY) + minY) / 20) * 20;
        
        // Но гарантируем, что она не совпадает с существующими
        let safetyAttempts = 0;
        while (safetyAttempts < 20) {
            let conflict = false;
            for (let platform of this.platforms) {
                if (Math.abs(platform.y - y) < 30) {
                    conflict = true;
                    y = Math.round((Math.random() * (maxY - minY) + minY) / 20) * 20;
                    break;
                }
            }
            if (!conflict) break;
            safetyAttempts++;
        }
    }
    
    // Ограничиваем Y
    y = Math.max(minY, Math.min(maxY, y));
    
    // Уменьшаем ширину, чтобы платформы не сливались
    const width = Math.random() * 70 + 80; // 80-150 пикселей (было больше)
    
    let speed = this.platformSpeed + (Math.random() * 0.8 - 0.2);
    speed = Math.max(2, Math.min(4, speed)); // Ограничиваем максимальную скорость
    
    this.platforms.push(new Platform(
        this.canvas.width,
        y,
        width,
        20,
        speed
    ));
    
    // Более плавное увеличение скорости
    if (this.score > 1000) {
        this.platformSpeed = 3.2;
        this.platformInterval = 50;
    } else if (this.score > 600) {
        this.platformSpeed = 2.9;
        this.platformInterval = 55;
    } else if (this.score > 300) {
        this.platformSpeed = 2.6;
        this.platformInterval = 60;
    } else if (this.score > 150) {
        this.platformSpeed = 2.3;
        this.platformInterval = 65;
    } else {
        this.platformSpeed = 2.0;
        this.platformInterval = 70;
    }
}
    
    draw() {
        this.renderer.clear();
        this.renderer.drawBackground();
        
        this.ctx.fillStyle = '#8b0000';
        this.ctx.fillRect(0, this.canvas.height - 5, this.canvas.width, 5);
        
        this.platforms.forEach(platform => this.renderer.drawPlatform(platform));
        this.renderer.drawPlayer(this.player);
        this.renderer.drawScore(this.score);
    }
    
    restart() {
        this.reset();
        console.log('Игра перезапущена через restart');
    }
}