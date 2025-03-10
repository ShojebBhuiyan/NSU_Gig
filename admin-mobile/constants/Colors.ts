/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2E7D32'; // Green
const tintColorDark = '#4CAF50';

export default {
  light: {
    text: '#ffffff',
    background: '#000000',
    tint: tintColorLight,
    tabIconDefault: '#888888',
    tabIconSelected: tintColorLight,
    cardBackground: '#1A1A1A',
    primary: '#2E7D32',
    secondary: '#4CAF50',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#FFA000',
    info: '#1976D2',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    tint: tintColorDark,
    tabIconDefault: '#888888',
    tabIconSelected: tintColorDark,
    cardBackground: '#1A1A1A',
    primary: '#4CAF50',
    secondary: '#81C784',
    error: '#F44336',
    success: '#66BB6A',
    warning: '#FFB74D',
    info: '#42A5F5',
  },
};
