import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    publicDir: 'public',
    css: {
        devSourcemap: true,
    },
    server: {
        port: 80,
        strictPort: true,
    },
    build: {
        target: 'es2015',
        assetsDir: '',
        minify: 'esbuild',
        rollupOptions: {
            external: [
                'assets/',
                'blends/',
            ],
            input: [
                // Too big
                'index.html',
                // Too big
                'src/Pages/ManageDeck/ManageDeck.tsx',
                'src/Pages/ManageDecks/EditDeck.tsx',
                // Too big
                'src/Pages/TableTop/TableTopPage.tsx',
                'src/Pages/AboutPage.tsx',
                'src/Pages/NotFoundPage.tsx',
            ],
        }
    }
})
