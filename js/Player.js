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
        this.state = 'idle'; // idle, walking, jumping
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
        this.state = 'walking';
    }
    
    moveRight() {
        this.velocityX = this.speed;
        this.facingRight = true;
        this.state = 'walking';
    }
    
    stop() {
        this.velocityX = 0;
        if (this.grounded) {
            this.state = 'idle';
        }
    }
    
    jump() {
        if (this.grounded) {
            this.velocityY = this.jumpStrength;
            this.grounded = false;
            this.state = 'jumping';
        }
    }
    
    update(gravity) {
        // Применяем гравитацию
        this.velocityY += gravity;
        
        // Обновляем позицию
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Ограничение по бокам экрана
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > 800) {
            this.x = 800 - this.width;
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
    }
    
    getCurrentSprite() {
        if (this.state === 'jumping') {
            return 'jump';
        } else if (this.state === 'walking') {
            return `walk${this.currentFrame + 1}`;
        } else {
            return 'idle';
        }
    }
}