import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface GameHeaderProps {
  onMenuPress?: () => void;
  onProfilePress?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  onMenuPress, 
  onProfilePress 
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Menu Button */}
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={onMenuPress}
        activeOpacity={0.7}
      >
        <View style={styles.menuIcon}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </View>
      </TouchableOpacity>

      {/* Profile Avatar */}
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          <Image 
            source={require('../../../assets/girlw.jpg')} 
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.onlineIndicator} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
    elevation: 1000,
  },
  menuButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  menuIcon: {
    width: 18,
    height: 14,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: 18,
    height: 2,
    backgroundColor: 'white',
    borderRadius: 1,
  },
  profileButton: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'white',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: 'white',
  },
});