import { TextStyle, Platform } from 'react-native';

export const typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'system-ui',
  }),
  tabularFont: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
  sizes: {
    hero: 72,
    large: 32,
    body: 16,
    caption: 13,
    micro: 10,
  },
  weights: {
    light: '300' as TextStyle['fontWeight'],
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },
  letterSpacing: {
    tight: -1.5,
    normal: 0,
    wide: 1.5,
    extraWide: 3,
  },
};
