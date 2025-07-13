import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Lightbulb, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onSectionChange: (section: string) => void;
}

export default function HeroSection({ onSectionChange }: HeroSectionProps) {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            445억 원 혈세 폭탄을 막아주세요!
          </h2>
          <p className="text-lg sm:text-xl mb-6 opacity-90">
            군민 1인당 178만원, 4인 가족 기준 712만원의 부담
          </p>
          
          {/* 바로가기 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={() => onSectionChange("signature")}
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <PenTool className="h-5 w-5 mr-2" />
              서명 바로가기
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button
              onClick={() => onSectionChange("policies")}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-700 font-bold px-8 py-4 text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Lightbulb className="h-5 w-5 mr-2" />
              정책제안 바로가기
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <Card className="bg-white bg-opacity-20 backdrop-blur-sm p-6 text-center border-0">
              <div className="text-2xl sm:text-3xl font-bold">
                {stats?.stats.signatureCount.toLocaleString() || '0'}
              </div>
              <div className="text-sm opacity-90">서명 참여자</div>
            </Card>
            
            <Card className="bg-white bg-opacity-20 backdrop-blur-sm p-6 text-center border-0">
              <div className="text-2xl sm:text-3xl font-bold">
                {stats?.stats.policyCount.toLocaleString() || '0'}
              </div>
              <div className="text-sm opacity-90">정책 제안</div>
            </Card>
            
            <Card className="bg-white bg-opacity-20 backdrop-blur-sm p-6 text-center border-0">
              <div className="text-2xl sm:text-3xl font-bold">89%</div>
              <div className="text-sm opacity-90">반대 지지율</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
