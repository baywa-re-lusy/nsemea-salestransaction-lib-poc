import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    clearMocks: true,
  },
  resolve: {
    alias: {
      'N': resolve(__dirname, './tests/__mock__/N'),
      '@nsemea_lib' : resolve(__dirname,'./src/Typescripts/nsemea_lib')
    },
  },
});
