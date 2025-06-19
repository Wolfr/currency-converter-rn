import * as React from 'react';
import { View, Pressable, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { AVAILABLE_CURRENCIES, MOCK_EXCHANGE_RATES, type CurrencyCode } from '~/lib/constants';
import { X, Delete } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import KeypadButton from '~/components/ui/KeypadButton';

export default function Screen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;

  // In a real app, this would come from your global state management
  const [selectedCurrencies] = React.useState<CurrencyCode[]>(['USD', 'EUR', 'GBP', 'JPY']);
  const [activeCurrency, setActiveCurrency] = React.useState<CurrencyCode>('USD');
  const [amount, setAmount] = React.useState('0');
  const [isNewAmount, setIsNewAmount] = React.useState(false);

  const appendDigit = (digit: string) => {
    if (isNewAmount) {
      setAmount(digit);
      setIsNewAmount(false);
    } else if (amount === '0' && digit !== '.') {
      setAmount(digit);
    } else if (!amount.includes('.') || digit !== '.') {
      setAmount(prev => prev + digit);
    }
  };

  const clearAmount = () => {
    setAmount('0');
    setIsNewAmount(false);
  };

  const handleBackspace = () => {
    if (isNewAmount) {
      setAmount('0');
      setIsNewAmount(false);
    } else if (amount.length > 1) {
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

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    if (newCurrency === activeCurrency) return;
    
    setActiveCurrency(newCurrency);
    setIsNewAmount(true);
  };

  const renderKeypad = () => (
    <View className='gap-2'>
      <View className='flex-row gap-2'>
        {['7', '8', '9'].map(digit => (
          <KeypadButton key={digit} label={digit} onPress={() => appendDigit(digit)} />
        ))}
      </View>
      <View className='flex-row gap-2'>
        {['4', '5', '6'].map(digit => (
          <KeypadButton key={digit} label={digit} onPress={() => appendDigit(digit)} />
        ))}
      </View>
      <View className='flex-row gap-2'>
        {['1', '2', '3'].map(digit => (
          <KeypadButton key={digit} label={digit} onPress={() => appendDigit(digit)} />
        ))}
      </View>
      <View className='flex-row gap-2'>
        <KeypadButton label='.' onPress={() => appendDigit('.')} />
        <KeypadButton label='0' onPress={() => appendDigit('0')} />
        <KeypadButton label='' onPress={handleBackspace} isIcon={true} IconComponent={<Delete size={24} strokeWidth={2.5} />} />
      </View>
      <KeypadButton label='Clear' onPress={clearAmount} />
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
              onPress={() => handleCurrencyChange(currency.code)}
              className={`flex-row items-center bg-white rounded-lg p-3 ${isActive ? 'border-2 border-primary' : 'border-2 border-transparent'}`}
            >
              <View className='flex-row flex-1 items-center gap-2'>
                <Text className='text-xl'>{currency.flag}</Text>
                <View>
                  <Text className='text-l'>{currency.code}</Text>
                </View>
              </View>
              
              {isActive && isNewAmount ? (
                <Text className='text-lg text-gray-400'>Enter amount</Text>
              ) : (
                <Text className='text-lg font-medium'>
                  {isActive ? amount : convertAmount(activeCurrency, currency.code, amount)}
                </Text>
              )}
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
        <View className='flex-1 flex-row gap-4'>
          <View className='flex-1 p-4'>
            {renderCurrencyList()}
          </View>
          <View className='justify-end p-4' style={{ 
            paddingTop: Platform.OS === 'ios' ? 12 : 0,
            width: 280
          }}>
            {renderKeypad()}
          </View>
        </View>
      ) : (
        <View className='flex-1'>
          <View className='p-4'>
            {renderCurrencyList()}
          </View>
          <View className='mt-auto p-4 pb-8'>
            {renderKeypad()}
          </View>
        </View>
      )}
    </View>
  );
}
