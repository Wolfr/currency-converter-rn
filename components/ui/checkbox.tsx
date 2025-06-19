import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ checked, onCheckedChange, disabled }: CheckboxProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => onCheckedChange(!checked)}
      className={`h-6 w-6 items-center justify-center rounded-md border ${
        checked 
          ? 'bg-blue-500 border-blue-500' 
          : 'border-gray-300 bg-white'
      }`}
    >
      {checked && (
        <Check 
          color="white"
          size={16} 
          strokeWidth={3}
        />
      )}
    </Pressable>
  );
} 