document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    // Скрываем игру до нажатия старт
    game.gameStarted = false;
    
    // Обработка старта
    const startBtn = document.getElementById('startBtn');
    const startOverlay = document.getElementById('startOverlay');
    
    startBtn.addEventListener('click', () => {
        startOverlay.style.opacity = '0';
        startOverlay.style.pointerEvents = 'none';
        game.gameStarted = true;
        game.init();
    });
    
    // Обработка рестарта
    const restartBtn = document.getElementById('restartBtn');
    restartBtn.addEventListener('click', () => {
        game.restart();
    });

    // Добавим также обработку клавиши R для рестарта (удобно для тестирования)
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyR' && game.gameOver) {
            game.restart();
        }
    });
    
    // Дополнительная обработка клавиш для предотвращения скролла страницы
    window.addEventListener('keydown', (e) => {
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
            e.preventDefault();
        }
    }, false);
    
    // Обработка паузы
    window.addEventListener('blur', () => {
        // Можно добавить паузу при потере фокуса
    });
});