import path from "path";
import { Configuration } from "webpack";
import { webpack } from "./webpack/webpack";
import { BuildMode } from "./webpack/types";

interface EnvVariables {
  mode: BuildMode;
  port: number;
}

export default (env: EnvVariables): Configuration => {
  const paths = {
    output: path.resolve(__dirname, 'build'),
    html: path.resolve(__dirname, 'public', 'index.html'),
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    src: path.resolve(__dirname, 'src/'),
  }
  
  const config: Configuration = webpack({
    port: env.port ?? 3000,
    mode: env.mode ?? "development",
    paths: paths,
  });

  return config;
}