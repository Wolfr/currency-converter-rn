import { OPENEXCHANGERATES_API_KEY } from '@env';

const BASE_URL = 'https://openexchangerates.org/api';

function getFlagEmoji(currencyCode: string): string {
  const countryCode = currencyCode.slice(0, 2);
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export type Currency = {
  code: string;
  name: string;
  flag: string;
};

export async function fetchSupportedCurrencies(): Promise<{ currencies?: Currency[]; error?: string }> {
  try {
    const response = await fetch(
      `${BASE_URL}/currencies.json?app_id=${OPENEXCHANGERATES_API_KEY}`
    );

    const data = await response.json() as Record<string, string>;

    if (!response.ok) {
      throw new Error(data.description || 'Failed to fetch currencies');
    }

    const excludedCurrencies = [
      'ANG', 'XAF', 'XAG', 'XAU', 'XCD', 'XDR',
      'XOF', 'XPD', 'XPF', 'XPT', 'VEF'
    ];

    const currencies = Object.entries(data)
      .filter(([code]) => !excludedCurrencies.includes(code))
      .map(([code, name]) => ({
        code,
        name,
        flag: getFlagEmoji(code)
      }));

    return { currencies };
  } catch (error) {
    console.error('Error fetching supported currencies:', error);
    return { error: 'An error occurred while fetching currencies' };
  }
}

export async function fetchExchangeRates(symbols: string[]): Promise<{ rates?: Record<string, number>; error?: string }> {
  try {
    // Always include USD in the symbols as it's our base currency
    const uniqueSymbols = Array.from(new Set([...symbols, 'USD']));
    const symbolsParam = uniqueSymbols.join(',');

    const response = await fetch(
      `${BASE_URL}/latest.json?app_id=${OPENEXCHANGERATES_API_KEY}&base=USD&symbols=${symbolsParam}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.description || 'Failed to fetch exchange rates');
    }

    // Add USD as 1 if not included
    const rates = { ...data.rates, USD: 1 };

    return { rates };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return { error: 'An error occurred while fetching exchange rates' };
  }
} 