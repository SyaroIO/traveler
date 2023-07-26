import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import compression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), compression()],
    build: {
        target: 'esnext'
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
})
