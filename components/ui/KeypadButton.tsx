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

  return (
    <Pressable
    onPressOut={() => {
      onPress();
    }}
      className='flex-1 bg-white rounded-2xl h-14 items-center justify-center active:bg-gray-200'
    >
      {isIcon && IconComponent ? IconComponent : <Text className='text-xl font-medium'>{label}</Text>}
    </Pressable>
  );
};

export default KeypadButton; 