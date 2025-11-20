import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Expose T_ prefixed Vercel env vars to the browser
        'import.meta.env.VITE_PUBLIC_SUPABASE_URL': JSON.stringify(env.T_VITE_PUBLIC_SUPABASE_URL || env.VITE_PUBLIC_SUPABASE_URL),
        'import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.T_VITE_PUBLIC_SUPABASE_ANON_KEY || env.VITE_PUBLIC_SUPABASE_ANON_KEY),
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.T_VITE_GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
        'import.meta.env.VITE_PUBLIC_URL': JSON.stringify(env.T_VITE_PUBLIC_URL || env.VITE_PUBLIC_URL || 'https://tomo-business.vercel.app'),
        'process.env.API_KEY': JSON.stringify(env.T_VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.T_VITE_GEMINI_API_KEY || env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
