export function formatTime(seconds: number): { minutes: string; seconds: string; full: string } {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;

  const minStr = String(mins).padStart(2, '0');
  const secStr = String(secs).padStart(2, '0');

  return {
    minutes: minStr,
    seconds: secStr,
    full: `${minStr}:${secStr}`,
  };
}
