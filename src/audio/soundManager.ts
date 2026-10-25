/**
 * Sound Manager using Web Audio API for DEAD INTERNET
 * Synthesizes eerie ambient subterranean drones and retro-terminal telemetry SFX
 * Completely self-contained with no external audio file dependencies.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  // Ambient drone nodes
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private ambientLfo: OscillatorNode | null = null;
  private isAmbientRunning = false;

  private isMuted = false;
  private masterVol = 0.6;
  private ambientEnabled = true;
  private sfxEnabled = true;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.ambientGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.masterGain.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);
        this.ambientGain.gain.setValueAtTime(this.ambientEnabled ? 0.25 : 0, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? 0.45 : 0, this.ctx.currentTime);

        this.ambientGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public userInteract() {
    this.initContext();
    if (this.ambientEnabled && !this.isAmbientRunning) {
      this.startAmbientDrone();
    }
  }

  public setMasterVolume(val: number) {
    this.masterVol = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVol, this.ctx.currentTime, 0.05);
    }
  }

  public setAmbient(enabled: boolean) {
    this.ambientEnabled = enabled;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(enabled ? 0.25 : 0, this.ctx.currentTime, 0.1);
    }
    if (enabled && !this.isAmbientRunning) {
      this.startAmbientDrone();
    }
  }

  public setSfx(enabled: boolean) {
    this.sfxEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(enabled ? 0.45 : 0, this.ctx.currentTime, 0.05);
    }
  }

  public startAmbientDrone() {
    this.initContext();
    if (!this.ctx || !this.ambientGain || this.isAmbientRunning) return;

    try {
      // Deep sub-drone frequency
      const now = this.ctx.currentTime;
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientFilter = this.ctx.createBiquadFilter();
      this.ambientLfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      this.ambientOsc1.type = 'sawtooth';
      this.ambientOsc1.frequency.setValueAtTime(55, now); // A1 note 55Hz

      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(54.4, now); // Subtle phase beating

      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(140, now);
      this.ambientFilter.Q.setValueAtTime(3.5, now);

      // Low frequency modulation to create unsettling breathing / air ducts atmosphere
      this.ambientLfo.type = 'sine';
      this.ambientLfo.frequency.setValueAtTime(0.12, now); // slow 8-second cycle
      lfoGain.gain.setValueAtTime(45, now);

      this.ambientLfo.connect(lfoGain);
      lfoGain.connect(this.ambientFilter.frequency);

      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(this.ambientGain);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
      this.ambientLfo.start();
      this.isAmbientRunning = true;
    } catch {
      // Audio autoplay policy or device restrictions
    }
  }

  public stopAmbientDrone() {
    try {
      this.ambientOsc1?.stop();
      this.ambientOsc2?.stop();
      this.ambientLfo?.stop();
      this.ambientOsc1?.disconnect();
      this.ambientOsc2?.disconnect();
      this.ambientLfo?.disconnect();
      this.isAmbientRunning = false;
    } catch {
      // Ignore cleanup error
    }
  }

  // Crisp terminal key blip
  public playClick() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  // Incoming terminal notification chime
  public playNotification() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    [640, 880].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.23);
    });
  }

  // Static / network glitch burst
  public playGlitch() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const bufferSize = this.ctx.sampleRate * 0.15; // 150ms noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, this.ctx.currentTime);
    filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
  }

  // Resonant discovery tone for newly collected evidence
  public playEvidenceFound() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    
    // Sub impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(95, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.6);
    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(now);
    subOsc.stop(now + 0.65);

    // Eerie high resonant chime
    const bellOsc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(440 * 1.5, now + 0.05); // E5
    bellGain.gain.setValueAtTime(0.18, now + 0.05);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    bellOsc.connect(bellGain);
    bellGain.connect(this.sfxGain);
    bellOsc.start(now + 0.05);
    bellOsc.stop(now + 0.85);
  }

  // Harmonic chord for successful deduction
  public playDeductionSuccess() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const chords = [392, 493.88, 587.33, 783.99]; // G4, B4, D5, G5
    chords.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + idx * 0.07;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, st);
      gain.gain.setValueAtTime(0.14, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.5);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(st);
      osc.stop(st + 0.55);
    });
  }

  // Low flat thud for invalid deduction
  public playDeductionFail() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.27);
  }

  // Dramatic conclusion chord
  public playEndingChime() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    [110, 164.81, 196, 261.63].forEach((f, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 2.6);
    });
  }
}

export const soundManager = new SoundManager();
