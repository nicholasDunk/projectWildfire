const merge = require('webpack-merge');
const getCommonConfig = require('./webpack.common.js').getCommonConfig;

module.exports = env => [
  merge(getCommonConfig(env), {
    mode: 'none',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      host: 'localhost',
      port: 9997,
      index: 'nc/wildfire.html', // path to the entry point
      historyApiFallback: // so that the correct file gets served on Single page apps
        {
          index: 'nc/wildfire.html',
        },
      contentBase: './dist',
      allowedHosts: [
        'localhost',
      ],
    },
  }),
];
