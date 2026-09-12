import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import { SOUNDSCAPE_PRESETS, SoundscapeId, COMPLETION_BELL_SOURCE } from '../presets';
import { TIMER_CONFIG } from '../../../core/constants/config';

class AudioEngine {
  private ambientPlayer: AudioPlayer | null = null;
  private bellPlayer: AudioPlayer | null = null;
  private currentPresetId: SoundscapeId = 'rain';
  private targetVolume: number = 0.8;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private isInitialized = false;

  public async initialize() {
    if (this.isInitialized) return;
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: true,
        interruptionMode: 'mixWithOthers',
      });
      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioEngine initialize notice:', e);
    }
  }

  public async loadSoundscape(id: SoundscapeId) {
    this.currentPresetId = id;
    const preset = SOUNDSCAPE_PRESETS.find((p) => p.id === id);

    if (this.ambientPlayer) {
      try {
        this.ambientPlayer.pause();
        this.ambientPlayer.remove();
      } catch {
        // Ignore cleanup
      }
      this.ambientPlayer = null;
    }

    if (!preset || !preset.source) {
      return;
    }

    try {
      const player = createAudioPlayer(preset.source);
      player.loop = true;
      player.volume = 0;
      this.ambientPlayer = player;
    } catch (e) {
      console.warn('Error loading soundscape player:', e);
    }
  }

  public async startPlaying(fadeInDurationMs = TIMER_CONFIG.FADE_IN_DURATION_MS) {
    if (!this.ambientPlayer) {
      if (this.currentPresetId !== 'silence') {
        await this.loadSoundscape(this.currentPresetId);
      }
    }

    if (!this.ambientPlayer) return;

    try {
      this.ambientPlayer.volume = 0;
      this.ambientPlayer.play();
      this.fadeVolume(this.targetVolume, fadeInDurationMs);
    } catch (e) {
      console.warn('Error starting playback:', e);
    }
  }

  public async stopPlaying(fadeOutDurationMs = TIMER_CONFIG.FADE_OUT_DURATION_MS) {
    if (!this.ambientPlayer) return;

    this.fadeVolume(0, fadeOutDurationMs, () => {
      try {
        if (this.ambientPlayer) {
          this.ambientPlayer.pause();
        }
      } catch {
        // Ignore
      }
    });
  }

  public async playCompletionBell() {
    try {
      if (this.bellPlayer) {
        try {
          this.bellPlayer.remove();
        } catch {
          // Ignore
        }
      }
      const bell = createAudioPlayer(COMPLETION_BELL_SOURCE);
      bell.loop = false;
      bell.volume = 1.0;
      bell.play();
      this.bellPlayer = bell;
    } catch (e) {
      console.warn('Error playing completion bell:', e);
    }
  }

  private fadeVolume(toVolume: number, durationMs: number, onComplete?: () => void) {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (!this.ambientPlayer || durationMs <= 0) {
      if (this.ambientPlayer) {
        this.ambientPlayer.volume = toVolume;
      }
      onComplete?.();
      return;
    }

    const steps = 25;
    const stepInterval = durationMs / steps;
    let currentStep = 0;
    const startVolume = this.ambientPlayer.volume;
    const volumeDelta = toVolume - startVolume;

    this.fadeInterval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Exponential perceptual volume easing
      const easedProgress = Math.sin((progress * Math.PI) / 2);
      const nextVolume = Math.max(0, Math.min(1, startVolume + volumeDelta * easedProgress));

      try {
        if (this.ambientPlayer) {
          this.ambientPlayer.volume = nextVolume;
        }
      } catch {
        // Ignore
      }

      if (currentStep >= steps) {
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
        onComplete?.();
      }
    }, stepInterval);
  }

  public getCurrentSoundscapeId(): SoundscapeId {
    return this.currentPresetId;
  }
}

export const audioEngine = new AudioEngine();
