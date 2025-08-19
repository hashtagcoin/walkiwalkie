import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Dimensions } from 'react-native';

interface WinnerModalProps {
  visible: boolean;
  winnerName: string;
  points: number;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export const WinnerModal: React.FC<WinnerModalProps> = ({ 
  visible, 
  winnerName, 
  points, 
  onClose 
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          })
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(sparkleAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(sparkleAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();

      setTimeout(() => {
        onClose();
      }, 5000);
    } else {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      sparkleAnim.setValue(0);
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.card}>
            <View style={styles.cardShadow} />
            <View style={styles.cardHighlight} />
            
            <Animated.View
              style={[
                styles.crownContainer,
                {
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              <Text style={styles.crown}>👑</Text>
              <Animated.View
                style={[
                  styles.sparkle,
                  {
                    opacity: sparkleAnim,
                  },
                ]}
              >
                <Text style={styles.sparkleEmoji}>✨</Text>
              </Animated.View>
            </Animated.View>

            <Text style={styles.title}>🎉 WINNER! 🎉</Text>
            <Text style={styles.winnerName}>{winnerName}</Text>
            
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsLabel}>POINTS EARNED</Text>
              <Text style={styles.pointsValue}>+{points} 🏆</Text>
            </View>

            <View style={styles.decorations}>
              <Text style={styles.decoration}>🎊</Text>
              <Text style={styles.decoration}>🎈</Text>
              <Text style={styles.decoration}>🎊</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    maxWidth: 350,
  },
  card: {
    backgroundColor: '#FFD700',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  cardShadow: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: -5,
    bottom: -5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
    zIndex: -1,
  },
  cardHighlight: {
    position: 'absolute',
    top: 10,
    left: 20,
    width: 60,
    height: 15,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
  },
  crownContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  crown: {
    fontSize: 60,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  sparkle: {
    position: 'absolute',
    top: -10,
    right: -20,
  },
  sparkleEmoji: {
    fontSize: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 10,
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  winnerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  pointsContainer: {
    backgroundColor: '#FFF8DC',
    borderRadius: 15,
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#8B4513',
    letterSpacing: 1,
    marginBottom: 5,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
  },
  decorations: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  decoration: {
    fontSize: 24,
  },
});