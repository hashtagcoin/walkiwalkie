import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

interface Player {
  id: string;
  name: string;
  steps: number;
  color: string;
}

interface WalkingPathMapProps {
  players: Player[];
  isGameActive: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const mapWidth = screenWidth - 40;
const mapHeight = 180;
const maxSteps = 2000;

// Path configuration
const PATH_START_X = 15;
const PATH_END_X = mapWidth - 15;
const PATH_LENGTH = PATH_END_X - PATH_START_X;
const WAVE_COUNT = 5;
const WAVE_AMPLITUDE = 30;
const PATH_CENTER_Y = mapHeight / 2;

// Generate the exact sine wave path function
const getPathY = (x: number): number => {
  const progress = (x - PATH_START_X) / PATH_LENGTH;
  return PATH_CENTER_Y + WAVE_AMPLITUDE * Math.sin(progress * WAVE_COUNT * Math.PI);
};

// Create path segments for visual representation - this defines the actual path
const createPathSegments = () => {
  const segments = [];
  const numSegments = 60; // Balanced for smooth line and performance
  for (let i = 0; i <= numSegments; i++) {
    const progress = i / numSegments;
    const x = PATH_START_X + PATH_LENGTH * progress;
    const y = getPathY(x); // Use the same function for consistency
    
    segments.push({ x, y, progress });
  }
  return segments;
};

// Get the actual path segments (cached)
const pathSegments = createPathSegments();

// Calculate position along the actual path based on steps
// This MUST produce the exact same coordinates as the path segments
const getPositionFromSteps = (steps: number) => {
  const progress = Math.min(steps / maxSteps, 1);
  
  // Calculate exact X position
  const x = PATH_START_X + PATH_LENGTH * progress;
  
  // Calculate exact Y position using the same sine wave function
  const y = getPathY(x);
  
  return { x, y };
};

const playerColors = {
  'Hailey': '#FFD700', // Yellow
  'Buddy': '#FF8C00',  // Orange  
  'Whiskers': '#8A2BE2', // Violet
  'Alex': '#32CD32'    // Green
};

export function WalkingPathMap({ players, isGameActive }: WalkingPathMapProps) {
  
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {/* Walking Path - thick line segments */}
        {pathSegments.map((segment, index) => { // Render all segments
          if (index === 0) return null; // Skip first segment
          const prevSegment = pathSegments[index - 1];
          
          // Calculate line angle and length
          const dx = segment.x - prevSegment.x;
          const dy = segment.y - prevSegment.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          
          return (
            <View key={index}>
              {/* White outline */}
              <View
                style={[
                  styles.pathLineOutline,
                  {
                    left: prevSegment.x,
                    top: prevSegment.y - 7, // Center the thicker line
                    width: length,
                    transform: [{ rotate: `${angle}deg` }],
                  }
                ]}
              />
              {/* Black line */}
              <View
                style={[
                  styles.pathLine,
                  {
                    left: prevSegment.x,
                    top: prevSegment.y - 5, // Center the black line within white outline
                    width: length,
                    transform: [{ rotate: `${angle}deg` }],
                  }
                ]}
              />
            </View>
          );
        })}
        
        {/* Start Dot */}
        <View style={[styles.startDot, { 
          left: pathSegments[0].x - 8, 
          top: pathSegments[0].y - 8 
        }]} />
        
        {/* End Dot */}
        <View style={[styles.endDot, { 
          left: pathSegments[pathSegments.length - 1].x - 8, 
          top: pathSegments[pathSegments.length - 1].y - 8 
        }]} />
        
        {/* Player Dots */}
        {players.map((player) => {
          const position = getPositionFromSteps(player.steps);
          const color = playerColors[player.name as keyof typeof playerColors] || '#FFD700';
          
          return (
            <PlayerDot
              key={player.id}
              x={position.x}
              y={position.y}
              color={color}
              name={player.name}
              steps={player.steps}
              isActive={isGameActive}
            />
          );
        })}
      </View>
    </View>
  );
}

interface PlayerDotProps {
  x: number;
  y: number;
  color: string;
  name: string;
  steps: number;
  isActive: boolean;
}

function PlayerDot({ x, y, color, name, steps, isActive }: PlayerDotProps) {
  const scale = useSharedValue(1);
  const animatedX = useSharedValue(x);
  const animatedY = useSharedValue(y);

  useEffect(() => {
    // Animate position changes
    animatedX.value = withSpring(x, { damping: 15, stiffness: 150 });
    animatedY.value = withSpring(y, { damping: 15, stiffness: 150 });
    
    // Pulse animation when active
    if (isActive && steps > 0) {
      scale.value = withSpring(1.2, { damping: 8, stiffness: 100 }, () => {
        scale.value = withSpring(1, { damping: 8, stiffness: 100 });
      });
    }
  }, [x, y, isActive, steps]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: animatedX.value - 6 }, // Center the dot exactly on path (dot is 12px wide)
      { translateY: animatedY.value - 22 }, // Position name above, dot on the path
      { scale: scale.value }
    ],
  }));

  return (
    <Animated.View style={[styles.playerDot, animatedStyle]}>
      {/* Player Name - positioned above dot */}
      <Text style={[styles.playerName, { color: color }]}>{name}</Text>
      {/* Player Dot - will sit exactly on path */}
      <View style={[styles.dotContainer, { 
        backgroundColor: color, 
        borderColor: '#fff',
        marginTop: 4 
      }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  mapContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    padding: 15,
    position: 'relative',
    width: mapWidth,
    height: mapHeight,
  },
  pathSegment: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
  },
  pathLineOutline: {
    position: 'absolute',
    height: 14, // Thicker to ensure dots overlap
    backgroundColor: '#fff',
    transformOrigin: 'left center',
    zIndex: 1,
  },
  pathLine: {
    position: 'absolute',
    height: 10, // Thicker black line
    backgroundColor: '#000',
    transformOrigin: 'left center',
    zIndex: 2,
  },
  startDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
  },
  endDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 10,
  },
  playerDot: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 15,
  },
  playerName: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dotContainer: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
});