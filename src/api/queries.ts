import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import {
  QueryClient,
  focusManager,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { ApiError } from './client';
import * as auth from './auth';
import * as jobs from './jobs';
import { useAuthStore } from '../state/stores/authStore';
import { useNavigation } from '../state/stores/navigationStore';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      // Never retry auth failures; one retry covers Render cold starts.
      retry: (count, error) =>
        !(error instanceof ApiError && [401, 403, 404].includes(error.status)) && count < 1,
    },
  },
});

export const queryKeys = {
  jobs: ['jobs', 'public'] as const,
  myApplications: ['applications', 'mine'] as const,
  profile: ['profile'] as const,
};

/** Refetch stale queries when the app returns to the foreground. */
export function useAppFocusRefetch() {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = AppState.addEventListener('change', (s) => focusManager.setFocused(s === 'active'));
    return () => sub.remove();
  }, []);
}

const useSignedIn = () => useAuthStore((s) => Boolean(s.token));

// ── Queries ────────────────────────────────────────────────────────────────

export function useJobs() {
  return useQuery({ queryKey: queryKeys.jobs, queryFn: jobs.getPublicJobs });
}

export function useMyApplications() {
  return useQuery({
    queryKey: queryKeys.myApplications,
    queryFn: jobs.getMyApplications,
    enabled: useSignedIn(),
  });
}

/** Ids of jobs the candidate has already applied to. */
export function useAppliedJobIds(): Set<string> {
  const { data } = useMyApplications();
  return new Set((data ?? []).map(jobs.applicationJobId).filter((id): id is string => Boolean(id)));
}

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const res = await auth.getProfile();
      if (res.user) useAuthStore.getState().updateUser(res.user);
      return res.user ?? null;
    },
    enabled: useSignedIn(),
  });
}

// ── Mutations ──────────────────────────────────────────────────────────────

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      let res;
      try {
        res = await auth.login(email.trim(), password);
      } catch (e) {
        if (e instanceof ApiError && (e.status === 403 || /activation required/i.test(e.message))) {
          throw new ApiError(
            'Your account needs to be activated. Check your email for the activation link.',
            403,
          );
        }
        throw e;
      }
      const user = res.user ?? res.admin;
      if (!res.token || !user) throw new ApiError(res.message || 'Sign in failed', 0);
      if (user.isVerified === false) {
        throw new ApiError('Please verify your email address before signing in.', 403);
      }
      if (auth.isElevatedUser(user)) {
        throw new ApiError(
          'This app is only for candidates. Administrators should sign in on the admin site.',
          403,
        );
      }
      return { user, token: res.token };
    },
    onSuccess: ({ user, token }) => {
      queryClient.clear();
      useNavigation.getState().reset();
      useAuthStore.getState().setSession(user, token);
    },
  });
}

export function useLogout() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => auth.logout().catch(() => undefined),
    onSettled: () => {
      useAuthStore.getState().clearSession();
      useNavigation.getState().reset();
      client.clear();
    },
  });
}

export function useSubmitApplication() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: jobs.submitApplication,
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.myApplications }),
  });
}

export function useUpdateProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      firstName: string;
      lastName: string;
      phone: string;
      photo?: auth.FormDataFile;
    }) => {
      const id = auth.userId(useAuthStore.getState().user);
      if (input.photo) {
        const res = await auth.uploadProfileImage(id, input.photo);
        if (res?.user) useAuthStore.getState().updateUser(res.user);
      }
      const fields = { firstName: input.firstName, lastName: input.lastName, phone: input.phone };
      await auth.updateProfile(id, fields);
      useAuthStore.getState().updateUser(fields);
    },
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.profile }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (p: { current: string; next: string; confirm: string }) =>
      auth.changePassword(auth.userId(useAuthStore.getState().user), p.current, p.next, p.confirm),
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: auth.forgotPassword });
}

export function useResendOtp() {
  return useMutation({ mutationFn: auth.resendOtp });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (p: { email: string; otp: string; password: string }) => {
      await auth.verifyOtp(p.email, p.otp);
      await auth.resetPassword(p.otp, p.password);
    },
  });
}
