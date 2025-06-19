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
      className='h-5 w-5 items-center justify-center rounded border border-primary'
      style={checked ? { backgroundColor: '#000' } : {}}
    >
      {checked && <Check className='text-white' size={14} />}
    </Pressable>
  );
} 