import { Configuration } from "webpack";
import { BuildOptions } from "./types";
import { plugins } from "./plugins";
import { loaders } from "./loaders";
import { resolver } from "./resolver";
import { devServer } from "./devServer";


export function webpack(options: BuildOptions): Configuration {
  const { mode, paths } = options;
  const isDev = mode === 'development';

  return {
    mode: mode,
    entry: paths.entry,
    output: {
      path: paths.output,
      filename: '[name].[contenthash].js',
      clean: true,
    },
    plugins: plugins(options),
    module: {
      rules: loaders(options),
    },
    resolve: resolver(paths.src),
    devtool: isDev && 'inline-source-map',
    devServer: isDev ? devServer(options) : undefined,
  }
}