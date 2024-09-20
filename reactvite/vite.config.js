// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://taller-api-clientes.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
};
