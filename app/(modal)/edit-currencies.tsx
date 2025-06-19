import * as React from 'react';
import { View, ScrollView, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Text } from '~/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Checkbox } from '~/components/ui/checkbox';
import { useRouter } from 'expo-router';
import { getSelectedCurrencies, saveSelectedCurrencies } from '~/lib/utils';
import { fetchSupportedCurrencies, type Currency } from '~/lib/api';
import { Search, X } from 'lucide-react-native';

export default function EditCurrencies() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedCurrencies, setSelectedCurrencies] = React.useState<string[]>([]);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Load currencies
  React.useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load selected currencies
        const saved = await getSelectedCurrencies();
        setSelectedCurrencies(saved);

        // Fetch available currencies
        const { currencies: fetchedCurrencies, error: currenciesError } = await fetchSupportedCurrencies();
        if (currenciesError) throw new Error(currenciesError);
        if (!fetchedCurrencies) throw new Error('No currencies fetched');
        
        setCurrencies(fetchedCurrencies);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error loading currencies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleCurrency = async (code: string) => {
    const newSelection = selectedCurrencies.includes(code)
      ? selectedCurrencies.filter(c => c !== code)
      : [...selectedCurrencies, code];

    // Ensure at least one currency is selected
    if (newSelection.length === 0) return;

    setSelectedCurrencies(newSelection);
    await saveSelectedCurrencies(newSelection);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filteredAndSortedCurrencies = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    // First, filter currencies based on search query
    const filtered = currencies.filter(currency => 
      currency.code.toLowerCase().includes(query) ||
      currency.name.toLowerCase().includes(query)
    );
    
    // Then sort: selected currencies first, then alphabetically by code
    return filtered.sort((a, b) => {
      const aSelected = selectedCurrencies.includes(a.code);
      const bSelected = selectedCurrencies.includes(b.code);
      
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      
      // If both are selected or both are not selected, sort by code
      return a.code.localeCompare(b.code);
    });
  }, [currencies, selectedCurrencies, searchQuery]);

  if (isLoading) {
    return (
      <View className='flex-1 bg-gray-100'>
        <View className='p-4 bg-white border-b border-gray-200'>
          <View className='flex-row items-center bg-gray-100 rounded-lg px-3 h-12'>
            <Search size={20} color="#666" />
            <TextInput
              className='flex-1 ml-2 text-base py-2'
              placeholder="Search currencies..."
              editable={false}
              style={{ lineHeight: undefined }}
            />
          </View>
        </View>

        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size="large" className='mb-4' />
          <Text className='text-gray-500'>Loading currencies...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className='flex-1 bg-gray-100'>
        <View className='p-4 bg-white border-b border-gray-200'>
          <View className='flex-row items-center bg-gray-100 rounded-lg px-3 h-12'>
            <Search size={20} color="#666" />
            <TextInput
              className='flex-1 ml-2 text-base py-2'
              placeholder="Search currencies..."
              editable={false}
              style={{ lineHeight: undefined }}
            />
          </View>
        </View>

        <View className='flex-1 items-center justify-center p-4'>
          <Text className='text-red-500 text-center mb-2'>{error}</Text>
          <Pressable
            onPress={() => router.back()}
            className='bg-primary py-3 px-6 rounded-lg'
          >
            <Text className='text-white font-semibold'>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View
      className='flex-1 bg-gray-100'
      style={{
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      <View className='p-4 bg-white border-b border-gray-200'>
        <View className='flex-row items-center bg-gray-100 rounded-lg px-3 h-12'>
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
      </View>

      <ScrollView className='flex-1 p-4'>
        <View className='gap-2'>
          {filteredAndSortedCurrencies.map((currency) => (
            <Pressable
              key={currency.code}
              onPress={() => toggleCurrency(currency.code)}
              className='flex-row items-center bg-white rounded-lg p-3'
            >
              <View className='flex-row flex-1 items-center gap-2'>
                <Text className='text-xl'>{currency.flag}</Text>
                <View>
                  <Text className='text-l'>{currency.code}</Text>
                  <Text className='text-sm text-gray-500'>{currency.name}</Text>
                </View>
              </View>
              
              <Checkbox 
                checked={selectedCurrencies.includes(currency.code)}
                onCheckedChange={() => toggleCurrency(currency.code)}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View className='p-4 bg-white border-t border-gray-200'>
        <Pressable
          onPress={() => router.back()}
          className='bg-primary py-3 rounded-lg items-center'
        >
          <Text className='text-white font-semibold'>Done</Text>
        </Pressable>
      </View>
    </View>
  );
} 