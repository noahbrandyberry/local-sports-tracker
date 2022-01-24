import React from 'react';
import { Text } from 'components';
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native';

export const InvalidDataError = () => (
  <SafeAreaView>
    <View style={styles.container}>
      <Text style={styles.header}>Error While Loading</Text>
      <Text>We apologize for the inconvenience. Please try again later.</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
});
