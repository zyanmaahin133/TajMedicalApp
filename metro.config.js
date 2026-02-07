const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  // Setting the watcher to an empty object overrides and removes the defaults.
  watcher: {},
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
