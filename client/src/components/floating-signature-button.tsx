import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PenTool } from "lucide-react";
import AuthModal from "./auth-modal";

export default function FloatingSignatureButton() {
  const { data: auth } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleClick = () => {
    if (!auth?.user) {
      setShowAuthModal(true);
      return;
    }
    // Scroll to signature section
    const signatureSection = document.getElementById("signature-section");
    if (signatureSection) {
      signatureSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        size="lg"
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-orange-600 hover:bg-orange-700 text-white h-14 w-14 p-0"
      >
        <PenTool className="h-6 w-6" />
      </Button>
      
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
}
