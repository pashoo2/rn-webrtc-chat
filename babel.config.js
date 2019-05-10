module.exports = {
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    '@babel/plugin-transform-flow-strip-types',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
  presets: ['module:metro-react-native-babel-preset'],
};
