import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({mode})=> {
  return defineConfig({
    base: loadEnv(mode, process.cwd()).VITE_PUBLIC_PATH,
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
