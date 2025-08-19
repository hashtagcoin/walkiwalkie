import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface DailyStatsPanelProps {
  dailySteps: number;
  isVisible: boolean;
}

export const DailyStatsPanel: React.FC<DailyStatsPanelProps> = ({ 
  dailySteps, 
  isVisible 
}) => {
  console.log('DailyStatsPanel render:', { dailySteps, isVisible });
  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Daily Steps</Text>
        <Text style={styles.statValue}>
          {(dailySteps || 0).toLocaleString()}
        </Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Goal Progress</Text>
        <Text style={styles.statValue}>
          {Math.round((dailySteps / 10000) * 100)}%
        </Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Remaining</Text>
        <Text style={styles.statValue}>
          {Math.max(0, 10000 - dailySteps).toLocaleString()}
        </Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${Math.min((dailySteps / 10000) * 100, 100)}%` }
          ]} 
        />
      </View>
      
      <Text style={styles.motivationText}>
        {dailySteps >= 10000 
          ? "🎉 Daily goal achieved!" 
          : dailySteps > 0 
          ? "Keep walking! You're doing great! 💪"
          : "Start your walking journey today! 🚀"
        }
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 15,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontVariant: ['tabular-nums'],
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  motivationText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
});