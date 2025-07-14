import { useState } from "react";
import { useLogin } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ShieldQuestion, MapPin } from "lucide-react";
import { jinanDistricts } from "@shared/schema";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const login = useLogin();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim() || !district.trim()) {
      toast({
        title: "입력 오류",
        description: "이름, 전화번호, 거주지역을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    // Simple phone number validation
    const phoneRegex = /^010-?\d{4}-?\d{4}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "전화번호 오류",
        description: "올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("AuthModal: Starting login process");
      const result = await login.mutateAsync({ name, phone, district });
      console.log("AuthModal: Login mutation result:", result);
      
      toast({
        title: "로그인 성공",
        description: "안전하게 로그인되었습니다.",
      });
      setName("");
      setPhone("");
      setDistrict("");
      onOpenChange(false);
      
      console.log("AuthModal: Calling success callback");
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("AuthModal: Login error:", error);
      toast({
        title: "로그인 실패",
        description: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <ShieldQuestion className="h-12 w-12 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">실명 로그인</DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            안전한 캠페인 참여를 위해 실명 인증이 필요합니다
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="실명을 입력하세요"
              className="mt-1 text-lg py-3"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              className="mt-1 text-lg py-3"
              required
            />
          </div>

          <div>
            <Label htmlFor="district">거주지역</Label>
            <Select value={district} onValueChange={setDistrict} required>
              <SelectTrigger className="mt-1 text-lg py-3">
                <SelectValue placeholder="진안군 내 거주지역을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {jinanDistricts.map((districtName) => (
                  <SelectItem key={districtName} value={districtName}>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {districtName}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-medium">개인정보 보호</p>
                <p className="mt-1">
                  입력하신 정보는 암호화되어 안전하게 보관되며, 캠페인 목적 외에는 사용되지 않습니다.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={login.isPending}
              className="flex-1"
            >
              {login.isPending ? "로그인 중..." : "로그인"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
