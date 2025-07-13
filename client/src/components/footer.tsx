import { useState } from "react";
import { Mail, Phone, MapPin, Shield } from "lucide-react";
import { Link } from "wouter";
import AdminLoginModal from "./admin-login-modal";

export default function Footer() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">진안군 목조전망대 반대 캠페인</h4>
            <p className="text-gray-300 text-sm">
              군민의 소중한 세금을 지키고<br />
              민주적 절차를 존중하는<br />
              건전한 지방자치를 만들어갑니다.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">연락처</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                campaign@jinan.org
              </p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                063-000-0000
              </p>
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                전북 진안군 진안읍
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">정보</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>• 수집된 정보는 캠페인 목적으로만 사용</p>
              <p>• SSL 암호화로 안전하게 보관</p>
              <p>• 제3자 제공 금지</p>
              <p>• 캠페인 종료 후 즉시 삭제</p>
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center text-gray-400 hover:text-white transition-colors mt-4"
              >
                <Shield className="h-4 w-4 mr-2" />
                관리자 로그인
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 진안군 목조전망대 반대 캠페인. 모든 권리 보유.</p>
          <p className="mt-2">이 앱은 민주적 참여를 위한 비영리 목적으로 제작되었습니다.</p>
        </div>
      </div>
      
      <AdminLoginModal
        open={showAdminLogin}
        onOpenChange={setShowAdminLogin}
        onSuccess={() => window.location.href = '/admin'}
      />
    </footer>
  );
}
