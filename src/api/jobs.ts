import { apiRequest } from './client';
import { FormDataFile } from './auth';
import { Job, JobApplication, Lookup, RawJob } from './types';

/** Lookup ids the web bundle resolves when the API returns raw ids. */
const LOOKUP_NAMES: Record<string, string> = {
  '6a35733fbe5eab77c923c2c3': 'Part Time',
  '6a356cdc88481ec5c203a93b': 'Full Time',
  '6a350096e6c6858a8df7548d': 'USD ($)',
  '6a350087e6c6858a8df7548c': 'EUR (€)',
  '6a35007ce6c6858a8df7548b': 'GBP (£)',
  '6a34fe1de6c6858a8df75489': 'Per Annum',
  '6a34fe11e6c6858a8df75488': 'Per Month',
  '6a34fdf8e6c6858a8df75487': 'Per Week',
  '6a34fdece6c6858a8df75486': 'Per Day',
  '6a34fddfe6c6858a8df75485': 'Per Hour',
  '6a34fcdee6c6858a8df75484': 'United Kingdom',
  '6a34fcd0e6c6858a8df75483': 'New Zealand',
  '6a34fcc0e6c6858a8df75482': 'Ireland',
};

function name(v: Lookup): string {
  if (!v) return '';
  if (typeof v === 'object') return v.name ?? '';
  return LOOKUP_NAMES[v] ?? v;
}

function normalizeJob(j: RawJob): Job {
  const salaryPeriod = name(j.jobSalary);
  const currency = name(j.jobCurrency);
  return {
    id: j._id,
    title: j.jobName ?? '',
    category: name(j.jobType),
    specialism: name(j.jobSpecialization),
    location: name(j.jobLocation),
    salary: salaryPeriod ? `${currency ? currency + ' ' : ''}${salaryPeriod}` : '—',
    salaryPeriod,
    paymentTerms: name(j.jobPaymentTerms),
    currency,
    grade: name(j.jobBand),
    type: name(j.jobContractType),
    client: name(j.jobClient),
    brand: name(j.jobBrand),
    fullTime: name(j.jobFullTime),
    references: j.references ?? '',
    overview: j.overview ?? '',
    responsibilities: j.responsibilities ?? '',
    requirements: j.requierements ?? j.requirements ?? '',
    benefits: j.benefits ?? '',
    status: j.jobStatus ?? 'open',
    createdAt: j.createdAt,
  };
}

export async function getPublicJobs(): Promise<Job[]> {
  const res = await apiRequest<{ jobs?: RawJob[] } | RawJob[]>('/jobs/public', { auth: false });
  const list = Array.isArray(res) ? res : res.jobs ?? [];
  return list.filter((j) => j.isPublished === true).map(normalizeJob);
}

export async function getMyApplications(): Promise<JobApplication[]> {
  const res = await apiRequest<JobApplication[] | { data?: JobApplication[] }>(
    '/job-applications/my-applications',
  );
  return Array.isArray(res) ? res : res.data ?? [];
}

export interface ApplicationInput {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  cv: FormDataFile;
}

export function submitApplication(input: ApplicationInput) {
  const form = new FormData();
  form.append('firstName', input.firstName);
  form.append('lastName', input.lastName);
  form.append('emailAddress', input.email);
  form.append('phone', input.phone);
  if (input.notes) form.append('additionalInformation', input.notes);
  form.append('jobPosting', input.jobId);
  form.append('file', input.cv as any);
  return apiRequest('/job-applications', { method: 'POST', body: form });
}

export const applicationJobId = (a: JobApplication) =>
  typeof a.jobPosting === 'object' ? a.jobPosting?._id : a.jobPosting;

/** Job descriptions are authored as HTML in the admin — render as plain text. */
export function htmlToText(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*li[^>]*>/gi, '\n•  ')
    .replace(/<\/\s*(p|div|h[1-6]|ul|ol)\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
