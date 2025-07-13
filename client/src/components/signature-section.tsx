import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PenTool, CheckCircle, Gavel, Bus, Users } from "lucide-react";
import AuthModal from "./auth-modal";

export default function SignatureSection() {
  const { data: auth } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: signatureCheck, isLoading: checkLoading } = useQuery({
    queryKey: ["/api/signatures/check"],
    enabled: !!auth?.user,
  });

  const signatureMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/signatures");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "서명 완료",
        description: "서명이 완료되었습니다. 참여해 주셔서 감사합니다!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/signatures/check"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error: any) => {
      if (error.message.includes("Already signed")) {
        toast({
          title: "이미 서명하셨습니다",
          description: "한 번만 서명할 수 있습니다.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "서명 실패",
          description: "서명 중 오류가 발생했습니다. 다시 시도해주세요.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSignature = () => {
    if (!auth?.user) {
      setShowAuthModal(true);
      return;
    }
    signatureMutation.mutate();
  };

  const signatureCount = stats?.stats.signatureCount || 0;
  const target = 15000;
  const progress = Math.min((signatureCount / target) * 100, 100);
  const hasSigned = signatureCheck?.hasSigned || false;

  return (
    <>
      <section>
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">서명 운동</h3>
          
          {/* 서명 진행 현황 */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">서명 참여 현황</h4>
                <span className="text-2xl font-bold text-primary">
                  {signatureCount.toLocaleString()}명
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>진행률</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="text-xs text-gray-500 mt-1">목표: {target.toLocaleString()}명</div>
              </div>
            </CardContent>
          </Card>

          {/* 서명 이유 및 설득 콘텐츠 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    🛑 이것은 민주주의입니까, 독재입니까?
                  </h4>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-red-100 rounded-full p-2 mr-4 mt-1">
                        <Gavel className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">의회, 사업에 강한 반대 의견 표명</h5>
                        <p className="text-gray-700">
                          295회 군의회에서 용역비 집행을 사업추진의 기본적인 타당성 확보 이후로 조건부 부결
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-red-100 rounded-full p-2 mr-4 mt-1">
                        <Bus className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">군수, 독단 강행</h5>
                        <p className="text-gray-700">
                          의회의 반대 의견을 무릅쓰고 집행부 pool 예산을 사용하여 사업 강행<br />
                          지방자치법 제 55조를 위반하여 안건을 군의회에 사전 제출하지 않음
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-red-100 rounded-full p-2 mr-4 mt-1">
                        <Users className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">군민 대표권 훼손</h5>
                        <p className="text-gray-700">
                          형식적인 설문조사, 공청회 진행을 통한 민주적 절차 무시 및 의회 권한 침해<br />
                          향후 이런 독재적 행정이 반복될 수 있음
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">💸 445억 원 부담</h4>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">178만원</div>
                      <div className="text-sm text-gray-600">군민 1인당 부담</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">712만원</div>
                      <div className="text-sm text-gray-600">4인 가족 기준</div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      진안군 인구 25,000명 기준
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 서명 참여 버튼 */}
          <Card>
            <CardContent className="p-6 text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-2">목조전망대 건설 반대 서명</h4>
              <p className="text-gray-600 mb-6">군민의 소중한 한 표로 민주주의를 지켜주세요</p>
              
              {hasSigned ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <span className="text-green-800 font-medium">서명이 완료되었습니다. 참여해 주셔서 감사합니다!</span>
                </div>
              ) : (
                <Button
                  onClick={handleSignature}
                  disabled={signatureMutation.isPending || checkLoading}
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-bold shadow-lg"
                >
                  <PenTool className="h-5 w-5 mr-2" />
                  {signatureMutation.isPending ? "서명 처리 중..." : "서명 참여하기"}
                </Button>
              )}
              
              <p className="text-xs text-gray-500 mt-4">* 1인 1회만 참여 가능하며, 실명 인증이 필요합니다</p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
}
