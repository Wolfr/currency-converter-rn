import '~/global.css';

import { Stack } from 'expo-router';
import * as React from 'react';

import { PortalHost } from '@rn-primitives/portal';
import { EditCurrenciesToggle } from "~/components/EditCurrenciesToggle";
import { LanguageToggle } from "~/components/LanguageToggle";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            title: 'Currency Converter',
            headerTitleAlign: 'center',
            headerLeft: () => <LanguageToggle />,
            headerRight: () => <EditCurrenciesToggle />,
          }}
        />
        <Stack.Screen
          name='(modal)'
          options={{
            headerShown: false,
            presentation: 'modal',
            headerTitleAlign: 'center'
          }}
        />
      </Stack>
      <PortalHost />
    </>
  );
}