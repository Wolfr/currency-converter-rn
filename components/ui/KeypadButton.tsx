import React from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { cn } from '~/lib/utils';

interface KeypadButtonProps {
  label: string;
  onPress: () => void;
  isIcon?: boolean;
  IconComponent?: React.ReactNode;
}

const KeypadButton: React.FC<KeypadButtonProps> = ({ label, onPress, isIcon = false, IconComponent }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
        onPress();
      }}
      className='flex-1 bg-white rounded-2xl h-14 items-center justify-center active:bg-white'
      style={[animatedStyle, {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3
      }]}
    >
      {isIcon && IconComponent ? IconComponent : <Text className='text-xl font-medium'>{label}</Text>}
    </Pressable>
  );
};

export default KeypadButton; 