import { Pressable, View } from 'react-native';
import { Pencil } from '~/lib/icons/Pencil';
import { useRouter } from 'expo-router';

export function EditCurrenciesToggle() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push('/edit-currencies')}
    >
        <Pencil />
    </Pressable>
  );
}
