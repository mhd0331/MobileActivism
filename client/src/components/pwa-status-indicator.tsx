import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function PWAStatusIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if app is installed (standalone mode)
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Service Worker update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col space-y-2">
      {updateAvailable && (
        <Badge 
          variant="destructive" 
          className="cursor-pointer shadow-lg"
          onClick={handleUpdate}
        >
          <Download className="h-3 w-3 mr-1" />
          업데이트 사용 가능
        </Badge>
      )}
      
      <div className="flex items-center space-x-2">
        {isInstalled && (
          <Badge variant="secondary" className="shadow-lg">
            📱 앱 설치됨
          </Badge>
        )}
        
        <Badge 
          variant={isOnline ? "default" : "destructive"}
          className="shadow-lg"
        >
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3 mr-1" />
              온라인
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 mr-1" />
              오프라인
            </>
          )}
        </Badge>
      </div>
    </div>
  );
}