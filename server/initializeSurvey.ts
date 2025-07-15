import { storage } from "./storage";

export async function initializeSurvey() {
  console.log("Setting up survey data...");
  
  // Create the main survey
  const survey = await storage.createSurvey({
    title: "지방자치단체 대규모 프로젝트 여론조사",
    description: "존경하는 군민 여러분, 우리 지방자치단체는 대규모 프로젝트 추진에 앞서 군민 여러분의 소중한 의견을 듣고자 합니다. 본 설문조사는 향후 여론조사의 신뢰성과 효율성을 높이는 방안을 모색하고, 더 나아가 군민 여러분의 참여를 확대하기 위한 중요한 자료로 활용될 것입니다. 잠시 시간을 내어 솔직하고 성의 있는 답변을 부탁드립니다.",
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  });

  // Create survey questions - 8 questions total, based on provided document
  const questions = [
    {
      questionText: "최근 휴대폰이나 컴퓨터를 통한 대규모 여론조사 방식이 기존 방식(예: 전화, 대면 조사)보다 여론조사의 신뢰성을 높이는 데 도움이 된다고 생각하십니까?",
      questionType: "single",
      options: ["예 (찬성)", "아니오 (반대)"],
      orderIndex: 1,
      isRequired: true
    },
    {
      questionText: "휴대폰이나 컴퓨터 기반 여론조사 시, 군민 여러분이 가장 선호하는 조사 방법은 무엇입니까?",
      questionType: "single",
      options: [
        "개인 휴대폰 앱을 통한 참여",
        "웹사이트(PC/모바일)를 통한 참여",
        "마을별 공공장소에 설치된 키오스크를 통한 참여",
        "기타 방법"
      ],
      orderIndex: 2,
      isRequired: true,
      conditions: { showIf: { questionId: 1, answer: "예 (찬성)" } }
    },
    {
      questionText: "대규모 프로젝트 여론조사의 적정 참여 규모는 어느 정도라고 생각하십니까?",
      questionType: "single",
      options: [
        "전체 군민의 10% 미만",
        "전체 군민의 10% ~ 30%",
        "전체 군민의 30% ~ 50%",
        "전체 군민의 50% 이상",
        "중요도에 따라 유동적"
      ],
      orderIndex: 3,
      isRequired: true,
      conditions: { showIf: { questionId: 1, answer: "예 (찬성)" } }
    },
    {
      questionText: "개인 휴대폰 앱을 통한 여론조사 참여 시, 어떤 기능이 추가되면 더 편리하고 신뢰할 수 있을 것이라고 생각하십니까? (여러 개 선택 가능)",
      questionType: "multiple",
      options: [
        "본인 인증 강화 (휴대폰 본인 인증, 공공 아이디 연동)",
        "설문 진행 상황 및 결과 실시간 확인 기능",
        "알림 기능 (설문 시작, 마감 임박 등)",
        "설문 참여에 대한 인센티브 제공 (포인트, 상품권)",
        "기타"
      ],
      orderIndex: 4,
      isRequired: false,
      conditions: { showIf: { questionId: 1, answer: "예 (찬성)" } }
    },
    {
      questionText: "여론조사 결과는 어떤 방식으로 공개되는 것이 가장 투명하고 신뢰도를 높일 수 있다고 생각하십니까?",
      questionType: "single",
      options: [
        "지방자치단체 홈페이지에 공개",
        "언론 보도를 통해 공개",
        "휴대폰 앱이나 웹사이트 내에서 실시간으로 공개",
        "공청회 등 오프라인 행사에서 직접 설명",
        "기타 방법"
      ],
      orderIndex: 5,
      isRequired: true,
      conditions: { showIf: { questionId: 1, answer: "예 (찬성)" } }
    },
    {
      questionText: "휴대폰이나 컴퓨터 기반 대규모 여론조사가 신뢰성 제고에 도움이 되지 않는다고 생각하시는 주된 이유는 무엇입니까? (여러 개 선택 가능)",
      questionType: "multiple",
      options: [
        "디지털 기기 사용에 익숙하지 않은 군민들의 참여율 저조 (디지털 격차)",
        "특정 연령대 또는 계층에 편중된 참여로 인한 대표성 부족",
        "중복 참여 등 조작 가능성에 대한 우려",
        "개인 정보 유출 및 보안 문제에 대한 우려",
        "설문 문항의 이해도 부족 또는 오해 가능성",
        "기타"
      ],
      orderIndex: 6,
      isRequired: true,
      conditions: { showIf: { questionId: 1, answer: "아니오 (반대)" } }
    },
    {
      questionText: "디지털 격차로 인해 휴대폰이나 컴퓨터 기반 여론조사 참여가 어려운 군민들을 위한 해소 방안으로 어떤 것이 필요하다고 생각하십니까? (여러 개 선택 가능)",
      questionType: "multiple",
      options: [
        "마을회관, 경로당 등 공공장소에 키오스크 설치 및 사용법 안내",
        "디지털 교육 프로그램 확대 및 찾아가는 서비스 제공",
        "오프라인(전화, 대면) 조사와의 병행 확대",
        "디지털 기기 대여 또는 지원",
        "기타"
      ],
      orderIndex: 7,
      isRequired: false,
      conditions: { showIf: { questionId: 1, answer: "아니오 (반대)" } }
    },
    {
      questionText: "군민들의 여론조사 참여율을 높이기 위한 효과적인 방안은 무엇이라고 생각하십니까? (여러 개 선택 가능)",
      questionType: "multiple",
      options: [
        "여론조사 결과가 실제 정책에 반영되는 것을 명확히 보여주기",
        "설문 참여에 대한 적절한 인센티브 제공 (소액 상품권, 지역 화폐)",
        "여론조사 홍보 강화 (다양한 매체 활용)",
        "설문 참여 절차 간소화",
        "찾아가는 설문 조사 (이동식 부스 운영 등)",
        "기타"
      ],
      orderIndex: 8,
      isRequired: false
    }
  ];

  // Insert all questions
  for (const questionData of questions) {
    await storage.createSurveyQuestion({
      surveyId: survey.id,
      ...questionData
    });
  }

  console.log("Survey initialized successfully!");
  console.log(`Survey ID: ${survey.id}, Title: ${survey.title}`);
}