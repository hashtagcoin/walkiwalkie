import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ChatBubble {
  id: string;
  message: string;
  playerName: string;
  color: string;
  position: 1 | 2 | 3;
  fadeAnim: Animated.Value;
  bounceAnim: Animated.Value;
}

interface StepCounterProps {
  steps: number;
  label?: string;
  isTracking?: boolean;
}

const CHAT_MESSAGES = [
  "Let's go! 🚀",
  "I'm winning! 😎", 
  "Keep walking! 💪",
  "Almost there! 🏁",
  "You can do it! 🔥",
  "Haha nice! 😂",
  "Too slow! 🐌",
  "Catch me! 🏃",
  "Great job! ✨",
  "Don't give up! 💯",
  "I'm faster! 😆",
  "Keep it up! 👏"
];

const PLAYER_NAMES = ['Alex', 'Sam', 'Jordan', 'Casey'];
const PLAYER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

export const StepCounter: React.FC<StepCounterProps> = ({ 
  steps, 
  label = 'Steps', 
  isTracking = false
}) => {
  const [chatBubbles, setChatBubbles] = useState<ChatBubble[]>([]);

  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      // Generate a new chat message
      const messageIndex = Math.floor(Math.random() * CHAT_MESSAGES.length);
      const playerIndex = Math.floor(Math.random() * PLAYER_NAMES.length);
      const position = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
      const message = CHAT_MESSAGES[messageIndex];
      const hasLaughEmoji = message.includes('😂') || message.includes('🤣') || message.includes('😆');

      const newBubble: ChatBubble = {
        id: Date.now().toString(),
        message,
        playerName: PLAYER_NAMES[playerIndex],
        color: PLAYER_COLORS[playerIndex],
        position,
        fadeAnim: new Animated.Value(0),
        bounceAnim: new Animated.Value(0),
      };

      setChatBubbles(prev => {
        // Remove old bubbles and add new one
        const filtered = prev.filter(bubble => Date.now() - parseInt(bubble.id) < 4000);
        return [...filtered, newBubble];
      });

      // Animate the new bubble
      Animated.parallel([
        Animated.timing(newBubble.fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        hasLaughEmoji ? Animated.loop(
          Animated.sequence([
            Animated.timing(newBubble.bounceAnim, {
              toValue: -5,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(newBubble.bounceAnim, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 4 }
        ) : Animated.timing(newBubble.bounceAnim, { toValue: 0, duration: 0, useNativeDriver: true })
      ]).start();

      // Fade out after 3 seconds
      setTimeout(() => {
        Animated.timing(newBubble.fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 3000);

    }, 2000);

    return () => clearInterval(interval);
  }, [isTracking]);

  const renderChatBubble = (bubble: ChatBubble) => {
    const styleMap = {
      1: styles.chatBubble1,
      2: styles.chatBubble2,
      3: styles.chatBubble3,
    };

    return (
      <Animated.View
        key={bubble.id}
        style={[
          styleMap[bubble.position],
          { backgroundColor: bubble.color },
          {
            opacity: bubble.fadeAnim,
            transform: [{ translateY: bubble.bounceAnim }],
          },
        ]}
      >
        <Text style={styles.playerName}>{bubble.playerName}</Text>
        <Text style={styles.chatText}>{bubble.message}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={{ alignSelf: 'center', marginVertical: 4 }}>
      <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
        <Text style={[styles.stepsText, { color: 'white' }]}>
          {(steps || 0).toLocaleString()}
        </Text>
        <Text style={[styles.label, { color: 'white', opacity: 0.8 }]}>
          {label}
        </Text>
      </View>
      
      {/* Dynamic chat bubbles */}
      {chatBubbles.map(renderChatBubble)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
    borderRadius: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  stepsText: {
    fontSize: 42,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginTop: 2,
    textAlign: 'center',
  },
  chatBubble1: {
    position: 'absolute',
    top: -20,
    right: -60,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  chatBubble2: {
    position: 'absolute',
    top: 40,
    left: -70,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  chatBubble3: {
    position: 'absolute',
    bottom: -30,
    right: -50,
    backgroundColor: '#45B7D1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  playerName: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
  },
  chatText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});