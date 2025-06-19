import * as React from 'react';
import { View, Pressable, ScrollView, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Delete } from 'lucide-react-native';
import KeypadButton from '~/components/ui/KeypadButton';
import { getSelectedCurrencies } from '~/lib/utils';
import { useIsFocused } from '@react-navigation/native';
import { fetchExchangeRates, fetchSupportedCurrencies, type Currency } from '~/lib/api';

export default function Screen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;
  const isFocused = useIsFocused();

  const [selectedCurrencies, setSelectedCurrencies] = React.useState<string[]>([]);
  const [activeCurrency, setActiveCurrency] = React.useState<string>('USD');
  const [amount, setAmount] = React.useState('0');
  const [isNewAmount, setIsNewAmount] = React.useState(false);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [exchangeRates, setExchangeRates] = React.useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Load currencies and exchange rates
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load selected currencies first
        const saved = await getSelectedCurrencies();
        setSelectedCurrencies(saved);
        if (!saved.includes(activeCurrency)) {
          setActiveCurrency(saved[0]);
        }

        // Fetch currencies
        const { currencies: fetchedCurrencies, error: currenciesError } = await fetchSupportedCurrencies();
        if (currenciesError) throw new Error(currenciesError);
        if (!fetchedCurrencies) throw new Error('No currencies fetched');
        
        setCurrencies(fetchedCurrencies);

        // Fetch exchange rates only for selected currencies
        const { rates, error: ratesError } = await fetchExchangeRates(saved);
        if (ratesError) throw new Error(ratesError);
        if (!rates) throw new Error('No exchange rates fetched');

        setExchangeRates(rates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isFocused]); // Reload when screen is focused

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

  const convertAmount = (from: string, to: string, amount: string): string => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || !exchangeRates[from] || !exchangeRates[to]) return '0.00';
    
    // Convert using USD as the base currency
    const inUSD = numericAmount / exchangeRates[from];
    const converted = inUSD * exchangeRates[to];
    
    return converted.toFixed(2);
  };

  const handleCurrencyChange = (newCurrency: string) => {
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
        <KeypadButton 
          label='' 
          onPress={handleBackspace} 
          isIcon={true} 
          IconComponent={<Delete size={24} strokeWidth={2.5} />}
          disabled={amount === '0'} 
        />
      </View>
      <View className='flex-row gap-2'>
          <KeypadButton label="Clear" onPress={() => clearAmount()} />
      </View>
    </View>
  );

  const renderCurrencyList = () => {
    if (isLoading) {
      return (
        <View className='flex-1 items-center justify-center mt-8'>
          <ActivityIndicator size="large" className='mb-4' />
          <Text className='text-gray-500'>Loading currencies...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className='flex-1 items-center justify-center p-4'>
          <Text className='text-red-500 text-center mb-2'>{error}</Text>
          <Text className='text-gray-500 text-center'>Please check your internet connection and try again.</Text>
        </View>
      );
    }

    return (
      <ScrollView>
        <View className='gap-2'>
          {selectedCurrencies.map((currencyCode) => {
            const currency = currencies.find(c => c.code === currencyCode);
            if (!currency) return null;
            
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
                    <Text className='text-sm text-gray-500'>{currency.name}</Text>
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
  };

  return (
    <View 
      className='flex-1 justify-between bg-gray-100'
      style={{
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
        <View>
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
