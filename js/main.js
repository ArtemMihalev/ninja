document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    game.init();
    
    // Обработка рестарта
    document.getElementById('restartBtn').addEventListener('click', () => {
        game.restart();
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