import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SimpleChatBubbleProps {
  message: string;
  playerColor: string;
  playerName: string;
  position: { x: number; y: number };
}

export const SimpleChatBubble: React.FC<SimpleChatBubbleProps> = ({ 
  message, 
  playerColor, 
  playerName,
  position
}) => {
  console.log('SimpleChatBubble rendering:', { message, playerColor, playerName, position });
  return (
    <View
      style={[
        styles.container,
        {
          left: position.x,
          top: position.y,
          backgroundColor: playerColor,
        },
      ]}
    >
      <Text style={styles.playerName}>{playerName}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: 12,
    borderRadius: 15,
    maxWidth: 200,
    minWidth: 100,
    zIndex: 9999,
    elevation: 999,
  },
  playerName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#fff',
  },
});