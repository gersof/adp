const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SassLintPlugin = require('sasslint-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const helpers = require('./helpers');


module.exports = {

  resolve: {
    extensions: ['.ts', '.js', '.scss', '.html'],
    modules: ['node_modules']
  },

  entry: {
    'vendor': './src/vendor.ts',
    'toolbar': './src/toolbar.ts'
  },

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].js'
  },

  module: {
    rules: [
      /*
      * Source map loader support for *.js files
      * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
      *
      * See: https://github.com/webpack/source-map-loader
      */
      {
        test: /\.js$/,
        use: 'source-map-loader',
        enforce: 'pre'
      },

      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: [
          /\.(spec|e2e)\.ts$/,
          /dist/,
          /node_modules/,
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader?sourceMap', 'sass-loader?sourceMap'] })
      },
      {
        test: /\.(gif|jpe?g|png|svg|tiff|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              useRelativePath: true,
              publicPath: ''
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      }
    ]
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new SassLintPlugin({
      configFile: '.sass-lint.yml',
      glob: 'src/**/*.s?(a|c)ss',
    }),
    new CheckerPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['toolbar', 'vendor']
    }),
    new CopyWebpackPlugin([
      { from: 'src/assets', to: 'assets' },
      { from: 'src/popup.html' },
      { from: 'src/popup.js' },
      { from: 'manifest.json' },
    ]),
    new ExtractTextPlugin({
      filename: '[name].css'
    })
  ]

};