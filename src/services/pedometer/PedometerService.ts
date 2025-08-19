import { Pedometer } from 'expo-sensors';
import { IPedometerService } from './IPedometerService';
import { PedometerPermission } from '../../types/game';

export class PedometerService implements IPedometerService {
  private subscription: Pedometer.Subscription | null = null;

  async isAvailable(): Promise<boolean> {
    console.log('[PedometerService] Checking if pedometer is available...');
    try {
      const available = await Pedometer.isAvailableAsync();
      console.log('[PedometerService] Pedometer available:', available);
      return available;
    } catch (error) {
      console.error('[PedometerService] Error checking pedometer availability:', error);
      console.error('[PedometerService] Availability error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      return false;
    }
  }

  async requestPermissions(): Promise<PedometerPermission> {
    console.log('[PedometerService] Requesting pedometer permissions...');
    try {
      const result = await Pedometer.requestPermissionsAsync();
      console.log('[PedometerService] Permission request result:', result);
      const permission = {
        status: result.status,
        canAskAgain: result.canAskAgain,
      };
      console.log('[PedometerService] Returning permission:', permission);
      return permission;
    } catch (error) {
      console.error('[PedometerService] Error requesting pedometer permissions:', error);
      console.error('[PedometerService] Permission request error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      return { status: 'denied', canAskAgain: false };
    }
  }

  async getPermissions(): Promise<PedometerPermission> {
    console.log('[PedometerService] Getting current pedometer permissions...');
    try {
      const result = await Pedometer.getPermissionsAsync();
      console.log('[PedometerService] Current permissions:', result);
      const permission = {
        status: result.status,
        canAskAgain: result.canAskAgain,
      };
      console.log('[PedometerService] Returning current permission:', permission);
      return permission;
    } catch (error) {
      console.error('[PedometerService] Error getting pedometer permissions:', error);
      console.error('[PedometerService] Get permissions error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      return { status: 'undetermined', canAskAgain: true };
    }
  }

  startTracking(onStepUpdate: (steps: number) => void): void {
    console.log('[PedometerService] Starting step tracking...');
    if (this.subscription) {
      console.log('[PedometerService] Stopping existing subscription first');
      this.stopTracking();
    }

    try {
      this.subscription = Pedometer.watchStepCount(result => {
        console.log('[PedometerService] Step update received:', result);
        onStepUpdate(result.steps);
      });
      console.log('[PedometerService] Step tracking subscription created successfully');
    } catch (error) {
      console.error('[PedometerService] Error starting step tracking:', error);
      console.error('[PedometerService] Start tracking error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack'
      });
    }
  }

  stopTracking(): void {
    console.log('[PedometerService] Stopping step tracking...');
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
      console.log('[PedometerService] Step tracking stopped successfully');
    } else {
      console.log('[PedometerService] No active subscription to stop');
    }
  }

  async getStepCountBetweenDates(start: Date, end: Date): Promise<{ steps: number }> {
    try {
      const result = await Pedometer.getStepCountAsync(start, end);
      return { steps: result.steps };
    } catch (error) {
      console.error('Error getting step count:', error);
      return { steps: 0 };
    }
  }
}

export const pedometerService = new PedometerService();