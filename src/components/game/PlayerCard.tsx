import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

interface PlayerCardProps {
  name: string;
  steps: number;
  isWalking: boolean;
  isPlayer: boolean;
  avatar: any;
  gameStarted?: boolean;
}

export function PlayerCard({ name, steps, isWalking, isPlayer, avatar, gameStarted = false }: PlayerCardProps) {
  const zzzOpacity = useSharedValue(0);
  const zzzPosition = useSharedValue(0);

  useEffect(() => {
    if (!isWalking && gameStarted) {
      // Show sleeping animation only after game has started
      zzzOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        true
      );
      zzzPosition.value = withRepeat(
        withTiming(-10, { duration: 1000 }),
        -1,
        true
      );
    } else {
      zzzOpacity.value = withTiming(0, { duration: 200 });
      zzzPosition.value = 0;
    }
  }, [isWalking, gameStarted, zzzOpacity, zzzPosition]);

  const zzzAnimatedStyle = useAnimatedStyle(() => ({
    opacity: zzzOpacity.value,
    transform: [{ translateY: zzzPosition.value }],
  }));

  return (
    <View style={[styles.container, isPlayer && styles.playerContainer]}>
      <View style={styles.avatarContainer}>
        <Image source={avatar} style={styles.avatar} />
        {!isWalking && gameStarted && (
          <Animated.View style={[styles.zzzContainer, zzzAnimatedStyle]}>
            <Text style={styles.zzzText}>💤</Text>
          </Animated.View>
        )}
      </View>
      
      <View style={styles.overlay}>
        <Text style={[styles.name, isPlayer && styles.playerName]}>{name}</Text>
        <Text style={[styles.steps, isPlayer && styles.playerSteps]}>
          {(steps || 0).toLocaleString()} STEPS
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    overflow: 'hidden',
    minHeight: 120,
  },
  playerContainer: {
    backgroundColor: 'rgba(255,215,0,0.3)', // Golden tint for player
    borderWidth: 2,
    borderColor: 'rgba(255,215,0,0.6)',
  },
  avatarContainer: {
    flex: 1,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  zzzContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  zzzText: {
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
  },
  name: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  playerName: {
    color: '#FFD700',
  },
  steps: {
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.9,
  },
  playerSteps: {
    color: '#FFD700',
    opacity: 1,
  },
});