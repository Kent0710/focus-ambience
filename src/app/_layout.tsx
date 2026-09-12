import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from '../core/theme/ThemeContext';
import { AmbientProvider } from '../features/ambient/state/AmbientContext';
import { TimerProvider } from '../features/timer/state/TimerContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen once mounted
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <AmbientProvider>
          <TimerProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </TimerProvider>
        </AmbientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
