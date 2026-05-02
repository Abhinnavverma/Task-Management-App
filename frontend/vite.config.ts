import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    preview: {
        host: '0.0.0.0',
        port: Number(process.env.PORT) || 5173,
        allowedHosts: ['taskmanagement-project.up.railway.app'],
    },
});
