import {Configuration} from 'webpack';

export function resolver(path: string): Configuration['resolve'] {
  return {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path
    }
  }
}