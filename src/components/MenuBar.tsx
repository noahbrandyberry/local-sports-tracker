import React from 'react';
import { Text } from 'components';
import { StyleSheet, View, StatusBar } from 'react-native';

export const MenuBar = () => {
  const test = '';
  return (
    <View style={styles.menuBar}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.menuBarText}>MENU</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  menuBar: {
    padding: 15,
  },
  menuBarText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
