import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar as NativeStatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { MaterialSymbolsRounded_500Medium } from '@expo-google-fonts/material-symbols-rounded';

import { AppProvider, useApp } from './state/AppStateContext';
import { SignInScreen } from './screens/SignInScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ShiftsScreen } from './screens/ShiftsScreen';
import { ShiftDetailScreen } from './screens/ShiftDetailScreen';
import { ScheduleScreen } from './screens/ScheduleScreen';
import { TimesheetScreen } from './screens/TimesheetScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TabBar } from './components/TabBar';
import { Toast } from './components/Toast';
import { colors } from './theme/theme';

function renderScreen(screen: string) {
  switch (screen) {
    case 'shifts':
      return <ShiftsScreen />;
    case 'detail':
      return <ShiftDetailScreen />;
    case 'schedule':
      return <ScheduleScreen />;
    case 'timesheet':
      return <TimesheetScreen />;
    case 'activity':
      return <ActivityScreen />;
    case 'profile':
      return <ProfileScreen />;
    default:
      return <HomeScreen />;
  }
}

function AppShell() {
  const { state } = useApp();

  if (!state.signedIn) {
    return <SignInScreen />;
  }

  const showTabs = state.screen !== 'detail';

  return (
    <View style={styles.app}>
      <View style={styles.content}>{renderScreen(state.screen)}</View>
      {showTabs && <TabBar active={state.screen} />}
      {state.toast != null && <Toast message={state.toast} />}
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
      <NativeStatusBar
        style="dark"
        backgroundColor={colors.navy800}
        translucent={false}
      />
      <AppProvider>
        <AppShell />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
});
