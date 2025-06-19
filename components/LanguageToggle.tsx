import * as React from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Languages } from '~/lib/icons/Languages';

export function LanguageToggle() {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push('/select-language')}>
      <Languages className="h-6 w-6" />
    </Pressable>
  );
} 