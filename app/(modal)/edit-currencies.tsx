import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Checkbox } from '~/components/ui/checkbox';
import { AVAILABLE_CURRENCIES } from '~/lib/constants';

export default function EditCurrenciesScreen() {
  const [selectedCurrencies, setSelectedCurrencies] = React.useState<string[]>(['EUR', 'GBP', 'JPY', 'AUD']);

  const toggleCurrency = (code: string) => {
    setSelectedCurrencies(prev => 
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  return (
    <ScrollView className='flex-1 bg-secondary/30'>
      <View className='p-4'>
        <View className='gap-2'>
          {AVAILABLE_CURRENCIES.map((currency) => (
            <View
              key={currency.code}
              className='flex-row items-center bg-white rounded-lg p-3'
            >
              <View className='flex-row flex-1 items-center gap-2'>
                <Text className='text-xl'>{currency.flag}</Text>
                <View>
                  <Text className='font-medium text-sm'>{currency.name}</Text>
                  <Text className='text-xs text-gray-500'>{currency.code}</Text>
                </View>
              </View>
              
              <Checkbox
                checked={selectedCurrencies.includes(currency.code)}
                onCheckedChange={() => toggleCurrency(currency.code)}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
} 