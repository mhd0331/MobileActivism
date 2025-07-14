import { AlertTriangle, DollarSign, TrendingDown, Scale, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useContentText } from "@/hooks/useWebContent";

export default function MotivationSection() {
  // 섹션 제목과 부제목
  const sectionTitle = useContentText("motivation", "section_title", "왜 전망대 건설을 반대해야 할까요?");
  const sectionSubtitle = useContentText("motivation", "section_subtitle", "진안군민의 미래를 위한 합리적 선택이 필요합니다");

  // 민주주의 위기 카드 콘텐츠
  const democracyCrisisTitle = useContentText("motivation", "democracy_crisis_title", "민주주의 위기");
  const democracyCrisisSubtitle = useContentText("motivation", "democracy_crisis_subtitle", "🚨 이것은 민주주의입니까?");
  const democracyPoint1Title = useContentText("motivation", "democracy_point1_title", "의회, 사업 반대");
  const democracyPoint1Content = useContentText("motivation", "democracy_point1_content", "295회 군의회에서 용역비 집행을 사업추진의 기본적인 타당성 확보 이후로 조건부 부결");
  const democracyPoint2Title = useContentText("motivation", "democracy_point2_title", "군수, 독단 강행");
  const democracyPoint2Content = useContentText("motivation", "democracy_point2_content", "의회의 반대 의견을 무릅쓰고 집행부 pool 예산을 사용하여 사업 강행\n지방자치법 제 55조를 위반하여 안건을 군의회에 사전 제출하지 않음");
  const democracyPoint3Title = useContentText("motivation", "democracy_point3_title", "군민 대표권 훼손");
  const democracyPoint3Content = useContentText("motivation", "democracy_point3_content", "형식적인 설문조사, 공청회 진행을 통한 민주적 절차 무시 및 의회 권한 침해.\n지방자치법 제 55조를 위반에 대한 군민과 군의회에 사과하지 않고 오히려 정당성 주장\n향후 이런 독재적 행정이 반복될 수 있음.");

  // 예산 낭비 카드 콘텐츠
  const budgetWasteTitle = useContentText("motivation", "budget_waste_title", "예산 낭비");
  const budgetWasteSubtitle = useContentText("motivation", "budget_waste_subtitle", "💰 130억원의 무책임한 낭비");
  const budgetPersonAmount = useContentText("motivation", "budget_person_amount", "178만원");
  const budgetPersonLabel = useContentText("motivation", "budget_person_label", "군민 1인당 부담액");
  const budgetFamilyAmount = useContentText("motivation", "budget_family_amount", "712만원");
  const budgetFamilyLabel = useContentText("motivation", "budget_family_label", "4인 가족 기준 부담");
  const budgetPopulation = useContentText("motivation", "budget_population", "진안군 인구 25,000명 기준");

  // 실패 위험 카드 콘텐츠
  const environmentTitle = useContentText("motivation", "environment_title", "또 실패하면?");
  const failurePastTitle = useContentText("motivation", "failure_past_title", "과거: 마이산 케이블카");
  const failurePastContent = useContentText("motivation", "failure_past_content", "29억원 손실 사업");
  const failurePresentTitle = useContentText("motivation", "failure_present_title", "현재: 전망대 강행");
  const failurePresentContent = useContentText("motivation", "failure_present_content", "445억원 위험 투자");
  const failureFutureTitle = useContentText("motivation", "failure_future_title", "미래: 더 큰 부담?");
  const failureFutureContent = useContentText("motivation", "failure_future_content", "지속적인 적자 운영 우려");

  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h3>
          <p className="text-lg text-gray-600">
            {sectionSubtitle}
          </p>
        </div>

        <div className="space-y-8">
          {/* 민주주의 위기 - 큰 화면에서 전체 폭 사용 */}
          <div className="w-full">
            <Card className="border-l-4 border-red-500 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 rounded-full p-3 mr-4">
                    <Scale className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <Badge variant="destructive" className="mb-2">긴급</Badge>
                    <h4 className="text-xl font-bold text-gray-900">{democracyCrisisTitle}</h4>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h5 className="text-xl font-bold text-red-800 mb-2">{democracyCrisisSubtitle}</h5>
                </div>
                
                {/* 큰 화면에서는 3개 포인트를 가로로 배치 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-start">
                      <div className="bg-red-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <p className="font-bold text-red-800 mb-2">{democracyPoint1Title}</p>
                        <p className="text-gray-700 text-sm">{democracyPoint1Content}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-start">
                      <div className="bg-red-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="font-bold text-red-800 mb-2">{democracyPoint2Title}</p>
                        {democracyPoint2Content.split('\n').map((line, idx) => (
                          <p key={idx} className="text-gray-700 text-sm mb-2">{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-start">
                      <div className="bg-red-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-red-600 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <p className="font-bold text-red-800 mb-2">{democracyPoint3Title}</p>
                        {democracyPoint3Content.split('\n').map((line, idx) => (
                          <p key={idx} className={`text-gray-700 text-sm mb-2 ${idx === 2 ? 'font-semibold text-red-700' : ''}`}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 예산낭비와 실패위험 - 큰 화면에서 좌우 배치, 작은 화면에서 세로 배치 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 혈세 폭탄 */}
            <Card className="border-l-4 border-orange-500 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-orange-100 rounded-full p-3 mr-4">
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <Badge className="bg-orange-100 text-orange-800 mb-2">경제적 부담</Badge>
                    <h4 className="text-xl font-bold text-gray-900">{budgetWasteTitle}</h4>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{budgetPersonAmount}</div>
                      <div className="text-sm text-gray-600">{budgetPersonLabel}</div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{budgetFamilyAmount}</div>
                      <div className="text-sm text-gray-600">{budgetFamilyLabel}</div>
                    </div>
                  </div>
                  
                  <div className="text-center text-xs text-gray-500">
                    <Users className="h-4 w-4 inline mr-1" />
                    {budgetPopulation}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 실패 위험성 */}
            <Card className="border-l-4 border-yellow-500 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-yellow-100 rounded-full p-3 mr-4">
                    <TrendingDown className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <Badge className="bg-yellow-100 text-yellow-800 mb-2">위험 경고</Badge>
                    <h4 className="text-xl font-bold text-gray-900">{environmentTitle}</h4>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-800">{failurePastTitle}</p>
                      <p className="text-gray-700 text-sm">{failurePastContent}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <TrendingDown className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-800">{failurePresentTitle}</p>
                      <p className="text-gray-700 text-sm">{failurePresentContent}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-800">{failureFutureTitle}</p>
                      <p className="text-gray-700 text-sm">{failureFutureContent}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 민주주의 붕괴 과정 인포그래픽 */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 mt-8">
          <CardContent className="p-8">
            <h4 className="text-2xl font-bold text-center text-gray-900 mb-8">
              📉 민주주의 붕괴의 과정
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h5 className="font-semibold text-green-800 mb-2">의회 정상 기능</h5>
                <p className="text-sm text-gray-600">군민 대표의 정당한 심의 결과</p>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-600">2</span>
                </div>
                <h5 className="font-semibold text-yellow-800 mb-2">집행부 독단</h5>
                <p className="text-sm text-gray-600">의회 결정 무시, 위법 소지 지적</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">3</span>
                </div>
                <h5 className="font-semibold text-orange-800 mb-2">3:2 표결 통과</h5>
                <p className="text-sm text-gray-600">논란 끝에 소수 의견으로 강행</p>
              </div>
              
              <div className="text-center">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-red-600">4</span>
                </div>
                <h5 className="font-semibold text-red-800 mb-2">지방 독재화</h5>
                <p className="text-sm text-gray-600">권위적 행정 반복 → 군민의 힘으로만 교정 가능</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}