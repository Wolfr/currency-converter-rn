import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { cn } from '~/lib/utils';

interface KeypadButtonProps {
  label: string;
  onPress: () => void;
  isIcon?: boolean;
  IconComponent?: React.ReactNode;
  disabled?: boolean;
}

const KeypadButton: React.FC<KeypadButtonProps> = ({ 
  label, 
  onPress, 
  isIcon = false, 
  IconComponent,
  disabled = false 
}) => {
  return (
    <Pressable
      onPressOut={() => {
        if (!disabled) {
          onPress();
        }
      }}
      className={cn(
        'flex-1 bg-white rounded-2xl h-14 items-center justify-center active:bg-gray-200',
        disabled && 'opacity-50'
      )}
      disabled={disabled}
    >
      {isIcon && IconComponent ? (
        <View className={cn(disabled && 'opacity-50')}>
          {IconComponent}
        </View>
      ) : (
        <Text className='text-xl font-medium'>{label}</Text>
      )}
    </Pressable>
  );
};

export default KeypadButton; 