import { Audio } from 'expo-av';
import { SOUNDSCAPE_PRESETS, SoundscapeId, COMPLETION_BELL_SOURCE } from '../presets';
import { TIMER_CONFIG } from '../../../core/constants/config';

class AudioEngine {
  private ambientSound: Audio.Sound | null = null;
  private bellSound: Audio.Sound | null = null;
  private currentPresetId: SoundscapeId = 'rain';
  private targetVolume: number = 0.8;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private isInitialized = false;

  public async initialize() {
    if (this.isInitialized) return;
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioEngine initialization error:', e);
    }
  }

  public async loadSoundscape(id: SoundscapeId) {
    this.currentPresetId = id;
    const preset = SOUNDSCAPE_PRESETS.find((p) => p.id === id);

    if (this.ambientSound) {
      try {
        await this.ambientSound.stopAsync();
        await this.ambientSound.unloadAsync();
      } catch {
        // Ignore cleanup errors
      }
      this.ambientSound = null;
    }

    if (!preset || !preset.source) {
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        preset.source,
        {
          isLooping: true,
          volume: 0,
          shouldPlay: false,
        }
      );
      this.ambientSound = sound;
    } catch (e) {
      console.warn('Error loading soundscape:', e);
    }
  }

  public async startPlaying(fadeInDurationMs = TIMER_CONFIG.FADE_IN_DURATION_MS) {
    if (!this.ambientSound) {
      if (this.currentPresetId !== 'silence') {
        await this.loadSoundscape(this.currentPresetId);
      }
    }

    if (!this.ambientSound) return;

    try {
      await this.ambientSound.setVolumeAsync(0);
      await this.ambientSound.playAsync();
      this.fadeVolume(this.targetVolume, fadeInDurationMs);
    } catch (e) {
      console.warn('Error starting playback:', e);
    }
  }

  public async stopPlaying(fadeOutDurationMs = TIMER_CONFIG.FADE_OUT_DURATION_MS) {
    if (!this.ambientSound) return;

    this.fadeVolume(0, fadeOutDurationMs, async () => {
      try {
        if (this.ambientSound) {
          await this.ambientSound.pauseAsync();
        }
      } catch {
        // Ignore
      }
    });
  }

  public async playCompletionBell() {
    try {
      if (this.bellSound) {
        await this.bellSound.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        COMPLETION_BELL_SOURCE,
        {
          volume: 1.0,
          shouldPlay: true,
          isLooping: false,
        }
      );
      this.bellSound = sound;
    } catch (e) {
      console.warn('Error playing completion bell:', e);
    }
  }

  private fadeVolume(toVolume: number, durationMs: number, onComplete?: () => void) {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (!this.ambientSound || durationMs <= 0) {
      this.ambientSound?.setVolumeAsync(toVolume);
      onComplete?.();
      return;
    }

    const steps = 25;
    const stepInterval = durationMs / steps;
    let currentStep = 0;

    this.ambientSound.getStatusAsync().then((status) => {
      if (!status.isLoaded) return;
      const startVolume = status.volume;
      const volumeDelta = toVolume - startVolume;

      this.fadeInterval = setInterval(async () => {
        currentStep++;
        const progress = currentStep / steps;
        // Exponential volume curve for natural human auditory perception
        const easedProgress = Math.sin((progress * Math.PI) / 2);
        const nextVolume = Math.max(0, Math.min(1, startVolume + volumeDelta * easedProgress));

        try {
          if (this.ambientSound) {
            await this.ambientSound.setVolumeAsync(nextVolume);
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
    });
  }

  public getCurrentSoundscapeId(): SoundscapeId {
    return this.currentPresetId;
  }
}

export const audioEngine = new AudioEngine();
