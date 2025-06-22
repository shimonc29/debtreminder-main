import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    canInstall: false,
    isOnline: navigator.onLine,
    hasUpdate: false,
    deferredPrompt: null,
  });

  // Check if app is installed
  const checkIfInstalled = useCallback(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    return isStandalone || isIOSStandalone;
  }, []);

  // Handle beforeinstallprompt event
  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    e.preventDefault();
    setPwaState(prev => ({
      ...prev,
      canInstall: true,
      deferredPrompt: e as BeforeInstallPromptEvent,
    }));
  }, []);

  // Handle appinstalled event
  const handleAppInstalled = useCallback(() => {
    setPwaState(prev => ({
      ...prev,
      isInstalled: true,
      canInstall: false,
      deferredPrompt: null,
    }));
  }, []);

  // Handle online/offline events
  const handleOnline = useCallback(() => {
    setPwaState(prev => ({ ...prev, isOnline: true }));
  }, []);

  const handleOffline = useCallback(() => {
    setPwaState(prev => ({ ...prev, isOnline: false }));
  }, []);

  // Handle service worker updates
  const handleServiceWorkerUpdate = useCallback(() => {
    setPwaState(prev => ({ ...prev, hasUpdate: true }));
  }, []);

  // Install the PWA
  const installPWA = useCallback(async () => {
    if (!pwaState.deferredPrompt) {
      throw new Error('Install prompt not available');
    }

    try {
      pwaState.deferredPrompt.prompt();
      const { outcome } = await pwaState.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }
      
      setPwaState(prev => ({
        ...prev,
        deferredPrompt: null,
        canInstall: false,
      }));
      
      return outcome;
    } catch (error) {
      console.error('PWA installation failed:', error);
      throw error;
    }
  }, [pwaState.deferredPrompt]);

  // Update the PWA
  const updatePWA = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.update();
        });
      });
    }
    setPwaState(prev => ({ ...prev, hasUpdate: false }));
  }, []);

  // Check for updates
  const checkForUpdates = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.update();
        });
      });
    }
  }, []);

  useEffect(() => {
    // Set initial installed state
    setPwaState(prev => ({
      ...prev,
      isInstalled: checkIfInstalled(),
    }));

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleServiceWorkerUpdate);
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleServiceWorkerUpdate);
      }
    };
  }, [checkIfInstalled, handleBeforeInstallPrompt, handleAppInstalled, handleOnline, handleOffline, handleServiceWorkerUpdate]);

  return {
    ...pwaState,
    installPWA,
    updatePWA,
    checkForUpdates,
  };
} 