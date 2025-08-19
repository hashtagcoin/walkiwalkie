import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { usePedometer } from './usePedometer';

export const useWalkingSession = () => {
  const {
    currentSession,
    dailySteps,
    totalSteps,
    isTracking,
    startSession,
    stopSession,
  } = useGameStore();

  const { isAvailable, permission, requestPermission } = usePedometer();

  const handleStartSession = useCallback(async () => {
    if (!isAvailable) {
      console.log('Pedometer not available');
      return;
    }

    if (permission.status !== 'granted') {
      const newPermission = await requestPermission();
      if (newPermission.status !== 'granted') {
        console.log('Permission denied');
        return;
      }
    }

    startSession();
  }, [isAvailable, permission, requestPermission, startSession]);

  const handleStopSession = useCallback(() => {
    stopSession();
  }, [stopSession]);

  const sessionSteps = currentSession?.totalSteps || 0;
  const sessionDuration = currentSession
    ? Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000)
    : 0;

  return {
    currentSession,
    dailySteps,
    totalSteps,
    sessionSteps,
    sessionDuration,
    isTracking,
    isAvailable,
    permission,
    startSession: handleStartSession,
    stopSession: handleStopSession,
  };
};