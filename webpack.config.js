const path = require('path');

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'public', 'babel'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      }, 
      /* Add a rule for CSS files in your webpack configuration file
      This tells webpack to use style-loader to inject CSS into the DOM 
      and css-loader to handle CSS imports.
       */ 
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  mode:'development',
};
