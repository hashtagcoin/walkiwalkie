import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SimpleChatBubble } from './SimpleChatBubble';

const MESSAGES = [
  "Let's go! 🚀",
  "I'm winning! 😎",
  "Keep walking! 💪",
  "Almost there! 🏁",
  "You can do it! 🔥",
  "Haha nice! 😂",
  "Too slow! 🐌",
  "Catch me! 🏃",
];

const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
const PLAYER_NAMES = ['You', 'Alex', 'Sam', 'Jordan'];

interface Chat {
  id: string;
  message: string;
  playerName: string;
  playerColor: string;
  position: { x: number; y: number };
}

export const SimpleChatOverlay: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    console.log('SimpleChatOverlay mounted');
    // Add a test message immediately
    const initialChat: Chat = {
      id: 'initial',
      message: "CHAT WORKING! 🎮",
      playerName: 'SYSTEM',
      playerColor: '#FF0000',
      position: { x: 50, y: 300 },
    };
    console.log('Setting initial chat:', initialChat);
    setChats([initialChat]);

    // Generate random messages every 2 seconds
    const interval = setInterval(() => {
      const playerIndex = Math.floor(Math.random() * 4);
      const messageIndex = Math.floor(Math.random() * MESSAGES.length);
      
      const newChat: Chat = {
        id: Date.now().toString(),
        message: MESSAGES[messageIndex],
        playerName: PLAYER_NAMES[playerIndex],
        playerColor: PLAYER_COLORS[playerIndex],
        position: {
          x: 20 + (playerIndex % 2) * 160,
          y: 150 + (playerIndex > 1 ? 100 : 0) + Math.random() * 50,
        },
      };

      setChats(prev => {
        const updated = [...prev, newChat];
        // Keep only last 4 messages
        if (updated.length > 4) {
          return updated.slice(-4);
        }
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  console.log('SimpleChatOverlay rendering with chats:', chats.length);

  return (
    <View style={styles.container}>
      <Text style={styles.debugText}>CHAT OVERLAY WORKING - {chats.length} messages</Text>
      {chats.map(chat => {
        console.log('Rendering chat bubble:', chat);
        return (
          <SimpleChatBubble
            key={chat.id}
            message={chat.message}
            playerColor={chat.playerColor}
            playerName={chat.playerName}
            position={chat.position}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    elevation: 9999,
    pointerEvents: 'none',
  },
  debugText: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'red',
    color: 'white',
    padding: 15,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 100000,
    elevation: 10000,
  },
});