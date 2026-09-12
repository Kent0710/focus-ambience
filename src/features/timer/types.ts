export type TimerStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';

export interface TimerState {
  status: TimerStatus;
  durationMinutes: number;
  remainingSeconds: number;
  totalSeconds: number;
  progress: number; // 0 to 1
  todayCompletedCount: number;
  todayTotalMinutes: number;
}
