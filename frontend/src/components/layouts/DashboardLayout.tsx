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

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarIcon },
    { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 ease-in-out bg-white border-r border-gray-200`}>
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="px-4 py-6">
              <Link href="/" className="flex items-center">
                <span className={`text-xl font-bold ${isSidebarOpen ? 'block' : 'hidden'}`}>
                  NexProLink
                </span>
              </Link>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150`}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                  <span className={isSidebarOpen ? 'block' : 'hidden'}>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
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
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
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
        <main className="flex-1 relative z-0 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
