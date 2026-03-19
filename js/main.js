document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    // Создаём менеджер музыки
    const audioManager = new AudioManager();
    
    // Загружаем музыку (замените URL на свой файл)
    // Пример: audioManager.loadMusic('assets/music/japanese-theme.mp3');
    audioManager.loadMusic('assets/music/sound.flac'); // Замените на реальный URL
    
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
        
        // Запускаем музыку после взаимодействия с пользователем
        audioManager.play();
    });
    
    // Обработка рестарта
    const restartBtn = document.getElementById('restartBtn');
    restartBtn.addEventListener('click', () => {
        game.restart();
        
        // Если музыка остановилась, запускаем снова
        audioManager.play();
    });

    // Управление музыкой
    const musicToggle = document.getElementById('musicToggle');
    const musicText = musicToggle.querySelector('.music-text');
    
    musicToggle.addEventListener('click', () => {
        const isMusicOn = audioManager.toggleMusic();
        musicToggle.classList.toggle('muted', !isMusicOn);
        musicText.textContent = isMusicOn ? 'Музыка вкл' : 'Музыка выкл';
        
        // Меняем иконку
        const icon = musicToggle.querySelector('.music-icon');
        icon.textContent = isMusicOn ? '🎵' : '🔇';
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
    
    // Обработка потери фокуса - ставим музыку на паузу
    window.addEventListener('blur', () => {
        audioManager.pause();
    });
    
    // При возвращении фокуса - возобновляем, если игра активна
    window.addEventListener('focus', () => {
        if (game.gameStarted && !game.gameOver) {
            audioManager.play();
        }
    });
});