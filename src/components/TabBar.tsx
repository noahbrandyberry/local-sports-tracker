import React from 'react';
import { Text } from 'components';
import { StyleSheet, View } from 'react-native';

export const TabBar = () => {
  const test = '';
  return (
    <View style={styles.menuBar}>
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
