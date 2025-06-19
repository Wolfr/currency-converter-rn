import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AVAILABLE_CURRENCIES, type CurrencyCode } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SELECTED_CURRENCIES_KEY = 'selectedCurrencies';

export async function getSelectedCurrencies(): Promise<string[]> {
  try {
    const savedCurrencies = await AsyncStorage.getItem(SELECTED_CURRENCIES_KEY);
    if (savedCurrencies) {
      return JSON.parse(savedCurrencies);
    }
    return ['USD', 'EUR', 'GBP']; // Default currencies
  } catch (error) {
    console.error('Error getting selected currencies:', error);
    return ['USD', 'EUR', 'GBP']; // Fallback to defaults on error
  }
}

export async function saveSelectedCurrencies(currencies: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(SELECTED_CURRENCIES_KEY, JSON.stringify(currencies));
  } catch (error) {
    console.error('Error saving selected currencies:', error);
  }
}
