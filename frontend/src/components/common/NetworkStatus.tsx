import { useNetwork } from '@/hooks/useNetwork';
import { CloudIcon, CloudOffIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/styles';

export function NetworkStatus() {
  const { isOnline = true, syncStatus = 'synced', pendingChangesCount = 0, manualSync } = useNetwork() || {};

  return (
    <div className="fixed bottom-4 right-4 flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
      <div className="flex items-center">
        {isOnline ? (
          <CloudIcon
            className={cn(
              'h-5 w-5',
              syncStatus === 'synced'
                ? 'text-green-500'
                : syncStatus === 'syncing'
                ? 'text-blue-500'
                : 'text-yellow-500'
            )}
          />
        ) : (
          <CloudOffIcon className="h-5 w-5 text-gray-500" />
        )}
      </div>

      {!isOnline && (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Offline
        </span>
      )}

      {isOnline && syncStatus === 'pending' && pendingChangesCount > 0 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-yellow-600 dark:text-yellow-400">
            {pendingChangesCount} pending
          </span>
          <button
            onClick={() => manualSync?.()}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Sync now"
          >
            <ArrowPathIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}

      {isOnline && syncStatus === 'syncing' && (
        <div className="flex items-center space-x-2">
          <ArrowPathIcon className="h-4 w-4 text-blue-500 animate-spin" />
          <span className="text-sm text-blue-600 dark:text-blue-400">
            Syncing...
          </span>
        </div>
      )}
    </div>
  );
}
