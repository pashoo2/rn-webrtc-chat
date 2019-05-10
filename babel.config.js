module.exports = {
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    '@babel/plugin-transform-flow-strip-types',
  ],
  presets: ['module:metro-react-native-babel-preset'],
};
