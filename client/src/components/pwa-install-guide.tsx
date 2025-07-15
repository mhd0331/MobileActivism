import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Monitor, Apple, Bot } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function PWAInstallGuide() {
  const { canInstall, isInstalled, install } = usePWA();

  if (isInstalled) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Smartphone className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800">
                ✅ 앱이 설치되었습니다!
              </h3>
              <p className="text-sm text-green-600 mt-1">
                홈 화면에서 바로 진안군 캠페인에 참여하세요
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Smartphone className="h-6 w-6 text-blue-600" />
          <span>📱 진안군 캠페인 앱 설치하기</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-gray-600 text-sm">
            홈 화면에 앱을 설치하면 더 빠르고 편리하게 캠페인에 참여할 수 있습니다
          </p>
        </div>

        {canInstall && (
          <div className="text-center">
            <Button
              onClick={install}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              지금 설치하기
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* iPhone 설치 방법 */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
              <Apple className="h-5 w-5 text-gray-600" />
              <h4 className="font-semibold text-gray-800">아이폰 (iOS)</h4>
            </div>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Safari 브라우저로 접속</li>
              <li>2. 하단 공유 버튼(📤) 터치</li>
              <li>3. "홈 화면에 추가" 선택</li>
              <li>4. "추가" 버튼 터치</li>
            </ol>
          </div>

          {/* Android 설치 방법 */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="h-5 w-5 text-gray-600" />
              <h4 className="font-semibold text-gray-800">안드로이드</h4>
            </div>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Chrome 브라우저로 접속</li>
              <li>2. 우상단 메뉴(⋮) 터치</li>
              <li>3. "홈 화면에 추가" 선택</li>
              <li>4. "설치" 버튼 터치</li>
            </ol>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold text-blue-800 mb-2">💡 앱 설치 후 혜택</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 홈 화면에서 바로 접속 가능</li>
            <li>• 오프라인에서도 주요 정보 확인</li>
            <li>• 새로운 공지사항 알림 받기</li>
            <li>• 더 빠른 페이지 로딩 속도</li>
          </ul>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            설치 후 브라우저를 종료해도 홈 화면의 앱 아이콘으로 바로 접속할 수 있습니다
          </p>
        </div>
      </CardContent>
    </Card>
  );
}