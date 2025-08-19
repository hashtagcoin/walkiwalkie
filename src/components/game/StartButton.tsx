import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface StartButtonProps {
  onPress: () => void;
  isActive: boolean;
  isLoading?: boolean;
}

export const StartButton: React.FC<StartButtonProps> = ({ 
  onPress, 
  isActive, 
  isLoading = false 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: isActive ? '#FF6B6B' : 'rgba(0,0,0,0.6)' }
      ]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={[styles.buttonText, { color: 'white' }]}>
          {isActive ? 'Stop Walking' : 'Start Walking'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
    marginVertical: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.46,
    elevation: 9,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});