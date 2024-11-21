import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isDarkMode } = useTheme();

  const navigation = [
    { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarIcon },
    { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const tab = href.split('/').pop() || 'appointments';
    const element = document.querySelector(`[role="tab"][data-tab="${tab}"]`) as HTMLElement;
    if (element) {
      element.click();
    }
  };

  return (
    <div className={`h-screen flex overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 ease-in-out ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-r`}>
        <div className="flex flex-col h-full">
          <div className="flex-1">
            {/* Dashboard Label */}
            <div className={`px-4 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center pb-2">
                <HomeIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`ml-3 text-sm font-medium uppercase tracking-wider ${
                  isSidebarOpen ? 'block' : 'hidden'
                } ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Dashboard
                </span>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="px-2 pt-2 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`${
                    router.pathname === item.href
                      ? isDarkMode
                        ? 'bg-gray-700 text-blue-400'
                        : 'bg-blue-50 text-blue-600'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-50'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150`}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-5 w-5" />
                  <span className={isSidebarOpen ? 'block' : 'hidden'}>{item.name}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className={`flex-shrink-0 flex border-t p-4 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => signOut()}
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={user?.photoURL || 'https://via.placeholder.com/40'}
                    alt=""
                  />
                </div>
                <div className={`${isSidebarOpen ? 'ml-3' : 'hidden'}`}>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {user?.displayName || 'User'}
                  </p>
                  <p className={`text-xs font-medium ${
                    isDarkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-500 group-hover:text-gray-700'
                  }`}>
                    Sign out
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto focus:outline-none">
        <main className={`flex-1 relative z-0 overflow-y-auto p-6 ${
          isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}
