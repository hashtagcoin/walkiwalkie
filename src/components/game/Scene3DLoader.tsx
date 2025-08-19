import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export function Scene3DLoader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4a90e2" />
      <ThemedText style={styles.text}>Loading 3D Scene...</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    opacity: 0.7,
  },
});