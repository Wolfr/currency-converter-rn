import { View, FlatList, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { useState } from 'react';

type Currency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  enabled: boolean;
};

const INITIAL_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', enabled: true },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', enabled: true },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', enabled: true },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', enabled: false },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', enabled: false },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', enabled: false },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭', enabled: false },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', enabled: false },
];

export default function EditCurrencies() {
  const [currencies, setCurrencies] = useState(INITIAL_CURRENCIES);

  const toggleCurrency = (code: string) => {
    setCurrencies(prev => 
      prev.map(currency => 
        currency.code === code 
          ? { ...currency, enabled: !currency.enabled }
          : currency
      )
    );
  };

  const renderItem = ({ item }: { item: Currency }) => (
    <Pressable 
      onPress={() => toggleCurrency(item.code)}
      className="flex-row items-center p-4 gap-2 border-b border-gray-200 active:bg-gray-100 space-x-3"
    >
      <View 
        className={`w-5 h-5 border rounded ${
          item.enabled ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
        } items-center justify-center`}
      >
        {item.enabled && (
          <Text className="text-white text-sm">✓</Text>
        )}
      </View>
      <Text className="text-lg">{item.flag}</Text>
      <Text className="font-medium">{item.code}</Text>
      <Text className="text-gray-500">-</Text>
      <Text className="text-gray-500">{item.name}</Text>
    </Pressable>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={currencies}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
        className="flex-1"
      />
    </View>
  );
} 