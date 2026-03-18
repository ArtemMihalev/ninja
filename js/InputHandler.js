class InputHandler {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            up: false
        };
        
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    handleKeyDown(e) {
        switch(e.code) {
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = true;
                e.preventDefault();
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = true;
                e.preventDefault();
                break;
            case 'Space':
            case 'KeyW':
            case 'ArrowUp':
                this.keys.up = true;
                e.preventDefault();
                break;
        }
    }
    
    handleKeyUp(e) {
        switch(e.code) {
            case 'KeyA':
            case 'ArrowLeft':
                this.keys.left = false;
                e.preventDefault();
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.keys.right = false;
                e.preventDefault();
                break;
            case 'Space':
            case 'KeyW':
            case 'ArrowUp':
                this.keys.up = false;
                e.preventDefault();
                break;
        }
    }
    
    isLeftPressed() {
        return this.keys.left;
    }
    
    isRightPressed() {
        return this.keys.right;
    }
    
    isUpPressed() {
        return this.keys.up;
    }
}