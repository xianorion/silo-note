const path = require('path');

module.exports = {
  mode: 'development',  // or 'production'
  entry: './src/index.tsx',  // Your entry point
  target: 'node', //add electron as the target export, this allows fs to be used too!!
  output: {
    filename: 'bundle.js',  // The output bundle
    path: path.resolve(__dirname, 'public'),  // The output folder
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Make sure this points to your build directory
    },
    open: true, // Opens the browser automatically when the server starts
    hot: true, // Enable hot module replacement
    compress: true, // Gzip compression for faster loading
    port: 3000, // Or whatever port you're using
    devMiddleware: {
      publicPath: '/', // Same as `output.publicPath` (if you want to adjust)
    },
  },
  resolve: {
    // Automatically resolve certain extensions without needing to include them in import statements
    extensions: ['.ts', '.tsx', '.js', '.css'],
    alias: {
      //'@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, './components'),
      '@utils': path.resolve(__dirname, './utils'),
      '@styles': path.resolve(__dirname, './styles')
    },
    // Make sure Webpack looks in 'src' and 'node_modules' for modules
    modules: [path.resolve(__dirname, 'src'), 'node_modules'], 
  },
  
  module: {
    rules: [
      // TypeScript loader configuration
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      // CSS and other loaders
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
 
};