import { useState, useEffect } from 'react';
import { pedometerService } from '../services/pedometer/PedometerService';
import { PedometerPermission } from '../types/game';

export const usePedometer = () => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [permission, setPermission] = useState<PedometerPermission>({
    status: 'undetermined',
    canAskAgain: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    setIsLoading(true);
    console.log('[usePedometer] Checking availability...');
    try {
      const available = await pedometerService.isAvailable();
      console.log('[usePedometer] Available:', available);
      setIsAvailable(available);
      
      if (available) {
        console.log('[usePedometer] Getting permissions...');
        const perm = await pedometerService.getPermissions();
        console.log('[usePedometer] Permissions:', perm);
        setPermission(perm);
      } else {
        console.log('[usePedometer] Pedometer not available, skipping permissions check');
      }
    } catch (error) {
      console.error('[usePedometer] Error checking pedometer:', error);
      console.error('[usePedometer] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack'
      });
    } finally {
      setIsLoading(false);
      console.log('[usePedometer] Availability check complete');
    }
  };

  const requestPermission = async () => {
    console.log('[usePedometer] Requesting permission...');
    try {
      const perm = await pedometerService.requestPermissions();
      console.log('[usePedometer] Permission result:', perm);
      setPermission(perm);
      return perm;
    } catch (error) {
      console.error('[usePedometer] Error requesting permission:', error);
      console.error('[usePedometer] Permission error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
      });
      return permission;
    }
  };

  return {
    isAvailable,
    permission,
    isLoading,
    requestPermission,
    checkAvailability,
  };
};