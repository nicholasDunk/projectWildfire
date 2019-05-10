const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
//const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const webpack = require('webpack');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const commitHash = (new GitRevisionPlugin()).commithash();
const nowTime = Date.now();


// the path(s) that should be cleaned
const pathsToClean = [
  'dist',
];

// the clean options to use
const cleanOptions = {
  verbose: true,
};

const rulesInfo = [
  // This rule comes from: https://getbootstrap.com/docs/4.0/getting-started/webpack/
  {
    test: /\.(scss|css)$/,
    use: [
      {
        loader: 'style-loader', // inject CSS to page
      },
      {
        loader: 'css-loader', // translates CSS into CommonJS modules
      },
      {
        loader: 'postcss-loader', // Run post css actions
        options: {
          plugins() { // post css plugins, can be exported to postcss.config.js
            return [
              precss,
              autoprefixer,
              cssnano,
            ];
          },
        },
      },
      {
        loader: 'sass-loader', // compiles Sass to CSS
      },
    ],
  },
  {
    test: /\.(png|svg|jpg|gif|ico)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          outputPath: 'assets/images/',
          name: '[name].[hash].[ext]',
        },
      },
    ],
  },
  {
    test: /\.json$/,
    loader: 'json-loader',
  },
  {
    enforce: 'pre',
    test: /\.js$/,
    exclude(modulePath) {
      // Don't lint files in node_modules
      if (/node_modules/.test(modulePath)) {
        return true;
      }

      // Don't lint modules imported from relative paths outside the client-web-app directory, since
      // eslint won't be able to find a config to use for them. These are typically only used for
      // local development (e.g. "npm install ../some_local_package" for testing)
      if (!/client-web-app/.test(modulePath)) {
        return true;
      }

      return false;
    },
    loader: 'eslint-loader',
    options: {
      cache: true,
    },
  },
  {
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
    },
  },
  {
    parser: {
      amd: false,
    },
  },
];

function getCommonConfig(env) {
  return {
    entry: {
      main: './src/main.js',
    },

    output: {
      filename: 'assets/js/[name]_bundle.[chunkhash].js',
      path: `${__dirname}/dist`,
      publicPath: process.env.BASE_PATH_FROM_DEPLOY_ROOT || '/',
    },

    resolve: {
      extensions: ['.js', '.jsx'],
    },

    module: {
      rules: rulesInfo,
    },

    // HtmlWebpackPlugin brings the html files for each page through to the dist folder
    plugins: [
      // Excludes all additional moment.js locales (en is built-in)
      //new MomentLocalesPlugin(),

      new CleanWebpackPlugin(pathsToClean, cleanOptions),

      new webpack.DefinePlugin({
        COMMITHASH: JSON.stringify(commitHash),
      }),

      new HtmlWebpackPlugin({
        env,
        title: 'WildFire',
        filename: 'nc/wildfire.html',
        template: './src/wildfire-template.html',
        chunks: ['main'],
      }),

      new AssetsPlugin({
        filename: `assets-${nowTime}-${commitHash}.json`,
        path: './dist/manifests',
        metadata: {
          commitHash,
          date: Date.now(),
        },
      }),
    ],
  };
}

module.exports = {
  getCommonConfig,
};
