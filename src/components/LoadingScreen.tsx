import React from 'react';
import { Text } from 'components';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

export const LoadingScreen = () => (
  <SafeAreaView>
    <View style={styles.container}>
      <Text style={styles.header}>Loading...</Text>
      <Text style={styles.body}>Thank you for your patience.</Text>
      <ActivityIndicator size="large" />
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
  body: {
    marginBottom: 16,
    textAlign: 'center',
  },
});
