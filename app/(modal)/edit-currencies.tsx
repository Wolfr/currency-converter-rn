import * as React from 'react';
import { View, ScrollView, TextInput, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Checkbox } from '~/components/ui/checkbox';
import { AVAILABLE_CURRENCIES } from '~/lib/constants';
import { Search, X } from 'lucide-react-native';

export default function EditCurrenciesScreen() {
  const [selectedCurrencies, setSelectedCurrencies] = React.useState<string[]>(['EUR', 'GBP', 'JPY', 'AUD']);
  const [searchQuery, setSearchQuery] = React.useState('');

  const toggleCurrency = (code: string) => {
    setSelectedCurrencies(prev => 
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filteredCurrencies = AVAILABLE_CURRENCIES.filter(currency => {
    const query = searchQuery.toLowerCase();
    return (
      currency.code.toLowerCase().includes(query) ||
      currency.name.toLowerCase().includes(query)
    );
  });

  return (
    <ScrollView className='flex-1 bg-secondary/30'>
      <View className='p-4 gap-4'>
        {/* Search Input */}
        <View className='flex-row items-center bg-white rounded-lg px-3 h-12'>
          <Search size={20} color="#666" />
          <TextInput
            className='flex-1 ml-2 text-base py-2'
            placeholder="Search currencies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            style={{ lineHeight: undefined }}
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={clearSearch}
              className='h-5 w-5 rounded-full bg-gray-200 items-center justify-center'
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={15} color="#666" />
            </Pressable>
          )}
        </View>

        {/* Currency List */}
        <View className='gap-2'>
          {filteredCurrencies.map((currency) => (
            <View
              key={currency.code}
              className='flex-row items-center bg-white rounded-lg p-3'
            >
              <View className='flex-row flex-1 items-center gap-2'>
                <Text className='text-xl'>{currency.flag}</Text>
                <View>
                  <Text className='font-medium text-lg'>{currency.name}</Text>
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