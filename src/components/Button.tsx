import React from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Text } from './Text';

interface ButtonProps extends TouchableOpacityProps {
  textStyle?: TextStyle;
}

export const Button = ({
  style,
  textStyle,
  children,
  ...props
}: ButtonProps) => (
  <TouchableOpacity style={[styles.button, style]} {...props}>
    <Text style={[styles.text, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
});
