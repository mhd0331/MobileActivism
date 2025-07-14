import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoIcon } from "lucide-react";

interface PolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthRequired?: () => void;
}

const categories = [
  { value: "welfare", label: "복지" },
  { value: "economy", label: "경제" },
  { value: "agriculture", label: "농업" },
  { value: "infrastructure", label: "인프라" },
  { value: "tourism", label: "관광" },
  { value: "population", label: "인구유입" },
  { value: "administration", label: "행정" },
  { value: "ai", label: "인공지능" },
  { value: "committee", label: "기본사회위원회" },
  { value: "allowance", label: "기본수당" },
];

export default function PolicyModal({ open, onOpenChange, onAuthRequired }: PolicyModalProps) {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery({
    queryKey: ["/api/me"],
    retry: false,
  });

  const createPolicyMutation = useMutation({
    mutationFn: async (data: { category: string; title: string; content: string }) => {
      const response = await apiRequest("POST", "/api/policies", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "정책 제안 완료",
        description: "정책 제안이 성공적으로 등록되었습니다!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/policies/all"] });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("Policy creation error:", error);
      
      // Check if it's an authentication error
      if (error.message?.includes('401')) {
        onAuthRequired?.();
        return;
      }
      
      toast({
        title: "잠시만요",
        description: "정책 제안이 저장되지 않았습니다. 인터넷 연결을 확인하고 다시 시도해주세요.",
        variant: "default",
      });
    },
  });

  const resetForm = () => {
    setCategory("");
    setTitle("");
    setContent("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !title.trim() || !content.trim()) {
      toast({
        title: "입력 확인",
        description: "카테고리, 제목, 내용을 모두 작성해주시면 정책 제안이 완료됩니다.",
        variant: "default",
      });
      return;
    }

    // Check authentication before submitting
    if (!user) {
      onAuthRequired?.();
      return;
    }

    createPolicyMutation.mutate({ category, title: title.trim(), content: content.trim() });
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">새 정책 제안</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category">카테고리 선택</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="정책 제안 제목을 입력하세요"
              className="mt-1 text-lg py-3"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="정책 제안의 구체적인 내용을 작성해주세요..."
              className="mt-1 text-lg py-3 min-h-[150px] resize-none"
              required
            />
          </div>
          

          
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={createPolicyMutation.isPending}
              className="flex-1"
            >
              {createPolicyMutation.isPending ? "제안 중..." : "제안하기"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
