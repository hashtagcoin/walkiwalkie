import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWalkingSession } from '@/src/hooks/useWalkingSession';
import { StepCounter } from '@/src/components/game/StepCounter';
import { StartButton } from '@/src/components/game/StartButton';
import { SessionStats } from '@/src/components/game/SessionStats';
import { AnimatedBackground } from '@/src/components/game/AnimatedBackground';
import { PlayerGrid, Player } from '@/src/components/game/PlayerGrid';
import { WalkingPathMap } from '@/src/components/game/WalkingPathMap';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function GameScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [sessionJustStopped, setSessionJustStopped] = useState(false);
  
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

  const handlePlayersUpdate = useCallback((updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
  }, []);

  // Track when session stops to reset all players
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isTracking && sessionJustStopped) {
      // Reset the flag after a short delay
      timeoutId = setTimeout(() => {
        setSessionJustStopped(false);
      }, 100);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isTracking, sessionJustStopped]);

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

  const handleButtonPress = () => {
    if (isTracking) {
      setSessionJustStopped(true); // Flag that session just stopped
      stopSession();
    } else {
      startSession();
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <AnimatedBackground />
      <SafeAreaView style={[styles.safeArea, { zIndex: 1 }]}>
        <View style={styles.content}>

          <StepCounter 
            steps={isTracking ? sessionSteps : dailySteps} 
            label={isTracking ? 'Session Steps' : 'Daily Steps'}
          />

          <WalkingPathMap 
            players={players.map(player => ({
              id: player.id,
              name: player.name,
              steps: player.steps,
              color: ''
            }))}
            isGameActive={isTracking}
          />

          <PlayerGrid 
            playerSteps={isTracking ? sessionSteps : dailySteps}
            isPlayerWalking={isTracking}
            sessionJustStopped={sessionJustStopped}
            onPlayersUpdate={handlePlayersUpdate}
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

          {!isTracking && (dailySteps || 0) > 0 && (
            <View style={styles.dailyStatsContainer}>
              <ThemedText type="subtitle" style={styles.dailyStatsText}>
                Great job! You've taken {(dailySteps || 0).toLocaleString()} steps today!
              </ThemedText>
            </View>
          )}
        </View>
      </SafeAreaView>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  dailyStatsContainer: {
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    marginHorizontal: 16,
  },
  dailyStatsText: {
    textAlign: 'center',
    opacity: 0.8,
    color: 'white',
    fontSize: 14,
  },
});