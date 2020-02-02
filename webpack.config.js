const webpack = require('webpack')
const {
  resolve
} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

module.exports = {
  entry: {
    main: './src/js/liff-starter.js',
    css: resolve(__dirname, 'src/css/bulma.css'),
  },

  output: {
    filename: 'script/[name]~c_[id].[hash:12].js',
    chunkFilename: "script/c_[id].[chunkhash:12].js",
    path: resolve(__dirname, 'dist'),
  },

  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[id].[hash:6].css',
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],

  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      name: 'vendor',
      chunks: 'all',
      maxInitialRequests: 5, // default to 2, adjust as needed
      cacheGroups: {
        defaultVendors: {
          filename: 'script/c_[id].[chunkhash:12].js'
        },
        fooStyles: {
           name: 'css',
           test: (m, c, entry = 'css') =>
             m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
           chunks: 'all',
           enforce: true,
         },
      },
    },
    runtimeChunk: 'single', // optional, recommended
  },
  performance: false,
  recordsOutputPath: resolve(__dirname, "dist", "manifest.json"),
}
