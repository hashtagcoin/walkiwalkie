# Expo SDK 53 Walking Game - Complete Setup Replication Guide

This document contains all dependencies, configurations, and files needed to replicate this Expo SDK 53 React Native app setup.

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

## Initial Setup Commands
```bash
npx create-expo-app@latest --template blank-typescript
cd your-app-name
```

## Package.json
```json
{
  "name": "bedwalkers2",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^14.1.0",
    "@react-navigation/bottom-tabs": "^7.3.10",
    "@react-navigation/elements": "^2.3.8",
    "@react-navigation/native": "^7.1.6",
    "expo": "~53.0.20",
    "expo-blur": "~14.1.5",
    "expo-constants": "~17.1.7",
    "expo-font": "~13.3.2",
    "expo-haptics": "~14.1.4",
    "expo-image": "~2.4.0",
    "expo-linking": "~7.1.7",
    "expo-router": "~5.1.4",
    "expo-sensors": "^14.1.4",
    "expo-splash-screen": "~0.30.10",
    "expo-status-bar": "~2.2.3",
    "expo-symbols": "~0.4.5",
    "expo-system-ui": "~5.0.10",
    "expo-web-browser": "~14.2.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-native": "0.79.5",
    "react-native-gesture-handler": "~2.24.0",
    "react-native-reanimated": "~3.17.4",
    "react-native-safe-area-context": "5.4.0",
    "react-native-screens": "~4.11.1",
    "react-native-web": "~0.20.0",
    "react-native-webview": "13.13.5",
    "zustand": "^5.0.7"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~19.0.10",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~9.2.0",
    "typescript": "~5.8.3"
  },
  "private": true
}
```

## Installation Commands
```bash
# Install all dependencies at once
npm install

# Or install individually
npm install expo@~53.0.20
npm install expo-sensors@^14.1.4
npm install zustand@^5.0.7
npm install @expo/vector-icons@^14.1.0
npm install @react-navigation/bottom-tabs@^7.3.10
npm install @react-navigation/elements@^2.3.8
npm install @react-navigation/native@^7.1.6
npm install expo-blur@~14.1.5
npm install expo-constants@~17.1.7
npm install expo-font@~13.3.2
npm install expo-haptics@~14.1.4
npm install expo-image@~2.4.0
npm install expo-linking@~7.1.7
npm install expo-router@~5.1.4
npm install expo-splash-screen@~0.30.10
npm install expo-status-bar@~2.2.3
npm install expo-symbols@~0.4.5
npm install expo-system-ui@~5.0.10
npm install expo-web-browser@~14.2.0
npm install react@19.0.0
npm install react-dom@19.0.0
npm install react-native@0.79.5
npm install react-native-gesture-handler@~2.24.0
npm install react-native-reanimated@~3.17.4
npm install react-native-safe-area-context@5.4.0
npm install react-native-screens@~4.11.1
npm install react-native-web@~0.20.0
npm install react-native-webview@13.13.5

# Dev dependencies
npm install --save-dev @babel/core@^7.25.2
npm install --save-dev @types/react@~19.0.10
npm install --save-dev eslint@^9.25.0
npm install --save-dev eslint-config-expo@~9.2.0
npm install --save-dev typescript@~5.8.3
```

## tsconfig.json
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

## app.json
```json
{
  "expo": {
    "name": "bedwalkers2",
    "slug": "bedwalkers2",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "bedwalkers2",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.bedwalkers2",
      "infoPlist": {
        "NSMotionUsageDescription": "This app uses motion detection to count your steps for the walking game."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "package": "com.yourcompany.bedwalkers2",
      "permissions": ["android.permission.ACTIVITY_RECOGNITION"]
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

## babel.config.js
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

## metro.config.js (if needed)
```javascript
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
```

## eslint.config.js
```javascript
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
```

## expo-env.d.ts
```typescript
/// <reference types="expo/types" />
```

## Project Structure
```
project-root/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── game.tsx
│   │   ├── index.tsx
│   │   └── explore.tsx
│   ├── +not-found.tsx
│   └── _layout.tsx
├── src/
│   ├── core/
│   │   ├── entities/
│   │   │   ├── Step.ts
│   │   │   └── Session.ts
│   │   ├── usecases/
│   │   └── repositories/
│   ├── services/
│   │   └── pedometer/
│   │       ├── IPedometerService.ts
│   │       └── PedometerService.ts
│   ├── store/
│   │   └── gameStore.ts
│   ├── components/
│   │   └── game/
│   │       ├── StepCounter.tsx
│   │       ├── StartButton.tsx
│   │       └── SessionStats.tsx
│   ├── hooks/
│   │   ├── usePedometer.ts
│   │   └── useWalkingSession.ts
│   └── types/
│       └── game.ts
├── assets/
│   ├── fonts/
│   └── images/
├── components/
│   ├── Collapsible.tsx
│   ├── ExternalLink.tsx
│   ├── HapticTab.tsx
│   ├── HelloWave.tsx
│   ├── ParallaxScrollView.tsx
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   └── ui/
│       ├── IconSymbol.ios.tsx
│       ├── IconSymbol.tsx
│       ├── TabBarBackground.ios.tsx
│       └── TabBarBackground.tsx
├── constants/
│   └── Colors.ts
├── hooks/
│   ├── useColorScheme.ts
│   ├── useColorScheme.web.ts
│   └── useThemeColor.ts
├── scripts/
│   └── reset-project.js
├── .gitignore
├── app.json
├── babel.config.js
├── eslint.config.js
├── expo-env.d.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Key Configuration Notes

### 1. Expo SDK Version
- This setup uses Expo SDK 53 (`expo@~53.0.20`)
- React Native 0.79.5
- React 19.0.0

### 2. Required Permissions
**iOS (in app.json):**
```json
"infoPlist": {
  "NSMotionUsageDescription": "This app uses motion detection to count your steps for the walking game."
}
```

**Android (in app.json):**
```json
"permissions": ["android.permission.ACTIVITY_RECOGNITION"]
```

### 3. TypeScript Configuration
- Strict mode enabled
- Path aliases configured for `@/*`
- Includes expo types

### 4. Essential Dependencies for Walking Game
- `expo-sensors`: For pedometer functionality
- `zustand`: For state management
- `expo-router`: For navigation
- `react-native-safe-area-context`: For safe area handling
- `react-native-reanimated`: For animations

## Replication Steps

1. **Create new Expo project:**
   ```bash
   npx create-expo-app@latest walkingGame --template blank-typescript
   cd walkingGame
   ```

2. **Replace package.json** with the version above

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Create folder structure:**
   ```bash
   mkdir -p src/{core/{entities,usecases,repositories},services/pedometer,store,components/game,hooks,types}
   ```

5. **Copy all configuration files** (tsconfig.json, app.json, babel.config.js, etc.)

6. **Add the app code** from the src/ directory

7. **Update app/(tabs)/ files** for navigation

8. **Run the project:**
   ```bash
   npm start
   ```

## Verification Commands
```bash
# Check Expo SDK version
expo --version

# Verify all dependencies installed
npm list

# Run linting
npm run lint

# Start development server
npm start
```

## Troubleshooting

1. **Clear cache if issues arise:**
   ```bash
   npx expo start -c
   ```

2. **Reset project:**
   ```bash
   npm run reset-project
   ```

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

This setup creates a fully functional Expo SDK 53 app with React Native 0.79.5 and all necessary configurations for the walking game with pedometer functionality.