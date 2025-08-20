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

// Disable package exports to fix import.meta error
config.resolver.unstable_enablePackageExports = false;

module.exports = config;