import { useGLTF } from '@react-three/drei';
import { Platform } from 'react-native';

// Helper to load 3D models with proper platform handling
export function useModel(path: string) {
  // For native platforms, we need to use require() for local assets
  if (Platform.OS !== 'web') {
    try {
      return useGLTF(path);
    } catch (error) {
      console.warn('Failed to load model:', error);
      return null;
    }
  }
  
  // For web, we can use direct paths
  return useGLTF(path);
}

// Helper to calculate world position from steps
export function stepsToWorldPosition(steps: number) {
  // Assuming average step length of 0.75 meters
  const stepLength = 0.75;
  const distance = steps * stepLength;
  
  // Convert to world units (1 unit = 1 meter in our scene)
  return {
    x: 0,
    y: 0,
    z: -distance
  };
}

// Helper to format distance for display
export function formatDistance(steps: number): string {
  const meters = steps * 0.75;
  if (meters < 1000) {
    return `${meters.toFixed(0)}m`;
  }
  return `${(meters / 1000).toFixed(2)}km`;
}