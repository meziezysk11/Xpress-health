import { apiRequest } from './client';
import { LoginResponse, User } from './types';

export const userId = (u: User | null | undefined) => u?.id || u?._id || '';

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export function logout() {
  return apiRequest('/auth/logout', { method: 'POST' });
}

export function getProfile() {
  return apiRequest<{ user?: User }>('/auth/profile');
}

export function updateProfile(id: string, fields: Pick<User, 'firstName' | 'lastName' | 'phone'>) {
  return apiRequest<{ user?: User }>(`/users/profile/${id}`, { method: 'PUT', body: fields });
}

export function uploadProfileImage(id: string, file: FormDataFile) {
  const form = new FormData();
  form.append('file', file as any);
  return apiRequest<{ user?: User }>(`/users/profile/${id}`, { method: 'PUT', body: form });
}

export async function changePassword(
  id: string,
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string,
) {
  const body = { id, currentPassword, newPassword, confirmNewPassword };
  // Same fallback as the web portal.
  try {
    return await apiRequest('/auth/change-user-password', { method: 'PUT', body });
  } catch {
    return apiRequest('/admin/auth/change-user-password', { method: 'PUT', body });
  }
}

export function forgotPassword(email: string) {
  return apiRequest<{ success?: boolean; message?: string }>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
    auth: false,
  });
}

export function verifyOtp(email: string, otp: string) {
  return apiRequest<{ success?: boolean }>('/auth/verify-otp', {
    method: 'POST',
    body: { email, otp },
    auth: false,
  });
}

export function resendOtp(email: string) {
  return apiRequest<{ success?: boolean }>('/auth/resend-otp', {
    method: 'POST',
    body: { email },
    auth: false,
  });
}

export function resetPassword(otp: string, password: string) {
  return apiRequest<{ success?: boolean }>('/auth/reset-password', {
    method: 'POST',
    body: { otp, password },
    auth: false,
  });
}

/**
 * React Native's FormData accepts `{ uri, name, type }`; on web the picker
 * hands back a real `File`, which is passed through as-is.
 */
export type FormDataFile = { uri: string; name: string; type: string } | Blob;

/** Mirrors the web portal's role check — the app is for candidates only. */
export function isElevatedUser(user: User | undefined): boolean {
  if (!user) return false;
  const kind = String(user.accountType || user.userType || '').toLowerCase();
  if (['admin', 'super_admin', 'content_admin'].includes(kind)) return true;
  const role = user.role;
  const raw = typeof role === 'object' && role ? `${role.name ?? ''} ${role.label ?? ''}` : String(role ?? '');
  const r = raw.toLowerCase().replace(/[\s-]+/g, '_');
  // Known role ids from the web bundle.
  if (raw.includes('6a31ec2f1a0ad0b5d94734dc')) return true;
  return /super_?admin|content_?admin|(^|_)admin/.test(r);
}

export function displayName(u: User | null | undefined) {
  return `${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim() || 'Candidate';
}

export function initials(u: User | null | undefined) {
  const s = `${u?.firstName?.charAt(0) ?? ''}${u?.lastName?.charAt(0) ?? ''}`.toUpperCase();
  return s || 'U';
}

export function avatarUrl(u: User | null | undefined): string | undefined {
  if (!u) return undefined;
  const f = typeof u.file === 'object' ? u.file?.url : u.file;
  return f || u.profileImage || u.avatar || undefined;
}

/** The candidate portal labels every account "Candidate" (admins can't sign in). */
export function roleLabel(_u: User | null | undefined) {
  return 'Candidate';
}
