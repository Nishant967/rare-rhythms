/**
 * Webpack configuration file.
 * @param {Object} env - Environment variables.
 * @param {Object} argv - Command line arguments.
 * @returns {Object} Webpack configuration object.
 */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      popup: './popup/popup.js',
      background: './background/background.js',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'manifest.json', to: 'manifest.json' },
          { from: 'popup/index.html', to: 'popup.html' },
          { from: 'popup/styles.css', to: 'styles.css' },
          { from: 'images', to: 'images' },
        ],
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map',
  };
};