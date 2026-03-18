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
        
        // Сортируем платформы по близости к игроку для более точной обработки
        const sortedPlatforms = [...platforms].sort((a, b) => {
            const distA = Math.abs(a.y - player.y);
            const distB = Math.abs(b.y - player.y);
            return distA - distB;
        });
        
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
                
                // Вычисляем перекрытия по осям
                const overlapTop = playerBottom - platformTop;
                const overlapBottom = platformBottom - playerTop;
                const overlapLeft = playerRight - platformLeft;
                const overlapRight = platformRight - playerLeft;
                
                // Находим наименьшее перекрытие для определения стороны столкновения
                const overlaps = [
                    { side: 'top', value: overlapTop },
                    { side: 'bottom', value: overlapBottom },
                    { side: 'left', value: overlapLeft },
                    { side: 'right', value: overlapRight }
                ];
                
                // Игнорируем отрицательные перекрытия
                const validOverlaps = overlaps.filter(o => o.value > 0);
                
                if (validOverlaps.length > 0) {
                    // Сортируем по величине перекрытия (от меньшего к большему)
                    validOverlaps.sort((a, b) => a.value - b.value);
                    
                    // Берем сторону с наименьшим перекрытием
                    const smallestOverlap = validOverlaps[0];
                    
                    switch(smallestOverlap.side) {
                        case 'top':
                            // Игрок сверху платформы
                            if (player.velocityY >= 0) {
                                player.y = platformTop - player.height;
                                player.velocityY = 0;
                                player.grounded = true;
                            }
                            break;
                        case 'bottom':
                            // Игрок снизу платформы
                            if (player.velocityY < 0) {
                                player.y = platformBottom;
                                player.velocityY = 0;
                            }
                            break;
                        case 'left':
                            // Игрок слева от платформы
                            if (player.velocityX > 0) {
                                player.x = platformLeft - player.width;
                                player.velocityX = 0;
                            }
                            break;
                        case 'right':
                            // Игрок справа от платформы
                            if (player.velocityX < 0) {
                                player.x = platformRight;
                                player.velocityX = 0;
                            }
                            break;
                    }
                }
            }
        }
        
        // Если игрок только что оторвался от платформы, но всё ещё на ней
        if (wasGrounded && !player.grounded) {
            // Проверяем, не стоит ли игрок всё ещё на платформе
            for (let platform of platforms) {
                if (!platform.active) continue;
                
                const playerRect = player.getCollisionRect();
                const platformRect = platform.getCollisionRect();
                
                // Проверяем, находится ли игрок прямо над платформой
                if (playerRect.y + playerRect.height <= platformRect.y + 5 &&
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