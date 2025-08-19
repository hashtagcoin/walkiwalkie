import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SessionStatsProps {
  sessionSteps: number;
  sessionDuration: number;
  dailySteps: number;
}

export const SessionStats: React.FC<SessionStatsProps> = ({
  sessionSteps,
  sessionDuration,
  dailySteps,
}) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: 'white' }]}>
          {(sessionSteps || 0).toLocaleString()}
        </Text>
        <Text style={[styles.statLabel, { color: 'white', opacity: 0.8 }]}>
          Session Steps
        </Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: 'white' }]}>
          {formatDuration(sessionDuration)}
        </Text>
        <Text style={[styles.statLabel, { color: 'white', opacity: 0.8 }]}>
          Duration
        </Text>
      </View>
      
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: 'white' }]}>
          {(dailySteps || 0).toLocaleString()}
        </Text>
        <Text style={[styles.statLabel, { color: 'white', opacity: 0.8 }]}>
          Daily Total
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 13,
    borderRadius: 16,
    marginTop: 2,
    marginBottom: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 23,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 16,
    marginTop: 3,
  },
});