import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ThumbsUp, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import AuthModal from "./auth-modal";
import PolicyModal from "./policy-modal";

const categoryLabels: Record<string, string> = {
  welfare: "복지",
  economy: "경제", 
  agriculture: "농업",
  infrastructure: "인프라",
  tourism: "관광",
  population: "인구유입",
  administration: "행정",
  ai: "인공지능",
  committee: "기본사회위원회",
  allowance: "기본수당",
};

const categoryColors: Record<string, string> = {
  welfare: "bg-green-100 text-green-800",
  economy: "bg-blue-100 text-blue-800",
  agriculture: "bg-yellow-100 text-yellow-800",
  infrastructure: "bg-purple-100 text-purple-800",
  tourism: "bg-pink-100 text-pink-800",
  population: "bg-indigo-100 text-indigo-800",
  administration: "bg-gray-100 text-gray-800",
  ai: "bg-cyan-100 text-cyan-800",
  committee: "bg-orange-100 text-orange-800",
  allowance: "bg-lime-100 text-lime-800",
};

export default function PoliciesSection() {
  const { data: auth } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const { data: policies, isLoading } = useQuery({
    queryKey: ["/api/policies/all"],
  });

  const supportMutation = useMutation({
    mutationFn: async (policyId: number) => {
      const response = await apiRequest("POST", `/api/policies/${policyId}/support`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "정책 찬성",
        description: "정책에 찬성하셨습니다. 참여해 주셔서 감사합니다!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
    },
    onError: (error: any) => {
      if (error.message.includes("Already supported")) {
        toast({
          title: "이미 찬성하셨습니다",
          description: "한 정책에 한 번만 찬성할 수 있습니다.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "찬성 실패",
          description: "찬성 처리 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSupport = (policyId: number) => {
    if (!auth?.user) {
      setShowAuthModal(true);
      return;
    }
    supportMutation.mutate(policyId);
  };

  const handleNewPolicy = () => {
    setShowPolicyModal(true);
  };



  return (
    <>
      <section>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">정책 제안</h3>
            <Button onClick={handleNewPolicy}>
              <Plus className="h-4 w-4 mr-2" />
              새 제안 작성
            </Button>
          </div>

          {/* 정책 제안 목록 */}
          {isLoading ? (
            <div>로딩 중...</div>
          ) : (
            <div className="space-y-4">
              {policies?.policies?.map((policy: any) => (
                <Card key={policy.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Badge className={categoryColors[policy.category] || "bg-gray-100 text-gray-800"}>
                            {categoryLabels[policy.category] || policy.category}
                          </Badge>
                          <span className="text-xs text-gray-500 ml-2">
                            {format(new Date(policy.createdAt), 'yyyy.MM.dd')}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{policy.title}</h4>
                        <p className="text-gray-700 mb-3 line-clamp-3">{policy.content}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSupport(policy.id)}
                        disabled={supportMutation.isPending}
                        className="text-green-700 border-green-200 hover:bg-green-50"
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        찬성 {policy.supportCount}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) || []}

              {(!policies?.policies || policies.policies.length === 0) && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">등록된 정책 제안이 없습니다.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>
      
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onSuccess={() => {
          // Reopen policy modal after successful login
          setTimeout(() => {
            setShowPolicyModal(true);
          }, 100);
        }}
      />
      <PolicyModal 
        open={showPolicyModal} 
        onOpenChange={setShowPolicyModal}
        onAuthRequired={() => {
          setShowPolicyModal(false);
          setShowAuthModal(true);
        }}
      />
    </>
  );
}
