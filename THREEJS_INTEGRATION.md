# Three.js Integration for Walking Game

## Overview
This walking game now includes 3D visualization using Three.js with React Three Fiber, optimized for Expo SDK 53 and mobile devices.

## Implementation Details

### Dependencies
- `three@0.179.1` - Core Three.js library
- `@react-three/fiber@9.x` - React renderer for Three.js (v9 for React 19)
- `@react-three/drei@10.x` - Helper components and utilities
- `expo-gl@15.x` - WebGL context for Expo

### Architecture

#### Components
1. **Walking3DContainer** - Main container with error boundaries and loading states
2. **Walking3DScene** - The 3D scene setup with camera and lighting
3. **Mobile3DOptimizer** - Performance optimizations for mobile devices
4. **Scene3DLoader** - Loading indicator for 3D content

#### Features
- Real-time character movement based on step count
- Walking animation when session is active
- Dynamic camera following the character
- Optimized for mobile performance
- Fallback for unsupported devices

### Mobile Optimizations
- Disabled shadows on mobile devices
- Limited pixel ratio to 2x maximum
- Frustum culling enabled
- Simplified materials for better performance
- Disabled New Architecture for compatibility

### Configuration

#### Metro Config
The `metro.config.js` includes support for 3D model formats:
- .glb, .gltf (recommended)
- .obj, .mtl
- Texture formats: .png, .jpg

#### App Config
The `app.json` temporarily disables New Architecture on iOS and Android for better compatibility with Three.js libraries.

### Usage

#### Adding 3D Models
1. Place models in `/assets/models/`
2. Update `/src/constants/assets.ts` with model paths
3. Use the `useModel` helper from `/src/utils/three-helpers.ts`

Example:
```typescript
const { scene } = useModel(require('../../assets/models/character.glb'));
```

#### Customizing the Scene
Edit `/src/components/game/Walking3DScene.tsx` to:
- Change character appearance
- Modify environment
- Adjust camera angles
- Add new 3D elements

### Building for Production

**Important**: Three.js requires a development build, not Expo Go.

```bash
# Install EAS CLI
npm install -g eas-cli

# Create development build
eas build --profile development --platform android
# or
eas build --profile development --platform ios

# Run with development build
npx expo start --dev-client
```

### Troubleshooting

#### Black Screen on Mobile
- Ensure New Architecture is disabled in app.json
- Check that expo-gl is properly installed
- Verify WebGL context initialization

#### Performance Issues
- Reduce polygon count in models
- Disable Environment component
- Lower texture resolutions
- Use simpler materials

#### Module Resolution Errors
If you encounter "module not found" errors, uncomment this line in metro.config.js:
```javascript
config.resolver.unstable_enablePackageExports = false;
```

### Future Enhancements
- Load actual 3D character models
- Add particle effects for steps
- Implement terrain variations
- Add achievement animations
- Create multiplayer visualization