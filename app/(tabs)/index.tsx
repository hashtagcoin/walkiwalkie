import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [currentSteps, setCurrentSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState('checking');
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsAvailable(String(isAvailable));
    setIsPedometerAvailable(isAvailable);

    if (isAvailable) {
      const subscription = Pedometer.watchStepCount(result => {
        setCurrentSteps(result.steps);
      });

      return () => subscription && subscription.remove();
    }
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.appTitle}>Walking Game</Text>
          
          <TouchableOpacity style={styles.avatarButton}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={32} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Today's Steps</Text>
            <Text style={styles.statValue}>{currentSteps}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{(currentSteps * 0.0008).toFixed(2)} km</Text>
          </View>
        </View>

        <View style={styles.sessionSection}>
          <View style={styles.sessionHeader}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.menuText}>Menu</Text>
            </TouchableOpacity>
            
            <Text style={styles.sessionTitle}>Session Steps</Text>
            
            <TouchableOpacity style={styles.iconButton}>
              <View style={styles.smallAvatar}>
                <Ionicons name="person-circle-outline" size={28} color="#6B46C1" />
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.sessionStepsCard}>
            <Text style={styles.sessionStepsValue}>0</Text>
            <Text style={styles.sessionStepsLabel}>Current Session</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.buttonText}>Start Walking Session</Text>
          </TouchableOpacity>
        </View>

        {!isPedometerAvailable && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              Step counting is not available on this device
            </Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#6B46C1',
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  menuButton: {
    padding: 8,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  avatarButton: {
    padding: 8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6B46C1',
  },
  sessionSection: {
    marginVertical: 20,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  iconButton: {
    padding: 8,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionStepsCard: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionStepsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6B46C1',
  },
  sessionStepsLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  actionContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 45,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#6B46C1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 235, 59, 0.95)',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  warningText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
});
