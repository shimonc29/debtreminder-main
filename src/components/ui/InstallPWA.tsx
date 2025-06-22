import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function InstallPWA() {
  const { canInstall, isInstalled, installPWA } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstallClick = async () => {
    if (!canInstall) return;
    
    setIsInstalling(true);
    try {
      await installPWA();
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or can't install
  if (isInstalled || !canInstall) {
    return null;
  }

  // Check if recently dismissed
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null; // Don't show for 24 hours after dismissal
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg border-blue-200 bg-blue-50 z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-sm">התקן אפליקציה</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          התקן את Debt Reminder Nexus על המכשיר שלך לגישה מהירה
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button
            onClick={handleInstallClick}
            disabled={isInstalling}
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {isInstalling ? 'מתקין...' : 'התקן'}
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            size="sm"
          >
            מאוחר יותר
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 