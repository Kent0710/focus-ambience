import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

class HapticEngine {
  private lastTriggerTime = 0;
  private minIntervalMs = 40;

  public tick() {
    const now = Date.now();
    if (now - this.lastTriggerTime < this.minIntervalMs) {
      return;
    }
    this.lastTriggerTime = now;

    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        Haptics.selectionAsync();
      }
    } catch {
      // Graceful fallback on unsupported environments
    }
  }

  public impactLight() {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch {
      // Fallback
    }
  }

  public impactMedium() {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch {
      // Fallback
    }
  }

  public success() {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      // Fallback
    }
  }
}

export const hapticEngine = new HapticEngine();
