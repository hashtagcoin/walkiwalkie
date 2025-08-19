import { WalkingSession } from '../core/entities/Session';

export interface GameState {
  currentSession: WalkingSession | null;
  dailySteps: number;
  isTracking: boolean;
  lastUpdate: Date | null;
}

export interface PedometerPermission {
  status: 'granted' | 'denied' | 'undetermined';
  canAskAgain: boolean;
}

export interface StepGoal {
  daily: number;
  session: number;
}