/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  trailingSlash: true,
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `/api/:path*/`,
        },
      ],
    };
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) => {
      if (rule.test instanceof RegExp) {
        return rule.test.test('.svg');
      }
      return null;
    });

    fileLoaderRule.exclude = /\.svg$/;

    config.module.rules.push({
      test: /\.inline.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
                'prefixIds',
                'removeDimensions',
              ],
            },
          },
        },
      ],
    });

    config.module.rules.push({
      test: /(?<!inline)\.svg$/,
      issuer: /\.(js|jsx|ts|tsx|css)$/,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: 512,
            publicPath: '/_next/static/images',
            outputPath: 'static/images',
            fallback: require.resolve('file-loader'),
          },
        },
        {
          loader: require.resolve('svgo-loader'),
        },
      ],
    });

    return config;
  },
};
