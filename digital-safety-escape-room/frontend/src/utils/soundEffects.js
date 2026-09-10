/**
 * Sound Effects Engine using Web Audio API
 * Generates custom, low-latency synthesized audio effects for games.
 * Completely self-contained: no external audio files or CORS issues.
 */

let audioCtx = null;
let isAudioMuted = localStorage.getItem('cyber_escape_sound_muted') === 'true';
const listeners = new Set();

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundEffects = {
  isMuted() {
    return isAudioMuted;
  },

  setMuted(muted) {
    isAudioMuted = !!muted;
    localStorage.setItem('cyber_escape_sound_muted', isAudioMuted ? 'true' : 'false');
    listeners.forEach(fn => fn(isAudioMuted));
  },

  toggleMute() {
    this.setMuted(!isAudioMuted);
    return isAudioMuted;
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /**
   * Correct Answer Sound
   * Bright, pleasant harmonic chime (C5 -> E5 -> G5 -> C6) with smooth decay.
   */
  playCorrect() {
    if (isAudioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Arpeggio notes in Hz: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        // Gentle envelope
        const noteStart = now + index * 0.08;
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.28, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.5);
      });

      // Add high-end sparkle overtone
      const sparkleOsc = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      sparkleOsc.type = 'sine';
      sparkleOsc.frequency.setValueAtTime(1567.98, now + 0.24); // G6
      sparkleGain.gain.setValueAtTime(0.001, now + 0.24);
      sparkleGain.gain.exponentialRampToValueAtTime(0.12, now + 0.26);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(ctx.destination);
      sparkleOsc.start(now + 0.24);
      sparkleOsc.stop(now + 0.65);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  },

  /**
   * Wrong Answer Sound
   * Deep, urgent buzzer / dual dissonance descending pitch for lost life.
   */
  playWrong() {
    if (isAudioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Two dissonant square waves with lowpass filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.35);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.25, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      // Low saw wave
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(160, now);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 0.35);

      // Dissonant minor second
      const osc2 = ctx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(170, now);
      osc2.frequency.exponentialRampToValueAtTime(85, now + 0.35);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  },

  /**
   * Option Selection Click
   * Soft mechanical tick feedback.
   */
  playSelect() {
    if (isAudioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.03);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      // ignore
    }
  },

  /**
   * Security Analyst Clue / Hint Sound
   * Futuristic shimmer sound.
   */
  playHint() {
    if (isAudioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      // ignore
    }
  },

  /**
   * Game Over Lockdown Sound
   * Somber descending sequence.
   */
  playGameOver() {
    if (isAudioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [311.13, 261.63, 207.65, 174.61]; // Eb4, C4, Ab3, F3

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now + idx * 0.15);

        const startTime = now + idx * 0.15;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch (e) {
      // ignore
    }
  },

  /**
   * Escape Victory Fanfare
   * Triumphant brass-like synth chords.
   */
  playVictory() {
    if (isAudioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        const startTime = now + idx * 0.1;
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch (e) {
      // ignore
    }
  }
};
