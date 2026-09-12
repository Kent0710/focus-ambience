import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import { useAppTheme } from '../core/theme/ThemeContext';
import { TopHeader } from '../shared/components/TopHeader';
import { DailySessionDots } from '../features/session-log/components/DailySessionDots';
import { CountdownDisplay } from '../features/timer/components/CountdownDisplay';
import { TimerProgressBar } from '../features/timer/components/TimerProgressBar';
import { SoundPickerPill } from '../features/ambient/components/SoundPickerPill';
import { useAmbient } from '../features/ambient/state/useAmbient';

export default function MonoFocusScreen() {
  const { colors, isDark } = useAppTheme();
  const { nextSound, prevSound } = useAmbient();

  // Full-screen horizontal swipe gesture to cycle ambient sounds
  const onHorizontalSwipe = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      if (translationX < -50 || velocityX < -500) {
        nextSound();
      } else if (translationX > 50 || velocityX > 500) {
        prevSound();
      }
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <PanGestureHandler onHandlerStateChange={onHorizontalSwipe}>
        <View style={styles.container}>
          {/* Top Section */}
          <View style={styles.topSection}>
            <TopHeader />
            <DailySessionDots />
          </View>

          {/* Center Main Countdown Dial */}
          <View style={styles.centerSection}>
            <CountdownDisplay />
            <TimerProgressBar />
          </View>

          {/* Bottom Ambient Soundscape Section */}
          <View style={styles.bottomSection}>
            <SoundPickerPill />
          </View>
        </View>
      </PanGestureHandler>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 8,
  },
});
