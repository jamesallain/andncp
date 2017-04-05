'use strict';

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import postcssNesting from 'postcss-nesting';

export default {
  devtool: 'eval',
  entry: {
    bundle: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      path.join(__dirname, 'js/client')
    ],
    'vendor.bundle': [
      'jquery',
      'bootstrap/dist/js/bootstrap',
      'tether',
      'react',
      'react-dom',
      'react-router',
      'babel-relay-plugin',
      'react-relay',
      'react-router-relay',
      'react-country-region-selector',
      'moment'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist/client'),
    filename: '[name].js',
    publicPath: '/'
  },
  devServer: {
    hot: true,
    proxy: {
      '*': 'http://localhost:3000'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `ejs-loader!${path.join(__dirname, 'views/index.ejs')}`,
      filename: path.join(__dirname, 'index.html')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor.bundle',
      filename: '[name].js'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Bootstrap: 'bootstrap/dist/js/bootstrap',
      Tether: 'tether'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.ejs$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ejs-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: [
                'es2015',
                'stage-0',
                'react',
                'react-hmre'
              ],
              plugins: [
                ['./babelRelayPlugin'].map(require.resolve)
              ]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [autoprefixer, precss, postcssNesting];
              }
            }
          }
        ]
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader?limit=10000'
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules',
      'js/client'
    ]
  }
};
