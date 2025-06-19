import { Stack } from 'expo-router';
import * as React from 'react';

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="select-language"
        options={{
          title: 'Select Language',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit-currencies"
        options={{
          title: 'Edit Currencies',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
} 