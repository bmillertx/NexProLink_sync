import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/hooks/useAuth';
import { DarkModeProvider } from '@/hooks/useDarkMode';
import { useEffect } from 'react';
import app from '@/config/firebase';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from 'next-themes';

// Initialize Firebase on the client side only
if (typeof window !== 'undefined') {
  if (!app) {
    console.error('Firebase failed to initialize. Check your environment variables.');
  }
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Additional initialization logic if needed
  }, []);

  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <DarkModeProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </DarkModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
