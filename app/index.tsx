import * as React from 'react';
import { View, Pressable, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { AVAILABLE_CURRENCIES, MOCK_EXCHANGE_RATES, type CurrencyCode } from '~/lib/constants';
import { X } from 'lucide-react-native';

export default function Screen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;

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

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(prev => prev.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const convertAmount = (from: CurrencyCode, to: CurrencyCode, amount: string): string => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return '0.00';
    
    // Convert to USD first (our base rate), then to target currency
    const inUSD = numericAmount / MOCK_EXCHANGE_RATES[from];
    const converted = inUSD * MOCK_EXCHANGE_RATES[to];
    
    return converted.toFixed(2);
  };

  const renderKeypad = () => (
    <View className='gap-2'>
      {/* Row 1: 7-8-9 */}
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
      
      {/* Row 2: 4-5-6 */}
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
      
      {/* Row 3: 1-2-3 */}
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
      
      {/* Row 4: .-0-backspace */}
      <View className='flex-row gap-2'>
        <Pressable
          onPress={() => appendDigit('.')}
          className='flex-1 bg-white rounded-lg h-14 items-center justify-center'
        >
          <Text className='text-xl'>.</Text>
        </Pressable>
        <Pressable
          onPress={() => appendDigit('0')}
          className='flex-1 bg-white rounded-lg h-14 items-center justify-center'
        >
          <Text className='text-xl'>0</Text>
        </Pressable>
        <Pressable
          onPress={handleBackspace}
          className='flex-1 bg-white rounded-lg h-14 items-center justify-center'
        >
          <X size={24} />
        </Pressable>
      </View>

      {/* Row 5: Clear (full width) */}
      <Pressable
        onPress={clearAmount}
        className='bg-white rounded-lg h-14 items-center justify-center'
      >
        <Text className='text-xl'>Clear</Text>
      </Pressable>
    </View>
  );

  const renderCurrencyList = () => (
    <ScrollView>
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
  );

  return (
    <View 
      className='flex-1 bg-secondary/30'
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {isLandscape ? (
        // Landscape layout
        <View className='flex-1 flex-row p-4 gap-4'>
          <View className='flex-1'>
            {renderCurrencyList()}
          </View>
          <View className='w-[280px]' style={{ 
            // Add extra padding for Dynamic Island in landscape
            paddingTop: Platform.OS === 'ios' ? 12 : 0
          }}>
            {renderKeypad()}
          </View>
        </View>
      ) : (
        // Portrait layout
        <View className='flex-1'>
          <View className='flex-1 p-4'>
            {renderCurrencyList()}
          </View>
          <View className='p-4 pb-8'>
            {renderKeypad()}
          </View>
        </View>
      )}
    </View>
  );
}
