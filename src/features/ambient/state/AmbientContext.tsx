import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SoundscapeId, SOUNDSCAPE_PRESETS, SoundscapePreset } from '../presets';
import { audioEngine } from '../engine/AudioEngine';
import { STORAGE_KEYS } from '../../../core/constants/config';
import { hapticEngine } from '../../../core/haptics/HapticEngine';

interface AmbientContextType {
  activeSoundId: SoundscapeId;
  activePreset: SoundscapePreset;
  selectSound: (id: SoundscapeId) => void;
  nextSound: () => void;
  prevSound: () => void;
  startAudio: () => void;
  stopAudio: () => void;
  playCompletionBell: () => void;
}

const AmbientContext = createContext<AmbientContextType | null>(null);

export const AmbientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSoundId, setActiveSoundId] = useState<SoundscapeId>('rain');

  useEffect(() => {
    audioEngine.initialize();
    AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SOUND).then((savedId) => {
      if (savedId && SOUNDSCAPE_PRESETS.some((p) => p.id === savedId)) {
        setActiveSoundId(savedId as SoundscapeId);
        audioEngine.loadSoundscape(savedId as SoundscapeId);
      } else {
        audioEngine.loadSoundscape('rain');
      }
    });
  }, []);

  const selectSound = useCallback(async (id: SoundscapeId) => {
    setActiveSoundId(id);
    hapticEngine.tick();
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SOUND, id);
    await audioEngine.loadSoundscape(id);
  }, []);

  const nextSound = useCallback(() => {
    const currentIndex = SOUNDSCAPE_PRESETS.findIndex((p) => p.id === activeSoundId);
    const nextIndex = (currentIndex + 1) % SOUNDSCAPE_PRESETS.length;
    selectSound(SOUNDSCAPE_PRESETS[nextIndex].id);
  }, [activeSoundId, selectSound]);

  const prevSound = useCallback(() => {
    const currentIndex = SOUNDSCAPE_PRESETS.findIndex((p) => p.id === activeSoundId);
    const prevIndex = (currentIndex - 1 + SOUNDSCAPE_PRESETS.length) % SOUNDSCAPE_PRESETS.length;
    selectSound(SOUNDSCAPE_PRESETS[prevIndex].id);
  }, [activeSoundId, selectSound]);

  const startAudio = useCallback(() => {
    audioEngine.startPlaying();
  }, []);

  const stopAudio = useCallback(() => {
    audioEngine.stopPlaying();
  }, []);

  const playCompletionBell = useCallback(() => {
    audioEngine.playCompletionBell();
  }, []);

  const activePreset = SOUNDSCAPE_PRESETS.find((p) => p.id === activeSoundId) || SOUNDSCAPE_PRESETS[0];

  return (
    <AmbientContext.Provider
      value={{
        activeSoundId,
        activePreset,
        selectSound,
        nextSound,
        prevSound,
        startAudio,
        stopAudio,
        playCompletionBell,
      }}
    >
      {children}
    </AmbientContext.Provider>
  );
};

export const useAmbient = (): AmbientContextType => {
  const context = useContext(AmbientContext);
  if (!context) {
    throw new Error('useAmbient must be used within an AmbientProvider');
  }
  return context;
};
