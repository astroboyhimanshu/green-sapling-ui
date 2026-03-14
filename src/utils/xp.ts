// ─── XP Store (localStorage) ─────────────────────────────────────────────────

export interface XPEvent {
  id: string;
  label: string;
  xp: number;
  timestamp: number;
}

const KEY = "gs_xp_events";

export function getXPEvents(): XPEvent[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function getTotalXP(): number {
  return getXPEvents().reduce((sum, e) => sum + e.xp, 0);
}

export function addXP(label: string, xp: number): number {
  const events = getXPEvents();
  events.push({ id: crypto.randomUUID(), label, xp, timestamp: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(events));
  return getTotalXP();
}

export function clearXP(): void {
  localStorage.removeItem(KEY);
}
