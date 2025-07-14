import { useState } from "react";
import { Mail, Phone, MapPin, Shield } from "lucide-react";
import { Link } from "wouter";
import AdminLoginModal from "./admin-login-modal";
import { useContentText } from "@/hooks/useWebContent";

export default function Footer() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  // Get content from database
  const siteTitle = useContentText("header", "site_title", "진안군 목조전망대 반대 캠페인");
  const siteDescription = useContentText("footer", "site_description", "군민의 소중한 세금을 지키고\n민주적 절차를 존중하는\n건전한 지방자치를 만들어갑니다.");
  const contactTitle = useContentText("footer", "contact_title", "연락처");
  const contactEmail = useContentText("footer", "contact_email", "campaign@jinan.org");
  const contactPhone = useContentText("footer", "contact_phone", "063-000-0000");
  const contactAddress = useContentText("footer", "contact_address", "전북 진안군 진안읍");
  const infoTitle = useContentText("footer", "info_title", "정보");
  const privacyInfo = useContentText("footer", "privacy_info", "• 수집된 정보는 캠페인 목적으로만 사용\n• SSL 암호화로 안전하게 보관\n• 제3자 제공 금지\n• 캠페인 종료 후 즉시 삭제");
  const adminLogin = useContentText("footer", "admin_login", "관리자 로그인");
  const copyright = useContentText("footer", "copyright", "© 2024 진안군 목조전망대 반대 캠페인. 모든 권리 보유.");
  const purpose = useContentText("footer", "purpose", "이 앱은 민주적 참여를 위한 비영리 목적으로 제작되었습니다.");

  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">{siteTitle}</h4>
            <div className="text-gray-300 text-sm">
              {siteDescription.split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < siteDescription.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{contactTitle}</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {contactEmail}
              </p>
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                {contactPhone}
              </p>
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {contactAddress}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{infoTitle}</h4>
            <div className="text-gray-300 text-sm space-y-2">
              {privacyInfo.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center text-gray-400 hover:text-white transition-colors mt-4"
              >
                <Shield className="h-4 w-4 mr-2" />
                {adminLogin}
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>{copyright}</p>
          <p className="mt-2">{purpose}</p>
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
