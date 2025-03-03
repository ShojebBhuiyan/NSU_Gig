import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import Colors from './Colors';

export const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.primary,
    onPrimary: '#FFFFFF',
    background: Colors.light.background,
    surface: Colors.light.cardBackground,
    onSurface: Colors.light.text,
    surfaceVariant: '#333333',
    onSurfaceVariant: '#DDDDDD',
  },
};

export const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.primary,
    onPrimary: '#FFFFFF',
    background: Colors.dark.background,
    surface: Colors.dark.cardBackground,
    onSurface: Colors.dark.text,
    surfaceVariant: '#333333',
    onSurfaceVariant: '#DDDDDD',
  },
}; 