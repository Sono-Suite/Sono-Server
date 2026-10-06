import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import { createRequire } from 'node:module'
import { fileURLToPath, URL } from 'node:url'
import tailwind from 'tailwindcss'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)
const serverConfig = require('../config.js') as {
    title: string
    desc: string
    themeColor: string
    baseUrl: string
    ADDRESS: string
    PORT: number
    https: boolean
}

process.env.VITE_BASE_URL = serverConfig.baseUrl
process.env.VITE_TITLE = serverConfig.title
process.env.VITE_DESCRIPTION = serverConfig.desc
process.env.VITE_THEME_COLOR = serverConfig.themeColor

// https://vitejs.dev/config/
export default defineConfig({
    base: serverConfig.baseUrl,
    css: {
        postcss: {
            plugins: [tailwind(), autoprefixer()],
        },
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        proxy: {
            [`${serverConfig.baseUrl}sonolus`]: {
                target: `${serverConfig.https ? 'https' : 'http'}://${serverConfig.ADDRESS}:${serverConfig.PORT}`,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.slice(serverConfig.baseUrl.length),
            },
        },
    },
})
