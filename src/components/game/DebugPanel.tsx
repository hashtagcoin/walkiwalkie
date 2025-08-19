import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useThemeColor } from '@/hooks/useThemeColor';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export const DebugPanel: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'text');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setLogs(prev => [logMessage, ...prev.slice(0, 19)]); // Keep last 20 logs
  };

  const runDiagnostics = async () => {
    addLog('=== PEDOMETER DIAGNOSTICS START ===');
    
    // Device Info
    addLog(`Device: ${Device.deviceName || 'Unknown'}`);
    addLog(`Model: ${Device.modelName || 'Unknown'}`);
    addLog(`OS: ${Device.osName} ${Device.osVersion}`);
    addLog(`Platform: ${Device.platformApiLevel || 'Unknown'}`);
    addLog(`Is Device: ${Device.isDevice}`);
    addLog(`Expo Version: ${Constants.expoVersion}`);
    
    try {
      // Check if Pedometer is available
      addLog('Checking pedometer availability...');
      const isAvailable = await Pedometer.isAvailableAsync();
      addLog(`Pedometer available: ${isAvailable}`);
      
      if (!isAvailable) {
        addLog('❌ PEDOMETER NOT AVAILABLE');
        addLog('Possible causes:');
        addLog('- Running on iOS Simulator (not supported)');
        addLog('- Device lacks motion sensors');
        addLog('- Hardware failure');
        return;
      }
      
      // Check permissions
      addLog('Checking permissions...');
      const permissions = await Pedometer.getPermissionsAsync();
      addLog(`Permission status: ${permissions.status}`);
      addLog(`Can ask again: ${permissions.canAskAgain}`);
      addLog(`Granted: ${permissions.granted}`);
      addLog(`Expires: ${permissions.expires}`);
      
      if (permissions.status !== 'granted') {
        addLog('Requesting permissions...');
        const newPermissions = await Pedometer.requestPermissionsAsync();
        addLog(`New permission status: ${newPermissions.status}`);
        addLog(`New can ask again: ${newPermissions.canAskAgain}`);
        addLog(`New granted: ${newPermissions.granted}`);
        
        if (newPermissions.status !== 'granted') {
          addLog('❌ PERMISSIONS DENIED');
          addLog('Go to Settings > Privacy & Security > Motion & Fitness');
          addLog('Enable "Fitness Tracking" and allow this app');
          return;
        }
      }
      
      // Test historical step data
      addLog('Testing historical step data...');
      const end = new Date();
      const start = new Date();
      start.setHours(start.getHours() - 1); // Last hour
      
      try {
        const result = await Pedometer.getStepCountAsync(start, end);
        addLog(`Steps in last hour: ${result.steps}`);
        addLog('✅ Historical data access working');
      } catch (error) {
        addLog(`❌ Historical data error: ${error}`);
      }
      
      // Test live tracking
      addLog('Testing live step tracking...');
      let subscription: any = null;
      
      try {
        subscription = Pedometer.watchStepCount(result => {
          addLog(`Live step update: ${result.steps} steps`);
        });
        
        addLog('✅ Live tracking subscription created');
        
        // Clean up after 5 seconds
        setTimeout(() => {
          if (subscription) {
            subscription.remove();
            addLog('Live tracking subscription removed');
          }
        }, 5000);
        
      } catch (error) {
        addLog(`❌ Live tracking error: ${error}`);
      }
      
    } catch (error) {
      addLog(`❌ CRITICAL ERROR: ${error}`);
      addLog(`Error type: ${typeof error}`);
      addLog(`Error message: ${error instanceof Error ? error.message : String(error)}`);
      addLog(`Error stack: ${error instanceof Error ? error.stack : 'No stack'}`);
    }
    
    addLog('=== DIAGNOSTICS COMPLETE ===');
  };

  useEffect(() => {
    // Auto-run diagnostics on mount
    runDiagnostics();
  }, []);

  if (!isVisible) {
    return (
      <TouchableOpacity 
        style={[styles.toggleButton, { backgroundColor: borderColor }]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.toggleText, { color: backgroundColor }]}>
          Show Debug Panel
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          Pedometer Debug Panel
        </Text>
        <TouchableOpacity onPress={() => setIsVisible(false)}>
          <Text style={[styles.closeButton, { color: textColor }]}>×</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.runButton, { borderColor }]}
        onPress={runDiagnostics}
      >
        <Text style={[styles.runButtonText, { color: textColor }]}>
          Run Diagnostics Again
        </Text>
      </TouchableOpacity>
      
      <ScrollView style={styles.logContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={[styles.logText, { color: textColor }]}>
            {log}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    height: 400,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  runButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  runButtonText: {
    fontWeight: 'bold',
  },
  logContainer: {
    flex: 1,
  },
  logText: {
    fontSize: 10,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
});