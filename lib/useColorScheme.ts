import { useColorScheme as useNativeColorScheme } from 'react-native';

export function useColorScheme() {
  const colorScheme = useNativeColorScheme();
  return {
    colorScheme: (colorScheme || 'light') as 'light' | 'dark'
  };
} 