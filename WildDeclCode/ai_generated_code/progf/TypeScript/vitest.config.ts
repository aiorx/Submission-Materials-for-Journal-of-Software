// Supported by standard GitHub tools
// filepath: vitest.config.ts
// 生成内容説明: templates配下をテスト対象から除外し、src, bin, testディレクトリのみをテスト対象とするvitest設定ファイル。
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'bin/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'test/**/*.{test,spec}.{js,ts,jsx,tsx}'
    ],
    exclude: [
      'templates/**',
      'node_modules',
      'dist',
      'coverage',
      '**/e2e/**'
    ]
  }
});
