const { addBeforeLoader, loaderByName } = require('@craco/craco');
const { Renderer } = require('marked');

module.exports = {
  plugins: [
    {
      plugin: require('craco-plugin-scoped-css'),
    },
  ],
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.extensions.push('.md');

      const markdownLoader = {
        test: /\.md$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('html-loader'),
          },
          {
            loader: require.resolve('markdown-loader'),
            options: {
              renderer: new Renderer(),
            },
          },
        ],
      };

      addBeforeLoader(webpackConfig, loaderByName('file-loader'), markdownLoader);

      return webpackConfig;
    },
  },
};
