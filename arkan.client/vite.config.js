import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import { ensureCertificate } from './utils/certificate';
import { loadEnvironment } from './config/environments';
import { resolve } from 'path';

loadEnvironment();
const baseFolder =
  process.env.APPDATA !== undefined && process.env.APPDATA !== ''
    ? `${process.env.APPDATA}/ASP.NET/https`
    : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv.map((arg) => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg.groups.value : 'arkan.client';
const { certFilePath, keyFilePath } = ensureCertificate(certificateName, baseFolder);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [plugin()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@services': resolve(__dirname, './src/services'),
      '@utils': resolve(__dirname, './utils'),
      '@slices': resolve(__dirname, './src/slices'),
      '@shared': resolve(__dirname, './src/app/shared'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@api': resolve(__dirname, './src/api'),
      '@constants': resolve(__dirname, './src/constants'),
      '@assets': resolve(__dirname, './src/assets'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@helpers': resolve(__dirname, './src/app/public/helpers'),
      '@(admin)': resolve(__dirname, './src/app/admin'),
      '@(client)': resolve(__dirname, './src/app/client')
    }
  },
  server: {
    proxy: {
      '^/api/.*': {
        target: process.env.VITE_API_TARGET,
        changeOrigin: false,
        secure: false
      },
      '^/images/.*': {
        target: process.env.VITE_API_TARGET,
        changeOrigin: false,
        secure: false
      },
      '^/lessonsMaterial/.*': {
        target: process.env.VITE_API_TARGET,
        changeOrigin: false,
        secure: false
      },
      '^/Notifications': {
        target: process.env.VITE_API_TARGET,
        changeOrigin: false,
        ws: true, // Important for WebSocket connection
        secure: false
      },
      '^/chatFiles/.*': {
        target: process.env.VITE_API_TARGET,
        changeOrigin: false,
        secure: false
      }
    },
    port: 5173,
    https: {
      key: fs.readFileSync(keyFilePath),
      cert: fs.readFileSync(certFilePath)
    }
  }
});
