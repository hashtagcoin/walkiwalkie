import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';

const colors = [
  '#87CEEB', // Sky blue
  '#98FB98', // Pale green  
  '#FFB6C1', // Light pink
  '#DDA0DD', // Plum
  '#F0E68C', // Khaki
  '#FFA07A', // Light salmon
];

export function AnimatedBackground() {
  const colorIndex = useSharedValue(0);

  useEffect(() => {
    colorIndex.value = withRepeat(
      withSequence(
        ...colors.map((_, index) => 
          withTiming(index, { duration: 20000 })
        )
      ),
      -1,
      false
    );
  }, [colorIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    const currentIndex = Math.floor(colorIndex.value) % colors.length;
    const nextIndex = (currentIndex + 1) % colors.length;
    const progress = colorIndex.value - Math.floor(colorIndex.value);

    const backgroundColor = interpolateColor(
      progress,
      [0, 1],
      [colors[currentIndex], colors[nextIndex]]
    );

    return {
      backgroundColor,
    };
  });

  return <Animated.View style={[styles.background, animatedStyle]} />;
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});