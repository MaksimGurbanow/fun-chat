import { ModuleOptions } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BuildOptions } from './types';

export function loaders({mode}: BuildOptions): ModuleOptions['rules'] {
  const isDev = mode === "development"

  const assetLoader = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  };

  const svgLoader = {
    test: /\.svg$/,
    loader: 'svg-inline-loader'
}

  const scssLoader = {
    test: /\.(css|s[ac]ss)$/i,
    use: [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]',
          },
        },
      },
      'sass-loader'
    ],
  }

  const tsLoader = {
    test: /\.(js|tsx?)/i,
    use: 'ts-loader',
    exclude: /node_modules/,
  }
  return [
    assetLoader,
    svgLoader,
    scssLoader,
    tsLoader,
  ];
}