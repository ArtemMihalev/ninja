class Collision {
    static checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    static handlePlatformCollisions(player, platforms) {
    let wasGrounded = player.grounded;
    player.grounded = false;
    
    // Сначала проверяем столкновения для платформ под игроком (приоритет приземления)
    const platformsBelow = platforms.filter(p => 
        p.active && p.y > player.y - 5 && p.y < player.y + player.height + 20
    );
    
    // Потом остальные
    const otherPlatforms = platforms.filter(p => 
        p.active && !platformsBelow.includes(p)
    );
    
    // Обрабатываем все платформы
    const allPlatforms = [...platformsBelow, ...otherPlatforms];
    
    for (let platform of allPlatforms) {
        if (!platform.active) continue;
        
        const playerRect = player.getCollisionRect();
        const platformRect = platform.getCollisionRect();
        
        if (this.checkCollision(playerRect, platformRect)) {
            const playerBottom = playerRect.y + playerRect.height;
            const playerTop = playerRect.y;
            const playerRight = playerRect.x + playerRect.width;
            const playerLeft = playerRect.x;
            
            const platformBottom = platformRect.y + platformRect.height;
            const platformTop = platformRect.y;
            const platformRight = platformRect.x + platformRect.width;
            const platformLeft = platformRect.x;
            
            // Вычисляем перекрытия
            const overlapBottom = playerBottom - platformTop;
            const overlapTop = platformBottom - playerTop;
            const overlapLeft = playerRight - platformLeft;
            const overlapRight = platformRight - playerLeft;
            
            // Находим минимальное перекрытие
            const minOverlap = Math.min(overlapBottom, overlapTop, overlapLeft, overlapRight);
            
            // ПРИЗЕМЛЕНИЕ СВЕРХУ - игрок падает на платформу
            if (minOverlap === overlapBottom && 
                player.velocityY >= 0 && 
                overlapBottom < 20 &&
                playerBottom <= platformTop + 15) {
                
                player.y = platformTop - player.height;
                player.velocityY = 0;
                player.grounded = true;
                continue;
            }
            
            // УДАР ГОЛОВОЙ - только если игрок явно движется вверх
            if (minOverlap === overlapTop && 
                player.velocityY < -5 && 
                overlapTop < 15) {
                
                player.y = platformBottom;
                player.velocityY = 0;
                continue;
            }
            
            // БОКОВЫЕ СТОЛКНОВЕНИЯ - только если не обработали вертикальные
            // Проверяем, что игрок находится на уровне платформы
            const verticalOverlap = Math.min(playerBottom - platformTop, platformBottom - playerTop);
            if (verticalOverlap > 10 && verticalOverlap < player.height - 10) {
                if (player.velocityX > 0 && minOverlap === overlapLeft && overlapLeft < 10) {
                    player.x = platformLeft - player.width;
                    player.velocityX = 0;
                } else if (player.velocityX < 0 && minOverlap === overlapRight && overlapRight < 10) {
                    player.x = platformRight;
                    player.velocityX = 0;
                }
            }
        }
    }
    
    // Дополнительная проверка для стояния на платформе
    if (wasGrounded && !player.grounded) {
        for (let platform of platforms) {
            if (!platform.active) continue;
            
            if (player.y + player.height <= platform.y + 10 &&
                player.y + player.height >= platform.y - 2 &&
                player.x + player.width > platform.x &&
                player.x < platform.x + platform.width) {
                
                player.y = platform.y - player.height;
                player.grounded = true;
                player.velocityY = 0;
                break;
            }
        }
    }
}
    
    static checkGroundCollision(player, groundY) {
        if (player.y + player.height >= groundY - 2) {
            player.y = groundY - player.height;
            player.velocityY = 0;
            player.grounded = true;
            return true;
        }
        return false;
    }
}