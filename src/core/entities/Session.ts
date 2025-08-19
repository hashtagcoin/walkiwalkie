export interface WalkingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  totalSteps: number;
  startingStepCount: number;
  distance?: number;
  calories?: number;
  isActive: boolean;
}

export const createNewSession = (startingStepCount: number = 0): WalkingSession => ({
  id: `session_${Date.now()}`,
  startTime: new Date(),
  totalSteps: 0,
  startingStepCount,
  isActive: true,
});