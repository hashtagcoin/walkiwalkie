import { useRef, useCallback } from 'react';
import { IThreeJSService } from '../services/threejs/IThreeJSService';

export function useThreeJS() {
  const serviceRef = useRef<IThreeJSService | null>(null);

  const setService = useCallback((service: IThreeJSService) => {
    serviceRef.current = service;
  }, []);

  const updateCharacterPosition = useCallback((steps: number) => {
    serviceRef.current?.updateCharacterPosition(steps);
  }, []);

  const resetScene = useCallback(() => {
    serviceRef.current?.resetScene();
  }, []);

  const setAnimationState = useCallback((isWalking: boolean) => {
    serviceRef.current?.setAnimationState(isWalking);
  }, []);

  return {
    setService,
    updateCharacterPosition,
    resetScene,
    setAnimationState,
  };
}