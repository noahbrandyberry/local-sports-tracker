import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';

interface TextFieldProps extends TextInputProps {
  icon?: IconProp;
}

export const TextField = ({ style, icon, ...props }: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <TouchableOpacity
      onPress={() => inputRef.current?.focus()}
      style={[
        styles.inputContainer,
        isFocused ? styles.focused : styles.blurred,
      ]}>
      <TextInput
        ref={inputRef}
        style={[styles.input, style]}
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {icon ? <FontAwesomeIcon icon={icon} style={styles.icon} /> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14,
    lineHeight: 18,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    borderColor: 'lightgray',
    borderWidth: 1,
  },
  input: {
    flex: 1,
  },
  blurred: {},
  focused: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: 'white',
  },
  icon: {
    marginLeft: 10,
  },
});
