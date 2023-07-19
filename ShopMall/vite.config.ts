import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ()=> {
  return defineConfig({
    plugins: [vue()],
    css: {
      modules: {
        localsConvention: 'camelCase'
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  })
}
