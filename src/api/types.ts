/** Shapes returned by the Achievers Professionals API (only fields we use). */

export interface FileRef {
  url?: string;
  filename?: string;
}

export interface User {
  id?: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: { name?: string; label?: string } | string;
  accountType?: string;
  userType?: string;
  isVerified?: boolean;
  file?: FileRef | string;
  profileImage?: string;
  avatar?: string;
  createdAt?: string;
}

export interface LoginResponse {
  success?: boolean;
  token?: string;
  user?: User;
  admin?: User;
  message?: string;
}

/** A lookup value (type, band, location…) — populated object or raw id. */
export type Lookup = { _id?: string; name?: string } | string | null | undefined;

export interface RawJob {
  _id: string;
  jobName?: string;
  isPublished?: boolean;
  jobStatus?: string;
  references?: string;
  overview?: string;
  responsibilities?: string;
  requierements?: string;
  requirements?: string;
  benefits?: string;
  jobType?: Lookup;
  jobSpecialization?: Lookup;
  jobLocation?: Lookup;
  jobSalary?: Lookup;
  jobCurrency?: Lookup;
  jobPaymentTerms?: Lookup;
  jobBand?: Lookup;
  jobContractType?: Lookup;
  jobClient?: Lookup;
  jobBrand?: Lookup;
  jobFullTime?: Lookup;
  createdAt?: string;
}

/** Flattened job, same derivation as the web portal's Apply for Jobs page. */
export interface Job {
  id: string;
  title: string;
  category: string;
  specialism: string;
  location: string;
  salary: string;
  salaryPeriod: string;
  paymentTerms: string;
  currency: string;
  grade: string;
  type: string;
  client: string;
  brand: string;
  fullTime: string;
  references: string;
  overview: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  status: string;
  createdAt?: string;
}

export interface JobApplication {
  _id: string;
  jobPosting?: { _id?: string; jobName?: string } | string;
  status?: string;
  appliedDate?: string;
  createdAt?: string;
  file?: FileRef;
}
