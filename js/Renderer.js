class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        
        // Создаём спрайты программно (временное решение)
        this.createSprites();
    }
    
    createSprites() {
        // Создаём холст для спрайтов
        this.sprites = {};
        
        // Спрайт покоя
        this.sprites.idle = this.createNinjaSprite('idle', '#2c3e50');
        
        // Спрайт прыжка
        this.sprites.jump = this.createNinjaSprite('jump', '#2980b9');
        
        // Спрайты ходьбы
        this.sprites.walk1 = this.createNinjaSprite('walk1', '#34495e');
        this.sprites.walk2 = this.createNinjaSprite('walk2', '#3d566e');
        
        // Фон
        this.background = this.createBackground();
    }
    
    createNinjaSprite(type, color) {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        
        // Тело ниндзя
        ctx.fillStyle = color;
        ctx.fillRect(5, 5, 30, 40);
        
        // Пояс
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(5, 30, 30, 5);
        
        // Голова (капюшон)
        ctx.fillStyle = '#1a2632';
        ctx.beginPath();
        ctx.arc(20, 12, 10, 0, Math.PI, true);
        ctx.fill();
        
        // Глаза
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(15, 8, 2, 0, Math.PI * 2);
        ctx.arc(25, 8, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Меч (катана) за спиной
        ctx.fillStyle = '#7f8c8d';
        ctx.fillRect(32, 2, 15, 5);
        ctx.fillStyle = '#bdc3c7';
        ctx.fillRect(45, 0, 3, 10);
        
        // Анимационные отличия
        if (type === 'jump') {
            // Руки вверх для прыжка
            ctx.fillStyle = '#1a2632';
            ctx.fillRect(0, 15, 5, 10);
            ctx.fillRect(35, 15, 5, 10);
        } else if (type === 'walk1') {
            // Нога вперёд
            ctx.fillStyle = '#1a2632';
            ctx.fillRect(10, 40, 5, 8);
        } else if (type === 'walk2') {
            // Нога назад
            ctx.fillStyle = '#1a2632';
            ctx.fillRect(25, 40, 5, 8);
        }
        
        return canvas;
    }
    
    createBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Небо (рассвет)
        ctx.fillStyle = '#e8d5b5';
        ctx.fillRect(0, 0, 800, 400);
        
        // Горы Фудзи
        ctx.fillStyle = '#5d6d7e';
        ctx.beginPath();
        ctx.moveTo(200, 300);
        ctx.lineTo(400, 100);
        ctx.lineTo(600, 300);
        ctx.fill();
        
        // Снег на вершине
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(380, 120);
        ctx.lineTo(400, 100);
        ctx.lineTo(420, 120);
        ctx.fill();
        
        // Солнце (красный круг - символ Японии)
        ctx.fillStyle = '#ff4d4d';
        ctx.beginPath();
        ctx.arc(100, 100, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Облака
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(600, 80, 30, 0, Math.PI * 2);
        ctx.arc(630, 60, 25, 0, Math.PI * 2);
        ctx.arc(660, 80, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
        
        return canvas;
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawBackground() {
        if (this.background) {
            this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Запасной вариант
            this.ctx.fillStyle = '#e8d5b5';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    drawPlayer(player) {
        const spriteName = player.getCurrentSprite();
        let sprite = this.sprites[spriteName];
        
        if (spriteName.includes('walk')) {
            sprite = this.sprites[`walk${player.currentFrame + 1}`];
        }
        
        if (sprite) {
            // Отражаем спрайт по горизонтали, если игрок смотрит влево
            if (!player.facingRight) {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(
                    sprite,
                    -player.x - player.width,
                    player.y,
                    player.width,
                    player.height
                );
                this.ctx.restore();
            } else {
                this.ctx.drawImage(
                    sprite,
                    player.x,
                    player.y,
                    player.width,
                    player.height
                );
            }
        }
    }
    
    drawPlatform(platform) {
        // Японский стиль платформ
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Декоративные элементы
        this.ctx.fillStyle = '#b87c4b';
        this.ctx.fillRect(platform.x + 2, platform.y + 2, platform.width - 4, 4);
        
        // Текстура дерева
        this.ctx.strokeStyle = '#5d3a1a';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(platform.x + 20 + i * 30, platform.y + 5);
            this.ctx.lineTo(platform.x + 40 + i * 30, platform.y + 15);
            this.ctx.stroke();
        }
        
        // Японский иероглиф
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = '16px "MS Gothic", sans-serif';
        this.ctx.fillText('忍', platform.x + 10, platform.y + 20);
    }
    
    drawScore(score) {
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = 'bold 24px "Segoe UI", Arial';
        this.ctx.shadowColor = '#8b0000';
        this.ctx.shadowBlur = 4;
        this.ctx.fillText(`⚡ ${score} ⚡`, 650, 50);
        this.ctx.shadowBlur = 0;
    }
}