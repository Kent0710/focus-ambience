import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompletedSession, DailySessionSummary } from '../types';
import { STORAGE_KEYS } from '../../../core/constants/config';

function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class SessionRepository {
  public static async logSession(durationMinutes: number, soundscapeId: string): Promise<DailySessionSummary> {
    const todayKey = getTodayKey();
    const newSession: CompletedSession = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      durationMinutes,
      soundscapeId,
      timestamp: Date.now(),
      dateKey: todayKey,
    };

    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_SESSIONS);
      const allSessions: CompletedSession[] = raw ? JSON.parse(raw) : [];
      allSessions.push(newSession);
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_SESSIONS, JSON.stringify(allSessions));
      return this.getTodaySummary();
    } catch (e) {
      console.warn('Error saving session:', e);
      return { dateKey: todayKey, completedCount: 1, totalMinutes: durationMinutes };
    }
  }

  public static async getTodaySummary(): Promise<DailySessionSummary> {
    const todayKey = getTodayKey();
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_SESSIONS);
      const allSessions: CompletedSession[] = raw ? JSON.parse(raw) : [];
      const todaySessions = allSessions.filter((s) => s.dateKey === todayKey);

      const totalMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
      return {
        dateKey: todayKey,
        completedCount: todaySessions.length,
        totalMinutes,
      };
    } catch {
      return { dateKey: todayKey, completedCount: 0, totalMinutes: 0 };
    }
  }
}
