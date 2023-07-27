import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import compression from 'vite-plugin-compression'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), compression(), eslintPlugin({ cache: false })],
    build: {
        target: 'esnext',
        emptyOutDir: true,
        outDir: '../dist/frontend'
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
})
