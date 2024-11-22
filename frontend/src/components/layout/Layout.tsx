import { useState, useEffect } from 'react';
import Footer from './Footer';
import Navigation from './Navigation';
import { Toaster } from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { AuthProvider } from '@/hooks/useAuth';
import { NetworkStatus } from '../common/NetworkStatus';
import { NetworkNotification } from '../common/NetworkNotification';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <AuthProvider>
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
        <Navigation />
        <main className="flex-grow pt-20">
          {children}
          <NetworkStatus />
          <NetworkNotification />
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
};

export default Layout;
