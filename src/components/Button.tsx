import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Text } from './Text';
import { Style } from 'tailwind-rn';

interface ButtonProps extends TouchableOpacityProps {
  textStyle?: Style | Style[];
  leftAccessory?: React.ReactNode;
  rightAccessory?: React.ReactNode;
}

export const Button = ({
  style,
  textStyle,
  children,
  leftAccessory,
  rightAccessory,
  ...props
}: ButtonProps) => (
  <TouchableOpacity style={[styles.button, style]} {...props}>
    {leftAccessory}
    <Text style={[styles.text, textStyle]}>{children}</Text>
    {rightAccessory}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
});
