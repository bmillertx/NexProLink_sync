import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useNetwork } from '@/hooks/useNetwork';
import { cn } from '@/utils/styles';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

export function NetworkNotification() {
  const { isOnline = true, syncStatus = 'synced', pendingChangesCount = 0 } = useNetwork() || {};
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Handle network status changes
    if (!isOnline) {
      addNotification({
        type: 'warning',
        message: 'You are offline. Changes will be saved locally and synced when you reconnect.',
      });
    } else if (notifications.some(n => n.message.includes('offline'))) {
      addNotification({
        type: 'success',
        message: 'You are back online.',
      });
    }
  }, [isOnline]);

  useEffect(() => {
    // Handle sync status changes
    if (syncStatus === 'synced' && pendingChangesCount === 0) {
      addNotification({
        type: 'success',
        message: 'All changes have been synced successfully.',
      });
    } else if (syncStatus === 'pending' && pendingChangesCount > 0) {
      addNotification({
        type: 'warning',
        message: `${pendingChangesCount} change${pendingChangesCount > 1 ? 's' : ''} pending synchronization.`,
      });
    }
  }, [syncStatus, pendingChangesCount]);

  const addNotification = ({ type, message }: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => {
      // Remove duplicate notifications
      const filtered = prev.filter(n => n.message !== message);
      return [...filtered, { id, type, message }];
    });

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
      case 'info':
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.map(notification => (
        <Transition
          key={notification.id}
          show={true}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={cn(
              'max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto overflow-hidden',
              'border-l-4',
              {
                'border-green-500': notification.type === 'success',
                'border-yellow-500': notification.type === 'warning',
                'border-red-500': notification.type === 'error',
                'border-blue-500': notification.type === 'info',
              }
            )}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {notification.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      ))}
    </div>
  );
}
