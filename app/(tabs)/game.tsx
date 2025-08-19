import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWalkingSession } from '@/src/hooks/useWalkingSession';
import { StepCounter } from '@/src/components/game/StepCounter';
import { StartButton } from '@/src/components/game/StartButton';
import { SessionStats } from '@/src/components/game/SessionStats';
import { AnimatedBackground } from '@/src/components/game/AnimatedBackground';
import { PlayerGrid } from '@/src/components/game/PlayerGrid';
import { SimpleChatOverlay } from '@/src/components/SimpleChatOverlay';
import { WinnerModal } from '@/src/components/WinnerModal';
import { GameHeader } from '@/src/components/game/GameHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function GameScreen() {
  const {
    currentSession,
    dailySteps,
    sessionSteps,
    sessionDuration,
    isTracking,
    isAvailable,
    permission,
    startSession,
    stopSession,
  } = useWalkingSession();

  const [players, setPlayers] = useState([
    { id: 1, name: 'You', color: '#FF6B6B', progress: 0 },
    { id: 2, name: 'Alex', color: '#4ECDC4', progress: 0 },
    { id: 3, name: 'Sam', color: '#45B7D1', progress: 0 },
    { id: 4, name: 'Jordan', color: '#FFA07A', progress: 0 },
  ]);
  const [gameProgress, setGameProgress] = useState(0);
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState<{ name: string; points: number } | null>(null);
  const gameGoal = useRef(1000);

  useEffect(() => {
    if (!isAvailable) {
      Alert.alert(
        'Pedometer Not Available',
        'Step counting is not available on this device.',
        [{ text: 'OK' }]
      );
    }
  }, [isAvailable]);

  useEffect(() => {
    if (permission.status === 'denied' && !permission.canAskAgain) {
      Alert.alert(
        'Permission Required',
        'Please enable motion & fitness permissions in Settings to track your steps.',
        [{ text: 'OK' }]
      );
    }
  }, [permission]);

  useEffect(() => {
    if (isTracking && sessionSteps > 0) {
      // Update player progress
      setPlayers(prevPlayers => {
        const updatedPlayers = [...prevPlayers];
        
        // Update user progress
        updatedPlayers[0].progress = sessionSteps;
        
        // Simulate AI players progress
        for (let i = 1; i < updatedPlayers.length; i++) {
          const randomIncrement = Math.random() * 15;
          updatedPlayers[i].progress = Math.min(
            updatedPlayers[i].progress + randomIncrement,
            gameGoal.current
          );
        }
        
        // Check for winner
        const potentialWinner = updatedPlayers.find(p => p.progress >= gameGoal.current);
        if (potentialWinner && !showWinner) {
          const points = Math.floor(100 + Math.random() * 50);
          setWinner({ name: potentialWinner.name, points });
          setShowWinner(true);
          
          // Reset game after showing winner
          setTimeout(() => {
            setPlayers(prevPlayers => prevPlayers.map(p => ({ ...p, progress: 0 })));
            setGameProgress(0);
          }, 5500);
        }
        
        return updatedPlayers;
      });
      
      // Update overall game progress
      const avgProgress = players.reduce((sum, p) => sum + p.progress, 0) / (players.length * gameGoal.current);
      setGameProgress(Math.min(avgProgress, 1));
    }
  }, [sessionSteps, isTracking]);

  const handleButtonPress = () => {
    if (isTracking) {
      stopSession();
    } else {
      startSession();
    }
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
    // TODO: Implement menu functionality
  };

  const handleProfilePress = () => {
    console.log('Profile pressed - Hailey');
    // TODO: Implement profile functionality
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <AnimatedBackground />
      <GameHeader 
        onMenuPress={handleMenuPress}
        onProfilePress={handleProfilePress}
      />
      
      <SafeAreaView style={[styles.safeArea, { zIndex: 1 }]}>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!isTracking && dailySteps > 0 && (
            <View style={styles.dailyStatsContainer}>
              <ThemedText type="subtitle" style={styles.dailyStatsText}>
                Great job! You've taken {(dailySteps || 0).toLocaleString()} steps today!
              </ThemedText>
            </View>
          )}

          <PlayerGrid 
            playerSteps={isTracking ? sessionSteps : dailySteps}
            isPlayerWalking={isTracking}
          />

          <StepCounter 
            steps={isTracking ? sessionSteps : dailySteps} 
            label={isTracking ? 'Session Steps' : 'Daily Steps'}
            isTracking={isTracking}
          />


          <StartButton
            onPress={handleButtonPress}
            isActive={isTracking}
            isLoading={false}
          />

          {isTracking && currentSession && (
            <SessionStats
              sessionSteps={sessionSteps}
              sessionDuration={sessionDuration}
              dailySteps={dailySteps}
            />
          )}

        </ScrollView>
      </SafeAreaView>
      
      
      <WinnerModal
        visible={showWinner}
        winnerName={winner?.name || ''}
        points={winner?.points || 0}
        onClose={() => setShowWinner(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  dailyStatsContainer: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  dailyStatsText: {
    textAlign: 'center',
    opacity: 0.8,
    color: 'white',
  },
});