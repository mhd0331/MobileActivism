import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PWAInstallBannerProps {
  onClose: () => void;
}

export function PWAInstallBanner({ onClose }: PWAInstallBannerProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if banner was dismissed
    const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (bannerDismissed) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show banner after 5 seconds if not already shown
    const timer = setTimeout(() => {
      if (!deferredPrompt) {
        setShowBanner(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA 설치 완료');
      } else {
        console.log('PWA 설치 취소');
      }
      
      setDeferredPrompt(null);
      setShowBanner(false);
    } else {
      // Manual install instructions for iOS/other browsers
      showManualInstallGuide();
    }
  };

  const showManualInstallGuide = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let message = '';
    if (isIOS) {
      message = '아이폰: Safari 브라우저에서 하단 공유 버튼을 누르고 "홈 화면에 추가"를 선택하세요.';
    } else if (isAndroid) {
      message = '안드로이드: Chrome 브라우저에서 메뉴(⋮)를 누르고 "홈 화면에 추가"를 선택하세요.';
    } else {
      message = '브라우저 메뉴에서 "홈 화면에 추가" 또는 "앱 설치"를 선택하세요.';
    }
    
    alert(message);
  };

  const handleClose = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
    onClose();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-md bg-blue-600 text-white border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex-shrink-0">
                <Smartphone className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium">
                  📱 앱으로 더 편리하게!
                </h3>
                <p className="text-xs text-blue-100 mt-1">
                  홈 화면에 추가하여 빠른 접근과 알림을 받으세요
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 ml-2 text-blue-100 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-3 flex space-x-2">
            <Button
              onClick={handleInstall}
              variant="outline"
              size="sm"
              className="bg-white text-blue-600 border-white hover:bg-blue-50 flex-1"
            >
              <Download className="h-4 w-4 mr-1" />
              설치하기
            </Button>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-blue-100 hover:text-white hover:bg-blue-700"
            >
              나중에
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}