import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from 'next-themes';
import { AuthProvider } from '@/context/AuthContext';

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
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Layout;
