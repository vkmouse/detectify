const webpack = require('webpack');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://api.detectify.tw'),
      'process.env.INFER_URL': JSON.stringify('https://inference.detectify.tw'),
    }),
  ],
};
