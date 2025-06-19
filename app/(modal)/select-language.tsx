import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { router } from 'expo-router';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'fa', name: 'فارسی' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'de', name: 'Deutsch' },
  { code: 'he', name: 'עברית' },
  { code: 'hi', name: 'हिन्दी' },
];

export default function SelectLanguageScreen() {
  const handleLanguageSelect = (code: string) => {
    // In a real app, we would save the language preference here
    router.back();
  };

  return (
    <View className='flex-1 bg-gray-100'>
      <ScrollView className='flex-1 p-4'>
        <View className='gap-2'>
          {LANGUAGES.map((language) => (
            <Button
              key={language.code}
              variant='outline'
              onPress={() => handleLanguageSelect(language.code)}
              className='flex-row items-center justify-center'
            >
              <Text>{language.name}</Text>
            </Button>
          ))}
        </View>
        <Text className='text-sm text-gray-500 text-center pt-4 pb-4'>
          Multi Currency Converter v1.3.0 is a free app by Obra Studio.
        </Text>

      </ScrollView>
    </View>
  );
} 