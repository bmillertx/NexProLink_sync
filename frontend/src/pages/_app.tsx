import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';
import '../styles/calendar.css';  // Add calendar styles globally

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
