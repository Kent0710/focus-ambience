export interface CompletedSession {
  id: string;
  durationMinutes: number;
  soundscapeId: string;
  timestamp: number;
  dateKey: string; // YYYY-MM-DD
}

export interface DailySessionSummary {
  dateKey: string;
  completedCount: number;
  totalMinutes: number;
}
