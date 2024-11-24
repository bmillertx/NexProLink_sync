import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/hooks/useAuth';
import { DarkModeProvider } from '@/hooks/useDarkMode';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }: AppProps) {
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
