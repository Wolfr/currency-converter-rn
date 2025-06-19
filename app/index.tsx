import * as React from 'react';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function Screen() {
  const [progress, setProgress] = React.useState(78);

  function updateProgressValue() {
    setProgress(Math.floor(Math.random() * 100));
  }
  return (
      <View className='flex-1 gap-5 p-6 bg-secondary/30'>
        <Text>Select Language</Text>
        <Button variant='outline'><Text>English</Text></Button>
        <Button variant='outline'><Text>Español</Text></Button>
        <Button variant='outline'><Text>Français</Text></Button>
        <Button variant='outline'><Text>Nederlands</Text></Button>
        <Button variant='outline'><Text>日本語</Text></Button>
        <Button variant='outline'><Text>中文</Text></Button>
        <Button variant='outline'><Text>Português</Text></Button>
        <Button variant='outline'><Text>Русский</Text></Button>
        <Button variant='outline'><Text>Deutsch</Text></Button>
        <Button variant='outline'><Text>עברית</Text></Button>
      </View>
  );
}
