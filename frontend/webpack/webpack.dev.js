const webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    allowedHosts: ['all'],
    historyApiFallback: true,
    open: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('http://localhost:5000'),
      'process.env.INFER_URL': JSON.stringify('http://localhost:8000'),
    }),
  ],
};
