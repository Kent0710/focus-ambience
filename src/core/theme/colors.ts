export interface ThemeColors {
  background: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderActive: string;
  dotEmpty: string;
  dotFilled: string;
  pillBackground: string;
  pillBorder: string;
  accent: string;
}

export const darkColors: ThemeColors = {
  background: '#000000',
  textPrimary: '#EDEDED',
  textSecondary: '#71717A',
  textTertiary: '#3F3F46',
  border: '#27272A',
  borderActive: '#EDEDED',
  dotEmpty: '#27272A',
  dotFilled: '#EDEDED',
  pillBackground: '#09090B',
  pillBorder: '#27272A',
  accent: '#FFFFFF',
};

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  textPrimary: '#111111',
  textSecondary: '#71717A',
  textTertiary: '#D4D4D8',
  border: '#E4E4E7',
  borderActive: '#111111',
  dotEmpty: '#E4E4E7',
  dotFilled: '#111111',
  pillBackground: '#F4F4F5',
  pillBorder: '#E4E4E7',
  accent: '#000000',
};
