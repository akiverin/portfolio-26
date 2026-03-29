import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      shared: path.resolve(__dirname, 'src/shared'),
      entities: path.resolve(__dirname, 'src/entities'),
      features: path.resolve(__dirname, 'src/features'),
      widgets: path.resolve(__dirname, 'src/widgets'),
      pages: path.resolve(__dirname, 'src/pages'),
      assets: path.resolve(__dirname, 'src/assets'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: [path.resolve(__dirname, 'src/shared/styles')],
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Keep `react` in the same chunk as react-dom — splitting only react-dom
            // leaves a second React copy elsewhere and breaks Mantine (useLayoutEffect on undefined).
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router')
            ) {
              return 'vendor-react';
            }
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('@mantine')) return 'vendor-mantine';
            if (id.includes('mobx')) return 'vendor-mobx';
            if (id.includes('@tabler')) return 'vendor-icons';
            if (id.includes('@lottiefiles') || id.includes('dotlottie'))
              return 'vendor-lottie';
          }
        },
      },
    },
  },
});
