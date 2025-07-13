import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, DollarSign, TrendingDown, Scale, Users, Clock } from "lucide-react";

export default function MotivationSection() {
  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            왜 서명해야 할까요?
          </h3>
          <p className="text-lg text-gray-600">
            민주주의와 군민의 권익을 지키기 위한 세 가지 핵심 이유
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 민주주의 위기 */}
          <Card className="border-l-4 border-red-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 rounded-full p-3 mr-4">
                  <Scale className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <Badge variant="destructive" className="mb-2">긴급</Badge>
                  <h4 className="text-xl font-bold text-gray-900">민주주의 위기</h4>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800">의회 권한 무시</p>
                    <p className="text-gray-700 text-sm">295회 군의회 조건부 부결 무시</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800">지방자치법 위반</p>
                    <p className="text-gray-700 text-sm">제55조 사전 공고 절차 무시</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800">독단적 행정</p>
                    <p className="text-gray-700 text-sm">군민 의견 수렴 절차 형식화</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 혈세 폭탄 */}
          <Card className="border-l-4 border-orange-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="bg-orange-100 rounded-full p-3 mr-4">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <Badge className="bg-orange-100 text-orange-800 mb-2">경제적 부담</Badge>
                  <h4 className="text-xl font-bold text-gray-900">445억 혈세 폭탄</h4>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">178만원</div>
                    <div className="text-sm text-gray-600">군민 1인당 부담액</div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">712만원</div>
                    <div className="text-sm text-gray-600">4인 가족 기준 부담</div>
                  </div>
                </div>
                
                <div className="text-center text-xs text-gray-500">
                  <Users className="h-4 w-4 inline mr-1" />
                  진안군 인구 25,000명 기준
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
                  <h4 className="text-xl font-bold text-gray-900">또 실패하면?</h4>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-800">과거: 마이산 케이블카</p>
                    <p className="text-gray-700 text-sm">29억원 손실 사업</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <TrendingDown className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-800">현재: 전망대 강행</p>
                    <p className="text-gray-700 text-sm">445억원 위험 투자</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-800">미래: 더 큰 부담?</p>
                    <p className="text-gray-700 text-sm">지속적인 적자 운영 우려</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 민주주의 붕괴 과정 인포그래픽 */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0">
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