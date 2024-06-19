import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { BuildOptions } from './types';

export function devServer({port}: BuildOptions): DevServerConfiguration  {
  return {
    port,
    open: true,
    host: '0.0.0.0',
    hot: true,
  }
}