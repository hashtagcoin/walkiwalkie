import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { WalkingSession, createNewSession } from '../core/entities/Session';
import { pedometerService } from '../services/pedometer/PedometerService';

interface GameState {
  currentSession: WalkingSession | null;
  dailySteps: number;
  totalSteps: number;
  isTracking: boolean;
  lastUpdate: Date | null;
  
  startSession: () => void;
  stopSession: () => void;
  updateSteps: (steps: number) => void;
  resetDaily: () => void;
  setTracking: (isTracking: boolean) => void;
}

export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set, get) => ({
        currentSession: null,
        dailySteps: 0,
        totalSteps: 0,
        isTracking: false,
        lastUpdate: null,
        
        startSession: () => {
          const state = get();
          if (state.isTracking) return;
          
          const newSession = createNewSession(state.totalSteps);
          set({
            currentSession: newSession,
            isTracking: true,
            lastUpdate: new Date(),
          });
          
          pedometerService.startTracking((steps) => {
            get().updateSteps(steps);
          });
        },
        
        stopSession: () => {
          const state = get();
          if (!state.currentSession) return;
          
          pedometerService.stopTracking();
          
          set({
            currentSession: {
              ...state.currentSession,
              endTime: new Date(),
              isActive: false,
            },
            isTracking: false,
            dailySteps: 0, // Reset daily steps to 0
            totalSteps: 0, // Reset total steps to 0
          });
        },
        
        updateSteps: (steps: number) => {
          const state = get();
          const now = new Date();
          
          if (state.currentSession && state.currentSession.isActive) {
            const sessionSteps = steps;
            
            set({
              currentSession: {
                ...state.currentSession,
                totalSteps: sessionSteps,
              },
              dailySteps: state.dailySteps + steps,
              totalSteps: state.totalSteps + steps,
              lastUpdate: now,
            });
          }
        },
        
        resetDaily: () => set({ dailySteps: 0 }),
        
        setTracking: (isTracking: boolean) => set({ isTracking }),
      }),
      {
        name: 'walking-game-storage',
        partialize: (state) => ({
          dailySteps: state.dailySteps,
          totalSteps: state.totalSteps,
        }),
      }
    )
  )
);