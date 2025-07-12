import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [
    react(),
    tailwindcss(),
  ],
   server: {
    proxy: {
      '/api': 'https://render-top-juridiquea-6.onrender.com', // Port de ton backend
    }
  }
})
