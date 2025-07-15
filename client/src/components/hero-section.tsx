import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Lightbulb, ArrowRight, BarChart3 } from "lucide-react";
import { useContentText } from "@/hooks/useWebContent";

interface HeroSectionProps {
  onSectionChange: (section: string) => void;
}

export default function HeroSection({ onSectionChange }: HeroSectionProps) {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  // Get content from database
  const mainTitle = useContentText("hero", "main_title", "진안군 목조전망대 건설 반대");
  const subtitle = useContentText("hero", "subtitle", "자연을 지키고 미래를 생각하는 선택");
  const description = useContentText("hero", "description", "지방자치법 위반 우려로 추진되는 445억원 규모의 목조전망대 건설을 반대합니다.");

  const handleButtonClick = (section: string) => {
    console.log(`Hero button clicked: ${section}`);
    onSectionChange(section);
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            {mainTitle}
          </h2>
          <p className="text-lg sm:text-xl mb-6 opacity-90">
            {subtitle}
          </p>
          <div className="max-w-2xl mx-auto mb-6">
            <p className="text-base opacity-90">
              {description}
            </p>
          </div>
          
          {/* 바로가기 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={() => handleButtonClick("signature")}
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 text-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <PenTool className="h-5 w-5 mr-2" />
              서명 바로가기
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button
              onClick={() => handleButtonClick("survey")}
              size="lg"
              variant="outline"
              className="border-white border-2 text-blue-700 hover:bg-white hover:text-blue-800 font-bold px-8 py-4 text-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              여론조사 참여
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button
              onClick={() => handleButtonClick("policies")}
              size="lg"
              variant="outline"
              className="border-white border-2 text-green-800 hover:bg-white hover:text-green-900 font-bold px-8 py-4 text-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
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
