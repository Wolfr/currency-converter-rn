import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AVAILABLE_CURRENCIES, type CurrencyCode } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STORAGE_KEYS = {
  SELECTED_CURRENCIES: 'selected-currencies',
} as const;

export const DEFAULT_CURRENCIES: CurrencyCode[] = ['USD', 'EUR', 'GBP'] as CurrencyCode[];

export async function getSelectedCurrencies(): Promise<CurrencyCode[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_CURRENCIES);
    if (stored) {
      const parsedCurrencies = JSON.parse(stored) as string[];
      // Filter out any currencies that don't exist in AVAILABLE_CURRENCIES
      const validCurrencies = parsedCurrencies.filter(
        (code): code is CurrencyCode => 
          AVAILABLE_CURRENCIES.some(c => c.code === code)
      );
      
      // If we have valid currencies, return them
      if (validCurrencies.length > 0) {
        return validCurrencies;
      }
    }
    
    // If no stored currencies or no valid currencies, save and return defaults
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_CURRENCIES, JSON.stringify(DEFAULT_CURRENCIES));
    return DEFAULT_CURRENCIES;
  } catch (error) {
    console.error('Error getting selected currencies:', error);
    return DEFAULT_CURRENCIES;
  }
}

export async function setSelectedCurrencies(currencies: CurrencyCode[]): Promise<void> {
  try {
    // Ensure we only save valid currencies
    const validCurrencies = currencies.filter(
      code => AVAILABLE_CURRENCIES.some(c => c.code === code)
    );
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_CURRENCIES, JSON.stringify(validCurrencies));
  } catch (error) {
    console.error('Error saving selected currencies:', error);
  }
}
