import { Job } from '../api/types';

/** Same facets, in the same order, as the web portal's filter sidebar. */
export const FACETS = [
  { title: 'Job Type', field: 'category' },
  { title: 'Specialisms', field: 'specialism' },
  { title: 'Payment Amount', field: 'paymentTerms' },
  { title: 'Salary', field: 'salaryPeriod' },
  { title: 'Grade/Band', field: 'grade' },
  { title: 'Contract Type', field: 'type' },
  { title: 'Locations', field: 'location' },
  { title: 'Clients', field: 'client' },
  { title: 'Full/Part Time', field: 'fullTime' },
  { title: 'Currency', field: 'currency' },
  { title: 'Brand', field: 'brand' },
] as const satisfies readonly { title: string; field: keyof Job }[];

export type FacetTitle = (typeof FACETS)[number]['title'];
export type Selected = Partial<Record<FacetTitle, string[]>>;

const includes = (haystack: string, needle: string) =>
  haystack.toLowerCase().includes(needle.trim().toLowerCase());

function matchesFacet(job: Job, facet: (typeof FACETS)[number], value: string) {
  const v = String(job[facet.field] ?? '');
  return facet.field === 'location' ? includes(v, value) : v === value;
}

function matchesAll(job: Job, selected: Selected) {
  return FACETS.every((f) => {
    const values = selected[f.title] ?? [];
    return values.length === 0 || values.some((v) => matchesFacet(job, f, v));
  });
}

export function filterJobs(jobs: Job[], query: string, location: string, selected: Selected) {
  return jobs.filter(
    (j) =>
      (!query.trim() || includes(`${j.title} ${j.category} ${j.type} ${j.specialism}`, query)) &&
      (!location.trim() || includes(j.location, location)) &&
      matchesAll(j, selected),
  );
}

/** Each facet's options with the count a selection of that option would yield. */
export function facetOptions(jobs: Job[], selected: Selected) {
  return FACETS.map((f) => {
    const values = [...new Set(jobs.map((j) => String(j[f.field] ?? '')).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b),
    );
    const options = values
      .map((value) => {
        const trial = { ...selected, [f.title]: [value] };
        return { value, count: jobs.filter((j) => matchesAll(j, trial)).length };
      })
      .filter((o) => o.count > 0);
    return { title: f.title, options };
  }).filter((f) => f.options.length > 0);
}

export const selectedCount = (selected: Selected) =>
  Object.values(selected).reduce((n, v) => n + (v?.length ?? 0), 0);
