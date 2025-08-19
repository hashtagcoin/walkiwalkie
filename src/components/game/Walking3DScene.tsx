import React, { useRef, useMemo, Suspense } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useFrame } from '@react-three/fiber/native';
import { Environment, OrbitControls, Box, Sphere, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { Mobile3DOptimizer } from './Mobile3DOptimizer';

interface Walking3DSceneProps {
  steps: number;
  isWalking: boolean;
}

// Simple character component (replace with actual 3D model later)
function Character({ steps, isWalking }: { steps: number; isWalking: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Calculate position based on steps (1 step = 0.1 units forward)
  const targetPosition = useMemo(() => {
    const distance = steps * 0.1;
    return [0, 0, -distance];
  }, [steps]);

  // Animate the character
  useFrame((state, delta) => {
    if (meshRef.current && groupRef.current) {
      // Smooth position lerping
      groupRef.current.position.lerp(
        new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]),
        delta * 2
      );
      
      // Walking animation (simple bobbing)
      if (isWalking) {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 8) * 0.1 + 0.5;
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.1;
      } else {
        meshRef.current.position.y = 0.5;
        meshRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <Box ref={meshRef} args={[0.6, 1, 0.3]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#4a90e2" />
      </Box>
      
      {/* Head */}
      <Sphere args={[0.3]} position={[0, 1.3, 0]}>
        <meshStandardMaterial color="#f5deb3" />
      </Sphere>
      
      {/* Legs (simple representation) */}
      <Box args={[0.15, 0.8, 0.15]} position={[-0.15, -0.4, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[0.15, 0.8, 0.15]} position={[0.15, -0.4, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>
    </group>
  );
}

// Path visualization
function Path({ steps }: { steps: number }) {
  const pathLength = Math.max(10, steps * 0.1 + 5);
  
  return (
    <>
      {/* Ground plane */}
      <Plane args={[20, pathLength * 2]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, -pathLength / 2]}>
        <meshStandardMaterial color="#90EE90" />
      </Plane>
      
      {/* Path markers */}
      {Array.from({ length: Math.floor(pathLength / 2) }, (_, i) => (
        <Box key={i} args={[0.1, 0.05, 0.5]} position={[0, -0.75, -i * 2]}>
          <meshStandardMaterial color="#666" />
        </Box>
      ))}
    </>
  );
}

export function Walking3DScene({ steps, isWalking }: Walking3DSceneProps) {
  const { width, height } = useWindowDimensions();
  const canvasHeight = Math.min(height * 0.4, 300);

  return (
    <View style={[styles.container, { height: canvasHeight }]}>
      <Canvas
        style={styles.canvas}
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ antialias: true }}
        onCreated={(state) => {
          // Fix for iOS rendering issues
          const gl = state.gl;
          gl.setPixelRatio(1);
          gl.setSize(width, canvasHeight);
          
          // Workaround for Expo GL context issues  
          const _gl = gl.getContext();
          if (_gl && _gl.pixelStorei) {
            const pixelStorei = _gl.pixelStorei.bind(_gl);
            _gl.pixelStorei = function (...args) {
              const [parameter] = args;
              switch (parameter) {
                case _gl.UNPACK_FLIP_Y_WEBGL:
                  return pixelStorei(...args);
                default:
                  return pixelStorei(...args);
              }
            };
          }
        }}
      >
        <Mobile3DOptimizer />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
        
        <Suspense fallback={null}>
          <Character steps={steps} isWalking={isWalking} />
          <Path steps={steps} />
          <Environment preset="park" background />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, -steps * 0.1]}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});