import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerState, TimerStatus } from '../types';
import { TIMER_CONFIG, STORAGE_KEYS } from '../../../core/constants/config';
import { hapticEngine } from '../../../core/haptics/HapticEngine';
import { SessionRepository } from '../../session-log/storage/SessionRepository';
import { useAmbient } from '../../ambient/state/AmbientContext';
import { useOledDeskMode } from '../../../platform/keep-awake/useOledDeskMode';

interface TimerContextType extends TimerState {
  startSession: () => void;
  pauseSession: () => void;
  resetSession: () => void;
  toggleSession: () => void;
  setDurationMinutes: (minutes: number) => void;
  adjustDurationMinutes: (delta: number) => void;
}

const TimerContext = createContext<TimerContextType | null>(null);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<TimerStatus>('IDLE');
  const [durationMinutes, setDurationMinutesState] = useState<number>(TIMER_CONFIG.DEFAULT_MINUTES);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(TIMER_CONFIG.DEFAULT_MINUTES * 60);
  const [todayCompletedCount, setTodayCompletedCount] = useState<number>(0);
  const [todayTotalMinutes, setTodayTotalMinutes] = useState<number>(0);

  const { startAudio, stopAudio, playCompletionBell, activeSoundId } = useAmbient();

  // OLED Desk mode hook
  useOledDeskMode(status);

  // Ref tracking high-precision end timestamp to eliminate JS timing drift
  const targetEndTimeRef = useRef<number | null>(null);
  const remainingSecondsRef = useRef<number>(remainingSeconds);
  remainingSecondsRef.current = remainingSeconds;

  // Load saved duration and today's session summary
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.LAST_DURATION).then((saved) => {
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= TIMER_CONFIG.MIN_MINUTES && parsed <= TIMER_CONFIG.MAX_MINUTES) {
          setDurationMinutesState(parsed);
          setRemainingSeconds(parsed * 60);
        }
      }
    });

    SessionRepository.getTodaySummary().then((summary) => {
      setTodayCompletedCount(summary.completedCount);
      setTodayTotalMinutes(summary.totalMinutes);
    });
  }, []);

  const setDurationMinutes = useCallback((minutes: number) => {
    const clamped = Math.max(TIMER_CONFIG.MIN_MINUTES, Math.min(TIMER_CONFIG.MAX_MINUTES, Math.round(minutes)));
    setDurationMinutesState(clamped);
    if (status === 'IDLE') {
      setRemainingSeconds(clamped * 60);
    }
    AsyncStorage.setItem(STORAGE_KEYS.LAST_DURATION, String(clamped));
  }, [status]);

  const adjustDurationMinutes = useCallback((delta: number) => {
    if (status !== 'IDLE') return;
    setDurationMinutesState((prev) => {
      const next = Math.max(TIMER_CONFIG.MIN_MINUTES, Math.min(TIMER_CONFIG.MAX_MINUTES, prev + delta));
      setRemainingSeconds(next * 60);
      AsyncStorage.setItem(STORAGE_KEYS.LAST_DURATION, String(next));
      return next;
    });
  }, [status]);

  const startSession = useCallback(() => {
    hapticEngine.impactLight();
    const targetEnd = Date.now() + remainingSecondsRef.current * 1000;
    targetEndTimeRef.current = targetEnd;
    setStatus('RUNNING');
    startAudio();
  }, [startAudio]);

  const pauseSession = useCallback(() => {
    hapticEngine.impactLight();
    targetEndTimeRef.current = null;
    setStatus('PAUSED');
    stopAudio();
  }, [stopAudio]);

  const resetSession = useCallback(() => {
    hapticEngine.impactMedium();
    targetEndTimeRef.current = null;
    setStatus('IDLE');
    setRemainingSeconds(durationMinutes * 60);
    stopAudio();
  }, [durationMinutes, stopAudio]);

  const toggleSession = useCallback(() => {
    if (status === 'IDLE' || status === 'PAUSED') {
      startSession();
    } else if (status === 'RUNNING') {
      pauseSession();
    } else if (status === 'COMPLETED') {
      resetSession();
    }
  }, [status, startSession, pauseSession, resetSession]);

  // Tick loop with drift correction
  useEffect(() => {
    if (status !== 'RUNNING') return;

    const interval = setInterval(() => {
      if (!targetEndTimeRef.current) return;

      const now = Date.now();
      const diffMs = targetEndTimeRef.current - now;
      const leftSec = Math.max(0, Math.ceil(diffMs / 1000));

      setRemainingSeconds(leftSec);

      if (leftSec <= 0) {
        clearInterval(interval);
        targetEndTimeRef.current = null;
        setStatus('COMPLETED');
        stopAudio();
        playCompletionBell();
        hapticEngine.success();

        // Log session
        SessionRepository.logSession(durationMinutes, activeSoundId).then((summary) => {
          setTodayCompletedCount(summary.completedCount);
          setTodayTotalMinutes(summary.totalMinutes);
        });

        // Serene auto-reset after completion moment
        setTimeout(() => {
          setStatus('IDLE');
          setRemainingSeconds(durationMinutes * 60);
        }, 3500);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [status, durationMinutes, activeSoundId, stopAudio, playCompletionBell]);

  const totalSeconds = durationMinutes * 60;
  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;

  return (
    <TimerContext.Provider
      value={{
        status,
        durationMinutes,
        remainingSeconds,
        totalSeconds,
        progress,
        todayCompletedCount,
        todayTotalMinutes,
        startSession,
        pauseSession,
        resetSession,
        toggleSession,
        setDurationMinutes,
        adjustDurationMinutes,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
