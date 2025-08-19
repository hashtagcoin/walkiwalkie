import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ChatBubbleProps {
  message: string;
  playerColor: string;
  playerName: string;
  position: { x: number; y: number };
  onAnimationComplete?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  playerColor, 
  playerName,
  position,
  onAnimationComplete 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const hasLaughEmoji = message.includes('😂') || message.includes('🤣') || message.includes('😆');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    if (hasLaughEmoji) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ).start();
    }

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onAnimationComplete?.();
      });
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const renderMessage = () => {
    const parts = message.split(/(😂|🤣|😆)/g);
    return parts.map((part, index) => {
      if (['😂', '🤣', '😆'].includes(part)) {
        return (
          <Animated.Text
            key={index}
            style={[
              styles.emoji,
              hasLaughEmoji && {
                transform: [
                  { translateY: bounceAnim },
                  { scale: 1.2 }
                ],
              },
            ]}
          >
            {part}
          </Animated.Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: position.x,
          top: position.y,
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <View style={[styles.bubble, { backgroundColor: playerColor }]}>
        <View style={styles.bubbleShadow} />
        <View style={styles.bubbleHighlight} />
        <Text style={styles.playerName}>{playerName}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <View style={[styles.tail, { borderTopColor: playerColor }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10000,
    elevation: 1000,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  bubbleShadow: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: -2,
    bottom: -2,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    zIndex: -1,
  },
  bubbleHighlight: {
    position: 'absolute',
    top: 3,
    left: 8,
    width: 30,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
  },
  playerName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  messageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  message: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  emoji: {
    fontSize: 20,
  },
  tail: {
    position: 'absolute',
    bottom: -8,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});