// js/AudioManager.js
class AudioManager {
    constructor() {
        this.backgroundMusic = null;
        this.isMuted = false;
        this.musicEnabled = true;
        this.audioContext = null;
        
        // Пытаемся загрузить музыку после взаимодействия с пользователем
        this.setupAudio();
    }
    
    setupAudio() {
        // Создаём аудио контекст для лучшего контроля
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API не поддерживается');
        }
    }
    
    loadMusic(url) {
        if (!this.musicEnabled) return;
        
        this.backgroundMusic = new Audio(url);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3; // Начальная громкость 30%
        
        // Загружаем музыку, но не играем
        this.backgroundMusic.load();
    }
    
    play() {
        if (!this.musicEnabled || !this.backgroundMusic) return;
        
        // Нужно для автовоспроизведения в современных браузерах
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.backgroundMusic.play().catch(e => {
            console.log('Автовоспроизведение заблокировано браузером');
            // Ждём взаимодействия пользователя
        });
    }
    
    pause() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.backgroundMusic) {
            this.backgroundMusic.muted = this.isMuted;
        }
        return this.isMuted;
    }
    
    setVolume(volume) {
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
        }
    }
    
    // Включаем/выключаем музыку
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.pause();
        } else if (this.backgroundMusic) {
            this.play();
        }
        return this.musicEnabled;
    }
}