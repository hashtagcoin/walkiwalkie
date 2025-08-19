import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useThree } from '@react-three/fiber/native';
import * as THREE from 'three';

export function Mobile3DOptimizer() {
  const { gl, scene } = useThree();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Mobile-specific optimizations
      
      // Reduce shadow map resolution
      if (gl.shadowMap) {
        gl.shadowMap.enabled = false; // Disable shadows on mobile for performance
      }
      
      // Set pixel ratio for better performance
      // Use 1 for iOS to prevent scaling issues
      const pixelRatio = Platform.OS === 'ios' ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      gl.setPixelRatio(pixelRatio);
      
      // Enable antialiasing only on high-end devices
      const isHighEnd = pixelRatio > 1.5;
      if (!isHighEnd && gl.getContext) {
        const context = gl.getContext();
        if (context) {
          // Disable expensive features on low-end devices
          gl.setSize(gl.domElement.width, gl.domElement.height, false);
        }
      }
      
      // Optimize scene rendering
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Enable frustum culling
          child.frustumCulled = true;
          
          // Optimize materials
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.roughness = 0.8;
            child.material.metalness = 0.2;
            // Disable expensive features
            child.material.envMapIntensity = 0.5;
          }
        }
      });
    }
  }, [gl, scene]);

  return null;
}