/**
 * Static data + types, carried over verbatim from the design source.
 */

export interface Shift {
  id: string;
  role: string;
  place: string;
  address: string;
  rate: number;
  hours: number;
  km: number;
  night: boolean;
  tag: string;
  dow: string;
  day: string;
  dateLine: string;
  ward: string;
  when: string;
}

export interface ShiftRequest {
  id: string;
  place: string;
  when: string;
  sub: string;
  full: string;
  left: string;
  dow: string;
  day: string;
  rate: number;
  hours: number;
}

export const SHIFTS: Shift[] = [
  {
    id: 'clontarf',
    role: 'Staff Nurse',
    place: 'Clontarf Care Centre',
    address: 'Clontarf Road, Dublin 3 · 3.1 km',
    rate: 31,
    hours: 11.5,
    km: 3.1,
    night: false,
    tag: 'Premium rate',
    dow: 'SAT',
    day: '30',
    dateLine: 'Saturday 30 August · 08:00 – 20:00',
    ward: 'Ward 1A · 24 residents · general care',
    when: 'Sat 30 Aug · 08:00–20:00',
  },
  {
    id: 'beaumont',
    role: 'Staff Nurse · RGN',
    place: 'Beaumont Nursing Home',
    address: 'Beaumont Road, Dublin 9 · 4.2 km',
    rate: 29,
    hours: 11.5,
    km: 4.2,
    night: false,
    tag: 'Worked here 6×',
    dow: 'THU',
    day: '27',
    dateLine: 'Thursday 27 August · 08:00 – 20:00',
    ward: 'Ward 2B · 28 residents · dementia care',
    when: 'Thu 27 Aug · 08:00–20:00',
  },
  {
    id: 'marymount',
    role: 'Health Care Assistant',
    place: 'Marymount Residential',
    address: 'Marymount Ave, Dublin 12 · 6.4 km',
    rate: 23,
    hours: 11.5,
    km: 6.4,
    night: true,
    tag: 'Night',
    dow: 'SUN',
    day: '31',
    dateLine: 'Sunday 31 August · 20:00 – 08:00',
    ward: 'Night cover · 18 residents',
    when: 'Sun 31 Aug · 20:00–08:00',
  },
  {
    id: 'ashbrook',
    role: 'Staff Nurse',
    place: 'Ashbrook Private',
    address: 'Ashbrook Grove, Dublin 15 · 9.7 km',
    rate: 27,
    hours: 11.5,
    km: 9.7,
    night: false,
    tag: 'New home',
    dow: 'TUE',
    day: '02',
    dateLine: 'Tuesday 2 September · 08:00 – 20:00',
    ward: 'Ward 3 · 20 residents · palliative',
    when: 'Tue 2 Sep · 08:00–20:00',
  },
  {
    id: 'stbrigids',
    role: 'Health Care Assistant',
    place: "St Brigid's Community Unit",
    address: 'Blanchardstown, Dublin 15 · 12.4 km',
    rate: 21,
    hours: 12,
    km: 12.4,
    night: true,
    tag: 'Night',
    dow: 'SAT',
    day: '29',
    dateLine: 'Saturday 29 August · 20:00 – 08:00',
    ward: 'Night cover · 22 residents',
    when: 'Sat 29 Aug · 20:00–08:00',
  },
];

export const REQUESTS: ShiftRequest[] = [
  {
    id: 'r1',
    place: 'Clontarf Care Centre',
    when: 'Sat 30 Aug · 08:00–20:00',
    sub: 'Clontarf Care Centre · €31/hr',
    full: 'Sat 30 Aug · 08:00–20:00 · €31/hr',
    left: '2h left',
    dow: 'SAT',
    day: '30',
    rate: 31,
    hours: 11.5,
  },
  {
    id: 'r2',
    place: 'Marymount Residential',
    when: 'Mon 1 Sep · 20:00–08:00',
    sub: 'Marymount Residential · €23/hr',
    full: 'Mon 1 Sep · 20:00–08:00 · €23/hr',
    left: '1d left',
    dow: 'MON',
    day: '01',
    rate: 23,
    hours: 11.5,
  },
];

export type ScreenName =
  | 'home'
  | 'shifts'
  | 'detail'
  | 'schedule'
  | 'timesheet'
  | 'activity'
  | 'profile';

export interface Filters {
  rate: boolean;
  near: boolean;
  days: boolean;
}

export interface AppState {
  signedIn: boolean;
  screen: ScreenName;
  detailId: string;
  filters: Filters;
  booked: string[];
  accepted: string[];
  declined: string[];
  clockedIn: boolean;
  breakMin: number;
  signed: boolean;
  submitted: boolean;
  ohAdded: boolean;
  toast: string | null;
}

export const START_STATE: AppState = {
  signedIn: false,
  screen: 'home',
  detailId: 'beaumont',
  filters: { rate: true, near: true, days: true },
  booked: [],
  accepted: [],
  declined: [],
  clockedIn: false,
  breakMin: 30,
  signed: false,
  submitted: false,
  ohAdded: false,
  toast: null,
};

export const HOURLY_RATE = 29;
/** Gross hours of the timesheet shift (07:58 → 20:06). */
export const GROSS_HOURS = 12.13;
