module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '~': './src',
          '@svg': './src/assets/svg',
        },
      },
    ],
  ],
};
