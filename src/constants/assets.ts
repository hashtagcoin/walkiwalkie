// 3D Model Assets Configuration
export const MODELS = {
  // Example model paths - replace with actual model files
  character: {
    // path: require('../../assets/models/character.glb'),
    path: null, // Placeholder - using primitive shapes for now
    scale: [1, 1, 1],
    position: [0, 0, 0],
  },
  environment: {
    // path: require('../../assets/models/park.glb'),
    path: null, // Placeholder - using Environment component for now
    scale: [1, 1, 1],
    position: [0, 0, 0],
  },
};

// Texture Assets
export const TEXTURES = {
  ground: {
    // path: require('../../assets/textures/grass.jpg'),
    path: null,
    repeat: [10, 10],
  },
  path: {
    // path: require('../../assets/textures/stone.jpg'),
    path: null,
    repeat: [1, 2],
  },
};

// Animation Names (for future GLTF animations)
export const ANIMATIONS = {
  idle: 'Idle',
  walk: 'Walk',
  run: 'Run',
};

// Player Avatar Assets
export const AVATARS = {
  player: require('../../assets/images/girlw.jpg'),
  aiPlayer1: require('../../assets/boyw.jpg'),
  aiPlayer2: require('../../assets/cat.jpg'),
  aiPlayer3: require('../../assets/dog.jpg'),
};