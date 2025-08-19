import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { PlayerCard } from './PlayerCard';
import { AVATARS } from '../../constants/assets';

export interface Player {
  id: string;
  name: string;
  steps: number;
  isWalking: boolean;
  isPlayer: boolean;
  avatar: any;
}

interface PlayerGridProps {
  playerSteps: number;
  isPlayerWalking: boolean;
  sessionJustStopped?: boolean;
  onPlayersUpdate?: (players: Player[]) => void;
}

const aiPlayerNames = ['Buddy', 'Whiskers', 'Alex'];

export function PlayerGrid({ playerSteps, isPlayerWalking, sessionJustStopped, onPlayersUpdate }: PlayerGridProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const onPlayersUpdateRef = useRef(onPlayersUpdate);

  // Keep the ref updated
  useEffect(() => {
    onPlayersUpdateRef.current = onPlayersUpdate;
  }, [onPlayersUpdate]);

  useEffect(() => {
    // Initialize all players with 0 steps and sleeping
    const initialPlayers: Player[] = [
      {
        id: 'player',
        name: 'Hailey',
        steps: playerSteps || 0,
        isWalking: isPlayerWalking,
        isPlayer: true,
        avatar: AVATARS.player,
      },
      {
        id: 'ai1',
        name: aiPlayerNames[0],
        steps: 0, // Start with 0 steps
        isWalking: false, // Start sleeping
        isPlayer: false,
        avatar: AVATARS.aiPlayer1,
      },
      {
        id: 'ai2',
        name: aiPlayerNames[1],
        steps: 0, // Start with 0 steps
        isWalking: false, // Start sleeping
        isPlayer: false,
        avatar: AVATARS.aiPlayer2,
      },
      {
        id: 'ai3',
        name: aiPlayerNames[2],
        steps: 0, // Start with 0 steps
        isWalking: false, // Start sleeping
        isPlayer: false,
        avatar: AVATARS.aiPlayer3,
      },
    ];
    setPlayers(initialPlayers);
    onPlayersUpdateRef.current?.(initialPlayers);
  }, []);

  useEffect(() => {
    // Update player data
    setPlayers(prev => {
      const updatedPlayers = prev.map(player => 
        player.isPlayer 
          ? { ...player, steps: playerSteps, isWalking: isPlayerWalking }
          : player
      );
      // Call the callback after the state update, not during
      setTimeout(() => {
        onPlayersUpdateRef.current?.(updatedPlayers);
      }, 0);
      return updatedPlayers;
    });
  }, [playerSteps, isPlayerWalking]);

  useEffect(() => {
    // Track when the game has started (when player first starts walking)
    if (isPlayerWalking && !gameStarted) {
      setGameStarted(true);
    }
  }, [isPlayerWalking, gameStarted]);

  useEffect(() => {
    // Reset all players to 0 steps when session stops
    if (sessionJustStopped) {
      setPlayers(prev => {
        const resetPlayers = prev.map(player => ({
          ...player,
          steps: 0,
          isWalking: false,
        }));
        setTimeout(() => {
          onPlayersUpdateRef.current?.(resetPlayers);
        }, 0);
        return resetPlayers;
      });
      setGameStarted(false); // Reset game started state
    }
  }, [sessionJustStopped]);

  useEffect(() => {
    // AI behavior: only start when real player starts walking
    if (isPlayerWalking) {
      const interval = setInterval(() => {
        setPlayers(prev => {
          const updated = prev.map(player => {
            if (!player.isPlayer) {
              const shouldWalk = Math.random() > 0.3; // 70% chance to walk
              const stepIncrement = shouldWalk ? Math.floor(Math.random() * 50) + 10 : 0;
              return {
                ...player,
                isWalking: shouldWalk,
                steps: player.steps + stepIncrement,
              };
            }
            return player;
          });
          setTimeout(() => {
            onPlayersUpdateRef.current?.(updated);
          }, 0);
          return updated;
        });
      }, 3000); // Update every 3 seconds

      return () => clearInterval(interval);
    } else {
      // When player stops, AI players sleep (but only if game has started)
      if (gameStarted) {
        setPlayers(prev => {
          const updated = prev.map(player => 
            player.isPlayer ? player : { ...player, isWalking: false }
          );
          setTimeout(() => {
            onPlayersUpdateRef.current?.(updated);
          }, 0);
          return updated;
        });
      }
    }
  }, [isPlayerWalking, gameStarted]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <PlayerCard {...players[0]} gameStarted={gameStarted} />
        <PlayerCard {...players[1]} gameStarted={gameStarted} />
      </View>
      <View style={styles.row}>
        <PlayerCard {...players[2]} gameStarted={gameStarted} />
        <PlayerCard {...players[3]} gameStarted={gameStarted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 3,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 0,
  },
});