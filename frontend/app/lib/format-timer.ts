export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function formatTimerRemaining(endsAt: number, now: number) {
  const ms = endsAt - now;
  if (ms <= 0) return "Expired";
  const totalMins = Math.floor(ms / 60000);
  const days = Math.floor(totalMins / (60 * 24));
  const hours = Math.floor((totalMins % (60 * 24)) / 60);
  const mins = totalMins % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${Math.max(mins, 1)}m`;
}
