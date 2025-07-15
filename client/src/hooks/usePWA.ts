import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  canInstall: boolean;
  updateAvailable: boolean;
  installPrompt: any;
}

export function usePWA(): PWAState & {
  install: () => Promise<void>;
  skipWaiting: () => void;
} {
  const [state, setState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    canInstall: false,
    updateAvailable: false,
    installPrompt: null,
  });

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setState(prev => ({ ...prev, isInstalled: isStandalone || isInWebAppiOS }));
    };

    checkInstalled();

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setState(prev => ({ 
        ...prev, 
        canInstall: true, 
        installPrompt: e 
      }));
    };

    // Handle app installed
    const handleAppInstalled = () => {
      setState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        canInstall: false, 
        installPrompt: null 
      }));
    };

    // Handle online/offline
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    // Service Worker update detection
    const handleControllerChange = () => {
      setState(prev => ({ ...prev, updateAvailable: true }));
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      }
    };
  }, []);

  const install = async () => {
    if (state.installPrompt) {
      state.installPrompt.prompt();
      const { outcome } = await state.installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed');
      } else {
        console.log('PWA installation cancelled');
      }
      
      setState(prev => ({ ...prev, installPrompt: null, canInstall: false }));
    }
  };

  const skipWaiting = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  return {
    ...state,
    install,
    skipWaiting,
  };
}