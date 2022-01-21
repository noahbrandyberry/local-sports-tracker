import React from 'react';
import { StyleSheet, Text as TextComponent, TextProps } from 'react-native';

export const Text = ({ style, ...props }: TextProps) => (
  <TextComponent style={[styles.text, style]} {...props} />
);

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 18,
  },
});
