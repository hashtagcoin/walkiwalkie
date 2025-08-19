const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for 3D model files
config.resolver.assetExts.push(
  'glb',
  'gltf',
  'png',
  'jpg',
  'obj',
  'mtl'
);

// Temporarily disable exports enforcement if needed
// config.resolver.unstable_enablePackageExports = false;

module.exports = config;