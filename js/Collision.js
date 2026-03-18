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
    
    // Сортируем платформы по Y-координате для более предсказуемой обработки
    const sortedPlatforms = [...platforms].sort((a, b) => a.y - b.y);
    
    for (let platform of sortedPlatforms) {
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
            const overlapBottom = playerBottom - platformTop; // На сколько игрок ниже верха платформы
            const overlapTop = platformBottom - playerTop;    // На сколько игрок выше низа платформы
            const overlapLeft = playerRight - platformLeft;
            const overlapRight = platformRight - playerLeft;
            
            // Приоритет: сначала проверяем возможность встать сверху
            // Игрок может встать на платформу, если:
            // 1. Он падает вниз (velocityY >= 0)
            // 2. Его нижняя часть выше или равна верху платформы с небольшим допуском
            // 3. Перекрытие по вертикали небольшое (чтобы не застревать)
            if (player.velocityY >= 0 && 
                playerBottom <= platformTop + 15 && // Допуск 15 пикселей
                playerBottom > platformTop - 5 &&
                overlapBottom < 20) {
                
                // Встаём на платформу
                player.y = platformTop - player.height;
                player.velocityY = 0;
                player.grounded = true;
                continue;
            }
            
            // Проверка удара головой (снизу вверх)
            if (player.velocityY < 0 && 
                playerTop >= platformBottom - 15 && 
                playerTop < platformBottom + 5 &&
                overlapTop < 20) {
                
                // Отскакиваем от нижней части платформы
                player.y = platformBottom;
                player.velocityY = 0;
                continue;
            }
            
            // Боковые столкновения (с меньшим приоритетом)
            // Проверяем, не пытается ли игрок пройти сквозь платформу сбоку
            if (player.velocityX > 0 && overlapLeft < overlapRight && overlapLeft < 15) {
                // Столкновение слева от платформы
                if (player.y + player.height > platformTop + 5 && player.y < platformBottom - 5) {
                    player.x = platformLeft - player.width;
                    player.velocityX = 0;
                }
            } else if (player.velocityX < 0 && overlapRight < overlapLeft && overlapRight < 15) {
                // Столкновение справа от платформы
                if (player.y + player.height > platformTop + 5 && player.y < platformBottom - 5) {
                    player.x = platformRight;
                    player.velocityX = 0;
                }
            }
        }
    }
    
    // Дополнительная проверка: если игрок только что оторвался от платформы, 
    // но всё ещё должен на ней стоять
    if (wasGrounded && !player.grounded) {
        for (let platform of platforms) {
            if (!platform.active) continue;
            
            const playerRect = player.getCollisionRect();
            const platformRect = platform.getCollisionRect();
            
            // Проверяем, находится ли игрок прямо над платформой
            if (playerRect.y + playerRect.height <= platformRect.y + 10 &&
                playerRect.y + playerRect.height >= platformRect.y - 5 &&
                playerRect.x < platformRect.x + platformRect.width &&
                playerRect.x + playerRect.width > platformRect.x) {
                
                player.y = platformRect.y - player.height;
                player.grounded = true;
                player.velocityY = 0;
                break;
            }
        }
    }
}
    
    static checkGroundCollision(player, groundY) {
        // Даём небольшой запас для проверки (2 пикселя)
        if (player.y + player.height >= groundY - 2) {
            player.y = groundY - player.height;
            player.velocityY = 0;
            player.grounded = true;
            return true; // Игрок коснулся земли - проигрыш
        }
        return false;
    }
}