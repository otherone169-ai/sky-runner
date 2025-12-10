export class SoundSystem {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  play(sound: 'jump' | 'coin' | 'hit' | 'gameOver' | 'start') {
    if (!this.enabled || !this.audioContext) return;

    switch (sound) {
      case 'jump':
        this.playTone(400, 0.1, 'sine', 0.2);
        setTimeout(() => this.playTone(600, 0.1, 'sine', 0.2), 50);
        break;

      case 'coin':
        this.playTone(800, 0.05, 'sine', 0.3);
        setTimeout(() => this.playTone(1200, 0.05, 'sine', 0.3), 50);
        setTimeout(() => this.playTone(1600, 0.05, 'sine', 0.3), 100);
        break;

      case 'hit':
        this.playTone(200, 0.2, 'sawtooth', 0.4);
        setTimeout(() => this.playTone(150, 0.2, 'sawtooth', 0.4), 100);
        break;

      case 'gameOver':
        this.playTone(400, 0.15, 'square', 0.3);
        setTimeout(() => this.playTone(350, 0.15, 'square', 0.3), 150);
        setTimeout(() => this.playTone(300, 0.15, 'square', 0.3), 300);
        setTimeout(() => this.playTone(200, 0.4, 'square', 0.3), 450);
        break;

      case 'start':
        this.playTone(440, 0.1, 'sine', 0.3);
        setTimeout(() => this.playTone(554, 0.1, 'sine', 0.3), 100);
        setTimeout(() => this.playTone(659, 0.1, 'sine', 0.3), 200);
        setTimeout(() => this.playTone(880, 0.2, 'sine', 0.3), 300);
        break;
    }
  }

  cleanup() {
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
