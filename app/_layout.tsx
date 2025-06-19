import '~/global.css';

import { Stack } from 'expo-router';
import * as React from 'react';

import { PortalHost } from '@rn-primitives/portal';
import {EditCurrenciesToggle} from "~/components/EditCurrenciesToggle";

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
                  // headerLeft: () => ,
                title: 'Currency Converter',
              headerRight: () => <EditCurrenciesToggle />,
              }}
            />
            <Stack.Screen
              name='edit-currencies'
              options={{
                title: 'Edit Currencies',
              }}
            />
        </Stack>
      <PortalHost />
    </>
  );
}