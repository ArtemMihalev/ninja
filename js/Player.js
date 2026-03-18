class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 5;
        this.jumpStrength = -12;
        this.grounded = false;
        
        // Анимация
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.animationSpeed = 8;
        
        // Состояния
        this.facingRight = true;
        this.state = 'idle';
        
        // Защита от множественных прыжков
        this.canJump = true;
        this.jumpCooldown = 0;
    }
    
    getCollisionRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    moveLeft() {
        this.velocityX = -this.speed;
        this.facingRight = false;
        if (this.grounded) {
            this.state = 'walking';
        }
    }
    
    moveRight() {
        this.velocityX = this.speed;
        this.facingRight = true;
        if (this.grounded) {
            this.state = 'walking';
        }
    }
    
    stop() {
        this.velocityX = 0;
        if (this.grounded) {
            this.state = 'idle';
        }
    }
    
    jump() {
        if (this.grounded && this.canJump) {
            this.velocityY = this.jumpStrength;
            this.grounded = false;
            this.state = 'jumping';
            this.canJump = false;
            this.jumpCooldown = 10; // Небольшая задержка перед следующим прыжком
        }
    }
    
    update(gravity) {
        // Обновляем кулдаун прыжка
        if (this.jumpCooldown > 0) {
            this.jumpCooldown--;
        } else {
            this.canJump = true;
        }
        
        // Применяем гравитацию
        this.velocityY += gravity;
        
        // Ограничиваем максимальную скорость падения
        if (this.velocityY > 15) {
            this.velocityY = 15;
        }
        
        // Обновляем позицию
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Ограничение по бокам экрана
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = 0;
        } else if (this.x + this.width > 800) {
            this.x = 800 - this.width;
            this.velocityX = 0;
        }
        
        // Обновление анимации
        this.updateAnimation();
    }
    
    updateAnimation() {
        if (this.state === 'walking') {
            this.frameCounter++;
            if (this.frameCounter >= this.animationSpeed) {
                this.frameCounter = 0;
                this.currentFrame = (this.currentFrame + 1) % 2;
            }
        } else {
            this.currentFrame = 0;
            this.frameCounter = 0;
        }
        
        // Сбрасываем состояние на idle, если игрок на земле и не движется
        if (this.grounded && this.velocityX === 0) {
            this.state = 'idle';
        }
    }
    
    getCurrentSprite() {
        if (this.state === 'jumping' || !this.grounded) {
            return 'jump';
        } else if (this.state === 'walking') {
            return `walk${this.currentFrame + 1}`;
        } else {
            return 'idle';
        }
    }
}