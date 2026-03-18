class Platform {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.active = true;
    }
    
    update() {
        this.x -= this.speed;
        
        // Деактивируем платформу, если она ушла за левый край
        if (this.x + this.width < 0) {
            this.active = false;
        }
    }
    
    getCollisionRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}