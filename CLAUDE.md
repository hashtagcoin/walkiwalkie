# Walking Game - Development Notes

## Architecture Overview
This walking game uses a modular, scalable architecture based on Clean Architecture principles.

## Key Commands
- `npm run lint` - Run ESLint to check code quality
- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator

## Project Structure
- `/src/core/` - Domain layer with entities and business logic
- `/src/services/` - External service integrations (Pedometer)
- `/src/store/` - State management with Zustand
- `/src/components/` - Reusable UI components
- `/src/hooks/` - Custom React hooks
- `/app/(tabs)/` - Expo Router navigation screens

## Features
- Real-time step counting using Expo Pedometer
- Session tracking with start/stop functionality
- Daily step tracking
- Clean, modular architecture for easy feature additions
- Permission handling for motion & fitness access

## Future Enhancements
- Achievements and rewards system
- Social features and leaderboards
- GPS route tracking
- Health app integration
- Gamification elements