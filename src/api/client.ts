/**
 * Thin fetch wrapper for the Achievers Professionals API — mirrors the web
 * portal's `apiRequest`: JSON by default, FormData passed through, bearer
 * token attached, server error messages surfaced as `ApiError.message`.
 */

export const API_ORIGIN = 'https://achievers-professionals-server.onrender.com';
export const API_BASE_URL = `${API_ORIGIN}/api`;

/** Render's free tier cold-starts in ~30–50s, so be generous. */
const TIMEOUT_MS = 60000;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

let tokenGetter: () => string | null = () => null;
let unauthorizedHandler: () => void = () => {};

/** Wired up by the auth store so the client never imports it directly. */
export function configureApiClient(opts: {
  getToken: () => string | null;
  onUnauthorized: () => void;
}) {
  tokenGetter = opts.getToken;
  unauthorizedHandler = opts.onUnauthorized;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Set false for endpoints that must not carry the session token. */
  auth?: boolean;
}

export async function apiRequest<T = any>(
  path: string,
  { method = 'GET', body, auth = true }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';

  const token = auth ? tokenGetter() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e: any) {
    throw new ApiError(
      e?.name === 'AbortError'
        ? 'The server took too long to respond. Please try again.'
        : 'Network error — check your connection and try again.',
      0,
    );
  } finally {
    clearTimeout(timer);
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    let message: string = data?.error || data?.message || `Request failed (${res.status})`;
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      message = data.errors.map((e: any) => e.msg ?? String(e)).join(', ');
    }
    // A stale/expired token on an authenticated call ends the session.
    if (res.status === 401 && token) unauthorizedHandler();
    throw new ApiError(message, res.status);
  }

  return data as T;
}
