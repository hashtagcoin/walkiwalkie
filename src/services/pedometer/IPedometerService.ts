import { PedometerPermission } from '../../types/game';

export interface IPedometerService {
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<PedometerPermission>;
  getPermissions(): Promise<PedometerPermission>;
  startTracking(onStepUpdate: (steps: number) => void): void;
  stopTracking(): void;
  getStepCountBetweenDates(start: Date, end: Date): Promise<{ steps: number }>;
}