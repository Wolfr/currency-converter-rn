import * as React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { AVAILABLE_CURRENCIES, MOCK_EXCHANGE_RATES, type CurrencyCode } from '~/lib/constants';

export default function Screen() {
  // In a real app, this would come from your global state management
  const [selectedCurrencies] = React.useState<CurrencyCode[]>(['USD', 'EUR', 'GBP', 'JPY']);
  const [activeCurrency, setActiveCurrency] = React.useState<CurrencyCode>('USD');
  const [amount, setAmount] = React.useState('0');

  const appendDigit = (digit: string) => {
    if (amount === '0' && digit !== '.') {
      setAmount(digit);
    } else if (!amount.includes('.') || digit !== '.') {
      setAmount(prev => prev + digit);
    }
  };

  const clearAmount = () => {
    setAmount('0');
  };

  const convertAmount = (from: CurrencyCode, to: CurrencyCode, amount: string): string => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return '0.00';
    
    // Convert to USD first (our base rate), then to target currency
    const inUSD = numericAmount / MOCK_EXCHANGE_RATES[from];
    const converted = inUSD * MOCK_EXCHANGE_RATES[to];
    
    return converted.toFixed(2);
  };

  return (
    <View className='flex-1 bg-secondary/30'>
      {/* Currency List */}
      <ScrollView className='flex-1 p-4'>
        <View className='gap-2'>
          {selectedCurrencies.map((currencyCode) => {
            const currency = AVAILABLE_CURRENCIES.find(c => c.code === currencyCode)!;
            const isActive = activeCurrency === currencyCode;
            
            return (
              <Pressable
                key={currency.code}
                onPress={() => setActiveCurrency(currency.code)}
                className={`flex-row items-center bg-white rounded-lg p-3 ${isActive ? 'border-2 border-primary' : 'border-2 border-transparent'}`}
              >
                <View className='flex-row flex-1 items-center gap-2'>
                  <Text className='text-xl'>{currency.flag}</Text>
                  <View>
                    <Text className='text-l'>{currency.code}</Text>
                  </View>
                </View>
                
                <Text className='text-lg font-medium'>
                  {isActive ? amount : convertAmount(activeCurrency, currency.code, amount)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Keypad */}
      <View className='p-4'>
        <View className='gap-2'>
          {/* Row 1 */}
          <View className='flex-row gap-2'>
            {['1', '2', '3'].map(digit => (
              <Pressable
                key={digit}
                onPress={() => appendDigit(digit)}
                className='flex-1 bg-white rounded-lg h-14 items-center justify-center'
              >
                <Text className='text-xl'>{digit}</Text>
              </Pressable>
            ))}
          </View>
          
          {/* Row 2 */}
          <View className='flex-row gap-2'>
            {['4', '5', '6'].map(digit => (
              <Pressable
                key={digit}
                onPress={() => appendDigit(digit)}
                className='flex-1 bg-white rounded-lg h-14 items-center justify-center'
              >
                <Text className='text-xl'>{digit}</Text>
              </Pressable>
            ))}
          </View>
          
          {/* Row 3 */}
          <View className='flex-row gap-2'>
            {['7', '8', '9'].map(digit => (
              <Pressable
                key={digit}
                onPress={() => appendDigit(digit)}
                className='flex-1 bg-white rounded-lg h-14 items-center justify-center'
              >
                <Text className='text-xl'>{digit}</Text>
              </Pressable>
            ))}
          </View>
          
          {/* Row 4 */}
          <View className='flex-row gap-2'>
            <Pressable
              onPress={clearAmount}
              className='flex-1 bg-white rounded-lg h-14 items-center justify-center'
            >
              <Text className='text-xl'>C</Text>
            </Pressable>
            <Pressable
              onPress={() => appendDigit('0')}
              className='flex-1 bg-white rounded-lg h-14 items-center justify-center'
            >
              <Text className='text-xl'>0</Text>
            </Pressable>
            <Pressable
              onPress={() => appendDigit('.')}
              className='flex-1 bg-white rounded-lg h-14 items-center justify-center'
            >
              <Text className='text-xl'>.</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
