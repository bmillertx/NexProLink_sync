import { useNetwork } from '@/hooks/useNetwork';
import { CloudIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/styles';

export function NetworkStatus() {
  const { isOnline, syncStatus } = useNetwork();
  
  return (
    <div className={cn(
      'fixed bottom-4 right-4 flex items-center gap-2 rounded-full px-4 py-2 text-sm',
      isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    )}>
      {isOnline ? (
        <CloudIcon className={cn(
          'h-5 w-5',
          syncStatus === 'synced' ? 'text-green-700' : 'text-blue-700 animate-spin'
        )} />
      ) : (
        <ArrowPathIcon className="h-5 w-5 animate-spin" />
      )}
      <span>
        {!isOnline ? 'Connecting...' :
         syncStatus === 'syncing' ? 'Syncing...' :
         syncStatus === 'pending' ? 'Changes pending' :
         'Connected'}
      </span>
    </div>
  );
}
