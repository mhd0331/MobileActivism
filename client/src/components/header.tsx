import { useAuth, useLogout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Mountain, UserCircle, Download, Smartphone } from "lucide-react";
import AuthModal from "./auth-modal";
import { useState } from "react";
import { useContentText } from "@/hooks/useWebContent";
import { usePWA } from "@/hooks/usePWA";

export default function Header() {
  const { data: auth, isLoading } = useAuth();
  const logout = useLogout();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { canInstall, isInstalled, install } = usePWA();

  // Debug logging for auth state
  console.log("Header auth state:", { auth, isLoading });

  // Get content from database
  const siteTitle = useContentText("header", "site_title", "진안군 목조전망대 반대 캠페인");
  const loginButton = useContentText("header", "login_button", "로그인");
  const logoutButton = useContentText("header", "logout_button", "로그아웃");

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Mountain className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-base sm:text-lg font-bold text-gray-900">
                {siteTitle}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* PWA Install Button */}
              {canInstall && !isInstalled && (
                <Button
                  onClick={install}
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center space-x-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <Download className="h-4 w-4" />
                  <span>앱 설치</span>
                </Button>
              )}
              
              {/* Mobile PWA Button */}
              {canInstall && !isInstalled && (
                <Button
                  onClick={install}
                  variant="outline"
                  size="sm"
                  className="flex sm:hidden bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              )}
              
              {/* Installed indicator */}
              {isInstalled && (
                <div className="flex items-center space-x-1 text-green-600 text-sm">
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">앱 설치됨</span>
                </div>
              )}

              {auth && (
                <div className="flex items-center space-x-2">
                  <UserCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium hidden sm:inline">{auth.user?.name || "사용자"}</span>
                </div>
              )}
              
              {!isLoading && (
                <>
                  {auth ? (
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      disabled={logout.isPending}
                    >
                      {logoutButton}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowAuthModal(true)}
                      size="sm"
                    >
                      {loginButton}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal} 
      />
    </>
  );
}
