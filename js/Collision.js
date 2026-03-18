class Collision {
    static checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    static handlePlatformCollisions(player, platforms) {
        player.grounded = false;
        
        for (let platform of platforms) {
            if (!platform.active) continue;
            
            const playerRect = player.getCollisionRect();
            const platformRect = platform.getCollisionRect();
            
            if (this.checkCollision(playerRect, platformRect)) {
                // Определяем направление столкновения
                const playerBottom = playerRect.y + playerRect.height;
                const playerTop = playerRect.y;
                const playerRight = playerRect.x + playerRect.width;
                const playerLeft = playerRect.x;
                
                const platformBottom = platformRect.y + platformRect.height;
                const platformTop = platformRect.y;
                const platformRight = platformRect.x + platformRect.width;
                const platformLeft = platformRect.x;
                
                // Столкновение сверху платформы
                if (playerBottom >= platformTop && 
                    playerTop <= platformTop && 
                    player.velocityY >= 0) {
                    
                    player.y = platformTop - player.height;
                    player.velocityY = 0;
                    player.grounded = true;
                    return;
                }
                
                // Столкновение снизу платформы
                if (playerTop <= platformBottom && 
                    playerBottom >= platformBottom && 
                    player.velocityY < 0) {
                    
                    player.y = platformBottom;
                    player.velocityY = 0;
                    return;
                }
                
                // Столкновение слева
                if (playerRight >= platformLeft && 
                    playerLeft <= platformLeft && 
                    player.velocityX > 0) {
                    
                    player.x = platformLeft - player.width;
                    player.velocityX = 0;
                }
                
                // Столкновение справа
                if (playerLeft <= platformRight && 
                    playerRight >= platformRight && 
                    player.velocityX < 0) {
                    
                    player.x = platformRight;
                    player.velocityX = 0;
                }
            }
        }
    }
    
    static checkGroundCollision(player, groundY) {
        if (player.y + player.height >= groundY) {
            player.y = groundY - player.height;
            player.velocityY = 0;
            player.grounded = true;
            return true; // Игрок коснулся земли - проигрыш
        }
        return false;
    }
}