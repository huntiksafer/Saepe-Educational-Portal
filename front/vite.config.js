import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: true, // Необхідно для прокидання портів у Docker
        proxy: {
            // Опціонально: Проксіювання запитів API під час розробки
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            }
        }
    }
});