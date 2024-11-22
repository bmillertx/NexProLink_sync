import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { app } from '@/config/firebase';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from 'next-themes';

// Ensure Firebase is initialized
if (!app) {
  throw new Error('Firebase failed to initialize. Check your environment variables.');
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}
