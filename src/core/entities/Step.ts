export interface Step {
  id: string;
  timestamp: Date;
  count: number;
  sessionId?: string;
}

export interface StepUpdate {
  currentStepCount: number;
  timestamp: Date;
}