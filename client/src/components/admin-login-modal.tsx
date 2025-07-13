import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Lock, User } from "lucide-react";

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AdminLoginModal({ open, onOpenChange, onSuccess }: AdminLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn, loginError } = useAdminAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "입력 오류",
        description: "사용자명과 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    login(
      { username, password },
      {
        onSuccess: () => {
          toast({
            title: "로그인 성공",
            description: "관리자로 로그인되었습니다.",
          });
          setUsername("");
          setPassword("");
          onOpenChange(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast({
            title: "로그인 실패",
            description: error.message || "로그인에 실패했습니다.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleClose = () => {
    setUsername("");
    setPassword("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600">
            <Lock className="h-5 w-5" />
            관리자 로그인
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              사용자명
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="관리자 사용자명"
                className="pl-10"
                disabled={isLoggingIn}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="pl-10"
                disabled={isLoggingIn}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoggingIn}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "로그인 중..." : "로그인"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}