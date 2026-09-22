import {
  AppState,
  GROSS_HOURS,
  HOURLY_RATE,
  REQUESTS,
  SHIFTS,
  Shift,
  ShiftRequest,
} from '../data/model';

export const money = (n: number): string => '€' + n.toFixed(2);

export function openRequests(state: AppState): ShiftRequest[] {
  return REQUESTS.filter(
    (r) => !state.accepted.includes(r.id) && !state.declined.includes(r.id),
  );
}

export function visibleShifts(state: AppState): Shift[] {
  return SHIFTS.filter((s) => {
    if (state.filters.rate && s.rate < 25) return false;
    if (state.filters.near && s.km > 10) return false;
    if (state.filters.days && s.night) return false;
    return true;
  });
}

export function currentDetail(state: AppState): Shift {
  return SHIFTS.find((s) => s.id === state.detailId) ?? SHIFTS[1];
}

/** Payable hours = gross minus unpaid break. */
export function payableHours(breakMin: number): number {
  return Math.max(0, GROSS_HOURS - breakMin / 60);
}

export function pay(breakMin: number): number {
  return payableHours(breakMin) * HOURLY_RATE;
}

export interface UpcomingEntry {
  key: string;
  dow: string;
  day: string;
  place: string;
  sub: string;
  variant: 'base' | 'booked';
}

export function upcomingEntries(state: AppState): UpcomingEntry[] {
  const entries: UpcomingEntry[] = [
    {
      key: 'base-beaumont',
      dow: 'THU',
      day: '27',
      place: 'Beaumont Nursing Home',
      sub: '08:00–20:00 · €29/hr',
      variant: 'base',
    },
  ];
  state.booked
    .map((id) => SHIFTS.find((s) => s.id === id))
    .filter((s): s is Shift => Boolean(s))
    .forEach((s) =>
      entries.push({
        key: 'booked-' + s.id,
        dow: s.dow,
        day: s.day,
        place: s.place,
        sub: `€${s.rate}/hr · just booked`,
        variant: 'booked',
      }),
    );
  state.accepted
    .map((id) => REQUESTS.find((r) => r.id === id))
    .filter((r): r is ShiftRequest => Boolean(r))
    .forEach((r) =>
      entries.push({
        key: 'accepted-' + r.id,
        dow: r.dow,
        day: r.day,
        place: r.place,
        sub: `€${r.rate}/hr · request accepted`,
        variant: 'booked',
      }),
    );
  return entries;
}

export interface ActivityEvent {
  key: string;
  icon: string;
  bg: string;
  fg: string;
  title: string;
  sub: string;
}

export function activityLog(state: AppState): ActivityEvent[] {
  const log: ActivityEvent[] = [];
  if (state.submitted) {
    log.push({
      key: 'submitted',
      icon: 'task_alt',
      bg: '#E4EFFA',
      fg: '#015EB8',
      title: 'Timesheet submitted for approval',
      sub: 'Beaumont · ' + money(pay(state.breakMin)),
    });
  }
  state.accepted.forEach((id) => {
    const r = REQUESTS.find((x) => x.id === id);
    if (r) {
      log.push({
        key: 'accepted-' + id,
        icon: 'event_available',
        bg: '#E4EFFA',
        fg: '#015EB8',
        title: 'You accepted ' + r.place,
        sub: r.when,
      });
    }
  });
  state.declined.forEach((id) => {
    const r = REQUESTS.find((x) => x.id === id);
    if (r) {
      log.push({
        key: 'declined-' + id,
        icon: 'event_busy',
        bg: '#FBE9F2',
        fg: '#A8347A',
        title: 'You declined ' + r.place,
        sub: r.when,
      });
    }
  });
  log.push({
    key: 'payment',
    icon: 'payments',
    bg: '#E4EFFA',
    fg: '#015EB8',
    title: '€486.20 paid to your account',
    sub: 'Friday, 21 Aug',
  });
  log.push({
    key: 'manual-handling',
    icon: 'verified',
    bg: '#E4EFFA',
    fg: '#015EB8',
    title: 'Manual handling certificate verified',
    sub: 'Mon 18 Aug',
  });
  return log;
}

export interface ExtraTotals {
  extraHours: number;
  extraPay: number;
}

export function extraTotals(state: AppState): ExtraTotals {
  const bookedShifts = state.booked
    .map((id) => SHIFTS.find((s) => s.id === id))
    .filter((s): s is Shift => Boolean(s));
  const acceptedReqs = state.accepted
    .map((id) => REQUESTS.find((r) => r.id === id))
    .filter((r): r is ShiftRequest => Boolean(r));
  const allHours = [...bookedShifts, ...acceptedReqs].reduce((t, s) => t + s.hours, 0);
  const allPay = [...bookedShifts, ...acceptedReqs].reduce((t, s) => t + s.hours * s.rate, 0);
  return {
    extraHours: allHours,
    extraPay: allPay,
  };
}

export interface SparklinePoint {
  x: number;
  y: number;
}

/** Weekly sparkline, viewBox 0 0 92 26 — identical geometry to the design. */
export function sparkline(state: AppState): {
  line: string;
  area: string;
  dot: SparklinePoint;
} {
  const { extraPay } = extraTotals(state);
  const week = [58, 92, 0, 116, 87, 133, extraPay];
  const peak = Math.max(...week, 1);
  const pts: SparklinePoint[] = week.map((v, i) => ({
    x: +(2 + i * 14.6).toFixed(1),
    y: +(24 - (v / peak) * 19).toFixed(1),
  }));
  const line = 'M' + pts.map((p) => `${p.x} ${p.y}`).join(' L');
  const area = line + ' L90 26 L2 26 Z';
  return { line, area, dot: pts[pts.length - 1] };
}

/** Progress ring: r=15, stroke=5 → circumference 94.2, against a 48h target. */
export function ringProgress(state: AppState): {
  offset: number;
  label: string[];
} {
  const { extraHours } = extraTotals(state);
  const value = 36 + extraHours;
  const offset = 94.2 * (1 - Math.min(1, value / 48));
  const pct = Math.round(Math.min(100, (value / 48) * 100));
  return { offset, label: [`${pct}% of your`, '48h target'] };
}
