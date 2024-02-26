module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@root': './src',
          '@apis': './src/apis',
          '@components': './src/components',
          '@containers': './src/containers',
          '@state': './src/state',
          '@assets': './src/assets',
          '@utils': './src/utils',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        APP_ENV: 'DEVELOPMENT',
        NAME: 'BIIP Medziokle',
        BASE_URL: 'https://internalapi.biip.lt/medziokle',
        DEV_EMAIL: null,
        DEV_PASSWORD: null,
      },
    ],
    ['react-native-reanimated/plugin'],
  ],
};
