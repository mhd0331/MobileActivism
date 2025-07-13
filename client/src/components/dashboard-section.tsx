import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Lightbulb, Heart, Eye, TrendingUp } from "lucide-react";

export default function DashboardSection() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  const statsData = stats?.stats || {
    signatureCount: 0,
    policyCount: 0,
    supportCount: 0,
    userCount: 0,
  };

  // Mock data for additional metrics (in a real app, these would come from the API)
  const additionalStats = {
    todaySignatures: 156,
    weeklyPolicies: 8,
    todaySupports: 67,
    todayViews: 523,
    totalViews: 45892,
  };

  // Mock timeline data
  const timeline = [
    {
      id: 1,
      title: "서명 1만명 돌파",
      date: "2024.03.13",
      description: "목표의 66.7% 달성으로 군민들의 높은 관심 확인",
      type: "success",
    },
    {
      id: 2,
      title: "앱 정식 출시",
      date: "2024.03.10",
      description: "군민 캠페인 참여 플랫폼 공식 오픈",
      type: "info",
    },
    {
      id: 3,
      title: "295회 군의회 조건부 부결",
      date: "2024.03.08",
      description: "의회에서 사업 타당성 재검토 요구",
      type: "warning",
    },
  ];

  // Mock regional data
  const regions = [
    { name: "진안읍", count: 3247, percentage: 25.3 },
    { name: "마령면", count: 2156, percentage: 16.8 },
    { name: "부귀면", count: 1894, percentage: 14.7 },
    { name: "기타 지역", count: 5550, percentage: 43.2 },
  ];

  return (
    <section>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">캠페인 진행 현황</h3>
        
        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">
                {statsData.signatureCount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">총 서명자</div>
              <div className="text-xs text-green-600 mt-1">
                +{additionalStats.todaySignatures} (오늘)
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">
                {statsData.policyCount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">정책 제안</div>
              <div className="text-xs text-green-600 mt-1">
                +{additionalStats.weeklyPolicies} (이주)
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">
                {statsData.supportCount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">정책 찬성</div>
              <div className="text-xs text-green-600 mt-1">
                +{additionalStats.todaySupports} (오늘)
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">
                {additionalStats.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">앱 방문자</div>
              <div className="text-xs text-green-600 mt-1">
                +{additionalStats.todayViews} (오늘)
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 타임라인 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              캠페인 주요 이정표
            </h4>
            
            <div className="space-y-4">
              {timeline.map((item) => (
                <div key={item.id} className="flex items-start">
                  <div 
                    className={`rounded-full w-3 h-3 mt-2 mr-4 ${
                      item.type === 'success' ? 'bg-green-500' :
                      item.type === 'warning' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium text-gray-900">{item.title}</h5>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 지역별 참여 현황 */}
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">지역별 참여 현황</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regions.map((region) => (
                <div key={region.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{region.name}</span>
                    <span className="text-sm text-gray-600">{region.count.toLocaleString()}명</span>
                  </div>
                  <Progress value={region.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
