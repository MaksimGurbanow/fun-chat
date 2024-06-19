import { WebpackPluginInstance } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BuildOptions } from './types';


export function plugins({mode, paths}: BuildOptions): (WebpackPluginInstance | false)[] {
  const isProd = mode === "production";
  return [
    new HtmlWebpackPlugin({ template: paths.html }),
    isProd && new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css'
    })
  ].filter(Boolean) as (WebpackPluginInstance | false)[];
}