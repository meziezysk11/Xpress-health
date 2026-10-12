import React, { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar as NativeStatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { MaterialSymbolsRounded_500Medium } from '@expo-google-fonts/material-symbols-rounded';

import { queryClient, useAppFocusRefetch } from './api/queries';
import { useAuthStore } from './state/stores/authStore';
import { Route, currentRoute, routeTab, useNavigation } from './state/stores/navigationStore';
import { useToast } from './state/stores/toastStore';
import { SignInScreen } from './screens/SignInScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { HomeScreen } from './screens/HomeScreen';
import { JobsScreen } from './screens/JobsScreen';
import { JobDetailScreen } from './screens/JobDetailScreen';
import { ApplyScreen } from './screens/ApplyScreen';
import { ApplicationsScreen } from './screens/ApplicationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TabBar } from './components/TabBar';
import { Toast } from './components/Toast';
import { colors } from './theme/theme';

function renderRoute(route: Route) {
  switch (route.name) {
    case 'jobs':
      return <JobsScreen />;
    case 'job':
      return <JobDetailScreen jobId={route.jobId} />;
    case 'apply':
      return <ApplyScreen key={route.jobId} jobId={route.jobId} />;
    case 'applications':
      return <ApplicationsScreen />;
    case 'profile':
      return <ProfileScreen />;
    default:
      return <HomeScreen />;
  }
}

function SignedOut() {
  const welcomeSeen = useAuthStore((s) => s.welcomeSeen);
  const markWelcomeSeen = useAuthStore((s) => s.markWelcomeSeen);
  const [forgot, setForgot] = useState(false);

  useEffect(() => {
    if (!forgot) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setForgot(false);
      return true;
    });
    return () => sub.remove();
  }, [forgot]);

  if (!welcomeSeen) return <WelcomeScreen onComplete={markWelcomeSeen} />;
  if (forgot) return <ForgotPasswordScreen onDone={() => setForgot(false)} />;
  return <SignInScreen onForgotPassword={() => setForgot(true)} />;
}

function SignedIn() {
  const stack = useNavigation((s) => s.stack);
  const route = currentRoute(stack);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => useNavigation.getState().back());
    return () => sub.remove();
  }, []);

  // Tab bar only on the four root screens; pushed screens own their footer.
  const showTabs = stack.length === 1;
  return (
    <>
      <View style={styles.content}>{renderRoute(route)}</View>
      {showTabs && <TabBar active={routeTab(stack)} />}
    </>
  );
}

function AppShell() {
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.token));
  const toast = useToast((s) => s.toast);
  useAppFocusRefetch();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => useToast.getState().clearToast(), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!hydrated) {
    return (
      <View style={[styles.app, styles.center]}>
        <ActivityIndicator color={colors.blue} />
      </View>
    );
  }

  return (
    <View style={styles.app}>
      {signedIn ? <SignedIn /> : <SignedOut />}
      {toast != null && <Toast toast={toast} />}
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    MaterialSymbolsRounded_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NativeStatusBar style="light" backgroundColor={colors.navy800} translucent={false} />
      <QueryClientProvider client={queryClient}>
        <AppShell />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: {
    flex: 1,
    minHeight: 0,
  },
});
