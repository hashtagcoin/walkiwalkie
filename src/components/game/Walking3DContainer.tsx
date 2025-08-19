import React, { Suspense, useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Walking3DScene } from './Walking3DScene';
import { Scene3DLoader } from './Scene3DLoader';
import { ThemedText } from '@/components/ThemedText';

interface Walking3DContainerProps {
  steps: number;
  isWalking: boolean;
}

export function Walking3DContainer({ steps, isWalking }: Walking3DContainerProps) {
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if WebGL is supported
    if (Platform.OS === 'web') {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsSupported(false);
        setError('WebGL is not supported in your browser');
      }
    }
  }, []);

  if (!isSupported || error) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ThemedText style={{ opacity: 0.6 }}>
          {error || '3D visualization is not available'}
        </ThemedText>
      </View>
    );
  }

  return (
    <Suspense fallback={<Scene3DLoader />}>
      <Walking3DScene steps={steps} isWalking={isWalking} />
    </Suspense>
  );
}